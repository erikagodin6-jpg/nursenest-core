import { ParamedicQuestion } from "./types";

interface QuestionTemplate {
  stemTemplate: string;
  optionsTemplate: string[];
  correctAnswer: number;
  rationaleTemplate: string;
  learningObjective: string;
  blueprintCategory: string;
  subtopic: string;
  difficulty: number;
  cognitiveLevel: string;
  questionType: string;
  examTrap: string;
  clinicalPearls: string[];
  safetyNote: string;
  distractorRationales: string[];
}

interface DrugData {
  name: string;
  classType: string;
  indication: string;
  dose: string;
  route: string;
  contraindications: string;
  sideEffects: string;
  mechanism: string;
  onset: string;
  pearl: string;
}

interface VitalPattern {
  scenario: string;
  hr: string;
  bp: string;
  rr: string;
  spo2: string;
  condition: string;
  intervention: string;
}

interface ECGPattern {
  rhythm: string;
  rate: string;
  pWaves: string;
  prInterval: string;
  qrs: string;
  treatment: string;
  urgency: string;
}

export const PARAMEDIC_DRUGS: DrugData[] = [
  { name: "Epinephrine 1:10,000", classType: "Sympathomimetic", indication: "Cardiac arrest", dose: "1 mg IV/IO every 3-5 minutes", route: "IV/IO", contraindications: "None in cardiac arrest", sideEffects: "Tachycardia, hypertension, dysrhythmias", mechanism: "Alpha and beta adrenergic agonist increasing SVR and heart rate", onset: "Immediate IV", pearl: "Do not delay epinephrine for shockable rhythms — give after 2nd shock" },
  { name: "Epinephrine 1:1,000", classType: "Sympathomimetic", indication: "Anaphylaxis", dose: "0.3-0.5 mg IM (adult)", route: "IM (anterolateral thigh)", contraindications: "None in anaphylaxis", sideEffects: "Tachycardia, tremor, anxiety", mechanism: "Alpha-1 vasoconstriction reverses hypotension; Beta-2 bronchodilation reverses bronchospasm", onset: "3-5 minutes IM", pearl: "IM injection in the lateral thigh has faster absorption than subcutaneous or deltoid" },
  { name: "Amiodarone", classType: "Antidysrhythmic (Class III)", indication: "VF/pulseless VT refractory to defibrillation", dose: "300 mg IV/IO first dose, 150 mg second dose", route: "IV/IO", contraindications: "Cardiogenic shock, severe sinus node dysfunction", sideEffects: "Hypotension, bradycardia, QT prolongation", mechanism: "Blocks potassium, sodium, and calcium channels; prolongs action potential", onset: "Minutes to hours for full effect", pearl: "Mix in D5W only — precipitates in normal saline" },
  { name: "Adenosine", classType: "Antidysrhythmic", indication: "Stable narrow-complex SVT", dose: "6 mg rapid IV push, then 12 mg if needed", route: "IV (proximal site, rapid push with flush)", contraindications: "2nd/3rd degree heart block, sick sinus syndrome, wide-complex tachycardia of unknown origin", sideEffects: "Brief asystole, flushing, chest pressure, dyspnea", mechanism: "Slows AV node conduction, briefly interrupting reentry circuits", onset: "Seconds (half-life 10 seconds)", pearl: "Must be given rapid IV push followed by 20 mL NS flush — use a stopcock or proximal IV port" },
  { name: "Atropine", classType: "Anticholinergic (Parasympatholytic)", indication: "Symptomatic bradycardia", dose: "0.5 mg IV every 3-5 minutes, max 3 mg", route: "IV/IO", contraindications: "Not recommended for infranodal (Mobitz II or 3rd degree) blocks", sideEffects: "Tachycardia, dry mouth, urinary retention, mydriasis", mechanism: "Blocks vagal (parasympathetic) tone at the SA and AV nodes, increasing heart rate", onset: "1-2 minutes", pearl: "Doses less than 0.5 mg can cause paradoxical bradycardia" },
  { name: "Naloxone (Narcan)", classType: "Opioid antagonist", indication: "Opioid overdose with respiratory depression", dose: "0.4-2 mg IV/IM/IN, titrate to respiratory effort", route: "IV/IM/IN", contraindications: "Use caution in opioid-dependent patients", sideEffects: "Acute withdrawal symptoms, nausea, vomiting, agitation, pulmonary edema", mechanism: "Competitive antagonist at mu, kappa, and delta opioid receptors", onset: "1-2 min IV, 2-5 min IM/IN", pearl: "Titrate to respiratory effort, not full consciousness — prevents acute withdrawal and combativeness" },
  { name: "Aspirin", classType: "Antiplatelet", indication: "Suspected acute coronary syndrome", dose: "324 mg (4 × 81 mg tablets) chewed", route: "PO (chewed, not swallowed whole)", contraindications: "True aspirin allergy, active GI bleeding", sideEffects: "GI upset, bleeding risk", mechanism: "Irreversibly inhibits cyclooxygenase, preventing thromboxane A2 and platelet aggregation", onset: "15-30 minutes when chewed", pearl: "Must be CHEWED for rapid buccal absorption — swallowing whole delays onset significantly" },
  { name: "Nitroglycerin", classType: "Vasodilator (Nitrate)", indication: "Chest pain/ACS with SBP >90 mmHg", dose: "0.4 mg SL every 5 minutes, max 3 doses", route: "Sublingual", contraindications: "SBP <90 mmHg, RV infarct, PDE-5 inhibitor use within 24-48 hours", sideEffects: "Hypotension, headache, reflex tachycardia", mechanism: "Relaxes vascular smooth muscle via nitric oxide, reducing preload and myocardial oxygen demand", onset: "1-3 minutes SL", pearl: "Contraindicated with phosphodiesterase-5 inhibitors (sildenafil, tadalafil) — can cause profound refractory hypotension" },
  { name: "Albuterol (Salbutamol)", classType: "Beta-2 agonist bronchodilator", indication: "Bronchospasm (asthma, COPD, anaphylaxis)", dose: "2.5 mg nebulized, may repeat", route: "Nebulized inhalation", contraindications: "Hypersensitivity", sideEffects: "Tachycardia, tremor, palpitations, hypokalemia", mechanism: "Stimulates beta-2 receptors in bronchial smooth muscle causing bronchodilation", onset: "5-15 minutes", pearl: "Can be given continuously in severe bronchospasm — 'continuous neb' or 'back-to-back' treatments" },
  { name: "Midazolam (Versed)", classType: "Benzodiazepine", indication: "Seizures, sedation for procedures, RSI", dose: "2-5 mg IV/IM for seizures; 0.1-0.2 mg/kg IV for sedation", route: "IV/IM/IN", contraindications: "Acute narrow-angle glaucoma, shock, respiratory depression", sideEffects: "Respiratory depression, hypotension, paradoxical agitation", mechanism: "Enhances GABA-A receptor activity, increasing chloride conductance and CNS depression", onset: "1-3 min IV, 5 min IM, 3-5 min IN", pearl: "Intranasal route (IN) is excellent for seizing patients without IV access — use concentrated formulation" },
  { name: "Fentanyl", classType: "Opioid analgesic", indication: "Severe pain, RSI adjunct", dose: "1-2 mcg/kg IV/IN for pain; 1-3 mcg/kg IV for RSI", route: "IV/IM/IN", contraindications: "Respiratory depression, hemodynamic instability", sideEffects: "Respiratory depression, hypotension, chest wall rigidity (at high doses)", mechanism: "Binds mu-opioid receptors in the CNS, modulating pain perception", onset: "1-2 min IV, 5-10 min IN", pearl: "Chest wall rigidity (wooden chest syndrome) can occur with rapid high-dose IV push — treat with naloxone or succinylcholine" },
  { name: "Ketamine", classType: "Dissociative anesthetic", indication: "Pain management, RSI induction, excited delirium", dose: "0.1-0.3 mg/kg IV for pain; 1-2 mg/kg IV for RSI; 4 mg/kg IM for sedation", route: "IV/IM/IN", contraindications: "Uncontrolled hypertension, known psychosis (relative)", sideEffects: "Emergence reactions, laryngospasm, increased secretions, hypertension", mechanism: "NMDA receptor antagonist producing dissociative anesthesia with preserved airway reflexes", onset: "30-60 sec IV, 3-5 min IM", pearl: "Preserves airway reflexes and respiratory drive better than other induction agents — preferred in hypotensive patients" },
  { name: "Succinylcholine", classType: "Depolarizing neuromuscular blocker", indication: "RSI — rapid paralysis for intubation", dose: "1-1.5 mg/kg IV, 3-4 mg/kg IM", route: "IV/IM", contraindications: "Hyperkalemia, burn/crush >24hrs old, malignant hyperthermia history, denervation injuries", sideEffects: "Hyperkalemia, fasciculations, malignant hyperthermia, bradycardia", mechanism: "Depolarizes the neuromuscular junction causing initial fasciculations then paralysis", onset: "30-60 sec IV, 2-3 min IM", pearl: "Fastest onset of any paralytic — duration only 5-10 minutes, but contraindicated in hyperkalemia (causes additional K+ release)" },
  { name: "Rocuronium", classType: "Non-depolarizing neuromuscular blocker", indication: "RSI alternative when succinylcholine contraindicated", dose: "1-1.2 mg/kg IV for RSI", route: "IV", contraindications: "Known hypersensitivity", sideEffects: "Prolonged paralysis (40-60 min), histamine release (rare)", mechanism: "Competitively blocks acetylcholine at the neuromuscular junction without depolarizing", onset: "60-90 seconds", pearl: "Longer duration than succinylcholine (40-60 min vs 5-10 min) — if intubation fails, patient remains paralyzed longer; reversible with sugammadex" },
  { name: "Dopamine", classType: "Sympathomimetic (dose-dependent)", indication: "Cardiogenic shock, symptomatic bradycardia (2nd line)", dose: "2-20 mcg/kg/min IV infusion", route: "IV infusion", contraindications: "Pheochromocytoma, uncorrected tachyarrhythmias", sideEffects: "Tachycardia, dysrhythmias, tissue necrosis if extravasation", mechanism: "Dose-dependent: low dose (2-5) = dopaminergic; moderate (5-10) = beta-1; high (10-20) = alpha-1", onset: "2-5 minutes", pearl: "At doses >10 mcg/kg/min, alpha effects dominate — essentially becomes a vasopressor similar to norepinephrine" },
  { name: "Norepinephrine (Levophed)", classType: "Vasopressor", indication: "Septic shock, cardiogenic shock", dose: "0.1-0.5 mcg/kg/min IV infusion, titrate to MAP >65", route: "IV infusion (central line preferred)", contraindications: "Hypovolemia (correct volume first)", sideEffects: "Tissue necrosis if extravasation, hypertension, reflex bradycardia, limb ischemia", mechanism: "Potent alpha-1 agonist with mild beta-1 activity — increases SVR and MAP", onset: "1-2 minutes", pearl: "First-line vasopressor for septic shock per Surviving Sepsis Campaign — always correct hypovolemia first" },
  { name: "Dextrose 50% (D50)", classType: "Hypertonic glucose solution", indication: "Symptomatic hypoglycemia (BGL <60 mg/dL)", dose: "25 g (50 mL of D50) IV push", route: "IV only (highly irritating)", contraindications: "None in symptomatic hypoglycemia", sideEffects: "Tissue necrosis if extravasation, hyperglycemia, phlebitis", mechanism: "Directly raises blood glucose by providing exogenous glucose substrate", onset: "1-3 minutes", pearl: "Dilute to D10 (mix 50mL D50 in 250mL NS) for pediatric patients or when peripheral vein extravasation is a concern" },
  { name: "Glucagon", classType: "Pancreatic hormone", indication: "Hypoglycemia when IV access unavailable, beta-blocker/calcium channel blocker overdose", dose: "1 mg IM/IN for hypoglycemia; 3-5 mg IV for beta-blocker overdose", route: "IM/IV/IN", contraindications: "Pheochromocytoma, insulinoma", sideEffects: "Nausea, vomiting, hyperglycemia", mechanism: "Stimulates hepatic glycogenolysis; in overdose, increases intracellular cAMP bypassing beta-receptors", onset: "5-10 min IM, 1-2 min IV", pearl: "Only works if hepatic glycogen stores are present — may be ineffective in malnourished, alcoholic, or chronically fasting patients" },
  { name: "Magnesium Sulfate", classType: "Electrolyte/Anticonvulsant", indication: "Eclamptic seizures, torsades de pointes, severe asthma (refractory)", dose: "4-6 g IV over 20 min (eclampsia); 1-2 g IV over 5-20 min (torsades); 2 g IV over 20 min (asthma)", route: "IV infusion", contraindications: "Heart block, myasthenia gravis, renal failure (relative)", sideEffects: "Hypotension, respiratory depression, loss of deep tendon reflexes (toxicity sign)", mechanism: "Stabilizes cell membranes, blocks NMDA receptors, relaxes smooth muscle, suppresses calcium-mediated dysrhythmias", onset: "5-15 minutes", pearl: "Loss of deep tendon reflexes is the earliest sign of magnesium toxicity — check patellar reflex before each dose" },
  { name: "Calcium Chloride", classType: "Electrolyte", indication: "Hyperkalemia, calcium channel blocker overdose, hypermagnesemia", dose: "500-1000 mg (5-10 mL of 10%) slow IV push", route: "IV (central line preferred due to tissue necrosis risk)", contraindications: "Hypercalcemia, digoxin toxicity (relative — can worsen)", sideEffects: "Bradycardia (if given too rapidly), tissue necrosis if extravasation", mechanism: "Directly antagonizes the membrane effects of hyperkalemia on the myocardium; stabilizes cardiac cell membranes", onset: "1-3 minutes", pearl: "Calcium chloride contains 3× more elemental calcium than calcium gluconate — preferred in cardiac arrest/critical situations" },
  { name: "Sodium Bicarbonate", classType: "Alkalinizing agent", indication: "Severe metabolic acidosis, hyperkalemia, TCA overdose", dose: "1 mEq/kg IV push", route: "IV", contraindications: "Metabolic or respiratory alkalosis, hypokalemia", sideEffects: "Metabolic alkalosis, hypernatremia, hypokalemia, tissue necrosis if extravasation", mechanism: "Buffers hydrogen ions, raises serum pH; in hyperkalemia, shifts potassium intracellularly", onset: "2-10 minutes", pearl: "In TCA overdose, the goal is serum pH of 7.50-7.55 — sodium bicarb widens the QRS by increasing sodium gradient across cardiac cell membranes" },
  { name: "Lidocaine 2%", classType: "Amide local anesthetic / Antidysrhythmic (Class Ib)", indication: "VF/VT (alternative to amiodarone), local/regional anesthesia", dose: "1-1.5 mg/kg IV for dysrhythmia; varies for local anesthesia", route: "IV/IO for dysrhythmia; local injection for anesthesia", contraindications: "High-degree heart blocks, severe liver disease, known lidocaine allergy", sideEffects: "CNS toxicity (perioral numbness, tinnitus, seizures), bradycardia", mechanism: "Blocks sodium channels in cardiac tissue (reduces automaticity) and peripheral nerves (blocks pain signal conduction)", onset: "1-2 min IV", pearl: "Perioral numbness and metallic taste are the earliest signs of lidocaine toxicity — stop infusion immediately" },
  { name: "Ondansetron (Zofran)", classType: "Antiemetic (5-HT3 antagonist)", indication: "Nausea and vomiting", dose: "4 mg IV/IM/ODT", route: "IV/IM/PO (ODT)", contraindications: "Known QT prolongation, congenital long QT syndrome", sideEffects: "Headache, QT prolongation, constipation", mechanism: "Blocks serotonin 5-HT3 receptors in the CTZ and vagal afferents, preventing nausea signaling", onset: "5-10 min IV, 15-30 min PO", pearl: "Can prolong QT interval — use caution with other QT-prolonging medications and in patients with existing cardiac conduction abnormalities" },
  { name: "Activated Charcoal", classType: "Adsorbent", indication: "Acute oral poisoning/overdose (within 1 hour of ingestion)", dose: "1 g/kg PO (typical adult dose 50-100 g)", route: "PO (mixed with water)", contraindications: "Caustic ingestion (acids/alkalis), hydrocarbon ingestion, altered mental status/unable to protect airway, GI obstruction", sideEffects: "Vomiting, aspiration risk, constipation, black stools", mechanism: "Adsorbs toxins in the GI tract, preventing systemic absorption", onset: "Immediate (prevents absorption)", pearl: "Most effective within 1 hour of ingestion — efficacy decreases significantly after this window; does NOT adsorb alcohols, iron, lithium, or caustics" },
  { name: "Ipratropium (Atrovent)", classType: "Anticholinergic bronchodilator", indication: "COPD exacerbation, severe asthma (adjunct to albuterol)", dose: "0.5 mg nebulized (often combined with albuterol)", route: "Nebulized inhalation", contraindications: "Soy or peanut allergy (some formulations), glaucoma (nebulized)", sideEffects: "Dry mouth, cough, blurred vision (if contacts eye)", mechanism: "Blocks muscarinic receptors in bronchial smooth muscle, preventing parasympathetic-mediated bronchoconstriction", onset: "15-30 minutes (peak 1-2 hours)", pearl: "Combined albuterol + ipratropium (DuoNeb) provides additive bronchodilation through different mechanisms — standard for severe COPD and asthma" },
];

