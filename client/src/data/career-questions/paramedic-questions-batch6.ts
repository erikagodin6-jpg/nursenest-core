import type { CareerQuestion } from "./rrt-questions";

export const paramedicQuestionsBatch6: CareerQuestion[] = [
  {
    id: "para-batch-401",
    stem: "A 45-year-old hiker is found confused and shivering after being lost overnight in cold weather. His core temperature reads 33°C (91.4°F). What is the most appropriate initial intervention?",
    options: [
      "Active external rewarming with warm blankets and heated IV fluids",
      "Vigorous rubbing of extremities to restore circulation",
      "Immediate immersion in hot water",
      "Administration of warm coffee by mouth"
    ],
    correctIndex: 0,
    rationale: "Mild hypothermia (32-35°C) is treated with active external rewarming including removal of wet clothing, warm blankets, and warmed IV fluids. Rubbing extremities can cause tissue damage and worsen afterdrop. Immersion in hot water can cause vasodilation and cardiovascular collapse. Oral fluids risk aspiration in an altered patient.",
    difficulty: 1,
    category: "Environmental Emergencies",
    topic: "hypothermia management"
  },
  {
    id: "para-batch-402",
    stem: "Which core temperature range classifies a patient as having severe hypothermia?",
    options: [
      "Below 28°C (82.4°F)",
      "32-35°C (89.6-95°F)",
      "28-32°C (82.4-89.6°F)",
      "35-36°C (95-96.8°F)"
    ],
    correctIndex: 0,
    rationale: "Severe hypothermia is defined as a core temperature below 28°C (82.4°F). This stage carries significant risk of ventricular fibrillation and cardiac arrest. Mild hypothermia is 32-35°C, moderate is 28-32°C, and 35-36°C would be considered mild or near-normal.",
    difficulty: 1,
    category: "Environmental Emergencies",
    topic: "hypothermia classification"
  },
  {
    id: "para-batch-403",
    stem: "A patient with severe hypothermia (core temp 26°C) is in cardiac arrest. After one defibrillation attempt is unsuccessful, what is the next appropriate action according to ACLS guidelines?",
    options: [
      "Continue CPR and defer further defibrillation and medications until core temperature is above 30°C",
      "Defibrillate every 2 minutes as with standard cardiac arrest protocols",
      "Administer epinephrine 1 mg every 3 minutes",
      "Terminate resuscitation efforts since hypothermic arrest is not survivable"
    ],
    correctIndex: 0,
    rationale: "In severe hypothermia below 30°C, the heart is generally unresponsive to defibrillation and medications. Current guidelines recommend performing CPR and withholding further shocks and vasoactive drugs until the core temperature reaches above 30°C. Hypothermic arrest has excellent survival potential if properly managed.",
    difficulty: 4,
    category: "Environmental Emergencies",
    topic: "hypothermic cardiac arrest"
  },
  {
    id: "para-batch-404",
    stem: "A construction worker is brought in after working outside in 38°C (100°F) heat. He is alert, diaphoretic, has muscle cramps, and a core temperature of 38.5°C (101.3°F). What is the most likely diagnosis?",
    options: [
      "Heat exhaustion",
      "Heatstroke",
      "Heat cramps",
      "Malignant hyperthermia"
    ],
    correctIndex: 0,
    rationale: "Heat exhaustion presents with diaphoresis, muscle cramps, fatigue, and mildly elevated temperature (typically below 40°C). The patient remains alert and is still sweating. Heatstroke features temperatures above 40°C with altered mental status and cessation of sweating. Heat cramps are isolated muscle spasms without systemic symptoms. Malignant hyperthermia is a genetic anesthetic reaction.",
    difficulty: 5,
    category: "Environmental Emergencies",
    topic: "heat-related illness"
  },
  {
    id: "para-batch-405",
    stem: "What is the hallmark finding that distinguishes heatstroke from heat exhaustion?",
    options: [
      "Altered mental status with core temperature above 40°C (104°F)",
      "Excessive sweating with nausea",
      "Muscle cramps and fatigue",
      "Headache and dizziness"
    ],
    correctIndex: 0,
    rationale: "Heatstroke is distinguished from heat exhaustion by altered mental status (confusion, seizures, coma) and a core temperature above 40°C (104°F). Sweating may or may not be present in exertional heatstroke. The other symptoms listed are more consistent with heat exhaustion or heat cramps.",
    difficulty: 5,
    category: "Environmental Emergencies",
    topic: "heatstroke recognition"
  },
  {
    id: "para-batch-406",
    stem: "A patient with suspected heatstroke has a core temperature of 41.5°C (106.7°F) and is unresponsive. What is the priority intervention?",
    options: [
      "Aggressive cooling with ice packs to axillae, groin, and neck, and cold water immersion if available",
      "Administer antipyretics such as acetaminophen",
      "Obtain IV access and administer room-temperature normal saline",
      "Place the patient in a cool room and fan the patient"
    ],
    correctIndex: 0,
    rationale: "Heatstroke is a true emergency requiring immediate aggressive cooling. Ice packs to major vascular areas (axillae, groin, neck) and cold water immersion are most effective. Antipyretics are ineffective because the hyperthermia is not caused by a pyrogen-mediated set-point elevation. IV fluids and fanning are adjuncts but not the priority over rapid cooling.",
    difficulty: 3,
    category: "Environmental Emergencies",
    topic: "heatstroke treatment"
  },
  {
    id: "para-batch-407",
    stem: "A diver surfaces rapidly from a depth of 30 meters and complains of joint pain, skin mottling, and dizziness. What condition should the paramedic suspect?",
    options: [
      "Decompression sickness (the bends)",
      "Arterial gas embolism",
      "Nitrogen narcosis",
      "Barotrauma"
    ],
    correctIndex: 0,
    rationale: "Decompression sickness occurs when dissolved nitrogen forms bubbles in tissues during rapid ascent. Classic symptoms include joint pain (the bends), skin mottling (cutis marmorata), and neurological symptoms. Arterial gas embolism typically presents with sudden LOC or stroke-like symptoms. Nitrogen narcosis occurs at depth. Barotrauma affects air-filled spaces.",
    difficulty: 3,
    category: "Environmental Emergencies",
    topic: "diving emergencies"
  },
  {
    id: "para-batch-408",
    stem: "What is the definitive treatment for decompression sickness?",
    options: [
      "Hyperbaric oxygen therapy",
      "High-flow supplemental oxygen only",
      "IV corticosteroids",
      "Needle decompression of the chest"
    ],
    correctIndex: 0,
    rationale: "Hyperbaric oxygen therapy (HBO) is the definitive treatment for decompression sickness. It works by reducing bubble size and enhancing nitrogen elimination. High-flow O2 is an important initial treatment during transport but is not definitive. Corticosteroids have no proven benefit. Needle decompression is for tension pneumothorax.",
    difficulty: 5,
    category: "Environmental Emergencies",
    topic: "decompression sickness treatment"
  },
  {
    id: "para-batch-409",
    stem: "A patient presents after being struck by lightning. He is apneic and pulseless. Another victim nearby is conscious and screaming in pain. According to mass casualty triage principles for lightning strikes, who should be treated first?",
    options: [
      "The apneic, pulseless patient",
      "The conscious, screaming patient",
      "Both patients simultaneously",
      "Neither; wait for additional resources"
    ],
    correctIndex: 0,
    rationale: "Lightning strike triage follows 'reverse triage' - the apparently dead patient is treated first because respiratory arrest from lightning is often the cause of death and can be reversed with early ventilation. Conscious victims who are breathing will likely survive. This is opposite to standard MCI triage.",
    difficulty: 4,
    category: "Environmental Emergencies",
    topic: "lightning injuries"
  },
  {
    id: "para-batch-410",
    stem: "A snorkeler is stung by a jellyfish on the forearm. The patient has localized pain, redness, and raised welts. What is the appropriate prehospital treatment?",
    options: [
      "Rinse the area with vinegar and remove tentacles with tweezers",
      "Apply fresh water to the affected area",
      "Rub the area with sand to remove stingers",
      "Apply ice directly to the wound"
    ],
    correctIndex: 0,
    rationale: "Vinegar (acetic acid) inactivates undischarged nematocysts from jellyfish stings. Tentacles should be carefully removed with tweezers or a gloved hand. Fresh water can cause nematocysts to fire due to osmotic changes. Rubbing with sand can trigger additional envenomation. Ice may be used after decontamination but not as primary treatment.",
    difficulty: 5,
    category: "Environmental Emergencies",
    topic: "marine envenomation"
  },
  {
    id: "para-batch-411",
    stem: "A patient is pulled from a house fire. He has singed nasal hairs, soot in the oropharynx, and a hoarse voice. What should the paramedic anticipate?",
    options: [
      "Impending upper airway obstruction requiring early intubation",
      "Carbon monoxide poisoning only",
      "Minor smoke inhalation requiring observation",
      "Lower airway thermal injury"
    ],
    correctIndex: 0,
    rationale: "Singed nasal hairs, soot in the airway, and hoarseness are classic signs of inhalation injury with impending upper airway edema. Early intubation is critical because progressive swelling can make the airway unmanageable. Carbon monoxide poisoning may coexist but doesn't cause these findings. Lower airway thermal injury is rare as the upper airway effectively cools inspired gases.",
    difficulty: 3,
    category: "Environmental Emergencies",
    topic: "inhalation injury"
  },
  {
    id: "para-batch-412",
    stem: "What is the most reliable method to assess carbon monoxide poisoning in the prehospital setting?",
    options: [
      "CO-oximetry or a dedicated carbon monoxide pulse oximeter",
      "Standard pulse oximetry (SpO2)",
      "Clinical assessment of skin color",
      "End-tidal CO2 monitoring"
    ],
    correctIndex: 0,
    rationale: "CO-oximetry measures carboxyhemoglobin (COHb) directly and differentiates it from oxyhemoglobin. Standard pulse oximetry is unreliable because it cannot distinguish COHb from oxyhemoglobin, giving falsely normal readings. Cherry-red skin is a late and unreliable finding. EtCO2 monitors carbon dioxide, not carbon monoxide.",
    difficulty: 3,
    category: "Environmental Emergencies",
    topic: "carbon monoxide poisoning"
  },
  {
    id: "para-batch-413",
    stem: "A patient presents with frostbite to both feet. The affected areas are white, hard, and insensate. What is the appropriate prehospital management?",
    options: [
      "Protect the affected areas from further cold exposure and avoid rewarming if refreezing is possible",
      "Actively rewarm the feet by immersion in warm water",
      "Rub the feet vigorously to restore circulation",
      "Apply dry heat from a heat source directly to the feet"
    ],
    correctIndex: 0,
    rationale: "In the prehospital setting, if there is any chance of refreezing during transport, rewarming should be deferred because the freeze-thaw-refreeze cycle causes significantly more tissue damage. Protect the tissue from further cold. Rubbing causes mechanical damage to frozen tissue. Direct heat sources cause burns since the tissue lacks sensation.",
    difficulty: 3,
    category: "Environmental Emergencies",
    topic: "frostbite management"
  },
  {
    id: "para-batch-414",
    stem: "When controlled rewarming of frostbitten tissue is initiated in a hospital setting, what is the recommended water temperature?",
    options: [
      "37-39°C (98.6-102.2°F)",
      "42-44°C (107.6-111.2°F)",
      "30-34°C (86-93.2°F)",
      "45-50°C (113-122°F)"
    ],
    correctIndex: 0,
    rationale: "Controlled rapid rewarming of frostbitten tissue is performed in water at 37-39°C (98.6-102.2°F). Water that is too hot (above 40°C) can cause thermal burns to insensate tissue. Water that is too cool prolongs the rewarming process and may be less effective. The process typically takes 15-30 minutes.",
    difficulty: 5,
    category: "Environmental Emergencies",
    topic: "frostbite rewarming"
  },
  {
    id: "para-batch-415",
    stem: "A patient is rescued from a freshwater submersion. He is unconscious, apneic, and pulseless. What is the first priority in management?",
    options: [
      "Begin CPR with an emphasis on early ventilation",
      "Perform the Heimlich maneuver to expel water",
      "Suction the airway to remove all water before ventilation",
      "Initiate chest compressions only and defer ventilation"
    ],
    correctIndex: 0,
    rationale: "In drowning victims, hypoxia is the primary cause of cardiac arrest, making ventilation critical. CPR should begin with rescue breaths if possible, followed by compressions. The Heimlich maneuver is not recommended as it delays CPR and doesn't effectively clear water from lungs. Complete suctioning is unnecessary and delays care. Compression-only CPR is less effective in drowning.",
    difficulty: 5,
    category: "Environmental Emergencies",
    topic: "drowning management"
  },
  {
    id: "para-batch-416",
    stem: "What unique consideration applies when managing cardiac arrest in a hypothermic drowning victim?",
    options: [
      "Resuscitation efforts should be prolonged because hypothermia provides neuroprotection",
      "Resuscitation should be limited to 20 minutes due to poor prognosis",
      "Defibrillation should be attempted continuously",
      "Medications should be given at double the standard dose"
    ],
    correctIndex: 0,
    rationale: "Hypothermia provides significant neuroprotection by reducing cerebral metabolic demand. The saying 'no one is dead until they are warm and dead' applies. Prolonged resuscitation with rewarming has resulted in favorable neurological outcomes even after extended arrest times. Defibrillation is often ineffective below 30°C. Standard or reduced medication doses are used.",
    difficulty: 3,
    category: "Environmental Emergencies",
    topic: "hypothermic drowning"
  },
  {
    id: "para-batch-417",
    stem: "A climber at 4,200 meters altitude develops a severe headache, ataxia, and altered mental status. What is the most likely diagnosis?",
    options: [
      "High-altitude cerebral edema (HACE)",
      "Acute mountain sickness (AMS)",
      "High-altitude pulmonary edema (HAPE)",
      "Migraine headache"
    ],
    correctIndex: 0,
    rationale: "HACE presents with severe headache, ataxia (the hallmark sign), and altered mental status at high altitude. It represents progression of AMS to a life-threatening condition. AMS presents with milder symptoms without ataxia or altered mentation. HAPE presents primarily with dyspnea and cough. Migraine is possible but ataxia with altitude exposure strongly suggests HACE.",
    difficulty: 3,
    category: "Environmental Emergencies",
    topic: "altitude illness"
  },
  {
    id: "para-batch-418",
    stem: "What is the most important treatment for high-altitude cerebral edema (HACE)?",
    options: [
      "Immediate descent to a lower altitude",
      "Administration of acetazolamide",
      "Supplemental oxygen alone",
      "Bed rest at current altitude"
    ],
    correctIndex: 0,
    rationale: "Immediate descent is the definitive and most critical treatment for HACE. Dexamethasone and supplemental oxygen are adjuncts that can be used during descent or when descent is not immediately possible. Acetazolamide is used for prevention and mild AMS, not severe HACE. Remaining at altitude even with rest will worsen the condition.",
    difficulty: 5,
    category: "Environmental Emergencies",
    topic: "altitude illness treatment"
  },
  {
    id: "para-batch-419",
    stem: "A patient is bitten by a rattlesnake on the right hand. The hand is swollen, ecchymotic, and painful. What is the appropriate prehospital management?",
    options: [
      "Immobilize the affected extremity, remove jewelry, and transport rapidly",
      "Apply a tourniquet proximal to the bite",
      "Incise the wound and attempt suction",
      "Apply ice directly to the bite wound"
    ],
    correctIndex: 0,
    rationale: "Prehospital management of pit viper envenomation includes immobilizing the affected extremity at or below heart level, removing constrictive items (rings, watches) before swelling progresses, and rapid transport. Tourniquets can cause ischemic injury. Incision and suction are ineffective and harmful. Ice causes vasoconstriction and additional tissue damage.",
    difficulty: 4,
    category: "Environmental Emergencies",
    topic: "snakebite management"
  },
  {
    id: "para-batch-420",
    stem: "A 3-year-old child is brought to EMS after ingesting an unknown number of acetaminophen tablets approximately 1 hour ago. The child appears well with no symptoms. What is the most appropriate action?",
    options: [
      "Transport to the emergency department for evaluation and possible N-acetylcysteine administration",
      "Induce vomiting with syrup of ipecac",
      "Administer activated charcoal in the field",
      "Observe at home since the child is asymptomatic"
    ],
    correctIndex: 0,
    rationale: "Acetaminophen toxicity has a deceptive presentation — patients are often asymptomatic for the first 24 hours despite potentially lethal ingestion. N-acetylcysteine (NAC) is most effective when given within 8 hours. Ipecac is no longer recommended. Activated charcoal may be considered but hospital evaluation is priority. Home observation is dangerous given the delayed toxicity.",
    difficulty: 3,
    category: "Toxicology",
    topic: "acetaminophen overdose"
  },
  {
    id: "para-batch-421",
    stem: "What is the primary mechanism of toxicity in acetaminophen overdose?",
    options: [
      "Hepatotoxicity from accumulation of the toxic metabolite NAPQI",
      "Direct nephrotoxicity causing acute renal failure",
      "CNS depression leading to respiratory arrest",
      "Cardiotoxicity causing dysrhythmias"
    ],
    correctIndex: 0,
    rationale: "Acetaminophen is metabolized by the liver. In overdose, glutathione stores are depleted, leading to accumulation of the toxic metabolite NAPQI (N-acetyl-p-benzoquinone imine), which causes hepatocellular necrosis. N-acetylcysteine works by replenishing glutathione. Renal injury can occur but is secondary. CNS depression and cardiotoxicity are not primary features.",
    difficulty: 3,
    category: "Toxicology",
    topic: "acetaminophen toxicity mechanism"
  },
  {
    id: "para-batch-422",
    stem: "A patient presents with pinpoint pupils, respiratory depression, and decreased level of consciousness. What toxidrome does this presentation suggest?",
    options: [
      "Opioid toxidrome",
      "Sympathomimetic toxidrome",
      "Anticholinergic toxidrome",
      "Cholinergic toxidrome"
    ],
    correctIndex: 0,
    rationale: "The classic opioid toxidrome consists of the triad: miosis (pinpoint pupils), respiratory depression, and CNS depression. Sympathomimetic toxidrome features mydriasis, tachycardia, and agitation. Anticholinergic toxidrome presents with mydriasis, dry skin, and tachycardia. Cholinergic toxidrome features the SLUDGE/DUMBELS mnemonic with salivation, lacrimation, and diaphoresis.",
    difficulty: 1,
    category: "Toxicology",
    topic: "opioid toxidrome"
  },
  {
    id: "para-batch-423",
    stem: "What is the appropriate initial dose of naloxone for a patient with suspected opioid overdose who has respiratory depression?",
    options: [
      "0.4-2 mg IV/IM/IN, titrated to respiratory effort",
      "0.04 mg IV only",
      "4 mg IV push",
      "10 mg IM"
    ],
    correctIndex: 0,
    rationale: "Naloxone 0.4-2 mg is the standard initial dose, given IV, IM, or intranasally. It should be titrated to restore adequate respiratory effort rather than full consciousness to avoid precipitating acute withdrawal. Lower doses (0.04 mg) may be used in known opioid-dependent patients. Higher doses (4-10 mg) may be needed for synthetic opioids but are not the initial dose.",
    difficulty: 1,
    category: "Toxicology",
    topic: "naloxone administration"
  },
  {
    id: "para-batch-424",
    stem: "A patient who received naloxone for opioid overdose initially improves but becomes unresponsive again 30 minutes later. What is the most likely explanation?",
    options: [
      "The duration of action of naloxone is shorter than the opioid ingested",
      "The patient has developed anaphylaxis to naloxone",
      "The initial dose of naloxone was too high",
      "The patient has developed a new medical condition"
    ],
    correctIndex: 0,
    rationale: "Naloxone has a duration of action of 30-90 minutes, which is shorter than most opioids, especially long-acting formulations and methadone. This means the opioid can outlast the antagonist, causing recurrent toxicity. Repeated dosing or continuous infusion may be needed. Anaphylaxis to naloxone is extremely rare. The dose being too high doesn't explain recurrence.",
    difficulty: 3,
    category: "Toxicology",
    topic: "naloxone pharmacology"
  },
  {
    id: "para-batch-425",
    stem: "A patient presents with agitation, tachycardia, hyperthermia, dilated pupils, and diaphoresis after using cocaine. Which toxidrome is this consistent with?",
    options: [
      "Sympathomimetic toxidrome",
      "Anticholinergic toxidrome",
      "Serotonin syndrome",
      "Opioid toxidrome"
    ],
    correctIndex: 0,
    rationale: "Sympathomimetic toxidrome features agitation, tachycardia, hypertension, hyperthermia, mydriasis, and diaphoresis. Cocaine is a classic sympathomimetic. Anticholinergic toxidrome is similar but features dry skin (not diaphoretic). Serotonin syndrome shares some features but includes clonus and hyperreflexia. Opioid toxidrome features miosis and CNS/respiratory depression.",
    difficulty: 4,
    category: "Toxicology",
    topic: "sympathomimetic toxidrome"
  },
  {
    id: "para-batch-426",
    stem: "A patient experiencing a cocaine-induced myocardial infarction presents with chest pain and ST elevation. Which medication should be AVOIDED?",
    options: [
      "Non-selective beta-blockers",
      "Benzodiazepines",
      "Nitroglycerin",
      "Aspirin"
    ],
    correctIndex: 0,
    rationale: "Non-selective beta-blockers (e.g., propranolol) are contraindicated in cocaine-related chest pain because blocking beta-receptors allows unopposed alpha stimulation, worsening coronary vasospasm and hypertension. Benzodiazepines are first-line for sympathomimetic toxicity. Nitroglycerin and aspirin are appropriate for MI management.",
    difficulty: 4,
    category: "Toxicology",
    topic: "cocaine toxicity management"
  },
  {
    id: "para-batch-427",
    stem: "A farmer is found unresponsive in a field. He has excessive salivation, lacrimation, urination, defecation, pinpoint pupils, and bradycardia. What type of poisoning should be suspected?",
    options: [
      "Organophosphate poisoning",
      "Carbon monoxide poisoning",
      "Cyanide poisoning",
      "Opioid overdose"
    ],
    correctIndex: 0,
    rationale: "The SLUDGE presentation (Salivation, Lacrimation, Urination, Defecation, GI distress, Emesis) with miosis and bradycardia is classic for organophosphate (cholinergic) poisoning, common in agricultural settings from pesticide exposure. CO poisoning presents with headache and cherry-red skin. Cyanide causes rapid collapse. Opioids cause respiratory depression without SLUDGE symptoms.",
    difficulty: 3,
    category: "Toxicology",
    topic: "organophosphate poisoning"
  },
  {
    id: "para-batch-428",
    stem: "What is the antidote for organophosphate poisoning?",
    options: [
      "Atropine and pralidoxime (2-PAM)",
      "N-acetylcysteine",
      "Naloxone",
      "Flumazenil"
    ],
    correctIndex: 0,
    rationale: "Atropine blocks the muscarinic effects of acetylcholine excess (secretions, bradycardia) and is dosed until secretions dry. Pralidoxime (2-PAM) reactivates acetylcholinesterase if given before aging occurs. N-acetylcysteine is for acetaminophen. Naloxone is for opioids. Flumazenil is for benzodiazepines.",
    difficulty: 1,
    category: "Toxicology",
    topic: "organophosphate antidote"
  },
  {
    id: "para-batch-429",
    stem: "When administering atropine for organophosphate poisoning, what is the therapeutic endpoint?",
    options: [
      "Drying of secretions and improvement in oxygenation",
      "Pupil dilation",
      "Heart rate above 100 bpm",
      "Return of full consciousness"
    ],
    correctIndex: 0,
    rationale: "The primary endpoint for atropine therapy in organophosphate poisoning is drying of secretions and improvement of oxygenation/ventilation. Pupil dilation is not a reliable endpoint. Targeting a specific heart rate may lead to over- or under-dosing. Return of consciousness depends on many factors beyond atropine effect.",
    difficulty: 3,
    category: "Toxicology",
    topic: "atropine therapy"
  },
  {
    id: "para-batch-430",
    stem: "A patient presents with dry, flushed skin, mydriasis, tachycardia, urinary retention, and visual hallucinations after ingesting jimsonweed. What toxidrome does this represent?",
    options: [
      "Anticholinergic toxidrome",
      "Sympathomimetic toxidrome",
      "Cholinergic toxidrome",
      "Sedative-hypnotic toxidrome"
    ],
    correctIndex: 0,
    rationale: "The anticholinergic toxidrome is remembered by: 'Hot as a hare (hyperthermia), blind as a bat (mydriasis), dry as a bone (anhidrosis), red as a beet (flushed), mad as a hatter (delirium).' Jimsonweed contains anticholinergic alkaloids. Sympathomimetics cause diaphoresis (not dry skin). Cholinergic toxidrome is the opposite. Sedative-hypnotic causes CNS depression.",
    difficulty: 3,
    category: "Toxicology",
    topic: "anticholinergic toxidrome"
  },
  {
    id: "para-batch-431",
    stem: "What is the specific antidote for anticholinergic toxicity?",
    options: [
      "Physostigmine",
      "Atropine",
      "Naloxone",
      "Activated charcoal"
    ],
    correctIndex: 0,
    rationale: "Physostigmine is a reversible acetylcholinesterase inhibitor that crosses the blood-brain barrier, directly reversing central and peripheral anticholinergic effects. Atropine is an anticholinergic and would worsen the condition. Naloxone reverses opioids. Activated charcoal may reduce absorption but is not a specific antidote.",
    difficulty: 3,
    category: "Toxicology",
    topic: "anticholinergic antidote"
  },
  {
    id: "para-batch-432",
    stem: "A patient presents with metabolic acidosis, an elevated anion gap, and visual disturbances including blurred vision after drinking an unknown substance. What toxic alcohol ingestion should be suspected?",
    options: [
      "Methanol",
      "Ethylene glycol",
      "Isopropyl alcohol",
      "Ethanol"
    ],
    correctIndex: 0,
    rationale: "Methanol (wood alcohol) causes a high anion gap metabolic acidosis with visual symptoms (blurred vision, blindness) due to formic acid accumulation affecting the optic nerve. Ethylene glycol causes similar acidosis but with renal failure and oxalate crystals. Isopropyl alcohol causes ketosis without acidosis. Ethanol causes intoxication but not significant anion gap acidosis.",
    difficulty: 4,
    category: "Toxicology",
    topic: "toxic alcohol ingestion"
  },
  {
    id: "para-batch-433",
    stem: "What is the antidote for both methanol and ethylene glycol poisoning?",
    options: [
      "Fomepizole (4-methylpyrazole)",
      "N-acetylcysteine",
      "Flumazenil",
      "Sodium bicarbonate"
    ],
    correctIndex: 0,
    rationale: "Fomepizole inhibits alcohol dehydrogenase, preventing the conversion of methanol and ethylene glycol to their toxic metabolites (formic acid and oxalic acid, respectively). N-acetylcysteine is for acetaminophen toxicity. Flumazenil reverses benzodiazepines. Sodium bicarbonate may help correct acidosis but doesn't address the underlying cause.",
    difficulty: 3,
    category: "Toxicology",
    topic: "toxic alcohol antidote"
  },
  {
    id: "para-batch-434",
    stem: "A patient is brought in after ingesting a large amount of aspirin (salicylate). Which acid-base disturbance is initially most characteristic?",
    options: [
      "Respiratory alkalosis from direct stimulation of the respiratory center",
      "Metabolic alkalosis from bicarbonate retention",
      "Respiratory acidosis from hypoventilation",
      "Mixed metabolic and respiratory acidosis"
    ],
    correctIndex: 0,
    rationale: "Salicylate poisoning initially causes respiratory alkalosis through direct stimulation of the medullary respiratory center, causing hyperventilation. As toxicity progresses, a metabolic acidosis develops from uncoupling of oxidative phosphorylation. The classic finding is a mixed respiratory alkalosis with metabolic acidosis. Hypoventilation and respiratory acidosis are late, ominous findings.",
    difficulty: 4,
    category: "Toxicology",
    topic: "salicylate toxicity"
  },
  {
    id: "para-batch-435",
    stem: "A child presents with lethargy after ingesting iron tablets. The paramedic notes a radiopaque substance on abdominal X-ray. What is a serious complication of iron overdose?",
    options: [
      "Hemorrhagic gastroenteritis and hepatic failure",
      "Respiratory depression and pinpoint pupils",
      "Seizures and hypoglycemia",
      "Renal failure and visual disturbances"
    ],
    correctIndex: 0,
    rationale: "Iron toxicity causes direct corrosive injury to the GI mucosa leading to hemorrhagic gastroenteritis, followed by potential hepatic failure, metabolic acidosis, and cardiovascular collapse. Iron pills are radiopaque on X-ray. Respiratory depression with miosis is opioid toxicity. Seizures with hypoglycemia suggest other toxins. Renal failure with visual issues suggests methanol.",
    difficulty: 3,
    category: "Toxicology",
    topic: "iron poisoning"
  },
  {
    id: "para-batch-436",
    stem: "What is the specific chelation agent for severe iron poisoning?",
    options: [
      "Deferoxamine",
      "Dimercaprol (BAL)",
      "EDTA",
      "Penicillamine"
    ],
    correctIndex: 0,
    rationale: "Deferoxamine is the specific iron chelator that binds free iron in the serum and tissues, forming a water-soluble complex (ferrioxamine) excreted by the kidneys. It characteristically turns urine a vin rosé color. Dimercaprol (BAL) chelates arsenic, mercury, and lead. EDTA chelates lead. Penicillamine chelates copper and lead.",
    difficulty: 3,
    category: "Toxicology",
    topic: "iron chelation"
  },
  {
    id: "para-batch-437",
    stem: "A patient who chronically uses benzodiazepines presents with altered mental status. Which medication should be used with EXTREME caution or avoided?",
    options: [
      "Flumazenil",
      "Naloxone",
      "Activated charcoal",
      "Thiamine"
    ],
    correctIndex: 0,
    rationale: "Flumazenil is a benzodiazepine antagonist that should be used with extreme caution in chronic benzodiazepine users because it can precipitate severe withdrawal seizures that are refractory to treatment. Naloxone reverses opioids and is generally safe. Activated charcoal and thiamine do not carry this specific risk.",
    difficulty: 3,
    category: "Toxicology",
    topic: "flumazenil precautions"
  },
  {
    id: "para-batch-438",
    stem: "A patient presents after ingesting a tricyclic antidepressant (TCA). The ECG shows a widened QRS complex. What is the first-line treatment?",
    options: [
      "Sodium bicarbonate IV",
      "Magnesium sulfate IV",
      "Lidocaine IV",
      "Amiodarone IV"
    ],
    correctIndex: 0,
    rationale: "Sodium bicarbonate is the first-line treatment for TCA cardiotoxicity (QRS widening >100 ms). It works by increasing serum pH (which decreases TCA binding to sodium channels) and by providing sodium loading to overcome sodium channel blockade. The goal is QRS narrowing. Magnesium, lidocaine, and amiodarone are not first-line for TCA toxicity.",
    difficulty: 4,
    category: "Toxicology",
    topic: "tricyclic antidepressant toxicity"
  },
  {
    id: "para-batch-439",
    stem: "What cardiac rhythm is most concerning in tricyclic antidepressant overdose when the QRS duration exceeds 160 ms?",
    options: [
      "Ventricular tachycardia or ventricular fibrillation",
      "Atrial fibrillation",
      "First-degree AV block",
      "Sinus tachycardia"
    ],
    correctIndex: 0,
    rationale: "QRS prolongation beyond 160 ms in TCA overdose is associated with a high risk of ventricular dysrhythmias including ventricular tachycardia and ventricular fibrillation. QRS >100 ms predicts seizures, and >160 ms predicts ventricular dysrhythmias. Sinus tachycardia is common but not the concerning dysrhythmia. AFib and first-degree block are less associated with TCA toxicity.",
    difficulty: 4,
    category: "Toxicology",
    topic: "TCA cardiac toxicity"
  },
  {
    id: "para-batch-440",
    stem: "A patient found in a garage with the car running is brought in with headache, nausea, and a carboxyhemoglobin level of 25%. What is the appropriate treatment?",
    options: [
      "High-flow oxygen via non-rebreather mask at 100% FiO2",
      "Low-flow oxygen via nasal cannula at 2 L/min",
      "Room air observation",
      "Bronchodilator therapy"
    ],
    correctIndex: 0,
    rationale: "Carbon monoxide poisoning is treated with high-flow 100% oxygen via non-rebreather mask. This reduces the half-life of carboxyhemoglobin from approximately 4-5 hours on room air to about 60-90 minutes. Hyperbaric oxygen further reduces it to 15-30 minutes. Low-flow oxygen and room air are insufficient. Bronchodilators do not treat CO poisoning.",
    difficulty: 1,
    category: "Toxicology",
    topic: "carbon monoxide treatment"
  },
  {
    id: "para-batch-441",
    stem: "A firefighter rescued from a structure fire has altered mental status, metabolic acidosis, and an elevated lactate level. Smoke contained burning plastics. What additional poisoning should be suspected alongside CO?",
    options: [
      "Cyanide poisoning",
      "Hydrogen sulfide poisoning",
      "Chlorine gas exposure",
      "Ammonia inhalation"
    ],
    correctIndex: 0,
    rationale: "Burning synthetic materials (plastics, wool, silk) release hydrogen cyanide gas. Combined CO and cyanide poisoning should be suspected in structure fire victims with severe metabolic acidosis and elevated lactate, as cyanide inhibits cytochrome oxidase, blocking aerobic metabolism. Hydrogen sulfide, chlorine, and ammonia are less associated with structure fires.",
    difficulty: 4,
    category: "Toxicology",
    topic: "cyanide poisoning"
  },
  {
    id: "para-batch-442",
    stem: "What is the antidote for cyanide poisoning?",
    options: [
      "Hydroxocobalamin (Cyanokit)",
      "N-acetylcysteine",
      "Atropine",
      "Calcium gluconate"
    ],
    correctIndex: 0,
    rationale: "Hydroxocobalamin (vitamin B12a) binds cyanide to form cyanocobalamin (vitamin B12), which is renally excreted. It is the preferred antidote in the prehospital setting due to its safety profile. The older cyanide antidote kit (amyl nitrite, sodium nitrite, sodium thiosulfate) is also effective but carries more risk. NAC is for acetaminophen, atropine for organophosphates.",
    difficulty: 3,
    category: "Toxicology",
    topic: "cyanide antidote"
  },
  {
    id: "para-batch-443",
    stem: "A 22-year-old presents to EMS at a music festival with hyperthermia (40.5°C), tachycardia, bruxism (jaw clenching), and nystagmus after taking 'ecstasy.' What complication is most life-threatening?",
    options: [
      "Hyponatremia from excessive water intake combined with SIADH",
      "Hypernatremia from dehydration",
      "Hyperkalemia from rhabdomyolysis",
      "Hypoglycemia from decreased oral intake"
    ],
    correctIndex: 0,
    rationale: "MDMA (ecstasy) causes SIADH (syndrome of inappropriate antidiuretic hormone secretion), and users often drink excessive amounts of water, leading to severe dilutional hyponatremia. This can cause cerebral edema and death. While rhabdomyolysis and hyperkalemia can occur, hyponatremia is the most characteristic life-threatening complication unique to MDMA use.",
    difficulty: 5,
    category: "Toxicology",
    topic: "MDMA toxicity"
  },
  {
    id: "para-batch-444",
    stem: "A patient presents with seizures, metabolic acidosis, and calcium oxalate crystals in the urine after ingesting antifreeze. What substance was likely ingested?",
    options: [
      "Ethylene glycol",
      "Methanol",
      "Isopropyl alcohol",
      "Acetone"
    ],
    correctIndex: 0,
    rationale: "Ethylene glycol (antifreeze) is metabolized to oxalic acid, which combines with calcium to form calcium oxalate crystals deposited in the kidneys and found in urine. This causes acute renal failure, metabolic acidosis, and seizures from hypocalcemia. Methanol causes visual disturbances. Isopropyl alcohol causes ketosis. Acetone causes CNS depression.",
    difficulty: 3,
    category: "Toxicology",
    topic: "ethylene glycol poisoning"
  },
  {
    id: "para-batch-445",
    stem: "A patient on warfarin presents with a critically elevated INR of 9.0 and active GI bleeding. What is the most appropriate reversal agent?",
    options: [
      "Vitamin K (phytonadione) IV and prothrombin complex concentrate (PCC)",
      "Fresh frozen plasma alone",
      "Protamine sulfate",
      "Aminocaproic acid"
    ],
    correctIndex: 0,
    rationale: "For life-threatening bleeding on warfarin, IV vitamin K provides sustained reversal (takes 6-24 hours) while prothrombin complex concentrate (PCC) provides immediate factor replacement. FFP is an alternative but requires large volumes. Protamine reverses heparin, not warfarin. Aminocaproic acid is an antifibrinolytic, not a warfarin reversal agent.",
    difficulty: 4,
    category: "Toxicology",
    topic: "warfarin reversal"
  },
  {
    id: "para-batch-446",
    stem: "A patient presents after a beta-blocker overdose with severe bradycardia and hypotension unresponsive to atropine. What is the next appropriate treatment?",
    options: [
      "High-dose glucagon IV",
      "Epinephrine infusion only",
      "Calcium chloride only",
      "Sodium bicarbonate"
    ],
    correctIndex: 0,
    rationale: "Glucagon is the specific antidote for beta-blocker toxicity when atropine fails. It bypasses the blocked beta-receptors and activates adenylate cyclase through glucagon receptors, increasing heart rate and contractility. Epinephrine and calcium may be used as adjuncts. Sodium bicarbonate is for TCA or sodium channel blocker toxicity.",
    difficulty: 3,
    category: "Toxicology",
    topic: "beta-blocker overdose"
  },
  {
    id: "para-batch-447",
    stem: "A patient presents with hypotension, bradycardia, and hyperglycemia after calcium channel blocker overdose. What is the recommended high-dose therapy?",
    options: [
      "High-dose insulin euglycemic therapy (HIE)",
      "High-dose epinephrine infusion",
      "High-dose dopamine infusion",
      "High-dose vasopressin infusion"
    ],
    correctIndex: 0,
    rationale: "High-dose insulin euglycemic therapy (HIE) with insulin at 1 unit/kg/hr plus dextrose is the recommended treatment for severe calcium channel blocker toxicity. Insulin has positive inotropic effects independent of calcium channels and improves myocardial glucose utilization. Calcium IV, vasopressors, and glucagon are also used but HIE is the specific recommended therapy.",
    difficulty: 5,
    category: "Toxicology",
    topic: "calcium channel blocker overdose"
  },
  {
    id: "para-batch-448",
    stem: "During a hazmat incident, a patient is exposed to an unknown chemical causing miosis, bronchospasm, copious secretions, and muscle fasciculations. Which nerve agent class does this presentation suggest?",
    options: [
      "Cholinesterase inhibitor (nerve agent such as sarin)",
      "Vesicant (blister agent such as mustard gas)",
      "Pulmonary agent (such as phosgene)",
      "Blood agent (such as cyanide)"
    ],
    correctIndex: 0,
    rationale: "Nerve agents (sarin, VX, soman) are potent cholinesterase inhibitors producing cholinergic crisis: miosis, bronchospasm, secretions, and fasciculations (SLUDGE/DUMBELS). Vesicants cause blistering. Pulmonary agents cause delayed pulmonary edema. Blood agents (cyanide) inhibit cytochrome oxidase causing cellular hypoxia.",
    difficulty: 3,
    category: "Toxicology",
    topic: "nerve agent exposure"
  },
  {
    id: "para-batch-449",
    stem: "What medication is available in autoinjector form for self-treatment or buddy-treatment in nerve agent exposure?",
    options: [
      "Atropine and pralidoxime (DuoDote/MARK-1 kit)",
      "Epinephrine autoinjector",
      "Naloxone nasal spray",
      "Diazepam autoinjector only"
    ],
    correctIndex: 0,
    rationale: "The DuoDote autoinjector (formerly MARK-1 kit) contains both atropine (2.1 mg) and pralidoxime (600 mg) for nerve agent exposure. Atropine blocks muscarinic effects and pralidoxime reactivates cholinesterase. Diazepam is available as an autoinjector (CANA) for seizure treatment but is separate. Epinephrine autoinjectors are for anaphylaxis. Naloxone is for opioids.",
    difficulty: 3,
    category: "Toxicology",
    topic: "nerve agent treatment"
  },
  {
    id: "para-batch-450",
    stem: "A patient presents with an acute psychotic episode, believing the government has implanted a tracking device in his brain. He is agitated and pacing but not violent. What is the most appropriate initial approach?",
    options: [
      "Use verbal de-escalation techniques in a calm, non-threatening manner",
      "Immediately administer chemical restraints",
      "Apply physical restraints for safety",
      "Ignore the delusions and proceed with assessment"
    ],
    correctIndex: 0,
    rationale: "Verbal de-escalation is always the first-line approach for agitated psychiatric patients who are not an immediate danger. Techniques include speaking calmly, maintaining a safe distance, acknowledging concerns, and offering choices. Chemical and physical restraints are reserved for imminent danger situations. Ignoring concerns can escalate agitation.",
    difficulty: 1,
    category: "Psychiatric Emergencies",
    topic: "de-escalation techniques"
  },
  {
    id: "para-batch-451",
    stem: "Which of the following patients meets criteria for involuntary psychiatric hold?",
    options: [
      "A patient who is actively suicidal with a specific plan and access to means",
      "A patient who is depressed but denies suicidal ideation",
      "A patient who is experiencing auditory hallucinations but is cooperative with treatment",
      "A patient who refuses medication for schizophrenia"
    ],
    correctIndex: 0,
    rationale: "Involuntary psychiatric holds require the patient to be a danger to self, a danger to others, or gravely disabled (unable to provide for basic needs). Active suicidal ideation with a specific plan and access to means clearly meets danger-to-self criteria. Depression without SI, cooperative hallucinations, and medication refusal alone do not meet criteria.",
    difficulty: 1,
    category: "Psychiatric Emergencies",
    topic: "involuntary commitment criteria"
  },
  {
    id: "para-batch-452",
    stem: "When assessing a patient for suicide risk, which factor most significantly increases the immediate risk?",
    options: [
      "Having a specific plan with access to lethal means",
      "Having a family history of depression",
      "Being recently divorced",
      "Having a history of previous psychiatric hospitalization"
    ],
    correctIndex: 0,
    rationale: "A specific plan with access to lethal means represents the highest immediate risk for suicide completion. While family history, recent divorce, and previous hospitalizations are all risk factors, the combination of a concrete plan and access to means indicates imminent danger requiring immediate intervention. Risk assessment tools prioritize plan specificity and means access.",
    difficulty: 1,
    category: "Psychiatric Emergencies",
    topic: "suicide risk assessment"
  },
  {
    id: "para-batch-453",
    stem: "A patient is found standing on a bridge ledge threatening to jump. Paramedics arrive on scene. What is the highest priority?",
    options: [
      "Ensure scene safety and establish verbal contact while maintaining a safe distance",
      "Immediately physically restrain the patient",
      "Rush to grab the patient before they can jump",
      "Begin a full psychiatric evaluation"
    ],
    correctIndex: 0,
    rationale: "Scene safety is paramount. Establishing verbal contact while maintaining a safe distance allows rapport building without provoking the patient. Physical restraint or rushing toward the patient may precipitate a jump. A full psychiatric evaluation is not appropriate in this acute crisis. Specialized crisis negotiation team should be requested.",
    difficulty: 2,
    category: "Psychiatric Emergencies",
    topic: "active suicide attempt"
  },
  {
    id: "para-batch-454",
    stem: "A 28-year-old woman presents with rapid onset of agitation, confusion, rigid muscles, hyperthermia (41°C), and autonomic instability. She was recently started on haloperidol. What condition should be suspected?",
    options: [
      "Neuroleptic malignant syndrome (NMS)",
      "Serotonin syndrome",
      "Malignant hyperthermia",
      "Anticholinergic toxicity"
    ],
    correctIndex: 0,
    rationale: "NMS is a life-threatening reaction to antipsychotics (especially haloperidol) characterized by hyperthermia, severe muscular rigidity (lead-pipe), altered mental status, and autonomic dysfunction. It develops over days. Serotonin syndrome is similar but associated with serotonergic drugs and features clonus/hyperreflexia. Malignant hyperthermia occurs with anesthetics. Anticholinergic toxicity causes dry skin without rigidity.",
    difficulty: 4,
    category: "Psychiatric Emergencies",
    topic: "neuroleptic malignant syndrome"
  },
  {
    id: "para-batch-455",
    stem: "What is the key clinical feature that distinguishes neuroleptic malignant syndrome from serotonin syndrome?",
    options: [
      "Lead-pipe muscular rigidity in NMS versus clonus and hyperreflexia in serotonin syndrome",
      "Hyperthermia in NMS versus hypothermia in serotonin syndrome",
      "Bradycardia in NMS versus tachycardia in serotonin syndrome",
      "Onset within minutes in NMS versus onset over weeks in serotonin syndrome"
    ],
    correctIndex: 0,
    rationale: "NMS features lead-pipe rigidity (constant resistance throughout range of motion), while serotonin syndrome features clonus (involuntary rhythmic muscular contractions), hyperreflexia, and tremor. Both cause hyperthermia and tachycardia. NMS develops over days while serotonin syndrome typically develops within 24 hours of medication change.",
    difficulty: 4,
    category: "Psychiatric Emergencies",
    topic: "NMS vs serotonin syndrome"
  },
  {
    id: "para-batch-456",
    stem: "A patient presents with panic attack symptoms: chest tightness, tingling in hands and feet, rapid breathing, and a feeling of impending doom. Vital signs are stable. What should the paramedic do first?",
    options: [
      "Reassure the patient, perform a thorough assessment to rule out medical causes, and coach slow breathing",
      "Immediately administer benzodiazepines",
      "Diagnose a panic attack and refuse transport",
      "Apply a paper bag for rebreathing"
    ],
    correctIndex: 0,
    rationale: "Panic attack symptoms can mimic life-threatening conditions (MI, PE, pneumothorax). A thorough assessment is essential to rule out medical causes. Reassurance and coaching slow breathing help manage hyperventilation. Benzodiazepines are not first-line prehospital treatment. Refusing transport is inappropriate. Paper bag rebreathing is no longer recommended due to hypoxia risk.",
    difficulty: 2,
    category: "Psychiatric Emergencies",
    topic: "panic attack management"
  },
  {
    id: "para-batch-457",
    stem: "A patient with known bipolar disorder is brought in by family in an acute manic episode. He is speaking rapidly, has grandiose delusions, hasn't slept in 3 days, and is making poor decisions. He refuses transport. Can he be transported involuntarily?",
    options: [
      "Yes, if he is gravely disabled and unable to care for himself or poses a danger to self or others",
      "No, all psychiatric patients have the right to refuse treatment",
      "Yes, any patient with a psychiatric diagnosis can be transported involuntarily",
      "No, mania is never a reason for involuntary transport"
    ],
    correctIndex: 0,
    rationale: "Involuntary transport requires meeting criteria for danger to self, danger to others, or grave disability. A severely manic patient who cannot care for basic needs (sleep, nutrition, safety) may meet grave disability criteria. Not all psychiatric patients can refuse treatment, but involuntary action requires specific legal criteria to be met. Having a diagnosis alone is insufficient.",
    difficulty: 3,
    category: "Psychiatric Emergencies",
    topic: "involuntary transport"
  },
  {
    id: "para-batch-458",
    stem: "What medication is most commonly used for acute agitation in the prehospital psychiatric emergency setting?",
    options: [
      "Midazolam (Versed)",
      "Haloperidol",
      "Lithium",
      "Fluoxetine"
    ],
    correctIndex: 0,
    rationale: "Midazolam is the most commonly used prehospital medication for acute agitation because it can be given IM or IN with rapid onset (5-15 minutes). It provides anxiolysis and sedation. Haloperidol is also used but has slower onset and risk of dystonic reactions. Lithium requires therapeutic monitoring and is not for acute use. Fluoxetine (SSRI) has no role in acute agitation.",
    difficulty: 1,
    category: "Psychiatric Emergencies",
    topic: "chemical restraint"
  },
  {
    id: "para-batch-459",
    stem: "When applying physical restraints to an acutely violent psychiatric patient, what is the appropriate position?",
    options: [
      "Supine or on their side, never prone (face-down)",
      "Prone (face-down) to prevent spitting",
      "Seated upright in a wheelchair",
      "Hog-tied with extremities behind the back"
    ],
    correctIndex: 0,
    rationale: "Restrained patients should be positioned supine or on their side (lateral recumbent) to maintain airway patency and prevent positional asphyxia. Prone positioning significantly increases the risk of positional asphyxia and death, especially in excited delirium. Hog-tying is dangerous and prohibited. Continuous monitoring of airway, breathing, and circulation is mandatory.",
    difficulty: 1,
    category: "Psychiatric Emergencies",
    topic: "physical restraint safety"
  },
  {
    id: "para-batch-460",
    stem: "A patient is experiencing excited delirium with extreme agitation, superhuman strength, hyperthermia, and diaphoresis. What is the most serious complication the paramedic should anticipate?",
    options: [
      "Sudden cardiac arrest",
      "Self-inflicted minor injuries",
      "Hyperventilation syndrome",
      "Syncope"
    ],
    correctIndex: 0,
    rationale: "Excited delirium carries a high risk of sudden cardiac arrest, thought to be related to catecholamine surge, acidosis, hyperthermia, and rhabdomyolysis. It is a medical emergency, not just a behavioral issue. Rapid sedation, cooling, and cardiac monitoring are essential. The other options, while possible, are not the most serious life-threatening complication.",
    difficulty: 3,
    category: "Psychiatric Emergencies",
    topic: "excited delirium"
  },
  {
    id: "para-batch-461",
    stem: "A patient presents with a heat-related illness. His skin is hot and dry, he is confused, and his temperature is 42°C (107.6°F). Target cooling to what temperature before stopping active cooling measures?",
    options: [
      "38.3-38.9°C (101-102°F)",
      "36.0°C (96.8°F)",
      "35.0°C (95°F)",
      "37.0°C (98.6°F) exactly"
    ],
    correctIndex: 0,
    rationale: "Active cooling in heatstroke should be stopped when core temperature reaches approximately 38.3-38.9°C (101-102°F) to prevent overshoot hypothermia due to continued cooling after active measures are removed. Cooling below 38°C risks inducing hypothermia. The goal is not to reach normal body temperature during active cooling.",
    difficulty: 3,
    category: "Environmental Emergencies",
    topic: "heatstroke cooling target"
  },
  {
    id: "para-batch-462",
    stem: "A patient is rescued from cold water immersion. Upon removal, he suddenly goes into cardiac arrest. What phenomenon likely caused this?",
    options: [
      "Circumrescue collapse (afterdrop)",
      "Drowning-related hypoxia",
      "Cold water aspiration",
      "Diving reflex failure"
    ],
    correctIndex: 0,
    rationale: "Circumrescue collapse occurs when a hypothermic patient is moved from water, causing cold peripheral blood to return to the core (afterdrop), further decreasing core temperature. This can trigger cardiac arrest. Horizontal extraction and gentle handling are recommended to minimize this risk. While drowning and aspiration are concerns, the timing upon removal points to afterdrop.",
    difficulty: 4,
    category: "Environmental Emergencies",
    topic: "cold water rescue"
  },
  {
    id: "para-batch-463",
    stem: "A hiker presents with high-altitude pulmonary edema (HAPE). Which finding is most characteristic?",
    options: [
      "Progressive dyspnea, cough productive of pink frothy sputum, and crackles on auscultation",
      "Severe headache, ataxia, and confusion",
      "Peripheral edema and weight gain",
      "Chest pain radiating to the left arm"
    ],
    correctIndex: 0,
    rationale: "HAPE presents with progressive dyspnea at rest, dry cough progressing to productive cough with pink frothy sputum, and bilateral crackles. It is a non-cardiogenic pulmonary edema. Headache, ataxia, and confusion characterize HACE. Peripheral edema suggests cardiac failure. Radiating chest pain suggests ACS.",
    difficulty: 3,
    category: "Environmental Emergencies",
    topic: "HAPE recognition"
  },
  {
    id: "para-batch-464",
    stem: "Which pharmacologic agent is recommended for treatment of high-altitude pulmonary edema (HAPE) when descent is not immediately possible?",
    options: [
      "Nifedipine",
      "Dexamethasone",
      "Acetazolamide",
      "Furosemide"
    ],
    correctIndex: 0,
    rationale: "Nifedipine is a calcium channel blocker that reduces pulmonary artery pressure, which is the primary pathology in HAPE. It is used when descent is not immediately possible. Dexamethasone is for HACE. Acetazolamide is for prevention and treatment of AMS. Furosemide (diuretic) is not recommended as HAPE patients are often dehydrated.",
    difficulty: 4,
    category: "Environmental Emergencies",
    topic: "HAPE treatment"
  },
  {
    id: "para-batch-465",
    stem: "A patient is bitten by a black widow spider. Which finding is most characteristic of black widow envenomation?",
    options: [
      "Severe muscle cramping and abdominal rigidity",
      "Tissue necrosis around the bite site",
      "Ascending paralysis",
      "Severe localized swelling with blistering"
    ],
    correctIndex: 0,
    rationale: "Black widow spider venom (alpha-latrotoxin) causes massive neurotransmitter release at the neuromuscular junction, resulting in severe muscle spasms, cramping, and board-like abdominal rigidity that can mimic an acute abdomen. Tissue necrosis is characteristic of brown recluse bites. Ascending paralysis suggests tick paralysis or Guillain-Barré. Severe local swelling suggests allergic reaction.",
    difficulty: 2,
    category: "Environmental Emergencies",
    topic: "spider envenomation"
  },
  {
    id: "para-batch-466",
    stem: "A patient presents with a painless bite that develops a central area of necrosis surrounded by a red-white-blue ring pattern. What spider bite should be suspected?",
    options: [
      "Brown recluse spider",
      "Black widow spider",
      "Hobo spider",
      "Wolf spider"
    ],
    correctIndex: 0,
    rationale: "The brown recluse spider (Loxosceles reclusa) causes a characteristic necrotic wound with a red-white-and-blue sign (central necrosis, surrounded by ischemic pallor, surrounded by erythema). The bite is often painless initially. Black widow bites cause systemic neuromuscular symptoms. Hobo and wolf spider bites are generally less severe.",
    difficulty: 2,
    category: "Environmental Emergencies",
    topic: "brown recluse bite"
  },
  {
    id: "para-batch-467",
    stem: "What type of burn is most commonly associated with lightning strike injuries?",
    options: [
      "Superficial linear and punctate burns in a ferning (Lichtenberg) pattern",
      "Deep full-thickness circumferential burns",
      "Chemical-type burns requiring irrigation",
      "Thermal contact burns requiring debridement"
    ],
    correctIndex: 0,
    rationale: "Lightning strikes typically cause superficial burns in a characteristic ferning or Lichtenberg pattern (arborescent pattern on the skin). Deep thermal burns are less common because the duration of current flow is extremely brief. The greatest danger from lightning is cardiac arrest, not thermal injury. Chemical burns and contact burns are not associated with lightning.",
    difficulty: 3,
    category: "Environmental Emergencies",
    topic: "lightning burn patterns"
  },
  {
    id: "para-batch-468",
    stem: "A scuba diver surfaces rapidly and immediately develops sudden onset unilateral weakness, visual changes, and confusion. What condition is most likely?",
    options: [
      "Arterial gas embolism (AGE)",
      "Decompression sickness",
      "Nitrogen narcosis",
      "Oxygen toxicity seizure"
    ],
    correctIndex: 0,
    rationale: "Arterial gas embolism (AGE) occurs when air enters the arterial circulation after pulmonary barotrauma during rapid ascent. It presents immediately (within minutes) with stroke-like symptoms: sudden LOC, focal neurological deficits, and confusion. Decompression sickness typically takes 30 minutes to hours to develop. Nitrogen narcosis occurs at depth and resolves with ascent.",
    difficulty: 4,
    category: "Environmental Emergencies",
    topic: "arterial gas embolism"
  },
  {
    id: "para-batch-469",
    stem: "A patient with suspected coral snake envenomation has minimal local symptoms. Why is this bite particularly dangerous?",
    options: [
      "Coral snake venom is neurotoxic and can cause delayed respiratory paralysis",
      "Coral snake bites always cause immediate anaphylaxis",
      "The venom causes rapid hemorrhagic shock",
      "Local tissue necrosis spreads rapidly"
    ],
    correctIndex: 0,
    rationale: "Coral snake venom is primarily neurotoxic (unlike pit vipers which cause hemotoxic effects). Local symptoms are often minimal, creating a false sense of security, but delayed neurotoxic effects including respiratory paralysis can develop hours later and may be difficult to reverse once established. Antivenom should be given prophylactically. Coral snakes don't typically cause hemorrhage or significant tissue necrosis.",
    difficulty: 4,
    category: "Environmental Emergencies",
    topic: "coral snake envenomation"
  },
  {
    id: "para-batch-470",
    stem: "What is the appropriate position for transporting a patient with suspected decompression sickness?",
    options: [
      "Supine with high-flow oxygen",
      "Trendelenburg (head-down) position",
      "Left lateral decubitus (Durant maneuver)",
      "Sitting upright"
    ],
    correctIndex: 0,
    rationale: "Current guidelines recommend supine positioning with high-flow oxygen for decompression sickness. The previously recommended Trendelenburg position is no longer advocated as it may increase intracranial pressure. The left lateral decubitus (Durant maneuver) was historically used for AGE but is no longer standard. Sitting upright may worsen venous return.",
    difficulty: 3,
    category: "Environmental Emergencies",
    topic: "DCS transport position"
  },
  {
    id: "para-batch-471",
    stem: "A toddler presents after ingesting several button batteries. What is the most critical concern?",
    options: [
      "Esophageal burns and perforation from electrical current and alkaline leakage",
      "Intestinal obstruction from battery impaction",
      "Heavy metal poisoning from battery contents",
      "Choking and airway obstruction"
    ],
    correctIndex: 0,
    rationale: "Button batteries lodged in the esophagus can cause severe tissue damage within 2 hours from electrical current generating hydroxide ions (alkaline burn). Esophageal perforation, fistula formation, and fatal hemorrhage from aorto-esophageal fistula can result. Once past the esophagus, batteries usually pass without incident. Urgent endoscopic removal is required for esophageal impaction.",
    difficulty: 3,
    category: "Toxicology",
    topic: "button battery ingestion"
  },
  {
    id: "para-batch-472",
    stem: "A patient presents after ingesting a caustic alkali substance (drain cleaner). What intervention is contraindicated?",
    options: [
      "Inducing vomiting or gastric lavage",
      "Administering small sips of water or milk to dilute",
      "Keeping the patient NPO during transport",
      "Establishing IV access"
    ],
    correctIndex: 0,
    rationale: "Inducing vomiting or performing gastric lavage after caustic ingestion is absolutely contraindicated because it causes re-exposure of already damaged tissue to the caustic agent, potentially causing esophageal perforation. Small sips of water/milk for dilution may be appropriate in the first 30 minutes. IV access and NPO status are appropriate standard care.",
    difficulty: 2,
    category: "Toxicology",
    topic: "caustic ingestion"
  },
  {
    id: "para-batch-473",
    stem: "A patient presents with serotonin syndrome after combining an SSRI with tramadol. Which finding is most specific to serotonin syndrome?",
    options: [
      "Clonus (especially lower extremity) and hyperreflexia",
      "Lead-pipe rigidity",
      "Pinpoint pupils",
      "Dry, flushed skin"
    ],
    correctIndex: 0,
    rationale: "Clonus (involuntary rhythmic muscular contractions, especially in the lower extremities) and hyperreflexia are the most specific findings for serotonin syndrome. Lead-pipe rigidity is characteristic of NMS. Pinpoint pupils suggest opioid toxicity. Dry, flushed skin suggests anticholinergic toxicity. Serotonin syndrome also features agitation, hyperthermia, and diaphoresis.",
    difficulty: 3,
    category: "Toxicology",
    topic: "serotonin syndrome"
  },
  {
    id: "para-batch-474",
    stem: "What is the specific treatment for serotonin syndrome?",
    options: [
      "Cyproheptadine (serotonin antagonist) and supportive care with benzodiazepines",
      "Dantrolene and bromocriptine",
      "Physostigmine",
      "Naloxone"
    ],
    correctIndex: 0,
    rationale: "Cyproheptadine is a serotonin antagonist (5-HT2A blocker) that is the specific antidote for serotonin syndrome. Benzodiazepines are used for agitation and seizures. Dantrolene and bromocriptine are used for NMS. Physostigmine is for anticholinergic toxicity. Naloxone is for opioid overdose.",
    difficulty: 3,
    category: "Toxicology",
    topic: "serotonin syndrome treatment"
  },
  {
    id: "para-batch-475",
    stem: "A patient presents with a dystonic reaction (torticollis and oculogyric crisis) after taking metoclopramide. What is the treatment?",
    options: [
      "Diphenhydramine (Benadryl) IV/IM",
      "Haloperidol IM",
      "Diazepam IV",
      "Epinephrine IM"
    ],
    correctIndex: 0,
    rationale: "Acute dystonic reactions from dopamine-blocking agents (metoclopramide, antipsychotics) are treated with anticholinergic medications such as diphenhydramine (Benadryl) or benztropine. These restore the dopamine-acetylcholine balance in the basal ganglia. Haloperidol would worsen the condition. Diazepam has limited effectiveness. Epinephrine is for anaphylaxis.",
    difficulty: 2,
    category: "Psychiatric Emergencies",
    topic: "dystonic reaction treatment"
  },
  {
    id: "para-batch-476",
    stem: "A 17-year-old is brought to EMS by friends after taking an unknown substance at a party. He is agitated, has vertical and horizontal nystagmus, appears to have diminished pain response, and is becoming violent. What substance is most likely?",
    options: [
      "PCP (phencyclidine)",
      "LSD",
      "Cannabis",
      "MDMA (ecstasy)"
    ],
    correctIndex: 0,
    rationale: "PCP (phencyclidine) characteristically causes agitation with violent behavior, rotary or vertical nystagmus (a distinguishing feature), diminished pain perception (due to dissociative anesthetic properties), and unpredictable behavior. LSD typically causes visual hallucinations without violence. Cannabis usually causes relaxation. MDMA causes empathy and sociability, not typically violence.",
    difficulty: 3,
    category: "Toxicology",
    topic: "PCP intoxication"
  },
  {
    id: "para-batch-477",
    stem: "A patient in alcohol withdrawal is tremulous, anxious, diaphoretic, and has a heart rate of 110 bpm. He reports seeing bugs on the walls. What stage of alcohol withdrawal does this likely represent?",
    options: [
      "Moderate withdrawal with alcoholic hallucinosis",
      "Mild withdrawal (minor symptoms)",
      "Delirium tremens",
      "Wernicke encephalopathy"
    ],
    correctIndex: 0,
    rationale: "Moderate alcohol withdrawal with hallucinosis typically occurs 12-48 hours after last drink and includes tremor, anxiety, autonomic hyperactivity, and hallucinations (usually visual) with intact sensorium. The patient recognizes hallucinations aren't real or can be redirected. Delirium tremens features severe confusion, fever, and hemodynamic instability (48-96 hours). Wernicke encephalopathy is a nutritional disorder.",
    difficulty: 3,
    category: "Psychiatric Emergencies",
    topic: "alcohol withdrawal stages"
  },
  {
    id: "para-batch-478",
    stem: "A patient in alcohol withdrawal develops delirium tremens. What is the first-line medication?",
    options: [
      "Benzodiazepines (lorazepam or diazepam)",
      "Haloperidol",
      "Phenobarbital as monotherapy",
      "Clonidine"
    ],
    correctIndex: 0,
    rationale: "Benzodiazepines are the first-line treatment for delirium tremens, acting on GABA receptors to replace the inhibitory effects of alcohol. Lorazepam and diazepam are most commonly used. Haloperidol can lower seizure threshold. Phenobarbital may be used as adjunct but is not first-line monotherapy. Clonidine addresses sympathetic symptoms but does not prevent seizures or mortality.",
    difficulty: 1,
    category: "Psychiatric Emergencies",
    topic: "delirium tremens treatment"
  },
  {
    id: "para-batch-479",
    stem: "What classic triad of symptoms defines Wernicke encephalopathy?",
    options: [
      "Confusion, ophthalmoplegia (eye movement abnormalities), and ataxia",
      "Tremor, tachycardia, and hallucinations",
      "Headache, neck stiffness, and photophobia",
      "Fever, altered mental status, and seizures"
    ],
    correctIndex: 0,
    rationale: "Wernicke encephalopathy is caused by thiamine (vitamin B1) deficiency and presents with the classic triad: confusion (encephalopathy), ophthalmoplegia (particularly lateral gaze palsy from CN VI involvement), and ataxia (cerebellar dysfunction). It is treated urgently with IV thiamine. The other triads describe alcohol withdrawal, meningitis, and CNS infection respectively.",
    difficulty: 2,
    category: "Psychiatric Emergencies",
    topic: "Wernicke encephalopathy"
  },
  {
    id: "para-batch-480",
    stem: "Why should glucose administration be preceded by thiamine in a malnourished alcoholic patient?",
    options: [
      "Glucose metabolism consumes thiamine and can precipitate or worsen Wernicke encephalopathy",
      "Thiamine enhances glucose absorption",
      "Glucose causes thiamine toxicity if given first",
      "Thiamine prevents hypoglycemia"
    ],
    correctIndex: 0,
    rationale: "Thiamine is a cofactor in glucose metabolism. In thiamine-deficient patients, glucose administration increases metabolic demand for thiamine, potentially depleting remaining stores and precipitating or worsening Wernicke encephalopathy. Therefore, thiamine should be given before or with glucose. Thiamine does not enhance glucose absorption, doesn't cause glucose toxicity, and doesn't prevent hypoglycemia.",
    difficulty: 3,
    category: "Psychiatric Emergencies",
    topic: "thiamine and glucose"
  },
  {
    id: "para-batch-481",
    stem: "A patient is experiencing a severe allergic reaction after a bee sting with throat swelling, stridor, and hypotension. What is the first-line treatment?",
    options: [
      "Epinephrine 0.3-0.5 mg IM (1:1,000 concentration)",
      "Diphenhydramine 50 mg IV",
      "Dexamethasone 10 mg IV",
      "Albuterol nebulization"
    ],
    correctIndex: 0,
    rationale: "Epinephrine IM is the first-line treatment for anaphylaxis. It addresses all components: bronchospasm (beta-2 agonism), hypotension (alpha-1 vasoconstriction), and reduces mediator release (beta-2 stabilization of mast cells). Antihistamines, steroids, and bronchodilators are adjunctive treatments but should never delay epinephrine administration.",
    difficulty: 1,
    category: "Environmental Emergencies",
    topic: "anaphylaxis treatment"
  },
  {
    id: "para-batch-482",
    stem: "A factory worker is exposed to hydrofluoric acid on his hand. What is the specific treatment beyond standard chemical burn irrigation?",
    options: [
      "Topical calcium gluconate gel application",
      "Topical sodium bicarbonate paste",
      "Topical silver sulfadiazine cream",
      "Topical antibiotic ointment"
    ],
    correctIndex: 0,
    rationale: "Hydrofluoric acid burns are uniquely dangerous because fluoride ions bind calcium and magnesium, causing deep tissue destruction, severe pain, and potentially fatal hypocalcemia and hypomagnesemia. Calcium gluconate gel applied topically neutralizes fluoride ions. Severe exposures may require intradermal or intra-arterial calcium gluconate. Standard burn treatments alone are insufficient.",
    difficulty: 4,
    category: "Environmental Emergencies",
    topic: "hydrofluoric acid burns"
  },
  {
    id: "para-batch-483",
    stem: "A patient with lithium toxicity presents with coarse tremor, nausea, vomiting, and confusion. His lithium level is reported as 3.0 mEq/L. What is the definitive treatment for severe lithium toxicity?",
    options: [
      "Hemodialysis",
      "Activated charcoal",
      "Whole bowel irrigation",
      "Sodium polystyrene sulfonate"
    ],
    correctIndex: 0,
    rationale: "Hemodialysis is the definitive treatment for severe lithium toxicity (levels >2.5 mEq/L with symptoms). Lithium is a small, water-soluble molecule not protein-bound, making it ideal for dialysis removal. Activated charcoal does NOT bind lithium and is ineffective. Whole bowel irrigation may help with sustained-release formulations. Sodium polystyrene sulfonate binds potassium, not lithium.",
    difficulty: 4,
    category: "Toxicology",
    topic: "lithium toxicity"
  },
  {
    id: "para-batch-484",
    stem: "A patient presents with digoxin toxicity. Which ECG finding is most characteristic?",
    options: [
      "Bidirectional ventricular tachycardia",
      "Torsades de pointes",
      "Atrial flutter with rapid ventricular response",
      "Brugada pattern"
    ],
    correctIndex: 0,
    rationale: "Bidirectional ventricular tachycardia (alternating QRS axis) is nearly pathognomonic for digoxin toxicity. Other findings include regularized atrial fibrillation, various AV blocks, and scooped ST segments (Salvador Dali mustache). Torsades de pointes is associated with QT prolongation (not digoxin). Brugada pattern is a genetic channelopathy.",
    difficulty: 5,
    category: "Toxicology",
    topic: "digoxin toxicity ECG"
  },
  {
    id: "para-batch-485",
    stem: "What is the specific antidote for digoxin toxicity?",
    options: [
      "Digoxin-specific antibody fragments (Digibind/DigiFab)",
      "Atropine",
      "Glucagon",
      "Calcium chloride"
    ],
    correctIndex: 0,
    rationale: "Digoxin-specific antibody fragments (Fab) bind free digoxin, rendering it inactive and facilitating renal excretion. They are indicated for life-threatening dysrhythmias, hyperkalemia >5.5 mEq/L, or hemodynamic instability from digoxin toxicity. Atropine may temporarily treat bradycardia but is not definitive. Calcium is actually relatively contraindicated as it may worsen toxicity.",
    difficulty: 2,
    category: "Toxicology",
    topic: "digoxin antidote"
  },
  {
    id: "para-batch-486",
    stem: "A patient who recently attempted suicide by hanging is found with a ligature mark on the neck. He is breathing but hoarse. What injury should be prioritized in assessment?",
    options: [
      "Laryngeal fracture and airway compromise",
      "Cervical spine fracture",
      "Carotid artery dissection",
      "Esophageal injury"
    ],
    correctIndex: 0,
    rationale: "In hanging/strangulation victims, airway injury including laryngeal fracture is the most immediate life-threatening concern, especially with hoarseness indicating laryngeal involvement. Cervical spine injury, carotid dissection, and esophageal injury are all possible but secondary to airway management. Progressive airway swelling can rapidly lead to complete obstruction.",
    difficulty: 3,
    category: "Psychiatric Emergencies",
    topic: "hanging injury assessment"
  },
  {
    id: "para-batch-487",
    stem: "A patient with schizophrenia is hearing command auditory hallucinations telling him to hurt himself. He appears calm but distracted. What is the paramedic's priority?",
    options: [
      "Assess for intent and plan to act on the hallucinations and ensure patient safety",
      "Attempt to convince the patient the voices aren't real",
      "Sedate the patient immediately",
      "Leave the patient alone since he appears calm"
    ],
    correctIndex: 0,
    rationale: "Command auditory hallucinations directing self-harm are a significant risk factor for violence and suicide. The paramedic should assess whether the patient intends to act on the commands and maintain safety. Arguing about the reality of hallucinations is counterproductive. Sedation is not automatically indicated for a calm patient. Leaving the patient alone is dangerous given command hallucinations.",
    difficulty: 2,
    category: "Psychiatric Emergencies",
    topic: "command hallucinations"
  },
  {
    id: "para-batch-488",
    stem: "A teenager presents with multiple superficial lacerations on both forearms in various stages of healing. She denies suicidal intent and states she cuts herself 'to feel something.' What is this behavior classified as?",
    options: [
      "Non-suicidal self-injury (NSSI)",
      "Suicide attempt",
      "Attention-seeking behavior requiring no intervention",
      "Accidental injury"
    ],
    correctIndex: 0,
    rationale: "Non-suicidal self-injury (NSSI) is deliberate self-harm without suicidal intent, often used as a coping mechanism for emotional distress. While it is not a suicide attempt per se, it is a significant risk factor for future suicide attempts and requires professional evaluation. Dismissing it as attention-seeking or accidental misses important clinical significance.",
    difficulty: 2,
    category: "Psychiatric Emergencies",
    topic: "non-suicidal self-injury"
  },
  {
    id: "para-batch-489",
    stem: "A patient with PTSD is triggered during ambulance transport and becomes acutely hyperaroused with flashbacks, hyperventilation, and extreme fear. What is the most appropriate intervention?",
    options: [
      "Ground the patient using sensory-based techniques and speak in calm, reassuring tones",
      "Administer anxiolytics immediately",
      "Restrain the patient for safety during transport",
      "Ignore the episode and continue transport"
    ],
    correctIndex: 0,
    rationale: "Grounding techniques help orient the patient to the present moment and break the flashback cycle. Examples include asking the patient to focus on physical sensations, name objects they can see, or hold a cold pack. Speaking calmly and acknowledging their distress helps build rapport. Medications and restraints are not first-line. Ignoring the episode can worsen trauma response.",
    difficulty: 2,
    category: "Psychiatric Emergencies",
    topic: "PTSD crisis management"
  },
  {
    id: "para-batch-490",
    stem: "A patient is found unconscious near open containers of a substance with a strong garlic-like odor. What poisoning should be suspected?",
    options: [
      "Organophosphate or arsenic poisoning",
      "Carbon monoxide poisoning",
      "Cyanide poisoning",
      "Ammonia exposure"
    ],
    correctIndex: 0,
    rationale: "A garlic-like odor is classically associated with organophosphate pesticides and arsenic. Carbon monoxide is odorless and colorless. Cyanide has a bitter almond odor (only detectable by some people). Ammonia has a pungent, distinct smell. The garlic odor combined with unconsciousness (likely from cholinergic crisis) strongly suggests organophosphate exposure.",
    difficulty: 2,
    category: "Toxicology",
    topic: "toxicology odor recognition"
  },
  {
    id: "para-batch-491",
    stem: "A patient presents with an acute dystonic reaction after starting a new antipsychotic medication. His neck is twisted to one side and his eyes are deviated upward. After treatment with diphenhydramine, what additional counseling should be provided?",
    options: [
      "Continue the prescribed diphenhydramine for 48-72 hours as dystonia can recur and follow up with prescribing physician",
      "The antipsychotic medication can be safely resumed at the same dose",
      "No further treatment is needed once symptoms resolve",
      "All antipsychotic medications are now permanently contraindicated"
    ],
    correctIndex: 0,
    rationale: "Acute dystonic reactions can recur as the anticholinergic effect of diphenhydramine wears off. Patients should continue diphenhydramine or benztropine for 48-72 hours and follow up with their prescribing physician for medication adjustment. The antipsychotic dose may need adjustment, not necessarily permanent discontinuation.",
    difficulty: 3,
    category: "Psychiatric Emergencies",
    topic: "dystonic reaction follow-up"
  },
  {
    id: "para-batch-492",
    stem: "Which of the following is an absolute contraindication for the use of activated charcoal in a poisoning case?",
    options: [
      "Ingestion of a caustic substance (acid or alkali)",
      "Ingestion occurred more than 1 hour ago",
      "Patient is mildly nauseous",
      "The ingested substance is acetaminophen"
    ],
    correctIndex: 0,
    rationale: "Activated charcoal is contraindicated after caustic ingestion because it does not adsorb caustics and it obscures endoscopic visualization needed to assess mucosal damage. Other contraindications include unprotected airway and hydrocarbons. Time beyond 1 hour reduces efficacy but isn't an absolute contraindication. Mild nausea is a relative concern. Activated charcoal can adsorb acetaminophen.",
    difficulty: 2,
    category: "Toxicology",
    topic: "activated charcoal contraindications"
  },
  {
    id: "para-batch-493",
    stem: "A child accidentally ingests a handful of gummy vitamins containing iron. The mother calls EMS. The child is asymptomatic. What is the most appropriate response?",
    options: [
      "Transport to the ED for evaluation as iron toxicity can have a delayed presentation",
      "Reassure the mother that gummy vitamins are safe in any quantity",
      "Induce vomiting at home",
      "Administer activated charcoal"
    ],
    correctIndex: 0,
    rationale: "Iron toxicity has a deceptive clinical course with an initial GI phase followed by a deceptive quiescent phase where symptoms improve before hepatic failure develops. All potentially toxic iron ingestions require ED evaluation. The toxic dose is 20-60 mg/kg of elemental iron. Gummy vitamins may contain enough iron to be toxic. Activated charcoal does not bind iron. Home vomiting induction is not recommended.",
    difficulty: 2,
    category: "Toxicology",
    topic: "pediatric iron ingestion"
  },
  {
    id: "para-batch-494",
    stem: "A patient with severe agitation after methamphetamine use is placed in physical restraints. What complication is most life-threatening and must be continuously monitored?",
    options: [
      "Positional asphyxia and rhabdomyolysis",
      "Bruising at restraint sites",
      "Anxiety from being restrained",
      "Dehydration"
    ],
    correctIndex: 0,
    rationale: "Positional asphyxia (especially in prone positioning) and rhabdomyolysis (from extreme muscle exertion) are the most life-threatening complications in restrained patients with stimulant intoxication. Rhabdomyolysis can lead to hyperkalemia and renal failure. Continuous monitoring of airway, breathing, and circulation is essential. Bruising, anxiety, and dehydration are concerns but not immediately life-threatening.",
    difficulty: 3,
    category: "Psychiatric Emergencies",
    topic: "restraint complications"
  },
  {
    id: "para-batch-495",
    stem: "A patient with a known history of conversion disorder presents with sudden bilateral leg paralysis but has normal reflexes and no objective neurological findings. How should the paramedic manage this patient?",
    options: [
      "Treat the patient with the same care as any other neurological emergency and transport for evaluation",
      "Inform the patient the symptoms are psychogenic and not real",
      "Refuse transport since no true medical emergency exists",
      "Perform painful stimuli to prove the patient can move"
    ],
    correctIndex: 0,
    rationale: "Conversion disorder (functional neurological symptom disorder) produces real symptoms that the patient cannot voluntarily control. The paramedic should provide respectful, professional care and transport for evaluation. New neurological symptoms could represent a genuine medical emergency regardless of psychiatric history. Dismissing symptoms, refusing transport, or using painful stimuli are inappropriate and harmful.",
    difficulty: 2,
    category: "Psychiatric Emergencies",
    topic: "conversion disorder management"
  },
  {
    id: "para-batch-496",
    stem: "During a mass casualty incident involving a chemical release, patients present with lacrimation, rhinorrhea, and mild dyspnea after exposure to tear gas. What is the primary decontamination method?",
    options: [
      "Remove contaminated clothing and irrigate affected areas with large volumes of water",
      "Apply neutralizing chemicals to the skin",
      "Wipe off the agent with dry cloths only",
      "No decontamination is needed for tear gas exposure"
    ],
    correctIndex: 0,
    rationale: "Decontamination for tear gas (and most chemical agents) involves removing contaminated clothing (which removes approximately 80% of contamination) and copious water irrigation. Chemical neutralizers are generally not used in the field as they may generate heat or cause additional reactions. Dry wiping may spread the agent. All chemical exposures warrant decontamination.",
    difficulty: 1,
    category: "Environmental Emergencies",
    topic: "chemical decontamination"
  },
  {
    id: "para-batch-497",
    stem: "A patient with acute psychosis is demonstrating command hallucinations telling them to attack paramedics. The patient is armed with a knife. What is the paramedic's first priority?",
    options: [
      "Retreat to a safe distance and request law enforcement assistance",
      "Attempt verbal de-escalation while approaching the patient",
      "Rush the patient to disarm them",
      "Administer chemical restraint from close range"
    ],
    correctIndex: 0,
    rationale: "Scene safety is the absolute first priority. An armed patient with command hallucinations to attack is an immediate lethal threat. Paramedics should retreat to a safe distance, request law enforcement, and not approach until the scene is secured. Approaching for de-escalation, physical intervention, or medication administration puts the crew at unacceptable risk.",
    difficulty: 1,
    category: "Psychiatric Emergencies",
    topic: "armed psychiatric patient"
  },
  {
    id: "para-batch-498",
    stem: "A patient is found in a closed room with an industrial heater. He is unconscious with cherry-red skin discoloration. SpO2 reads 99%. What is the most likely diagnosis and why is the SpO2 misleading?",
    options: [
      "Carbon monoxide poisoning; SpO2 cannot differentiate carboxyhemoglobin from oxyhemoglobin",
      "Cyanide poisoning; SpO2 is reading methemoglobin",
      "Hydrogen sulfide poisoning; SpO2 is measuring sulfhemoglobin",
      "Normal finding; the patient is adequately oxygenated"
    ],
    correctIndex: 0,
    rationale: "Standard pulse oximetry measures light absorption at two wavelengths and cannot distinguish carboxyhemoglobin (COHb) from oxyhemoglobin, resulting in falsely normal or high SpO2 readings in CO poisoning. The cherry-red skin (though an unreliable late finding) and closed room with heater suggest CO exposure. CO-oximetry is needed for accurate assessment.",
    difficulty: 3,
    category: "Toxicology",
    topic: "CO poisoning SpO2 limitations"
  },
  {
    id: "para-batch-499",
    stem: "A patient is exposed to a vesicant (blister agent) during a hazmat incident. Symptoms typically have what characteristic onset pattern?",
    options: [
      "Delayed onset of 2-24 hours after exposure before blistering appears",
      "Immediate blistering upon contact",
      "Symptoms appear within 1-2 minutes",
      "Blistering only occurs after 1 week"
    ],
    correctIndex: 0,
    rationale: "Vesicant agents (mustard gas/sulfur mustard) characteristically have a delayed onset of 2-24 hours. Exposure may be unrecognized initially because there is no immediate pain or visible damage. Blistering, erythema, and mucous membrane damage develop hours later. This delayed presentation complicates decontamination and treatment because damage occurs before symptoms appear.",
    difficulty: 3,
    category: "Environmental Emergencies",
    topic: "vesicant agent exposure"
  },
  {
    id: "para-batch-500",
    stem: "A patient with severe hypothermia (core temperature 25°C) has a very slow heart rate and a barely palpable pulse. The ECG shows what characteristic wave?",
    options: [
      "Osborn wave (J wave) — a positive deflection at the J-point",
      "Delta wave indicating Wolff-Parkinson-White syndrome",
      "U wave indicating hypokalemia",
      "Epsilon wave indicating ARVC"
    ],
    correctIndex: 0,
    rationale: "The Osborn wave (J wave) is a characteristic ECG finding in hypothermia — a positive deflection occurring at the junction of the QRS complex and ST segment (J-point). Its amplitude generally correlates with the degree of hypothermia. Delta waves are seen in WPW syndrome. U waves suggest hypokalemia. Epsilon waves are found in arrhythmogenic right ventricular cardiomyopathy.",
    difficulty: 4,
    category: "Environmental Emergencies",
    topic: "hypothermia ECG findings"
  }
];
