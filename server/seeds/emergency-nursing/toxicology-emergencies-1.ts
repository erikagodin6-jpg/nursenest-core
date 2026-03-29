import { EmergencyNursingQuestion } from "./types";

export const toxicologyEmergency1Questions: EmergencyNursingQuestion[] = [
  {
    stem: "A 19-year-old female is brought to the ED after intentionally ingesting approximately 30 tablets of acetaminophen (500 mg each) 4 hours ago. She is currently asymptomatic. Serum acetaminophen level is 220 mcg/mL at 4 hours post-ingestion. What is the emergency nurse's priority intervention?",
    options: [
      "Administer activated charcoal 50 grams since she is within the decontamination window",
      "Initiate IV N-acetylcysteine (NAC) infusion immediately based on the Rumack-Matthew nomogram",
      "Observe for 24 hours and recheck acetaminophen levels before treatment",
      "Administer IV normal saline for hydration and monitor liver function tests"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient has ingested approximately 15 grams of acetaminophen (30 x 500 mg), which is well above the toxic threshold of 150 mg/kg or 7.5-10 grams in adults. The serum acetaminophen level of 220 mcg/mL at 4 hours post-ingestion is plotted on the Rumack-Matthew nomogram, where the treatment line starts at 150 mcg/mL at 4 hours. Since 220 mcg/mL exceeds the treatment threshold of 150 mcg/mL at 4 hours, IV N-acetylcysteine (NAC) must be initiated immediately. NAC is the specific antidote for acetaminophen toxicity and is virtually 100% effective at preventing hepatotoxicity if given within 8 hours of ingestion. After 8 hours, its efficacy progressively decreases but it should still be given at any time post-ingestion if indicated. Acetaminophen toxicity occurs through depletion of glutathione, which normally detoxifies the toxic metabolite NAPQI (N-acetyl-p-benzoquinone imine). When glutathione is depleted, NAPQI accumulates and causes hepatocellular necrosis. NAC works by replenishing glutathione stores, serving as a glutathione substitute, and enhancing sulfate conjugation. The IV NAC protocol (Prescott protocol) is: Loading dose: 150 mg/kg in 200 mL D5W over 60 minutes, then 50 mg/kg in 500 mL D5W over 4 hours, then 100 mg/kg in 1000 mL D5W over 16 hours. Total treatment time: 21 hours. The patient being asymptomatic at 4 hours is expected and does NOT indicate safety - acetaminophen toxicity has four stages: Stage 1 (0-24 hours): asymptomatic or mild GI symptoms, Stage 2 (24-72 hours): hepatotoxicity begins with rising AST/ALT, Stage 3 (72-96 hours): peak hepatotoxicity with possible liver failure, Stage 4 (4-14 days): recovery or death. Activated charcoal is most effective within 1-2 hours of ingestion and may have diminished benefit at 4 hours.",
    learningObjective: "Use the Rumack-Matthew nomogram to determine NAC treatment threshold for acetaminophen overdose",
    blueprintCategory: "Toxicological Emergencies",
    subtopic: "Acetaminophen Overdose",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "A patient asymptomatic at 4 hours after acetaminophen ingestion is NOT safe - hepatotoxicity peaks at 72-96 hours",
    clinicalPearls: [
      "Rumack-Matthew treatment line: 150 mcg/mL at 4 hours; treat if above the line",
      "NAC is nearly 100% effective if given within 8 hours of ingestion",
      "Toxic dose of acetaminophen: > 150 mg/kg or > 7.5-10 grams in adults",
      "Four stages of APAP toxicity: asymptomatic → hepatotoxicity → peak liver failure → recovery/death"
    ],
    safetyNote: "Never be reassured by an asymptomatic patient after acetaminophen overdose - the damage is biochemical and hepatotoxicity develops over 24-96 hours",
    distractorRationales: [
      "Activated charcoal has diminished benefit at 4 hours post-ingestion and is not the priority",
      "NAC infusion is the priority based on the toxic acetaminophen level on the nomogram",
      "Waiting 24 hours wastes the critical treatment window where NAC is most effective",
      "Hydration alone is insufficient to prevent hepatotoxicity from a toxic acetaminophen level"
    ],
    lessonLink: "/emergency/lessons/acetaminophen-overdose"
  },
  {
    stem: "A 3-year-old child is brought to the ED after ingesting an unknown number of iron supplement tablets from a grandparent's medication. The child has bloody vomiting and profuse diarrhea. An abdominal X-ray shows multiple radio-opaque tablets in the stomach. Serum iron level is 480 mcg/dL. What is the antidote?",
    options: [
      "Activated charcoal 1 g/kg via nasogastric tube",
      "IV deferoxamine infusion for iron chelation",
      "Whole bowel irrigation with polyethylene glycol solution",
      "IV calcium disodium EDTA for heavy metal chelation"
    ],
    correctAnswer: 1,
    rationaleLong: "This child presents with acute iron poisoning, which is a leading cause of pediatric poisoning death. The serum iron level of 480 mcg/dL indicates moderate to severe toxicity (severe toxicity defined as > 500 mcg/dL, but levels > 350 mcg/dL with symptoms warrant treatment). The specific antidote for iron poisoning is IV deferoxamine (Desferal), which is an iron chelating agent that binds free iron in the bloodstream, forming ferrioxamine, which is water-soluble and excreted by the kidneys. The urine turns a characteristic 'vin rosé' (pinkish-orange) color when ferrioxamine is present, which can be used to monitor therapy. Deferoxamine infusion rate: 15 mg/kg/hour continuous IV infusion (maximum 6-8 grams/day or 80 mg/kg/day in children). Treatment is continued until: (1) clinical improvement, (2) urine color returns to normal, and (3) serum iron level decreases to normal range. Activated charcoal does NOT bind iron (or lithium, potassium, alcohols, or heavy metals) - this is a critical pharmacology principle. Charcoal is ineffective for these substances. Whole bowel irrigation with polyethylene glycol (GoLYTELY) is actually an important ADJUNCT treatment for iron poisoning to flush the remaining tablets through the GI tract before they dissolve, but it is not the antidote. It is given at a rate of 500 mL/hour for children and 2 L/hour for adults via nasogastric tube until clear rectal effluent. Calcium disodium EDTA is used for lead poisoning, not iron poisoning. Iron toxicity stages: Stage 1 (0-6 hours): GI hemorrhage; Stage 2 (6-24 hours): apparent improvement; Stage 3 (12-48 hours): systemic toxicity (shock, metabolic acidosis, liver failure); Stage 4: hepatic failure; Stage 5: late GI strictures.",
    learningObjective: "Identify deferoxamine as the specific antidote for iron poisoning and know that activated charcoal does not bind iron",
    blueprintCategory: "Toxicological Emergencies",
    subtopic: "Iron Poisoning",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Activated charcoal does NOT bind iron, lithium, potassium, alcohols, or heavy metals - do not use charcoal for these ingestions",
    clinicalPearls: [
      "Deferoxamine is the antidote for iron poisoning - turns urine 'vin rosé' color",
      "Activated charcoal does NOT adsorb iron",
      "Iron tablets are radio-opaque on X-ray - useful for confirming ingestion",
      "Stage 2 (6-24 hours) 'improvement' is a dangerous trap - systemic toxicity follows"
    ],
    safetyNote: "The 'improvement' phase (Stage 2) of iron poisoning is misleading - do not discharge; systemic collapse follows within hours",
    distractorRationales: [
      "Activated charcoal does not bind iron and is ineffective",
      "Deferoxamine is the specific iron chelating antidote",
      "Whole bowel irrigation is an adjunct to flush remaining tablets but is not the antidote",
      "Calcium EDTA is for lead poisoning, not iron poisoning"
    ],
    lessonLink: "/emergency/lessons/iron-poisoning"
  },
  {
    stem: "A 45-year-old male is found unconscious in a garage with a running car. He has cherry-red skin color. SpO2 reads 99% on pulse oximetry. ABG shows PaO2 of 95 mmHg. Carboxyhemoglobin level is 35%. Which treatment should the emergency nurse initiate?",
    options: [
      "Supplemental oxygen at 2 L/min via nasal cannula since SpO2 is 99%",
      "100% oxygen via non-rebreather mask and consider hyperbaric oxygen therapy",
      "Intubation with mechanical ventilation to ensure controlled oxygenation",
      "IV methylene blue for methemoglobinemia"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient has carbon monoxide (CO) poisoning from automobile exhaust in an enclosed space. The carboxyhemoglobin (COHb) level of 35% indicates severe poisoning (mild: 10-20%, moderate: 20-40%, severe: > 40%). The cherry-red skin color is a classic but late finding of CO poisoning. The critical concept is that standard pulse oximetry is unreliable in CO poisoning because the pulse oximeter cannot differentiate between oxyhemoglobin (O2 bound to hemoglobin) and carboxyhemoglobin (CO bound to hemoglobin). Both are read as 'saturated hemoglobin,' resulting in a falsely normal SpO2 reading. The PaO2 on ABG is also normal because PaO2 measures dissolved oxygen in plasma, not oxygen bound to hemoglobin. The pathophysiology of CO poisoning: CO binds hemoglobin with 200-250 times greater affinity than oxygen, displacing O2 from hemoglobin binding sites and preventing oxygen delivery to tissues. Treatment: 100% oxygen via non-rebreather mask (NRB) dramatically reduces the half-life of COHb: on room air, COHb half-life is approximately 5-6 hours; on 100% NRB, it decreases to 60-90 minutes; with hyperbaric oxygen (HBO) at 2.5-3 atmospheres, it decreases to 20-30 minutes. Indications for hyperbaric oxygen therapy include: COHb > 25% (or > 15% in pregnant patients), loss of consciousness, neurological symptoms (confusion, seizures, ataxia), cardiac ischemia (elevated troponin, ECG changes), and persistent symptoms despite NRB therapy. Methylene blue is the antidote for methemoglobinemia, not CO poisoning. The emergency nurse should initiate 100% O2 immediately, monitor continuous cardiac monitoring (CO causes myocardial ischemia and arrhythmias), obtain troponin and ECG, and arrange transfer to hyperbaric facility if criteria are met.",
    learningObjective: "Recognize that pulse oximetry is falsely normal in CO poisoning and initiate 100% oxygen therapy",
    blueprintCategory: "Toxicological Emergencies",
    subtopic: "Carbon Monoxide Poisoning",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Pulse oximetry is FALSELY NORMAL in CO poisoning - it reads COHb as oxyhemoglobin; use co-oximetry",
    clinicalPearls: [
      "SpO2 is falsely normal in CO poisoning - cannot differentiate COHb from O2Hb",
      "COHb half-life: room air 5-6 hrs, 100% NRB 60-90 min, HBO 20-30 min",
      "HBO criteria: COHb > 25%, LOC, neurological symptoms, cardiac ischemia, pregnancy with COHb > 15%",
      "CO binds hemoglobin with 200-250x greater affinity than oxygen"
    ],
    safetyNote: "All CO poisoning patients need troponin and ECG - CO causes direct myocardial toxicity and can trigger MI and arrhythmias",
    distractorRationales: [
      "Low-flow O2 is inadequate - 100% oxygen is needed to compete with CO for hemoglobin binding",
      "100% NRB with HBO consideration is the correct treatment for CO poisoning",
      "Intubation is not needed if the patient can maintain their airway on NRB",
      "Methylene blue is for methemoglobinemia, not carbon monoxide poisoning"
    ],
    lessonLink: "/emergency/lessons/carbon-monoxide-poisoning"
  },
  {
    stem: "A 28-year-old male presents with agitation, hyperthermia (40.5°C), tachycardia (142 bpm), mydriasis (dilated pupils), diaphoresis, and muscle rigidity. He recently started sertraline and took MDMA (ecstasy) at a concert. Which condition should the emergency nurse suspect?",
    options: [
      "Neuroleptic malignant syndrome from serotonergic medication",
      "Serotonin syndrome from combined serotonergic agents",
      "Sympathomimetic toxidrome from MDMA alone",
      "Malignant hyperthermia from genetic susceptibility"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient presents with serotonin syndrome (SS), caused by excessive serotonergic activity from the combination of sertraline (an SSRI) and MDMA (ecstasy, a potent serotonin releaser). Serotonin syndrome is characterized by the triad of: (1) Mental status changes: agitation, anxiety, confusion, delirium; (2) Autonomic instability: hyperthermia, tachycardia, diaphoresis, mydriasis, hypertension, diarrhea; (3) Neuromuscular abnormalities: myoclonus, hyperreflexia, muscle rigidity, and CLONUS (especially in the lower extremities - this is the most distinguishing feature). The Hunter Serotonin Toxicity Criteria provide a systematic diagnostic approach: the presence of a serotonergic agent PLUS any of: spontaneous clonus, inducible clonus + agitation/diaphoresis, ocular clonus + agitation/diaphoresis, tremor + hyperreflexia, or hypertonia + temperature > 38°C + ocular/inducible clonus. Common serotonergic drug combinations causing SS include: SSRIs + MAOIs (most dangerous), SSRIs + tramadol, SSRIs + MDMA, SSRIs + St. John's wort, and SSRIs + linezolid. Treatment includes: (1) discontinuation of all serotonergic agents, (2) cyproheptadine 12 mg PO loading dose then 4 mg every 2 hours (specific serotonin antagonist - the only specific antidote), (3) benzodiazepines for agitation and muscle rigidity (diazepam or lorazepam), (4) aggressive cooling for hyperthermia (cooling blankets, cold IV fluids, ice packs), (5) intubation and paralysis for severe cases with temperature > 41°C. Distinguishing SS from NMS: SS has rapid onset (within 24 hours of precipitant), hyperreflexia/clonus, mydriasis, and diaphoresis; NMS has gradual onset (days to weeks), lead-pipe rigidity, normal or small pupils, and is caused by dopamine antagonists (antipsychotics), not serotonergic agents.",
    learningObjective: "Diagnose serotonin syndrome from combined serotonergic agents and differentiate from neuroleptic malignant syndrome",
    blueprintCategory: "Toxicological Emergencies",
    subtopic: "Serotonin Syndrome",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "KEY difference: Serotonin syndrome = clonus/hyperreflexia + rapid onset; NMS = lead-pipe rigidity + slow onset",
    clinicalPearls: [
      "SS triad: mental status changes + autonomic instability + neuromuscular excitability",
      "Clonus (especially lower extremity) is the most distinguishing feature of serotonin syndrome",
      "Cyproheptadine is the specific antidote (serotonin antagonist) - 12 mg PO load then 4 mg q2h",
      "SS onset: within 24 hours of precipitant; NMS onset: days to weeks"
    ],
    safetyNote: "Serotonin syndrome with temperature > 41°C requires intubation and paralysis to prevent rhabdomyolysis and organ failure",
    distractorRationales: [
      "NMS is caused by dopamine antagonists (antipsychotics) and has slow onset with lead-pipe rigidity",
      "Serotonin syndrome from SSRI + MDMA combination best explains this rapid-onset presentation",
      "MDMA alone can cause sympathomimetic effects but the combination with sertraline causes full SS",
      "Malignant hyperthermia requires exposure to volatile anesthetics or succinylcholine"
    ],
    lessonLink: "/emergency/lessons/serotonin-syndrome"
  },
  {
    stem: "A 4-year-old child presents after ingesting several button batteries from a TV remote 2 hours ago. The child is asymptomatic. Chest X-ray shows one battery lodged in the esophagus. What is the urgency level?",
    options: [
      "Observation for 24 hours since the child is asymptomatic",
      "Emergent endoscopic removal within 2 hours due to risk of tissue necrosis",
      "Administer syrup of ipecac to induce vomiting and expel the battery",
      "Wait for the battery to pass naturally through the GI tract"
    ],
    correctAnswer: 1,
    rationaleLong: "A button battery lodged in the esophagus is a pediatric emergency requiring immediate removal within 2 hours. Button batteries (particularly lithium batteries ≥ 20 mm) can cause severe tissue injury through three mechanisms: (1) electrical current generation between the battery's positive and negative poles creates an alkaline environment through electrolysis, (2) direct pressure necrosis on the esophageal wall, and (3) leakage of alkaline electrolyte (potassium or sodium hydroxide). The electrical current mechanism is the most rapid and devastating - it can cause full-thickness esophageal necrosis, perforation, and erosion into adjacent structures (aorta, trachea) within as little as 2 hours. Esophageal-aortic fistula from button battery injury is a catastrophic and often fatal complication. An asymptomatic child does NOT indicate safety - tissue damage begins immediately upon contact and progresses silently. The battery must be removed endoscopically on an emergent basis. While waiting for endoscopy, honey (10 mL every 10 minutes) or sucralfate (10 mL every 10 minutes) can be given to children > 12 months of age as a temporizing measure - these substances create a protective barrier on the esophageal mucosa and have been shown to reduce battery-induced tissue injury. Syrup of ipecac is contraindicated as it may cause the battery to become lodged more firmly or cause further mucosal damage during emesis. Batteries that have passed the esophagus and are in the stomach or intestines can generally be managed expectantly with serial X-rays, as they will typically pass spontaneously. However, batteries remaining in the stomach for > 48 hours or those > 20 mm in children < 5 years old may also require removal.",
    learningObjective: "Recognize esophageal button battery impaction as a time-critical emergency requiring removal within 2 hours",
    blueprintCategory: "Toxicological Emergencies",
    subtopic: "Pediatric Foreign Body Ingestion",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "An asymptomatic child with an esophageal button battery is NOT safe - tissue necrosis begins within 2 hours",
    clinicalPearls: [
      "Esophageal button battery = emergent removal within 2 hours",
      "Button battery injury mechanism: electrolysis creating alkaline environment",
      "Honey 10 mL q10min as temporizing measure in children > 12 months while awaiting endoscopy",
      "Battery past the esophagus can usually be observed with serial X-rays"
    ],
    safetyNote: "Esophageal-aortic fistula from button battery is often fatal - delay in removal can be catastrophic",
    distractorRationales: [
      "Observation is inappropriate for esophageal battery impaction - tissue necrosis begins in hours",
      "Emergent endoscopic removal within 2 hours is the correct intervention",
      "Ipecac is contraindicated and may worsen the injury",
      "Waiting for natural passage is only appropriate if the battery is PAST the esophagus"
    ],
    lessonLink: "/emergency/lessons/foreign-body-ingestion"
  },
  {
    stem: "A 35-year-old male presents with confusion, slurred speech, and visual disturbances after drinking 'moonshine' at a party. His ABG shows pH 7.18, anion gap 28, osmolar gap 32. What antidote should the emergency nurse prepare?",
    options: [
      "Activated charcoal 50 grams via nasogastric tube",
      "IV fomepizole (4-methylpyrazole) loading dose 15 mg/kg",
      "IV sodium bicarbonate drip for acidosis correction",
      "Hemodialysis without antidote therapy"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient presents with toxic alcohol (methanol) poisoning from contaminated moonshine. The clinical triad of visual disturbances, severe metabolic acidosis with elevated anion gap, and elevated osmolar gap is classic for methanol poisoning. Methanol itself is relatively non-toxic, but it is metabolized by alcohol dehydrogenase (ADH) to formaldehyde and then to formic acid, which causes retinal toxicity (leading to blindness) and severe metabolic acidosis. The treatment is IV fomepizole (Antizol, 4-methylpyrazole), which is a competitive inhibitor of alcohol dehydrogenase. By blocking ADH, fomepizole prevents the conversion of methanol to its toxic metabolites, allowing the parent compound to be safely excreted by the kidneys. Fomepizole dosing: 15 mg/kg loading dose IV, then 10 mg/kg every 12 hours for 4 doses, then 15 mg/kg every 12 hours until methanol levels are undetectable. Fomepizole has largely replaced ethanol as the preferred antidote because it is easier to dose, does not cause intoxication, does not require ICU monitoring of blood alcohol levels, and has fewer side effects. IV ethanol (10% solution targeting blood ethanol level of 100-150 mg/dL) is an alternative if fomepizole is unavailable, as ethanol also competitively inhibits ADH with higher affinity than methanol. Hemodialysis is indicated for: (1) pH < 7.25, (2) visual symptoms, (3) renal failure, (4) methanol level > 50 mg/dL, or (5) clinical deterioration despite fomepizole. In this patient, hemodialysis is also indicated due to the severe acidosis (pH 7.18) and visual symptoms, but fomepizole should be started first. Sodium bicarbonate is a supportive measure for acidosis but does not address the underlying toxicity. Activated charcoal does not adsorb alcohols effectively.",
    learningObjective: "Identify fomepizole as the antidote for methanol poisoning by inhibiting alcohol dehydrogenase",
    blueprintCategory: "Toxicological Emergencies",
    subtopic: "Toxic Alcohol Poisoning",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Visual disturbances + high anion gap acidosis + elevated osmolar gap = think methanol; ethylene glycol causes renal failure instead",
    clinicalPearls: [
      "Methanol poisoning triad: visual disturbances + anion gap acidosis + elevated osmolar gap",
      "Fomepizole blocks alcohol dehydrogenase, preventing toxic metabolite formation",
      "Ethylene glycol causes renal failure with calcium oxalate crystals; methanol causes blindness",
      "Hemodialysis needed for: pH < 7.25, visual symptoms, renal failure, or methanol > 50 mg/dL"
    ],
    safetyNote: "Visual symptoms in methanol poisoning may be irreversible - early fomepizole administration is critical to prevent permanent blindness",
    distractorRationales: [
      "Activated charcoal does not effectively adsorb alcohols",
      "Fomepizole is the specific antidote that blocks toxic metabolite formation",
      "Bicarbonate treats acidosis symptomatically but does not address the underlying toxicity",
      "Hemodialysis is needed as adjunct but fomepizole should be started first"
    ],
    lessonLink: "/emergency/lessons/toxic-alcohol-poisoning"
  },
  {
    stem: "A 22-year-old female presents with altered mental status, constricted pupils (miosis), decreased respiratory rate (RR 6), and decreased bowel sounds. She has track marks on her arms. After administering naloxone and achieving a respiratory rate of 14, which ongoing assessment is MOST important?",
    options: [
      "Monitoring for opioid withdrawal symptoms (agitation, vomiting, diarrhea)",
      "Continuous respiratory monitoring with waveform capnography for re-narcotization",
      "Checking for compartment syndrome from prolonged immobility in a fixed position",
      "Cardiac monitoring for QT prolongation from opioid effects"
    ],
    correctAnswer: 1,
    rationaleLong: "After successful naloxone reversal of opioid overdose, the most critical ongoing assessment is continuous respiratory monitoring with waveform capnography to detect re-narcotization. As previously discussed, naloxone has a shorter half-life (30-90 minutes) than most opioids, and respiratory depression will recur as naloxone wears off. Waveform capnography (ETCO2 monitoring) is superior to pulse oximetry for detecting respiratory depression because: (1) capnography detects hypoventilation BEFORE hypoxemia develops (there is a significant time lag between when ventilation decreases and when SpO2 begins to drop, especially if the patient is on supplemental oxygen), (2) capnography provides real-time breath-by-breath monitoring of ventilatory status, (3) loss of the capnography waveform immediately indicates apnea, and (4) rising ETCO2 indicates progressive hypoventilation before clinical signs become apparent. The Joint Commission and multiple emergency nursing organizations now recommend waveform capnography for all patients at risk of opioid-induced respiratory depression. While monitoring for opioid withdrawal is important (withdrawal is uncomfortable but rarely life-threatening in adults), it is not as critical as respiratory monitoring. Compartment syndrome from prolonged immobility ('found down' rhabdomyolysis) is a valid concern and should be assessed, but it is not the most immediately life-threatening issue. QT prolongation can occur with methadone but is not the primary concern in acute opioid overdose management. The emergency nurse should also: obtain urine drug screen (may reveal additional substances), check creatine kinase for rhabdomyolysis if the patient was 'found down,' and assess for aspiration pneumonia.",
    learningObjective: "Prioritize continuous capnography monitoring over pulse oximetry for detecting re-narcotization after naloxone administration",
    blueprintCategory: "Toxicological Emergencies",
    subtopic: "Opioid Overdose",
    difficulty: 3,
    cognitiveLevel: "evaluation",
    questionType: "MCQ_SINGLE",
    examTrap: "Capnography detects hypoventilation BEFORE pulse oximetry detects hypoxemia - it is the superior monitor for opioid patients",
    clinicalPearls: [
      "Capnography detects hypoventilation 3-5 minutes before SpO2 begins to drop",
      "Loss of capnography waveform = apnea (immediate alert)",
      "Rising ETCO2 > 50 mmHg indicates progressive hypoventilation",
      "Continue monitoring for at least 2-4 hours after last naloxone dose (longer for long-acting opioids)"
    ],
    safetyNote: "SpO2 monitoring alone is inadequate for post-naloxone patients - supplemental O2 masks desaturation while hypoventilation continues",
    distractorRationales: [
      "Withdrawal is uncomfortable but rarely life-threatening in adults",
      "Capnography for respiratory monitoring is the most critical ongoing assessment",
      "Compartment syndrome should be assessed but is not the most immediate concern",
      "QT prolongation is relevant for methadone but not the primary monitoring priority"
    ],
    lessonLink: "/emergency/lessons/opioid-overdose"
  },
  {
    stem: "A 55-year-old male presents with bradycardia (HR 38), hypotension (BP 72/44 mmHg), and altered mental status. His wife reports he accidentally took his entire week's supply of diltiazem SR (approximately 1,800 mg). IV calcium chloride and atropine have been given without improvement. What rescue therapy should the emergency nurse prepare?",
    options: [
      "IV glucagon 5 mg bolus for beta-receptor bypass",
      "High-dose insulin euglycemic therapy (HIET): regular insulin 1 unit/kg bolus then 1 unit/kg/hr infusion",
      "IV lipid emulsion therapy (Intralipid 20%)",
      "IV vasopressin 40 units for refractory hypotension"
    ],
    correctAnswer: 1,
    rationaleLong: "In severe calcium channel blocker (CCB) toxicity refractory to calcium and atropine, high-dose insulin euglycemic therapy (HIET) is the recommended rescue therapy. CCB toxicity causes profound cardiovascular depression through: (1) negative inotropy (reduced contractility), (2) negative chronotropy (bradycardia), (3) vasodilation (hypotension), and (4) in non-dihydropyridine CCBs like diltiazem, additional AV nodal blockade. The mechanism of HIET in CCB toxicity: during shock states, the myocardium switches from free fatty acid metabolism to glucose as its primary energy substrate. However, CCB toxicity blocks the L-type calcium channels in pancreatic beta cells, impairing insulin release and creating a state of relative insulin deficiency. The myocardium cannot utilize glucose without insulin. High-dose insulin provides the insulin needed for myocardial glucose uptake, significantly improving cardiac contractility and output. The insulin effect on inotropy is independent of its metabolic effects. HIET protocol: Regular insulin 1 unit/kg IV bolus, then 1 unit/kg/hour continuous infusion (can be titrated up to 10 units/kg/hour). Concurrent dextrose: D50 25 grams bolus if glucose < 200 mg/dL, then D10W infusion to maintain glucose 100-200 mg/dL. Monitor glucose every 30 minutes initially. Also supplement potassium (insulin drives K+ intracellularly). Glucagon is the antidote for beta-blocker toxicity, not CCB toxicity. Lipid emulsion is used for lipophilic drug toxicity (local anesthetic toxicity) and may be considered as adjunctive therapy. Vasopressin can be used but does not address the underlying myocardial depression.",
    learningObjective: "Apply high-dose insulin euglycemic therapy as rescue treatment for severe calcium channel blocker toxicity",
    blueprintCategory: "Toxicological Emergencies",
    subtopic: "Calcium Channel Blocker Overdose",
    difficulty: 5,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Glucagon is for beta-blocker toxicity; HIET is for calcium channel blocker toxicity - don't confuse the antidotes",
    clinicalPearls: [
      "HIET for CCB toxicity: insulin 1 unit/kg bolus then 1 unit/kg/hr infusion",
      "Monitor glucose q30 min and supplement D10-D50 to maintain glucose 100-200 mg/dL",
      "Replace potassium - insulin drives K+ intracellularly",
      "Insulin works as an inotrope in CCB toxicity independent of its metabolic effects"
    ],
    safetyNote: "HIET requires frequent glucose monitoring - hypoglycemia is the most common complication and can be fatal if unrecognized",
    distractorRationales: [
      "Glucagon is the antidote for beta-blocker toxicity, not calcium channel blocker toxicity",
      "HIET is the recommended rescue therapy for severe CCB toxicity refractory to calcium",
      "Lipid emulsion is primarily for local anesthetic toxicity and is adjunctive for CCB",
      "Vasopressin addresses vasodilation but not the underlying myocardial depression"
    ],
    lessonLink: "/emergency/lessons/ccb-overdose"
  },
  {
    stem: "A 16-year-old female is brought to the ED after being found unconscious at a park. Her friends report she was 'huffing' spray paint. She had a brief cardiac arrest in the field with ROSC achieved by EMS. On arrival, she is on 100% O2 with sinus tachycardia at 130 bpm. What cardiac complication should the emergency nurse monitor for?",
    options: [
      "Hypertensive crisis from sympathomimetic effects",
      "Sudden cardiac death from catecholamine-sensitized myocardium (sudden sniffing death syndrome)",
      "Pulmonary hypertension from chronic inhalant use",
      "Pericarditis from chemical irritation"
    ],
    correctAnswer: 1,
    rationaleLong: "Inhalant abuse ('huffing,' 'bagging,' or 'sniffing') of volatile hydrocarbons (spray paint, glue, gasoline, aerosols, refrigerants) can cause 'sudden sniffing death syndrome.' This occurs because volatile hydrocarbons sensitize the myocardium to catecholamines, creating a state where the normal catecholamine response to stress, fright, or exertion can trigger fatal ventricular fibrillation or ventricular tachycardia. The mechanism involves: (1) hydrocarbons dissolve in the lipid membranes of cardiac myocytes, altering ion channel function, (2) this sensitizes the myocardium to the arrhythmogenic effects of endogenous and exogenous catecholamines, (3) any catecholamine surge (from being startled, running from police, physical exertion) can trigger lethal arrhythmias. Sudden sniffing death can occur on the first use and accounts for approximately 22% of inhalant-related deaths. This patient has already had a cardiac arrest, indicating she is at extremely high risk for recurrent lethal arrhythmias while the hydrocarbon remains in her system. Management includes: (1) continuous cardiac monitoring for at least 24 hours, (2) AVOID catecholamines (epinephrine, norepinephrine) if possible - they can trigger VF in the sensitized myocardium, (3) if arrhythmias occur, use beta-blockers (esmolol) rather than epinephrine, (4) avoid stimulation that could trigger catecholamine surge (keep the environment calm), (5) high-flow oxygen to accelerate hydrocarbon elimination, (6) monitor for other complications: hepatotoxicity, nephrotoxicity, CNS depression. The emergency nurse should ensure that the crash cart has beta-blockers available and that all team members are aware that catecholamines should be avoided.",
    learningObjective: "Recognize catecholamine-sensitized myocardium from inhalant abuse and avoid catecholamine administration",
    blueprintCategory: "Toxicological Emergencies",
    subtopic: "Inhalant Abuse",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "AVOID epinephrine in hydrocarbon inhalant abuse - catecholamines can trigger fatal VF in the sensitized myocardium",
    clinicalPearls: [
      "Sudden sniffing death: hydrocarbons sensitize myocardium to catecholamines → fatal arrhythmias",
      "Can occur on FIRST use - not limited to chronic abusers",
      "Avoid epinephrine/catecholamines - use beta-blockers (esmolol) for arrhythmias instead",
      "Keep environment calm - minimize catecholamine surges from fear or exertion"
    ],
    safetyNote: "DO NOT give epinephrine to a patient with inhalant-induced cardiac arrest if possible - it can trigger refractory VF",
    distractorRationales: [
      "Hypertensive crisis is not the primary cardiac concern with inhalant abuse",
      "Sudden sniffing death syndrome from catecholamine-sensitized myocardium is the critical concern",
      "Pulmonary hypertension is a chronic complication, not an acute emergency concern",
      "Pericarditis is not a typical complication of inhalant abuse"
    ],
    lessonLink: "/emergency/lessons/inhalant-abuse"
  },
  {
    stem: "A 62-year-old farmer presents after organophosphate pesticide exposure. He has excessive salivation, lacrimation, urination, defecation, miosis, and bradycardia. RR is 8 with bilateral wheezing and copious bronchorrhea. Which medication combination should the emergency nurse administer?",
    options: [
      "IV atropine 2-4 mg repeated every 5 minutes until secretions dry + IV pralidoxime (2-PAM) 1-2 grams",
      "IV naloxone 2 mg for suspected opioid co-ingestion causing respiratory depression",
      "IV physostigmine 2 mg for anticholinergic reversal",
      "Nebulized ipratropium and albuterol for bronchospasm"
    ],
    correctAnswer: 0,
    rationaleLong: "This patient presents with classic organophosphate poisoning manifesting the cholinergic toxidrome (SLUDGE/DUMBBBELS mnemonic). Organophosphates (found in pesticides) irreversibly inhibit acetylcholinesterase, causing accumulation of acetylcholine at muscarinic receptors (causing SLUDGE symptoms), nicotinic receptors (causing muscle fasciculations, weakness, paralysis), and central nervous system (causing seizures, altered mental status). SLUDGE: Salivation, Lacrimation, Urination, Defecation, GI cramping, Emesis. DUMBBBELS: Defecation, Urination, Miosis, Bradycardia, Bronchorrhea, Bronchospasm, Emesis, Lacrimation, Salivation. The treatment requires TWO medications: (1) Atropine: competitive antagonist at muscarinic receptors. Initial dose 2-4 mg IV, doubled every 5 minutes until bronchial secretions dry (the primary endpoint is drying of secretions, NOT heart rate). Massive doses may be needed - patients may require 100+ mg of atropine over several hours. Atropine does NOT reverse nicotinic effects (muscle weakness/paralysis) or reactivate the inhibited enzyme. (2) Pralidoxime (2-PAM): reactivates acetylcholinesterase by removing the organophosphate from the enzyme before 'aging' occurs (permanent binding). Must be given within 24-48 hours of exposure before aging is complete. Dose: 1-2 grams IV over 15-30 minutes, may repeat every 1 hour. Both medications are needed simultaneously. Naloxone is for opioid toxicity. Physostigmine is a cholinesterase inhibitor that would WORSEN organophosphate poisoning. Bronchodilators alone are insufficient. The emergency nurse should also: decontaminate the patient (remove clothing, wash skin with soap and water) while wearing protective equipment, and prepare for intubation if respiratory failure develops.",
    learningObjective: "Administer dual antidote therapy (atropine + pralidoxime) for organophosphate poisoning",
    blueprintCategory: "Toxicological Emergencies",
    subtopic: "Organophosphate Poisoning",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Atropine titration endpoint = drying of bronchial secretions, NOT heart rate - massive doses (100+ mg) may be needed",
    clinicalPearls: [
      "SLUDGE/DUMBBBELS mnemonic for cholinergic toxidrome",
      "Atropine endpoint: drying of secretions (NOT heart rate) - may need 100+ mg",
      "Pralidoxime must be given before 'aging' (24-48 hours) to reactivate cholinesterase",
      "Decontaminate patient AND wear protective equipment to prevent secondary exposure"
    ],
    safetyNote: "Staff must wear PPE (gloves, gown, mask) during decontamination - organophosphates can be absorbed through skin and cause secondary poisoning",
    distractorRationales: [
      "Atropine + pralidoxime is the correct dual antidote therapy for organophosphate poisoning",
      "Naloxone is for opioid toxicity and is not indicated here",
      "Physostigmine is a cholinesterase inhibitor that would WORSEN organophosphate poisoning",
      "Bronchodilators alone are insufficient for organophosphate-induced bronchorrhea and bronchospasm"
    ],
    lessonLink: "/emergency/lessons/organophosphate-poisoning"
  },
  {
    stem: "A 30-year-old male presents with severe agitation, hyperthermia (41.0°C), rhabdomyolysis (CK 45,000), tachycardia, and hypertension after using methamphetamine. Despite IV lorazepam 8 mg total, he remains severely agitated with rising temperature. What is the next intervention?",
    options: [
      "Administer IV haloperidol 10 mg for chemical restraint",
      "Initiate procedural sedation with propofol or intubation with paralysis for temperature control",
      "Apply ice packs and cooling blankets as monotherapy",
      "Administer IV dantrolene 2.5 mg/kg for malignant hyperthermia"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient has severe sympathomimetic toxicity from methamphetamine with life-threatening hyperthermia (41.0°C) and rhabdomyolysis (CK 45,000) refractory to benzodiazepine therapy. When benzodiazepines fail to control agitation and hyperthermia in stimulant toxicity, the next step is procedural sedation with either propofol or rapid sequence intubation with neuromuscular paralysis (using non-depolarizing agents such as rocuronium). The rationale is: the hyperthermia in stimulant toxicity is primarily generated by muscle hyperactivity (agitation, rigidity, myoclonus). Unlike fever, this hyperthermia does NOT respond to antipyretics because the heat is generated by skeletal muscle contraction, not by a reset hypothalamic set point. External cooling alone (ice packs, cooling blankets) will be overwhelmed by ongoing heat generation from muscle hyperactivity. The ONLY way to stop the heat generation is to stop the muscle activity - through deep sedation or paralysis. Propofol provides rapid sedation and has some muscle relaxation properties. If propofol is insufficient, intubation with rocuronium (non-depolarizing paralytic) eliminates all muscle activity and rapidly drops temperature. AVOID succinylcholine in this scenario because: (1) it is a depolarizing agent that can worsen hyperkalemia from rhabdomyolysis (potentially fatal), and (2) it causes transient muscle fasciculations that generate more heat. Haloperidol should be avoided in stimulant toxicity with hyperthermia because: (1) it lowers the seizure threshold, (2) it impairs heat dissipation, (3) it can cause NMS which would compound the problem, and (4) it can prolong QTc. Dantrolene is for malignant hyperthermia triggered by volatile anesthetics, not stimulant-induced hyperthermia.",
    learningObjective: "Escalate to procedural sedation or paralysis when benzodiazepines fail to control stimulant-induced hyperthermia",
    blueprintCategory: "Toxicological Emergencies",
    subtopic: "Sympathomimetic Toxicity",
    difficulty: 5,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "AVOID succinylcholine in rhabdomyolysis - can cause fatal hyperkalemia from potassium release",
    clinicalPearls: [
      "Stimulant-induced hyperthermia = muscle-generated heat; antipyretics are USELESS",
      "Must stop muscle activity to stop heat generation - sedation or paralysis",
      "Avoid succinylcholine in rhabdomyolysis - risk of fatal hyperkalemia",
      "Avoid haloperidol in stimulant toxicity - lowers seizure threshold and impairs heat dissipation"
    ],
    safetyNote: "Temperature > 41°C with stimulant use is immediately life-threatening - aggressive cooling AND paralysis are needed to prevent death",
    distractorRationales: [
      "Haloperidol lowers seizure threshold, impairs heat dissipation, and can cause NMS",
      "Procedural sedation or paralysis is needed to stop muscle-generated heat",
      "External cooling alone cannot overcome ongoing heat generation from muscle hyperactivity",
      "Dantrolene is for malignant hyperthermia from volatile anesthetics, not stimulant toxicity"
    ],
    lessonLink: "/emergency/lessons/sympathomimetic-toxicity"
  },
  {
    stem: "A 78-year-old male presents with confusion, visual hallucinations, tachycardia (HR 118), dry flushed skin, urinary retention, and absent bowel sounds. His medications include atropine eye drops, amitriptyline, and diphenhydramine. Which toxidrome is this?",
    options: [
      "Sympathomimetic toxidrome",
      "Anticholinergic toxidrome",
      "Serotonin syndrome",
      "Cholinergic toxidrome"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient presents with the classic anticholinergic toxidrome, which can be remembered by the mnemonic: 'Mad as a hatter' (confusion, hallucinations, delirium), 'Red as a beet' (flushed skin from cutaneous vasodilation), 'Dry as a bone' (dry skin, dry mucous membranes - absent sweating), 'Hot as a hare' (hyperthermia from inability to sweat), 'Blind as a bat' (mydriasis, cycloplegia - blurred vision), 'Full as a flask' (urinary retention), and 'Quiet as a mouse' (decreased bowel sounds from decreased GI motility). This patient is taking THREE anticholinergic medications: (1) atropine eye drops (can be systemically absorbed, especially in elderly), (2) amitriptyline (tricyclic antidepressant with strong anticholinergic properties), and (3) diphenhydramine (first-generation antihistamine with anticholinergic properties). The cumulative anticholinergic burden from multiple medications is a common cause of toxicity, particularly in elderly patients who metabolize drugs more slowly. The key differentiating feature from sympathomimetic toxidrome is the SKIN: anticholinergic = DRY, warm, flushed skin; sympathomimetic = WET (diaphoretic), warm skin. Both can cause tachycardia, mydriasis, agitation, and hyperthermia, but the presence or absence of sweating is the critical distinguishing feature. Serotonin syndrome has clonus, hyperreflexia, and diaphoresis. Cholinergic toxidrome is the opposite (SLUDGE symptoms with miosis, bradycardia, and wet secretions). Treatment includes: discontinue all anticholinergic medications, supportive care, benzodiazepines for agitation, and in severe cases, physostigmine 1-2 mg IV (specific antidote - a reversible cholinesterase inhibitor that crosses the blood-brain barrier).",
    learningObjective: "Identify the anticholinergic toxidrome and differentiate it from sympathomimetic toxidrome by skin findings",
    blueprintCategory: "Toxicological Emergencies",
    subtopic: "Anticholinergic Toxidrome",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Anticholinergic = DRY skin; Sympathomimetic = WET (diaphoretic) skin - both have tachycardia and mydriasis",
    clinicalPearls: [
      "Anticholinergic mnemonic: mad, red, dry, hot, blind, full, quiet",
      "KEY difference: anticholinergic = DRY skin; sympathomimetic = DIAPHORETIC skin",
      "Cumulative anticholinergic burden is common in elderly on multiple medications",
      "Physostigmine is the specific antidote for anticholinergic toxicity"
    ],
    safetyNote: "Physostigmine should be given slowly (1 mg IV over 5 minutes) and is contraindicated in TCA overdose due to risk of seizures and cardiac arrest",
    distractorRationales: [
      "Sympathomimetic toxidrome causes diaphoresis (wet skin), not dry skin",
      "Anticholinergic toxidrome is correct based on dry skin, urinary retention, and absent bowel sounds",
      "Serotonin syndrome presents with clonus, hyperreflexia, and diaphoresis",
      "Cholinergic toxidrome causes SLUDGE symptoms (wet secretions, miosis, bradycardia)"
    ],
    lessonLink: "/emergency/lessons/anticholinergic-toxidrome"
  },
  {
    stem: "A 6-year-old child presents to the ED after ingesting an unknown quantity of their parent's metformin tablets. The child is currently asymptomatic with normal vital signs and blood glucose of 92 mg/dL. What is the most concerning delayed complication the emergency nurse should monitor for?",
    options: [
      "Severe hypoglycemia within the first 2 hours",
      "Lactic acidosis developing 6-18 hours after ingestion",
      "Acute hepatic failure within 4-6 hours",
      "Serotonin syndrome from metformin's CNS effects"
    ],
    correctAnswer: 1,
    rationaleLong: "Metformin does not typically cause hypoglycemia (unlike sulfonylureas or insulin) because it works by reducing hepatic glucose production and improving insulin sensitivity rather than stimulating insulin release. The most concerning complication of metformin overdose is lactic acidosis, which can develop 6-18 hours after ingestion and can be severe and life-threatening. Metformin inhibits mitochondrial complex I in the electron transport chain, shifting cellular metabolism from aerobic to anaerobic pathways, leading to lactate accumulation. The lactic acidosis from metformin (metformin-associated lactic acidosis, or MALA) can be profound, with pH values dropping below 7.0 and lactate levels exceeding 20 mmol/L. MALA has a mortality rate of approximately 30-50%. The challenge with metformin overdose is the delayed onset of symptoms. The child may appear completely well for several hours before developing progressive metabolic acidosis. The emergency nurse should: (1) monitor for at least 12-18 hours with serial blood gases and lactate levels, (2) obtain baseline and serial basic metabolic panels (BMP) to track bicarbonate and pH, (3) check serial lactate levels every 2-4 hours, (4) prepare for potential hemodialysis (indicated for severe acidosis, lactate > 20, hemodynamic instability, or renal failure - hemodialysis effectively removes metformin from the blood), (5) supportive care with IV fluids and sodium bicarbonate for acidosis. The asymptomatic period should NOT reassure the emergency nurse - close monitoring for at least 12-18 hours is mandatory.",
    learningObjective: "Monitor for delayed lactic acidosis after metformin overdose, even in an asymptomatic patient",
    blueprintCategory: "Toxicological Emergencies",
    subtopic: "Metformin Overdose",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Metformin does NOT cause hypoglycemia - the danger is delayed lactic acidosis 6-18 hours after ingestion",
    clinicalPearls: [
      "Metformin overdose → lactic acidosis (NOT hypoglycemia)",
      "Lactic acidosis onset: 6-18 hours after ingestion - initial asymptomatic period is deceptive",
      "MALA mortality: 30-50% - hemodialysis is effective treatment",
      "Monitor serial lactate and blood gases every 2-4 hours for at least 12-18 hours"
    ],
    safetyNote: "Never discharge an asymptomatic metformin overdose patient early - lactic acidosis can develop hours later with fatal consequences",
    distractorRationales: [
      "Metformin does not stimulate insulin release and rarely causes hypoglycemia",
      "Lactic acidosis is the most dangerous delayed complication of metformin overdose",
      "Hepatic failure is not a typical complication of metformin overdose",
      "Metformin has no serotonergic activity and does not cause serotonin syndrome"
    ],
    lessonLink: "/emergency/lessons/metformin-overdose"
  },
  {
    stem: "A 40-year-old male presents after a rattlesnake bite to his right hand 45 minutes ago. His hand and forearm are swollen, ecchymotic, and intensely painful. There are two fang marks visible. He has no systemic symptoms. What is the initial management?",
    options: [
      "Apply a tourniquet above the bite to prevent venom spread and incise the wound to extract venom",
      "Administer CroFab (crotalidae polyvalent immune fab) antivenom and mark the leading edge of swelling",
      "Apply ice and immobilize the extremity while monitoring for 6 hours",
      "Perform fasciotomy to prevent compartment syndrome from venom-induced swelling"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient has a significant envenomation from a rattlesnake (Crotalinae species) with progressive local swelling, ecchymosis, and pain extending beyond the immediate bite area. The appropriate initial management includes: (1) Antivenom administration: CroFab (Crotalidae Polyvalent Immune Fab) is the first-line treatment for pit viper envenomation in North America. It contains purified antibody fragments (Fab) that bind and neutralize venom components. Initial dose: 4-6 vials reconstituted and infused IV over 1 hour. Repeat if swelling progresses. CroFab is derived from sheep and has a lower anaphylaxis risk than older horse-derived antivenoms. (2) Mark the leading edge of swelling with a pen and note the time - this allows objective monitoring of progression and response to antivenom. If the swelling extends beyond the marked line, additional antivenom is needed. (3) Immobilize the affected extremity below heart level. Additional management: large-bore IV access in the unaffected arm, tetanus prophylaxis if not current, serial lab monitoring (CBC with platelets, PT/INR/PTT, fibrinogen, D-dimer - rattlesnake venom causes coagulopathy through fibrinogen depletion), and pain management (morphine or fentanyl - avoid NSAIDs due to antiplatelet effects). Outdated interventions that should NEVER be performed: tourniquets (trap venom locally causing more tissue damage), incision and suction (ineffective and causes additional tissue injury), ice application (can cause frostbite and worsen local ischemia), and electric shock therapy (no evidence of benefit). Fasciotomy is rarely needed and should only be performed if compartment pressures are definitively elevated despite adequate antivenom dosing.",
    learningObjective: "Administer CroFab antivenom for significant crotalid (pit viper) envenomation and monitor swelling progression",
    blueprintCategory: "Toxicological Emergencies",
    subtopic: "Envenomation",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "NEVER apply tourniquets, incise, suction, or apply ice to snake bites - these outdated interventions cause more harm",
    clinicalPearls: [
      "CroFab: 4-6 vials IV for initial treatment; repeat if swelling progresses",
      "Mark the leading edge of swelling with pen and time to monitor progression",
      "Rattlesnake venom causes coagulopathy - monitor fibrinogen, platelets, PT/INR",
      "Avoid NSAIDs due to antiplatelet effects in the setting of venom-induced coagulopathy"
    ],
    safetyNote: "Draw blood from the unaffected arm - never draw from the affected limb as venom in local tissues can affect lab results",
    distractorRationales: [
      "Tourniquets and incision are outdated, harmful interventions that should never be performed",
      "CroFab antivenom with swelling monitoring is the correct evidence-based approach",
      "Ice can cause frostbite and worsen local ischemia - never apply ice to snake bites",
      "Fasciotomy is rarely needed and should not be performed without measuring compartment pressures"
    ],
    lessonLink: "/emergency/lessons/envenomation"
  },
  {
    stem: "A 25-year-old male presents with altered mental status, tachycardia, hyperthermia (39.8°C), and profuse diaphoresis after attending a music festival. His friends report he took 'bath salts' (synthetic cathinones). His pupils are dilated and he has severe psychomotor agitation. What is the first-line treatment?",
    options: [
      "IV haloperidol 5 mg for rapid tranquilization",
      "IV lorazepam 2-4 mg repeated every 5 minutes as needed for agitation",
      "Physical restraints with 4-point leather restraints",
      "IM ketamine 4 mg/kg for dissociative sedation"
    ],
    correctAnswer: 1,
    rationaleLong: "Synthetic cathinone ('bath salts') toxicity presents as a severe sympathomimetic toxidrome with agitation, psychosis, tachycardia, hyperthermia, diaphoresis, and mydriasis. The first-line treatment for agitation from sympathomimetic toxicity is benzodiazepines, specifically IV lorazepam 2-4 mg repeated every 5 minutes until adequate sedation is achieved. Benzodiazepines are preferred because they: (1) reduce sympathetic output, thereby decreasing heart rate, blood pressure, and temperature, (2) reduce the risk of seizures (which are common with stimulant toxicity), (3) reduce psychomotor agitation and muscle activity (which generates heat and worsens rhabdomyolysis), and (4) have a wide safety margin. Large cumulative doses may be needed (20-40+ mg of lorazepam). Haloperidol should be avoided in stimulant toxicity because: (1) it lowers the seizure threshold, (2) it impairs heat dissipation through central and peripheral mechanisms, (3) it can cause QTc prolongation and increase arrhythmia risk, (4) it can cause NMS, which would be catastrophic in an already hyperthermic patient. Physical restraints should be avoided or minimized because they increase resistance, muscle activity, and heat generation, worsening both hyperthermia and rhabdomyolysis. If restraints are absolutely necessary, chemical sedation should be administered simultaneously. IM ketamine 4 mg/kg is an emerging option for severe agitation (particularly when IV access cannot be established) and has shown promise in prehospital settings. However, benzodiazepines remain first-line when IV access is available due to their superior safety profile and anti-seizure properties.",
    learningObjective: "Treat sympathomimetic agitation with IV benzodiazepines as first-line therapy, avoiding haloperidol and physical restraints",
    blueprintCategory: "Toxicological Emergencies",
    subtopic: "Synthetic Drug Toxicity",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Avoid haloperidol in stimulant toxicity - lowers seizure threshold, impairs heat dissipation, and risks NMS",
    clinicalPearls: [
      "Benzodiazepines are first-line for sympathomimetic agitation - reduce sympathetic output and seizure risk",
      "Large doses may be needed (20-40+ mg lorazepam) - titrate to effect",
      "Avoid haloperidol: seizure risk, impaired heat dissipation, NMS risk, QTc prolongation",
      "Physical restraints increase muscle activity and worsen hyperthermia and rhabdomyolysis"
    ],
    safetyNote: "Patients with excited delirium from stimulants can die from sudden cardiac arrest - rapid effective sedation is essential",
    distractorRationales: [
      "Haloperidol is contraindicated due to seizure risk, impaired heat dissipation, and NMS risk",
      "IV lorazepam is the correct first-line treatment for sympathomimetic agitation",
      "Physical restraints worsen hyperthermia and rhabdomyolysis through increased muscle activity",
      "IM ketamine is an emerging alternative but IV benzodiazepines remain first-line"
    ],
    lessonLink: "/emergency/lessons/synthetic-drug-toxicity"
  },
  {
    stem: "A 60-year-old male on digoxin presents with nausea, vomiting, visual changes (yellow-green halos), and new-onset bradycardia at 42 bpm with a regular rhythm. His potassium is 5.6 mEq/L. Digoxin level is 3.8 ng/mL (therapeutic range 0.8-2.0). What is the specific antidote?",
    options: [
      "IV atropine 0.5 mg for symptomatic bradycardia",
      "Digoxin-specific antibody fragments (DigiFab) based on estimated body load",
      "IV calcium gluconate for hyperkalemia",
      "Activated charcoal for GI decontamination"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient has digoxin toxicity, evidenced by: supratherapeutic digoxin level (3.8 ng/mL), classic toxicity symptoms (nausea, vomiting, visual changes with yellow-green halos - the 'yellow vision' described by van Gogh), cardiac manifestations (bradycardia), and hyperkalemia (K+ 5.6). Digoxin toxicity causes hyperkalemia because digoxin inhibits the Na+/K+-ATPase pump, causing potassium to accumulate extracellularly. The hyperkalemia of digoxin toxicity is a marker of severity and correlates with prognosis. The specific antidote is digoxin-specific antibody fragments (DigiFab, formerly Digibind). DigiFab consists of Fab fragments from antidigoxin antibodies raised in sheep. These antibody fragments bind free digoxin in the bloodstream, making it pharmacologically inactive and promoting renal excretion. DigiFab is indicated for: (1) life-threatening arrhythmias (severe bradycardia, ventricular tachycardia, ventricular fibrillation), (2) hyperkalemia > 5.0 mEq/L in the setting of digoxin toxicity, (3) hemodynamic instability, (4) serum digoxin level > 6.0 ng/mL at steady state, or (5) ingestion of > 10 mg in adults or > 4 mg in children. Dosing is calculated based on estimated body load of digoxin. Each vial of DigiFab neutralizes approximately 0.5 mg of digoxin. CRITICAL SAFETY POINT: IV calcium is CONTRAINDICATED in digoxin toxicity with hyperkalemia. Unlike other causes of hyperkalemia where calcium is the first-line treatment, calcium in the presence of digoxin excess can cause 'stone heart' (cardiac arrest from calcium-potassium interaction with the digoxin-inhibited Na+/K+-ATPase). Atropine may temporarily improve bradycardia but does not address the underlying toxicity.",
    learningObjective: "Administer digoxin-specific antibody fragments (DigiFab) for digoxin toxicity and recognize that calcium is contraindicated",
    blueprintCategory: "Toxicological Emergencies",
    subtopic: "Digoxin Toxicity",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "IV calcium is CONTRAINDICATED in digoxin toxicity with hyperkalemia - can cause 'stone heart' (fatal cardiac arrest)",
    clinicalPearls: [
      "Digoxin toxicity triad: GI symptoms + visual changes (yellow-green halos) + cardiac arrhythmias",
      "Hyperkalemia in digoxin toxicity = marker of severity from Na/K-ATPase inhibition",
      "DigiFab: each vial neutralizes 0.5 mg digoxin; dose based on estimated body load",
      "Calcium is CONTRAINDICATED in digoxin toxicity - can cause fatal 'stone heart'"
    ],
    safetyNote: "NEVER give IV calcium to a patient with digoxin toxicity - it can cause immediate cardiac arrest",
    distractorRationales: [
      "Atropine is a temporizing measure but does not treat the underlying toxicity",
      "DigiFab is the specific antidote that binds and inactivates circulating digoxin",
      "Calcium is CONTRAINDICATED in digoxin toxicity due to 'stone heart' risk",
      "Activated charcoal has limited value if the ingestion was not recent"
    ],
    lessonLink: "/emergency/lessons/digoxin-toxicity"
  },
  {
    stem: "A 32-year-old male presents after intentional ingestion of a bottle of windshield washer fluid. He has altered mental status and is vomiting. ABG shows pH 7.22, anion gap 22, and osmolar gap 45. Serum ethanol level is undetectable. What toxic alcohol is most likely?",
    options: [
      "Methanol (formic acid is the toxic metabolite)",
      "Ethylene glycol (oxalic acid is the toxic metabolite)",
      "Isopropyl alcohol (acetone is the metabolite)",
      "Diethylene glycol"
    ],
    correctAnswer: 0,
    rationaleLong: "Windshield washer fluid contains methanol (methyl alcohol), making methanol poisoning the most likely diagnosis. The ABG findings of metabolic acidosis (pH 7.22) with an elevated anion gap (22) and elevated osmolar gap (45) are characteristic of toxic alcohol ingestion. Methanol is metabolized by alcohol dehydrogenase to formaldehyde, then to formic acid. Formic acid is the toxic metabolite responsible for the clinical effects, particularly optic nerve toxicity (which can cause permanent blindness) and severe metabolic acidosis. Key differentiating features between the toxic alcohols: Methanol (windshield washer fluid, solvents): visual disturbances (blurred vision, photophobia, 'snowfield' vision), optic disc hyperemia, severe anion gap metabolic acidosis. Toxic metabolite: formic acid. Ethylene glycol (antifreeze): renal failure, calcium oxalate crystals in urine (causing hematuria and flank pain), cardiopulmonary failure. Toxic metabolite: oxalic acid (glycolic acid intermediary). The urine may fluoresce under Wood's lamp if the antifreeze contains fluorescein dye. Isopropyl alcohol (rubbing alcohol): CNS depression (similar to ethanol), acetone on breath (fruity smell), ketosis WITHOUT metabolic acidosis (acetone is not acidic). Isopropyl alcohol does NOT cause anion gap acidosis - this is the key distinguishing feature. It causes an osmolar gap without anion gap acidosis. Treatment for methanol (same as ethylene glycol): (1) IV fomepizole 15 mg/kg loading dose (blocks alcohol dehydrogenase), (2) hemodialysis for severe acidosis, visual symptoms, renal failure, or level > 50 mg/dL, (3) IV folate/folic acid 50 mg every 6 hours (enhances formic acid metabolism to CO2 and water).",
    learningObjective: "Identify methanol in windshield washer fluid and differentiate toxic alcohols by their clinical presentations",
    blueprintCategory: "Toxicological Emergencies",
    subtopic: "Toxic Alcohol Poisoning",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Isopropyl alcohol causes osmolar gap WITHOUT anion gap acidosis - the only toxic alcohol that doesn't cause acidosis",
    clinicalPearls: [
      "Methanol = windshield washer fluid → formic acid → blindness",
      "Ethylene glycol = antifreeze → oxalic acid → renal failure + calcium oxalate crystals",
      "Isopropyl alcohol = rubbing alcohol → acetone → NO anion gap acidosis (key differentiator)",
      "Fomepizole blocks alcohol dehydrogenase for both methanol and ethylene glycol"
    ],
    safetyNote: "Administer fomepizole empirically if toxic alcohol ingestion is suspected - do not wait for specific levels to return",
    distractorRationales: [
      "Methanol is correct - windshield washer fluid contains methanol, and the anion gap acidosis confirms toxic metabolite formation",
      "Ethylene glycol is found in antifreeze, not windshield washer fluid",
      "Isopropyl alcohol does not cause anion gap metabolic acidosis",
      "Diethylene glycol is less commonly encountered and not a typical windshield washer fluid component"
    ],
    lessonLink: "/emergency/lessons/toxic-alcohol-poisoning"
  }
];