export const VITAL_PATTERNS: VitalPattern[] = [
  { scenario: "A 62-year-old male with crushing substernal chest pain, diaphoresis, and jaw pain", hr: "110", bp: "88/54", rr: "24", spo2: "92%", condition: "Cardiogenic shock from STEMI", intervention: "12-lead ECG, aspirin, IV access, fluid challenge if no crackles, notify cath lab" },
  { scenario: "A 25-year-old female with sudden onset severe allergic reaction after bee sting, hives, facial swelling, and stridor", hr: "130", bp: "76/40", rr: "28", spo2: "88%", condition: "Anaphylactic shock", intervention: "Epinephrine 0.3 mg IM, high-flow O2, IV NS bolus, albuterol if wheezing" },
  { scenario: "A 45-year-old male found unresponsive with pinpoint pupils and respirations of 4/min", hr: "55", bp: "90/60", rr: "4", spo2: "78%", condition: "Opioid overdose with respiratory failure", intervention: "BVM ventilation, naloxone 0.4-2 mg IV/IN titrated to respiratory effort" },
  { scenario: "An 8-month-old infant with fever, barking cough, inspiratory stridor, and intercostal retractions", hr: "160", bp: "N/A", rr: "44", spo2: "93%", condition: "Moderate croup with impending respiratory failure", intervention: "Nebulized epinephrine, blow-by oxygen, keep child calm with caregiver, transport" },
  { scenario: "A 70-year-old female on warfarin who fell and now has right-sided hemiparesis and slurred speech, last known well 90 minutes ago", hr: "88", bp: "178/98", rr: "16", spo2: "97%", condition: "Acute ischemic stroke within thrombolytic window", intervention: "Cincinnati Stroke Scale, check blood glucose, establish IV, stroke alert to receiving facility, do NOT lower BP" },
  { scenario: "A 55-year-old diabetic male found confused and diaphoretic, blood glucose 38 mg/dL", hr: "100", bp: "138/82", rr: "20", spo2: "98%", condition: "Severe hypoglycemia", intervention: "D50 25g IV if access available; glucagon 1 mg IM if no access; recheck BGL in 5 min" },
  { scenario: "A 30-year-old male with a gunshot wound to the right chest, absent breath sounds on the right, JVD, and tracheal deviation to the left", hr: "135", bp: "70/40", rr: "32", spo2: "82%", condition: "Tension pneumothorax", intervention: "Needle decompression right 2nd ICS MCL or 4th ICS AAL, then reassess" },
  { scenario: "A 40-year-old female at 38 weeks gestation with seizures, severe hypertension, and proteinuria", hr: "105", bp: "190/110", rr: "22", spo2: "95%", condition: "Eclampsia", intervention: "Magnesium sulfate 4-6g IV over 20 min, position left lateral, high-flow O2, transport to L&D" },
];

