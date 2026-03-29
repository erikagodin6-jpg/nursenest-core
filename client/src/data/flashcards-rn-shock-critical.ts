import type { FlashcardData } from "./flashcards-rpn";

export const rnShockCriticalFlashcards: FlashcardData[] = [
  // ============================================================
  // HYPOVOLEMIC SHOCK (30 cards)
  // ============================================================
  {
    id: "rn-shock-hypo-1",
    type: "question",
    question: "A trauma patient has HR 130, BP 80/50, cool clammy skin, and estimated blood loss of 2000 mL. What class of hemorrhagic shock is this?",
    options: ["Class I (<15% loss)", "Class II (15-30% loss)", "Class III (30-40% loss)", "Class IV (>40% loss)"],
    correctIndex: 2,
    answer: "2000 mL represents approximately 30-40% of circulating blood volume (Class III). Signs include tachycardia >120, hypotension, altered mental status, and cool clammy skin. Class III requires aggressive crystalloid AND blood product resuscitation.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-hypo-2",
    type: "question",
    question: "Which assessment finding best differentiates hypovolemic shock from cardiogenic shock in a hypotensive patient?",
    options: ["Heart rate", "Blood pressure", "Flat neck veins (hypovolemic) vs JVD (cardiogenic)", "Skin color"],
    correctIndex: 2,
    answer: "Flat neck veins indicate low CVP from inadequate preload in hypovolemic shock. JVD indicates elevated CVP from fluid backing up due to pump failure in cardiogenic shock. Both types share tachycardia, hypotension, and cool skin.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-hypo-3",
    type: "question",
    question: "What is the 'lethal triad' in trauma that the nurse must monitor for?",
    options: ["Fever, tachycardia, hypotension", "Hypothermia, acidosis, coagulopathy", "Bradycardia, hypertension, irregular respirations", "Hypoxia, hypercarbia, hypotension"],
    correctIndex: 1,
    answer: "The lethal triad (hypothermia + metabolic acidosis + coagulopathy) creates a vicious cycle where each component worsens the others. Hypothermia impairs clotting, acidosis impairs enzyme function, and coagulopathy causes more bleeding. Break the cycle with warming, blood products (1:1:1 ratio), and correcting acidosis.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-hypo-4",
    type: "question",
    question: "A patient receiving massive transfusion develops oozing from IV sites and petechiae. The nurse suspects:",
    options: ["Allergic transfusion reaction", "Dilutional coagulopathy", "Febrile non-hemolytic reaction", "TRALI"],
    correctIndex: 1,
    answer: "Large-volume crystalloid and blood product resuscitation dilutes clotting factors and platelets, causing dilutional coagulopathy. Treatment includes balanced blood product transfusion (1:1:1 ratio of pRBCs:FFP:platelets) and warming to correct hypothermia.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-hypo-5",
    type: "question",
    question: "Within what timeframe must tranexamic acid (TXA) be administered in hemorrhagic trauma to reduce mortality?",
    options: ["Within 30 minutes", "Within 1 hour", "Within 3 hours", "Within 6 hours"],
    correctIndex: 2,
    answer: "The CRASH-2 trial demonstrated that TXA must be given within 3 hours of injury to reduce hemorrhagic mortality. Dose is 1 g IV over 10 minutes, then 1 g over 8 hours. Administration after 3 hours may increase mortality.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-hypo-6",
    type: "question",
    question: "What is the target ratio for massive transfusion protocol in hemorrhagic shock?",
    options: ["2:1:1 pRBCs:FFP:Platelets", "1:1:1 pRBCs:FFP:Platelets", "3:1:1 pRBCs:FFP:Platelets", "1:2:1 pRBCs:FFP:Platelets"],
    correctIndex: 1,
    answer: "The 1:1:1 balanced ratio of packed red blood cells to fresh frozen plasma to platelets most closely approximates whole blood and prevents dilutional coagulopathy. This approach was validated by the PROPPR trial.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-hypo-7",
    type: "question",
    question: "What does a lactate clearance of >10% in 6 hours indicate during shock resuscitation?",
    options: ["Worsening tissue hypoperfusion", "Adequate resuscitation response", "Need for immediate surgery", "Liver failure"],
    correctIndex: 1,
    answer: "Lactate clearance >10% in 6 hours indicates that tissue perfusion is improving with resuscitation. It is a better predictor of survival than a single lactate value. Persistently elevated or rising lactate despite resuscitation indicates inadequate perfusion and poor prognosis.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-hypo-8",
    type: "question",
    question: "In penetrating trauma with uncontrolled hemorrhage, what is the target systolic blood pressure before surgical control?",
    options: ["Normal SBP >120 mmHg", "Permissive hypotension SBP 80-90 mmHg", "SBP >100 mmHg with vasopressors", "SBP >140 mmHg"],
    correctIndex: 1,
    answer: "Permissive hypotension (SBP 80-90 mmHg) is used in penetrating trauma with uncontrolled hemorrhage to prevent clot disruption from aggressive fluid resuscitation. Normal blood pressure goals apply after surgical hemorrhage control is achieved.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-hypo-9",
    type: "question",
    question: "Why is Lactated Ringer's preferred over Normal Saline for large-volume resuscitation?",
    options: ["LR is cheaper", "LR avoids hyperchloremic metabolic acidosis that occurs with large NS volumes", "LR contains more sodium", "NS is only for pediatric patients"],
    correctIndex: 1,
    answer: "Large volumes of Normal Saline (154 mEq/L chloride vs plasma 98-106) cause hyperchloremic metabolic acidosis, which can worsen existing acidosis in shock. LR has a more physiologic chloride concentration and its lactate is metabolized to bicarbonate, helping buffer acidosis.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-hypo-10",
    type: "question",
    question: "What is the earliest compensatory sign of hypovolemic shock?",
    options: ["Hypotension", "Altered mental status", "Tachycardia", "Anuria"],
    correctIndex: 2,
    answer: "Tachycardia is the earliest compensatory response to hypovolemia, driven by baroreceptor-mediated sympathetic activation. Hypotension is a LATE sign, occurring only after >30% blood volume loss when compensatory mechanisms are overwhelmed. In young healthy patients, tachycardia may be the only sign until decompensation.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  // ============================================================
  // DISTRIBUTIVE SHOCK (25 cards)
  // ============================================================
  {
    id: "rn-shock-dist-1",
    type: "question",
    question: "What hemodynamic finding is characteristic of ALL forms of distributive shock?",
    options: ["Elevated SVR", "Low SVR (systemic vascular resistance)", "Elevated PAWP", "Low cardiac output"],
    correctIndex: 1,
    answer: "Low SVR (<800 dyn-s-cm-5) is the hallmark of distributive shock across all subtypes (septic, anaphylactic, neurogenic). Massive vasodilation causes blood to pool peripherally, reducing effective circulating volume despite adequate total blood volume.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-dist-2",
    type: "question",
    question: "Which shock type is the ONLY one that presents with bradycardia AND hypotension?",
    options: ["Septic shock", "Hypovolemic shock", "Cardiogenic shock", "Neurogenic shock"],
    correctIndex: 3,
    answer: "Neurogenic shock is the only shock type with bradycardia + hypotension + warm dry skin. Loss of sympathetic tone from spinal cord injury above T6 causes vasodilation AND loss of cardiac acceleration. All other shock types present with compensatory tachycardia.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-dist-3",
    type: "question",
    question: "A patient in early septic shock has warm, flushed skin and bounding pulses. What hemodynamic phase does this represent?",
    options: ["Cold shock (hypodynamic)", "Warm shock (hyperdynamic)", "Cardiogenic shock", "Obstructive shock"],
    correctIndex: 1,
    answer: "Warm/hyperdynamic shock is the early phase of septic shock characterized by high cardiac output, low SVR, warm flushed skin, and bounding pulses. If untreated, it progresses to cold/hypodynamic shock with myocardial depression, low CO, and cool mottled skin.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-dist-4",
    type: "question",
    question: "What is the fixed dose of vasopressin used as a second-line vasopressor in distributive shock?",
    options: ["0.01 units/min", "0.03-0.04 units/min", "0.1 units/min", "1 unit/min"],
    correctIndex: 1,
    answer: "Vasopressin is administered at a FIXED dose of 0.03-0.04 units/min (not titrated). It acts on V1 receptors for vasoconstriction independent of catecholamine pathways, supplementing norepinephrine in refractory shock.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-dist-5",
    type: "question",
    question: "How does warm shock differ from cold shock in the skin assessment?",
    options: ["Warm shock = cool skin; Cold shock = warm skin", "Warm shock = warm flushed skin from vasodilation; Cold shock = cool mottled skin from vasoconstriction", "They have identical skin findings", "Warm shock = diaphoresis; Cold shock = dry skin"],
    correctIndex: 1,
    answer: "Warm shock (early distributive) shows warm, flushed, dry skin from massive vasodilation with high cardiac output. Cold shock (late/decompensated) shows cool, mottled, clammy skin as cardiac output falls and compensatory vasoconstriction develops. This transition indicates worsening prognosis.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  // ============================================================
  // SEPSIS & SEPTIC SHOCK (30 cards)
  // ============================================================
  {
    id: "rn-shock-sepsis-1",
    type: "question",
    question: "What are the three components of qSOFA (quick Sequential Organ Failure Assessment)?",
    options: ["Fever, tachycardia, elevated WBC", "RR >22, altered mentation, SBP <100 mmHg", "Lactate >2, MAP <65, urine output <0.5 mL/kg/hr", "Temperature >38.3, HR >90, WBC >12,000"],
    correctIndex: 1,
    answer: "qSOFA is a rapid bedside screening tool: respiratory rate >22, altered mentation (GCS <15), and systolic blood pressure <100 mmHg. A score of 2 or more predicts poor outcomes in patients with suspected infection outside the ICU.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-sepsis-2",
    type: "question",
    question: "How much does each hour of delay in antibiotic administration increase mortality in septic shock?",
    options: ["2%", "4%", "7.6%", "15%"],
    correctIndex: 2,
    answer: "Each hour delay in antibiotic administration in septic shock increases mortality by approximately 7.6%. This is why the Surviving Sepsis Campaign mandates antibiotics within 1 hour of sepsis recognition. The first dose is the most critical.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-sepsis-3",
    type: "question",
    question: "What is the Surviving Sepsis Campaign Hour-1 Bundle?",
    options: ["CT scan, urinalysis, IV fluids, acetaminophen, observation", "Lactate, blood cultures, antibiotics, 30 mL/kg crystalloid, vasopressors if needed", "CBC, CMP, chest X-ray, oxygen, Foley catheter", "Blood cultures, antibiotics only, wait for culture results"],
    correctIndex: 1,
    answer: "The Hour-1 Bundle mandates within 1 hour: (1) Measure lactate, (2) Obtain blood cultures before antibiotics, (3) Administer broad-spectrum antibiotics, (4) Begin 30 mL/kg crystalloid for hypotension or lactate >4, (5) Start vasopressors if MAP <65 during or after fluids.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-sepsis-4",
    type: "question",
    question: "A nurse draws blood cultures from a septic patient. When should antibiotics be administered relative to culture collection?",
    options: ["Wait 24 hours for preliminary culture results", "Antibiotics can be given before or after cultures", "Obtain cultures BEFORE antibiotics but do NOT delay antibiotics >45 minutes for cultures", "Hold antibiotics until final culture and sensitivity results"],
    correctIndex: 2,
    answer: "Blood cultures should be drawn BEFORE antibiotic administration to maximize pathogen identification. However, antibiotics must NOT be delayed more than 45 minutes to obtain cultures. If IV access is difficult, give antibiotics and draw cultures simultaneously.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-sepsis-5",
    type: "question",
    question: "What lactate level indicates severe tissue hypoperfusion in sepsis?",
    options: ["Lactate >1 mmol/L", "Lactate >2 mmol/L", "Lactate >4 mmol/L", "Lactate >10 mmol/L"],
    correctIndex: 2,
    answer: "Lactate >4 mmol/L indicates severe tissue hypoperfusion and is associated with significantly increased mortality. Lactate >2 mmol/L defines sepsis-related hypoperfusion. Serial trending (target >10% clearance in 6 hours) is more useful than a single value.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-sepsis-6",
    type: "question",
    question: "What defines septic shock according to the Sepsis-3 definition?",
    options: ["Any infection with fever and tachycardia", "Sepsis requiring vasopressors to maintain MAP >65 mmHg AND lactate >2 mmol/L despite adequate fluid resuscitation", "SIRS criteria with a positive blood culture", "Hypotension alone in the presence of infection"],
    correctIndex: 1,
    answer: "Septic shock = sepsis + persistent hypotension requiring vasopressors to maintain MAP >=65 mmHg AND serum lactate >2 mmol/L despite adequate volume resuscitation. This definition identifies the subset of sepsis patients with the highest mortality (>40%).",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-sepsis-7",
    type: "question",
    question: "What is the initial fluid bolus recommended for sepsis-induced hypoperfusion?",
    options: ["250 mL NS", "500 mL NS", "30 mL/kg isotonic crystalloid", "100 mL/kg isotonic crystalloid"],
    correctIndex: 2,
    answer: "The Surviving Sepsis Campaign recommends 30 mL/kg isotonic crystalloid within the first 3 hours for sepsis-induced hypoperfusion (hypotension or lactate >4 mmol/L). For a 70 kg patient, this equals 2,100 mL. Reassess response after each bolus.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-sepsis-8",
    type: "question",
    question: "When should stress-dose hydrocortisone be administered in septic shock?",
    options: ["For all patients with sepsis", "Only when septic shock is refractory to fluids AND vasopressors", "Only if cortisol level is <3 mcg/dL", "Before administering antibiotics"],
    correctIndex: 1,
    answer: "Stress-dose hydrocortisone (200 mg/day IV) is indicated for septic shock that remains refractory despite adequate fluid resuscitation AND vasopressor therapy. It addresses critical illness-related corticosteroid insufficiency and enhances vascular sensitivity to catecholamines.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-sepsis-9",
    type: "question",
    question: "What is the first-line vasopressor for septic shock?",
    options: ["Dopamine", "Epinephrine", "Norepinephrine", "Phenylephrine"],
    correctIndex: 2,
    answer: "Norepinephrine is the first-line vasopressor for septic shock per the Surviving Sepsis Campaign guidelines. Its combined alpha-1 (vasoconstriction) and beta-1 (cardiac support) effects make it ideal for the vasodilated, high-output state of early sepsis.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-sepsis-10",
    type: "question",
    question: "What are the four most common sources of infection leading to sepsis?",
    options: ["Skin, joints, eyes, ears", "Pneumonia (lungs), UTI, intra-abdominal infection, skin/soft tissue infection", "Dental abscess, sinusitis, pharyngitis, otitis", "Central line, Foley catheter, wound, surgical site"],
    correctIndex: 1,
    answer: "The four most common sources of sepsis are: (1) Pneumonia (most common overall), (2) Urinary tract infection, (3) Intra-abdominal infection (peritonitis, abscess), and (4) Skin and soft tissue infection. Identifying and controlling the source is critical for sepsis management.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  // ============================================================
  // ANAPHYLACTIC SHOCK (28 cards)
  // ============================================================
  {
    id: "rn-shock-ana-1",
    type: "question",
    question: "What is the FIRST medication to administer in anaphylaxis?",
    options: ["Diphenhydramine (Benadryl) IV", "Methylprednisolone IV", "Epinephrine 0.3-0.5 mg IM", "Albuterol nebulizer"],
    correctIndex: 2,
    answer: "Epinephrine IM is the ONLY first-line treatment for anaphylaxis. It addresses ALL pathophysiological mechanisms: alpha-1 vasoconstriction reverses hypotension, beta-1 increases cardiac output, and beta-2 causes bronchodilation and inhibits further mast cell degranulation. Antihistamines are adjuncts only.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-ana-2",
    type: "question",
    question: "Where is the correct IM injection site for epinephrine in anaphylaxis?",
    options: ["Deltoid muscle", "Anterolateral thigh (vastus lateralis)", "Gluteus maximus", "Abdomen subcutaneously"],
    correctIndex: 1,
    answer: "The anterolateral thigh (vastus lateralis) provides the fastest IM absorption of epinephrine. This large muscle allows reliable drug delivery even through clothing in emergencies. The deltoid is an acceptable alternative. Subcutaneous injection is slower and less reliable.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-ana-3",
    type: "question",
    question: "What is a biphasic anaphylactic reaction and how often does it occur?",
    options: ["Reaction to two different allergens; occurs in 50% of cases", "Recurrence of symptoms 4-12 hours after initial resolution without re-exposure; occurs in 5-20% of cases", "Reaction that only affects two organ systems; occurs in 80% of cases", "Allergic reaction that converts to a non-allergic reaction"],
    correctIndex: 1,
    answer: "Biphasic anaphylaxis is the recurrence of symptoms 4-12 hours after initial resolution without re-exposure to the allergen, likely from late-phase inflammatory mediators. It occurs in 5-20% of cases, which is why all patients must be observed for a minimum of 4-6 hours after treatment.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-ana-4",
    type: "question",
    question: "A patient on a beta-blocker develops anaphylaxis refractory to epinephrine. What alternative medication should the nurse prepare?",
    options: ["Atropine", "Glucagon 1-5 mg IV", "Dopamine", "Calcium chloride"],
    correctIndex: 1,
    answer: "Glucagon bypasses blocked beta receptors by activating adenylyl cyclase through a non-adrenergic mechanism, increasing cardiac output and reversing bronchospasm. It is the rescue medication for beta-blocker-resistant anaphylaxis (1-5 mg IV bolus, may repeat or infuse at 5-15 mcg/min).",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-ana-5",
    type: "question",
    question: "Why should a patient experiencing anaphylaxis be positioned SUPINE rather than sitting upright?",
    options: ["To prevent aspiration", "Supine position improves venous return; sitting/standing can cause fatal cardiovascular collapse (empty ventricle syndrome)", "To make epinephrine injection easier", "To prevent bronchospasm"],
    correctIndex: 1,
    answer: "Supine positioning maximizes venous return to the heart, which is critically needed during the massive vasodilation of anaphylaxis. Standing or sitting allows blood to pool in dilated lower extremity vessels, potentially causing 'empty ventricle syndrome' with fatal cardiovascular collapse. Exception: position upright if severe respiratory distress.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-ana-6",
    type: "question",
    question: "What is the most common cause of death from anaphylaxis?",
    options: ["Renal failure", "Cardiac arrhythmia", "Delayed or withheld epinephrine administration", "Bronchospasm alone"],
    correctIndex: 2,
    answer: "The most common cause of death from anaphylaxis is delayed or withheld epinephrine. Studies consistently show that deaths occur when epinephrine is not given promptly. There are NO absolute contraindications to epinephrine in anaphylaxis; benefits always outweigh risks.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-ana-7",
    type: "question",
    question: "Which lab test confirms mast cell degranulation in anaphylaxis?",
    options: ["IgE level", "Serum tryptase (draw within 1-3 hours of onset)", "Histamine level", "Complement levels"],
    correctIndex: 1,
    answer: "Serum tryptase peaks 1-2 hours after anaphylaxis onset and confirms mast cell degranulation. A level >11.4 ng/mL supports the diagnosis. It should be drawn within 1-3 hours of symptom onset. Baseline tryptase can be compared to detect elevation.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-ana-8",
    type: "question",
    question: "How often can epinephrine be repeated during anaphylaxis if symptoms persist?",
    options: ["Only once", "Every 2-3 minutes", "Every 5-15 minutes as needed", "Every 30 minutes"],
    correctIndex: 2,
    answer: "Epinephrine 0.3-0.5 mg IM can be repeated every 5-15 minutes if symptoms persist. Most patients respond to 1-2 doses. If 2-3 IM doses are ineffective, consider IV epinephrine infusion (1-10 mcg/min) for refractory anaphylactic shock.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  // ============================================================
  // NEUROGENIC SHOCK (25 cards)
  // ============================================================
  {
    id: "rn-shock-neuro-1",
    type: "question",
    question: "What is the classic triad of neurogenic shock?",
    options: ["Tachycardia, hypotension, cool skin", "Bradycardia, hypotension, warm dry skin below injury", "Fever, tachycardia, altered mental status", "JVD, muffled heart sounds, hypotension"],
    correctIndex: 1,
    answer: "Neurogenic shock presents with bradycardia (loss of sympathetic cardiac accelerator fibers) + hypotension (vasodilation from unopposed parasympathetic tone) + warm, dry, flushed skin below the injury level. This is unique among all shock types.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-neuro-2",
    type: "question",
    question: "At what spinal cord level must injury occur to cause neurogenic shock?",
    options: ["Below T12", "Below T6", "Above T6", "Any spinal level"],
    correctIndex: 2,
    answer: "Neurogenic shock requires injury above T6 because the sympathetic nervous system outflow originates from T1-L2. Injuries above T6 disrupt sufficient sympathetic outflow to cause hemodynamic instability. Higher injuries (cervical) cause more severe shock.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-neuro-3",
    type: "question",
    question: "Why must fluid resuscitation be administered cautiously in neurogenic shock?",
    options: ["Fluids are contraindicated", "The heart cannot increase rate to handle increased volume, risking pulmonary edema", "Spinal cord injuries cause renal failure", "Fluids worsen spinal cord swelling"],
    correctIndex: 1,
    answer: "In neurogenic shock, the heart cannot mount compensatory tachycardia due to loss of sympathetic cardiac innervation. Excessive fluids increase preload without proportional increase in cardiac output, causing pulmonary edema. Early vasopressor initiation is preferred.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-neuro-4",
    type: "question",
    question: "What is poikilothermia and why does it occur in neurogenic shock?",
    options: ["Fever from infection", "Inability to regulate body temperature because sympathetic control of sweat glands and cutaneous blood flow is lost below the injury", "Hypothermia from blood loss", "Hyperthermia from seizures"],
    correctIndex: 1,
    answer: "Poikilothermia is the inability to thermoregulate, causing the body temperature to fluctuate with the environment. In neurogenic shock, sympathetic control of sweat glands, cutaneous vasoconstriction, and shivering below the injury level is lost. The nurse must actively maintain normothermia with warming/cooling measures.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-neuro-5",
    type: "question",
    question: "What is the target MAP in neurogenic shock from spinal cord injury and why is it higher than standard?",
    options: ["MAP >55 mmHg", "MAP >65 mmHg (standard)", "MAP 85-90 mmHg to maintain spinal cord perfusion", "MAP >100 mmHg"],
    correctIndex: 2,
    answer: "A higher MAP target of 85-90 mmHg is used in acute spinal cord injury to maintain spinal cord perfusion pressure and prevent secondary cord injury from ischemia. This is higher than the standard MAP >65 mmHg used for other shock types.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-neuro-6",
    type: "question",
    question: "How does neurogenic shock differ from spinal shock?",
    options: ["They are the same condition", "Neurogenic shock is hemodynamic instability; spinal shock is neurological (loss of reflexes below injury)", "Spinal shock is more dangerous", "Neurogenic shock only occurs with lumbar injuries"],
    correctIndex: 1,
    answer: "Neurogenic shock is a cardiovascular emergency (vasodilation + bradycardia causing hemodynamic instability). Spinal shock is a neurological phenomenon (temporary loss of all reflexes and motor function below the injury level). They often coexist but require different treatments.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  // ============================================================
  // OBSTRUCTIVE SHOCK (25 cards)
  // ============================================================
  {
    id: "rn-shock-obst-1",
    type: "question",
    question: "What finding is PRESENT in obstructive shock but ABSENT in hypovolemic shock?",
    options: ["Tachycardia", "Hypotension", "JVD (jugular venous distension)", "Cool skin"],
    correctIndex: 2,
    answer: "JVD is present in obstructive shock (blood cannot move forward past the obstruction, so it backs up into the venous system) but absent in hypovolemic shock (inadequate volume means no venous distension). This is a key bedside differentiator.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-obst-2",
    type: "question",
    question: "What is Beck's triad and what condition does it indicate?",
    options: ["Fever, tachycardia, altered mental status - indicates sepsis", "JVD, muffled heart sounds, hypotension - indicates cardiac tamponade", "Hypertension, bradycardia, irregular respirations - indicates increased ICP", "Bradycardia, hypotension, warm skin - indicates neurogenic shock"],
    correctIndex: 1,
    answer: "Beck's triad (JVD + muffled/distant heart sounds + hypotension) is the classic presentation of cardiac tamponade. Fluid in the pericardial space compresses the heart, preventing filling. Emergency pericardiocentesis is required.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-obst-3",
    type: "question",
    question: "A trauma patient has absent breath sounds on the right, tracheal deviation to the LEFT, and JVD. What is the priority intervention?",
    options: ["Obtain a chest X-ray", "Immediate needle decompression at 2nd ICS, right midclavicular line", "Start IV fluids", "Prepare for intubation"],
    correctIndex: 1,
    answer: "This is tension pneumothorax (absent breath sounds + tracheal deviation AWAY from affected side + JVD). It is a CLINICAL diagnosis requiring IMMEDIATE needle decompression (14-gauge needle at 2nd ICS, midclavicular line). Do NOT wait for imaging.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-obst-4",
    type: "question",
    question: "What is pulsus paradoxus and what does it indicate?",
    options: ["Absence of pulse; indicates cardiac arrest", ">10 mmHg drop in systolic BP during inspiration; suggests cardiac tamponade", "Irregular pulse; indicates atrial fibrillation", "Bounding pulse; indicates aortic regurgitation"],
    correctIndex: 1,
    answer: "Pulsus paradoxus is an exaggerated (>10 mmHg) drop in systolic blood pressure during inspiration. During inspiration, increased venous return to the right heart causes the interventricular septum to bow into the left ventricle (already compressed by pericardial fluid), further reducing left ventricular output. It is a sensitive sign of cardiac tamponade.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-obst-5",
    type: "question",
    question: "In PEA arrest, which obstructive causes should the nurse immediately consider?",
    options: ["Hypovolemia and hypoxia only", "Tamponade, tension pneumothorax, and thromboembolism (PE)", "Hyperkalemia and hypothermia only", "Drug overdose and acidosis"],
    correctIndex: 1,
    answer: "PEA (pulseless electrical activity) has treatable causes remembered by H's and T's. The three obstructive shock causes of PEA are: cardiac Tamponade, Tension pneumothorax, and Thromboembolism (massive PE). These are rapidly reversible with appropriate intervention (pericardiocentesis, needle decompression, thrombolysis).",
    category: "Shock & Emergency",
    difficulty: 3
  },
  // ============================================================
  // MODS (25 cards)
  // ============================================================
  {
    id: "rn-shock-mods-1",
    type: "question",
    question: "What does the SOFA score measure and across how many organ systems?",
    options: ["Pain level across 4 systems", "Sequential Organ Failure Assessment across 6 organ systems: respiratory, coagulation, hepatic, cardiovascular, neurological, renal", "Infection severity across 3 systems", "Fluid balance across 5 systems"],
    correctIndex: 1,
    answer: "The SOFA score quantifies organ dysfunction across 6 systems: respiratory (PaO2/FiO2 ratio), coagulation (platelet count), hepatic (bilirubin), cardiovascular (MAP/vasopressor dose), neurological (GCS), and renal (creatinine/urine output). An increase of >=2 points from baseline identifies sepsis-related organ dysfunction.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-mods-2",
    type: "question",
    question: "How much does mortality increase for each additional organ system that fails in MODS?",
    options: ["5%", "10%", "15-20%", "50%"],
    correctIndex: 2,
    answer: "Mortality increases by approximately 15-20% for each additional organ system that fails. One organ failure ~20% mortality, two organs ~40%, three organs ~60-70%, four or more organs >80%. This underscores the importance of early goals-of-care discussions.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-mods-3",
    type: "question",
    question: "Which organ system typically fails FIRST in MODS?",
    options: ["Kidneys", "Liver", "Lungs (ARDS)", "Brain"],
    correctIndex: 2,
    answer: "The lungs are typically the first organ to fail in MODS, manifesting as ARDS (acute respiratory distress syndrome) with declining PaO2/FiO2 ratio. The progression typically follows: lungs, then cardiovascular, renal, hepatic, hematologic, and neurologic systems.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-mods-4",
    type: "question",
    question: "What tidal volume should be used for lung-protective ventilation in ARDS associated with MODS?",
    options: ["10-12 mL/kg ideal body weight", "8-10 mL/kg actual body weight", "6 mL/kg ideal body weight", "4 mL/kg ideal body weight"],
    correctIndex: 2,
    answer: "Lung-protective ventilation uses 6 mL/kg IDEAL (not actual) body weight with plateau pressure <30 cmH2O. This ARDSNet protocol is the single most impactful intervention for ARDS and has been shown to reduce mortality. Higher tidal volumes cause ventilator-induced lung injury (VILI).",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-mods-5",
    type: "question",
    question: "What does the 'two-hit' model of MODS describe?",
    options: ["Two injuries are needed to cause organ failure", "The initial insult primes inflammation; a second insult triggers disproportionate systemic inflammation", "Only two organ systems can fail at once", "Two medications are needed to treat MODS"],
    correctIndex: 1,
    answer: "The two-hit model describes how an initial insult (trauma, infection) activates and primes the inflammatory response. A subsequent insult (secondary infection, aspiration, surgery) triggers a disproportionately massive inflammatory cascade leading to progressive organ failure.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  // ============================================================
  // BURNS (30 cards)
  // ============================================================
  {
    id: "rn-shock-burns-1",
    type: "question",
    question: "Using the Parkland Formula, calculate the 24-hour fluid requirement for an 80 kg patient with 50% TBSA burns.",
    options: ["8,000 mL", "12,000 mL", "16,000 mL", "20,000 mL"],
    correctIndex: 2,
    answer: "Parkland Formula: 4 mL x body weight (kg) x %TBSA = 4 x 80 x 50 = 16,000 mL in 24 hours. Half (8,000 mL) is given in the first 8 hours from time of injury. The remaining 8,000 mL is given over the next 16 hours. Titrate to urine output 0.5-1 mL/kg/hr.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-burns-2",
    type: "question",
    question: "A patient has a burn that appears white and leathery with no pain sensation. What burn depth is this?",
    options: ["Superficial (1st degree)", "Superficial partial-thickness (2nd degree)", "Full-thickness (3rd degree)", "Superficial burn with infection"],
    correctIndex: 2,
    answer: "Full-thickness (3rd degree) burns destroy the entire dermis including nerve endings, resulting in a white, charred, or leathery appearance with ABSENT pain sensation. The lack of pain is due to nerve ending destruction. These burns require skin grafting as they cannot regenerate epithelium.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-burns-3",
    type: "question",
    question: "What is the #1 priority in a patient with facial burns and hoarseness?",
    options: ["IV fluid resuscitation", "Pain management", "Early endotracheal intubation", "Wound care"],
    correctIndex: 2,
    answer: "Airway is ALWAYS the #1 priority. Facial burns with hoarseness indicate inhalation injury with impending airway edema. Intubate EARLY while the airway is still patent. Waiting until stridor or respiratory distress develops makes intubation extremely difficult or impossible due to massive supraglottic edema.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-burns-4",
    type: "question",
    question: "Using the Rule of Nines for an adult, what is the TBSA for burns involving the entire right arm and anterior trunk?",
    options: ["18%", "27%", "36%", "45%"],
    correctIndex: 1,
    answer: "Rule of Nines: entire right arm = 9%, anterior trunk = 18%, total = 27% TBSA. The Rule of Nines: each arm 9%, each leg 18%, anterior trunk 18%, posterior trunk 18%, head 9%, perineum 1%.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-burns-5",
    type: "question",
    question: "Why is pulse oximetry unreliable in carbon monoxide poisoning from inhalation injury?",
    options: ["The device malfunctions in fire environments", "Pulse oximetry reads carboxyhemoglobin (COHb) as oxyhemoglobin, giving falsely normal SpO2 readings", "Carbon monoxide interferes with the infrared sensor", "Pulse oximetry measures venous oxygen, not arterial"],
    correctIndex: 1,
    answer: "Standard pulse oximetry cannot distinguish carboxyhemoglobin from oxyhemoglobin because they have similar light absorption wavelengths. SpO2 reads FALSELY NORMAL even when oxygen delivery is severely impaired. CO-oximetry from an ABG is required to measure COHb levels accurately.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-burns-6",
    type: "question",
    question: "What urine output indicates adequate fluid resuscitation in an adult burn patient?",
    options: ["0.1-0.3 mL/kg/hr", "0.5-1 mL/kg/hr", "2-3 mL/kg/hr", "5 mL/kg/hr"],
    correctIndex: 1,
    answer: "The target urine output for adult burn resuscitation is 0.5-1 mL/kg/hr (30-50 mL/hr for average adult). For children, the target is 1-2 mL/kg/hr. Fluid rates should be adjusted every 1-2 hours based on urine output, not a fixed volume.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-burns-7",
    type: "question",
    question: "Why should burned extremities be elevated above heart level?",
    options: ["To reduce infection risk", "To reduce edema by promoting venous and lymphatic drainage", "To prevent contractures", "To improve arterial blood flow"],
    correctIndex: 1,
    answer: "Elevating burned extremities above heart level promotes venous and lymphatic drainage, reducing the massive edema that occurs from capillary leak during the emergent phase. This also helps prevent compartment syndrome in circumferentially burned extremities.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-burns-8",
    type: "question",
    question: "A patient has circumferential full-thickness burns to the right forearm with absent radial pulse. What procedure should the nurse prepare for?",
    options: ["Amputation", "Escharotomy", "Skin grafting", "Fasciotomy"],
    correctIndex: 1,
    answer: "Escharotomy is an incision through the non-elastic full-thickness burn eschar to release the constriction and restore circulation. Circumferential full-thickness burns act like a tourniquet as edema develops beneath the non-elastic eschar, compromising distal circulation. This is a bedside emergency procedure.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  // ============================================================
  // STATUS EPILEPTICUS (28 cards)
  // ============================================================
  {
    id: "rn-shock-se-1",
    type: "question",
    question: "How is status epilepticus defined?",
    options: ["Any seizure lasting >30 seconds", "A seizure lasting >5 minutes OR two or more seizures without return to baseline consciousness", "A seizure with loss of consciousness", "Any recurrent seizure disorder"],
    correctIndex: 1,
    answer: "Status epilepticus is defined as a seizure lasting >5 minutes OR two or more seizures without return to baseline consciousness between episodes. This updated definition (from the older 30-minute threshold) reflects the understanding that neuronal damage begins earlier and treatment should not be delayed.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-se-2",
    type: "question",
    question: "What is the first-line medication for status epilepticus?",
    options: ["Phenytoin IV", "Lorazepam IV or midazolam IM", "Valproic acid IV", "Propofol infusion"],
    correctIndex: 1,
    answer: "Benzodiazepines are first-line: IV lorazepam 0.1 mg/kg (max 4 mg) or IM midazolam 10 mg (if no IV access). They must be given within 5 minutes of seizure onset. Lorazepam is preferred IV due to longer antiseizure duration (12-24 hours vs diazepam's 15-20 minutes).",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-se-3",
    type: "question",
    question: "Why do benzodiazepines become less effective the longer a seizure continues?",
    options: ["Liver metabolism increases", "GABA-A receptors internalize (are removed from the cell surface) during prolonged seizure activity", "Benzodiazepines are broken down by seizure activity", "The blood-brain barrier strengthens"],
    correctIndex: 1,
    answer: "During prolonged seizure activity, GABA-A receptors are physically internalized from the synaptic membrane through endocytosis, reducing available targets for benzodiazepines. Simultaneously, excitatory NMDA receptors are upregulated. This time-dependent receptor trafficking is why early treatment within 5 minutes is critical.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-se-4",
    type: "question",
    question: "What should the nurse check IMMEDIATELY at the bedside when a patient starts seizing?",
    options: ["CT scan", "EEG", "Bedside blood glucose", "Lumbar puncture"],
    correctIndex: 2,
    answer: "Bedside glucose (finger stick) must be checked IMMEDIATELY because hypoglycemia is a rapidly reversible cause of seizures. If glucose is <60 mg/dL, administer D50W 50 mL IV. This simple intervention can stop the seizure if hypoglycemia is the cause.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-se-5",
    type: "question",
    question: "When should thiamine be given in relation to dextrose for a seizing patient with suspected alcohol withdrawal?",
    options: ["After dextrose", "Thiamine BEFORE dextrose to prevent Wernicke encephalopathy", "They can be given simultaneously", "Thiamine is not indicated in seizures"],
    correctIndex: 1,
    answer: "Thiamine 100 mg IV should be given BEFORE or simultaneously with dextrose in suspected alcohol withdrawal or malnutrition. Glucose administration without thiamine can precipitate or worsen Wernicke encephalopathy by depleting remaining thiamine stores through glucose metabolism.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-se-6",
    type: "question",
    question: "What is the treatment algorithm timing for status epilepticus?",
    options: ["Benzodiazepine within 30 min, second-line within 60 min", "Benzodiazepine within 5 min, second-line within 20 min, third-line within 40 min", "Any anticonvulsant within 10 min", "Propofol infusion as first step"],
    correctIndex: 1,
    answer: "The SE treatment algorithm: First-line benzodiazepines within 5 minutes, second-line anticonvulsant (fosphenytoin, valproate, or levetiracetam) within 20 minutes if seizure continues, third-line therapy (intubation + continuous anesthetic infusion) within 40 minutes for refractory SE.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-se-7",
    type: "question",
    question: "What advantage does IM midazolam have over IV lorazepam in the prehospital setting?",
    options: ["It is more potent", "It can be given IM without IV access, which is often difficult during active seizures (RAMPART trial)", "It has fewer side effects", "It lasts longer"],
    correctIndex: 1,
    answer: "The RAMPART trial demonstrated that IM midazolam (10 mg) is as effective as IV lorazepam for terminating seizures when given in the prehospital setting. Its major advantage is that IM injection can be given immediately without the delay of establishing IV access during active convulsions.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-se-8",
    type: "question",
    question: "What is non-convulsive status epilepticus (NCSE) and how is it diagnosed?",
    options: ["A seizure without loss of consciousness; diagnosed by clinical exam", "Altered consciousness without convulsions; requires continuous EEG for diagnosis", "A brief seizure followed by rapid recovery", "Seizure activity only in children"],
    correctIndex: 1,
    answer: "Non-convulsive status epilepticus (NCSE) presents as altered consciousness, confusion, or subtle behavioral changes WITHOUT visible convulsions. It can only be diagnosed by continuous EEG monitoring showing ongoing epileptiform activity. Suspect NCSE in any patient with prolonged altered mental status after a convulsive seizure.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  // ============================================================
  // TBI (28 cards)
  // ============================================================
  {
    id: "rn-shock-tbi-1",
    type: "question",
    question: "What is the formula for cerebral perfusion pressure (CPP)?",
    options: ["CPP = ICP - MAP", "CPP = MAP - ICP", "CPP = MAP + ICP", "CPP = MAP x ICP"],
    correctIndex: 1,
    answer: "CPP = MAP - ICP. The goal CPP is >60 mmHg. If ICP is elevated (>20 mmHg), CPP can be improved by either reducing ICP (osmotic therapy, CSF drainage, sedation) or increasing MAP (fluids, vasopressors). The nurse must calculate and document CPP every hour.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-tbi-2",
    type: "question",
    question: "What is Cushing's triad and what does it indicate?",
    options: ["Fever, tachycardia, hypotension - indicates sepsis", "Hypertension with widening pulse pressure, bradycardia, irregular respirations - indicates brainstem herniation", "JVD, muffled heart sounds, hypotension - indicates tamponade", "Bradycardia, hypotension, warm skin - indicates neurogenic shock"],
    correctIndex: 1,
    answer: "Cushing's triad (hypertension with widening pulse pressure + bradycardia + irregular respirations) is a LATE and ominous sign of critically elevated ICP causing brainstem compression/herniation. It represents a neurosurgical emergency. The nurse should detect rising ICP BEFORE Cushing's triad develops.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-tbi-3",
    type: "question",
    question: "What does a unilateral fixed dilated pupil indicate in a TBI patient?",
    options: ["Normal response to light in a dark room", "Ipsilateral (same side) uncal herniation compressing CN III", "Bilateral herniation", "Medication side effect"],
    correctIndex: 1,
    answer: "A unilateral fixed dilated pupil indicates uncal herniation on the SAME side (ipsilateral). The temporal lobe herniates through the tentorium cerebelli, compressing CN III (oculomotor nerve) which controls pupillary constriction. This is a neurosurgical emergency requiring immediate ICP-lowering interventions.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-tbi-4",
    type: "question",
    question: "At what ICP value should the nurse intervene per TBI management guidelines?",
    options: ["ICP >10 mmHg", "ICP >15 mmHg", "ICP >20-22 mmHg sustained", "ICP >30 mmHg"],
    correctIndex: 2,
    answer: "Current Brain Trauma Foundation guidelines recommend treatment for sustained ICP >20-22 mmHg. Normal ICP is 5-15 mmHg. The nurse should report any ICP >20 mmHg sustained for >5 minutes and initiate the tiered ICP management protocol.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-tbi-5",
    type: "question",
    question: "Why should the head of bed be maintained at 30 degrees with the head in midline position for TBI patients?",
    options: ["To prevent aspiration", "To promote jugular venous drainage from the brain, reducing ICP", "To improve visibility for neurological assessment", "To prevent pressure injuries"],
    correctIndex: 1,
    answer: "HOB at 30 degrees with head in neutral midline position promotes venous drainage through the jugular veins, reducing intracranial blood volume and ICP. Neck flexion or rotation compresses jugular veins, impeding venous outflow and increasing ICP. This is a free, immediate nursing intervention.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-tbi-6",
    type: "question",
    question: "When should mannitol be held in a TBI patient?",
    options: ["When ICP is >20 mmHg", "When serum osmolality exceeds 320 mOsm/kg", "When blood pressure is elevated", "When urine output is adequate"],
    correctIndex: 1,
    answer: "Mannitol should be held when serum osmolality exceeds 320 mOsm/kg because further osmotic diuresis at this level risks acute kidney injury, severe dehydration, and rebound cerebral edema. Check serum osmolality every 6 hours when using mannitol.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-tbi-7",
    type: "question",
    question: "What nursing activities can increase ICP and should be spaced apart?",
    options: ["Deep breathing exercises and ambulation", "Suctioning, repositioning, bathing, and any noxious stimulation (cluster care increases ICP)", "Vital sign assessment and documentation", "Medication administration and IV fluid infusion"],
    correctIndex: 1,
    answer: "Activities that increase ICP include suctioning (vagal and cough response), repositioning, bathing, loud stimulation, and Valsalva maneuver. The nurse should space these activities 10-15 minutes apart rather than clustering them, as cumulative ICP spikes can be dangerous. Preoxygenate before suctioning.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-tbi-8",
    type: "question",
    question: "What advantage does hypertonic saline have over mannitol for ICP reduction in hypotensive TBI patients?",
    options: ["It is cheaper", "Hypertonic saline does not cause osmotic diuresis, so it does not worsen hypotension", "It works faster", "It has fewer side effects"],
    correctIndex: 1,
    answer: "Hypertonic saline (3% or 23.4%) draws water from brain tissue through osmosis but does NOT cause osmotic diuresis like mannitol. This makes it preferred in hypotensive patients because it actually expands intravascular volume rather than depleting it through diuresis.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  // ============================================================
  // HEMODYNAMIC MONITORING (30 cards)
  // ============================================================
  {
    id: "rn-shock-hemo-1",
    type: "question",
    question: "Where is the phlebostatic axis located for transducer leveling?",
    options: ["Sternal notch", "4th intercostal space at mid-axillary line", "Xiphoid process", "2nd ICS at midclavicular line"],
    correctIndex: 1,
    answer: "The phlebostatic axis is at the 4th intercostal space at the mid-axillary line, which approximates the level of the right atrium. All hemodynamic transducers must be leveled here for accurate readings. If leveled too high, readings are falsely low; too low, readings are falsely high.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-hemo-2",
    type: "question",
    question: "At what point in the respiratory cycle should hemodynamic readings be taken?",
    options: ["Peak inspiration", "End-expiration", "During a breath hold", "Any point is acceptable"],
    correctIndex: 1,
    answer: "All hemodynamic pressure readings should be taken at END-EXPIRATION to eliminate the effects of intrathoracic pressure changes on intravascular measurements. During inspiration, intrathoracic pressure drops, which can falsely lower CVP and PAWP readings.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-hemo-3",
    type: "question",
    question: "What hemodynamic profile indicates cardiogenic shock?",
    options: ["Low CVP, low CO, high SVR", "High PAWP, low CO, high SVR", "Low SVR, high CO, low-normal CVP", "High CVP with equalized diastolic pressures"],
    correctIndex: 1,
    answer: "Cardiogenic shock: elevated PAWP (>18 mmHg = fluid backing up from pump failure), low CO/CI (<2.2 L/min/m2 = heart failing as pump), and high SVR (>1200 = compensatory vasoconstriction). Treatment targets: reduce afterload, improve contractility, optimize preload.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-hemo-4",
    type: "question",
    question: "What is the normal range for SVR (systemic vascular resistance)?",
    options: ["200-400 dyn-s-cm-5", "800-1200 dyn-s-cm-5", "1500-2000 dyn-s-cm-5", "2500-3000 dyn-s-cm-5"],
    correctIndex: 1,
    answer: "Normal SVR is 800-1200 dyn-s-cm-5. SVR <800 indicates vasodilation (distributive shock). SVR >1200 indicates vasoconstriction (compensatory response in hypovolemic or cardiogenic shock). SVR = [(MAP - CVP) / CO] x 80.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-hemo-5",
    type: "question",
    question: "Why should the nurse NEVER infuse medications through an arterial line?",
    options: ["Arterial lines are too small for medication infusion", "Medications injected into an artery cause distal ischemia, tissue necrosis, and potential limb loss", "Arterial lines are reserved for blood sampling only", "The pressure bag would interfere with drug delivery"],
    correctIndex: 1,
    answer: "Injecting medications into an artery causes intense vasospasm and distal ischemia, potentially resulting in tissue necrosis, gangrene, and limb loss. Arterial lines are used ONLY for continuous blood pressure monitoring and arterial blood sampling. All medications must be given through IV (venous) access.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-hemo-6",
    type: "question",
    question: "What does the Allen test assess and when is it performed?",
    options: ["Cardiac output; before PA catheter insertion", "Ulnar artery collateral circulation to the hand; before radial arterial line insertion", "Deep vein patency; before central line placement", "Jugular vein distension; during cardiac assessment"],
    correctIndex: 1,
    answer: "The Allen test confirms adequate ulnar artery collateral blood supply to the hand before radial arterial line insertion. Compress both radial and ulnar arteries, then release the ulnar artery. Hand should reperfuse (pink up) within 7 seconds, confirming dual blood supply.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-hemo-7",
    type: "question",
    question: "What does the square wave (fast flush) test assess on an arterial line?",
    options: ["Patient blood pressure accuracy", "Dynamic response of the monitoring system; optimal shows 1-2 oscillations before returning to baseline", "Catheter patency only", "Transducer battery level"],
    correctIndex: 1,
    answer: "The square wave test assesses the dynamic response of the pressure monitoring system. Optimal response shows a sharp square wave followed by 1-2 oscillations before returning to baseline. Over-damped (no oscillations, slow return) suggests clot, air, or kink. Under-damped (excessive oscillations) gives artificially high systolic readings.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-hemo-8",
    type: "question",
    question: "What is the normal range for PAWP (pulmonary artery wedge pressure)?",
    options: ["0-4 mmHg", "8-12 mmHg", "15-25 mmHg", "25-35 mmHg"],
    correctIndex: 1,
    answer: "Normal PAWP is 8-12 mmHg. PAWP >18 mmHg suggests left ventricular failure or fluid overload. PAWP <8 mmHg suggests hypovolemia. PAWP reflects left atrial pressure and left ventricular end-diastolic pressure (preload).",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-hemo-9",
    type: "question",
    question: "What complication can occur if the PA catheter balloon is left inflated?",
    options: ["Air embolism", "Pulmonary artery rupture (potentially fatal hemorrhage)", "Catheter displacement", "Infection"],
    correctIndex: 1,
    answer: "Leaving the PA catheter balloon inflated can cause pulmonary artery rupture with fatal hemorrhage (hemoptysis). The balloon should only be inflated briefly for wedge pressure readings and immediately deflated. Never inject more than 1.5 mL of air into the balloon.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-hemo-10",
    type: "question",
    question: "What does an SvO2 of 50% from a PA catheter indicate?",
    options: ["Normal oxygen balance", "Inadequate oxygen delivery or increased tissue oxygen extraction", "Excessive oxygen delivery", "Arterial hypoxemia"],
    correctIndex: 1,
    answer: "Normal SvO2 is 60-80%. An SvO2 of 50% indicates that tissues are extracting more oxygen than normal to compensate for inadequate delivery (low CO, anemia) or increased demand (fever, pain, agitation). Treatment: improve cardiac output, correct anemia, reduce oxygen demand.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-hemo-11",
    type: "question",
    question: "How is MAP (mean arterial pressure) calculated?",
    options: ["(Systolic + Diastolic) / 2", "[(2 x Diastolic) + Systolic] / 3", "Systolic - Diastolic", "Systolic x Diastolic / 2"],
    correctIndex: 1,
    answer: "MAP = [(2 x Diastolic) + Systolic] / 3. The diastolic is weighted because the heart spends approximately 2/3 of the cardiac cycle in diastole. Target MAP >65 mmHg for adequate organ perfusion. Example: BP 120/60, MAP = (120 + 120) / 3 = 80 mmHg.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  // ============================================================
  // ADDITIONAL HYPOVOLEMIC SHOCK CARDS
  // ============================================================
  {
    id: "rn-shock-hypo-11",
    type: "question",
    question: "A trauma patient is receiving O-negative blood before crossmatch results are available. Why is O-negative selected?",
    options: ["It is cheapest", "O-negative is the universal donor type with no ABO or Rh antigens, safe for any blood type", "It has the most platelets", "O-negative has the longest shelf life"],
    correctIndex: 1,
    answer: "O-negative packed RBCs lack A, B, and Rh(D) antigens, making them compatible with any recipient's blood type. This is used in life-threatening hemorrhage when there is no time for type and crossmatch. O-positive may be used for males or post-menopausal females to conserve O-negative supply.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-hypo-12",
    type: "question",
    question: "What is the significance of a FAST exam (Focused Assessment with Sonography for Trauma) in hypovolemic shock?",
    options: ["It replaces CT scanning", "It rapidly identifies free intra-abdominal or pericardial fluid at the bedside indicating hemorrhage needing surgical intervention", "It measures cardiac output", "It guides IV placement"],
    correctIndex: 1,
    answer: "FAST exam is a rapid bedside ultrasound that identifies free fluid in 4 areas: (1) perihepatic (Morrison's pouch), (2) perisplenic, (3) pelvic (Douglas pouch), and (4) pericardial. A positive FAST in an unstable patient directs immediate surgical intervention without waiting for CT.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-hypo-13",
    type: "question",
    question: "What complication should the nurse monitor for when a patient receives >10 units of pRBCs?",
    options: ["Iron deficiency", "Hypocalcemia from citrate toxicity (citrate in stored blood chelates calcium)", "Hyperkalemia only", "Polycythemia"],
    correctIndex: 1,
    answer: "Citrate (anticoagulant in stored blood) binds ionized calcium, causing hypocalcemia with massive transfusion. Signs: perioral tingling, muscle cramps, prolonged QT, hypotension. Treatment: IV calcium gluconate or calcium chloride. Also monitor for hyperkalemia (potassium leaks from stored RBCs).",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-hypo-14",
    type: "question",
    question: "What is 'third-spacing' and how does it contribute to hypovolemic shock?",
    options: ["Fluid redistribution from intravascular space into interstitial/transcellular spaces, reducing effective circulating volume", "Fluid moving from cells into blood vessels", "Normal fluid distribution", "Excessive urination"],
    correctIndex: 0,
    answer: "Third-spacing is the shift of intravascular fluid into non-functional compartments (interstitial tissue, peritoneal cavity, pleural space) due to increased capillary permeability or decreased oncotic pressure. This reduces effective circulating volume even though total body water may be normal or elevated (e.g., burns, pancreatitis, sepsis).",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-hypo-15",
    type: "question",
    question: "What base deficit value on an ABG is associated with significant hemorrhage requiring aggressive resuscitation?",
    options: ["Base deficit of -2", "Base deficit of -4", "Base deficit of -6 or greater", "Base deficit of -1"],
    correctIndex: 2,
    answer: "A base deficit of -6 or greater indicates significant metabolic acidosis from tissue hypoperfusion and is strongly associated with major hemorrhage requiring aggressive resuscitation. Base deficit correlates with blood loss volume and mortality risk, making it a valuable resuscitation endpoint.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-hypo-16",
    type: "question",
    question: "Why should the nurse warm all blood products and IV fluids during massive resuscitation?",
    options: ["Patient comfort", "Cold fluids cause hypothermia which impairs coagulation, worsening the lethal triad", "Warm fluids infuse faster", "Cold fluids cause air embolism"],
    correctIndex: 1,
    answer: "Rapid infusion of cold (4°C) stored blood and room-temperature crystalloids causes iatrogenic hypothermia, which directly inhibits clotting factor enzyme function and platelet aggregation, worsening coagulopathy. Use rapid infusers with inline warming to maintain normothermia.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-hypo-17",
    type: "question",
    question: "What is the Shock Index (SI) and what value suggests significant hypovolemia?",
    options: ["SI = SBP/HR; abnormal if >1", "SI = HR/SBP; abnormal if >1.0 (e.g., HR 120, SBP 90 = SI 1.33)", "SI = MAP/HR; abnormal if <0.5", "SI = DBP x HR; abnormal if >10,000"],
    correctIndex: 1,
    answer: "Shock Index = HR / SBP. Normal SI is 0.5-0.7. SI >1.0 suggests significant hypovolemia and hemodynamic compromise. SI >1.5 indicates severe shock with high mortality risk. It is more sensitive than vital signs alone for detecting occult hemorrhagic shock.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  // ============================================================
  // ADDITIONAL DISTRIBUTIVE SHOCK CARDS
  // ============================================================
  {
    id: "rn-shock-dist-6",
    type: "question",
    question: "What is the mechanism of vasodilation in septic distributive shock?",
    options: ["Histamine release only", "Nitric oxide overproduction by iNOS, causing profound vascular smooth muscle relaxation", "Decreased sympathetic tone", "Calcium channel blockade"],
    correctIndex: 1,
    answer: "In sepsis, inflammatory cytokines (TNF-alpha, IL-1, IL-6) activate inducible nitric oxide synthase (iNOS) in vascular endothelium, producing massive amounts of nitric oxide. NO activates guanylate cyclase in smooth muscle, causing profound vasodilation refractory to catecholamines.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-dist-7",
    type: "question",
    question: "Which type of distributive shock has the BEST prognosis if treated immediately?",
    options: ["Septic shock", "Anaphylactic shock", "Neurogenic shock", "All have equal prognosis"],
    correctIndex: 1,
    answer: "Anaphylactic shock has the best prognosis of all distributive shock types when treated immediately with epinephrine. The pathophysiology is rapidly reversible with appropriate pharmacotherapy. Mortality from treated anaphylaxis is <1% vs septic shock mortality of 30-50%.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-dist-8",
    type: "question",
    question: "How does the CVP (central venous pressure) differ across the three subtypes of distributive shock?",
    options: ["CVP is elevated in all three", "CVP is low-normal in all three due to relative hypovolemia from massive vasodilation (blood pooling peripherally)", "CVP is normal in septic, low in neurogenic, high in anaphylactic", "CVP cannot be measured in distributive shock"],
    correctIndex: 1,
    answer: "CVP is low-normal in all distributive shock subtypes because massive vasodilation increases vascular capacitance, creating 'relative hypovolemia.' Total blood volume is normal, but the dilated vascular bed is too large for the available volume. This is why fluid resuscitation is part of initial treatment.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-dist-9",
    type: "question",
    question: "What are the key differences in cardiac output between the three distributive shock types?",
    options: ["All have low cardiac output", "Septic: high CO early, low CO late; Anaphylactic: initially maintained then drops; Neurogenic: low CO due to bradycardia", "All have high cardiac output", "Cardiac output is not affected in distributive shock"],
    correctIndex: 1,
    answer: "Early septic shock has HIGH CO (hyperdynamic) that drops late. Anaphylactic shock initially maintains CO but it drops with severe vasodilation and reduced preload. Neurogenic shock has LOW CO because bradycardia limits cardiac output (CO = HR x SV). Understanding these differences guides treatment.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-dist-10",
    type: "question",
    question: "What is the role of norepinephrine in distributive shock?",
    options: ["It increases heart rate only", "Its alpha-1 vasoconstriction restores SVR (vascular tone) while beta-1 provides mild cardiac support", "It causes vasodilation to improve perfusion", "It is contraindicated in distributive shock"],
    correctIndex: 1,
    answer: "Norepinephrine is the first-line vasopressor for distributive shock because: alpha-1 vasoconstriction directly counteracts the pathological vasodilation (restores SVR), and beta-1 stimulation provides mild inotropic support without excessive tachycardia. This makes it ideal for the low-SVR, high-CO state.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  // ============================================================
  // ADDITIONAL SEPSIS CARDS
  // ============================================================
  {
    id: "rn-shock-sepsis-11",
    type: "question",
    question: "What is the SOFA score and how does it define sepsis under the Sepsis-3 criteria?",
    options: ["A screening tool based on vital signs only", "Sequential Organ Failure Assessment; sepsis = infection with SOFA increase >=2 points from baseline", "A cardiac-specific assessment tool", "A scoring system for infection severity only"],
    correctIndex: 1,
    answer: "The SOFA score assesses 6 organ systems (respiratory, coagulation, liver, cardiovascular, CNS, renal). Under Sepsis-3, sepsis is defined as life-threatening organ dysfunction caused by dysregulated host response to infection, identified by an acute increase of >=2 SOFA points from baseline.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-sepsis-12",
    type: "question",
    question: "What blood pressure target should the nurse titrate vasopressors to in septic shock?",
    options: ["SBP >120 mmHg", "MAP >65 mmHg", "MAP >90 mmHg", "DBP >60 mmHg"],
    correctIndex: 1,
    answer: "The Surviving Sepsis Campaign targets MAP >=65 mmHg. Below this threshold, organ perfusion becomes pressure-dependent. The nurse titrates norepinephrine to maintain MAP >=65. Higher targets (>70-75) have not shown benefit and may cause cardiac ischemia from excessive vasoconstriction.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-sepsis-13",
    type: "question",
    question: "What is the rationale for conservative fluid strategy AFTER initial sepsis resuscitation?",
    options: ["Fluids are never needed after initial bolus", "After initial resuscitation, ongoing liberal fluids worsen outcomes by causing pulmonary edema, tissue edema, and impaired organ function", "Fluids should be unrestricted throughout treatment", "IV fluids are only given for 1 hour"],
    correctIndex: 1,
    answer: "After initial 30 mL/kg resuscitation, a conservative fluid strategy reduces mortality. Excessive fluids cause pulmonary edema (impairing oxygenation), tissue edema (impairing organ perfusion), and intra-abdominal hypertension. Use dynamic assessments (passive leg raise, pulse pressure variation) to guide further fluid boluses.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-sepsis-14",
    type: "question",
    question: "What is the passive leg raise (PLR) test and when is it used?",
    options: ["A test for DVT", "A dynamic fluid responsiveness test: raising legs 45° autotransfuses ~300 mL, and if CO increases >10%, the patient is likely fluid-responsive", "A positioning technique for comfort", "A test for neurogenic shock"],
    correctIndex: 1,
    answer: "The PLR test is a reversible, non-invasive 'autotransfusion' of approximately 300 mL of blood from lower extremities to the central circulation. If cardiac output increases by >10% during PLR, the patient is likely fluid-responsive and will benefit from additional IV fluids. No fluid administration required for the test.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-sepsis-15",
    type: "question",
    question: "What is source control in sepsis management?",
    options: ["Controlling the spread of infection to other patients", "Identifying and eliminating the anatomic source of infection (draining abscesses, removing infected devices, debriding necrotic tissue)", "Isolating the patient", "Using only one antibiotic"],
    correctIndex: 1,
    answer: "Source control means physically addressing the infection source: drain abscesses, remove infected devices (central lines, Foley catheters), debride necrotic tissue, or repair GI perforations. Antibiotics alone cannot cure undrained infections. Source control should be achieved within 6-12 hours of sepsis recognition.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  // ============================================================
  // ADDITIONAL ANAPHYLAXIS CARDS
  // ============================================================
  {
    id: "rn-shock-ana-9",
    type: "question",
    question: "What are the diagnostic criteria for anaphylaxis (requires involvement of how many organ systems)?",
    options: ["One organ system only", "Two or more organ systems involved after exposure to a likely allergen (skin + respiratory, cardiovascular, or GI)", "All five organ systems", "No criteria exist; it is a clinical diagnosis only"],
    correctIndex: 1,
    answer: "Anaphylaxis is diagnosed when, after exposure to a likely allergen, TWO or more organ systems are involved: skin/mucosal (urticaria, angioedema), respiratory (wheeze, stridor), cardiovascular (hypotension), GI (vomiting, cramping). OR: hypotension alone after known allergen exposure. OR: skin symptoms + respiratory symptoms.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-ana-10",
    type: "question",
    question: "What is the difference between anaphylaxis and anaphylactoid reaction?",
    options: ["They are identical conditions", "Anaphylaxis is IgE-mediated (requires prior sensitization); anaphylactoid is non-IgE-mediated (occurs on first exposure) — treatment is identical", "Anaphylactoid is less severe", "Anaphylaxis does not involve mast cells"],
    correctIndex: 1,
    answer: "Anaphylaxis (IgE-mediated) requires prior allergen sensitization with IgE antibody formation. Anaphylactoid reactions (now called non-IgE-mediated anaphylaxis) cause direct mast cell degranulation without prior sensitization (e.g., radiocontrast, NSAIDs, exercise). Clinical presentation and treatment (epinephrine) are IDENTICAL.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-ana-11",
    type: "question",
    question: "Why are antihistamines NOT first-line treatment for anaphylaxis?",
    options: ["They are too expensive", "Antihistamines only block histamine receptors; they do NOT reverse bronchospasm, hypotension, or prevent further mediator release — only epinephrine does all three", "They cause drowsiness", "They take too long to prepare"],
    correctIndex: 1,
    answer: "Antihistamines (H1: diphenhydramine, H2: famotidine) only partially block histamine receptors and have NO effect on other mediators (leukotrienes, prostaglandins). They do NOT reverse bronchospasm, do NOT raise blood pressure, and do NOT stabilize mast cells. Epinephrine is the ONLY drug that addresses all pathophysiology.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-ana-12",
    type: "question",
    question: "A latex-allergic patient needs surgery. What nursing actions should be taken?",
    options: ["Use standard equipment", "Ensure latex-free environment: use non-latex gloves, equipment, and supplies; schedule as FIRST case of the day to minimize airborne latex particles", "Cancel the surgery", "Give antihistamines prophylactically as sole intervention"],
    correctIndex: 1,
    answer: "Latex-allergic patients require: latex-free environment (non-latex gloves, IV tubing, Foley catheters, medication vial stoppers), first case scheduling (reduces airborne latex particles from previous cases), posted signage, and readily available epinephrine. Prophylactic antihistamines alone are insufficient.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-ana-13",
    type: "question",
    question: "What foods are commonly cross-reactive with latex allergy?",
    options: ["Red meat and dairy", "Bananas, avocados, kiwi, chestnuts (latex-fruit syndrome)", "Shellfish and peanuts", "Wheat and soy"],
    correctIndex: 1,
    answer: "Latex-fruit syndrome involves cross-reactivity between latex proteins and certain plant proteins. High-risk foods: bananas, avocados, kiwi, chestnuts, papaya, tomatoes, potatoes. Patients with latex allergy should be asked about fruit sensitivities, and vice versa.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-ana-14",
    type: "question",
    question: "What is the IV epinephrine dose for refractory anaphylactic shock when IM doses have failed?",
    options: ["1 mg IV push (cardiac arrest dose)", "Continuous infusion at 1-10 mcg/min, titrated to response", "0.5 mg IV bolus", "10 mg IV push"],
    correctIndex: 1,
    answer: "For refractory anaphylaxis not responding to 2-3 IM doses, IV epinephrine is given as a continuous infusion at 1-10 mcg/min titrated to BP and symptoms. The cardiac arrest dose (1 mg IV push) is NOT used for anaphylaxis with a pulse, as it can cause fatal arrhythmias.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  // ============================================================
  // ADDITIONAL NEUROGENIC SHOCK CARDS
  // ============================================================
  {
    id: "rn-shock-neuro-7",
    type: "question",
    question: "What is autonomic dysreflexia and how does it relate to neurogenic shock?",
    options: ["A complication of neurogenic shock occurring above T6; noxious stimulus below injury causes hypertension, bradycardia, headache, and flushing above injury", "A type of cardiac arrhythmia", "A medication side effect", "A urinary tract complication only"],
    correctIndex: 0,
    answer: "Autonomic dysreflexia occurs in patients with spinal cord injury above T6 (same population at risk for neurogenic shock). A noxious stimulus below the injury (bladder distension, constipation) triggers massive sympathetic discharge below the injury causing hypertension. This is a medical emergency requiring removal of the stimulus.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-neuro-8",
    type: "question",
    question: "What is the preferred vasopressor for neurogenic shock?",
    options: ["Epinephrine", "Norepinephrine (provides both alpha-1 vasoconstriction and beta-1 cardiac stimulation)", "Phenylephrine", "Dopamine"],
    correctIndex: 1,
    answer: "Norepinephrine is preferred because it provides both alpha-1 vasoconstriction (counteracting the vasodilation) and beta-1 cardiac stimulation (counteracting the bradycardia). Pure alpha agonists like phenylephrine may worsen reflex bradycardia. Atropine is added separately if bradycardia is severe.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-neuro-9",
    type: "question",
    question: "How long can neurogenic shock last after a spinal cord injury?",
    options: ["Minutes to hours", "1-3 days typically, but can persist for 1-5 weeks in severe injuries", "Only during the initial injury", "Permanently"],
    correctIndex: 1,
    answer: "Neurogenic shock typically lasts 1-3 days but can persist for 1-5 weeks depending on injury severity. Higher cervical injuries tend to cause more prolonged shock. Patients may require vasopressor support for weeks. Differentiate from spinal shock (neurological, can last months).",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-neuro-10",
    type: "question",
    question: "Why does priapism sometimes occur in neurogenic shock?",
    options: ["Medication side effect", "Loss of sympathetic tone to pelvic vasculature causes engorgement due to unopposed parasympathetic vasodilation", "Hormonal imbalance", "Direct spinal cord compression"],
    correctIndex: 1,
    answer: "Priapism in neurogenic shock results from loss of sympathetic tone to the pelvic vasculature, allowing unopposed parasympathetic vasodilation and venous engorgement. It is an indicator of spinal cord injury severity and resolves with treatment of the neurogenic shock.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-neuro-11",
    type: "question",
    question: "A nurse observes a patient with a T4 SCI has orthostatic hypotension when transitioning from supine to sitting. Why?",
    options: ["The patient is dehydrated", "Loss of sympathetic vasoconstriction prevents compensatory response to position changes, allowing blood to pool in dependent areas", "The bed angle is wrong", "Medication side effect"],
    correctIndex: 1,
    answer: "Without sympathetic vasoconstriction below the injury, gravity causes blood pooling in lower extremities during position changes. The nurse should use: gradual position changes, compression stockings, abdominal binders, elastic wraps, and tilt-table reconditioning. This is a chronic management issue for SCI patients.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  // ============================================================
  // ADDITIONAL OBSTRUCTIVE SHOCK CARDS
  // ============================================================
  {
    id: "rn-shock-obst-6",
    type: "question",
    question: "What is electrical alternans on ECG and what does it indicate?",
    options: ["A normal variant", "Alternating QRS complex height caused by the heart swinging within pericardial fluid; pathognomonic for large pericardial effusion", "Atrial fibrillation", "Bundle branch block"],
    correctIndex: 1,
    answer: "Electrical alternans (alternating tall and short QRS complexes) occurs when the heart physically swings back and forth within a large pericardial effusion, changing its axis with each beat. It is nearly pathognomonic for large pericardial effusion/tamponade.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-obst-7",
    type: "question",
    question: "What is the definitive treatment for cardiac tamponade?",
    options: ["IV fluids alone", "Emergency pericardiocentesis (needle drainage of pericardial fluid) or surgical pericardial window", "Antibiotics", "Vasopressors"],
    correctIndex: 1,
    answer: "Pericardiocentesis removes fluid from the pericardial space, immediately improving cardiac filling and output. Even removal of 20-50 mL can dramatically improve hemodynamics. A pericardial window (surgical) provides ongoing drainage. IV fluids are a bridge to buy time by increasing preload.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-obst-8",
    type: "question",
    question: "What is the hallmark ECG finding in massive pulmonary embolism?",
    options: ["ST elevation in leads V1-V4", "S1Q3T3 pattern (S wave in lead I, Q wave in lead III, T-wave inversion in lead III)", "Atrial fibrillation always", "Normal ECG"],
    correctIndex: 1,
    answer: "S1Q3T3 is the classic (though not always present) ECG pattern of acute right heart strain from massive PE. It reflects acute right ventricular dilation and strain. Other findings: right axis deviation, right bundle branch block, sinus tachycardia, and T-wave inversions in V1-V4.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-obst-9",
    type: "question",
    question: "What is the treatment for massive PE causing obstructive shock?",
    options: ["Heparin anticoagulation only", "Systemic thrombolysis (alteplase) or catheter-directed therapy for hemodynamically unstable PE", "Surgical repair only", "Observation with bed rest"],
    correctIndex: 1,
    answer: "Hemodynamically unstable (massive) PE = systemic thrombolysis with alteplase (100 mg IV over 2 hours) or catheter-directed therapy. Standard anticoagulation alone is insufficient for massive PE. Surgical embolectomy is reserved for cases where thrombolysis is contraindicated or fails.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-obst-10",
    type: "question",
    question: "After needle decompression of a tension pneumothorax, what follow-up procedure should the nurse prepare for?",
    options: ["No further treatment needed", "Chest tube (tube thoracostomy) insertion for definitive management", "CT scan only", "Repeat needle decompression"],
    correctIndex: 1,
    answer: "Needle decompression is a temporizing measure that converts a tension pneumothorax to a simple pneumothorax. Definitive treatment requires chest tube insertion (tube thoracostomy) with water seal drainage system for ongoing air evacuation and lung re-expansion.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-obst-11",
    type: "question",
    question: "What size and location is used for needle decompression of tension pneumothorax?",
    options: ["22-gauge needle at 5th ICS midaxillary line", "14-16 gauge needle at 2nd ICS midclavicular line on the affected side", "18-gauge needle at xiphoid process", "14-gauge needle at 4th ICS, posterior"],
    correctIndex: 1,
    answer: "A 14-16 gauge needle (long enough to reach the pleural space, typically 5-8 cm) is inserted at the 2nd intercostal space (ICS), midclavicular line, on the AFFECTED side, over the top of the 3rd rib (to avoid the neurovascular bundle on the rib's inferior border).",
    category: "Shock & Emergency",
    difficulty: 2
  },
  // ============================================================
  // ADDITIONAL MODS CARDS
  // ============================================================
  {
    id: "rn-shock-mods-6",
    type: "question",
    question: "What is SIRS (Systemic Inflammatory Response Syndrome) and how does it relate to MODS?",
    options: ["SIRS and MODS are the same condition", "SIRS is the systemic inflammatory response that, if uncontrolled, progresses to organ dysfunction (MODS)", "SIRS only occurs with infection", "MODS precedes SIRS"],
    correctIndex: 1,
    answer: "SIRS is the body's systemic inflammatory response (triggered by infection, trauma, burns, pancreatitis). SIRS criteria: temp >38 or <36°C, HR >90, RR >20, WBC >12K or <4K. Uncontrolled SIRS leads to organ dysfunction (MODS). SIRS → sepsis (if infection) → severe sepsis → septic shock → MODS.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-mods-7",
    type: "question",
    question: "What nursing interventions help prevent the 'second hit' in MODS?",
    options: ["No preventive measures exist", "Meticulous infection prevention, aspiration precautions, early mobility, nutritional support, and avoiding unnecessary invasive procedures", "Increasing sedation", "Prophylactic antibiotics for all ICU patients"],
    correctIndex: 1,
    answer: "Preventing the second hit includes: hand hygiene and infection control (prevent nosocomial infection), HOB elevation and oral care (prevent VAP), early enteral nutrition (maintain gut barrier), early mobility (prevent deconditioning), and minimizing invasive devices (remove unnecessary lines/catheters promptly).",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-mods-8",
    type: "question",
    question: "What is DIC (Disseminated Intravascular Coagulation) and why does it occur in MODS?",
    options: ["A bleeding disorder unrelated to MODS", "Widespread activation of coagulation cascades causing simultaneous clotting AND hemorrhage from consumption of clotting factors and platelets", "A primary liver disease", "A medication side effect"],
    correctIndex: 1,
    answer: "DIC is triggered by systemic inflammation in MODS: widespread endothelial damage activates coagulation, forming microthrombi throughout the vasculature. This consumes clotting factors and platelets, paradoxically causing hemorrhage. Lab findings: elevated D-dimer, low fibrinogen, prolonged PT/PTT, low platelets.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-mods-9",
    type: "question",
    question: "What renal indicators should the nurse monitor for early organ dysfunction in MODS?",
    options: ["BUN only", "Rising creatinine, declining urine output (<0.5 mL/kg/hr), and rising BUN indicate acute kidney injury", "Urine color only", "Creatinine clearance only"],
    correctIndex: 1,
    answer: "Early renal dysfunction in MODS: rising creatinine (compare to baseline), oliguria (<0.5 mL/kg/hr for >6 hours), rising BUN, metabolic acidosis, and hyperkalemia. Stage renal dysfunction using RIFLE or KDIGO criteria. Early detection allows fluid optimization and avoidance of nephrotoxins.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-mods-10",
    type: "question",
    question: "What is prone positioning and when is it used in MODS-related ARDS?",
    options: ["Positioning on the back for comfort", "Placing the patient face-down for 12-16 hours/day to improve ventilation-perfusion matching in severe ARDS (PaO2/FiO2 <150)", "Positioning for a lumbar puncture", "A CT scan position"],
    correctIndex: 1,
    answer: "Prone positioning redistributes ventilation to previously collapsed posterior lung regions, improving V/Q matching and oxygenation. The PROSEVA trial showed 16 hr/day prone positioning reduces mortality in severe ARDS (P/F <150) by ~50%. Requires careful team coordination to prevent ETT dislodgement and pressure injuries.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  // ============================================================
  // ADDITIONAL BURNS CARDS
  // ============================================================
  {
    id: "rn-shock-burns-9",
    type: "question",
    question: "What are the three phases of burn management?",
    options: ["Acute, subacute, chronic", "Emergent/resuscitative (0-48 hrs), acute/wound care (48 hrs to wound closure), rehabilitative (wound closure to long-term)", "Pre-hospital, hospital, discharge", "Assessment, intervention, evaluation"],
    correctIndex: 1,
    answer: "The three phases: (1) Emergent/resuscitative (0-48 hrs): airway, fluid resuscitation, pain management; (2) Acute/wound care (48 hrs to wound closure): infection prevention, wound care, nutrition, surgical intervention; (3) Rehabilitative (closure to long-term): contracture prevention, physical therapy, psychological support.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-burns-10",
    type: "question",
    question: "What is the Curling ulcer and why does it occur in burn patients?",
    options: ["A skin ulcer from the burn itself", "A stress-related duodenal ulcer that develops 72 hours post-burn from splanchnic vasoconstriction and mucosal ischemia", "A venous leg ulcer", "A pressure injury"],
    correctIndex: 1,
    answer: "Curling ulcer is a stress-related duodenal ulcer occurring ~72 hours post-burn. Splanchnic vasoconstriction during the shock phase reduces mesenteric blood flow, causing mucosal ischemia. Prevention: proton pump inhibitors (pantoprazole) and early enteral nutrition to protect the gastric mucosa.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-burns-11",
    type: "question",
    question: "What type of burn requires the MOST aggressive fluid resuscitation?",
    options: ["Chemical burns", "Electrical burns (visible injury underestimates deep tissue damage; internal injuries are often far more extensive)", "Superficial burns", "Small partial-thickness burns"],
    correctIndex: 1,
    answer: "Electrical burns require the most aggressive resuscitation because the visible burn underestimates internal tissue destruction. Electricity travels through the body following the path of least resistance (nerves, blood vessels, muscle), causing deep tissue necrosis, rhabdomyolysis, cardiac arrhythmias, and compartment syndrome.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-burns-12",
    type: "question",
    question: "Why is early enteral nutrition critical in major burn patients?",
    options: ["To prevent hunger", "Burns cause hypermetabolism (caloric needs increase 40-100%); early enteral feeding maintains gut barrier integrity, prevents bacterial translocation, and reduces infection risk", "It reduces pain", "It speeds wound healing directly"],
    correctIndex: 1,
    answer: "Major burns cause profound hypermetabolism (metabolic rate increases 40-100% above basal). Early enteral nutrition (within 6-12 hours): maintains intestinal mucosal integrity, prevents bacterial translocation (gut bacteria entering bloodstream), provides essential macronutrients for wound healing, and reduces catabolism.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-burns-13",
    type: "question",
    question: "What is the treatment for carbon monoxide poisoning from inhalation injury?",
    options: ["Low-flow oxygen via nasal cannula", "100% oxygen via non-rebreather mask (reduces CO half-life from 4-6 hours on room air to 60-90 minutes)", "Room air only", "CPAP at low pressure"],
    correctIndex: 1,
    answer: "100% O2 via non-rebreather mask displaces CO from hemoglobin (CO has 200-250x greater affinity for Hgb than O2). This reduces COHb half-life from 4-6 hours (room air) to 60-90 minutes (100% O2) to 20-30 minutes (hyperbaric O2). Hyperbaric O2 is indicated for COHb >25%, pregnancy, or neurological symptoms.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-burns-14",
    type: "question",
    question: "What are the four major criteria for burn center transfer?",
    options: ["All burns regardless of severity", "Partial-thickness >10% TBSA, full-thickness burns, burns to face/hands/feet/genitalia/joints, and inhalation injury", "Only electrical burns", "Only burns in pediatric patients"],
    correctIndex: 1,
    answer: "ABA burn center transfer criteria: partial-thickness >10% TBSA, any full-thickness burn, burns to face/hands/feet/genitalia/perineum/major joints, electrical/chemical burns, inhalation injury, burns with pre-existing medical conditions, burns with concomitant trauma, and burns in children at hospitals without pediatric burn expertise.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-burns-15",
    type: "question",
    question: "What is the 'fluid shift' that occurs in the first 24-48 hours after a major burn?",
    options: ["Fluid moves from interstitial to intravascular space", "Massive capillary leak causes fluid shift from intravascular to interstitial space, causing edema and hypovolemia simultaneously", "No fluid shifts occur", "Fluid moves from cells into blood vessels"],
    correctIndex: 1,
    answer: "Burn-related mediators (histamine, prostaglandins, kinins) dramatically increase capillary permeability, causing massive fluid, protein, and electrolyte leakage from intravascular to interstitial space. This creates hypovolemia (reduced circulating volume) despite massive total body edema. Capillary integrity typically restores at 18-24 hours post-burn.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  // ============================================================
  // ADDITIONAL STATUS EPILEPTICUS CARDS
  // ============================================================
  {
    id: "rn-shock-se-9",
    type: "question",
    question: "What defines refractory status epilepticus?",
    options: ["Any seizure lasting >1 minute", "Status epilepticus that persists despite adequate doses of first-line AND second-line antiseizure medications", "A seizure that recurs after treatment", "A seizure with no identifiable cause"],
    correctIndex: 1,
    answer: "Refractory SE is defined as continued seizure activity despite adequate doses of first-line (benzodiazepines) AND second-line (fosphenytoin, valproate, or levetiracetam) medications. Treatment requires intubation and continuous IV anesthetic infusion (midazolam, propofol, or pentobarbital) with continuous EEG monitoring.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-se-10",
    type: "question",
    question: "What neurological damage occurs if status epilepticus is not terminated?",
    options: ["No permanent damage occurs", "Excitotoxic neuronal death from excessive glutamate release, hippocampal sclerosis, and permanent cognitive deficits", "Temporary headache only", "Reversible weakness"],
    correctIndex: 1,
    answer: "Prolonged seizure activity causes excitotoxic neuronal death: excessive glutamate activates NMDA receptors, causing calcium influx and mitochondrial failure. Neurons most vulnerable: hippocampus (memory), cortex, thalamus. Systemic complications include hyperthermia, rhabdomyolysis, aspiration, and metabolic acidosis.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-se-11",
    type: "question",
    question: "What nursing safety measures should be implemented DURING an active seizure?",
    options: ["Restrain the patient and insert a bite block", "Clear the area of hazards, protect the head, position on side if possible, time the seizure, do NOT restrain or insert anything in the mouth", "Perform CPR immediately", "Give oral medications"],
    correctIndex: 1,
    answer: "During a seizure: (1) Clear area of hard/sharp objects, (2) Protect head (pad if possible), (3) Position on side (recovery position) when safe, (4) TIME the seizure precisely, (5) DO NOT restrain, (6) DO NOT insert anything in mouth, (7) Provide supplemental oxygen, (8) Have suction available.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-se-12",
    type: "question",
    question: "What metabolic complications should the nurse monitor for during prolonged status epilepticus?",
    options: ["No metabolic effects occur", "Hyperthermia, rhabdomyolysis (elevated CK), metabolic acidosis (lactic acid from prolonged muscle contraction), hyperkalemia, and hypoglycemia", "Hypothermia only", "Alkalosis only"],
    correctIndex: 1,
    answer: "Prolonged SE causes: hyperthermia (excessive muscle activity generates heat), rhabdomyolysis (muscle breakdown → elevated CK → myoglobinuria → AKI), lactic acidosis (anaerobic metabolism), hyperkalemia (potassium release from damaged muscle), and hypoglycemia (glucose consumption). Monitor temperature, CK, ABG, electrolytes, and glucose.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-se-13",
    type: "question",
    question: "What is the role of continuous EEG monitoring after treating status epilepticus?",
    options: ["It is not needed after seizures stop", "Continuous EEG detects non-convulsive seizures that persist in up to 48% of patients after convulsive seizures are terminated", "It monitors blood pressure", "It replaces neurological assessment"],
    correctIndex: 1,
    answer: "Up to 48% of patients continue to have non-convulsive seizure activity after convulsive seizures stop. Without continuous EEG, NCSE goes undetected, causing ongoing neuronal damage. Continuous EEG monitoring for 24-48 hours post-SE is recommended to detect and treat NCSE.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-se-14",
    type: "question",
    question: "What common causes of status epilepticus should the nurse consider?",
    options: ["Only epilepsy", "Non-adherence to AEDs (most common in known epileptics), CNS infection, metabolic derangement (glucose, sodium, calcium), stroke, traumatic brain injury, drug/alcohol withdrawal", "Only metabolic causes", "Only structural brain lesions"],
    correctIndex: 1,
    answer: "Common SE causes: non-adherence to AEDs (most common in epileptics), CNS infection (meningitis, encephalitis), metabolic (hypoglycemia, hyponatremia, hypocalcemia), stroke, TBI, brain tumor, drug toxicity, alcohol/benzodiazepine withdrawal. Identifying and treating the underlying cause is essential alongside seizure termination.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  // ============================================================
  // ADDITIONAL TBI CARDS
  // ============================================================
  {
    id: "rn-shock-tbi-9",
    type: "question",
    question: "What is the Glasgow Coma Scale (GCS) and what score defines severe TBI?",
    options: ["GCS 1-5 is severe", "GCS 3-8 is severe TBI (E1-4 + V1-5 + M1-6 = 3-15)", "GCS 9-12 is severe", "GCS 13-15 is severe"],
    correctIndex: 1,
    answer: "GCS assesses Eye opening (1-4), Verbal response (1-5), Motor response (1-6), range 3-15. Severe TBI: GCS 3-8 (generally requires intubation and ICP monitoring). Moderate: 9-12. Mild: 13-15. Motor component is the most prognostically significant. A 2-point GCS decline warrants immediate re-evaluation.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-tbi-10",
    type: "question",
    question: "What is secondary brain injury and how does the nurse prevent it?",
    options: ["A second head trauma", "Additional neuronal damage from systemic insults (hypotension, hypoxia, hyperthermia, hyperglycemia) that worsen outcome after the primary injury", "A psychiatric complication", "Infection at the injury site"],
    correctIndex: 1,
    answer: "Secondary brain injury occurs hours to days after primary impact from preventable physiological insults: hypotension (SBP <90 doubles mortality), hypoxia (SpO2 <90%), hyperthermia, hyperglycemia, seizures, and elevated ICP. The nurse's primary role is PREVENTING secondary injury through vigilant monitoring and intervention.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-tbi-11",
    type: "question",
    question: "Why is even a single episode of hypotension (SBP <90) so dangerous in TBI?",
    options: ["It causes headaches", "A single episode of SBP <90 in TBI doubles mortality because autoregulation is impaired, making the injured brain vulnerable to ischemia at pressures normally tolerated", "It interferes with CT scanning", "It causes nausea"],
    correctIndex: 1,
    answer: "The injured brain loses cerebral autoregulation (ability to maintain constant cerebral blood flow across a range of blood pressures). Without autoregulation, even brief hypotension causes cerebral ischemia. A single SBP <90 episode doubles TBI mortality. Maintain MAP >80 and CPP >60 at all times.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-tbi-12",
    type: "question",
    question: "What is the difference between an epidural hematoma and a subdural hematoma?",
    options: ["They are the same condition", "Epidural: arterial bleeding (middle meningeal artery), lens-shaped on CT, lucid interval; Subdural: venous bleeding (bridging veins), crescent-shaped on CT, gradual deterioration", "Epidural is always chronic; subdural is always acute", "Epidural occurs only in elderly patients"],
    correctIndex: 1,
    answer: "Epidural hematoma: arterial (middle meningeal artery), biconvex/lens shape on CT, classic 'lucid interval' then rapid deterioration, most common in young adults with temporal bone fracture. Subdural: venous (bridging veins), crescent shape on CT, more common in elderly/anticoagulated, gradual onset. Both are surgical emergencies.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-tbi-13",
    type: "question",
    question: "What temperature should be maintained in severe TBI and why?",
    options: ["Hypothermia at 33°C", "Normothermia (36-37°C); fever increases cerebral metabolic rate and ICP, worsening secondary injury", "Mild hyperthermia is beneficial", "Temperature management is not important"],
    correctIndex: 1,
    answer: "Strict normothermia (36-37°C) must be maintained. Each 1°C rise in temperature increases cerebral metabolic rate by 6-8%, increasing ICP and worsening secondary injury. Treat fever aggressively with acetaminophen, cooling blankets, and addressing the source (infection). Targeted temperature management (TTM) to 33-36°C may be used for refractory ICP.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-tbi-14",
    type: "question",
    question: "What glucose range should be targeted in TBI patients?",
    options: ["Any glucose level is acceptable", "140-180 mg/dL; both hyperglycemia (>180) and hypoglycemia (<70) worsen neurological outcomes", "80-110 mg/dL (tight control)", ">200 mg/dL for brain fuel"],
    correctIndex: 1,
    answer: "Target glucose 140-180 mg/dL. Hyperglycemia (>180) increases lactate production and cerebral edema, worsening secondary injury. Hypoglycemia (<70) directly causes neuronal death. Tight glucose control (<110) increases hypoglycemia risk without improving outcomes. Use insulin infusions with frequent glucose monitoring.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-tbi-15",
    type: "question",
    question: "What is the role of an EVD (external ventricular drain) in TBI management?",
    options: ["Only for medication administration", "An EVD allows continuous ICP monitoring AND therapeutic CSF drainage to reduce ICP", "For feeding tube placement", "For blood transfusion"],
    correctIndex: 1,
    answer: "An EVD is a catheter placed in the lateral ventricle that serves dual purposes: (1) Continuous ICP monitoring with waveform analysis, and (2) Therapeutic CSF drainage to reduce ICP (draining 3-5 mL at a time). The drain height (reference to tragus) determines drainage threshold. Keep the system level with the tragus and assess for infection (ventriculitis).",
    category: "Shock & Emergency",
    difficulty: 3
  },
  // ============================================================
  // ADDITIONAL HEMODYNAMIC MONITORING CARDS
  // ============================================================
  {
    id: "rn-shock-hemo-12",
    type: "question",
    question: "What is the difference between CVP and PAWP in hemodynamic assessment?",
    options: ["They measure the same thing", "CVP reflects right atrial/right ventricular preload; PAWP reflects left atrial/left ventricular preload", "CVP measures afterload; PAWP measures contractility", "Both measure cardiac output"],
    correctIndex: 1,
    answer: "CVP (normal 2-8 mmHg) reflects right heart preload and right ventricular end-diastolic pressure. PAWP (normal 8-12 mmHg) reflects left heart preload and left ventricular end-diastolic pressure. In left heart failure, PAWP rises while CVP may remain normal initially. Both are assessed at end-expiration.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-hemo-13",
    type: "question",
    question: "What is the normal cardiac index (CI) and how does it differ from cardiac output (CO)?",
    options: ["CI and CO are the same value", "CI = CO / BSA (body surface area); normal CI is 2.5-4.0 L/min/m², which adjusts for patient size", "CI = CO x SVR", "CI = MAP x HR"],
    correctIndex: 1,
    answer: "Cardiac index (CI) = CO / body surface area (BSA). Normal CI: 2.5-4.0 L/min/m². CI adjusts cardiac output for body size, making it more clinically useful than raw CO for comparing patients of different sizes. CI <2.2 L/min/m² indicates cardiogenic shock.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-hemo-14",
    type: "question",
    question: "What is an over-damped arterial line waveform and how does it affect readings?",
    options: ["No effect on readings", "Waveform appears flattened with a slow upstroke; falsely LOW systolic and falsely HIGH diastolic pressures", "Waveform appears spiky; falsely high readings", "Normal waveform appearance"],
    correctIndex: 1,
    answer: "Over-damping produces a flattened waveform with slow upstroke and absent dicrotic notch. It gives falsely LOW systolic and falsely HIGH diastolic readings (underestimates pulse pressure). Causes: air bubbles, blood clot, kink in tubing, loose connections, or catheter against vessel wall. Troubleshoot systematically.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-hemo-15",
    type: "question",
    question: "What does the dicrotic notch on an arterial waveform represent?",
    options: ["Atrial contraction", "Aortic valve closure at the end of systole, marking the transition from systole to diastole", "Mitral valve opening", "Ventricular filling"],
    correctIndex: 1,
    answer: "The dicrotic notch represents aortic valve closure at the end of ventricular systole. It marks the transition from systolic to diastolic pressure. A clear dicrotic notch indicates an optimally responsive monitoring system. Its absence suggests either over-damping or aortic valve pathology.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-hemo-16",
    type: "question",
    question: "What complications can occur from a PA (pulmonary artery/Swan-Ganz) catheter?",
    options: ["No significant complications", "PA rupture, arrhythmias (during insertion), infection, thrombosis, air embolism (from ruptured balloon), and pulmonary infarction", "Only mild discomfort", "Skin irritation at insertion site only"],
    correctIndex: 1,
    answer: "PA catheter complications: pulmonary artery rupture (potentially fatal), arrhythmias during placement (VT/VF as catheter passes through RV), catheter-related bloodstream infection, venous thrombosis, air embolism from balloon rupture, and pulmonary infarction from catheter migration and persistent wedging.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-hemo-17",
    type: "question",
    question: "What is pulse pressure variation (PPV) and how is it used to guide fluid therapy?",
    options: ["PPV is the difference between systolic and diastolic pressure", "PPV measures respiratory-induced changes in pulse pressure to predict fluid responsiveness; PPV >13% suggests the patient will benefit from fluid bolus", "PPV measures heart rate variability", "PPV is only used in cardiac surgery"],
    correctIndex: 1,
    answer: "PPV quantifies beat-to-beat pulse pressure variation caused by respiratory cycling in mechanically ventilated patients. PPV >13% indicates fluid responsiveness (the heart is operating on the steep portion of the Frank-Starling curve). Requires: mechanical ventilation, sinus rhythm, Vt >=8 mL/kg. It is a dynamic measure superior to static CVP for guiding fluid therapy.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-hemo-18",
    type: "question",
    question: "Why must the nurse zero the transducer at the phlebostatic axis before each measurement?",
    options: ["To reset the battery", "Zeroing calibrates the transducer to atmospheric pressure at the heart level, eliminating hydrostatic pressure error for accurate readings", "To clear the tubing", "It is only needed once at setup"],
    correctIndex: 1,
    answer: "Zeroing calibrates the system by establishing atmospheric pressure as the zero reference point at the level of the right atrium (phlebostatic axis). Without zeroing, drift in transducer electronics or changes in atmospheric pressure introduce measurement error. Re-zero when the transducer is repositioned or at least every 8-12 hours.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-hemo-19",
    type: "question",
    question: "What does a CVP waveform with large 'a' waves indicate?",
    options: ["Normal finding", "Increased resistance to right atrial emptying (e.g., tricuspid stenosis, RV failure, pulmonary hypertension)", "Left ventricular failure", "Dehydration"],
    correctIndex: 1,
    answer: "Large 'a' waves in the CVP waveform indicate the right atrium is contracting against increased resistance: tricuspid stenosis, RV failure, pulmonary hypertension, or pulmonic stenosis. 'Cannon a' waves (very large, intermittent) occur when the atrium contracts against a closed tricuspid valve (AV dissociation, junctional rhythm).",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-hemo-20",
    type: "question",
    question: "What is the Fick principle and how does it relate to cardiac output monitoring?",
    options: ["A method for measuring blood pressure", "Cardiac output can be calculated from oxygen consumption divided by arteriovenous oxygen difference: CO = VO2 / (CaO2 - CvO2)", "A formula for drug dosing", "A method for calculating tidal volume"],
    correctIndex: 1,
    answer: "The Fick principle states that CO = VO2 / (CaO2 - CvO2), where VO2 is oxygen consumption, CaO2 is arterial oxygen content, and CvO2 is venous oxygen content. This physiological principle underlies thermodilution cardiac output measurement and is the gold standard. SvO2 monitoring is derived from this concept.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  // ============================================================
  // BATCH 3: ADDITIONAL CARDS TO REACH TARGETS
  // ============================================================
  {
    id: "rn-shock-hypo-18",
    type: "question",
    question: "In Class I hemorrhagic shock (<15% blood loss), which vital sign changes does the nurse expect?",
    options: ["Tachycardia >120 and hypotension", "Minimal changes: slight anxiety, normal BP, normal or slightly elevated HR", "Bradycardia and hypertension", "Altered mental status and anuria"],
    correctIndex: 1,
    answer: "Class I hemorrhage (<750 mL, <15% blood volume) produces minimal vital sign changes: mild anxiety, normal BP, normal or slightly elevated HR (<100). Compensatory mechanisms are sufficient. This emphasizes why relying on vital signs alone can miss early hemorrhage.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-hypo-19",
    type: "question",
    question: "What is the significance of a narrowing pulse pressure in hemorrhagic shock?",
    options: ["It indicates improvement", "Narrowing pulse pressure (SBP approaching DBP) indicates failing compensatory mechanisms and impending cardiovascular collapse", "It is a normal finding in young adults", "It suggests fluid overload"],
    correctIndex: 1,
    answer: "Pulse pressure = SBP - DBP. As hemorrhage progresses, compensatory vasoconstriction raises DBP while falling stroke volume lowers SBP, narrowing pulse pressure. A pulse pressure <25 mmHg suggests severe hypovolemia. Widening pulse pressure occurs in sepsis (vasodilation).",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-hypo-20",
    type: "question",
    question: "What is the role of cell salvage (autotransfusion) in trauma surgery?",
    options: ["It replaces all donor blood needs", "It collects the patient's own shed blood, washes and reinfuses it, reducing the need for donor blood products", "It is used only for elective surgeries", "It filters bacteria from blood"],
    correctIndex: 1,
    answer: "Cell salvage (autotransfusion) collects blood lost during surgery, washes it to remove debris and anticoagulant, and reinfuses the patient's own RBCs. It reduces dependence on donor blood (infection risk, transfusion reactions, supply issues). Contraindicated if bowel contamination or malignant cells are present.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-hypo-21",
    type: "question",
    question: "What is abdominal compartment syndrome and how does it relate to hypovolemic shock resuscitation?",
    options: ["A surgical technique", "Elevated intra-abdominal pressure (>20 mmHg) from aggressive fluid resuscitation or hemorrhage causing organ ischemia", "A type of abdominal hernia", "Bowel obstruction"],
    correctIndex: 1,
    answer: "Abdominal compartment syndrome (ACS) occurs when intra-abdominal pressure exceeds 20 mmHg with organ dysfunction. Over-resuscitation causes visceral and retroperitoneal edema raising IAP. Signs: tense distended abdomen, oliguria despite fluids, elevated peak airway pressures, hypotension. Measure bladder pressure. Treatment: decompressive laparotomy.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-hypo-22",
    type: "question",
    question: "What is the REBOA procedure and when is it used in hemorrhagic shock?",
    options: ["A blood typing procedure", "Resuscitative Endovascular Balloon Occlusion of the Aorta — a temporary aortic balloon that reduces bleeding and maintains proximal organ perfusion in non-compressible torso hemorrhage", "A type of tourniquet", "A fluid warming device"],
    correctIndex: 1,
    answer: "REBOA is a minimally invasive procedure where a balloon catheter is placed in the aorta to occlude blood flow below the balloon, reducing hemorrhage and maintaining perfusion to heart and brain. Used as a bridge to surgery in non-compressible torso hemorrhage (pelvic fractures, abdominal vascular injury).",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-hypo-23",
    type: "question",
    question: "What physiological mechanism causes lactic acidosis in hypovolemic shock?",
    options: ["Liver failure", "Inadequate tissue oxygen delivery forces cells to switch from aerobic to anaerobic metabolism, producing lactic acid", "Renal tubular acidosis", "Respiratory compensation"],
    correctIndex: 1,
    answer: "When oxygen delivery is insufficient (low cardiac output from blood loss), cells switch from efficient aerobic metabolism (36 ATP/glucose) to anaerobic glycolysis (2 ATP/glucose), producing lactic acid as a byproduct. Persistent lactic acidosis indicates ongoing tissue hypoxia despite resuscitation.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-hypo-24",
    type: "question",
    question: "How does the nurse assess capillary refill time and what does it indicate in shock?",
    options: ["Press the nail bed for 5 seconds and release; normal refill is <2 seconds", "Press the nail bed firmly for 3-5 seconds and release; normal refill is <2 seconds; prolonged refill >3 seconds suggests poor peripheral perfusion", "Capillary refill is measured by blood pressure", "It is assessed using a pulse oximeter"],
    correctIndex: 1,
    answer: "Press the nail bed firmly for 3-5 seconds, release, and time the return of pink color. Normal: <2 seconds. Delayed (>3 seconds) indicates poor peripheral perfusion from vasoconstriction (compensatory response) or low cardiac output. Assess in conjunction with skin temperature, color, and moisture.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-dist-11",
    type: "question",
    question: "What is the pathophysiology of capillary leak in distributive shock?",
    options: ["Capillaries physically rupture", "Inflammatory mediators increase capillary permeability, allowing fluid and proteins to leak from intravascular to interstitial space", "Capillaries constrict excessively", "Capillary walls thicken"],
    correctIndex: 1,
    answer: "Inflammatory mediators (histamine, bradykinin, cytokines) disrupt endothelial tight junctions, dramatically increasing capillary permeability. Fluid, electrolytes, and proteins leak into the interstitium, causing edema while simultaneously depleting intravascular volume (relative hypovolemia). This is why fluid resuscitation is needed despite normal total blood volume.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-dist-12",
    type: "question",
    question: "Why is phenylephrine generally NOT the first choice for distributive shock?",
    options: ["It is too expensive", "Phenylephrine is a pure alpha-1 agonist that can worsen cardiac output by increasing afterload without cardiac support, and may cause reflex bradycardia", "It is not available IV", "It causes hypertension"],
    correctIndex: 1,
    answer: "Phenylephrine is a pure alpha-1 agonist (vasoconstriction only, no beta stimulation). It increases SVR but does not support cardiac output and can reflexively decrease heart rate. In septic shock, where myocardial depression may develop, the lack of beta stimulation is a disadvantage. Reserved for cases with significant tachyarrhythmia.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-dist-13",
    type: "question",
    question: "What is the role of dobutamine in late-stage distributive shock?",
    options: ["First-line vasopressor", "Added when cardiac output drops (cold shock) to provide beta-1 inotropic support, improving contractility and cardiac output", "It replaces norepinephrine", "It is only used in cardiogenic shock"],
    correctIndex: 1,
    answer: "Dobutamine (beta-1 agonist) is added in late distributive shock when myocardial depression develops (cold shock phase with dropping CO/CI). It improves contractility without significantly increasing SVR. Used alongside norepinephrine: NE maintains vascular tone while dobutamine supports the failing heart.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-sepsis-16",
    type: "question",
    question: "What is the difference between bacteremia and sepsis?",
    options: ["They are the same condition", "Bacteremia is bacteria in the blood (may be asymptomatic); sepsis is a dysregulated host response to infection causing organ dysfunction", "Bacteremia is always more severe", "Sepsis requires positive blood cultures"],
    correctIndex: 1,
    answer: "Bacteremia = presence of bacteria in the bloodstream (may be transient, asymptomatic, and not all sepsis has bacteremia). Sepsis = infection + organ dysfunction from dysregulated host response (SOFA increase >=2). Blood cultures are positive in only 30-40% of sepsis cases. Clinical assessment is more important than culture results for diagnosis.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-sepsis-17",
    type: "question",
    question: "What is antibiotic de-escalation and when should it occur in sepsis?",
    options: ["Stopping all antibiotics immediately", "Narrowing from broad-spectrum to targeted therapy based on culture and sensitivity results, typically at 48-72 hours", "Using only oral antibiotics", "Adding more antibiotics"],
    correctIndex: 1,
    answer: "De-escalation = switching from broad-spectrum empiric antibiotics to narrow-spectrum targeted therapy once culture and sensitivity results identify the pathogen (typically 48-72 hours). Benefits: reduces antimicrobial resistance, C. diff risk, and side effects. Duration: 7-10 days for most sepsis sources.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-sepsis-18",
    type: "question",
    question: "Why is urine output an important monitoring parameter in sepsis?",
    options: ["To calculate fluid balance only", "Urine output <0.5 mL/kg/hr for >6 hours indicates acute kidney injury from sepsis-related renal hypoperfusion", "It measures antibiotic levels", "It indicates infection source"],
    correctIndex: 1,
    answer: "Urine output is a real-time indicator of renal perfusion. Oliguria (<0.5 mL/kg/hr for >6 hours) in sepsis indicates AKI from renal hypoperfusion (hemodynamic) or direct septic injury. It is included in the SOFA score and guides fluid/vasopressor titration. Target: 0.5 mL/kg/hr.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-sepsis-19",
    type: "question",
    question: "What is the role of central venous oxygen saturation (ScvO2) in sepsis management?",
    options: ["It measures arterial oxygen", "ScvO2 reflects the balance between oxygen delivery and consumption; target >70% in sepsis resuscitation", "It measures respiratory function", "It is not useful in sepsis"],
    correctIndex: 1,
    answer: "ScvO2 (measured from a central venous catheter in the SCV or IJ) reflects global oxygen supply-demand balance. Normal ScvO2 is 65-75%. ScvO2 <70% in sepsis suggests inadequate oxygen delivery (low CO, anemia) or increased consumption (fever, pain). Optimize CO, hemoglobin, and reduce demand to improve ScvO2.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-sepsis-20",
    type: "question",
    question: "What is a 'sepsis screen' or 'sepsis alert' and how does it work?",
    options: ["A blood test for sepsis", "An automated or nurse-driven screening tool using vital sign abnormalities and clinical criteria to identify patients at risk for sepsis early", "A type of isolation precaution", "A physician order set"],
    correctIndex: 1,
    answer: "Sepsis screening uses systematic criteria (modified SIRS, qSOFA, or NEWS2 scores) to identify patients at risk for sepsis early. Many hospitals use EHR-triggered alerts when vital sign criteria are met. Early identification drives early treatment. Studies show sepsis screening protocols reduce mortality by 20-30%.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-ana-15",
    type: "question",
    question: "What are the most common triggers for anaphylaxis?",
    options: ["Environmental allergens (pollen, dust)", "Medications (antibiotics, NSAIDs), foods (peanuts, tree nuts, shellfish), and insect stings (Hymenoptera)", "Stress and exercise only", "Contact allergens only"],
    correctIndex: 1,
    answer: "The three most common triggers: (1) Medications — antibiotics (penicillins, cephalosporins), NSAIDs, neuromuscular blocking agents; (2) Foods — peanuts, tree nuts, shellfish, milk, eggs; (3) Insect stings — Hymenoptera (bees, wasps, hornets). Exercise-induced anaphylaxis and idiopathic anaphylaxis also occur.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-ana-16",
    type: "question",
    question: "What medications are given AFTER epinephrine in the treatment of anaphylaxis?",
    options: ["Only diphenhydramine", "H1 blocker (diphenhydramine 25-50 mg IV), H2 blocker (famotidine 20 mg IV), corticosteroids (methylprednisolone), bronchodilator (albuterol) if wheezing persists", "Only corticosteroids", "Only albuterol"],
    correctIndex: 1,
    answer: "After epinephrine: (1) H1 blocker (diphenhydramine 25-50 mg IV) for urticaria/itching, (2) H2 blocker (famotidine 20 mg IV) for synergistic effect, (3) Corticosteroid (methylprednisolone 125 mg IV) to prevent biphasic reaction, (4) Albuterol nebulizer for persistent bronchospasm. These are ADJUNCTS, not substitutes for epinephrine.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-ana-17",
    type: "question",
    question: "Why are corticosteroids given in anaphylaxis if they take 4-6 hours to work?",
    options: ["They reverse immediate symptoms", "Corticosteroids help prevent the biphasic (late-phase) reaction that can recur 4-12 hours after initial resolution", "They are not actually given in anaphylaxis", "They enhance epinephrine absorption"],
    correctIndex: 1,
    answer: "Corticosteroids (methylprednisolone, dexamethasone) do NOT treat the acute phase of anaphylaxis (too slow). They are given to prevent the biphasic late-phase reaction by suppressing the inflammatory cascade that causes symptom recurrence 4-12 hours later. Their efficacy for this purpose is debated but they remain standard practice.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-ana-18",
    type: "question",
    question: "What is the correct epinephrine dose for a pediatric patient with anaphylaxis?",
    options: ["Same as adult dose", "0.01 mg/kg of 1:1,000 IM (max 0.3 mg for children, 0.5 mg for adolescents/adults)", "0.1 mg/kg IM", "No epinephrine for children"],
    correctIndex: 1,
    answer: "Pediatric epinephrine dose: 0.01 mg/kg of 1:1,000 (1 mg/mL) IM, maximum 0.3 mg. Auto-injectors: EpiPen Jr 0.15 mg for 15-30 kg, EpiPen 0.3 mg for >30 kg. Same anterolateral thigh injection site. Repeat every 5-15 minutes as needed.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-neuro-12",
    type: "question",
    question: "What is the mechanism of hypotension in neurogenic shock?",
    options: ["Blood loss", "Loss of sympathetic vasomotor tone causes massive peripheral vasodilation, pooling blood in the venous system and reducing venous return", "Cardiac pump failure", "Fluid loss from sweating"],
    correctIndex: 1,
    answer: "Sympathetic nervous system controls vascular smooth muscle tone via alpha-1 receptors. When sympathetic outflow is disrupted (SCI above T6), unopposed parasympathetic tone causes massive vasodilation. Blood pools in dilated peripheral vessels, reducing venous return (preload) and cardiac output despite normal blood volume.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-neuro-13",
    type: "question",
    question: "What DVT prevention measures are especially important in neurogenic shock from SCI?",
    options: ["Ambulation only", "Mechanical prophylaxis (SCDs, compression stockings) AND pharmacological prophylaxis (LMWH or UFH) due to very high DVT/PE risk from venous stasis and immobility", "Aspirin only", "DVT risk is low in SCI patients"],
    correctIndex: 1,
    answer: "SCI patients have the HIGHEST DVT risk of any hospitalized population (up to 100% without prophylaxis). Venous stasis from paralysis + vasodilation = perfect conditions for clot formation. Both mechanical (SCDs, graduated compression stockings) AND pharmacological (LMWH preferred) prophylaxis are essential starting within 72 hours of injury.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-neuro-14",
    type: "question",
    question: "Why must the nurse monitor for ileus and gastric distension in neurogenic shock?",
    options: ["The patient is overeating", "Loss of sympathetic innervation to the GI tract causes paralytic ileus; gastric distension can compromise diaphragmatic excursion and respiratory function", "GI complications are unrelated to SCI", "It is a medication side effect only"],
    correctIndex: 1,
    answer: "Loss of sympathetic tone below the SCI causes paralytic ileus (loss of GI motility). Gastric distension from gas and secretion accumulation can elevate the diaphragm, compromising respiratory function (especially critical in high cervical injuries). Insert NG tube for decompression. Monitor for bowel sounds and abdominal distension.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-obst-12",
    type: "question",
    question: "What is the hemodynamic response to fluid bolus in cardiac tamponade?",
    options: ["No response", "Temporary improvement in blood pressure by increasing preload to overcome pericardial compression, but this is only a bridge to pericardiocentesis", "Fluid bolus is contraindicated", "Dramatic and sustained improvement"],
    correctIndex: 1,
    answer: "IV fluids in tamponade temporarily increase preload to overcome the pericardial compression, transiently improving cardiac output and blood pressure. This is a BRIDGE only — definitive treatment is pericardiocentesis. Avoid intubation and PPV if possible as they further reduce preload.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-obst-13",
    type: "question",
    question: "What are the Virchow triad risk factors for PE leading to obstructive shock?",
    options: ["Fever, tachycardia, hypotension", "Venous stasis, endothelial injury, and hypercoagulability", "Hypertension, diabetes, smoking", "Infection, inflammation, autoimmunity"],
    correctIndex: 1,
    answer: "Virchow's triad describes three categories of PE risk factors: (1) Venous stasis (immobility, bed rest, long flights), (2) Endothelial injury (surgery, trauma, central lines), (3) Hypercoagulability (cancer, pregnancy, oral contraceptives, Factor V Leiden). The nurse should assess all hospitalized patients for these risk factors.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-obst-14",
    type: "question",
    question: "What is the difference between a simple pneumothorax and a tension pneumothorax?",
    options: ["They are identical", "Simple: air in pleural space without mediastinal shift; Tension: progressive air accumulation with mediastinal shift, causing cardiovascular collapse from impaired venous return", "Tension is less severe", "Simple always requires surgery"],
    correctIndex: 1,
    answer: "Simple pneumothorax: air enters the pleural space (lung collapses) but does not build up pressure. Tension pneumothorax: one-way valve mechanism causes progressive air accumulation, building pressure that shifts the mediastinum, compresses the opposite lung, and kinks the great vessels, causing obstructive shock. Tension is immediately life-threatening.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-mods-11",
    type: "question",
    question: "What is acute kidney injury (AKI) in the context of MODS and what are the KDIGO staging criteria?",
    options: ["AKI is always chronic", "AKI in MODS is defined by KDIGO: Stage 1 (creatinine 1.5-1.9x baseline or UO <0.5 mL/kg/hr for 6-12 hrs), Stage 2 (2-2.9x), Stage 3 (3x or creatinine >4 or need for dialysis)", "AKI only occurs from nephrotoxic drugs", "All ICU patients have AKI"],
    correctIndex: 1,
    answer: "KDIGO AKI staging: Stage 1: Cr 1.5-1.9× baseline OR UO <0.5 mL/kg/hr × 6-12h; Stage 2: Cr 2.0-2.9× baseline OR UO <0.5 × 12h; Stage 3: Cr ≥3× baseline OR Cr ≥4.0 OR dialysis initiation OR UO <0.3 × 24h or anuria × 12h. Early detection guides fluid management and avoidance of nephrotoxins.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-mods-12",
    type: "question",
    question: "What is CRRT (continuous renal replacement therapy) and why is it preferred over intermittent hemodialysis in MODS?",
    options: ["CRRT is the same as dialysis", "CRRT provides slow, continuous fluid and solute removal, which is better tolerated hemodynamically in unstable MODS patients than intermittent hemodialysis", "CRRT is faster than hemodialysis", "CRRT is used only for drug removal"],
    correctIndex: 1,
    answer: "CRRT removes fluid and solutes continuously over 24 hours (vs intermittent HD over 3-4 hours), causing less hemodynamic instability. This is critical in MODS patients who are already on vasopressors and cannot tolerate rapid fluid shifts. Modes include CVVHD, CVVHF, and CVVHDF. The nurse monitors circuit pressures, electrolytes, and fluid balance hourly.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-mods-13",
    type: "question",
    question: "What nutritional strategy is recommended for MODS patients?",
    options: ["NPO status throughout ICU stay", "Early enteral nutrition (within 24-48 hours) via NG/OG tube to maintain gut mucosal integrity and prevent bacterial translocation", "Parenteral nutrition as first choice", "Regular diet as soon as intubated"],
    correctIndex: 1,
    answer: "Early enteral nutrition (within 24-48 hours of ICU admission) maintains gut mucosal integrity, prevents bacterial translocation (gut bacteria crossing into bloodstream), and supports immune function. Enteral feeding is preferred over parenteral (TPN) unless the GI tract is non-functional. Target protein: 1.2-2 g/kg/day. Use trophic feeding initially if hemodynamically unstable.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-mods-14",
    type: "question",
    question: "What is the hematologic component of MODS and how is it assessed?",
    options: ["Only anemia", "DIC (disseminated intravascular coagulation) with thrombocytopenia, elevated D-dimer, prolonged PT/PTT, low fibrinogen, and clinical bleeding from mucosal surfaces and IV sites", "Only elevated WBC", "Only elevated platelets"],
    correctIndex: 1,
    answer: "Hematologic failure in MODS typically manifests as DIC: widespread microthrombi consume clotting factors and platelets, paradoxically causing hemorrhage. Lab findings: platelets <100K (SOFA criteria), elevated D-dimer (>10x normal), prolonged PT/PTT, low fibrinogen (<100). Clinical: petechiae, oozing from IV sites, mucosal bleeding.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-burns-16",
    type: "question",
    question: "What electrolyte abnormalities should the nurse anticipate in the first 24 hours of a major burn?",
    options: ["Hypernatremia and hypokalemia", "Hyperkalemia (from cell destruction), hyponatremia (from sodium loss through damaged skin and dilution), and hypocalcemia", "Normal electrolytes", "Only metabolic alkalosis"],
    correctIndex: 1,
    answer: "Initial burn electrolyte changes: hyperkalemia (massive cell destruction releases intracellular K+), hyponatremia (Na+ lost through wounds and diluted by fluid shifts), hypocalcemia (Ca2+ binds to albumin lost through capillary leak). After 48 hours, patterns often reverse as capillary integrity restores. Monitor and replace aggressively.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-burns-17",
    type: "question",
    question: "What is 'burn shock' and when does it occur?",
    options: ["Electrical shock from the burn", "Hypovolemic shock in the first 24-48 hours from massive capillary leak, fluid shifts, and evaporative losses unique to burns", "Septic shock from wound infection", "Neurogenic shock from pain"],
    correctIndex: 1,
    answer: "Burn shock is a unique form of hypovolemic shock occurring in the first 24-48 hours after major burns. Inflammatory mediators increase capillary permeability, causing massive fluid, electrolyte, and protein loss from intravascular to interstitial space. It combines both hypovolemic (low preload) and distributive (vasodilation) components.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-burns-18",
    type: "question",
    question: "What is the 'fluid mobilization' phase of burn management and when does it occur?",
    options: ["The first 24 hours", "At 48-72 hours post-burn when capillary integrity restores, fluid shifts back from interstitium to intravascular space, causing diuresis and risk of fluid overload", "During wound debridement", "At discharge"],
    correctIndex: 1,
    answer: "At 48-72 hours post-burn, capillary permeability normalizes and edema fluid is reabsorbed into the vascular space. This causes: massive diuresis (expected), risk of fluid overload/pulmonary edema (reduce IV rates), hypernatremia (from concentrated interstitial sodium returning), and hemodilution. The nurse must drastically reduce IV fluid rates during this phase.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-burns-19",
    type: "question",
    question: "What pain management approach is used for burn patients during dressing changes?",
    options: ["No pain medication is needed", "Procedural pain management: IV opioids (morphine/hydromorphone) given 15-30 minutes before dressing changes, plus anxiolysis with benzodiazepines if needed", "Only oral acetaminophen", "Topical lidocaine only"],
    correctIndex: 1,
    answer: "Burn dressing changes cause severe procedural pain. Management: IV opioids (morphine, hydromorphone, fentanyl) 15-30 minutes before the procedure. May add anxiolysis (midazolam) or ketamine for severe pain. Assess pain before, during, and after. Also address background pain (continuous low-level pain) with scheduled analgesics. Never delay wound care due to pain.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-burns-20",
    type: "question",
    question: "What is the 'Rule of the Palm' for burn assessment?",
    options: ["The patient's palm represents 1% of their TBSA, useful for estimating small or irregularly shaped burns", "The palm represents 5% of TBSA", "The palm represents 10% of TBSA", "The palm is not used for burn assessment"],
    correctIndex: 0,
    answer: "The patient's palm (including fingers) represents approximately 1% of their total body surface area. This is useful for estimating small or irregular burns that don't fit neatly into the Rule of Nines categories. For scattered burns, count how many 'palms' would cover the burned area.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-se-15",
    type: "question",
    question: "What is super-refractory status epilepticus?",
    options: ["Any seizure lasting >1 hour", "SE that persists or recurs despite 24 hours of continuous anesthetic infusion (third-line therapy)", "A seizure with a known cause", "SE in patients with epilepsy"],
    correctIndex: 1,
    answer: "Super-refractory SE is defined as seizure activity that continues or recurs >=24 hours after starting continuous anesthetic infusion, including cases that recur when anesthetic is weaned. Treatment options include: ketamine infusion, hypothermia, immunotherapy (if autoimmune etiology), and ketogenic diet. Mortality is extremely high.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-se-16",
    type: "question",
    question: "What post-ictal assessment should the nurse perform after a seizure terminates?",
    options: ["No assessment needed", "Complete neurological assessment including GCS, pupil response, motor function, speech, orientation; time to baseline recovery; check for injuries (tongue lacerations, shoulder dislocation, spine injury)", "Only check vital signs", "Only check glucose"],
    correctIndex: 1,
    answer: "Post-ictal assessment: GCS and neurological status (track time to baseline recovery), pupils (symmetry, reactivity), motor function (Todd's paralysis = focal weakness suggesting focal seizure origin), speech assessment, orientation, check for injuries (tongue bite, head trauma, shoulder dislocation, vertebral fractures), vital signs, and continuous monitoring.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-se-17",
    type: "question",
    question: "Why is fosphenytoin preferred over phenytoin for IV administration?",
    options: ["It is cheaper", "Fosphenytoin can be given faster (150 mg PE/min vs 50 mg/min), IM if needed, and has less risk of tissue necrosis (purple glove syndrome) and phlebitis than phenytoin", "It is more effective", "It has fewer drug interactions"],
    correctIndex: 1,
    answer: "Fosphenytoin advantages: (1) Faster IV rate (150 mg PE/min vs phenytoin's 50 mg/min), (2) Can be given IM if IV access fails, (3) No propylene glycol diluent (causes hypotension and arrhythmias with phenytoin), (4) Lower risk of tissue necrosis (purple glove syndrome) if it extravasates. Monitor ECG and BP during infusion.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-se-18",
    type: "question",
    question: "What seizure precautions should the nurse implement for a patient at risk for seizures?",
    options: ["Restrain the patient to the bed", "Padded side rails up, suction at bedside, oxygen available, bed in lowest position, saline lock for IV access, seizure pads on bed rails", "No precautions are needed", "Only one side rail up"],
    correctIndex: 1,
    answer: "Seizure precautions: padded side rails UP, suction equipment at bedside, supplemental oxygen readily available, bed in lowest position, saline lock for rapid IV medication access, seizure pads on bed rails, airway adjuncts nearby, and emergency medications (lorazepam) immediately accessible. Document precautions and educate patient/family.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-tbi-16",
    type: "question",
    question: "What is the Monro-Kellie doctrine?",
    options: ["A surgical technique", "The skull is a rigid container with a fixed volume; any increase in one component (brain, blood, CSF) must be compensated by a decrease in another, or ICP rises", "A neurological assessment scale", "A trauma classification system"],
    correctIndex: 1,
    answer: "The Monro-Kellie doctrine: the skull is a fixed-volume container holding three components — brain tissue (80%), blood (10%), and CSF (10%). Any volume increase in one component (edema, hematoma, hydrocephalus) must be offset by a decrease in another. When compensatory mechanisms are exhausted, ICP rises exponentially.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-tbi-17",
    type: "question",
    question: "What is the ICP waveform and what does loss of compliance look like?",
    options: ["ICP waveforms are not clinically useful", "Normal: P1 > P2 > P3; loss of compliance: P2 > P1 (P2 elevation indicates the brain is losing its ability to compensate for volume changes)", "Loss of compliance shows a flat line", "P3 is always the tallest peak"],
    correctIndex: 1,
    answer: "Normal ICP waveform: P1 (percussion wave) > P2 (tidal wave) > P3 (dicrotic wave). When intracranial compliance decreases, P2 becomes elevated above P1, indicating the brain can no longer buffer volume changes. This is an EARLY warning of impending ICP crisis, often before the numeric ICP rises significantly.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-tbi-18",
    type: "question",
    question: "What medications should be AVOIDED in TBI patients with elevated ICP?",
    options: ["All antibiotics", "Hypotonic fluids (D5W, 0.45% NS), nitroprusside (cerebral vasodilation), and ketamine (historically contraindicated, though recent evidence is mixed)", "Only NSAIDs", "No medications need to be avoided"],
    correctIndex: 1,
    answer: "Avoid in elevated ICP: (1) Hypotonic fluids (D5W, 0.45% NS) — worsen cerebral edema by driving water into brain tissue, (2) Vasodilators (nitroprusside) — cause cerebral vasodilation and increase ICP, (3) Excessive PEEP >15 cmH2O — impedes jugular venous drainage. Use isotonic or hypertonic solutions only.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-tbi-19",
    type: "question",
    question: "What is decompressive craniectomy and when is it performed?",
    options: ["Removal of a brain tumor", "Surgical removal of a large section of skull to allow the swollen brain to expand outward, reducing ICP when all medical therapies have failed", "A cosmetic procedure", "A minor bedside procedure"],
    correctIndex: 1,
    answer: "Decompressive craniectomy removes a large portion of skull, creating space for the edematous brain to expand outward rather than herniating downward. Indicated for refractory elevated ICP (>25 mmHg) not responding to maximal medical management. The bone flap is preserved (stored in abdominal wall or frozen) and replaced later (cranioplasty).",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-tbi-20",
    type: "question",
    question: "How does the nurse assess for CSF leak after skull fracture?",
    options: ["Blood cultures", "Halo test: place drainage on white gauze/linen — CSF produces a clear halo ring around bloody center; also test for glucose (CSF contains glucose, mucus does not)", "Urine dipstick", "CT scan only"],
    correctIndex: 1,
    answer: "CSF leak from ears (otorrhea) or nose (rhinorrhea) after basilar skull fracture: (1) Halo/ring test — place fluid on gauze, CSF produces a clear halo around bloody center, (2) Test for glucose — CSF contains glucose while mucus does not (less specific). Do NOT pack the ears/nose or suction nasally. Keep HOB elevated. Report to neurosurgery.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-hemo-21",
    type: "question",
    question: "What is thermodilution cardiac output measurement?",
    options: ["Measuring temperature difference between arteries and veins", "Injecting cold saline through the PA catheter's proximal port; the thermistor at the distal tip measures the temperature change curve to calculate cardiac output", "Using a thermometer to measure core temperature", "A non-invasive blood pressure method"],
    correctIndex: 1,
    answer: "Thermodilution CO: inject 10 mL cold or room-temperature saline through the proximal (RA) port. The thermistor at the PA catheter tip detects the temperature change. A temperature-time curve is generated; the area under the curve is inversely proportional to CO (high CO = rapid temperature change = small area).",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-hemo-22",
    type: "question",
    question: "What is the hemodynamic profile of obstructive shock from cardiac tamponade?",
    options: ["Low CVP, low PAWP, high CO", "Elevated and equalized diastolic pressures (CVP = RV diastolic = PA diastolic = PAWP), with low CO and normal-elevated SVR", "High CO with low SVR", "Normal hemodynamics"],
    correctIndex: 1,
    answer: "Tamponade hemodynamics: equalized diastolic pressures (all chambers compressed equally by pericardial fluid), low CO (impaired filling), normal-elevated SVR (compensatory vasoconstriction). Pathognomonic finding: CVP ≈ RVEDP ≈ PADP ≈ PAWP, all within 5 mmHg of each other.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-hemo-23",
    type: "question",
    question: "What is the significance of a 'dampened' PA waveform that suddenly appears 'wedged' without balloon inflation?",
    options: ["Normal finding", "The catheter has migrated distally and is spontaneously wedging in a small pulmonary artery branch, risking pulmonary infarction — pull back the catheter slightly", "The transducer is faulty", "The balloon has self-inflated"],
    correctIndex: 1,
    answer: "Spontaneous wedging occurs when the PA catheter migrates distally into a smaller branch, occluding blood flow and creating a persistent wedge waveform without balloon inflation. This is dangerous because it can cause pulmonary infarction. Treatment: immediately pull back the catheter 1-2 cm until the PA waveform reappears. Never push the catheter forward.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-hemo-24",
    type: "question",
    question: "What is stroke volume variation (SVV) and how does it guide fluid management?",
    options: ["The variation in heart rate", "SVV measures beat-to-beat changes in stroke volume during mechanical ventilation; SVV >13% suggests the patient is fluid-responsive", "SVV measures blood pressure variability", "SVV is a cardiac rhythm analysis"],
    correctIndex: 1,
    answer: "SVV quantifies respiratory-induced variations in stroke volume in mechanically ventilated patients. SVV >13% indicates the heart is on the steep portion of the Frank-Starling curve and will increase CO with fluid administration. Requires: controlled mechanical ventilation, sinus rhythm, Vt >=8 mL/kg. It is a dynamic measure superior to static CVP for predicting fluid responsiveness.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-hemo-25",
    type: "question",
    question: "What are the key differences between non-invasive and invasive blood pressure monitoring?",
    options: ["No differences", "Non-invasive (cuff) measures oscillometric pressures intermittently; invasive (arterial line) provides continuous real-time waveform and allows frequent ABG sampling. Arterial lines are essential in vasopressor-dependent patients for accurate titration", "Non-invasive is always more accurate", "Invasive monitoring is only for surgery"],
    correctIndex: 1,
    answer: "Key differences: invasive arterial monitoring provides continuous beat-to-beat readings (essential for vasopressor titration), waveform analysis (dicrotic notch, damping assessment), and easy arterial blood sampling. Non-invasive cuffs are intermittent and can be inaccurate in shock states (vasoconstriction causes falsely low readings). All patients on vasopressors should have arterial lines.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  // ============================================================
  // BATCH 4: ADDITIONAL CARDS PER TOPIC TO HIT TARGETS
  // ============================================================
  {
    id: "rn-shock-hypo-25",
    type: "question",
    question: "What is the primary goal of damage control surgery in hemorrhagic shock?",
    options: ["Complete definitive repair of all injuries", "Rapidly control hemorrhage and contamination with temporary closure, then resuscitate in the ICU before returning for definitive repair", "Only imaging studies", "Observation without surgery"],
    correctIndex: 1,
    answer: "Damage control surgery: (1) Stop hemorrhage (pack, ligate, clamp), (2) Control contamination (GI repair/diversion), (3) Temporary abdominal closure (vacuum-assisted or towel clips), (4) ICU resuscitation (correct hypothermia, acidosis, coagulopathy), (5) Return to OR in 24-48h for definitive repair. This staged approach improves survival in critically injured patients.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-hypo-26",
    type: "question",
    question: "What is the difference between compensated and decompensated hypovolemic shock?",
    options: ["They are the same", "Compensated: vital signs near-normal due to baroreceptor reflexes (tachycardia, vasoconstriction). Decompensated: compensatory mechanisms fail — hypotension, altered consciousness, oliguria", "Compensated always requires surgery", "Decompensated is always reversible"],
    correctIndex: 1,
    answer: "Compensated shock: baroreceptor-mediated responses maintain BP (tachycardia, vasoconstriction, ADH/aldosterone secretion). Subtle signs: anxiety, mild tachycardia, narrowing pulse pressure. Decompensated: compensatory mechanisms overwhelmed — falling BP, altered LOC, oliguria/anuria. Transition is ABRUPT in young patients. The nurse must recognize compensated shock before decompensation occurs.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-hypo-27",
    type: "question",
    question: "What blood type is used when crossmatched blood is not yet available in hemorrhagic shock?",
    options: ["Type A positive", "Type O negative (universal donor) for females of childbearing age; O positive acceptable for males and non-childbearing females", "Type AB positive", "Any available type"],
    correctIndex: 1,
    answer: "Emergency blood: Type O negative is the universal donor (no A, B, or D antigens). O negative is preferred for females of childbearing age to prevent Rh sensitization. O positive is acceptable for males and post-menopausal females (conserves O negative supply). Type-specific blood available in ~15 min; fully crossmatched in ~45-60 min.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-hypo-28",
    type: "question",
    question: "What transfusion reactions should the nurse monitor for during massive transfusion?",
    options: ["Only allergic reactions", "Hypothermia, hyperkalemia, hypocalcemia (citrate toxicity), TACO (volume overload), TRALI (acute lung injury), and febrile/allergic reactions", "No reactions occur with massive transfusion", "Only fever"],
    correctIndex: 1,
    answer: "Massive transfusion complications: (1) Hypothermia (cold blood products), (2) Hyperkalemia (K+ from stored RBCs), (3) Hypocalcemia (citrate binds calcium), (4) TACO (volume overload → pulmonary edema), (5) TRALI (immune-mediated acute lung injury within 6h), (6) Coagulopathy (dilutional + consumptive), (7) Metabolic alkalosis (citrate converted to bicarbonate). Use blood warmers and monitor closely.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-dist-14",
    type: "question",
    question: "What are the key vasoactive medications used in distributive shock and their mechanisms?",
    options: ["Only IV fluids are used", "Norepinephrine (alpha+beta: first-line), vasopressin (V1: catecholamine-sparing), phenylephrine (pure alpha: use with tachyarrhythmia), dobutamine (beta-1: added for myocardial depression)", "Only one vasopressor is ever needed", "Oral medications only"],
    correctIndex: 1,
    answer: "Vasoactive drug hierarchy in distributive shock: (1) Norepinephrine: first-line (alpha-1 vasoconstriction + beta-1 cardiac support), (2) Vasopressin: 0.03-0.04 U/min as second-line (works via V1 receptors when catecholamine receptors downregulate), (3) Epinephrine: alternative first-line (alpha + beta), (4) Phenylephrine: pure alpha (reserved for tachyarrhythmia), (5) Dobutamine: added for myocardial depression (cold shock).",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-dist-15",
    type: "question",
    question: "What is the role of the sympathetic nervous system in the compensatory response to shock?",
    options: ["It has no role in shock", "Baroreceptor activation triggers sympathetic discharge: alpha-1 (vasoconstriction, increases SVR), beta-1 (increases HR and contractility), and adrenal stimulation (epinephrine/norepinephrine release)", "It only controls digestion", "It causes vasodilation"],
    correctIndex: 1,
    answer: "When BP drops, baroreceptors (aortic arch, carotid sinus) trigger sympathetic nervous system activation: (1) Alpha-1: arterial and venous vasoconstriction → increases SVR and venous return, (2) Beta-1: increases heart rate and contractility → increases cardiac output, (3) Adrenal medulla: releases catecholamines into bloodstream. This is why neurogenic shock is so dangerous — this entire compensatory system is disrupted.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-sepsis-21",
    type: "question",
    question: "What is the recommended first-line vasopressor for septic shock?",
    options: ["Dopamine", "Norepinephrine — it provides alpha-1 vasoconstriction and beta-1 cardiac support with lower arrhythmia risk than dopamine", "Phenylephrine", "Epinephrine"],
    correctIndex: 1,
    answer: "Norepinephrine is first-line per Surviving Sepsis Campaign guidelines. Compared to dopamine: (1) Lower arrhythmia risk, (2) More potent vasoconstriction (alpha-1), (3) Beta-1 cardiac support without excessive chronotropy, (4) Decreased mortality in RCTs. Start at 0.1-0.5 mcg/kg/min, titrate to MAP ≥65 mmHg. Administer via central line when possible.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-sepsis-22",
    type: "question",
    question: "What is the difference between empiric and targeted antibiotic therapy in sepsis?",
    options: ["They are the same", "Empiric: broad-spectrum antibiotics given immediately based on suspected source/organisms. Targeted: narrow-spectrum antibiotics tailored to identified pathogen from culture results, started at 48-72 hours", "Targeted is always given first", "Empiric is never appropriate"],
    correctIndex: 1,
    answer: "Empiric therapy (Hour-1): broad-spectrum coverage based on likely pathogens (community vs hospital-acquired, site of infection, local resistance patterns, patient risk factors). Given BEFORE culture results. Targeted therapy (48-72h): de-escalated to narrow-spectrum antibiotics once pathogen and sensitivities are identified. This approach maximizes initial coverage while minimizing long-term resistance development.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-sepsis-23",
    type: "question",
    question: "What is the nurse's role in the Surviving Sepsis Campaign Hour-1 Bundle?",
    options: ["Only monitoring vital signs", "Measure lactate, draw blood cultures before antibiotics, administer broad-spectrum antibiotics within 1 hour, begin rapid fluid resuscitation for hypotension/lactate ≥4, and initiate vasopressors if MAP <65 persists", "Wait for physician orders", "Only IV access"],
    correctIndex: 1,
    answer: "The nurse is critical to Hour-1 Bundle compliance: (1) Recognize sepsis early (screening tools, qSOFA), (2) Obtain lactate level STAT, (3) Draw blood cultures (2 sets from 2 different sites), (4) Ensure antibiotics are ordered and administered within 60 minutes, (5) Initiate 30 mL/kg crystalloid bolus for MAP <65 or lactate ≥4, (6) Prepare vasopressor if hypotension persists. Document times precisely.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-ana-19",
    type: "question",
    question: "What is a biphasic anaphylactic reaction?",
    options: ["Two different allergies at once", "Recurrence of anaphylaxis symptoms 4-12 hours after initial resolution without re-exposure to the allergen, occurring in up to 20% of cases", "Two doses of epinephrine", "Anaphylaxis in two body systems"],
    correctIndex: 1,
    answer: "Biphasic reaction: anaphylaxis symptoms resolve with treatment, then RECUR 4-12 hours later (up to 72 hours) WITHOUT re-exposure to the allergen. Occurs in up to 20% of cases. Risk factors: severe initial reaction, delayed epinephrine, oral allergen. Prevention: corticosteroids (uncertain benefit), observation period 4-24 hours after initial reaction.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-ana-20",
    type: "question",
    question: "What is the correct positioning for a patient experiencing anaphylaxis?",
    options: ["Always sitting upright", "Supine with legs elevated UNLESS respiratory distress (then semi-Fowler's) or vomiting (then recovery position); NEVER sit or stand the patient (can cause cardiac arrest from empty ventricle)", "Prone position", "Trendelenburg always"],
    correctIndex: 1,
    answer: "Anaphylaxis positioning: (1) Supine with legs elevated (improves venous return to the heart), (2) If respiratory distress: semi-Fowler's (easier breathing), (3) If vomiting: recovery position (prevents aspiration), (4) NEVER allow the patient to sit up or stand — several reported anaphylaxis deaths occurred when patients were positioned upright (empty ventricle syndrome → cardiac arrest from sudden preload loss).",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-neuro-15",
    type: "question",
    question: "What MAP target is recommended for acute spinal cord injury?",
    options: ["MAP >60 mmHg", "MAP 85-90 mmHg for the first 5-7 days to optimize spinal cord perfusion and potentially improve neurological outcomes", "MAP >100 mmHg", "No specific target"],
    correctIndex: 1,
    answer: "Current AANS/CNS guidelines recommend maintaining MAP 85-90 mmHg for 5-7 days after acute SCI. Higher MAP targets than general shock (MAP ≥65) are needed to optimize perfusion to the injured spinal cord (similar to CPP targets in TBI). Achieved with fluids and vasopressors (norepinephrine preferred). Evidence is moderate quality but widely practiced.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-obst-15",
    type: "question",
    question: "What is the hemodynamic profile of a massive PE on PA catheter readings?",
    options: ["Normal hemodynamics", "Elevated RA pressure, elevated PA pressures, low PAWP (normal left heart), low CO, and elevated SVR from compensatory vasoconstriction", "Low PA pressures", "All pressures are equal"],
    correctIndex: 1,
    answer: "Massive PE hemodynamics: elevated RA/CVP (right heart strain from obstruction), elevated PA pressures (acutely elevated, though may not be very high because the unprepared RV cannot generate high pressures), LOW PAWP (obstruction prevents blood from reaching left heart), low CO (reduced pulmonary blood flow), elevated SVR (compensatory). RV dilation on echo is the hallmark.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-obst-16",
    type: "question",
    question: "What are the clinical signs of pericardial tamponade (Beck's triad)?",
    options: ["Fever, tachycardia, hypotension", "Hypotension, jugular venous distension (JVD), and muffled/distant heart sounds — known as Beck's triad", "Hypertension, bradycardia, irregular respirations", "Chest pain, dyspnea, cough"],
    correctIndex: 1,
    answer: "Beck's triad for cardiac tamponade: (1) Hypotension (decreased cardiac output from impaired filling), (2) JVD (blood backing up from compressed right heart), (3) Muffled heart sounds (pericardial fluid dampens sound). Additional sign: pulsus paradoxus (>10 mmHg drop in SBP during inspiration). Beck's triad is present in only ~30% of cases.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-mods-15",
    type: "question",
    question: "What is the systemic inflammatory response syndrome (SIRS) and how does it relate to MODS?",
    options: ["SIRS is an infection", "SIRS is a systemic inflammatory response (≥2 criteria: temp >38°C or <36°C, HR >90, RR >20 or PaCO2 <32, WBC >12K or <4K) that can be triggered by infection or non-infectious insults and may progress to MODS", "SIRS only occurs in sepsis", "SIRS is always benign"],
    correctIndex: 1,
    answer: "SIRS criteria: ≥2 of (1) Temp >38°C or <36°C, (2) HR >90, (3) RR >20 or PaCO2 <32, (4) WBC >12K or <4K. SIRS can be triggered by infection (sepsis), trauma, burns, pancreatitis, or major surgery. When SIRS leads to persistent organ dysfunction → MODS. SIRS criteria are sensitive but not specific — many ICU patients meet SIRS criteria without having sepsis.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-mods-16",
    type: "question",
    question: "What is the role of stress ulcer prophylaxis in MODS patients?",
    options: ["Not needed in ICU patients", "PPIs or H2 blockers are given to prevent stress-related mucosal disease (SRMD) in high-risk ICU patients: mechanical ventilation >48h, coagulopathy, history of GI bleeding, or ≥2 minor risk factors", "Only antacids are used", "All ICU patients need surgical intervention"],
    correctIndex: 1,
    answer: "Stress ulcer prophylaxis: critically ill patients develop mucosal ischemia from splanchnic vasoconstriction → stress ulcers. Risk factors: mechanical ventilation >48h (most common indication), coagulopathy, prior GI bleed, burns >35% TBSA, TBI. Agents: PPI (pantoprazole 40 mg IV daily) or H2 blocker (famotidine). Discontinue when patient tolerates enteral nutrition and no longer has risk factors.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-burns-21",
    type: "question",
    question: "What is the Rule of Nines for adults?",
    options: ["Each body part is 10%", "Head 9%, each arm 9%, anterior trunk 18%, posterior trunk 18%, each leg 18%, perineum 1% — total = 100%", "Each body part is 9%", "Head 18%, each leg 9%"],
    correctIndex: 1,
    answer: "Adult Rule of Nines: Head/neck 9%, Each upper extremity 9% (total 18%), Anterior trunk 18%, Posterior trunk 18%, Each lower extremity 18% (total 36%), Perineum 1%. Total = 100%. Used for rapid TBSA estimation. Pediatric proportions differ (larger head, smaller legs). Only count partial and full-thickness burns — NOT superficial (first-degree).",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-burns-22",
    type: "question",
    question: "What are the three phases of burn care?",
    options: ["Only the acute phase", "Emergent/resuscitative phase (0-48h: fluid resuscitation), Acute/wound care phase (48h to wound closure: wound management, infection prevention, nutrition), Rehabilitative phase (wound closure to recovery: functional restoration, psychosocial support)", "Only wound care and discharge", "Surgery phase only"],
    correctIndex: 1,
    answer: "Three phases: (1) Emergent (0-48h): airway management, fluid resuscitation (Parkland formula), wound assessment, pain management, tetanus prophylaxis. (2) Acute (48h to closure): wound care (debridement, topical antimicrobials, skin grafting), infection prevention, nutrition (high-calorie high-protein), pain management. (3) Rehabilitative (closure to recovery): PT/OT, scar management (compression garments), psychological support, vocational rehabilitation.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-burns-23",
    type: "question",
    question: "What criteria define a major burn requiring burn center referral?",
    options: ["Any sunburn", "Partial-thickness burns >10% TBSA, full-thickness burns, burns to face/hands/feet/genitalia/perineum/major joints, electrical/chemical burns, inhalation injury, burns with trauma, burns in patients with significant comorbidities", "Only burns >50% TBSA", "Only electrical burns"],
    correctIndex: 1,
    answer: "ABA burn center referral criteria: (1) Partial-thickness burns >10% TBSA, (2) Full-thickness burns (any size), (3) Burns to face, hands, feet, genitalia, perineum, major joints, (4) Electrical burns (including lightning), (5) Chemical burns, (6) Inhalation injury, (7) Burns + trauma, (8) Burns in patients with comorbidities, (9) Burns in children at hospitals without pediatric capability, (10) Burns requiring psychosocial intervention.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-se-19",
    type: "question",
    question: "What is the first-line treatment for status epilepticus?",
    options: ["Phenytoin", "IV lorazepam 0.1 mg/kg (max 4 mg) or IM midazolam 10 mg if no IV access — benzodiazepines are first-line because they work rapidly by enhancing GABA-A receptor activity", "Phenobarbital", "Levetiracetam"],
    correctIndex: 1,
    answer: "First-line SE treatment: IV lorazepam 0.1 mg/kg (max 4 mg/dose, may repeat × 1 in 5-10 minutes) or IM midazolam 10 mg (if no IV access — RAMPART trial showed IM midazolam non-inferior to IV lorazepam). Diazepam IV 0.15 mg/kg is an alternative. Onset: 1-3 minutes IV. If first-line fails (seizure persists >10 min after first dose), proceed to second-line agents.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-se-20",
    type: "question",
    question: "What defines status epilepticus according to current guidelines?",
    options: ["Any seizure", "Continuous seizure activity lasting ≥5 minutes, or two or more seizures without full recovery of consciousness between them", "Only tonic-clonic seizures lasting >1 hour", "Any seizure in a hospitalized patient"],
    correctIndex: 1,
    answer: "SE definition (revised): continuous seizure activity ≥5 minutes (previously 30 minutes) OR ≥2 seizures without return to baseline consciousness between them. The definition was changed to 5 minutes because: (1) Most self-limiting seizures stop within 2-3 minutes, (2) After 5 minutes, spontaneous termination becomes increasingly unlikely, (3) Earlier treatment improves outcomes.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-se-21",
    type: "question",
    question: "What lab tests should be obtained during status epilepticus?",
    options: ["Only a CBC", "Glucose (STAT — hypoglycemia is reversible cause), electrolytes (Na, Ca, Mg), AED levels (if applicable), BMP, CBC, toxicology screen, ABG, lactate, and CK (rhabdomyolysis)", "Only AED levels", "No labs are needed"],
    correctIndex: 1,
    answer: "Priority SE labs: (1) STAT glucose (correct hypoglycemia immediately with D50), (2) BMP (Na, K, Ca, Mg — electrolyte causes), (3) AED levels (if on phenytoin, valproic acid, etc. — subtherapeutic levels are the #1 cause of SE in epileptics), (4) CBC, (5) Toxicology screen (drug-induced seizures), (6) ABG/lactate (acidosis severity), (7) CK (rhabdomyolysis monitoring), (8) Blood cultures if febrile.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-tbi-21",
    type: "question",
    question: "What is the difference between diabetes insipidus (DI) and SIADH after TBI?",
    options: ["They are the same condition", "DI: excessive dilute urine output, hypernatremia, low urine specific gravity (ADH deficiency). SIADH: decreased concentrated urine output, hyponatremia, high urine specific gravity (excess ADH). They are OPPOSITE conditions", "DI causes hyponatremia", "SIADH causes polyuria"],
    correctIndex: 1,
    answer: "DI (posterior pituitary damage → ADH deficiency): massive dilute urine output (>200 mL/hr), hypernatremia (>145), low urine SG (<1.005), low urine osmolality. Treatment: desmopressin (DDAVP) + fluid replacement. SIADH (excess ADH): decreased UO, concentrated urine (SG >1.020), hyponatremia (<135). Treatment: fluid restriction, hypertonic saline for severe cases. They are OPPOSITES.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-tbi-22",
    type: "question",
    question: "What is the significance of a unilateral fixed dilated pupil in TBI?",
    options: ["Normal finding", "Indicates ipsilateral uncal herniation compressing cranial nerve III — this is a neurosurgical emergency requiring immediate ICP management and possible surgical decompression", "Only significant if bilateral", "Indicates medication effect"],
    correctIndex: 1,
    answer: "Unilateral fixed dilated pupil = ipsilateral uncal herniation compressing CN III (oculomotor nerve). The temporal lobe herniates through the tentorial notch. Progression: ipsilateral pupil dilation → contralateral motor weakness (Kernohan's notch phenomenon can cause ipsilateral weakness) → bilateral pupil fixation → brainstem compression → death. This is a TIME-CRITICAL emergency.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-tbi-23",
    type: "question",
    question: "What is cerebral perfusion pressure (CPP) and how is it calculated?",
    options: ["CPP = SBP - DBP", "CPP = MAP - ICP; target CPP 60-70 mmHg in TBI to ensure adequate brain perfusion", "CPP = HR × SV", "CPP cannot be calculated"],
    correctIndex: 1,
    answer: "CPP = MAP - ICP. Normal ICP: 5-15 mmHg. Target CPP in TBI: 60-70 mmHg (BTF guidelines). CPP <60: inadequate cerebral perfusion → ischemia. CPP >70: no additional benefit and may increase ARDS risk from aggressive vasopressor use. The nurse manages CPP by either increasing MAP (vasopressors) or decreasing ICP (CSF drainage, osmotherapy).",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-hemo-26",
    type: "question",
    question: "What is cardiac index (CI) and why is it preferred over cardiac output (CO)?",
    options: ["They measure different things", "CI = CO / body surface area (BSA); CI normalizes cardiac output to body size, allowing comparison between patients of different sizes; normal CI is 2.5-4.0 L/min/m²", "CI is less accurate than CO", "CI is only for pediatric patients"],
    correctIndex: 1,
    answer: "CI = CO / BSA. A CO of 5 L/min is normal for a 70 kg adult but inadequate for a 120 kg patient. CI accounts for body size differences. Normal CI: 2.5-4.0 L/min/m². Low CI (<2.0): shock, heart failure. High CI (>4.5): sepsis, hyperthyroidism, anemia. BSA is calculated using height and weight (DuBois formula).",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-hemo-27",
    type: "question",
    question: "What is the formula for calculating systemic vascular resistance (SVR)?",
    options: ["SVR = MAP × CO", "SVR = [(MAP - CVP) / CO] × 80; normal range 800-1200 dyn-s-cm-5", "SVR = MAP + CVP", "SVR = HR × SV"],
    correctIndex: 1,
    answer: "SVR = [(MAP - CVP) / CO] × 80. Normal: 800-1200 dyn-s-cm-5. Low SVR (<800): distributive shock (vasodilation). High SVR (>1200): compensatory vasoconstriction (cardiogenic/hypovolemic shock), hypothermia. SVR represents the resistance the left ventricle must pump against (afterload). The ×80 converts from Wood units to dyn-s-cm-5.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-hemo-28",
    type: "question",
    question: "What is the significance of the dicrotic notch on an arterial waveform?",
    options: ["An artifact that should be ignored", "The dicrotic notch represents aortic valve closure; its absence suggests aortic regurgitation, and its position reflects vascular compliance", "It indicates a catheter malfunction", "It represents atrial contraction"],
    correctIndex: 1,
    answer: "The dicrotic notch on the arterial waveform marks aortic valve closure (end of systole, beginning of diastole). Clinical significance: (1) Absent dicrotic notch may indicate aortic regurgitation, (2) Position reflects vascular compliance (low position = low SVR/vasodilation, high position = high SVR/vasoconstriction), (3) Loss of notch in an over-damped system indicates need for troubleshooting.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-hypo-29",
    type: "question",
    question: "What is permissive hypotension in hemorrhagic shock?",
    options: ["Maintaining normal BP with aggressive fluids", "Targeting a lower-than-normal SBP (80-90 mmHg) in uncontrolled hemorrhage to prevent clot disruption and dilutional coagulopathy until surgical hemorrhage control is achieved", "Allowing any blood pressure", "Only used in elderly patients"],
    correctIndex: 1,
    answer: "Permissive hypotension: intentionally target SBP 80-90 mmHg (MAP 50-60) in uncontrolled hemorrhage UNTIL surgical hemostasis. Rationale: aggressive fluid resuscitation before hemorrhage control → (1) dilutes clotting factors, (2) increases hydrostatic pressure that dislodges forming clots, (3) causes hypothermia from cold fluids. Contraindicated in TBI (need CPP >60) and elderly (poor autoregulation).",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-hypo-30",
    type: "question",
    question: "What is the lethal triad in trauma?",
    options: ["Fever, tachycardia, hypotension", "Hypothermia, acidosis, and coagulopathy — these three conditions create a self-perpetuating cycle that significantly increases mortality if not aggressively corrected", "Only occurs in elderly patients", "Hypertension, bradycardia, irregular respirations"],
    correctIndex: 1,
    answer: "The lethal triad (trauma triad of death): (1) Hypothermia (impairs enzymatic clotting cascade), (2) Acidosis (from tissue hypoperfusion and lactate accumulation, further inhibits coagulation), (3) Coagulopathy (dilutional from fluids + consumptive from hemorrhage + dysfunctional from hypothermia/acidosis). Each worsens the others creating a vicious cycle. Prevention: blood warmers, warm environment, early blood products instead of excessive crystalloid, damage control surgery.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-hypo-31",
    type: "question",
    question: "What is tranexamic acid (TXA) and when is it used in hemorrhagic shock?",
    options: ["An anticoagulant", "An antifibrinolytic given within 3 hours of injury to reduce bleeding-related mortality by inhibiting plasmin-mediated clot breakdown; 1g IV over 10 min followed by 1g over 8 hours", "A vasopressor", "An antibiotic"],
    correctIndex: 1,
    answer: "TXA (tranexamic acid): antifibrinolytic that inhibits plasminogen activation → prevents clot breakdown. CRASH-2 trial: reduced all-cause mortality when given within 3 hours of injury. Dose: 1g IV over 10 min, then 1g over 8 hours. MUST be given early — no benefit after 3 hours, and may increase thrombotic events if given late. Also used in PPH (postpartum hemorrhage) per WOMAN trial.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-dist-16",
    type: "question",
    question: "What is the pathophysiology of capillary leak syndrome in distributive shock?",
    options: ["Capillaries become stronger", "Inflammatory mediators (histamine, bradykinin, cytokines) increase capillary permeability, causing plasma to leak into the interstitium → intravascular volume depletion, tissue edema, and third-spacing despite aggressive fluid resuscitation", "Only occurs in the lungs", "Capillaries are not involved in shock"],
    correctIndex: 1,
    answer: "Capillary leak: inflammatory mediators damage the glycocalyx layer and endothelial tight junctions → proteins and fluid shift from intravascular to interstitial space. Clinical effects: (1) Intravascular hypovolemia despite massive fluid intake, (2) Tissue edema (anasarca), (3) Pulmonary edema (non-cardiogenic), (4) Reduced drug binding (albumin shifts out). This is why distributive shock patients may need vasopressors early rather than endless fluid resuscitation.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-dist-17",
    type: "question",
    question: "What is the difference between crystalloids and colloids for fluid resuscitation in shock?",
    options: ["No difference", "Crystalloids (NS, LR): inexpensive, widely available, distribute freely into interstitium (only 25% stays intravascular). Colloids (albumin, hydroxyethyl starch): contain large molecules that stay intravascular longer but are more expensive; HES is associated with renal injury in sepsis", "Colloids are always preferred", "Only blood products should be used"],
    correctIndex: 1,
    answer: "Crystalloids (LR preferred over NS): cheap, safe, effective first-line. LR is balanced (physiologic electrolytes), NS causes hyperchloremic acidosis with large volumes. Only ~25% stays intravascular. Colloids: albumin 5% is iso-oncotic (stays intravascular longer), used in some sepsis protocols. HES (hydroxyethyl starch) is CONTRAINDICATED in sepsis (CHEST/6S trials: increased renal failure and mortality). Current evidence: balanced crystalloids are first-line in most shock states.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-sepsis-24",
    type: "question",
    question: "What is the qSOFA score and how is it used at the bedside?",
    options: ["A full sepsis diagnostic", "Quick SOFA: 3 bedside criteria (RR ≥22, altered mentation, SBP ≤100) — ≥2 positive criteria identify patients at risk for poor outcomes from infection and should prompt further workup for organ dysfunction", "Only used in the ICU", "Requires lab values"],
    correctIndex: 1,
    answer: "qSOFA: 3 bedside criteria requiring NO lab work: (1) RR ≥22, (2) Altered mentation (GCS <15), (3) SBP ≤100. Score ≥2 = high risk for poor outcomes. qSOFA is a SCREENING tool, not diagnostic — it identifies patients who NEED further assessment for sepsis-related organ dysfunction (SOFA score). High specificity but low sensitivity — a negative qSOFA does NOT rule out sepsis.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-sepsis-25",
    type: "question",
    question: "What is the role of procalcitonin (PCT) in sepsis management?",
    options: ["It diagnoses sepsis definitively", "PCT is a biomarker that rises in bacterial infection; it helps differentiate bacterial vs viral infection and guide antibiotic de-escalation — declining PCT levels suggest appropriate antibiotic therapy and may guide safe discontinuation", "It has no clinical use", "It measures kidney function"],
    correctIndex: 1,
    answer: "Procalcitonin: produced by thyroid C-cells, rises dramatically in bacterial infection (not viral). Uses: (1) Help differentiate bacterial vs viral infection (PCT >0.5 suggests bacterial), (2) Guide antibiotic de-escalation (declining PCT by >80% from peak or <0.5 → consider stopping antibiotics), (3) Prognostic (persistently elevated PCT = poor source control). Limitations: false positives in renal failure, post-surgery, trauma. Use as an adjunct, not standalone.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-sepsis-26",
    type: "question",
    question: "What is source control in sepsis management?",
    options: ["Controlling the infection source with hand hygiene only", "Identifying and eliminating the anatomic focus of infection through drainage of abscesses, debridement of infected tissue, removal of infected devices, or definitive repair of anatomic disruption — ideally within 6-12 hours", "Only antibiotics are needed", "Source control is optional"],
    correctIndex: 1,
    answer: "Source control: physically eliminating the infection focus. Examples: (1) Drain abscesses (percutaneous or surgical), (2) Debride necrotic/infected tissue (necrotizing fasciitis, infected pancreatic necrosis), (3) Remove infected devices (central lines, prosthetic joints, hardware), (4) Repair perforated viscus (perforated appendicitis, diverticulitis). Goal: within 6-12 hours of diagnosis. Antibiotics alone CANNOT sterilize undrained collections or infected foreign material.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-ana-21",
    type: "question",
    question: "What is exercise-induced anaphylaxis?",
    options: ["Normal exercise fatigue", "Anaphylaxis triggered by physical exertion, sometimes only when exercise occurs within 2-6 hours of eating a specific food; symptoms include urticaria, hypotension, and bronchospasm during or immediately after exercise", "Anaphylaxis to gym equipment", "Only occurs in professional athletes"],
    correctIndex: 1,
    answer: "Exercise-induced anaphylaxis (EIA): rare but potentially fatal. Two subtypes: (1) Classic EIA: exercise alone triggers anaphylaxis, (2) Food-dependent EIA (FDEIA): anaphylaxis occurs ONLY when exercise follows ingestion of a specific food (wheat, shellfish, celery) within 2-6 hours. The food alone and exercise alone are tolerated — only the combination triggers anaphylaxis. Management: carry EpiPen, avoid exercise after trigger foods, exercise with a partner.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-ana-22",
    type: "question",
    question: "What is the difference between anaphylaxis and anaphylactoid reactions?",
    options: ["They are completely different diseases", "Both produce identical clinical symptoms (urticaria, bronchospasm, hypotension); anaphylaxis is IgE-mediated (requires prior sensitization), anaphylactoid is non-IgE-mediated (can occur on first exposure, e.g., radiocontrast, opioids) — treatment is identical", "Anaphylactoid is less dangerous", "Only anaphylaxis requires epinephrine"],
    correctIndex: 1,
    answer: "Anaphylaxis (IgE-mediated): requires prior sensitization → IgE antibodies on mast cells → re-exposure causes massive degranulation. Anaphylactoid (non-IgE): direct mast cell activation WITHOUT prior sensitization — can occur on FIRST exposure. Common triggers: radiocontrast dye, opioids, NSAIDs, vancomycin (Red Man Syndrome). Clinically IDENTICAL — treat both with epinephrine, fluids, antihistamines. The term 'anaphylactoid' is being phased out; now called 'non-allergic anaphylaxis.'",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-neuro-16",
    type: "question",
    question: "What is the difference between spinal shock and neurogenic shock?",
    options: ["They are the same condition", "Spinal shock: temporary loss of ALL reflexes below the injury level (areflexia, flaccid paralysis) — may last days to weeks. Neurogenic shock: hemodynamic instability (hypotension, bradycardia) from loss of sympathetic tone — these are two DISTINCT conditions that can coexist", "Spinal shock is always permanent", "Neurogenic shock does not involve the spine"],
    correctIndex: 1,
    answer: "Spinal shock: loss of ALL spinal cord function below the injury (reflexes, motor, sensory, autonomic) — a temporary state. Resolution: return of the bulbocavernosus reflex (S2-S4) signals the end of spinal shock (usually 24-72 hours). Only AFTER spinal shock resolves can the true extent of neurological injury be assessed. Neurogenic shock: cardiovascular consequence of loss of sympathetic outflow (T1-L2) → hypotension + bradycardia. They are SEPARATE phenomena.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-neuro-17",
    type: "question",
    question: "What level of spinal cord injury causes neurogenic shock?",
    options: ["Any spinal cord injury", "Injuries at T6 or above — these disrupt the sympathetic chain outflow (T1-L2), losing vasomotor tone and cardiac accelerator nerves; injuries below T6 retain enough sympathetic function to maintain hemodynamic stability", "Only cervical injuries", "Only lumbar injuries"],
    correctIndex: 1,
    answer: "Neurogenic shock occurs with SCI at T6 or above. The sympathetic chain exits T1-L2, but critical components include: cardiac accelerator nerves (T1-T4) and splanchnic vasomotor control (T5-L2). Injuries at T6+: lose enough sympathetic outflow → unopposed vagal (parasympathetic) tone → bradycardia + vasodilation + hypotension. Lower injuries retain sufficient sympathetic function for hemodynamic compensation.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-obst-17",
    type: "question",
    question: "What is the pathophysiology of tension pneumothorax?",
    options: ["Air slowly leaks from the lung", "Air enters the pleural space through a one-way valve mechanism, accumulates with each breath, progressively compresses the lung and shifts mediastinal structures, compressing the contralateral lung and great vessels → decreased venous return → cardiac arrest", "Only occurs in trauma", "Causes increased venous return"],
    correctIndex: 1,
    answer: "Tension pneumothorax: one-way valve allows air IN but not OUT of pleural space. Progressive air accumulation → (1) ipsilateral lung collapse, (2) mediastinal shift to contralateral side, (3) contralateral lung compression, (4) kinking of great vessels (IVC/SVC) → decreased venous return → decreased cardiac output → PEA arrest. Signs: absent breath sounds ipsilaterally, tracheal deviation, hypotension, JVD, tachycardia. Treatment: immediate needle decompression (2nd ICS MCL) → chest tube.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-obst-18",
    type: "question",
    question: "What is the immediate nursing action for suspected tension pneumothorax?",
    options: ["Order a chest X-ray first", "Assist with or perform needle decompression at the 2nd intercostal space, midclavicular line with a 14-16 gauge needle — this is a CLINICAL diagnosis treated BEFORE imaging because delay for X-ray can result in cardiac arrest", "Wait for CT scan results", "Apply oxygen only"],
    correctIndex: 1,
    answer: "Tension pneumothorax is a CLINICAL diagnosis — do NOT delay treatment for imaging. Needle decompression: 14-16 gauge needle, 2nd ICS midclavicular line (or 4th-5th ICS anterior axillary line in muscular/obese patients). Insert over the TOP of the rib (avoid neurovascular bundle on inferior border). Rush of air = confirmation. This is temporizing — follow with chest tube insertion. The nurse should have the needle decompression kit at the bedside for all chest trauma patients.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-mods-17",
    type: "question",
    question: "What is the SOFA score and how does it assess organ dysfunction?",
    options: ["A pain assessment tool", "Sequential Organ Failure Assessment: scores 6 organ systems (respiratory P/F ratio, coagulation platelets, liver bilirubin, cardiovascular MAP/vasopressors, CNS GCS, renal creatinine/UO) on a 0-4 scale; higher scores indicate worse organ dysfunction and predict mortality", "Only measures respiratory function", "A surgical risk calculator"],
    correctIndex: 1,
    answer: "SOFA score: 6 organ systems, each scored 0-4 (max total = 24). (1) Respiratory: P/F ratio, (2) Coagulation: platelets, (3) Liver: bilirubin, (4) Cardiovascular: MAP and vasopressor requirements, (5) CNS: GCS, (6) Renal: creatinine and UO. An INCREASE of ≥2 points from baseline defines sepsis-related organ dysfunction (Sepsis-3 definition). SOFA trends are more valuable than single scores — rising SOFA = clinical deterioration.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-mods-18",
    type: "question",
    question: "What is abdominal compartment syndrome (ACS) and how does it contribute to MODS?",
    options: ["A type of hernia", "Sustained intra-abdominal pressure >20 mmHg with new organ dysfunction; compresses IVC (decreased venous return), renal veins (AKI), diaphragm (respiratory failure), and mesenteric vessels (bowel ischemia) — a contributor to MODS requiring decompressive laparotomy", "Only occurs after surgery", "Does not affect other organs"],
    correctIndex: 1,
    answer: "ACS: sustained IAP >20 mmHg + organ dysfunction. Causes: massive fluid resuscitation (>6L crystalloid), bowel edema, retroperitoneal hemorrhage, abdominal surgery. Effects on organs: (1) Decreased venous return → decreased CO, (2) Renal vein compression → AKI, (3) Diaphragm elevation → respiratory failure, (4) Mesenteric compression → bowel ischemia, (5) ICP elevation (impaired cerebral venous drainage). Measurement: via Foley catheter (bladder pressure). Treatment: decompressive laparotomy with open abdomen management.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-burns-24",
    type: "question",
    question: "What topical antimicrobial agents are used for burn wound care?",
    options: ["Only oral antibiotics", "Silver sulfadiazine (broad-spectrum, painless application, inhibits epithelialization), mafenide acetate (penetrates eschar, painful, causes metabolic acidosis), silver-impregnated dressings (sustained release, less frequent changes), and bacitracin (small superficial burns)", "Hydrogen peroxide only", "No antimicrobials are needed for burns"],
    correctIndex: 1,
    answer: "Topical antimicrobials for burns: (1) Silver sulfadiazine (SSD): broad-spectrum, painless, most common — but delays wound healing and causes pseudoeschar. Sulfa allergy contraindication. (2) Mafenide acetate (Sulfamylon): penetrates eschar (used for deep/infected burns), PAINFUL on application, inhibits carbonic anhydrase → metabolic acidosis. (3) Silver-impregnated dressings (Acticoat, Mepilex Ag): sustained release, fewer dressing changes, less painful. (4) Bacitracin/Polysporin: superficial/facial burns.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-burns-25",
    type: "question",
    question: "What is an escharotomy and when is it indicated in burn care?",
    options: ["Wound debridement", "A surgical incision through full-thickness burn eschar to release constrictive tissue in circumferential burns; indicated for circumferential chest burns (restricted ventilation) or extremity burns (compartment syndrome/vascular compromise)", "Only performed at burn centers", "A skin grafting procedure"],
    correctIndex: 1,
    answer: "Escharotomy: incision through full-thickness burn eschar and superficial fascia. Indications: (1) Circumferential extremity burns with compromised distal pulses, capillary refill, or elevated compartment pressures, (2) Circumferential chest/trunk burns restricting ventilation (decreased tidal volumes, rising airway pressures). Performed at bedside (eschar has no sensation — no anesthesia needed for full-thickness areas). Incisions along lateral aspects of extremities, bilateral anterior axillary lines for chest.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-se-22",
    type: "question",
    question: "What is the second-line treatment for status epilepticus if benzodiazepines fail?",
    options: ["More benzodiazepines", "IV fosphenytoin (20 mg PE/kg), valproate (40 mg/kg), or levetiracetam (60 mg/kg) — these are administered if seizures persist 10+ minutes after adequate benzodiazepine dosing", "Surgical intervention", "No further treatment available"],
    correctIndex: 1,
    answer: "Second-line agents for established SE (seizure persists after 2 doses of benzodiazepine): (1) Fosphenytoin 20 mg PE/kg IV (max rate 150 mg PE/min; monitor for hypotension and arrhythmia; avoid in known cardiac conduction disease), (2) Valproate 40 mg/kg IV (max rate 10 mg/kg/min; avoid in liver disease, pregnancy, mitochondrial disease), (3) Levetiracetam 60 mg/kg IV (fewest side effects; max 4500 mg). ESETT trial showed all three are equivalent in efficacy (~45-50% success rate).",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-se-23",
    type: "question",
    question: "What is nonconvulsive status epilepticus (NCSE) and why is it dangerous?",
    options: ["It is always benign", "NCSE is continuous seizure activity without visible convulsions — presents as altered consciousness, confusion, or subtle signs (eye deviation, automatisms); requires EEG for diagnosis and causes ongoing neuronal injury despite the absence of obvious motor activity", "Only occurs in children", "Cannot be detected on EEG"],
    correctIndex: 1,
    answer: "NCSE: continuous electrical seizure activity WITHOUT overt convulsive movements. Presentations: (1) Altered consciousness/confusion (confused with encephalopathy, delirium), (2) Subtle signs: nystagmus, eye deviation, facial twitching, automatisms, (3) May follow convulsive SE (seizure 'terminates' but EEG shows persistent activity). Diagnosis: requires CONTINUOUS EEG monitoring. Incidence: up to 48% of ICU patients with altered consciousness have NCSE on EEG. Treatment is identical to convulsive SE but outcomes are worse due to diagnostic delays.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-tbi-24",
    type: "question",
    question: "What is the Monroe-Kellie doctrine?",
    options: ["A nutrition guideline", "The skull is a fixed rigid compartment; the total volume of brain tissue, CSF, and blood must remain constant — an increase in any one component must be offset by a decrease in another, or ICP will rise", "A cardiac assessment framework", "A respiratory therapy protocol"],
    correctIndex: 1,
    answer: "Monroe-Kellie doctrine: the cranial vault is a rigid, fixed-volume container. Contents: brain parenchyma (~80%), CSF (~10%), blood (~10%). If one component increases (e.g., hemorrhage, edema), another must decrease (CSF displaced to spinal canal, venous blood squeezed out) to maintain normal ICP. When compensatory mechanisms are exhausted, ICP rises exponentially with even small additional volume increases. This is the physiologic basis for ALL ICP management strategies.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-tbi-25",
    type: "question",
    question: "What are the nursing management priorities for elevated ICP?",
    options: ["Only medication administration", "HOB elevation 30°, maintain head midline, avoid hip flexion, normalize temperature, prevent Valsalva, manage pain/agitation, osmotherapy (mannitol or hypertonic saline), CSF drainage via EVD, and maintain CPP 60-70 mmHg", "Only surgical intervention", "No nursing interventions can lower ICP"],
    correctIndex: 1,
    answer: "ICP management nursing priorities: (1) HOB 30° (promotes venous drainage), (2) Head midline (prevents jugular vein compression), (3) Avoid hip flexion >90° (increases intra-abdominal pressure → increases ICP), (4) Prevent Valsalva (stool softeners, avoid coughing/straining), (5) Pain management (pain raises ICP), (6) Temperature control (fever increases metabolic demand), (7) Cluster care avoidance (space activities to prevent cumulative ICP spikes), (8) Osmotherapy PRN, (9) CSF drainage via EVD, (10) Sedation if needed (propofol, midazolam). Monitor ICP waveform morphology for compliance changes.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-hemo-29",
    type: "question",
    question: "What is the difference between ScvO2 and SvO2?",
    options: ["They are identical measurements", "SvO2 (mixed venous O2 sat) is measured from the PA catheter tip (true mixing of all venous blood); ScvO2 is measured from the tip of a central line in the SVC — ScvO2 is a surrogate for SvO2 and is ~5% higher; both reflect the balance between oxygen delivery and consumption", "ScvO2 is arterial oxygen", "SvO2 is measured from a peripheral vein"],
    correctIndex: 1,
    answer: "SvO2 (mixed venous): measured from PA catheter distal port (pulmonary artery — true mixed venous blood from entire body). Normal: 60-75%. ScvO2 (central venous): measured from tip of CVC in SVC (drains upper body only). Normal: ~70-80%. ScvO2 is typically 5% higher than SvO2. Both reflect the balance between O2 delivery (DO2) and O2 consumption (VO2). Low values (<60-65%) = inadequate DO2 or excessive VO2 (shock). High values may indicate mitochondrial dysfunction (sepsis).",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-hemo-30",
    type: "question",
    question: "What is passive leg raise (PLR) and how does it assess fluid responsiveness?",
    options: ["A physical therapy exercise", "PLR temporarily auto-transfuses ~300 mL of venous blood from the legs to the central circulation; if cardiac output increases by ≥10%, the patient is likely to respond to additional IV fluid — it is a reversible, repeatable bedside test", "It lowers blood pressure", "Only works in pediatric patients"],
    correctIndex: 1,
    answer: "PLR: elevate legs to 45° from a semi-recumbent position (trunk flat). This shifts ~300 mL of blood from lower extremities to central circulation, simulating a fluid bolus. Measure cardiac output (pulse contour, echo, ETCO2) during PLR: ≥10% increase in CO = fluid responsive. Advantages over traditional fluid challenge: (1) Reversible (effects end when legs lowered), (2) Repeatable, (3) No risk of fluid overload, (4) Valid even in spontaneously breathing patients and those with arrhythmias.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-hemo-31",
    type: "question",
    question: "What are the complications of PA catheter (Swan-Ganz) insertion?",
    options: ["No significant complications", "Pneumothorax, arrhythmias (ventricular during insertion), PA rupture (from over-wedging or balloon inflation in distal vessel), thrombosis, infection, air embolism, and catheter knotting — the nurse must be prepared to manage each", "Only infection", "Only arrhythmias"],
    correctIndex: 1,
    answer: "PA catheter complications: (1) Insertion-related: pneumothorax (subclavian approach), arterial puncture, arrhythmias (VT/VF as catheter passes through RV). (2) In situ: PA rupture (over-wedging — mortality >50%), pulmonary infarction (persistent wedge from catheter migration), catheter-related bloodstream infection (risk increases after 4-5 days), thrombosis, air embolism (balloon rupture), catheter knotting. (3) Nursing: maintain pressure bag at 300 mmHg, never leave balloon inflated, monitor for catheter migration (spontaneous wedge).",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-hypo-32",
    type: "question",
    question: "What is abdominal compartment syndrome in the context of hemorrhagic shock resuscitation?",
    options: ["A type of hernia", "Sustained intra-abdominal pressure >20 mmHg with organ dysfunction caused by massive fluid resuscitation leading to bowel edema, retroperitoneal hemorrhage, or abdominal packing — treated with decompressive laparotomy", "Only occurs after surgery", "Not related to fluid resuscitation"],
    correctIndex: 1,
    answer: "ACS after hemorrhagic shock: massive crystalloid resuscitation → bowel wall edema + retroperitoneal hemorrhage → rising intra-abdominal pressure. Effects: compresses IVC (decreased venous return/CO), renal veins (AKI), diaphragm (respiratory failure), mesenteric vessels (bowel ischemia). Monitoring: bladder pressure (Foley transducer) q4-6h. IAP >12 = intra-abdominal hypertension. IAP >20 + organ dysfunction = ACS → surgical decompression. Prevention: damage control resuscitation (limit crystalloids, early blood products).",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-hypo-33",
    type: "question",
    question: "What is the difference between isotonic and hypertonic resuscitation?",
    options: ["No clinical difference", "Isotonic (NS, LR): large volumes needed, distributes to interstitium (only 25% intravascular). Hypertonic (3% or 7.5% NaCl): small volume expands intravascular space by pulling water from cells via osmosis — useful in TBI with hemorrhage (reduces ICP while expanding volume)", "Hypertonic causes more edema", "Isotonic is always preferred"],
    correctIndex: 1,
    answer: "Isotonic resuscitation (NS, LR): requires 3:1 ratio (3L given for every 1L lost) because only 25% stays intravascular — the rest distributes to interstitium. Complications with large volumes: tissue edema, dilutional coagulopathy. Hypertonic resuscitation (3% NaCl, 7.5% NaCl): small volume (250 mL of 7.5% NaCl) draws water from intracellular/interstitial space → rapid intravascular volume expansion with less total fluid. Benefit in TBI: reduces ICP while restoring volume. Not widely adopted as primary resuscitation due to inconsistent survival benefit in trials.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-dist-18",
    type: "question",
    question: "What is the glycocalyx and why is it important in distributive shock?",
    options: ["A type of glucose storage", "The glycocalyx is a carbohydrate-rich layer lining the endothelium that maintains vascular barrier function; inflammatory mediators in distributive shock degrade the glycocalyx, increasing capillary permeability and fluid leak into tissues", "It has no role in shock", "A type of medication"],
    correctIndex: 1,
    answer: "The glycocalyx: thin gel-like layer of glycoproteins and proteoglycans covering the vascular endothelium. Functions: (1) Maintains vascular permeability barrier, (2) Regulates leukocyte adhesion, (3) Acts as a mechanotransducer for shear stress, (4) Binds anticoagulant molecules (antithrombin III). In sepsis/distributive shock: inflammatory mediators (TNF-α, ROS, heparanase) degrade the glycocalyx → exposed endothelium → increased permeability (capillary leak) → tissue edema and hypovolemia. This is why albumin may help — it binds to and partially restores the glycocalyx barrier.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-sepsis-27",
    type: "question",
    question: "What is the SOFA score and how is it used in sepsis?",
    options: ["A physical assessment tool", "Sequential Organ Failure Assessment: scores 6 organ systems (0-4 each) — respiratory (P/F), coagulation (platelets), liver (bilirubin), cardiovascular (MAP/vasopressors), CNS (GCS), renal (creatinine/UO). An acute increase ≥2 points defines sepsis-related organ dysfunction per Sepsis-3", "Only measures cardiac function", "A score used only in surgery"],
    correctIndex: 1,
    answer: "SOFA score: (1) Respiratory: P/F ratio (400→<100 = 0→4), (2) Coagulation: platelets (≥150→<20K = 0→4), (3) Liver: bilirubin (<1.2→>12 = 0→4), (4) Cardiovascular: MAP ≥70 to high-dose vasopressors (0→4), (5) CNS: GCS 15→<6 (0→4), (6) Renal: creatinine <1.2→>5 or UO <200 mL/d (0→4). Total: 0-24. Sepsis-3 definition: life-threatening organ dysfunction caused by dysregulated host response to infection, identified by acute SOFA increase ≥2 from baseline. Higher SOFA = higher mortality.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-sepsis-28",
    type: "question",
    question: "What are the indications for blood cultures in sepsis?",
    options: ["Only if the patient has a fever", "Draw at least 2 sets from 2 different sites BEFORE starting antibiotics; each set includes aerobic and anaerobic bottles; draw through freshly accessed veins (not existing lines unless CRBSI is suspected) to minimize contamination", "Blood cultures are optional in sepsis", "Only 1 set is needed"],
    correctIndex: 1,
    answer: "Blood culture best practices: (1) Draw 2 sets minimum from 2 DIFFERENT peripheral sites (reduces contamination risk and improves sensitivity), (2) Each set = 1 aerobic + 1 anaerobic bottle (8-10 mL per bottle), (3) Draw BEFORE antibiotics (antibiotics can sterilize blood within 2 hours, causing false negatives), (4) Proper skin antisepsis (CHG or alcohol), (5) If CRBSI suspected: draw 1 peripheral + 1 from each catheter lumen (differential time to positivity). DO NOT delay antibiotics for cultures if venipuncture is difficult — cultures from existing lines are better than no cultures.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-ana-23",
    type: "question",
    question: "What is mast cell tryptase and when should it be drawn?",
    options: ["A liver enzyme", "Mast cell tryptase is a biomarker that peaks 1-2 hours after anaphylaxis onset; elevated levels confirm mast cell degranulation and support the diagnosis of anaphylaxis, especially useful in unclear cases or perioperative anaphylaxis", "It has no clinical use", "It is drawn weeks after the event"],
    correctIndex: 1,
    answer: "Mast cell tryptase: enzyme released during mast cell degranulation. Timing: draw at 0.5-2 hours after symptom onset (peaks at 1-2 hours, returns to baseline by 6-8 hours). Draw a baseline level at least 24 hours later for comparison. Interpretation: peak > baseline + (baseline × 1.2 + 2) = elevated. Clinical use: (1) Confirms anaphylaxis diagnosis (especially perioperative where multiple agents are given simultaneously), (2) Medicolegal documentation, (3) Normal tryptase does NOT rule out anaphylaxis (especially food-induced). Also elevated in: mastocytosis, myeloproliferative disorders.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-neuro-18",
    type: "question",
    question: "What is autonomic dysreflexia and at what spinal cord level does it occur?",
    options: ["A type of cardiac arrhythmia", "A potentially life-threatening hypertensive emergency occurring in patients with SCI at T6 or above, triggered by noxious stimuli below the injury level (bladder distension, fecal impaction); characterized by severe hypertension, bradycardia, headache, and diaphoresis above the lesion", "Only occurs with cervical injuries", "A type of seizure"],
    correctIndex: 1,
    answer: "Autonomic dysreflexia: occurs with SCI at T6 or above (must be above major splanchnic sympathetic outflow). Mechanism: noxious stimulus below injury → massive sympathetic discharge (cannot be modulated by brain due to cord injury) → severe vasoconstriction below injury → hypertension → baroreceptors detect hypertension → parasympathetic response ABOVE injury only (bradycardia, vasodilation, sweating, flushing above level) → sympathetics cannot respond below injury → cycle continues. Most common triggers: bladder distension (76%), fecal impaction (13%).",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-obst-19",
    type: "question",
    question: "What is the difference between massive and submassive PE?",
    options: ["Only size of the clot differs", "Massive PE: hemodynamic instability (hypotension/shock, cardiac arrest) — requires emergent thrombolytics or embolectomy. Submassive PE: hemodynamically stable BUT with RV dysfunction (elevated troponin, RV dilation on echo, BNP elevation) — higher risk of decompensation, consider thrombolytics", "All PEs are the same severity", "Submassive is always benign"],
    correctIndex: 1,
    answer: "PE severity classification: (1) Low risk: hemodynamically stable, no RV dysfunction → anticoagulation only. (2) Submassive: hemodynamically stable BUT RV dysfunction present (echo: RV dilation/hypokinesis, troponin elevated, BNP elevated, ECG: RV strain pattern) → anticoagulation ± consider systemic thrombolytics (controversial — PEITHO trial showed benefit in preventing hemodynamic decompensation but increased bleeding). (3) Massive: hemodynamically unstable (SBP <90, shock, cardiac arrest) → systemic thrombolytics (alteplase 100 mg IV over 2 hours) or catheter-directed therapy or surgical embolectomy.",
    category: "Shock & Emergency",
    difficulty: 3
  },
  {
    id: "rn-shock-mods-19",
    type: "question",
    question: "What is acute respiratory distress syndrome (ARDS) and what is the Berlin definition?",
    options: ["A chronic lung disease", "ARDS Berlin definition: acute onset (within 1 week of known insult), bilateral opacities on CXR (not fully explained by effusions/atelectasis), respiratory failure not fully explained by cardiac failure, and P/F ratio classification: mild (200-300), moderate (100-200), severe (<100) with PEEP ≥5", "Only caused by pneumonia", "Diagnosed by pulmonary function tests"],
    correctIndex: 1,
    answer: "Berlin ARDS definition (2012): (1) Timing: acute onset within 1 week of clinical insult or new/worsening respiratory symptoms. (2) Imaging: bilateral opacities on CXR/CT not fully explained by effusions, lobar collapse, or nodules. (3) Origin: not fully explained by cardiac failure or fluid overload (may need echo to exclude). (4) Oxygenation (on PEEP ≥5): Mild P/F 200-300, Moderate P/F 100-200, Severe P/F <100. Common causes in MODS: sepsis (#1), aspiration, pneumonia, pancreatitis, transfusion (TRALI), trauma (pulmonary contusion).",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-burns-26",
    type: "question",
    question: "What is carbon monoxide (CO) poisoning treatment in burn patients?",
    options: ["No treatment needed", "100% oxygen via non-rebreather mask (reduces CO half-life from 5-6 hours on room air to 60-90 minutes); consider hyperbaric oxygen therapy for COHb >25%, loss of consciousness, cardiac ischemia, or pregnancy", "Only oxygen at low flow rates", "CO poisoning resolves without treatment"],
    correctIndex: 1,
    answer: "CO poisoning treatment: (1) 100% O2 via NRB mask or via ETT if intubated — this is the PRIMARY treatment (displaces CO from hemoglobin by mass action). CO half-life: room air 5-6h → 100% O2 NRB 60-90 min → HBO 20-30 min. (2) HBO indications: COHb >25%, loss of consciousness, neurological symptoms, cardiac ischemia, pregnancy (fetal Hb binds CO with even higher affinity). (3) Continue 100% O2 until COHb <5% and symptoms resolved. (4) Serial COHb levels. Do NOT rely on pulse oximetry (reads COHb as OxyHb).",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-burns-27",
    type: "question",
    question: "What nutritional considerations are unique to burn patients?",
    options: ["Normal diet is sufficient", "Burns cause a hypermetabolic state requiring 25-40 kcal/kg/day with 1.5-2 g/kg/day protein; early enteral feeding (within 6-12 hours) is preferred; vitamin C, zinc, and vitamin A supplementation supports wound healing; the Curreri formula estimates caloric needs", "Fasting improves burn healing", "Only TPN should be used"],
    correctIndex: 1,
    answer: "Burn nutrition: (1) Hypermetabolic state: resting energy expenditure can increase 100-200% in large burns (>40% TBSA). (2) Caloric needs: 25-40 kcal/kg/day (Curreri formula: 25 × kg + 40 × %TBSA). (3) Protein: 1.5-2 g/kg/day (wound healing, immune function). (4) Route: enteral preferred (maintains gut integrity, reduces bacterial translocation) — start within 6-12 hours via NG/NJ tube. (5) Micronutrients: vitamin C (collagen synthesis), zinc (immune function, wound healing), vitamin A (epithelialization), selenium. (6) Monitor: prealbumin trends (better marker than albumin).",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-se-24",
    type: "question",
    question: "What seizure precautions should the nurse implement?",
    options: ["Restrain the patient", "Padded side rails up, suction at bedside, oxygen at bedside, IV access maintained, oral airway available, bed in lowest position, remove sharp/dangerous objects from immediate area, document seizure characteristics (onset, progression, duration, postictal state)", "Only call for help", "No precautions are necessary"],
    correctIndex: 1,
    answer: "Seizure precautions: (1) Environmental: bed lowest position, padded side rails (or lower rails with mat on floor), remove sharp objects, suction at bedside, oxygen and bag-valve-mask available, oral airway (do NOT force into mouth during seizure). (2) Clinical: maintain IV access, have rescue medications accessible (lorazepam, midazolam), continuous SpO2 monitoring. (3) During seizure: turn to side (prevent aspiration), loosen restrictive clothing, DO NOT restrain or put objects in mouth, time the seizure, observe and document: where seizure started, progression, type of movements, incontinence, eye deviation, duration, postictal behavior.",
    category: "Shock & Emergency",
    difficulty: 1
  },
  {
    id: "rn-shock-tbi-26",
    type: "question",
    question: "What is the Cushing response and what does it indicate?",
    options: ["A normal stress response", "Cushing response (hypertension, bradycardia, irregular respirations) is a brainstem reflex to critically elevated ICP — the body raises systemic BP to maintain cerebral perfusion against rising ICP; it is a LATE sign of impending herniation", "An allergic reaction", "A sign of dehydration"],
    correctIndex: 1,
    answer: "Cushing response physiology: (1) Rising ICP compresses cerebral vasculature → brain detects ischemia, (2) Vasomotor center triggers massive sympathetic discharge → systemic hypertension (attempts to push blood through compressed cerebral vessels), (3) Baroreceptors detect hypertension → parasympathetic response → bradycardia, (4) Brainstem compression → irregular respirations (Cheyne-Stokes, apneustic, ataxic breathing). This is a LAST-DITCH compensatory mechanism — by the time Cushing response appears, herniation is often imminent or occurring. The nurse should recognize and report EARLIER signs of rising ICP.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-hemo-32",
    type: "question",
    question: "What is the phlebostatic axis and why is it important in hemodynamic monitoring?",
    options: ["A type of vascular access", "The phlebostatic axis (4th intercostal space, mid-axillary line) is the reference point for zeroing hemodynamic transducers; it approximates the level of the right atrium and ensures accurate pressure readings — incorrect leveling introduces measurement error", "A cardiac valve location", "Only used for CVP measurement"],
    correctIndex: 1,
    answer: "Phlebostatic axis: intersection of the 4th ICS and mid-axillary line, approximating the right atrium. All hemodynamic pressure transducers (arterial, CVP, PA) must be zeroed and leveled to this point. Errors: transducer too LOW → falsely elevated readings (hydrostatic pressure adds to actual pressure). Transducer too HIGH → falsely low readings. For every 1 inch of height difference, there is ~2 mmHg error. Nursing: re-level with every position change, mark the phlebostatic axis on the patient's chest, zero transducer at the beginning of each shift and whenever readings seem inconsistent.",
    category: "Shock & Emergency",
    difficulty: 2
  },
  {
    id: "rn-shock-hemo-33",
    type: "question",
    question: "What is the normal PA catheter waveform progression during insertion?",
    options: ["All waveforms look the same", "RA (low pressure, a/c/v waves) → RV (higher systolic with rapid upstroke, diastolic near 0) → PA (similar systolic to RV but diastolic does not return to 0, dicrotic notch present) → PAWP (low pressure, a/v waves similar to RA)", "No waveform changes occur", "Only one waveform is seen"],
    correctIndex: 1,
    answer: "PA catheter waveform progression: (1) RA: low pressure (0-8 mmHg), a wave (atrial contraction), c wave (tricuspid closure), v wave (atrial filling). (2) RV: sudden increase in systolic pressure (15-30 mmHg), diastolic drops to 0-5 mmHg. (3) PA: systolic similar to RV (15-30 mmHg), diastolic DOES NOT return to 0 (8-15 mmHg) — dicrotic notch (pulmonic valve closure) distinguishes PA from RV. (4) PAWP: balloon inflation → low-pressure tracing (8-12 mmHg), a and v waves similar to RA. The nurse must recognize each waveform to confirm catheter position and identify complications (migration, spontaneous wedge).",
    category: "Shock & Emergency",
    difficulty: 3
  }
];
