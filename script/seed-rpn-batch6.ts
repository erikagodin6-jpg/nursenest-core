import pg from "pg";
import crypto from "crypto";
const Pool = pg.Pool;
const pool = new Pool({ connectionString: process.env.PROD_DATABASE_URL || process.env.DATABASE_URL });
function hash(s: string): string { return crypto.createHash("md5").update(s.toLowerCase().trim()).digest("hex"); }

interface Q {
  tier:string; exam:string; stem:string; options:string[]; correct:number; rationale:string;
  diff:number; bs:string; topic:string; cp:string; es:string; dr:Record<string,string>;
}

function q(e:string,bs:string,topic:string,d:number,stem:string,opts:string[],c:number,rat:string,cp:string,es:string,dr:Record<string,string>):Q {
  return {tier:"rpn",exam:e,stem,options:opts,correct:c,rationale:rat,diff:d,bs,topic,cp,es,dr};
}

const QS: Q[] = [
  // ===== FUNDAMENTALS OF NURSING (7 questions) =====
  q("REX-PN","Fundamentals","Fundamentals of Nursing",2,
    "The nurse is assessing a client's respiratory status. Which breath sound is considered normal over the trachea?",
    ["Vesicular","Bronchial","Bronchovesicular","Crackles"],1,
    "Bronchial breath sounds are loud, high-pitched, and hollow. They are normally heard over the trachea and larynx. Hearing bronchial sounds over peripheral lung fields suggests consolidation (e.g., pneumonia).",
    "Know the three normal breath sounds and where each is heard: vesicular (peripheral), bronchovesicular (mainstem bronchi), bronchial (trachea).",
    "Breath sound questions test location matching—eliminate any adventitious sounds first, then match normal sounds to anatomical areas.",
    {"0":"Vesicular sounds are soft, low-pitched, heard over peripheral lung fields, not the trachea.","2":"Bronchovesicular sounds are moderate pitch heard over the mainstem bronchi, not directly over the trachea.","3":"Crackles are adventitious (abnormal) sounds, not a normal finding anywhere."}),

  q("RPN-CAT","Fundamentals","Fundamentals of Nursing",3,
    "A client with a fever of 39.5°C is diaphoretic and tachycardic. Which nursing intervention is the priority?",
    ["Apply cooling blankets immediately","Administer prescribed antipyretics and increase fluid intake","Restrict all oral fluids","Encourage vigorous activity to promote circulation"],1,
    "Fever increases metabolic demand. Antipyretics lower the set point, and fluids replace losses from diaphoresis. Cooling blankets may cause shivering, which increases heat production.",
    "Fever management priorities: antipyretics first, fluids to replace losses, then supportive cooling measures. Shivering is counterproductive.",
    "Priority questions with fever: address the root cause (antipyretic) before external cooling.",
    {"0":"Cooling blankets can cause shivering, which paradoxically raises body temperature through muscle activity.","2":"Restricting fluids worsens dehydration from diaphoresis and increased insensible losses.","3":"Activity increases metabolic rate and heat production, worsening the fever."}),

  q("REX-PN","Fundamentals","Fundamentals of Nursing",2,
    "When measuring a client's blood pressure, the nurse places the stethoscope over which artery?",
    ["Radial artery","Brachial artery","Carotid artery","Popliteal artery"],1,
    "The brachial artery is used for auscultatory blood pressure measurement. The stethoscope is placed over the antecubital fossa where the brachial artery is most superficial.",
    "The brachial artery is the standard site for BP auscultation. The radial artery is used for pulse palpation.",
    "Blood pressure technique questions often test the correct artery and cuff placement—always brachial for standard arm BP.",
    {"0":"The radial artery is used for pulse assessment, not blood pressure auscultation.","2":"The carotid artery is used for pulse checks during CPR, not routine BP measurement.","3":"The popliteal artery is used for thigh BP measurement, not standard arm measurement."}),

  q("REX-PN","Fundamentals","Fundamentals of Nursing",1,
    "The nurse is preparing to administer oral medications. Which action is correct?",
    ["Crush enteric-coated tablets for easier swallowing","Verify the client's identity using two identifiers","Administer all medications at the same time regardless of food interactions","Leave medications at the bedside if the client is sleeping"],1,
    "Two-identifier verification (name and date of birth or medical record number) prevents medication errors. This is a Joint Commission National Patient Safety Goal.",
    "The five rights of medication administration always apply: right patient, drug, dose, route, time.",
    "Medication safety questions almost always have an option about patient identification—this is nearly always correct.",
    {"0":"Enteric-coated tablets must not be crushed; the coating protects the medication from gastric acid or protects the stomach from the drug.","2":"Some medications must be given with food, on empty stomach, or separated from other drugs for proper absorption.","3":"Leaving medications at bedside violates safety protocols; the nurse must witness ingestion."}),

  q("RPN-CAT","Fundamentals","Fundamentals of Nursing",3,
    "A nurse discovers that a medication error has occurred but the client is currently asymptomatic. The nurse should first:",
    ["Wait to see if symptoms develop before reporting","Assess the client, notify the provider, and complete an incident report","Document only in the nursing notes","Administer an antidote immediately"],1,
    "All medication errors must be reported regardless of client harm. Assessment, provider notification, and incident reporting ensure client safety and system improvement.",
    "Medication errors require three actions: assess the client, notify the provider, and file an incident report—even if no harm occurred.",
    "Error reporting questions: never wait, always report immediately through proper channels regardless of apparent harm.",
    {"0":"Waiting to report delays potentially necessary intervention and violates professional standards.","2":"Nursing notes alone are insufficient; incident reports are separate quality improvement documents required by facility policy.","3":"An antidote is only given if clinically indicated based on the specific medication and assessment; blind administration could cause harm."}),

  q("REX-PN","Fundamentals","Fundamentals of Nursing",2,
    "Which position is most appropriate for a client receiving a nasogastric tube feeding?",
    ["Supine position","High Fowler's position (30-45 degrees)","Left lateral Sims' position","Trendelenburg position"],1,
    "Elevating the head of bed to 30-45 degrees during and for 30-60 minutes after tube feeding prevents aspiration by using gravity to keep gastric contents in the stomach.",
    "HOB elevation during and after tube feedings is the most important aspiration prevention measure.",
    "Tube feeding position questions: 30-45 degrees is the standard—look for HOB elevation as the correct answer.",
    {"0":"Supine position increases aspiration risk as gastric contents can easily reflux into the esophagus and airway.","2":"Left lateral Sims' position does not provide adequate gravity protection against aspiration during feeding.","3":"Trendelenburg position elevates the feet above the head, greatly increasing aspiration risk."}),

  q("REX-PN","Fundamentals","Fundamentals of Nursing",4,
    "A client with a central venous access device develops sudden respiratory distress, chest pain, and unilateral absence of breath sounds. The nurse suspects:",
    ["Pulmonary embolism","Pneumothorax from catheter insertion complication","Myocardial infarction","Anxiety attack"],1,
    "Pneumothorax is a known complication of central line insertion, especially subclavian approach. Sudden respiratory distress with unilateral absent breath sounds is the classic presentation requiring immediate chest X-ray and possible chest tube.",
    "Central line complications include pneumothorax (subclavian), air embolism, infection, and thrombosis. Know the presenting signs of each.",
    "When a question pairs a central line with sudden respiratory distress and unilateral findings, think pneumothorax first.",
    {"0":"PE typically presents with tachypnea, pleuritic chest pain, and does not cause unilateral absence of breath sounds.","2":"MI presents with chest pain, ECG changes, and hemodynamic instability but not unilateral breath sound changes.","3":"Anxiety attacks do not cause objective findings like absent breath sounds on auscultation."}),

  // ===== PHARMACOLOGY (8 questions) =====
  q("REX-PN","Pharmacology","Pharmacology",2,
    "A client is prescribed amoxicillin for a respiratory infection. Which question should the nurse ask before administering?",
    ["Do you have a history of liver disease?","Do you have any allergies to penicillin?","Are you currently taking vitamins?","Have you ever had a blood transfusion?"],1,
    "Amoxicillin is a penicillin-type antibiotic. Penicillin allergy assessment is essential before administration because reactions range from rash to fatal anaphylaxis.",
    "Always ask about penicillin allergy before giving any penicillin-class antibiotic (amoxicillin, ampicillin, piperacillin).",
    "Allergy assessment before antibiotic administration is a common safety question—penicillin allergy is always the key concern for beta-lactams.",
    {"0":"While liver disease may affect drug metabolism, the priority question for amoxicillin is allergy status.","2":"Vitamin interactions with amoxicillin are minimal and not a priority assessment.","3":"Blood transfusion history is not relevant to antibiotic administration."}),

  q("REX-PN","Pharmacology","Pharmacology",3,
    "A client receiving an aminoglycoside antibiotic reports ringing in the ears. The nurse recognizes this as a sign of:",
    ["Therapeutic drug level","Ototoxicity requiring immediate provider notification","Expected side effect that will resolve","Allergic reaction"],1,
    "Tinnitus (ringing in the ears) is an early sign of ototoxicity from aminoglycosides. Continued exposure can cause permanent hearing loss. The nurse should hold the medication and notify the provider.",
    "Aminoglycoside toxicities: ototoxicity (hearing/balance) and nephrotoxicity (kidney). Monitor trough and peak levels.",
    "Tinnitus + aminoglycoside = ototoxicity. Always hold the drug and notify the provider—this is not an expected side effect.",
    {"0":"Tinnitus does not indicate a therapeutic level; it indicates toxicity.","2":"Ototoxicity from aminoglycosides can cause permanent damage and should never be dismissed as expected.","3":"Allergic reactions present with rash, urticaria, or anaphylaxis, not tinnitus."}),

  q("REX-PN","Pharmacology","Pharmacology",1,
    "The nurse is teaching a client about taking oral iron supplements. Which instruction is correct?",
    ["Take with milk to reduce stomach upset","Take on an empty stomach with orange juice","Expect light-colored stools","Chew the tablet for faster absorption"],1,
    "Iron is best absorbed on an empty stomach with vitamin C (orange juice enhances absorption). Stools will turn dark/black, not light. Iron tablets should be swallowed whole, not chewed.",
    "Iron + vitamin C = enhanced absorption. Dark stools are normal with iron therapy.",
    "Iron supplement questions: look for vitamin C pairing and empty stomach for correct technique.",
    {"0":"Milk and calcium-containing foods reduce iron absorption by binding with iron.","2":"Iron supplements cause dark or black stools, not light-colored stools.","3":"Iron tablets should not be chewed; liquid forms should be taken through a straw to prevent tooth staining."}),

  q("RPN-CAT","Pharmacology","Pharmacology",3,
    "A client on lithium therapy has a serum level of 2.0 mEq/L. The nurse should:",
    ["Administer the next scheduled dose","Hold lithium and notify the provider as this level indicates toxicity","Increase fluid intake and continue lithium","Reduce the dose by half"],1,
    "The therapeutic lithium level is 0.6-1.2 mEq/L. A level of 2.0 mEq/L is toxic and can cause seizures, renal failure, and cardiac arrhythmias. Hold the drug immediately and notify the provider.",
    "Therapeutic lithium: 0.6-1.2 mEq/L. Toxic: >1.5 mEq/L. Lethal: >2.5 mEq/L. Dehydration and sodium depletion increase lithium levels.",
    "Lithium level questions: know the therapeutic range. Any level above 1.5 requires holding the medication and immediate notification.",
    {"0":"Administering lithium at a toxic level could cause fatal cardiac arrhythmias, seizures, or coma.","2":"While hydration is important, the priority at a toxic level is to stop the drug and notify the provider immediately.","3":"Dose reduction alone is insufficient for an actively toxic level; the drug must be held and the provider contacted."}),

  q("REX-PN","Pharmacology","Pharmacology",2,
    "The nurse teaches a client taking a thiazide diuretic to increase dietary intake of:",
    ["Sodium","Potassium-rich foods like bananas and oranges","Calcium supplements","Iron-rich foods"],1,
    "Thiazide diuretics cause potassium loss. Potassium-rich foods (bananas, oranges, potatoes, spinach) help prevent hypokalemia, which can cause cardiac arrhythmias.",
    "Thiazides and loop diuretics waste potassium. Potassium-sparing diuretics (spironolactone) do the opposite.",
    "Diuretic + dietary teaching = almost always about potassium replacement for thiazides and loop diuretics.",
    {"0":"Thiazide diuretics promote sodium excretion; increasing sodium would counteract the therapeutic effect.","2":"Thiazides can actually increase calcium retention; calcium supplementation is not the priority.","3":"Iron intake is unrelated to thiazide diuretic therapy."}),

  q("RPN-CAT","Pharmacology","Pharmacology",4,
    "A client receiving IV vancomycin develops flushing of the face and neck, hypotension, and pruritus during the infusion. The nurse should:",
    ["Stop the infusion permanently and document an allergy","Slow the infusion rate, notify the provider, and administer diphenhydramine as ordered","Continue the infusion as this is expected","Administer epinephrine immediately"],1,
    "This describes Red Man Syndrome from rapid vancomycin infusion (histamine release, not true allergy). Slowing the rate and premedicating with antihistamines usually resolves it. The drug does not need to be permanently discontinued.",
    "Red Man Syndrome is rate-related, not a true allergy. Slow the infusion and premedicate—do not label as allergy.",
    "Distinguish Red Man Syndrome (rate-dependent histamine release) from true anaphylaxis (which would require stopping the drug and epinephrine).",
    {"0":"Red Man Syndrome is not a true allergy; it is a rate-dependent histamine reaction. Labeling it as an allergy inappropriately restricts future treatment options.","2":"These symptoms require intervention; continuing without changes could worsen hypotension.","3":"Epinephrine is for anaphylaxis, not Red Man Syndrome. The symptoms respond to slowing the infusion rate."}),

  q("REX-PN","Pharmacology","Pharmacology",3,
    "A client prescribed metoprolol asks about the purpose of this medication. The nurse explains that it:",
    ["Increases heart rate to improve cardiac output","Slows heart rate and reduces blood pressure by blocking beta-adrenergic receptors","Dissolves blood clots in the arteries","Replaces missing hormones"],1,
    "Metoprolol is a cardioselective beta-1 blocker that decreases heart rate, contractility, and blood pressure. Used for hypertension, angina, heart failure, and post-MI protection.",
    "Beta-blockers end in '-olol' and slow the heart. Always check HR before administration (hold if <60 bpm).",
    "Drug class identification: '-olol' suffix = beta-blocker. Know the action (slows HR, lowers BP) and key nursing assessments.",
    {"0":"Beta-blockers decrease heart rate, not increase it. Increasing HR would be the action of a beta-agonist.","2":"Thrombolytics (e.g., alteplase) dissolve clots, not beta-blockers.","3":"Hormone replacement therapy involves different drug classes entirely."}),

  q("REX-PN","Pharmacology","Pharmacology",4,
    "A client is receiving both heparin and warfarin simultaneously. The nurse understands that this overlap is necessary because:",
    ["Warfarin takes 3-5 days to reach therapeutic effect while heparin provides immediate anticoagulation","Both drugs work identically and double the effect","Heparin treats the clot while warfarin prevents new clots","The combination prevents all future clotting"],1,
    "Warfarin inhibits vitamin K-dependent clotting factor synthesis, which takes 3-5 days to reach therapeutic effect (INR 2-3). Heparin provides immediate anticoagulation via antithrombin III during this overlap period.",
    "Heparin-warfarin bridge: heparin for immediate effect (monitor aPTT), warfarin for long-term (monitor INR). Overlap until INR therapeutic for 24-48 hours.",
    "Bridge therapy questions test understanding of onset differences: heparin = immediate, warfarin = delayed. The overlap prevents a dangerous gap.",
    {"0":"This is the correct answer.","2":"Both drugs prevent clot formation/extension; neither directly 'treats' an existing clot (that requires thrombolytics).","3":"No combination can prevent all future clotting; the goal is therapeutic anticoagulation within a safe range."}),

  // ===== CARDIOVASCULAR (7 questions) =====
  q("REX-PN","Cardiovascular","Cardiovascular",2,
    "The nurse is teaching a client about heart-healthy lifestyle modifications. Which dietary recommendation is most appropriate?",
    ["Increase saturated fat intake for energy","Follow a diet rich in fruits, vegetables, whole grains, and lean proteins","Eliminate all fats from the diet","Increase sodium intake to maintain blood pressure"],1,
    "The DASH diet and Mediterranean diet are recommended for cardiovascular health. They emphasize fruits, vegetables, whole grains, lean proteins, and healthy fats while limiting saturated fats, sodium, and processed foods.",
    "Heart-healthy diet = DASH diet principles. Moderate fat (healthy fats), not fat elimination.",
    "Diet questions for cardiac clients: look for balanced, moderate approaches rather than extreme restrictions.",
    {"0":"Saturated fat increases LDL cholesterol and cardiovascular risk.","2":"Eliminating all fats is unhealthy; healthy fats (omega-3, olive oil) are cardioprotective.","3":"Excess sodium causes fluid retention and hypertension, worsening cardiovascular disease."}),

  q("REX-PN","Cardiovascular","Cardiovascular",3,
    "A client in heart failure is prescribed furosemide. The nurse should monitor for which electrolyte imbalance?",
    ["Hyperkalemia","Hypokalemia and hyponatremia","Hypercalcemia","Hypermagnesemia"],1,
    "Furosemide (loop diuretic) causes excretion of potassium, sodium, and magnesium. Hypokalemia can lead to dangerous cardiac arrhythmias, especially if the client is also taking digoxin.",
    "Loop diuretics (furosemide, bumetanide) lose: potassium, sodium, calcium, magnesium. Remember 'loops lose everything.'",
    "Furosemide + electrolyte monitoring = hypokalemia is the priority concern, especially with concurrent digoxin therapy.",
    {"0":"Furosemide causes potassium loss (hypokalemia), not retention (hyperkalemia).","2":"Loop diuretics increase calcium excretion (may cause hypocalcemia), not hypercalcemia.","3":"Furosemide causes magnesium wasting (hypomagnesemia), not hypermagnesemia."}),

  q("RPN-CAT","Cardiovascular","Cardiovascular",4,
    "A client with an acute ST-elevation myocardial infarction arrives at the emergency department. The nurse anticipates which time-sensitive intervention?",
    ["Schedule a stress test for the following week","Prepare for emergent percutaneous coronary intervention within 90 minutes","Administer oral aspirin and discharge with follow-up","Start a beta-blocker infusion as the sole treatment"],1,
    "STEMI requires emergent PCI (door-to-balloon time ≤90 minutes) or thrombolytic therapy (within 30 minutes if PCI unavailable). Time is muscle—every minute of delay increases myocardial damage.",
    "STEMI = time-sensitive emergency. Door-to-balloon ≤90 min for PCI. MONA (Morphine, Oxygen if needed, Nitroglycerin, Aspirin) is initial management.",
    "STEMI questions always emphasize urgency and time-sensitive reperfusion. Look for the intervention that restores blood flow fastest.",
    {"0":"A stress test is inappropriate during an acute STEMI; the diagnosis is already confirmed by ECG.","2":"Aspirin is part of initial management but discharge would be negligent during an active STEMI.","3":"Beta-blockers are part of STEMI management but are not the primary reperfusion strategy."}),

  q("REX-PN","Cardiovascular","Cardiovascular",1,
    "The nurse is monitoring a client's telemetry and observes a regular rhythm with a heart rate of 72 bpm and consistent P waves before each QRS complex. This rhythm is:",
    ["Atrial fibrillation","Normal sinus rhythm","Ventricular tachycardia","Third-degree heart block"],1,
    "Normal sinus rhythm has a regular rate of 60-100 bpm, consistent P waves before each QRS complex, and a regular P-R interval. This is the expected normal cardiac rhythm.",
    "Normal sinus rhythm: rate 60-100, regular rhythm, P before every QRS, consistent PR interval.",
    "Rhythm identification: check rate, regularity, P waves, and PR interval systematically to identify the rhythm.",
    {"0":"Atrial fibrillation has an irregularly irregular rhythm with no identifiable P waves.","2":"Ventricular tachycardia has wide QRS complexes without preceding P waves and a rate typically >150 bpm.","3":"Third-degree heart block has complete AV dissociation with P waves and QRS complexes occurring independently."}),

  q("REX-PN","Cardiovascular","Cardiovascular",3,
    "A client with peripheral arterial disease reports intermittent claudication. The nurse explains that this pain occurs during:",
    ["Rest, especially at night","Walking or exercise and is relieved by rest","Elevation of the extremities","Deep breathing"],1,
    "Intermittent claudication is cramping pain in the calves during activity caused by inadequate arterial blood flow to exercising muscles. It resolves with rest when oxygen demand decreases.",
    "PAD pain (claudication) = activity-related, relieved by rest. Venous disease pain = relieved by elevation.",
    "Distinguish arterial vs venous disease: arterial = pain with activity (claudication), cool pale skin, diminished pulses. Venous = edema, brown skin, pain relieved by elevation.",
    {"0":"Rest pain in PAD indicates severe, advanced disease (critical limb ischemia), not intermittent claudication.","2":"Elevation worsens arterial insufficiency symptoms by further reducing blood flow against gravity.","3":"Deep breathing is unrelated to peripheral arterial disease symptoms."}),

  q("RPN-CAT","Cardiovascular","Cardiovascular",3,
    "A client with a new diagnosis of atrial fibrillation is started on an anticoagulant. The nurse teaches that the primary reason for anticoagulation is to:",
    ["Convert the rhythm back to normal sinus rhythm","Prevent stroke by reducing the risk of thrombus formation in the atria","Slow the heart rate to a normal range","Reduce blood pressure"],1,
    "Atrial fibrillation causes blood stasis in the atria, promoting thrombus formation. Emboli can travel to the brain, causing stroke. Anticoagulation reduces stroke risk by 60-70%.",
    "A-fib + anticoagulation = stroke prevention. Rate control (beta-blockers, CCBs) manages heart rate separately.",
    "A-fib anticoagulation questions: the purpose is always stroke prevention, not rhythm or rate control.",
    {"0":"Anticoagulants do not convert cardiac rhythms. Antiarrhythmics or cardioversion are used for rhythm control.","2":"Rate control is achieved with beta-blockers or calcium channel blockers, not anticoagulants.","3":"Anticoagulants do not lower blood pressure; antihypertensives serve that purpose."}),

  q("REX-PN","Cardiovascular","Cardiovascular",2,
    "When assessing a client with suspected deep vein thrombosis, the nurse would expect to find:",
    ["Bilateral leg swelling with brown discoloration","Unilateral leg swelling, warmth, redness, and calf tenderness","Cool, pale, pulseless extremity","Joint stiffness without swelling"],1,
    "DVT typically presents with unilateral edema, warmth, erythema, and tenderness in the affected leg. Positive Homans' sign (calf pain with dorsiflexion) may be present but is not a reliable diagnostic sign.",
    "DVT = unilateral swelling, warmth, redness. Bilateral swelling suggests systemic causes (heart failure, renal disease).",
    "DVT assessment: unilateral presentation is key to distinguishing from bilateral edema causes.",
    {"0":"Bilateral swelling with brown discoloration describes chronic venous insufficiency, not acute DVT.","2":"Cool, pale, pulseless extremity describes arterial occlusion, not venous thrombosis.","3":"Joint stiffness without swelling is more consistent with osteoarthritis."}),

  // ===== RESPIRATORY (7 questions) =====
  q("REX-PN","Respiratory","Respiratory",2,
    "A client with COPD is prescribed oxygen therapy. The nurse should set the oxygen flow rate to:",
    ["10 L/min via non-rebreather mask","1-2 L/min via nasal cannula","100% FiO2 via ventilator","High-flow oxygen at 15 L/min"],1,
    "COPD clients rely on hypoxic drive for respiration. High oxygen levels can suppress this drive, causing respiratory depression. Low-flow oxygen (1-2 L/min) maintains adequate oxygenation without suppressing ventilation.",
    "COPD + O2 = low flow (1-2 L/min). High oxygen can suppress the hypoxic respiratory drive in chronic CO2 retainers.",
    "COPD oxygen questions: always choose the lowest effective flow rate. Target SpO2 88-92% for COPD clients.",
    {"0":"High-flow oxygen suppresses the hypoxic drive in COPD clients, potentially causing respiratory failure.","2":"100% FiO2 is dangerous for COPD clients due to respiratory drive suppression.","3":"15 L/min is far too high for COPD and could suppress respiratory drive."}),

  q("REX-PN","Respiratory","Respiratory",3,
    "A client with asthma has been prescribed both albuterol and fluticasone inhalers. The nurse instructs the client to use:",
    ["Fluticasone first, then albuterol","Albuterol first, then fluticasone after 1-2 minutes","Both inhalers simultaneously","Either one first, order does not matter"],1,
    "Albuterol (bronchodilator) is used first to open the airways, allowing fluticasone (corticosteroid) to penetrate deeper into the lungs for better anti-inflammatory effect 1-2 minutes later.",
    "Bronchodilator before corticosteroid: open airways first for better steroid deposition.",
    "Inhaler sequence questions: bronchodilator always first to maximize corticosteroid delivery to lower airways.",
    {"0":"Using the corticosteroid first limits its deposition because airways may still be constricted.","2":"Simultaneous use does not allow proper medication delivery and technique.","3":"Order matters therapeutically; bronchodilation must precede corticosteroid delivery for optimal effect."}),

  q("RPN-CAT","Respiratory","Respiratory",4,
    "A client with a chest tube has the collection chamber filled to the maximum level. The nurse should:",
    ["Disconnect and empty the chamber","Replace the entire drainage system without clamping the chest tube for extended periods","Clamp the chest tube permanently","Increase the suction pressure to reduce fluid volume"],1,
    "When the collection chamber is full, the entire drainage system must be replaced. The chest tube should never be clamped for extended periods (risk of tension pneumothorax). Brief clamping during system exchange is acceptable.",
    "Never empty a chest tube collection chamber. Replace the entire system when full. Minimize clamping time.",
    "Chest tube management: replacing the system is the safe answer. Extended clamping risks tension pneumothorax.",
    {"0":"Chest tube drainage systems are sealed units; opening them breaks the water seal and introduces contamination.","2":"Permanent clamping prevents air and fluid drainage, risking tension pneumothorax.","3":"Increasing suction does not reduce the volume already collected and may cause tissue damage."}),

  q("REX-PN","Respiratory","Respiratory",1,
    "The nurse is teaching a client to use a metered-dose inhaler with a spacer. The advantage of using a spacer is:",
    ["It eliminates the need for the medication","It improves medication delivery to the lungs by reducing the need for precise coordination","It increases the medication dose","It allows sharing the inhaler with others"],1,
    "A spacer holds the aerosolized medication, allowing the client to inhale it without needing precise hand-breath coordination. This increases lung deposition and reduces oral candidiasis risk with inhaled corticosteroids.",
    "Spacers improve drug delivery by 40-60% and reduce oropharyngeal side effects.",
    "Spacer questions: always about improved delivery and coordination. They do not change the dose.",
    {"0":"Spacers do not eliminate medication; they improve its delivery to the airways.","2":"Spacers do not change the medication dose; they improve how much reaches the lungs.","3":"Inhalers and spacers are single-patient devices and should never be shared."}),

  q("REX-PN","Respiratory","Respiratory",3,
    "A client post-thoracic surgery has a chest tube. The nurse observes that the water level in the water-seal chamber rises with inspiration and falls with expiration. This finding indicates:",
    ["An air leak in the system","Normal chest tube function","The chest tube is clogged","The suction is too high"],1,
    "Tidaling (fluid fluctuation with respiration) in the water-seal chamber is a normal finding indicating the system is patent and functional. Absence of tidaling may indicate tube obstruction or full lung re-expansion.",
    "Tidaling = normal. Continuous bubbling in water seal = air leak. No tidaling = possible obstruction or lung re-expansion.",
    "Water-seal chamber assessment: tidaling is expected and normal—do not confuse with continuous bubbling which indicates a leak.",
    {"0":"An air leak is indicated by continuous bubbling in the water-seal chamber, not fluctuation with respiration.","2":"A clogged chest tube would show absent tidaling, not normal fluctuation.","3":"Suction levels are reflected in the suction control chamber, not the water-seal chamber."}),

  q("REX-PN","Respiratory","Respiratory",2,
    "A client undergoing conscious sedation for a procedure becomes hypoxic. The nurse's first action is:",
    ["Administer the reversal agent","Open the airway using head-tilt chin-lift","Increase the sedation for client comfort","Call for a chest X-ray"],1,
    "Airway management is always the priority. Head-tilt chin-lift opens the airway in a non-trauma client. Then assess breathing, provide supplemental oxygen, and consider reversal agents if needed.",
    "ABCs: Airway always comes first. Open the airway before considering reversal agents or other interventions.",
    "Hypoxia during sedation: airway first (ABC), then reversal agents. Never sedate further if the client is hypoxic.",
    {"0":"While reversal agents may be needed, ensuring an open airway takes priority over medication administration.","2":"Increasing sedation when a client is hypoxic could cause respiratory arrest and death.","3":"A chest X-ray is a diagnostic tool and does not address the immediate emergency of hypoxia."}),

  q("RPN-CAT","Respiratory","Respiratory",3,
    "A client with community-acquired pneumonia has the following findings: temperature 39.8°C, productive cough with rust-colored sputum, and consolidation on chest X-ray. The nurse anticipates:",
    ["Antiviral medication only","Antibiotic therapy, blood cultures, and sputum culture before the first antibiotic dose","Bronchodilator therapy as sole treatment","Chest tube insertion"],1,
    "Bacterial pneumonia with consolidation requires antibiotic therapy. Blood cultures and sputum cultures should be obtained before the first antibiotic dose to identify the organism, but antibiotic administration should not be significantly delayed.",
    "Cultures before antibiotics is the gold standard—but never delay antibiotics significantly to obtain cultures.",
    "Pneumonia management: cultures ideally before antibiotics, but start antibiotics within 1 hour of diagnosis for severe cases.",
    {"0":"Rust-colored sputum and consolidation suggest bacterial pneumonia, which requires antibiotics, not antivirals.","2":"Bronchodilators alone do not treat the underlying bacterial infection.","3":"Chest tubes are for pneumothorax or large pleural effusions, not pneumonia consolidation."}),

  // ===== RENAL (7 questions) =====
  q("REX-PN","Renal","Renal",2,
    "A client with a urinary catheter in place has cloudy, foul-smelling urine. The nurse suspects:",
    ["Normal concentrated urine","Catheter-associated urinary tract infection","Dehydration only","Medication side effect"],1,
    "Cloudy, foul-smelling urine with an indwelling catheter suggests CAUTI. Additional signs include fever, suprapubic discomfort, and flank pain. Urine culture should be obtained before starting antibiotics.",
    "CAUTI signs: cloudy, foul-smelling urine, fever, suprapubic pain. Prevention: sterile insertion, closed system, early removal.",
    "Catheter + cloudy/foul urine = suspect CAUTI. Always obtain a urine culture before antibiotics.",
    {"0":"Normal urine may be concentrated but should not be foul-smelling.","2":"Dehydration causes concentrated urine but not the foul odor characteristic of infection.","3":"While some medications affect urine color, foul-smelling cloudy urine with a catheter strongly suggests infection."}),

  q("REX-PN","Renal","Renal",3,
    "A client with chronic kidney disease has a potassium level of 6.2 mEq/L. The nurse should anticipate which priority intervention?",
    ["Encourage potassium-rich foods","Administer IV calcium gluconate, insulin with glucose, and cardiac monitoring","Schedule dialysis for next week","Increase oral fluid intake"],1,
    "Hyperkalemia (K+ >5.0 mEq/L) can cause fatal cardiac arrhythmias. IV calcium gluconate stabilizes the myocardium, insulin with glucose drives potassium intracellularly, and sodium polystyrene sulfonate promotes GI excretion.",
    "Hyperkalemia emergency: calcium gluconate (cardiac protection), insulin+glucose (intracellular shift), kayexalate or dialysis (removal).",
    "Potassium >6.0 with CKD is an emergency. Look for the answer that includes cardiac protection first.",
    {"0":"Adding potassium to an already dangerously elevated level would worsen the life-threatening arrhythmia risk.","2":"A potassium of 6.2 requires immediate intervention, not scheduling dialysis for next week.","3":"Increased fluids do not address the acute hyperkalemia and may worsen fluid overload in CKD."}),

  q("RPN-CAT","Renal","Renal",3,
    "A client on continuous ambulatory peritoneal dialysis complains of shoulder pain during fluid instillation. The nurse should:",
    ["Stop the dialysis immediately and remove the catheter","Slow the infusion rate and reposition the client","Administer IV pain medication","Increase the dwell time"],1,
    "Shoulder pain during PD is caused by diaphragmatic irritation from rapid fluid instillation or air in the peritoneum. Slowing the rate and repositioning (semi-Fowler's) usually resolves the discomfort.",
    "Shoulder pain during PD = diaphragmatic irritation, not a complication requiring catheter removal. Slow the rate and reposition.",
    "PD shoulder pain is common and benign. Differentiate from peritonitis (cloudy effluent, abdominal pain, fever).",
    {"0":"Catheter removal is unnecessary for shoulder pain; this is a common, manageable occurrence during PD.","2":"IV pain medication addresses the symptom but not the cause; rate adjustment is the appropriate nursing intervention.","3":"Increasing dwell time does not address infusion-related shoulder pain and may worsen abdominal distension."}),

  q("REX-PN","Renal","Renal",1,
    "The nurse teaches a client with a urinary tract infection to drink cranberry juice because it:",
    ["Kills bacteria directly","Acidifies the urine and may prevent bacterial adhesion to the bladder wall","Increases urine alkalinity","Provides antibiotic properties"],1,
    "Cranberry products contain proanthocyanidins that may prevent E. coli from adhering to the urinary tract epithelium. They also acidify urine, creating a less favorable environment for bacterial growth.",
    "Cranberry juice prevents bacterial adhesion and acidifies urine. It is preventive, not curative—antibiotics are needed for active UTI.",
    "Cranberry questions: focus on prevention mechanism (adhesion prevention), not treatment of active infection.",
    {"0":"Cranberry juice does not directly kill bacteria; antibiotics are needed for active infection.","2":"Cranberry juice acidifies urine, not alkalinizes it.","3":"Cranberry juice is not an antibiotic and should not replace prescribed antimicrobial therapy."}),

  q("REX-PN","Renal","Renal",3,
    "A client receiving hemodialysis should avoid taking antihypertensive medications:",
    ["In the morning before breakfast","Immediately before the dialysis session","At bedtime only","With meals"],1,
    "Antihypertensive medications taken before dialysis can cause severe hypotension during the procedure due to the rapid fluid removal. These medications are typically held until after dialysis is completed.",
    "Hold antihypertensives before dialysis to prevent dangerously low blood pressure during fluid removal.",
    "Dialysis medication timing: hold BP meds before dialysis. This is a frequently tested concept.",
    {"0":"Morning dosing may be appropriate on non-dialysis days but requires timing adjustment on dialysis days.","2":"Bedtime dosing is unrelated to dialysis timing concerns.","3":"Taking with meals is about absorption, not dialysis-related timing."}),

  q("REX-PN","Renal","Renal",2,
    "Which urine characteristic should the nurse report immediately?",
    ["Pale yellow urine with a mild odor","Dark amber urine in a client who has not been drinking fluids","Frank hematuria (bright red blood in urine)","Clear urine after adequate hydration"],2,
    "Frank hematuria requires immediate reporting as it may indicate urinary tract trauma, kidney stones, bladder cancer, or post-surgical bleeding. Dark amber urine from dehydration is expected and managed with hydration.",
    "Bright red blood in urine (frank hematuria) always requires urgent evaluation and reporting.",
    "Urine assessment: blood is always abnormal and reportable. Dark amber from dehydration is expected and treatable.",
    {"0":"Pale yellow urine with mild odor is normal, indicating adequate hydration.","1":"Dark amber urine in a dehydrated client is an expected finding that responds to increased fluid intake.","3":"Clear urine indicates good hydration and is a normal finding."}),

  q("RPN-CAT","Renal","Renal",4,
    "A client post-kidney transplant develops oliguria, fever, and tenderness over the graft site on day 5. The nurse suspects:",
    ["Normal post-surgical healing","Acute rejection requiring urgent immunosuppression adjustment","Urinary tract infection","Medication side effects"],1,
    "Acute rejection typically occurs within the first 3 months post-transplant. Signs include decreased urine output, fever, graft tenderness, elevated creatinine, and fluid retention. Urgent adjustment of immunosuppressive therapy is needed.",
    "Acute rejection signs: oliguria, fever, graft tenderness, rising creatinine. Report immediately—early treatment can save the graft.",
    "Post-transplant complications by timing: hyperacute (minutes), acute (days-months), chronic (months-years). Match the timeline to the type.",
    {"0":"Normal healing does not include oliguria and graft tenderness; these indicate a complication.","2":"UTI may cause fever but not graft-site tenderness and oliguria in this context.","3":"Immunosuppressant side effects do not typically present with graft tenderness."}),

  // ===== ENDOCRINE (7 questions) =====
  q("REX-PN","Endocrine","Endocrine",2,
    "A client with Cushing syndrome typically presents with:",
    ["Weight loss and hypotension","Moon face, buffalo hump, truncal obesity, and thin extremities","Exophthalmos and heat intolerance","Bronze skin discoloration"],1,
    "Cushing syndrome (excess cortisol) causes redistribution of fat to the face (moon face), upper back (buffalo hump), and trunk, while extremities become thin. Other signs include striae, hirsutism, and hyperglycemia.",
    "Cushing = excess cortisol: moon face, buffalo hump, truncal obesity, hyperglycemia, immunosuppression, osteoporosis.",
    "Cushing vs Addison: they are opposites. Cushing = excess cortisol. Addison = deficient cortisol.",
    {"0":"Weight loss and hypotension are characteristic of Addison disease (cortisol deficiency), the opposite of Cushing.","2":"Exophthalmos and heat intolerance are signs of Graves disease (hyperthyroidism).","3":"Bronze skin discoloration is characteristic of Addison disease due to excess ACTH stimulating melanocytes."}),

  q("REX-PN","Endocrine","Endocrine",3,
    "A client post-thyroidectomy reports tingling around the mouth and fingertips. The nurse should assess for:",
    ["Hyperthyroidism recurrence","Hypocalcemia from accidental parathyroid removal","Medication side effects","Anxiety-related symptoms"],1,
    "Perioral and fingertip tingling indicates hypocalcemia, which can occur after thyroidectomy if the parathyroid glands are accidentally damaged or removed. Check for positive Chvostek's and Trousseau's signs.",
    "Post-thyroidectomy complications: hypocalcemia (parathyroid damage), hemorrhage (neck swelling), laryngeal nerve damage (hoarseness), airway obstruction.",
    "Tingling after thyroid surgery = hypocalcemia until proven otherwise. Assess Chvostek's and Trousseau's signs.",
    {"0":"Hyperthyroidism recurrence does not present with tingling; it causes tachycardia, heat intolerance, and weight loss.","2":"While medications can cause tingling, the timing after thyroidectomy makes parathyroid damage the primary concern.","3":"Anxiety can cause tingling but should not be assumed post-thyroidectomy; hypocalcemia must be ruled out first."}),

  q("RPN-CAT","Endocrine","Endocrine",4,
    "A client with adrenal insufficiency is admitted with an addisonian crisis. The nurse should anticipate:",
    ["Fluid restriction and corticosteroid tapering","IV corticosteroids (hydrocortisone), aggressive IV fluid resuscitation, and vasopressors if needed","Oral prednisone only","Insulin administration"],1,
    "Addisonian crisis is a life-threatening emergency from acute cortisol deficiency causing severe hypotension, hyponatremia, hyperkalemia, and hypoglycemia. IV hydrocortisone 100mg bolus and aggressive saline resuscitation are critical.",
    "Addisonian crisis: IV hydrocortisone + NS fluid bolus. This is an endocrine emergency with high mortality if untreated.",
    "Adrenal crisis = IV corticosteroids and fluids immediately. Oral medications are insufficient for acute crisis.",
    {"0":"Fluid restriction would worsen the dehydration and hypotension of addisonian crisis.","2":"Oral prednisone is insufficient for an acute crisis; IV hydrocortisone provides immediate cortisol replacement.","3":"Insulin is not indicated; addisonian crisis typically causes hypoglycemia, not hyperglycemia."}),

  q("REX-PN","Endocrine","Endocrine",1,
    "The nurse teaches a client with hypothyroidism to take levothyroxine:",
    ["With the largest meal of the day","On an empty stomach 30-60 minutes before breakfast","At bedtime with a glass of milk","With calcium and iron supplements"],1,
    "Levothyroxine is best absorbed on an empty stomach. Food, calcium, iron, and antacids significantly reduce absorption. Consistent timing ensures stable thyroid hormone levels.",
    "Levothyroxine: empty stomach, 30-60 min before eating. Separate from calcium/iron by 4 hours.",
    "Thyroid medication timing is a frequently tested concept. Empty stomach and separation from interacting supplements are key.",
    {"0":"Food decreases levothyroxine absorption by up to 40%.","2":"Milk contains calcium which binds levothyroxine and reduces absorption.","3":"Calcium and iron supplements chelate levothyroxine, significantly reducing its absorption."}),

  q("REX-PN","Endocrine","Endocrine",3,
    "A client with Graves disease is scheduled for radioactive iodine therapy. The nurse teaches that:",
    ["The client will feel radioactive effects immediately","The client should limit close contact with others, especially pregnant women and children, for several days after treatment","The therapy cures the disease immediately","No follow-up monitoring is needed"],1,
    "Radioactive iodine emits radiation that destroys overactive thyroid tissue. Radiation precautions include limiting close contact for days, using separate utensils, and flushing twice after using the toilet.",
    "RAI therapy: radiation precautions for 1-7 days. Most patients eventually become hypothyroid and need lifelong levothyroxine.",
    "RAI questions: focus on radiation safety precautions and the likely eventual outcome of hypothyroidism.",
    {"0":"The therapeutic effect of RAI takes 6-8 weeks to fully manifest, not immediately.","2":"RAI does not cure immediately; effects take weeks and most patients develop hypothyroidism requiring treatment.","3":"Lifelong thyroid function monitoring is essential because hypothyroidism typically develops after RAI."}),

  q("REX-PN","Endocrine","Endocrine",3,
    "A client with type 2 diabetes has a fasting blood glucose of 280 mg/dL. The nurse should also assess for:",
    ["Signs of hypoglycemia","Signs of hyperglycemic hyperosmolar state including altered mental status and dehydration","Hypothyroid symptoms","Adrenal insufficiency signs"],1,
    "Significantly elevated glucose in type 2 diabetes can progress to HHS. Assessment for dehydration (poor skin turgor, dry mucous membranes), altered mental status, and extreme hyperglycemia guides urgency of treatment.",
    "Type 2 + very high glucose = risk for HHS. Type 1 + high glucose = risk for DKA. Know the difference.",
    "High glucose questions: assess for complications (HHS or DKA) based on diabetes type.",
    {"0":"With a glucose of 280, the client is hyperglycemic, not hypoglycemic.","2":"Hypothyroidism is a separate endocrine disorder not directly related to this acute glucose elevation.","3":"Adrenal insufficiency presents with hypoglycemia, not hyperglycemia."}),

  q("RPN-CAT","Endocrine","Endocrine",3,
    "A client with diabetes insipidus has a urine specific gravity of 1.001. This value is consistent with:",
    ["Concentrated urine indicating dehydration","Dilute urine from lack of ADH, consistent with diabetes insipidus","Normal urine concentration","Kidney failure"],1,
    "Diabetes insipidus causes excretion of large volumes of dilute urine (low specific gravity <1.005) due to insufficient ADH or renal unresponsiveness to ADH. Normal specific gravity is 1.010-1.025.",
    "DI: dilute urine (low specific gravity, high volume). SIADH: concentrated urine (high specific gravity, low volume). They are opposites.",
    "Specific gravity questions: low = dilute (DI), high = concentrated (SIADH or dehydration). Match to the diagnosis.",
    {"0":"A specific gravity of 1.001 indicates very dilute urine, not concentrated.","2":"Normal specific gravity is 1.010-1.025; 1.001 is significantly below normal.","3":"Kidney failure typically shows an inability to concentrate or dilute urine, with specific gravity fixed around 1.010."}),

  // ===== GASTROINTESTINAL (7 questions) =====
  q("REX-PN","Gastrointestinal","Gastrointestinal",2,
    "A client with a newly placed nasogastric tube requires placement verification. The most reliable method is:",
    ["Auscultation of air insufflation over the stomach","Radiographic (X-ray) confirmation","Aspirating gastric contents and checking pH","Observing for bubbles when the tube is placed in water"],1,
    "X-ray confirmation is the gold standard for initial NG tube placement verification. While checking aspirate pH is used for ongoing assessment, radiographic confirmation is most reliable for initial placement.",
    "X-ray is the gold standard for initial NG placement. pH testing of aspirate (pH <5.5) supports correct positioning for ongoing use.",
    "NG tube verification: X-ray for initial confirmation, then pH testing for ongoing assessment. Auscultation alone is unreliable.",
    {"0":"Air auscultation is no longer recommended as a sole verification method because it cannot distinguish between gastric and intestinal placement.","2":"Aspirate pH is useful for ongoing assessment but X-ray is the most reliable method for initial verification.","3":"Observing for bubbles is not a valid verification method for NG tube placement."}),

  q("REX-PN","Gastrointestinal","Gastrointestinal",3,
    "A client with cirrhosis has a serum ammonia level of 120 mcg/dL. The nurse anticipates which dietary modification?",
    ["High-protein diet to promote healing","Protein restriction to reduce ammonia production","Increased sodium intake","High-fat diet for energy"],1,
    "Elevated ammonia in cirrhosis causes hepatic encephalopathy. Protein restriction (initially) reduces ammonia production from protein metabolism. Lactulose is also given to promote ammonia excretion.",
    "Cirrhosis + elevated ammonia = protein restriction + lactulose. Ammonia is a byproduct of protein metabolism.",
    "Liver disease diet questions: restrict protein when ammonia is elevated to prevent worsening encephalopathy.",
    {"0":"High protein increases ammonia production, worsening hepatic encephalopathy.","2":"Sodium restriction, not increase, is needed in cirrhosis to control ascites and edema.","3":"High-fat diet does not address ammonia levels and may worsen hepatic steatosis."}),

  q("RPN-CAT","Gastrointestinal","Gastrointestinal",4,
    "A client with a bowel obstruction has an NG tube to low intermittent suction. Which metabolic imbalance should the nurse monitor?",
    ["Respiratory acidosis","Metabolic alkalosis from loss of hydrochloric acid","Metabolic acidosis","Respiratory alkalosis"],1,
    "NG suction removes gastric secretions rich in hydrochloric acid (HCl), leading to loss of hydrogen ions and chloride. This causes metabolic alkalosis with elevated pH and bicarbonate.",
    "NG suction = loss of HCl = metabolic alkalosis. Also monitor for hypokalemia from gastric losses.",
    "Acid-base questions with NG suction: loss of gastric acid always leads to metabolic alkalosis.",
    {"0":"Respiratory acidosis results from CO2 retention, not NG suction losses.","2":"Metabolic acidosis would occur from bicarbonate loss (as in diarrhea), not HCl loss from gastric suction.","3":"Respiratory alkalosis is caused by hyperventilation, unrelated to NG suction."}),

  q("REX-PN","Gastrointestinal","Gastrointestinal",1,
    "After a client undergoes abdominal surgery, the nurse assesses for return of bowel function by:",
    ["Ordering an abdominal CT scan","Auscultating for bowel sounds and asking about passage of flatus","Checking for abdominal rigidity only","Measuring abdominal girth daily"],1,
    "Return of bowel function is indicated by the presence of bowel sounds, passage of flatus (gas), and eventual bowel movement. These are assessed before advancing the diet from NPO status.",
    "Post-surgical bowel function indicators: bowel sounds present, passing flatus, absence of nausea/vomiting.",
    "Post-op bowel function questions: bowel sounds + flatus = ready to advance diet. Always assess before feeding.",
    {"0":"CT scan is not routinely used to assess bowel function return; it is reserved for suspected complications.","2":"Abdominal rigidity may indicate peritonitis but does not assess bowel function return.","3":"While girth measurement monitors distension, it does not directly indicate bowel function return."}),

  q("REX-PN","Gastrointestinal","Gastrointestinal",3,
    "A client with peptic ulcer disease tests positive for Helicobacter pylori. The nurse anticipates which treatment regimen?",
    ["Antacids alone for 6 weeks","Triple therapy: proton pump inhibitor plus two antibiotics","Surgical vagotomy","Dietary changes only"],1,
    "H. pylori eradication requires triple therapy: a PPI (omeprazole) plus two antibiotics (clarithromycin and amoxicillin or metronidazole) for 14 days. Eradication reduces ulcer recurrence significantly.",
    "H. pylori triple therapy: PPI + 2 antibiotics for 14 days. Compliance is essential for eradication.",
    "H. pylori treatment: always includes antibiotics + acid suppression. Single-agent therapy is insufficient.",
    {"0":"Antacids provide symptom relief but do not eradicate H. pylori infection, leading to ulcer recurrence.","2":"Surgical vagotomy was used historically but is rarely needed now with effective medical therapy.","3":"Dietary changes may help symptoms but do not eradicate the bacterial infection."}),

  q("REX-PN","Gastrointestinal","Gastrointestinal",2,
    "A client with inflammatory bowel disease has a colostomy in the ascending colon. The nurse expects the stool output to be:",
    ["Formed and solid","Liquid to semi-liquid consistency","No output for the first month","Only mucus"],1,
    "Ascending colon colostomies produce liquid to semi-liquid stool because water absorption primarily occurs in the transverse and descending colon. The more proximal the stoma, the more liquid the output.",
    "Stoma location determines output consistency: ascending = liquid, transverse = semi-formed, descending/sigmoid = formed.",
    "Ostomy output questions: match consistency to location. More proximal = more liquid.",
    {"0":"Formed stool is expected from descending or sigmoid colostomies, not ascending.","2":"Output begins within 24-48 hours post-operatively, not after one month.","3":"Mucus alone would indicate a mucous fistula or non-functional stoma, not a functioning ascending colostomy."}),

  q("RPN-CAT","Gastrointestinal","Gastrointestinal",3,
    "A client with acute pancreatitis has severe epigastric pain. The nurse should position the client:",
    ["Supine with legs extended","Side-lying with knees flexed toward the chest","Prone position","High Fowler's with legs dangling"],1,
    "The fetal position (side-lying with knees flexed) reduces tension on the abdominal muscles and decreases pressure on the inflamed pancreas, providing pain relief. Supine position may worsen pain.",
    "Pancreatitis comfort position: side-lying, knees to chest (fetal position). NPO, IV fluids, pain management are the treatment triad.",
    "Pancreatitis positioning: fetal position for comfort. Remember the treatment triad: NPO, fluids, pain control.",
    {"0":"Supine position stretches the abdominal muscles over the inflamed pancreas, increasing pain.","2":"Prone position is uncomfortable and does not relieve pancreatic pressure.","3":"High Fowler's with dangling legs does not provide the abdominal muscle relaxation that the fetal position offers."}),

  // ===== NEUROLOGICAL (7 questions) =====
  q("REX-PN","Neurological","Neurological",2,
    "The nurse is performing a neurological assessment and asks the client to squeeze both hands simultaneously. This tests:",
    ["Sensory function","Motor strength and symmetry","Cerebellar coordination","Cranial nerve function"],1,
    "Bilateral hand grip tests motor strength and symmetry. Unequal grip strength may indicate a stroke, spinal cord injury, or other neurological deficit affecting one side.",
    "Motor strength assessment: test bilaterally and compare sides. Asymmetry is always significant.",
    "Neuro assessment basics: grip strength tests motor function. Always compare both sides for symmetry.",
    {"0":"Sensory function is tested with light touch, pain, and temperature, not grip strength.","2":"Cerebellar coordination is tested with finger-to-nose, rapid alternating movements, and heel-to-shin tests.","3":"Cranial nerve function is tested individually through specific assessments for each of the 12 cranial nerves."}),

  q("REX-PN","Neurological","Neurological",3,
    "A client with increased intracranial pressure has Cushing's triad. The nurse recognizes this as:",
    ["Tachycardia, hypotension, and tachypnea","Hypertension, bradycardia, and irregular respirations","Fever, tachycardia, and diaphoresis","Hypotension, tachycardia, and altered consciousness"],1,
    "Cushing's triad (hypertension, bradycardia, irregular respirations) is a late, ominous sign of brainstem herniation from critically elevated ICP. It indicates impending brain death and requires immediate intervention.",
    "Cushing's triad is a LATE sign of herniation. Do not wait for it—intervene at earlier signs of elevated ICP.",
    "ICP questions: Cushing's triad (HTN + bradycardia + irregular respirations) = brainstem herniation = emergency.",
    {"0":"Tachycardia and hypotension describe shock, not elevated ICP.","2":"Fever, tachycardia, and diaphoresis may indicate infection or thyroid storm, not Cushing's triad.","3":"Hypotension and tachycardia describe a shock state, the opposite of Cushing's response."}),

  q("RPN-CAT","Neurological","Neurological",4,
    "A client with a ruptured cerebral aneurysm is prescribed nimodipine. The nurse understands this medication is used to:",
    ["Lower blood pressure to normal levels","Prevent cerebral vasospasm following subarachnoid hemorrhage","Dissolve the existing blood clot","Prevent seizures"],1,
    "Nimodipine is a calcium channel blocker with selectivity for cerebral blood vessels. It is used to prevent and treat cerebral vasospasm, which typically occurs 4-14 days after subarachnoid hemorrhage and can cause ischemic stroke.",
    "Nimodipine is specific for preventing cerebral vasospasm after SAH. It does not replace general BP management.",
    "SAH + nimodipine = vasospasm prevention. Timing: vasospasm risk is highest 4-14 days after initial bleed.",
    {"0":"While nimodipine may lower BP slightly, its primary use after SAH is specifically preventing cerebral vasospasm.","2":"Nimodipine does not dissolve clots; thrombolytics serve that purpose and are generally contraindicated after hemorrhagic stroke.","3":"Antiepileptic drugs (levetiracetam, phenytoin) are used for seizure prevention, not nimodipine."}),

  q("REX-PN","Neurological","Neurological",1,
    "A client is admitted with a suspected stroke. The nurse performs a rapid assessment using the FAST acronym, which stands for:",
    ["Fever, Airway, Saturation, Treatment","Face drooping, Arm weakness, Speech difficulty, Time to call emergency services","Fluid, Airway, Seizure, Temperature","Findings, Assessment, Symptoms, Testing"],1,
    "FAST is a stroke recognition tool: Face drooping (asymmetry), Arm weakness (drift), Speech difficulty (slurred or confused), Time (note onset and call 911). Early recognition enables faster treatment.",
    "FAST stroke recognition saves lives. Time of symptom onset is critical for determining treatment eligibility.",
    "Stroke questions: FAST identifies stroke quickly. Time to treatment (within 3-4.5 hours for tPA) is critical.",
    {"0":"This acronym is not used in stroke assessment.","2":"This is not the correct FAST acronym for stroke recognition.","3":"This is not the standard FAST stroke assessment tool."}),

  q("REX-PN","Neurological","Neurological",3,
    "A client with meningitis has a positive Kernig's sign. The nurse describes this finding as:",
    ["Neck stiffness when the chin is flexed to the chest","Resistance and pain when the leg is extended at the knee with the hip flexed at 90 degrees","Involuntary flexion of the hips when the neck is flexed","Hyperactive deep tendon reflexes"],1,
    "Kernig's sign: with the hip flexed to 90 degrees, pain and resistance occur when attempting to extend the knee. This indicates meningeal irritation and is a classic finding in meningitis.",
    "Kernig's = knee extension resistance with hip flexed. Brudzinski's = involuntary hip/knee flexion when neck is flexed. Both indicate meningeal irritation.",
    "Distinguish Kernig's (knee-related) from Brudzinski's (neck flexion causes hip flexion). Both suggest meningitis.",
    {"0":"Neck stiffness (nuchal rigidity) is a separate finding in meningitis, not specifically Kernig's sign.","2":"Involuntary hip flexion with neck flexion describes Brudzinski's sign, not Kernig's sign.","3":"Hyperactive reflexes may be present but are not what defines Kernig's sign."}),

  q("REX-PN","Neurological","Neurological",2,
    "A client with a right-sided stroke may experience which deficit?",
    ["Right-sided hemiplegia","Left-sided hemiplegia and spatial-perceptual deficits","Expressive aphasia (Broca's)","Receptive aphasia (Wernicke's)"],1,
    "Right brain stroke causes left-sided motor/sensory deficits (contralateral), spatial-perceptual problems, impulsive behavior, and left-sided neglect. Language centers are typically in the left hemisphere.",
    "Right brain stroke = left-sided deficits + spatial problems + impulsivity. Left brain stroke = right-sided deficits + language problems.",
    "Stroke lateralization: deficits are contralateral. Right brain = spatial/perceptual. Left brain = language.",
    {"0":"Right-sided weakness would result from a left-sided stroke, not right-sided.","2":"Broca's aphasia is typically associated with left frontal lobe damage, not right-sided stroke.","3":"Wernicke's aphasia is associated with left temporal lobe damage, not right-sided stroke."}),

  q("RPN-CAT","Neurological","Neurological",3,
    "A client with myasthenia gravis develops ptosis and difficulty swallowing that worsens throughout the day. The nurse understands this pattern is due to:",
    ["Progressive nerve degeneration","Autoimmune destruction of acetylcholine receptors at the neuromuscular junction","Demyelination of central nervous system neurons","Dopamine deficiency in the basal ganglia"],1,
    "Myasthenia gravis is an autoimmune disorder where antibodies attack acetylcholine receptors at the neuromuscular junction. Muscle weakness worsens with activity and improves with rest (fatigability pattern).",
    "MG = fatigable weakness (worse with activity, better with rest). Crisis: myasthenic (undertreated) vs cholinergic (overtreated).",
    "MG pattern: worsening throughout the day = classic fatigability. Differentiate from MS which has different patterns.",
    {"0":"MG does not involve nerve degeneration; the nerves are intact but the receptors are blocked by antibodies.","2":"Demyelination of CNS neurons describes multiple sclerosis, not myasthenia gravis.","3":"Dopamine deficiency causes Parkinson disease, not myasthenia gravis."}),

  // ===== MUSCULOSKELETAL (7 questions) =====
  q("REX-PN","Musculoskeletal","Musculoskeletal",2,
    "A client in a leg cast reports numbness and tingling in the toes. The nurse should first:",
    ["Reassure the client this is normal","Assess neurovascular status by checking pulses, sensation, color, and temperature","Apply heat to the cast","Elevate the leg above heart level"],1,
    "Numbness and tingling may indicate neurovascular compromise from cast pressure. The nurse must assess the 5 Ps: Pain, Paralysis, Paresthesia, Pallor, and Pulselessness. Report abnormal findings immediately.",
    "Cast complications: neurovascular checks every 1-2 hours initially. The 5 Ps guide assessment of compartment syndrome.",
    "Neurovascular assessment questions: always assess before intervening. Check the 5 Ps systematically.",
    {"0":"Numbness and tingling are never normal with a cast and may indicate serious complications.","2":"Heat application over a cast can burn the skin and does not address the neurovascular concern.","3":"While elevation helps reduce swelling, assessment must come first to determine the cause of symptoms."}),

  q("REX-PN","Musculoskeletal","Musculoskeletal",3,
    "A client with a fractured femur is in skeletal traction. The nurse should ensure that:",
    ["Weights are resting on the floor when the client is sleeping","Weights hang freely and the pull is maintained continuously","Knots in the traction rope are against the pulley","The client is positioned flat without elevation"],1,
    "Traction weights must hang freely at all times to maintain the prescribed pull and proper bone alignment. Weights should never be lifted, rested on the floor, or removed without a physician's order.",
    "Traction principles: weights hang free, maintain continuous pull, ropes move freely through pulleys, knots do not touch pulleys.",
    "Traction questions: free-hanging weights and continuous pull are the key concepts tested.",
    {"0":"Weights on the floor release the traction, disrupting bone alignment and delaying healing.","2":"Knots against pulleys prevent smooth rope movement and alter the traction force.","3":"Clients in traction may be positioned per physician orders, which may include slight elevation for comfort and counter-traction."}),

  q("REX-PN","Musculoskeletal","Musculoskeletal",1,
    "A client with gout is taught to avoid foods high in:",
    ["Calcium","Purines such as organ meats, shellfish, and red wine","Fiber","Vitamin C"],1,
    "Gout is caused by uric acid crystal deposits in joints. Purines are metabolized to uric acid. High-purine foods include organ meats, shellfish, anchovies, and beer/red wine. Limiting purines reduces uric acid levels.",
    "Gout = uric acid. Avoid high-purine foods: organ meats, shellfish, sardines, beer. Increase water intake.",
    "Gout diet questions: purines are the key concept. Know which foods are highest in purines.",
    {"0":"Calcium restriction is not indicated for gout; it is related to kidney stone prevention in some cases.","2":"Fiber is not related to gout management and is generally encouraged for overall health.","3":"Vitamin C may actually help lower uric acid levels and is not restricted in gout."}),

  q("RPN-CAT","Musculoskeletal","Musculoskeletal",3,
    "A client with a hip fracture is being prepared for surgical repair. Preoperatively, the affected leg is typically positioned in:",
    ["Adduction and internal rotation","Abduction with Buck's traction to immobilize and reduce pain","Flexion at 90 degrees","No specific positioning needed"],1,
    "Buck's traction (skin traction) provides temporary immobilization, reduces muscle spasm, and manages pain before surgical repair of hip fractures. The leg is maintained in alignment with 5-10 pounds of weight.",
    "Pre-op hip fracture: Buck's traction for comfort and alignment. Post-op: hip precautions to prevent dislocation.",
    "Hip fracture pre-op management: Buck's traction is the standard interim measure before surgery.",
    {"0":"Adduction and internal rotation would displace the fracture further and increase pain.","2":"Flexion at 90 degrees is not appropriate for hip fracture immobilization and may worsen the fracture.","3":"Proper positioning is essential to prevent further displacement, reduce pain, and maintain alignment before surgery."}),

  q("REX-PN","Musculoskeletal","Musculoskeletal",2,
    "After a total knee replacement, the nurse monitors for which common complication?",
    ["Hypercalcemia","Deep vein thrombosis","Hyperthyroidism","Hyperglycemia"],1,
    "DVT is a major risk after joint replacement due to venous stasis during surgery and immobility. Prevention includes anticoagulants, compression devices, early mobilization, and ankle pump exercises.",
    "Post-joint replacement: DVT is the most common serious complication. Prevention starts in the OR and continues throughout recovery.",
    "Joint replacement + complication = DVT is almost always the tested answer. Know the prevention strategies.",
    {"0":"Hypercalcemia is not a common complication of knee replacement.","2":"Hyperthyroidism is an endocrine disorder unrelated to joint replacement surgery.","3":"While hyperglycemia can occur in diabetic patients post-surgery, DVT is the more specific and common complication of knee replacement."}),

  q("REX-PN","Musculoskeletal","Musculoskeletal",3,
    "A client with a spinal cord injury at T6 develops a pounding headache, flushing, and blood pressure of 220/120 mmHg. The nurse suspects:",
    ["Hypertensive crisis from pain","Autonomic dysreflexia triggered by a noxious stimulus below the level of injury","Stroke","Anxiety attack"],1,
    "Autonomic dysreflexia is a life-threatening emergency in clients with SCI at T6 or above. It is triggered by noxious stimuli below the injury (full bladder, constipation, tight clothing). Immediate intervention: elevate HOB, find and remove the stimulus.",
    "Autonomic dysreflexia: SCI at T6 or above + HTN + headache + flushing above injury + bradycardia. Remove the trigger immediately.",
    "SCI + sudden severe hypertension = autonomic dysreflexia. First action: sit up, check the bladder (most common trigger).",
    {"0":"While pain can cause hypertension, the combination of SCI at T6, flushing, and extreme hypertension is specific to autonomic dysreflexia.","2":"Stroke may cause hypertension but does not typically cause flushing above the injury level in SCI patients.","3":"Anxiety attacks do not cause blood pressure of 220/120 mmHg with flushing."}),

  q("RPN-CAT","Musculoskeletal","Musculoskeletal",4,
    "A client with osteomyelitis has been on IV antibiotics for 2 weeks. The nurse should monitor for:",
    ["Improved appetite only","Superinfection, IV site complications, and antibiotic-specific toxicities","Immediate full recovery","Weight gain as the sole concern"],1,
    "Long-term IV antibiotic therapy carries risks of superinfection (C. diff, fungal), IV site complications (phlebitis, infiltration, central line infections), and drug-specific toxicities (nephrotoxicity, ototoxicity, hepatotoxicity).",
    "Prolonged IV antibiotics: monitor for superinfection (especially C. diff), IV complications, and organ toxicity specific to the drug used.",
    "Long-term antibiotic questions: think beyond the infection—monitor for treatment complications too.",
    {"0":"Improved appetite is a positive sign of recovery, not a complication to monitor.","2":"Osteomyelitis requires 4-6 weeks of IV antibiotics; full recovery at 2 weeks is unlikely.","3":"Weight gain alone is not a comprehensive monitoring concern during prolonged IV antibiotic therapy."}),

  // ===== INFECTION CONTROL (7 questions) =====
  q("REX-PN","Infection Control","Infection Control",1,
    "The most effective way to prevent the spread of infection in a healthcare setting is:",
    ["Wearing gloves at all times","Performing proper hand hygiene","Administering prophylactic antibiotics to all patients","Wearing an N95 respirator continuously"],1,
    "Hand hygiene (handwashing with soap and water or alcohol-based hand rub) is the single most effective measure to prevent healthcare-associated infections. It should be performed before and after every patient contact.",
    "Hand hygiene is the #1 infection prevention measure. Soap and water for visibly soiled hands; alcohol-based rub otherwise.",
    "Infection prevention questions: hand hygiene is almost always the correct answer for 'most effective' prevention.",
    {"0":"Gloves do not replace hand hygiene. Hands must be washed before donning and after removing gloves.","2":"Prophylactic antibiotics for all patients promotes antibiotic resistance and is not standard practice.","3":"N95 respirators are reserved for airborne precautions, not routine use for general infection prevention."}),

  q("REX-PN","Infection Control","Infection Control",2,
    "A client diagnosed with Clostridioides difficile (C. diff) requires which type of precautions?",
    ["Standard precautions only","Contact precautions with hand washing using soap and water","Airborne precautions","Droplet precautions"],1,
    "C. diff requires contact precautions. Importantly, alcohol-based hand sanitizers are ineffective against C. diff spores. Soap and water with friction is required to physically remove the spores.",
    "C. diff = contact precautions + soap and water hand washing (alcohol does not kill spores). Bleach-based cleaning for environmental surfaces.",
    "C. diff questions: the key differentiator is that alcohol-based sanitizer is ineffective—soap and water only.",
    {"0":"Standard precautions alone are insufficient for C. diff due to its highly transmissible spore form.","2":"C. diff is spread by contact, not airborne transmission.","3":"C. diff is not transmitted by respiratory droplets."}),

  q("RPN-CAT","Infection Control","Infection Control",3,
    "A nurse is preparing to care for a client on airborne precautions for suspected tuberculosis. The required respiratory protection is:",
    ["Standard surgical mask","N95 or higher particulate respirator that has been fit-tested","Face shield only","Cloth face covering"],1,
    "Airborne precautions for TB require an N95 or higher respirator that has been properly fit-tested for the individual nurse. The client must be in a negative-pressure airborne infection isolation room (AIIR).",
    "TB = airborne precautions: negative-pressure room + fit-tested N95 respirator. Surgical masks are for droplet precautions only.",
    "TB isolation: N95 + negative-pressure room. Surgical masks are incorrect for airborne pathogens.",
    {"0":"Surgical masks protect against droplets but do not filter the small airborne particles that carry TB bacteria.","2":"Face shields protect against splashes but do not filter inhaled air for airborne pathogens.","3":"Cloth coverings do not provide adequate filtration for airborne precautions."}),

  q("REX-PN","Infection Control","Infection Control",2,
    "When donning personal protective equipment, the correct order is:",
    ["Gloves, gown, mask, goggles","Gown, mask or respirator, goggles or face shield, gloves","Mask, gloves, gown, goggles","Any order is acceptable"],1,
    "PPE donning order: gown first (protects clothing), mask/respirator (protects respiratory system), goggles/face shield (protects eyes/face), gloves last (over gown cuffs to create a seal).",
    "Donning: gown → mask → goggles → gloves. Doffing: gloves → goggles → gown → mask. Gloves are first off, last on.",
    "PPE sequence questions: donning and doffing orders are tested frequently. Remember gloves go on last, come off first.",
    {"0":"Putting gloves on first means the gown cuffs will not be properly covered, leaving wrists exposed.","2":"Gloves must go on last to cover gown cuffs and prevent gaps in protection.","3":"A specific order is required to ensure full coverage and minimize contamination risk."}),

  q("REX-PN","Infection Control","Infection Control",3,
    "A nurse sustains a needlestick injury while drawing blood from an HIV-positive client. The nurse should:",
    ["Wash the site, report the exposure, and begin post-exposure prophylaxis as soon as possible","Wait for symptoms to develop before taking action","Apply a tourniquet above the site","Squeeze the wound to bleed out the virus"],1,
    "Post-needlestick protocol: wash with soap and water, report to occupational health, document the exposure, and begin PEP (antiretroviral therapy) ideally within 1-2 hours (effective up to 72 hours). Baseline and follow-up testing is required.",
    "Needlestick protocol: wash, report, PEP within 1-2 hours. PEP can be started up to 72 hours post-exposure.",
    "Needlestick questions: immediate washing + reporting + PEP. Timing is critical—the sooner PEP starts, the more effective.",
    {"0":"This is the correct answer.","2":"A tourniquet does not prevent exposure and is not part of the post-exposure protocol.","3":"Squeezing the wound may increase tissue damage and is not recommended; gentle washing is appropriate."}),

  q("REX-PN","Infection Control","Infection Control",3,
    "Surgical site infections are best prevented by:",
    ["Shaving the surgical site the night before surgery","Administering prophylactic antibiotics within 60 minutes before incision","Applying antibiotic ointment after wound closure","Using non-sterile gloves during the procedure"],1,
    "Prophylactic antibiotics given within 60 minutes before surgical incision significantly reduce SSI rates. Razors for hair removal increase infection risk; clippers are preferred if hair removal is necessary.",
    "SSI prevention: antibiotics within 60 min of incision, clip (not shave) hair, maintain normothermia, and glucose control.",
    "Surgical infection prevention: timing of prophylactic antibiotics is key—within 60 minutes of incision.",
    {"0":"Shaving with a razor causes micro-abrasions that harbor bacteria, increasing infection risk. Clipping is preferred.","2":"Topical antibiotic ointment is less effective than systemic prophylaxis for preventing deep SSI.","3":"Sterile gloves are required in the surgical field to maintain aseptic technique."}),

  q("REX-PN","Infection Control","Infection Control",4,
    "A client with vancomycin-resistant enterococcus (VRE) colonization requires which level of precautions?",
    ["Standard precautions only","Contact precautions with dedicated equipment","Airborne precautions","Reverse isolation"],1,
    "VRE requires contact precautions: gown and gloves upon room entry, dedicated equipment (stethoscope, BP cuff), and enhanced environmental cleaning. VRE is highly transmissible via direct contact and contaminated surfaces.",
    "VRE and MRSA = contact precautions. Dedicated equipment prevents cross-contamination between patients.",
    "Drug-resistant organisms (VRE, MRSA, CRE): contact precautions with dedicated equipment is the standard approach.",
    {"0":"Standard precautions alone are insufficient for VRE due to its persistence in the environment and ease of transmission.","2":"VRE is spread by contact, not airborne transmission.","3":"Reverse isolation (protective environment) is for immunocompromised clients, not for containing drug-resistant organisms."}),

  // ===== FLUID AND ELECTROLYTES (7 questions) =====
  q("REX-PN","Fluid and Electrolytes","Fluid and Electrolytes",2,
    "A client with a sodium level of 128 mEq/L is experiencing confusion and lethargy. The nurse recognizes this as:",
    ["Hypernatremia","Hyponatremia with neurological symptoms","Normal sodium level","Hyperkalemia"],1,
    "Normal sodium is 135-145 mEq/L. A level of 128 indicates hyponatremia, which causes neurological symptoms (confusion, lethargy, seizures) due to cerebral edema from water shifting into brain cells.",
    "Hyponatremia symptoms are neurological: confusion, headache, lethargy, seizures. Severe (<120) can cause brain herniation.",
    "Sodium imbalance: low sodium = neurological symptoms. High sodium = thirst, dry mucous membranes, agitation.",
    {"0":"Hypernatremia is sodium >145 mEq/L; 128 is below normal.","2":"Normal sodium is 135-145 mEq/L; 128 is significantly below normal.","3":"Hyperkalemia is elevated potassium, not sodium."}),

  q("REX-PN","Fluid and Electrolytes","Fluid and Electrolytes",3,
    "A client receiving IV normal saline develops crackles in the lungs, jugular vein distension, and peripheral edema. The nurse suspects:",
    ["Dehydration","Fluid volume excess (hypervolemia)","Pneumonia","Allergic reaction to the IV fluid"],1,
    "Crackles, JVD, and peripheral edema are classic signs of fluid volume excess. The nurse should slow or stop the infusion, elevate the HOB, notify the provider, and prepare to administer diuretics as ordered.",
    "Fluid overload triad: crackles (pulmonary edema), JVD (venous congestion), peripheral edema. Immediate action: slow/stop infusion.",
    "Fluid overload questions: recognize the triad and prioritize reducing the fluid load (slow/stop IV, position upright, diuretics).",
    {"0":"Dehydration presents with tachycardia, poor skin turgor, and dry mucous membranes—the opposite of these findings.","2":"Pneumonia may cause crackles but not JVD and peripheral edema simultaneously.","3":"Allergic reactions present with urticaria, pruritus, and possibly anaphylaxis, not fluid overload signs."}),

  q("RPN-CAT","Fluid and Electrolytes","Fluid and Electrolytes",4,
    "A client with a calcium level of 6.8 mg/dL develops a positive Trousseau's sign. The nurse should prepare to:",
    ["Restrict calcium intake","Administer IV calcium gluconate slowly with cardiac monitoring","Administer a loop diuretic","Increase phosphorus supplementation"],1,
    "Positive Trousseau's sign (carpopedal spasm with BP cuff inflation) indicates hypocalcemia (normal 8.5-10.5 mg/dL). Severe hypocalcemia requires IV calcium gluconate given slowly with cardiac monitoring to prevent arrhythmias.",
    "Hypocalcemia signs: Trousseau's (carpopedal spasm), Chvostek's (facial twitch), tetany, laryngospasm. Treat with IV calcium gluconate.",
    "Low calcium + positive Trousseau/Chvostek = IV calcium gluconate. Always monitor the heart during IV calcium administration.",
    {"0":"The client already has critically low calcium; restricting it would worsen the deficiency.","2":"Loop diuretics increase calcium excretion, which would worsen hypocalcemia.","3":"Increasing phosphorus would further lower calcium due to the inverse relationship between calcium and phosphorus."}),

  q("REX-PN","Fluid and Electrolytes","Fluid and Electrolytes",1,
    "A client who has been vomiting for three days is at risk for which acid-base imbalance?",
    ["Respiratory acidosis","Metabolic alkalosis from loss of gastric acid","Respiratory alkalosis","No acid-base imbalance expected"],1,
    "Prolonged vomiting causes loss of hydrochloric acid (HCl) from the stomach, leading to metabolic alkalosis (elevated pH and bicarbonate). The client also loses potassium and chloride.",
    "Vomiting = loss of HCl = metabolic alkalosis. Diarrhea = loss of bicarbonate = metabolic acidosis. They cause opposite imbalances.",
    "Vomiting vs diarrhea acid-base: vomiting = alkalosis (lose acid), diarrhea = acidosis (lose base).",
    {"0":"Respiratory acidosis results from CO2 retention, not GI losses.","2":"Respiratory alkalosis is caused by hyperventilation, not vomiting.","3":"Prolonged vomiting always causes acid-base disturbances due to HCl loss."}),

  q("REX-PN","Fluid and Electrolytes","Fluid and Electrolytes",3,
    "A client with hypokalemia may exhibit which ECG finding?",
    ["Peaked T waves","Flattened T waves and prominent U waves","Widened QRS complex","ST-segment elevation"],1,
    "Hypokalemia causes flattened T waves, prominent U waves, and ST-segment depression on ECG. Severe hypokalemia can lead to dangerous arrhythmias including ventricular fibrillation.",
    "Hypokalemia ECG: flat T waves + U waves. Hyperkalemia ECG: peaked/tall T waves + widened QRS.",
    "Potassium and ECG: know the characteristic findings for both hypo and hyperkalemia.",
    {"0":"Peaked T waves are the hallmark ECG finding of hyperkalemia, not hypokalemia.","2":"Widened QRS complex is associated with severe hyperkalemia, not hypokalemia.","3":"ST-segment elevation is associated with myocardial infarction or pericarditis, not hypokalemia."}),

  q("REX-PN","Fluid and Electrolytes","Fluid and Electrolytes",2,
    "The nurse should prioritize potassium replacement in which client?",
    ["Client with a potassium of 4.2 mEq/L","Client taking digoxin with a potassium of 3.2 mEq/L","Client with mild dehydration","Client with hypernatremia"],1,
    "Hypokalemia increases the risk of digoxin toxicity because potassium and digoxin compete for binding sites on the sodium-potassium pump. A potassium of 3.2 in a client on digoxin requires urgent replacement.",
    "Digoxin + hypokalemia = increased toxicity risk. Always monitor potassium closely in clients on digoxin.",
    "Potassium replacement priority: clients on digoxin have the highest urgency due to the synergistic toxicity risk.",
    {"0":"A potassium of 4.2 is within normal range (3.5-5.0 mEq/L) and does not require replacement.","2":"Mild dehydration may need fluid replacement but does not specifically require potassium replacement as a priority.","3":"Hypernatremia requires fluid replacement, not specifically potassium."}),

  q("RPN-CAT","Fluid and Electrolytes","Fluid and Electrolytes",3,
    "A client with a magnesium level of 1.0 mEq/L is being treated with IV magnesium sulfate. The nurse should monitor for:",
    ["Hypertension and tachycardia","Loss of deep tendon reflexes, respiratory depression, and hypotension","Hyperactive reflexes and seizures","Elevated blood glucose"],1,
    "IV magnesium can cause toxicity: loss of DTRs (earliest sign), respiratory depression, hypotension, and cardiac arrest. The nurse must check DTRs before each dose and have calcium gluconate available as the antidote.",
    "IV magnesium monitoring: check DTRs (loss = earliest toxicity sign), respiratory rate (>12/min), and urine output. Antidote: calcium gluconate.",
    "Magnesium sulfate infusion: DTR loss is the first sign of toxicity. Always check reflexes before continuing the infusion.",
    {"0":"Magnesium causes vasodilation leading to hypotension, not hypertension. It also causes bradycardia, not tachycardia.","2":"Hyperactive reflexes and seizures are signs of low magnesium (hypomagnesemia), not magnesium excess from treatment.","3":"Magnesium sulfate does not directly affect blood glucose levels."}),

  // ===== DIABETES MANAGEMENT (7 questions) =====
  q("REX-PN","Endocrine","Diabetes Management",2,
    "A client with type 2 diabetes asks about the purpose of monitoring hemoglobin A1c. The nurse explains that it measures:",
    ["Current blood glucose at the time of the test","Average blood glucose control over the previous 2-3 months","Insulin resistance levels","Kidney function related to diabetes"],1,
    "HbA1c reflects the percentage of hemoglobin glycated over the lifespan of red blood cells (approximately 120 days/2-3 months). The ADA target is <7% for most adults. Each 1% change corresponds to approximately 30 mg/dL average glucose change.",
    "A1c reflects 2-3 month glucose average. Target <7%. Does not replace daily glucose monitoring.",
    "A1c questions: always about long-term control (2-3 months), not current glucose. Know the target (<7%).",
    {"0":"A1c does not measure the current blood glucose level; a fingerstick or lab glucose does that.","2":"Insulin resistance is assessed through fasting insulin levels and glucose tolerance testing, not A1c.","3":"Kidney function in diabetes is monitored via serum creatinine, BUN, and urine albumin, not A1c."}),

  q("REX-PN","Endocrine","Diabetes Management",3,
    "A client with type 1 diabetes is experiencing the dawn phenomenon. The nurse explains this as:",
    ["Rebound hyperglycemia from nocturnal hypoglycemia","Early morning hyperglycemia caused by counter-regulatory hormones released between 4-8 AM","Low blood sugar upon waking","Normal glucose patterns in diabetes"],1,
    "The dawn phenomenon is caused by the release of growth hormone and cortisol in the early morning hours (4-8 AM), which raise blood glucose. Treatment may include adjusting evening insulin timing or adding a bedtime dose.",
    "Dawn phenomenon = early AM hormone surge → hyperglycemia. Somogyi = nighttime hypoglycemia → rebound hyperglycemia. Different causes, similar result.",
    "Distinguish dawn (hormone-driven) from Somogyi (rebound from hypo). Check 3 AM glucose to differentiate.",
    {"0":"Rebound hyperglycemia from nocturnal hypoglycemia describes the Somogyi effect, not the dawn phenomenon.","2":"Dawn phenomenon causes hyperglycemia, not hypoglycemia, upon waking.","3":"Consistently elevated morning glucose is not normal and requires intervention."}),

  q("RPN-CAT","Endocrine","Diabetes Management",3,
    "A client with diabetic ketoacidosis has a blood glucose of 450 mg/dL, pH 7.22, and positive ketones. The priority nursing intervention is:",
    ["Administer oral hypoglycemic agents","Begin IV insulin infusion and aggressive IV fluid resuscitation with normal saline","Give subcutaneous insulin and encourage oral fluids","Administer sodium bicarbonate immediately"],1,
    "DKA treatment priorities: IV fluid resuscitation (corrects dehydration and improves perfusion), continuous IV insulin infusion (reduces glucose and stops ketogenesis), and electrolyte replacement (especially potassium). Bicarbonate is reserved for pH <6.9.",
    "DKA treatment triad: IV fluids (NS first), IV insulin infusion, potassium replacement. Monitor glucose hourly.",
    "DKA management: fluids + IV insulin + potassium. Never give insulin without checking potassium first (hypokalemia worsens with insulin).",
    {"0":"Oral agents are not used in acute DKA; IV insulin is required for rapid, titratable glucose control.","2":"Subcutaneous insulin and oral fluids are insufficient for DKA severity; IV routes are required for both.","3":"Sodium bicarbonate is reserved for severe acidosis (pH <6.9) because it can worsen hypokalemia and cause paradoxical CNS acidosis."}),

  q("REX-PN","Endocrine","Diabetes Management",1,
    "The nurse teaches a diabetic client about proper insulin storage. Opened insulin vials should be:",
    ["Kept in the freezer for long-term preservation","Stored at room temperature (up to 28 days) or refrigerated","Exposed to direct sunlight for sterilization","Heated before injection for better absorption"],1,
    "Once opened, insulin vials can be stored at room temperature for up to 28 days. Unopened vials should be refrigerated. Insulin should never be frozen or exposed to extreme heat or direct sunlight.",
    "Insulin storage: refrigerate unopened, room temperature once opened (28 days max). Never freeze or expose to heat.",
    "Insulin storage questions: room temperature for opened vials (28 days), refrigerate unopened. Freezing destroys insulin.",
    {"0":"Freezing destroys insulin structure and renders it inactive.","2":"Direct sunlight degrades insulin, reducing its effectiveness.","3":"Heating insulin can denature the protein and is not recommended before injection."}),

  q("REX-PN","Endocrine","Diabetes Management",3,
    "A client on an insulin pump who is exercising vigorously should be taught to:",
    ["Increase the basal insulin rate during exercise","Monitor blood glucose before, during, and after exercise, and consider temporary basal rate reduction","Skip all meals before exercising","Disconnect the pump completely during all exercise"],1,
    "Exercise increases insulin sensitivity and glucose utilization. Pump users should reduce basal rates or suspend delivery during vigorous exercise, carry fast-acting carbohydrates, and monitor glucose frequently to prevent hypoglycemia.",
    "Exercise + insulin pump: reduce basal rate, monitor glucose frequently, carry glucose tablets. Exercise increases insulin sensitivity.",
    "Pump management during exercise: temporary basal reduction, not complete disconnection or dose increase.",
    {"0":"Increasing basal insulin during exercise significantly increases hypoglycemia risk as exercise already enhances insulin sensitivity.","2":"Skipping meals before exercise increases hypoglycemia risk and reduces available energy.","3":"Complete disconnection interrupts all insulin delivery, which can lead to rapid hyperglycemia and DKA in type 1 diabetes."}),

  q("REX-PN","Endocrine","Diabetes Management",2,
    "When teaching a client to self-administer insulin, the nurse instructs about injection site rotation. The best practice is to:",
    ["Inject in the exact same spot each time","Rotate within the same anatomical region before moving to a new area","Use a different body area for each injection","Inject only in the abdomen"],1,
    "Rotating within the same region (e.g., abdomen) ensures consistent absorption rates while preventing lipodystrophy. Moving between different body areas (arm, thigh, abdomen) at each injection can cause unpredictable glucose levels.",
    "Insulin rotation: same region, different spots (1 inch apart). Abdomen has fastest absorption. Avoid lipodystrophy areas.",
    "Injection rotation questions: within-region rotation is correct. Cross-region rotation at each injection is incorrect.",
    {"0":"Injecting in the same spot causes lipodystrophy (tissue hardening) which impairs absorption.","2":"Changing body areas at each injection alters absorption rates, causing unpredictable glucose levels.","3":"While the abdomen has the most consistent absorption, other sites are used when rotating within one region at a time."}),

  q("RPN-CAT","Endocrine","Diabetes Management",4,
    "A client with diabetes presents with a blood glucose of 38 mg/dL and is unresponsive. The nurse should:",
    ["Give oral glucose gel","Administer glucagon IM or IV dextrose","Wait for the client to regain consciousness before intervening","Administer insulin"],1,
    "Severe hypoglycemia with unconsciousness requires parenteral treatment: glucagon IM/SubQ (stimulates hepatic glycogenolysis) or IV dextrose (D50 for adults). Oral glucose is contraindicated in unconscious clients due to aspiration risk.",
    "Unconscious hypoglycemia: glucagon IM or IV dextrose. NEVER give oral glucose to an unconscious client (aspiration risk).",
    "Hypoglycemia + unconscious = parenteral glucose only. Oral routes are contraindicated due to aspiration risk.",
    {"0":"Oral glucose gel is contraindicated in unconscious clients due to aspiration risk.","2":"Waiting is dangerous; severe hypoglycemia can cause brain damage and death if untreated.","3":"Insulin would further lower blood glucose, potentially causing death."}),

  // ===== MENTAL HEALTH (7 questions) =====
  q("REX-PN","Mental Health","Mental Health",2,
    "A client admitted with major depressive disorder has not eaten for 3 days and refuses to get out of bed. The priority nursing intervention is:",
    ["Encourage participation in group therapy immediately","Assess nutritional status and provide small, frequent meals or nutritional supplements","Allow the client to sleep without interruption","Assign the client to a vigorous exercise program"],1,
    "Meeting basic physiological needs (nutrition, hydration) takes priority over psychosocial interventions. Depressed clients may lack energy and motivation to eat. Small, frequent meals and supplements help meet nutritional requirements.",
    "Maslow's hierarchy: physiological needs (nutrition, safety) before psychosocial interventions. Always address basic needs first.",
    "Depression + not eating: use Maslow—physiological needs take priority. Nutrition before therapy.",
    {"0":"Group therapy requires energy and motivation that a severely depressed, malnourished client may not have yet.","2":"Extended uninterrupted sleep can worsen depression; a structured routine with activity is therapeutic.","3":"Vigorous exercise is inappropriate for a malnourished, severely depressed client; gentle activity can be introduced gradually."}),

  q("REX-PN","Mental Health","Mental Health",3,
    "A client with borderline personality disorder threatens self-harm if the nurse leaves the room. The therapeutic response is:",
    ["Stay in the room indefinitely to prevent harm","Acknowledge the client's distress, ensure safety, and maintain consistent boundaries","Ignore the threat and leave immediately","Tell the client their behavior is manipulative"],1,
    "BPD clients may use threats to control situations. The nurse acknowledges the emotions, assesses actual risk, ensures safety measures, and maintains consistent limits. Giving in reinforces the behavior; dismissing threatens the therapeutic relationship.",
    "BPD management: validate emotions, maintain boundaries, assess safety. Consistency among all staff is essential.",
    "BPD questions: the therapeutic answer balances empathy with firm boundaries. Never dismiss or fully accommodate.",
    {"0":"Staying indefinitely reinforces the threatening behavior and prevents the client from developing coping skills.","2":"Ignoring a self-harm threat without assessment violates safety obligations.","3":"Labeling behavior as manipulative is judgmental and damages the therapeutic relationship."}),

  q("RPN-CAT","Mental Health","Mental Health",4,
    "A client on the psychiatric unit is found with a ligature around their neck. After removing the ligature and calling for help, the nurse's next action is:",
    ["Document the incident","Assess airway, breathing, and circulation","Place the client in restraints","Administer anxiolytic medication"],1,
    "After removing the immediate danger and calling for help, ABC assessment is the priority. Check airway patency, breathing adequacy, and circulation. Medical stabilization precedes all other interventions including documentation and psychiatric assessment.",
    "Suicide attempt response: remove means, call for help, ABCs, medical stabilization, then 1:1 observation and psychiatric evaluation.",
    "Emergency response to suicide attempt: ABCs always come first after removing the immediate threat.",
    {"0":"Documentation is essential but comes after ensuring the client is medically stable.","2":"Restraints may be needed later but ABCs take priority in the immediate emergency.","3":"Medication administration follows medical stabilization and assessment."}),

  q("REX-PN","Mental Health","Mental Health",1,
    "Therapeutic communication involves which technique?",
    ["Giving advice about what the client should do","Using open-ended questions to encourage the client to express feelings","Changing the subject when the client becomes emotional","Sharing personal experiences to relate to the client"],1,
    "Open-ended questions encourage clients to elaborate on their thoughts and feelings, promoting self-exploration and therapeutic dialogue. They cannot be answered with a simple yes or no.",
    "Therapeutic communication: open-ended questions, reflection, silence, summarizing. Non-therapeutic: advice-giving, false reassurance, changing the subject.",
    "Communication technique questions: open-ended questions and active listening are almost always the correct therapeutic approach.",
    {"0":"Giving advice is non-therapeutic as it takes control away from the client and imposes the nurse's perspective.","2":"Changing the subject is a non-therapeutic blocking technique that dismisses the client's emotions.","3":"Sharing personal experiences shifts the focus from the client to the nurse and is generally non-therapeutic."}),

  q("REX-PN","Mental Health","Mental Health",3,
    "A client with schizophrenia tells the nurse that the television is sending special messages meant only for them. This is an example of:",
    ["Hallucination","Delusion of reference","Thought broadcasting","Loose association"],1,
    "A delusion of reference is the false belief that random events, objects, or other people's actions are directed specifically at the person. Believing the TV sends personal messages is a classic example.",
    "Types of delusions: reference (events aimed at them), persecution (being harmed), grandeur (inflated self-worth), control (external control of thoughts/actions).",
    "Delusion identification: reference = external events targeting them. Differentiate from hallucinations (sensory experiences).",
    {"0":"Hallucinations are false sensory perceptions (hearing, seeing things). The client is interpreting real stimuli (TV) with false meaning.","2":"Thought broadcasting is the belief that one's thoughts can be heard by others, not that TV sends messages.","3":"Loose association is a speech pattern where ideas shift between unrelated topics without logical connection."}),

  q("REX-PN","Mental Health","Mental Health",2,
    "When caring for a client with anorexia nervosa, which nursing intervention is most appropriate during mealtime?",
    ["Allow the client to eat alone in their room for comfort","Sit with the client during meals and for 30-60 minutes afterward","Allow unlimited bathroom access during and after meals","Provide very large meal portions to increase caloric intake"],1,
    "Sitting with anorexia clients during meals provides support and supervision. Remaining for 30-60 minutes after prevents purging or food disposal. Meals should be moderate portions with gradual caloric increases.",
    "Anorexia mealtime management: supervised meals, post-meal observation (30-60 min), moderate portions, gradual caloric increase.",
    "Eating disorder mealtime questions: supervision during and after meals is the key intervention.",
    {"0":"Eating alone allows food disposal and lacks therapeutic support. Supervision is essential.","2":"Unlimited bathroom access enables purging behavior. Bathroom use should be supervised or restricted post-meal.","3":"Very large portions are overwhelming and may increase anxiety. Calories should be increased gradually."}),

  q("RPN-CAT","Mental Health","Mental Health",3,
    "A client with bipolar disorder in a manic episode has not slept in 3 days and is extremely agitated. The priority nursing intervention is:",
    ["Engage the client in a lengthy group discussion","Provide a safe, low-stimulation environment and ensure adequate nutrition and hydration","Encourage the client to exercise vigorously to burn off energy","Assign the client a complex craft project"],1,
    "Manic clients need reduced stimulation, safety, rest, and basic needs met. They may not recognize hunger or thirst. A calm environment with minimal stimuli helps reduce agitation. Redirect excessive energy into brief, non-stimulating activities.",
    "Mania priorities: safety, reduce stimulation, meet basic needs (nutrition, hydration, sleep). Redirect rather than restrict.",
    "Manic episode management: low stimulation + basic needs. Avoid overstimulating activities or discussions.",
    {"0":"Group discussions may overstimulate a manic client and escalate agitation.","2":"Vigorous exercise may further stimulate the client and prevent rest.","3":"Complex projects may frustrate an agitated client who has difficulty concentrating during mania."}),

  // ===== PEDIATRICS (7 questions) =====
  q("REX-PN","Pediatrics","Pediatrics",2,
    "The nurse teaches parents about introducing solid foods to an infant. The recommended age to begin is:",
    ["2 months","4-6 months, starting with iron-fortified cereal","8-10 months","12 months"],1,
    "Solid food introduction is recommended at 4-6 months when the infant can sit with support, has good head control, shows interest in food, and the extrusion reflex diminishes. Iron-fortified single-grain cereal is the traditional first food.",
    "Solid food introduction: 4-6 months. Signs of readiness: head control, sitting with support, interest in food, extrusion reflex fading.",
    "Infant feeding questions: solid foods at 4-6 months. Before 4 months, the GI system is not mature enough.",
    {"0":"At 2 months, the infant's GI system is too immature for solid foods, and the extrusion reflex is still strong.","2":"Waiting until 8-10 months may increase the risk of iron deficiency and delay developmental feeding milestones.","3":"By 12 months, the infant should already be eating a variety of solid foods; starting this late delays nutrition."}),

  q("REX-PN","Pediatrics","Pediatrics",3,
    "A child with acute epiglottitis presents with drooling, tripod positioning, and high fever. The nurse should:",
    ["Immediately visualize the throat with a tongue depressor","Keep the child calm, avoid examining the throat, and prepare for possible emergency intubation","Encourage the child to lie flat for comfort","Administer oral antibiotics immediately"],1,
    "Epiglottitis is a medical emergency. Never examine the throat (may cause complete airway obstruction). Keep the child calm in an upright position, have emergency intubation equipment ready, and prepare for IV antibiotics.",
    "Epiglottitis: do NOT examine the throat. Keep upright, keep calm, prepare for emergency airway management.",
    "Epiglottitis vs croup: epiglottitis = high fever, drooling, tripod position, DO NOT examine throat. Croup = barky cough, stridor.",
    {"0":"A tongue depressor can trigger laryngospasm and complete airway obstruction in epiglottitis.","2":"Lying flat can worsen airway obstruction; the child should remain upright in a position of comfort.","3":"Oral medications are inappropriate; the child may not be able to swallow and IV access is needed for emergency management."}),

  q("RPN-CAT","Pediatrics","Pediatrics",4,
    "A newborn is diagnosed with pyloric stenosis. The classic presentation includes:",
    ["Bile-stained projectile vomiting","Non-bilious projectile vomiting, palpable olive-shaped mass, and visible peristaltic waves","Diarrhea with bloody stools","Abdominal distension with absent bowel sounds"],1,
    "Pyloric stenosis causes hypertrophy of the pyloric sphincter. Vomiting is projectile and non-bilious (obstruction is above the bile duct). An olive-shaped mass is palpable in the RUQ. Visible peristaltic waves move left to right.",
    "Pyloric stenosis: non-bilious projectile vomiting + olive-shaped mass + visible peristaltic waves. Treatment: pyloromyotomy.",
    "Non-bilious vs bilious vomiting: pyloric stenosis = non-bilious (above bile duct). Bilious = obstruction below the ampulla of Vater.",
    {"0":"Bile-stained vomiting indicates obstruction below the ampulla of Vater; pyloric stenosis is above it, producing non-bilious vomiting.","2":"Diarrhea with bloody stools is characteristic of intussusception or necrotizing enterocolitis, not pyloric stenosis.","3":"Pyloric stenosis shows visible peristaltic waves and active bowel sounds, not absent sounds and distension."}),

  q("REX-PN","Pediatrics","Pediatrics",1,
    "The nurse teaches parents about the appropriate car seat for a 2-year-old child weighing 12 kg. The recommendation is:",
    ["Forward-facing car seat","Rear-facing car seat until the child reaches the maximum height/weight limit","Booster seat with seat belt","No car seat needed at this age"],1,
    "AAP recommends rear-facing car seats for as long as possible, until the child reaches the maximum height and weight limit for their convertible car seat. Most convertible seats accommodate rear-facing up to 40 lbs (18 kg).",
    "Car seat safety: rear-facing as long as possible (up to seat limits). This is the safest position for young children in a crash.",
    "Car seat questions: rear-facing is correct for toddlers until they exceed the seat's rear-facing limits.",
    {"0":"While forward-facing is the next step, the AAP recommends rear-facing for as long as possible.","2":"Booster seats are for children who have outgrown forward-facing car seats (typically 4+ years and 40+ lbs).","3":"Car seats are required by law and essential for child safety in all vehicles."}),

  q("REX-PN","Pediatrics","Pediatrics",3,
    "A school-age child with type 1 diabetes has a blood glucose of 55 mg/dL at school and is alert and oriented. The school nurse should:",
    ["Call parents and wait for them to arrive","Give 15 grams of fast-acting carbohydrate and recheck glucose in 15 minutes","Administer glucagon IM","Send the child back to class and monitor"],1,
    "For conscious hypoglycemia, follow the Rule of 15: give 15g fast-acting carbohydrate (juice, glucose tablets), wait 15 minutes, recheck. If still low, repeat. Once stable, provide a protein snack to sustain glucose levels.",
    "Rule of 15: 15g carbs → wait 15 min → recheck → repeat if needed → follow with protein snack once stable.",
    "Conscious hypoglycemia: 15g fast-acting carbs. Unconscious: glucagon. Always recheck in 15 minutes.",
    {"0":"Waiting for parents delays necessary treatment of an acute medical condition.","2":"Glucagon is reserved for unconscious or unable-to-swallow hypoglycemia; this child is alert and oriented.","3":"Sending a hypoglycemic child back to class without treatment is dangerous and could lead to loss of consciousness."}),

  q("REX-PN","Pediatrics","Pediatrics",2,
    "When assessing pain in a preverbal toddler, the nurse should use:",
    ["A 0-10 numeric pain scale","The FLACC behavioral pain scale","The Wong-Baker FACES scale","Patient self-report only"],1,
    "The FLACC scale assesses pain in preverbal/nonverbal children using five behavioral categories: Face, Legs, Activity, Cry, and Consolability. Each is scored 0-2 for a total of 0-10.",
    "Preverbal pain assessment: FLACC scale (behavioral). Verbal children (3+): Wong-Baker FACES. Adults: numeric 0-10.",
    "Pain assessment tool selection is age-dependent: FLACC for preverbal, FACES for young verbal children, numeric for older children and adults.",
    {"0":"Numeric scales require abstract thinking and verbal ability, which preverbal toddlers lack.","2":"Wong-Baker FACES requires the child to point and understand the concept of faces representing pain levels, suitable for ages 3+.","3":"Preverbal children cannot self-report pain verbally; behavioral observation tools are required."}),

  q("RPN-CAT","Pediatrics","Pediatrics",3,
    "A child with meningococcal meningitis is admitted. In addition to droplet precautions, the nurse should assess close contacts for:",
    ["No special monitoring needed for contacts","Need for prophylactic antibiotics (rifampin or ciprofloxacin)","Immediate hospitalization of all contacts","Vaccination records only"],1,
    "Close contacts of meningococcal meningitis (household members, kissing contacts, daycare contacts) require prophylactic antibiotics (rifampin, ciprofloxacin, or ceftriaxone) within 24 hours of diagnosis to prevent secondary cases.",
    "Meningococcal meningitis: droplet precautions + prophylactic antibiotics for close contacts within 24 hours.",
    "Meningococcal disease is one of the few conditions requiring prophylaxis for contacts. Know the contacts and antibiotics.",
    {"0":"Close contacts are at significantly elevated risk and require prophylaxis.","2":"Hospitalization is unnecessary for asymptomatic contacts; prophylactic antibiotics are sufficient.","3":"While vaccination status is important, immediate chemoprophylaxis is the priority intervention for close contacts."}),

  // ===== MATERNITY (7 questions) =====
  q("REX-PN","Maternal/Newborn","Maternity",2,
    "During the first stage of labor, the nurse monitors fetal heart rate patterns. A reassuring fetal heart rate pattern includes:",
    ["Late decelerations with minimal variability","A baseline of 130 bpm with moderate variability and accelerations","Prolonged bradycardia below 100 bpm","Sinusoidal pattern"],1,
    "A reassuring (Category I) fetal heart rate pattern includes: baseline 110-160 bpm, moderate variability, accelerations present, and no late or variable decelerations. This indicates adequate fetal oxygenation.",
    "Reassuring FHR: baseline 110-160, moderate variability, accelerations, no late decels. Non-reassuring: absent variability, late/prolonged decels.",
    "FHR pattern questions: moderate variability is the most important indicator of fetal well-being.",
    {"0":"Late decelerations indicate uteroplacental insufficiency and are a non-reassuring finding.","2":"Prolonged bradycardia below 100 bpm indicates fetal distress requiring immediate intervention.","3":"Sinusoidal patterns are associated with severe fetal anemia and are a non-reassuring finding."}),

  q("REX-PN","Maternal/Newborn","Maternity",3,
    "A postpartum client has a boggy uterine fundus and increased vaginal bleeding. The nurse's first action is:",
    ["Notify the provider","Massage the uterine fundus","Administer IV oxytocin","Prepare for surgery"],1,
    "Uterine atony (boggy uterus) is the most common cause of postpartum hemorrhage. Fundal massage is the immediate nursing intervention to stimulate uterine contraction. If massage is ineffective, uterotonics (oxytocin, methylergonovine) are administered.",
    "Boggy fundus = uterine atony = fundal massage first. If massage fails, administer uterotonics (oxytocin).",
    "Postpartum hemorrhage: boggy uterus → massage first (nursing action), then medications (medical order).",
    {"0":"While the provider should be notified, fundal massage is the immediate nursing intervention that can be done without a physician's order.","2":"IV oxytocin may be needed but fundal massage is the first nursing action.","3":"Surgery is a last resort after conservative measures fail."}),

  q("RPN-CAT","Maternal/Newborn","Maternity",4,
    "A client at 34 weeks gestation presents with painless, bright red vaginal bleeding. The nurse suspects placenta previa and should:",
    ["Perform a digital vaginal examination to assess cervical dilation","Avoid vaginal examination, maintain bed rest, and prepare for ultrasound","Encourage ambulation to assess bleeding amount","Discharge the client with instructions to monitor at home"],1,
    "Placenta previa: the placenta covers the cervical os. Vaginal examination can disrupt the placenta, causing life-threatening hemorrhage. Diagnosis is confirmed by ultrasound. Bed rest, IV access, and fetal monitoring are priorities.",
    "Placenta previa: painless bright red bleeding, NO vaginal exam. Abruption: painful dark red bleeding with rigid abdomen.",
    "Placenta previa: the golden rule is NEVER do a vaginal exam. Ultrasound confirms diagnosis.",
    {"0":"Vaginal examination is absolutely contraindicated in suspected placenta previa—it can cause massive, life-threatening hemorrhage.","2":"Ambulation is not safe with active placental bleeding; bed rest is required.","3":"Active vaginal bleeding in the third trimester requires hospital evaluation and monitoring, not home management."}),

  q("REX-PN","Maternal/Newborn","Maternity",1,
    "The nurse teaches a pregnant client about foods to avoid during pregnancy. Which food poses the greatest risk for listeriosis?",
    ["Well-cooked chicken","Unpasteurized soft cheeses","Pasteurized milk","Thoroughly washed vegetables"],1,
    "Listeria monocytogenes can be found in unpasteurized soft cheeses (brie, feta, queso fresco), deli meats, and smoked seafood. Listeriosis during pregnancy can cause miscarriage, stillbirth, or neonatal infection.",
    "Pregnancy food safety: avoid unpasteurized dairy, deli meats (unless heated), raw fish, and high-mercury fish.",
    "Pregnancy food safety questions: unpasteurized products and undercooked meats are the common correct answers for infection risk.",
    {"0":"Well-cooked chicken is safe as cooking kills most food-borne pathogens.","2":"Pasteurized milk is safe; pasteurization kills listeria and other pathogens.","3":"Thoroughly washed vegetables are generally safe for pregnant women."}),

  q("REX-PN","Maternal/Newborn","Maternity",3,
    "A laboring client receives epidural anesthesia. The nurse should monitor closely for:",
    ["Hypertension","Maternal hypotension and fetal heart rate changes","Hyperglycemia","Increased urine output"],1,
    "Epidural anesthesia causes sympathetic blockade leading to vasodilation and hypotension. This can reduce placental perfusion, causing fetal heart rate changes. IV fluid bolus before epidural and left lateral positioning help prevent hypotension.",
    "Epidural complications: hypotension (most common), urinary retention, headache (if dural puncture), respiratory depression (rare).",
    "Epidural + monitoring = hypotension is the primary concern. Pre-hydration with IV fluids helps prevent it.",
    {"0":"Epidural anesthesia causes hypotension from vasodilation, not hypertension.","2":"Epidural anesthesia does not directly affect blood glucose levels.","3":"Epidural anesthesia often causes urinary retention, not increased output, due to sensory blockade."}),

  q("REX-PN","Maternal/Newborn","Maternity",2,
    "Immediately after delivery, the nurse assesses the newborn using the APGAR score. Which finding receives a score of 2 for heart rate?",
    ["Heart rate absent","Heart rate below 100 bpm","Heart rate above 100 bpm","Heart rate exactly 100 bpm"],2,
    "APGAR heart rate scoring: 0 = absent, 1 = below 100 bpm, 2 = above 100 bpm. Heart rate is the most important single indicator of newborn status.",
    "APGAR heart rate: 0=absent, 1=<100, 2=>100. Heart rate is the most critical component for determining resuscitation needs.",
    "APGAR scoring: know the criteria for each component. Heart rate above 100 = best score (2).",
    {"0":"Absent heart rate scores 0, requiring immediate resuscitation.","1":"Heart rate below 100 bpm scores 1 and may indicate the need for stimulation or intervention.","3":"The scoring is above or below 100; exactly 100 would score 1 since it is not above 100."}),

  q("RPN-CAT","Maternal/Newborn","Maternity",3,
    "A pregnant client at 28 weeks with Rh-negative blood type and an Rh-positive partner should receive:",
    ["No treatment until delivery","RhoGAM (Rh immune globulin) at 28 weeks and within 72 hours after delivery","Blood transfusion","Corticosteroids for fetal lung maturity"],1,
    "RhoGAM prevents Rh sensitization by destroying any fetal Rh-positive cells in the maternal circulation before the mother's immune system can produce antibodies. Given at 28 weeks and within 72 hours post-delivery if the newborn is Rh-positive.",
    "RhoGAM timing: 28 weeks gestation + within 72 hours after delivery. Also given after any event that may cause fetal-maternal hemorrhage.",
    "Rh incompatibility: RhoGAM at 28 weeks is the key timepoint tested. Also given after amniocentesis, trauma, or miscarriage.",
    {"0":"Waiting until delivery risks Rh sensitization that can affect current and future pregnancies.","2":"Blood transfusion is not indicated for Rh incompatibility prevention; RhoGAM is the specific prophylaxis.","3":"Corticosteroids for fetal lung maturity are given for threatened preterm delivery, not Rh incompatibility."}),

  // ===== GERIATRICS (7 questions) =====
  q("REX-PN","Geriatrics","Geriatrics",1,
    "The nurse is caring for an elderly client and notices reduced skin turgor. The best site to assess skin turgor in an older adult is:",
    ["The back of the hand","The forehead or sternum","The forearm","The abdomen"],1,
    "In elderly clients, the skin on the hands and extremities naturally loses elasticity with aging, making these sites unreliable for turgor assessment. The forehead and sternum retain skin elasticity longer and provide more accurate assessment.",
    "Skin turgor in elderly: assess on the forehead or sternum, not the hands (age-related elasticity loss causes false positives).",
    "Geriatric assessment modifications: know alternative sites for skin turgor. Standard sites give falsely abnormal results in elderly.",
    {"0":"The back of the hand is unreliable in elderly clients because skin naturally loses elasticity with aging.","2":"The forearm has reduced elasticity in aging skin, similar to the hand.","3":"The abdomen may have variable turgor in elderly clients and is less reliable than the forehead or sternum."}),

  q("REX-PN","Geriatrics","Geriatrics",3,
    "An elderly client prescribed multiple medications is at increased risk for falls due to:",
    ["Improved balance from medication effects","Polypharmacy causing dizziness, orthostatic hypotension, and sedation","Increased bone density from vitamin supplements","Enhanced coordination from pain medications"],1,
    "Polypharmacy (5+ medications) increases fall risk through additive side effects: dizziness, orthostatic hypotension, sedation, blurred vision, and cognitive impairment. Medication review and fall risk assessment are essential.",
    "Polypharmacy + falls: many medications (antihypertensives, sedatives, opioids, anticholinergics) increase fall risk in elderly.",
    "Polypharmacy questions: always consider the cumulative side effects and their impact on fall risk.",
    {"0":"Medications often impair balance rather than improve it, especially in combinations.","2":"Vitamin supplements generally do not increase bone density to a degree that prevents falls.","3":"Pain medications (especially opioids) cause sedation and dizziness, increasing fall risk rather than enhancing coordination."}),

  q("REX-PN","Geriatrics","Geriatrics",2,
    "The nurse teaches an elderly client about preventing urinary tract infections. Which instruction is most important?",
    ["Limit fluid intake to reduce frequency","Drink adequate fluids (1.5-2 liters daily) and practice proper perineal hygiene","Wear tight-fitting undergarments to prevent leakage","Delay voiding to strengthen the bladder"],1,
    "Adequate hydration dilutes urine and promotes regular voiding, flushing bacteria from the urinary tract. Proper perineal hygiene (front to back wiping) prevents fecal contamination of the urethra.",
    "UTI prevention: hydration, front-to-back hygiene, prompt voiding, avoid irritants (bubble baths). Cranberry may help prevent recurrence.",
    "UTI prevention in elderly: hydration and hygiene are the key teachable interventions.",
    {"0":"Limiting fluids concentrates urine and reduces flushing of bacteria, increasing UTI risk.","2":"Tight-fitting undergarments trap moisture and heat, promoting bacterial growth.","3":"Delaying voiding allows bacteria to multiply in the bladder, increasing infection risk."}),

  q("RPN-CAT","Geriatrics","Geriatrics",3,
    "An elderly client with a known history of dementia suddenly develops acute confusion with fluctuating consciousness. The nurse should assess for:",
    ["Normal progression of dementia","Delirium, which may indicate an underlying acute medical condition","Depression-related cognitive changes","Normal age-related memory changes"],1,
    "Delirium is an acute, fluctuating change in consciousness often triggered by infection (UTI is most common in elderly), medications, dehydration, or metabolic imbalances. It is potentially reversible when the underlying cause is treated.",
    "Delirium vs dementia: delirium is ACUTE onset, fluctuating, and REVERSIBLE. Dementia is gradual, progressive, and irreversible.",
    "Sudden confusion in a dementia patient: always suspect delirium superimposed on dementia. Find the treatable cause.",
    {"0":"Dementia has a gradual, progressive course. Sudden acute changes suggest delirium, not normal dementia progression.","2":"Depression can cause pseudodementia but typically has gradual onset, not acute fluctuating consciousness.","3":"Sudden fluctuating consciousness with acute onset is never a normal age-related change."}),

  q("REX-PN","Geriatrics","Geriatrics",2,
    "Fall prevention for an elderly client in the hospital includes:",
    ["Keeping the bed in the highest position","Keeping the bed in the lowest position with the call light within reach","Applying physical restraints prophylactically","Dimming all room lights at all times"],1,
    "Fall prevention strategies include low bed position, call light within reach, non-slip footwear, clear pathways, adequate lighting, and regular toileting assistance. Restraints actually increase fall risk and injury.",
    "Fall prevention bundle: low bed, call light accessible, non-slip shoes, clear path, adequate lighting, hourly rounding.",
    "Fall prevention questions: look for multiple environmental and behavioral interventions combined.",
    {"0":"A high bed increases the height of a potential fall, increasing injury severity.","2":"Physical restraints increase agitation, skin breakdown, and paradoxically increase fall risk and injury severity.","3":"Adequate lighting is needed to prevent falls; dimming all lights increases disorientation and fall risk."}),

  q("REX-PN","Geriatrics","Geriatrics",3,
    "The nurse notes that an elderly client's renal function has declined. This normal aging change affects medication therapy by:",
    ["Increasing drug excretion rates","Decreasing drug clearance, potentially requiring dose adjustments","Having no effect on medication dosing","Increasing the need for higher medication doses"],1,
    "Age-related decline in renal function (decreased GFR) reduces drug clearance, increasing the risk of drug accumulation and toxicity. Many medications require dose reduction or extended dosing intervals in elderly clients.",
    "Aging kidneys = decreased GFR = slower drug clearance = risk of toxicity. Start low, go slow with dosing in elderly.",
    "Renal function + elderly: reduced clearance means most drugs need lower doses or longer intervals. 'Start low, go slow.'",
    {"0":"Decreased renal function slows drug excretion, not increases it.","2":"Reduced renal function significantly affects medication dosing and cannot be ignored.","3":"Higher doses would increase toxicity risk; lower doses are typically needed due to reduced clearance."}),

  q("RPN-CAT","Geriatrics","Geriatrics",4,
    "An elderly client on warfarin, metformin, lisinopril, and amlodipine develops acute kidney injury. The nurse should anticipate which medication adjustments?",
    ["Continue all medications at current doses","Hold metformin and adjust warfarin and lisinopril doses based on renal function","Increase all medication doses","Discontinue all medications permanently"],1,
    "AKI requires medication review: metformin must be held (risk of lactic acidosis), warfarin may need dose adjustment (altered metabolism), and ACE inhibitors (lisinopril) may worsen renal function. Amlodipine does not require renal dose adjustment.",
    "AKI medication management: hold metformin (lactic acidosis risk), adjust renally cleared drugs, and reassess nephrotoxic medications.",
    "AKI + polypharmacy: know which drugs to hold (metformin, ACEIs, NSAIDs) and which need dose adjustment.",
    {"0":"Continuing all medications without adjustment during AKI risks serious complications including lactic acidosis and further renal injury.","2":"Increasing doses during AKI would worsen drug accumulation and toxicity.","3":"Not all medications need permanent discontinuation; some can be restarted once renal function recovers."}),

  // ===== PAIN MANAGEMENT (7 questions) =====
  q("REX-PN","Pain Management","Pain Management",1,
    "The nurse's primary source of information about a client's pain is:",
    ["The nurse's own observation of pain behaviors","The client's self-report","Vital signs","Family members' assessment"],1,
    "Pain is a subjective experience; the client's self-report is the gold standard for pain assessment. While behavioral observation and vital signs provide supplementary information, they should not override the client's report.",
    "Pain is whatever the client says it is. Self-report is the most reliable indicator and should guide treatment.",
    "Pain assessment questions: self-report is always the gold standard. Never dismiss client-reported pain.",
    {"0":"Behavioral observations are supplementary but cannot replace the client's subjective experience.","2":"Vital signs may not change with chronic pain and are unreliable as sole pain indicators.","3":"Family assessment provides context but cannot substitute for the client's own report."}),

  q("REX-PN","Pain Management","Pain Management",3,
    "A client receiving morphine via PCA pump has a respiratory rate of 8 breaths per minute. The nurse should first:",
    ["Continue the morphine and recheck in one hour","Hold the PCA, stimulate the client, and prepare to administer naloxone","Increase the PCA dose to relieve pain","Administer supplemental oxygen only"],1,
    "Respiratory depression (RR <10) is the most serious adverse effect of opioid analgesics. The nurse should stop the PCA, stimulate the client, and be prepared to administer naloxone (Narcan) to reverse opioid effects.",
    "Opioid-induced respiratory depression: RR <10 → stop opioid, stimulate client, naloxone ready. Monitor for renarcotization.",
    "Respiratory rate <10 + opioid = stop the drug and prepare naloxone. This is always the correct action.",
    {"0":"A respiratory rate of 8 is dangerously low; continuing the morphine could lead to respiratory arrest.","2":"Increasing the dose when the client already has respiratory depression would be lethal.","3":"Supplemental oxygen alone does not address the underlying cause (opioid-induced respiratory depression)."}),

  q("REX-PN","Pain Management","Pain Management",2,
    "A nurse is preparing to administer a scheduled opioid analgesic. Before administration, the nurse should assess:",
    ["Blood pressure only","Pain level, respiratory rate, level of consciousness, and last dose timing","The client's food intake","Blood glucose level"],1,
    "Pre-opioid assessment includes current pain level, respiratory rate (hold if <12), level of consciousness, allergy history, and timing of last dose. These parameters identify contraindications and guide safe administration.",
    "Pre-opioid checklist: pain level, respiratory rate (>12), consciousness level, allergy status, and last dose timing.",
    "Before giving opioids: always check respiratory rate and LOC. RR <12 = hold and reassess.",
    {"0":"Blood pressure alone is insufficient; respiratory rate and consciousness level are critical safety assessments.","2":"Food intake is relevant for some medications but not the priority assessment before opioid administration.","3":"Blood glucose is unrelated to opioid administration safety."}),

  q("RPN-CAT","Pain Management","Pain Management",3,
    "A client with chronic pain is prescribed a fentanyl transdermal patch. The nurse should teach that:",
    ["The patch provides immediate pain relief","It takes 12-24 hours to reach therapeutic levels; a short-acting opioid may be needed initially","The patch should be applied to broken skin for better absorption","Multiple patches should be applied to the same site"],1,
    "Fentanyl patches take 12-24 hours to achieve steady-state levels after initial application. Short-acting opioids bridge the gap. Apply to flat, non-irritated, hairless skin. Rotate sites. Heat increases absorption and can cause overdose.",
    "Fentanyl patch: 12-24 hour onset, 72-hour duration. Avoid heat sources (heating pads, hot baths) which increase absorption.",
    "Transdermal fentanyl: delayed onset is the key teaching point. Heat avoidance prevents accidental overdose.",
    {"0":"The fentanyl patch has a delayed onset of 12-24 hours, not immediate relief.","2":"Broken skin increases absorption rate unpredictably, potentially causing overdose.","3":"Multiple patches at the same site can cause skin irritation and inconsistent absorption; sites should be rotated."}),

  q("REX-PN","Pain Management","Pain Management",2,
    "Non-pharmacological pain management techniques include:",
    ["Administering higher doses of opioids","Guided imagery, relaxation techniques, and cold/heat application","Withholding all pain medication","Using sedation for all pain"],1,
    "Non-pharmacological methods complement medication therapy: guided imagery, deep breathing, progressive muscle relaxation, heat/cold therapy, massage, distraction, music therapy, and TENS units reduce pain perception and enhance coping.",
    "Non-pharmacological pain management works best as adjuncts to medication, not replacements. Multimodal approaches improve outcomes.",
    "Pain management questions: multimodal approach (medications + non-pharmacological) is always the best strategy.",
    {"0":"Higher opioid doses are pharmacological interventions and carry increased side effect risks.","2":"Withholding pain medication when the client is in pain is unethical and inappropriate.","3":"Sedation for all pain is excessive and carries significant risks; targeted interventions are preferred."}),

  q("REX-PN","Pain Management","Pain Management",3,
    "A postoperative client reports pain of 8/10 despite receiving the scheduled dose of oral oxycodone 30 minutes ago. The nurse should:",
    ["Tell the client to wait longer for the medication to take effect","Administer the next scheduled dose early","Reassess pain, implement non-pharmacological measures, and notify the provider for possible analgesic adjustment","Assume the client is drug-seeking"],1,
    "Uncontrolled pain requires reassessment, non-pharmacological interventions, and communication with the provider for possible dose adjustment or additional analgesic orders. Oral opioids typically take 30-60 minutes for onset.",
    "Uncontrolled post-op pain: reassess, use adjuncts, notify provider. Never dismiss pain or assume drug-seeking behavior.",
    "Inadequate pain control: reassess, intervene with what's available, and advocate for the client with the provider.",
    {"0":"While oral opioids take time to peak, a pain level of 8/10 suggests the current regimen may be inadequate.","1":"Administering an early dose without an order violates medication safety protocols.","3":"Assuming drug-seeking behavior is judgmental and prevents appropriate pain management."}),

  q("RPN-CAT","Pain Management","Pain Management",4,
    "An elderly client with cancer pain is hesitant to take prescribed opioids due to fear of addiction. The nurse should explain that:",
    ["Addiction is common with prescribed opioids for cancer pain","Physical dependence and tolerance are normal physiological responses different from addiction, and cancer pain requires adequate treatment","The client should avoid opioids entirely","Pain medication should only be taken when pain is unbearable"],1,
    "Physical dependence (withdrawal symptoms if stopped) and tolerance (need for increased doses) are expected physiological responses. Addiction (psychological craving and compulsive use) is rare in clients taking opioids as prescribed for cancer pain.",
    "Addiction vs dependence vs tolerance: these are different concepts. Addiction is rare when opioids are taken as prescribed for cancer pain.",
    "Opioid education: distinguish addiction from dependence/tolerance. Cancer pain management should not be limited by unfounded addiction fears.",
    {"0":"Addiction rates are very low (< 1%) when opioids are taken as prescribed for cancer pain under medical supervision.","2":"Avoiding opioids when they are indicated for cancer pain leads to unnecessary suffering and reduced quality of life.","3":"Waiting until pain is unbearable makes pain harder to control; scheduled dosing maintains consistent pain control."}),

  // ===== WOUND CARE (7 questions) =====
  q("REX-PN","Wound Care","Wound Care",1,
    "When assessing a wound, the nurse documents granulation tissue as:",
    ["Black, hard, necrotic tissue","Beefy red, moist tissue with a granular appearance indicating healing","Yellow, stringy slough tissue","White, avascular tissue"],1,
    "Granulation tissue is healthy, beefy red, moist tissue with a granular appearance composed of new blood vessels and connective tissue. Its presence indicates the wound is healing properly in the proliferative phase.",
    "Wound bed colors: red (granulation = healing), yellow (slough = needs debridement), black (eschar = necrotic).",
    "Wound assessment: red = good (healing), yellow = needs attention, black = needs debridement. Color indicates wound status.",
    {"0":"Black, hard tissue is eschar (necrotic tissue), not granulation tissue.","2":"Yellow, stringy tissue is slough (dead cellular debris), indicating the wound needs cleaning or debridement.","3":"White, avascular tissue indicates poor blood supply and possible chronic wound state, not healthy granulation."}),

  q("REX-PN","Wound Care","Wound Care",3,
    "A client with a diabetic foot ulcer is being treated with wet-to-moist saline dressings. The purpose of keeping the wound bed moist is to:",
    ["Prevent bacterial growth","Promote autolytic debridement and create an optimal healing environment","Reduce the need for antibiotics","Dry the wound for faster healing"],1,
    "Moist wound healing promotes autolytic debridement (body's own enzymes dissolve necrotic tissue), supports cell migration, and accelerates healing. Dry wound environments slow healing and increase pain during dressing changes.",
    "Moist wound healing is the standard of care. It promotes faster healing, better autolytic debridement, and less painful dressing changes.",
    "Wound care questions: moist environment is correct. The old practice of drying wounds has been replaced by moist healing principles.",
    {"0":"While some dressings have antimicrobial properties, moisture alone does not prevent bacterial growth.","2":"Moist dressings do not replace antibiotics; they create an environment that supports the healing process.","3":"Drying wounds actually slows healing by preventing cell migration and increasing scab formation."}),

  q("RPN-CAT","Wound Care","Wound Care",4,
    "A client with a stage 3 pressure injury has yellow slough tissue covering 60% of the wound bed. The nurse should anticipate:",
    ["Applying a dry gauze dressing and leaving the wound alone","Debridement of the slough tissue to allow wound healing","Applying adhesive bandage strips to close the wound","Administering systemic antibiotics as the sole treatment"],1,
    "Slough tissue prevents wound healing by providing a medium for bacterial growth and preventing granulation tissue formation. Debridement methods include autolytic (moisture-retentive dressings), enzymatic (collagenase), mechanical, or sharp debridement.",
    "Slough tissue must be removed for wounds to heal. Choose debridement method based on wound characteristics, patient status, and available resources.",
    "Wound with slough: debridement is always needed. Know the different methods and when each is appropriate.",
    {"0":"Dry gauze does not promote healing or remove slough; it may cause further tissue damage upon removal.","2":"Stage 3 pressure injuries cannot be closed with adhesive strips; they heal by secondary intention.","3":"Systemic antibiotics treat wound infection but do not remove slough tissue; debridement is still required."}),

  q("REX-PN","Wound Care","Wound Care",2,
    "When changing a wound dressing, the nurse should remove the old dressing:",
    ["Quickly by pulling directly away from the wound","Gently in the direction of hair growth, moistening if adherent","Against the direction of hair growth for better cleaning","Without looking at the wound until the new dressing is in place"],1,
    "Removing dressings in the direction of hair growth reduces pain and skin trauma. Moistening adherent dressings with sterile saline prevents disruption of new granulation tissue and reduces discomfort.",
    "Dressing removal: direction of hair growth, moisten if stuck, assess the wound and drainage upon removal.",
    "Dressing change technique: gentle removal prevents tissue damage. Always assess the wound during the change.",
    {"0":"Quickly pulling a dressing can damage fragile granulation tissue and cause significant pain.","2":"Removing against hair growth increases pain and may cause skin tears, especially in elderly clients.","3":"The wound must be assessed during every dressing change to evaluate healing progress and detect complications."}),

  q("REX-PN","Wound Care","Wound Care",3,
    "A surgical incision is healing by primary intention. The nurse recognizes this means:",
    ["The wound edges are far apart and healing from the bottom up","The wound edges are approximated with sutures, staples, or adhesive","The wound is left open to heal on its own","The wound requires skin grafting"],1,
    "Primary intention healing occurs when wound edges are brought together (approximated) through closure methods. This results in minimal scarring and faster healing. Clean surgical incisions are the classic example.",
    "Primary intention: edges approximated, minimal scarring. Secondary intention: edges not closed, heals from bottom up, more scarring. Tertiary: delayed closure.",
    "Wound healing types: primary (closed), secondary (open, fills in), tertiary (initially open, closed later).",
    {"0":"Wound edges far apart healing from the bottom up describes secondary intention healing.","2":"A wound left open to heal describes secondary intention or intentional delayed closure (tertiary).","3":"Skin grafting is a surgical intervention for large wounds, not primary intention healing."}),

  q("REX-PN","Wound Care","Wound Care",2,
    "The nurse is assessing a pressure injury and notes that the wound extends into the subcutaneous tissue but bone and tendon are not visible. This is classified as:",
    ["Stage 1","Stage 2","Stage 3","Stage 4"],2,
    "Stage 3 pressure injury: full-thickness skin loss. Subcutaneous fat may be visible, but bone, tendon, and muscle are not exposed. Undermining and tunneling may be present. Stage 4 involves exposed bone, tendon, or muscle.",
    "Pressure injury staging: 1=intact skin/erythema, 2=partial thickness, 3=full thickness (no bone), 4=full thickness with exposed bone/muscle.",
    "Pressure injury staging: the key differentiator between stage 3 and 4 is whether bone/tendon/muscle is visible.",
    {"0":"Stage 1 has intact skin with non-blanchable erythema; there is no tissue loss.","1":"Stage 2 involves partial-thickness loss (epidermis/dermis), presenting as a blister or shallow ulcer.","3":"Stage 4 has full-thickness tissue loss with exposed bone, tendon, or muscle."}),

  q("RPN-CAT","Wound Care","Wound Care",3,
    "A client with a surgical wound develops increased redness, warmth, purulent drainage, and fever on postoperative day 4. The nurse should:",
    ["Apply a warm compress and continue routine wound care","Obtain wound culture, notify the provider, and anticipate antibiotic orders","Cover the wound with an occlusive dressing without further assessment","Reassure the client that this is normal healing"],1,
    "Signs of surgical site infection (redness, warmth, purulent drainage, fever) on post-op day 4 require wound culture before antibiotics, provider notification, and likely antibiotic therapy. Early detection and treatment prevent complications.",
    "SSI signs: increased redness, warmth, purulent drainage, fever, elevated WBC. Culture before antibiotics, then treat promptly.",
    "Wound infection assessment: culture the wound before starting antibiotics to identify the organism and guide targeted therapy.",
    {"0":"Warm compresses alone are insufficient for a wound infection; antibiotics and culture are needed.","2":"An occlusive dressing without assessment and treatment could trap bacteria and worsen the infection.","3":"Purulent drainage, fever, and increasing redness on day 4 are not normal healing signs; they indicate infection."}),

  // ===== MEDICATION ADMINISTRATION (7 questions) =====
  q("REX-PN","Pharmacology","Medication Administration",1,
    "Before administering any medication, the nurse verifies the five rights. These include right:",
    ["Patient, drug, dose, route, time","Patient, doctor, pharmacy, insurance, reason","Color, shape, size, taste, smell","Temperature, pressure, rate, volume, concentration"],0,
    "The five rights of medication administration are: right patient, right drug, right dose, right route, and right time. Additional rights include right documentation, right reason, right response, and right to refuse.",
    "Five rights: patient, drug, dose, route, time. Additional rights include documentation and client's right to refuse.",
    "Medication safety: the five rights are the foundation. Many sources now include additional rights (documentation, reason, response).",
    {"1":"Doctor, pharmacy, and insurance are not part of the five rights of medication administration.","2":"Physical characteristics of medications are verified during pharmacy dispensing, not through the five rights framework.","3":"These are monitoring parameters, not medication administration rights."}),

  q("REX-PN","Pharmacology","Medication Administration",2,
    "A client has difficulty swallowing tablets. The nurse should first:",
    ["Crush all tablets and mix with applesauce","Check if the medication is available in an alternative form (liquid, dissolving tablet)","Administer all medications by injection","Skip the medication until the client can swallow"],1,
    "Many medications are available in alternative forms (liquids, dissolving tablets, patches). Not all tablets can be crushed—enteric-coated, sustained-release, and sublingual medications must not be crushed.",
    "Dysphagia medication solutions: check for alternatives first. Never crush enteric-coated or sustained-release formulations.",
    "Swallowing difficulty + medication: check alternatives before crushing. Some formulations are dangerous when crushed.",
    {"0":"Not all tablets can be safely crushed; enteric-coated and sustained-release medications can cause harm if crushed.","2":"Switching all medications to injections is unnecessary, more invasive, and potentially painful.","3":"Skipping medications compromises treatment; alternative formulations should be explored first."}),

  q("RPN-CAT","Pharmacology","Medication Administration",3,
    "When administering an intradermal injection, the nurse inserts the needle at:",
    ["90-degree angle","15-degree angle with the bevel up","45-degree angle","Any angle convenient for the nurse"],1,
    "Intradermal injections (TB tests, allergy testing) use a 15-degree angle with the bevel up, creating a small bleb or wheal just below the skin surface. A 25-27 gauge, 3/8-5/8 inch needle is used.",
    "Injection angles: intradermal=15°, subcutaneous=45-90°, intramuscular=90°. Match the angle to the route.",
    "Injection technique: know the angle for each route. Intradermal is the shallowest (15 degrees, bevel up).",
    {"0":"90 degrees is the angle for intramuscular injections, not intradermal.","2":"45 degrees is used for subcutaneous injections in some clients, not intradermal.","3":"The specific angle ensures proper medication placement in the correct tissue layer."}),

  q("REX-PN","Pharmacology","Medication Administration",3,
    "The nurse must administer two different types of insulin: regular and NPH. The correct procedure is to draw up:",
    ["NPH first, then regular insulin into the same syringe","Regular (clear) insulin first, then NPH (cloudy) into the same syringe","Each insulin in separate syringes always","The order does not matter"],1,
    "Clear before cloudy: draw up regular (clear) insulin first to prevent NPH (cloudy) from contaminating the regular insulin vial. Contamination would alter the onset of regular insulin in the vial.",
    "Insulin mixing: clear (regular) before cloudy (NPH). Never mix long-acting insulin (glargine, detemir) with any other insulin.",
    "Insulin mixing sequence: clear before cloudy is always the rule. Long-acting insulins are never mixed.",
    {"0":"Drawing NPH first risks contaminating the regular insulin vial with NPH, altering its rapid onset.","2":"While separate syringes are an option, mixing is acceptable and reduces the number of injections.","3":"The order matters to prevent contamination of the regular insulin vial with NPH."}),

  q("REX-PN","Pharmacology","Medication Administration",2,
    "After administering a subcutaneous injection of heparin, the nurse should:",
    ["Massage the injection site vigorously","Apply gentle pressure without massaging the site","Apply a warm compress","Document but perform no post-injection care"],1,
    "After subcutaneous heparin injection, gentle pressure is applied but the site should NOT be massaged. Massaging increases the risk of hematoma formation because heparin is an anticoagulant. Rotate injection sites between doses.",
    "Heparin SubQ: do NOT aspirate before injection, do NOT massage after. Both increase bruising and hematoma risk.",
    "Heparin injection: no aspiration, no massage. These are specific differences from standard SubQ technique.",
    {"0":"Massaging a heparin injection site increases bruising and hematoma formation due to the anticoagulant effect.","2":"Warm compresses are not indicated after subcutaneous heparin injection.","3":"Gentle pressure should be applied to minimize bleeding at the injection site."}),

  q("REX-PN","Pharmacology","Medication Administration",3,
    "A nurse discovers that a medication was administered to the wrong patient. After assessing the client, the nurse should:",
    ["Wait to see if any adverse effects occur before reporting","Notify the provider and charge nurse, complete an incident report, and continue to monitor the client","Tell only the charge nurse and hope for no adverse effects","Document it in the nursing notes only without filing an incident report"],1,
    "Medication errors require immediate reporting: notify the provider (for orders regarding the client who received the wrong medication), complete an incident report (quality improvement), monitor the client, and document the error and interventions.",
    "Medication error response: assess client, notify provider, complete incident report, monitor, and document. Never hide errors.",
    "Medication error questions: always choose the most comprehensive response—assess, report, document, and monitor.",
    {"0":"Waiting to report delays potentially necessary intervention and violates professional and legal obligations.","2":"Only telling the charge nurse is insufficient; the provider must be notified for medical evaluation of the affected client.","3":"Nursing notes alone are insufficient; incident reports are separate documents required for quality improvement and risk management."}),

  q("RPN-CAT","Pharmacology","Medication Administration",4,
    "A nurse is administering a high-alert medication (insulin). Which safety practice is essential?",
    ["Single nurse verification is sufficient","Independent double verification by two nurses before administration","Administration without checking blood glucose","Using any syringe available for measurement"],1,
    "High-alert medications (insulin, heparin, chemotherapy, opioids) require independent double verification by two nurses to prevent errors. Each nurse independently checks the medication, dose, and patient before administration.",
    "High-alert medications: require double checks. Common examples: insulin, heparin, chemotherapy, opioids, potassium chloride, neuromuscular blocking agents.",
    "High-alert medication questions: independent double verification is always the key safety measure.",
    {"0":"Single verification is insufficient for high-alert medications due to the high risk of harm from errors.","2":"Blood glucose must be checked before insulin administration to guide dosing and prevent hypoglycemia.","3":"Insulin requires specific insulin syringes for accurate measurement; using other syringes can cause dosing errors."}),

  // ===== PATIENT SAFETY (7 questions) =====
  q("REX-PN","Safety","Patient Safety",1,
    "The nurse identifies a client at risk for falls. The first intervention is to:",
    ["Apply bilateral wrist restraints","Ensure the call light is within reach and the bed is in the lowest position","Transfer the client to a different unit","Administer sedating medications to keep the client in bed"],1,
    "Basic fall prevention: call light within reach, bed in lowest position, wheels locked, non-slip footwear, clear pathways, adequate lighting, and personal items within reach. Restraints are a last resort and can increase injury.",
    "Fall prevention starts with environmental modifications: low bed, call light accessible, clear path, non-slip shoes.",
    "Fall risk + first intervention: always start with the least restrictive measures (environmental modification).",
    {"0":"Restraints increase agitation, injury risk, and are used only as a last resort with specific criteria.","2":"Transferring the client does not address the fall risk and may disorient the client further.","3":"Sedating medications increase fall risk and cognitive impairment, worsening the problem."}),

  q("REX-PN","Safety","Patient Safety",2,
    "A nurse discovers a client on the floor who has fallen. The first action is:",
    ["Help the client back to bed immediately","Assess the client for injuries before moving them","Complete an incident report","Call the family to inform them"],1,
    "After a fall, the nurse must assess for injuries before moving the client, as movement could worsen a fracture or spinal injury. Check for pain, deformity, range of motion, and neurological status before repositioning.",
    "Fall response: assess before moving. Check for pain, deformity, LOC changes, and neurological deficits.",
    "Post-fall protocol: assess first, then move safely, notify provider, document, and complete incident report.",
    {"0":"Moving the client immediately without assessment could worsen injuries such as fractures or spinal cord damage.","2":"The incident report is important but assessment and client care take priority over paperwork.","3":"Family notification comes after the client is assessed and stabilized, not as the first action."}),

  q("RPN-CAT","Safety","Patient Safety",3,
    "A nurse receives a medication order that seems inappropriate for the client's condition. The nurse should:",
    ["Administer the medication as ordered without question","Clarify the order with the prescribing provider before administering","Ask another nurse to administer it instead","Document concerns but administer the medication"],1,
    "Nurses have a professional and legal obligation to question orders that appear incorrect, unclear, or potentially harmful. Clarifying with the provider protects the client and the nurse's license.",
    "Never administer a medication you have concerns about without clarification. The nurse is the last safety check before the medication reaches the client.",
    "Questionable orders: always clarify with the provider. Administering a known inappropriate order does not protect you legally.",
    {"0":"Blindly administering a potentially inappropriate medication is unsafe and violates the nurse's professional responsibility.","2":"Asking another nurse to administer it does not resolve the safety concern; the order itself needs clarification.","3":"Documenting concerns while still giving the medication does not protect the client from potential harm."}),

  q("REX-PN","Safety","Patient Safety",2,
    "Proper body mechanics when lifting a client include:",
    ["Bending at the waist to reach the client","Bending at the knees and hips, keeping the back straight, and holding the load close to the body","Twisting the torso to change direction while carrying the client","Lifting quickly with outstretched arms"],1,
    "Proper body mechanics: wide base of support, bend knees/hips (not waist), tighten core muscles, keep the load close to the body, avoid twisting, and pivot feet to change direction. Use assistive devices when available.",
    "Body mechanics: bend knees, straight back, load close, no twisting. Use lifts and assistance when available.",
    "Lifting technique: knees bent, back straight, load close. These three elements are the most tested concepts.",
    {"0":"Bending at the waist places excessive strain on the lumbar spine, risking back injury.","2":"Twisting the torso while carrying weight can cause spinal disc injury; pivot feet instead.","3":"Lifting with outstretched arms increases the moment arm and strain on the back."}),

  q("REX-PN","Safety","Patient Safety",3,
    "The nurse is caring for a client with a latex allergy. Which item should be removed from the room?",
    ["Cotton bed linens","Latex gloves and latex-containing equipment","Stainless steel instruments","Paper documentation forms"],1,
    "Latex allergy can cause reactions ranging from contact dermatitis to anaphylaxis. All latex-containing items must be removed and replaced with non-latex alternatives. A latex-free cart should be available.",
    "Latex allergy: remove ALL latex items. Use nitrile or vinyl gloves. Common latex items: gloves, BP cuff bladders, IV port covers, wound drain tubing.",
    "Latex allergy questions: know common latex-containing items and ensure complete environmental modification.",
    {"0":"Cotton linens do not contain latex and are safe for clients with latex allergy.","2":"Stainless steel instruments do not contain latex.","3":"Paper documentation forms do not contain latex."}),

  q("REX-PN","Safety","Patient Safety",3,
    "A client receiving a blood transfusion develops fever, chills, and flank pain 15 minutes after the transfusion began. The nurse's first action is:",
    ["Slow the transfusion rate and continue monitoring","Stop the transfusion immediately and keep the IV line open with normal saline","Administer acetaminophen and continue the transfusion","Change the blood bag to a different unit"],1,
    "These symptoms suggest a hemolytic transfusion reaction (antigen-antibody response). Stop the transfusion immediately, maintain IV access with NS (new tubing), notify the provider, send blood samples and the blood bag to the lab.",
    "Transfusion reaction: stop transfusion, maintain IV with NS (new tubing), notify provider and blood bank, send samples.",
    "Transfusion reaction management: always stop the transfusion first. Never slow the rate and continue with suspected reactions.",
    {"0":"Slowing the rate does not prevent further harm from incompatible blood and allows continued antigen-antibody reaction.","2":"Administering antipyretics and continuing is inappropriate when a hemolytic reaction is suspected.","3":"The problem is blood incompatibility, not a defective blood bag; a different unit does not address the reaction."}),

  q("RPN-CAT","Safety","Patient Safety",4,
    "A nurse suspects a coworker of practicing while impaired by substance use. The nurse's obligation is to:",
    ["Ignore the situation to maintain workplace harmony","Report the concern to the nurse manager or appropriate authority to protect patient safety","Confront the coworker privately and handle it informally","Wait for definitive proof before taking any action"],1,
    "Nurses have a legal and ethical obligation to report suspected impairment. Patient safety is the priority. Most state boards of nursing have mandatory reporting requirements. Many offer assistance programs for impaired nurses.",
    "Impaired practice reporting: mandatory in most jurisdictions. Patient safety overrides workplace relationships.",
    "Impaired practice questions: always report through proper channels. Patient safety is the overriding priority.",
    {"0":"Ignoring impaired practice endangers patients and makes the observing nurse potentially liable.","2":"Informal confrontation does not adequately protect patients and may allow continued impaired practice.","3":"Waiting for definitive proof while patients may be at risk is negligent; reasonable suspicion warrants reporting."}),

  // ===== DELEGATION AND SCOPE OF PRACTICE (8 questions) =====
  q("REX-PN","Delegation","Delegation and Scope of Practice",2,
    "The RPN/LVN can appropriately delegate which task to an unlicensed assistive personnel (UAP)?",
    ["Administering oral medications","Teaching a client about a new diagnosis","Measuring and recording vital signs on a stable client","Performing initial client assessment"],1,
    "UAPs can perform tasks that are routine, standardized, and do not require nursing judgment: vital signs on stable clients, bathing, feeding, toileting, ambulation, and measuring intake/output.",
    "UAP delegation: routine, predictable tasks only. Assessment, teaching, medication administration, and unstable clients require licensed nurses.",
    "Delegation questions: identify what requires nursing judgment (not delegatable) vs routine tasks (delegatable to UAP).",
    {"0":"Medication administration requires a licensed nurse and cannot be delegated to UAPs.","2":"Client education requires nursing knowledge and clinical judgment and cannot be delegated to UAPs.","3":"Initial assessment requires nursing judgment and clinical decision-making and must be performed by a licensed nurse."}),

  q("REX-PN","Delegation","Delegation and Scope of Practice",3,
    "When delegating a task, the RPN/LVN must ensure which of the five rights of delegation?",
    ["Right patient, drug, dose, route, time","Right task, right circumstance, right person, right direction, right supervision","Right doctor, right order, right form, right time, right place","Right assessment, right planning, right implementation, right evaluation, right documentation"],1,
    "The five rights of delegation ensure safe delegation: right task (appropriate to delegate), right circumstance (stable client), right person (competent individual), right direction (clear instructions), right supervision (monitoring and follow-up).",
    "Five rights of delegation: task, circumstance, person, direction/communication, supervision/evaluation.",
    "Delegation rights vs medication rights: know both sets. Delegation rights focus on the process of assigning work safely.",
    {"0":"These are the five rights of medication administration, not delegation.","2":"These elements are not the recognized framework for delegation rights.","3":"These describe the nursing process steps, not delegation rights."}),

  q("RPN-CAT","Delegation","Delegation and Scope of Practice",3,
    "An RPN/LVN is assigned to care for four clients. Which client should the RPN report to the supervising RN for reassignment?",
    ["A stable diabetic client requiring routine blood glucose monitoring","A post-operative day 2 client ambulating with assistance","A client with acute chest pain and changing vital signs","A client with a chronic wound requiring routine dressing change"],2,
    "Acute chest pain with changing vital signs indicates an unstable, unpredictable client requiring RN-level assessment, critical thinking, and rapid clinical judgment. This exceeds the RPN/LVN scope of practice for independent care.",
    "RPN scope: stable, predictable clients. Unstable, rapidly changing, or complex clients require RN assessment and management.",
    "Scope of practice questions: identify the unstable client. Acute changes and unpredictable conditions require RN care.",
    {"0":"A stable diabetic with routine monitoring is within RPN/LVN scope of practice.","1":"A post-op day 2 client ambulating is stable and predictable, within RPN/LVN scope.","3":"A chronic wound with routine dressing change is predictable and within RPN/LVN scope."}),

  q("REX-PN","Delegation","Delegation and Scope of Practice",1,
    "The RPN/LVN understands that accountability for delegated tasks means:",
    ["The UAP is fully responsible for the outcome once the task is delegated","The RPN/LVN retains accountability for the delegation decision and client outcomes","The charge nurse is solely accountable for all delegation decisions","No one is accountable once a task is assigned"],1,
    "The delegating nurse retains accountability for the decision to delegate, ensuring the person is competent, providing clear directions, and following up on outcomes. The UAP is responsible for performing the task correctly.",
    "Delegation accountability: the delegating nurse is ALWAYS accountable for the delegation decision and outcome monitoring.",
    "Accountability questions: the nurse who delegates is accountable for the decision. The delegatee is responsible for performance.",
    {"0":"While the UAP is responsible for performing the task, the RPN retains accountability for the delegation decision and outcome.","2":"The charge nurse may oversee the unit but the delegating nurse is accountable for their own delegation decisions.","3":"Accountability cannot be eliminated; it remains with the delegating nurse."}),

  q("REX-PN","Delegation","Delegation and Scope of Practice",2,
    "The RPN/LVN can independently perform which nursing activity?",
    ["Developing the initial comprehensive nursing care plan","Administering medications and performing treatments as prescribed","Making independent decisions about complex, unstable client care","Diagnosing medical conditions"],1,
    "RPNs/LVNs can independently perform skills within their scope: medication administration, wound care, catheter care, vital signs, data collection, and contributing to care plans under RN supervision.",
    "RPN/LVN scope: administer medications, perform treatments, collect data, reinforce teaching. RN develops care plans and manages complex/unstable clients.",
    "RPN scope questions: medication administration and prescribed treatments are within scope. Care plan development and unstable clients are RN responsibilities.",
    {"0":"Initial comprehensive care plan development is an RN responsibility requiring advanced clinical judgment.","2":"Complex, unstable client care requires RN-level clinical judgment and is beyond RPN/LVN independent scope.","3":"Medical diagnosis is a physician/NP function, not within any nursing scope of practice."}),

  q("RPN-CAT","Delegation","Delegation and Scope of Practice",3,
    "A UAP reports to the RPN/LVN that a client's blood pressure is 190/110 mmHg. The RPN/LVN should:",
    ["Tell the UAP to recheck in one hour","Personally reassess the client and notify the RN or provider","Ask the UAP to administer an antihypertensive","Document the finding without further action"],1,
    "Abnormal findings reported by UAPs require the licensed nurse to personally reassess the client, validate the finding, and take appropriate action. A BP of 190/110 is significantly elevated and requires provider notification.",
    "Abnormal vital signs: always verify personally, then escalate. Never rely solely on UAP assessment for clinical decisions.",
    "Abnormal findings from UAP: verify first, then act. The licensed nurse must reassess before making clinical decisions.",
    {"0":"Waiting one hour with a critically elevated blood pressure could result in a hypertensive emergency.","2":"UAPs cannot administer medications; this is a licensed nurse responsibility.","3":"A BP of 190/110 requires immediate intervention, not documentation alone."}),

  q("REX-PN","Delegation","Delegation and Scope of Practice",3,
    "The RPN/LVN is providing care and identifies a change in a client's condition. The appropriate action is to:",
    ["Continue monitoring without reporting changes","Notify the supervising RN or healthcare provider of the change","Wait until the end of the shift to report","Make independent changes to the client's treatment plan"],1,
    "RPNs/LVNs are responsible for recognizing and reporting changes in client condition to the RN or provider. Timely communication ensures appropriate interventions and prevents complications.",
    "RPN responsibility: recognize changes and report promptly. Use SBAR communication format for clear, concise reporting.",
    "Change in condition: RPNs must recognize and report. SBAR (Situation, Background, Assessment, Recommendation) is the communication standard.",
    {"0":"Failing to report changes in condition is negligent and can result in harm to the client.","2":"Delaying reports until end of shift could allow a client's condition to deteriorate significantly.","3":"Making independent treatment changes is outside the RPN/LVN scope; the provider must order treatment modifications."}),

  q("RPN-CAT","Delegation","Delegation and Scope of Practice",4,
    "An RPN/LVN is asked to perform a procedure they have not been trained for. The appropriate response is:",
    ["Attempt the procedure and learn from the experience","Decline the assignment, explain the lack of training, and request education or reassignment","Ask a UAP to perform the procedure instead","Perform the procedure but do not document it"],1,
    "Nurses must practice within their competency level. Performing procedures without proper training violates the standard of care, endangers patients, and creates liability. The nurse should advocate for proper training before performing the procedure.",
    "Scope of practice: never perform procedures you are not trained or competent to perform. Request training or reassignment.",
    "Competency questions: declining to perform untrained procedures is professional and protects both the client and the nurse.",
    {"0":"Attempting unfamiliar procedures without training endangers the client and violates professional standards.","2":"Delegating a procedure to a UAP that requires a licensed nurse is inappropriate and unsafe.","3":"Performing a procedure without documentation is both unsafe and illegal; it also prevents appropriate follow-up care."}),

  q("REX-PN","Respiratory","Respiratory",2,
    "A client with chronic obstructive pulmonary disease asks the nurse why they need to receive the pneumococcal vaccine. The nurse explains that COPD clients are at increased risk for:",
    ["Viral upper respiratory infections only","Pneumococcal pneumonia due to impaired pulmonary defense mechanisms","Urinary tract infections","Skin infections from immunosuppression"],1,
    "COPD damages the pulmonary defense mechanisms (mucociliary clearance, macrophage function) making clients highly susceptible to pneumococcal pneumonia. The pneumococcal vaccine significantly reduces the risk of invasive pneumococcal disease in this population.",
    "COPD patients should receive both pneumococcal and annual influenza vaccines. Respiratory infections are the most common cause of COPD exacerbations.",
    "Vaccine indication questions: know which chronic conditions increase risk for specific infections and their recommended vaccines.",
    {"0":"While COPD patients get viral infections, the pneumococcal vaccine specifically targets bacterial pneumonia.","2":"UTIs are unrelated to COPD or pulmonary defense mechanisms.","3":"COPD does not cause systemic immunosuppression leading to skin infections."})
];

