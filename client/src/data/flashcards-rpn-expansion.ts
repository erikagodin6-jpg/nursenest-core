import type { FlashcardData } from "./flashcards-rpn";

export const rpnExpansionFlashcards: FlashcardData[] = [
  // ============================================================
  // RPN EXPANDED — MEDICATION ADMINISTRATION (30 cards)
  // ============================================================
  {
    id: "rpn-exp-med-q1",
    type: "question",
    question: "A nurse is preparing to administer insulin glargine (Lantus) to a diabetic patient. When should this medication be given?",
    options: ["30 minutes before the largest meal", "At the same time every day, regardless of meals", "Only when blood glucose exceeds 200 mg/dL", "Mixed with regular insulin in the same syringe"],
    correctIndex: 1,
    answer: "Insulin glargine (Lantus) is a long-acting basal insulin given once daily at the same time each day. It provides a relatively constant level of insulin over 24 hours with no pronounced peak. It should NEVER be mixed with other insulins in the same syringe as this alters its absorption profile.",
    category: "Pharmacology",
    difficulty: 2,
    clinicalPearl: "Insulin types by onset: Rapid-acting (lispro/aspart/glulisine) = 15 min onset; Short-acting (regular) = 30 min onset; Intermediate (NPH) = 1-2 hr onset, can be mixed with regular; Long-acting (glargine/detemir/degludec) = 1-2 hr onset, 24hr duration, CLEAR solution, NEVER mix."
  },
  {
    id: "rpn-exp-med-q2",
    type: "question",
    question: "A patient is receiving IV vancomycin. Which lab value must be monitored to prevent toxicity?",
    options: ["Serum potassium", "Vancomycin trough level", "Serum sodium", "Hemoglobin A1c"],
    correctIndex: 1,
    answer: "Vancomycin trough levels are monitored to maintain therapeutic range (typically AUC/MIC-guided dosing targeting AUC 400-600 for serious MRSA infections, or trough 15-20 mcg/mL in traditional monitoring). Supratherapeutic levels increase risk of nephrotoxicity and ototoxicity. Trough levels are drawn 30 minutes before the next dose.",
    category: "Pharmacology",
    difficulty: 2,
    clinicalPearl: "Vancomycin pearls: Red Man Syndrome (histamine-mediated flushing/rash) occurs with rapid infusion — slow the rate, do NOT stop the drug. It is NOT an allergy. Monitor SCr and vancomycin levels. Concurrent nephrotoxins (aminoglycosides, NSAIDs) increase renal injury risk."
  },
  {
    id: "rpn-exp-med-q3",
    type: "question",
    question: "A nurse is administering digoxin to a patient. What assessment must be performed BEFORE administration?",
    options: ["Check blood pressure", "Check apical pulse for one full minute", "Assess oxygen saturation", "Check capillary refill time"],
    correctIndex: 1,
    answer: "Before administering digoxin, check the apical pulse for one full minute. Hold the medication and notify the provider if HR <60 bpm in adults or <70 bpm in children. Digoxin toxicity signs include bradycardia, nausea/vomiting, visual changes (yellow-green halos), and cardiac dysrhythmias.",
    category: "Pharmacology",
    difficulty: 1,
    clinicalPearl: "Digoxin toxicity is potentiated by hypokalemia — always check potassium before giving digoxin. Therapeutic range: 0.5-2.0 ng/mL (narrow therapeutic index). Antidote: Digoxin-specific antibody fragments (Digibind/DigiFab). Avoid concurrent use with amiodarone, verapamil, and quinidine (increase dig levels)."
  },
  {
    id: "rpn-exp-med-q4",
    type: "question",
    question: "A patient receiving heparin infusion has an aPTT result of 120 seconds (therapeutic range 60-80). What is the priority nursing action?",
    options: ["Continue the infusion at the current rate", "Stop the heparin infusion and notify the provider", "Administer vitamin K", "Increase IV fluids"],
    correctIndex: 1,
    answer: "An aPTT of 120 seconds is supratherapeutic (above the target range), indicating excessive anticoagulation and increased bleeding risk. The nurse should stop the heparin infusion immediately and notify the provider. Protamine sulfate is the antidote for heparin. Vitamin K is the antidote for warfarin, not heparin.",
    category: "Pharmacology",
    difficulty: 2,
    clinicalPearl: "Anticoagulant monitoring and antidotes: Heparin → aPTT → antidote: protamine sulfate; Warfarin → PT/INR → antidote: vitamin K (oral or IV) + FFP/PCC for emergent reversal; Dabigatran → idarucizumab (Praxbind); Rivaroxaban/Apixaban → andexanet alfa (Andexxa)."
  },
  // ============================================================
  // RPN EXPANDED — SAFETY & INFECTION CONTROL (25 cards)
  // ============================================================
  {
    id: "rpn-exp-safety-q1",
    type: "question",
    question: "A patient with active pulmonary tuberculosis requires isolation. Which type of precautions should be implemented?",
    options: ["Standard precautions only", "Contact precautions", "Droplet precautions", "Airborne precautions with N95 respirator"],
    correctIndex: 3,
    answer: "Active pulmonary TB requires airborne precautions: negative-pressure room, N95 respirator (or PAPR) for healthcare workers, and surgical mask on the patient during transport. TB is transmitted via aerosolized droplet nuclei (<5 microns) that remain suspended in air for hours.",
    category: "Infection Control",
    difficulty: 2,
    clinicalPearl: "Airborne precautions (My Chicken Hez TB): Measles, Chickenpox/Varicella, Herpes zoster (disseminated), TB. Droplet precautions: Influenza, Pertussis, Mumps, Rubella, Meningococcal. Contact precautions: MRSA, VRE, C. diff, scabies. C. diff requires soap and water handwashing (alcohol gel is ineffective against spores)."
  },
  {
    id: "rpn-exp-safety-q2",
    type: "question",
    question: "A nurse sustains a needlestick injury from a patient with unknown HIV status. What is the priority action?",
    options: ["Apply a tourniquet proximal to the wound", "Wash the site with soap and water immediately", "Wait for source patient testing before any action", "Apply hydrogen peroxide to the wound"],
    correctIndex: 1,
    answer: "Immediately wash the needlestick site with soap and water (do not squeeze or milk the wound). Report the exposure per facility protocol. Source patient testing should be performed. If high-risk exposure, post-exposure prophylaxis (PEP) with antiretrovirals should be initiated within 72 hours (ideally within 2 hours). Standard 28-day regimen: tenofovir/emtricitabine + raltegravir or dolutegravir.",
    category: "Safety",
    difficulty: 2,
    clinicalPearl: "Post-exposure prophylaxis (PEP) for HIV: Most effective when started within 2 hours of exposure. 3-drug regimen for 28 days. Follow-up testing at 6 weeks, 12 weeks, and 6 months. Mucous membrane exposure (splash to eyes/mouth): flush with water or saline immediately."
  },
  {
    id: "rpn-exp-safety-q3",
    type: "question",
    question: "A patient develops a stage 3 pressure injury over the sacrum. Which finding is characteristic of this stage?",
    options: ["Non-blanchable erythema of intact skin", "Partial-thickness loss with exposed dermis", "Full-thickness loss with visible subcutaneous fat", "Full-thickness loss with exposed bone or tendon"],
    correctIndex: 2,
    answer: "Stage 3 pressure injury: Full-thickness skin loss with visible adipose (fat) tissue. Bone, tendon, and muscle are NOT visible. Undermining and tunneling may be present. Stage 4 involves exposed bone, muscle, or tendon. Unstageable pressure injuries have full-thickness loss obscured by slough or eschar.",
    category: "Wound Care",
    difficulty: 2,
    clinicalPearl: "Pressure injury staging: Stage 1 = non-blanchable erythema, intact skin; Stage 2 = partial-thickness, blister, or shallow crater; Stage 3 = full-thickness, subcutaneous fat visible; Stage 4 = full-thickness, bone/tendon/muscle exposed; Unstageable = base obscured by slough/eschar; DTPI = deep tissue pressure injury (purple/maroon discoloration)."
  },
  // ============================================================
  // RPN EXPANDED — MENTAL HEALTH (20 cards)
  // ============================================================
  {
    id: "rpn-exp-mh-q1",
    type: "question",
    question: "A patient admitted for alcohol withdrawal develops tremors, diaphoresis, tachycardia, and agitation 24 hours after last drink. Which medication class is first-line for alcohol withdrawal management?",
    options: ["Antipsychotics", "Benzodiazepines", "Opioids", "Anticonvulsants"],
    correctIndex: 1,
    answer: "Benzodiazepines (lorazepam, chlordiazepoxide, diazepam) are first-line for alcohol withdrawal syndrome (AWS). They enhance GABA activity to compensate for the relative GABA deficit and glutamate excess that occurs when alcohol is withdrawn. CIWA-Ar scale guides symptom-triggered dosing. Severe untreated withdrawal can progress to delirium tremens (48-96 hours) with seizures, hallucinations, and autonomic instability.",
    category: "Mental Health",
    difficulty: 2,
    clinicalPearl: "Alcohol withdrawal timeline: 6-12h = tremors, anxiety, GI symptoms; 12-24h = visual/tactile hallucinations; 24-48h = withdrawal seizures (grand mal); 48-96h = delirium tremens (5-15% mortality if untreated). CIWA-Ar score ≥8 triggers benzodiazepine dosing. Thiamine (B1) 100 mg IV/IM BEFORE glucose to prevent Wernicke's encephalopathy."
  },
  {
    id: "rpn-exp-mh-q2",
    type: "question",
    question: "A patient with schizophrenia states: 'The CIA planted microchips in my brain to control my thoughts.' What type of delusion is this?",
    options: ["Grandiose delusion", "Persecutory delusion with thought insertion", "Erotomanic delusion", "Somatic delusion"],
    correctIndex: 1,
    answer: "This combines a persecutory delusion (belief of being targeted/harassed by an external entity) with thought insertion (belief that thoughts are being placed into one's mind by an outside force). Thought insertion is a Schneiderian first-rank symptom of schizophrenia. The therapeutic approach is to not argue with the delusion but acknowledge the patient's distress.",
    category: "Mental Health",
    difficulty: 2,
    clinicalPearl: "Schneider's first-rank symptoms of schizophrenia: Thought insertion, thought withdrawal, thought broadcasting, auditory hallucinations (commenting/conversing voices), passivity experiences (delusions of control), and delusional perception. These are highly specific for schizophrenia but not required for diagnosis."
  },
  {
    id: "rpn-exp-mh-q3",
    type: "question",
    question: "A nurse is caring for a suicidal patient. Which statement by the patient indicates the HIGHEST immediate risk?",
    options: ["'Sometimes I feel like life isn't worth living'", "'I have my grandfather's gun at home and I've written a goodbye letter'", "'I think about death when I'm really stressed'", "'I wonder if my family would be better off without me'"],
    correctIndex: 1,
    answer: "This statement indicates highest risk because it includes a specific plan (gun — highly lethal method), access to means (has the weapon), and preparatory behavior (goodbye letter). Risk assessment must evaluate: Ideation (passive vs active), Plan (specificity), Means (access to lethal method), Intent (determination), and Protective factors. This patient requires 1:1 observation, means restriction, and psychiatric evaluation.",
    category: "Mental Health",
    difficulty: 2,
    clinicalPearl: "Suicide risk mnemonic 'IS PATH WARM': Ideation, Substance abuse, Purposelessness, Anxiety/agitation, Trapped feeling, Hopelessness, Withdrawal, Anger, Recklessness, Mood changes. Highest-lethality methods: firearms, hanging, jumping. Always ask directly about suicidal ideation — asking does NOT increase risk."
  },
  // ============================================================
  // RPN EXPANDED — MATERNAL-NEWBORN (20 cards)
  // ============================================================
  {
    id: "rpn-exp-mat-q1",
    type: "question",
    question: "A newborn has APGAR scores of 4 at 1 minute and 7 at 5 minutes. What do these scores indicate?",
    options: ["Normal transition, no intervention needed", "Moderately depressed at birth with improving status", "Severely depressed requiring immediate CPR", "Expected findings for a premature infant"],
    correctIndex: 1,
    answer: "APGAR of 4 at 1 minute indicates moderate depression requiring active intervention (stimulation, suctioning, oxygen, possibly PPV). Improvement to 7 at 5 minutes indicates a positive response to resuscitation. APGAR 7-10 = reassuring; 4-6 = moderately depressed; 0-3 = severely depressed. The 5-minute score is more prognostically significant than the 1-minute score.",
    category: "Maternal-Newborn",
    difficulty: 1,
    clinicalPearl: "APGAR scoring (0-2 points each): Appearance (color), Pulse (heart rate), Grimace (reflex irritability), Activity (muscle tone), Respiration. Heart rate is the most critical component. If HR <100 after drying/stimulation → PPV; if HR <60 after 30 seconds of PPV → chest compressions (3:1 ratio). APGAR is not used to guide resuscitation decisions — it is recorded while resuscitation is already underway."
  },
  {
    id: "rpn-exp-mat-q2",
    type: "question",
    question: "A laboring patient at 38 weeks has a fetal heart rate tracing showing late decelerations with minimal variability. What is the priority nursing action?",
    options: ["Continue to monitor", "Position the patient on her left side and administer oxygen", "Prepare for immediate cesarean delivery", "Increase the oxytocin infusion rate"],
    correctIndex: 1,
    answer: "Late decelerations (onset at peak of contraction, nadir after peak) indicate uteroplacental insufficiency. Combined with minimal variability, this is a Category III tracing requiring intrauterine resuscitation: left lateral position (relieves aortocaval compression), oxygen via non-rebreather, IV fluid bolus, STOP oxytocin if infusing, and notify the provider. If pattern persists, emergent delivery may be needed.",
    category: "Maternal-Newborn",
    difficulty: 2,
    clinicalPearl: "FHR deceleration types: Early = head compression (mirror image of contraction, benign); Variable = cord compression (abrupt onset, V-shaped); Late = uteroplacental insufficiency (uniform shape, after contraction peak, concerning). Category III tracings require immediate intervention. Mnemonic: VEAL CHOP: Variable-Cord, Early-Head, Accelerations-OK, Late-Placental."
  },
  {
    id: "rpn-exp-mat-q3",
    type: "question",
    question: "A postpartum patient 2 hours after vaginal delivery has heavy lochia rubra with a boggy uterus above the umbilicus. What is the priority intervention?",
    options: ["Apply an ice pack to the perineum", "Fundal massage", "Encourage ambulation", "Administer ibuprofen for pain"],
    correctIndex: 1,
    answer: "A boggy uterus is the #1 cause of postpartum hemorrhage (uterine atony accounts for 70-80% of PPH). Priority: vigorous fundal massage to stimulate uterine contraction. Support the lower uterine segment with one hand while massaging the fundus with the other. If massage is ineffective: oxytocin IV, methylergonovine IM, carboprost (Hemabate) IM, misoprostol PR.",
    category: "Maternal-Newborn",
    difficulty: 2,
    clinicalPearl: "PPH causes — 4 T's: Tone (atony — most common), Trauma (lacerations, hematoma), Tissue (retained placenta), Thrombin (coagulopathy). PPH is defined as cumulative blood loss ≥1000 mL or signs of hypovolemia. Risk factors for atony: overdistended uterus (macrosomia, polyhydramnios, multiples), prolonged labor, chorioamnionitis, magnesium sulfate use."
  },
  // ============================================================
  // RPN EXPANDED — FLUID & ELECTROLYTES (15 cards)
  // ============================================================
  {
    id: "rpn-exp-fe-q1",
    type: "question",
    question: "A patient's lab results show serum potassium of 6.2 mEq/L. Which ECG change should the nurse expect?",
    options: ["Flattened T waves", "Prolonged QT interval", "Tall, peaked T waves", "U waves"],
    correctIndex: 2,
    answer: "Hyperkalemia (K+ >5.0) produces characteristic tall, peaked (tented) T waves, the earliest ECG change. As K+ rises further: widened QRS, loss of P waves, sine wave pattern, and cardiac arrest (Vfib/asystole). Emergency treatment sequence: calcium gluconate (cardiac membrane stabilization), insulin + dextrose (intracellular shift), sodium bicarbonate, albuterol nebulizer, and kayexalate/patiromer (elimination).",
    category: "Fluid & Electrolytes",
    difficulty: 2,
    clinicalPearl: "Hyperkalemia emergency treatment mnemonic 'C BIG K Drop': Calcium gluconate (stabilize cardiac membrane), Bicarbonate (shift K+ intracellularly), Insulin + glucose (shift K+), Given albuterol (shift K+), Kayexalate/Patiromer/Lokelma (eliminate K+), Dialysis (eliminate K+ if refractory). Calcium gluconate does NOT lower K+ — it protects the heart."
  },
  {
    id: "rpn-exp-fe-q2",
    type: "question",
    question: "A patient on furosemide (Lasix) 40 mg daily presents with muscle weakness, leg cramps, and an irregular pulse. Serum potassium is 2.9 mEq/L. What is the appropriate intervention?",
    options: ["Administer IV potassium push", "Oral potassium chloride replacement and dietary counseling", "Discontinue furosemide immediately", "Administer calcium gluconate"],
    correctIndex: 1,
    answer: "Hypokalemia (K+ <3.5 mEq/L) from loop diuretic use is treated with potassium replacement. For K+ 2.5-3.5 without cardiac symptoms: oral KCl 40-80 mEq/day in divided doses. IV KCl is reserved for K+ <2.5 or symptomatic patients — never give IV KCl as a push (causes fatal cardiac arrest); max infusion rate 10-20 mEq/hour via peripheral IV. High-potassium foods: bananas, oranges, potatoes, spinach.",
    category: "Fluid & Electrolytes",
    difficulty: 2,
    clinicalPearl: "Critical potassium rules: NEVER push IV potassium (causes cardiac arrest). Max peripheral IV rate: 10-20 mEq/hr. Max central line rate: 40 mEq/hr with continuous cardiac monitoring. Always check magnesium — hypomagnesemia causes refractory hypokalemia (Mg must be replaced first). Loop diuretics waste both K+ and Mg2+."
  },
  {
    id: "rpn-exp-fe-q3",
    type: "question",
    question: "A patient with SIADH has a serum sodium of 118 mEq/L. What is the priority concern?",
    options: ["Hypervolemia", "Seizures from severe hyponatremia", "Metabolic acidosis", "Hyperthermia"],
    correctIndex: 1,
    answer: "Severe hyponatremia (Na+ <120 mEq/L) can cause cerebral edema leading to seizures, altered consciousness, and death. Treatment: fluid restriction (primary), hypertonic saline (3% NaCl) for severe/symptomatic cases. Correct Na+ slowly — no more than 8-10 mEq/L per 24 hours to prevent osmotic demyelination syndrome (central pontine myelinolysis).",
    category: "Fluid & Electrolytes",
    difficulty: 3,
    clinicalPearl: "SIADH vs. Diabetes Insipidus: SIADH = too much ADH → fluid retention, dilutional hyponatremia, concentrated urine; DI = too little ADH (central) or kidneys resist ADH (nephrogenic) → massive dilute urine, hypernatremia, dehydration. Treatment: SIADH = fluid restriction; Central DI = desmopressin (DDAVP); Nephrogenic DI = thiazide diuretics (paradoxical effect)."
  },
];
