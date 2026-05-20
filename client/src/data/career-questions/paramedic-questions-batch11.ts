import type { CareerQuestion } from "./rrt-questions";

export const paramedicQuestionsBatch11: CareerQuestion[] = [
  {
    id: "para-med-001",
    stem: "A 62-year-old male presents with sudden onset of tearing chest pain radiating to the back, with a blood pressure difference of 30 mmHg between arms. This is most suspicious for:",
    options: [
      "Acute myocardial infarction",
      "Aortic dissection",
      "Pulmonary embolism",
      "Pericarditis"
    ],
    correctIndex: 1,
    rationale: "Acute aortic dissection classically presents with sudden, severe, 'tearing' or 'ripping' chest/back pain with unequal blood pressures between arms (>20 mmHg difference indicates involvement of the subclavian artery). Other findings may include pulse deficits, new aortic regurgitation murmur, and signs of end-organ ischemia. Management: control heart rate and blood pressure (target HR <60, SBP 100-120), avoid anticoagulants, and transport to a facility with cardiothoracic surgery.",
    difficulty: 3,
    category: "Medical Emergencies",
    topic: "Cardiovascular Emergencies"
  },
  {
    id: "para-med-002",
    stem: "A patient presents with severe epigastric pain radiating to the back, nausea, vomiting, and a history of heavy alcohol use. Vital signs: BP 108/72, HR 110, RR 22. This is most consistent with:",
    options: [
      "Acute cholecystitis",
      "Acute pancreatitis",
      "Peptic ulcer perforation",
      "Acute myocardial infarction"
    ],
    correctIndex: 1,
    rationale: "Acute pancreatitis presents with severe, steady epigastric pain radiating straight through to the back, often with nausea, vomiting, and tachycardia. The two most common causes are gallstones and alcohol abuse. The patient may feel relief leaning forward. Prehospital management includes IV fluid resuscitation (patients become third-space depleted), antiemetics, pain management, and transport. Serum lipase is the diagnostic test at the hospital.",
    difficulty: 3,
    category: "Medical Emergencies",
    topic: "Abdominal Emergencies"
  },
  {
    id: "para-med-003",
    stem: "A patient presents with acute onset shortness of breath, SpO2 88% on room air, JVD, clear lung sounds bilaterally, and hypotension. The 12-lead ECG shows S1Q3T3 pattern with right axis deviation. The most likely diagnosis is:",
    options: [
      "Acute heart failure (CHF)",
      "Tension pneumothorax",
      "Massive pulmonary embolism",
      "Cardiac tamponade"
    ],
    correctIndex: 2,
    rationale: "The combination of acute dyspnea, hypoxemia, JVD, clear lungs, hypotension, and S1Q3T3 pattern on ECG (S wave in Lead I, Q wave and inverted T wave in Lead III) with right axis deviation is classic for massive pulmonary embolism. The PE causes acute right heart failure (JVD) without pulmonary edema (clear lungs). CHF would have pulmonary crackles. Tension PTX would have absent breath sounds unilaterally.",
    difficulty: 4,
    category: "Medical Emergencies",
    topic: "Cardiovascular Emergencies"
  },
  {
    id: "para-med-004",
    stem: "A 55-year-old patient presents with sudden onset of severe headache, vomiting, left-sided weakness, and BP of 220/130. GCS is 10. The MOST appropriate prehospital management is:",
    options: [
      "Administer aspirin 325 mg and nitroglycerin SL",
      "Protect the airway, provide supplemental O2, do NOT aggressively lower BP in the field, and transport to a stroke center",
      "Administer IV labetalol to lower BP to 120/80",
      "Administer tPA in the field"
    ],
    correctIndex: 1,
    rationale: "This presentation (severe headache, vomiting, focal neurological deficit, severe hypertension) suggests hemorrhagic stroke. Prehospital management: protect the airway (GCS 10 may need advanced airway), provide oxygen to maintain SpO2 >94%, do NOT aggressively lower BP (hypertension maintains cerebral perfusion — only treat if SBP >220 per most protocols), and transport to a stroke center. Do NOT administer aspirin or anticoagulants — hemorrhagic stroke is a contraindication.",
    difficulty: 4,
    category: "Medical Emergencies",
    topic: "Neurological Emergencies"
  },
  {
    id: "para-med-005",
    stem: "A 22-year-old college student presents with fever of 39.5°C, severe headache, neck stiffness, and a rash that does not blanch when pressed (petechial rash). The paramedic should:",
    options: [
      "Administer acetaminophen and suggest follow-up with primary care",
      "Apply droplet precautions (mask), initiate IV access and fluid resuscitation, and transport emergently with hospital pre-notification",
      "Administer IM epinephrine for allergic reaction",
      "Apply a cervical collar for the neck stiffness"
    ],
    correctIndex: 1,
    rationale: "Fever, headache, neck stiffness (meningismus), and non-blanching petechial rash is classic for meningococcal meningitis/septicemia — a rapidly fatal infection if untreated. Prehospital management: droplet precautions (surgical mask on patient and providers), IV access, fluid bolus for signs of sepsis, and emergent transport with pre-notification. The disease can progress from first symptoms to death within hours. Post-exposure prophylaxis is required for close contacts.",
    difficulty: 3,
    category: "Medical Emergencies",
    topic: "Infectious Disease"
  },
  {
    id: "para-med-006",
    stem: "A patient presents with acute onset of flank pain radiating to the groin, nausea, and inability to find a comfortable position (writhing in pain). Urinalysis by history shows microscopic hematuria. This is most consistent with:",
    options: [
      "Appendicitis",
      "Renal colic (kidney stone)",
      "Abdominal aortic aneurysm rupture",
      "Ovarian torsion"
    ],
    correctIndex: 1,
    rationale: "Renal colic from nephrolithiasis (kidney stones) presents with acute, severe, colicky flank pain radiating to the groin (follows the ureter's path), with nausea/vomiting and restlessness (patients cannot find a comfortable position, unlike peritonitis where patients lie still). Hematuria is present in ~85% of cases. Prehospital management: IV access, aggressive pain management (ketorolac 15-30 mg IV is highly effective, opioids as needed), antiemetics, and transport.",
    difficulty: 2,
    category: "Medical Emergencies",
    topic: "Genitourinary Emergencies"
  },
  {
    id: "para-med-007",
    stem: "A patient with a history of COPD on home oxygen at 2 LPM presents with increased dyspnea, pursed-lip breathing, barrel chest, and SpO2 of 86%. After initial assessment, the paramedic should:",
    options: [
      "Withhold supplemental oxygen to avoid suppressing the hypoxic drive",
      "Apply oxygen titrated to SpO2 88-92%, administer bronchodilators (albuterol +/- ipratropium), and consider CPAP",
      "Intubate immediately",
      "Administer high-flow oxygen at 15 LPM via NRB and nothing else"
    ],
    correctIndex: 1,
    rationale: "COPD patients should receive supplemental oxygen titrated to SpO2 88-92% (not withheld entirely). The hypoxic drive concern is largely overstated — hypoxemia kills faster than hyperoxia-induced hypoventilation. Administer bronchodilators (albuterol 2.5 mg + ipratropium 0.5 mg nebulized). CPAP (5-10 cmH2O) reduces work of breathing and improves gas exchange. Monitor closely for respiratory fatigue that may require intubation.",
    difficulty: 3,
    category: "Medical Emergencies",
    topic: "Respiratory Emergencies"
  },
  {
    id: "para-med-008",
    stem: "A patient presents with a sudden onset of unilateral leg swelling, warmth, tenderness, and redness of the calf. The patient recently had knee replacement surgery. This is most concerning for:",
    options: [
      "Cellulitis",
      "Deep vein thrombosis (DVT)",
      "Arterial occlusion",
      "Compartment syndrome"
    ],
    correctIndex: 1,
    rationale: "Unilateral leg swelling, warmth, tenderness, and redness after recent surgery (immobilization) is classic for deep vein thrombosis (DVT). Risk factors include recent surgery, immobilization, malignancy, obesity, and oral contraceptives (Virchow's triad: stasis, endothelial injury, hypercoagulability). The major concern is that the DVT may embolize to the lungs, causing a pulmonary embolism. Do not massage the affected extremity. Transport for ultrasound confirmation and anticoagulation.",
    difficulty: 2,
    category: "Medical Emergencies",
    topic: "Cardiovascular Emergencies"
  },
  {
    id: "para-med-009",
    stem: "A 68-year-old patient with a known abdominal aortic aneurysm (AAA) presents with sudden severe abdominal and back pain, hypotension (BP 78/50), and a pulsatile abdominal mass. This is MOST consistent with:",
    options: [
      "Acute pancreatitis",
      "Ruptured abdominal aortic aneurysm",
      "Mesenteric ischemia",
      "Renal colic"
    ],
    correctIndex: 1,
    rationale: "The classic triad of ruptured AAA is: sudden severe abdominal/back pain, hypotension, and a pulsatile abdominal mass. This is a surgical emergency with extremely high mortality if not treated immediately. Prehospital management: bilateral large-bore IVs, permissive hypotension (target SBP 80-90 to avoid disrupting the clot), minimize on-scene time, and emergent transport to a facility with vascular surgery capability. Do NOT delay transport for procedures.",
    difficulty: 3,
    category: "Medical Emergencies",
    topic: "Cardiovascular Emergencies"
  },
  {
    id: "para-med-010",
    stem: "A patient presents after a submersion event with progressive dyspnea, cough with frothy sputum, and crackles heard bilaterally. SpO2 is 82%. This is consistent with:",
    options: [
      "Aspiration pneumonia (delayed presentation)",
      "Submersion injury with pulmonary edema and surfactant washout",
      "Spontaneous pneumothorax",
      "Upper airway obstruction"
    ],
    correctIndex: 1,
    rationale: "Submersion injury (drowning) causes pulmonary edema from direct water aspiration, surfactant washout (increased alveolar surface tension causing collapse), and inflammatory response. Both salt and fresh water aspiration cause similar clinical presentations. Management: high-flow oxygen or BVM ventilation, CPAP if conscious, intubation if needed, PEEP to recruit collapsed alveoli. All submersion patients need hospital evaluation — delayed pulmonary edema can occur hours later.",
    difficulty: 3,
    category: "Medical Emergencies",
    topic: "Environmental Emergencies"
  },
  {
    id: "para-med-011",
    stem: "A patient with a core body temperature of 30°C (86°F) is found unresponsive. The monitor shows a slow, irregular rhythm. The paramedic should:",
    options: [
      "Defibrillate immediately if any dysrhythmia is present",
      "Handle the patient gently, provide passive and active rewarming, and limit defibrillation to one attempt if VF — withhold medications until core temp >30°C",
      "Aggressively rewarm by immersing the patient in hot water",
      "Perform CPR at double the normal rate to generate heat"
    ],
    correctIndex: 1,
    rationale: "Severe hypothermia (<30°C) makes the heart extremely irritable and resistant to defibrillation and medications. Management: handle gently (rough handling can precipitate VF), remove wet clothing, provide passive rewarming (blankets) and active rewarming (warm IV fluids, warm humidified O2). If in VF, attempt defibrillation once — if unsuccessful, defer further shocks and medications until core temp rises above 30°C. CPR is performed at normal rate. 'No one is dead until warm and dead.'",
    difficulty: 4,
    category: "Medical Emergencies",
    topic: "Environmental Emergencies"
  },
  {
    id: "para-med-012",
    stem: "A construction worker presents with confusion, hot dry skin, temperature of 41.5°C (107°F), and tachycardia after working outdoors in extreme heat. This is:",
    options: [
      "Heat exhaustion",
      "Heat stroke",
      "Heat cramps",
      "Dehydration"
    ],
    correctIndex: 1,
    rationale: "Heat stroke is defined by core temperature >40°C (104°F) with altered mental status. Classic (non-exertional) heat stroke presents with hot, DRY skin; exertional heat stroke (as in this worker) may still have sweating. This is a life-threatening emergency requiring immediate aggressive cooling: remove from heat, remove clothing, apply cold water/ice, cold packs to neck/axillae/groin, cold IV fluids. Target: reduce temp to 39°C within 30 minutes. Heat stroke has ~50% mortality if untreated.",
    difficulty: 2,
    category: "Medical Emergencies",
    topic: "Environmental Emergencies"
  },
  {
    id: "para-med-013",
    stem: "A patient presents with a GCS of 14, slurred speech, ataxia, nystagmus, and a blood alcohol level reportedly 'very high.' The paramedic should:",
    options: [
      "Assume the patient is simply intoxicated and allow them to refuse transport",
      "Perform a thorough assessment including blood glucose, pupil exam, and neurological evaluation to rule out other causes mimicking intoxication (head injury, stroke, hypoglycemia, toxicology)",
      "Place the patient in a taxi to go home",
      "Administer naloxone for suspected opioid intoxication"
    ],
    correctIndex: 1,
    rationale: "Never assume altered mental status is solely due to alcohol intoxication. Many life-threatening conditions mimic intoxication: hypoglycemia, traumatic brain injury (intoxicated patients fall frequently), stroke, sepsis, meningitis, toxicological emergencies, and hepatic encephalopathy. Always perform a complete assessment including blood glucose, pupil examination, motor/sensory exam, and vital signs. Intoxicated patients cannot reliably refuse transport.",
    difficulty: 3,
    category: "Medical Emergencies",
    topic: "Altered Mental Status"
  },
  {
    id: "para-airway-001",
    stem: "During BVM ventilation, a patient's stomach is becoming progressively distended. The MOST likely cause and correction is:",
    options: [
      "The patient has a pneumothorax — perform needle decompression",
      "Excessive ventilation volume/rate or poor airway positioning — reduce tidal volume, slow rate, and ensure proper head-tilt/chin-lift or jaw thrust",
      "The BVM is defective and should be replaced",
      "The patient is swallowing air voluntarily"
    ],
    correctIndex: 1,
    rationale: "Gastric distention during BVM ventilation is caused by air entering the esophagus instead of (or in addition to) the trachea. Common causes: excessive tidal volumes, excessively rapid ventilation rate, poor airway positioning, or inadequate mask seal. Correction: reduce tidal volume (just enough for visible chest rise), slow ventilation rate (10-12/min), ensure proper airway alignment, and consider an OPA or NPA. Gastric distention increases aspiration risk and impedes ventilation.",
    difficulty: 2,
    category: "Airway Management",
    topic: "Bag-Valve-Mask Ventilation"
  },
  {
    id: "para-airway-002",
    stem: "After intubation, ETCO2 monitoring shows a waveform with a value of 45 mmHg. The colorimetric CO2 detector turns yellow. This confirms:",
    options: [
      "Esophageal intubation",
      "Correct tracheal tube placement",
      "Bronchial intubation",
      "Equipment malfunction"
    ],
    correctIndex: 1,
    rationale: "A sustained ETCO2 waveform with normal values (35-45 mmHg) and a yellow color change on colorimetric detector confirms tracheal placement. Esophageal intubation shows no sustained waveform and the detector stays purple. ETCO2 (capnography) is the gold standard for confirming ET tube placement. Additional confirmation: bilateral breath sounds, chest rise, absence of epigastric sounds, tube misting, and improving SpO2. Monitor ETCO2 continuously during transport.",
    difficulty: 2,
    category: "Airway Management",
    topic: "Capnography"
  },
  {
    id: "para-airway-003",
    stem: "A patient with facial burns, singed nasal hairs, carbonaceous sputum, and hoarseness needs airway intervention. The concern is:",
    options: [
      "The patient will develop pneumonia later",
      "Impending airway edema that may progress to complete obstruction — early intubation is critical",
      "The patient's lungs are permanently damaged",
      "Carbon monoxide poisoning only"
    ],
    correctIndex: 1,
    rationale: "Facial burns, singed nasal hairs, carbonaceous sputum, hoarseness, and stridor are signs of inhalation injury with impending upper airway edema. Supraglottic structures swell rapidly, potentially causing complete airway obstruction within minutes to hours. Early intubation is critical before the edema makes intubation impossible. Once swelling progresses, a surgical airway may be the only option. Also treat for CO poisoning (high-flow O2 100%) and cyanide exposure (hydroxocobalamin).",
    difficulty: 3,
    category: "Airway Management",
    topic: "Burn Airway Management"
  },
  {
    id: "para-airway-004",
    stem: "A 'cannot intubate, cannot oxygenate' (CICO) situation has been declared. The paramedic should perform:",
    options: [
      "Repeated intubation attempts with different blade sizes",
      "Surgical cricothyrotomy — incision through the cricothyroid membrane",
      "Nasopharyngeal airway placement",
      "Needle decompression of the chest"
    ],
    correctIndex: 1,
    rationale: "CICO (cannot intubate, cannot oxygenate) is a true airway emergency where all non-surgical methods have failed. Surgical cricothyrotomy involves a vertical skin incision over the cricothyroid membrane, horizontal incision through the membrane, and insertion of a cuffed tracheostomy or ET tube (6.0). This is the definitive rescue airway. Needle cricothyrotomy (14-gauge catheter) is an alternative but provides only temporary oxygenation, not ventilation.",
    difficulty: 4,
    category: "Airway Management",
    topic: "Surgical Airways"
  },
  {
    id: "para-airway-005",
    stem: "The King LT (laryngeal tube) supraglottic airway is inserted into the:",
    options: [
      "Trachea, past the vocal cords",
      "Esophagus, with ventilation ports positioned at the level of the laryngeal inlet",
      "Nasopharynx",
      "Cricothyroid membrane"
    ],
    correctIndex: 1,
    rationale: "The King LT is a supraglottic airway device inserted blindly into the esophagus. It has two cuffs: a proximal cuff that seals the oropharynx and a distal cuff that seals the esophagus. Ventilation ports between the two cuffs direct air into the tracheal opening. Advantages: easier to insert than an ET tube, no laryngoscope needed, usable by BLS providers. Limitations: does not provide the same aspiration protection as an ET tube.",
    difficulty: 3,
    category: "Airway Management",
    topic: "Supraglottic Airways"
  },
  {
    id: "para-airway-006",
    stem: "Preoxygenation before RSI should ideally achieve an SpO2 of:",
    options: [
      "90% for at least 1 minute",
      "100% (or as close as possible) for at least 3 minutes of tidal breathing on high-flow O2 or 8 vital capacity breaths on 100% O2",
      "95% for 30 seconds",
      "85% is sufficient to proceed"
    ],
    correctIndex: 1,
    rationale: "Adequate preoxygenation replaces nitrogen in the functional residual capacity (FRC) with oxygen, creating an 'oxygen reserve' that extends the safe apnea time. The goal is SpO2 as close to 100% as possible. Methods: 3 minutes of tidal breathing on NRB at 15 LPM, or 8 deep vital capacity breaths on 100% O2. Apneic oxygenation (nasal cannula at 15 LPM during the apneic period) further extends safe apnea time. Obese and pediatric patients desaturate faster.",
    difficulty: 3,
    category: "Airway Management",
    topic: "RSI Preparation"
  },
  {
    id: "para-airway-007",
    stem: "CPAP (Continuous Positive Airway Pressure) is indicated for which of the following conditions?",
    options: [
      "Tension pneumothorax",
      "Acute pulmonary edema (CHF) and COPD exacerbation with adequate respiratory effort",
      "Cardiac arrest",
      "Complete upper airway obstruction"
    ],
    correctIndex: 1,
    rationale: "CPAP is indicated for acute pulmonary edema (CHF exacerbation) and COPD exacerbation in patients who are conscious, can protect their airway, and have adequate respiratory effort. CPAP provides continuous positive pressure (typically 5-10 cmH2O) that splints open alveoli, improves oxygenation, reduces preload, and decreases work of breathing. Contraindications: apnea, inability to protect airway, pneumothorax, severe hypotension, facial trauma, and vomiting.",
    difficulty: 2,
    category: "Airway Management",
    topic: "Non-invasive Ventilation"
  },
  {
    id: "para-med-014",
    stem: "A patient with Type 1 diabetes presents with blood glucose of 520 mg/dL, Kussmaul respirations, fruity breath odor, and altered mental status. This is:",
    options: [
      "Hyperosmolar hyperglycemic state (HHS)",
      "Diabetic ketoacidosis (DKA)",
      "Hypoglycemia",
      "Insulin shock"
    ],
    correctIndex: 1,
    rationale: "DKA presents with hyperglycemia (usually 250-800 mg/dL), Kussmaul respirations (deep, rapid breathing compensating for metabolic acidosis), fruity/acetone breath odor (from ketone production), dehydration, and altered mental status. It occurs primarily in Type 1 diabetes from absolute insulin deficiency. HHS occurs in Type 2 diabetes with much higher glucose (>600) but without significant ketosis. Treatment: fluid resuscitation (NS bolus), cardiac monitoring, transport.",
    difficulty: 2,
    category: "Medical Emergencies",
    topic: "Endocrine Emergencies"
  },
  {
    id: "para-med-015",
    stem: "A patient is found unresponsive near an enclosed space heater. CO-oximetry shows SpCO of 35%. The patient's standard pulse oximeter reads 98%. This discrepancy occurs because:",
    options: [
      "The pulse oximeter is malfunctioning",
      "Standard pulse oximetry cannot distinguish carboxyhemoglobin from oxyhemoglobin, falsely reading normal SpO2 in CO poisoning",
      "The CO-oximeter is inaccurate",
      "CO poisoning does not affect oxygen levels"
    ],
    correctIndex: 1,
    rationale: "Standard pulse oximetry measures the ratio of oxyhemoglobin to deoxyhemoglobin using two wavelengths of light. Carboxyhemoglobin (COHb) absorbs light similarly to oxyhemoglobin, so the pulse oximeter reads CO-bound hemoglobin as if it were carrying oxygen, producing falsely normal SpO2 readings. CO-oximetry uses multiple wavelengths to specifically detect COHb, methemoglobin, and oxyhemoglobin. Never rely on standard SpO2 in suspected CO poisoning.",
    difficulty: 3,
    category: "Medical Emergencies",
    topic: "Toxicological Emergencies"
  },
  {
    id: "para-med-016",
    stem: "A patient presents after ingesting a bottle of aspirin (salicylate overdose). Expected findings include:",
    options: [
      "Bradycardia, hypothermia, and respiratory depression",
      "Tachypnea (respiratory alkalosis initially), tinnitus, diaphoresis, nausea/vomiting, and eventual metabolic acidosis",
      "Pinpoint pupils and respiratory depression",
      "Seizures and skin rash only"
    ],
    correctIndex: 1,
    rationale: "Salicylate (aspirin) toxicity follows a characteristic pattern: initial respiratory alkalosis (direct stimulation of the medullary respiratory center causing tachypnea), followed by metabolic acidosis (uncoupling of oxidative phosphorylation). Other findings include tinnitus, diaphoresis, nausea/vomiting, hyperthermia, altered mental status, and potentially seizures. Severe cases: pulmonary edema, cerebral edema, coagulopathy. Treatment: sodium bicarbonate to alkalinize urine and blood. Do NOT give activated charcoal if AMS.",
    difficulty: 4,
    category: "Medical Emergencies",
    topic: "Toxicological Emergencies"
  },
  {
    id: "para-med-017",
    stem: "A patient with known Addison's disease (adrenal insufficiency) presents with weakness, hypotension unresponsive to fluids, abdominal pain, and hyperpigmentation. This is:",
    options: [
      "Cushing syndrome",
      "Adrenal (Addisonian) crisis",
      "Thyroid storm",
      "Myxedema coma"
    ],
    correctIndex: 1,
    rationale: "Adrenal crisis occurs when cortisol deficiency (Addison's disease) is stressed by illness, trauma, or medication non-compliance. Presents with profound hypotension refractory to fluid resuscitation (cortisol is needed for vascular tone), weakness, abdominal pain, nausea/vomiting, and hyperpigmentation (from elevated ACTH stimulating melanocytes). Treatment: IV fluids, dextrose for hypoglycemia, and hydrocortisone 100 mg IV (stress-dose steroids) — this is the definitive treatment.",
    difficulty: 4,
    category: "Medical Emergencies",
    topic: "Endocrine Emergencies"
  },
  {
    id: "para-med-018",
    stem: "A scuba diver surfaces too rapidly from 100 feet and develops joint pain, skin mottling, dizziness, and difficulty breathing. This is:",
    options: [
      "Nitrogen narcosis",
      "Decompression sickness (the bends)",
      "Arterial gas embolism",
      "Barotrauma of descent (squeeze)"
    ],
    correctIndex: 1,
    rationale: "Decompression sickness (DCS/'the bends') occurs when dissolved nitrogen forms bubbles in tissues and blood during rapid ascent. Joint pain ('the bends'), skin mottling ('the creeps'), neurological symptoms, and respiratory distress ('the chokes') can develop. Treatment: high-flow 100% O2, IV fluids, left lateral/Trendelenburg position, and urgent transport to a hyperbaric chamber for recompression therapy. Do NOT return the patient to depth.",
    difficulty: 3,
    category: "Medical Emergencies",
    topic: "Environmental Emergencies"
  },
  {
    id: "para-med-019",
    stem: "A patient bitten by a rattlesnake on the forearm presents with progressive swelling, ecchymosis, and pain spreading up the arm. Appropriate prehospital management includes:",
    options: [
      "Apply a tourniquet above the bite to prevent venom spread",
      "Immobilize the extremity at or below heart level, remove constricting items (rings, watches), provide pain management, and transport to a facility with antivenom",
      "Make incisions over the fang marks and apply suction",
      "Apply ice directly to the bite site"
    ],
    correctIndex: 1,
    rationale: "Prehospital management of pit viper (rattlesnake, copperhead, cottonmouth) envenomation: immobilize the extremity at or slightly below heart level, remove jewelry and constricting items (swelling will progress), mark the leading edge of swelling/erythema with a pen and time, provide pain management, and transport to a facility with CroFab or Anavip antivenom. Do NOT: apply tourniquet, ice, cut, suck, or apply electrical shock — these worsen outcomes.",
    difficulty: 3,
    category: "Medical Emergencies",
    topic: "Environmental Emergencies"
  },
  {
    id: "para-med-020",
    stem: "The Rule of Nines for estimating total body surface area (TBSA) burned in adults assigns what percentage to each lower extremity?",
    options: [
      "9%",
      "18%",
      "14%",
      "27%"
    ],
    correctIndex: 1,
    rationale: "The Rule of Nines for adults: head/neck = 9%, each upper extremity = 9%, anterior trunk = 18%, posterior trunk = 18%, each lower extremity = 18%, perineum/genitalia = 1%. Total = 100%. Pediatric patients have a proportionally larger head (18%) and smaller legs (14% each). The patient's palm (including fingers) represents ~1% TBSA and can be used to estimate irregular burn patterns. Burns >20% TBSA require aggressive fluid resuscitation.",
    difficulty: 2,
    category: "Medical Emergencies",
    topic: "Burn Management"
  },
  {
    id: "para-med-021",
    stem: "A patient who was in a house fire presents with cherry-red skin color, headache, confusion, and nausea. SpO2 reads 99%. The paramedic should suspect:",
    options: [
      "The patient is uninjured",
      "Carbon monoxide poisoning",
      "Cyanide poisoning only",
      "Smoke inhalation without systemic effects"
    ],
    correctIndex: 1,
    rationale: "Cherry-red skin color (though often difficult to appreciate), headache, confusion, nausea, and falsely normal SpO2 in a fire victim is classic for carbon monoxide (CO) poisoning. CO binds hemoglobin with 200-250x greater affinity than oxygen, creating carboxyhemoglobin that cannot carry oxygen. Treatment: 100% oxygen via NRB (reduces CO half-life from 4-6 hours to 60-90 minutes). Consider concurrent cyanide poisoning (from burning synthetics) — treat with hydroxocobalamin (Cyanokit).",
    difficulty: 2,
    category: "Medical Emergencies",
    topic: "Toxicological Emergencies"
  },
  {
    id: "para-med-022",
    stem: "A patient is in the early stages of compensated hypovolemic shock. Which of the following signs would the paramedic expect to find?",
    options: [
      "Hypotension, bradycardia, and warm skin",
      "Tachycardia, narrowed pulse pressure, anxiety/restlessness, and cool/pale/diaphoretic skin with normal or slightly low BP",
      "Hypertension, bradycardia, and bounding pulses",
      "Normal vital signs with no clinical findings"
    ],
    correctIndex: 1,
    rationale: "Compensated shock occurs when the body's compensatory mechanisms (catecholamine release, vasoconstriction) maintain adequate blood pressure despite decreased perfusion. Signs include: tachycardia (earliest sign), narrowed pulse pressure (due to increased diastolic from vasoconstriction), anxiety/restlessness, cool/pale/diaphoretic skin, slightly decreased urine output, and delayed capillary refill (>2 seconds). Blood pressure may be normal or only slightly decreased. Recognition at this stage allows earlier intervention.",
    difficulty: 3,
    category: "Medical Emergencies",
    topic: "Shock"
  },
  {
    id: "para-med-023",
    stem: "A patient presents after a lightning strike with cardiac arrest. Unlike other trauma arrest patients, lightning strike victims should:",
    options: [
      "Not receive CPR due to the electrical nature of the injury",
      "Receive immediate, aggressive CPR — lightning arrest has a higher survival rate than other traumatic arrests, especially with early intervention",
      "Be treated with defibrillation only",
      "Be placed on a backboard but not resuscitated"
    ],
    correctIndex: 1,
    rationale: "Lightning strike cardiac arrest has a much higher survival rate than other traumatic arrests because the cause is a massive DC countershock that often causes transient asystole or VF. With immediate CPR and defibrillation, many victims can be successfully resuscitated. In mass lightning casualty events, 'reverse triage' applies: treat the apparently dead first (they may be salvageable with CPR), as those who are breathing will likely survive without intervention.",
    difficulty: 4,
    category: "Medical Emergencies",
    topic: "Environmental Emergencies"
  },
  {
    id: "para-med-024",
    stem: "A patient with a known tracheostomy presents in respiratory distress. The inner cannula appears occluded with secretions. The FIRST step is:",
    options: [
      "Perform a surgical cricothyrotomy",
      "Remove and clean or replace the inner cannula, then suction the tracheostomy",
      "Cover the stoma and ventilate via the mouth",
      "Administer albuterol via nebulizer"
    ],
    correctIndex: 1,
    rationale: "Most tracheostomy tubes have a removable inner cannula that can be quickly removed, cleaned or replaced, to relieve obstruction. If the inner cannula is occluded: remove it, attempt to clean or replace with a spare, and suction the tracheostomy tube. If the tube itself is dislodged or cannot be cleared, remove it entirely and attempt bag-valve-stoma ventilation. If unsuccessful, cover the stoma and ventilate via the mouth/nose (upper airway may or may not be patent depending on tracheostomy type).",
    difficulty: 3,
    category: "Airway Management",
    topic: "Special Airway Considerations"
  },
  {
    id: "para-med-025",
    stem: "The Parkland formula for fluid resuscitation in burn patients is:",
    options: [
      "1 mL/kg/% TBSA burned, half given in first 8 hours",
      "4 mL/kg/% TBSA burned of Lactated Ringer's, half given in first 8 hours from time of burn, remainder over next 16 hours",
      "10 mL/kg bolus regardless of burn size",
      "Normal saline at 250 mL/hr for all burn patients"
    ],
    correctIndex: 1,
    rationale: "The Parkland formula calculates 24-hour fluid needs: 4 mL × body weight (kg) × %TBSA burned. Half the calculated volume is given in the first 8 hours from the time of injury (not from the time of hospital arrival), and the remaining half over the next 16 hours. Lactated Ringer's solution is preferred. Example: 80 kg patient with 40% TBSA = 4 × 80 × 40 = 12,800 mL in 24 hours (6,400 mL in the first 8 hours = ~800 mL/hr initially).",
    difficulty: 3,
    category: "Medical Emergencies",
    topic: "Burn Management"
  },
  {
    id: "para-airway-011",
    stem: "A patient with suspected epiglottitis presents with drooling, stridor, tripod positioning, and a muffled voice. The paramedic should:",
    options: [
      "Immediately attempt direct laryngoscopy to visualize the epiglottis",
      "Allow the patient to remain in the position of comfort, administer humidified O2, avoid agitating the patient, and prepare for a surgical airway if complete obstruction occurs",
      "Lay the patient supine and insert an oropharyngeal airway",
      "Perform blind nasotracheal intubation"
    ],
    correctIndex: 1,
    rationale: "Epiglottitis is a life-threatening emergency where the epiglottis and surrounding structures are acutely inflamed and edematous. ANY agitation (including attempts at visualization, supine positioning, or forced interventions) can precipitate complete airway obstruction. Keep the patient in their position of comfort, administer humidified oxygen, prepare for a surgical airway (cricothyrotomy), and transport emergently. Definitive airway management should occur in the OR with surgical backup.",
    difficulty: 3,
    category: "Airway Management",
    topic: "Upper Airway Obstruction"
  },
  {
    id: "para-airway-012",
    stem: "During bag-valve-mask (BVM) ventilation, adequate ventilation is best confirmed by:",
    options: [
      "Hearing air escape from the mask seal",
      "Observing bilateral chest rise and fall with each ventilation and monitoring ETCO2 waveform",
      "Squeezing the bag as hard as possible",
      "Auscultating over the epigastrium for gurgling"
    ],
    correctIndex: 1,
    rationale: "Effective BVM ventilation is confirmed by: bilateral chest rise and fall, ETCO2 waveform (confirms ventilation is reaching the alveoli), improving SpO2, and bilateral breath sounds on auscultation. Gastric inflation (epigastric gurgling/distension) indicates improper technique. Use the E-C clamp technique for mask seal, deliver each breath over 1 second with just enough volume to produce visible chest rise, and consider an oropharyngeal or nasopharyngeal airway as adjuncts.",
    difficulty: 2,
    category: "Airway Management",
    topic: "Basic Airway Management"
  },
  {
    id: "para-trauma-016",
    stem: "A patient presents after a motorcycle collision with paradoxical movement of a segment of the chest wall during respiration. This finding is called:",
    options: [
      "Pneumothorax",
      "Flail chest — three or more adjacent ribs fractured in two or more places",
      "Hemothorax",
      "Cardiac tamponade"
    ],
    correctIndex: 1,
    rationale: "Flail chest occurs when three or more adjacent ribs are each fractured in two or more places, creating a free-floating segment that moves paradoxically (inward on inspiration, outward on expiration). The primary life threat is the underlying pulmonary contusion, not the mechanical instability. Treatment: positive pressure ventilation (BVM or intubation) to internally splint the segment, pain management (to allow adequate breathing), supplemental O2, and IV fluids. Avoid taping or external splinting.",
    difficulty: 3,
    category: "Trauma Management",
    topic: "Chest Trauma"
  },
  {
    id: "para-trauma-017",
    stem: "A patient with a gunshot wound to the abdomen is hypotensive with a distended, rigid abdomen. Prehospital management priorities include:",
    options: [
      "Perform a detailed abdominal exam and apply cold packs",
      "Control external hemorrhage, establish large-bore IV access, begin permissive hypotension (target SBP 80-90 mmHg), and provide rapid transport to a trauma center",
      "Wait for ALS backup before beginning treatment",
      "Administer a 2-liter crystalloid bolus to normalize blood pressure"
    ],
    correctIndex: 1,
    rationale: "Penetrating abdominal trauma with hypotension indicates intra-abdominal hemorrhage requiring surgical intervention. Prehospital priorities: control external bleeding, establish two large-bore IVs, practice permissive hypotension (target SBP 80-90 mmHg — avoiding aggressive fluid resuscitation that disrupts clot formation and dilutes clotting factors), keep the patient warm, and provide the fastest transport to a trauma center. Definitive care is surgical — minimize scene time.",
    difficulty: 3,
    category: "Trauma Management",
    topic: "Abdominal Trauma"
  },
  {
    id: "para-assess-006",
    stem: "The Cincinnati Prehospital Stroke Scale evaluates which three findings?",
    options: [
      "Blood pressure, heart rate, and respiratory rate",
      "Facial droop, arm drift, and speech abnormalities",
      "Pupil reactivity, gait, and memory",
      "Glasgow Coma Scale, blood glucose, and SpO2"
    ],
    correctIndex: 1,
    rationale: "The Cincinnati Prehospital Stroke Scale (CPSS) is a rapid stroke screening tool evaluating three components: facial droop (ask patient to smile — observe for asymmetry), arm drift (arms extended with eyes closed for 10 seconds — observe for one arm drifting down), and speech (repeat 'you can't teach an old dog new tricks' — listen for slurring or incorrect words). Any ONE abnormal finding has a 72% sensitivity for stroke. Document the time of symptom onset (or when last known normal) for thrombolytic eligibility.",
    difficulty: 2,
    category: "Patient Assessment",
    topic: "Neurological Assessment"
  },
  {
    id: "para-assess-007",
    stem: "During assessment of a trauma patient, the 'lethal triad' (trauma triad of death) refers to:",
    options: [
      "Airway, breathing, and circulation problems",
      "Hypothermia, acidosis, and coagulopathy",
      "Head injury, chest injury, and abdominal injury",
      "Hypotension, tachycardia, and altered mental status"
    ],
    correctIndex: 1,
    rationale: "The 'lethal triad' or 'trauma triad of death' is a self-reinforcing cycle of hypothermia, metabolic acidosis, and coagulopathy. Each component worsens the others: hypothermia impairs coagulation enzymes, acidosis reduces clotting factor function, and ongoing hemorrhage causes more hypothermia and acidosis. Prevention is critical: keep the patient warm (blankets, warm fluids, heated ambulance), minimize crystalloid infusion (use blood products when available), and provide rapid surgical intervention.",
    difficulty: 3,
    category: "Patient Assessment",
    topic: "Trauma Assessment"
  },
  {
    id: "para-ops-006",
    stem: "When arriving at a scene involving a vehicle into a building with structural damage, the paramedic should:",
    options: [
      "Immediately enter the building to search for victims",
      "Establish a safe perimeter, request fire/rescue and structural assessment, ensure the vehicle is stabilized and the ignition is off, and await clearance before patient contact",
      "Begin treating patients inside the building immediately",
      "Request a helicopter for aerial assessment"
    ],
    correctIndex: 1,
    rationale: "A vehicle into a building creates multiple hazards: structural collapse risk, fuel leak/fire hazard, utility damage (gas/electric), and unstable vehicle. Scene safety protocol: establish a perimeter (minimum 50 feet), request fire/rescue for structural assessment, ensure the vehicle is stabilized (chocked, ignition off, battery disconnected), verify no gas leaks (request utility company shutoff), and do NOT enter until fire/rescue clears the structure. Patient care begins only after scene safety is confirmed.",
    difficulty: 3,
    category: "EMS Operations",
    topic: "Scene Safety"
  },
  {
    id: "para-cardio-011",
    stem: "A patient with an acute inferior wall STEMI (ST elevation in leads II, III, aVF) develops hypotension. The paramedic should suspect:",
    options: [
      "Left ventricular failure",
      "Right ventricular infarction — obtain right-sided ECG (V4R) and administer a fluid bolus",
      "Aortic dissection",
      "Pulmonary embolism"
    ],
    correctIndex: 1,
    rationale: "Right ventricular infarction (RVI) occurs in ~30-50% of inferior MIs because the RCA supplies both the inferior wall and the right ventricle. RVI presents with the classic triad: hypotension, JVD, and clear lung sounds. Diagnosis: ST elevation in V4R (right-sided V4). Treatment differs from left-sided heart failure: give IV fluid boluses (250-500 mL NS) to increase preload, AVOID nitroglycerin and morphine (which reduce preload), and consider inotropic support if fluids are insufficient.",
    difficulty: 4,
    category: "Cardiology",
    topic: "Acute Coronary Syndromes"
  },
  {
    id: "para-cardio-012",
    stem: "The classic signs of cardiac tamponade (Beck's triad) include:",
    options: [
      "Hypertension, bradycardia, and irregular respirations (Cushing's triad)",
      "Hypotension, jugular venous distension (JVD), and muffled/distant heart sounds",
      "Tachycardia, hypotension, and diaphoresis",
      "Chest pain, dyspnea, and cough"
    ],
    correctIndex: 1,
    rationale: "Beck's triad for cardiac tamponade: 1) Hypotension (fluid in the pericardium compresses the heart, reducing cardiac output), 2) JVD (impaired venous return to the compressed right heart), 3) Muffled/distant heart sounds (fluid around the heart dampens sound). Additional finding: pulsus paradoxus (>10 mmHg drop in SBP during inspiration). Tamponade is treated with pericardiocentesis (needle drainage of pericardial fluid). In trauma, rapid transport for thoracotomy is preferred.",
    difficulty: 3,
    category: "Cardiology",
    topic: "Cardiac Emergencies"
  },
  {
    id: "para-cardio-013",
    stem: "A patient with a pacemaker experiences syncope. The ECG shows pacing spikes not followed by QRS complexes. This is called:",
    options: [
      "Normal pacemaker function",
      "Failure to capture — the pacemaker is firing but not depolarizing the myocardium",
      "Oversensing",
      "Battery depletion"
    ],
    correctIndex: 1,
    rationale: "Pacemaker failure to capture occurs when the pacemaker generates an electrical stimulus (visible as pacing spikes on the ECG) but fails to depolarize the myocardium (no QRS follows the spike). Causes include: lead displacement, elevated pacing threshold (from fibrosis, electrolyte abnormalities, ischemia), lead fracture, or battery depletion. Treatment: apply external transcutaneous pacing if symptomatic (bradycardia/syncope), and transport for pacemaker interrogation and adjustment.",
    difficulty: 4,
    category: "Cardiology",
    topic: "Pacemaker Emergencies"
  },
  {
    id: "para-med-033",
    stem: "A patient presents with acute onset of tearing, severe interscapular back pain with unequal bilateral arm blood pressures (>20 mmHg difference). This is most concerning for:",
    options: [
      "Acute myocardial infarction",
      "Aortic dissection",
      "Musculoskeletal back pain",
      "Pulmonary embolism"
    ],
    correctIndex: 1,
    rationale: "Aortic dissection classically presents with sudden, severe, tearing/ripping chest or back pain (often interscapular). A blood pressure differential >20 mmHg between arms suggests the dissection involves one subclavian artery. Other signs: pulse deficits, neurological symptoms (if carotid involvement), aortic regurgitation murmur. Treatment: gentle blood pressure control (target SBP 100-120 mmHg), pain management, avoid anticoagulants (differentiates from ACS treatment), and emergent transport for CT angiography and surgical consultation.",
    difficulty: 4,
    category: "Medical Emergencies",
    topic: "Cardiovascular Emergencies"
  },
  {
    id: "para-med-034",
    stem: "A scuba diver surfaces rapidly from 100 feet and develops joint pain, confusion, and skin mottling. This condition is:",
    options: [
      "Arterial gas embolism",
      "Decompression sickness (the bends) — caused by nitrogen bubbles forming in tissues during rapid ascent",
      "Hypothermia",
      "Near-drowning"
    ],
    correctIndex: 1,
    rationale: "Decompression sickness (DCS) occurs when dissolved nitrogen forms bubbles in tissues during rapid ascent from depth. Symptoms are classified as Type I (musculoskeletal pain, skin mottling/itching) or Type II (neurological — confusion, paralysis, vertigo; cardiopulmonary — chest pain, dyspnea 'the chokes'). Treatment: high-flow O2 (100% NRB), IV fluids (isotonic crystalloid), place patient supine, and transport to a hyperbaric chamber for recompression therapy. Do NOT fly patient above 1,000 feet.",
    difficulty: 3,
    category: "Medical Emergencies",
    topic: "Environmental Emergencies"
  },
  {
    id: "para-med-035",
    stem: "A patient is found unresponsive in a garage with a car engine running. SpO2 reads 99% on pulse oximetry. The paramedic should:",
    options: [
      "Accept the SpO2 reading and provide routine care",
      "Suspect carbon monoxide (CO) poisoning — standard pulse oximetry is unreliable for CO; administer 100% O2 via NRB and transport",
      "Administer naloxone for suspected opioid overdose",
      "Provide supplemental O2 at 2 LPM via nasal cannula"
    ],
    correctIndex: 1,
    rationale: "Carbon monoxide binds to hemoglobin 200-250x more readily than oxygen, forming carboxyhemoglobin (COHb). Standard pulse oximeters CANNOT distinguish COHb from oxyhemoglobin, so SpO2 readings are falsely normal/elevated. CO-specific pulse oximeters (CO-oximetry) can measure COHb levels. Treatment: 100% O2 via non-rebreather mask (reduces CO half-life from 4-6 hours to 60-90 minutes), high-flow NRB for all CO exposure patients regardless of SpO2. Consider hyperbaric O2 for COHb >25%, pregnancy, neurological symptoms, or cardiac ischemia.",
    difficulty: 3,
    category: "Medical Emergencies",
    topic: "Toxicology"
  },
  {
    id: "para-peds-026",
    stem: "The Broselow tape is used in pediatric emergencies to:",
    options: [
      "Measure the child's height for growth charts",
      "Estimate the child's weight based on length for medication dosing, equipment sizing, and fluid volumes",
      "Determine the child's age",
      "Assess neurological function"
    ],
    correctIndex: 1,
    rationale: "The Broselow (Broselow-Luten) tape is a length-based resuscitation tape that estimates a child's weight based on their measured length. Each color zone on the tape corresponds to a weight range and provides pre-calculated medication doses, IV fluid volumes, defibrillation energy, and equipment sizes (ET tube, blade, LMA). It is accurate for children up to approximately 36 kg (80 lbs). For larger children, use standard weight-based dosing or ask the caregiver for a recent weight.",
    difficulty: 1,
    category: "OB/Peds",
    topic: "Pediatric Assessment"
  },
  {
    id: "para-peds-027",
    stem: "A 3-year-old child presents with barking cough, inspiratory stridor, and hoarseness, but no drooling or toxic appearance. The child is playful and has mild intercostal retractions. The Westley Croup Score indicates mild croup. Appropriate treatment is:",
    options: [
      "Immediate intubation",
      "Dexamethasone 0.6 mg/kg PO/IM, humidified O2 as tolerated, and observation for worsening",
      "Nebulized racemic epinephrine and IV antibiotics",
      "No treatment needed — croup always resolves on its own"
    ],
    correctIndex: 1,
    rationale: "Mild croup (Westley score 2 or less): barking cough, hoarseness, no or minimal stridor at rest, no to mild retractions. Treatment: dexamethasone 0.6 mg/kg PO/IM (single dose, onset 2-6 hours, duration up to 72 hours), humidified oxygen, and close monitoring. Nebulized epinephrine is reserved for moderate-to-severe croup (stridor at rest, significant retractions, hypoxia). Antibiotics are not indicated — croup is viral (parainfluenza virus most common).",
    difficulty: 2,
    category: "OB/Peds",
    topic: "Pediatric Respiratory Emergencies"
  }
];
