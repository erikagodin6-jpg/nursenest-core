import { EmergencyNursingQuestion } from "./types";

export const shockBatch5Questions: EmergencyNursingQuestion[] = [
  {
    stem: "A 55-year-old male in the ICU with septic shock from pneumonia is on norepinephrine 20 mcg/min and vasopressin 0.04 units/min. His cortisol level returns at 12 mcg/dL drawn during his acute illness. Should stress-dose hydrocortisone be administered?",
    options: [
      "No — a cortisol of 12 mcg/dL is normal and does not require supplementation",
      "Yes — in septic shock requiring escalating vasopressors, a random cortisol <15-20 mcg/dL during critical illness suggests relative adrenal insufficiency, and SSC guidelines recommend hydrocortisone 200 mg/day for vasopressor-refractory septic shock",
      "No — stress-dose steroids are contraindicated in sepsis because they suppress the immune system",
      "Only if the patient has a known history of adrenal disease"
    ],
    correctAnswer: 1,
    rationaleLong: "In the setting of critical illness such as septic shock, the adrenal glands should be producing cortisol at supraphysiologic levels to support the massive stress response. A 'normal' cortisol level in a non-stressed individual is 5-25 mcg/dL, but during septic shock, appropriate cortisol levels should be significantly elevated (typically >25-34 mcg/dL). A random cortisol of 12 mcg/dL during septic shock represents a relatively inadequate cortisol response — termed 'critical illness-related corticosteroid insufficiency' (CIRCI) or 'relative adrenal insufficiency.' The Surviving Sepsis Campaign (SSC) guidelines recommend IV hydrocortisone 200 mg/day (typically 50 mg IV every 6 hours or 100 mg IV every 8 hours, or as a continuous infusion) for adult patients with septic shock who remain hemodynamically unstable despite adequate fluid resuscitation and vasopressor therapy. The recommendation is based on several large trials (CORTICUS, ADRENAL, APROCCHSS) that demonstrated: (1) Faster resolution of shock (earlier vasopressor discontinuation); (2) Shorter ICU stay; (3) Some trials showed reduced mortality (APROCCHSS showed mortality benefit with hydrocortisone plus fludrocortisone). Importantly, the current SSC guideline recommends hydrocortisone for vasopressor-refractory shock WITHOUT requiring a cortisol level or ACTH stimulation test — the decision is based on clinical criteria (ongoing vasopressor requirement despite adequate resuscitation). The cortisol level supports the decision but is not required. Hydrocortisone is preferred over dexamethasone because it provides both glucocorticoid AND mineralocorticoid activity. The mineralocorticoid effect is important in septic shock for sodium retention and intravascular volume maintenance. When the patient is hemodynamically stable and vasopressors are being weaned, hydrocortisone should be tapered gradually (not stopped abruptly) to avoid rebound hemodynamic instability.",
    learningObjective: "Apply SSC guidelines for stress-dose hydrocortisone in vasopressor-refractory septic shock and understand relative adrenal insufficiency",
    blueprintCategory: "Shock",
    subtopic: "septic shock",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "A 'normal' cortisol level during septic shock is actually INADEQUATE — the stressed body should produce cortisol at supraphysiologic levels (>25-34 mcg/dL)",
    clinicalPearls: [
      "SSC recommends hydrocortisone 200 mg/day for septic shock refractory to fluids and vasopressors — no ACTH stim test needed",
      "Hydrocortisone provides mineralocorticoid activity (sodium/water retention) — preferred over dexamethasone in septic shock",
      "Taper hydrocortisone gradually when weaning vasopressors — abrupt discontinuation can cause rebound hypotension"
    ],
    safetyNote: "Monitor blood glucose closely when administering stress-dose steroids — glucocorticoids cause hyperglycemia that may require insulin therapy",
    distractorRationales: [
      "A cortisol of 12 during critical illness is inappropriately low — normal ranges do not apply during physiological stress",
      "Hydrocortisone at stress doses provides more hemodynamic benefit than immunosuppressive risk in septic shock",
      "Relative adrenal insufficiency can occur in any critically ill patient — it is not limited to those with known adrenal disease"
    ],
    lessonPath: "/emergency/lessons/septic-shock"
  },
  {
    stem: "A 30-year-old male with type 1 diabetes presents to the ED with DKA (pH 7.12, glucose 450, K+ 5.8). An insulin drip is started at 0.1 units/kg/hr. After 2 hours, his glucose has dropped from 450 to 280 mg/dL, but his pH remains 7.15 and bicarbonate is still 9 mEq/L. Should the insulin rate be decreased because the glucose is dropping too fast?",
    options: [
      "Yes — decrease the insulin rate to prevent hypoglycemia since the glucose is dropping rapidly",
      "No — the insulin drip is treating the KETOACIDOSIS, not just the hyperglycemia. When glucose reaches 200-250 mg/dL, ADD dextrose to the IV fluids but maintain the insulin rate until the anion gap closes and pH normalizes",
      "Yes — stop the insulin drip entirely and switch to subcutaneous insulin",
      "No — increase the insulin rate to close the anion gap faster"
    ],
    correctAnswer: 1,
    rationaleLong: "This is one of the most important management concepts in DKA: the insulin drip is treating the KETOACIDOSIS, not just the hyperglycemia. These are two separate pathophysiological processes that resolve at different rates. The glucose typically drops faster than the acidosis resolves because: (1) Insulin directly promotes cellular glucose uptake and inhibits hepatic glucose production — these effects reduce blood glucose relatively quickly; (2) Ketone body clearance takes longer — insulin suppresses lipolysis (which generates free fatty acids, the substrate for ketogenesis) and ketogenesis, but existing ketone bodies must be metabolized through the Krebs cycle, which takes additional time. The anion gap remains elevated until ketone bodies are fully cleared. The critical error would be to reduce or stop the insulin drip based solely on the glucose level. If insulin is reduced prematurely, ketogenesis continues, the acidosis persists or worsens, and the patient's metabolic derangement is not corrected — even though the glucose looks 'better.' THE CORRECT APPROACH: When the glucose reaches 200-250 mg/dL, ADD DEXTROSE to the IV fluids (change to D5 0.45% NS or D10 0.45% NS) while maintaining the insulin drip at the same rate. The dextrose prevents hypoglycemia while the insulin continues to suppress ketogenesis and clear the anion gap. The insulin drip should only be discontinued when ALL of the following criteria are met (the 'DKA resolution criteria'): (1) Anion gap has closed (≤12 mEq/L); (2) pH >7.30; (3) Bicarbonate ≥15-18 mEq/L; (4) Patient is able to eat; (5) Subcutaneous insulin has been administered and has had time to take effect (overlap the insulin drip with the first SC dose by at least 1-2 hours to prevent rebound DKA). Emergency nursing responsibilities: (1) Monitor glucose every 1 hour during insulin drip; (2) Monitor BMP (including anion gap) every 2-4 hours; (3) Add dextrose to fluids when glucose reaches 200-250; (4) Monitor potassium closely — insulin drives K+ intracellularly, and hypokalemia can develop rapidly; (5) Replace potassium when K+ drops below 5.0-5.3 (goal 4.0-5.0); (6) HOLD insulin if K+ drops below 3.3 until repleted.",
    learningObjective: "Maintain insulin infusion for DKA until the anion gap closes, adding dextrose to fluids when glucose reaches 200-250 mg/dL",
    blueprintCategory: "Shock",
    subtopic: "distributive shock",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Glucose and ketoacidosis resolve at DIFFERENT rates — glucose drops first. Never stop insulin based on glucose alone. ADD dextrose and keep the drip going.",
    clinicalPearls: [
      "DKA resolution criteria: anion gap ≤12, pH >7.30, HCO3 ≥15-18, patient eating, SC insulin given with 1-2 hour overlap",
      "Add D5 or D10 to IV fluids when glucose reaches 200-250 — this prevents hypoglycemia while insulin continues treating ketoacidosis",
      "Stopping insulin prematurely based on glucose alone is the most common DKA management error"
    ],
    safetyNote: "Monitor K+ every 1-2 hours during insulin therapy — the transition from DKA hyperkalemia to hypokalemia can be sudden and cause cardiac arrest",
    distractorRationales: [
      "Decreasing insulin because glucose is falling treats the wrong target — the acidosis must be corrected first",
      "Stopping insulin entirely would allow ketogenesis to resume, worsening the acidosis despite improving glucose",
      "Increasing insulin beyond 0.1 units/kg/hr is rarely needed and increases the risk of hypokalemia and hypoglycemia"
    ],
    lessonPath: "/emergency/lessons/distributive-shock"
  },
  {
    stem: "A 65-year-old male with chronic heart failure (LVEF 15%) is brought to the ED in acute decompensated heart failure. He is in severe respiratory distress with pink frothy sputum, SpO2 78%, BP 160/100, and HR 120 (atrial fibrillation with RVR). What is the most important immediate intervention?",
    options: [
      "IV furosemide 80 mg to start diuresis — fluid overload is the primary problem",
      "Non-invasive positive pressure ventilation (NIPPV — BiPAP) at 10/5 cmH2O — this immediately reduces preload, reduces afterload, recruits atelectatic alveoli, and improves gas exchange without intubation",
      "Emergent intubation with rapid sequence induction for airway protection",
      "IV amiodarone for rate control of the atrial fibrillation"
    ],
    correctAnswer: 1,
    rationaleLong: "In acute cardiogenic pulmonary edema with adequate blood pressure (this patient has hypertensive acute heart failure with BP 160/100), non-invasive positive pressure ventilation (NIPPV, typically BiPAP — bilevel positive airway pressure) is the most impactful immediate intervention. BiPAP provides immediate hemodynamic AND respiratory benefit through multiple mechanisms: (1) PRELOAD REDUCTION — The positive intrathoracic pressure reduces venous return to the right heart, decreasing the volume of blood returning to the already overloaded left ventricle. This reduces pulmonary capillary hydrostatic pressure and helps resolve pulmonary edema; (2) AFTERLOAD REDUCTION — Positive pressure during systole reduces transmural pressure across the left ventricle, effectively reducing afterload and making it easier for the failing LV to eject blood. This improves cardiac output; (3) ALVEOLAR RECRUITMENT — The positive end-expiratory pressure (PEEP/EPAP) splints open fluid-filled and atelectatic alveoli, improving ventilation-perfusion matching and gas exchange; (4) REDUCED WORK OF BREATHING — The inspiratory pressure support (IPAP) augments the patient's inspiratory effort, reducing respiratory muscle oxygen consumption (which can be 25-30% of total oxygen consumption during severe respiratory distress). Clinical evidence: Multiple RCTs and meta-analyses have shown that NIPPV in acute cardiogenic pulmonary edema reduces the need for intubation by approximately 50%, reduces ICU mortality, and provides faster symptom relief compared to standard oxygen therapy. Typical settings: IPAP 10-12 cmH2O, EPAP 5-8 cmH2O, titrated to patient comfort and respiratory improvement. While IV furosemide is also critical, its onset of action for diuresis is 15-30 minutes, and its vasodilatory (preload-reducing) effect begins within 5 minutes but is less dramatic than BiPAP. NIPPV provides immediate mechanical benefit within the first few breaths. Both interventions should be initiated simultaneously, but BiPAP is the higher-priority immediate intervention. Intubation should be reserved for patients who fail NIPPV (worsening hypoxia, mental status decline, inability to protect airway, or hemodynamic instability). This patient's blood pressure of 160/100 is actually favorable for NIPPV — hypertensive patients with pulmonary edema have the best response to NIPPV and IV vasodilators (nitroglycerin drip) because afterload reduction dramatically improves cardiac output.",
    learningObjective: "Initiate BiPAP as first-line respiratory support for acute cardiogenic pulmonary edema and understand its hemodynamic mechanisms",
    blueprintCategory: "Shock",
    subtopic: "cardiogenic shock",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "BiPAP is NOT just respiratory support — it provides hemodynamic benefit (reduces preload AND afterload) that directly treats the underlying heart failure",
    clinicalPearls: [
      "BiPAP reduces intubation rates by ~50% in acute cardiogenic pulmonary edema — always try NIPPV first if BP allows",
      "Hypertensive pulmonary edema responds best to NIPPV — the afterload reduction dramatically improves LV output",
      "Pink frothy sputum = pulmonary edema with blood-tinged transudate from ruptured pulmonary capillaries"
    ],
    safetyNote: "BiPAP is CONTRAINDICATED if systolic BP <90 mmHg — the preload and afterload reduction can worsen hypotension and cause cardiovascular collapse",
    distractorRationales: [
      "Furosemide is important but has a slower onset — BiPAP provides immediate mechanical benefit within breaths, not minutes",
      "Intubation should be reserved for NIPPV failure — it carries risks of hemodynamic compromise during RSI in heart failure patients",
      "Rate control for AF is secondary to respiratory stabilization — treat the acute respiratory emergency first"
    ],
    lessonPath: "/emergency/lessons/cardiogenic-shock"
  },
  {
    stem: "A 42-year-old male with no prior medical history presents to the ED with acute-onset severe tearing chest pain radiating to the back between his scapulae. BP is 210/120 in the right arm and 160/90 in the left arm. A CT angiogram confirms Stanford type A aortic dissection. What are the two immediate pharmacological priorities BEFORE surgical repair?",
    options: [
      "IV heparin anticoagulation and aspirin for possible concurrent MI",
      "IV beta-blocker FIRST to reduce heart rate to <60 bpm and dP/dt (rate of aortic pressure rise), THEN IV vasodilator (nicardipine or nitroprusside) ONLY AFTER adequate beta-blockade to target SBP 100-120 mmHg",
      "IV nitroprusside alone to rapidly lower the blood pressure",
      "IV epinephrine to support cardiac output during the dissection"
    ],
    correctAnswer: 1,
    rationaleLong: "Acute Stanford type A aortic dissection (involving the ascending aorta) is a surgical emergency with mortality increasing approximately 1-2% per hour in the first 48 hours without surgical repair. While preparing for emergent surgery, two pharmacological goals must be achieved IN THE CORRECT ORDER: STEP 1 — IV BETA-BLOCKER FIRST: The primary hemodynamic goal is to reduce aortic wall shear stress, which is the force that propagates the dissection. Shear stress is proportional to the rate of rise of aortic pressure during systole (dP/dt), which is determined by HEART RATE and CONTRACTILITY. IV esmolol (loading dose 500 mcg/kg over 1 minute, then 50-200 mcg/kg/min infusion) or IV labetalol (20 mg IV bolus, then escalating doses or infusion) should be administered first to achieve: HR <60 bpm AND reduced contractility (lower dP/dt). STEP 2 — IV VASODILATOR AFTER ADEQUATE BETA-BLOCKADE: Once the heart rate is controlled (<60 bpm), if the SBP remains above 120 mmHg, an IV vasodilator should be added. Options include: IV nicardipine (5-15 mg/hr) or IV nitroprusside (0.25-10 mcg/kg/min). Target SBP is 100-120 mmHg. CRITICAL: Vasodilators must NEVER be given before or without adequate beta-blockade. The reason: vasodilators reduce SVR (afterload), which triggers a reflex tachycardia. Tachycardia increases heart rate AND contractility, dramatically increasing dP/dt and WORSENING the dissection — potentially causing rupture. Beta-blockade must be established first to block this reflex tachycardia. The BP discrepancy between arms (210/120 right vs 160/90 left) is classic for aortic dissection — the intimal flap partially obstructs flow to the left subclavian artery. Stanford type A involves the ascending aorta and requires SURGICAL repair (emergent ascending aortic replacement). Stanford type B involves only the descending aorta distal to the left subclavian and is typically managed MEDICALLY with anti-impulse therapy unless complicated by malperfusion, rupture, or rapid expansion. Anticoagulation (heparin) and antiplatelet therapy (aspirin) are CONTRAINDICATED in acute dissection — they can worsen hemorrhage if the aorta ruptures. IV epinephrine would dramatically increase heart rate, contractility, and blood pressure, catastrophically worsening the dissection.",
    learningObjective: "Implement anti-impulse therapy for aortic dissection with beta-blocker FIRST, then vasodilator, and understand why the order matters",
    blueprintCategory: "Shock",
    subtopic: "hemorrhagic shock",
    difficulty: 5,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "NEVER give vasodilators before beta-blockers in aortic dissection — reflex tachycardia from vasodilation increases dP/dt and can rupture the aorta",
    clinicalPearls: [
      "Beta-blocker FIRST, vasodilator SECOND — this order is critical. Target HR <60, SBP 100-120",
      "BP discrepancy between arms >20 mmHg is classic for aortic dissection — always compare bilateral BPs in chest pain patients",
      "Stanford A (ascending aorta) = surgical emergency. Stanford B (descending only) = usually medical management"
    ],
    safetyNote: "Anticoagulation and antiplatelets are CONTRAINDICATED in acute aortic dissection — they can cause fatal hemorrhage if the aorta ruptures",
    distractorRationales: [
      "Heparin and aspirin are contraindicated — they worsen bleeding risk in aortic dissection",
      "Nitroprusside alone without beta-blockade causes reflex tachycardia that can rupture the dissecting aorta",
      "Epinephrine would increase HR, contractility, and BP — all of which dramatically worsen the dissection"
    ],
    lessonPath: "/emergency/lessons/hemorrhagic-shock"
  },
  {
    stem: "A 50-year-old female with breast cancer is receiving her third cycle of doxorubicin chemotherapy. She presents to the ED 10 days after treatment with fever of 38.8°C, HR 115, BP 90/55, and an absolute neutrophil count (ANC) of 200 cells/μL (normal >1,500). What is this emergency, and what is the critical time-sensitive intervention?",
    options: [
      "Drug-induced agranulocytosis — discontinue doxorubicin and observe for recovery",
      "Febrile neutropenia with sepsis — broad-spectrum IV antibiotics (anti-pseudomonal coverage) must be administered within 60 minutes of presentation because these patients can deteriorate rapidly due to inability to mount an immune response",
      "Tumor lysis syndrome — start rasburicase and IV fluids",
      "Doxorubicin-induced cardiomyopathy — obtain echocardiogram and start heart failure treatment"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient has febrile neutropenia — defined as a single oral temperature ≥38.3°C (101°F) or sustained temperature ≥38.0°C (100.4°F) for ≥1 hour in a patient with an absolute neutrophil count (ANC) <500 cells/μL (or expected to decline to <500 within 48 hours). With an ANC of 200 (severely neutropenic), this patient has essentially no functional immune system to fight infection. Febrile neutropenia is a medical emergency because: (1) Neutropenic patients cannot mount a normal inflammatory response — they may have severe, life-threatening infections without the typical signs (no pus formation, no abscess wall, no infiltrate on initial chest X-ray despite pneumonia, no erythema despite cellulitis). Fever may be the ONLY sign of a potentially fatal infection; (2) Gram-negative sepsis in neutropenic patients can progress from fever to septic shock and death within HOURS — Pseudomonas aeruginosa bacteremia, in particular, has a mortality of 30-40% if antibiotics are delayed. The critical intervention is empiric broad-spectrum IV antibiotics with anti-pseudomonal coverage within 60 minutes of presentation. The 60-minute target mirrors the Surviving Sepsis Campaign recommendation and is supported by data showing that each hour of antibiotic delay in febrile neutropenia increases mortality. First-line empiric monotherapy options include: (1) Cefepime 2g IV (fourth-generation cephalosporin with anti-pseudomonal activity); (2) Piperacillin-tazobactam 4.5g IV; (3) Meropenem 1g IV (carbapenem — broadest spectrum, reserved for patients with recent antibiotic exposure or high-resistance risk). Additional coverage should be added for: MRSA — vancomycin if the patient has line infection, skin/soft tissue infection, hemodynamic instability, or known MRSA colonization; Fungal — antifungals (micafungin or voriconazole) if fever persists for >4-7 days despite broad-spectrum antibacterials. Emergency nursing priorities: (1) Antibiotics within 60 minutes — this is the most important intervention; (2) Blood cultures from 2 sites (including through any central line) BEFORE antibiotics, but do NOT delay antibiotics for cultures; (3) Do NOT perform a rectal exam or rectal temperature — risk of introducing bacteria through the compromised mucosal barrier; (4) Neutropenic precautions: private room, hand hygiene, avoid fresh flowers/fruit (potential fungal spore source); (5) IV fluid resuscitation for hypotension; (6) Consider G-CSF (filgrastim) to stimulate neutrophil production.",
    learningObjective: "Recognize febrile neutropenia as an emergency and administer anti-pseudomonal antibiotics within 60 minutes",
    blueprintCategory: "Shock",
    subtopic: "septic shock",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Neutropenic patients may have MINIMAL signs of infection despite severe sepsis — fever may be the ONLY clue. Normal-appearing wounds can be severely infected.",
    clinicalPearls: [
      "Febrile neutropenia: temp ≥38.3°C + ANC <500 = medical emergency requiring antibiotics within 60 minutes",
      "Anti-pseudomonal coverage is mandatory: cefepime, pip-tazo, or meropenem — Pseudomonas bacteremia kills rapidly",
      "Do NOT perform rectal exams or take rectal temperatures in neutropenic patients — risk of bacteremia from mucosal disruption"
    ],
    safetyNote: "No fresh flowers, fresh fruit, or raw vegetables in the neutropenic patient's room — these can harbor Aspergillus and other fungal organisms",
    distractorRationales: [
      "Simply stopping the drug and observing is dangerous — the patient has active sepsis that requires immediate antibiotic treatment",
      "Tumor lysis syndrome presents with hyperuricemia, hyperkalemia, hyperphosphatemia, and hypocalcemia — not the pattern described",
      "Doxorubicin cardiomyopathy is a real concern but presents with heart failure symptoms — the acute presentation here is infectious, not cardiac"
    ],
    lessonPath: "/emergency/lessons/septic-shock"
  },
  {
    stem: "A 35-year-old male involved in a high-speed MVC presents with bilateral femur fractures. He is initially stabilized with traction splints and fluid resuscitation. On hospital day 2, he develops sudden-onset dyspnea, petechial rash across his chest, axillae, and conjunctivae, confusion, and SpO2 of 82%. What complication has developed?",
    options: [
      "Pulmonary embolism from deep vein thrombosis — administer heparin anticoagulation",
      "Fat embolism syndrome (FES) — fat globules from fractured long bones have embolized to the lungs and brain, and the petechial rash is pathognomonic for this condition",
      "Hospital-acquired pneumonia — start broad-spectrum antibiotics",
      "ARDS from massive transfusion — initiate lung-protective ventilation"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient has fat embolism syndrome (FES), a potentially life-threatening complication that typically occurs 24-72 hours after long bone fractures (most commonly femur and tibia). The classic clinical triad of FES is: (1) RESPIRATORY DISTRESS — Fat globules released from the bone marrow of fractured long bones enter the venous circulation and lodge in the pulmonary microvasculature, causing mechanical obstruction and a subsequent inflammatory response. The free fatty acids released by lipase action on the fat globules are directly toxic to the pulmonary endothelium, causing capillary leak, alveolar hemorrhage, and non-cardiogenic pulmonary edema (ARDS-like picture); (2) NEUROLOGICAL DETERIORATION — Fat emboli can traverse the pulmonary vasculature (through pulmonary shunts or a patent foramen ovale) and reach the cerebral circulation, causing microinfarctions. Presentations range from confusion and agitation to seizures and coma; (3) PETECHIAL RASH — This is the most specific (pathognomonic) finding of FES. The petechiae appear in a characteristic distribution: chest, axillae, conjunctivae, and oral mucosa. They are caused by fat emboli obstructing dermal capillaries, and the pattern reflects areas with rich capillary networks. The petechiae are transient (may disappear within 24 hours) and may be missed if not specifically looked for. Gurd's criteria for FES diagnosis require at least one major criterion (respiratory distress, neurological deterioration, or petechial rash) plus at least four minor criteria (tachycardia, fever, retinal changes, jaundice, renal dysfunction, thrombocytopenia, elevated ESR, or fat macroglobulinemia). Treatment of FES is primarily SUPPORTIVE: (1) Supplemental oxygen and mechanical ventilation with lung-protective settings (low tidal volumes 6 mL/kg IBW, PEEP) if needed; (2) IV fluid resuscitation to maintain adequate organ perfusion; (3) Corticosteroids — controversial, but methylprednisolone may reduce the inflammatory component (some evidence supports prophylactic use in high-risk patients); (4) Early fixation of long bone fractures — reduces the ongoing release of fat into the circulation. Prevention of FES focuses on early stabilization of long bone fractures (within 24 hours), careful surgical technique (reaming and nailing generate intramedullary pressure that forces fat into the venous system), and adequate hydration.",
    learningObjective: "Diagnose fat embolism syndrome by its classic triad (respiratory distress, neurological changes, petechial rash) occurring 24-72 hours after long bone fractures",
    blueprintCategory: "Shock",
    subtopic: "obstructive shock",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "The petechial rash in FES is PATHOGNOMONIC — no other condition produces petechiae in this specific distribution (chest, axillae, conjunctivae) after long bone fractures",
    clinicalPearls: [
      "FES classic triad: respiratory distress + neurological changes + petechial rash — occurring 24-72 hours after fracture",
      "Petechiae in FES are transient (may disappear in 24 hours) and appear on chest, axillae, and conjunctivae",
      "Early fracture fixation reduces FES risk — delays in fixation allow continued fat release into the venous system"
    ],
    safetyNote: "Monitor all patients with long bone fractures closely for 72 hours — FES can develop even in seemingly stable patients and deterioration can be rapid",
    distractorRationales: [
      "PE does not cause the pathognomonic petechial rash pattern — and typically presents differently from FES",
      "HAP would present with fever and productive cough — not the petechial rash and neurological changes typical of FES",
      "While ARDS can develop in FES, the petechial rash and neurological findings make FES the specific diagnosis rather than generic ARDS"
    ],
    lessonPath: "/emergency/lessons/obstructive-shock"
  },
  {
    stem: "A 58-year-old male with a tracheostomy for laryngeal cancer presents to the ED in respiratory distress. The inner cannula is clogged with thick mucus and the patient is unable to ventilate. SpO2 is dropping to 72%. The nurse attempts to suction through the tracheostomy but cannot pass the catheter. What is the immediate intervention?",
    options: [
      "Attempt oral intubation bypassing the tracheostomy",
      "Remove the inner cannula immediately — if the tracheostomy tube has a removable inner cannula, removing it restores the airway lumen. If ventilation is still inadequate, remove the entire tracheostomy tube and ventilate through the stoma or perform orotracheal intubation",
      "Administer nebulized saline through the tracheostomy to dissolve the mucus plug",
      "Apply supplemental oxygen via nasal cannula and wait for the respiratory therapist"
    ],
    correctAnswer: 1,
    rationaleLong: "Tracheostomy tube obstruction from mucus plugging is a life-threatening emergency that requires immediate action. The approach follows a systematic algorithm: STEP 1 — REMOVE THE INNER CANNULA: Most tracheostomy tubes have a removable inner cannula (an inner tube that fits inside the outer cannula). The inner cannula is designed to be removed for cleaning precisely because mucus accumulation is common. Removing the obstructed inner cannula immediately restores the full lumen of the outer cannula, allowing ventilation. This is the fastest and simplest intervention — it takes seconds. STEP 2 — If no inner cannula exists or removing it does not restore ventilation (obstruction is in the outer cannula or below): ATTEMPT SUCTIONING through the now-larger lumen of the outer cannula. STEP 3 — If suctioning fails: REMOVE THE ENTIRE TRACHEOSTOMY TUBE. In a mature tracheostomy (>7 days old), a well-formed stoma tract exists, and the tracheostomy can be removed and replaced. While the tube is out, the patient can be ventilated by: (a) Placing a bag-valve mask directly over the stoma; (b) Inserting a new tracheostomy tube or endotracheal tube through the stoma; (c) Performing orotracheal intubation (if the upper airway is patent — which may NOT be the case in this patient with laryngeal cancer, as the tumor may obstruct the upper airway). STEP 4 — For a fresh tracheostomy (<7 days): the stoma tract has not matured, and removing the tube may cause loss of the airway (the tract can collapse). In this case, a tracheal hook or stay sutures (if placed at surgery) can help maintain the stoma opening while a new tube is inserted. Critical nursing considerations for tracheostomy patients: (1) Always have a spare tracheostomy tube (same size AND one size smaller) at the bedside; (2) Keep tracheal dilators/obturator at the bedside; (3) Inner cannula should be cleaned/changed every 4-8 hours or more frequently with thick secretions; (4) Humidification is essential — tracheostomy bypasses the natural humidification of the nose and mouth, leading to thick, dried secretions that are prone to plugging; (5) Suctioning should be performed using sterile technique, with the catheter no longer than the length of the tracheostomy tube (to avoid tracheal injury).",
    learningObjective: "Manage tracheostomy tube obstruction using the systematic approach: remove inner cannula, attempt suction, remove entire tube if needed",
    blueprintCategory: "Shock",
    subtopic: "obstructive shock",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Always try removing the INNER CANNULA first — it is designed to be removable precisely for this situation. It takes 2 seconds and can be life-saving.",
    clinicalPearls: [
      "Tracheostomy emergency algorithm: remove inner cannula → suction → remove entire tube → ventilate through stoma or orotracheal intubation",
      "Always have a spare tracheostomy tube (same size + one size smaller) at the bedside of every tracheostomy patient",
      "Humidification prevents mucus plugging — tracheostomy bypasses natural airway humidification"
    ],
    safetyNote: "In laryngeal cancer patients, oral intubation may be IMPOSSIBLE due to upper airway obstruction from the tumor — the stoma may be the ONLY airway",
    distractorRationales: [
      "Oral intubation may not be possible in this patient with laryngeal cancer — always try restoring the tracheostomy airway first",
      "Nebulized saline is too slow — this patient has an SpO2 of 72% and needs immediate airway restoration, not minutes of nebulization",
      "Waiting for a respiratory therapist while the SpO2 is 72% is dangerous — this is a nursing emergency that requires immediate action"
    ],
    lessonPath: "/emergency/lessons/obstructive-shock"
  },
  {
    stem: "A 70-year-old male on hemodialysis three times weekly missed his last two sessions. He presents to the ED with dyspnea, generalized edema, and an ECG showing peaked T waves, widened QRS complexes, and a sine wave pattern. His potassium is 8.2 mEq/L. What are the THREE sequential priorities for managing this life-threatening hyperkalemia?",
    options: [
      "Kayexalate, furosemide, and fluid restriction",
      "Three sequential priorities: (1) STABILIZE the myocardium with IV calcium gluconate, (2) SHIFT potassium intracellularly with insulin/dextrose and sodium bicarbonate, (3) REMOVE potassium from the body with emergent hemodialysis",
      "Albuterol nebulizer, oral kayexalate, and dietary counseling",
      "IV normal saline, furosemide, and repeat ECG in 2 hours"
    ],
    correctAnswer: 1,
    rationaleLong: "Severe hyperkalemia (K+ >6.5 mEq/L with ECG changes) is an immediately life-threatening emergency. The sine wave pattern on ECG indicates the patient is near cardiac arrest — this is a pre-terminal rhythm. The three sequential priorities follow the 'STABILIZE-SHIFT-REMOVE' framework: PRIORITY 1 — STABILIZE THE MYOCARDIUM: IV calcium gluconate 1-3 g (10-30 mL of 10% solution) or calcium chloride 1 g via central line. Calcium does NOT lower potassium — instead, it raises the threshold potential of cardiomyocytes, stabilizing the myocardial cell membrane and reducing the risk of arrhythmias. The onset is within 1-3 minutes, and the effect lasts 30-60 minutes. This buys time for definitive treatment. Calcium should be given first because the other treatments take longer to work and the patient is at imminent risk of VF or asystole. PRIORITY 2 — SHIFT POTASSIUM INTRACELLULARLY: (a) Regular insulin 10 units IV with D50 25g (50 mL of 50% dextrose) — insulin activates the Na+/K+-ATPase pump, driving potassium into cells. Onset 15-30 minutes, lowers K+ by 0.5-1.5 mEq/L. The dextrose prevents hypoglycemia (monitor glucose every 30-60 minutes for 4-6 hours); (b) Sodium bicarbonate 50-100 mEq IV — shifts potassium intracellularly by raising blood pH (as hydrogen ions move out of cells to buffer the bicarbonate, potassium moves in to maintain electrical neutrality). Most effective in patients with concurrent metabolic acidosis; (c) Nebulized albuterol 10-20 mg — high-dose albuterol activates beta-2 receptors which stimulate the Na+/K+-ATPase pump. Can lower K+ by 0.5-1.0 mEq/L. Note: the dose for hyperkalemia (10-20 mg) is much higher than the standard respiratory dose (2.5-5 mg). PRIORITY 3 — REMOVE POTASSIUM FROM THE BODY: (a) Emergent hemodialysis — the most effective method for potassium removal, especially in this dialysis-dependent patient. Can remove 25-50 mEq of potassium per hour; (b) Sodium polystyrene sulfonate (Kayexalate) — binds potassium in the GI tract in exchange for sodium. Onset 1-2 hours for oral, 30-60 minutes for rectal. Note: concerns about intestinal necrosis with sorbitol-containing preparations; (c) Loop diuretics — increase renal potassium excretion, but NOT effective in this anuric/dialysis-dependent patient; (d) Patiromer or sodium zirconium cyclosilicate — newer oral potassium binders with better safety profiles.",
    learningObjective: "Execute the STABILIZE-SHIFT-REMOVE framework for life-threatening hyperkalemia management",
    blueprintCategory: "Shock",
    subtopic: "cardiogenic shock",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Calcium does NOT lower potassium — it only stabilizes the myocardium. You still need insulin/dextrose to SHIFT and dialysis to REMOVE the excess potassium.",
    clinicalPearls: [
      "ECG progression of hyperkalemia: peaked T waves → prolonged PR → widened QRS → sine wave → asystole/VF",
      "STABILIZE (calcium) → SHIFT (insulin+D50, bicarb, albuterol) → REMOVE (dialysis, Kayexalate)",
      "Monitor glucose for 4-6 hours after insulin administration — delayed hypoglycemia is common and potentially fatal"
    ],
    safetyNote: "NEVER give IV calcium and sodium bicarbonate through the same IV line — they precipitate as calcium carbonate, occluding the line",
    distractorRationales: [
      "Kayexalate alone is too slow and does not address the immediate cardiac risk — calcium must come first",
      "Albuterol is an adjunct but not sufficient alone — and dietary counseling is irrelevant in this acute emergency",
      "IV saline and furosemide are ineffective in this anuric dialysis patient — dialysis is the definitive removal method"
    ],
    lessonPath: "/emergency/lessons/cardiogenic-shock"
  },
  {
    stem: "A 25-year-old female presents to the ED with sudden-onset right-sided pleuritic chest pain and dyspnea. She is tall and thin (BMI 17). Chest X-ray shows a 40% right pneumothorax with no mediastinal shift. Vitals: BP 120/78, HR 92, RR 22, SpO2 94%. What is the initial management?",
    options: [
      "Observation with supplemental oxygen only — small pneumothoraces resolve spontaneously",
      "Chest tube placement (pigtail catheter or small-bore chest tube) with underwater seal drainage — a 40% pneumothorax is large and requires intervention, though needle decompression is not needed because there is no tension physiology",
      "Emergent needle decompression followed by chest tube placement",
      "Intubation and mechanical ventilation to support the collapsed lung"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient has a primary spontaneous pneumothorax (PSP) — occurring without trauma or underlying lung disease, most common in tall, thin young adults (especially males, though it occurs in females as well). The tall, thin body habitus is a risk factor because these individuals tend to have higher transpulmonary pressures at the lung apices (due to the greater height of the lung), which predisposes apical blebs to rupture. A 40% pneumothorax is considered LARGE (most guidelines use >15-20% or >2 cm rim of air on chest X-ray as the threshold for intervention). The absence of mediastinal shift and the hemodynamic stability indicate this is a simple (non-tension) pneumothorax. Management: A chest tube (or pigtail catheter — smaller, less painful, equally effective for simple pneumothorax) should be placed with connection to an underwater seal drainage system (water seal, not wall suction initially — gentle drainage allows the lung to re-expand gradually, reducing the risk of re-expansion pulmonary edema). Placement site: 4th or 5th intercostal space, mid-axillary line (the 'safe triangle'). Needle decompression is NOT indicated because there is no tension physiology (no hemodynamic instability, no mediastinal shift, no respiratory failure). Needle decompression is a life-saving emergency procedure for TENSION pneumothorax only. Observation alone is appropriate for SMALL pneumothoraces (<15-20% or <2 cm rim) in asymptomatic patients — the air is reabsorbed at approximately 1.25% of the pneumothorax volume per day (or 2.5% per day with supplemental oxygen). At 40%, this pneumothorax is too large for observation. Re-expansion pulmonary edema is a rare but serious complication of rapid re-expansion of a collapsed lung — it occurs when the lung has been collapsed for >3 days and is rapidly re-expanded. Symptoms include cough, chest pain, and unilateral pulmonary edema on the side of the re-expanded lung. Prevention: avoid excessive wall suction, allow gradual re-expansion with water seal drainage.",
    learningObjective: "Differentiate management of simple pneumothorax (chest tube) from tension pneumothorax (needle decompression) based on hemodynamic status",
    blueprintCategory: "Shock",
    subtopic: "obstructive shock",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Simple pneumothorax = chest tube. Tension pneumothorax = NEEDLE DECOMPRESSION first, then chest tube. Do not perform needle decompression for a stable, simple pneumothorax.",
    clinicalPearls: [
      "Primary spontaneous pneumothorax: tall, thin young adults — apical blebs rupture from high transpulmonary pressures",
      "Pigtail catheters (small-bore) are equally effective and less painful than large-bore chest tubes for simple pneumothorax",
      "Air reabsorption rate: ~1.25%/day on room air, ~2.5%/day on supplemental oxygen — small pneumothoraces may be observed"
    ],
    safetyNote: "Avoid positive-pressure ventilation in a patient with untreated pneumothorax — positive pressure can convert a simple pneumothorax to tension pneumothorax",
    distractorRationales: [
      "At 40%, this pneumothorax is too large for observation alone — intervention is needed to evacuate the air",
      "Needle decompression is for tension pneumothorax with hemodynamic instability — not for stable simple pneumothorax",
      "Intubation and positive-pressure ventilation could worsen the pneumothorax by forcing more air through the lung defect"
    ],
    lessonPath: "/emergency/lessons/obstructive-shock"
  },
  {
    stem: "A 62-year-old female with end-stage renal disease presents to the ED with chest pain and hemodynamic instability. Her ECG shows diffuse ST elevation in all leads with PR segment depression. The cardiology team rules out acute MI by cardiac catheterization (clean coronaries). Echocardiogram shows a large pericardial effusion. She has been on hemodialysis irregularly. What is the cause, and why are dialysis patients prone to this?",
    options: [
      "Viral pericarditis — administer NSAIDs and colchicine",
      "Uremic pericarditis — dialysis patients develop pericardial inflammation from accumulated uremic toxins (urea, creatinine, and other retained solutes) that irritate the pericardium. Treatment is intensive hemodialysis without heparin",
      "Post-MI Dressler syndrome — administer aspirin and colchicine",
      "Lupus-related pericarditis — start high-dose corticosteroids"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient has uremic pericarditis, an inflammatory condition of the pericardium caused by the accumulation of uremic toxins in patients with end-stage renal disease (ESRD). When dialysis is irregular or inadequate, nitrogenous waste products (urea, creatinine, uric acid, and other retained solutes) accumulate to toxic levels. These uremic toxins cause direct chemical irritation of the pericardial membranes, leading to fibrinous pericarditis, pericardial effusion, and potentially cardiac tamponade. Uremic pericarditis occurs in approximately 6-10% of dialysis patients and is an indication for urgent intensification of dialysis. The diffuse ST elevation with PR depression on ECG is the classic pattern of pericarditis (as opposed to the focal ST elevation in specific coronary territories seen with MI). The clean coronary angiogram confirms pericarditis rather than ACS. Treatment: INTENSIVE (DAILY) HEMODIALYSIS is the primary treatment — typically daily sessions for 1-2 weeks until the pericarditis resolves. The goal is to aggressively clear the uremic toxins causing the pericardial inflammation. IMPORTANT: Hemodialysis for uremic pericarditis should be performed WITHOUT SYSTEMIC HEPARIN (heparin-free dialysis or regional citrate anticoagulation). The reason: heparin anticoagulation risks hemorrhagic conversion of the pericardial effusion, which can cause cardiac tamponade. If the pericardial effusion causes hemodynamic compromise (tamponade physiology), pericardiocentesis should be performed as a temporizing measure while dialysis intensification addresses the underlying cause. NSAIDs and colchicine (standard treatment for viral/idiopathic pericarditis) are generally AVOIDED in uremic pericarditis because: (1) NSAIDs are nephrotoxic and contraindicated in renal failure; (2) Colchicine requires dose adjustment in renal failure; (3) The primary treatment is dialysis, not anti-inflammatory agents. Corticosteroids may be considered if intensive dialysis fails to resolve the pericarditis (dialysis-associated pericarditis, which occurs in patients already on adequate dialysis, may be more responsive to steroids). The emergency nurse should monitor for tamponade: JVD, pulsus paradoxus, hypotension, electrical alternans on ECG.",
    learningObjective: "Diagnose uremic pericarditis in dialysis patients and initiate heparin-free intensive hemodialysis as primary treatment",
    blueprintCategory: "Shock",
    subtopic: "obstructive shock",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Use HEPARIN-FREE dialysis for uremic pericarditis — systemic heparin can cause hemorrhagic conversion of the pericardial effusion, leading to tamponade",
    clinicalPearls: [
      "Uremic pericarditis = indication for intensive daily dialysis — toxin clearance is the primary treatment",
      "Diffuse ST elevation with PR depression = pericarditis pattern on ECG (vs focal ST elevation in MI)",
      "NSAIDs are contraindicated in ESRD — avoid in uremic pericarditis, unlike other types of pericarditis"
    ],
    safetyNote: "Monitor for cardiac tamponade during and after dialysis — fluid shifts during hemodialysis can worsen or improve pericardial hemodynamics unpredictably",
    distractorRationales: [
      "Viral pericarditis is treated with NSAIDs/colchicine — both are problematic in ESRD and the etiology here is uremic",
      "Dressler syndrome occurs weeks after MI — this patient has clean coronaries ruling out MI",
      "Lupus pericarditis is possible but the clinical context (ESRD, irregular dialysis) strongly suggests uremic etiology"
    ],
    lessonPath: "/emergency/lessons/obstructive-shock"
  },
  {
    stem: "A 30-year-old male firefighter is brought to the ED after being trapped in a burning building. He has extensive burns covering 60% total body surface area (TBSA) with a mix of partial and full-thickness burns. He weighs 80 kg. Using the Parkland formula, how much IV fluid should he receive in the first 24 hours, and how should it be divided?",
    options: [
      "Normal saline 10,000 mL over 24 hours at a constant rate",
      "Lactated Ringer's solution: 4 mL × body weight (kg) × %TBSA burned = 19,200 mL in 24 hours. Give HALF (9,600 mL) in the first 8 hours and the remaining HALF (9,600 mL) over the next 16 hours",
      "D5W 5,000 mL over 24 hours with albumin supplementation",
      "Colloid solution (albumin) 15,000 mL over 24 hours"
    ],
    correctAnswer: 1,
    rationaleLong: "The Parkland formula (also called the Baxter formula) is the most widely used burn resuscitation formula and calculates the crystalloid volume needed in the first 24 hours post-burn injury: Volume = 4 mL × body weight (kg) × %TBSA burned. For this patient: 4 × 80 kg × 60% = 19,200 mL of LACTATED RINGER'S solution in the first 24 hours. The timing of administration is critical: FIRST 8 HOURS: Give HALF the calculated volume (9,600 mL) — this accounts for the period of maximum capillary permeability when fluid shifts from the intravascular space into the interstitium are most pronounced. Rate = 9,600 mL / 8 hours = 1,200 mL/hour; NEXT 16 HOURS: Give the remaining HALF (9,600 mL). Rate = 9,600 mL / 16 hours = 600 mL/hour. Important: The 8 hours starts from the TIME OF BURN INJURY, not the time of ED arrival. If the patient arrives 2 hours after the burn, the remaining half-volume must be given over the remaining 6 hours of the first 8-hour window. LACTATED RINGER'S (LR) is the preferred crystalloid for burn resuscitation because: (1) It is a balanced electrolyte solution with a composition similar to plasma; (2) Normal saline in large volumes causes hyperchloremic metabolic acidosis (NS contains 154 mEq/L chloride vs plasma 96-106 mEq/L); (3) The lactate in LR is metabolized by the liver to bicarbonate, providing a mild buffering effect. The Parkland formula is a STARTING POINT — actual fluid administration should be titrated based on urine output. Target urine output for adults: 0.5-1.0 mL/kg/hour (30-50 mL/hour for most adults). For electrical burns or crush injuries with myoglobinuria: target 1-2 mL/kg/hour to prevent myoglobin-induced AKI. Monitoring: (1) Foley catheter — continuous urine output monitoring is essential; (2) Avoid 'fluid creep' — administering more than the Parkland calculation without clinical indication increases edema, compartment syndrome risk, and ARDS; (3) Monitor for abdominal compartment syndrome — massive fluid resuscitation can cause intra-abdominal hypertension; (4) Monitor electrolytes, particularly sodium (hypernatremia can develop from evaporative water losses through burn wounds).",
    learningObjective: "Calculate burn resuscitation fluid volume using the Parkland formula and correctly time the administration",
    blueprintCategory: "Shock",
    subtopic: "distributive shock",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "The 8-hour window starts from TIME OF INJURY, not time of arrival. If the patient arrives 2 hours post-burn, the first half must be given in the remaining 6 hours.",
    clinicalPearls: [
      "Parkland formula: 4 mL × kg × %TBSA. Half in first 8 hours, half over next 16 hours.",
      "Lactated Ringer's is preferred over NS — large-volume NS causes hyperchloremic acidosis",
      "Titrate to urine output 0.5-1.0 mL/kg/hr — the formula is a starting point, not a fixed prescription"
    ],
    safetyNote: "Avoid 'fluid creep' — excessive fluid beyond the Parkland calculation increases edema, compartment syndrome, and ARDS risk without improving outcomes",
    distractorRationales: [
      "Normal saline causes hyperchloremic acidosis in large volumes — LR is the preferred crystalloid for burn resuscitation",
      "D5W has no electrolytes and would cause severe hyponatremia — it is not used for acute burn resuscitation",
      "Colloids (albumin) are not used in the first 24 hours — capillary permeability is too high and colloids leak into the interstitium"
    ],
    lessonPath: "/emergency/lessons/distributive-shock"
  },
  {
    stem: "A 45-year-old male presents to the ED with a history of heavy alcohol use and 3 days of worsening confusion, tremors, and visual hallucinations (seeing insects crawling on the walls). His HR is 140, BP 180/100, temperature 39.0°C, and he is profusely diaphoretic. He has a generalized tonic-clonic seizure in the ED. What is the diagnosis, and what are the first-line and second-line medications?",
    options: [
      "Acute psychosis — administer haloperidol for the hallucinations and phenytoin for the seizure",
      "Delirium tremens (DT) — first-line is IV benzodiazepines (diazepam or lorazepam) for both seizures AND autonomic instability. Second-line for refractory DT is phenobarbital or propofol infusion",
      "Serotonin syndrome — administer cyproheptadine and supportive cooling",
      "Status epilepticus — administer levetiracetam and emergent EEG monitoring"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient has delirium tremens (DT), the most severe form of alcohol withdrawal, occurring 48-96 hours after the last drink. DT has a mortality rate of 5-15% without treatment (primarily from cardiovascular collapse, hyperthermia, or aspiration). The hallmark features include: altered sensorium (confusion, disorientation), visual hallucinations (classically insects, animals, or people), autonomic hyperactivity (tachycardia, hypertension, diaphoresis, hyperthermia), tremors, and seizures. The pathophysiology: chronic alcohol potentiates GABA (inhibitory neurotransmission) and inhibits NMDA glutamate (excitatory neurotransmission). When alcohol is abruptly withdrawn, the brain experiences a massive imbalance — reduced GABAergic inhibition and unopposed glutamatergic excitation — causing the sympathetic storm of DT. FIRST-LINE: IV BENZODIAZEPINES — Benzodiazepines are GABA-A receptor agonists that directly replace the lost GABAergic inhibition from alcohol withdrawal. They treat ALL components of DT: seizures, autonomic instability, agitation, and hallucinations. Dosing: Diazepam 10-20 mg IV every 5-15 minutes until symptoms are controlled (symptom-triggered dosing guided by the CIWA scale), or lorazepam 2-4 mg IV if liver failure is present (lorazepam is metabolized by glucuronidation, not hepatic oxidation). Some patients with severe DT require massive doses (hundreds of milligrams of diazepam). SECOND-LINE: For REFRACTORY DT (not responding to adequate benzodiazepine dosing): (a) Phenobarbital 130-260 mg IV — a barbiturate that also enhances GABAergic transmission but through a different mechanism (binds the barbiturate site on the GABA receptor, increasing the DURATION of chloride channel opening, compared to benzodiazepines which increase FREQUENCY of channel opening). Phenobarbital has a synergistic effect with benzodiazepines; (b) Propofol infusion — for ICU-level refractory cases requiring intubation. Propofol acts on GABA receptors AND reduces glutamate activity. IMPORTANT: Phenytoin is NOT effective for alcohol withdrawal seizures — it works on sodium channels, not the GABA pathway that is pathologically affected in withdrawal. Haloperidol can worsen DT by lowering the seizure threshold.",
    learningObjective: "Treat delirium tremens with benzodiazepines as first-line therapy and escalate to phenobarbital for refractory cases",
    blueprintCategory: "Shock",
    subtopic: "distributive shock",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Phenytoin does NOT work for alcohol withdrawal seizures — it acts on sodium channels, not the GABA pathway. Benzodiazepines are the ONLY first-line treatment.",
    clinicalPearls: [
      "DT occurs 48-96 hours after last drink — mortality 5-15% without treatment. Look for visual hallucinations + autonomic storm.",
      "Lorazepam is preferred over diazepam in liver failure — metabolized by glucuronidation (not CYP450 oxidation)",
      "Phenobarbital increases DURATION of GABA channel opening vs benzodiazepines which increase FREQUENCY — synergistic effects"
    ],
    safetyNote: "Haloperidol lowers the seizure threshold and can cause fatal torsades de pointes in DT — avoid it. Benzodiazepines treat ALL components of DT.",
    distractorRationales: [
      "Haloperidol lowers seizure threshold and phenytoin is ineffective for alcohol withdrawal seizures — both are wrong choices",
      "Serotonin syndrome requires serotonergic medication exposure — visual hallucinations + alcohol withdrawal history points to DT",
      "Levetiracetam is not first-line for alcohol withdrawal seizures — benzodiazepines address the underlying pathophysiology"
    ],
    lessonPath: "/emergency/lessons/distributive-shock"
  },
  {
    stem: "A 52-year-old male with severe sepsis from a urinary source is being aggressively resuscitated. He has received 4 liters of IV crystalloid. The nurse wants to assess whether additional fluid will improve his cardiac output. What bedside test can be performed to assess fluid responsiveness without actually giving more fluid?",
    options: [
      "Check central venous pressure (CVP) — if CVP is <8 mmHg, give more fluid",
      "Passive leg raise (PLR) test — elevate the patient's legs to 45 degrees while lowering the head of bed, which autotransfuses approximately 300 mL of venous blood from the legs to the central circulation. If cardiac output or pulse pressure increases by ≥10%, the patient is fluid-responsive",
      "Calculate the fluid balance and give fluid if the patient is net-negative",
      "Assess skin turgor and mucous membranes to determine hydration status"
    ],
    correctAnswer: 1,
    rationaleLong: "The passive leg raise (PLR) test is a dynamic, bedside, reversible test of fluid responsiveness that 'simulates' a fluid bolus without actually administering additional fluid. This is critically important in sepsis because over-resuscitation with excessive fluid leads to worse outcomes (pulmonary edema, abdominal compartment syndrome, tissue edema impairing organ function). Technique: (1) Start with the patient semi-recumbent at 45 degrees; (2) Lower the head of bed to flat (0 degrees) AND elevate the legs to 45 degrees simultaneously (using the bed controls or by lifting the legs). This position transfers approximately 250-300 mL of venous blood from the capacitance vessels in the legs and abdomen to the central circulation; (3) Measure the hemodynamic response within 1-2 minutes — if cardiac output (measured by bedside echo, arterial line pulse contour analysis, or other cardiac output monitor) or pulse pressure increases by ≥10%, the patient is 'fluid-responsive' and likely to benefit from additional fluid administration; (4) Return the patient to the original position — the effect is fully reversible. Why PLR is superior to static measurements: CVP is a STATIC measurement that is a poor predictor of fluid responsiveness. A CVP of 8 or 12 does not reliably tell you whether additional fluid will improve cardiac output — it depends on the patient's ventricular compliance, intrathoracic pressure, and position on the Frank-Starling curve. Both the SSC guidelines and critical care literature have moved away from CVP-targeted resuscitation because: (1) CVP reflects right atrial pressure, not left ventricular preload; (2) The relationship between CVP and fluid responsiveness is weak; (3) Targeting a specific CVP number leads to excessive fluid administration. Dynamic assessments like PLR, pulse pressure variation (PPV), and stroke volume variation (SVV) are superior predictors of fluid responsiveness. PLR has the advantage of being applicable in spontaneously breathing patients (PPV and SVV require passive mechanical ventilation with specific tidal volumes to be accurate). After adequate fluid resuscitation (the Surviving Sepsis Campaign recommends an initial 30 mL/kg crystalloid bolus within 3 hours), further fluid administration should be guided by dynamic assessments of fluid responsiveness, not by static CVP targets.",
    learningObjective: "Perform the passive leg raise test to assess fluid responsiveness and understand why static CVP targets are unreliable",
    blueprintCategory: "Shock",
    subtopic: "septic shock",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "CVP is a POOR predictor of fluid responsiveness — do not use CVP targets alone to guide fluid administration. Use dynamic assessments like PLR.",
    clinicalPearls: [
      "PLR: lower HOB to flat, elevate legs 45° — autotransfuses ~300 mL. ≥10% increase in CO/PP = fluid responsive.",
      "PLR is reversible — if it doesn't help, you haven't given unnecessary fluid that cannot be taken back",
      "CVP targets (8-12 mmHg) are no longer recommended for guiding fluid resuscitation in sepsis"
    ],
    safetyNote: "Over-resuscitation with excessive IV fluid worsens outcomes in sepsis — use PLR to determine if additional fluid will actually help before giving it",
    distractorRationales: [
      "CVP is a static measurement that poorly predicts fluid responsiveness — it has been de-emphasized in modern sepsis guidelines",
      "Fluid balance calculations do not reflect the patient's hemodynamic status at the bedside — the same volume may be adequate or inadequate depending on cardiac function",
      "Skin turgor and mucous membranes are unreliable indicators of intravascular volume status in critically ill patients"
    ],
    lessonPath: "/emergency/lessons/septic-shock"
  },
  {
    stem: "A 48-year-old female with a history of mitral valve prolapse presents to the ED with acute onset of severe left-sided chest pain and dyspnea. Her BP is 80/50, HR 130, with a loud holosystolic murmur at the apex radiating to the axilla and bilateral crackles to the apices. Echocardiogram shows a flail posterior mitral valve leaflet with severe mitral regurgitation and a hyperdynamic left ventricle. What type of shock is this?",
    options: [
      "Distributive shock from pain and anxiety — administer morphine and observe",
      "Acute cardiogenic shock from acute severe mitral regurgitation — the sudden volume overload from the incompetent valve overwhelms the unprepared left ventricle, causing pulmonary edema and hemodynamic collapse. Emergent surgical repair is needed.",
      "Obstructive shock from aortic dissection — administer IV beta-blockers",
      "Hypovolemic shock — the patient is dehydrated from the chest pain-related poor oral intake"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient has acute cardiogenic shock from acute severe mitral regurgitation (MR) caused by a flail mitral valve leaflet — likely from chordae tendineae rupture (which can occur spontaneously in myxomatous mitral valve disease/mitral valve prolapse). Acute severe MR is fundamentally different from chronic MR in its hemodynamic impact. In CHRONIC MR, the left ventricle gradually dilates to accommodate the regurgitant volume, and the left atrium enlarges to act as a low-pressure reservoir — the patient may remain compensated for years. In ACUTE MR, the left ventricle and left atrium have NOT had time to adapt. The sudden large regurgitant volume causes: (1) IMMEDIATE PULMONARY EDEMA — each systole, a significant portion of the stroke volume is regurgitated backward through the incompetent mitral valve into the left atrium (which is normal-sized and non-compliant). The sudden volume entering the non-compliant LA causes rapid, severe elevation of left atrial pressure, which is transmitted to the pulmonary capillaries, causing acute flash pulmonary edema (bilateral crackles to the apices); (2) FORWARD FLOW FAILURE — the blood regurgitating into the LA is 'stolen' from the effective forward cardiac output. Despite a hyperdynamic (hypercontractile) LV (which is trying to compensate), the net forward cardiac output is severely reduced, causing hypotension and shock; (3) The loud holosystolic murmur at the apex radiating to the axilla is classic for mitral regurgitation — the apex is where the mitral valve is best auscultated. Medical management is temporizing only: (1) Afterload reduction (nitroprusside or nitroglycerin infusion, if BP permits) — reducing afterload makes it 'easier' for blood to flow forward through the aortic valve rather than backward through the incompetent mitral valve; (2) Intra-aortic balloon pump (IABP) — reduces afterload during systole (reducing regurgitant fraction) and augments coronary perfusion during diastole; (3) Inotropic support (dobutamine) if needed; (4) Diuretics for pulmonary edema. DEFINITIVE TREATMENT is emergent surgical mitral valve repair or replacement. This patient will likely die without surgical intervention — acute severe MR is not survivable with medical management alone.",
    learningObjective: "Diagnose acute severe mitral regurgitation as a cause of cardiogenic shock and recognize the need for emergent surgical intervention",
    blueprintCategory: "Shock",
    subtopic: "cardiogenic shock",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Acute MR causes shock even with a hyperdynamic (normal EF) ventricle — the problem is that blood regurgitates backward, not that the heart isn't contracting well",
    clinicalPearls: [
      "Acute MR: non-dilated LV + non-dilated LA + severe pulmonary edema = acute onset. Chronic MR: dilated LV + dilated LA + compensated for years.",
      "Afterload reduction IMPROVES forward flow in MR — reducing resistance in the aortic direction redirects blood forward instead of backward",
      "A new loud murmur + flash pulmonary edema + hemodynamic collapse = acute valvular emergency — call surgery immediately"
    ],
    safetyNote: "Do NOT delay surgical consultation in acute severe MR — medical management is only a bridge. Mortality without surgery approaches 75% within 24 hours in severe cases.",
    distractorRationales: [
      "The hemodynamic collapse and pulmonary edema are from mechanical valve failure, not anxiety — morphine would further suppress respiratory drive and worsen shock",
      "Aortic dissection causes tearing back pain and BP discrepancy between arms — not the valve-related murmur and pulmonary edema pattern seen here",
      "Hypovolemic shock does not cause bilateral pulmonary edema — the crackles to the apices indicate fluid overload, not dehydration"
    ],
    lessonPath: "/emergency/lessons/cardiogenic-shock"
  },
  {
    stem: "A 26-year-old male presents to the ED after a diving accident. He dove into shallow water and struck his head on the bottom. He is conscious but unable to move any extremities (quadriplegic). His BP is 72/40 with HR 52. He is warm and flushed below the neck but cold and clammy above. What is the most likely type of shock?",
    options: [
      "Hemorrhagic shock from internal injuries sustained in the dive",
      "Neurogenic shock from acute cervical spinal cord injury — loss of sympathetic tone below the injury level causes vasodilation (hypotension) and unopposed vagal tone (bradycardia)",
      "Cardiogenic shock from a cardiac contusion sustained during the impact",
      "Septic shock from aspiration of contaminated water during submersion"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient has neurogenic shock from an acute cervical spinal cord injury (SCI) sustained when his head struck the bottom of the shallow water. Neurogenic shock is a form of distributive shock caused by the acute loss of sympathetic nervous system tone below the level of the spinal cord injury. The sympathetic chain exits the spinal cord from T1 to L2. A cervical SCI above T1 disrupts ALL sympathetic outflow, causing: (1) MASSIVE VASODILATION — Loss of sympathetic-mediated vasoconstriction below the injury level causes blood to pool in the dilated peripheral vasculature, dramatically reducing venous return and cardiac preload. This is why the patient is warm and flushed below the neck (vasodilated) but cold and clammy above (intact sympathetic response above the injury attempting to compensate for the hypotension); (2) BRADYCARDIA — The cardiac sympathetic fibers originate from T1-T4. When these are disrupted, the heart loses its sympathetic (accelerator) innervation while the vagus nerve (CN X, originating from the brainstem ABOVE the injury) remains intact. The result is UNOPPOSED VAGAL TONE causing bradycardia. This is the hallmark distinguishing feature: neurogenic shock = hypotension + BRADYCARDIA, while hemorrhagic shock = hypotension + TACHYCARDIA; (3) POIKILOTHERMIA — Loss of sympathetic control of cutaneous blood vessels below the injury prevents thermoregulation. The patient's body temperature below the injury level drifts toward ambient temperature. Treatment of neurogenic shock: (1) IV fluid resuscitation (first-line) — 1-2 L NS bolus. However, fluids alone may be insufficient because the problem is vasodilation, not volume loss; (2) VASOPRESSORS — Norepinephrine (preferred) or phenylephrine. Norepinephrine provides both alpha-1 vasoconstriction AND beta-1 cardiac stimulation (addressing both the vasodilation and bradycardia); (3) ATROPINE 0.5-1 mg IV for symptomatic bradycardia (blocks the unopposed vagal tone); (4) Target MAP ≥85-90 mmHg for the first 5-7 days (higher than the typical MAP ≥65 target for other shock types) — studies show that maintaining higher perfusion pressures may improve neurological outcomes by optimizing spinal cord perfusion at the injury site; (5) MAINTAIN STRICT SPINAL IMMOBILIZATION — until definitive imaging and neurosurgical evaluation. IMPORTANT: Neurogenic shock is a diagnosis of EXCLUSION in trauma. Hemorrhagic shock must be ruled out first because it is more common and life-threatening. A trauma patient can have BOTH neurogenic and hemorrhagic shock simultaneously.",
    learningObjective: "Differentiate neurogenic shock from hemorrhagic shock using the bradycardia/tachycardia distinction and target MAP ≥85-90 mmHg for spinal cord perfusion",
    blueprintCategory: "Shock",
    subtopic: "distributive shock",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Neurogenic shock = hypotension + BRADYCARDIA. Hemorrhagic shock = hypotension + TACHYCARDIA. This distinction is critical for diagnosis and treatment.",
    clinicalPearls: [
      "Neurogenic shock: hypotension + bradycardia + warm skin below injury. Hemorrhagic: hypotension + tachycardia + cold clammy skin",
      "Target MAP ≥85-90 mmHg for 5-7 days post-SCI — higher perfusion pressures may improve neurological outcomes",
      "Neurogenic shock is a diagnosis of EXCLUSION — always rule out hemorrhage first in trauma"
    ],
    safetyNote: "A trauma patient can have BOTH neurogenic and hemorrhagic shock simultaneously — if the patient has cervical SCI, do not assume all hypotension is neurogenic. Search for bleeding sources.",
    distractorRationales: [
      "Hemorrhagic shock causes TACHYCARDIA (compensatory sympathetic response) — this patient has BRADYCARDIA, which points to neurogenic etiology",
      "Cardiac contusion would cause tachycardia or arrhythmias with abnormal ECG — not the bradycardia and quadriplegia pattern",
      "Septic shock would not develop within minutes of a diving injury — it requires hours to days for infection to cause shock"
    ],
    lessonPath: "/emergency/lessons/distributive-shock"
  },
  {
    stem: "A nurse is caring for a patient in the ICU who developed hospital-acquired septic shock from a central line-associated bloodstream infection (CLABSI). Blood cultures are positive for Candida albicans. What is the appropriate antifungal treatment, and what should be done with the central venous catheter?",
    options: [
      "Continue using the existing central line and start oral fluconazole",
      "Remove the central venous catheter immediately and start IV echinocandin (micafungin or caspofungin) as first-line empiric therapy for Candida bloodstream infection, with de-escalation to fluconazole if the species is susceptible",
      "Keep the central line in place and add antifungal lock therapy",
      "Switch to a peripheral IV and start IV amphotericin B deoxycholate as the first-line agent"
    ],
    correctAnswer: 1,
    rationaleLong: "Candidemia (Candida bloodstream infection) is a serious healthcare-associated infection with a mortality rate of 30-50%. Central venous catheters are the most common source of candidemia in hospitalized patients because Candida species form biofilms on the catheter surface that are resistant to antifungal penetration. Two simultaneous interventions are critical: (1) REMOVE THE CENTRAL LINE — This is essential source control. Candida biofilms on the catheter are extremely difficult to eradicate with antifungal therapy alone. Studies consistently show that failure to remove the infected catheter is associated with prolonged candidemia, increased metastatic complications (endophthalmitis, endocarditis, osteomyelitis), and higher mortality. A new central line should be placed at a different site if central access is still needed. The removed catheter tip should be sent for culture; (2) START IV ECHINOCANDIN — The Infectious Diseases Society of America (IDSA) guidelines recommend an echinocandin (micafungin 100 mg IV daily, caspofungin 70 mg IV loading then 50 mg daily, or anidulafungin 200 mg IV loading then 100 mg daily) as first-line empiric treatment for candidemia. Echinocandins are preferred because: (a) They have fungicidal activity against Candida (fluconazole is only fungistatic); (b) They cover all common Candida species including C. glabrata and C. krusei (which may be fluconazole-resistant); (c) They have excellent safety profiles with minimal drug interactions; (d) They are effective against Candida biofilms. De-escalation to IV or oral fluconazole is appropriate once the Candida species is identified as susceptible (C. albicans, C. parapsilosis, and C. tropicalis are typically fluconazole-susceptible). Fluconazole is preferred for step-down because it has excellent oral bioavailability and CNS/eye penetration. Duration of treatment: minimum 14 days from the first negative blood culture. All candidemia patients require a dilated fundoscopic exam to evaluate for Candida endophthalmitis (occurs in 5-10% of candidemia cases). Amphotericin B deoxycholate is no longer first-line due to significant nephrotoxicity, infusion reactions, and electrolyte wasting. Lipid formulations of amphotericin B (liposomal, lipid complex) have better safety profiles and are reserved for patients who fail or cannot tolerate echinocandins or fluconazole.",
    learningObjective: "Manage candidemia with immediate catheter removal and empiric echinocandin therapy, with appropriate de-escalation when species identification is available",
    blueprintCategory: "Shock",
    subtopic: "septic shock",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "The infected central line MUST be removed in candidemia — Candida biofilms on catheters are resistant to antifungal penetration and perpetuate the infection",
    clinicalPearls: [
      "Echinocandins are first-line for candidemia — fungicidal, broad Candida coverage, excellent safety profile",
      "Remove the infected catheter immediately — failure to remove is associated with prolonged candidemia and higher mortality",
      "All candidemia patients need a dilated eye exam — Candida endophthalmitis occurs in 5-10% of cases"
    ],
    safetyNote: "Duration of antifungal treatment is 14 days from the first NEGATIVE blood culture — not from the first positive. Repeat blood cultures every 48 hours until clearance.",
    distractorRationales: [
      "Keeping the existing line guarantees persistent candidemia from the biofilm — source control (removal) is mandatory",
      "Antifungal lock therapy alone is insufficient for candidemia — it may be used for salvage of non-tunneled catheters in selected cases, but catheter removal is still preferred",
      "Amphotericin B deoxycholate has significant toxicity and is no longer first-line — echinocandins are preferred"
    ],
    lessonPath: "/emergency/lessons/septic-shock"
  },
  {
    stem: "A 55-year-old male with a history of alcoholic cirrhosis presents with abdominal distension, fever of 38.5°C, and diffuse abdominal tenderness. Diagnostic paracentesis reveals an ascitic fluid absolute neutrophil count (ANC) of 450 cells/μL. His BP drops to 82/50. What is the diagnosis and the specific fluid resuscitation strategy?",
    options: [
      "Secondary bacterial peritonitis — emergent surgical exploration for a perforated viscus",
      "Spontaneous bacterial peritonitis (SBP) — IV ceftriaxone for antibiotics and IV albumin (1.5 g/kg on day 1 and 1 g/kg on day 3) to prevent hepatorenal syndrome and reduce mortality",
      "Malignant ascites — drain the ascites completely and start chemotherapy",
      "Tuberculous peritonitis — start a 4-drug anti-TB regimen"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient has spontaneous bacterial peritonitis (SBP), defined as infection of ascitic fluid without an identifiable intra-abdominal surgical source. The diagnosis is made by paracentesis showing an ascitic fluid absolute neutrophil count (ANC) ≥250 cells/μL. This patient's ANC of 450 exceeds the diagnostic threshold. SBP occurs in approximately 10-30% of hospitalized cirrhotic patients with ascites. The most common organisms are gram-negative enteric bacteria (E. coli, Klebsiella) that translocate from the gut through the edematous intestinal wall and compromised gut barrier into the ascitic fluid. The cirrhotic patient's impaired immune function (defective complement, reduced opsonization, diminished reticuloendothelial function) prevents effective clearance of these translocated bacteria. Treatment has TWO essential components: (1) IV ANTIBIOTICS — Ceftriaxone 2g IV daily (or cefotaxime 2g IV every 8 hours) is the standard empiric regimen. Third-generation cephalosporins provide excellent coverage for the common gram-negative pathogens causing SBP. Duration: 5-7 days; (2) IV ALBUMIN — This is the UNIQUE component of SBP management that distinguishes it from other infections. The landmark Sort et al. (1999, NEJM) study demonstrated that IV albumin (1.5 g/kg on day 1 and 1.0 g/kg on day 3) in addition to antibiotics significantly reduced the incidence of hepatorenal syndrome (from 33% to 10%) and in-hospital mortality (from 29% to 10%) compared to antibiotics alone. Albumin works by: expanding intravascular volume (reducing the renal vasoconstriction that drives hepatorenal syndrome), improving effective arterial blood volume (cirrhotic patients have severe splanchnic vasodilation with 'underfilling' of the central circulation), binding inflammatory mediators, and improving endothelial function. This is one of the few situations in critical care where albumin (a colloid) has been definitively shown to improve mortality over crystalloid resuscitation. The nurse should: obtain blood cultures before antibiotics, monitor renal function daily (creatinine trend), and perform a repeat paracentesis at 48 hours to confirm a decrease in ascitic fluid ANC by ≥25% (indicating treatment response).",
    learningObjective: "Diagnose SBP by paracentesis (ANC ≥250) and administer the specific albumin protocol (1.5 g/kg day 1, 1 g/kg day 3) alongside antibiotics to prevent hepatorenal syndrome",
    blueprintCategory: "Shock",
    subtopic: "septic shock",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "IV albumin in SBP is NOT optional — it reduces hepatorenal syndrome from 33% to 10% and mortality from 29% to 10%. This is one of the strongest evidence-based albumin indications.",
    clinicalPearls: [
      "SBP diagnosis: ascitic fluid ANC ≥250 cells/μL — do not wait for culture results to start treatment",
      "Albumin dosing: 1.5 g/kg day 1 + 1.0 g/kg day 3 — specifically reduces hepatorenal syndrome and mortality",
      "Repeat paracentesis at 48 hours — expect ≥25% decrease in ANC to confirm treatment response"
    ],
    safetyNote: "Secondary prophylaxis with daily norfloxacin or ciprofloxacin is indicated after SBP episode — recurrence rate without prophylaxis is approximately 70% within 1 year",
    distractorRationales: [
      "Secondary peritonitis shows multiple organisms and very high ANC (often >10,000) on paracentesis — SBP is typically monomicrobial",
      "Malignant ascites has a different cytology (positive for malignant cells) and treatment (not antibiotics + albumin)",
      "TB peritonitis presents with lymphocytic predominance in ascitic fluid and high ADA levels — not the neutrophilic pattern of SBP"
    ],
    lessonPath: "/emergency/lessons/septic-shock"
  },
  {
    stem: "A 40-year-old male is undergoing procedural sedation with propofol in the ED for shoulder reduction. After 3 minutes, the nurse notices he has stopped breathing. His SpO2 drops from 98% to 85%. His jaw is relaxed and his tongue has fallen posteriorly. What is the FIRST intervention before considering intubation?",
    options: [
      "Administer naloxone to reverse the propofol",
      "Perform basic airway maneuvers: jaw thrust (or head-tilt chin-lift if no c-spine concern) to relieve the tongue obstruction, followed by bag-valve-mask ventilation with an oral/nasal airway if needed",
      "Immediately perform endotracheal intubation with rapid sequence induction",
      "Apply supplemental oxygen via nasal cannula and wait for the propofol to wear off"
    ],
    correctAnswer: 1,
    rationaleLong: "This is a common and expected complication of procedural sedation: propofol-induced respiratory depression with upper airway obstruction from loss of pharyngeal muscle tone (the tongue and soft palate fall posteriorly, obstructing the airway). The FIRST intervention is to perform BASIC AIRWAY MANEUVERS, not intubation. The vast majority of airway complications during procedural sedation can be managed with basic interventions without requiring endotracheal intubation. Step-by-step management: (1) JAW THRUST — Place your fingers behind the angles of the mandible and push the jaw anteriorly. This moves the tongue forward away from the posterior pharyngeal wall, opening the airway. The jaw thrust is the preferred technique in any patient where cervical spine injury is a concern because it does not require neck extension. Alternatively, the head-tilt chin-lift maneuver (extending the head and lifting the chin) opens the airway but requires neck extension; (2) ORAL PHARYNGEAL AIRWAY (OPA) — An appropriately sized OPA (measured from the corner of the mouth to the angle of the jaw) holds the tongue anteriorly, maintaining airway patency. Only use in unconscious patients (it will cause gagging and potential vomiting in a patient with intact reflexes). Alternatively, a nasopharyngeal airway (NPA) is better tolerated in patients with partial sedation; (3) BAG-VALVE-MASK (BVM) VENTILATION — Once the airway is patent, provide assisted ventilation with a BVM connected to high-flow oxygen. Use the E-C technique (E-shaped fingers lifting the mandible, C-shaped fingers sealing the mask to the face). Deliver breaths over 1 second, with enough volume to see the chest rise; (4) SUCTION — If secretions are contributing to the obstruction. Only if basic maneuvers FAIL should intubation be considered. Propofol is a very short-acting agent (redistribution half-life 2-8 minutes), and most patients will resume spontaneous breathing within a few minutes as the drug redistributes from the brain to peripheral tissues. Naloxone reverses OPIOIDS, not propofol. There is no specific reversal agent for propofol. The key teaching point is that every clinician performing procedural sedation must be proficient in basic airway management before it is needed — having the skills and equipment at the bedside prevents a manageable apnea from becoming a crisis.",
    learningObjective: "Manage procedural sedation-related apnea with basic airway maneuvers (jaw thrust, OPA, BVM ventilation) before considering intubation",
    blueprintCategory: "Shock",
    subtopic: "obstructive shock",
    difficulty: 1,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Propofol has NO specific reversal agent. Naloxone reverses opioids only. Flumazenil reverses benzodiazepines only. Manage propofol complications with supportive airway care.",
    clinicalPearls: [
      "Most procedural sedation airway complications resolve with basic maneuvers (jaw thrust + OPA + BVM) — intubation is rarely needed",
      "Propofol redistribution half-life: 2-8 minutes — most patients resume breathing within minutes with supportive airway management",
      "E-C technique for BVM ventilation: E-fingers lift mandible, C-fingers seal mask — the most important skill in airway management"
    ],
    safetyNote: "Every procedural sedation setup must include suction, BVM, OPA/NPA, and intubation equipment at the bedside BEFORE sedation begins — preparedness prevents emergencies",
    distractorRationales: [
      "Naloxone reverses OPIOID effects only — propofol is a GABA agonist and naloxone has no effect on it",
      "Immediate intubation is excessive — basic airway maneuvers resolve the vast majority of procedural sedation airway complications",
      "Nasal cannula alone cannot ventilate an apneic patient — positive pressure ventilation with BVM is needed when the patient is not breathing"
    ],
    lessonPath: "/emergency/lessons/obstructive-shock"
  },
  {
    stem: "A 68-year-old male presents to the ED with sudden-onset severe back pain, bilateral leg weakness, and urinary retention. He has a history of a thoracic aortic aneurysm. On exam, he has flaccid paralysis of both lower extremities with absent reflexes and loss of sensation below T10. His BP is 180/95. What has happened, and why is this a vascular emergency?",
    options: [
      "Cauda equina syndrome from lumbar disc herniation — emergent MRI and neurosurgical consultation",
      "Anterior spinal artery syndrome from aortic pathology — the artery of Adamkiewicz (major radicular artery supplying the lower two-thirds of the spinal cord) has been occluded by thrombosis, dissection, or rupture of the thoracic aneurysm, causing spinal cord infarction",
      "Guillain-Barré syndrome — ascending paralysis from autoimmune demyelination",
      "Transverse myelitis — autoimmune inflammation of the spinal cord requiring IV steroids"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient has anterior spinal artery syndrome (spinal cord infarction) caused by compromise of the artery of Adamkiewicz in the setting of thoracic aortic pathology (aneurysm with possible dissection, thrombosis, or rupture). The artery of Adamkiewicz is the largest segmental artery feeding the anterior spinal artery. It typically originates from the left side of the aorta between T9 and T12 (though its origin varies) and is the predominant blood supply to the lower two-thirds of the spinal cord. When the thoracic aorta develops pathology (dissection, aneurysm with mural thrombus, or iatrogenic occlusion during aortic surgery), the artery of Adamkiewicz can be occluded, causing infarction of the anterior two-thirds of the spinal cord — this is anterior spinal artery syndrome. The clinical presentation reflects which spinal cord tracts are supplied by the anterior spinal artery: (1) MOTOR LOSS (corticospinal tracts) — bilateral flaccid paralysis below the level of infarction (initially flaccid due to spinal shock, may later become spastic as upper motor neuron signs develop); (2) PAIN AND TEMPERATURE LOSS (spinothalamic tracts) — bilateral loss below the level; (3) AUTONOMIC DYSFUNCTION (intermediolateral cell column) — bladder and bowel dysfunction, urinary retention; (4) PRESERVED proprioception and vibration (posterior columns) — these are supplied by the posterior spinal arteries, which are NOT affected in anterior spinal artery syndrome. This preservation of posterior column function distinguishes anterior spinal artery syndrome from complete cord injury. The urinary retention and bilateral leg weakness with known thoracic aneurysm should immediately raise concern for aortic pathology. Emergent CT angiography of the chest and abdomen should be obtained to evaluate the thoracic aneurysm for dissection, contained rupture, or mural thrombus occluding the artery of Adamkiewicz. Vascular surgery consultation is emergent. Management is primarily supportive with blood pressure optimization to maintain spinal cord perfusion (MAP targets similar to acute SCI: ≥85-90 mmHg), and treatment of the underlying aortic pathology if surgically amenable. Unfortunately, spinal cord infarction carries a poor prognosis for neurological recovery in most cases.",
    learningObjective: "Recognize anterior spinal artery syndrome from aortic pathology and understand the role of the artery of Adamkiewicz in spinal cord perfusion",
    blueprintCategory: "Shock",
    subtopic: "obstructive shock",
    difficulty: 5,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Sudden bilateral leg weakness + known thoracic aortic pathology = anterior spinal artery syndrome until proven otherwise. Check proprioception — if preserved, this confirms anterior cord syndrome.",
    clinicalPearls: [
      "Artery of Adamkiewicz (T9-T12, usually left side) is the major supply to the lower spinal cord — vulnerable to aortic pathology",
      "Anterior spinal artery syndrome: motor loss + pain/temp loss + autonomic dysfunction BUT preserved proprioception/vibration",
      "Spinal cord infarction from aortic pathology is a known complication of aortic aneurysm repair — occurs in 2-8% of thoracoabdominal aneurysm surgeries"
    ],
    safetyNote: "Emergent CTA of the chest/abdomen is mandatory when spinal cord ischemia is suspected with known aortic pathology — the underlying aortic emergency may also be life-threatening",
    distractorRationales: [
      "Cauda equina syndrome involves the nerve roots below the conus (L1-L2 level) — this patient has a T10 level indicating cord pathology, and the known aortic aneurysm points to vascular etiology",
      "GBS develops over days to weeks with ascending pattern — not sudden-onset with known aortic pathology",
      "Transverse myelitis is inflammatory, not vascular — and would not explain the association with thoracic aortic aneurysm"
    ],
    lessonPath: "/emergency/lessons/obstructive-shock"
  },
  {
    stem: "A 38-year-old male presents to the ED after ingesting an unknown quantity of metformin in a suicide attempt. He is obtunded with Kussmaul breathing, BP 70/35, HR 140. Labs show pH 6.9, lactate 22 mmol/L, glucose 95 mg/dL, and creatinine 4.8 mg/dL. What is the definitive treatment for this severe metformin-associated lactic acidosis (MALA)?",
    options: [
      "IV sodium bicarbonate boluses to correct the acidosis",
      "Emergent hemodialysis — metformin is dialyzable and hemodialysis simultaneously corrects the life-threatening acidosis, removes the drug, and addresses the renal failure",
      "Activated charcoal administration and supportive care",
      "IV dextrose and insulin infusion to correct the metabolic derangement"
    ],
    correctAnswer: 1,
    rationaleLong: "Metformin-associated lactic acidosis (MALA) is rare but has a mortality rate of approximately 30-50% when it occurs. Metformin inhibits mitochondrial complex I in the electron transport chain, shifting cellular metabolism from aerobic to anaerobic glycolysis. This massively increases lactate production while simultaneously inhibiting hepatic lactate clearance (gluconeogenesis from lactate is also impaired). In overdose, the resulting lactic acidosis can be extreme — this patient's lactate of 22 mmol/L and pH 6.9 represent life-threatening metabolic acidosis. Notably, the glucose is 95 mg/dL (not elevated) — metformin does not typically cause hypoglycemia in overdose because its mechanism is insulin-sensitization and gluconeogenesis inhibition, not direct insulin stimulation. The renal failure (creatinine 4.8) is both a contributing factor and a consequence: metformin is exclusively renally eliminated, so renal impairment causes drug accumulation, and the severe acidosis/hemodynamic instability further worsens renal function. EMERGENT HEMODIALYSIS is the definitive treatment for severe MALA because it addresses THREE problems simultaneously: (1) DRUG REMOVAL — Metformin has a low molecular weight (165 Da), low protein binding (<10%), and small volume of distribution, making it highly dialyzable. Hemodialysis can rapidly reduce metformin levels; (2) ACIDOSIS CORRECTION — The dialysis bath contains bicarbonate, which is infused into the patient while acidic blood is removed, rapidly correcting the life-threatening pH; (3) RENAL REPLACEMENT — Dialysis provides renal support while the patient's kidneys are failing. Sodium bicarbonate infusion is a TEMPORIZING measure — it can be given while preparing for dialysis (target pH ≥7.15 to maintain cardiovascular stability and catecholamine responsiveness), but it cannot definitively correct the ongoing acid production from metformin toxicity. Bicarbonate addresses the symptom (acidosis) but not the cause (metformin). Supportive care includes: vasopressors for hemodynamic support (norepinephrine — noting that vasopressors are less effective in severe acidosis, which is why bicarbonate temporization matters), intubation for airway protection if obtunded, and monitoring for electrolyte derangements during and after dialysis. Hemodialysis sessions may need to be prolonged (>8 hours) or repeated because metformin has a large volume of distribution in overdose, and rebound toxicity from tissue redistribution can occur after the first session.",
    learningObjective: "Identify emergent hemodialysis as the definitive treatment for severe metformin-associated lactic acidosis and understand its triple benefit",
    blueprintCategory: "Shock",
    subtopic: "distributive shock",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Metformin does NOT cause hypoglycemia — even in massive overdose, glucose is typically normal or low-normal. The danger is lactic acidosis, not hypoglycemia.",
    clinicalPearls: [
      "MALA triad: severe lactic acidosis + metformin exposure + renal failure — mortality 30-50% without dialysis",
      "Hemodialysis provides triple benefit: removes metformin + corrects acidosis + replaces renal function",
      "Vasopressors are less effective at pH <7.2 — temporize with IV bicarbonate while arranging dialysis"
    ],
    safetyNote: "Prolonged or repeated dialysis sessions may be needed — metformin redistributes from tissues causing rebound lactic acidosis after initial dialysis clears plasma levels",
    distractorRationales: [
      "Bicarbonate alone treats the symptom (acidosis) but not the cause (ongoing metformin toxicity) — it is a bridge to dialysis, not definitive treatment",
      "Activated charcoal may be useful within 1-2 hours of ingestion but is unlikely to help in this obtunded patient who presents with established toxicity",
      "Insulin and dextrose are for DKA management — metformin overdose is not insulin-related and the glucose is already normal"
    ],
    lessonPath: "/emergency/lessons/distributive-shock"
  },
  {
    stem: "A 50-year-old male with a history of chronic kidney disease presents to the ED with progressive dyspnea, orthopnea, and bilateral lower extremity edema. He missed his last three hemodialysis sessions. His BP is 200/120, SpO2 82% on room air, HR 110, and he has bilateral crackles to the apices with pink frothy sputum. What is the immediate management priority?",
    options: [
      "Start IV furosemide 80 mg and wait for diuresis to begin",
      "Emergent hemodialysis for volume removal AND non-invasive positive pressure ventilation (BiPAP) for respiratory support — diuretics will not work in anuric/oliguric ESRD patients",
      "Intubation and mechanical ventilation followed by IV nitroglycerin drip",
      "Phlebotomy to reduce circulating blood volume"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient has acute pulmonary edema from volume overload in the setting of end-stage renal disease (ESRD) with missed hemodialysis sessions. This is a unique clinical scenario because the standard treatment for acute pulmonary edema — IV loop diuretics — will NOT work in patients with ESRD who have minimal or no residual renal function. Furosemide works by inhibiting sodium reabsorption in the loop of Henle, but this requires functioning nephrons to have any effect. In anuric or severely oliguric ESRD patients, diuretics are essentially useless. The management requires a two-pronged approach: (1) RESPIRATORY SUPPORT with BiPAP (non-invasive positive pressure ventilation) — BiPAP immediately reduces preload (positive intrathoracic pressure reduces venous return), reduces afterload (decreases transmural cardiac wall stress), and improves gas exchange by recruiting fluid-filled alveoli. This provides critical stabilization while arranging definitive fluid removal; (2) EMERGENT HEMODIALYSIS with ultrafiltration — This is the ONLY way to remove the excess volume in an ESRD patient. Ultrafiltration during hemodialysis can remove 2-4 liters of fluid over a 3-4 hour session. The dialysis team should be contacted immediately upon recognition of this presentation. Additional measures: (1) IV nitroglycerin (if BP allows) — provides venodilation that reduces preload and can improve symptoms rapidly. Start at 5 mcg/min and titrate upward; (2) Morphine — historically used for flash pulmonary edema (reduces preload, reduces anxiety/dyspnea) but now controversial due to respiratory depression concerns. Current guidelines favor BiPAP over morphine; (3) Position the patient upright (high Fowler's) to reduce venous return and improve respiratory mechanics. The hypertensive crisis (200/120) in this patient is likely driven by the volume overload — blood pressure often normalizes once the excess fluid is removed by dialysis. Avoid aggressive antihypertensive therapy that could cause hypotension during subsequent dialysis.",
    learningObjective: "Recognize that diuretics are ineffective in anuric ESRD patients and emergent hemodialysis is required for volume removal in pulmonary edema",
    blueprintCategory: "Shock",
    subtopic: "cardiogenic shock",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Furosemide is USELESS in anuric ESRD — it requires functioning nephrons. Do not waste time on diuretics when the patient needs emergent dialysis.",
    clinicalPearls: [
      "ESRD + missed dialysis + pulmonary edema = emergent hemodialysis with ultrafiltration, not diuretics",
      "BiPAP bridges the gap while arranging dialysis — it provides immediate hemodynamic and respiratory benefit",
      "Hypertension in dialysis-dependent patients is usually volume-mediated — it resolves with fluid removal"
    ],
    safetyNote: "Contact the dialysis team IMMEDIATELY upon recognition — every minute of delay allows fluid to accumulate further in the lungs",
    distractorRationales: [
      "Furosemide will not work in an anuric/oliguric ESRD patient — it requires functioning nephrons to have any diuretic effect",
      "Intubation should be avoided if BiPAP is tolerated — intubation carries additional risks and may not address the underlying volume overload",
      "Phlebotomy is an outdated practice that removes blood cells along with volume — dialysis ultrafiltration is far superior for isolated volume removal"
    ],
    lessonPath: "/emergency/lessons/cardiogenic-shock"
  },
  {
    stem: "A 33-year-old female presents to the ED 2 days after a cesarean section with fever of 39.5°C, tachycardia, foul-smelling lochia, and lower abdominal tenderness with uterine fundal tenderness. She becomes hypotensive with BP 80/50. What is the most likely source of her sepsis?",
    options: [
      "Urinary tract infection from the indwelling catheter",
      "Postpartum endometritis (uterine infection) — the most common cause of postpartum fever, caused by ascending polymicrobial infection of the uterine lining after cesarean delivery",
      "Wound infection at the cesarean incision site",
      "Pulmonary embolism causing obstructive shock"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient has postpartum endometritis progressing to septic shock. Endometritis (infection of the uterine lining/endometrium) is the most common cause of postpartum fever and is significantly more common after cesarean delivery (5-15%) compared to vaginal delivery (1-3%). The disruption of the uterine cavity during surgery, combined with the large raw placental attachment site, creates an ideal environment for bacterial colonization. The infection is typically polymicrobial, involving a mix of organisms from the vaginal flora: Group B Streptococcus, E. coli, Bacteroides species (anaerobes), Gardnerella, Enterococcus, and other vaginal bacteria. These organisms ascend through the cervix into the uterine cavity where they infect the decidua (uterine lining) and potentially the myometrium and parametrium (surrounding tissues). The clinical presentation is characteristic: (1) Fever within 24-72 hours of delivery (particularly cesarean); (2) Uterine fundal tenderness — the uterus is tender on bimanual palpation, especially at the fundus; (3) Foul-smelling lochia — the normal postpartum discharge becomes malodorous due to bacterial infection; (4) Lower abdominal pain; (5) Tachycardia and potentially septic shock if untreated. Treatment: Broad-spectrum IV antibiotics covering gram-positive, gram-negative, and anaerobic organisms. The standard empiric regimen is clindamycin (900 mg IV every 8 hours) plus gentamicin (5 mg/kg IV daily or traditional dosing). This combination provides excellent coverage of the typical polymicrobial flora. Ampicillin is added if Enterococcus is suspected (poor response to initial therapy). Alternative: piperacillin-tazobactam or ampicillin-sulbactam as monotherapy. If septic shock develops, the Surviving Sepsis Campaign Hour-1 Bundle applies: blood cultures, antibiotics within 60 minutes, 30 mL/kg crystalloid, vasopressors for refractory hypotension. Source control considerations: if the patient does not improve with antibiotics within 48-72 hours, consider CT imaging to evaluate for pelvic abscess, retained products of conception (which serve as a nidus for ongoing infection and require uterine evacuation), or wound infection requiring drainage.",
    learningObjective: "Diagnose postpartum endometritis as the most common cause of postpartum fever and initiate appropriate polymicrobial antibiotic coverage",
    blueprintCategory: "Shock",
    subtopic: "septic shock",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Cesarean delivery increases endometritis risk 5-10x compared to vaginal delivery — always consider endometritis in post-cesarean fever",
    clinicalPearls: [
      "Classic regimen for endometritis: clindamycin + gentamicin — covers gram-positives, gram-negatives, and anaerobes",
      "Foul-smelling lochia + fundal tenderness + post-cesarean fever = endometritis until proven otherwise",
      "If no improvement in 48-72 hours, add ampicillin (for Enterococcus) or image for abscess/retained products"
    ],
    safetyNote: "Retained products of conception serve as a nidus for persistent infection — ultrasound evaluation of the uterine cavity is warranted if antibiotics fail",
    distractorRationales: [
      "UTI is possible but the uterine tenderness and foul-smelling lochia specifically point to endometritis as the source",
      "Wound infection would show erythema, warmth, and drainage at the incision site — the signs here point to the uterus",
      "PE causes pleuritic chest pain and dyspnea — not the uterine tenderness and malodorous lochia pattern"
    ],
    lessonPath: "/emergency/lessons/septic-shock"
  },
  {
    stem: "A 60-year-old male is admitted with community-acquired pneumonia. On hospital day 3, he develops worsening hypoxia requiring increasing FiO2. His PaO2/FiO2 ratio is 85 (normal >300). CXR shows bilateral diffuse infiltrates not fully explained by cardiac failure. What syndrome has developed, and what is the key ventilator strategy?",
    options: [
      "Congestive heart failure exacerbation — increase IV diuretics and start dobutamine",
      "Acute respiratory distress syndrome (ARDS) — implement lung-protective ventilation with low tidal volumes (6 mL/kg ideal body weight) and plateau pressure ≤30 cmH2O to prevent ventilator-induced lung injury",
      "Hospital-acquired pneumonia superimposed on CAP — change antibiotics and increase tidal volumes for better ventilation",
      "Pulmonary embolism — start therapeutic anticoagulation and consider thrombolysis"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient has developed acute respiratory distress syndrome (ARDS), defined by the Berlin criteria: (1) ACUTE ONSET — within 1 week of a known clinical insult or new/worsening respiratory symptoms; (2) BILATERAL OPACITIES on chest imaging not fully explained by effusions, lobar/lung collapse, or nodules; (3) RESPIRATORY FAILURE not fully explained by cardiac failure or fluid overload (need objective assessment such as echocardiogram to exclude hydrostatic pulmonary edema); (4) IMPAIRED OXYGENATION: PaO2/FiO2 ≤300 on PEEP ≥5 cmH2O (Mild: 200-300, Moderate: 100-200, Severe: ≤100). This patient's PaO2/FiO2 ratio of 85 classifies this as SEVERE ARDS. Community-acquired pneumonia is one of the most common causes of ARDS (others include sepsis, aspiration, pancreatitis, trauma, and transfusion-related acute lung injury). The key ventilator strategy is LUNG-PROTECTIVE VENTILATION, established by the landmark ARMA trial (ARDS Network, 2000, NEJM). The trial demonstrated that low tidal volume ventilation (6 mL/kg ideal body weight) reduced mortality by 22% compared to traditional tidal volumes (12 mL/kg IBW). The principles: (1) LOW TIDAL VOLUMES — 6 mL/kg IDEAL body weight (calculated from height, not actual weight). This prevents overdistension (volutrauma) of the remaining functional alveoli. In ARDS, lung compliance is heterogeneous — some areas are consolidated/fluid-filled and non-recruitable, while others are relatively normal. Traditional tidal volumes would disproportionately inflate the normal areas, causing overdistension and further injury; (2) PLATEAU PRESSURE ≤30 cmH2O — measured during an inspiratory pause, plateau pressure reflects alveolar distending pressure. Keeping it ≤30 prevents barotrauma; (3) ADEQUATE PEEP — Positive end-expiratory pressure keeps recruitable alveoli open, improving oxygenation and preventing cyclic atelectasis (atelectrauma). PEEP levels are titrated using FiO2/PEEP tables from the ARDS Network protocol; (4) PERMISSIVE HYPERCAPNIA — Low tidal volumes may result in elevated PaCO2. This is tolerated (permissive hypercapnia) as long as pH remains >7.20, because the mortality benefit of lung protection outweighs the risks of mild hypercapnia. Additional ARDS strategies for severe cases include: prone positioning (16+ hours/day — improves V/Q matching and mortality by ~16% in severe ARDS per the PROSEVA trial), neuromuscular blockade (cisatracurium for 48 hours in early severe ARDS — reduces barotrauma and may improve mortality), and conservative fluid management (once resuscitation is complete, aim for even to negative fluid balance to reduce pulmonary edema).",
    learningObjective: "Diagnose ARDS using the Berlin criteria and implement lung-protective ventilation with low tidal volumes to reduce mortality",
    blueprintCategory: "Shock",
    subtopic: "distributive shock",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Use IDEAL body weight (from height), not ACTUAL body weight, to calculate tidal volumes. An obese patient's lungs are not proportionally larger — using actual weight causes overdistension.",
    clinicalPearls: [
      "ARDS ventilation: 6 mL/kg IBW, plateau pressure ≤30, adequate PEEP, permissive hypercapnia if needed",
      "Prone positioning for 16+ hours/day reduces mortality by ~16% in severe ARDS — implement early",
      "PaO2/FiO2 ratio severity: Mild 200-300, Moderate 100-200, Severe ≤100 — guides treatment intensity"
    ],
    safetyNote: "Calculate tidal volume using IDEAL body weight from height (male: 50 + 2.3 × [height in inches - 60]; female: 45.5 + 2.3 × [height in inches - 60]) — using actual weight in obese patients causes dangerous overdistension",
    distractorRationales: [
      "CHF would show cardiomegaly and typically responds to diuretics — bilateral infiltrates with P/F <100 meeting Berlin criteria defines ARDS",
      "Increasing tidal volumes would cause ventilator-induced lung injury in ARDS — the exact opposite of evidence-based management",
      "PE does not cause bilateral diffuse infiltrates — it causes focal perfusion defects, not the diffuse bilateral pattern of ARDS"
    ],
    lessonPath: "/emergency/lessons/distributive-shock"
  },
  {
    stem: "A 72-year-old female with a permanent pacemaker set at 70 bpm presents to the ED with dizziness and near-syncope. Her HR is 70 bpm (paced rhythm), but she reports feeling worse with exertion. Her blood pressure drops from 130/80 at rest to 90/55 when she walks in the hallway. An echocardiogram shows a normal LVEF. What pacemaker-related condition is causing her symptoms?",
    options: [
      "Pacemaker syndrome from loss of AV synchrony — the pacemaker is firing at the set rate but the atrial contraction is not coordinated with ventricular pacing, causing loss of the atrial kick",
      "Chronotropic incompetence — the pacemaker is set at a fixed rate and cannot increase heart rate in response to exercise, so cardiac output fails to meet the increased metabolic demand during exertion",
      "Electromagnetic interference causing inappropriate inhibition of pacing",
      "Lead displacement causing intermittent failure to capture"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient has chronotropic incompetence from a fixed-rate pacemaker. Under normal physiology, when a person exercises, the sinus node increases its firing rate (from 60-100 bpm at rest to 150-200+ bpm with exertion), which increases cardiac output to meet the elevated metabolic demand of exercising muscles. Cardiac output = heart rate × stroke volume. During exercise, the increase in heart rate accounts for approximately 75% of the increase in cardiac output — it is the primary mechanism for augmenting cardiac output. When a pacemaker is set at a fixed rate of 70 bpm without rate-responsive programming, the heart rate remains locked at 70 regardless of the patient's activity level. During exertion, the metabolic demand increases but the cardiac output cannot adequately increase because: (1) The heart rate is fixed at 70 — it cannot increase to meet demand; (2) Stroke volume has a limited capacity to increase (the Frank-Starling mechanism can augment stroke volume somewhat, but the normal EF indicates the ventricle is already functioning well). The result is exertional hypotension, dizziness, near-syncope, and exercise intolerance. This is distinguishable from pacemaker syndrome (which involves loss of AV synchrony — the atria and ventricles contracting out of coordination, causing loss of atrial kick and potentially atrial contraction against closed AV valves). In pacemaker syndrome, symptoms occur AT REST as well as with exertion, while chronotropic incompetence specifically worsens with activity. The solution is reprogramming the pacemaker to enable RATE-RESPONSIVE PACING (also called rate-adaptive or sensor-driven pacing). Rate-responsive pacemakers contain accelerometers or minute ventilation sensors that detect physical activity and automatically increase the pacing rate to match the patient's activity level. Programming adjustments include setting the lower rate (resting rate), upper rate limit (maximum pacing rate during exercise), and the rate-response slope (how aggressively the rate increases with activity). The emergency nurse should document the relationship between symptoms and activity level, obtain vital signs both at rest and with ambulation (orthostatic/exertional vital signs), and arrange cardiology/electrophysiology consultation for pacemaker interrogation and reprogramming.",
    learningObjective: "Recognize chronotropic incompetence from fixed-rate pacing and understand the need for rate-responsive pacemaker programming",
    blueprintCategory: "Shock",
    subtopic: "cardiogenic shock",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Fixed-rate pacemaker + exertional symptoms = chronotropic incompetence. The heart rate cannot increase to meet metabolic demand during activity.",
    clinicalPearls: [
      "Heart rate increase accounts for ~75% of exercise-induced cardiac output increase — fixed-rate pacing eliminates this mechanism",
      "Rate-responsive pacemakers use accelerometers or minute ventilation sensors to adjust rate with activity",
      "Always check exertional vital signs in pacemaker patients with activity-related symptoms"
    ],
    safetyNote: "Orthostatic and exertional vital signs are essential in evaluating pacemaker patients — resting vitals may be completely normal while exertional assessment reveals significant hemodynamic compromise",
    distractorRationales: [
      "Pacemaker syndrome causes symptoms at rest from AV dyssynchrony — this patient is symptomatic specifically with exertion, pointing to chronotropic incompetence",
      "EMI would cause irregular pacing or inappropriate inhibition — not the consistent fixed-rate pattern seen here",
      "Lead displacement would show intermittent failure to capture with variable heart rate — not the consistent 70 bpm paced rhythm"
    ],
    lessonPath: "/emergency/lessons/cardiogenic-shock"
  },
  {
    stem: "A 45-year-old male presents to the ED with sudden-onset severe headache ('worst headache of my life'), photophobia, and neck stiffness. CT head is negative for hemorrhage. Lumbar puncture shows xanthochromic CSF with elevated red blood cells that do not clear between tubes 1 and 4. His BP suddenly drops to 60/30 with HR 40 and he loses consciousness. What has happened?",
    options: [
      "Vasovagal syncope from the lumbar puncture — elevate his legs and observe",
      "Subarachnoid hemorrhage (SAH) with acute rehydration — the initial CT was falsely negative, the LP confirms SAH (xanthochromia + RBCs that don't clear), and the sudden collapse suggests acute rebleeding or acute hydrocephalus causing Cushing's response",
      "Bacterial meningitis with septic shock — start IV antibiotics emergently",
      "Tension pneumocephalus from the lumbar puncture — perform CT immediately"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient has subarachnoid hemorrhage (SAH) confirmed by lumbar puncture after a negative CT head. The classic 'thunderclap headache' (worst headache of life, reaching maximum intensity within seconds to minutes) should always raise concern for SAH. While CT head is highly sensitive for SAH within the first 6-12 hours (approximately 98-100% sensitivity), the sensitivity decreases over time as blood products are metabolized and cleared from the CSF. When CT is negative but clinical suspicion remains high, lumbar puncture is the next diagnostic step. The LP findings are diagnostic: (1) XANTHOCHROMIA — a yellow discoloration of the CSF caused by the breakdown of hemoglobin to bilirubin in the CSF. This distinguishes true SAH (where blood has been in the CSF for hours, allowing hemoglobin metabolism) from a traumatic tap (where fresh blood is introduced by the LP needle); (2) RBCs THAT DO NOT CLEAR between tubes — in a traumatic tap, the RBC count decreases from tube 1 to tube 4 as the blood from the needle trauma washes out. In SAH, the RBCs are evenly distributed throughout the CSF and remain constant across all tubes. The acute collapse (BP 60/30, HR 40, loss of consciousness) is an ominous event that suggests one of two complications: (1) ACUTE REBLEEDING — SAH from a ruptured cerebral aneurysm carries a 4-14% risk of rebleeding within the first 24 hours, with peak risk in the first 2-12 hours. Rebleeding dramatically increases intracranial pressure, reduces cerebral perfusion, and carries a mortality rate of 50-80%. The Cushing response (hypertension and bradycardia) may have preceded the current hypotension, which could represent terminal brainstem herniation; (2) ACUTE OBSTRUCTIVE HYDROCEPHALUS — blood in the subarachnoid space can obstruct CSF circulation through the aqueduct of Sylvius or the fourth ventricle foramina, causing acute hydrocephalus with rapidly rising ICP. Emergency management: (1) Secure the airway (intubation for GCS ≤8); (2) Emergent CT head to evaluate for rebleed or hydrocephalus; (3) If hydrocephalus: emergent external ventricular drain (EVD) placement by neurosurgery; (4) Blood pressure management: prior to aneurysm securing, target SBP <160 to reduce rebleed risk while maintaining adequate cerebral perfusion (CPP >60 mmHg); (5) Nimodipine 60 mg PO/NG every 4 hours for 21 days (reduces vasospasm risk); (6) Emergent neurosurgical/neurointerventional consultation for aneurysm securing (clipping or coiling).",
    learningObjective: "Confirm SAH by LP when CT is negative and recognize acute rebleeding or hydrocephalus as causes of sudden deterioration",
    blueprintCategory: "Shock",
    subtopic: "hemorrhagic shock",
    difficulty: 5,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "A negative CT does NOT rule out SAH — CT sensitivity decreases after 6-12 hours. LP with xanthochromia and non-clearing RBCs confirms the diagnosis.",
    clinicalPearls: [
      "Xanthochromia (yellow CSF) = blood has been in the CSF for hours → true SAH. Traumatic tap has clear supernatant.",
      "SAH rebleeding risk: 4-14% in first 24 hours — highest in first 2-12 hours. Rebleeding mortality: 50-80%",
      "CT sensitivity for SAH: ~100% at 6 hours, ~93% at 24 hours, ~50% at 1 week — LP is essential when CT is negative"
    ],
    safetyNote: "All patients with confirmed SAH need emergent neurosurgical consultation — aneurysm securing (clipping or coiling) should be performed within 24 hours to prevent rebleeding",
    distractorRationales: [
      "Vasovagal syncope causes transient hypotension with tachycardia, not bradycardia — and would not explain the headache and LP findings",
      "Bacterial meningitis would show elevated WBCs, low glucose, and high protein in CSF — not the xanthochromia and RBC pattern of SAH",
      "Pneumocephalus from LP is exceedingly rare and would not cause the acute hemodynamic collapse seen here"
    ],
    lessonPath: "/emergency/lessons/hemorrhagic-shock"
  },
  {
    stem: "A 55-year-old male with a history of heavy alcohol use and chronic pancreatitis presents to the ED with epigastric pain, nausea, and vomiting. His lipase is mildly elevated at 120 U/L. CT abdomen reveals a 6 cm pseudocyst with a large pseudoaneurysm of the splenic artery adjacent to it. While in the CT scanner, he suddenly becomes hypotensive with BP 60/30 and HR 150. What has happened?",
    options: [
      "Vasovagal reaction to the CT contrast dye — elevate legs and give IV fluids",
      "Rupture of the pseudoaneurysm into the pseudocyst or peritoneal cavity causing massive hemorrhage — this is a catastrophic vascular emergency requiring emergent interventional radiology embolization or surgical intervention",
      "Acute exacerbation of pancreatitis causing distributive shock — increase IV fluid rate",
      "Anaphylaxis to CT contrast — administer epinephrine 0.3 mg IM"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient has suffered a ruptured visceral artery pseudoaneurysm, a rare but catastrophically lethal complication of chronic pancreatitis. Pseudoaneurysms form when pancreatic enzymes (particularly elastase and trypsin) leak from the pancreatic duct or pseudocyst and erode into adjacent arterial walls. The splenic artery is the most commonly affected vessel (40% of cases), followed by the gastroduodenal artery (20%), pancreaticoduodenal artery (20%), and hepatic artery (10%). The pseudoaneurysm is a contained rupture — the arterial wall has been partially destroyed by enzymatic digestion, and the remaining wall is composed of fibrous tissue and thrombus, not the normal three-layered arterial structure. This pseudo-wall is inherently unstable and prone to sudden, complete rupture. Rupture can occur: (1) INTO THE PSEUDOCYST — causing acute expansion of the pseudocyst and potentially hemorrhage into the GI tract through the pancreatic duct (hemosuccus pancreaticus — bleeding through the ampulla of Vater into the duodenum); (2) INTO THE PERITONEAL CAVITY — causing massive hemoperitoneum and hemorrhagic shock; (3) INTO A HOLLOW VISCUS — causing GI hemorrhage. The sudden hemodynamic collapse in this patient indicates free rupture with massive hemorrhage. The mortality of ruptured visceral artery pseudoaneurysm is 30-50% even with treatment and approaches 100% without intervention. Emergency management: (1) Massive transfusion protocol activation; (2) EMERGENT INTERVENTIONAL RADIOLOGY for catheter-directed embolization — this is the preferred first-line treatment because it can be performed rapidly without the need for laparotomy in an unstable patient. The interventional radiologist catheterizes the splenic artery and deploys coils or other embolic agents to occlude the pseudoaneurysm; (3) If IR is not available or embolization fails: emergent surgical ligation of the splenic artery and/or splenectomy; (4) Aggressive fluid and blood product resuscitation; (5) Type and crossmatch for massive transfusion. The CT finding of a pseudoaneurysm adjacent to a pseudocyst should ALWAYS prompt urgent intervention (elective embolization) — even in asymptomatic patients — because the risk of rupture is high and rupture carries extreme mortality.",
    learningObjective: "Recognize ruptured visceral artery pseudoaneurysm as a lethal complication of chronic pancreatitis requiring emergent embolization",
    blueprintCategory: "Shock",
    subtopic: "hemorrhagic shock",
    difficulty: 5,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "ANY pseudoaneurysm found on imaging near a pancreatic pseudocyst should prompt urgent intervention — even if asymptomatic, the rupture risk is high and mortality is extreme",
    clinicalPearls: [
      "Splenic artery pseudoaneurysm is the most common visceral pseudoaneurysm in chronic pancreatitis (40%)",
      "Interventional radiology embolization is first-line treatment — faster and less invasive than surgery in an unstable patient",
      "Hemosuccus pancreaticus = bleeding through the pancreatic duct into the duodenum — a rare but classic presentation of pseudoaneurysm rupture"
    ],
    safetyNote: "Pseudoaneurysms found incidentally on imaging should be referred for elective embolization — do not wait for rupture",
    distractorRationales: [
      "Vasovagal reactions cause transient bradycardia and hypotension — not the sustained tachycardia and profound shock seen here",
      "Acute pancreatitis alone would not cause this acute hemodynamic collapse with the known pseudoaneurysm on imaging",
      "Contrast anaphylaxis causes urticaria, angioedema, and bronchospasm — not the sudden hemorrhagic shock pattern with the anatomical setup for pseudoaneurysm rupture"
    ],
    lessonPath: "/emergency/lessons/hemorrhagic-shock"
  },
  {
    stem: "A 28-year-old female is brought to the ED after a house fire. She has superficial and deep partial-thickness burns on her anterior trunk, entire right arm, and perineum. Using the Rule of Nines, what is her estimated total body surface area (TBSA) burned?",
    options: [
      "18% TBSA",
      "28% TBSA — anterior trunk (18%) + entire right arm (9%) + perineum (1%)",
      "36% TBSA",
      "45% TBSA"
    ],
    correctAnswer: 1,
    rationaleLong: "The Rule of Nines is a rapid estimation tool for calculating total body surface area (TBSA) of burns in adults. Each major body region is assigned a percentage that is a multiple of 9: HEAD AND NECK: 9% (entire head, front and back); EACH UPPER EXTREMITY: 9% (entire arm including hand — 9% per arm, 18% total for both arms); ANTERIOR TRUNK: 18% (chest and abdomen, front only); POSTERIOR TRUNK: 18% (back, including buttocks); EACH LOWER EXTREMITY: 18% (entire leg including foot — 18% per leg, 36% total for both legs); PERINEUM/GENITALIA: 1%. Total = 100%. For this patient: Anterior trunk = 18%, Entire right arm = 9%, Perineum = 1%. Total = 18% + 9% + 1% = 28% TBSA. This calculation is critically important because it determines: (1) FLUID RESUSCITATION — the Parkland formula (4 mL × kg × %TBSA) uses this percentage directly. Overestimation leads to excessive fluid administration (fluid creep), while underestimation leads to under-resuscitation and organ failure; (2) TRANSFER CRITERIA — Burns >20% TBSA in adults (or >10% in children and elderly) should be transferred to a verified burn center; (3) SEVERITY CLASSIFICATION — Major burns include >25% TBSA in adults, full-thickness burns >10%, burns involving face/hands/feet/genitalia/perineum/major joints, electrical or chemical burns, or burns with significant comorbidities. Limitations of the Rule of Nines: (1) Less accurate for children — children have proportionally larger heads and smaller legs. The Lund-Browder chart is more accurate for pediatric burn assessment; (2) Does not differentiate between burn depths — both superficial and deep burns are included in the TBSA calculation for fluid resuscitation purposes, though ONLY partial-thickness (second degree) and full-thickness (third degree) burns are counted. Superficial (first degree) burns (sunburn-like) are NOT included in TBSA for fluid calculations; (3) For irregular burns, the patient's palm (including fingers) equals approximately 1% TBSA and can be used as a measuring tool. The perineum burn in this patient is significant because perineal burns require a Foley catheter for accurate urine output monitoring (the burn and surrounding edema may obstruct urination) and carry a higher risk of infection due to proximity to fecal contamination.",
    learningObjective: "Calculate burn TBSA using the Rule of Nines and understand its implications for fluid resuscitation and transfer decisions",
    blueprintCategory: "Shock",
    subtopic: "distributive shock",
    difficulty: 1,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Only count partial-thickness and full-thickness burns in TBSA — superficial (first-degree/sunburn) burns are NOT included in fluid resuscitation calculations",
    clinicalPearls: [
      "Rule of Nines: head 9%, each arm 9%, anterior trunk 18%, posterior trunk 18%, each leg 18%, perineum 1%",
      "Patient's palm (with fingers) ≈ 1% TBSA — useful for estimating irregular burn areas",
      "Burns >20% TBSA in adults or involving face/hands/feet/genitalia/joints warrant burn center transfer"
    ],
    safetyNote: "Perineal burns require early Foley catheter placement — edema will make catheterization progressively more difficult and may obstruct urination within hours",
    distractorRationales: [
      "18% would only account for the anterior trunk — missing the arm (9%) and perineum (1%)",
      "36% would overestimate — this would require additional body regions to be burned",
      "45% is a significant overestimation that would lead to excessive fluid resuscitation and complications"
    ],
    lessonPath: "/emergency/lessons/distributive-shock"
  },
  {
    stem: "A 65-year-old male with septic shock from pneumonia has been resuscitated according to SSC guidelines. After 6 hours, his MAP is 72 mmHg on norepinephrine 8 mcg/min, lactate has cleared from 6.0 to 1.8 mmol/L, urine output is 0.6 mL/kg/hr, and his mental status has improved. When should the norepinephrine be weaned?",
    options: [
      "Stop the norepinephrine immediately since all resuscitation targets are met",
      "Wean norepinephrine gradually (decrease by 1-2 mcg/min every 15-30 minutes) while monitoring MAP, with the goal of discontinuing once the patient maintains MAP ≥65 mmHg without vasopressor support",
      "Continue norepinephrine at the current dose for at least 48 hours regardless of hemodynamic improvement",
      "Switch from norepinephrine to oral midodrine before weaning the IV vasopressor"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient has achieved all major resuscitation endpoints: MAP ≥65 mmHg, lactate clearance >70% (from 6.0 to 1.8 — a 70% reduction exceeding the ≥10-20% target), adequate urine output (≥0.5 mL/kg/hr), and improved mental status. These indicators suggest that the initial resuscitation has been successful and the patient is improving. Norepinephrine should now be WEANED GRADUALLY — not stopped abruptly. The rationale for gradual weaning: (1) ABRUPT CESSATION can cause rebound hypotension — the vasculature may still have residual vasodilation from sepsis-mediated NO production, inflammatory mediators, and adrenergic receptor downregulation. Sudden removal of the vasopressor can unmask this residual vasodilation, causing dangerous hypotension; (2) GRADUAL TITRATION allows assessment of the patient's intrinsic vasomotor tone — each dose reduction tests whether the patient can maintain blood pressure independently; (3) RECEPTOR RECOVERY — prolonged exposure to catecholamines causes adrenergic receptor downregulation. Gradual weaning allows time for receptors to recover sensitivity. Weaning protocol: (1) Decrease norepinephrine by 1-2 mcg/min every 15-30 minutes; (2) Monitor MAP continuously during weaning; (3) If MAP drops below 65 mmHg, return to the previous effective dose and retry weaning after 1-2 hours; (4) Once at the minimum dose (1-2 mcg/min) and the patient maintains MAP ≥65, the infusion can be discontinued; (5) Continue to monitor for at least 2-4 hours after discontinuation to ensure hemodynamic stability. If vasopressin was also being infused, the general approach is to wean norepinephrine first (because it is titrated) while keeping vasopressin at its fixed rate, then discontinue vasopressin last. Some centers use oral midodrine (an alpha-1 agonist) as a bridge to facilitate vasopressor weaning in patients with prolonged vasopressor dependence (days to weeks), but this is not standard practice for routine septic shock weaning and remains controversial.",
    learningObjective: "Wean vasopressors gradually once resuscitation targets are met and monitor for rebound hypotension",
    blueprintCategory: "Shock",
    subtopic: "septic shock",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "NEVER stop vasopressors abruptly — rebound hypotension from residual vasodilation and receptor downregulation can cause hemodynamic collapse",
    clinicalPearls: [
      "Wean norepinephrine 1-2 mcg/min every 15-30 minutes — if MAP drops, return to prior dose and retry later",
      "Resuscitation endpoints: MAP ≥65, lactate clearing ≥10-20% q2h, UOP ≥0.5 mL/kg/hr, improved mentation",
      "Wean norepinephrine first, then discontinue vasopressin last (norepinephrine is titrated, vasopressin is fixed)"
    ],
    safetyNote: "Monitor the patient for at least 2-4 hours after vasopressor discontinuation — delayed hemodynamic deterioration can occur as the last dose wears off",
    distractorRationales: [
      "Abrupt discontinuation risks dangerous rebound hypotension — always wean gradually",
      "Continuing unnecessary vasopressors wastes resources and exposes the patient to risks (tachycardia, arrhythmias, digital ischemia)",
      "Oral midodrine for vasopressor weaning is not standard of care and is only considered in prolonged vasopressor dependence"
    ],
    lessonPath: "/emergency/lessons/septic-shock"
  }
];
