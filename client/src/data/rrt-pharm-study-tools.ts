export interface QuickSheetEntry {
  drug: string;
  sideEffects: string[];
  clinicalTip: string;
}

export interface ComparisonRow {
  feature: string;
  bronchodilator: string;
  controller: string;
}

export interface DeliveryDeviceRow {
  device: string;
  particleSize: string;
  lungDeposition: string;
  advantages: string;
  disadvantages: string;
  bestFor: string;
}

export interface TmcTrap {
  id: number;
  trap: string;
  wrongAnswer: string;
  correctAnswer: string;
  explanation: string;
  category: string;
}

export interface Mnemonic {
  id: number;
  name: string;
  letters: string;
  expansion: string[];
  topic: string;
  context: string;
}

export interface OneMinuteCard {
  id: number;
  title: string;
  keyFacts: string[];
  examTip: string;
  category: string;
}

export const HIGH_YIELD_SIDE_EFFECTS: QuickSheetEntry[] = [
  { drug: "Albuterol (SABA)", sideEffects: ["Tachycardia", "Tremor", "Hypokalemia", "Hyperglycemia", "Palpitations"], clinicalTip: "Monitor K+ during continuous nebulization" },
  { drug: "Ipratropium (SAMA)", sideEffects: ["Dry mouth", "Urinary retention", "Blurred vision (if in eyes)", "Constipation"], clinicalTip: "Contraindicated in narrow-angle glaucoma; use mouthpiece not mask if possible" },
  { drug: "Inhaled Corticosteroids (ICS)", sideEffects: ["Oral thrush (candidiasis)", "Dysphonia (hoarseness)", "Pharyngitis"], clinicalTip: "Always rinse mouth after use; spacer reduces oral deposition" },
  { drug: "Systemic Corticosteroids", sideEffects: ["Hyperglycemia", "Immunosuppression", "Osteoporosis", "Adrenal suppression", "Weight gain", "Mood changes"], clinicalTip: "Short burst (5-7 days) for exacerbations has fewer systemic effects" },
  { drug: "Theophylline", sideEffects: ["Tachycardia", "Seizures", "Nausea/vomiting", "Arrhythmias", "Insomnia"], clinicalTip: "Narrow therapeutic index (5-15 mcg/mL); many drug interactions" },
  { drug: "N-Acetylcysteine (NAC)", sideEffects: ["Bronchospasm", "Nausea", "Rhinorrhea", "Sulfur odor"], clinicalTip: "Always give bronchodilator before/with NAC" },
  { drug: "Racemic Epinephrine", sideEffects: ["Tachycardia", "Rebound swelling (2 hrs)", "Tremor", "Hypertension"], clinicalTip: "Monitor 2-4 hours after croup treatment for rebound" },
  { drug: "Propofol", sideEffects: ["Hypotension", "Respiratory depression", "Pain on injection", "Hypertriglyceridemia", "PRIS (with prolonged high-dose use)"], clinicalTip: "Check triglycerides q48h; count lipid calories toward nutrition" },
  { drug: "Succinylcholine", sideEffects: ["Hyperkalemia", "Fasciculations", "Malignant hyperthermia", "Bradycardia (repeat doses)", "Increased IOP/ICP"], clinicalTip: "Avoid in burns >24hr, crush injuries, denervation injuries" },
  { drug: "Furosemide (Lasix)", sideEffects: ["Hypokalemia", "Hypomagnesemia", "Metabolic alkalosis", "Ototoxicity", "Hypotension"], clinicalTip: "Initial benefit in pulmonary edema is venodilation, not diuresis" },
  { drug: "Montelukast (Singulair)", sideEffects: ["Headache", "Neuropsychiatric events (mood changes)", "Abdominal pain"], clinicalTip: "FDA Black Box Warning for neuropsychiatric events" },
  { drug: "Dexmedetomidine (Precedex)", sideEffects: ["Bradycardia", "Hypotension"], clinicalTip: "No respiratory depression — ideal for ventilator weaning" },
  { drug: "Fentanyl", sideEffects: ["Respiratory depression", "Chest wall rigidity (rapid bolus)", "Bradycardia", "Constipation", "Pruritus"], clinicalTip: "Reversed by naloxone; hemodynamically stable vs morphine" },
  { drug: "Amiodarone", sideEffects: ["Pulmonary toxicity (fibrosis)", "Thyroid dysfunction", "Hepatotoxicity", "Corneal deposits", "Photosensitivity", "Bradycardia"], clinicalTip: "Pulmonary toxicity can mimic pneumonia on CXR — RTs should know this" },
];