export const ECG_PATTERNS: ECGPattern[] = [
  { rhythm: "Ventricular Fibrillation", rate: "Indeterminate", pWaves: "None visible", prInterval: "N/A", qrs: "Chaotic, no organized complexes", treatment: "Immediate defibrillation, CPR, epinephrine, amiodarone", urgency: "Immediately life-threatening" },
  { rhythm: "Ventricular Tachycardia (pulseless)", rate: "150-300 bpm", pWaves: "None visible (dissociated if present)", prInterval: "N/A", qrs: "Wide (>0.12 sec), regular, monomorphic", treatment: "Defibrillation, CPR, epinephrine, amiodarone", urgency: "Immediately life-threatening" },
  { rhythm: "Ventricular Tachycardia (with pulse, stable)", rate: "150-250 bpm", pWaves: "May be dissociated", prInterval: "N/A", qrs: "Wide (>0.12 sec), regular", treatment: "Amiodarone 150 mg IV over 10 min, consider synchronized cardioversion if unstable", urgency: "Urgent — may deteriorate to pulseless VT/VF" },
  { rhythm: "Supraventricular Tachycardia (SVT)", rate: "150-220 bpm", pWaves: "Usually buried in preceding T wave", prInterval: "Cannot be measured", qrs: "Narrow (<0.12 sec), regular", treatment: "Vagal maneuvers, then adenosine 6mg rapid IVP (then 12mg if needed)", urgency: "Stable but symptomatic" },
  { rhythm: "Atrial Fibrillation", rate: "Variable (often 100-180 if rapid)", pWaves: "Absent — fibrillatory baseline", prInterval: "N/A", qrs: "Narrow, irregularly irregular", treatment: "Rate control (diltiazem if stable), cardioversion if unstable", urgency: "Urgent if rapid ventricular response with hemodynamic compromise" },
  { rhythm: "Atrial Flutter", rate: "Atrial 300, ventricular variable (often 150 with 2:1 block)", pWaves: "Sawtooth flutter waves", prInterval: "N/A", qrs: "Narrow, regular (if fixed block ratio)", treatment: "Rate control or synchronized cardioversion", urgency: "Moderate — depends on ventricular rate and symptoms" },
  { rhythm: "Third-Degree (Complete) Heart Block", rate: "Atrial normal (60-100), ventricular slow (20-40)", pWaves: "Present but march through independently (AV dissociation)", prInterval: "Variable — no relationship between P waves and QRS", qrs: "May be narrow (junctional escape) or wide (ventricular escape)", treatment: "Transcutaneous pacing, atropine unlikely to help, dopamine infusion", urgency: "High — risk of asystole" },
  { rhythm: "Torsades de Pointes", rate: "150-300 bpm", pWaves: "None visible", prInterval: "N/A", qrs: "Wide, polymorphic — twists around the baseline", treatment: "Magnesium sulfate 1-2g IV, defibrillation if pulseless, correct underlying QT prolongation", urgency: "Life-threatening — may degenerate to VF" },
  { rhythm: "Sinus Bradycardia", rate: "< 60 bpm", pWaves: "Normal, upright in lead II, one before each QRS", prInterval: "0.12-0.20 sec", qrs: "Narrow (<0.12 sec)", treatment: "If symptomatic: atropine 0.5 mg IV, transcutaneous pacing if refractory", urgency: "Low if asymptomatic; high if symptomatic (hypotension, AMS)" },
  { rhythm: "Second-Degree Type II (Mobitz II)", rate: "Variable, usually slow", pWaves: "More P waves than QRS complexes, regular P-P intervals", prInterval: "Constant for conducted beats (no progressive prolongation)", qrs: "May be wide, dropped beats without warning", treatment: "Transcutaneous pacing (atropine usually ineffective), prepare for transvenous pacing", urgency: "High — may progress to complete heart block without warning" },
];

