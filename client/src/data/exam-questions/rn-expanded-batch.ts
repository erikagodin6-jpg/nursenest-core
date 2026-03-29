import type { ExamQuestion } from "./types";

export const rnExpandedBatchQuestions: ExamQuestion[] = [
  {
    q: "A nurse is caring for a client with acute myocardial infarction who develops new-onset chest pain unrelieved by nitroglycerin. The ECG shows ST-elevation in leads II, III, and aVF. Which coronary artery is most likely occluded?",
    o: ["Right coronary artery", "Left anterior descending artery", "Left circumflex artery", "Left main coronary artery"],
    a: 0,
    r: "ST-elevation in leads II, III, and aVF indicates an inferior wall MI, which is most commonly caused by occlusion of the right coronary artery (RCA). The RCA supplies the inferior wall of the left ventricle, the right ventricle, and the AV node in most people. LAD occlusion causes anterior wall MI (V1-V4). Left circumflex occlusion causes lateral wall MI (I, aVL, V5-V6).",
    s: "Cardiovascular"
  },
  {
    q: "A client with heart failure is prescribed digoxin 0.125 mg daily. Before administering the medication, the nurse assesses the apical pulse at 54 bpm. What is the priority nursing action?",
    o: ["Hold the medication and notify the healthcare provider", "Administer the medication as prescribed", "Recheck the pulse in 15 minutes and administer if above 50", "Administer the medication and document the heart rate"],
    a: 0,
    r: "Digoxin should be withheld and the provider notified if the apical pulse is below 60 bpm in an adult. Digoxin slows the heart rate by increasing vagal tone and decreasing conduction through the AV node. Administering digoxin at a heart rate of 54 could lead to dangerous bradycardia, heart block, or cardiac arrest. The nurse should also assess for other signs of digoxin toxicity: nausea, vomiting, visual disturbances (yellow-green halos), and dysrhythmias.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is assessing a client 6 hours after a right total knee arthroplasty. The client reports severe pain rated 9/10 in the right calf, which is swollen, warm, and tender. What should the nurse do first?",
    o: ["Elevate the extremity, do not massage the leg, and notify the provider immediately for suspected DVT", "Apply warm compresses and encourage ambulation", "Massage the calf to relieve the muscle cramp", "Administer the prescribed PRN analgesic and reassess in 30 minutes"],
    a: 0,
    r: "These signs (calf pain, swelling, warmth, tenderness) are classic for deep vein thrombosis (DVT), a serious complication after lower extremity surgery. The leg should never be massaged because this could dislodge a clot and cause a pulmonary embolism. The nurse should elevate the extremity, keep the client on bedrest, and notify the provider for urgent diagnostic evaluation (Doppler ultrasound) and anticoagulation therapy. Ambulation could also dislodge a clot.",
    s: "Musculoskeletal"
  },
  {
    q: "A nurse is caring for a client with chronic kidney disease whose potassium level is 6.2 mEq/L. Which ECG change should the nurse expect to see?",
    o: ["Tall, peaked T waves", "Prolonged QT interval", "ST-segment depression", "U waves"],
    a: 0,
    r: "Hyperkalemia (K+ above 5.0 mEq/L) causes characteristic ECG changes: tall, peaked T waves are the earliest sign, followed by widened QRS complex, flattened P waves, and eventually sine wave pattern leading to ventricular fibrillation or asystole. Prolonged QT is seen with hypokalemia, hypomagnesemia, or certain medications. U waves are associated with hypokalemia. ST depression can have multiple causes but is not the hallmark of hyperkalemia.",
    s: "Renal"
  },
  {
    q: "A client with a chest tube reports sudden sharp chest pain and dyspnea. The nurse observes that the chest tube has become disconnected from the drainage system. What is the priority action?",
    o: ["Submerge the end of the chest tube in sterile water or saline and call for help", "Clamp the chest tube immediately", "Reconnect the tube to the same drainage system", "Cover the insertion site with petroleum gauze"],
    a: 0,
    r: "When a chest tube disconnects from the drainage system, the priority is to create a water seal to prevent air from entering the pleural space and causing a tension pneumothorax. Submerging the tube end in sterile water or saline creates a temporary water seal. Clamping a chest tube can cause a life-threatening tension pneumothorax if air cannot escape. Reconnecting to a contaminated system risks infection. Petroleum gauze is used for an open chest wound, not a disconnected tube.",
    s: "Respiratory"
  },
  {
    q: "A nurse is caring for a client receiving a blood transfusion who develops fever, chills, flank pain, and dark urine 15 minutes after the infusion started. What type of transfusion reaction is this and what is the priority action?",
    o: ["Acute hemolytic reaction; stop the transfusion immediately, maintain IV access with normal saline, and notify the provider", "Febrile non-hemolytic reaction; slow the transfusion rate and administer acetaminophen", "Allergic reaction; administer diphenhydramine and continue the transfusion", "Circulatory overload; elevate the head of bed and administer furosemide"],
    a: 0,
    r: "Fever, chills, flank pain, and dark urine (hemoglobinuria) within minutes of starting a transfusion indicate an acute hemolytic transfusion reaction caused by ABO incompatibility. This is a medical emergency. The nurse must immediately stop the transfusion, keep the IV open with NS, send the blood bag and tubing to the lab for verification, obtain blood and urine samples, and monitor for DIC and acute kidney injury. Hemolytic reactions can rapidly progress to shock and death.",
    s: "Hematology"
  },
  {
    q: "A nurse is teaching a client newly diagnosed with type 1 diabetes about insulin administration. The client asks why insulin cannot be taken as a pill. What is the best explanation?",
    o: ["Insulin is a protein that would be destroyed by digestive enzymes in the stomach before it could work", "Oral insulin causes severe liver damage", "Insulin pills have not been invented yet", "Oral insulin works too slowly to control blood sugar"],
    a: 0,
    r: "Insulin is a peptide hormone (protein) composed of amino acid chains. If taken orally, it would be broken down by proteolytic enzymes (pepsin, trypsin) in the gastrointestinal tract, rendering it inactive before it could be absorbed into the bloodstream. Therefore, insulin must be administered parenterally (subcutaneous injection, IV, or insulin pump) to bypass the digestive system and remain intact for glucose regulation.",
    s: "Endocrine"
  },
  {
    q: "A nurse is caring for a client with pneumonia who has an SpO2 of 88% on room air. The provider orders oxygen via nasal cannula. At what flow rate should the nurse initiate oxygen therapy?",
    o: ["2 liters per minute, titrating up as needed to maintain SpO2 above 94%", "10 liters per minute via nasal cannula", "Start with a non-rebreather mask at 15 liters per minute", "6 liters per minute via nasal cannula"],
    a: 0,
    r: "Nasal cannula delivers 24-44% FiO2 at flow rates of 1-6 L/min. Oxygen therapy should start at a low flow rate (1-2 L/min) and be titrated up to achieve the target SpO2 (typically 94-98% for most clients, 88-92% for COPD clients). Starting at 10 L/min via nasal cannula is above the maximum recommended flow rate and causes mucosal drying. A non-rebreather mask would be used for severe hypoxemia. The goal is to use the lowest FiO2 to achieve adequate oxygenation to minimize oxygen toxicity risk.",
    s: "Respiratory"
  },
  {
    q: "A nurse is assessing a client with suspected meningitis. Which assessment finding is most consistent with bacterial meningitis?",
    o: ["Positive Brudzinski sign with nuchal rigidity and petechial rash", "Unilateral facial drooping with arm weakness", "Painless vesicular rash along a dermatome", "Bilateral lower extremity weakness with urinary retention"],
    a: 0,
    r: "Bacterial meningitis presents with the classic triad of fever, nuchal rigidity (stiff neck), and altered mental status. Brudzinski sign (involuntary hip/knee flexion when the neck is flexed) and Kernig sign (inability to extend the knee when the hip is flexed) indicate meningeal irritation. A petechial/purpuric rash suggests Neisseria meningitidis (meningococcal meningitis). Unilateral facial drooping suggests stroke. Dermatome rash suggests herpes zoster. Lower extremity weakness with urinary retention suggests spinal cord pathology.",
    s: "Neurology"
  },
  {
    q: "A nurse is caring for a postoperative client who has been NPO for 3 days and is now receiving IV fluids of D5W only. Which acid-base imbalance should the nurse monitor for?",
    o: ["Metabolic alkalosis from loss of gastric acid and inadequate chloride replacement", "Metabolic acidosis from excessive acid production", "Respiratory alkalosis from hyperventilation", "Respiratory acidosis from hypoventilation"],
    a: 0,
    r: "Prolonged NPO status with gastric losses (nasogastric suction or vomiting) leads to loss of hydrochloric acid (HCl) and chloride, resulting in hypochloremic metabolic alkalosis. D5W does not contain electrolytes to replace losses. The kidneys compensate by retaining hydrogen ions and excreting bicarbonate, but this takes time. Signs include confusion, muscle twitching, and hypoventilation as the body attempts respiratory compensation.",
    s: "Gastrointestinal"
  },
  {
    q: "A nurse is assessing a newborn at 1 minute after birth. The infant has a heart rate of 110 bpm, slow irregular respirations, some flexion of extremities, grimaces with suctioning, and a pink body with blue extremities. What is the APGAR score?",
    o: ["6", "7", "8", "5"],
    a: 0,
    r: "APGAR scoring: Heart rate 110 (above 100 = 2), Respiratory effort slow/irregular (= 1), Muscle tone some flexion (= 1), Reflex irritability grimace (= 1), Color pink body/blue extremities (acrocyanosis = 1). Total: 2+1+1+1+1 = 6. A score of 7-10 is normal, 4-6 needs intervention, and below 4 requires aggressive resuscitation. This newborn needs stimulation, warming, possible suctioning, and reassessment at 5 minutes.",
    s: "Maternal-Newborn"
  },
  {
    q: "A nurse is caring for a client with cirrhosis who has a serum ammonia level of 120 mcg/dL. The client is confused and lethargic. Which medication should the nurse expect to administer?",
    o: ["Lactulose 30 mL orally every 8 hours", "Furosemide 40 mg IV", "Albumin 25% IV infusion", "Spironolactone 100 mg orally"],
    a: 0,
    r: "Elevated ammonia in cirrhosis causes hepatic encephalopathy (confusion, asterixis, lethargy, coma). Lactulose is the first-line treatment because it acts as an osmotic laxative that converts ammonia (NH3) to ammonium (NH4+) in the colon, which cannot be reabsorbed and is excreted in stool. The goal is 2-3 soft stools per day. Rifaximin may be added as adjunct therapy. Furosemide and spironolactone treat ascites. Albumin treats hypoalbuminemia but does not reduce ammonia.",
    s: "Gastrointestinal"
  },
  {
    q: "A nurse is administering medications to a client. The client states, My name is John Smith, and this is confirmed by the identification band. However, the nurse notices the medication administration record lists the medication for a different room number. What should the nurse do?",
    o: ["Hold the medication and verify the correct client and order before administering", "Administer the medication since the name matches", "Give the medication and correct the room number later", "Ask the client to confirm the medication name"],
    a: 0,
    r: "Any discrepancy in patient identification requires the nurse to hold the medication and verify the order. The rights of medication administration include the right patient, right medication, right dose, right route, right time, and right documentation. A room number discrepancy could indicate a patient transfer issue or an order entry error. Administering without verification violates patient safety principles and could result in a medication error.",
    s: "Safety"
  },
  {
    q: "A nurse is caring for a client with schizophrenia who is receiving haloperidol. The client suddenly develops severe muscle rigidity, high fever of 104.2°F, diaphoresis, and tachycardia. What condition should the nurse suspect?",
    o: ["Neuroleptic malignant syndrome", "Serotonin syndrome", "Malignant hyperthermia", "Tardive dyskinesia"],
    a: 0,
    r: "Neuroleptic malignant syndrome (NMS) is a life-threatening reaction to antipsychotic medications (especially high-potency typical antipsychotics like haloperidol). Classic presentation includes hyperthermia (often above 104°F), severe lead-pipe muscle rigidity, altered mental status, and autonomic instability (tachycardia, diaphoresis, BP fluctuations). Elevated CK levels confirm muscle breakdown. Treatment: stop the antipsychotic, supportive care, dantrolene or bromocriptine. Serotonin syndrome involves serotonergic agents. Malignant hyperthermia is related to anesthetic agents.",
    s: "Mental Health"
  },
  {
    q: "A nurse is caring for a client receiving heparin therapy. The aPTT result is 120 seconds (therapeutic range 60-80 seconds). What is the priority action?",
    o: ["Stop the heparin infusion and notify the provider", "Continue the infusion and recheck aPTT in 6 hours", "Decrease the infusion rate by 50%", "Administer vitamin K as the antidote"],
    a: 0,
    r: "An aPTT of 120 seconds is significantly above the therapeutic range, indicating the client is at high risk for hemorrhage. The priority is to stop the heparin infusion and notify the provider. The antidote for heparin is protamine sulfate, not vitamin K (which is the antidote for warfarin). Simply decreasing the rate is insufficient for a critically elevated aPTT. The provider will determine whether to resume heparin at a lower dose after reassessment.",
    s: "Hematology"
  },
  {
    q: "A nurse is preparing to insert a urinary catheter for a female client. In what anatomical order should the nurse cleanse the perineal area?",
    o: ["From the urinary meatus downward toward the rectum, using a separate swab for each stroke", "From the rectum upward toward the urinary meatus", "In a circular pattern around the urinary meatus", "Side to side across the perineum"],
    a: 0,
    r: "Perineal cleansing before urinary catheter insertion should always move from the cleanest area (urinary meatus) toward the dirtiest area (rectum) to prevent introducing rectal bacteria into the urinary tract. Each cleansing stroke uses a separate antiseptic swab to avoid recontamination. The nurse cleanses the labia minora from front to back, then the urinary meatus with the final stroke. This technique is fundamental to preventing catheter-associated urinary tract infections (CAUTIs).",
    s: "Clinical Procedures"
  },
  {
    q: "A nurse is assessing a client with suspected pulmonary embolism. Which combination of findings is most consistent with this diagnosis?",
    o: ["Sudden onset dyspnea, pleuritic chest pain, tachycardia, and decreased SpO2", "Gradual onset productive cough with purulent sputum and fever", "Bilateral wheezing with prolonged expiratory phase", "Orthopnea with bilateral crackles and peripheral edema"],
    a: 0,
    r: "Pulmonary embolism (PE) classically presents with sudden onset of dyspnea, pleuritic chest pain (sharp, worsening with inspiration), tachycardia, tachypnea, and hypoxemia. Risk factors include recent surgery, immobility, DVT, and oral contraceptive use. Gradual productive cough with fever suggests pneumonia. Bilateral wheezing suggests asthma or COPD exacerbation. Orthopnea with crackles and edema suggests heart failure. Diagnosis is confirmed with CT pulmonary angiography.",
    s: "Respiratory"
  },
  {
    q: "A nurse is caring for a client with a new tracheostomy. The client's oxygen saturation drops to 82% and the nurse is unable to pass a suction catheter through the tracheostomy tube. What should the nurse do first?",
    o: ["Remove the inner cannula and attempt suctioning again", "Remove the entire tracheostomy tube", "Increase the oxygen flow rate", "Call a code blue immediately"],
    a: 0,
    r: "If a suction catheter cannot pass through the tracheostomy tube, the inner cannula is likely occluded with secretions. The first intervention is to remove the inner cannula (which is designed to be removable and replaceable) and attempt suctioning. If the obstruction is cleared, a clean inner cannula is reinserted. If removing the inner cannula does not resolve the obstruction, the entire tracheostomy tube may need replacement. Keep the obturator and a spare tracheostomy tube at the bedside at all times.",
    s: "Respiratory"
  },
  {
    q: "A nurse is caring for a client receiving IV vancomycin. The client develops flushing of the face and neck, pruritus, and hypotension during the infusion. What is this reaction called and what should the nurse do?",
    o: ["Red man syndrome; slow the infusion rate and administer antihistamines as prescribed", "Anaphylaxis; stop the infusion and administer epinephrine", "Allergic reaction; discontinue vancomycin permanently", "Drug fever; apply cooling measures and continue the infusion"],
    a: 0,
    r: "Red man syndrome is a histamine-mediated reaction caused by rapid IV vancomycin infusion. It presents with flushing (red man appearance) of the face, neck, and upper trunk, pruritus, and sometimes hypotension. It is NOT a true allergy. Management includes slowing the infusion rate (infuse over at least 60 minutes per gram) and premedicating with diphenhydramine. The medication does not need to be permanently discontinued. Anaphylaxis would include bronchospasm, angioedema, and cardiovascular collapse.",
    s: "Pharmacology"
  },
  {
    q: "A nurse is caring for a 4-year-old child admitted with suspected epiglottitis. Which action should the nurse avoid?",
    o: ["Inspecting the throat with a tongue depressor", "Keeping the child in an upright position", "Preparing emergency intubation equipment at the bedside", "Administering humidified oxygen"],
    a: 0,
    r: "In suspected epiglottitis, direct inspection of the throat using a tongue depressor is contraindicated because it can trigger complete airway obstruction from laryngospasm. The classic presentation includes the 4 D's: drooling, dysphagia, distressed inspiratory effort, and dysphonia (muffled voice). The child typically assumes a tripod position. Keep the child calm, upright, with humidified oxygen, and emergency intubation equipment at bedside. Diagnosis is confirmed by lateral neck X-ray showing the thumbprint sign.",
    s: "Pediatrics"
  },
  {
    q: "A nurse is assessing a client who fell and sustained a hip fracture. The affected leg is shortened, externally rotated, and adducted. Which type of hip fracture does this presentation indicate?",
    o: ["Intracapsular femoral neck fracture", "Intertrochanteric fracture with internal rotation", "Pelvic fracture", "Distal femur fracture"],
    a: 0,
    r: "An intracapsular femoral neck fracture classically presents with shortening and external rotation of the affected leg. The adductor muscles pull the distal fragment into the characteristic position. This type of fracture disrupts blood supply to the femoral head and increases risk of avascular necrosis. In elderly clients, hip fractures often result from low-energy falls due to osteoporosis. Intertrochanteric fractures also show shortening and external rotation but are extracapsular with better blood supply.",
    s: "Musculoskeletal"
  },
  {
    q: "A nurse is caring for a client with COPD who is receiving oxygen at 2 L/min via nasal cannula. The SpO2 is 91%. A family member asks the nurse to increase the oxygen to help the client breathe better. What is the best response?",
    o: ["For clients with COPD, we target an oxygen saturation of 88 to 92 percent because too much oxygen can decrease their drive to breathe", "I will increase the oxygen right away since the saturation should be above 95 percent", "The doctor ordered 2 liters, so I cannot change it under any circumstances", "High oxygen would not cause any harm, but we need a new order first"],
    a: 0,
    r: "In COPD clients, chronic CO2 retention shifts the respiratory drive from CO2-mediated (normal) to hypoxic drive. If high-flow oxygen eliminates the hypoxic stimulus, the client may develop hypoventilation, CO2 narcosis, and respiratory failure. The target SpO2 for COPD clients is 88-92%. Exceeding this can be dangerous. The nurse should educate the family about this physiologic rationale while maintaining the prescribed oxygen therapy.",
    s: "Respiratory"
  },
  {
    q: "A nurse is caring for a client in the emergency department who ingested a large quantity of acetaminophen 2 hours ago. Which medication should the nurse anticipate administering?",
    o: ["Acetylcysteine (Mucomyst)", "Naloxone (Narcan)", "Flumazenil (Romazicon)", "Calcium gluconate"],
    a: 0,
    r: "Acetylcysteine (N-acetylcysteine, NAC) is the specific antidote for acetaminophen overdose. It works by replenishing glutathione stores in the liver, which helps metabolize the toxic metabolite NAPQI (N-acetyl-p-benzoquinone imine) that causes hepatocellular necrosis. It is most effective when administered within 8 hours of ingestion but can still be beneficial up to 72 hours. Naloxone reverses opioid overdose. Flumazenil reverses benzodiazepine overdose. Calcium gluconate treats hyperkalemia or magnesium toxicity.",
    s: "Pharmacology"
  },
  {
    q: "A nurse is caring for a client receiving continuous enteral feeding via nasogastric tube. Which intervention is most important to prevent aspiration?",
    o: ["Maintain the head of bed elevated to 30 to 45 degrees continuously during and for 30 minutes after feeding", "Flush the tube with 30 mL of water every 4 hours", "Check residual volumes every 8 hours", "Administer the feeding at a cold temperature to slow absorption"],
    a: 0,
    r: "Elevating the head of bed to 30-45 degrees is the most critical intervention to prevent aspiration during enteral feeding. Gravity helps keep the feeding in the stomach and prevents reflux into the esophagus and airway. Aspiration pneumonia is the most serious complication of enteral feeding. Flushing maintains tube patency but does not prevent aspiration. Residual volumes should be checked every 4-6 hours (not 8). Feedings should be administered at room temperature to prevent abdominal cramping.",
    s: "Gastrointestinal"
  },
  {
    q: "A nurse is caring for a client with syndrome of inappropriate antidiuretic hormone (SIADH). Which laboratory finding should the nurse expect?",
    o: ["Serum sodium 124 mEq/L with concentrated urine", "Serum sodium 152 mEq/L with dilute urine", "Serum potassium 6.1 mEq/L", "Serum calcium 12.5 mg/dL"],
    a: 0,
    r: "SIADH causes excessive ADH secretion, leading to water retention and dilutional hyponatremia (serum sodium below 135 mEq/L). Despite the low serum osmolality, the kidneys continue to concentrate the urine due to ADH action (urine osmolality is inappropriately elevated). Clinical manifestations include headache, confusion, weight gain without edema, and in severe cases, seizures. Treatment includes fluid restriction, hypertonic saline for severe hyponatremia, and treating the underlying cause. Demeclocycline or tolvaptan may be used for chronic SIADH.",
    s: "Endocrine"
  },
  {
    q: "A nurse is caring for a client with a spinal cord injury at T4. The client suddenly develops a severe headache, blood pressure of 230/120 mmHg, bradycardia, flushing above the injury level, and diaphoresis. What is the priority nursing action?",
    o: ["Sit the client upright and check for bladder distension or kinked catheter tubing", "Lay the client flat and administer IV fluids", "Administer sublingual nitroglycerin for the headache", "Apply cold compresses to the forehead and continue monitoring"],
    a: 0,
    r: "This presentation is classic autonomic dysreflexia, a life-threatening emergency in clients with spinal cord injuries at T6 or above. It is caused by a noxious stimulus below the level of injury (most commonly a full bladder or impacted bowel) triggering an uninhibited sympathetic response. Priority: sit the client upright to lower BP using orthostatic effects, then identify and remove the triggering stimulus (check catheter for kinks/clamps, empty the bladder, check for fecal impaction). If BP does not resolve, administer antihypertensives as prescribed.",
    s: "Neurology"
  },
  {
    q: "A nurse is preparing to administer an intramuscular injection to an obese adult client. What is the appropriate needle length and injection site?",
    o: ["1.5-inch needle in the ventrogluteal site", "1-inch needle in the deltoid site", "5/8-inch needle in the vastus lateralis", "2-inch needle in the dorsogluteal site"],
    a: 0,
    r: "For obese adult clients receiving IM injections, a 1.5-inch needle in the ventrogluteal site is recommended. The ventrogluteal site is preferred for IM injections because it has a thick gluteal muscle, is free of major nerves and blood vessels, and has a consistent depth. Obese clients require a longer needle to ensure the medication reaches the muscle tissue rather than being deposited in subcutaneous fat. The dorsogluteal site is no longer recommended due to proximity to the sciatic nerve and superior gluteal artery.",
    s: "Clinical Procedures"
  },
  {
    q: "A nurse is caring for a client with liver cirrhosis who develops tense ascites. The provider plans to perform a paracentesis. Which nursing action is most important before the procedure?",
    o: ["Have the client void to empty the bladder", "Administer a sedative as prescribed", "Place the client in a supine position", "Administer prophylactic antibiotics"],
    a: 0,
    r: "Before paracentesis, it is essential that the client voids to empty the bladder. An empty bladder reduces the risk of bladder perforation when the trocar or needle is inserted into the abdomen. The client should be positioned sitting upright on the edge of the bed or in a high Fowler's position to allow fluid to accumulate in the lower abdomen. Sedation is generally not required. The nurse should also obtain baseline vital signs and weight for comparison after fluid removal.",
    s: "Gastrointestinal"
  },
  {
    q: "A nurse is assessing a client with Addison disease (primary adrenal insufficiency). Which findings should the nurse expect?",
    o: ["Hypotension, hyperpigmentation, hyperkalemia, and hyponatremia", "Hypertension, moon face, truncal obesity, and striae", "Tachycardia, weight loss, exophthalmos, and heat intolerance", "Polyuria, polydipsia, and elevated blood glucose"],
    a: 0,
    r: "Addison disease results from destruction of the adrenal cortex causing deficiency of cortisol and aldosterone. Clinical findings: hypotension (from aldosterone deficiency causing sodium and water loss), hyperpigmentation (from elevated ACTH stimulating melanocytes), hyperkalemia (from reduced aldosterone), hyponatremia (from sodium wasting), fatigue, and weight loss. Moon face and truncal obesity describe Cushing syndrome (cortisol excess). Exophthalmos describes Graves disease. Polyuria and polydipsia describe diabetes mellitus or insipidus.",
    s: "Endocrine"
  },
  {
    q: "A nurse is caring for a 2-year-old child who is brought to the emergency department with a barking cough, inspiratory stridor, and mild respiratory distress. The child has a low-grade fever. What condition should the nurse suspect?",
    o: ["Croup (laryngotracheobronchitis)", "Epiglottitis", "Bronchiolitis", "Foreign body aspiration"],
    a: 0,
    r: "Croup (laryngotracheobronchitis) is a viral upper airway infection most common in children aged 6 months to 3 years. It presents with a barking seal-like cough, inspiratory stridor, hoarseness, and low-grade fever. Symptoms are often worse at night. Treatment includes cool mist humidification, racemic epinephrine for moderate-severe cases, and dexamethasone. Epiglottitis presents with high fever, drooling, and tripod positioning without the barking cough. Bronchiolitis presents with wheezing and expiratory distress. Foreign body aspiration has sudden onset without fever.",
    s: "Pediatrics"
  },
  {
    q: "A nurse is caring for a client who is 2 days post-thyroidectomy. The client reports tingling around the mouth and fingertips and develops a carpopedal spasm. What should the nurse suspect and what is the priority intervention?",
    o: ["Hypocalcemia from accidental parathyroid removal; administer IV calcium gluconate as prescribed", "Hypokalemia; administer IV potassium chloride", "Anxiety; provide reassurance and relaxation techniques", "Hypothyroidism; administer levothyroxine"],
    a: 0,
    r: "Post-thyroidectomy hypocalcemia occurs when the parathyroid glands are inadvertently damaged or removed during surgery. Parathyroid hormone (PTH) is essential for calcium regulation. Signs of hypocalcemia include perioral and peripheral tingling/numbness, positive Chvostek sign (facial muscle twitching with tapping), positive Trousseau sign (carpopedal spasm with BP cuff inflation), and in severe cases, laryngospasm and seizures. Priority: administer IV calcium gluconate to correct the deficiency. Keep tracheostomy tray at bedside for potential laryngospasm.",
    s: "Endocrine"
  },
  {
    q: "A nurse is assessing a client who was admitted for alcohol withdrawal. It is now 48 hours since the client's last drink. The client is agitated, diaphoretic, and reports seeing insects crawling on the walls. Vital signs: BP 180/100, HR 120, T 101.8°F. What condition has developed?",
    o: ["Delirium tremens", "Wernicke encephalopathy", "Korsakoff syndrome", "Alcohol hallucinosis"],
    a: 0,
    r: "Delirium tremens (DTs) is the most severe form of alcohol withdrawal, typically occurring 48-72 hours after the last drink. It presents with severe autonomic hyperactivity (hypertension, tachycardia, hyperthermia, diaphoresis), agitation, confusion, visual and tactile hallucinations (often insects or animals), and seizures. DTs has a 5-15% mortality rate without treatment. Management includes IV benzodiazepines (lorazepam or diazepam) using a symptom-triggered protocol (CIWA scale), fluid resuscitation, electrolyte correction, thiamine, and close monitoring in an ICU setting.",
    s: "Mental Health"
  },
  {
    q: "A nurse is caring for a client receiving total parenteral nutrition (TPN). The current bag runs out and the next bag is not yet available from the pharmacy. What should the nurse do?",
    o: ["Hang a bag of D10W at the same rate to prevent rebound hypoglycemia", "Discontinue the IV and wait for the new bag", "Hang normal saline at the same rate", "Decrease the infusion rate of the remaining TPN to make it last longer"],
    a: 0,
    r: "TPN contains high concentrations of dextrose that stimulate continuous insulin secretion. If TPN is abruptly discontinued, the ongoing insulin effect can cause severe rebound hypoglycemia. If the next TPN bag is unavailable, the nurse should hang D10W at the same rate to maintain glucose delivery and prevent hypoglycemia. Normal saline does not contain glucose and would not prevent this complication. TPN should never be adjusted without a provider order. Blood glucose monitoring is essential during any TPN transition.",
    s: "Clinical Procedures"
  },
  {
    q: "A nurse is caring for a client diagnosed with acute pancreatitis. Which position should the nurse assist the client into to help relieve pain?",
    o: ["Side-lying with knees drawn up to the chest (fetal position)", "Supine with legs extended flat", "Prone position", "High Fowler position with arms elevated"],
    a: 0,
    r: "The fetal position (side-lying with knees flexed toward the chest) helps relieve acute pancreatitis pain by reducing tension on the inflamed pancreas and surrounding peritoneum. Sitting up and leaning forward also provides relief. Lying supine or prone can increase pain by stretching the abdominal muscles over the inflamed organ. Pain management also includes NPO status, IV fluids, analgesics (meperidine was traditionally used but morphine is now acceptable), and NG suction if vomiting is persistent.",
    s: "Gastrointestinal"
  },
  {
    q: "A nurse is admitting a client with bipolar disorder who is in a manic phase. The client is pacing, speaking rapidly, and has not slept in 3 days. What is the priority nursing intervention?",
    o: ["Provide a safe, low-stimulation environment and ensure adequate nutrition and hydration", "Encourage the client to participate in group activities to redirect energy", "Administer a sleep aid and enforce strict bedrest", "Allow the client to continue pacing as it helps burn off excess energy"],
    a: 0,
    r: "During a manic episode, the priority is safety and meeting basic physiological needs. Clients in mania have poor judgment, impulsivity, grandiosity, and may neglect nutrition, hydration, and sleep. A low-stimulation environment reduces sensory overload that escalates manic behavior. Provide high-calorie finger foods (the client may be unable to sit for meals) and fluids. Group activities could increase stimulation and agitation. Strict bedrest is unrealistic and could escalate behavior. Continuous pacing without intervention risks exhaustion and dehydration.",
    s: "Mental Health"
  },
  {
    q: "A nurse is caring for a client receiving warfarin who has an INR of 5.2 without active bleeding. What intervention should the nurse anticipate?",
    o: ["Hold warfarin and administer oral vitamin K as prescribed", "Continue warfarin at the same dose and recheck INR in 1 week", "Administer IV protamine sulfate", "Transfuse fresh frozen plasma immediately"],
    a: 0,
    r: "An INR of 5.2 without active bleeding indicates supratherapeutic anticoagulation with increased hemorrhage risk. For INR above 5 without bleeding: hold warfarin and administer low-dose oral vitamin K (1-2.5 mg). Recheck INR in 24-48 hours. For INR above 9 without bleeding: higher dose vitamin K. For active life-threatening bleeding: IV vitamin K plus prothrombin complex concentrate (PCC) or fresh frozen plasma. Protamine sulfate is the antidote for heparin, not warfarin. FFP is reserved for active bleeding situations.",
    s: "Pharmacology"
  },
  {
    q: "A nurse is caring for a client with a closed head injury. Intracranial pressure monitoring shows an ICP of 25 mmHg. Which nursing intervention should be implemented to reduce ICP?",
    o: ["Elevate the head of bed to 30 degrees and keep the head in a midline neutral position", "Place the client flat in the Trendelenburg position", "Encourage the client to cough and deep breathe frequently", "Cluster all nursing care activities together to minimize disturbances"],
    a: 0,
    r: "Normal ICP is 5-15 mmHg; an ICP of 25 mmHg requires intervention. Elevating the HOB to 30 degrees promotes venous drainage from the brain via the jugular veins. Keeping the head midline prevents jugular vein compression. Trendelenburg position increases ICP by impeding venous return. Coughing increases intrathoracic pressure, which increases ICP. Clustering care causes sustained ICP spikes; instead, space activities to allow ICP to return to baseline between interventions. Other interventions: avoid hip flexion, maintain normothermia, administer mannitol or hypertonic saline as prescribed.",
    s: "Neurology"
  },
  {
    q: "A nurse is providing discharge teaching to a client prescribed lithium for bipolar disorder. Which instruction is most important?",
    o: ["Maintain consistent sodium and fluid intake and report symptoms of toxicity such as vomiting, diarrhea, tremor, and drowsiness", "Avoid all dairy products while taking this medication", "Take the medication on an empty stomach for better absorption", "Limit fluid intake to 1 liter per day to prevent water retention"],
    a: 0,
    r: "Lithium has a narrow therapeutic index (0.6-1.2 mEq/L). Sodium and lithium compete for reabsorption in the kidneys. Decreased sodium intake or dehydration causes the kidneys to retain lithium, leading to toxicity. Clients must maintain consistent sodium and fluid intake (2-3 L/day), avoid NSAIDs (reduce lithium excretion), and recognize toxicity signs: fine tremor progressing to coarse tremor, GI symptoms, confusion, and at severe levels, seizures, coma, and death. Regular lithium level monitoring is essential.",
    s: "Pharmacology"
  },
  {
    q: "A nurse is assessing a client who underwent a right modified radical mastectomy 4 hours ago. Which finding requires immediate intervention?",
    o: ["Hemovac drain containing 200 mL of sanguineous drainage in 4 hours with a distended appearance", "Client reports mild incisional tenderness rated 3/10", "Numbness along the inner aspect of the right upper arm", "Mild swelling of the right hand"],
    a: 0,
    r: "Excessive drainage (greater than 100 mL/hour initially) from a surgical drain after mastectomy suggests hemorrhage and requires immediate intervention. The nurse should assess vital signs for signs of hypovolemia (tachycardia, hypotension) and notify the surgeon. Mild incisional tenderness is expected. Numbness of the inner arm can occur from intercostobrachial nerve damage during axillary dissection. Mild hand swelling is expected and may progress to lymphedema, requiring long-term management.",
    s: "Clinical Procedures"
  },
  {
    q: "A nurse is providing education to a pregnant client at 28 weeks gestation who has Rh-negative blood. The father of the baby is Rh-positive. What should the nurse explain about RhoGAM administration?",
    o: ["RhoGAM is given at 28 weeks gestation and within 72 hours after delivery if the newborn is Rh-positive to prevent antibody formation", "RhoGAM is only needed after delivery", "RhoGAM is given to the newborn, not the mother", "RhoGAM is unnecessary if this is the first pregnancy"],
    a: 0,
    r: "RhoGAM (Rh immune globulin) prevents Rh sensitization in Rh-negative mothers carrying potentially Rh-positive fetuses. It is administered at 28 weeks gestation (antepartum prophylaxis) and within 72 hours after delivery if the newborn is confirmed Rh-positive. Without RhoGAM, maternal exposure to fetal Rh-positive blood causes antibody formation that can attack fetal red blood cells in subsequent pregnancies, causing hemolytic disease of the newborn (erythroblastosis fetalis). RhoGAM is also given after any potential fetal-maternal hemorrhage events (amniocentesis, ectopic pregnancy, miscarriage).",
    s: "Maternal-Newborn"
  }
];