export const BRONCHODILATOR_VS_CONTROLLER: ComparisonRow[] = [
  { feature: "Purpose", bronchodilator: "Relieve acute symptoms (rescue)", controller: "Prevent symptoms long-term (maintenance)" },
  { feature: "Onset of Action", bronchodilator: "Minutes (5-15 min)", controller: "Days to weeks (1-2 weeks for full effect)" },
  { feature: "Mechanism", bronchodilator: "Relaxes airway smooth muscle directly", controller: "Reduces underlying inflammation" },
  { feature: "Examples", bronchodilator: "Albuterol (SABA), Ipratropium (SAMA)", controller: "Fluticasone (ICS), Montelukast (LTRA), Omalizumab (biologic)" },
  { feature: "Frequency", bronchodilator: "PRN (as needed)", controller: "Scheduled daily — even when asymptomatic" },
  { feature: "Side Effects", bronchodilator: "Tachycardia, tremor, hypokalemia", controller: "Thrush (ICS), adrenal suppression (systemic)" },
  { feature: "Key Exam Point", bronchodilator: "If SABA use > 2 days/week → step up controller", controller: "Patient must use daily even when feeling well" },
  { feature: "COPD vs Asthma", bronchodilator: "First-line in both for acute relief", controller: "ICS alone NOT first-line in COPD (use LABA/LAMA first)" },
  { feature: "Role in Exacerbation", bronchodilator: "Primary treatment — albuterol q20min x3", controller: "Add systemic steroids during exacerbation" },
  { feature: "Danger Sign", bronchodilator: "Increasing need = worsening disease", controller: "Stopping abruptly can cause rebound inflammation" },
];

export const DELIVERY_DEVICE_COMPARISON: DeliveryDeviceRow[] = [
  { device: "MDI (pHFA)", particleSize: "2-5 μm", lungDeposition: "~10-15%", advantages: "Portable, quick, no power needed", disadvantages: "Requires coordination, propellant-dependent", bestFor: "Routine maintenance therapy in compliant adults" },
  { device: "MDI + Spacer/VHC", particleSize: "2-5 μm (filtered)", lungDeposition: "~20-25%", advantages: "No coordination needed, less oropharyngeal deposition", disadvantages: "Bulkier, spacer must be cleaned", bestFor: "ICS delivery, children, elderly, poor coordination" },
  { device: "DPI (Dry Powder)", particleSize: "1-5 μm", lungDeposition: "~15-30%", advantages: "Breath-activated, no propellant, portable", disadvantages: "Requires forceful inhalation (30-60 L/min), moisture sensitive", bestFor: "Maintenance therapy in patients with good inspiratory flow" },
  { device: "SMI (Soft Mist)", particleSize: "1-5 μm", lungDeposition: "~40-50%", advantages: "Slow mist, no coordination needed, propellant-free", disadvantages: "Expensive, limited medications available", bestFor: "COPD maintenance (tiotropium), coordination issues" },
  { device: "Jet Nebulizer", particleSize: "1-5 μm", lungDeposition: "~10-15%", advantages: "No coordination, can use in severe distress", disadvantages: "Slow (10-15 min), needs power/gas source, noisy", bestFor: "Acute exacerbations, ICU, pediatrics, severe dyspnea" },
  { device: "Vibrating Mesh Neb", particleSize: "1-5 μm", lungDeposition: "~30-40%", advantages: "Efficient, quiet, battery-operated, works with suspensions", disadvantages: "Expensive, mesh can clog, requires cleaning", bestFor: "ICU/ventilator patients, CF, high-efficiency delivery" },
  { device: "Ultrasonic Nebulizer", particleSize: "2-6 μm", lungDeposition: "~15-20%", advantages: "Quiet, faster delivery than jet", disadvantages: "Cannot nebulize suspensions, heats medication", bestFor: "Sputum induction, bland aerosol therapy" },
];