export function generateDrugQuestion(drug: DrugData, variant: number): ParamedicQuestion {
  const variants: ParamedicQuestion[] = [
    {
      stem: `A paramedic is preparing to administer ${drug.name} for ${drug.indication}. What is the correct dose and route?`,
      options: [
        `${drug.dose} via ${drug.route}`,
        `Double the standard dose via oral route`,
        `Half the standard dose via subcutaneous route`,
        `10 mg IV push over 2 minutes`
      ],
      correctAnswer: 0,
      rationaleLong: `The correct dose of ${drug.name} for ${drug.indication} is ${drug.dose} via ${drug.route}. ${drug.name} is classified as a ${drug.classType}. Its mechanism of action involves: ${drug.mechanism}. The expected onset of action is ${drug.onset}. Key contraindications include: ${drug.contraindications}. Common side effects include: ${drug.sideEffects}. Clinical pearl: ${drug.pearl}. Giving an incorrect dose or via the wrong route can result in either therapeutic failure or dangerous adverse effects. Paramedics must memorize standard dosing for all medications in their formulary.`,
      learningObjective: `Recall the correct dosing and route for ${drug.name}`,
      blueprintCategory: "Pharmacology",
      subtopic: "Drug Calculations",
      difficulty: 1,
      cognitiveLevel: "recall",
      questionType: "multiple-choice",
      examTrap: `Students may confuse the dose or route of ${drug.name} with similar medications`,
      clinicalPearls: [`${drug.name} dose: ${drug.dose}`, `Route: ${drug.route}`, drug.pearl],
      safetyNote: `Contraindications for ${drug.name}: ${drug.contraindications}`,
      distractorRationales: ["Doubling the dose risks toxicity and adverse effects", "Subcutaneous route provides unpredictable absorption for this medication", "10 mg IV is not the standard dose for this medication"]
    },
    {
      stem: `Which of the following is a contraindication to administering ${drug.name}?`,
      options: [
        drug.contraindications.split(",")[0] || drug.contraindications,
        "Mild headache",
        "History of seasonal allergies",
        "Age over 50 years"
      ],
      correctAnswer: 0,
      rationaleLong: `${drug.name} (${drug.classType}) is contraindicated in the following situations: ${drug.contraindications}. Understanding contraindications is essential because administering a medication to a patient with a contraindication can cause serious harm. ${drug.name} works by: ${drug.mechanism}. This mechanism explains why it is contraindicated in certain situations — the drug's effects could worsen the underlying condition. Common side effects include: ${drug.sideEffects}. The onset of action is ${drug.onset}. Clinical pearl: ${drug.pearl}.`,
      learningObjective: `Identify contraindications for ${drug.name}`,
      blueprintCategory: "Pharmacology",
      subtopic: drug.classType.includes("Opioid") ? "Sedation/Analgesia" : drug.classType.includes("blocker") ? "RSI Medications" : drug.classType.includes("Vasopressor") || drug.classType.includes("Sympathomimetic") ? "Vasopressors" : "Cardiac Drugs",
      difficulty: 2,
      cognitiveLevel: "recall",
      questionType: "multiple-choice",
      examTrap: `Students must differentiate true contraindications from relative precautions for ${drug.name}`,
      clinicalPearls: [`Contraindications: ${drug.contraindications}`, `Mechanism: ${drug.mechanism}`, drug.pearl],
      safetyNote: `Always screen for contraindications before administering ${drug.name}`,
      distractorRationales: ["Mild headache is not a contraindication", "Seasonal allergies do not contraindicate this medication", "Age alone is not a contraindication"]
    },
    {
      stem: `A patient presents with ${drug.indication}. After administering ${drug.name}, which side effect should the paramedic monitor for?`,
      options: [
        drug.sideEffects.split(",")[0] || drug.sideEffects,
        "Improved oxygen saturation",
        "Decreased pain without any adverse effects",
        "No physiological changes expected"
      ],
      correctAnswer: 0,
      rationaleLong: `After administering ${drug.name} for ${drug.indication}, the paramedic should monitor for the following side effects: ${drug.sideEffects}. These side effects are related to the drug's mechanism of action: ${drug.mechanism}. The onset of action is ${drug.onset}, so monitoring should begin immediately after administration. While the therapeutic goal is to address ${drug.indication}, understanding expected adverse effects allows the paramedic to intervene early if complications develop. Clinical pearl: ${drug.pearl}. All medications have the potential for adverse effects, and expecting 'no physiological changes' demonstrates a fundamental misunderstanding of pharmacology.`,
      learningObjective: `Identify expected side effects after administering ${drug.name}`,
      blueprintCategory: "Pharmacology",
      subtopic: drug.classType.includes("Opioid") ? "Sedation/Analgesia" : drug.classType.includes("blocker") ? "RSI Medications" : "Cardiac Drugs",
      difficulty: 2,
      cognitiveLevel: "application",
      questionType: "multiple-choice",
      examTrap: `Students may focus on the therapeutic effect and forget to monitor for adverse effects of ${drug.name}`,
      clinicalPearls: [`Side effects: ${drug.sideEffects}`, `Onset: ${drug.onset}`, drug.pearl],
      safetyNote: `Monitor vital signs closely after administering ${drug.name}, especially for ${drug.sideEffects.split(",")[0]}`,
      distractorRationales: ["Improved SpO2 is a therapeutic goal, not a side effect", "All medications have potential adverse effects", "Physiological changes are expected with any medication administration"]
    },
    {
      stem: `What is the mechanism of action of ${drug.name}?`,
      options: [
        drug.mechanism,
        "Blocks all receptor types nonspecifically causing sedation",
        "Directly stimulates the vagus nerve to alter heart rate",
        "Inhibits prostaglandin synthesis in the renal system"
      ],
      correctAnswer: 0,
      rationaleLong: `${drug.name} is a ${drug.classType} that works by: ${drug.mechanism}. Understanding the mechanism of action is critical because it explains both the therapeutic effects and the adverse effects. For ${drug.indication}, this mechanism produces the desired clinical response. The drug's onset is ${drug.onset} via the ${drug.route} route. Side effects (${drug.sideEffects}) are directly related to this mechanism of action. Clinical pearl: ${drug.pearl}. Knowledge of drug mechanisms helps paramedics predict drug interactions, anticipate complications, and make informed clinical decisions.`,
      learningObjective: `Explain the mechanism of action of ${drug.name}`,
      blueprintCategory: "Pharmacology",
      subtopic: drug.classType.includes("Vasopressor") ? "Vasopressors" : drug.classType.includes("Antidote") || drug.name.includes("Naloxone") || drug.name.includes("Charcoal") ? "Antidotes" : "Cardiac Drugs",
      difficulty: 3,
      cognitiveLevel: "recall",
      questionType: "multiple-choice",
      examTrap: `Students may confuse the mechanism of ${drug.name} with drugs from a similar class`,
      clinicalPearls: [`Mechanism: ${drug.mechanism}`, `Class: ${drug.classType}`, drug.pearl],
      safetyNote: `The mechanism of ${drug.name} explains its contraindication in: ${drug.contraindications}`,
      distractorRationales: ["Nonspecific receptor blockade does not describe this drug's action", "Vagal nerve stimulation is not the primary mechanism of this drug", "Prostaglandin inhibition is not the mechanism of this medication"]
    },
    {
      stem: `A paramedic student asks about the clinical significance of the onset of action for ${drug.name}. The expected onset when given via ${drug.route} is:`,
      options: [
        drug.onset,
        "30-45 minutes",
        "2-4 hours",
        "6-8 hours"
      ],
      correctAnswer: 0,
      rationaleLong: `The onset of action for ${drug.name} when given via ${drug.route} is ${drug.onset}. This is clinically important because it determines when the paramedic should expect to see a therapeutic response and when to consider repeating the dose or changing the treatment plan. ${drug.name} is a ${drug.classType} used for ${drug.indication}. The drug works by: ${drug.mechanism}. Knowing the onset helps differentiate between a treatment that hasn't had enough time to work versus a treatment that is failing. Clinical pearl: ${drug.pearl}.`,
      learningObjective: `State the onset of action for ${drug.name}`,
      blueprintCategory: "Pharmacology",
      subtopic: "Routes of Administration",
      difficulty: 1,
      cognitiveLevel: "recall",
      questionType: "multiple-choice",
      examTrap: `Students may not know the difference in onset between IV, IM, and other routes for ${drug.name}`,
      clinicalPearls: [`Onset: ${drug.onset}`, `Route: ${drug.route}`, drug.pearl],
      safetyNote: `If no response within the expected onset time for ${drug.name}, reassess the patient and consider alternative diagnoses or treatments`,
      distractorRationales: ["30-45 minutes is much longer than the expected onset", "2-4 hours is typical of oral medications, not this route", "6-8 hours is far too long for an emergency medication"]
    }
  ];
  return variants[variant % variants.length];
}

