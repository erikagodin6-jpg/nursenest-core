import type { CareerQuestion } from "./rrt-questions";

export const paramedicQuestionsBatch10: CareerQuestion[] = [
  {
    id: "para-pharm-001",
    stem: "A paramedic is preparing to administer epinephrine to a patient in cardiac arrest. The correct dose and concentration for IV/IO administration is:",
    options: [
      "1 mg of 1:1,000 (1 mg/mL) IV push",
      "1 mg of 1:10,000 (0.1 mg/mL) IV push every 3-5 minutes",
      "0.3 mg of 1:10,000 IM",
      "0.5 mg of 1:1,000 IV push"
    ],
    correctIndex: 1,
    rationale: "The cardiac arrest dose of epinephrine is 1 mg IV/IO of 1:10,000 concentration (0.1 mg/mL = 10 mL), administered every 3-5 minutes. The 1:1,000 concentration (1 mg/mL) is used for IM injection in anaphylaxis (0.3-0.5 mg IM). Giving 1:1,000 IV can cause severe hypertension, tachyarrhythmias, and death. Concentration awareness prevents life-threatening medication errors.",
    difficulty: 3,
    category: "EMS Pharmacology",
    topic: "Cardiac Medications"
  },
  {
    id: "para-pharm-002",
    stem: "Amiodarone is classified as a Class III antiarrhythmic. Its primary mechanism of action is:",
    options: [
      "Blocking sodium channels to slow conduction",
      "Blocking potassium channels to prolong the action potential duration and refractory period",
      "Blocking calcium channels to slow AV node conduction",
      "Enhancing vagal tone to slow heart rate"
    ],
    correctIndex: 1,
    rationale: "Amiodarone primarily blocks potassium channels (Class III effect), prolonging the action potential duration and refractory period. However, it also has properties of all four Vaughan-Williams classes: sodium channel blockade (Class I), beta-blockade (Class II), and calcium channel blockade (Class IV). Cardiac arrest dose: 300 mg IV/IO push. Stable VT dose: 150 mg IV over 10 minutes. Side effects include hypotension, bradycardia, and QT prolongation.",
    difficulty: 4,
    category: "EMS Pharmacology",
    topic: "Antiarrhythmics"
  },
  {
    id: "para-pharm-003",
    stem: "A patient with an acute asthma exacerbation is receiving albuterol via nebulizer. Albuterol's mechanism of action is:",
    options: [
      "Anticholinergic bronchodilation by blocking muscarinic receptors",
      "Beta-2 adrenergic agonist causing bronchial smooth muscle relaxation",
      "Corticosteroid-mediated anti-inflammatory effect",
      "Leukotriene receptor antagonism"
    ],
    correctIndex: 1,
    rationale: "Albuterol is a selective beta-2 adrenergic agonist that relaxes bronchial smooth muscle, causing bronchodilation. Onset is 5-15 minutes via nebulization. Standard dose: 2.5 mg (0.5 mL of 0.5% solution in 2.5 mL NS) nebulized. Can be given continuously in severe cases. Side effects include tachycardia, tremor, and hypokalemia (beta-2 stimulation drives potassium intracellularly). Ipratropium (anticholinergic) provides additive bronchodilation.",
    difficulty: 2,
    category: "EMS Pharmacology",
    topic: "Respiratory Medications"
  },
  {
    id: "para-pharm-004",
    stem: "Which medication should NOT be given to a patient with a known allergy to sulfa drugs?",
    options: [
      "Amiodarone",
      "Furosemide (Lasix)",
      "Nitroglycerin",
      "Aspirin"
    ],
    correctIndex: 1,
    rationale: "Furosemide (Lasix) is a sulfonamide-based loop diuretic that may cause cross-reactivity in patients with sulfa allergies. While true cross-reactivity is debated, it should be used with caution or avoided in patients with known severe sulfonamide allergy. Bumetanide is an alternative loop diuretic with lower sulfa cross-reactivity risk. Always verify drug allergies before administration.",
    difficulty: 4,
    category: "EMS Pharmacology",
    topic: "Drug Allergies"
  },
  {
    id: "para-pharm-005",
    stem: "A patient on warfarin presents with a GI bleed and an INR of 8.2. This elevated INR indicates:",
    options: [
      "The blood is clotting too quickly",
      "The blood is excessively anticoagulated, increasing bleeding risk",
      "The patient has a normal coagulation status",
      "The patient needs a higher warfarin dose"
    ],
    correctIndex: 1,
    rationale: "An INR of 8.2 indicates dangerous over-anticoagulation. Normal INR is 0.8-1.2; therapeutic range for warfarin is typically 2.0-3.0 for most indications. INR >4.0 significantly increases bleeding risk. Prehospital management: IV access, fluid resuscitation, monitor for shock. Hospital treatment may include vitamin K (reversal agent), fresh frozen plasma, or prothrombin complex concentrate (PCC) for life-threatening bleeding.",
    difficulty: 3,
    category: "EMS Pharmacology",
    topic: "Anticoagulant Emergencies"
  },
  {
    id: "para-pharm-006",
    stem: "Nitroglycerin is contraindicated in a patient who has taken sildenafil (Viagra) within the past:",
    options: [
      "4 hours",
      "24 hours (48 hours for tadalafil)",
      "1 week",
      "There is no interaction between these drugs"
    ],
    correctIndex: 1,
    rationale: "Nitroglycerin is contraindicated within 24 hours of sildenafil/vardenafil use (48 hours for tadalafil/Cialis due to its longer half-life). Both drugs cause vasodilation — phosphodiesterase-5 inhibitors potentiate the hypotensive effects of nitrates, potentially causing life-threatening refractory hypotension. Always ask male patients about erectile dysfunction medication use before administering nitroglycerin.",
    difficulty: 2,
    category: "EMS Pharmacology",
    topic: "Drug Interactions"
  },
  {
    id: "para-pharm-007",
    stem: "The antidote for benzodiazepine overdose is:",
    options: [
      "Naloxone (Narcan)",
      "Flumazenil (Romazicon)",
      "N-acetylcysteine (Mucomyst)",
      "Atropine"
    ],
    correctIndex: 1,
    rationale: "Flumazenil is the specific benzodiazepine receptor antagonist. However, its use is controversial in the prehospital setting because it can precipitate seizures in patients with chronic benzodiazepine use (withdrawal seizures) or mixed overdoses with seizure-prone substances (tricyclic antidepressants). In most EMS systems, supportive care (airway management, BVM ventilation) is preferred over flumazenil for benzodiazepine overdose.",
    difficulty: 3,
    category: "EMS Pharmacology",
    topic: "Toxicology Antidotes"
  },
  {
    id: "para-pharm-008",
    stem: "A patient presents with organophosphate poisoning (SLUDGE symptoms). The correct atropine dosing strategy is:",
    options: [
      "Atropine 0.5 mg IV one time only",
      "Atropine 2-4 mg IV initially, doubled every 5 minutes until secretions dry (there is no maximum dose for atropine in organophosphate poisoning)",
      "Atropine 1 mg IV every 30 minutes",
      "Atropine 0.04 mg/kg IM once"
    ],
    correctIndex: 1,
    rationale: "Organophosphate poisoning requires aggressive atropine dosing: 2-4 mg IV initially, doubled every 3-5 minutes until drying of secretions is achieved. There is NO maximum dose — severely poisoned patients may require hundreds of milligrams. The endpoint is drying of pulmonary secretions, NOT pupil dilation or heart rate. Pralidoxime (2-PAM) is also given to reactivate acetylcholinesterase. Suction airway secretions aggressively.",
    difficulty: 4,
    category: "EMS Pharmacology",
    topic: "Toxicology Antidotes"
  },
  {
    id: "para-pharm-009",
    stem: "Ketamine is increasingly used in prehospital settings for all of the following EXCEPT:",
    options: [
      "Procedural sedation for RSI induction",
      "Analgesia for acute pain management",
      "Excited delirium/behavioral emergencies",
      "First-line treatment for narrow-complex SVT"
    ],
    correctIndex: 3,
    rationale: "Ketamine is a dissociative anesthetic used in EMS for RSI induction (1-2 mg/kg IV), analgesia at sub-dissociative doses (0.1-0.3 mg/kg IV or 0.5-1 mg/kg IN), and severe agitation/excited delirium (4 mg/kg IM). It preserves airway reflexes and respiratory drive, causes bronchodilation, and is hemodynamically supportive. It is NOT used for SVT — adenosine is first-line for SVT. Ketamine may cause emergence reactions and increased ICP (debated).",
    difficulty: 3,
    category: "EMS Pharmacology",
    topic: "Sedation & Analgesia"
  },
  {
    id: "para-pharm-010",
    stem: "Push-dose epinephrine for a hypotensive patient (not in cardiac arrest) is typically prepared as:",
    options: [
      "1 mg/mL (1:1,000) given 1 mL IV push",
      "10 mcg/mL concentration, given in 5-20 mcg IV boluses (0.5-2 mL)",
      "0.1 mg/mL (1:10,000) given 10 mL IV push",
      "100 mcg/mL given 1 mL IV push"
    ],
    correctIndex: 1,
    rationale: "Push-dose epinephrine for non-arrest hypotension uses a diluted concentration of approximately 10 mcg/mL. This is prepared by adding 1 mL of 1:10,000 epinephrine (100 mcg) to 9 mL of normal saline, creating 10 mcg/mL. Give 5-20 mcg (0.5-2 mL) IV every 2-5 minutes, titrating to effect. This provides a controlled vasopressor bolus for symptomatic hypotension (post-intubation, anaphylaxis refractory to IM epi, neurogenic shock).",
    difficulty: 5,
    category: "EMS Pharmacology",
    topic: "Vasopressors"
  },
  {
    id: "para-pharm-011",
    stem: "Aspirin is administered to patients with suspected acute coronary syndrome because it:",
    options: [
      "Dissolves existing blood clots (thrombolytic effect)",
      "Irreversibly inhibits cyclooxygenase (COX-1), preventing thromboxane A2 production and platelet aggregation",
      "Dilates coronary arteries",
      "Reduces blood pressure"
    ],
    correctIndex: 1,
    rationale: "Aspirin irreversibly inhibits COX-1 in platelets, preventing thromboxane A2 synthesis, which is a potent platelet aggregator and vasoconstrictor. This inhibits further platelet aggregation at the site of coronary plaque rupture. Standard dose: 162-325 mg PO (chewed for rapid absorption). Aspirin reduces mortality in acute MI by ~25%. Contraindications: known aspirin allergy, active GI bleeding, recent hemorrhagic stroke.",
    difficulty: 3,
    category: "EMS Pharmacology",
    topic: "Cardiac Medications"
  },
  {
    id: "para-pharm-012",
    stem: "Ondansetron (Zofran) is administered in the prehospital setting for:",
    options: [
      "Pain management",
      "Nausea and vomiting",
      "Seizure control",
      "Blood pressure management"
    ],
    correctIndex: 1,
    rationale: "Ondansetron is a 5-HT3 serotonin receptor antagonist used as an antiemetic for nausea and vomiting. Dose: 4 mg IV over 2-5 minutes, 4 mg IM, or 4 mg ODT (orally disintegrating tablet). It is effective for multiple causes of nausea/vomiting. Caution in patients with prolonged QT interval (ondansetron can prolong QT). Alternative antiemetics include promethazine (Phenergan) and metoclopramide (Reglan).",
    difficulty: 1,
    category: "EMS Pharmacology",
    topic: "Antiemetics"
  },
  {
    id: "para-pharm-013",
    stem: "A patient with suspected opioid overdose receives naloxone and becomes agitated, diaphoretic, with tachycardia and vomiting. This is caused by:",
    options: [
      "An allergic reaction to naloxone",
      "Acute opioid withdrawal precipitated by naloxone",
      "A second drug overdose",
      "Naloxone toxicity"
    ],
    correctIndex: 1,
    rationale: "Naloxone rapidly displaces opioids from receptor sites, which can precipitate acute withdrawal symptoms: agitation, diaphoresis, tachycardia, nausea/vomiting, diarrhea, piloerection, and potentially violent behavior. This is why naloxone should be titrated to restore adequate breathing (RR >12) rather than full consciousness. Start with 0.04-0.4 mg IV, titrating up. Higher doses (2 mg) are more likely to cause acute withdrawal.",
    difficulty: 3,
    category: "EMS Pharmacology",
    topic: "Opioid Pharmacology"
  },
  {
    id: "para-pharm-014",
    stem: "Calcium chloride 10% (1 g IV) is indicated as an emergency treatment for:",
    options: [
      "Hypoglycemia",
      "Symptomatic hyperkalemia with ECG changes (peaked T waves, widened QRS)",
      "Acute asthma exacerbation",
      "Hypertensive emergency"
    ],
    correctIndex: 1,
    rationale: "Calcium chloride (or calcium gluconate) is given IV for hyperkalemia with ECG changes to stabilize the myocardial membrane and prevent lethal dysrhythmias. Calcium does NOT lower potassium levels — it temporarily protects the heart. Additional treatments include sodium bicarbonate, nebulized albuterol (drives K+ intracellularly), insulin with glucose, and kayexalate. Calcium is also indicated for calcium channel blocker overdose and hypermagnesemia.",
    difficulty: 3,
    category: "EMS Pharmacology",
    topic: "Electrolyte Medications"
  },
  {
    id: "para-pharm-015",
    stem: "Succinylcholine, a depolarizing neuromuscular blocker used in RSI, is contraindicated in:",
    options: [
      "Patients with head injuries",
      "Patients with known or suspected hyperkalemia, burns >24 hours old, crush injuries >24 hours old, or denervation injuries",
      "Patients with hypertension",
      "Patients under 18 years of age"
    ],
    correctIndex: 1,
    rationale: "Succinylcholine causes potassium release during depolarization (typically raises K+ by 0.5-1 mEq/L). In conditions with upregulated acetylcholine receptors (burns, crush injuries, denervation, prolonged immobilization — especially >24-48 hours post-injury), massive potassium efflux can cause lethal hyperkalemia and cardiac arrest. Rocuronium (non-depolarizing) is a safer alternative in these patients. Other contraindications: personal/family history of malignant hyperthermia.",
    difficulty: 4,
    category: "EMS Pharmacology",
    topic: "Neuromuscular Blockers"
  },
  {
    id: "para-pharm-016",
    stem: "Magnesium sulfate is the preferred treatment for which of the following conditions?",
    options: [
      "Stable monomorphic ventricular tachycardia",
      "Torsades de Pointes and eclamptic seizures",
      "Atrial fibrillation with rapid ventricular response",
      "Sinus bradycardia"
    ],
    correctIndex: 1,
    rationale: "Magnesium sulfate is the specific treatment for Torsades de Pointes (1-2 g IV over 5-20 minutes for TdP, infuse faster if pulseless) and eclamptic seizures (4-6 g IV loading dose over 15-20 minutes). It stabilizes the cardiac membrane and suppresses early afterdepolarizations in TdP. In eclampsia, it acts as a CNS depressant. It is also used as an adjunct bronchodilator in severe refractory asthma.",
    difficulty: 3,
    category: "EMS Pharmacology",
    topic: "Magnesium"
  },
  {
    id: "para-pharm-017",
    stem: "A patient takes metoprolol (a beta-blocker) daily and presents with symptomatic bradycardia unresponsive to atropine. The specific antidote is:",
    options: [
      "Flumazenil",
      "Glucagon 3-5 mg IV",
      "Naloxone 2 mg IV",
      "Calcium chloride 1 g IV"
    ],
    correctIndex: 1,
    rationale: "Glucagon is the antidote for beta-blocker toxicity. It activates adenylyl cyclase through a non-beta-receptor mechanism, increasing heart rate and contractility independent of beta-receptor availability. Dose: 3-5 mg IV bolus (may repeat), followed by an infusion of 2-5 mg/hour. Glucagon commonly causes vomiting — position the patient to protect the airway. High-dose insulin euglycemic therapy (HIET) is an additional treatment for severe beta-blocker toxicity.",
    difficulty: 4,
    category: "EMS Pharmacology",
    topic: "Toxicology Antidotes"
  },
  {
    id: "para-pharm-018",
    stem: "Ipratropium bromide (Atrovent) is given with albuterol for bronchospasm because it:",
    options: [
      "Has the same mechanism of action as albuterol for additive effect",
      "Provides additional bronchodilation through anticholinergic (parasympatholytic) mechanism, blocking vagally-mediated bronchoconstriction",
      "Has anti-inflammatory properties that reduce airway swelling",
      "Prevents the side effects of albuterol"
    ],
    correctIndex: 1,
    rationale: "Ipratropium bromide is an anticholinergic bronchodilator that blocks muscarinic receptors in airway smooth muscle, preventing acetylcholine-mediated bronchoconstriction. Combined with albuterol (beta-2 agonist), it provides additive bronchodilation through a different mechanism. Standard dose: 0.5 mg nebulized with albuterol. Particularly effective in COPD exacerbations. Onset: 15-30 minutes. Minimal systemic absorption limits side effects.",
    difficulty: 3,
    category: "EMS Pharmacology",
    topic: "Respiratory Medications"
  },
  {
    id: "para-pharm-019",
    stem: "N-acetylcysteine (NAC) is the antidote for overdose of:",
    options: [
      "Aspirin",
      "Acetaminophen (Tylenol)",
      "Ibuprofen",
      "Opioids"
    ],
    correctIndex: 1,
    rationale: "N-acetylcysteine (NAC) is the specific antidote for acetaminophen (paracetamol) overdose. Acetaminophen is metabolized by the liver; in overdose, the toxic metabolite NAPQI accumulates and causes hepatic necrosis. NAC provides glutathione substrate to neutralize NAPQI. Most effective when given within 8 hours of ingestion, but may benefit up to 24+ hours. NAC can be given IV or PO. Toxic dose: >150 mg/kg or >7.5 g in adults.",
    difficulty: 3,
    category: "EMS Pharmacology",
    topic: "Toxicology Antidotes"
  },
  {
    id: "para-pharm-020",
    stem: "Dopamine at a dose of 5-10 mcg/kg/min primarily stimulates which receptors?",
    options: [
      "Alpha-1 receptors causing vasoconstriction",
      "Beta-1 receptors increasing cardiac contractility and heart rate",
      "Dopaminergic receptors causing renal vasodilation",
      "Beta-2 receptors causing bronchodilation"
    ],
    correctIndex: 1,
    rationale: "Dopamine's effects are dose-dependent: Low dose (1-5 mcg/kg/min): dopaminergic receptors — renal and mesenteric vasodilation (clinical significance debated). Medium dose (5-10 mcg/kg/min): beta-1 receptors — increased cardiac contractility and heart rate (inotropic/chronotropic). High dose (>10 mcg/kg/min): alpha-1 receptors — peripheral vasoconstriction. In practice, individual responses vary, and norepinephrine is now preferred over dopamine for most shock states.",
    difficulty: 4,
    category: "EMS Pharmacology",
    topic: "Vasopressors"
  },
  {
    id: "para-pharm-021",
    stem: "Sodium bicarbonate 8.4% (1 mEq/mL) is indicated during cardiac arrest for:",
    options: [
      "All cardiac arrest patients routinely",
      "Known or suspected hyperkalemia, tricyclic antidepressant overdose, or prolonged arrest with severe metabolic acidosis",
      "Respiratory acidosis from hypoventilation",
      "Patients with STEMI"
    ],
    correctIndex: 1,
    rationale: "Sodium bicarbonate is NOT routine in cardiac arrest. Specific indications include: pre-existing hyperkalemia, tricyclic antidepressant (TCA) overdose (sodium load treats wide QRS and hypotension from sodium channel blockade), pre-existing metabolic acidosis, and prolonged arrest with documented severe acidosis. Dose: 1 mEq/kg IV. It does NOT treat respiratory acidosis — adequate ventilation does. Excessive bicarb causes alkalosis, hypokalemia, and paradoxical intracellular acidosis.",
    difficulty: 4,
    category: "EMS Pharmacology",
    topic: "Cardiac Arrest Medications"
  },
  {
    id: "para-pharm-022",
    stem: "The initial dose of adenosine for stable SVT in an adult is:",
    options: [
      "12 mg slow IV push over 2 minutes",
      "6 mg rapid IV push followed immediately by 20 mL NS flush",
      "3 mg rapid IV push",
      "0.5 mg IV push"
    ],
    correctIndex: 1,
    rationale: "Adenosine initial dose is 6 mg rapid IV push (as fast as possible — adenosine has a half-life of <10 seconds) followed immediately by a 20 mL NS rapid flush. Use the IV site closest to the heart (antecubital or above). If no effect after 1-2 minutes, give 12 mg rapid IV push. A third dose of 12 mg may be given. Adenosine works by briefly blocking AV node conduction to terminate reentrant SVT. Side effects include transient asystole, chest tightness, and flushing.",
    difficulty: 2,
    category: "EMS Pharmacology",
    topic: "Antiarrhythmics"
  },
  {
    id: "para-pharm-023",
    stem: "A patient being treated for an allergic reaction receives diphenhydramine (Benadryl). This medication is classified as a:",
    options: [
      "Beta-2 agonist",
      "First-generation H1 antihistamine",
      "Leukotriene receptor antagonist",
      "Corticosteroid"
    ],
    correctIndex: 1,
    rationale: "Diphenhydramine is a first-generation H1 antihistamine that competitively blocks histamine at H1 receptors, reducing itching, urticaria, and mild allergic symptoms. Dose: 25-50 mg IV/IM/PO. It is an adjunct in anaphylaxis — NOT a replacement for epinephrine. Side effects include sedation (crosses blood-brain barrier), dry mouth, urinary retention, and tachycardia (anticholinergic effects). In anaphylaxis, epinephrine is always given first.",
    difficulty: 2,
    category: "EMS Pharmacology",
    topic: "Antihistamines"
  },
  {
    id: "para-pharm-024",
    stem: "Fentanyl is preferred over morphine in the prehospital setting because:",
    options: [
      "Fentanyl is less potent and therefore safer",
      "Fentanyl has faster onset, shorter duration, minimal histamine release, and better hemodynamic stability",
      "Fentanyl has no risk of respiratory depression",
      "Fentanyl can only be given orally"
    ],
    correctIndex: 1,
    rationale: "Fentanyl (50-100x more potent than morphine mcg for mcg) is preferred prehospitally because it has: rapid onset (1-2 min IV, 5-10 min IN), shorter duration (30-60 min), minimal histamine release (less hypotension), and better hemodynamic stability. It can be given IV, IN, IM, or nebulized. Dose: 1 mcg/kg IV/IN. It DOES cause respiratory depression — monitor closely. Intranasal delivery provides non-IV analgesia within minutes.",
    difficulty: 3,
    category: "EMS Pharmacology",
    topic: "Sedation & Analgesia"
  },
  {
    id: "para-pharm-025",
    stem: "Dextrose 50% (D50) is administered for severe hypoglycemia. If given too rapidly or extravasates, it can cause:",
    options: [
      "Hyperkalemia",
      "Tissue necrosis and venous sclerosis at the injection site",
      "Bronchospasm",
      "Seizures"
    ],
    correctIndex: 1,
    rationale: "D50 is a hypertonic solution (osmolarity ~2,525 mOsm/L vs. normal ~290 mOsm/L). Extravasation causes severe tissue necrosis due to hyperosmolar injury. Rapid IV push can cause venous sclerosis and phlebitis. Best administered through a large, patent IV in a large vein. An alternative is D10 (10% dextrose), which is less hyperosmolar, causes less tissue damage if extravasated, and allows better titration (give 100-250 mL D10 instead of 50 mL D50).",
    difficulty: 3,
    category: "EMS Pharmacology",
    topic: "Dextrose Administration"
  },
  {
    id: "para-pharm-026",
    stem: "A patient with COPD exacerbation is receiving continuous albuterol nebulization. Which electrolyte abnormality should the paramedic monitor for?",
    options: [
      "Hyperkalemia",
      "Hypokalemia",
      "Hypernatremia",
      "Hypocalcemia"
    ],
    correctIndex: 1,
    rationale: "Beta-2 agonists (albuterol) stimulate the sodium-potassium ATPase pump, driving potassium into cells and potentially causing hypokalemia. This is especially concerning with continuous or high-dose nebulization. Hypokalemia can cause muscle weakness, cardiac dysrhythmias (U waves, flattened T waves, ST depression), and cardiac arrest. Monitor ECG for signs of hypokalemia during prolonged albuterol therapy.",
    difficulty: 3,
    category: "EMS Pharmacology",
    topic: "Drug Side Effects"
  },
  {
    id: "para-pharm-027",
    stem: "Rocuronium is preferred over succinylcholine for RSI in which clinical scenario?",
    options: [
      "When the shortest possible paralysis duration is desired",
      "When the patient has a history of renal failure with suspected hyperkalemia",
      "When intubation must be performed within 30 seconds",
      "When the patient has no contraindications to either drug"
    ],
    correctIndex: 1,
    rationale: "Rocuronium (non-depolarizing NMB) is preferred in patients with suspected hyperkalemia, burns, crush injuries, or malignant hyperthermia history because it does NOT cause potassium release. Dose: 1-1.2 mg/kg IV for RSI. Duration: 45-60 minutes (longer than succinylcholine's 5-10 minutes). Sugammadex can reverse rocuronium if needed. Succinylcholine's faster onset (45 sec vs 60 sec) is a minor advantage that is outweighed by safety concerns in high-risk patients.",
    difficulty: 4,
    category: "EMS Pharmacology",
    topic: "Neuromuscular Blockers"
  },
  {
    id: "para-pharm-028",
    stem: "The MOST dangerous side effect of rapid IV phenytoin (Dilantin) administration is:",
    options: [
      "Headache",
      "Hypotension and cardiac dysrhythmias (including bradycardia and asystole)",
      "Nausea and vomiting",
      "Dizziness"
    ],
    correctIndex: 1,
    rationale: "Rapid IV phenytoin can cause severe hypotension, bradycardia, heart block, and cardiac arrest due to the propylene glycol diluent and phenytoin's cardiac sodium channel blocking properties. Maximum infusion rate is 50 mg/min in adults (25 mg/min in elderly). Fosphenytoin (Cerebyx) is a prodrug with fewer cardiovascular side effects and faster infusion rate. Cardiac monitoring is required during phenytoin infusion.",
    difficulty: 4,
    category: "EMS Pharmacology",
    topic: "Anticonvulsants"
  },
  {
    id: "para-pharm-029",
    stem: "Activated charcoal is indicated for which type of poisoning?",
    options: [
      "Acid or alkali ingestion",
      "Recent oral ingestion of most drugs/chemicals within 1-2 hours, when the patient can protect their airway",
      "Iron overdose",
      "Ethanol intoxication"
    ],
    correctIndex: 1,
    rationale: "Activated charcoal (1 g/kg PO, max 50 g) adsorbs many drugs and chemicals in the GI tract, reducing systemic absorption. Most effective within 1 hour of ingestion. Contraindications: altered mental status (aspiration risk), corrosive/caustic ingestion, hydrocarbons, metals (iron, lithium, lead), ethanol. Patient must be alert with intact airway reflexes. NOT effective for: iron, lithium, potassium, ethanol, methanol, ethylene glycol, or acids/alkalis.",
    difficulty: 3,
    category: "EMS Pharmacology",
    topic: "Toxicology Treatment"
  },
  {
    id: "para-pharm-030",
    stem: "A patient in anaphylactic shock is not responding to IM epinephrine (two doses given). The next escalation in epinephrine therapy is:",
    options: [
      "Continue IM epinephrine at the same dose indefinitely",
      "IV epinephrine infusion (1-10 mcg/min) or push-dose epinephrine (10-20 mcg IV boluses)",
      "Switch to subcutaneous epinephrine",
      "Administer epinephrine via nebulizer only"
    ],
    correctIndex: 1,
    rationale: "Refractory anaphylaxis unresponsive to IM epinephrine requires IV epinephrine escalation. Options include push-dose epinephrine (10-20 mcg IV boluses every 1-2 minutes) or an epinephrine infusion (1-10 mcg/min, titrated to response). IV epinephrine requires cardiac monitoring and close BP monitoring due to risk of dysrhythmias and severe hypertension. Adjuncts include aggressive IV fluids (1-2 L crystalloid), glucagon (for patients on beta-blockers), and vasopressors.",
    difficulty: 5,
    category: "EMS Pharmacology",
    topic: "Anaphylaxis Pharmacology"
  },
  {
    id: "para-pharm-031",
    stem: "Midazolam (Versed) can be administered via which routes in the prehospital setting?",
    options: [
      "IV only",
      "IV, IM, intranasal (IN), and buccal",
      "Subcutaneous only",
      "Rectal only"
    ],
    correctIndex: 1,
    rationale: "Midazolam is versatile in its routes of administration: IV (0.05-0.1 mg/kg for sedation, 0.1-0.2 mg/kg for seizures), IM (0.1-0.2 mg/kg), intranasal via MAD device (0.2 mg/kg), and buccal (placed between cheek and gum). The intranasal and IM routes are particularly valuable when IV access is delayed, such as in active seizures. Midazolam is water-soluble, making it well-absorbed via all routes. Monitor for respiratory depression.",
    difficulty: 2,
    category: "EMS Pharmacology",
    topic: "Benzodiazepines"
  },
  {
    id: "para-pharm-032",
    stem: "Nitroglycerin's primary therapeutic effect in acute coronary syndrome is:",
    options: [
      "Dissolving coronary artery clots",
      "Venous dilation (preload reduction), reducing myocardial oxygen demand, and coronary artery vasodilation",
      "Increasing heart rate to improve cardiac output",
      "Blocking platelet aggregation"
    ],
    correctIndex: 1,
    rationale: "Nitroglycerin releases nitric oxide, causing smooth muscle relaxation. Its primary effects include: venodilation (reduces preload and ventricular wall stress), coronary vasodilation (improves blood flow to ischemic myocardium), and mild arterial dilation (reduces afterload). These effects decrease myocardial oxygen demand while improving supply. Dose: 0.4 mg SL every 5 minutes (max 3 doses). Contraindications: SBP <90, RV MI, phosphodiesterase inhibitor use.",
    difficulty: 3,
    category: "EMS Pharmacology",
    topic: "Cardiac Medications"
  },
  {
    id: "para-pharm-033",
    stem: "A patient with acute pulmonary edema (CHF exacerbation) is in severe respiratory distress. Along with CPAP, which medication directly reduces preload and improves symptoms rapidly?",
    options: [
      "Albuterol nebulization",
      "Nitroglycerin (high-dose: 0.4-0.8 mg SL or IV infusion)",
      "Amiodarone 150 mg IV",
      "Calcium chloride 1 g IV"
    ],
    correctIndex: 1,
    rationale: "High-dose nitroglycerin is a cornerstone of acute pulmonary edema treatment. It rapidly reduces preload (venodilation) and afterload, decreasing pulmonary congestion. Aggressive nitroglycerin dosing (0.4-0.8 mg SL, repeated frequently, or IV infusion 10-200 mcg/min) combined with CPAP (10-12 cmH2O) provides rapid symptom relief. Furosemide (Lasix) has slower onset and primarily helps with diuresis. Morphine is no longer routinely recommended due to potential harm.",
    difficulty: 3,
    category: "EMS Pharmacology",
    topic: "Heart Failure Medications"
  },
  {
    id: "para-pharm-034",
    stem: "The paramedic administers thiamine 100 mg IV to an alcoholic patient BEFORE giving dextrose. This is done to prevent:",
    options: [
      "Anaphylaxis",
      "Wernicke encephalopathy (acute thiamine deficiency exacerbated by glucose administration)",
      "Hypoglycemic rebound",
      "Insulin resistance"
    ],
    correctIndex: 1,
    rationale: "Glucose metabolism requires thiamine (vitamin B1) as a cofactor. In thiamine-depleted patients (chronic alcoholism, malnutrition), administering glucose without thiamine can precipitate or worsen Wernicke encephalopathy (confusion, ophthalmoplegia, ataxia), which can progress to irreversible Korsakoff syndrome (permanent memory impairment). Give thiamine 100 mg IV before or concurrently with dextrose in suspected thiamine deficiency.",
    difficulty: 3,
    category: "EMS Pharmacology",
    topic: "Vitamin Supplementation"
  },
  {
    id: "para-pharm-035",
    stem: "Lidocaine 2% jelly is applied to the nares before nasotracheal intubation primarily to:",
    options: [
      "Prevent infection",
      "Provide local anesthesia and lubrication to facilitate tube passage and reduce patient discomfort",
      "Prevent bronchospasm",
      "Increase the diameter of the nares"
    ],
    correctIndex: 1,
    rationale: "Lidocaine jelly applied to the nares provides topical anesthesia (numbing the highly vascular and sensitive nasal mucosa) and lubrication (facilitating smooth tube passage and reducing trauma/epistaxis). For nasotracheal intubation, adequate topicalization of the airway is essential to prevent gagging, laryngospasm, and sympathetic stimulation. Vasoconstrictive agents (oxymetazoline or phenylephrine spray) may also be used to reduce bleeding.",
    difficulty: 2,
    category: "EMS Pharmacology",
    topic: "Topical Anesthetics"
  },
  {
    id: "para-pharm-039",
    stem: "Vasopressin is used in cardiac arrest as an alternative to epinephrine. Its mechanism of action is:",
    options: [
      "Beta-1 adrenergic stimulation increasing heart rate",
      "V1 receptor stimulation causing potent peripheral vasoconstriction independent of adrenergic receptors",
      "Calcium channel blockade slowing AV node conduction",
      "Parasympathetic stimulation reducing heart rate"
    ],
    correctIndex: 1,
    rationale: "Vasopressin (antidiuretic hormone) causes potent vasoconstriction via V1 receptors on vascular smooth muscle. Unlike epinephrine, it works independently of adrenergic receptors, which may be downregulated in prolonged arrest or acidosis. Current AHA guidelines allow vasopressin 40 units IV as a replacement for the first or second dose of epinephrine. However, it has been de-emphasized in recent guidelines as it shows no outcome benefit over epinephrine alone.",
    difficulty: 4,
    category: "EMS Pharmacology",
    topic: "Cardiac Arrest Medications"
  },
  {
    id: "para-pharm-040",
    stem: "Labetalol is used in hypertensive emergencies because it provides:",
    options: [
      "Selective alpha-1 blockade only",
      "Combined alpha-1 and beta-1/beta-2 blockade for controlled BP reduction",
      "Calcium channel blockade only",
      "ACE inhibition for long-term BP control"
    ],
    correctIndex: 1,
    rationale: "Labetalol provides combined alpha-1 blockade (vasodilation, reducing afterload) and non-selective beta-blockade (reducing heart rate, contractility, and renin release). This dual mechanism allows controlled blood pressure reduction without reflex tachycardia. Dose: 10-20 mg IV over 2 minutes, may repeat/double every 10 minutes (max 300 mg). It is particularly useful for hypertensive emergencies including aortic dissection, stroke, and eclampsia.",
    difficulty: 4,
    category: "EMS Pharmacology",
    topic: "Antihypertensives"
  },
  {
    id: "para-pharm-041",
    stem: "Which medication is contraindicated in patients with Wolff-Parkinson-White (WPW) syndrome who develop atrial fibrillation?",
    options: [
      "Amiodarone",
      "Adenosine, verapamil, and digoxin (AV nodal blocking agents)",
      "Procainamide",
      "Lidocaine"
    ],
    correctIndex: 1,
    rationale: "In WPW with atrial fibrillation, AV nodal blocking agents (adenosine, verapamil, diltiazem, digoxin, beta-blockers) are DANGEROUS because blocking the AV node preferentially conducts impulses down the accessory pathway, potentially triggering ventricular fibrillation. Treatment for WPW with A-fib: procainamide IV (slows accessory pathway conduction) or cardioversion if unstable. Amiodarone, while having some AV nodal blocking properties, is less clearly contraindicated.",
    difficulty: 5,
    category: "EMS Pharmacology",
    topic: "Antiarrhythmics"
  },
  {
    id: "para-pharm-042",
    stem: "The drug of choice for symptomatic supraventricular tachycardia in a pregnant patient is:",
    options: [
      "Amiodarone 150 mg IV",
      "Adenosine 6 mg rapid IV push (same as non-pregnant patients)",
      "Verapamil 5 mg IV",
      "Lidocaine 1 mg/kg IV"
    ],
    correctIndex: 1,
    rationale: "Adenosine is the first-line treatment for SVT in pregnancy, using the same dose as non-pregnant patients (6 mg rapid IV push, may repeat 12 mg). Adenosine has an ultra-short half-life (<10 seconds) and does not cross the placenta in significant amounts, making it safe in pregnancy. Cardioversion is also safe if needed for unstable patients. Amiodarone is relatively contraindicated in pregnancy due to fetal thyroid toxicity.",
    difficulty: 3,
    category: "EMS Pharmacology",
    topic: "Pregnancy Pharmacology"
  },
  {
    id: "para-pharm-043",
    stem: "A patient presents with methanol ingestion. The specific antidote is:",
    options: [
      "N-acetylcysteine",
      "Fomepizole (Antizol) or ethanol — both inhibit alcohol dehydrogenase",
      "Naloxone",
      "Activated charcoal"
    ],
    correctIndex: 1,
    rationale: "Methanol (wood alcohol) is metabolized by alcohol dehydrogenase to formaldehyde and formic acid, which cause blindness and metabolic acidosis. Fomepizole (4-methylpyrazole) is the preferred antidote — it competitively inhibits alcohol dehydrogenase, preventing toxic metabolite formation. Ethanol is an alternative that works via the same mechanism but requires closer monitoring. Treatment also includes sodium bicarbonate for acidosis and hemodialysis for severe poisoning. Same treatment applies for ethylene glycol (antifreeze) poisoning.",
    difficulty: 4,
    category: "EMS Pharmacology",
    topic: "Toxicology Antidotes"
  },
  {
    id: "para-pharm-044",
    stem: "Nebulized epinephrine (racemic or L-epinephrine) is indicated in the prehospital setting for:",
    options: [
      "Cardiac arrest",
      "Moderate-to-severe croup with stridor at rest",
      "Hypertensive emergency",
      "Diabetic ketoacidosis"
    ],
    correctIndex: 1,
    rationale: "Nebulized racemic epinephrine (0.5 mL of 2.25% in 3 mL NS) or L-epinephrine (0.5 mL/kg of 1:1,000, max 5 mL) is used for moderate-to-severe croup with stridor at rest. It causes mucosal vasoconstriction, reducing subglottic edema and improving air exchange. Onset is rapid (within minutes). Rebound worsening can occur after 1-2 hours, so patients who receive nebulized epinephrine should be transported for observation even if they improve.",
    difficulty: 3,
    category: "EMS Pharmacology",
    topic: "Respiratory Medications"
  },
  {
    id: "para-pharm-045",
    stem: "Norepinephrine is the first-line vasopressor for septic shock because it:",
    options: [
      "Only increases heart rate",
      "Provides potent alpha-1 vasoconstriction with moderate beta-1 cardiac stimulation, raising MAP without significant tachycardia",
      "Causes bronchodilation",
      "Has no cardiac effects"
    ],
    correctIndex: 1,
    rationale: "Norepinephrine is preferred in septic shock because it provides strong alpha-1 vasoconstriction (counteracting sepsis-induced vasodilation) with moderate beta-1 effects (maintaining cardiac output) without significant beta-2 stimulation. This raises mean arterial pressure (MAP) effectively while causing less tachycardia and arrhythmogenicity compared to dopamine. Target MAP ≥65 mmHg. Typical dose range: 0.1-0.5 mcg/kg/min IV infusion, titrated to effect.",
    difficulty: 4,
    category: "EMS Pharmacology",
    topic: "Vasopressors"
  },
  {
    id: "para-pharm-046",
    stem: "The pediatric dose of amiodarone for pulseless VF/VT arrest is:",
    options: [
      "300 mg IV push (same as adult)",
      "5 mg/kg IV/IO push (max 300 mg for first dose)",
      "150 mg IV over 10 minutes",
      "1 mg/kg IV push"
    ],
    correctIndex: 1,
    rationale: "The pediatric amiodarone dose for pulseless VF/VT is 5 mg/kg IV/IO push (maximum 300 mg). It may be repeated up to a total of 15 mg/kg/day. For stable VT with a pulse, the same dose (5 mg/kg) is given as a slow infusion over 20-60 minutes. Amiodarone is given after the third shock in the pediatric cardiac arrest algorithm, along with continued CPR and epinephrine every 3-5 minutes.",
    difficulty: 3,
    category: "EMS Pharmacology",
    topic: "Pediatric Pharmacology"
  },
  {
    id: "para-pharm-047",
    stem: "A paramedic administers a medication through a mucosal atomization device (MAD). This route of administration is called:",
    options: [
      "Intravenous",
      "Intranasal (IN)",
      "Sublingual",
      "Intramuscular"
    ],
    correctIndex: 1,
    rationale: "The mucosal atomization device (MAD) delivers medication as a fine mist to the highly vascular nasal mucosa for rapid systemic absorption. Commonly used IN medications in EMS include: naloxone (2-4 mg), midazolam (0.2 mg/kg), fentanyl (1.5 mcg/kg), glucagon (3 mg Baqsimi), and ketamine (3-4 mg/kg). Advantages: no IV required, rapid absorption, non-invasive. Limitations: volume restriction (~1 mL per nostril), and nasal congestion/bleeding reduces absorption.",
    difficulty: 1,
    category: "EMS Pharmacology",
    topic: "Medication Routes"
  },
  {
    id: "para-pharm-048",
    stem: "The maximum recommended total dose of lidocaine during cardiac arrest is:",
    options: [
      "1 mg/kg",
      "3 mg/kg",
      "10 mg/kg",
      "There is no maximum dose"
    ],
    correctIndex: 1,
    rationale: "Lidocaine can be used as an alternative to amiodarone for shock-refractory VF/pVT. Initial dose: 1-1.5 mg/kg IV/IO push. Additional doses of 0.5-0.75 mg/kg IV can be given every 5-10 minutes. The maximum total dose is 3 mg/kg. Lidocaine works by blocking sodium channels, suppressing ventricular ectopy and raising the fibrillation threshold. Side effects of toxicity include: perioral numbness, tinnitus, confusion, seizures, and cardiac depression.",
    difficulty: 3,
    category: "EMS Pharmacology",
    topic: "Antiarrhythmics"
  },
  {
    id: "para-pharm-049",
    stem: "Dexamethasone is administered in croup primarily to:",
    options: [
      "Provide immediate bronchodilation",
      "Reduce airway inflammation and edema over 2-6 hours, preventing return visits and hospitalization",
      "Kill the viral pathogen causing croup",
      "Reduce fever"
    ],
    correctIndex: 1,
    rationale: "Dexamethasone (0.6 mg/kg PO/IM, max 16 mg) is a corticosteroid that reduces subglottic inflammation and edema in croup. Unlike nebulized epinephrine (which provides immediate but temporary relief), dexamethasone has a delayed onset (2-6 hours) but sustained effect (up to 72 hours with a single dose). It reduces the need for hospitalization and return visits. It does not have antiviral properties and is not an immediate bronchodilator.",
    difficulty: 2,
    category: "EMS Pharmacology",
    topic: "Pediatric Medications"
  }
];
