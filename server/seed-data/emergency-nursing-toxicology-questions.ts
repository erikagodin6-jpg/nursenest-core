export const toxicologyQuestions = [
  {
    id: "en-tox-001",
    stem: "A 22-year-old female presents to the ED after intentionally ingesting an unknown quantity of acetaminophen approximately 4 hours ago. She is alert and oriented, with mild nausea but no vomiting. Vital signs: BP 118/72, HR 88, RR 16, SpO2 99% on room air. Initial labs show AST 42 U/L, ALT 38 U/L, and a serum acetaminophen level of 180 mcg/mL. Using the Rumack-Matthew nomogram, which action should the emergency nurse prioritize?",
    options: [
      "Initiate N-acetylcysteine (NAC) infusion immediately based on the nomogram level",
      "Administer activated charcoal and reassess in 4 hours",
      "Obtain a repeat acetaminophen level in 2 hours before deciding on treatment",
      "Monitor liver function tests every 6 hours without initiating NAC"
    ],
    correctAnswer: 0,
    rationaleLong: "At a 4-hour post-ingestion serum acetaminophen level of 180 mcg/mL, the Rumack-Matthew nomogram clearly places this patient above the treatment line, indicating a high risk for hepatotoxicity. The Rumack-Matthew nomogram is the gold standard for determining the need for N-acetylcysteine (NAC) treatment following acute acetaminophen ingestion. The treatment line begins at 150 mcg/mL at 4 hours post-ingestion, meaning this patient's level of 180 mcg/mL exceeds the threshold. NAC works as a hepatoprotective agent by replenishing glutathione stores, acting as a glutathione substitute, and enhancing sulfate conjugation of acetaminophen. The efficacy of NAC is highest when administered within 8 hours of ingestion, making timely initiation critical. While activated charcoal can be considered if the patient presents within 1-2 hours of ingestion, at 4 hours post-ingestion its benefit is significantly diminished. Waiting for repeat levels would delay potentially life-saving treatment. Monitoring alone would be negligent given the clearly elevated level above the treatment threshold. The standard NAC protocol includes a loading dose of 150 mg/kg IV over 60 minutes, followed by 50 mg/kg over 4 hours, then 100 mg/kg over 16 hours for the 21-hour IV protocol.",
    learningObjective: "Apply the Rumack-Matthew nomogram to determine NAC treatment threshold for acute acetaminophen ingestion",
    blueprintCategory: "Toxicology",
    subtopic: "Acetaminophen Overdose and NAC Protocol",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Students often confuse the timing of the acetaminophen level draw with the nomogram interpretation; the level must be drawn at or after 4 hours post-ingestion to be clinically meaningful",
    clinicalPearls: ["The Rumack-Matthew nomogram treatment line starts at 150 mcg/mL at 4 hours post-ingestion", "NAC is most effective when started within 8 hours of acetaminophen ingestion", "The 21-hour IV NAC protocol uses three sequential infusion rates", "Normal liver enzymes at presentation do not rule out impending hepatotoxicity"],
    safetyNote: "Never delay NAC initiation to wait for repeat levels when the initial level is above the treatment line on the nomogram",
    distractorRationales: [
      "Activated charcoal has minimal benefit beyond 2 hours post-ingestion and should not delay NAC",
      "Waiting for repeat levels wastes critical treatment time when the initial level is clearly above threshold",
      "Monitoring alone is inappropriate when the acetaminophen level exceeds the nomogram treatment line"
    ],
    lessonLink: "/emergency/lessons/acetaminophen-overdose"
  },
  {
    id: "en-tox-002",
    stem: "A 35-year-old male is brought to the ED by EMS after being found unresponsive in a park. Vital signs: BP 90/60, HR 52, RR 6, SpO2 82% on room air, temperature 35.8°C. Physical exam reveals pinpoint pupils, decreased bowel sounds, and cool clammy skin. EMS administered 2 mg intranasal naloxone en route with minimal response. The emergency nurse should anticipate which priority intervention?",
    options: [
      "Prepare for endotracheal intubation due to persistent respiratory depression",
      "Administer an additional 2 mg intranasal naloxone and wait 5 minutes",
      "Apply supplemental oxygen via non-rebreather mask and monitor",
      "Obtain a urine drug screen before initiating further treatment"
    ],
    correctAnswer: 0,
    rationaleLong: "This patient presents with classic opioid toxidrome: respiratory depression (RR 6), miosis (pinpoint pupils), CNS depression (unresponsive), bradycardia, and hypotension. Despite receiving 2 mg intranasal naloxone with minimal response, the patient continues to have severe respiratory depression with SpO2 of 82%. This suggests either a massive opioid ingestion, involvement of a highly potent synthetic opioid such as fentanyl or carfentanil, or co-ingestion of other respiratory depressants. The immediate priority is airway management and ventilation. With persistent respiratory depression despite naloxone, the nurse must prepare for endotracheal intubation to secure the airway and provide adequate ventilation. While additional naloxone doses can be given, the critical intervention is airway protection. The respiratory rate of 6 and oxygen saturation of 82% indicate imminent respiratory failure. Bag-valve-mask ventilation should be initiated immediately while preparing for intubation. Simply applying supplemental oxygen without addressing the severely depressed respiratory drive is inadequate. A urine drug screen, while useful for diagnosis confirmation, should never delay life-saving airway interventions. The emergence of fentanyl and its analogs has made traditional naloxone dosing sometimes insufficient, requiring higher and repeated doses, but airway management remains the cornerstone of treatment for severe opioid toxicity.",
    learningObjective: "Prioritize airway management in opioid overdose patients who fail to respond adequately to naloxone",
    blueprintCategory: "Toxicology",
    subtopic: "Opioid Overdose and Naloxone",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Do not assume naloxone will always reverse opioid effects; synthetic opioids may require higher doses and airway management remains the priority",
    clinicalPearls: ["The classic opioid toxidrome includes miosis, respiratory depression, and CNS depression", "Fentanyl and its analogs may require larger naloxone doses than traditional opioids", "Airway management is the cornerstone of opioid overdose treatment regardless of naloxone response", "Naloxone duration of action (30-90 min) is shorter than most opioids, requiring monitoring for re-narcotization"],
    safetyNote: "Always secure the airway first in patients with severe respiratory depression regardless of anticipated naloxone response",
    distractorRationales: [
      "Additional intranasal naloxone may help but does not address the immediate need for airway protection",
      "Supplemental oxygen alone cannot overcome the severely depressed respiratory drive",
      "Diagnostic testing should never delay life-saving interventions"
    ],
    lessonLink: "/emergency/lessons/opioid-overdose"
  },
  {
    id: "en-tox-003",
    stem: "A 19-year-old college student presents to the ED with tachycardia, hypertension, agitation, diaphoresis, and mydriasis after attending a party. Temperature is 39.2°C. Friends report the patient took 'molly' approximately 3 hours ago. Which toxidrome does this clinical presentation most closely represent?",
    options: [
      "Sympathomimetic toxidrome",
      "Anticholinergic toxidrome",
      "Cholinergic toxidrome",
      "Sedative-hypnotic toxidrome"
    ],
    correctAnswer: 0,
    rationaleLong: "This patient presents with a classic sympathomimetic toxidrome following ingestion of MDMA (ecstasy/'molly'). The sympathomimetic toxidrome is characterized by the clinical findings of tachycardia, hypertension, hyperthermia, agitation, diaphoresis (sweating), and mydriasis (dilated pupils). MDMA acts primarily by causing the release of serotonin, norepinephrine, and dopamine from presynaptic neurons, producing both sympathomimetic and serotonergic effects. The key distinguishing feature between sympathomimetic and anticholinergic toxidromes is the presence of diaphoresis. Sympathomimetic toxidrome causes wet skin (diaphoresis) due to sympathetic activation of eccrine sweat glands, while anticholinergic toxidrome causes dry skin due to blockade of muscarinic receptors on sweat glands. The mnemonic 'hot as a hare, blind as a bat, dry as a bone, red as a beet, mad as a hatter' describes anticholinergic toxidrome with its characteristic dry skin. Cholinergic toxidrome presents with the SLUDGE/BBB mnemonic: Salivation, Lacrimation, Urination, Defecation, GI distress, Emesis / Bradycardia, Bronchospasm, Bronchorrhea. Sedative-hypnotic toxidrome presents with CNS depression, decreased vital signs, and slurred speech, which is opposite to this presentation.",
    learningObjective: "Differentiate sympathomimetic toxidrome from other toxidromes based on clinical findings",
    blueprintCategory: "Toxicology",
    subtopic: "Sympathomimetic Toxidrome",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "The critical differentiator between sympathomimetic and anticholinergic toxidromes is diaphoresis (wet skin) vs dry skin; both share tachycardia, hypertension, and mydriasis",
    clinicalPearls: ["Sympathomimetic toxidrome: tachycardia, hypertension, hyperthermia, mydriasis, diaphoresis, agitation", "Anticholinergic differs from sympathomimetic by dry skin, urinary retention, and absent bowel sounds", "MDMA produces both sympathomimetic and serotonergic effects", "Hyperthermia in MDMA toxicity can be life-threatening and requires aggressive cooling"],
    safetyNote: "Hyperthermia above 40°C in sympathomimetic toxicity is a life-threatening emergency requiring immediate aggressive cooling",
    distractorRationales: [
      "Anticholinergic toxidrome features dry skin, not diaphoresis; this is the key differentiator",
      "Cholinergic toxidrome presents with SLUDGE symptoms including bradycardia, not tachycardia",
      "Sedative-hypnotic toxidrome causes CNS and vital sign depression, opposite to this presentation"
    ],
    lessonLink: "/emergency/lessons/sympathomimetic-toxidrome"
  },
  {
    id: "en-tox-004",
    stem: "A 45-year-old female with a history of bipolar disorder presents to the ED with confusion, coarse tremor, ataxia, and hyperreflexia. Family reports she takes lithium and recently started a new medication. Serum lithium level is 3.2 mEq/L (therapeutic range 0.6-1.2 mEq/L). Which medication most likely precipitated the lithium toxicity?",
    options: [
      "Hydrochlorothiazide started 1 week ago for hypertension",
      "Acetaminophen started 3 days ago for headache",
      "Multivitamin supplement started 2 weeks ago",
      "Omeprazole started 1 week ago for gastric reflux"
    ],
    correctAnswer: 0,
    rationaleLong: "Hydrochlorothiazide, a thiazide diuretic, is one of the most common medications that precipitate lithium toxicity. Lithium is almost entirely eliminated by the kidneys and is handled similarly to sodium in the proximal tubule. Thiazide diuretics cause sodium and water depletion, leading to compensatory increased sodium and lithium reabsorption in the proximal tubule, resulting in elevated lithium levels. This patient's serum lithium level of 3.2 mEq/L is significantly above the therapeutic range and consistent with moderate to severe lithium toxicity. The clinical presentation of confusion, coarse tremor, ataxia, and hyperreflexia represents neurological toxicity. Other medications known to increase lithium levels include ACE inhibitors, ARBs, NSAIDs, and certain antibiotics such as metronidazole and tetracyclines. The management of lithium toxicity focuses on aggressive IV normal saline hydration to promote renal lithium clearance, with hemodialysis considered for severe cases (levels above 4.0 mEq/L, significant neurological symptoms, or renal impairment). Acetaminophen, multivitamins, and omeprazole do not significantly affect lithium metabolism or renal handling, making them unlikely culprits for precipitating lithium toxicity.",
    learningObjective: "Identify medications that commonly precipitate lithium toxicity through drug-drug interactions",
    blueprintCategory: "Toxicology",
    subtopic: "Serotonin Syndrome",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Remember that any medication affecting sodium handling or renal function can alter lithium levels; thiazides, NSAIDs, and ACE inhibitors are the most common offenders",
    clinicalPearls: ["Thiazide diuretics increase lithium reabsorption by depleting sodium", "Lithium therapeutic range is narrow: 0.6-1.2 mEq/L", "NSAIDs, ACE inhibitors, and ARBs also increase lithium levels", "Hemodialysis is indicated for lithium levels above 4.0 mEq/L or severe neurological symptoms"],
    safetyNote: "Always check for drug interactions when patients on lithium therapy present with new medications, especially diuretics and NSAIDs",
    distractorRationales: [
      "Acetaminophen does not affect lithium metabolism or renal handling",
      "Multivitamin supplements do not interact with lithium excretion pathways",
      "Omeprazole does not significantly alter lithium pharmacokinetics"
    ],
    lessonLink: "/emergency/lessons/serotonin-syndrome"
  },
  {
    id: "en-tox-005",
    stem: "A 3-year-old child is brought to the ED by a parent who found the child playing with an open bottle of iron supplements. The parent estimates the child may have ingested approximately 10 tablets of ferrous sulfate 325 mg. The child is currently vomiting and has bloody diarrhea. Which initial assessment finding would most concern the emergency nurse?",
    options: [
      "Metabolic acidosis with an anion gap of 22 mEq/L on arterial blood gas",
      "White blood cell count of 14,000/mm3",
      "Serum iron level of 250 mcg/dL drawn 2 hours post-ingestion",
      "Mild abdominal tenderness on palpation"
    ],
    correctAnswer: 0,
    rationaleLong: "Metabolic acidosis with an elevated anion gap (22 mEq/L; normal 8-12 mEq/L) in the setting of iron ingestion indicates significant systemic iron toxicity and cellular poisoning. Iron toxicity progresses through five clinical phases. Phase 1 (0.5-6 hours) presents with GI symptoms including vomiting, diarrhea, and abdominal pain due to direct caustic effect on GI mucosa. Phase 2 (6-24 hours) is the deceptive quiescent phase where symptoms may temporarily improve. Phase 3 (12-48 hours) involves systemic toxicity with metabolic acidosis, shock, hepatotoxicity, and coagulopathy. Phase 4 (2-5 days) involves hepatic necrosis. Phase 5 (2-8 weeks) involves GI scarring and obstruction. The presence of metabolic acidosis with an anion gap indicates that the patient has progressed beyond simple GI irritation to systemic cellular toxicity. Free iron disrupts cellular oxidative phosphorylation, causes mitochondrial dysfunction, and leads to lactic acidosis. This child ingested approximately 3,250 mg total of ferrous sulfate, which contains approximately 65 mg of elemental iron per 325 mg tablet, totaling approximately 650 mg elemental iron. At an estimated weight of 15 kg for a 3-year-old, this represents approximately 43 mg/kg of elemental iron, well above the toxic threshold of 20 mg/kg. Deferoxamine chelation therapy should be initiated immediately for patients with systemic toxicity.",
    learningObjective: "Recognize signs of systemic iron toxicity in pediatric ingestion and prioritize treatment based on severity indicators",
    blueprintCategory: "Toxicology",
    subtopic: "Toxic Ingestion in Pediatrics",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "The quiescent phase of iron toxicity can falsely reassure clinicians; metabolic acidosis indicates progression to systemic toxicity regardless of symptom improvement",
    clinicalPearls: ["Iron toxicity above 20 mg/kg elemental iron is potentially toxic; above 60 mg/kg is potentially lethal", "Iron toxicity has 5 phases including a deceptive quiescent phase", "Anion gap metabolic acidosis indicates systemic iron poisoning", "Deferoxamine is the chelation agent for iron toxicity, turning urine vin rose color"],
    safetyNote: "Iron ingestion in children is a true emergency; calculate elemental iron dose per kilogram to determine toxicity risk",
    distractorRationales: [
      "Mild leukocytosis is a nonspecific finding and does not indicate the severity of iron toxicity",
      "Serum iron of 250 mcg/dL is concerning but not the most alarming finding compared to metabolic acidosis",
      "Mild abdominal tenderness is expected from GI irritation but does not indicate systemic toxicity"
    ],
    lessonLink: "/emergency/lessons/toxic-ingestion-pediatrics"
  },
  {
    id: "en-tox-006",
    stem: "An emergency nurse is caring for a 55-year-old male found unconscious in a garage with the car engine running. SpO2 reads 99% on pulse oximetry. ABG reveals PaO2 98 mmHg, carboxyhemoglobin (COHb) level of 32%. The patient is confused and complaining of headache. What is the most important nursing action?",
    options: [
      "Apply 100% oxygen via non-rebreather mask and prepare for possible hyperbaric oxygen therapy",
      "Continue monitoring with current SpO2 as the 99% reading indicates adequate oxygenation",
      "Administer albuterol nebulizer to improve ventilation",
      "Obtain a chest X-ray before initiating oxygen therapy"
    ],
    correctAnswer: 0,
    rationaleLong: "This patient presents with carbon monoxide (CO) poisoning as evidenced by the clinical scenario (enclosed space with running car engine), symptoms (confusion, headache), and critically elevated carboxyhemoglobin level of 32% (normal less than 3% in non-smokers, less than 10% in smokers). The most important nursing action is to immediately administer 100% oxygen via non-rebreather mask and begin preparation for potential hyperbaric oxygen (HBO) therapy. Carbon monoxide binds to hemoglobin with approximately 200-250 times greater affinity than oxygen, forming carboxyhemoglobin, which reduces the oxygen-carrying capacity of blood and shifts the oxyhemoglobin dissociation curve to the left. A critical teaching point is that standard pulse oximetry is unreliable in CO poisoning because it cannot differentiate between oxyhemoglobin and carboxyhemoglobin, resulting in falsely normal SpO2 readings. The SpO2 of 99% is therefore misleading and should not be relied upon for clinical decision-making. Administration of 100% FiO2 reduces the half-life of COHb from approximately 4-6 hours on room air to approximately 60-90 minutes. Hyperbaric oxygen therapy at 2.5-3 atmospheres further reduces the half-life to approximately 15-23 minutes. Indications for HBO therapy include COHb levels above 25%, neurological symptoms, cardiac involvement, pregnancy, and loss of consciousness. This patient meets criteria with a COHb of 32% and neurological symptoms.",
    learningObjective: "Recognize the limitations of pulse oximetry in carbon monoxide poisoning and initiate appropriate oxygen therapy",
    blueprintCategory: "Toxicology",
    subtopic: "Carbon Monoxide Poisoning",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Pulse oximetry gives falsely normal readings in carbon monoxide poisoning because it cannot distinguish carboxyhemoglobin from oxyhemoglobin",
    clinicalPearls: ["Pulse oximetry is unreliable in CO poisoning due to inability to differentiate COHb from O2Hb", "CO binds hemoglobin with 200-250x greater affinity than oxygen", "100% O2 reduces COHb half-life from 4-6 hours to 60-90 minutes", "HBO therapy criteria: COHb >25%, neurological symptoms, cardiac involvement, pregnancy, LOC"],
    safetyNote: "Never rely on pulse oximetry readings alone in suspected carbon monoxide exposure; always obtain co-oximetry or ABG with carboxyhemoglobin level",
    distractorRationales: [
      "Relying on the falsely normal SpO2 reading would be dangerous in CO poisoning",
      "Albuterol addresses bronchospasm, not carbon monoxide poisoning",
      "Chest X-ray should not delay immediate oxygen therapy in CO poisoning"
    ],
    lessonLink: "/emergency/lessons/carbon-monoxide-poisoning"
  },
  {
    id: "en-tox-007",
    stem: "A 28-year-old male presents to the ED with agitation, hyperthermia (40.1°C), clonus, hyperreflexia, and diaphoresis. His girlfriend reports he takes sertraline daily and ingested 'magic mushrooms' at a party 2 hours ago. Which diagnosis should the emergency nurse suspect?",
    options: [
      "Serotonin syndrome",
      "Neuroleptic malignant syndrome",
      "Malignant hyperthermia",
      "Anticholinergic toxicity"
    ],
    correctAnswer: 0,
    rationaleLong: "This patient's presentation is classic for serotonin syndrome, a potentially life-threatening condition caused by excessive serotonergic activity. The combination of sertraline (an SSRI) and psilocybin mushrooms (which act as serotonin agonists at 5-HT2A receptors) creates a dangerous synergistic serotonergic effect. The Hunter Criteria for serotonin syndrome require the presence of a serotonergic agent plus any of the following: spontaneous clonus, inducible clonus plus agitation or diaphoresis, ocular clonus plus agitation or diaphoresis, tremor plus hyperreflexia, or hypertonia plus temperature above 38°C plus ocular or inducible clonus. This patient demonstrates multiple criteria: clonus, hyperreflexia, agitation, diaphoresis, and hyperthermia in the setting of serotonergic drug use. Key differences from neuroleptic malignant syndrome (NMS) include the rapid onset (hours vs days for NMS), presence of clonus and hyperreflexia (NMS presents with 'lead pipe' rigidity and hyporeflexia), and the causative agent (serotonergic drugs vs dopamine antagonists). Malignant hyperthermia occurs with volatile anesthetic agents and succinylcholine, not recreational drugs. Anticholinergic toxicity presents with dry skin (this patient is diaphoretic), urinary retention, and absent bowel sounds. Treatment of serotonin syndrome includes discontinuation of serotonergic agents, cyproheptadine (a serotonin antagonist), benzodiazepines for agitation, and aggressive cooling.",
    learningObjective: "Diagnose serotonin syndrome using the Hunter Criteria and differentiate it from neuroleptic malignant syndrome",
    blueprintCategory: "Toxicology",
    subtopic: "Serotonin Syndrome",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Serotonin syndrome features clonus and hyperreflexia with rapid onset, while NMS features rigidity and hyporeflexia with gradual onset over days",
    clinicalPearls: ["Hunter Criteria: serotonergic agent plus clonus, hyperreflexia, agitation, diaphoresis, hyperthermia", "Serotonin syndrome has rapid onset (hours) vs NMS (days to weeks)", "Clonus is the hallmark feature distinguishing serotonin syndrome from NMS", "Treatment includes cyproheptadine, benzodiazepines, and cooling"],
    safetyNote: "Serotonin syndrome can rapidly progress to multi-organ failure; early recognition and treatment are essential",
    distractorRationales: [
      "NMS occurs with dopamine antagonists, has gradual onset, and features lead-pipe rigidity rather than clonus",
      "Malignant hyperthermia is associated with volatile anesthetics and succinylcholine, not recreational drugs",
      "Anticholinergic toxicity causes dry skin, not diaphoresis"
    ],
    lessonLink: "/emergency/lessons/serotonin-syndrome"
  },
  {
    id: "en-tox-008",
    stem: "A 62-year-old farmer presents to the ED after accidental exposure to an organophosphate insecticide. He presents with excessive salivation, lacrimation, urination, defecation, miosis, bradycardia, and muscle fasciculations. Which medication combination should the emergency nurse prepare to administer?",
    options: [
      "Atropine and pralidoxime (2-PAM)",
      "Naloxone and flumazenil",
      "Physostigmine and glycopyrrolate",
      "Epinephrine and diphenhydramine"
    ],
    correctAnswer: 0,
    rationaleLong: "This patient presents with classic cholinergic toxidrome from organophosphate exposure. Organophosphates irreversibly inhibit acetylcholinesterase, leading to accumulation of acetylcholine at muscarinic and nicotinic receptors. The SLUDGE/BBB mnemonic describes the muscarinic effects: Salivation, Lacrimation, Urination, Defecation, GI distress, Emesis / Bradycardia, Bronchospasm, Bronchorrhea. Nicotinic effects include muscle fasciculations, weakness, and eventually paralysis. The treatment requires a dual-medication approach: atropine and pralidoxime. Atropine competitively blocks the effects of excess acetylcholine at muscarinic receptors, addressing the SLUDGE symptoms and bradycardia. It is dosed aggressively in organophosphate poisoning, often requiring much higher doses than typical ACLS dosing (initial dose 2-4 mg IV, doubling every 3-5 minutes until secretions dry). The endpoint of atropine therapy is drying of bronchial secretions, not heart rate or pupil size. Pralidoxime (2-PAM) works by reactivating acetylcholinesterase before it undergoes 'aging' (permanent binding), thereby addressing both muscarinic and nicotinic effects. Pralidoxime must be given early (within 24-48 hours) before aging occurs, as the enzyme-inhibitor bond becomes irreversible. Naloxone and flumazenil are antidotes for opioids and benzodiazepines respectively. Physostigmine is a cholinesterase inhibitor that would worsen symptoms. Epinephrine and diphenhydramine treat anaphylaxis, not organophosphate poisoning.",
    learningObjective: "Identify the antidote regimen for organophosphate poisoning and understand the mechanism of each agent",
    blueprintCategory: "Toxicology",
    subtopic: "Organophosphate Exposure",
    difficulty: 2,
    cognitiveLevel: "recall",
    questionType: "MCQ_SINGLE",
    examTrap: "The endpoint for atropine therapy in organophosphate poisoning is drying of bronchial secretions, not heart rate normalization",
    clinicalPearls: ["SLUDGE/BBB mnemonic for cholinergic toxidrome: Salivation, Lacrimation, Urination, Defecation, GI distress, Emesis, Bradycardia, Bronchospasm, Bronchorrhea", "Atropine blocks muscarinic effects; pralidoxime reactivates acetylcholinesterase", "Pralidoxime must be given before aging occurs (within 24-48 hours)", "Atropine endpoint is drying of secretions, not pupil dilation or heart rate"],
    safetyNote: "Healthcare workers must use appropriate PPE including nitrile gloves when caring for organophosphate-exposed patients to prevent secondary contamination",
    distractorRationales: [
      "Naloxone and flumazenil are antidotes for opioids and benzodiazepines, not cholinergic agents",
      "Physostigmine is a cholinesterase inhibitor that would paradoxically worsen organophosphate poisoning",
      "Epinephrine and diphenhydramine treat anaphylaxis, not organophosphate poisoning"
    ],
    lessonLink: "/emergency/lessons/organophosphate-exposure"
  },
  {
    id: "en-tox-009",
    stem: "A 30-year-old male presents to the ED with dry mouth, urinary retention, absent bowel sounds, tachycardia (HR 130), mydriasis, flushed skin, and altered mental status with visual hallucinations. His roommate found empty diphenhydramine blister packs in his room. The emergency nurse recognizes this as which toxidrome?",
    options: [
      "Anticholinergic toxidrome",
      "Sympathomimetic toxidrome",
      "Cholinergic toxidrome",
      "Opioid toxidrome"
    ],
    correctAnswer: 0,
    rationaleLong: "This patient presents with classic anticholinergic toxidrome following diphenhydramine (Benadryl) overdose. The anticholinergic toxidrome is remembered by the classic mnemonic: 'hot as a hare' (hyperthermia), 'blind as a bat' (mydriasis with cycloplegia), 'dry as a bone' (dry mucous membranes and skin, urinary retention), 'red as a beet' (flushed skin from peripheral vasodilation), 'mad as a hatter' (altered mental status, agitation, hallucinations), and 'full as a flask' (urinary retention). Additional features include tachycardia, decreased bowel sounds or ileus, and in severe cases, seizures. The key differentiator between anticholinergic and sympathomimetic toxidromes is the skin condition: anticholinergic causes dry, flushed skin with absent diaphoresis, while sympathomimetic causes diaphoresis (wet skin). Both share tachycardia, hypertension, mydriasis, and agitation, making skin assessment critical for differentiation. Treatment of anticholinergic toxicity includes benzodiazepines for seizures and agitation, and in severe cases, physostigmine (a reversible cholinesterase inhibitor that crosses the blood-brain barrier) under careful monitoring. Diphenhydramine overdose can also cause QRS widening and sodium channel blockade similar to tricyclic antidepressant toxicity, requiring monitoring with continuous cardiac telemetry and potentially sodium bicarbonate for QRS prolongation.",
    learningObjective: "Identify the anticholinergic toxidrome and differentiate it from sympathomimetic toxidrome based on key clinical features",
    blueprintCategory: "Toxicology",
    subtopic: "Anticholinergic Toxidrome",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Dry skin is the critical feature distinguishing anticholinergic from sympathomimetic toxidrome; both share tachycardia and mydriasis",
    clinicalPearls: ["Anticholinergic mnemonic: hot, blind, dry, red, mad, full", "Dry skin differentiates anticholinergic from sympathomimetic toxidrome", "Physostigmine is the specific antidote for severe anticholinergic toxicity", "Diphenhydramine can cause sodium channel blockade and QRS widening in overdose"],
    safetyNote: "Monitor for QRS widening in diphenhydramine overdose as it can cause sodium channel blockade similar to tricyclic antidepressants",
    distractorRationales: [
      "Sympathomimetic toxidrome causes diaphoresis (wet skin), not dry skin",
      "Cholinergic toxidrome presents with SLUDGE symptoms including miosis and bradycardia",
      "Opioid toxidrome features miosis, respiratory depression, and CNS depression"
    ],
    lessonLink: "/emergency/lessons/anticholinergic-toxidrome"
  },
  {
    id: "en-tox-010",
    stem: "A 48-year-old chronic alcoholic presents to the ED with tremors, diaphoresis, tachycardia, hypertension, and visual hallucinations. He reports his last drink was approximately 72 hours ago. His CIWA-Ar score is 28. What is the priority nursing intervention?",
    options: [
      "Administer IV benzodiazepines using a symptom-triggered protocol based on CIWA-Ar scoring",
      "Apply physical restraints to prevent self-harm from hallucinations",
      "Administer IV normal saline bolus and thiamine before any sedation",
      "Obtain a CT scan of the head to rule out intracranial pathology"
    ],
    correctAnswer: 0,
    rationaleLong: "This patient presents with severe alcohol withdrawal with a CIWA-Ar (Clinical Institute Withdrawal Assessment for Alcohol-Revised) score of 28, indicating severe withdrawal that requires aggressive pharmacological intervention. The CIWA-Ar scale ranges from 0-67, with scores above 20 indicating severe withdrawal requiring treatment. The timeline of 72 hours post-last drink is consistent with the development of delirium tremens (DTs), the most severe and potentially fatal manifestation of alcohol withdrawal. Benzodiazepines are the gold standard treatment for alcohol withdrawal and are dosed using a symptom-triggered protocol based on serial CIWA-Ar assessments. Symptom-triggered dosing has been shown to result in less total medication use, shorter treatment duration, and fewer complications compared to fixed-schedule dosing. Commonly used benzodiazepines include lorazepam (preferred in liver disease due to no hepatic metabolism), diazepam (longer acting, provides smoother withdrawal), and chlordiazepoxide (oral, for mild-moderate withdrawal). While thiamine supplementation is important to prevent Wernicke encephalopathy and should be given before glucose administration, it should not delay treatment of severe withdrawal symptoms. Physical restraints should be avoided as they can worsen agitation and increase risk of rhabdomyolysis. A CT scan may be indicated but should not delay treatment of the immediately life-threatening withdrawal syndrome. Untreated DTs carries a mortality rate of 15-40%, making rapid benzodiazepine administration the priority.",
    learningObjective: "Manage severe alcohol withdrawal using CIWA-Ar scoring and symptom-triggered benzodiazepine protocol",
    blueprintCategory: "Toxicology",
    subtopic: "Alcohol Withdrawal and DTs",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "CIWA-Ar scores above 20 indicate severe withdrawal requiring treatment; symptom-triggered dosing is superior to fixed-schedule dosing",
    clinicalPearls: ["CIWA-Ar score above 20 indicates severe alcohol withdrawal requiring pharmacological treatment", "Delirium tremens typically occurs 48-96 hours after last drink", "Symptom-triggered benzodiazepine dosing reduces total medication use and treatment duration", "Untreated DTs mortality is 15-40%; with treatment it drops to less than 5%"],
    safetyNote: "Always administer thiamine before glucose in alcoholic patients to prevent precipitating Wernicke encephalopathy",
    distractorRationales: [
      "Physical restraints increase risk of rhabdomyolysis and worsen agitation in alcohol withdrawal",
      "Thiamine is important but should not delay treatment of severe withdrawal with CIWA-Ar of 28",
      "CT scan may be indicated but should not delay treatment of life-threatening withdrawal"
    ],
    lessonLink: "/emergency/lessons/alcohol-withdrawal"
  },
  {
    id: "en-tox-011",
    stem: "A 16-year-old female is brought to the ED by her parents after intentionally ingesting 30 tablets of aspirin (325 mg each) approximately 2 hours ago. She complains of tinnitus, nausea, and vomiting. ABG shows pH 7.48, PaCO2 28 mmHg. Serum salicylate level is 55 mg/dL. Which intervention should the emergency nurse prepare for?",
    options: [
      "Administer IV sodium bicarbonate to achieve urinary alkalinization and prepare for possible hemodialysis",
      "Administer activated charcoal and monitor serial salicylate levels only",
      "Initiate N-acetylcysteine protocol as for acetaminophen overdose",
      "Provide antiemetics and observe for 6 hours before discharge"
    ],
    correctAnswer: 0,
    rationaleLong: "This patient has significant salicylate poisoning with a level of 55 mg/dL (therapeutic range 15-30 mg/dL), which places her in the moderate-to-severe toxicity range. Salicylate poisoning produces a characteristic acid-base pattern: initial respiratory alkalosis from direct stimulation of the medullary respiratory center, followed by metabolic acidosis from uncoupling of oxidative phosphorylation, accumulation of organic acids, and impaired renal function. This patient's ABG shows the early phase with respiratory alkalosis (pH 7.48, PaCO2 28). The primary treatment for significant salicylate poisoning is IV sodium bicarbonate infusion to alkalinize both the serum and urine. Serum alkalinization keeps salicylate in its ionized form, preventing CNS penetration (ion trapping). Urinary alkalinization with a target urine pH of 7.5-8.0 increases renal elimination of salicylate by trapping it in the renal tubules. Indications for hemodialysis include salicylate levels above 100 mg/dL (acute), levels above 60 mg/dL with clinical deterioration, renal failure, cerebral edema, or refractory acidosis. At 55 mg/dL with ongoing symptoms, close monitoring and preparation for hemodialysis is appropriate. N-acetylcysteine is the antidote for acetaminophen, not salicylate poisoning. Simple observation would be inappropriate given the significant toxicity level.",
    learningObjective: "Implement urinary alkalinization with sodium bicarbonate for salicylate poisoning and identify indications for hemodialysis",
    blueprintCategory: "Toxicology",
    subtopic: "Toxicology Screening and Antidote Protocols",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Salicylate poisoning initially causes respiratory alkalosis followed by metabolic acidosis; do not interpret the early alkalosis as a benign finding",
    clinicalPearls: ["Salicylate initially causes respiratory alkalosis then metabolic acidosis", "Sodium bicarbonate alkalinizes serum and urine to enhance salicylate elimination", "Target urine pH 7.5-8.0 for effective urinary alkalinization", "Hemodialysis indicated for levels above 100 mg/dL or refractory symptoms"],
    safetyNote: "Serial salicylate levels are essential as levels can continue to rise from delayed absorption, especially with enteric-coated preparations",
    distractorRationales: [
      "Activated charcoal alone is insufficient for moderate-severe salicylate toxicity requiring alkalinization",
      "NAC is the antidote for acetaminophen, not salicylate poisoning",
      "Observation alone is inappropriate for salicylate levels in the toxic range with symptoms"
    ],
    lessonLink: "/emergency/lessons/toxicology-screening-antidotes"
  },
  {
    id: "en-tox-012",
    stem: "A 40-year-old male psychiatric patient presents to the ED with severe muscle rigidity described as 'lead-pipe', hyperthermia (41°C), altered mental status, and autonomic instability. His medications include haloperidol, which was recently increased in dose. Lab work shows CPK 15,000 U/L. Which condition does the emergency nurse recognize?",
    options: [
      "Neuroleptic malignant syndrome (NMS)",
      "Serotonin syndrome",
      "Malignant hyperthermia",
      "Thyroid storm"
    ],
    correctAnswer: 0,
    rationaleLong: "This patient presents with neuroleptic malignant syndrome (NMS), a rare but life-threatening reaction to dopamine antagonist medications, particularly typical antipsychotics like haloperidol. NMS is characterized by the tetrad of hyperthermia, severe muscle rigidity ('lead-pipe' rigidity), altered mental status, and autonomic instability (tachycardia, labile blood pressure, diaphoresis). The elevated CPK of 15,000 U/L reflects significant rhabdomyolysis from sustained muscle rigidity. NMS typically develops days to weeks after starting or increasing the dose of a dopamine antagonist, distinguishing it from serotonin syndrome which has a rapid onset within hours. Key differentiating features from serotonin syndrome include: lead-pipe rigidity (vs clonus and hyperreflexia in serotonin syndrome), slow onset over days (vs hours for serotonin syndrome), and causation by dopamine antagonists (vs serotonergic agents). Malignant hyperthermia is triggered by volatile anesthetic agents and succinylcholine during general anesthesia, not by antipsychotic medications. Thyroid storm may present with hyperthermia and autonomic instability but does not cause lead-pipe rigidity and is not associated with antipsychotic use. Treatment of NMS includes immediate discontinuation of the offending agent, aggressive cooling, IV fluids for rhabdomyolysis, dantrolene for muscle rigidity, and bromocriptine or amantadine to restore dopaminergic activity.",
    learningObjective: "Recognize neuroleptic malignant syndrome and differentiate it from serotonin syndrome based on clinical features and onset pattern",
    blueprintCategory: "Toxicology",
    subtopic: "Neuroleptic Malignant Syndrome",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "NMS has lead-pipe rigidity with slow onset over days, while serotonin syndrome has clonus/hyperreflexia with rapid onset over hours",
    clinicalPearls: ["NMS tetrad: hyperthermia, rigidity, altered mental status, autonomic instability", "NMS develops over days to weeks after starting or increasing dopamine antagonists", "Elevated CPK indicates rhabdomyolysis from muscle rigidity", "Treatment: stop offending agent, dantrolene, bromocriptine, aggressive cooling and hydration"],
    safetyNote: "NMS mortality is 10-20% even with treatment; early recognition and aggressive management are critical",
    distractorRationales: [
      "Serotonin syndrome has rapid onset with clonus and hyperreflexia rather than lead-pipe rigidity",
      "Malignant hyperthermia occurs with anesthetic agents, not antipsychotics",
      "Thyroid storm does not cause lead-pipe rigidity and is not related to antipsychotic use"
    ],
    lessonLink: "/emergency/lessons/neuroleptic-malignant-syndrome"
  },
  {
    id: "en-tox-013",
    stem: "A 25-year-old female presents to the ED after ingesting an unknown quantity of her grandmother's digoxin tablets. ECG shows atrial tachycardia with 2:1 AV block. Serum potassium is 6.2 mEq/L. Which antidote should the emergency nurse prepare?",
    options: [
      "Digoxin-specific antibody fragments (Digibind/DigiFab)",
      "Calcium gluconate for hyperkalemia management",
      "Atropine for the AV block",
      "Amiodarone for the atrial tachycardia"
    ],
    correctAnswer: 0,
    rationaleLong: "This patient presents with acute digoxin toxicity evidenced by the combination of cardiac dysrhythmias (atrial tachycardia with AV block, a classic digoxin toxicity rhythm) and hyperkalemia. Digoxin toxicity causes hyperkalemia by inhibiting the Na+/K+-ATPase pump, leading to extracellular potassium accumulation. The definitive treatment for severe digoxin toxicity is digoxin-specific antibody fragments (Digibind or DigiFab), which bind free digoxin and prevent its pharmacological activity. Indications for Digibind include life-threatening dysrhythmias, hyperkalemia above 5.5 mEq/L secondary to digoxin toxicity, ingestion of more than 10 mg in adults or 4 mg in children, and serum digoxin levels above 15 ng/mL at any time or above 10 ng/mL at 6 hours post-ingestion. Critically, calcium administration is relatively contraindicated in digoxin toxicity-related hyperkalemia because calcium can potentiate the toxic effects of digoxin on cardiac myocytes, potentially causing 'stone heart' (cardiac arrest in systole). While atropine may temporarily improve AV block, it does not address the underlying toxicity. Antiarrhythmics like amiodarone may paradoxically worsen digoxin-toxic rhythms. The classic teaching about digoxin toxicity ECG findings includes the combination of increased automaticity (atrial tachycardia, ventricular ectopy) with decreased conduction (AV block), creating patterns like 'atrial tachycardia with block' or bidirectional ventricular tachycardia.",
    learningObjective: "Identify indications for digoxin-specific antibodies and understand why calcium is contraindicated in digoxin-related hyperkalemia",
    blueprintCategory: "Toxicology",
    subtopic: "Toxicology Screening and Antidote Protocols",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Calcium is relatively contraindicated for hyperkalemia caused by digoxin toxicity due to risk of cardiac arrest in systole",
    clinicalPearls: ["Digoxin toxicity classically produces increased automaticity with decreased conduction", "Hyperkalemia in digoxin toxicity results from Na+/K+-ATPase pump inhibition", "Calcium is contraindicated for digoxin-related hyperkalemia", "Digibind indications: life-threatening dysrhythmias, K+ >5.5, ingestion >10mg in adults"],
    safetyNote: "Never administer IV calcium for hyperkalemia in the setting of digoxin toxicity; this can precipitate cardiac arrest",
    distractorRationales: [
      "Calcium gluconate is contraindicated in digoxin-related hyperkalemia due to risk of stone heart",
      "Atropine may temporarily improve AV block but does not treat the underlying digoxin toxicity",
      "Amiodarone may worsen digoxin-toxic dysrhythmias"
    ],
    lessonLink: "/emergency/lessons/toxicology-screening-antidotes"
  },
  {
    id: "en-tox-014",
    stem: "A hazmat team brings a patient to the ED who was exposed to a chemical agent at a factory. The patient presents with copious secretions, pinpoint pupils, bradycardia, muscle fasciculations, and respiratory distress. Decontamination has been performed. After stabilizing the airway, which medication dose titration endpoint should the nurse use for atropine administration?",
    options: [
      "Drying of bronchial secretions and improved respiratory effort",
      "Heart rate above 100 beats per minute",
      "Pupil dilation to midpoint",
      "Resolution of muscle fasciculations"
    ],
    correctAnswer: 0,
    rationaleLong: "In organophosphate or nerve agent exposure causing cholinergic crisis, atropine is dosed aggressively to counteract the muscarinic effects of acetylcholine excess. The critical and correct endpoint for atropine titration is the drying of bronchial secretions, which directly addresses the most life-threatening aspect of cholinergic poisoning: bronchorrhea and bronchospasm leading to respiratory failure. Patients with organophosphate poisoning may require massive doses of atropine (sometimes hundreds of milligrams over 24 hours), far exceeding standard cardiac dosing. The initial dose is typically 2-4 mg IV, doubled every 3-5 minutes until secretions clear. Using heart rate as an endpoint is incorrect because tachycardia may develop well before secretions are adequately controlled, and patients may have underlying factors affecting heart rate. Pupil dilation is unreliable as an endpoint because direct ocular exposure may cause miosis regardless of systemic atropinization, and pupil response varies significantly between patients. Muscle fasciculations are a nicotinic effect of acetylcholine excess at the neuromuscular junction; atropine only blocks muscarinic receptors and does not directly address nicotinic symptoms. Pralidoxime is needed to address the nicotinic effects through reactivation of acetylcholinesterase.",
    learningObjective: "Determine the correct clinical endpoint for atropine titration in organophosphate/nerve agent poisoning",
    blueprintCategory: "Toxicology",
    subtopic: "Organophosphate Exposure",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Do not use heart rate or pupil size as the endpoint for atropine in organophosphate poisoning; use drying of bronchial secretions",
    clinicalPearls: ["Atropine endpoint: drying of bronchial secretions, not heart rate or pupils", "Initial atropine dose 2-4 mg IV, doubled every 3-5 minutes", "Patients may require hundreds of milligrams of atropine over 24 hours", "Atropine blocks muscarinic effects only; pralidoxime addresses nicotinic effects"],
    safetyNote: "Do not under-dose atropine in organophosphate poisoning; death from bronchorrhea and respiratory failure is more likely than harm from atropine",
    distractorRationales: [
      "Heart rate is unreliable as tachycardia may occur before adequate secretion control",
      "Pupil dilation is unreliable due to variability and potential direct ocular exposure",
      "Fasciculations are nicotinic effects not directly addressed by atropine"
    ],
    lessonLink: "/emergency/lessons/organophosphate-exposure"
  },
  {
    id: "en-tox-015",
    stem: "A 55-year-old male presents to the ED with altered mental status after being found in his apartment by neighbors who noticed a 'rotten egg' smell. First responders measured high levels of hydrogen sulfide on their monitors. The patient has been decontaminated and is on 100% oxygen. He is obtunded with GCS 8. What additional treatment should the emergency nurse anticipate?",
    options: [
      "Hydroxocobalamin or nitrite-based therapy as a cyanide/sulfide antidote",
      "N-acetylcysteine infusion protocol",
      "Flumazenil for suspected benzodiazepine co-ingestion",
      "Methylene blue for suspected methemoglobinemia"
    ],
    correctAnswer: 0,
    rationaleLong: "Hydrogen sulfide (H2S) is a highly toxic gas that smells like rotten eggs at low concentrations but causes olfactory fatigue at higher levels. H2S toxicity mechanism is similar to cyanide poisoning - it inhibits cytochrome c oxidase in the mitochondrial electron transport chain, causing cellular asphyxia despite adequate oxygen delivery. This results in cellular hypoxia with a normal PaO2 but inability to utilize oxygen (histotoxic hypoxia). Treatment includes high-flow 100% oxygen (already being administered), supportive care for obtunded patients including airway management (GCS 8 warrants intubation), and consideration of antidotal therapy. Hydroxocobalamin (which is used for cyanide poisoning) has shown efficacy for H2S poisoning through a similar mechanism of binding the toxic agent. Alternatively, nitrite-based therapy (amyl nitrite or sodium nitrite) works by inducing methemoglobin formation, which has high affinity for sulfide ions, effectively sequestering them from cytochrome oxidase. Note that sodium thiosulfate (the other component of cyanide antidote kits) is not effective for H2S because the sulfide is already in the same oxidation state. NAC is the antidote for acetaminophen toxicity. Flumazenil is the antidote for benzodiazepine toxicity and would be inappropriate here. Methylene blue treats methemoglobinemia, which is a different condition from sulfide poisoning.",
    learningObjective: "Recognize hydrogen sulfide toxicity and identify appropriate antidotal therapy based on its mechanism of cellular asphyxia",
    blueprintCategory: "Toxicology",
    subtopic: "Toxicology Screening and Antidote Protocols",
    difficulty: 5,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "H2S causes olfactory fatigue at high concentrations, so absence of smell does not rule out exposure; mechanism is similar to cyanide poisoning",
    clinicalPearls: ["H2S inhibits cytochrome c oxidase similar to cyanide", "Rotten egg smell at low concentrations but olfactory fatigue at high levels", "Nitrites work by forming methemoglobin which binds sulfide ions", "Hydroxocobalamin has emerging evidence for H2S poisoning"],
    safetyNote: "Healthcare workers are at risk for secondary H2S exposure from patient clothing and skin; ensure adequate decontamination before ED entry",
    distractorRationales: [
      "NAC is for acetaminophen toxicity, not hydrogen sulfide poisoning",
      "Flumazenil is for benzodiazepine reversal and has no role in H2S toxicity",
      "Methylene blue treats methemoglobinemia; while nitrites induce methemoglobin therapeutically, the treatment is the nitrite not methylene blue"
    ],
    lessonLink: "/emergency/lessons/toxicology-screening-antidotes"
  },
  {
    id: "en-tox-016",
    stem: "A 2-year-old child presents to the ED 30 minutes after ingesting several mothballs. The parent is unsure what type of mothballs they were. The child is asymptomatic. Which assessment is most critical for the emergency nurse to perform?",
    options: [
      "Determine whether the mothballs contain naphthalene or paradichlorobenzene, as the toxicity profile differs significantly",
      "Immediately administer activated charcoal before any further assessment",
      "Obtain a stat chest X-ray to locate the mothballs",
      "Induce vomiting with syrup of ipecac"
    ],
    correctAnswer: 0,
    rationaleLong: "The critical first step in managing mothball ingestion is determining the type of mothball, as the two primary types have vastly different toxicity profiles. Naphthalene mothballs are significantly more toxic than paradichlorobenzene (PDCB) mothballs. Naphthalene ingestion can cause hemolytic anemia (particularly in patients with G6PD deficiency), methemoglobinemia, hepatotoxicity, and CNS toxicity. Paradichlorobenzene mothballs, while still requiring evaluation, generally cause only mild GI irritation and are considered much less toxic. Differentiating between the two types can be done by placing the mothball in water: naphthalene mothballs float, while PDCB mothballs sink (PDCB is denser than water). Additionally, camphor mothballs (less common) are also highly toxic and can cause seizures. In a 2-year-old, even small amounts of naphthalene can cause significant toxicity due to their lower body weight. Activated charcoal may be considered if the ingestion is within 1 hour and the substance is confirmed as naphthalene, but giving it blindly without knowing the substance type is premature. Chest X-rays cannot reliably identify mothballs. Syrup of ipecac is no longer recommended for poisoning management by the American Academy of Pediatrics and poison control guidelines due to lack of proven benefit and risk of complications.",
    learningObjective: "Distinguish between naphthalene and paradichlorobenzene mothball ingestions to guide appropriate management in pediatric patients",
    blueprintCategory: "Toxicology",
    subtopic: "Toxic Ingestion in Pediatrics",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Not all mothball ingestions are equally dangerous; naphthalene is far more toxic than paradichlorobenzene",
    clinicalPearls: ["Naphthalene mothballs float in water; PDCB mothballs sink", "Naphthalene can cause hemolytic anemia especially in G6PD-deficient patients", "Syrup of ipecac is no longer recommended for poisoning management", "G6PD deficiency screening is important in naphthalene exposure"],
    safetyNote: "Contact Poison Control immediately for all pediatric mothball ingestions; G6PD testing should be sent if naphthalene exposure is confirmed",
    distractorRationales: [
      "Activated charcoal should not be given blindly without first identifying the type of mothball",
      "Chest X-ray cannot reliably identify or locate mothballs in the GI tract",
      "Syrup of ipecac is no longer recommended by current poisoning management guidelines"
    ],
    lessonLink: "/emergency/lessons/toxic-ingestion-pediatrics"
  },
  {
    id: "en-tox-017",
    stem: "A 33-year-old male presents to the ED after a suicide attempt by ingesting ethylene glycol antifreeze approximately 3 hours ago. He appears intoxicated, has an osmolar gap of 35 mOsm/kg, and his calcium is 7.2 mg/dL. Which treatment should the emergency nurse prioritize?",
    options: [
      "Administer fomepizole (4-methylpyrazole) and prepare for hemodialysis",
      "Administer activated charcoal and observe",
      "Begin IV calcium gluconate replacement for hypocalcemia",
      "Administer sodium bicarbonate for anticipated metabolic acidosis"
    ],
    correctAnswer: 0,
    rationaleLong: "Ethylene glycol (EG) poisoning is a life-threatening toxicological emergency that requires immediate intervention with fomepizole or ethanol and potentially hemodialysis. Ethylene glycol itself is not toxic, but it is metabolized by alcohol dehydrogenase to toxic metabolites including glycolic acid (which causes the profound metabolic acidosis) and oxalic acid (which binds calcium to form calcium oxalate crystals that deposit in the kidneys, causing renal failure, and in other organs). The elevated osmolar gap of 35 (normal less than 10) indicates the presence of unmeasured osmoles from unmetabolized ethylene glycol. The hypocalcemia (7.2 mg/dL) results from calcium binding with oxalate to form calcium oxalate. Fomepizole is the preferred antidote as it competitively inhibits alcohol dehydrogenase, preventing the metabolism of ethylene glycol to its toxic metabolites. Fomepizole is given as a loading dose of 15 mg/kg IV, then 10 mg/kg every 12 hours for 4 doses. Hemodialysis effectively removes both ethylene glycol and its toxic metabolites and is indicated for serum levels above 50 mg/dL, significant metabolic acidosis, renal failure, or visual symptoms (in methanol poisoning). Activated charcoal does not effectively adsorb alcohols including ethylene glycol. While calcium replacement may be needed, it does not address the underlying toxicity and should not take priority over fomepizole.",
    learningObjective: "Manage ethylene glycol poisoning with fomepizole and identify indications for hemodialysis",
    blueprintCategory: "Toxicology",
    subtopic: "Toxicology Screening and Antidote Protocols",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Elevated osmolar gap with normal anion gap suggests early toxic alcohol ingestion before metabolism to acids; a normal osmolar gap does not rule out poisoning if sufficient time has passed",
    clinicalPearls: ["Fomepizole inhibits alcohol dehydrogenase preventing toxic metabolite formation", "Ethylene glycol causes osmolar gap early and anion gap later as it is metabolized", "Calcium oxalate crystals in urine are pathognomonic for ethylene glycol poisoning", "Hemodialysis indicated for levels above 50 mg/dL or significant acidosis/renal failure"],
    safetyNote: "Ethylene glycol and methanol poisoning require urgent treatment; delayed fomepizole allows formation of toxic metabolites that cause irreversible organ damage",
    distractorRationales: [
      "Activated charcoal does not effectively adsorb alcohols including ethylene glycol",
      "Calcium replacement addresses a symptom but not the underlying cause of toxicity",
      "Sodium bicarbonate may be used adjunctively but does not prevent toxic metabolite formation"
    ],
    lessonLink: "/emergency/lessons/toxicology-screening-antidotes"
  },
  {
    id: "en-tox-018",
    stem: "A 38-year-old female presents to the ED complaining of severe headache, nausea, and visual disturbances including 'snowfield vision' after drinking homemade liquor at a party. Her methanol level is 42 mg/dL and she has an anion gap metabolic acidosis. Which nursing assessment finding would indicate the most severe complication?",
    options: [
      "Decreased visual acuity and inability to perceive colors, indicating optic nerve damage",
      "Tachycardia of 110 beats per minute",
      "Nausea and vomiting",
      "Blood glucose of 135 mg/dL"
    ],
    correctAnswer: 0,
    rationaleLong: "Methanol poisoning is particularly dangerous because its toxic metabolite, formic acid, has specific affinity for the optic nerve and basal ganglia. Formic acid inhibits cytochrome oxidase in the mitochondria of retinal cells and optic nerve, causing optic neuritis, papilledema, and potentially permanent blindness. Visual disturbances including blurred vision, central scotomata, 'snowfield vision' (white spots in visual field), and decreased color perception are hallmark manifestations of methanol toxicity and indicate significant optic nerve damage. Visual changes represent the most severe and potentially irreversible complication of methanol poisoning. The presence of decreased visual acuity and loss of color perception suggests significant formic acid accumulation and optic nerve toxicity, which may be irreversible even with appropriate treatment. This finding also serves as an absolute indication for immediate hemodialysis regardless of methanol level. Tachycardia is a nonspecific finding and does not indicate the severity of methanol-specific toxicity. Nausea and vomiting are common early symptoms but do not indicate end-organ damage. Mild hyperglycemia is a nonspecific stress response. Treatment includes fomepizole or ethanol to block alcohol dehydrogenase, sodium bicarbonate for acidosis, folic acid (folinic acid) to enhance formic acid metabolism, and hemodialysis.",
    learningObjective: "Recognize visual disturbances as the hallmark and most severe complication of methanol poisoning indicating optic nerve damage",
    blueprintCategory: "Toxicology",
    subtopic: "Toxicology Screening and Antidote Protocols",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Visual changes in methanol poisoning indicate optic nerve damage from formic acid and are an absolute indication for hemodialysis",
    clinicalPearls: ["Methanol's toxic metabolite formic acid targets the optic nerve", "Visual symptoms are pathognomonic for methanol poisoning", "Folic acid enhances the metabolism of formic acid to non-toxic metabolites", "Visual changes are an absolute indication for hemodialysis in methanol poisoning"],
    safetyNote: "Any visual complaint in suspected methanol ingestion should be treated as a medical emergency requiring immediate fomepizole and preparation for hemodialysis",
    distractorRationales: [
      "Tachycardia is a nonspecific finding not indicative of methanol-specific end-organ damage",
      "Nausea and vomiting are early symptoms not representing the most severe complication",
      "Mild hyperglycemia is a stress response and not specific to methanol toxicity"
    ],
    lessonLink: "/emergency/lessons/toxicology-screening-antidotes"
  },
  {
    id: "en-tox-019",
    stem: "A 28-year-old male is brought to the ED after ingesting an unknown quantity of his roommate's benzodiazepines approximately 1 hour ago. He is somnolent but arousable, with RR 14, SpO2 96%, BP 110/70, HR 72. The attending physician orders flumazenil. What concern should the emergency nurse raise before administration?",
    options: [
      "Flumazenil may precipitate seizures if the patient has chronic benzodiazepine dependence or co-ingested a proconvulsant agent",
      "Flumazenil is only effective for barbiturate overdose, not benzodiazepines",
      "Flumazenil requires cardiac monitoring only during the first 5 minutes",
      "Flumazenil should not be given to patients under age 30"
    ],
    correctAnswer: 0,
    rationaleLong: "While flumazenil is a competitive benzodiazepine receptor antagonist that can reverse benzodiazepine-induced sedation, its use carries significant risks that the nurse must be aware of. The most critical concern is the potential to precipitate seizures, particularly in patients who are chronically dependent on benzodiazepines (where abrupt reversal can cause withdrawal seizures), those who have co-ingested proconvulsant agents (especially tricyclic antidepressants, which are commonly involved in polypharmacy overdoses), or those with an underlying seizure disorder. Seizures caused by flumazenil can be refractory to treatment because the benzodiazepines given to treat seizures are antagonized by the flumazenil already occupying the receptor. Additional concerns include the fact that flumazenil has a shorter duration of action (45-90 minutes) than most benzodiazepines, leading to re-sedation after the flumazenil wears off. In this scenario, the patient is hemodynamically stable with adequate vital signs, meaning supportive care and monitoring may be sufficient without the risks of flumazenil. The nurse should inquire about the patient's benzodiazepine use history, assess for signs of chronic use, and determine if co-ingestants are suspected before flumazenil administration. Flumazenil is specifically indicated for benzodiazepine reversal, not barbiturates. Continuous cardiac and neurological monitoring is required throughout treatment.",
    learningObjective: "Identify contraindications and risks of flumazenil use in benzodiazepine overdose, particularly seizure risk",
    blueprintCategory: "Toxicology",
    subtopic: "Benzodiazepine Toxicity",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Flumazenil use is often contraindicated in unknown overdose due to seizure risk; supportive care is usually sufficient for isolated benzodiazepine overdose",
    clinicalPearls: ["Flumazenil can precipitate seizures in chronic benzodiazepine users or TCA co-ingestion", "Flumazenil duration (45-90 min) is shorter than most benzodiazepines, risking re-sedation", "Flumazenil-induced seizures are refractory because benzodiazepine treatment is antagonized", "Supportive care is usually sufficient for isolated benzodiazepine overdose"],
    safetyNote: "Flumazenil should not be routinely administered in undifferentiated overdose due to seizure risk; always assess for benzodiazepine dependence and co-ingestants first",
    distractorRationales: [
      "Flumazenil is specifically a benzodiazepine antagonist, not a barbiturate antagonist",
      "Continuous cardiac and neurological monitoring is required throughout flumazenil treatment, not just 5 minutes",
      "There is no age restriction for flumazenil use; the concern is about dependence and co-ingestants"
    ],
    lessonLink: "/emergency/lessons/benzodiazepine-toxicity"
  },
  {
    id: "en-tox-020",
    stem: "A 42-year-old female presents to the ED with severe abdominal pain, profuse watery diarrhea, and a garlic-like odor on her breath. She works at a metal recycling facility. Labs show pancytopenia and QT prolongation on ECG. The emergency nurse suspects poisoning with which substance?",
    options: [
      "Arsenic",
      "Lead",
      "Mercury",
      "Iron"
    ],
    correctAnswer: 0,
    rationaleLong: "This presentation is classic for acute arsenic poisoning. The combination of severe GI symptoms (abdominal pain, profuse watery 'rice water' diarrhea), garlic-like odor on breath, pancytopenia, and QT prolongation is pathognomonic for arsenic toxicity. Arsenic disrupts cellular respiration by interfering with oxidative phosphorylation and also causes direct toxicity to the GI mucosa, bone marrow, and cardiac conduction system. Key clinical features of arsenic poisoning include: acute GI symptoms (severe vomiting, profuse watery or rice-water diarrhea), garlic-like body odor and breath, cardiac effects (QT prolongation, torsades de pointes), hematological effects (pancytopenia, basophilic stippling), neurological effects (peripheral neuropathy with both sensory and motor involvement), and chronic features (Mees lines on nails, skin hyperpigmentation, keratoses). The occupational exposure at a metal recycling facility is a key epidemiological clue. Lead poisoning presents with abdominal colic, constipation (not diarrhea), lead lines on gums, and basophilic stippling but typically does not cause the acute GI hemorrhage pattern or garlic odor. Mercury poisoning presents with neuropsychiatric symptoms, tremor, and gingivitis. Iron poisoning causes GI bleeding but does not produce garlic odor or pancytopenia. Treatment for arsenic poisoning includes aggressive fluid resuscitation, chelation therapy with dimercaprol (BAL) for acute symptomatic poisoning or succimer (DMSA) for chronic exposure, cardiac monitoring, and supportive care.",
    learningObjective: "Recognize the clinical presentation of arsenic poisoning and differentiate it from other heavy metal toxicities",
    blueprintCategory: "Toxicology",
    subtopic: "Toxicology Screening and Antidote Protocols",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Garlic odor with profuse watery diarrhea and QT prolongation is pathognomonic for arsenic; lead causes constipation not diarrhea",
    clinicalPearls: ["Arsenic: garlic odor, rice-water diarrhea, QT prolongation, pancytopenia, Mees lines", "Lead: constipation, lead lines, basophilic stippling, wrist/foot drop", "Mercury: neuropsychiatric symptoms, tremor, gingivitis", "Chelation for arsenic: dimercaprol (BAL) for acute, succimer (DMSA) for chronic"],
    safetyNote: "Arsenic poisoning can cause fatal cardiac dysrhythmias from QT prolongation; continuous cardiac monitoring and electrolyte replacement are essential",
    distractorRationales: [
      "Lead poisoning causes constipation, not diarrhea, and does not produce garlic odor",
      "Mercury poisoning primarily affects the CNS with tremor and neuropsychiatric symptoms",
      "Iron poisoning does not cause garlic odor or pancytopenia"
    ],
    lessonLink: "/emergency/lessons/toxicology-screening-antidotes"
  },
  {
    id: "en-tox-021",
    stem: "A 50-year-old male with a history of depression presents to the ED after an intentional overdose of his amitriptyline (TCA). ECG shows a widened QRS complex of 140 ms and right axis deviation. Which treatment should the emergency nurse immediately prepare?",
    options: [
      "IV sodium bicarbonate bolus to narrow the QRS complex",
      "IV amiodarone for the wide complex rhythm",
      "IV procainamide for the dysrhythmia",
      "Synchronized cardioversion"
    ],
    correctAnswer: 0,
    rationaleLong: "Tricyclic antidepressant (TCA) overdose is a potentially fatal poisoning that causes toxicity through multiple mechanisms: sodium channel blockade (causing QRS widening and cardiac dysrhythmias), anticholinergic effects (tachycardia, dry skin, urinary retention, altered mental status), alpha-1 receptor blockade (hypotension), and serotonin/norepinephrine reuptake inhibition. The widened QRS complex of 140 ms (normal less than 120 ms) indicates significant sodium channel blockade and is a marker of severe TCA toxicity. QRS greater than 100 ms predicts seizures, and QRS greater than 160 ms predicts ventricular dysrhythmias. The immediate treatment for QRS prolongation in TCA overdose is IV sodium bicarbonate. Sodium bicarbonate works through two mechanisms: the sodium load overcomes the sodium channel blockade, and the alkalinization favors the non-ionized form of the TCA, reducing its binding to sodium channels. The initial dose is 1-2 mEq/kg IV bolus, followed by a bicarbonate drip targeting serum pH of 7.50-7.55. Antiarrhythmics such as amiodarone and procainamide are contraindicated in TCA overdose. Both agents have sodium channel blocking properties that would compound the TCA's sodium channel blockade, potentially causing refractory cardiac arrest. Procainamide is a class IA antiarrhythmic with significant sodium channel blockade and is absolutely contraindicated. Cardioversion is not indicated for the sodium channel blockade-mediated QRS widening seen in TCA toxicity.",
    learningObjective: "Manage TCA overdose with sodium bicarbonate for QRS prolongation and recognize contraindicated antiarrhythmics",
    blueprintCategory: "Toxicology",
    subtopic: "Toxicology Screening and Antidote Protocols",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Procainamide and other class IA/IC antiarrhythmics are absolutely contraindicated in TCA overdose due to additive sodium channel blockade",
    clinicalPearls: ["QRS >100ms in TCA OD predicts seizures; >160ms predicts ventricular dysrhythmias", "Sodium bicarbonate works by sodium load and alkalinization to overcome sodium channel blockade", "Target pH 7.50-7.55 with bicarbonate drip", "Procainamide and amiodarone are contraindicated in TCA overdose"],
    safetyNote: "TCA overdose can rapidly progress from alert to seizures to cardiac arrest; continuous cardiac monitoring and early sodium bicarbonate are essential",
    distractorRationales: [
      "Amiodarone has sodium channel blocking properties that worsen TCA toxicity",
      "Procainamide is absolutely contraindicated due to additive sodium channel blockade",
      "Cardioversion does not address the pharmacological cause of QRS widening"
    ],
    lessonLink: "/emergency/lessons/toxicology-screening-antidotes"
  },
  {
    id: "en-tox-022",
    stem: "A 4-year-old presents to the ED after accidentally ingesting two of his mother's clonidine patches. He is lethargic, bradycardic (HR 48), hypotensive (BP 72/40), and has constricted pupils. Which initial intervention is most appropriate?",
    options: [
      "Administer IV atropine for symptomatic bradycardia and prepare for whole bowel irrigation",
      "Administer IV naloxone as the primary antidote",
      "Perform immediate gastric lavage",
      "Administer IV epinephrine push dose"
    ],
    correctAnswer: 0,
    rationaleLong: "Clonidine is a centrally acting alpha-2 adrenergic agonist that can cause significant toxicity in pediatric patients even with relatively small doses. Clinical features of clonidine toxicity include CNS depression (lethargy to coma), bradycardia, hypotension, miosis (which can mimic opioid overdose), respiratory depression, and hypothermia. The miosis and CNS depression can mimic opioid toxicity, but the associated bradycardia and hypotension help differentiate clonidine toxicity. For symptomatic bradycardia with hypotension, atropine is the first-line treatment as it addresses the parasympathetic-mediated bradycardia. The initial pediatric dose is 0.02 mg/kg IV (minimum dose 0.1 mg). Since the child ingested transdermal patches, whole bowel irrigation (WBI) with polyethylene glycol electrolyte solution should be considered to remove the patches from the GI tract, as the patches continue to release clonidine for extended periods. While naloxone has been reported to partially reverse some effects of clonidine in case reports, it is not a reliable primary antidote and should not replace supportive care with atropine. Gastric lavage is generally not recommended in children and would not effectively remove intact transdermal patches. IV epinephrine push is reserved for cardiac arrest, not symptomatic bradycardia with a pulse.",
    learningObjective: "Manage pediatric clonidine toxicity with atropine for bradycardia and whole bowel irrigation for patch ingestion",
    blueprintCategory: "Toxicology",
    subtopic: "Toxic Ingestion in Pediatrics",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Clonidine toxicity mimics opioid toxicity with miosis and CNS depression, but bradycardia and hypotension help distinguish it",
    clinicalPearls: ["Clonidine causes miosis mimicking opioid toxicity but with bradycardia", "Whole bowel irrigation is indicated for transdermal patch ingestion", "Atropine is first-line for clonidine-induced symptomatic bradycardia", "Clonidine patches continue to release medication in GI tract"],
    safetyNote: "Transdermal medication patches pose extreme danger to small children; even used patches retain significant amounts of active drug",
    distractorRationales: [
      "Naloxone may partially reverse some clonidine effects but is not a reliable primary treatment",
      "Gastric lavage is not recommended and would not effectively remove transdermal patches",
      "IV epinephrine push dose is for cardiac arrest, not symptomatic bradycardia"
    ],
    lessonLink: "/emergency/lessons/toxic-ingestion-pediatrics"
  },
  {
    id: "en-tox-023",
    stem: "A 17-year-old male is brought to the ED after taking 'bath salts' at a party. He is severely agitated, combative, diaphoretic, and has a temperature of 40.8°C. Despite attempts at verbal de-escalation, he continues to be a danger to himself and staff. Which medication is the most appropriate for chemical restraint?",
    options: [
      "Intramuscular midazolam for rapid sedation and temperature reduction through decreased muscle activity",
      "Intramuscular haloperidol for antipsychotic effect",
      "Intramuscular ketamine dissociative dose",
      "Oral chlorpromazine for sedation"
    ],
    correctAnswer: 0,
    rationaleLong: "Synthetic cathinones ('bath salts') produce a sympathomimetic toxidrome with severe agitation, hyperthermia, tachycardia, hypertension, and diaphoresis through potent inhibition of dopamine, norepinephrine, and serotonin reuptake. The most dangerous aspect of this presentation is the combination of severe agitation and hyperthermia (40.8°C), which can rapidly progress to rhabdomyolysis, DIC, multi-organ failure, and death. Benzodiazepines, specifically midazolam IM for its rapid onset (5-15 minutes), are the preferred agents for agitation management in sympathomimetic toxicity. Benzodiazepines work by enhancing GABA-mediated CNS inhibition, reducing sympathetic outflow, decreasing muscle activity (which helps lower temperature), and reducing seizure risk. IM midazolam is preferred over IM lorazepam due to faster IM absorption. Haloperidol and other typical antipsychotics should be used cautiously or avoided in sympathomimetic toxicity because they lower the seizure threshold, can worsen hyperthermia through disruption of central thermoregulation, and have anticholinergic properties that impair heat dissipation. Ketamine, while increasingly used for severe agitation, is a sympathomimetic that may worsen tachycardia and hyperthermia. Oral medications are impractical in a severely agitated, combative patient. Aggressive external cooling measures should be initiated simultaneously.",
    learningObjective: "Select appropriate chemical restraint for sympathomimetic-induced agitation, prioritizing benzodiazepines over antipsychotics",
    blueprintCategory: "Toxicology",
    subtopic: "Sympathomimetic Toxidrome",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Antipsychotics lower seizure threshold and can worsen hyperthermia in sympathomimetic toxicity; benzodiazepines are first-line",
    clinicalPearls: ["Benzodiazepines are first-line for agitation in sympathomimetic toxicity", "Bath salts inhibit dopamine, norepinephrine, and serotonin reuptake", "Antipsychotics lower seizure threshold and impair thermoregulation", "Hyperthermia above 40°C requires aggressive external cooling in addition to sedation"],
    safetyNote: "Excited delirium from synthetic cathinones can be rapidly fatal; aggressive sedation with benzodiazepines and active cooling must begin immediately",
    distractorRationales: [
      "Haloperidol lowers seizure threshold and can worsen hyperthermia in sympathomimetic toxicity",
      "Ketamine has sympathomimetic properties that may worsen tachycardia and hyperthermia",
      "Oral medication is impractical in a severely agitated, combative patient"
    ],
    lessonLink: "/emergency/lessons/sympathomimetic-toxidrome"
  },
  {
    id: "en-tox-024",
    stem: "An emergency nurse is preparing to perform gastric decontamination on a patient who ingested a toxic substance 45 minutes ago. Which patient would be the BEST candidate for activated charcoal administration?",
    options: [
      "A 30-year-old who ingested a large quantity of carbamazepine tablets 45 minutes ago and is alert with intact airway reflexes",
      "A 50-year-old who ingested drain cleaner (sodium hydroxide) 30 minutes ago",
      "A 25-year-old who ingested a bottle of rubbing alcohol (isopropanol) 1 hour ago",
      "A 60-year-old who ingested iron supplements 40 minutes ago with ongoing hematemesis"
    ],
    correctAnswer: 0,
    rationaleLong: "Activated charcoal is most effective when administered within 1-2 hours of ingestion of a substance that is adsorbed by charcoal, in a patient with an intact airway protective reflexes. The ideal candidate is the 30-year-old with carbamazepine ingestion because: (1) Carbamazepine is well-adsorbed by activated charcoal, (2) the patient presented within the optimal window of 45 minutes, (3) the patient is alert with intact airway reflexes (reducing aspiration risk), and (4) carbamazepine undergoes enterohepatic recirculation, making multi-dose activated charcoal (MDAC) particularly effective. Substances NOT effectively adsorbed by activated charcoal can be remembered by the mnemonic PHAILS: Pesticides (organophosphates), Hydrocarbons, Acids/Alkalis/Alcohols, Iron/Iodine, Lithium, Solvents. The drain cleaner (sodium hydroxide) is a corrosive alkali that is not adsorbed by charcoal, and charcoal administration may obscure endoscopic visualization of GI tract burns. Isopropanol (rubbing alcohol) is not adsorbed by charcoal as alcohols pass through the charcoal matrix. Iron is not adsorbed by activated charcoal. Additionally, the patient with hematemesis has compromised GI integrity, contraindicating charcoal.",
    learningObjective: "Identify appropriate candidates for activated charcoal administration and substances not adsorbed by charcoal",
    blueprintCategory: "Toxicology",
    subtopic: "Activated Charcoal and Decontamination",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Remember PHAILS: substances not adsorbed by activated charcoal include Pesticides, Hydrocarbons, Acids/Alkalis/Alcohols, Iron, Lithium, Solvents",
    clinicalPearls: ["Activated charcoal most effective within 1-2 hours of ingestion", "PHAILS mnemonic for substances not adsorbed by charcoal", "Multi-dose activated charcoal enhances elimination of drugs with enterohepatic recirculation", "Intact airway reflexes required; intubated patients may receive charcoal via OG tube"],
    safetyNote: "Activated charcoal is contraindicated with corrosive ingestions, unprotected airways, and GI perforation",
    distractorRationales: [
      "Sodium hydroxide is a corrosive not adsorbed by charcoal; charcoal obscures endoscopic assessment",
      "Isopropanol is an alcohol not adsorbed by activated charcoal",
      "Iron is not adsorbed by activated charcoal; hematemesis suggests GI compromise"
    ],
    lessonLink: "/emergency/lessons/activated-charcoal-decontamination"
  },
  {
    id: "en-tox-025",
    stem: "A 35-year-old male presents to the ED with progressive muscle weakness, ascending paralysis, respiratory difficulty, salivation, and vomiting after being bitten by a coral snake 4 hours ago. Which treatment should the emergency nurse anticipate?",
    options: [
      "Coral snake-specific antivenom (Micrurus fulvius antivenin) and preparation for potential intubation",
      "CroFab polyvalent antivenom used for pit viper envenomation",
      "Apply a tourniquet proximal to the bite site and apply ice",
      "Administer broad-spectrum antibiotics and tetanus prophylaxis only"
    ],
    correctAnswer: 0,
    rationaleLong: "Coral snake envenomation produces a distinct clinical syndrome from pit viper (rattlesnake, copperhead, cottonmouth) bites due to the different venom composition. Coral snake venom contains primarily neurotoxins that block acetylcholine at the neuromuscular junction, causing a descending or ascending paralysis similar to curare. Symptoms may be delayed 6-12 hours after the bite but can progress rapidly to respiratory paralysis once they begin. Key clinical features include minimal local tissue effects (unlike pit vipers which cause significant local swelling and necrosis), cranial nerve palsies (ptosis, diplopia, dysphagia), progressive skeletal muscle weakness and paralysis, and respiratory failure from diaphragmatic paralysis. The specific treatment is coral snake antivenin (Micrurus fulvius antivenin), which must be given as early as possible because once neurotoxin binding occurs, it may be irreversible. Due to potential for delayed respiratory failure, patients require extended observation (minimum 24 hours) with close monitoring of respiratory function including serial negative inspiratory force (NIF) measurements. CroFab antivenom is specifically for pit viper envenomation and is not effective against coral snake neurotoxin. Tourniquets and ice are contraindicated as they may worsen tissue damage. Antibiotics alone do not address the neurotoxic venom.",
    learningObjective: "Manage coral snake envenomation with species-specific antivenom and monitor for delayed neurotoxic respiratory failure",
    blueprintCategory: "Toxicology",
    subtopic: "Toxicology Screening and Antidote Protocols",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Coral snake symptoms may be delayed 6-12 hours but can progress rapidly to respiratory failure; early antivenom is critical because neurotoxin binding may be irreversible",
    clinicalPearls: ["Coral snake venom is neurotoxic causing ascending paralysis", "Minimal local tissue effects unlike pit viper bites", "Symptoms may be delayed 6-12 hours but progress rapidly", "CroFab is for pit vipers only; coral snakes need Micrurus fulvius antivenin"],
    safetyNote: "All patients with confirmed coral snake bites should receive antivenom prophylactically due to the potential for delayed, rapidly progressive, and potentially irreversible neurotoxicity",
    distractorRationales: [
      "CroFab is for pit viper envenomation and ineffective against coral snake neurotoxin",
      "Tourniquets and ice are contraindicated and worsen tissue damage",
      "Antibiotics alone do not address the life-threatening neurotoxic venom"
    ],
    lessonLink: "/emergency/lessons/toxicology-screening-antidotes"
  }
];