export const TMC_PHARM_TRAPS: TmcTrap[] = [
  { id: 1, trap: "LABA monotherapy in asthma", wrongAnswer: "Start salmeterol alone for persistent asthma", correctAnswer: "LABAs must ALWAYS be combined with ICS in asthma", explanation: "FDA Black Box Warning: LABA monotherapy increases asthma deaths. Always pair with ICS (e.g., fluticasone/salmeterol). In COPD, LABA monotherapy is acceptable.", category: "Bronchodilators" },
  { id: 2, trap: "Giving NAC without bronchodilator pretreatment", wrongAnswer: "Nebulize NAC (Mucomyst) directly for thick secretions", correctAnswer: "Always administer bronchodilator before or with NAC", explanation: "NAC can cause bronchospasm in reactive airways patients. Standard practice: give albuterol before or mixed with NAC.", category: "Mucolytics" },
  { id: 3, trap: "Using non-selective beta-blockers in asthma/COPD", wrongAnswer: "Give propranolol to an asthmatic with tachycardia", correctAnswer: "Use cardioselective beta-1 blockers (metoprolol) if absolutely needed", explanation: "Non-selective beta-blockers block beta-2 receptors → bronchoconstriction → can trigger fatal bronchospasm. Only use cardioselective agents and monitor closely.", category: "Drug Interactions" },
  { id: 4, trap: "Confusing reliever vs controller medication roles", wrongAnswer: "Increase ICS dose during acute bronchospasm for immediate relief", correctAnswer: "Use SABA (albuterol) for acute relief; ICS prevents future episodes", explanation: "ICS takes 1-2 weeks for full effect — useless as rescue. SABA works in 5-15 minutes. If the question says 'acute' or 'immediate,' choose the bronchodilator.", category: "Asthma Management" },
  { id: 5, trap: "Forgetting mouth rinse after ICS use", wrongAnswer: "No special instructions needed for inhaled fluticasone", correctAnswer: "Rinse and spit after every ICS use to prevent oral candidiasis", explanation: "Oropharyngeal deposition of ICS causes thrush and dysphonia. Mouth rinsing reduces risk by 50%. Using a spacer also reduces oral deposition.", category: "Patient Education" },
  { id: 6, trap: "Using DPI during severe exacerbation", wrongAnswer: "Switch to DPI in patient with severe acute asthma", correctAnswer: "Use nebulizer or MDI with spacer — patient cannot generate 30-60 L/min flow for DPI", explanation: "DPIs are flow-dependent devices requiring forceful inhalation. During severe exacerbation, patients cannot generate adequate inspiratory flow. Use nebulizer or MDI with spacer.", category: "Drug Delivery" },
  { id: 7, trap: "Succinylcholine in burn patients >24 hours", wrongAnswer: "Use succinylcholine for RSI in a burn patient admitted 3 days ago", correctAnswer: "Use rocuronium — succinylcholine causes fatal hyperkalemia in burns >24 hours", explanation: "Upregulation of extrajunctional ACh receptors after burns, denervation, or immobility → massive K+ release with succinylcholine. Safe alternatives: rocuronium (reversible with sugammadex).", category: "Paralytics" },
  { id: 8, trap: "Rapid CO₂ correction in chronic retainers", wrongAnswer: "Ventilate COPD patient to normalize PaCO₂ to 40 mmHg", correctAnswer: "Target the patient's baseline PaCO₂ — rapid correction causes posthypercapnic alkalosis", explanation: "Chronic CO₂ retainers have elevated HCO₃⁻ for compensation. If you rapidly lower CO₂, the excess HCO₃⁻ remains → metabolic alkalosis → seizures, arrhythmias. Reduce PaCO₂ gradually.", category: "Ventilation" },
  { id: 9, trap: "Paralysis without sedation", wrongAnswer: "Start cisatracurium for ARDS patient — sedation can wait", correctAnswer: "ALWAYS ensure adequate sedation before initiating paralysis", explanation: "Neuromuscular blockers provide paralysis but NO sedation, analgesia, or amnesia. A paralyzed, unsedated patient experiences everything but cannot communicate — this is considered a medical error.", category: "Sedation" },
  { id: 10, trap: "Confusing nebulizer mask vs mouthpiece for anticholinergics", wrongAnswer: "Nebulize ipratropium with a face mask", correctAnswer: "Use mouthpiece for anticholinergics — mask sprays drug in eyes → blurred vision, mydriasis", explanation: "Ipratropium/tiotropium sprayed near eyes causes pupil dilation and blurred vision. In glaucoma patients, this can precipitate an acute angle-closure attack.", category: "Drug Delivery" },
  { id: 11, trap: "Theophylline with macrolide antibiotics", wrongAnswer: "Prescribe erythromycin for pneumonia in a patient on theophylline — no interaction", correctAnswer: "Macrolides inhibit CYP450 → theophylline toxicity (seizures, arrhythmias)", explanation: "Erythromycin and clarithromycin reduce theophylline clearance by up to 25-50%. Monitor theophylline levels closely or use azithromycin (minimal CYP interaction).", category: "Drug Interactions" },
  { id: 12, trap: "Treating SpO₂ instead of the patient in CO poisoning", wrongAnswer: "SpO₂ is 98% — oxygenation is adequate", correctAnswer: "SpO₂ is falsely normal in CO poisoning — the pulse oximeter reads COHb as HbO₂", explanation: "Pulse oximetry cannot distinguish carboxyhemoglobin from oxyhemoglobin. Use co-oximetry (ABG with CO-ox) for accurate measurement. Treat with 100% O₂ regardless of SpO₂.", category: "Monitoring" },
  { id: 13, trap: "Abrupt discontinuation of inhaled nitric oxide", wrongAnswer: "iNO is no longer needed — discontinue immediately", correctAnswer: "Wean iNO gradually — abrupt discontinuation causes life-threatening rebound pulmonary hypertension", explanation: "Sudden iNO removal → loss of pulmonary vasodilation → rebound vasoconstriction → acute pulmonary hypertension → right heart failure. Wean by 1 ppm increments.", category: "Critical Care" },
  { id: 14, trap: "Forgetting to count propofol lipids as nutrition", wrongAnswer: "Standard TPN while on propofol infusion — no adjustment needed", correctAnswer: "Propofol is in 10% lipid emulsion — count 1.1 kcal/mL toward daily caloric intake", explanation: "Propofol's lipid vehicle provides significant calories. At 50 mL/hr, that is 1,320 kcal/day in lipid alone. Failure to account for this causes overfeeding and hypertriglyceridemia.", category: "Sedation" },
  { id: 15, trap: "Administering albuterol without checking potassium", wrongAnswer: "Continuous albuterol nebulization is safe — just monitor heart rate", correctAnswer: "Continuous albuterol causes significant hypokalemia — monitor K⁺ every 2-4 hours", explanation: "Beta-2 stimulation drives K⁺ into cells → serum K⁺ can drop 0.5-1.0 mEq/L per hour of continuous nebulization. Hypokalemia + tachycardia → cardiac arrhythmia risk.", category: "Bronchodilators" },
  { id: 16, trap: "Using ICS as first-line in COPD", wrongAnswer: "Start inhaled fluticasone alone for newly diagnosed COPD", correctAnswer: "ICS monotherapy is NOT recommended in COPD — start with LABA and/or LAMA", explanation: "Unlike asthma, COPD inflammation is neutrophilic and less steroid-responsive. GOLD guidelines: ICS only added to LABA/LAMA if eosinophils ≥300 or frequent exacerbations. ICS alone increases pneumonia risk in COPD.", category: "COPD Management" },
  { id: 17, trap: "Naloxone for non-opioid respiratory depression", wrongAnswer: "Patient has respiratory depression from benzodiazepines — give naloxone", correctAnswer: "Naloxone only reverses opioid effects — use flumazenil for benzodiazepines (with caution)", explanation: "Naloxone is specific to opioid receptors. For benzodiazepine overdose, flumazenil is the reversal agent, but it's used cautiously due to seizure risk in chronic users. Supportive care (ventilation) is often preferred.", category: "Emergency Meds" },
  { id: 18, trap: "Mixing up racemic epinephrine rebound timing", wrongAnswer: "Discharge child with croup 30 minutes after racemic epinephrine — symptom-free", correctAnswer: "Observe 2-4 hours after racemic epi — rebound mucosal swelling occurs at 2 hours", explanation: "Racemic epinephrine's alpha-mediated vasoconstriction lasts ~2 hours. When it wears off, mucosal blood flow returns → rebound edema can cause worse airway obstruction than the initial episode.", category: "Pediatrics" },
];

