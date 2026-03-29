import type { LessonContent } from "./types";

export const rpnContentBatch040Lessons: Record<string, LessonContent> = {
  "organophosphate-poisoning-rpn": {
    title: "Organophosphate Poisoning",
    cellular: {
      title: "Organophosphate Toxicology and Cholinergic Crisis",
      content: "Organophosphates are irreversible acetylcholinesterase inhibitors found in pesticides, nerve agents, and some medications. By inhibiting acetylcholinesterase, they prevent breakdown of acetylcholine at synapses, causing excessive cholinergic stimulation at muscarinic receptors (parasympathetic effects), nicotinic receptors (neuromuscular junction and sympathetic ganglia), and central nervous system. The SLUDGEM mnemonic describes muscarinic effects: Salivation, Lacrimation, Urination, Defecation, GI cramping, Emesis, and Miosis. Nicotinic effects include muscle fasciculations, weakness, paralysis, tachycardia, and hypertension. Death typically results from respiratory failure due to bronchospasm, excessive secretions, and diaphragmatic paralysis. The antidote is atropine (blocks muscarinic effects) combined with pralidoxime (reactivates acetylcholinesterase if given before aging occurs, typically within 24-48 hours)."
    },
    riskFactors: [
      "Agricultural workers exposed to pesticide spraying",
      "Intentional ingestion in suicide attempts",
      "Accidental exposure in children accessing stored pesticides",
      "Military or terrorism exposure to nerve agents (sarin, VX)",
      "Improper use of organophosphate insecticides without PPE"
    ],
    diagnostics: [
      "Red blood cell cholinesterase and plasma pseudocholinesterase levels (decreased)",
      "Arterial blood gas for respiratory status assessment",
      "Continuous cardiac monitoring for bradycardia and arrhythmias",
      "Clinical presentation using SLUDGEM mnemonic"
    ],
    management: [
      "Decontaminate: remove clothing, wash skin with soap and water wearing PPE",
      "Administer atropine IV until secretions dry (may require large doses)",
      "Administer pralidoxime (2-PAM) within 24-48 hours to reactivate cholinesterase",
      "Secure airway and provide ventilatory support as needed"
    ],
    nursingActions: [
      "Wear PPE during decontamination to prevent secondary exposure",
      "Administer atropine as ordered and monitor for drying of secretions as therapeutic endpoint",
      "Monitor respiratory status closely - respiratory failure is the primary cause of death",
      "Suction excessive secretions and maintain airway patency",
      "Document time of exposure and all interventions with response"
    ],
    signs: {
      left: ["Dry mucous membranes after atropine treatment", "Clear breath sounds without excessive secretions", "Pupils dilating appropriately after atropine", "Heart rate normalizing with treatment"],
      right: ["Excessive salivation, lacrimation, bronchorrhea (SLUDGEM)", "Miosis (pinpoint pupils) bilateral", "Muscle fasciculations progressing to weakness", "Bradycardia and respiratory distress"]
    },
    medications: [{
      name: "Atropine Sulfate IV",
      type: "Anticholinergic/muscarinic antagonist",
      action: "Competitively blocks acetylcholine at muscarinic receptors reversing bronchospasm, bradycardia, and excessive secretions",
      sideEffects: "Tachycardia, dry mouth, urinary retention, hyperthermia, mydriasis",
      contra: "None in true organophosphate poisoning - give until secretions dry",
      pearl: "Dose until secretions dry - may require 10-100+ mg in severe poisoning; do NOT use atropine dose to target heart rate."
    }],
    pearls: [
      "SLUDGEM: Salivation, Lacrimation, Urination, Defecation, GI cramping, Emesis, Miosis",
      "Atropine endpoint is drying of secretions, NOT heart rate normalization",
      "Wear PPE during decontamination - organophosphates can be absorbed through healthcare worker skin"
    ],
    quiz: [
      { question: "The mnemonic for organophosphate muscarinic effects is:", options: ["FAST", "SLUDGEM", "MONA", "ABCDE"], correct: 1, rationale: "SLUDGEM: Salivation, Lacrimation, Urination, Defecation, GI cramping, Emesis, Miosis." },
      { question: "The therapeutic endpoint for atropine in organophosphate poisoning is:", options: ["Heart rate > 100 bpm", "Drying of secretions", "Pupil dilation", "Blood pressure normalization"], correct: 1, rationale: "Atropine is titrated to dry secretions and clear breath sounds, not to a target heart rate." },
      { question: "Pralidoxime (2-PAM) works by:", options: ["Blocking nicotinic receptors", "Reactivating acetylcholinesterase", "Preventing further absorption", "Increasing atropine metabolism"], correct: 1, rationale: "Pralidoxime reactivates acetylcholinesterase before irreversible aging occurs (within 24-48 hours)." }
    ]
  },
  "lead-poisoning-adult-rpn": {
    title: "Lead Poisoning in Adults",
    cellular: {
      title: "Lead Toxicity Pathophysiology in Adults",
      content: "Lead poisoning in adults occurs primarily through occupational exposure (battery manufacturing, painting, plumbing, construction, shooting ranges) and environmental sources. Lead inhibits delta-aminolevulinic acid dehydratase and ferrochelatase enzymes in heme synthesis, causing microcytic hypochromic anemia with basophilic stippling on peripheral smear. Neurological effects include peripheral neuropathy (classically wrist drop from radial nerve palsy), encephalopathy, and cognitive impairment. Renal effects include chronic interstitial nephritis and proximal tubular dysfunction. GI effects include lead colic (severe abdominal cramping). Burton lines (blue-black lines at the gum-tooth margin) are a classic physical finding. Blood lead levels > 5 mcg/dL are considered elevated; symptomatic toxicity typically occurs > 40-50 mcg/dL in adults. Chelation therapy with EDTA, DMSA (succimer), or dimercaprol is used for significant lead burden."
    },
    riskFactors: [
      "Occupational exposure in construction, painting, battery recycling, shooting ranges",
      "Living in homes built before 1978 with deteriorating lead paint",
      "Drinking water from lead pipes or lead-soldered plumbing",
      "Use of traditional remedies or cosmetics containing lead",
      "Retained lead bullet fragments from prior gunshot wounds"
    ],
    diagnostics: [
      "Venous blood lead level (BLL) - diagnostic test of choice",
      "CBC with peripheral smear showing basophilic stippling and microcytic anemia",
      "Free erythrocyte protoporphyrin (FEP) or zinc protoporphyrin (ZPP) elevated",
      "Renal function tests (BUN, creatinine) for nephrotoxicity assessment"
    ],
    management: [
      "Remove patient from lead exposure source immediately",
      "Chelation therapy for symptomatic patients or BLL > 50 mcg/dL",
      "Adequate hydration to support renal lead excretion",
      "Dietary optimization: adequate calcium, iron, and vitamin C to reduce lead absorption"
    ],
    nursingActions: [
      "Obtain detailed occupational and environmental exposure history",
      "Monitor blood lead levels serially during and after chelation therapy",
      "Assess for neurocognitive changes and peripheral neuropathy",
      "Educate patient on exposure source elimination and prevention",
      "Ensure adequate hydration and renal function monitoring during chelation"
    ],
    signs: {
      left: ["Blood lead level < 5 mcg/dL", "Normal hemoglobin without basophilic stippling", "Normal neurocognitive function", "Normal renal function"],
      right: ["Abdominal colic and constipation (lead colic)", "Wrist drop from peripheral neuropathy", "Burton lines (blue-black gingival lines)", "Microcytic anemia with basophilic stippling"]
    },
    medications: [{
      name: "Succimer (DMSA/Chemet)",
      type: "Oral chelating agent",
      action: "Binds lead ions forming water-soluble chelates excreted through kidneys",
      sideEffects: "GI upset, elevated liver enzymes, neutropenia, sulfurous odor to urine",
      contra: "Severe renal impairment, concurrent chelation with another agent",
      pearl: "Oral chelation for moderate lead poisoning; ensure adequate hydration for renal excretion; monitor CBC and liver function."
    }],
    pearls: [
      "Basophilic stippling on peripheral smear is a classic finding of lead poisoning",
      "Burton lines (blue-black gum lines) are pathognomonic but not always present",
      "Lead exposure source MUST be identified and eliminated or chelation will be futile"
    ],
    quiz: [
      { question: "The classic peripheral neuropathy pattern in lead poisoning is:", options: ["Foot drop", "Wrist drop", "Facial paralysis", "Shoulder weakness"], correct: 1, rationale: "Lead preferentially affects the radial nerve causing wrist drop (extensor weakness) as the classic motor neuropathy." },
      { question: "Which blood finding is characteristic of lead poisoning?", options: ["Macrocytic anemia", "Basophilic stippling on peripheral smear", "Elevated reticulocyte count only", "Thrombocytosis"], correct: 1, rationale: "Basophilic stippling represents ribosomal RNA aggregates in red cells caused by lead's inhibition of pyrimidine 5'-nucleotidase." },
      { question: "The diagnostic test of choice for lead poisoning is:", options: ["Urine lead level", "Venous blood lead level", "Hair lead analysis", "Nail lead content"], correct: 1, rationale: "Venous blood lead level (BLL) is the standard diagnostic test for lead exposure and toxicity." }
    ]
  },
  "iron-toxicity-rpn": {
    title: "Iron Toxicity",
    cellular: {
      title: "Iron Overdose Pathophysiology",
      content: "Iron toxicity is one of the most common causes of pediatric poisoning deaths, occurring from accidental ingestion of iron-containing supplements and prenatal vitamins. Elemental iron is directly corrosive to GI mucosa, causing hemorrhagic gastroenteritis in the first phase (0-6 hours). Free iron exceeding transferrin binding capacity generates hydroxyl free radicals through Fenton reactions, causing lipid peroxidation, mitochondrial damage, and cellular necrosis. Iron toxicity progresses through five phases: GI phase (0-6 hours with vomiting, diarrhea, abdominal pain, hematemesis), relative stability (6-24 hours, falsely reassuring), systemic toxicity (12-48 hours with shock, metabolic acidosis, hepatotoxicity, coagulopathy), hepatotoxicity (2-3 days), and late GI stricture formation (2-8 weeks). Serum iron > 500 mcg/dL indicates severe toxicity. Deferoxamine chelation is the specific antidote, binding free iron for renal excretion."
    },
    riskFactors: [
      "Children accessing adult iron supplements or prenatal vitamins",
      "Intentional iron overdose in suicide attempts",
      "Iron supplements stored in non-childproof containers",
      "Chronic iron supplementation without monitoring in adults",
      "Confusion between candy-coated iron tablets and actual candy by children"
    ],
    diagnostics: [
      "Serum iron level (peak at 4-6 hours post-ingestion)",
      "Total iron-binding capacity (TIBC) for comparison",
      "Abdominal X-ray (iron tablets are radiopaque and visible)",
      "Metabolic panel for anion gap metabolic acidosis and hepatic injury"
    ],
    management: [
      "Whole bowel irrigation for significant ingestions (polyethylene glycol solution)",
      "Deferoxamine IV chelation for serum iron > 500 mcg/dL or symptomatic patients",
      "Aggressive IV fluid resuscitation for hemorrhagic shock",
      "Monitor for hepatotoxicity and coagulopathy"
    ],
    nursingActions: [
      "Assess and document time and amount of ingestion",
      "Monitor vital signs for hypovolemic shock from GI hemorrhage",
      "Administer deferoxamine IV as prescribed and monitor for hypotension",
      "Watch for vin rosé-colored urine indicating deferoxamine-iron chelate excretion",
      "Do NOT induce vomiting - risk of aspiration and further mucosal injury"
    ],
    signs: {
      left: ["Serum iron within therapeutic range", "No GI symptoms after observation", "Stable vital signs and hemoglobin", "Normal liver function tests"],
      right: ["Vomiting, bloody diarrhea, hematemesis (GI phase)", "Metabolic acidosis with elevated anion gap", "Hypotension and tachycardia from hemorrhagic shock", "Vin rosé-colored urine during deferoxamine treatment"]
    },
    medications: [{
      name: "Deferoxamine (Desferal)",
      type: "Iron chelating agent",
      action: "Binds free iron forming ferrioxamine complex excreted renally, producing characteristic vin rosé urine",
      sideEffects: "Hypotension (especially with rapid IV infusion), orange-red urine, ARDS with prolonged use",
      contra: "Severe renal failure (chelate cannot be excreted), anuria",
      pearl: "Vin rosé (salmon-pink) urine confirms chelation is working; stop when urine clears; do not exceed 24 hours infusion to avoid pulmonary toxicity."
    }],
    pearls: [
      "Iron tablets are radiopaque - abdominal X-ray can confirm ingestion and quantify tablet burden",
      "The quiescent phase (6-24 hours) is dangerously deceptive - patients appear to improve before systemic toxicity develops",
      "Vin rosé-colored urine during deferoxamine treatment is expected and indicates chelation is working"
    ],
    quiz: [
      { question: "The specific antidote for iron toxicity is:", options: ["N-acetylcysteine", "Deferoxamine", "Naloxone", "Atropine"], correct: 1, rationale: "Deferoxamine chelates free iron forming a water-soluble complex excreted by the kidneys." },
      { question: "Iron tablets can be visualized on imaging because they are:", options: ["Radiolucent", "Radiopaque", "Invisible on all imaging", "Only visible on MRI"], correct: 1, rationale: "Iron tablets are radiopaque and visible on plain abdominal X-ray, confirming ingestion." },
      { question: "The dangerously deceptive 'quiet phase' of iron toxicity occurs at:", options: ["0-2 hours", "6-24 hours post-ingestion", "3-5 days", "2-8 weeks"], correct: 1, rationale: "The quiescent phase (6-24 hours) shows apparent clinical improvement before systemic toxicity develops." }
    ]
  },
  "salicylate-toxicity-rpn": {
    title: "Salicylate (Aspirin) Toxicity",
    cellular: {
      title: "Salicylate Poisoning Pathophysiology",
      content: "Salicylate toxicity occurs from aspirin overdose or chronic excessive use, causing a complex metabolic disturbance with a characteristic mixed respiratory alkalosis and metabolic acidosis. Salicylates directly stimulate the medullary respiratory center causing hyperventilation and respiratory alkalosis (primary early finding). Simultaneously, salicylates uncouple oxidative phosphorylation, inhibit Krebs cycle enzymes, and cause accumulation of organic acids producing anion gap metabolic acidosis. As toxicity progresses, metabolic acidosis predominates and the compensatory respiratory alkalosis becomes insufficient. Salicylates also cause hyperthermia from uncoupled oxidative phosphorylation, tinnitus from cochlear damage, and non-cardiogenic pulmonary edema. Acute toxicity occurs with ingestion > 150 mg/kg; levels > 40 mg/dL at 6 hours post-ingestion indicate significant toxicity; levels > 100 mg/dL indicate potentially lethal toxicity. Alkalinization of urine with sodium bicarbonate enhances renal salicylate excretion by ion trapping."
    },
    riskFactors: [
      "Intentional aspirin overdose in suicide attempts",
      "Chronic salicylate therapy in elderly with renal impairment",
      "Concurrent use of multiple salicylate-containing products",
      "Oil of wintergreen ingestion (concentrated methyl salicylate)",
      "Inability to recognize early symptoms (tinnitus, GI upset)"
    ],
    diagnostics: [
      "Serum salicylate level (serial levels every 2-4 hours until declining)",
      "ABG showing mixed respiratory alkalosis and metabolic acidosis",
      "Basic metabolic panel for anion gap and electrolytes",
      "Blood glucose (hypoglycemia or hyperglycemia may occur)"
    ],
    management: [
      "Activated charcoal if within 1-2 hours of ingestion",
      "IV sodium bicarbonate infusion to alkalinize urine (target urine pH 7.5-8.0)",
      "Aggressive IV fluid resuscitation and electrolyte correction",
      "Hemodialysis for severe toxicity (level > 100 mg/dL, renal failure, pulmonary edema)"
    ],
    nursingActions: [
      "Monitor vital signs frequently including temperature (hyperthermia common)",
      "Assess for tinnitus and hearing changes as early toxicity indicators",
      "Monitor serum salicylate levels serially until consistently declining",
      "Maintain IV bicarbonate infusion and monitor urine pH hourly",
      "Monitor blood glucose closely - both hypoglycemia and hyperglycemia can occur"
    ],
    signs: {
      left: ["Serum salicylate level declining on serial measurements", "Tinnitus resolving with treatment", "Normal acid-base balance restored", "Adequate urine output with alkaline pH"],
      right: ["Tinnitus (earliest symptom) and hearing changes", "Tachypnea from respiratory center stimulation", "Hyperthermia and diaphoresis", "Altered mental status in severe toxicity"]
    },
    medications: [{
      name: "Sodium Bicarbonate IV",
      type: "Alkalinizing agent for urinary ion trapping",
      action: "Alkalinizes blood and urine, ionizing salicylate in renal tubules preventing reabsorption and enhancing excretion",
      sideEffects: "Metabolic alkalosis, hypokalemia, fluid overload, hypernatremia",
      contra: "Severe pulmonary edema (fluid volume concern)",
      pearl: "Must correct hypokalemia FIRST - kidneys excrete potassium instead of hydrogen ions in hypokalemia, preventing urine alkalinization."
    }],
    pearls: [
      "Tinnitus is the earliest clinical symptom of salicylate toxicity - always ask about ringing in the ears",
      "The classic acid-base finding is mixed respiratory alkalosis and metabolic acidosis",
      "Correct hypokalemia before attempting urine alkalinization - hypokalemia prevents effective alkalinization"
    ],
    quiz: [
      { question: "The earliest symptom of salicylate toxicity is:", options: ["Seizures", "Tinnitus (ringing in the ears)", "Bradycardia", "Hypothermia"], correct: 1, rationale: "Tinnitus from cochlear damage is the earliest clinical symptom of salicylate toxicity." },
      { question: "The classic acid-base disturbance in salicylate toxicity is:", options: ["Metabolic alkalosis only", "Respiratory acidosis only", "Mixed respiratory alkalosis and metabolic acidosis", "Normal acid-base balance"], correct: 2, rationale: "Salicylates cause respiratory alkalosis from medullary stimulation and metabolic acidosis from uncoupled oxidative phosphorylation." },
      { question: "Urine alkalinization with sodium bicarbonate works by:", options: ["Neutralizing salicylate in the stomach", "Ion trapping salicylate in renal tubules for excretion", "Binding salicylate in the blood", "Activating hepatic metabolism"], correct: 1, rationale: "Alkaline urine ionizes salicylate in renal tubules, preventing reabsorption and enhancing excretion (ion trapping)." }
    ]
  },
  "alcohol-poisoning-rpn": {
    title: "Alcohol Poisoning",
    cellular: {
      title: "Acute Alcohol Intoxication Pathophysiology",
      content: "Acute alcohol poisoning occurs when blood alcohol concentration (BAC) rises to dangerous levels, typically from rapid binge drinking. Ethanol is a central nervous system depressant that enhances GABA-A receptor activity and inhibits NMDA glutamate receptors, producing dose-dependent CNS depression. At BAC 0.08% (legal intoxication limit), judgment and coordination are impaired. At 0.20-0.30%, confusion, vomiting, and stupor develop. At 0.30-0.40%, loss of consciousness, hypothermia, and respiratory depression occur. BAC > 0.40% is potentially lethal from respiratory arrest, aspiration, and cardiovascular collapse. The liver metabolizes ethanol at approximately 15-20 mg/dL/hour via alcohol dehydrogenase. Risk of aspiration is high in unconscious patients due to loss of protective airway reflexes. Methanol and ethylene glycol (antifreeze) are toxic alcohols that produce metabolic acidosis with an osmol gap; fomepizole or ethanol infusion inhibits their conversion to toxic metabolites."
    },
    riskFactors: [
      "Binge drinking (≥4 drinks for women, ≥5 for men in 2 hours)",
      "College-age individuals during social events and hazing",
      "Concurrent use of CNS depressants (opioids, benzodiazepines, sedatives)",
      "Empty stomach increasing rate of alcohol absorption",
      "Small body size with lower volume of distribution"
    ],
    diagnostics: [
      "Blood alcohol level (BAC) with serial measurements",
      "Blood glucose (hypoglycemia is common and must be treated)",
      "Basic metabolic panel for electrolytes and osmol gap",
      "ABG if respiratory depression or metabolic acidosis suspected"
    ],
    management: [
      "Maintain airway and position in lateral recovery position if unconscious",
      "Administer IV dextrose if hypoglycemic (check glucose before thiamine)",
      "Administer IV thiamine 100 mg to prevent Wernicke encephalopathy",
      "Monitor respiratory rate and oxygen saturation continuously"
    ],
    nursingActions: [
      "Assess and maintain airway patency - aspiration is a leading cause of death",
      "Position unconscious patient in lateral recovery (left lateral) position",
      "Monitor respiratory rate, depth, and oxygen saturation continuously",
      "Check blood glucose and treat hypoglycemia with IV dextrose",
      "Never leave an intoxicated patient alone - continuous observation required"
    ],
    signs: {
      left: ["Oriented and conversant despite alcohol odor on breath", "Respiratory rate > 12 with adequate depth", "Blood glucose > 70 mg/dL", "Able to maintain own airway and protect from aspiration"],
      right: ["Unresponsive to verbal or painful stimulation", "Respiratory rate < 8 or shallow breathing", "Hypothermia (core temperature < 35°C)", "Vomiting without protective gag reflex (aspiration risk)"]
    },
    medications: [{
      name: "Thiamine (Vitamin B1) IV",
      type: "Water-soluble vitamin",
      action: "Prevents Wernicke encephalopathy by replacing depleted thiamine stores essential for glucose metabolism in the brain",
      sideEffects: "Rarely: anaphylaxis with IV administration (very rare)",
      contra: "None in suspected chronic alcohol use",
      pearl: "ALWAYS give thiamine BEFORE or WITH glucose in alcoholic patients - glucose without thiamine can precipitate or worsen Wernicke encephalopathy."
    }],
    pearls: [
      "Never assume altered mental status is 'just alcohol' - always assess for head injury, hypoglycemia, and co-ingestants",
      "Give thiamine before or with glucose in alcohol-dependent patients to prevent Wernicke encephalopathy",
      "Aspiration of vomitus is a leading cause of death in alcohol poisoning - lateral positioning is critical"
    ],
    quiz: [
      { question: "An unconscious intoxicated patient should be positioned:", options: ["Supine with head flat", "Prone position", "Lateral recovery position", "Semi-Fowler's"], correct: 2, rationale: "Lateral recovery position prevents aspiration of vomitus, which is a leading cause of death in alcohol poisoning." },
      { question: "Before giving IV dextrose to an alcoholic patient, the nurse should:", options: ["Check blood pressure", "Administer IV thiamine first or simultaneously", "Wait 30 minutes", "Give a full meal"], correct: 1, rationale: "Thiamine must be given before or with glucose to prevent precipitating Wernicke encephalopathy in thiamine-depleted patients." },
      { question: "Which BAC level is potentially lethal?", options: ["0.05%", "0.08%", "0.20%", "> 0.40%"], correct: 3, rationale: "BAC > 0.40% is potentially lethal from respiratory arrest, aspiration, and cardiovascular collapse." }
    ]
  },
  "snake-bite-management-rpn": {
    title: "Snake Bite Management",
    cellular: {
      title: "Envenomation Pathophysiology and Clinical Effects",
      content: "Venomous snake bites in North America primarily involve pit vipers (rattlesnakes, copperheads, cottonmouths) and coral snakes. Pit viper venom contains a complex mixture of proteolytic enzymes, phospholipases, metalloproteinases, and hemotoxins that cause local tissue destruction, coagulopathy, and systemic toxicity. Local effects include progressive edema, ecchymosis, and tissue necrosis. Hematologic effects include thrombocytopenia, hypofibrinogenemia, and prolonged PT/INR from consumption coagulopathy. Coral snake venom is primarily neurotoxic, causing descending paralysis starting with cranial nerve dysfunction (ptosis, dysphagia) progressing to respiratory paralysis. Approximately 20-25% of pit viper bites are 'dry bites' with no envenomation. CroFab (crotalidae polyvalent immune Fab) antivenom neutralizes pit viper venom when significant envenomation is present. Time to antivenom administration directly affects outcomes."
    },
    riskFactors: [
      "Outdoor activities in snake-endemic areas (hiking, gardening, camping)",
      "Handling or attempting to kill snakes",
      "Rural areas with limited access to antivenom and emergency care",
      "Children (smaller body mass means higher venom-to-weight ratio)",
      "Delayed presentation to medical facility after bite"
    ],
    diagnostics: [
      "Serial complete blood count and coagulation studies (PT/INR, fibrinogen, platelets)",
      "Mark and time the leading edge of swelling every 15-30 minutes",
      "Basic metabolic panel for renal function and electrolytes",
      "Creatine kinase for rhabdomyolysis from tissue necrosis"
    ],
    management: [
      "Immobilize affected extremity at heart level (not above, not tourniqueted)",
      "Administer antivenom for significant envenomation as prescribed",
      "Serial monitoring of swelling progression and coagulation studies",
      "Avoid incision, suction, ice, and tourniquet (all harmful)"
    ],
    nursingActions: [
      "Remove jewelry and constrictive clothing from affected limb before swelling progresses",
      "Mark the leading edge of edema with a pen and note the time every 15-30 minutes",
      "Monitor for signs of anaphylaxis during antivenom administration",
      "Obtain serial labs (CBC, coags, CK) every 4-6 hours as ordered",
      "Provide tetanus prophylaxis if not current"
    ],
    signs: {
      left: ["No progressive swelling beyond bite site (possible dry bite)", "Coagulation studies normal on serial testing", "No systemic symptoms developing", "Stable vital signs with no allergic response"],
      right: ["Progressive edema extending beyond bite site", "Ecchymosis and hemorrhagic bullae developing", "Coagulopathy (elevated PT/INR, low fibrinogen, thrombocytopenia)", "Nausea, vomiting, metallic taste, perioral paresthesias"]
    },
    medications: [{
      name: "CroFab (Crotalidae Polyvalent Immune Fab)",
      type: "Antivenom (pit viper)",
      action: "Fab antibody fragments bind and neutralize viper venom components halting tissue destruction and coagulopathy",
      sideEffects: "Anaphylaxis/anaphylactoid reactions, serum sickness (5-14 days post-treatment)",
      contra: "Known severe allergy to papaya (papain used in manufacturing)",
      pearl: "Give initial dose of 4-6 vials IV; reassess at 1 hour; repeat until swelling stabilizes and coagulopathy corrects."
    }],
    pearls: [
      "Do NOT apply ice, tourniquet, incision, or suction to a snake bite - these interventions cause additional tissue damage",
      "Mark and time the advancing edge of swelling every 15-30 minutes to track envenomation progression",
      "Up to 25% of pit viper bites are dry bites with no venom injection - serial observation determines if antivenom is needed"
    ],
    quiz: [
      { question: "After a snake bite, the nurse should NOT:", options: ["Remove jewelry from the affected limb", "Mark the edge of swelling", "Apply a tourniquet above the bite", "Monitor vital signs"], correct: 2, rationale: "Tourniquets trap venom locally causing worse tissue destruction and are contraindicated in snake bite management." },
      { question: "The progression of envenomation from a pit viper bite is best monitored by:", options: ["Skin color changes only", "Marking and timing the advancing edge of swelling", "Patient pain report alone", "Checking temperature of the limb"], correct: 1, rationale: "Serial marking of the swelling edge with timed measurements objectively tracks venom spread and guides treatment." },
      { question: "Which percentage of pit viper bites result in no envenomation (dry bite)?", options: ["0%", "5%", "20-25%", "75%"], correct: 2, rationale: "Approximately 20-25% of pit viper bites are dry bites where no venom is injected." }
    ]
  },
  "insect-sting-allergy-rpn": {
    title: "Insect Sting Allergic Reactions",
    cellular: {
      title: "Hymenoptera Venom Allergy and Anaphylaxis Risk",
      content: "Insect sting allergies are caused by venom from Hymenoptera order insects: bees (honeybees, bumblebees), wasps, yellow jackets, hornets, and fire ants. Normal local reactions involve pain, erythema, and swelling at the sting site resolving within hours. Large local reactions extend > 10 cm in diameter and last > 24 hours but carry low systemic anaphylaxis risk. Systemic allergic reactions range from generalized urticaria to life-threatening anaphylaxis with bronchospasm, laryngeal edema, and cardiovascular collapse. Prior sensitization with IgE formation is required for anaphylaxis. Each subsequent sting carries 30-60% risk of similar or worse reaction in previously allergic individuals. Honeybees leave stingers with venom sacs that continue injecting venom; scrape (don't squeeze) the stinger to remove. Venom immunotherapy reduces future anaphylaxis risk to < 5% and is recommended for patients with prior systemic reactions."
    },
    riskFactors: [
      "Previous systemic allergic reaction to insect sting",
      "Outdoor occupations (landscaping, farming, beekeeping)",
      "History of atopy increasing sensitization likelihood",
      "Living in areas with high Hymenoptera populations",
      "Concurrent beta-blocker or ACE inhibitor therapy (complicates anaphylaxis treatment)"
    ],
    diagnostics: [
      "Clinical diagnosis based on symptom pattern after known sting",
      "Serum tryptase if anaphylaxis suspected (elevated during mast cell activation)",
      "Venom-specific IgE testing for allergy confirmation",
      "Skin prick testing with venom extracts by allergist"
    ],
    management: [
      "For local reactions: ice, elevation, oral antihistamine, NSAIDs for pain",
      "For anaphylaxis: epinephrine IM immediately (EpiPen or manual syringe)",
      "Remove honeybee stinger by scraping - do not squeeze the venom sac",
      "Refer patients with systemic reactions to allergist for venom immunotherapy"
    ],
    nursingActions: [
      "Assess sting site and monitor for progression from local to systemic reaction",
      "Administer epinephrine IM immediately for any signs of anaphylaxis",
      "Monitor patient for minimum 4-6 hours for biphasic reaction",
      "Educate patients with allergy on carrying and using epinephrine auto-injectors",
      "Teach avoidance strategies: wear closed shoes, avoid perfumes outdoors, check drinks for insects"
    ],
    signs: {
      left: ["Localized pain, erythema, and swelling at sting site", "Symptoms resolving within hours with local treatment", "No systemic symptoms beyond the sting site", "Vital signs stable throughout observation"],
      right: ["Generalized urticaria and pruritus beyond sting site", "Facial or pharyngeal swelling with difficulty swallowing", "Wheezing, dyspnea, or stridor", "Hypotension, tachycardia, dizziness (anaphylactic shock)"]
    },
    medications: [{
      name: "Epinephrine Auto-Injector (EpiPen)",
      type: "Adrenergic agonist for self-administered anaphylaxis treatment",
      action: "Reverses bronchospasm, vasodilation, and laryngeal edema through alpha and beta adrenergic stimulation",
      sideEffects: "Tachycardia, palpitations, anxiety, headache, tremor",
      contra: "None in anaphylaxis - always administer",
      pearl: "Inject into anterolateral thigh through clothing if needed; carry two auto-injectors at all times; replace before expiration date."
    }],
    pearls: [
      "Scrape (do not pinch) the honeybee stinger to avoid squeezing more venom from the attached sac",
      "Patients with prior systemic reactions have a 30-60% risk of similar or worse reaction with future stings",
      "Venom immunotherapy is highly effective (>95%) and should be recommended for anyone with prior systemic sting reaction"
    ],
    quiz: [
      { question: "A honeybee stinger should be removed by:", options: ["Pulling with tweezers", "Squeezing with fingers", "Scraping with a credit card or flat edge", "Leaving it in place"], correct: 2, rationale: "Scraping prevents squeezing the venom sac and injecting additional venom; pulling or pinching can compress the sac." },
      { question: "A patient stung by a wasp develops generalized hives and throat tightness. The priority treatment is:", options: ["Oral diphenhydramine", "Cold compress to sting site", "Epinephrine IM immediately", "IV corticosteroids"], correct: 2, rationale: "Generalized urticaria with throat tightness indicates systemic anaphylaxis requiring immediate IM epinephrine." },
      { question: "A patient with a previous anaphylactic reaction to yellow jacket stings should:", options: ["Avoid all outdoor activities permanently", "Carry two epinephrine auto-injectors and consider venom immunotherapy", "Take daily antihistamines instead", "No special precautions needed"], correct: 1, rationale: "Patients with prior systemic reactions should carry two EpiPens and be referred for venom immunotherapy." }
    ]
  },
  "frostbite-care-rpn": {
    title: "Frostbite Assessment and Care",
    cellular: {
      title: "Cold Injury Pathophysiology and Tissue Damage",
      content: "Frostbite occurs when tissue temperature drops below 0°C (32°F), causing ice crystal formation within cells and extracellular spaces. Intracellular ice crystals mechanically disrupt cell membranes and organelles causing immediate cell death. Extracellular ice formation draws water from cells via osmotic gradient, causing cellular dehydration and electrolyte concentration. Upon rewarming, reperfusion injury occurs as inflammatory mediators, reactive oxygen species, and thromboxane A2 cause endothelial damage, thrombosis, and progressive tissue ischemia. Frostbite severity classification: superficial (frostnip/first degree with numbness and erythema), partial thickness (second degree with clear blisters), full thickness (third degree with hemorrhagic blisters and dermal death), and deep (fourth degree extending to muscle, tendon, and bone). Rapid rewarming in 37-39°C water is the cornerstone of treatment, as slow rewarming causes more tissue damage. Tissue demarcation takes weeks to months, and amputation decisions should be delayed."
    },
    riskFactors: [
      "Prolonged exposure to subfreezing temperatures",
      "Wet clothing accelerating heat loss",
      "Peripheral vascular disease and diabetes reducing blood flow",
      "Alcohol intoxication impairing thermoregulation and judgment",
      "High altitude with wind chill factor"
    ],
    diagnostics: [
      "Clinical examination for depth and extent of injury",
      "Doppler ultrasound for assessment of vascular patency",
      "Technetium-99m bone scan at 2-3 days to predict tissue viability",
      "Angiography for assessment of microvascular perfusion"
    ],
    management: [
      "Rapid rewarming in 37-39°C (98.6-102.2°F) water for 15-30 minutes",
      "Administer IV ibuprofen for anti-prostaglandin and anti-inflammatory effects",
      "Clear blisters may be aspirated; hemorrhagic blisters left intact",
      "Protect rewarmed tissue from refreezing (causes worse injury than initial freeze)"
    ],
    nursingActions: [
      "Remove wet clothing and constrictive items from affected areas",
      "Perform rapid rewarming in circulating warm water (37-39°C) with monitoring",
      "Administer prescribed analgesics - rewarming is extremely painful",
      "Apply loose, sterile dressings with padding between frostbitten digits",
      "Do NOT rub, massage, or apply direct heat to frostbitten tissue"
    ],
    signs: {
      left: ["Frostnip: numbness and pallor that resolves completely with rewarming", "Sensation returning after rewarming", "Pink color returning to affected area", "Clear blisters forming (partial thickness - better prognosis)"],
      right: ["Hard, waxy, white or grayish-blue tissue (deep frostbite)", "Hemorrhagic blisters indicating full-thickness injury", "No sensation after rewarming (deep nerve damage)", "Tissue appearing mummified and black (eschar formation over weeks)"]
    },
    medications: [{
      name: "Ibuprofen (Advil)",
      type: "NSAID with anti-prostaglandin properties",
      action: "Inhibits thromboxane A2 and prostaglandins reducing inflammation and improving microvascular blood flow in rewarmed tissue",
      sideEffects: "GI bleeding, renal impairment, platelet inhibition",
      contra: "Active GI bleeding, severe renal impairment, aspirin allergy",
      pearl: "Ibuprofen is preferred over aspirin for frostbite because it inhibits tissue-damaging prostaglandins while preserving beneficial prostacyclin."
    }],
    pearls: [
      "Never rub or massage frostbitten tissue - this causes mechanical damage to ice crystal-damaged cells",
      "Do NOT rewarm if there is risk of refreezing - freeze-thaw-refreeze causes far worse tissue damage",
      "Tissue demarcation takes weeks to months; premature amputation should be avoided - 'frostbitten in January, amputate in July'"
    ],
    quiz: [
      { question: "Frostbitten tissue should be rewarmed using:", options: ["Dry heat from a heating pad", "Rubbing vigorously with hands", "Circulating warm water at 37-39°C", "Snow application followed by slow warming"], correct: 2, rationale: "Rapid rewarming in circulating 37-39°C water is the gold standard; dry heat and rubbing cause additional damage." },
      { question: "Which finding indicates deep (full-thickness) frostbite?", options: ["Numbness that resolves with rewarming", "Clear fluid-filled blisters", "Hemorrhagic blisters with no sensation", "Pink erythema after warming"], correct: 2, rationale: "Hemorrhagic blisters and absent sensation indicate full-thickness injury involving dermis and deeper structures." },
      { question: "Why should frostbitten tissue NOT be rewarmed if refreezing may occur?", options: ["Rewarming is unnecessary in the field", "Freeze-thaw-refreeze causes far worse tissue damage", "Warming should only be done in summer", "Cold tissue is already permanently damaged"], correct: 1, rationale: "Refreezing after rewarming causes additional ice crystal formation and reperfusion injury, dramatically worsening tissue damage." }
    ]
  },
  "hiv-immune-basics-rpn": {
    title: "HIV and Immune Suppression",
    cellular: {
      title: "HIV Pathophysiology and Immune System Destruction",
      content: "Human immunodeficiency virus (HIV) is a retrovirus that selectively targets CD4+ T-helper lymphocytes, the central coordinators of the adaptive immune response. HIV uses the gp120 envelope protein to bind to the CD4 receptor and CCR5/CXCR4 co-receptors, then fuses with the host cell membrane. Reverse transcriptase converts viral RNA to DNA, which integrase inserts into the host genome as a provirus. Viral replication destroys CD4+ cells through direct lysis, syncytia formation, and immune-mediated apoptosis. Untreated HIV progressively depletes CD4+ cells from normal (500-1,500 cells/mm³) to < 200 cells/mm³, defining AIDS. The acute retroviral syndrome occurs 2-4 weeks after infection with flu-like symptoms and high viral load. The clinical latency period (asymptomatic phase) lasts years but viral replication continues. Opportunistic infections emerge as CD4+ count declines: oral thrush at < 400, Pneumocystis pneumonia at < 200, Mycobacterium avium complex and CMV at < 50."
    },
    riskFactors: [
      "Unprotected sexual contact with HIV-positive partner",
      "Sharing contaminated needles for IV drug use",
      "Perinatal transmission from untreated HIV-positive mother",
      "Occupational needlestick with HIV-positive source",
      "Receipt of contaminated blood products (rare in screened supply)"
    ],
    diagnostics: [
      "HIV antibody/antigen combination (4th generation) screening test",
      "HIV RNA viral load for disease monitoring and treatment response",
      "CD4+ T-cell count for immune status assessment",
      "Genotypic resistance testing before initiating antiretroviral therapy"
    ],
    management: [
      "Initiate antiretroviral therapy (ART) as soon as diagnosed regardless of CD4 count",
      "Combination therapy with at least 3 drugs from 2+ classes to prevent resistance",
      "Prophylaxis for opportunistic infections based on CD4 thresholds",
      "Regular monitoring of viral load (goal: undetectable) and CD4 count"
    ],
    nursingActions: [
      "Apply standard precautions consistently - HIV is NOT transmitted through casual contact",
      "Educate patient on medication adherence - missing doses promotes resistance",
      "Monitor for opportunistic infections based on CD4 count thresholds",
      "Provide non-judgmental care addressing stigma and psychosocial needs",
      "Support medication adherence through pill organizers, reminders, and follow-up"
    ],
    signs: {
      left: ["CD4 count > 500 cells/mm³ with stable or rising trend", "Viral load undetectable on ART (<20 copies/mL)", "No opportunistic infections present", "Patient adherent to antiretroviral regimen"],
      right: ["CD4 count < 200 cells/mm³ (AIDS-defining criterion)", "Rising viral load indicating treatment failure or non-adherence", "Opportunistic infections (PCP, oral thrush, Kaposi sarcoma)", "Wasting syndrome and chronic diarrhea"]
    },
    medications: [{
      name: "Tenofovir/Emtricitabine/Bictegravir (Biktarvy)",
      type: "Single-tablet ART regimen (2 NRTIs + integrase inhibitor)",
      action: "Combination of nucleoside reverse transcriptase inhibitors and integrase strand transfer inhibitor blocking viral replication at multiple steps",
      sideEffects: "Nausea, headache, renal toxicity (monitor creatinine), decreased bone density",
      contra: "Concurrent use with dofetilide; renal impairment (CrCl < 30 mL/min for tenofovir)",
      pearl: "Single-tablet regimen improves adherence; undetectable viral load = untransmittable (U=U principle)."
    }],
    pearls: [
      "U=U: Undetectable equals Untransmittable - patients with sustained viral suppression do not sexually transmit HIV",
      "CD4 < 200 = AIDS and requires PCP prophylaxis with trimethoprim-sulfamethoxazole",
      "HIV is NOT transmitted through saliva, tears, sweat, casual contact, or sharing food - standard precautions are sufficient"
    ],
    quiz: [
      { question: "HIV primarily destroys which type of immune cell?", options: ["B lymphocytes", "CD4+ T-helper lymphocytes", "Neutrophils", "Natural killer cells"], correct: 1, rationale: "HIV selectively infects and destroys CD4+ T-helper cells, which are essential coordinators of the adaptive immune response." },
      { question: "AIDS is defined by a CD4+ count below:", options: ["500 cells/mm³", "350 cells/mm³", "200 cells/mm³", "100 cells/mm³"], correct: 2, rationale: "A CD4+ count below 200 cells/mm³ is an AIDS-defining criterion, indicating severe immunosuppression." },
      { question: "The U=U principle in HIV means:", options: ["Untested equals Unsafe", "Undetectable viral load equals Untransmittable", "Unvaccinated equals Unprotected", "Unmedicated equals Uncontrolled"], correct: 1, rationale: "U=U means patients with sustained undetectable viral loads on ART cannot sexually transmit HIV to their partners." }
    ]
  },
  "transplant-rejection-basics-rpn": {
    title: "Transplant Rejection Basics",
    cellular: {
      title: "Transplant Immunology and Rejection Mechanisms",
      content: "Transplant rejection occurs when the recipient's immune system recognizes donor organ tissue as foreign (non-self) through human leukocyte antigen (HLA) mismatches and mounts an immune response to destroy the graft. Hyperacute rejection occurs within minutes to hours due to pre-formed antibodies against donor HLA antigens, causing immediate vascular thrombosis and graft necrosis. Acute rejection occurs days to months post-transplant through T-cell mediated (cellular) or antibody-mediated (humoral) mechanisms, presenting with organ-specific dysfunction. Chronic rejection develops over months to years through progressive vascular changes, interstitial fibrosis, and gradual organ dysfunction. Prevention requires lifelong immunosuppressive therapy, typically a calcineurin inhibitor (tacrolimus or cyclosporine), an antiproliferative agent (mycophenolate), and corticosteroids. Balancing rejection prevention with infection and malignancy risk from immunosuppression is the central challenge of transplant care."
    },
    riskFactors: [
      "Non-compliance with immunosuppressive medication regimen",
      "Insufficient immunosuppression (subtherapeutic drug levels)",
      "Multiple HLA mismatches between donor and recipient",
      "Prior sensitization from previous transplants, transfusions, or pregnancies",
      "Infection triggering immune activation that cross-reacts with graft"
    ],
    diagnostics: [
      "Organ-specific function tests (creatinine for kidney, liver enzymes for liver, BNP/echo for heart)",
      "Immunosuppressant drug trough levels (tacrolimus, cyclosporine)",
      "Tissue biopsy for definitive rejection classification",
      "Donor-specific antibody (DSA) levels for antibody-mediated rejection"
    ],
    management: [
      "Maintain immunosuppressive therapy at prescribed doses and schedules",
      "Treat acute rejection with high-dose IV corticosteroid pulse therapy",
      "Monitor drug levels and adjust doses to maintain therapeutic range",
      "Aggressive infection prevention while maintaining adequate immunosuppression"
    ],
    nursingActions: [
      "Administer immunosuppressive medications at exact prescribed times (12-hour intervals for tacrolimus)",
      "Monitor for signs of rejection: organ-specific dysfunction (fever, tenderness, declining function)",
      "Obtain trough drug levels at correct timing (immediately before next dose)",
      "Educate patient that immunosuppressive medications are LIFELONG and must never be stopped",
      "Teach infection prevention: hand hygiene, avoiding crowds and sick contacts, food safety"
    ],
    signs: {
      left: ["Transplanted organ functioning with stable lab values", "Immunosuppressant levels within therapeutic range", "No fever or signs of rejection", "Patient adherent to medication regimen"],
      right: ["Fever and tenderness over transplanted organ", "Declining organ function (rising creatinine, elevated LFTs)", "Elevated donor-specific antibodies", "Flu-like symptoms with malaise in transplant recipient"]
    },
    medications: [{
      name: "Tacrolimus (Prograf)",
      type: "Calcineurin inhibitor immunosuppressant",
      action: "Inhibits calcineurin-dependent T-cell activation and IL-2 production, preventing T-cell mediated rejection",
      sideEffects: "Nephrotoxicity, neurotoxicity (tremor, headache), hyperglycemia, hypertension, hyperkalemia",
      contra: "Hypersensitivity to tacrolimus; requires dose adjustment for renal/hepatic impairment",
      pearl: "Therapeutic monitoring is essential (trough 5-15 ng/mL depending on time post-transplant); take at same times daily on empty stomach; avoid grapefruit."
    }],
    pearls: [
      "Immunosuppressive medications are LIFELONG - stopping or reducing without medical guidance causes rejection",
      "Tacrolimus trough levels must be drawn immediately BEFORE the next dose for accurate results",
      "Transplant patients need annual skin cancer screening due to increased malignancy risk from immunosuppression"
    ],
    quiz: [
      { question: "Hyperacute rejection occurs:", options: ["Days to weeks post-transplant", "Months to years post-transplant", "Minutes to hours post-transplant", "Only with mismatched blood types"], correct: 2, rationale: "Hyperacute rejection occurs within minutes to hours due to pre-formed antibodies causing immediate graft vascular thrombosis." },
      { question: "Tacrolimus trough levels should be drawn:", options: ["2 hours after the dose", "At peak concentration", "Immediately before the next dose", "At any random time"], correct: 2, rationale: "Trough levels (immediately before next dose) ensure the drug maintains adequate immunosuppression between doses." },
      { question: "The most common reason for transplant rejection is:", options: ["Donor organ quality", "Non-compliance with immunosuppressive medications", "Exercise", "Diet changes"], correct: 1, rationale: "Non-compliance with immunosuppressive therapy is the most common preventable cause of graft rejection." }
    ]
  },
  "allergy-hypersensitivity-types-rpn": {
    title: "Allergy and Hypersensitivity Types",
    cellular: {
      title: "Classification of Immune Hypersensitivity Reactions",
      content: "Hypersensitivity reactions are classified into four types by the Gell and Coombs system based on the immune mechanism involved. Type I (immediate/anaphylactic) is IgE-mediated mast cell degranulation occurring within minutes of allergen exposure, causing urticaria, bronchospasm, and anaphylaxis (e.g., penicillin allergy, food allergies, insect stings). Type II (cytotoxic) involves IgG or IgM antibodies directed against cell surface antigens causing complement-mediated cell destruction (e.g., hemolytic transfusion reactions, hemolytic disease of the newborn, autoimmune hemolytic anemia). Type III (immune complex) involves antigen-antibody complex deposition in tissues causing complement activation and inflammation (e.g., serum sickness, lupus nephritis, rheumatoid arthritis). Type IV (delayed/cell-mediated) is T-cell mediated occurring 24-72 hours after exposure (e.g., contact dermatitis from poison ivy, tuberculin skin test reaction, transplant rejection)."
    },
    riskFactors: [
      "Family history of atopy (allergic rhinitis, asthma, eczema)",
      "Previous allergic reaction to specific allergen",
      "Multiple medication allergies suggesting atopic predisposition",
      "Occupational exposure to allergens (latex, chemicals, animal dander)",
      "Concurrent autoimmune conditions"
    ],
    diagnostics: [
      "Skin prick testing for Type I IgE-mediated allergies",
      "Serum-specific IgE levels (ImmunoCAP) for individual allergens",
      "Direct and indirect Coombs test for Type II hemolytic reactions",
      "Patch testing for Type IV contact dermatitis identification"
    ],
    management: [
      "Allergen avoidance as primary prevention strategy",
      "Epinephrine for Type I anaphylaxis (first-line, immediate)",
      "Antihistamines for mild Type I reactions (urticaria, rhinitis)",
      "Corticosteroids for Type III and IV reactions to reduce inflammation"
    ],
    nursingActions: [
      "Document all allergies with specific reaction type and severity",
      "Apply allergy wristband and update electronic health record",
      "Observe patients for 15-30 minutes after first dose of any new medication",
      "Educate patients on allergen avoidance and carrying epinephrine auto-injectors",
      "Differentiate between true drug allergy and drug intolerance (GI upset is not allergy)"
    ],
    signs: {
      left: ["No allergic reaction after known allergen exposure (successful avoidance)", "Mild local reaction resolving with antihistamines", "Patient carries and knows how to use epinephrine auto-injector", "Allergy documentation complete and accurate"],
      right: ["Type I: urticaria, angioedema, bronchospasm, anaphylaxis (immediate)", "Type II: hemolysis with jaundice and dark urine (transfusion reaction)", "Type III: joint pain, fever, rash (serum sickness) days after exposure", "Type IV: erythematous vesicular rash at contact site 24-72 hours later"]
    },
    medications: [{
      name: "Diphenhydramine (Benadryl)",
      type: "First-generation H1 antihistamine",
      action: "Blocks H1 histamine receptors reducing pruritus, urticaria, and mild allergic symptoms",
      sideEffects: "Sedation, dry mouth, urinary retention, blurred vision, constipation",
      contra: "Acute asthma (thickens secretions), narrow-angle glaucoma, urinary retention",
      pearl: "Adjunct to epinephrine in anaphylaxis - NEVER a substitute; significant sedation limits use; use non-sedating antihistamines (cetirizine) for chronic allergies."
    }],
    pearls: [
      "Type I = Immediate (IgE, minutes), Type IV = Delayed (T-cell, 24-72 hours) - the two most commonly tested types",
      "Differentiate drug allergy (immune-mediated, potentially dangerous) from drug intolerance (non-immune, usually GI side effects)",
      "Always observe patients for 15-30 minutes after first dose of a NEW antibiotic to detect early allergic reactions"
    ],
    quiz: [
      { question: "A tuberculin skin test reaction that develops 48-72 hours after injection is an example of:", options: ["Type I hypersensitivity", "Type II hypersensitivity", "Type III hypersensitivity", "Type IV hypersensitivity"], correct: 3, rationale: "TB skin test is a classic Type IV (delayed, T-cell mediated) hypersensitivity reaction occurring 24-72 hours after exposure." },
      { question: "An acute hemolytic transfusion reaction is an example of which hypersensitivity type?", options: ["Type I", "Type II", "Type III", "Type IV"], correct: 1, rationale: "Type II (cytotoxic) involves IgG/IgM antibodies against cell surface antigens causing complement-mediated cell destruction." },
      { question: "Which hypersensitivity type is responsible for anaphylaxis?", options: ["Type I (IgE-mediated)", "Type II (cytotoxic)", "Type III (immune complex)", "Type IV (delayed)"], correct: 0, rationale: "Type I is the IgE-mediated immediate hypersensitivity responsible for anaphylaxis and acute allergic reactions." }
    ]
  },
  "lupus-basics-rpn": {
    title: "Systemic Lupus Erythematosus Basics",
    cellular: {
      title: "SLE Autoimmune Pathophysiology",
      content: "Systemic lupus erythematosus (SLE) is a chronic multisystem autoimmune disease characterized by production of autoantibodies against nuclear antigens (anti-nuclear antibodies/ANA, anti-double-stranded DNA, anti-Smith), leading to immune complex deposition and inflammation in virtually any organ system. The exact cause involves genetic predisposition, environmental triggers (UV light, infections, medications), and hormonal factors (10:1 female-to-male ratio, most common in women of childbearing age). Immune complex deposition in the kidneys causes lupus nephritis (most serious common complication), in joints causing non-erosive arthritis, in skin causing the classic malar (butterfly) rash, and in serous membranes causing pleuritis and pericarditis. Complement levels (C3, C4) decrease during active disease as complement is consumed. The disease follows a relapsing-remitting pattern with flares triggered by UV exposure, infection, stress, and medication changes."
    },
    riskFactors: [
      "Female sex, especially during childbearing years (15-45)",
      "African American, Hispanic, and Asian descent (higher incidence and severity)",
      "Family history of SLE or other autoimmune conditions",
      "UV light exposure triggering photosensitive flares",
      "Certain medications inducing drug-induced lupus (hydralazine, procainamide, isoniazid)"
    ],
    diagnostics: [
      "ANA (antinuclear antibody) - screening test (sensitive but not specific)",
      "Anti-dsDNA and anti-Smith antibodies (highly specific for SLE)",
      "Complement levels C3 and C4 (decreased during active disease)",
      "Urinalysis and renal function for lupus nephritis screening"
    ],
    management: [
      "Sun protection with SPF 30+ sunscreen and UV-protective clothing",
      "NSAIDs for joint pain and mild symptoms",
      "Hydroxychloroquine (Plaquenil) as baseline therapy for all SLE patients",
      "Corticosteroids and immunosuppressants for moderate-severe flares"
    ],
    nursingActions: [
      "Assess for multisystem involvement at each encounter (joints, skin, renal, cardiac, CNS)",
      "Monitor for lupus nephritis: urinalysis for proteinuria and hematuria",
      "Educate on sun avoidance and sunscreen use to prevent flares",
      "Assess for medication side effects especially corticosteroid complications",
      "Provide emotional support for coping with chronic, unpredictable disease"
    ],
    signs: {
      left: ["Disease in remission with normal complement levels", "No active rash or joint symptoms", "Stable renal function without proteinuria", "Patient adhering to sun protection and medication regimen"],
      right: ["Butterfly (malar) rash across cheeks and nose bridge", "Symmetric joint pain and swelling without erosion", "Proteinuria and hematuria suggesting lupus nephritis", "Fatigue, fever, and weight loss during active flare"]
    },
    medications: [{
      name: "Hydroxychloroquine (Plaquenil)",
      type: "Antimalarial immunomodulator",
      action: "Modulates immune response by inhibiting toll-like receptors and reducing cytokine production; reduces flare frequency",
      sideEffects: "Retinal toxicity (macular damage) with prolonged use, GI upset, skin hyperpigmentation",
      contra: "Pre-existing macular disease, hypersensitivity to 4-aminoquinolines",
      pearl: "All SLE patients should be on hydroxychloroquine unless contraindicated; requires annual ophthalmologic examination for retinal toxicity screening."
    }],
    pearls: [
      "The butterfly (malar) rash spares the nasolabial folds - this differentiates it from rosacea which involves the nasolabial folds",
      "Lupus nephritis is the most serious common complication - monitor urinalysis at every visit",
      "Hydroxychloroquine reduces flares, prevents organ damage, and improves survival - it should be continued even in remission"
    ],
    quiz: [
      { question: "The classic skin finding in SLE is:", options: ["Discoid rash on the trunk", "Butterfly (malar) rash across cheeks and nose", "Petechiae on extremities", "Vesicular rash on dermatomes"], correct: 1, rationale: "The butterfly/malar rash across the cheeks and bridge of the nose (sparing nasolabial folds) is the hallmark SLE skin finding." },
      { question: "Which laboratory finding indicates active SLE disease?", options: ["Elevated complement (C3, C4)", "Decreased complement (C3, C4)", "Normal ANA", "Elevated albumin"], correct: 1, rationale: "Complement is consumed during active disease, so C3 and C4 levels decrease during SLE flares." },
      { question: "All patients with SLE should take which baseline medication?", options: ["Prednisone daily", "Methotrexate weekly", "Hydroxychloroquine (Plaquenil)", "Cyclophosphamide"], correct: 2, rationale: "Hydroxychloroquine is recommended for ALL SLE patients as baseline therapy to reduce flares and organ damage." }
    ]
  },
  "immunodeficiency-basics-rpn": {
    title: "Primary Immunodeficiency Basics",
    cellular: {
      title: "Primary Immune System Defects",
      content: "Primary immunodeficiency diseases (PIDs) are inherited genetic disorders of the immune system affecting its development or function, leading to increased susceptibility to infections, autoimmunity, and malignancy. B-cell (humoral) deficiencies account for approximately 50% of PIDs and present with recurrent sinopulmonary infections from encapsulated bacteria (Streptococcus pneumoniae, Haemophilus influenzae). Selective IgA deficiency is the most common PID (1:500 prevalence), often asymptomatic but associated with recurrent mucosal infections and autoimmune diseases. Common Variable Immunodeficiency (CVID) causes low immunoglobulin levels with recurrent infections typically presenting in the 2nd-3rd decade. T-cell deficiencies present with opportunistic infections (Pneumocystis, Candida, viruses). Severe Combined Immunodeficiency (SCID) affects both B and T cells, presenting in infancy with failure to thrive, chronic diarrhea, and recurrent severe infections requiring hematopoietic stem cell transplant. Warning signs include 4+ ear infections/year, 2+ serious sinus infections/year, recurrent deep tissue infections, and family history of immunodeficiency."
    },
    riskFactors: [
      "Family history of primary immunodeficiency or early childhood deaths from infection",
      "Consanguinity (parental relatedness) increasing autosomal recessive risk",
      "Recurrent infections requiring multiple antibiotic courses",
      "Failure to thrive in infancy with chronic diarrhea",
      "Absence of tonsils or lymph nodes on physical examination"
    ],
    diagnostics: [
      "Quantitative immunoglobulin levels (IgG, IgA, IgM, IgE)",
      "Complete blood count with lymphocyte subset analysis (CD4, CD8, B-cells, NK cells)",
      "Vaccine antibody response titers to assess functional humoral immunity",
      "Genetic testing for specific PID mutations"
    ],
    management: [
      "Immunoglobulin replacement therapy (IVIG or SCIG) for antibody deficiencies",
      "Prophylactic antibiotics to prevent recurrent bacterial infections",
      "Avoid live vaccines in patients with T-cell or combined immunodeficiency",
      "Hematopoietic stem cell transplant for severe T-cell and combined deficiencies"
    ],
    nursingActions: [
      "Recognize warning signs of immunodeficiency: recurrent, severe, or unusual infections",
      "Administer IVIG as prescribed and monitor for infusion reactions",
      "Implement infection prevention measures (hand hygiene, avoid sick contacts)",
      "Verify vaccination safety before administration (no live vaccines in T-cell deficiency)",
      "Provide family education and genetic counseling referral"
    ],
    signs: {
      left: ["Immunoglobulin levels within normal range after replacement therapy", "Decreased frequency and severity of infections with treatment", "Normal growth and development in treated children", "Patient and family demonstrate infection prevention practices"],
      right: ["Recurrent otitis media, sinusitis, and pneumonia despite treatment", "Opportunistic infections suggesting T-cell deficiency", "Failure to thrive with chronic diarrhea in infants", "Absent tonsils and lymph nodes on physical exam"]
    },
    medications: [{
      name: "Intravenous Immunoglobulin (IVIG)",
      type: "Pooled human immunoglobulin replacement",
      action: "Provides passive IgG antibodies replacing deficient humoral immunity and reducing infection frequency",
      sideEffects: "Infusion reactions (headache, chills, fever), aseptic meningitis, renal toxicity, thromboembolic events",
      contra: "IgA deficiency with anti-IgA antibodies (anaphylaxis risk - use IgA-depleted product)",
      pearl: "Premedicate with acetaminophen and diphenhydramine; start infusion slowly and increase rate as tolerated; given every 3-4 weeks."
    }],
    pearls: [
      "IgA deficiency is the most common PID - many patients are asymptomatic and diagnosed incidentally",
      "Live vaccines are contraindicated in T-cell and combined immunodeficiencies - always check immune status before vaccination",
      "Warning signs: 4+ ear infections/year, 2+ months on antibiotics with poor effect, 2+ pneumonias/year, failure to thrive"
    ],
    quiz: [
      { question: "The most common primary immunodeficiency is:", options: ["SCID", "Common Variable Immunodeficiency", "Selective IgA deficiency", "DiGeorge syndrome"], correct: 2, rationale: "Selective IgA deficiency is the most common PID with a prevalence of approximately 1 in 500." },
      { question: "Which type of vaccine is contraindicated in T-cell immunodeficiency?", options: ["Inactivated vaccines", "Toxoid vaccines", "Live attenuated vaccines", "Subunit vaccines"], correct: 2, rationale: "Live vaccines can cause disseminated infection in patients with T-cell deficiency who cannot control vaccine-strain organisms." },
      { question: "IVIG replacement therapy is primarily used for patients with:", options: ["T-cell deficiency", "Antibody (B-cell) deficiency", "Neutrophil deficiency", "Complement deficiency"], correct: 1, rationale: "IVIG replaces deficient IgG antibodies in patients with B-cell/humoral immunodeficiencies." }
    ]
  },
  "gvhd-basics-rpn": {
    title: "Graft-Versus-Host Disease Basics",
    cellular: {
      title: "GVHD Immunopathology",
      content: "Graft-versus-host disease (GVHD) occurs when immunocompetent donor T-lymphocytes in transplanted tissue recognize the recipient's cells as foreign and mount an immune attack against the host's organs. GVHD most commonly occurs after allogeneic hematopoietic stem cell transplant (HSCT) but can also occur after blood transfusion in immunocompromised patients (transfusion-associated GVHD, which is nearly 100% fatal). Three conditions are required (Billingham criteria): the graft must contain immunocompetent cells, the host must express tissue antigens absent from the donor, and the host must be unable to mount an effective response to reject the donor cells. Acute GVHD (within 100 days) primarily affects skin (maculopapular rash), liver (jaundice, elevated bilirubin), and GI tract (severe diarrhea, abdominal pain). Chronic GVHD (after 100 days) resembles autoimmune diseases with scleroderma-like skin changes, sicca syndrome, and bronchiolitis obliterans."
    },
    riskFactors: [
      "HLA mismatch between donor and recipient in stem cell transplant",
      "Unrelated donor transplant (higher risk than matched sibling)",
      "Older recipient age at time of transplant",
      "Prior acute GVHD predisposing to chronic GVHD",
      "Transfusion of non-irradiated blood products to immunocompromised patients"
    ],
    diagnostics: [
      "Skin biopsy of rash for GVHD histological confirmation",
      "Liver function tests (elevated bilirubin and alkaline phosphatase)",
      "Stool volume measurement and biopsy for GI GVHD",
      "Pulmonary function tests for bronchiolitis obliterans in chronic GVHD"
    ],
    management: [
      "GVHD prophylaxis with calcineurin inhibitor + methotrexate post-transplant",
      "First-line treatment: systemic corticosteroids (methylprednisolone 1-2 mg/kg/day)",
      "Topical corticosteroids for isolated skin involvement",
      "Second-line immunosuppression for steroid-refractory GVHD"
    ],
    nursingActions: [
      "Perform daily skin assessment for new or worsening maculopapular rash",
      "Monitor stool output volume and frequency for GI GVHD",
      "Monitor liver function tests and assess for jaundice",
      "Administer GVHD prophylaxis medications at prescribed schedules",
      "Implement strict infection prevention (GVHD treatment involves increased immunosuppression)"
    ],
    signs: {
      left: ["No skin rash developing post-transplant", "Normal liver function tests", "Normal bowel function without diarrhea", "Engraftment progressing without GVHD signs"],
      right: ["Maculopapular rash starting on palms, soles, and ears", "Jaundice with elevated bilirubin (hepatic GVHD)", "Severe watery or bloody diarrhea (GI GVHD)", "Scleroderma-like skin tightening (chronic GVHD)"]
    },
    medications: [{
      name: "Methylprednisolone IV (first-line GVHD treatment)",
      type: "Systemic corticosteroid",
      action: "Suppresses T-cell activation and inflammatory cytokine production to halt graft-versus-host immune attack",
      sideEffects: "Hyperglycemia, immunosuppression, osteoporosis, mood changes, adrenal suppression",
      contra: "Active untreated infection (relative - benefits may outweigh risks in severe GVHD)",
      pearl: "Response to steroids determines prognosis; steroid-refractory GVHD has very poor outcomes; monitor glucose every 6 hours."
    }],
    pearls: [
      "Acute GVHD triad: skin rash + liver dysfunction + severe diarrhea - occurring within 100 days post-transplant",
      "Blood products for immunocompromised patients must be irradiated to prevent transfusion-associated GVHD",
      "Some degree of graft-versus-host effect (graft-versus-leukemia) is actually beneficial in preventing cancer relapse"
    ],
    quiz: [
      { question: "The three organs primarily affected by acute GVHD are:", options: ["Heart, lungs, kidneys", "Skin, liver, GI tract", "Brain, bone marrow, spleen", "Eyes, joints, muscles"], correct: 1, rationale: "Acute GVHD classically affects the skin (rash), liver (jaundice), and GI tract (diarrhea)." },
      { question: "To prevent transfusion-associated GVHD in immunocompromised patients, blood products should be:", options: ["Warmed", "Irradiated", "Filtered only", "Refrigerated extra cold"], correct: 1, rationale: "Irradiation inactivates donor lymphocytes in blood products, preventing them from attacking the immunocompromised recipient." },
      { question: "The first-line treatment for acute GVHD is:", options: ["Cyclosporine", "Systemic corticosteroids", "IVIG", "Antithymocyte globulin"], correct: 1, rationale: "Systemic corticosteroids are the established first-line treatment for acute GVHD." }
    ]
  }
};
