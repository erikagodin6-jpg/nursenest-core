import type { LessonContent } from "./types";

export const generatedBatch088Lessons: Record<string, LessonContent> = {
  "secondary-survey-rn": {
    title: "Secondary Survey: Head-to-Toe Trauma",
    cellular: { title: "Secondary Survey in Trauma Assessment", content: "The secondary survey is a systematic head-to-toe evaluation performed AFTER the primary survey (ABCDE) has been completed and life-threatening conditions have been addressed. The primary survey follows the ATLS sequence: Airway (with cervical spine protection), Breathing, Circulation (hemorrhage control), Disability (neurological status), and Exposure/Environment. Only after the patient is stabilized does the secondary survey begin. The secondary survey includes: a complete history (AMPLE: Allergies, Medications, Past medical history, Last meal, Events/environment related to the injury), complete physical examination from head to toe, and appropriate diagnostic studies. Each body region is systematically inspected, palpated, and assessed: head (scalp lacerations, skull depressions, Battle sign, raccoon eyes, CSF otorrhea/rhinorrhea), face (midface stability, dental injuries, ocular injuries), cervical spine (tenderness, step-off deformity), chest (rib fractures, flail segment, crepitus, pneumothorax), abdomen (distension, rigidity, tenderness, seatbelt sign), pelvis (instability — compress ONCE only), extremities (deformity, pulses, sensation, compartment syndrome), back (logroll examination for spinal tenderness, flank ecchymosis), and neurological (detailed GCS, pupil reactivity, motor/sensory exam). Missed injuries are a leading cause of preventable trauma death — the secondary survey is designed to identify these injuries before they become life-threatening." },
    riskFactors: ["Multi-system trauma with distracting injuries (pain from one injury masks another)","Altered level of consciousness (intoxication, TBI) impairing patient's ability to report symptoms","Mechanism of injury suggesting high-energy transfer (MVC >40 mph, falls >20 feet, pedestrian struck)","Extremes of age (children and elderly have atypical injury patterns)","Anticoagulant use (increases hemorrhage risk from minor injuries)","Incomplete or rushed primary survey leading to missed life threats","Failure to logroll and examine the back","Inadequate monitoring during and after the survey"],
    diagnostics: ["FAST exam (Focused Assessment with Sonography for Trauma): detects free fluid in Morison pouch, splenorenal recess, pelvis, and pericardium","CT head for altered mental status or suspected TBI","CT cervical spine to rule out fracture","Chest X-ray: pneumothorax, hemothorax, rib fractures, widened mediastinum","Pelvic X-ray: fractures (if not already done in primary survey)","CT abdomen/pelvis with IV contrast for abdominal/pelvic injury evaluation","Extremity X-rays for suspected fractures","Secondary labs: type and crossmatch, coagulation studies, lactate, blood alcohol, urine drug screen","Urinalysis: hematuria suggests genitourinary injury"],
    management: ["Complete AMPLE history from patient, family, or EMS","Perform systematic head-to-toe examination with complete exposure (maintain temperature)","Identify and treat all injuries found during secondary survey","Prioritize injuries by severity and address in order of threat to life","Splint fractures, dress wounds, and provide tetanus prophylaxis as indicated","Reassess primary survey findings — the primary survey must be repeated if the patient deteriorates","Insert gastric tube and urinary catheter if not contraindicated","Arrange definitive imaging and specialty consultations based on findings","Plan for definitive care: OR for surgical injuries, ICU for monitoring, transfer to trauma center if needed"],
    nursingActions: ["Assist with systematic head-to-toe assessment, documenting all findings","Remove all clothing for complete exposure while maintaining body temperature with warm blankets and warmed IV fluids","Logroll the patient with cervical spine precautions to examine the entire back","Monitor vital signs continuously during the secondary survey","Document all injuries on a trauma flow sheet with body diagrams","Prepare the patient for diagnostic imaging (portable CXR, FAST, CT)","Maintain at least two large-bore IV lines with warmed crystalloid or blood products running","Monitor urine output via Foley catheter (goal: adults 0.5 mL/kg/hr, children 1 mL/kg/hr)","Collect and label forensic specimens if mechanism involves violence"],
    assessmentFindings: ["Head: scalp lacerations, palpable skull defects, Battle sign (mastoid ecchymosis — basilar skull fracture), raccoon eyes (periorbital ecchymosis)","Face: midface instability (Le Fort fracture), dental injuries, eye injuries (hyphema, lens dislocation)","Neck: cervical spine tenderness, tracheal deviation, JVD, subcutaneous emphysema","Chest: paradoxical movement (flail chest), decreased breath sounds (pneumo/hemothorax), crepitus","Abdomen: distension, rigidity, rebound tenderness, seatbelt sign (contusion from lap belt — suggests hollow viscus injury)","Pelvis: instability on gentle compression (fracture — do NOT repeatedly compress)","Extremities: deformity, distal pulse status, compartment syndrome signs (pain out of proportion, pain with passive stretch)","Back: step-off deformity of spine, flank ecchymosis (Grey Turner sign — retroperitoneal hemorrhage)"],
    signs: {
      left: ["Isolated minor injuries identified and managed","Hemodynamically stable throughout survey","No missed injuries on repeat assessment","Complete documentation of all findings","All imaging completed without new significant findings"],
      right: ["Expanding hematoma or ongoing hemorrhage discovered","Missed injury identified on repeat survey (delayed presentation)","Tension pneumothorax developing during survey (immediate decompression needed)","Compartment syndrome developing in injured extremity","Neurological deterioration (expanding intracranial hemorrhage)","Unstable pelvic fracture with hemodynamic instability"]
    },
    medications: [{
      name: "Tranexamic Acid (TXA)",
      type: "Antifibrinolytic agent",
      action: "Inhibits plasminogen activation, preventing fibrin clot breakdown (fibrinolysis); reduces bleeding and mortality in trauma patients when given within 3 hours of injury",
      sideEffects: "Nausea, diarrhea, thromboembolic events (rare), seizures (with high doses)",
      contra: "Active intravascular clotting (relative), subarachnoid hemorrhage, >3 hours from injury (CRASH-2 trial showed harm when given late)",
      pearl: "CRASH-2 trial: 1g IV over 10 minutes followed by 1g IV over 8 hours; must be given within 3 HOURS of injury — after 3 hours, TXA increases mortality; reduces death from hemorrhage by approximately 30% when given early"
    }],
    pearls: ["The secondary survey NEVER begins until the primary survey (ABCDE) is complete and life threats are addressed","AMPLE history: Allergies, Medications, Past medical history, Last meal, Events — this is obtained during the secondary survey","Log roll the patient to examine the entire back — posterior injuries are commonly missed if the back is not examined","Compress the pelvis ONCE only — repeated compression can worsen hemorrhage from an unstable pelvic fracture","The seatbelt sign (bruising across the abdomen from a lap belt) has a high association with hollow viscus injury and mesenteric injury","Hypothermia, acidosis, and coagulopathy form the 'lethal triad' of trauma — prevent hypothermia during exposure by using warm blankets and warmed IV fluids","If the patient deteriorates during the secondary survey, STOP and repeat the primary survey (ABCDE)"],
    quiz: [
      {
        question: "During the secondary survey of a trauma patient, the nurse notes ecchymosis behind the ears (Battle sign). What does this finding suggest?",
        options: ["Liver laceration","Basilar skull fracture","Pulmonary contusion","Cervical spine fracture"],
        correct: 1,
        rationale: "Battle sign (mastoid ecchymosis behind the ears) is a classic late sign of basilar skull fracture. Other signs include raccoon eyes (periorbital ecchymosis), CSF otorrhea, and CSF rhinorrhea."
      },
      {
        question: "When should the secondary survey be performed in trauma assessment?",
        options: ["Immediately upon patient arrival, before anything else","After the primary survey (ABCDE) is complete and life-threatening conditions are stabilized","Only if the patient requests a full examination","After all diagnostic imaging is complete"],
        correct: 1,
        rationale: "The secondary survey is performed ONLY after the primary survey has been completed and all life-threatening conditions have been identified and treated. If the patient deteriorates during the secondary survey, return to the primary survey."
      },
      {
        question: "A trauma patient has a bruise across the lower abdomen from a seatbelt. What injury should the nurse be most concerned about?",
        options: ["Superficial skin injury only","Hollow viscus (intestinal) injury or mesenteric tear","Rib fractures","Pulmonary embolism"],
        correct: 1,
        rationale: "The seatbelt sign is strongly associated with intra-abdominal injuries, particularly hollow viscus injuries (small bowel perforation) and mesenteric tears. CT abdomen with contrast is warranted."
      },
    ]
  },
  "sedation-np": {
    title: "Procedural Sedation",
    cellular: { title: "Sedation Pharmacology and Monitoring", content: "Procedural sedation is the administration of sedative, analgesic, and/or dissociative agents to induce a state that allows the patient to tolerate unpleasant procedures while maintaining cardiorespiratory function. The sedation continuum ranges from minimal sedation (anxiolysis) through moderate sedation (conscious sedation — purposeful response to verbal or light tactile stimulation) to deep sedation (response only to painful stimulation) and general anesthesia (unarousable). The ASA classification guides patient selection: ASA I-II patients are appropriate for NP-administered sedation; ASA III-IV require anesthesiology consultation. Common agents include: propofol (rapid onset/offset, no analgesic properties), ketamine (dissociative — maintains airway reflexes and hemodynamics, provides analgesia), midazolam (benzodiazepine anxiolytic), fentanyl (short-acting opioid), and etomidate (ultrashort-acting, hemodynamically neutral). The NP must be prepared to rescue from a deeper level of sedation than intended — if targeting moderate sedation, must be competent to manage deep sedation complications including airway obstruction and apnea." },
    riskFactors: ["ASA class III or higher (significant systemic disease)","Difficult airway predictors (Mallampati III-IV, short neck, limited mouth opening, obesity)","Obesity (increased sensitivity to respiratory depression, difficult airway)","Obstructive sleep apnea","Extremes of age (elderly more sensitive; children higher risk of laryngospasm)","NPO status violation (aspiration risk)","Concurrent opioid or benzodiazepine use","Hepatic or renal impairment (altered drug metabolism)"],
    diagnostics: ["Pre-sedation assessment: ASA classification, airway evaluation (Mallampati), NPO status","Baseline vital signs including blood pressure, heart rate, respiratory rate, SpO2","Continuous monitoring during sedation: pulse oximetry, capnography (ETCO2), cardiac monitoring, blood pressure","Sedation depth assessment: modified Aldrete score or RASS","Post-procedure monitoring until discharge criteria met (modified Aldrete ≥9)"],
    management: ["Obtain informed consent with discussion of risks","Verify NPO status: clear liquids ≥2 hours, light meal ≥6 hours, full meal ≥8 hours","Establish IV access and prepare emergency equipment: bag-valve-mask, suction, advanced airway equipment, reversal agents","Titrate sedation to desired level using incremental doses","Maintain continuous monitoring: SpO2, ETCO2 (most sensitive early indicator of respiratory depression), ECG, BP","Have reversal agents immediately available: naloxone (opioids), flumazenil (benzodiazepines)","Discharge criteria: alert, oriented, stable vital signs × 30 minutes, able to ambulate, responsible adult escort"],
    nursingActions: ["Complete pre-sedation assessment: ASA class, airway evaluation, NPO status, allergies, medications","Verify emergency equipment is present and functioning: suction, BVM, oxygen, intubation supplies","Establish IV access and confirm patency before sedation begins","Monitor continuously: SpO2, ETCO2, ECG, BP, respiratory rate, level of consciousness","Assess sedation depth throughout procedure using validated scale","Be prepared to manage airway complications: chin lift, jaw thrust, oral/nasal airway, BVM ventilation","Monitor post-procedure until modified Aldrete score ≥9 and discharge criteria are met","Provide discharge instructions: no driving, no critical decisions for 24 hours, responsible adult escort required"],
    assessmentFindings: ["Pre-sedation: ASA class, Mallampati score, NPO status confirmed","During sedation: response to verbal and tactile stimulation, respiratory pattern, SpO2, ETCO2","Appropriate sedation depth: purposeful response to verbal commands (moderate) or painful stimulation (deep)","Post-sedation: alertness, orientation, vital sign stability, ability to ambulate","Signs of oversedation: loss of verbal responsiveness, respiratory depression, SpO2 decline, ETCO2 rise"],
    signs: {
      left: ["Patient at appropriate sedation level for procedure","Stable vital signs throughout sedation","SpO2 >95% and ETCO2 within normal range","Patient responsive to verbal stimulation (moderate sedation)","Meets discharge criteria post-procedure"],
      right: ["Respiratory depression: SpO2 <90%, ETCO2 >50 mmHg, apnea","Airway obstruction requiring intervention","Aspiration event","Cardiovascular instability (severe hypotension, bradycardia)","Inability to rescue from deeper-than-intended sedation","Laryngospasm or bronchospasm"]
    },
    medications: [{
      name: "Propofol",
      type: "IV anesthetic/sedative (alkylphenol)",
      action: "Potentiates GABA-A receptor activity, producing rapid-onset sedation (30-45 seconds) with ultra-short duration (5-10 minutes); provides amnesia and anxiolysis but NO analgesia",
      sideEffects: "Respiratory depression (dose-dependent apnea), hypotension (vasodilation and myocardial depression), pain on injection",
      contra: "Hemodynamic instability, lack of airway management capability",
      pearl: "Ideal for brief procedural sedation due to rapid onset/offset; titrate in small boluses (0.5-1 mg/kg initial); always have airway equipment ready — apnea is common; NO reversal agent exists"
    }],
    pearls: ["Capnography (ETCO2) detects respiratory depression BEFORE pulse oximetry — ETCO2 changes occur minutes before SpO2 drops","You must be able to rescue from ONE LEVEL DEEPER than your target sedation","Propofol provides NO analgesia — always pair with an analgesic for painful procedures","Propofol has NO reversal agent — support the airway until the drug clears","NPO guidelines: 2 hours clear liquids, 6 hours light meal, 8 hours full meal","Modified Aldrete score ≥9 is required for safe discharge after sedation"],
    quiz: [
      {
        question: "During propofol sedation, the ETCO2 waveform shows a rising baseline and respiratory rate drops to 6. SpO2 is still 97%. What should the nurse do?",
        options: ["Continue monitoring since SpO2 is normal","Intervene immediately — rising ETCO2 with bradypnea indicates respiratory depression","Administer naloxone","Wait for SpO2 to drop below 90%"],
        correct: 1,
        rationale: "Capnography detects respiratory depression minutes before pulse oximetry. Rising ETCO2 with decreased respiratory rate indicates hypoventilation requiring immediate intervention."
      },
      {
        question: "An NP plans moderate sedation. What level of airway management must they be prepared to perform?",
        options: ["Only supplemental oxygen","Must be prepared to manage deep sedation and airway compromise (one level deeper than target)","Only basic monitoring","General anesthesia management"],
        correct: 1,
        rationale: "The standard of care requires practitioners to be competent to rescue from one level deeper than the target sedation depth."
      },
      {
        question: "A patient receiving propofol becomes apneic. What is the correct management?",
        options: ["Administer flumazenil","Provide BVM ventilation — there is no reversal agent for propofol","Administer naloxone","Increase the propofol dose"],
        correct: 1,
        rationale: "Propofol has NO reversal agent. Management of apnea requires airway support (BVM ventilation) until the drug is metabolized (5-10 minutes)."
      },
    ]
  },
  "sedation-scale-rn": {
    title: "Sedation Assessment Scales",
    cellular: { title: "Sedation Scale Application", content: "Sedation assessment scales provide standardized tools for evaluating a patient's level of consciousness and sedation depth. The Richmond Agitation-Sedation Scale (RASS, -5 to +4) ranges from unarousable (-5) through calm and alert (0) to combative (+4) and is widely used in ICU settings. The Ramsay Sedation Scale (1-6) grades levels from anxious/agitated (1) through no response (6). The Modified Aldrete Score (0-10) assesses post-anesthesia recovery across activity, respiration, circulation, consciousness, and SpO2; score ≥9 indicates readiness for PACU discharge. The Glasgow Coma Scale (3-15) assesses eye opening, verbal response, and motor response and is used for neurological injury, not pharmacological sedation. Accurate sedation assessment is essential for titrating medications to the desired level (typically RASS -2 to 0 for light ICU sedation), avoiding over-sedation (which increases ventilator days, ICU stay, and delirium risk), and ensuring patient safety. The ascending reticular activating system (ARAS) in the brainstem maintains wakefulness; sedative agents suppress ARAS activity in a dose-dependent manner." },
    riskFactors: ["Inconsistent sedation assessment leading to over- or under-sedation","Lack of standardized scale use across units","Failure to assess sedation depth before and after medication changes","Over-sedation increasing ventilator-associated pneumonia, delirium, prolonged ICU stay","Under-sedation causing patient distress and accidental extubation","Improper scale selection (using GCS for pharmacologic sedation instead of RASS)"],
    diagnostics: ["RASS assessment: observe → call name → physical stimulation → assign score","Ramsay scale: sequential stimulation from verbal to pain","Modified Aldrete scoring: 5 parameters each scored 0-2 (total 0-10)","CAM-ICU: assess for delirium in sedated patients","Bispectral Index (BIS) monitoring: continuous EEG-derived sedation depth measurement"],
    management: ["Select appropriate sedation scale for clinical context (RASS for ICU, Aldrete for PACU)","Establish target sedation level and communicate to team (e.g., RASS -2 to 0)","Assess sedation at regular intervals and before/after dose changes","Implement daily sedation interruption trials (SAT) in mechanically ventilated patients","Coordinate SAT with spontaneous breathing trials (SBT) — the 'wake up and breathe' protocol","Titrate sedation to lightest effective level","Use non-pharmacologic comfort measures before escalating sedation"],
    nursingActions: ["Assess RASS every 1-2 hours in sedated ICU patients and before/after dose changes","Perform daily sedation interruption and assess neurological status","Coordinate SAT with SBT per ventilator liberation protocol","Document sedation target, actual score, and interventions","Assess for delirium using CAM-ICU at least once per shift","Report over-sedation (deeper than target) and adjust infusion per protocol","Implement non-pharmacologic interventions for agitation: reorientation, noise reduction, music therapy"],
    assessmentFindings: ["RASS score with stimulation method documented","Signs of over-sedation: RASS -4 to -5, respiratory depression, hemodynamic compromise","Signs of under-sedation: RASS +1 to +4, agitation, pulling at lines/tubes","Delirium assessment (CAM-ICU positive): fluctuating mental status, inattention","Post-anesthesia: Aldrete score trending toward ≥9"],
    signs: {
      left: ["RASS at target (-2 to 0) — patient sedated but arousable","Modified Aldrete ≥9 — ready for PACU discharge","Patient calm, comfortable, and pain-controlled","No signs of delirium on CAM-ICU"],
      right: ["Deep sedation beyond target (RASS -4 to -5) with hemodynamic compromise","Agitation-related self-extubation","ICU delirium (CAM-ICU positive) — increased mortality","Propofol infusion syndrome (metabolic acidosis, rhabdomyolysis, cardiac failure)"]
    },
    medications: [{
      name: "Dexmedetomidine (Precedex)",
      type: "Alpha-2 adrenergic agonist (sedative)",
      action: "Activates alpha-2 receptors in the locus ceruleus, producing sedation that mimics natural sleep; provides anxiolysis and mild analgesia without significant respiratory depression",
      sideEffects: "Bradycardia (most common), hypotension, hypertension with loading dose",
      contra: "Hemodynamically unstable patients, advanced heart block",
      pearl: "Key advantage: sedation WITHOUT significant respiratory depression — ideal for extubation readiness; associated with LESS delirium than benzodiazepines; patients are easily arousable"
    }],
    pearls: ["RASS is the most widely validated sedation scale for ICU use — target lightest effective sedation","Light sedation (RASS -2 to 0) reduces ventilator days, ICU stay, and delirium vs. deep sedation","Daily SAT paired with SBT improves outcomes and speeds ventilator liberation","Modified Aldrete ≥9 is the standard for safe PACU discharge","GCS is for neurological injury — do NOT use for pharmacological sedation assessment","Dexmedetomidine causes less delirium than benzodiazepines and allows cooperative sedation","CAM-ICU should be assessed at least once per shift — ICU delirium is associated with increased mortality"],
    quiz: [
      {
        question: "The sedation target for an ICU patient is RASS -2. Assessment shows RASS -4. What should the nurse do?",
        options: ["Continue current rate","Reduce the sedation infusion rate — patient is deeper than target","Administer additional bolus","Discontinue all sedation immediately"],
        correct: 1,
        rationale: "RASS -4 exceeds the target of -2, indicating over-sedation. The nurse should reduce the infusion rate. Over-sedation increases VAP, delirium, and ICU stay."
      },
      {
        question: "A PACU patient has a modified Aldrete score of 7. What does this indicate?",
        options: ["Ready for discharge","Does not yet meet discharge criteria (requires ≥9)","Needs immediate intubation","Score is irrelevant"],
        correct: 1,
        rationale: "A modified Aldrete score ≥9 (out of 10) is required for safe PACU discharge. A score of 7 indicates inadequate recovery requiring continued monitoring."
      },
      {
        question: "Why is dexmedetomidine preferred over midazolam for ICU sedation in many patients?",
        options: ["Less expensive","Causes less delirium and does not significantly depress respiration","Provides deeper sedation","Midazolam has no sedative properties"],
        correct: 1,
        rationale: "Dexmedetomidine provides 'cooperative sedation' without significant respiratory depression and is associated with less ICU delirium compared to benzodiazepines."
      },
    ]
  },
  "sedative-hypnotic-toxidrome-np": {
    title: "Sedative-Hypnotic Toxidrome",
    cellular: { title: "Sedative-Hypnotic Toxidrome Pathophysiology", content: "The sedative-hypnotic toxidrome results from excessive CNS depression caused by agents that enhance GABA-A receptor activity (benzodiazepines, barbiturates, ethanol, GHB, zolpidem) or suppress excitatory neurotransmission. Benzodiazepines bind to the GABA-A receptor and increase the FREQUENCY of chloride channel opening (ceiling effect — rarely fatal in isolation). Barbiturates bind to a different site and increase the DURATION of chloride channel opening; at high doses, they can directly activate the channel WITHOUT GABA (no ceiling effect — respiratory arrest and death possible). The toxidrome presents with: CNS depression (drowsiness → coma), respiratory depression, hypotension, hypothermia, hyporeflexia, and midpoint/variable pupils. Key distinction: benzodiazepine overdose rarely causes death alone but is lethal with opioids or ethanol; barbiturate overdose can directly cause cardiovascular collapse. The NP must differentiate this from opioid toxidrome (miosis, responds to naloxone) and assess for co-ingestion, which greatly increases mortality." },
    riskFactors: ["Intentional overdose (often involves co-ingestion)","Co-ingestion with opioids and/or ethanol (synergistic respiratory depression)","Prescription sedative misuse","Elderly patients (decreased metabolism)","Hepatic impairment (prolonged drug metabolism)","Benzodiazepine dependence with escalating doses","Drug-facilitated assault (GHB, flunitrazepam)"],
    diagnostics: ["Urine drug screen: detects benzodiazepines, barbiturates","Serum ethanol level","Specific drug levels when available (phenobarbital)","ABG: respiratory acidosis from hypoventilation","ECG: assess for QT prolongation, conduction abnormalities","CT head if altered mental status out of proportion to suspected ingestion"],
    management: ["Airway protection: intubate if GCS ≤8 or loss of gag reflex","Flumazenil for known ISOLATED benzodiazepine overdose — AVOID in benzodiazepine dependence, seizure history, or mixed ingestion (seizure risk)","Barbiturate overdose: supportive care; urinary alkalinization for phenobarbital; hemodialysis for severe cases","GHB overdose: supportive care only; rapid recovery within 2-6 hours","IV fluid resuscitation for hypotension; vasopressors if refractory","Activated charcoal if within 1-2 hours and airway protected","Rewarming for hypothermia"],
    nursingActions: ["Assess and secure airway — respiratory depression is the primary cause of death","Monitor respiratory rate, SpO2, and ETCO2 continuously","Assess level of consciousness using GCS — track trends","Monitor for hypotension, bradycardia, and hypothermia","Obtain detailed substance history from patient, family, or EMS","Administer flumazenil ONLY when contraindications excluded","Position in lateral recumbent (recovery) position if not intubated","Monitor for withdrawal if chronic benzodiazepine or barbiturate user"],
    assessmentFindings: ["CNS depression: drowsiness → lethargy → stupor → coma","Respiratory depression: decreased rate, shallow breathing, apnea","Slurred speech and ataxia","Hyporeflexia or areflexia","Hypotension and hypothermia","Pupils: midpoint, normal, or variable (unlike opioid miosis)","Nystagmus","Absence of diaphoresis (helps distinguish from sympathomimetic toxidrome)"],
    signs: {
      left: ["Mild sedation with intact airway and adequate ventilation","Responds to verbal stimulation","Hemodynamically stable","Expected to recover with observation"],
      right: ["Coma with loss of airway reflexes (requires intubation)","Respiratory arrest","Cardiovascular collapse (severe barbiturate overdose)","Co-ingestion with opioids causing synergistic respiratory depression","Seizures after flumazenil in benzodiazepine-dependent patient"]
    },
    medications: [{
      name: "Flumazenil",
      type: "Benzodiazepine receptor antagonist",
      action: "Competitively displaces benzodiazepines from the GABA-A receptor; onset 1-2 minutes, duration 30-60 minutes (shorter than most benzodiazepines — risk of re-sedation)",
      sideEffects: "Seizures (in benzodiazepine-dependent patients or co-ingestion), nausea, agitation",
      contra: "Chronic benzodiazepine use/dependence, mixed overdose with pro-convulsant agents (TCAs), seizure disorder",
      pearl: "NOT recommended as routine antidote in undifferentiated overdose — reserved for KNOWN isolated benzodiazepine ingestion in benzodiazepine-naive patients; short duration means re-sedation is common"
    }],
    pearls: ["Benzodiazepines have a ceiling effect — rarely fatal alone; danger is CO-INGESTION with opioids/ethanol","Barbiturates have NO ceiling effect — can directly activate chloride channels causing respiratory arrest","Flumazenil causes seizures in benzodiazepine-dependent patients — only use for KNOWN isolated overdose","Sedative-hypnotic toxidrome has NORMAL/variable pupils — distinguishing from opioid (miosis) and anticholinergic (mydriasis)","GHB causes rapid coma but also rapid recovery (2-6 hours)","Duration of flumazenil is shorter than most benzodiazepines — re-sedation occurs","The lethal combination: benzodiazepine + opioid + ethanol = synergistic respiratory depression"],
    quiz: [
      {
        question: "A patient presents with CNS depression after suspected benzodiazepine overdose, but co-ingestion is uncertain. Should flumazenil be given?",
        options: ["Yes — for all benzodiazepine overdoses","No — flumazenil should be avoided when co-ingestion is possible because it can precipitate seizures","Yes — always safe","Only if in respiratory arrest"],
        correct: 1,
        rationale: "Flumazenil is contraindicated when co-ingestion is suspected because reversing the benzodiazepine can unmask pro-convulsant effects or precipitate seizures in dependent patients."
      },
      {
        question: "What distinguishes benzodiazepine from barbiturate overdose in terms of safety?",
        options: ["Barbiturate overdose is safer","Benzodiazepines have a ceiling effect (rarely fatal alone); barbiturates can directly activate chloride channels (no ceiling effect — fatal)","Both equally dangerous","Benzodiazepine overdose is more dangerous"],
        correct: 1,
        rationale: "Benzodiazepines only potentiate existing GABA activity (ceiling effect). Barbiturates can directly activate chloride channels without GABA at high doses, causing fatal respiratory and cardiovascular collapse."
      },
      {
        question: "After flumazenil administration, the patient awakens but re-sedates 45 minutes later. Why?",
        options: ["Flumazenil was ineffective","Flumazenil's duration (30-60 min) is shorter than most benzodiazepines — re-sedation is expected","Patient took more benzodiazepines","Patient is faking"],
        correct: 1,
        rationale: "Flumazenil has a shorter duration than most benzodiazepines. Once it wears off, the still-circulating benzodiazepine re-occupies the receptor. Monitor for at least 2 hours."
      },
    ]
  },
  "seizure-disorders-np": {
    title: "Seizure Disorders",
    cellular: { title: "Seizure Pathophysiology", content: "Seizures result from abnormal, excessive, hypersynchronous neuronal electrical activity in the cerebral cortex. Under normal conditions, excitatory (glutamate) and inhibitory (GABA) neurotransmission are balanced. Seizures occur when this balance shifts toward excitation. Epilepsy is defined as ≥2 unprovoked seizures >24 hours apart, or one unprovoked seizure with high recurrence risk (>60%), or an epilepsy syndrome diagnosis. The 2017 ILAE classification divides seizures into: focal onset (aware or impaired awareness), generalized onset (tonic-clonic, absence, myoclonic, atonic), and unknown onset. Status epilepticus is continuous seizure ≥5 minutes or ≥2 seizures without return to baseline — a medical emergency causing excitotoxic neuronal death. First-line treatment is IV benzodiazepine (lorazepam 0.1 mg/kg or midazolam 10 mg IM), followed by second-line ASM (fosphenytoin, levetiracetam, or valproate) if seizures persist." },
    riskFactors: ["Family history of epilepsy","History of febrile seizures","Traumatic brain injury","Stroke or cerebrovascular disease","CNS infection (meningitis, encephalitis)","Brain tumors","Cortical developmental malformations","Metabolic disturbances: hypoglycemia, hyponatremia, hypocalcemia","Alcohol or benzodiazepine withdrawal","Sleep deprivation","Medication non-adherence (most common cause of breakthrough seizures)"],
    diagnostics: ["EEG: gold standard for seizure classification","MRI brain with epilepsy protocol: identifies structural causes","Prolactin level: elevated >2× baseline within 20 minutes supports true seizure vs. psychogenic event","BMP: glucose, sodium, calcium, magnesium (rule out metabolic causes)","Antiseizure medication levels for narrow-therapeutic-index drugs","CT head: initial imaging in emergency for new seizure","Lumbar puncture if CNS infection suspected","Video-EEG monitoring for seizure classification and presurgical evaluation"],
    management: ["Focal seizures: carbamazepine, lamotrigine, levetiracetam, or oxcarbazepine first-line","Generalized tonic-clonic: valproate (most effective), lamotrigine, levetiracetam","Absence seizures: ethosuximide first-line, valproate, lamotrigine","Status epilepticus: Step 1: benzodiazepine; Step 2: fosphenytoin/levetiracetam/valproate; Step 3: ICU for continuous infusion","Women of childbearing age: avoid valproate (teratogenic); prefer lamotrigine or levetiracetam; folate 4 mg/day","Driving restrictions: seizure-free interval varies by jurisdiction (3-12 months)","Surgical evaluation for drug-resistant epilepsy (failed ≥2 appropriate ASMs)"],
    nursingActions: ["During active seizure: ensure safety, do NOT restrain or put anything in mouth, time the seizure","Maintain airway: position on side after seizure, suction as needed","Monitor vital signs and neurological status post-seizure","Administer benzodiazepines for status epilepticus per protocol","Monitor ASM levels and signs of toxicity","Educate on medication adherence — non-adherence is the #1 cause of breakthrough seizures","Educate on seizure safety: no swimming alone, no locked bathrooms, no driving until seizure-free","Implement seizure precautions: padded side rails, suction at bedside, O2 available, IV access"],
    assessmentFindings: ["Witnessed seizure characteristics: type, duration, body parts involved","Aura (suggests focal origin)","Postictal state: confusion, drowsiness, headache, Todd paralysis","Tongue biting (lateral — suggests GTC)","Urinary incontinence","Automatisms during focal impaired awareness seizure","EEG findings: epileptiform discharges, generalized spike-and-wave"],
    signs: {
      left: ["Single seizure with normal EEG and MRI","Well-controlled on monotherapy","Seizure-free >12 months","No medication side effects"],
      right: ["Status epilepticus (≥5 minutes — emergency)","Drug-resistant epilepsy (failed ≥2 ASMs)","Seizure with structural brain lesion","Neuroleptic malignant syndrome from antipsychotic","SUDEP risk factors: uncontrolled GTC seizures"]
    },
    medications: [{
      name: "Levetiracetam (Keppra)",
      type: "Antiseizure medication (SV2A ligand)",
      action: "Binds synaptic vesicle glycoprotein 2A (SV2A), modulating neurotransmitter release; broad-spectrum effectiveness",
      sideEffects: "Behavioral changes (irritability, 'Keppra rage'), drowsiness, dizziness, rarely suicidal ideation",
      contra: "Known hypersensitivity; dose adjustment for renal impairment",
      pearl: "Broad-spectrum ASM; minimal drug interactions; no hepatic enzyme induction; safe in pregnancy; rapid IV loading possible; watch for behavioral side effects"
    }],
    pearls: ["Status epilepticus = seizure ≥5 minutes — give benzodiazepine immediately","Medication non-adherence is the #1 cause of breakthrough seizures","Valproate is most effective for generalized epilepsy but TERATOGENIC — avoid in women of childbearing age","During seizure: protect, time, do NOT restrain, do NOT put anything in mouth","Lateral tongue biting suggests true GTC seizure","Drug-resistant epilepsy (failed 2+ ASMs) warrants surgical evaluation","Postictal prolactin >2× baseline supports epileptic seizure over psychogenic event"],
    quiz: [
      {
        question: "A seizure has lasted 5 minutes. What is the priority?",
        options: ["Wait until 30 minutes","Administer IV lorazepam — status epilepticus at ≥5 minutes","Restrain the patient","Place a tongue depressor"],
        correct: 1,
        rationale: "Status epilepticus is defined as seizure ≥5 minutes. First-line treatment is benzodiazepine (lorazepam 0.1 mg/kg IV or midazolam 10 mg IM)."
      },
      {
        question: "A 28-year-old woman with epilepsy on valproate plans pregnancy. What should the NP recommend?",
        options: ["Continue valproate","Transition to lamotrigine or levetiracetam — valproate is teratogenic","Stop all medications","Switch to phenytoin"],
        correct: 1,
        rationale: "Valproate is highly teratogenic (neural tube defects) and should be avoided in women of childbearing age. Lamotrigine and levetiracetam have the best pregnancy safety profiles."
      },
      {
        question: "A patient with epilepsy has seizures despite levetiracetam and lamotrigine at adequate doses. What should the NP consider?",
        options: ["Continue same medications longer","Evaluate for drug-resistant epilepsy and refer for surgical evaluation","Increase both to maximum dose simultaneously","Discontinue all medications"],
        correct: 1,
        rationale: "Drug-resistant epilepsy is defined as failure of ≥2 appropriate ASM trials. Referral for surgical evaluation is recommended — surgery can be curative for focal epilepsy."
      },
    ]
  },
  "seizure-physiology-np": {
    title: "Seizure Neurophysiology",
    cellular: { title: "Neural Basis of Seizure Activity", content: "Seizures arise from hypersynchronous neuronal discharges due to imbalance between excitatory and inhibitory neurotransmission. Glutamate (excitatory) acts on NMDA, AMPA, and kainate receptors to depolarize neurons. GABA (inhibitory) acts on GABA-A (chloride channel hyperpolarization) and GABA-B (potassium conductance) receptors. The paroxysmal depolarization shift (PDS) is the cellular hallmark: a sustained calcium-dependent depolarization followed by burst firing. When inhibition fails, the PDS propagates creating hypersynchronous discharge. Ion channelopathies play central roles: gain-of-function sodium channel mutations (SCN1A in Dravet syndrome), loss-of-function potassium channel mutations, and GABA-A receptor mutations. Antiseizure medications target these mechanisms: sodium channel blockers (carbamazepine, phenytoin, lamotrigine), GABA enhancers (benzodiazepines increase frequency, barbiturates increase duration of chloride channel opening), T-type calcium channel blockers (ethosuximide for absence), SV2A modulators (levetiracetam), and glutamate antagonists (perampanel blocks AMPA)." },
    riskFactors: ["Genetic channelopathies (SCN1A, KCNQ2/3 mutations)","Structural brain lesions disrupting inhibitory circuits","Metabolic disturbances altering membrane potential","Drug withdrawal (alcohol, benzodiazepines — rebound excitation)","Pro-convulsant medications (tramadol, bupropion, imipenem)","Sleep deprivation (reduces seizure threshold)","Fever (temperature-dependent sodium channel kinetics)","Cortical scarring from TBI"],
    diagnostics: ["EEG: interictal epileptiform discharges (spikes, sharp waves, spike-and-wave)","3 Hz spike-and-wave: pathognomonic for childhood absence epilepsy","Hypsarrhythmia: chaotic pattern pathognomonic for infantile spasms","Video-EEG: correlates clinical events with electrical activity","Magnetoencephalography (MEG): localizes epileptiform sources","Functional MRI: identifies eloquent cortex for surgical planning"],
    management: ["Sodium channel blockers (carbamazepine, phenytoin, lamotrigine): first-line for focal seizures","T-type calcium channel blocker (ethosuximide): first-line for pure childhood absence","GABA enhancers (benzodiazepines, clobazam): rescue and adjunctive therapy","Broad-spectrum ASMs for generalized epilepsy: valproate, lamotrigine, levetiracetam","Avoid carbamazepine/phenytoin in generalized epilepsy — can worsen absence and myoclonic seizures","Ketogenic diet for drug-resistant epilepsy (especially in children)","Vagus nerve stimulation for drug-resistant epilepsy not amenable to surgery"],
    nursingActions: ["Understand mechanism of each ASM to anticipate effects and side effects","Monitor drug-specific toxicity: phenytoin (gingival hyperplasia, ataxia, nystagmus), carbamazepine (hyponatremia, aplastic anemia), valproate (hepatotoxicity, thrombocytopenia)","Monitor therapeutic drug levels for narrow-index ASMs","Assess for drug interactions — enzyme-inducing ASMs reduce oral contraceptive efficacy","Educate that carbamazepine can WORSEN absence and myoclonic seizures","Monitor cognitive and behavioral side effects","Support ketogenic diet adherence"],
    assessmentFindings: ["EEG pattern correlating with seizure type","Seizure semiology localizing the onset zone","Medication response or failure guiding therapy adjustment","Cognitive and behavioral changes from seizures or medications","Drug-drug interactions from enzyme-inducing ASMs"],
    signs: {
      left: ["Seizures controlled on monotherapy","Normal interictal EEG","No cognitive side effects","Therapeutic drug levels maintained"],
      right: ["Drug-resistant seizures despite 2+ ASM trials","Status epilepticus","Significant ASM side effects","Teratogenic ASM in woman of reproductive age"]
    },
    medications: [{
      name: "Ethosuximide (Zarontin)",
      type: "T-type calcium channel blocker",
      action: "Selectively blocks T-type calcium channels in thalamic relay neurons, preventing thalamocortical oscillations that generate 3 Hz spike-and-wave discharges of absence seizures",
      sideEffects: "GI upset, drowsiness, headache, hiccups, rare blood dyscrasias",
      contra: "Not effective for convulsive seizures — only treats absence seizures",
      pearl: "First-line for PURE childhood absence epilepsy; if patient also has GTC seizures, use valproate or lamotrigine instead"
    }],
    pearls: ["Benzodiazepines increase FREQUENCY; barbiturates increase DURATION of GABA-A channel opening — barbiturates more dangerous (no ceiling effect)","Carbamazepine/phenytoin can WORSEN absence and myoclonic seizures — seizure classification before drug selection is critical","3 Hz spike-and-wave = childhood absence epilepsy","Ethosuximide only treats absence — NO activity against tonic-clonic or focal seizures","Enzyme-inducing ASMs reduce oral contraceptive efficacy — women need additional contraception","Valproate is broadest-spectrum ASM but has the most side effects"],
    quiz: [
      {
        question: "A child has absence epilepsy with 3 Hz spike-and-wave on EEG. Which ASM is first-line?",
        options: ["Carbamazepine","Phenytoin","Ethosuximide","Phenobarbital"],
        correct: 2,
        rationale: "Ethosuximide selectively blocks T-type calcium channels in the thalamus. Carbamazepine and phenytoin can WORSEN absence seizures."
      },
      {
        question: "How do benzodiazepines and barbiturates differ at the GABA-A receptor?",
        options: ["Same mechanism","Benzodiazepines increase FREQUENCY; barbiturates increase DURATION and can directly activate without GABA (no ceiling effect)","Benzodiazepines block GABA","Barbiturates are safer"],
        correct: 1,
        rationale: "Benzodiazepines increase chloride channel opening frequency (require GABA — ceiling effect). Barbiturates increase duration and at high doses directly activate channels without GABA (no ceiling effect — more dangerous)."
      },
      {
        question: "An NP prescribes carbamazepine for juvenile myoclonic epilepsy. What is the concern?",
        options: ["Too expensive","Carbamazepine can WORSEN myoclonic seizures — contraindicated in generalized epilepsy","No anticonvulsant properties","Only available IV"],
        correct: 1,
        rationale: "Carbamazepine exacerbates generalized seizure types including myoclonic and absence. JME requires broad-spectrum ASMs (valproate, lamotrigine, levetiracetam)."
      },
    ]
  },  "seizure-types-priorities-rpn": {
    title: "Seizure Types and Priorities",
    cellular: { title: "Seizure Classification for Practical Nurses", content: "Seizures are classified by onset: focal (starting in one brain area) or generalized (both hemispheres from start). Focal seizures may be focal aware (patient remains conscious) or focal with impaired awareness (consciousness impaired). Generalized seizures include: tonic-clonic (stiffening then jerking, loss of consciousness, postictal confusion), absence (brief staring spells 5-30 seconds, no postictal confusion), myoclonic (brief shock-like jerks), tonic (sustained stiffening), atonic (drop attacks — sudden loss of tone), and clonic (rhythmic jerking). The practical nurse must recognize seizure types, implement seizure precautions, protect patients, time duration, document observations accurately, and report to the RN or physician." },
    riskFactors: ["History of epilepsy","Brain injury (trauma, stroke, infection)","Medication non-adherence","Alcohol or drug withdrawal","Metabolic imbalances (low glucose, sodium, calcium)","High fever in children (febrile seizures)","Sleep deprivation","Brain tumors"],
    diagnostics: ["Observation and documentation of seizure characteristics","Vital signs monitoring","Blood glucose check (treatable cause)","Oxygen saturation monitoring","Temperature assessment (febrile seizure)","Report all observations to RN or physician"],
    management: ["During seizure: protect from injury, time it, do not restrain, nothing in mouth","After seizure: turn on side, maintain airway, check blood glucose","Administer rescue medications as ordered for prolonged seizures","Call for emergency help if seizure >5 minutes or first seizure","Maintain seizure precautions for at-risk patients","Document and report thoroughly"],
    nursingActions: ["Implement seizure precautions: padded side rails, suction, O2, bed lowest","During seizure: stay with patient, ensure safety, time, observe and document","After: position on side, maintain airway, assess breathing, check glucose","Document: time, duration, body parts, type of movement, consciousness, incontinence, postictal state","Report all seizure activity immediately","Educate family on first aid: do not restrain, do not insert objects, time it, call for help if >5 min"],
    assessmentFindings: ["Tonic-clonic: stiffening then jerking, LOC, tongue biting, incontinence, postictal confusion","Absence: brief staring (5-30 sec), eye fluttering, NO postictal confusion","Focal aware: one-sided twitching, patient conscious","Focal impaired awareness: altered consciousness, automatisms, no memory of event","Myoclonic: brief shock-like jerks","Atonic: sudden loss of tone — drop attack"],
    signs: {
      left: ["Brief absence with rapid return to baseline","Focal aware seizure with preserved consciousness","Short GTC (<5 min) with normal postictal recovery","Known seizure disorder with typical pattern"],
      right: ["Seizure >5 minutes (status epilepticus)","First-ever seizure (urgent evaluation needed)","No return to baseline between seizures","Seizure in pregnant woman (possible eclampsia)","Postictal state >30 minutes with focal deficits"]
    },
    medications: [{
      name: "Diazepam Rectal Gel (Diastat)",
      type: "Benzodiazepine rescue medication",
      action: "Enhances GABA-A activity, rapidly terminating seizures via rectal absorption when IV access unavailable",
      sideEffects: "Sedation, respiratory depression, ataxia",
      contra: "Acute narrow-angle glaucoma, severe respiratory depression",
      pearl: "For home/school use in seizures >5 minutes; caregivers must be trained; place in recovery position after; call 911 if seizure doesn't stop within 5 minutes of administration"
    }],
    pearls: ["Absence seizures have NO postictal confusion — can be mistaken for daydreaming","Tonic-clonic has TWO phases: tonic (stiffening) then clonic (jerking), followed by postictal confusion","NEVER put anything in a seizing patient's mouth","Time every seizure — ≥5 minutes = status epilepticus requiring emergency treatment","Atonic seizures (drop attacks) require helmets for protection","After GTC: turn on side (recovery position) to prevent aspiration","Postictal confusion is normal and can last minutes to hours"],
    quiz: [{ question: "A child stares blankly for 15 seconds with eye fluttering, then resumes activity with no confusion. What seizure type?", options: ["Tonic-clonic","Absence seizure — brief staring with no postictal confusion","Focal impaired awareness","Atonic"], correct: 1, rationale: "Absence seizures are brief staring episodes (5-30 seconds) with NO postictal confusion — the child immediately returns to normal." },{ question: "A coworker reaches for a spoon to put between a seizing patient's teeth. What should the nurse do?", options: ["Help insert the spoon","Stop them — nothing should be placed in the mouth","Get a padded tongue blade instead","Allow if patient is biting tongue"], correct: 1, rationale: "NEVER place anything in a seizing patient's mouth. Objects cause broken teeth, aspiration, jaw injury, and caregiver injury." }]
  },
  "sensitivity-specificity-np": {
    title: "Sensitivity and Specificity",
    cellular: { title: "Diagnostic Test Characteristics", content: "Sensitivity and specificity are intrinsic properties of diagnostic tests. Sensitivity (true positive rate) = TP/(TP+FN) — 'of people who HAVE the disease, what proportion does the test detect?' High sensitivity means few false negatives; a NEGATIVE result reliably rules OUT (SnNOut). Specificity (true negative rate) = TN/(TN+FP) — 'of people WITHOUT disease, what proportion tests negative?' High specificity means few false positives; a POSITIVE result reliably rules IN (SpPIn). Predictive values depend on prevalence: PPV = TP/(TP+FP); NPV = TN/(TN+FN). As prevalence decreases, PPV decreases even if sensitivity/specificity remain constant. This is why screening in low-prevalence populations generates many false positives. Likelihood ratios combine sensitivity and specificity: positive LR = sensitivity/(1-specificity); negative LR = (1-sensitivity)/specificity. LR+ >10 or LR- <0.1 provide strong evidence." },
    riskFactors: ["Misinterpretation due to inadequate understanding of test characteristics","Ordering sensitive tests in low-prevalence populations (many false positives)","Over-reliance on single test without considering pretest probability","Failure to understand that predictive value depends on prevalence","Cognitive biases: anchoring, premature closure","Ordering tests without clear clinical question"],
    diagnostics: ["Calculate sensitivity: TP/(TP+FN)","Calculate specificity: TN/(TN+FP)","Calculate PPV: TP/(TP+FP)","Calculate NPV: TN/(TN+FN)","Likelihood ratio positive: sensitivity/(1-specificity)","Likelihood ratio negative: (1-sensitivity)/specificity","Apply Bayes' theorem for post-test probability"],
    management: ["Use highly sensitive tests for SCREENING (minimize false negatives)","Use highly specific tests for CONFIRMATION (minimize false positives)","Two-step strategy: screen with sensitive test → confirm positives with specific test","Assess pretest probability before ordering tests","Understand PPV drops in low-prevalence populations","Use likelihood ratios to quantify test result impact","Do not order tests that will not change management"],
    nursingActions: ["Understand sensitivity/specificity of tests you order","Explain results in context of pretest probability","Apply SnNOut and SpPIn in clinical reasoning","Recognize positive screening tests require confirmatory testing","Counsel patients that false positives occur","Document clinical reasoning behind test ordering"],
    assessmentFindings: ["Test result in clinical context","Pretest probability assessment","Population prevalence affecting predictive values","Sequential test results narrowing differential","False positive/negative likelihood"],
    signs: {
      left: ["High-sensitivity test negative = disease excluded (SnNOut)","High-specificity test positive = disease confirmed (SpPIn)","Appropriate two-step testing","Pretest probability guides interpretation"],
      right: ["False positive leading to unnecessary procedures","False negative providing false reassurance","Over-testing in low-prevalence population","Failure to follow up positive screening"]
    },
    medications: [{
      name: "Diagnostic Reasoning Framework",
      type: "Clinical decision-making tool",
      action: "Systematic approach: assess pretest probability → select test (sensitive for screening, specific for confirmation) → interpret with Bayesian reasoning → clinical decision",
      sideEffects: "Misapplication leads to diagnostic error",
      contra: "Ordering tests without clinical question, interpreting without considering prevalence",
      pearl: "Same test result has different meaning in high-risk vs. low-risk patient — a D-dimer is valuable in low-risk PE patient but misleading in high-risk"
    }],
    pearls: ["SnNOut: Sensitive + Negative = rules OUT","SpPIn: Specific + Positive = rules IN","Sensitivity and specificity are FIXED properties — they don't change with prevalence","PPV and NPV CHANGE with prevalence — PPV drops in low-prevalence populations","Best screening tests = highly SENSITIVE; best confirmatory tests = highly SPECIFIC","Two-step strategy: sensitive screening → specific confirmation for positives"],
    quiz: [
      {
        question: "A test with 95% sensitivity and 90% specificity screens a population with 1% disease prevalence. A patient tests positive. What is the approximate probability they have the disease?",
        options: ["95%","90%","About 9% (most positives are false positives in low-prevalence populations)","50%"],
        correct: 2,
        rationale: "In a 1% prevalence population: of 1000 people, 10 have disease (9.5 detected) and 990 don't (99 false positives). PPV = 9.5/108.5 ≈ 9%. Low prevalence dramatically reduces PPV."
      },
      {
        question: "An NP wants to RULE OUT PE in a low-risk patient. Which test characteristic matters most?",
        options: ["High specificity","High sensitivity (SnNOut)","High positive predictive value","Low cost"],
        correct: 1,
        rationale: "To rule OUT, use a highly sensitive test (SnNOut). D-dimer is ~95% sensitive — a negative D-dimer in low pretest probability effectively excludes PE."
      },
      {
        question: "A positive HIV screening test (high sensitivity) is obtained. What is the next step?",
        options: ["Diagnose and treat","Repeat same test","Order confirmatory test with high specificity","No follow-up needed"],
        correct: 2,
        rationale: "A positive screening test requires confirmation with a specific test (SpPIn) to minimize false positive diagnoses."
      },
    ]
  },
  "sensory-changes-rpn": {
    title: "Sensory Changes in Aging",
    cellular: { title: "Age-Related Sensory Changes", content: "Aging produces predictable changes across sensory systems. Vision: presbyopia (decreased lens elasticity after age 40), cataracts (lens opacification), macular degeneration (central vision loss), glaucoma (optic nerve damage from increased IOP), senile miosis (smaller pupils), lens yellowing (difficulty with blues/greens). Hearing: presbycusis (progressive bilateral high-frequency sensorineural hearing loss), cerumen impaction. Taste/smell: decreased taste buds and olfactory receptors reduce appetite and ability to detect hazards (spoiled food, gas leaks). Touch: decreased Meissner and Pacinian corpuscles increase burn and pressure injury risk. Proprioception: decreased joint position sense increases fall risk. Pain: variable changes — some elderly have decreased perception, leading to silent MI or delayed recognition of peritonitis." },
    riskFactors: ["Advanced age","Diabetes (accelerates retinopathy, neuropathy, hearing loss)","Noise exposure history","Smoking (accelerates macular degeneration, cataracts)","UV exposure without protection","Ototoxic medications (aminoglycosides, loop diuretics)","Social isolation from sensory loss","Nutritional deficiencies (vitamin A, B12, zinc)"],
    diagnostics: ["Visual acuity testing (Snellen chart)","Tonometry for glaucoma screening","Otoscopic examination","Whisper test or audiometry","Romberg test for proprioception","Monofilament testing for neuropathy","Amsler grid for macular degeneration"],
    management: ["Vision: prescription eyewear, adequate lighting, large-print materials, cataract surgery, annual eye exams","Hearing: cerumen removal, hearing aids, face patient when speaking, reduce background noise","Taste/smell: enhance food seasoning (herbs not excess salt), check smoke detectors","Touch: protect from burns (test water temperature), pressure injury prevention, diabetic foot care","Fall prevention: remove tripping hazards, adequate lighting, assistive devices, balance exercises"],
    nursingActions: ["Assess sensory function at each visit","Ensure adequate lighting (non-glare)","Face patient when speaking, reduce background noise","Speak in LOW-pitched voice (presbycusis affects high frequencies first)","Use large-print educational materials","Check for cerumen impaction","Check extremity sensation in diabetics","Educate on fall prevention","Assess for social isolation from sensory loss"],
    assessmentFindings: ["Decreased visual acuity","Difficulty with close work (presbyopia)","Difficulty hearing conversation in noise","Requesting repetition, increasing TV volume","Decreased balance on Romberg","Decreased foot sensation (diabetic neuropathy)","Decreased appetite or weight loss","Social withdrawal"],
    signs: {
      left: ["Presbyopia corrected with reading glasses","Age-appropriate hearing managed with aids","Good balance and mobility","Engaged in social activities"],
      right: ["Sudden vision loss (emergency: retinal detachment, acute glaucoma, stroke)","Sudden hearing loss (urgent ENT referral)","Falls from sensory-related balance problems","Burns or pressure injuries from decreased sensation","Social isolation and depression"]
    },
    medications: [{
      name: "Artificial Tears",
      type: "Ophthalmic lubricant",
      action: "Supplements tear film, reducing dry eye symptoms from age-related decreased tear production",
      sideEffects: "Temporary blurred vision, rare preservative reactions",
      contra: "Hypersensitivity to components",
      pearl: "Preservative-free formulations preferred for frequent use; if insufficient, refer for prescription cyclosporine (Restasis) or lifitegrast (Xiidra)"
    }],
    pearls: ["Presbycusis affects HIGH-frequency hearing first — speak in LOW-pitched voice, not just louder","Face the patient — lip reading compensates even unconsciously","Cerumen impaction is a common treatable cause of hearing loss in elderly — check before assuming sensorineural loss","Decreased pain perception can mask serious conditions: silent MI, painless peritonitis","Night lights and grab bars are the most effective fall prevention interventions","Social isolation from hearing loss is strongly associated with cognitive decline"],
    quiz: [{ question: "An elderly patient has difficulty hearing in noisy environments. Best approach?", options: ["Speak louder in high pitch","Face patient, speak in low pitch, reduce background noise","Write everything down","Shout into ear"], correct: 1, rationale: "Presbycusis affects high frequencies first. Low-pitched speech, facing the patient (lip reading), and reducing background noise optimize communication." },{ question: "A diabetic patient has an unnoticed burn on their foot. What does this suggest?", options: ["Negligence","Decreased sensation from diabetic neuropathy","Burn is not serious","Psychological condition"], correct: 1, rationale: "Diabetic neuropathy causes decreased foot sensation. Patients cannot feel burns, cuts, or pressure injuries, making foot care education essential." }]
  },
  "sepsis-basics-rpn": {
    title: "Sepsis Basics",
    cellular: { title: "Sepsis Overview", content: "Sepsis is life-threatening organ dysfunction caused by a dysregulated host response to infection. The Sepsis-3 definition uses SOFA score: increase ≥2 points indicates sepsis. Quick SOFA (qSOFA) bedside screening uses three criteria (1 point each): RR ≥22, altered mental status (GCS <15), SBP ≤100 — score ≥2 prompts further assessment. Pathophysiology involves pathogen-associated molecular patterns activating immune cells via toll-like receptors, triggering cytokine storm (TNF-alpha, IL-1, IL-6) causing widespread endothelial dysfunction, vasodilation, capillary leak, microvascular thrombosis, and multi-organ failure. Septic shock is sepsis with persistent hypotension requiring vasopressors for MAP ≥65 AND lactate >2 mmol/L despite adequate fluid resuscitation. The Hour-1 Bundle (cultures, antibiotics, IV fluids, lactate, vasopressors) saves lives." },
    riskFactors: ["Extremes of age (neonates, elderly >65)","Immunocompromised state","Chronic diseases (diabetes, CKD, cirrhosis, COPD, CHF)","Invasive devices (catheters, central lines, ventilators)","Recent surgery or hospitalization","Skin breakdown (wounds, burns, pressure injuries)","IV drug use","Splenectomy"],
    diagnostics: ["qSOFA screening: RR ≥22, altered mental status, SBP ≤100 (≥2 = concerning)","Blood cultures (2 sets from different sites) BEFORE antibiotics","Serum lactate: >2 mmol/L = tissue hypoperfusion; >4 = severe","CBC with differential","BMP for renal function and electrolytes","Procalcitonin (elevated suggests bacterial infection)","Source-specific cultures and imaging"],
    management: ["Hour-1 Bundle: lactate, blood cultures, broad-spectrum antibiotics, IV crystalloid 30 mL/kg if hypotensive or lactate ≥4, vasopressors for MAP <65 after fluids","Antibiotics within 1 hour — each hour of delay increases mortality 7.6%","Norepinephrine first-line vasopressor for MAP ≥65","Source control: drain abscesses, remove infected devices","Re-measure lactate every 2-4 hours","Narrow antibiotics based on cultures"],
    nursingActions: ["Screen with qSOFA at regular intervals for at-risk patients","Obtain blood cultures BEFORE antibiotics (but never delay antibiotics for cultures)","Administer antibiotics within 1 hour of recognition","Monitor MAP, HR, RR, temperature, SpO2, urine output frequently","Monitor lactate trends and report","Administer IV fluids as ordered, monitor for overload","Report signs of deterioration immediately","Document all bundle interventions and timing"],
    assessmentFindings: ["Fever >38.3°C or hypothermia <36°C (hypothermia is worse prognostic sign)","Tachycardia >90 bpm","Tachypnea >22 breaths/min","Hypotension SBP <100 or MAP <65","Altered mental status","Warm, flushed skin early → cool, mottled skin late","Decreased urine output","Elevated lactate"],
    signs: {
      left: ["Early sepsis responsive to fluids","Lactate normalizing","BP improving with fluids","Mental status clearing","Source identified and antibiotics started"],
      right: ["Septic shock: MAP <65 despite fluids + lactate >2","Multi-organ dysfunction","Refractory hypotension despite vasopressors","DIC with active bleeding","Lactate >4 and rising"]
    },
    medications: [{
      name: "Norepinephrine",
      type: "Alpha-1 and beta-1 agonist (first-line vasopressor)",
      action: "Alpha-1 vasoconstriction restores vascular tone; beta-1 increases cardiac output; maintains MAP ≥65 in septic shock",
      sideEffects: "Tissue necrosis with extravasation, arrhythmias, peripheral ischemia",
      contra: "Must have central access for prolonged use (short-term peripheral acceptable)",
      pearl: "First-line vasopressor for septic shock; add vasopressin as second agent if dose exceeds 0.25-0.5 mcg/kg/min"
    }],
    pearls: ["Every HOUR of antibiotic delay increases sepsis mortality 7.6%","Obtain cultures BEFORE antibiotics but NEVER delay antibiotics for cultures","Lactate is the key marker — trend matters more than single value","Hypothermia (<36°C) is WORSE prognostic sign than fever","qSOFA is SCREENING, not diagnostic","Warm, flushed skin is EARLY sepsis; cold, mottled is LATE","Hour-1 Bundle must be INITIATED within first hour"],
    quiz: [{ question: "An elderly UTI patient has RR 24, new confusion, BP 95/60. qSOFA score and action?", options: ["qSOFA 1 — routine monitoring","qSOFA 3 — report immediately as possible sepsis","qSOFA 0 — normal findings","Wait 4 hours"], correct: 1, rationale: "All three qSOFA criteria met (RR ≥22, altered mental status, SBP ≤100). Score ≥2 requires immediate reporting for sepsis evaluation." },{ question: "Why obtain blood cultures BEFORE antibiotics?", options: ["Cultures are more important","Pre-antibiotic cultures better identify the organism for targeted therapy; but antibiotics should NEVER be delayed","Antibiotics interfere with blood draw","Cultures only accurate after antibiotics"], correct: 1, rationale: "Pre-antibiotic cultures have higher yield for pathogen identification. However, antibiotics save lives and must not be delayed." }]
  },
  "sepsis-cascade-patho-np": {
    title: "Sepsis Cascade Pathophysiology",
    cellular: { title: "Molecular Pathophysiology of Sepsis", content: "The sepsis cascade transforms localized infection into systemic inflammatory response with multi-organ dysfunction. PAMPs (LPS from gram-negatives, lipoteichoic acid from gram-positives) bind toll-like receptors (TLR4 for LPS) on innate immune cells, activating NF-κB signaling and releasing pro-inflammatory cytokines: TNF-alpha, IL-1β, IL-6 (cytokine storm). Effects: (1) Endothelial dysfunction — tissue factor activates coagulation, selectins recruit neutrophils, increased permeability causes capillary leak; (2) Vasodilation — iNOS produces massive nitric oxide causing profound refractory hypotension; (3) Microvascular thrombosis — DIC from tissue factor activation with consumption of protein C, antithrombin III; (4) Mitochondrial dysfunction — cytopathic hypoxia means cells cannot use oxygen even when delivery is adequate (explains paradoxically elevated ScvO2 in sepsis). The result is distributive shock with relative hypovolemia, microvascular ischemia, cellular energy failure, and multi-organ failure." },
    riskFactors: ["Gram-negative bacteremia (LPS is most potent PAMP)","Delayed antibiotic administration","Immunocompromised host","Large inoculum or virulent organisms","Inability to achieve source control","Genetic polymorphisms in immune response genes","Pre-existing organ dysfunction","Extremes of age"],
    diagnostics: ["Serum lactate: marker of tissue hypoperfusion (>2 = sepsis, >4 = severe)","Procalcitonin: elevated in bacterial sepsis, useful for de-escalation","Blood cultures for organism identification","SOFA score: quantifies organ dysfunction across 6 systems","Coagulation panel for DIC (elevated PT/INR, low fibrinogen, elevated D-dimer, low platelets)","ScvO2: paradoxically elevated in sepsis due to mitochondrial dysfunction","IL-6 levels correlate with mortality"],
    management: ["Hour-1 Bundle: lactate, cultures, antibiotics, 30 mL/kg crystalloid, vasopressors","Norepinephrine first-line; add vasopressin as second agent","Source control within 6-12 hours","Hydrocortisone 200 mg/day for refractory septic shock","Lung-protective ventilation for ARDS (6 mL/kg IBW tidal volume)","RRT for sepsis-associated AKI with refractory complications","Glucose management (target 140-180 mg/dL)","De-escalate antibiotics based on cultures"],
    nursingActions: ["Recognize early signs: tachycardia, tachypnea, fever/hypothermia, altered mental status","Implement Hour-1 Bundle without delay","Monitor MAP continuously — goal ≥65 mmHg","Track lactate clearance (≥10% decrease every 2 hours = improving)","Monitor for DIC: petechiae, oozing, falling platelets, rising INR","Assess end-organ function: urine output, mental status, liver enzymes, creatinine","Implement ventilator bundle if mechanically ventilated"],
    assessmentFindings: ["Hypotension, tachycardia, wide pulse pressure (early) → narrow (late)","Warm, flushed, bounding pulses (early) → cold, mottled, thready (late)","Elevated and rising lactate","Organ dysfunction: oliguria, hypoxemia, confusion, jaundice","DIC: petechiae, purpura, mucosal bleeding","Metabolic acidosis on ABG"],
    signs: {
      left: ["Early sepsis with bundle initiated within 1 hour","Lactate clearing","MAP ≥65 with initial fluids","Source control achieved"],
      right: ["Refractory septic shock despite fluids + norepinephrine + vasopressin","Multi-organ failure (ARDS + AKI + DIC)","Lactate rising despite treatment","DIC with hemorrhage","Sepsis-induced cardiomyopathy"]
    },
    medications: [{
      name: "Hydrocortisone (stress-dose steroids)",
      type: "Glucocorticoid",
      action: "Restores vascular sensitivity to catecholamines; reduces cytokine production; supports adrenal function during critical illness-related corticosteroid insufficiency",
      sideEffects: "Hyperglycemia, immunosuppression, GI bleeding, myopathy",
      contra: "Active fungal infection without antifungal coverage",
      pearl: "50 mg IV q6h for septic shock refractory to fluids and vasopressors; do NOT use for all sepsis; ACTH stimulation testing NOT needed; taper over 3-7 days"
    }],
    pearls: ["Sepsis cascade: infection → PAMPs → TLR activation → cytokine storm → endothelial dysfunction → vasodilation + leak + DIC + mitochondrial dysfunction → multi-organ failure","iNOS-produced NO causes profound vasodilation — why norepinephrine (vasoconstrictor) is first-line","Cytopathic hypoxia: cells cannot USE oxygen despite delivery — explains elevated ScvO2 in sepsis","Lactate reflects tissue hypoperfusion AND mitochondrial dysfunction — most important prognostic marker","DIC in sepsis: treat the underlying sepsis, not the DIC directly","Hydrocortisone only for vasopressor-REFRACTORY shock — not all sepsis"],
    quiz: [
      {
        question: "What causes the profound vasodilation in septic shock?",
        options: ["Decreased cardiac output","Massive nitric oxide production by iNOS causing vascular smooth muscle relaxation","Blood loss","Pulmonary embolism"],
        correct: 1,
        rationale: "Inflammatory cytokines upregulate iNOS, producing massive NO that relaxes vascular smooth muscle. This is why norepinephrine (vasoconstrictor) is first-line."
      },
      {
        question: "A septic patient's ScvO2 is 78% despite signs of tissue hypoperfusion. Explanation?",
        options: ["Patient is improving","Mitochondrial dysfunction prevents oxygen extraction (cytopathic hypoxia)","Monitor malfunction","Excessive oxygen delivery"],
        correct: 1,
        rationale: "Cytopathic hypoxia: damaged mitochondria cannot utilize oxygen, so venous O2 remains high despite tissue-level energy failure."
      },
      {
        question: "When is hydrocortisone indicated in sepsis?",
        options: ["All sepsis patients","Only for septic shock refractory to adequate fluids and vasopressors","All ICU patients","Only after ACTH stimulation test"],
        correct: 1,
        rationale: "Hydrocortisone 200 mg/day is for vasopressor-refractory septic shock. Not for all sepsis. ACTH testing is NOT required."
      },
    ]
  },
  "sepsis-diagnostic-criteria-np": {
    title: "Sepsis Diagnostic Criteria",
    cellular: { title: "Sepsis-3 Diagnostic Framework", content: "Sepsis-3 (2016) defined sepsis as 'life-threatening organ dysfunction caused by a dysregulated host response to infection,' replacing SIRS-based criteria. Key tools: (1) SOFA Score assesses 6 systems — respiratory (PaO2/FiO2), coagulation (platelets), liver (bilirubin), cardiovascular (MAP/vasopressors), CNS (GCS), renal (creatinine/UO). Acute increase ≥2 from baseline = sepsis. (2) qSOFA: bedside screening (RR ≥22, altered mentation, SBP ≤100); score ≥2 identifies high-risk patients but does NOT diagnose sepsis. (3) Septic Shock: sepsis + vasopressors for MAP ≥65 AND lactate >2 despite adequate resuscitation. SIRS criteria (temperature, HR, RR, WBC) are no longer used for sepsis diagnosis due to poor specificity. Sepsis is a CLINICAL diagnosis — no single test confirms it." },
    riskFactors: ["Documented or suspected infection","Organ dysfunction (new or worsening)","SOFA increase ≥2","Immunocompromised state","Invasive devices","Recent hospitalization or surgery","Extremes of age","Chronic organ dysfunction"],
    diagnostics: ["SOFA score calculation across 6 organ systems","qSOFA bedside screen: RR ≥22, altered mental status, SBP ≤100","Blood cultures ≥2 sets before antibiotics","Serum lactate (>2 = hypoperfusion; >4 = severe)","Procalcitonin for bacterial vs. non-bacterial differentiation","Source-specific cultures and imaging","CBC, BMP, LFTs, coagulation panel"],
    management: ["Suspected infection + SOFA increase ≥2 = sepsis","Initiate Hour-1 Bundle: lactate, cultures, antibiotics, IV crystalloid 30 mL/kg if hypotensive or lactate ≥4, vasopressors for MAP <65","Select empiric antibiotics based on suspected source and local resistance","Source control within 6-12 hours","Reassess after initial resuscitation","De-escalate antibiotics based on cultures (7-10 day course)","Septic shock = vasopressors for MAP ≥65 AND lactate >2 despite adequate volume"],
    nursingActions: ["Calculate and document SOFA score on admission and with clinical changes","Apply qSOFA screening for at-risk patients regularly","Collect blood cultures from 2 sites before antibiotics","Measure and trend lactate initially and every 2-4 hours","Implement Hour-1 Bundle without delay","Document timing of all bundle components","Monitor for progression from sepsis to septic shock"],
    assessmentFindings: ["SOFA ≥2 increase = organ dysfunction from sepsis","qSOFA ≥2 = needs urgent evaluation","Clinical infection signs: fever/hypothermia, localizing signs","Organ dysfunction: altered mental status, hypotension, hypoxemia, oliguria, jaundice, petechiae","Elevated lactate","Positive blood cultures"],
    signs: {
      left: ["Suspected infection with low qSOFA — low risk","Sepsis identified early with Hour-1 Bundle initiated","Lactate normalizing","Source identified and controlled"],
      right: ["Septic shock: vasopressors + lactate >2 despite resuscitation","Rapidly progressing multi-organ failure","Culture-negative sepsis","Antibiotic-resistant organism","Failed source control"]
    },
    medications: [{
      name: "Piperacillin-Tazobactam (Zosyn)",
      type: "Extended-spectrum penicillin / beta-lactamase inhibitor",
      action: "Piperacillin inhibits cell wall synthesis; tazobactam inhibits beta-lactamases; broad coverage including Pseudomonas and anaerobes",
      sideEffects: "Diarrhea, nausea, C. difficile, thrombocytopenia",
      contra: "Penicillin allergy with anaphylaxis",
      pearl: "Common empiric for intra-abdominal sepsis and healthcare-associated infections; 4.5g IV q6h; often combined with vancomycin for MRSA coverage; adjust for renal impairment"
    }],
    pearls: ["Sepsis-3: suspected infection + SOFA increase ≥2 = sepsis; SIRS no longer diagnostic","qSOFA is SCREENING (identifies risk) — SOFA ≥2 IS diagnostic","Septic shock requires BOTH: vasopressors for MAP ≥65 AND lactate >2 despite resuscitation","Lactate >2 = hypoperfusion; serial trending is best treatment response indicator","Hour-1 Bundle must be INITIATED within first hour","SIRS criteria lack specificity — many non-infectious conditions trigger SIRS","Each hour of antibiotic delay increases mortality ~7.6%"],
    quiz: [
      {
        question: "According to Sepsis-3, what defines sepsis?",
        options: ["Meeting 2 of 4 SIRS criteria","Suspected infection with SOFA increase ≥2","Positive blood cultures alone","Fever and tachycardia"],
        correct: 1,
        rationale: "Sepsis-3 defines sepsis as suspected/documented infection with acute SOFA increase ≥2, indicating organ dysfunction."
      },
      {
        question: "What defines septic shock per Sepsis-3?",
        options: ["Any hypotension with infection","Vasopressor requirement for MAP ≥65 AND lactate >2 despite adequate resuscitation","Fever with tachycardia","qSOFA of 3"],
        correct: 1,
        rationale: "Septic shock requires BOTH vasopressor dependence for MAP ≥65 AND lactate >2 despite adequate volume resuscitation."
      },
      {
        question: "A patient has suspected pneumonia, qSOFA 2, SOFA increase 3, lactate 4.2, BP 85/50. Diagnosis and priority?",
        options: ["Simple pneumonia — oral antibiotics","Sepsis progressing to shock — initiate Hour-1 Bundle immediately","URI — discharge","Wait for cultures"],
        correct: 1,
        rationale: "This patient has sepsis (SOFA increase ≥2) progressing toward septic shock (hypotension, high lactate). Hour-1 Bundle must be initiated immediately."
      },
    ]
  },
  "septic-arthritis-np": {
    title: "Septic Arthritis",
    cellular: { title: "Septic Arthritis Pathophysiology", content: "Septic arthritis is a joint infection that constitutes a medical emergency because bacteria rapidly destroy articular cartilage through enzymatic degradation within 24-48 hours if untreated. The most common pathogen is Staphylococcus aureus (including MRSA) in adults. Neisseria gonorrhoeae is most common in sexually active young adults. Infection reaches the joint via hematogenous seeding (most common), direct inoculation, or contiguous spread. The synovial membrane lacks a basement membrane, making it vulnerable to bacterial seeding. The inflammatory response (neutrophil influx, protease activation) causes rapid cartilage destruction. Diagnosis requires arthrocentesis: synovial fluid WBC >50,000 with >90% PMNs is highly suggestive; Gram stain positive in 50-75% of non-gonococcal cases; culture is the gold standard. Treatment: emergent joint drainage plus IV antibiotics." },
    riskFactors: ["Pre-existing joint disease (RA, OA)","Prosthetic joint","IV drug use","Diabetes mellitus","Immunosuppression (steroids, biologics, HIV)","Recent joint surgery or injection","Skin infection or bacteremia","Age >80","Sexual activity (gonococcal arthritis)"],
    diagnostics: ["Arthrocentesis — MANDATORY: synovial fluid cell count, Gram stain, culture, crystal analysis","Synovial fluid: WBC >50,000/mm³ with >90% PMNs; >100,000 virtually diagnostic","Gram stain: positive 50-75% (non-gonococcal)","Synovial fluid culture: gold standard (90% positive non-gonococcal)","Blood cultures: positive 50-70%","Crystal analysis to rule out gout/pseudogout (can coexist with infection)","ESR/CRP: elevated, useful for monitoring response","X-ray: effusion and soft tissue swelling; MRI for suspected osteomyelitis"],
    management: ["Emergency joint drainage: repeated arthrocentesis or surgical washout","Empiric IV antibiotics: vancomycin + ceftriaxone (MRSA + gram-negative coverage)","Gonococcal arthritis: ceftriaxone 1g IV daily","Adjust based on cultures; 2-4 weeks IV for non-gonococcal","Prosthetic joint infection: usually requires surgical debridement or removal + prolonged antibiotics","Physical therapy for ROM preservation","Serial aspirations to monitor WBC decline"],
    nursingActions: ["Assist with emergency arthrocentesis: sterile field, position, specimen collection","Send synovial fluid for cell count, Gram stain, culture AND crystal analysis","Administer IV antibiotics promptly after aspiration","Assess joint: warmth, erythema, swelling, ROM limitation, pain with passive movement","Monitor for systemic infection: fever, tachycardia, hypotension","Manage pain adequately — joint is extremely painful","Monitor inflammatory markers to track response"],
    assessmentFindings: ["Acute monoarticular arthritis (knee most common)","Hot, erythematous, swollen, exquisitely tender joint","Severe pain with passive ROM (hallmark)","Joint held in comfort position (knee flexed, hip flexed/externally rotated)","Fever (~60%)","Inability to bear weight","Gonococcal: migratory polyarthritis, tenosynovitis, vesiculopustular skin lesions"],
    signs: {
      left: ["Acute monoarthritis responding to antibiotics and drainage","Gram stain/culture identify organism","Serial aspirations show declining WBC","Fever resolving within 48-72 hours","ROM improving"],
      right: ["Delayed diagnosis with irreversible cartilage destruction","Prosthetic joint infection requiring removal","Concurrent osteomyelitis","Septic shock from bacteremia","Gonococcal disseminated infection"]
    },
    medications: [{
      name: "Vancomycin + Ceftriaxone",
      type: "Empiric antibiotic combination",
      action: "Vancomycin covers gram-positives including MRSA; ceftriaxone covers gram-negatives and gonococcus",
      sideEffects: "Vancomycin: nephrotoxicity, ototoxicity, red man syndrome; Ceftriaxone: diarrhea, biliary sludging",
      contra: "Vancomycin: hypersensitivity; Ceftriaxone: severe penicillin allergy with anaphylaxis",
      pearl: "Vancomycin trough 15-20 mcg/mL for serious infections; narrow based on cultures; total duration 2-4 weeks IV for non-gonococcal"
    }],
    pearls: ["Septic arthritis is a MEDICAL EMERGENCY — cartilage destruction within 24-48 hours","Knee is most commonly affected (>50%)","Synovial fluid WBC >50,000 with >90% PMNs is highly suspicious; >100,000 virtually diagnostic","Gout/pseudogout can mimic AND coexist with infection — always send crystals AND culture","Gonococcal arthritis: migratory polyarthritis with tenosynovitis and vesiculopustular skin lesions","Negative Gram stain does NOT rule out infection — culture is gold standard","A hot, painful prosthetic joint is septic until proven otherwise"],
    quiz: [
      {
        question: "A patient with RA has an acutely hot, swollen, painful knee with fever. Most important next step?",
        options: ["Start oral antibiotics","Emergency arthrocentesis for synovial fluid analysis","Apply ice and elevate","Order MRI first"],
        correct: 1,
        rationale: "This presentation demands emergent arthrocentesis. Synovial fluid analysis (WBC, Gram stain, culture, crystals) is mandatory. Delay causes irreversible cartilage destruction."
      },
      {
        question: "Synovial fluid shows WBC 85,000 with 95% PMNs, gram-positive cocci in clusters, no crystals. Diagnosis?",
        options: ["Gout","Septic arthritis — S. aureus; start vancomycin and arrange drainage","Osteoarthritis","Pseudogout"],
        correct: 1,
        rationale: "High WBC (85,000) with 95% PMNs and gram-positive cocci in clusters (S. aureus) is diagnostic. Treatment: IV vancomycin + joint drainage."
      },
      {
        question: "Why order crystal analysis when septic arthritis is suspected?",
        options: ["Crystals always cause joint inflammation","Crystal disease can mimic AND coexist with infection — both must be evaluated","Crystal analysis replaces culture","Crystals only found in septic arthritis"],
        correct: 1,
        rationale: "Gout and pseudogout present identically to septic arthritis and can coexist in the same joint. Always send both crystal analysis and culture."
      },
    ]
  },
  "serotonergic-toxidrome-np": {
    title: "Serotonin Syndrome",
    cellular: { title: "Serotonin Syndrome Pathophysiology", content: "Serotonin syndrome is caused by excess serotonergic activity at central and peripheral 5-HT1A and 5-HT2A receptors. It results from drug interactions increasing serotonin: increased synthesis (L-tryptophan), increased release (amphetamines, MDMA), decreased reuptake (SSRIs, SNRIs, TCAs, tramadol, dextromethorphan, St. John's Wort), decreased metabolism (MAOIs — most dangerous), or direct agonism (triptans, buspirone, fentanyl). The most dangerous combination is MAOI + SSRI/SNRI. The classic triad: (1) Altered mental status (agitation, confusion), (2) Autonomic instability (hyperthermia, tachycardia, diaphoresis, hypertension, mydriasis, diarrhea), (3) Neuromuscular hyperactivity (clonus — hallmark finding, hyperreflexia, myoclonus, tremor). The Hunter Criteria require a serotonergic agent plus: spontaneous clonus, inducible clonus + agitation/diaphoresis, ocular clonus + agitation/diaphoresis, tremor + hyperreflexia, or hypertonia + temperature >38°C + clonus. CLONUS distinguishes serotonin syndrome from NMS (which has lead-pipe rigidity and bradykinesia, NOT clonus)." },
    riskFactors: ["Concurrent use of ≥2 serotonergic agents","MAOI + SSRI/SNRI (most dangerous — potentially fatal)","SSRI + tramadol (commonly overlooked)","SSRI + dextromethorphan (OTC cold medications)","SSRI + St. John's Wort","SSRI + linezolid (has MAOI activity)","SSRI + methylene blue (has MAOI activity)","MDMA (ecstasy), cocaine, amphetamines","Recent SSRI dose increase"],
    diagnostics: ["Hunter Criteria (clinical diagnosis)","Key findings: clonus (spontaneous, inducible, ocular), hyperreflexia, tremor, mydriasis, diaphoresis","Medication history review: ALL serotonergic agents including OTC and herbal","Temperature monitoring (>38°C = moderate; >41°C = severe)","CK level (rhabdomyolysis risk)","BMP for metabolic acidosis, hyperkalemia","Coagulation studies for DIC in severe cases","Serotonin levels are NOT useful — diagnosis is clinical"],
    management: ["DISCONTINUE all serotonergic agents immediately — most important intervention","Mild: discontinue drugs + supportive care + benzodiazepines; resolves 24-72 hours","Moderate: benzodiazepines for agitation and neuromuscular hyperactivity","Severe: cyproheptadine (5-HT2A antagonist) 12 mg initially, then 2 mg q2h","Aggressive cooling for hyperthermia — antipyretics are NOT effective (heat from muscle activity)","IV fluids for rhabdomyolysis prevention","Severe rigidity with temp >41°C: intubation and neuromuscular paralysis","Avoid physical restraints (worsen hyperthermia by increasing muscle activity)"],
    nursingActions: ["Identify and discontinue all serotonergic agents immediately","Assess classic triad: altered mental status + autonomic instability + neuromuscular hyperactivity","Test for clonus: dorsiflex foot, observe for sustained rhythmic contractions","Monitor temperature closely — >41°C is emergency","Administer benzodiazepines and cyproheptadine as ordered","Implement aggressive cooling (NOT antipyretics)","Monitor CK, renal function, urine output for rhabdomyolysis","AVOID physical restraints — worsen hyperthermia"],
    assessmentFindings: ["Clonus: spontaneous, inducible, and/or ocular — HALLMARK finding","Hyperreflexia (especially lower extremities)","Tremor (more in lower extremities)","Agitation, confusion, delirium","Profuse diaphoresis","Mydriasis","Hyperthermia","Tachycardia and hypertension","Diarrhea and hyperactive bowel sounds"],
    signs: {
      left: ["Mild: tremor, hyperreflexia, mild agitation","Resolving within 24 hours of drug discontinuation","Normal temperature","No clonus"],
      right: ["Severe hyperthermia >41°C with sustained clonus","Rhabdomyolysis (CK >10,000, dark urine, renal failure)","DIC","Status epilepticus","Cardiovascular collapse"]
    },
    medications: [{
      name: "Cyproheptadine",
      type: "5-HT2A receptor antagonist / antihistamine",
      action: "Competitive antagonist at 5-HT2A receptors, directly blocking excess serotonergic activity",
      sideEffects: "Sedation (therapeutic in serotonin syndrome), dry mouth, urinary retention",
      contra: "Narrow-angle glaucoma, urinary retention",
      pearl: "Only available ORALLY — 12 mg initial, 2 mg q2h until improvement (max 32 mg/day); must give via NG tube if patient cannot swallow; sedation is actually beneficial"
    }],
    pearls: ["CLONUS is the hallmark distinguishing serotonin syndrome from NMS","Serotonin syndrome: clonus, hyperreflexia, tremor (HYPERACTIVITY); NMS: lead-pipe rigidity, bradykinesia (HYPOACTIVITY)","Serotonin syndrome develops RAPIDLY (hours); NMS develops SLOWLY (days to weeks)","MAOI + SSRI is the most dangerous combination — 14-day washout required (5 weeks for fluoxetine)","Antipyretics are INEFFECTIVE — heat is from muscle activity, not hypothalamic dysregulation","Tramadol is a commonly overlooked serotonergic drug","Linezolid and methylene blue have MAOI activity"],
    quiz: [
      {
        question: "A patient on sertraline was prescribed tramadol. They now have agitation, diaphoresis, mydriasis, and bilateral ankle clonus. Most likely diagnosis?",
        options: ["NMS","Serotonin syndrome — sertraline (SSRI) + tramadol (serotonin reuptake inhibitor)","Anticholinergic toxicity","Malignant hyperthermia"],
        correct: 1,
        rationale: "Classic triad with clonus (hallmark) caused by combining two serotonergic agents."
      },
      {
        question: "What distinguishes serotonin syndrome from NMS?",
        options: ["Fever","Altered mental status","Clonus and hyperreflexia (serotonin syndrome) vs. lead-pipe rigidity and hyporeflexia (NMS)","Tachycardia"],
        correct: 2,
        rationale: "Serotonin syndrome has neuromuscular HYPERACTIVITY (clonus, hyperreflexia, tremor); NMS has HYPOACTIVITY (rigidity, bradykinesia, hyporeflexia)."
      },
      {
        question: "A patient with severe serotonin syndrome has temp 41.5°C. Acetaminophen doesn't work. Why?",
        options: ["Dose too low","Hyperthermia is from muscle activity, not hypothalamic dysregulation — need cooling and benzodiazepines","Allergy","Takes 24 hours"],
        correct: 1,
        rationale: "Serotonin syndrome hyperthermia results from muscle hyperactivity (clonus, tremor), not hypothalamic set-point elevation. Antipyretics are ineffective. Treatment: reduce muscle activity (benzodiazepines) + external cooling."
      },
    ]
  }
};