export const PHARM_MNEMONICS: Mnemonic[] = [
  { id: 1, name: "SLUDGE", letters: "S-L-U-D-G-E", expansion: ["Salivation", "Lacrimation", "Urination", "Defecation", "GI distress", "Emesis"], topic: "Cholinergic (Muscarinic) Effects", context: "Remembers the effects of parasympathetic overstimulation (cholinergic crisis) — opposite of anticholinergic medications like ipratropium/atropine" },
  { id: 2, name: "MUDPILES", letters: "M-U-D-P-I-L-E-S", expansion: ["Methanol", "Uremia", "DKA", "Propylene glycol", "Isoniazid/Iron", "Lactic acidosis", "Ethylene glycol", "Salicylates"], topic: "Elevated Anion Gap Metabolic Acidosis", context: "Essential for ABG interpretation — when you see high AG metabolic acidosis, run through MUDPILES to identify the cause" },
  { id: 3, name: "B2 SHAKES", letters: "B-2 S-H-A-K-E-S", expansion: ["Beta-2 agonist side effects:", "Shaking (tremor)", "Heart racing (tachycardia)", "Anxiety", "K+ low (hypokalemia)", "Elevated glucose", "Sweating"], topic: "Beta-2 Agonist Side Effects", context: "Use this to remember albuterol and other SABA/LABA side effects — 'B2 makes you SHAKE'" },
  { id: 4, name: "DRY as a Bone", letters: "Full phrase", expansion: ["Dry mouth", "Red as a beet (flushing)", "Your pupils are dilated", "Blind as a bat (blurred vision)", "Hot as a hare (hyperthermia)", "Mad as a hatter (confusion)", "Stuffed as a drum (urinary retention/constipation)"], topic: "Anticholinergic Toxicity", context: "Opposite of SLUDGE — anticholinergic effects of atropine, ipratropium overdose, antihistamine toxicity" },
  { id: 5, name: "DUMBELS", letters: "D-U-M-B-E-L-S", expansion: ["Diarrhea", "Urination", "Miosis (pupil constriction)", "Bradycardia/Bronchospasm", "Emesis", "Lacrimation", "Salivation/Sweating"], topic: "Organophosphate/Cholinergic Toxicity", context: "Alternative to SLUDGE for remembering cholinergic crisis — adds bronchospasm and miosis which are key respiratory findings. Treat with atropine" },
  { id: 6, name: "RALES", letters: "R-A-L-E-S", expansion: ["Renal failure signs", "ACE-I cough", "Loop diuretic use", "Electrolyte monitoring (K+, Mg2+)", "Spironolactone benefit"], topic: "Heart Failure Pharmacology", context: "Key drug considerations in CHF patients on ventilator — furosemide (loop), spironolactone, ACE inhibitors all commonly seen in RT patients" },
  { id: 7, name: "3Rs of Racemic Epi", letters: "R-R-R", expansion: ["Rapid onset (1-5 minutes)", "Rebound swelling at 2 hours", "Re-observe for 2-4 hours before discharge"], topic: "Racemic Epinephrine for Croup", context: "Three critical facts about racemic epinephrine that the TMC exam loves to test — never discharge early after racemic epi" },
  { id: 8, name: "BRAND", letters: "B-R-A-N-D", expansion: ["Bronchospasm risk (with NAC)", "Rinse mouth after ICS", "Avoid DPI in severe distress", "Never stop ICS when asymptomatic", "Don't use LABA alone in asthma"], topic: "Top 5 Inhaler Safety Rules", context: "Five most commonly tested medication safety rules for respiratory pharmacology — covers the most frequent TMC trap questions" },
  { id: 9, name: "SABA LABA SAMA LAMA", letters: "Duration mnemonics", expansion: ["SABA: Short-Acting Beta Agonist (4-6 hours) — albuterol", "LABA: Long-Acting Beta Agonist (12-24 hours) — salmeterol, formoterol", "SAMA: Short-Acting Muscarinic Antagonist (4-6 hours) — ipratropium", "LAMA: Long-Acting Muscarinic Antagonist (12-24 hours) — tiotropium"], topic: "Bronchodilator Classification System", context: "The foundational classification system — S = Short, L = Long, B = Beta, M = Muscarinic. Know duration and examples for each class" },
  { id: 10, name: "NO-DESAT", letters: "N-O-D-E-S-A-T", expansion: ["Narcan (naloxone) for opioids", "Oxygen for hypoxemia", "Dextrose for hypoglycemia", "Epinephrine for anaphylaxis", "Sugammadex for rocuronium", "Atropine for bradycardia", "Thiamine before dextrose in alcoholics"], topic: "Emergency Reversal Agents", context: "Quick recall of what reverses what in emergency situations — commonly tested critical care pharmacology" },
  { id: 11, name: "FAST HUG", letters: "F-A-S-T H-U-G", expansion: ["Feeding", "Analgesia", "Sedation (target light sedation)", "Thromboprophylaxis", "Head of bed elevation (30-45°)", "Ulcer prophylaxis", "Glucose control"], topic: "ICU Daily Checklist", context: "Daily care bundle for ventilated patients — incorporates sedation assessment, mobility, and multiple pharmacology decision points" },
  { id: 12, name: "5 Rights", letters: "R-R-R-R-R", expansion: ["Right Patient", "Right Drug", "Right Dose", "Right Route", "Right Time"], topic: "Medication Administration Safety", context: "Fundamental medication safety framework — TMC frequently tests medication errors and which 'right' was violated" },
];

