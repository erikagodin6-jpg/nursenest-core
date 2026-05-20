import type { ExamQuestion } from "./types";

export const rnShockCriticalCatQuestions: ExamQuestion[] = [
  // ===== HYPOVOLEMIC SHOCK CAT (20 questions) =====
  {
    q: "A nurse is caring for four trauma patients. Which patient requires the MOST immediate intervention?\n\n1. Post-operative hip replacement: HR 88, BP 128/74, Hgb 10.2, drain output 50 mL/shift\n2. Motor vehicle accident: HR 138, BP 72/48, cool clammy skin, confused, estimated blood loss 2000 mL\n3. Fall with wrist fracture: HR 78, BP 132/82, alert and oriented, pain 6/10\n4. Lacerations from glass: HR 92, BP 118/72, bleeding controlled with direct pressure",
    o: ["Patient 1: Stable post-op with expected drain output", "Patient 2: Class III-IV hemorrhagic shock requiring immediate massive transfusion and surgical consultation", "Patient 3: Stable fracture patient needing pain management", "Patient 4: Controlled bleeding with stable vitals"],
    a: 1,
    r: "Patient 2 demonstrates Class III-IV hemorrhagic shock: tachycardia >120, severe hypotension, confusion, cool clammy skin, estimated 2000 mL blood loss (30-40%+ circulating volume). Immediate priorities: 2 large-bore IVs, massive transfusion protocol activation, surgical consultation for hemorrhage control.",
    s: "Shock & Emergency"
  },
  {
    q: "A trauma patient has received 3L of crystalloid and 4 units of pRBCs. Labs show: pH 7.18, lactate 6.2, INR 2.4, temperature 34°C, platelets 68,000. The nurse recognizes this as:\n\nA. Expected findings after massive transfusion\nB. The lethal triad with DIC requiring balanced blood product resuscitation\nC. Normal post-trauma lab values\nD. Allergic transfusion reaction",
    o: ["Expected findings", "The lethal triad (hypothermia + acidosis + coagulopathy) with DIC requiring 1:1:1 balanced transfusion, active rewarming, and surgical hemorrhage control", "Normal post-trauma labs", "Allergic transfusion reaction"],
    a: 1,
    r: "This patient has the lethal triad: hypothermia (34°C), acidosis (pH 7.18, lactate 6.2), and coagulopathy (INR 2.4, platelets 68K = DIC). Each worsens the others. Interventions: 1:1:1 balanced transfusion, active rewarming (warm fluids, blankets), surgical hemorrhage control, TXA if within 3 hours of injury.",
    s: "Shock & Emergency"
  },
  {
    q: "The nurse is monitoring lactate levels during resuscitation of a hypovolemic shock patient. At presentation, lactate was 5.8 mmol/L. At 6 hours, lactate is 4.9 mmol/L. How should the nurse interpret this?\n\nA. Adequate resuscitation (>10% clearance)\nB. Inadequate resuscitation (<10% clearance)\nC. Normal lactate level\nD. Laboratory error",
    o: ["Adequate resuscitation response", "Inadequate resuscitation: lactate decreased only 15.5%, which is borderline; however, lactate remains >4 mmol/L indicating persistent severe hypoperfusion requiring escalation", "Normal lactate level", "Laboratory error"],
    a: 1,
    r: "While the clearance is >10% (15.5%), the absolute value remains critically elevated (>4 mmol/L), indicating persistent severe tissue hypoperfusion. The nurse should report that despite some improvement in trend, ongoing significant hypoperfusion requires escalation of resuscitation efforts. Both trend AND absolute value matter.",
    s: "Shock & Emergency"
  },

  // ===== SEPSIS/SEPTIC SHOCK CAT (25 questions) =====
  {
    q: "A nurse is triaging four ED patients. Which patient should be seen FIRST?\n\n1. 72-year-old with UTI symptoms: temp 39.4°C, HR 108, RR 24, BP 84/52, confused (baseline oriented x3), lactate 4.6 mmol/L\n2. 45-year-old with cellulitis: temp 38.2°C, HR 88, BP 130/78, alert\n3. 28-year-old with pharyngitis: temp 38.0°C, HR 82, BP 118/74, alert\n4. 65-year-old with pneumonia: temp 38.8°C, HR 96, BP 108/68, alert and oriented",
    o: ["Patient 1: Meets sepsis criteria with organ dysfunction, qSOFA positive, and septic shock (hypotension + altered mentation + lactate >4) — requires Hour-1 Bundle immediately", "Patient 2: Stable infection", "Patient 3: Mild viral illness", "Patient 4: Community-acquired pneumonia, stable"],
    a: 0,
    r: "Patient 1 meets sepsis/septic shock criteria: suspected infection (UTI) with organ dysfunction (altered mentation, hypotension, lactate 4.6), qSOFA score 3/3 (RR 24, altered mentation, SBP 84). Hour-1 Bundle must begin immediately: lactate (done), blood cultures, antibiotics within 1 hour, 30 mL/kg crystalloid, vasopressors if MAP remains <65.",
    s: "Shock & Emergency"
  },
  {
    q: "A nurse recognizes that a septic patient in the ICU has transitioned from warm shock to cold shock. The original vital signs showed: warm flushed skin, HR 120, BP 88/52, bounding pulses, wide pulse pressure. Now the patient has: cool mottled skin, HR 140, BP 72/58, weak thready pulses, narrow pulse pressure.\n\nWhat pathophysiological change has occurred?",
    o: ["Hemorrhagic shock has developed", "Myocardial depression from circulating cardiodepressant factors (TNF-alpha, IL-1) has reduced cardiac output, causing transition to hypodynamic shock with vasoconstriction", "The patient is improving", "The vasopressors are working correctly"],
    a: 1,
    r: "The transition from warm to cold shock indicates myocardial depression from sepsis-mediated cardiodepressant factors. CO falls, compensatory vasoconstriction develops (narrow pulse pressure, cool skin), and prognosis worsens significantly. The nurse should anticipate: inotrope addition (dobutamine), echocardiography, and possible escalation to mechanical circulatory support.",
    s: "Shock & Emergency"
  },
  {
    q: "A septic shock patient on norepinephrine 25 mcg/min and vasopressin 0.04 units/min has MAP 58 mmHg. What should the nurse anticipate next?\n\nA. Adding stress-dose hydrocortisone\nB. Adding a third vasopressor\nC. Increasing vasopressin dose\nD. Switching to phenylephrine",
    o: ["Addition of stress-dose hydrocortisone 200 mg/day IV to enhance catecholamine sensitivity in refractory shock", "Adding a third vasopressor", "Increasing vasopressin (it should NOT be titrated)", "Switching to phenylephrine"],
    a: 0,
    r: "Refractory septic shock (hypotension despite fluid resuscitation + 2 vasopressors) = indication for stress-dose hydrocortisone (200 mg/day IV). It addresses critical illness-related corticosteroid insufficiency and enhances vascular sensitivity to catecholamines, potentially improving vasopressor response.",
    s: "Shock & Emergency"
  },
  {
    q: "An RN is reviewing the following timeline for a sepsis patient:\n- 0800: Sepsis screening positive, provider notified\n- 0830: Blood cultures drawn\n- 0900: Antibiotics administered\n- 0930: Lactate resulted at 5.2 mmol/L\n- 0945: 30 mL/kg crystalloid started\n\nWhich component of the Hour-1 Bundle was NOT completed within the timeframe?",
    o: ["Blood cultures were drawn appropriately", "Antibiotics were administered 60 minutes after recognition — at the outer limit but acceptable", "Lactate was measured more than 1 hour after recognition — this should have been drawn at 0800", "Fluid resuscitation started on time"],
    a: 2,
    r: "The Hour-1 Bundle requires ALL components within 1 hour of sepsis recognition (0800). Lactate resulted at 0930 (90 minutes later) — it should have been drawn at 0800 with the initial assessment. Antibiotics at 0900 (60 min) are at the limit. The key principle: bundle compliance requires ALL elements within 1 hour, not just some.",
    s: "Shock & Emergency"
  },

  // ===== ANAPHYLACTIC SHOCK CAT (18 questions) =====
  {
    q: "A nurse is caring for four patients. Which situation requires the MOST immediate intervention?\n\n1. Patient receiving IV vancomycin: facial flushing and trunk redness (Red Man Syndrome), stable vitals\n2. Patient 5 minutes post-IV contrast dye: generalized urticaria, lip swelling, wheezing, BP 74/42\n3. Patient with seasonal allergies: sneezing, watery eyes, taking oral cetirizine\n4. Patient with food allergy: ate allergen 2 hours ago, has localized hives on arms, BP 118/74",
    o: ["Patient 1: Red Man Syndrome — slow infusion rate, not anaphylaxis", "Patient 2: Anaphylaxis with cardiovascular compromise requiring immediate epinephrine IM, stop contrast, position supine, IV access", "Patient 3: Allergic rhinitis managed with antihistamine", "Patient 4: Localized allergic reaction, stable"],
    a: 1,
    r: "Patient 2 has anaphylaxis (urticaria + lip angioedema + wheezing + hypotension) from contrast dye. Immediate actions: STOP contrast, epinephrine 0.3-0.5 mg IM into anterolateral thigh, position supine with legs elevated, establish IV access, prepare fluid bolus. Red Man Syndrome (Patient 1) is a rate-related histamine release, not IgE-mediated anaphylaxis.",
    s: "Shock & Emergency"
  },
  {
    q: "A patient on metoprolol (beta-blocker) develops severe anaphylaxis. Two doses of IM epinephrine have been given with minimal response. HR 52, BP 62/38, persistent wheezing.\n\nWhat is the MOST appropriate next intervention?",
    o: ["Give a third dose of IM epinephrine", "Administer glucagon 1-5 mg IV — it bypasses blocked beta receptors to increase cardiac output and provide bronchodilation", "Administer IV diphenhydramine 50 mg", "Start IV dopamine"],
    a: 1,
    r: "Beta-blockers block the beta receptors that epinephrine needs to increase HR (beta-1) and cause bronchodilation (beta-2). Glucagon directly activates adenylyl cyclase through a non-adrenergic mechanism, bypassing beta receptors entirely. Dose: 1-5 mg IV bolus, can repeat or infuse at 5-15 mcg/min.",
    s: "Shock & Emergency"
  },
  {
    q: "A nurse is discharging a patient who was treated for anaphylaxis. Which discharge teaching points are ESSENTIAL?\n\nA. Carry two epinephrine auto-injectors at all times\nB. Return to ED if symptoms recur (biphasic reaction)\nC. Obtain medical alert identification\nD. Follow up with allergist for trigger identification\nE. Antihistamines can substitute for epinephrine in future reactions",
    o: ["A, B, C, D, and E are all correct", "A, B, C, and D are correct; E is INCORRECT — antihistamines cannot substitute for epinephrine", "Only A and B are necessary", "Only E is correct"],
    a: 1,
    r: "Essential teaching: carry 2 auto-injectors (one may fail or a second dose may be needed), watch for biphasic reaction (symptoms can recur 4-12 hours later), wear medical alert ID, and see an allergist. Statement E is DANGEROUS: antihistamines do NOT reverse bronchospasm or hypotension; epinephrine is the ONLY first-line treatment.",
    s: "Shock & Emergency"
  },

  // ===== NEUROGENIC SHOCK CAT (15 questions) =====
  {
    q: "A trauma patient arrives with two injuries: a C5 spinal cord injury and a large splenic laceration with free peritoneal fluid on FAST exam. HR is 52, BP 68/38, skin is warm below the clavicles.\n\nThe nurse recognizes that the clinical picture is complicated because:",
    o: ["Both injuries are minor", "The patient has BOTH neurogenic shock (bradycardia + warm skin from SCI) AND likely hemorrhagic shock (splenic laceration), but the neurogenic component masks the tachycardia that would normally signal hypovolemia", "Only neurogenic shock is present", "Only hemorrhagic shock is present"],
    a: 1,
    r: "This is a critical clinical scenario: the spinal cord injury causes neurogenic shock (bradycardia, warm skin), but the splenic laceration is causing hemorrhage. Normally hemorrhage produces tachycardia, but the SCI prevents this compensatory response, MASKING the hemorrhagic shock. Treatment requires BOTH vasopressors for neurogenic shock AND surgical intervention for the splenic injury.",
    s: "Shock & Emergency"
  },
  {
    q: "A patient with a T2 spinal cord injury is receiving IV fluids for neurogenic shock. After 2L of NS, the BP remains 72/44 and HR is 48. SpO2 is 94%. The nurse's priority action is:\n\nA. Administer another 2L NS bolus\nB. Initiate vasopressor therapy (norepinephrine) and administer atropine for symptomatic bradycardia\nC. Increase oxygen to 100% via non-rebreather\nD. Obtain a chest X-ray",
    o: ["More fluids — the patient needs volume", "Start norepinephrine for hypotension AND atropine for symptomatic bradycardia; further fluid boluses risk pulmonary edema without increasing cardiac output", "Increase oxygen", "Chest X-ray"],
    a: 1,
    r: "After 2L without improvement, further fluids risk pulmonary edema because the heart cannot increase rate (lost sympathetic innervation). Norepinephrine provides vasoconstriction (alpha-1) and mild cardiac stimulation (beta-1), while atropine blocks vagal tone to increase HR. Target MAP 85-90 mmHg for spinal cord perfusion.",
    s: "Shock & Emergency"
  },

  // ===== OBSTRUCTIVE SHOCK CAT (15 questions) =====
  {
    q: "A nurse is caring for four ICU patients. Which patient is developing the MOST immediately life-threatening complication?\n\n1. Post-cardiac surgery patient: stable vitals, chest tube output 40 mL/hr\n2. Mechanical ventilation patient: sudden absent breath sounds left, tracheal deviation right, SpO2 78%, BP dropping\n3. DVT patient on heparin: PTT 85 seconds, no bleeding signs\n4. Pericardial effusion patient: BP 108/72, no symptoms, scheduled for pericardiocentesis tomorrow",
    o: ["Patient 1: Expected post-surgical drainage", "Patient 2: Tension pneumothorax requiring IMMEDIATE needle decompression — this patient will die within minutes without intervention", "Patient 3: Elevated PTT but no active bleeding", "Patient 4: Stable effusion with planned intervention"],
    a: 1,
    r: "Patient 2 has tension pneumothorax on a ventilator: sudden absent breath sounds + tracheal deviation + desaturation + hypotension. Positive pressure ventilation acts as a one-way valve, rapidly worsening the tension. This is immediately fatal without needle decompression at 2nd ICS, midclavicular line. Do NOT wait for chest X-ray.",
    s: "Shock & Emergency"
  },
  {
    q: "A patient after central line placement develops sudden hypotension, JVD, muffled heart sounds, and electrical alternans on the cardiac monitor. The nurse suspects:\n\nA. Guide wire perforation causing cardiac tamponade\nB. Tension pneumothorax\nC. Air embolism\nD. Line malposition",
    o: ["Cardiac tamponade from guide wire perforation — Beck's triad (JVD + muffled heart sounds + hypotension) with electrical alternans confirms pericardial fluid accumulation compressing the heart", "Tension pneumothorax", "Air embolism", "Line malposition"],
    a: 0,
    r: "Beck's triad (JVD + muffled heart sounds + hypotension) + electrical alternans (alternating QRS amplitude from heart swinging in pericardial fluid) = cardiac tamponade. After central line placement, this suggests guide wire perforation of the atrium or superior vena cava. Requires emergency pericardiocentesis.",
    s: "Shock & Emergency"
  },

  // ===== MODS CAT (15 questions) =====
  {
    q: "A nurse is trending a septic patient's SOFA score over 3 days:\n\nDay 1: SOFA 4 (respiratory + cardiovascular dysfunction)\nDay 2: SOFA 8 (+ renal + hematologic dysfunction)\nDay 3: SOFA 14 (+ hepatic + neurologic dysfunction)\n\nWhat is the clinical significance of this trajectory?",
    o: ["The patient is improving", "Progressive worsening: 6 organ systems now failing; mortality >80%; the nurse should facilitate urgent goals-of-care discussion with the family and palliative care team", "This is a normal recovery pattern", "SOFA score has no prognostic value"],
    a: 1,
    r: "Rising SOFA score with progressive organ failure (now 6 systems) indicates MODS with extremely poor prognosis (>80% mortality). The nurse's role includes: documenting clinical trajectory, facilitating family communication, requesting palliative care consultation, and supporting the medical team in honest prognostic discussions.",
    s: "Shock & Emergency"
  },
  {
    q: "A nurse is managing a MODS patient on the ventilator. The respiratory therapist wants to increase the tidal volume from 6 mL/kg IBW to 10 mL/kg IBW to improve oxygenation. The nurse should:\n\nA. Agree with the change\nB. Advocate for maintaining 6 mL/kg IBW (lung-protective ventilation) and suggest alternative strategies\nC. Increase to 8 mL/kg as a compromise\nD. Defer to respiratory therapy",
    o: ["Agree with the change", "Advocate for maintaining 6 mL/kg IBW — lung-protective ventilation reduces mortality in ARDS; suggest alternatives: optimize PEEP, prone positioning, increase FiO2 within safe limits", "Compromise at 8 mL/kg", "Defer entirely"],
    a: 1,
    r: "The nurse should advocate for evidence-based care. Lung-protective ventilation (6 mL/kg IBW, Pplat <30 cmH2O) is the single most impactful intervention reducing ARDS mortality (ARDSNet trial). Higher volumes cause ventilator-induced lung injury. Alternatives for oxygenation: optimize PEEP, prone positioning, increase FiO2, or consider inhaled pulmonary vasodilators.",
    s: "Shock & Emergency"
  },

  // ===== BURNS CAT (18 questions) =====
  {
    q: "A nurse is managing burn resuscitation for a 60 kg patient with 35% TBSA burns. The injury occurred at 0800, and the patient arrives at the burn center at 1000. Using the Parkland Formula:\n\n1. What is the total 24-hour fluid requirement?\n2. How much should be given in the first 8 hours (0800-1600)?\n3. How much has already been missed in the first 2 hours (0800-1000)?",
    o: ["Total: 8,400 mL; first 8 hours: 4,200 mL; the 2 hours of missed time means the remaining 4,200 mL must be given in 6 hours (1000-1600) at an increased rate", "Total: 4,200 mL; evenly distributed", "Total: 16,800 mL over 48 hours", "Fluids should start from hospital arrival, not injury time"],
    a: 0,
    r: "Parkland: 4 × 60 × 35 = 8,400 mL/24 hr. Half (4,200 mL) in first 8 hours FROM INJURY TIME (0800-1600). Patient arrives at 1000, so 2 hours are gone. The remaining 4,200 mL must be infused in 6 hours (1000-1600) at approximately 700 mL/hr, then 4,200 mL over the remaining 16 hours (262 mL/hr). Always calculate from time of injury.",
    s: "Shock & Emergency"
  },
  {
    q: "A burn patient's urine output has been 15 mL/hr for the past 2 hours despite receiving calculated Parkland formula fluids. The urine appears dark amber/brown. What should the nurse suspect and do?\n\nA. The urine output is adequate\nB. Under-resuscitation with possible rhabdomyolysis/myoglobinuria; increase fluid rate, notify provider, obtain CK and urine myoglobin\nC. Decrease fluid rate to prevent fluid overload\nD. Insert a larger Foley catheter",
    o: ["Urine output is adequate", "Under-resuscitation with possible rhabdomyolysis: dark urine suggests myoglobinuria; increase fluid rate to target 0.5-1 mL/kg/hr, draw CK, consider alkalinizing urine with sodium bicarbonate if myoglobinuria confirmed", "Decrease fluids", "Change catheter"],
    a: 1,
    r: "UO 15 mL/hr in a burn patient is dangerously low (target 0.5-1 mL/kg/hr = 30-60 mL/hr). Dark urine suggests myoglobinuria from deep burns or electrical injury causing rhabdomyolysis. Management: increase fluid rate, draw CK (>5000 = rhabdomyolysis), maintain UO >200-300 mL/hr if rhabdomyolysis confirmed, consider sodium bicarbonate to alkalinize urine.",
    s: "Shock & Emergency"
  },
  {
    q: "A patient with 60% TBSA burns is on day 3 (acute phase). The nurse notes temperature 39.8°C, WBC 22,000, wound edges are erythematous with purulent drainage, and the patient is increasingly confused. What should the nurse recognize?",
    o: ["Expected healing response", "Burn wound infection progressing to sepsis — notify provider immediately; obtain wound cultures, blood cultures; anticipate antibiotic change and possible surgical debridement", "Normal inflammatory response to burns", "Medication side effect"],
    a: 1,
    r: "Fever + leukocytosis + wound erythema/purulence + altered mental status in a burn patient = burn wound infection progressing to sepsis. Burns destroy the skin barrier, making infection the leading cause of death in burn patients after the initial resuscitation phase. Urgent interventions: wound and blood cultures, targeted antibiotics, surgical debridement if needed.",
    s: "Shock & Emergency"
  },

  // ===== STATUS EPILEPTICUS CAT (18 questions) =====
  {
    q: "A nurse is managing a patient who has been seizing for 12 minutes. The following has been administered:\n- Lorazepam 4 mg IV at minute 5 (no effect)\n- Lorazepam 4 mg IV at minute 8 (no effect)\n\nThe seizure continues. What should the nurse prepare NEXT?",
    o: ["Give a third dose of lorazepam", "Prepare second-line agent: fosphenytoin 20 mg PE/kg IV loading dose with continuous cardiac monitoring", "Wait for the lorazepam to take effect", "Prepare propofol infusion (third-line)"],
    a: 1,
    r: "After two doses of first-line benzodiazepine without seizure termination, the algorithm advances to second-line therapy (within 20 minutes). Fosphenytoin 20 mg PE/kg IV (max 150 mg PE/min) with continuous cardiac monitoring. Repeated benzodiazepine doses have diminishing returns due to GABA-A receptor internalization. If second-line also fails, prepare for intubation + third-line anesthetic.",
    s: "Shock & Emergency"
  },
  {
    q: "A patient's tonic-clonic seizure has stopped after treatment. Thirty minutes later, the patient remains unresponsive with GCS 6. What should the nurse suspect and recommend?",
    o: ["Normal prolonged post-ictal state — continue observation", "Non-convulsive status epilepticus (NCSE); recommend continuous EEG monitoring to detect ongoing subclinical seizure activity", "The patient has had a stroke", "Medication over-sedation only"],
    a: 1,
    r: "Persistent unresponsiveness after convulsive seizure termination should raise concern for NCSE — ongoing seizure activity without visible convulsions. NCSE can only be diagnosed by continuous EEG. Up to 48% of patients treated for convulsive SE continue to have non-convulsive seizures. Early EEG monitoring is essential.",
    s: "Shock & Emergency"
  },
  {
    q: "A nurse receives four patients simultaneously in the ED. Which patient needs the FASTEST intervention?\n\n1. Patient with known epilepsy: had a 2-minute seizure that self-resolved, now post-ictal but arousable\n2. Patient actively seizing for 7 minutes: no IV access, no history available\n3. Patient with headache and AED levels pending\n4. Patient with new-onset absence seizures: alert between episodes",
    o: ["Patient 1: Post-ictal monitoring", "Patient 2: Active status epilepticus >5 minutes without IV access — give IM midazolam 10 mg IMMEDIATELY; simultaneously attempt IV access; check glucose", "Patient 3: Awaiting lab results", "Patient 4: Non-emergent seizure evaluation"],
    a: 1,
    r: "Patient 2 has status epilepticus (>5 minutes) with no IV access. IMMEDIATE action: IM midazolam 10 mg into anterolateral thigh (RAMPART trial evidence), check bedside glucose, attempt IV access simultaneously. Every minute of delayed treatment reduces benzodiazepine effectiveness due to GABA-A receptor internalization.",
    s: "Shock & Emergency"
  },

  // ===== TBI CAT (20 questions) =====
  {
    q: "A nurse is caring for four neurosurgical patients. Which patient requires the MOST immediate assessment?\n\n1. Post-craniotomy day 1: GCS 14, pupils equal and reactive, ICP 12\n2. Severe TBI: GCS was 7 now 5, right pupil dilating from 3 mm to 5 mm, ICP 28\n3. Concussion patient: GCS 15, mild headache, CT negative\n4. Post-VP shunt placement: GCS 14, mild headache, shunt palpable",
    o: ["Patient 1: Stable post-craniotomy", "Patient 2: GCS declining + pupil changes + ICP 28 = impending uncal herniation — emergency requiring immediate ICP-lowering measures and neurosurgical notification", "Patient 3: Stable concussion", "Patient 4: Expected post-shunt symptoms"],
    a: 1,
    r: "Patient 2 has THREE alarming signs: GCS decline (7→5 = 2-point drop), pupil asymmetry (dilating right pupil = ipsilateral CN III compression), and elevated ICP (28 mmHg). This triad indicates impending right-sided uncal herniation. Immediate actions: HOB 30° midline, hyperosmolar therapy (mannitol or hypertonic saline), notify neurosurgery STAT, prepare for possible emergent craniotomy.",
    s: "Shock & Emergency"
  },
  {
    q: "A TBI patient has ICP 32 mmHg and MAP 72 mmHg. The CPP is 40 mmHg (critically low). The nurse should implement a tiered approach. Place these interventions in the correct priority order:\n\nA. HOB 30°, head midline, assess for kinks in EVD tubing\nB. Open EVD to drain CSF\nC. Administer mannitol 20% 1 g/kg IV or 23.4% hypertonic saline 30 mL via central line\nD. Increase MAP with vasopressors",
    o: ["A → B → C → D is the correct tiered approach: start with positioning and EVD assessment (free interventions), then drain CSF, then osmotic therapy, then augment MAP", "C → D → A → B", "D → C → B → A", "All interventions simultaneously"],
    a: 0,
    r: "ICP management follows a tiered approach: (1) Position optimization (HOB 30°, midline, check EVD — free and immediate), (2) CSF drainage via EVD (rapid effect), (3) Hyperosmolar therapy (mannitol or HTS), (4) MAP augmentation with vasopressors. CPP = MAP - ICP; improve by BOTH reducing ICP and increasing MAP. CPP 40 is critically inadequate (goal >60).",
    s: "Shock & Emergency"
  },
  {
    q: "A TBI patient develops the following changes over 30 minutes: BP increases from 130/80 to 190/110 with widening pulse pressure, HR decreases from 88 to 52, and breathing becomes irregular. What do these changes represent?\n\nA. Medication side effects\nB. Cushing's triad — brainstem herniation is occurring\nC. Vasovagal response\nD. Normal ICP fluctuations",
    o: ["Medication side effects", "Cushing's triad (hypertension with widening pulse pressure + bradycardia + irregular respirations) = critically elevated ICP compressing the brainstem; this is a LATE, ominous sign requiring emergency intervention", "Vasovagal response", "Normal ICP fluctuations"],
    a: 1,
    r: "Cushing's triad is the body's last-ditch effort to perfuse the brain: hypertension (sympathetic surge to push blood past elevated ICP), bradycardia (vagal reflex to the hypertension), and irregular respirations (brainstem compression affecting respiratory centers). This is a neurosurgical emergency — immediate osmotic therapy, CSF drainage, and preparation for emergent decompressive surgery.",
    s: "Shock & Emergency"
  },

  // ===== HEMODYNAMIC MONITORING CAT (20 questions) =====
  {
    q: "A nurse reviews hemodynamic data on four ICU patients. Which patient's profile indicates the MOST urgent intervention needed?\n\nPatient A: CVP 6, PAWP 10, CI 3.2, SVR 1000 — on no vasoactive meds\nPatient B: CVP 2, PAWP 4, CI 1.4, SVR 2200 — tachycardic, cool extremities\nPatient C: CVP 14, PAWP 22, CI 1.8, SVR 2000 — crackles bilaterally\nPatient D: CVP 4, PAWP 8, CI 4.8, SVR 450 — warm flushed skin, on norepinephrine",
    o: ["Patient A: Normal hemodynamics, stable", "Patient B: Severe hypovolemic shock (critically low filling pressures and CI) requiring aggressive volume resuscitation", "Patient C: Cardiogenic shock needing inotropic support", "Patient D: Distributive shock on appropriate vasopressor"],
    a: 1,
    r: "Patient B has the most critical profile: CVP 2 and PAWP 4 (profoundly low preload), CI 1.4 (critically low cardiac output), and SVR 2200 (maximal compensatory vasoconstriction). This is severe hypovolemic shock requiring immediate aggressive volume resuscitation. Without fluids, tissue ischemia and organ failure are imminent.",
    s: "Shock & Emergency"
  },
  {
    q: "A nurse notices that a patient's arterial line systolic readings are consistently 30 mmHg higher than cuff pressures. The square wave test shows excessive oscillations before returning to baseline. What is the problem and how should it be addressed?\n\nA. The cuff pressure is wrong; trust the arterial line\nB. The arterial line is over-damped; flush the system\nC. The system is under-damped (resonance artifact); add a damping device or use the cuff pressure for clinical decisions\nD. The transducer is faulty; replace it",
    o: ["Trust the arterial line", "Flush the system (over-damped)", "Under-damped system causing artificially high systolic readings; add damping device, shorten tubing, or remove extra stopcocks; use cuff pressure until corrected", "Replace transducer"],
    a: 2,
    r: "Excessive oscillations on square wave test = under-damped system. This causes artificially HIGH systolic and artificially LOW diastolic readings (resonance artifact). Causes: excessive tubing length, air microbubbles, extra stopcocks. Solutions: shorten tubing, remove extra stopcocks, add commercial damping device. Use cuff BP for clinical decisions until corrected.",
    s: "Shock & Emergency"
  },
  {
    q: "A PA catheter balloon is inflated for a wedge pressure reading. After obtaining the PAWP, the nurse attempts to deflate the balloon but notices blood in the syringe when aspirating. What should the nurse do?\n\nA. Attempt to re-inflate the balloon\nB. Do NOT re-inflate the balloon — blood indicates balloon rupture; notify the provider and document; the PAWP port can no longer be used for wedge readings\nC. Continue using the catheter normally\nD. Withdraw the catheter 5 cm",
    o: ["Re-inflate the balloon", "Do NOT re-inflate — blood in the balloon syringe indicates balloon rupture; further inflation risks air embolism or PA injury; notify provider, document, and use PA diastolic pressure as PAWP surrogate", "Continue normal use", "Withdraw the catheter"],
    a: 1,
    r: "Blood in the balloon syringe = balloon rupture. Re-inflation could cause air embolism (air entering the bloodstream) or further PA injury. The catheter can still measure RA, RV, and PA pressures, but PAWP cannot be obtained. PA diastolic pressure approximates PAWP and can be used as a surrogate. Notify the provider for catheter replacement if wedge readings are clinically necessary.",
    s: "Shock & Emergency"
  },

  // ===== ADDITIONAL HYPOVOLEMIC SHOCK CAT =====
  {
    q: "A 22-year-old male MVC victim arrives with HR 110, BP 102/68, RR 22, and a mechanism consistent with splenic injury. He appears anxious but is alert and oriented. The trauma team says 'vitals look okay.' The experienced nurse recognizes:\n\nA. The patient is hemodynamically stable\nB. Young healthy patients compensate effectively and can maintain near-normal BP until decompensation occurs abruptly at >30% blood loss\nC. The tachycardia is from pain and anxiety\nD. No intervention is needed",
    o: ["Patient is stable", "Young healthy patients compensate well — tachycardia and anxiety may be the ONLY signs of significant hemorrhage before abrupt decompensation; the nurse should advocate for close monitoring, serial labs, and FAST exam", "Tachycardia is from anxiety only", "No intervention needed"],
    a: 1,
    r: "Young patients have excellent cardiovascular reserve and can maintain near-normal blood pressure until 30-40% of blood volume is lost, then decompensate suddenly and catastrophically. Tachycardia in a trauma patient is hemorrhage until proven otherwise. The Shock Index (HR/SBP = 110/102 = 1.08) is abnormal (>1.0), suggesting significant hypovolemia despite 'acceptable' individual vital signs.",
    s: "Shock & Emergency"
  },
  {
    q: "A trauma patient is receiving massive transfusion. The nurse draws an ionized calcium level and finds it at 0.85 mmol/L (normal 1.1-1.3). The patient has a prolonged QT on the monitor. What is the priority intervention?",
    o: ["Slow the transfusion rate", "Administer IV calcium gluconate or calcium chloride to correct citrate-induced hypocalcemia before cardiac arrest occurs", "Obtain a repeat lab to confirm", "Administer magnesium"],
    a: 1,
    r: "Citrate in stored blood chelates ionized calcium. Severe hypocalcemia (iCa <0.9 mmol/L) causes prolonged QT, myocardial depression, hypotension, and cardiac arrest. Treatment: IV calcium chloride 1g (preferred — 3x more elemental calcium than gluconate, but requires central line) or calcium gluconate 1-2g peripheral IV. Monitor iCa levels q30min during massive transfusion.",
    s: "Shock & Emergency"
  },

  // ===== ADDITIONAL SEPSIS CAT =====
  {
    q: "A nurse is caring for a 68-year-old patient admitted 2 days ago with community-acquired pneumonia. The patient was improving, but now develops:\n- New confusion (oriented x1, baseline x3)\n- Temperature 39.2°C → 35.8°C (hypothermia)\n- HR 118, RR 28, BP 78/48\n- WBC 3,200 (was 14,000 yesterday)\n\nWhat does this clinical change represent?",
    o: ["Expected fluctuation in pneumonia recovery", "Deterioration from sepsis to septic shock with ominous prognostic features (hypothermia and leukopenia indicate immune exhaustion and carry higher mortality than fever/leukocytosis)", "Improvement shown by decreasing WBC", "Anxiety-related vital sign changes"],
    a: 1,
    r: "This is a critical deterioration: new confusion (organ dysfunction), hypothermia + leukopenia (immune exhaustion — worse prognosis than fever/leukocytosis), tachycardia, tachypnea, and hypotension = septic shock. The temperature shift from fever to hypothermia and the WBC drop suggest the immune system is failing, carrying higher mortality. Immediate interventions: Hour-1 Bundle, blood cultures, broader antibiotic coverage, fluid resuscitation, vasopressors.",
    s: "Shock & Emergency"
  },
  {
    q: "Two ICU patients both have septic shock and are on norepinephrine. Patient A has lactate trending down (6.2 → 3.8 → 2.1 over 12 hours). Patient B has lactate trending up (4.1 → 5.8 → 7.2 over 12 hours). What clinical conclusion should the nurse draw?",
    o: ["Both patients are responding equally", "Patient A is responding to treatment (lactate clearing); Patient B is failing treatment (worsening tissue hypoperfusion) and needs escalation of care and reassessment of source control", "Lactate trends are not clinically meaningful", "Patient B needs more IV fluids only"],
    a: 1,
    r: "Lactate trending: Patient A's declining lactate (66% clearance) indicates improving tissue perfusion and response to treatment. Patient B's rising lactate (76% increase) indicates worsening tissue hypoperfusion despite treatment. Patient B needs: reassess source control (undrained abscess?), broaden antibiotics, increase vasopressor support, consider additional interventions, and initiate goals-of-care discussion.",
    s: "Shock & Emergency"
  },
  {
    q: "A nurse is educating a new graduate about the importance of bundle compliance in sepsis management. Which statement by the new graduate requires further education?\n\nA. 'I need to draw blood cultures before antibiotics'\nB. 'Antibiotics must be given within 1 hour of sepsis recognition'\nC. 'I should wait for blood culture results before starting antibiotics to ensure targeted therapy'\nD. 'I should measure lactate as part of the Hour-1 Bundle'",
    o: ["Statement A needs correction", "Statement B needs correction", "Statement C needs correction — NEVER delay antibiotics for culture results; broad-spectrum antibiotics first, then narrow based on results", "Statement D needs correction"],
    a: 2,
    r: "Statement C is WRONG and dangerous. Broad-spectrum antibiotics must be given within 1 hour of sepsis recognition regardless of whether cultures are back. Waiting for culture results (24-72 hours) would be fatal. Each hour of delay increases mortality by 7.6%. Strategy: broad-spectrum first, then de-escalate to targeted therapy when culture and sensitivity results return.",
    s: "Shock & Emergency"
  },

  // ===== ADDITIONAL ANAPHYLAXIS CAT =====
  {
    q: "A nurse is evaluating two patients who both received IV cephalosporin antibiotics:\n\nPatient A: Developed facial flushing and mild itching 30 minutes into infusion. VS: HR 82, BP 128/76, RR 16, SpO2 99%. No wheezing or swelling.\n\nPatient B: Developed generalized urticaria, lip/tongue swelling, audible wheezing, HR 128, BP 72/44, RR 28, SpO2 88% two minutes after bolus.\n\nWhich patient has anaphylaxis vs a localized reaction?",
    o: ["Both patients have anaphylaxis", "Patient A has a localized allergic reaction (one system, stable VS); Patient B has anaphylaxis (4 systems involved: skin, respiratory, cardiovascular, mucosal) requiring immediate epinephrine", "Neither patient has anaphylaxis", "Patient A has anaphylaxis; Patient B has a simple allergy"],
    a: 1,
    r: "Patient A has a mild, single-system reaction (skin only) with stable hemodynamics — stop infusion, monitor, administer antihistamines. Patient B meets anaphylaxis criteria: skin (urticaria), mucosal (lip/tongue edema), respiratory (wheezing, SpO2 88%), cardiovascular (hypotension, tachycardia). Patient B requires: STOP medication, epinephrine 0.3-0.5 mg IM IMMEDIATELY, supine positioning, high-flow oxygen, IV access + fluid bolus.",
    s: "Shock & Emergency"
  },
  {
    q: "A school nurse is developing an anaphylaxis emergency protocol. Which element is MOST critical to include?\n\nA. Call 911 first, then evaluate symptoms\nB. Administer diphenhydramine first to prevent reaction progression\nC. Administer epinephrine auto-injector at the FIRST sign of anaphylaxis, then call 911\nD. Apply cold compress and elevate extremities",
    o: ["Call 911 first", "Diphenhydramine first", "Administer epinephrine FIRST, then call 911 — delayed epinephrine is the #1 cause of anaphylaxis death; every minute counts", "Cold compress"],
    a: 2,
    r: "The #1 cause of death from anaphylaxis is delayed or withheld epinephrine. In a school setting, the nurse should: (1) Administer epinephrine auto-injector immediately at first sign of anaphylaxis, (2) Call 911, (3) Position supine (unless respiratory distress), (4) Give second dose after 5-15 min if needed, (5) Transfer to ED. Diphenhydramine is an adjunct ONLY.",
    s: "Shock & Emergency"
  },

  // ===== ADDITIONAL NEUROGENIC SHOCK CAT =====
  {
    q: "An ICU nurse receives a patient with a C3 complete spinal cord injury, HR 38, BP 62/34, and temperature 34.8°C. The patient is also on a ventilator. The nurse must prioritize:\n\nA. Initiate vasopressor therapy and atropine\nB. Active warming measures\nC. Fluid resuscitation\nD. All of the above simultaneously, while maintaining MAP 85-90 for spinal cord perfusion",
    o: ["Vasopressors only", "Warming only", "Fluids only", "All simultaneously: vasopressors + atropine for hemodynamic support, active warming for poikilothermia, cautious fluids for preload optimization — all targeting MAP 85-90 mmHg"],
    a: 3,
    r: "C3 complete SCI causes profound neurogenic shock affecting ALL sympathetic outflow: severe bradycardia (loss of T1-T4 cardiac accelerator fibers), severe hypotension (total loss of vascular tone), poikilothermia (loss of thermoregulation), and ventilator dependence (loss of diaphragm innervation at C3-C5). Management is multifaceted: norepinephrine for vascular tone + beta-1 support, atropine for bradycardia, warm IV fluids + external warming, and higher MAP target 85-90 to protect spinal cord perfusion.",
    s: "Shock & Emergency"
  },

  // ===== ADDITIONAL OBSTRUCTIVE SHOCK CAT =====
  {
    q: "A nurse is caring for a postoperative cardiac surgery patient. The chest tube output suddenly drops from 100 mL/hr to 10 mL/hr, and the patient develops JVD, tachycardia, hypotension, and equalized CVP and PAWP readings. What should the nurse suspect?\n\nA. Normal decrease in drainage\nB. Cardiac tamponade from chest tube occlusion (blood clots blocking drainage) with pericardial blood accumulation\nC. Hypovolemic shock\nD. Improving cardiac function",
    o: ["Normal drainage decrease", "Cardiac tamponade — sudden decrease in chest tube output + hemodynamic deterioration suggests the tube is clotted and blood is accumulating in the pericardial space; notify surgeon immediately for possible emergent re-exploration", "Hypovolemic shock", "Improving function"],
    a: 1,
    r: "Post-cardiac surgery: sudden decrease in chest tube output + hemodynamic deterioration = tamponade until proven otherwise. The chest tube is likely occluded by clots, allowing blood to accumulate in the pericardial space. Equalized CVP and PAWP (diastolic pressure equalization) confirms tamponade physiology. Actions: attempt to strip/milk the chest tube (per institutional protocol), notify the surgeon IMMEDIATELY for possible emergent mediastinal re-exploration.",
    s: "Shock & Emergency"
  },
  {
    q: "A patient with a known DVT history develops sudden severe dyspnea, pleuritic chest pain, and hypoxia. SpO2 is 82% on 6L NC. BP drops to 76/48. The nurse initiates the following in order:\n\n1. High-flow oxygen via non-rebreather\n2. IV access and fluid bolus\n3. Notify provider for CTPA and possible systemic thrombolysis\n4. Prepare heparin infusion\n\nIs this prioritization correct?",
    o: ["Yes, this is the correct order of priorities", "Mostly correct, but if the patient arrests or is in extremis, systemic thrombolysis (alteplase) may need to be given empirically before CTPA — do not delay definitive treatment for imaging in hemodynamically unstable massive PE", "The order should be reversed", "Only oxygen is needed"],
    a: 1,
    r: "The general approach is correct, but with a critical caveat: in hemodynamically unstable massive PE (SBP <90 for >15 minutes), systemic thrombolysis may need to be given empirically without waiting for CTPA confirmation. The risk of dying from untreated massive PE outweighs the risk of empiric thrombolysis. For PEA arrest from PE, thrombolytics can be given during CPR.",
    s: "Shock & Emergency"
  },

  // ===== ADDITIONAL MODS CAT =====
  {
    q: "A nurse is caring for a septic MODS patient. The following interventions are ordered simultaneously:\n1. Increase norepinephrine to MAP goal\n2. Start CRRT for acute kidney injury with hyperkalemia\n3. Adjust ventilator settings (PEEP increase for worsening PaO2/FiO2)\n4. Enteral feeding via NG tube\n5. Turn and reposition for pressure injury prevention\n\nWhich intervention should the nurse hold temporarily if ICP concerns develop?",
    o: ["Norepinephrine increase", "CRRT initiation", "Ventilator adjustment", "Repositioning — turning can increase ICP; if the patient develops neurological changes suggestive of elevated ICP, defer repositioning until ICP is assessed and managed"],
    a: 3,
    r: "While all interventions are important, repositioning can transiently increase ICP through changes in venous drainage and intrathoracic pressure. If the MODS patient develops neurological deterioration (decreasing GCS, pupil changes), repositioning should be deferred until ICP is assessed. When repositioning is resumed, maintain HOB 30° with head midline, and space nursing activities to avoid cumulative ICP spikes.",
    s: "Shock & Emergency"
  },

  // ===== ADDITIONAL BURNS CAT =====
  {
    q: "A nurse receives two burn patients simultaneously:\n\nPatient A: 25-year-old, 40% TBSA partial-thickness burns to trunk and legs, no inhalation injury, BP 92/60, HR 128, alert\n\nPatient B: 55-year-old, 15% TBSA partial and full-thickness burns to face and neck, singed nasal hairs, hoarse voice, carbonaceous sputum, BP 118/72, HR 104, alert but anxious\n\nWhich patient is the HIGHER priority?",
    o: ["Patient A — larger TBSA burn with hemodynamic instability", "Patient B — inhalation injury with impending airway compromise is immediately life-threatening; the airway will close from edema within hours, making intubation impossible", "Both equal priority", "Neither needs emergent intervention"],
    a: 1,
    r: "Despite Patient A's larger burn area and current hemodynamic instability (treatable with IV fluids), Patient B has the higher priority because inhalation injury with active airway signs (singed nasal hairs + hoarseness + carbonaceous sputum) threatens complete airway obstruction. Supraglottic edema progresses rapidly — the window for intubation closes as edema worsens. Intubate NOW while the airway is still patent. Patient A needs aggressive fluid resuscitation but has time.",
    s: "Shock & Emergency"
  },
  {
    q: "During burn resuscitation, the nurse notes that urine output has been 120 mL/hr for the past 3 hours (patient weighs 70 kg). What should the nurse do?\n\nA. Continue the current fluid rate\nB. Decrease the fluid rate — urine output significantly exceeds the target of 0.5-1 mL/kg/hr (35-70 mL/hr for this patient), indicating over-resuscitation ('fluid creep')\nC. Increase the fluid rate\nD. No change is needed",
    o: ["Continue current rate", "Decrease fluid rate — UO 120 mL/hr far exceeds target 35-70 mL/hr, indicating fluid creep which risks pulmonary edema, abdominal compartment syndrome, and extremity compartment syndrome", "Increase rate", "No change"],
    a: 1,
    r: "Target UO is 0.5-1 mL/kg/hr (35-70 mL/hr for 70 kg). UO of 120 mL/hr indicates over-resuscitation (fluid creep). Decrease the IV rate by 25-33% and reassess hourly. Over-resuscitation complications: pulmonary edema, abdominal compartment syndrome (intra-abdominal hypertension), extremity compartment syndrome, and orbital compartment syndrome. The Parkland formula is a starting guide — titrate to UO.",
    s: "Shock & Emergency"
  },

  // ===== ADDITIONAL STATUS EPILEPTICUS CAT =====
  {
    q: "A nurse discovers an unresponsive patient in a hospital bed with subtle facial twitching and rhythmic eye blinking. Vital signs: HR 92, BP 138/82, RR 18, SpO2 96%, temp 37.2°C. The patient had a witnessed tonic-clonic seizure 2 hours ago that was treated with lorazepam. What is the MOST likely diagnosis?\n\nA. Post-ictal state\nB. Non-convulsive status epilepticus (NCSE) — the subtle facial movements and unresponsiveness 2 hours after a treated convulsive seizure suggest ongoing subclinical seizure activity\nC. Sleep\nD. Medication over-sedation",
    o: ["Post-ictal state", "Non-convulsive status epilepticus — subtle motor signs + unresponsiveness after treated convulsive seizure = high suspicion for NCSE; request STAT continuous EEG", "Sleep", "Over-sedation"],
    a: 1,
    r: "Up to 48% of patients continue to have non-convulsive seizure activity after apparently successful treatment of convulsive SE. Subtle facial twitching + rhythmic eye blinking + persistent unresponsiveness 2 hours post-treatment = high suspicion for NCSE. Immediate actions: STAT continuous EEG (only way to confirm NCSE), check glucose, maintain IV access, prepare additional antiseizure medications pending EEG confirmation.",
    s: "Shock & Emergency"
  },

  // ===== ADDITIONAL TBI CAT =====
  {
    q: "A TBI patient's ICP suddenly spikes from 18 to 35 mmHg. The EVD is in place but is not draining CSF. MAP is 80 mmHg, giving CPP of 45 mmHg (critically low). The nurse should:\n\nA. Wait and recheck in 30 minutes\nB. Immediately troubleshoot the EVD (check for kinks, clamps left on, tubing disconnection), open to drain CSF, position HOB 30° midline, and if no EVD flow, prepare for hyperosmolar therapy while notifying neurosurgery\nC. Increase vasopressors only\nD. Turn off the ICP monitor",
    o: ["Wait and recheck", "Immediately troubleshoot EVD and implement tiered ICP management: verify drain is open and patent, ensure HOB 30° midline, drain CSF, prepare mannitol/HTS if drainage fails, and NOTIFY neurosurgery — CPP 45 is critically low", "Increase vasopressors only", "Turn off monitor"],
    a: 1,
    r: "CPP 45 mmHg is critically inadequate (goal >60). ICP 35 mmHg is dangerously elevated (threshold 20-22). The nurse must act immediately in a tiered approach: (1) Check EVD system — is it clamped? kinked? disconnected? at correct height? (2) Open EVD to drain CSF — this is the fastest ICP-lowering intervention, (3) Ensure HOB 30° with head midline, (4) If EVD doesn't drain, administer hyperosmolar therapy (mannitol 1g/kg or 23.4% NaCl via central line), (5) Notify neurosurgery STAT for possible surgical intervention.",
    s: "Shock & Emergency"
  },
  {
    q: "A family member asks the TBI nurse: 'Why are you checking my father's pupils and squeezing his fingers every hour? He was just in a car accident — can't you let him rest?'\n\nWhat is the BEST nursing response?",
    o: ["'It's just hospital protocol'", "'These frequent neurological checks help us detect brain swelling early, BEFORE it becomes dangerous. If we notice any changes in how he responds, we can intervene quickly to prevent further brain injury. I understand it seems disruptive, and I'll be as gentle as possible.'", "'I can reduce the frequency to every 4 hours if you prefer'", "'The doctor ordered it, so we have to do it'"],
    a: 1,
    r: "The response should: (1) Acknowledge the family's concern, (2) Explain the clinical rationale in non-technical language (detecting brain swelling early), (3) Emphasize the benefit (early intervention prevents secondary injury), and (4) Show empathy while maintaining the assessment schedule. Neurological assessments q1h in severe TBI are non-negotiable — reducing frequency could miss critical deterioration.",
    s: "Shock & Emergency"
  },

  // ===== ADDITIONAL HEMODYNAMIC MONITORING CAT =====
  {
    q: "A newly admitted ICU patient has the following hemodynamic data:\n- CVP: 16 mmHg (elevated)\n- PAWP: 22 mmHg (elevated)\n- CI: 1.6 L/min/m² (low)\n- SVR: 2400 dyn-s-cm-5 (elevated)\n- SvO2: 48% (low)\n\nThe nurse should anticipate which medication orders?",
    o: ["IV fluid bolus — the patient is hypovolemic", "Dobutamine (inotrope to improve contractility and CI) and possible afterload reduction (milrinone or nitroprusside) — this is cardiogenic shock", "Norepinephrine (vasopressor) — the SVR is already too low", "No medications needed"],
    a: 1,
    r: "This hemodynamic profile = cardiogenic shock: high filling pressures (CVP 16, PAWP 22 = fluid backing up from pump failure), low CI (1.6 = heart failing as pump), high SVR (2400 = compensatory vasoconstriction), low SvO2 (48% = tissues extracting maximum oxygen due to inadequate delivery). Treatment: inotrope (dobutamine to improve contractility/CI), afterload reduction (to reduce SVR, making it easier for the heart to pump), and diuresis (to reduce preload/congestion). Fluids would WORSEN this patient.",
    s: "Shock & Emergency"
  },
  {
    q: "A nurse is troubleshooting an arterial line that has been giving inconsistent readings. She performs the square wave test and gets the following results:\n\nFirst attempt: No oscillations, gradual return to baseline\nSecond attempt (after flushing): 1-2 oscillations, quick return to baseline\n\nWhat does this indicate?",
    o: ["The system was malfunctioning and cannot be used", "The first result showed an over-damped system (likely from a partial clot or air bubble); after flushing, the system is now optimally damped and readings should be accurate", "Both results are normal", "The transducer needs replacement"],
    a: 1,
    r: "First test (no oscillations, gradual return) = over-damped system giving falsely low systolic readings. After flushing removed the obstruction, the second test (1-2 oscillations, quick return) = optimal dynamic response. The nurse correctly identified and resolved the problem. Document the troubleshooting. Square wave testing should be performed at the start of each shift and after any system manipulation.",
    s: "Shock & Emergency"
  },

  // ===== BATCH 3: EXTENDED CAT QUESTIONS =====
  {
    q: "A 45-year-old patient with cirrhosis is admitted with hemorrhagic shock from variceal bleeding. The physician orders octreotide and blood products. Unique considerations for this patient include:\n\nA. Standard massive transfusion protocol\nB. This patient has baseline coagulopathy, thrombocytopenia, and low fibrinogen from liver failure; standard MTP ratios may need adjustment; avoid excessive NS (ascites worsening); target lower hemoglobin (7-8 g/dL)\nC. No special considerations\nD. Only PRBCs are needed",
    o: ["Standard MTP protocol", "Cirrhotic patients have baseline coagulopathy (impaired clotting factor synthesis), thrombocytopenia (splenic sequestration), and low fibrinogen; they need more FFP/cryoprecipitate than standard ratios; avoid excessive saline; restrictive transfusion targets (Hgb 7-8) reduce portal pressure and rebleeding risk", "No special considerations", "Only PRBCs needed"],
    a: 1,
    r: "Cirrhotic hemorrhage complexity: (1) Baseline coagulopathy requires more FFP/cryoprecipitate, (2) Thrombocytopenia from hypersplenism (may need additional platelets), (3) Low fibrinogen from impaired hepatic synthesis (target fibrinogen >100 with cryoprecipitate), (4) Restrictive transfusion (Hgb 7-8 g/dL) — liberal transfusion increases portal pressure and rebleeding, (5) Avoid excessive NS (worsens ascites). Also: octreotide reduces portal pressure, and plan for endoscopic band ligation.",
    s: "Shock & Emergency"
  },
  {
    q: "A nurse is caring for a septic patient with the following timeline:\n\n0800: Sepsis recognized (lactate 4.2, MAP 58)\n0815: Blood cultures drawn\n0830: Antibiotics administered\n0845: 30 mL/kg crystalloid bolus started\n0900: MAP still 60 after 1.5L fluids — norepinephrine started\n\nThe ICU charge nurse reviews this case. What feedback is appropriate?",
    o: ["Everything was done perfectly and on time", "There was a 30-minute delay between sepsis recognition and antibiotic administration; the Hour-1 Bundle requires antibiotics WITHIN 1 hour, ideally within 15-30 minutes; the 30-minute delay is concerning but cultures were correctly drawn before antibiotics", "Antibiotics should have been given before cultures", "Vasopressors were started too early"],
    a: 1,
    r: "SSC Hour-1 Bundle analysis: Blood cultures at 0815 (+15 min = acceptable, should be within 45 min). Antibiotics at 0830 (+30 min = borderline; ideally within 15-30 min of recognition, MUST be within 60 min). Fluids at 0845 (+45 min = delayed; should start immediately for MAP <65 or lactate ≥4). Vasopressor at 0900 = appropriate (after fluids failed). Key improvement: start fluids AND antibiotics simultaneously at 0815.",
    s: "Shock & Emergency"
  },
  {
    q: "A 28-year-old woman develops anaphylaxis at 32 weeks gestation after receiving penicillin. She has urticaria, wheezing, and BP 70/40. What are the unique considerations for treating anaphylaxis in pregnancy?",
    o: ["Treatment is identical to non-pregnant patients", "Give epinephrine IM (same dose as non-pregnant), position in LEFT lateral tilt (not supine) to prevent aortocaval compression, aggressive fluid resuscitation, and prepare for emergency C-section if maternal arrest occurs", "Epinephrine is contraindicated in pregnancy", "Only give IV fluids and wait"],
    a: 1,
    r: "Pregnancy considerations: (1) Epinephrine IS safe and life-saving — same IM dose (0.3-0.5 mg), (2) LEFT lateral tilt positioning (not flat supine) — prevents aortocaval compression by the gravid uterus, which would worsen hypotension, (3) Continuous fetal monitoring, (4) Aggressive IV fluid resuscitation, (5) Neonatology and OB on standby, (6) If maternal cardiac arrest occurs, perimortem C-section within 4-5 minutes to save both mother and baby.",
    s: "Shock & Emergency"
  },
  {
    q: "A patient with a C4 complete spinal cord injury is now 3 months post-injury. During a routine catheterization, the nurse notices the patient becomes severely hypertensive (BP 230/120), has a severe headache, facial flushing above C4, and bradycardia (HR 42). Below the injury, the skin is pale, cool, and has piloerection. What is happening and what is the PRIORITY action?",
    o: ["The patient is having a stroke — call a code stroke", "Autonomic dysreflexia from bladder distension — sit the patient upright IMMEDIATELY, then catheterize to drain the bladder; this is a hypertensive emergency that can cause stroke or death if not resolved", "Normal response to catheterization", "Vasovagal response — lay flat and elevate legs"],
    a: 1,
    r: "This is classic autonomic dysreflexia (AD): noxious stimulus (full bladder from difficult catheterization) below injury triggers massive sympathetic response → severe HTN below injury (pale, piloerection, vasoconstriction) but cannot send inhibitory signals past the cord lesion. Above injury: compensatory parasympathetic → bradycardia, facial flushing, headache. PRIORITY: (1) SIT UPRIGHT immediately (orthostatic drop helps), (2) Remove stimulus (drain bladder, check for kinks), (3) If BP remains >150 systolic, give rapid-acting antihypertensive (nifedipine, nitropaste). This is a true emergency — stroke/death risk from severe HTN.",
    s: "Shock & Emergency"
  },
  {
    q: "An ICU nurse is asked to describe the hemodynamic differences between the four major shock types to nursing students. Which comparison is MOST accurate?\n\nA. All shock types present with the same hemodynamic profile\nB. See answer option B for comparison\nC. Only CO and BP differ between types\nD. Hemodynamic monitoring cannot differentiate shock types",
    o: ["All types are identical", "Hypovolemic: ↓CO, ↓CVP, ↓PAWP, ↑SVR. Cardiogenic: ↓CO, ↑CVP, ↑PAWP, ↑SVR. Distributive: ↑CO (early), ↓CVP, ↓PAWP, ↓SVR. Obstructive: ↓CO, ↑CVP, variable PAWP, ↑SVR", "Only CO and BP differ", "Monitoring cannot differentiate types"],
    a: 1,
    r: "Hemodynamic profiles by shock type: HYPOVOLEMIC (pump has nothing to pump): low everything except SVR (compensatory). CARDIOGENIC (pump failure): high filling pressures (CVP, PAWP = blood backing up), low CO, high SVR. DISTRIBUTIVE (pipe problem): high CO (compensatory, early), low SVR (vasodilation), low filling pressures. OBSTRUCTIVE (mechanical obstruction): depends on cause — tamponade has equalized pressures, PE has high right-sided pressures with low left-sided.",
    s: "Shock & Emergency"
  },
  {
    q: "A nurse is caring for a MODS patient on day 5 of ICU stay. The family asks about prognosis. Daily SOFA scores have been:\nDay 1: 8\nDay 2: 10\nDay 3: 12\nDay 4: 14\nDay 5: 16\n\nHow should the nurse respond?",
    o: ["'Your family member is getting better'", "'The progressively worsening organ function scores indicate a very poor prognosis. I think it would be helpful to have a family meeting with the medical team to discuss goals of care and what your family member would want.' (SOFA ≥15 carries >90% mortality)", "'These numbers don't mean anything'", "'Everything will be fine'"],
    a: 1,
    r: "Rising SOFA scores indicate progressive organ failure. SOFA ≥15 is associated with >90% mortality. The steadily increasing trend (8→16 over 5 days) suggests failing treatment and irreversible organ damage. The nurse should: (1) Facilitate a multidisciplinary family meeting, (2) Use honest, compassionate communication, (3) Discuss goals of care (aggressive vs comfort), (4) Involve palliative care team, (5) Respect family's cultural and religious considerations.",
    s: "Shock & Emergency"
  },
  {
    q: "A burn patient on the ventilator has the following blood gas: pH 7.18, PaCO2 32, PaO2 58, HCO3 12, COHb 28%. SpO2 reads 96%. The nurse recognizes:\n\nA. The patient's oxygenation is adequate based on SpO2\nB. SpO2 is FALSELY NORMAL due to COHb; the patient has severe metabolic acidosis AND CO poisoning; actual oxygen delivery is critically impaired\nC. The metabolic acidosis will resolve spontaneously\nD. Increase FiO2 to 40%",
    o: ["SpO2 is reassuring", "SpO2 is FALSELY NORMAL — pulse oximetry CANNOT distinguish carboxyhemoglobin from oxyhemoglobin; the patient has life-threatening CO poisoning (COHb 28%) + severe metabolic acidosis (pH 7.18, HCO3 12); needs 100% FiO2 and possible hyperbaric oxygen", "Acidosis will self-correct", "Just increase FiO2"],
    a: 1,
    r: "Critical analysis: (1) SpO2 96% is FALSELY reassuring — pulse ox reads COHb as OxyHb, (2) COHb 28% = severe CO poisoning (>25% = treat aggressively), (3) pH 7.18 with low PaCO2 (32) and low HCO3 (12) = compensated metabolic acidosis (respiratory compensation is the low PaCO2), (4) PaO2 58 = hypoxemic. Interventions: 100% FiO2 via ventilator (reduces CO half-life from 5 hours to 60-90 minutes), consider hyperbaric oxygen for COHb >25%, treat acidosis source.",
    s: "Shock & Emergency"
  },
  {
    q: "A nurse is evaluating a patient in status epilepticus who has been seizing for 40 minutes. Three doses of lorazepam 4 mg IV (total 12 mg) have been given without effect. Fosphenytoin 20 mg PE/kg is currently infusing. The seizures continue. What is the next step?",
    o: ["Continue lorazepam doses", "This is refractory SE — prepare for endotracheal intubation and continuous IV anesthetic infusion (midazolam, propofol, or pentobarbital) with continuous EEG monitoring and ICU admission", "Increase fosphenytoin rate", "Wait for fosphenytoin to reach therapeutic level"],
    a: 1,
    r: "Algorithm: (1) First-line failed (3 doses benzodiazepine × 12 mg — generous), (2) Second-line (fosphenytoin) still infusing/failing. At 30-40 minutes of persistent seizure = REFRACTORY SE. Next: (3) Third-line: intubation + continuous IV anesthetic: midazolam 0.2 mg/kg bolus then 0.1-2 mg/kg/hr, OR propofol 2 mg/kg bolus then 1-5 mg/kg/hr, OR pentobarbital 5-15 mg/kg bolus then 0.5-5 mg/kg/hr. Titrate to burst suppression on continuous EEG.",
    s: "Shock & Emergency"
  },
  {
    q: "A TBI patient in the ICU has the following ICP/CPP trends over 6 hours:\n\nHour 1: ICP 15, MAP 85, CPP 70 ✓\nHour 2: ICP 18, MAP 82, CPP 64 ✓\nHour 3: ICP 22, MAP 80, CPP 58 ⚠\nHour 4: ICP 28, MAP 78, CPP 50 ✗\nHour 5: ICP 32, MAP 75, CPP 43 ✗\nHour 6: ICP 38, MAP 72, CPP 34 ✗\n\nThe nurse recognizes this trend and escalates care. What tiered interventions should be anticipated?",
    o: ["Wait for the neurologist to round in the morning", "Immediate tiered ICP management: drain CSF via EVD, hyperosmolar therapy (mannitol or 23.4% HTS), optimize sedation/analgesia, increase MAP with vasopressors for CPP >60, and notify neurosurgery for possible decompressive craniectomy", "Give acetaminophen for headache", "Repeat CT scan only"],
    a: 1,
    r: "This is a dangerous ICP trend requiring immediate escalation: ICP rising from 15→38 (goal <20-22), CPP falling from 70→34 (goal >60). Tiered management: TIER 1: HOB 30° midline, drain CSF (EVD), optimize sedation (propofol/fentanyl), reassess ventilator (avoid hypoxia, maintain PaCO2 35-45). TIER 2: Hyperosmolar therapy (mannitol 1g/kg or 23.4% NaCl 30mL), increase MAP with vasopressors (target CPP >60), CT scan for surgical lesion. TIER 3: High-dose barbiturate coma (pentobarbital), brief hyperventilation (PaCO2 30-35), decompressive craniectomy. The worsening trend over 6 hours with no intervention is a critical nursing failure — escalate at Hour 3 when CPP first dropped below 60.",
    s: "Shock & Emergency"
  },
  {
    q: "A charge nurse is developing a protocol for early recognition of distributive shock in post-surgical patients. Which assessment parameters should trigger an automatic physician notification?\n\nA. Temperature changes and white blood cell count only\nB. MAP <65 OR SBP <90 for >15 minutes, unexplained tachycardia (HR >100 not responsive to pain management), warm flushed skin with hypotension, new-onset confusion/altered mental status, urine output <0.5 mL/kg/hr × 2 consecutive hours, or lactate >2 mmol/L\nC. Only when the patient requests to see a doctor\nD. Blood pressure changes only",
    o: ["Temperature and WBC only", "Multiple objective criteria: MAP <65 or SBP <90 for >15 min, unexplained tachycardia >100, warm flushed skin with hypotension (distributive pattern), new confusion, UO <0.5 mL/kg/hr × 2hr, lactate >2; any single criterion should trigger assessment and notification", "Patient request only", "BP changes only"],
    a: 1,
    r: "Effective early warning protocols use MULTIPLE objective triggers rather than a single parameter. Distributive shock early signs: (1) Hemodynamic: MAP <65, SBP <90, unexplained tachycardia, (2) Clinical: warm extremities with hypotension (vasodilation), altered mentation, (3) End-organ: oliguria, (4) Lab: elevated lactate. The key is the COMBINATION of warm/vasodilated + hypotensive, which differentiates distributive from other shock types. Single-parameter triggers miss early shock.",
    s: "Shock & Emergency"
  },
  {
    q: "An experienced ICU nurse is precepting a new graduate on reading PA catheter waveforms. They are advancing the catheter from the subclavian vein. The nurse asks the new graduate to identify the chamber as the waveform changes. The sequence of waveforms during PA catheter insertion should be:",
    o: ["RA → LA → PA → wedge", "RA (low amplitude a and v waves) → RV (high systolic with low diastolic near 0) → PA (high systolic with elevated diastolic, dicrotic notch) → PAWP (low amplitude a and v waves, lower mean than PA)", "PA → RV → RA → wedge", "All waveforms look identical"],
    a: 1,
    r: "PA catheter waveform progression: (1) RA: low-pressure a and v waves (mean 2-8 mmHg), (2) RV: sharp systolic upstroke with diastolic near 0 (systolic 15-25, diastolic 0-8), (3) PA: maintained systolic pressure but diastolic rises (dicrotic notch appears from pulmonic valve closure; systolic 15-25, diastolic 8-15), (4) PAWP: return to low-pressure tracing (mean 6-12 mmHg). The KEY transition to recognize: RV→PA shows diastolic pressure rising from near-0 to 8-15 mmHg with appearance of dicrotic notch.",
    s: "Shock & Emergency"
  },

  // ===== BATCH 4: EXTENDED CAT QUESTIONS =====
  {
    q: "A nurse is triaging three trauma patients who arrive simultaneously to the ED:\n\nPatient A: 35-year-old with bilateral femur fractures, HR 140, BP 78/50, confused, cold skin\nPatient B: 50-year-old with penetrating abdominal wound, HR 120, BP 90/60, moderate abdominal distension\nPatient C: 20-year-old with C5 SCI from diving accident, HR 48, BP 72/40, warm dry skin below clavicles, alert\n\nAll three are in shock. Which patient needs the MOST different approach?",
    o: ["Patient A — needs crystalloids only", "Patient C — neurogenic shock requires vasopressors with both alpha AND beta activity (norepinephrine) and possibly atropine, NOT aggressive fluid resuscitation alone; fluids without vasopressors will pool in dilated vasculature without raising BP", "Patient B — needs antibiotics first", "All three receive the same treatment"],
    a: 1,
    r: "Patient A (hemorrhagic Class IV) and Patient B (hemorrhagic with likely intra-abdominal injury) both need aggressive volume resuscitation (blood products, MTP activation) and surgical intervention. Patient C has NEUROGENIC shock from C5 SCI — the treatment paradigm differs fundamentally: (1) Fluid alone pools in dilated vasculature (the problem is the PIPE, not volume), (2) Needs norepinephrine (alpha-1 for vascular tone + beta-1 for bradycardia), (3) May need atropine for HR <50, (4) Target MAP 85-90 for spinal cord perfusion, (5) Active warming for poikilothermia.",
    s: "Shock & Emergency"
  },
  {
    q: "A nurse notices that a critically ill patient on CRRT has the following concerning trend over 3 hours:\n- Blood flow rate decreasing despite unchanged pump settings\n- Filter transmembrane pressure (TMP) rising from 100 to 300 mmHg\n- Visible darkening of blood in the circuit\n- Access and return pressures diverging\n\nWhat is happening and what should the nurse do?",
    o: ["Normal circuit operation", "The CRRT circuit is clotting — the filter is becoming obstructed; notify the provider, prepare for circuit change, assess anticoagulation adequacy (regional citrate or heparin), and ensure the patient's labs are drawn before losing the current circuit", "The machine is malfunctioning", "Decrease the blood flow rate"],
    a: 1,
    r: "Circuit clotting signs: rising TMP (filter membrane obstructing), darkening blood (stagnant flow), decreasing effective blood flow, and diverging pressures. Actions: (1) Check anticoagulation — is citrate/heparin infusing properly? dose adequate? (2) Draw labs NOW (will lose access when circuit changes), (3) Notify provider and prepare new circuit, (4) Assess for underlying hypercoagulability, (5) Adjust anticoagulation protocol for next circuit. Typical filter life: 24-72 hours; premature clotting suggests inadequate anticoagulation.",
    s: "Shock & Emergency"
  },
  {
    q: "A 65-year-old patient is admitted to the burn unit with 25% TBSA full-thickness burns sustained in a house fire. On day 3, the nurse notes:\n- Temperature 39.8°C (was afebrile on day 2)\n- WBC 22,000 (was 14,000)\n- HR 118 (baseline 88)\n- Wound edges appear discolored with purulent drainage\n- Blood glucose 280 (was well-controlled)\n\nIs this patient septic or exhibiting normal burn inflammatory response?",
    o: ["Normal burn inflammatory response — all burns cause fever and elevated WBC", "This is likely burn wound sepsis — while burns do cause SIRS-like responses, the COMBINATION of new temperature spike (not baseline elevation), rapidly rising WBC, wound changes (discoloration, purulent drainage), and new hyperglycemia suggest wound infection progressing to sepsis", "This is just stress hyperglycemia", "No concern needed"],
    a: 1,
    r: "Distinguishing burn SIRS from sepsis is one of the most challenging clinical problems. This scenario favors infection: (1) NEW temperature spike (not baseline elevation from hypermetabolism), (2) RISING WBC trend (not stable elevation), (3) WOUND changes (discoloration + purulent drainage = infection signs), (4) NEW hyperglycemia (infection increases insulin resistance). Actions: wound cultures (quantitative tissue biopsy >10^5 organisms/g = infection), blood cultures, broad-spectrum antibiotics, and wound care intensification. Burns cause persistent SIRS, but CHANGES from baseline suggest infection.",
    s: "Shock & Emergency"
  },
  {
    q: "A patient with MODS on vasopressors, mechanical ventilation, and CRRT has been in the ICU for 14 days. SOFA score has worsened from 12 to 18 despite maximum interventions. The attending physician wants to discuss transitioning to comfort care. The family is requesting 'everything be done.' How should the nurse support this situation?",
    o: ["Side with the physician and tell the family to stop treatment", "Facilitate a structured family conference: arrange a private space, involve the interdisciplinary team (attending, chaplain, social worker, palliative care), use teach-back to ensure family understands prognosis, explore what the patient would have wanted (substituted judgment), acknowledge the family's distress, and avoid ultimatums", "Side with the family and avoid the conversation", "Have the nurse make the decision"],
    a: 1,
    r: "The nurse's role in goals-of-care conflicts: (1) ADVOCATE for a structured family conference (not hallway conversations), (2) ENSURE the family truly understands the medical situation (use teach-back: 'Can you tell me in your own words what you understand about the prognosis?'), (3) EXPLORE the patient's values and wishes (substituted judgment > best interest), (4) INVOLVE supportive services (chaplain, social worker, palliative care, ethics committee if needed), (5) ACKNOWLEDGE the family's grief without dismissing their wishes, (6) SUPPORT the team through moral distress, (7) DOCUMENT the conference content and family response. SOFA 18 carries >95% mortality — honest, compassionate communication is essential.",
    s: "Shock & Emergency"
  },
  {
    q: "During a rapid response, a nurse identifies that a postoperative patient has clinical signs consistent with both hypovolemic AND distributive shock:\n- BP 70/40, HR 130\n- Skin: cold and clammy on upper body, warm and flushed on lower body\n- Surgical wound: saturating dressing (bright red)\n- Temperature 39.5°C\n- WBC 18,000\n\nWhat is the BEST initial approach?",
    o: ["Treat only the hemorrhage", "Treat only the sepsis", "Address BOTH simultaneously: massive hemorrhage (blood products, surgical hemostasis, direct pressure) AND possible surgical site infection/sepsis (blood cultures, broad-spectrum antibiotics); the mixed presentation suggests concurrent hemorrhagic and septic shock", "Wait for imaging before treating"],
    a: 2,
    r: "Mixed shock presentation: hemorrhagic signs (bright red wound saturation, tachycardia, cold/clammy upper body, hypotension) + septic signs (fever, elevated WBC, warm/flushed lower body). In reality, shock types frequently COEXIST. Approach: (1) IMMEDIATE hemorrhage control (direct pressure, call surgeon, type and screen, activate MTP if needed), (2) CONCURRENT sepsis workup and treatment (blood cultures, antibiotics, fluids), (3) Both require volume resuscitation (blood products address both), (4) Vasopressors if MAP remains <65 after volume. The key insight: don't force a single diagnosis — treat what you see.",
    s: "Shock & Emergency"
  },
  {
    q: "A nurse is teaching a community CPR class. A participant asks: 'My mother has a severe bee allergy and carries an EpiPen. If she gets stung and can't breathe, should I give the EpiPen before calling 911 or call 911 first?'\n\nWhat is the evidence-based answer?",
    o: ["Always call 911 first", "Give the EpiPen FIRST, then call 911 — delayed epinephrine is the number one cause of death from anaphylaxis; calling 911 first delays the most critical intervention", "Only call 911, don't give the EpiPen yourself", "Wait to see if symptoms improve on their own"],
    a: 1,
    r: "Evidence is clear: EPINEPHRINE FIRST, then 911. The #1 cause of anaphylaxis death is delayed or withheld epinephrine. In the community setting: (1) Use EpiPen immediately at first sign of anaphylaxis (difficulty breathing, swelling, widespread hives with ANY other symptom), (2) THEN call 911, (3) Position supine (unless vomiting or dyspneic), (4) Give second EpiPen after 5-15 min if no improvement. Teaching family members to use the EpiPen saves lives. The 5-minute delay of calling 911 first can be fatal.",
    s: "Shock & Emergency"
  },
  {
    q: "A patient with major burns is being resuscitated using the Parkland formula. The resident orders fluids based on actual body weight of 110 kg. The nurse reviews the chart and notes the patient's pre-burn estimated lean weight was 80 kg. The patient has a BMI of 42. What should the nurse do?",
    o: ["Follow the resident's order using 110 kg", "Question the order — in obese patients, using actual body weight in the Parkland formula leads to significant over-resuscitation and its complications (abdominal compartment syndrome, extremity compartment syndrome, pulmonary edema); adjusted body weight should be used", "Reduce fluids to half the calculated amount", "Use ideal body weight instead"],
    a: 1,
    r: "Obesity and Parkland formula: using actual weight in obese patients (BMI >30) dramatically overestimates fluid needs. Adjusted body weight formula: ABW = IBW + 0.4 × (actual weight - IBW). For this patient: IBW ~80 kg, ABW = 80 + 0.4(110-80) = 92 kg. Over-resuscitation complications in obesity: abdominal compartment syndrome, extremity compartment syndrome, pulmonary edema, orbital compartment syndrome. The nurse should ALWAYS question calculations in obese patients and advocate for adjusted dosing.",
    s: "Shock & Emergency"
  },
  {
    q: "A trauma patient arrives intubated with the following blood gas:\npH 7.08, PaCO2 28, PaO2 110, HCO3 8, Lactate 12\n\nThe nurse interprets this as:",
    o: ["Respiratory acidosis requiring ventilator adjustment", "Severe metabolic acidosis with respiratory compensation (Kussmaul-like pattern) — the low pH and HCO3 indicate profound metabolic acidosis from tissue hypoperfusion (lactate 12), and the low PaCO2 represents maximum respiratory compensation", "Normal blood gas for a trauma patient", "Respiratory alkalosis only"],
    a: 1,
    r: "ABG interpretation: pH 7.08 (severe acidemia), PaCO2 28 (low = respiratory compensation attempting to blow off CO2), HCO3 8 (critically low = severe metabolic acidosis), Lactate 12 (indicates severe tissue hypoperfusion/anaerobic metabolism). Expected PaCO2 for HCO3 of 8: Winter's formula = 1.5(8)+8±2 = 18-22, but actual PaCO2 is 28 → respiratory compensation is INADEQUATE, suggesting respiratory fatigue or concurrent lung pathology. This patient needs aggressive shock resuscitation (blood products, surgery) to address the CAUSE of the lactic acidosis. Bicarbonate administration is controversial and generally not recommended unless pH <6.9.",
    s: "Shock & Emergency"
  },
  {
    q: "An ICU nurse is caring for a patient with severe TBI (GCS 5) who has an EVD in place. The ICP has been well-controlled at 12-15 mmHg. During routine oral care, the nursing assistant notices the patient suddenly has unequal pupils (left 6mm fixed, right 3mm reactive) and decerebrate posturing. The ICP reads 42 mmHg. What is the IMMEDIATE priority action sequence?",
    o: ["Complete the oral care and then assess", "STOP all stimulation, check EVD (ensure it's open to drain at correct height), drain CSF, call for help, prepare hyperosmolar therapy (mannitol or 23.4% NaCl), and notify neurosurgery EMERGENTLY — this is acute uncal herniation", "Give pain medication", "Reposition HOB to flat"],
    a: 1,
    r: "This is acute LEFT uncal herniation: left CN III compressed by temporal lobe herniating through tentorial notch → left fixed dilated pupil + contralateral (right-sided) decerebrate posturing. IMMEDIATE actions in ORDER: (1) STOP all stimulation (oral care likely triggered ICP spike), (2) Verify EVD is OPEN and at correct height — drain CSF immediately, (3) HOB 30° with head midline, (4) Call for help + page neurosurgery STAT, (5) Give mannitol 1g/kg rapid IV push OR 23.4% NaCl 30mL via central line, (6) Brief hyperventilation (target PaCO2 30-35) as BRIDGE only, (7) Prepare for possible emergent surgical decompression. Document the timeline precisely — every minute of herniation causes irreversible damage.",
    s: "Shock & Emergency"
  },
  {
    q: "A nurse is reviewing the hemodynamic data of two ICU patients:\n\nPatient X: CVP 2, PAWP 4, CI 1.8, SVR 1800, SvO2 52%\nPatient Y: CVP 2, PAWP 4, CI 5.2, SVR 480, SvO2 82%\n\nBoth patients have MAP 58 mmHg. How do the treatment approaches differ?",
    o: ["Both receive the same treatment", "Patient X has hypovolemic shock (low preload, low CI, high SVR) — needs VOLUME (crystalloid/blood). Patient Y has distributive shock (low preload, high CI, low SVR) — needs VASOPRESSOR (norepinephrine) after initial fluid challenge", "Both need vasopressors only", "Both need fluids only"],
    a: 1,
    r: "Despite identical MAPs of 58, the hemodynamic profiles reveal completely different shock types: PATIENT X (hypovolemic): low CVP/PAWP (empty tank), low CI (heart has nothing to pump), high SVR (compensatory vasoconstriction), low SvO2 (tissues extracting maximum O2). Treatment: VOLUME first (crystalloid then blood products). PATIENT Y (distributive): low CVP/PAWP (relative hypovolemia from vasodilation), high CI (heart pumping hard), low SVR (vasodilated), high SvO2 (blood bypassing tissue beds via shunting). Treatment: fluids first, then VASOPRESSOR (norepinephrine) if MAP stays <65. This demonstrates why hemodynamic monitoring is essential — the same MAP requires opposite treatments.",
    s: "Shock & Emergency"
  },
  {
    q: "A nurse in a rural ED receives a patient with suspected tension pneumothorax. No surgeon is available for 45 minutes. The patient has:\n- Severe respiratory distress, SpO2 78%\n- Absent breath sounds on the right\n- Tracheal deviation to the left\n- JVD, BP 60/30, HR 150\n\nThe nurse has completed ATLS training. What should happen?",
    o: ["Wait for the surgeon to arrive", "Perform immediate needle decompression — this is a clinical diagnosis requiring IMMEDIATE intervention; 14-16 gauge needle at 2nd ICS midclavicular line on the right side; delay for a surgeon or imaging is not acceptable in this clinical scenario", "Order a chest X-ray first", "Increase oxygen and wait"],
    a: 1,
    r: "Tension pneumothorax is a CLINICAL diagnosis requiring IMMEDIATE needle decompression — imaging is unnecessary and delays life-saving treatment. The nurse with ATLS training should perform needle decompression: 14-16 gauge needle, 2nd ICS midclavicular line (or 5th ICS anterior axillary line for larger patients) on the AFFECTED (right) side. A rush of air confirms diagnosis. This converts tension to simple pneumothorax, stabilizing the patient until chest tube placement. In many jurisdictions, RNs with appropriate training/protocols can perform this procedure. Document and continue monitoring.",
    s: "Shock & Emergency"
  },
  {
    q: "A student nurse asks: 'Why do we use MAP instead of systolic blood pressure to assess perfusion in critically ill patients?'\n\nWhat is the BEST explanation?",
    o: ["They are interchangeable", "MAP represents the average perfusion pressure throughout the entire cardiac cycle (systole AND diastole); since organs are perfused continuously (not just during systole), MAP is the best single number reflecting actual tissue perfusion pressure; a MAP ≥65 mmHg is needed for adequate organ perfusion", "SBP is always more accurate", "MAP is easier to calculate"],
    a: 1,
    r: "MAP is preferred because: (1) It represents the average arterial pressure throughout the ENTIRE cardiac cycle (2/3 diastole + 1/3 systole), (2) Organ perfusion occurs continuously (not just during systole), (3) MAP accounts for both SBP and DBP, providing a more complete perfusion picture, (4) SBP can be artificially elevated by a stiff aorta (atherosclerosis) without improving tissue perfusion, (5) MAP ≥65 mmHg is the evidence-based target that ensures adequate perfusion to kidneys (autoregulation threshold), brain, and heart. Example: SBP 160/DBP 40 gives MAP 80 — seems okay — but the wide pulse pressure suggests aortic regurgitation with poor diastolic perfusion.",
    s: "Shock & Emergency"
  },
  {
    q: "A nurse is managing a patient on norepinephrine, vasopressin, and phenylephrine for refractory septic shock. The CI has dropped to 1.4 L/min/m² and the patient's extremities are becoming mottled and cold despite the triple vasopressor therapy. SvO2 has fallen to 42%. What should the nurse advocate for?",
    o: ["Increase all vasopressor doses further", "Add an inotrope (dobutamine or milrinone) — the patient has transitioned to cold shock with myocardial depression; further increasing vasopressors will only increase afterload against a failing heart, worsening cardiac output and tissue perfusion", "Switch to oral medications", "Discontinue vasopressors"],
    a: 1,
    r: "This patient has progressed from warm to cold septic shock with severe myocardial depression (CI 1.4, SvO2 42%, mottled extremities). Adding MORE vasopressors will WORSEN this by increasing afterload (SVR) against a failing heart → further dropping CO. The solution: INOTROPIC support: dobutamine 2.5-20 mcg/kg/min (beta-1 agonist, improves contractility without increasing SVR) or milrinone (phosphodiesterase inhibitor, improves contractility AND causes vasodilation). Also consider: bedside echo to confirm myocardial depression, stress-dose hydrocortisone if not already started, and honest family discussion given the extremely poor prognosis.",
    s: "Shock & Emergency"
  },
  {
    q: "A pediatric patient (8 years old, 25 kg) is brought to the ED in status epilepticus. The seizure has been ongoing for 12 minutes. IV access has failed twice. What is the APPROPRIATE medication route and dose?",
    o: ["Wait until IV access is established", "Administer midazolam 5 mg intranasally (IN) or 10 mg IM using the RAMPART trial dosing — intranasal/IM benzodiazepines are equivalent or superior to IV in the prehospital/no-IV setting because they can be given WITHOUT delay", "Oral lorazepam", "Rectal phenytoin"],
    a: 1,
    r: "When IV access fails in SE, alternative routes are critical: (1) INTRANASAL midazolam: 0.2 mg/kg (max 10 mg), split between nostrils, rapid mucosal absorption, (2) IM midazolam: 0.2 mg/kg (max 10 mg) — the RAMPART trial showed IM midazolam given without IV delay resulted in BETTER seizure termination rates than IV lorazepam given after IV establishment delay, (3) RECTAL diazepam: 0.5 mg/kg (max 20 mg) — effective but less preferred. For 25 kg child: midazolam 5 mg IN or IM. The key principle: TIME TO DRUG is more important than ROUTE — any drug given NOW is better than the 'perfect' drug given after 5 minutes of IV attempts.",
    s: "Shock & Emergency"
  },

  // ===== BATCH 5: FINAL CAT EXPANSION =====
  {
    q: "A new graduate nurse is caring for a patient on multiple vasopressor infusions. The pharmacy sends a new bag of norepinephrine in a DIFFERENT concentration than the current bag (16 mg/250 mL instead of 8 mg/250 mL). The nurse plans to simply swap the bags and keep the pump rate the same. What is wrong with this plan?",
    o: ["Nothing is wrong, the medication is the same", "Swapping bags of different concentrations at the same pump rate will DOUBLE the norepinephrine dose, potentially causing life-threatening hypertension, cardiac ischemia, and arrhythmias; the rate must be adjusted when concentration changes", "The new bag should be returned to pharmacy", "The pump will automatically adjust"],
    a: 1,
    r: "This is a potentially FATAL medication error. If the concentration doubles (8→16 mg/250 mL) and the rate stays the same, the patient receives DOUBLE the mcg/min dose. Example: if running at 10 mL/hr = 5.3 mcg/min at old concentration, same rate at new concentration = 10.6 mcg/min — sudden doubling could cause severe hypertension (stroke risk), cardiac ischemia, and arrhythmias. The nurse MUST: verify concentration, recalculate the rate for the same mcg/min dose, use a smart pump with drug library, and perform an independent double check with a second nurse. NEVER change vasopressor bags without verifying concentration and recalculating.",
    s: "Shock & Emergency"
  },
  {
    q: "A 72-year-old patient with chronic kidney disease (GFR 22) develops septic shock. The team orders 30 mL/kg crystalloid bolus per SSC guidelines (patient weighs 85 kg = 2,550 mL). The nurse has concerns. What should the nurse communicate?",
    o: ["Give the full bolus without question", "Express concern that CKD patients may not tolerate large-volume boluses — suggest giving initial bolus of 500-1000 mL with frequent reassessment (lung sounds, SpO2, work of breathing, JVD) and PLR to assess fluid responsiveness before committing to the full 30 mL/kg", "Refuse to give any fluids", "Give the full bolus plus additional fluids"],
    a: 1,
    r: "This is an excellent example of clinical judgment. SSC guidelines recommend 30 mL/kg, but this must be individualized. CKD patients with limited fluid handling capacity are at HIGH risk for pulmonary edema from aggressive resuscitation. The nurse should: (1) Communicate concern respectfully, (2) Suggest incremental boluses (250-500 mL) with reassessment between each, (3) Perform PLR to test fluid responsiveness, (4) Monitor for volume overload (crackles, rising SpO2 requirements, JVD, peripheral edema), (5) Consider earlier vasopressor initiation rather than excessive fluids. Guidelines are not 'one size fits all.'",
    s: "Shock & Emergency"
  },
  {
    q: "A nurse observes a medical student performing a neurological assessment on a TBI patient. The student applies a peripheral painful stimulus (nail bed pressure) and the patient withdraws the hand. The student records GCS Motor = 4 (withdrawal). The nurse intervenes because:",
    o: ["The student's assessment is correct", "Peripheral pain can produce a spinal reflex withdrawal that does NOT reflect cortical function; CENTRAL pain (trapezius squeeze, sternal rub) must be used to accurately assess motor response in the GCS — peripheral withdrawal may overestimate the GCS Motor score", "GCS Motor 4 is too low", "Only peripheral pain should be used"],
    a: 1,
    r: "Critical GCS nuance: peripheral painful stimuli (nail bed pressure) can elicit SPINAL REFLEX withdrawal (no brain involvement), falsely elevated GCS Motor score. Central painful stimuli (trapezius squeeze, sternal rub, supraorbital pressure) require cortical processing to respond, giving accurate assessment. GCS Motor: 6 = obeys commands, 5 = localizes to central pain (reaches across midline to pain source), 4 = withdraws from peripheral pain (may be reflex), 3 = abnormal flexion (decorticate), 2 = extension (decerebrate), 1 = none. Using central pain for Motor assessment is essential for accurate GCS scoring.",
    s: "Shock & Emergency"
  },
  {
    q: "During a code blue, the team achieves ROSC after 18 minutes of CPR. The patient's initial post-ROSC blood pressure is 82/50, heart rate 110, temperature 36.5°C, and GCS 3T (intubated, no eye opening, no motor response). What post-cardiac arrest care priorities should the nurse anticipate?",
    o: ["Transfer to a regular floor for observation", "Targeted temperature management (32-36°C for ≥24 hours), hemodynamic optimization (MAP >65-70 with vasopressors if needed), cardiac catheterization evaluation (if STEMI or suspected cardiac etiology), continuous EEG monitoring, serial neurological assessments, and avoiding hyperoxia (titrate FiO2 to SpO2 94-98%)", "Only monitor vital signs", "Immediate neurological prognostication"],
    a: 1,
    r: "Post-ROSC priorities: (1) TTM 32-36°C for ≥24 hours (neuroprotection — reduces cerebral metabolic demand by 5-7% per degree), (2) Hemodynamic stabilization (MAP >65-70, vasopressors/inotropes PRN, avoid hypotension), (3) Cardiac evaluation (12-lead ECG, echo, consider cath lab for STEMI), (4) Ventilation: avoid hyperoxia (FiO2 to SpO2 94-98%) and maintain normocapnia (PaCO2 35-45), (5) Continuous EEG (detect NCSE), (6) Glucose management (<180), (7) AVOID early neuroprognostication — wait ≥72 hours after normothermia before prognosticating (cooling delays neurological recovery assessment).",
    s: "Shock & Emergency"
  },
  {
    q: "A nurse is educating a patient's family about the EVD (external ventricular drain). The family member accidentally lifts the drainage collection bag above the patient's head while helping the patient sit up. What are the immediate risks and what should the nurse do?",
    o: ["No risk — the bag can be at any height", "Raising the drainage bag above the transducer level allows CSF to flow BACK into the ventricles via reverse siphoning, acutely raising ICP; the nurse should immediately lower the bag to the prescribed level, assess the patient neurologically, and check the ICP reading", "The bag height doesn't matter", "Only risk is infection"],
    a: 1,
    r: "EVD is a gravity-dependent system: CSF drains when the collection bag is BELOW the prescribed reference point (usually 15-20 cm above the tragus). If the bag is raised ABOVE the patient's head: (1) CSF can flow backward into the ventricles (reverse siphoning) → acute ICP elevation, (2) If the bag is too LOW: excessive CSF drainage → ventricular collapse, subdural hematoma risk, or upward herniation. Immediate actions: lower the bag to the prescribed height, clamp briefly if needed, assess neurological status and ICP, and re-educate family on not touching the drainage system.",
    s: "Shock & Emergency"
  },
  {
    q: "A burn patient is being transferred from a community hospital to a burn center. The transferring nurse provides the following handoff:\n'40-year-old male, house fire, found unconscious. Intubated in the field. 35% TBSA mixed partial/full thickness burns to face, chest, arms. Parkland started 2 hours ago. Foley in place. Pain managed with fentanyl.'\n\nThe receiving burn center nurse identifies several CRITICAL missing pieces of information. What are they?",
    o: ["The handoff is complete", "Missing: (1) TIME OF BURN (Parkland starts from burn time, not hospital arrival), (2) COHb level and treatment, (3) Total fluids given so far AND current rate, (4) Urine output trend, (5) Tetanus status, (6) Weight used for Parkland calculation, (7) Circumferential burns (escharotomy risk), (8) Associated injuries (was unconscious — fall? explosion?)", "Only the weight is missing", "Only the time of burn is missing"],
    a: 1,
    r: "Critical handoff elements for burn transfer: (1) TIME OF BURN — the Parkland clock starts from INJURY, not presentation; 2-hour delay means recalculating what's been given vs. what should have been given, (2) COHb level — patient was unconscious in a house fire = high CO exposure risk, (3) Fluid balance — total IV fluids, current rate, urine output (target 0.5-1 mL/kg/hr), (4) Weight used for Parkland, (5) Circumferential burns — need escharotomy assessment, (6) Associated injuries (found unconscious = mechanism unclear), (7) Tetanus status, (8) Allergies and PMH. Using SBAR format for burn transfers ensures nothing is missed.",
    s: "Shock & Emergency"
  },
  {
    q: "An ICU nurse is reviewing the overnight charting for a patient with MODS. The night nurse documented 'adequate urine output' but did not record hourly amounts. The patient is on CRRT with an ultrafiltration rate of 100 mL/hr. Why is this documentation problematic?",
    o: ["This documentation is acceptable", "'Adequate urine output' is a subjective assessment — in MODS on CRRT, the nurse must document EXACT hourly urine output separately from CRRT ultrafiltrate, because urine output reflects NATIVE kidney function while CRRT ultrafiltrate is machine-driven fluid removal; imprecise documentation prevents accurate fluid balance calculation and assessment of renal recovery", "Only the CRRT output matters", "Urine output doesn't matter once on CRRT"],
    a: 1,
    r: "Critical documentation failure: (1) 'Adequate' is subjective and unmeasurable — hourly UO must be documented precisely (mL/hr), (2) On CRRT, URINE OUTPUT and CRRT ULTRAFILTRATE must be documented SEPARATELY: urine reflects native kidney function (is the kidney recovering?), while ultrafiltrate is machine-driven, (3) Without exact numbers, fluid balance calculations are impossible (intake - output = balance), (4) Trends in native UO guide the decision to continue or discontinue CRRT (increasing UO suggests recovery). Precise documentation is a nursing standard, not optional.",
    s: "Shock & Emergency"
  },
  {
    q: "A nurse is caring for a patient with a C6 spinal cord injury who develops sudden onset severe hypertension (BP 240/130), pounding headache, and facial flushing during a bowel program. HR is 42. The nurse recognizes autonomic dysreflexia and takes the following steps. Rank the priority:\n\n1. Sit the patient upright\n2. Remove the noxious stimulus (check for fecal impaction)\n3. Administer prescribed nifedipine if BP remains elevated\n4. Monitor BP every 2-5 minutes",
    o: ["Order doesn't matter", "The correct sequence is: 1→4→2→3 — sit upright FIRST (uses gravity to drop BP immediately), monitor BP, then carefully address the stimulus, then medicate if needed. Sitting up is the fastest intervention and should not be delayed", "Start with medications", "Call the physician first"],
    a: 1,
    r: "AD management priority sequence: (1) SIT UPRIGHT immediately (gravity causes orthostatic BP drop — fastest intervention), lower legs if possible, loosen tight clothing. (2) MONITOR BP q2-5 minutes (to track response). (3) REMOVE the noxious stimulus — MOST COMMON cause is bladder distension (catheterize if Foley is kinked/blocked) or fecal impaction (gently disimpact using lidocaine jelly). (4) If BP remains >150 systolic after removing stimulus: nifedipine 10 mg bite-and-swallow or nitropaste 1 inch to forehead (can be wiped off if overcorrection). AD is a PREVENTABLE emergency — the nurse should identify and address triggers proactively during bowel/bladder programs.",
    s: "Shock & Emergency"
  },
  {
    q: "A bedside nurse identifies that a ventilated ARDS patient's PaO2/FiO2 ratio has dropped from 150 to 72 over the past 6 hours despite increasing FiO2 from 0.5 to 0.8. The patient is not currently proned. What evidence-based intervention should the nurse advocate for?",
    o: ["Continue increasing FiO2 to 1.0", "Initiate prone positioning (16+ hours/day) — P/F ratio <150 on FiO2 ≥0.6 is the evidence-based threshold for prone positioning, which was shown to reduce mortality by 50% in the PROSEVA trial for moderate-to-severe ARDS", "Add more PEEP only", "No additional interventions available"],
    a: 1,
    r: "P/F ratio 72 with FiO2 0.8 = SEVERE ARDS (<100). The PROSEVA trial showed that prone positioning for ≥16 hours/day in moderate-to-severe ARDS (P/F <150 with FiO2 ≥0.6 and PEEP ≥5) reduced 28-day mortality from 33% to 16% (absolute reduction of 17%). The nurse should: (1) Advocate for proning with the team, (2) Assemble the turning team (≥4 people), (3) Prepare for position change (secure ETT, lines, drains), (4) Monitor hemodynamics during turn, (5) Assess skin pressure points. Simply increasing FiO2 to 1.0 without addressing the underlying V/Q mismatch is insufficient and risks oxygen toxicity.",
    s: "Shock & Emergency"
  },
  {
    q: "A nurse is caring for two patients with elevated ICP:\n\nPatient A (TBI): ICP 28 mmHg, Na+ 138 mEq/L, Serum osmolality 285 mOsm/kg\nPatient B (TBI): ICP 28 mmHg, Na+ 158 mEq/L, Serum osmolality 330 mOsm/kg\n\nBoth need ICP reduction. Can the nurse give mannitol to both patients?",
    o: ["Yes, give mannitol to both patients identically", "Patient A can receive mannitol (normal Na+ and osmolality). Patient B should NOT receive mannitol — the serum osmolality of 330 exceeds the threshold of 320 mOsm/kg, above which mannitol loses effectiveness and risks renal failure; use hypertonic saline instead for Patient B", "Neither can receive mannitol", "Both should receive hypertonic saline only"],
    a: 1,
    r: "Mannitol contraindication: serum osmolality >320 mOsm/kg (renal failure risk, ineffective). Patient A: Na 138, osm 285 → mannitol is safe and appropriate (0.25-1 g/kg IV over 15-20 min). Patient B: Na 158, osm 330 → mannitol is contraindicated → use hypertonic saline (23.4% NaCl 30 mL via central line or 3% NaCl 250 mL). HTS works by a different mechanism and has no osmolality ceiling. This demonstrates why the nurse must check serum osmolality and sodium BEFORE administering either hyperosmolar agent.",
    s: "Shock & Emergency"
  },

  // ===== BATCH 6: FINAL CAT EXPANSION =====
  {
    q: "A nurse is caring for a septic shock patient on norepinephrine 25 mcg/min and vasopressin 0.04 U/min. The MAP is 58 mmHg. The physician orders phenylephrine as a third vasopressor. The nurse reviews the patient's hemodynamics: CI 1.8 L/min/m², SVR 1800, ScvO2 52%, lactate 8.2.\n\nThe nurse should question this order because:",
    o: ["Phenylephrine is always appropriate as a third vasopressor", "The hemodynamics show COLD shock with severely depressed cardiac output — adding phenylephrine (pure alpha/vasoconstrictor) will further increase an already elevated SVR against a failing heart; the patient needs an INOTROPE (dobutamine or milrinone) to support cardiac output, not more vasoconstriction", "The SVR is too low for phenylephrine", "Three vasopressors are never used"],
    a: 1,
    r: "Critical analysis: CI 1.8 (low = cardiogenic component), SVR 1800 (HIGH = maximal vasoconstriction already occurring), ScvO2 52% (low = tissues are extracting maximally, O2 delivery is insufficient), lactate 8.2 (severe tissue hypoperfusion). Adding phenylephrine (PURE alpha vasoconstrictor) would INCREASE SVR further → increased afterload against a depressed myocardium → further decreased CI → worsening tissue perfusion → death. The correct intervention: INOTROPE (dobutamine: increases contractility AND decreases afterload via beta-2 vasodilation). This scenario tests the nurse's ability to interpret hemodynamic data and advocate against inappropriate orders.",
    s: "Shock & Emergency"
  },
  {
    q: "A nurse receives a patient from OR after emergency exploratory laparotomy for a gunshot wound to the abdomen. The surgical team performed damage control surgery with abdominal packing and temporary abdominal closure (vacuum-assisted). In the first 2 hours post-op, the nurse notices:\n- Decreasing urine output from 35 → 15 → 5 mL/hr\n- Rising peak airway pressures from 28 → 38 → 45 cmH2O\n- Bladder pressure measurement: 32 mmHg\n\nWhat is the nurse's priority intervention?",
    o: ["Increase IV fluid rate", "Report findings urgently — the triad of oliguria, rising airway pressures, and elevated bladder pressure (>20 mmHg) indicates abdominal compartment syndrome requiring emergent decompression; despite the temporary closure, the abdomen needs to be opened further at bedside or returned to OR", "Give furosemide for the low urine output", "Adjust the ventilator settings only"],
    a: 1,
    r: "This is abdominal compartment syndrome (ACS): IAP >20 mmHg + organ dysfunction (oliguria from renal vein compression, respiratory failure from diaphragm elevation). Even with temporary closure, massive fluid resuscitation causes bowel edema → increasing IAP. The nurse must: (1) Report IMMEDIATELY (time-critical), (2) Prepare for decompressive laparotomy (bedside if unstable), (3) Maintain hemodynamic support, (4) Monitor closely post-decompression for reperfusion injury and rebound hypotension (washout of acidotic blood from ischemic tissues). Key nursing insight: trending bladder pressures (IAP) q4h post-damage control surgery is essential.",
    s: "Shock & Emergency"
  },
  {
    q: "A charge nurse is triaging 4 patients arriving simultaneously to the ICU. All are in shock. Staffing is limited. Which patient requires the MOST experienced nurse?\n\nPatient 1: Septic shock on NE 12 mcg/min, MAP 68, lactate 3.2, improving\nPatient 2: Anaphylaxis post-epinephrine, stable vitals, hives resolving\nPatient 3: TBI with EVD, GCS 6, ICP fluctuating 18-28, pupils 4mm/3mm\nPatient 4: 60% TBSA burns, intubated, Parkland in progress, hour 3 of 8",
    o: ["Patient 1 — highest vasopressor dose", "Patient 3 — fluctuating ICP with asymmetric pupils indicates potential impending herniation requiring continuous assessment, EVD management expertise, rapid intervention capability, and nuanced neurological monitoring that requires the most experienced critical care nurse", "Patient 2 — anaphylaxis is most dangerous", "Patient 4 — burns are the most complex"],
    a: 1,
    r: "Patient 3 rationale: (1) Fluctuating ICP (18-28) with asymmetric pupils (4mm/3mm) suggests developing uncal herniation — the window for intervention is NARROW, (2) EVD management requires experienced assessment (when to drain, when to clamp, troubleshooting), (3) Neurological changes can be subtle and rapid, (4) Missing a pupil change or ICP trend can result in brain death within minutes. Patient 1: improving on moderate NE dose = stable. Patient 2: post-treatment and resolving = observation. Patient 4: complex but protocol-driven (Parkland titration to UO) — critical but more algorithmic. Experienced nurses are needed where clinical JUDGMENT (not just protocol following) determines outcomes.",
    s: "Shock & Emergency"
  },
  {
    q: "A 28-year-old female with known systemic lupus erythematosus (SLE) presents with fever, confusion, petechiae, anemia (Hgb 6.8), platelets 18K, creatinine 3.2, and schistocytes on blood smear. The intern orders a platelet transfusion for the critically low platelets. The nurse should:",
    o: ["Administer the platelet transfusion immediately", "HOLD the platelet transfusion and urgently contact the attending — this presentation (pentad: neurological changes, renal failure, thrombocytopenia, microangiopathic hemolytic anemia, fever) is consistent with TTP, in which platelet transfusion is CONTRAINDICATED because it fuels ongoing microvascular thrombosis and can be fatal", "Request additional units of platelets", "Only give platelets if bleeding occurs"],
    a: 1,
    r: "This is TTP (thrombotic thrombocytopenic purpura) until proven otherwise. Classic pentad present: (1) Thrombocytopenia (18K), (2) MAHA (Hgb 6.8 + schistocytes), (3) Renal failure (Cr 3.2), (4) Neurological changes (confusion), (5) Fever. In TTP, platelet transfusion is CONTRAINDICATED — platelets are consumed in the ongoing microvascular thrombotic process, adding more platelets FUELS the thrombosis → worsening organ ischemia → can precipitate death. Treatment: EMERGENT plasma exchange (plasmapheresis). The nurse's recognition and refusal to give platelets in this scenario is potentially life-saving. This is a high-level clinical judgment question.",
    s: "Shock & Emergency"
  },
  {
    q: "A nurse is managing a patient with refractory status epilepticus on a midazolam drip at 2 mg/kg/hr. The continuous EEG shows burst-suppression pattern. The neurologist asks the nurse to slowly wean the midazolam infusion. Twelve hours into the wean, the nurse notices the EEG is showing frequent epileptiform discharges but the patient has NO visible seizure activity. The patient's GCS remains 3T. What should the nurse do?",
    o: ["Continue the wean since there are no visible seizures", "Stop the wean, increase the midazolam back to the effective dose, and notify the neurologist — the EEG shows electrographic seizure recurrence (nonconvulsive status epilepticus), which causes ongoing brain injury even without visible convulsions", "Extubate the patient since GCS is 3", "Discontinue EEG monitoring"],
    a: 1,
    r: "This is NCSE recurrence during medication wean — a common and dangerous complication of RSE. The absence of visible seizure activity does NOT mean seizures have stopped — they have simply become nonconvulsive. Without cEEG, this would be entirely missed. Actions: (1) STOP the wean immediately, (2) Increase midazolam back to the rate that achieved burst-suppression, (3) Notify neurologist urgently, (4) Consider alternative/additional AED (add levetiracetam, valproate, or lacosamide as bridge therapy for subsequent wean attempts), (5) Plan for slower wean over 24-48h with continuous EEG monitoring. This scenario demonstrates why cEEG is ESSENTIAL during RSE treatment.",
    s: "Shock & Emergency"
  },
  {
    q: "A nurse is caring for a trauma patient who received 6 units of PRBCs, 6 units of FFP, and 1 pack of platelets during massive transfusion. The patient develops acute hypotension, dyspnea, SpO2 84% on 6L NC, bilateral crackles, pink frothy sputum, and the CXR shows bilateral pulmonary infiltrates. The BNP is 120 pg/mL (normal). The nurse suspects:",
    o: ["Cardiogenic pulmonary edema (heart failure)", "TRALI (Transfusion-Related Acute Lung Injury) — onset within 6 hours of transfusion, bilateral pulmonary infiltrates, hypoxemia, with normal BNP/cardiac function; differentiated from TACO by normal cardiac function and BNP", "Simple fluid overload", "Allergic transfusion reaction"],
    a: 1,
    r: "TRALI vs TACO differentiation is critical: TRALI: immune-mediated (donor antibodies activate recipient neutrophils in pulmonary vasculature → capillary leak → non-cardiogenic pulmonary edema). BNP is NORMAL, echo shows NORMAL cardiac function, no JVD. Onset: within 6 hours of transfusion. Treatment: supportive (O2, intubation/PEEP if needed), NO diuretics (volume depleted from capillary leak). TACO: volume overload (cardiogenic). BNP is ELEVATED, JVD present, responds to diuretics. In this case: BNP 120 (normal) + bilateral infiltrates + acute onset after transfusion = TRALI. Report to blood bank. Implicated product (usually FFP from multiparous female donor) should be recalled.",
    s: "Shock & Emergency"
  },
  {
    q: "An experienced ICU nurse notices that a patient's arterial line waveform has changed from a normal morphology to a dampened waveform (decreased amplitude, loss of dicrotic notch, wider appearance). The nurse's assessment reveals the blood pressure reading from the art line (88/72) does not match the NIBP cuff reading (122/78). What are the systematic troubleshooting steps?",
    o: ["Chart the cuff reading and ignore the art line", "Systematically troubleshoot the dampened waveform: check for air bubbles in the tubing, flush the catheter (check for blood return), inspect for kinks or blood clots in the system, verify the pressure bag is at 300 mmHg, check transducer position (phlebostatic axis), and assess the catheter site for positional issues", "Replace the arterial line immediately", "Average both readings"],
    a: 1,
    r: "Dampened arterial waveform troubleshooting (systematic approach): (1) AIR BUBBLES: most common cause — inspect entire tubing system, flush to remove, (2) BLOOD CLOT: aspirate, then flush — if unable to aspirate, may need catheter replacement, (3) KINKS: trace tubing from catheter to transducer, (4) PRESSURE BAG: verify 300 mmHg (low pressure = inadequate flush → clotting), (5) TRANSDUCER: at phlebostatic axis (4th ICS, midaxillary), zeroed to atmospheric pressure, (6) CATHETER POSITION: wrist position (may need arm board, check with wrist flexion/extension), partial occlusion against vessel wall, (7) TUBING LENGTH: excessive tubing or stopcocks cause signal degradation. ALWAYS correlate art line with cuff reading — if discrepant, troubleshoot before charting either as definitive.",
    s: "Shock & Emergency"
  },
  {
    q: "A nursing student asks: 'Why do we keep the head of bed at 30 degrees for TBI patients? Wouldn't flat positioning increase blood flow to the brain?' The experienced nurse explains:",
    o: ["Flat positioning is actually better for TBI", "HOB 30° optimizes CEREBRAL VENOUS DRAINAGE (promotes jugular venous outflow), which DECREASES ICP without significantly reducing arterial blood flow to the brain; the net effect is improved CPP (CPP = MAP - ICP); flat positioning impairs venous drainage, raising ICP and WORSENING cerebral perfusion despite increasing arterial flow", "HOB elevation is just for comfort", "It only prevents aspiration"],
    a: 1,
    r: "HOB 30° physiology in TBI: (1) VENOUS DRAINAGE: gravity assists jugular venous outflow → decreases cerebral venous volume → decreases ICP (Monroe-Kellie doctrine — less venous blood = more room for brain), (2) ARTERIAL FLOW: minimal reduction in cerebral arterial perfusion at 30° (cerebral autoregulation compensates), (3) NET EFFECT: ICP decreases more than MAP decreases → CPP IMPROVES. Additional nursing points: (1) Keep head MIDLINE (turning compresses ipsilateral jugular vein → impairs drainage → raises ICP), (2) Avoid neck flexion from cervical collar/tape, (3) Avoid hip flexion >90° (raises intra-abdominal pressure → impairs venous return from brain), (4) Even small changes (15° vs 30°) measurably affect ICP in some patients.",
    s: "Shock & Emergency"
  },
  {
    q: "A patient in the burn ICU develops the following labs on day 5:\nWBC 2.1, platelets 42K, creatinine 3.8 (baseline 0.9), total bilirubin 8.2, PT/INR 2.4/2.8\n\nThe attending states the patient is developing MODS. The nurse asks the resident which organ systems have failed. The resident says 'kidneys and liver.' Is this a complete assessment?",
    o: ["Yes, the resident correctly identified all failing organs", "No — the resident missed hematologic failure (WBC 2.1 = leukopenia, platelets 42K = thrombocytopenia suggesting DIC or bone marrow suppression) AND the coagulopathy (INR 2.8 = either hepatic synthetic failure or DIC); at minimum 3 organ systems are failing: hepatic, renal, AND hematologic", "Only one organ system is failing", "MODS cannot be diagnosed with labs alone"],
    a: 1,
    r: "Complete MODS assessment requires evaluating ALL organ systems: (1) RENAL: Cr 3.8 (>3× baseline = RIFLE 'Failure') ✓ identified, (2) HEPATIC: bilirubin 8.2 (SOFA liver 3-4) ✓ identified, (3) HEMATOLOGIC: platelets 42K (SOFA coagulation 3), WBC 2.1 (bone marrow suppression or consumptive), INR 2.8 (DIC vs hepatic synthetic failure — check fibrinogen and D-dimer to distinguish) ✗ MISSED. Additionally assess: (4) Respiratory (P/F ratio?), (5) Cardiovascular (on vasopressors?), (6) Neurological (GCS). The SOFA score systematically evaluates all 6 organ systems. The nurse's ability to independently assess organ function beyond what physicians identify is a mark of expert critical care practice.",
    s: "Shock & Emergency"
  },
  {
    q: "A nurse in a rural ED receives a patient with anaphylaxis to a wasp sting. After giving IM epinephrine 0.3 mg and IV fluids, the patient stabilizes. The nearest allergist is 3 hours away. The patient says: 'I feel fine now, I'd like to go home.' The nurse should advocate for:",
    o: ["Discharge the patient since symptoms resolved", "A minimum 4-6 hour observation period (some guidelines recommend 8-24 hours for severe reactions) due to the risk of biphasic anaphylaxis; educate about using prescribed EpiPens, avoiding wasp exposure, and seeking allergist follow-up for venom immunotherapy evaluation; ensure the patient has TWO EpiPens before discharge", "24-hour ICU admission for all anaphylaxis", "Transfer to the allergist's hospital immediately"],
    a: 1,
    r: "Biphasic anaphylaxis risk: recurrence in 5-20% of cases, typically 4-12 hours after initial reaction (can be up to 72 hours). Risk factors for biphasic: severe initial reaction, delayed epinephrine, required multiple epinephrine doses. Observation period: minimum 4-6 hours (some guidelines: 8-24 hours for severe reactions). Discharge requirements: (1) Symptoms fully resolved, (2) Patient has 2 EpiPens with demonstrated competency, (3) Written anaphylaxis action plan, (4) Prescription for EpiPens AND short course of prednisone + antihistamine, (5) Allergist referral for venom immunotherapy (reduces future anaphylaxis risk by 95-98%), (6) Medical alert identification recommended. NEVER discharge within the first 4 hours regardless of how well the patient feels.",
    s: "Shock & Emergency"
  },
  {
    q: "A nurse is reviewing hemodynamic data for a patient in shock. The PA catheter readings show:\nRA/CVP: 14 mmHg (elevated)\nPA: 48/28 mmHg (elevated)\nPAWP: 8 mmHg (normal-low)\nCO: 2.8 L/min (low)\nSVR: 1600 (elevated)\n\nThe nurse recognizes this hemodynamic profile is most consistent with:",
    o: ["Septic shock (low SVR expected)", "Obstructive shock from massive PE or acute RV failure — the elevated RA/CVP and PA pressures with a LOW PAWP indicate the obstruction is BETWEEN the right heart and left heart (pulmonary vasculature); blood cannot get through to fill the LV, so PAWP is low and CO drops", "Hypovolemic shock (all pressures would be low)", "Cardiogenic shock from LV failure (PAWP would be elevated)"],
    a: 1,
    r: "Hemodynamic pattern analysis: HIGH RA/CVP (14) = right heart is engorged/strained. HIGH PA pressures (48/28) = pulmonary hypertension (obstruction in pulmonary vasculature). LOW PAWP (8) = left heart is NOT receiving adequate blood — the obstruction is proximal to the left atrium. LOW CO (2.8) = reduced flow through the system. HIGH SVR (1600) = compensatory vasoconstriction. This is the CLASSIC profile of massive PE or acute RV failure: the right heart pushes against high pulmonary resistance but cannot get blood through to fill the left heart. Differentiation from cardiogenic (LV failure): PAWP would be HIGH (>18) if the LV were the problem. In PE: PAWP is characteristically LOW despite elevated right-sided pressures.",
    s: "Shock & Emergency"
  }
];