export function generateECGQuestion(ecg: ECGPattern, variant: number): ParamedicQuestion {
  const variants: ParamedicQuestion[] = [
    {
      stem: `A 12-lead ECG shows the following: Rate ${ecg.rate}, P waves: ${ecg.pWaves}, QRS: ${ecg.qrs}. What rhythm is this?`,
      options: [
        ecg.rhythm,
        variant % 3 === 0 ? "Normal sinus rhythm" : variant % 3 === 1 ? "Atrial fibrillation" : "Sinus tachycardia",
        variant % 2 === 0 ? "Junctional rhythm" : "Idioventricular rhythm",
        "Premature ventricular complexes"
      ],
      correctAnswer: 0,
      rationaleLong: `This ECG demonstrates ${ecg.rhythm}. The key identifying features are: Rate ${ecg.rate}, P waves: ${ecg.pWaves}, PR interval: ${ecg.prInterval}, QRS: ${ecg.qrs}. This rhythm is classified as ${ecg.urgency}. The appropriate treatment is: ${ecg.treatment}. Systematic ECG interpretation using the rate-rhythm-P waves-PR interval-QRS approach helps paramedics reliably identify dysrhythmias. Each feature narrows the differential and guides treatment decisions according to ACLS algorithms.`,
      learningObjective: `Identify ${ecg.rhythm} on a 12-lead ECG`,
      blueprintCategory: "Cardiac/ACLS",
      subtopic: "Dysrhythmia Recognition",
      difficulty: 2,
      cognitiveLevel: "application",
      questionType: "multiple-choice",
      examTrap: `Students may confuse ${ecg.rhythm} with similar-appearing rhythms`,
      clinicalPearls: [`${ecg.rhythm}: Rate ${ecg.rate}`, `QRS: ${ecg.qrs}`, `P waves: ${ecg.pWaves}`],
      safetyNote: `${ecg.rhythm} is ${ecg.urgency} — ensure appropriate treatment is initiated promptly`,
      distractorRationales: ["This rhythm does not meet the criteria for the other options based on rate, P waves, and QRS characteristics", "The rhythm regularity and P wave morphology differentiate it from this distractor", "The QRS width and rate pattern do not match this alternative"]
    },
    {
      stem: `A patient presents with ${ecg.rhythm} on the monitor. What is the MOST appropriate initial treatment?`,
      options: [
        ecg.treatment.split(",")[0] || ecg.treatment,
        "Observation only — no treatment needed",
        "Oral beta-blocker and discharge",
        "Carotid massage for 30 seconds"
      ],
      correctAnswer: 0,
      rationaleLong: `The appropriate treatment for ${ecg.rhythm} is: ${ecg.treatment}. This rhythm is classified as ${ecg.urgency}. The ECG characteristics include: Rate ${ecg.rate}, P waves: ${ecg.pWaves}, PR interval: ${ecg.prInterval}, QRS: ${ecg.qrs}. Treatment follows ACLS guidelines and is determined by the patient's hemodynamic stability and the specific rhythm identified. Observation alone is inappropriate for rhythms that are hemodynamically significant. Oral medications are too slow for acute dysrhythmia management. Carotid massage is only indicated for stable narrow-complex SVT, not for all dysrhythmias.`,
      learningObjective: `Select the appropriate treatment for ${ecg.rhythm}`,
      blueprintCategory: "Cardiac/ACLS",
      subtopic: "ACLS Algorithms",
      difficulty: 3,
      cognitiveLevel: "application",
      questionType: "multiple-choice",
      examTrap: `Students must match the correct ACLS algorithm to ${ecg.rhythm}`,
      clinicalPearls: [`Treatment: ${ecg.treatment}`, `Urgency: ${ecg.urgency}`, `Key feature: ${ecg.qrs}`],
      safetyNote: `${ecg.rhythm} requires prompt intervention — delays in treatment can lead to hemodynamic collapse`,
      distractorRationales: ["Observation alone is inappropriate for hemodynamically significant rhythms", "Oral medications are too slow for acute rhythm management", "Carotid massage is only appropriate for stable narrow-complex SVT"]
    }
  ];
  return variants[variant % variants.length];
}