export const ONE_MINUTE_REVIEW_CARDS: OneMinuteCard[] = [
  { id: 1, title: "Albuterol (Ventolin)", keyFacts: ["SABA — first-line rescue bronchodilator", "MDI: 2 puffs q4-6h PRN; Neb: 2.5 mg q4-6h", "Onset 5-15 min, duration 4-6 hours", "Side effects: tachycardia, tremor, hypokalemia", "Continuous neb: 10-15 mg/hr for severe asthma"], examTip: "If question says 'acute bronchospasm' — albuterol is almost always the answer", category: "Bronchodilators" },
  { id: 2, title: "Ipratropium (Atrovent)", keyFacts: ["SAMA — anticholinergic bronchodilator", "Neb: 0.5 mg q6-8h; MDI: 2 puffs q6h", "Onset 15-30 min, duration 4-6 hours", "Combined with albuterol = DuoNeb/Combivent", "Contraindicated: narrow-angle glaucoma"], examTip: "Use mouthpiece not mask — drug in eyes causes mydriasis/blurred vision", category: "Bronchodilators" },
  { id: 3, title: "Fluticasone (Flovent)", keyFacts: ["ICS — anti-inflammatory controller", "NOT a bronchodilator — no acute relief", "Full effect in 1-2 weeks of daily use", "Side effects: thrush, dysphonia", "Must rinse mouth after every use"], examTip: "If patient has thrush with ICS — add spacer and emphasize mouth rinsing", category: "Corticosteroids" },
  { id: 4, title: "Salmeterol/Fluticasone (Advair)", keyFacts: ["LABA + ICS combination", "Maintenance only — NOT for acute rescue", "DPI or MDI formulation", "LABA component: never use alone in asthma", "Available as Advair Diskus (DPI) or HFA (MDI)"], examTip: "FDA Black Box: LABA monotherapy increases asthma deaths — always combined with ICS", category: "Combination Inhalers" },
  { id: 5, title: "N-Acetylcysteine (Mucomyst)", keyFacts: ["Mucolytic — breaks disulfide bonds in mucus", "Neb: 3-5 mL of 20% solution q6-8h", "ALWAYS give bronchodilator before/with NAC", "Also the antidote for acetaminophen OD", "Unpleasant sulfur smell/taste"], examTip: "If question mentions NAC without a bronchodilator — that's the wrong answer", category: "Mucolytics" },
  { id: 6, title: "Dornase Alfa (Pulmozyme)", keyFacts: ["DNase — cleaves DNA in purulent secretions", "2.5 mg nebulized once daily", "ONLY indicated for cystic fibrosis", "Not effective in COPD or non-CF bronchiectasis", "Reduces CF exacerbation frequency"], examTip: "Pulmozyme = Cystic Fibrosis ONLY — this is a classic distractor", category: "Mucolytics" },
  { id: 7, title: "Tiotropium (Spiriva)", keyFacts: ["LAMA — long-acting anticholinergic", "Once daily dosing (Respimat SMI or HandiHaler DPI)", "Mainstay of COPD maintenance therapy", "Also approved add-on for asthma (Step 4-5)", "Onset slow — NOT for acute rescue"], examTip: "Spiriva Respimat = 2 puffs once daily; HandiHaler = 1 capsule once daily — device matters", category: "Bronchodilators" },
  { id: 8, title: "Propofol (Diprivan)", keyFacts: ["GABA-A agonist — rapid onset sedation", "Induction: 1-2.5 mg/kg; Infusion: 5-50 mcg/kg/min", "Rapid on/off — ideal for daily wake-up trials", "PRIS risk with high dose >48 hrs", "In 10% lipid emulsion — count calories"], examTip: "If question mentions PRIS — look for metabolic acidosis, rhabdomyolysis, hyperkalemia", category: "Sedation" },
  { id: 9, title: "Rocuronium (Zemuron)", keyFacts: ["Non-depolarizing NMB — aminosteroid", "RSI dose: 1-1.2 mg/kg; onset 60-90 sec", "Duration: 30-60 minutes", "No hyperkalemia risk (unlike succinylcholine)", "Fully reversible with sugammadex"], examTip: "Rocuronium + sugammadex has replaced succinylcholine as preferred RSI combo in many centers", category: "Paralytics" },
  { id: 10, title: "Furosemide (Lasix)", keyFacts: ["Loop diuretic — Na-K-2Cl inhibitor", "IV dose: 20-80 mg; onset 5 min IV", "Used for pulmonary edema and fluid overload", "Causes hypokalemia, metabolic alkalosis", "Initial effect is venodilation (reduces preload)"], examTip: "In acute pulmonary edema: furosemide + nitroglycerin + O2 + positioning (sit upright)", category: "Diuretics" },
  { id: 11, title: "Surfactant (Survanta/Curosurf)", keyFacts: ["Replaces deficient pulmonary surfactant", "Primary indication: neonatal RDS (<34 weeks)", "Given via ETT — intratracheal instillation", "Reduces surface tension → prevents atelectasis", "Natural surfactants preferred over synthetic"], examTip: "If premature neonate + RDS + ground-glass CXR → surfactant is the answer", category: "Neonatal" },
  { id: 12, title: "Epinephrine (Adrenaline)", keyFacts: ["Non-selective adrenergic (alpha + beta)", "Anaphylaxis: 0.3-0.5 mg IM (1:1000)", "Cardiac arrest: 1 mg IV q3-5 min (1:10,000)", "Croup: racemic epi 0.5 mL of 2.25% nebulized", "Watch for rebound after racemic epi"], examTip: "IM for anaphylaxis, IV for cardiac arrest — route matters; 1:1000 IM, 1:10,000 IV", category: "Emergency" },
  { id: 13, title: "Dexmedetomidine (Precedex)", keyFacts: ["Alpha-2 agonist sedative", "Infusion: 0.2-1.5 mcg/kg/hr", "NO respiratory depression — unique advantage", "Side effects: bradycardia, hypotension", "Reduces delirium vs benzodiazepines"], examTip: "Best sedation for ventilator weaning — patient can be extubated while on it", category: "Sedation" },
  { id: 14, title: "Naloxone (Narcan)", keyFacts: ["Opioid antagonist — all opioid receptors", "Dose: 0.4-2 mg IV/IM/IN q2-3 min", "Onset: 1-2 min IV", "Duration: 30-90 min (shorter than opioids)", "Titrate to respiratory rate, not consciousness"], examTip: "If opioid OD + respiratory depression — naloxone; if benzos → flumazenil (cautiously)", category: "Emergency" },
  { id: 15, title: "Montelukast (Singulair)", keyFacts: ["Leukotriene receptor antagonist (LTRA)", "Oral, once daily at bedtime", "Add-on for asthma, exercise-induced bronchospasm", "Good for aspirin-exacerbated respiratory disease", "FDA Black Box: neuropsychiatric events"], examTip: "If question says aspirin-sensitive asthma — montelukast is a strong answer choice", category: "Anti-Inflammatory" },
  { id: 16, title: "Inhaled Nitric Oxide (iNO)", keyFacts: ["Selective pulmonary vasodilator", "Dose: 5-20 ppm", "FDA approved for PPHN in neonates", "Must wean gradually — rebound PHT if stopped abruptly", "Improves oxygenation in ARDS but not mortality"], examTip: "PPHN + hypoxemia → iNO; never abruptly discontinue", category: "Critical Care" },
];