async function main() {
  console.log(`[RPN-B6] Starting insertion of ${QS.length} questions...`);

  const topicDist: Record<string,number> = {};
  const diffDist: Record<string,number> = {easy:0,moderate:0,difficult:0};
  QS.forEach(q => {
    topicDist[q.topic] = (topicDist[q.topic]||0)+1;
    if(q.diff<=2) diffDist.easy++;
    else if(q.diff===3) diffDist.moderate++;
    else diffDist.difficult++;
  });

  console.log(`\nTopic distribution:`);
  Object.entries(topicDist).sort((a,b)=>a[0].localeCompare(b[0])).forEach(([t,c])=>console.log(`  ${t}: ${c}`));
  console.log(`\nDifficulty distribution:`);
  Object.entries(diffDist).forEach(([d,c])=>console.log(`  ${d}: ${c} (${((c/QS.length)*100).toFixed(1)}%)`));

  let inserted = 0;
  let skipped = 0;
  const batchSize = 25;

  for (let i = 0; i < QS.length; i += batchSize) {
    const batch = QS.slice(i, i + batchSize);
    const values: string[] = [];
    const params: any[] = [];
    let idx = 1;

    for (const q of batch) {
      const stemHash = hash(q.stem);
      values.push(`($${idx},$${idx+1},$${idx+2},$${idx+3},$${idx+4},$${idx+5}::jsonb,$${idx+6}::jsonb,$${idx+7},$${idx+8}::integer,$${idx+9},$${idx+10},$${idx+11},$${idx+12},$${idx+13},$${idx+14},$${idx+15}::jsonb)`);
      params.push(
        q.tier, q.exam, "multiple_choice", "published",
        q.stem, JSON.stringify(q.options), JSON.stringify([q.correct]),
        q.rationale, q.diff, q.bs, q.topic, "BOTH", stemHash,
        q.cp, q.es, JSON.stringify(q.dr)
      );
      idx += 16;
    }

    const sql = `INSERT INTO exam_questions (tier, exam, question_type, status, stem, options, correct_answer, rationale, difficulty, body_system, topic, region_scope, stem_hash, clinical_pearl, exam_strategy, distractor_rationales)
                 SELECT v.* FROM (VALUES ${values.join(",")}) AS v(tier,exam,question_type,status,stem,options,correct_answer,rationale,difficulty,body_system,topic,region_scope,stem_hash,clinical_pearl,exam_strategy,distractor_rationales)
                 WHERE NOT EXISTS (SELECT 1 FROM exam_questions e WHERE e.stem_hash = v.stem_hash)`;
    const result = await pool.query(sql, params);
    const batchInserted = result.rowCount || 0;
    inserted += batchInserted;
    skipped += batch.length - batchInserted;
  }

  console.log(`\n[RPN-B6] Results: Inserted ${inserted}, Skipped duplicates ${skipped}, Total attempted ${QS.length}`);

  const totalQ = await pool.query(`SELECT count(*) as cnt FROM exam_questions WHERE tier='rpn'`);
  console.log(`\nTotal RPN questions in database: ${totalQ.rows[0].cnt}`);

  const pubQ = await pool.query(`SELECT count(*) as cnt FROM exam_questions WHERE tier='rpn' AND status='published'`);
  console.log(`Total RPN published questions: ${pubQ.rows[0].cnt}`);

  const bsDist = await pool.query(`SELECT body_system, count(*) as cnt FROM exam_questions WHERE tier='rpn' AND status='published' GROUP BY body_system ORDER BY cnt DESC`);
  console.log(`\nBody system distribution (published RPN):`);
  bsDist.rows.forEach((r: any) => console.log(`  ${r.body_system}: ${r.cnt}`));

  const topicQ = await pool.query(`SELECT topic, count(*) as cnt FROM exam_questions WHERE tier='rpn' AND status='published' AND topic IS NOT NULL GROUP BY topic ORDER BY topic`);
  console.log(`\nTopic distribution (published RPN):`);
  topicQ.rows.forEach((r: any) => console.log(`  ${r.topic}: ${r.cnt}`));

  const diffQ = await pool.query(`SELECT difficulty, count(*) as cnt FROM exam_questions WHERE tier='rpn' AND status='published' GROUP BY difficulty ORDER BY difficulty`);
  console.log(`\nDifficulty distribution (published RPN):`);
  diffQ.rows.forEach((r: any) => console.log(`  Level ${r.difficulty}: ${r.cnt}`));

  const allTiers = await pool.query(`SELECT tier, count(*) as cnt FROM exam_questions WHERE status='published' GROUP BY tier ORDER BY tier`);
  console.log(`\nAll published questions by tier:`);
  allTiers.rows.forEach((r: any) => console.log(`  ${r.tier}: ${r.cnt}`));

  await pool.end();
  console.log(`\n[RPN-B6] Complete.`);
}

main().catch(e => { console.error(e); process.exit(1); });