export function generateVitalSignQuestion(vital: VitalPattern, variant: number): ParamedicQuestion {
  const variants: ParamedicQuestion[] = [
    {
      stem: `${vital.scenario}. Vital signs: HR ${vital.hr}, BP ${vital.bp}, RR ${vital.rr}, SpO2 ${vital.spo2}. What is the MOST likely underlying condition?`,
      options: [
        vital.condition,
        "Anxiety attack with hyperventilation",
        "Simple vasovagal syncope",
        "Benign positional vertigo"
      ],
      correctAnswer: 0,
      rationaleLong: `The clinical presentation and vital signs are consistent with ${vital.condition}. The vital sign pattern of HR ${vital.hr}, BP ${vital.bp}, RR ${vital.rr}, SpO2 ${vital.spo2} indicates significant physiological derangement that is inconsistent with benign conditions. The appropriate intervention is: ${vital.intervention}. Paramedics must correlate the clinical scenario with vital signs to form a field impression and guide treatment. An anxiety attack may present with tachycardia and hyperventilation but would typically have normal BP and SpO2. Vasovagal syncope presents with bradycardia, not the pattern shown here. Benign vertigo does not cause the vital sign abnormalities seen in this case.`,
      learningObjective: `Correlate vital sign patterns with underlying clinical conditions`,
      blueprintCategory: "Assessment",
      subtopic: "Vitals Interpretation",
      difficulty: 3,
      cognitiveLevel: "analysis",
      questionType: "multiple-choice",
      examTrap: "Students may be misled by a single normal-appearing vital sign and miss the overall pattern of instability",
      clinicalPearls: [`HR ${vital.hr} + BP ${vital.bp} pattern suggests ${vital.condition}`, `SpO2 of ${vital.spo2} indicates the severity of compromise`, "Always interpret vitals in the context of the clinical presentation"],
      safetyNote: `Rapidly deteriorating vital signs require immediate intervention — do not delay treatment to complete a full assessment`,
      distractorRationales: ["Anxiety would not produce this vital sign pattern — expect normal BP and SpO2", "Vasovagal syncope presents with bradycardia, not the tachycardia seen here", "Benign vertigo does not cause hemodynamic instability"]
    },
    {
      stem: `${vital.scenario}. Vital signs: HR ${vital.hr}, BP ${vital.bp}, RR ${vital.rr}, SpO2 ${vital.spo2}. What is the MOST appropriate initial intervention?`,
      options: [
        vital.intervention.split(",")[0] || vital.intervention,
        "Reassess in 15 minutes without intervention",
        "Administer oral glucose and monitor",
        "Place in a position of comfort and observe"
      ],
      correctAnswer: 0,
      rationaleLong: `For this patient presenting with ${vital.condition}, the most appropriate initial intervention is: ${vital.intervention}. The vital sign pattern (HR ${vital.hr}, BP ${vital.bp}, RR ${vital.rr}, SpO2 ${vital.spo2}) indicates this is an acute emergency requiring immediate intervention. Waiting 15 minutes to reassess without intervention could result in patient deterioration. Oral glucose is not indicated unless hypoglycemia is confirmed. Simply placing in a position of comfort without active intervention is insufficient for the degree of physiological compromise demonstrated by these vital signs.`,
      learningObjective: `Select the appropriate intervention based on clinical presentation and vital signs`,
      blueprintCategory: "Assessment",
      subtopic: "Vitals Interpretation",
      difficulty: 3,
      cognitiveLevel: "application",
      questionType: "multiple-choice",
      examTrap: "Students may choose a less aggressive intervention that does not match the severity of the presentation",
      clinicalPearls: [`Priority intervention for ${vital.condition}: ${vital.intervention}`, "Vital signs indicate acute compromise requiring immediate action", "Always match intervention aggressiveness to the severity of the condition"],
      safetyNote: `Do not delay definitive intervention for patients with this degree of hemodynamic compromise`,
      distractorRationales: ["Delaying reassessment by 15 minutes is dangerous in this clinical situation", "Oral glucose is only appropriate for confirmed hypoglycemia", "Observation alone is insufficient for the degree of compromise shown"]
    }
  ];
  return variants[variant % variants.length];
}
