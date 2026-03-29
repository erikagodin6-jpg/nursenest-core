import type { LessonContent } from "./types";

export const rrtLessonsExpanded: Record<string, LessonContent> = {
  "abg-interpretation-advanced-rrt": {
    title: "Advanced ABG Interpretation",
    cellular: `Arterial blood gas analysis is the cornerstone diagnostic tool in respiratory therapy, providing real-time assessment of oxygenation, ventilation, and acid-base status. Mastery of ABG interpretation requires a systematic approach that goes beyond pattern recognition to include clinical correlation, compensation assessment, and identification of mixed disorders.

The systematic six-step approach to ABG interpretation begins with evaluating the pH to determine acidemia (pH < 7.35) or alkalemia (pH > 7.45). Step two examines PaCO2 (normal 35-45 mmHg) to assess the respiratory component — elevated PaCO2 indicates respiratory acidosis (hypoventilation), while decreased PaCO2 indicates respiratory alkalosis (hyperventilation). Step three evaluates HCO3 (normal 22-26 mEq/L) for the metabolic component — decreased HCO3 causes metabolic acidosis, increased HCO3 causes metabolic alkalosis. Step four determines whether the primary disorder matches the pH change (the component that "agrees" with the pH direction is the primary disorder). Step five assesses compensation: respiratory compensation for metabolic disorders adjusts PaCO2, while metabolic compensation (renal) for respiratory disorders adjusts HCO3. Compensation returns pH toward normal but never overshoots (pH normalizes only in chronic compensated states or mixed disorders). Step six calculates the anion gap (Na - Cl - HCO3; normal 8-12 mEq/L) to further classify metabolic acidosis.

Anion gap metabolic acidosis (AGMA) follows the mnemonic MUDPILES: Methanol, Uremia, DKA, Propylene glycol, Isoniazid/Iron, Lactic acidosis, Ethylene glycol, Salicylates. Non-anion gap metabolic acidosis (NAGMA) results from bicarbonate loss (diarrhea, renal tubular acidosis, carbonic anhydrase inhibitors). The delta-delta ratio (delta AG / delta HCO3) identifies hidden metabolic disorders within an anion gap acidosis: ratio > 2 suggests concurrent metabolic alkalosis, ratio < 1 suggests concurrent non-gap metabolic acidosis.

Winter's formula predicts the expected PaCO2 compensation in primary metabolic acidosis: expected PaCO2 = (1.5 x HCO3) + 8 ± 2. If actual PaCO2 is higher than predicted, a concurrent respiratory acidosis exists. If actual PaCO2 is lower than predicted, a concurrent respiratory alkalosis is present. For metabolic alkalosis, expected PaCO2 rises approximately 0.7 mmHg for each 1 mEq/L rise in HCO3. For acute respiratory acidosis, HCO3 rises 1 mEq/L per 10 mmHg rise in PaCO2. For chronic respiratory acidosis, HCO3 rises 3.5 mEq/L per 10 mmHg rise in PaCO2. These compensation rules are essential for detecting mixed acid-base disorders.

Oxygenation assessment requires calculating the A-a gradient: PAO2 - PaO2, where PAO2 = FiO2 x (Pb - 47) - (PaCO2 / 0.8). Normal A-a gradient is approximately (age/4) + 4. A widened A-a gradient indicates intrapulmonary pathology (V/Q mismatch, shunt, diffusion impairment), while a normal A-a gradient with hypoxemia points to hypoventilation or low FiO2. The P/F ratio (PaO2/FiO2) provides a standardized oxygenation assessment independent of FiO2, with values below 300 suggesting acute lung injury and below 200 indicating ARDS.

Base excess (BE) quantifies the metabolic component independent of respiratory changes. Normal BE is -2 to +2 mEq/L. Negative BE (base deficit) indicates metabolic acidosis, while positive BE indicates metabolic alkalosis. In trauma and critical care, base deficit correlates with hemorrhage severity and is used for resuscitation endpoints. A base deficit worse than -6 mEq/L suggests significant tissue hypoperfusion requiring aggressive intervention.`,
    riskFactors: [
      "Pre-analytical errors: air bubbles in sample causing falsely elevated PaO2 and decreased PaCO2",
      "Delayed sample processing beyond 15 minutes without ice causing cellular metabolism to consume O2 and produce CO2",
      "Excessive heparin dilution in ABG syringe causing falsely low PaCO2 and HCO3 values",
      "Venous contamination during arterial puncture producing falsely low PaO2 and elevated PaCO2",
      "Hypothermia altering gas solubility and creating temperature-corrected vs uncorrected interpretation dilemmas",
      "Hyperleukocytosis (WBC > 100,000) causing oxygen consumption in the sample producing pseudohypoxemia",
      "Failure to document FiO2 at time of ABG draw making oxygenation assessment impossible",
      "Sample collection during suctioning or position change yielding non-representative values"
    ],
    diagnostics: [
      "Arterial blood gas analysis with pH, PaCO2, PaO2, HCO3, base excess, SaO2, and lactate",
      "Anion gap calculation with delta-delta ratio for classifying metabolic acidosis subtypes",
      "A-a gradient calculation at each FiO2 level to differentiate intrapulmonary from extrapulmonary hypoxemia",
      "Serum electrolytes (Na, K, Cl) for anion gap computation and electrolyte disorder correlation",
      "Serum lactate for tissue perfusion assessment and lactic acidosis identification",
      "Ketone levels (beta-hydroxybutyrate) when DKA is suspected as cause of anion gap acidosis",
      "Osmolal gap calculation when toxic alcohol ingestion suspected (methanol, ethylene glycol)",
      "Urine electrolytes and pH for renal tubular acidosis classification"
    ],
    management: [
      "Treat the underlying cause — ABG abnormalities are manifestations, not primary diagnoses",
      "Acute respiratory acidosis: increase alveolar ventilation (increase RR, increase VT, relieve obstruction, reverse sedation)",
      "Chronic respiratory acidosis with acute decompensation: initiate BiPAP before intubation in cooperative patients",
      "Metabolic acidosis with pH < 7.10: consider sodium bicarbonate infusion while addressing root cause",
      "DKA management: insulin drip, aggressive IV fluid resuscitation, potassium repletion before insulin if K < 3.3",
      "Lactic acidosis: aggressive fluid resuscitation, vasopressors if needed, source control for sepsis",
      "Metabolic alkalosis: volume repletion with normal saline for chloride-responsive causes (vomiting, NG suction)",
      "Mixed disorders: prioritize treatment of the most life-threatening component first"
    ],
    nursingActions: [
      "Perform modified Allen test before radial artery puncture to confirm dual arterial supply to the hand",
      "Use pre-heparinized ABG syringes and expel air bubbles immediately after collection",
      "Transport sample on ice if analysis will be delayed beyond 10-15 minutes",
      "Document exact FiO2, ventilator settings, patient position, and temperature at time of draw",
      "Apply pressure to arterial puncture site for minimum 5 minutes (longer for anticoagulated patients)",
      "Correlate ABG results with clinical picture — treat the patient, not the numbers",
      "Use systematic six-step interpretation method for every ABG to avoid overlooking mixed disorders",
      "Trend serial ABGs to assess response to interventions rather than relying on single values"
    ],
    signs: [
      "Respiratory acidosis: somnolence, confusion, headache, asterixis from CO2 narcosis",
      "Respiratory alkalosis: lightheadedness, perioral numbness, carpopedal spasm, tetany from decreased ionized calcium",
      "Metabolic acidosis: Kussmaul respirations (deep, rapid breathing as respiratory compensation)",
      "Metabolic alkalosis: hypoventilation, muscle weakness, cramping from associated hypokalemia",
      "Hypoxemia: tachycardia, tachypnea, cyanosis, altered mental status, agitation progressing to obtundation",
      "Severe acidemia (pH < 7.20): decreased cardiac contractility, vasodilation, arrhythmia risk"
    ],
    medications: [
      { name: "Sodium Bicarbonate (NaHCO3)", dose: "1-2 mEq/kg IV push or 150 mEq in 1L D5W infusion", route: "Intravenous", purpose: "Buffer severe metabolic acidosis (pH < 7.10) while treating underlying cause" },
      { name: "Acetazolamide (Diamox)", dose: "250-500 mg IV or PO q8-12h", route: "IV or Oral", purpose: "Carbonic anhydrase inhibitor to treat metabolic alkalosis by promoting renal bicarbonate excretion" },
      { name: "Naloxone (Narcan)", dose: "0.4-2 mg IV q2-3min to effect", route: "Intravenous", purpose: "Reverse opioid-induced respiratory depression causing acute respiratory acidosis" },
      { name: "Regular Insulin", dose: "0.1 units/kg/hr IV infusion (DKA protocol)", route: "Intravenous", purpose: "Correct DKA by promoting glucose uptake and halting ketoacid production" }
    ],
    pearls: [
      "Never overcorrect chronic respiratory acidosis — rapidly lowering PaCO2 in chronic retainers causes post-hypercapnic metabolic alkalosis and seizures",
      "A normal pH with abnormal PaCO2 and HCO3 may indicate full compensation or two opposing primary disorders — clinical context determines which",
      "Winter's formula only applies to primary metabolic acidosis — do not use it for metabolic alkalosis or respiratory disorders",
      "The anion gap must be corrected for albumin: for every 1 g/dL decrease in albumin below 4, add 2.5 to the calculated AG",
      "In mixed respiratory and metabolic acidosis (cardiac arrest), both ventilation and bicarbonate may be needed simultaneously",
      "Base deficit worse than -6 in trauma predicts need for massive transfusion — incorporate into resuscitation decisions"
    ],
    quiz: [
      { question: "ABG results: pH 7.28, PaCO2 24, HCO3 11, Na 140, Cl 104. What is the primary disorder and anion gap?", options: ["Respiratory alkalosis with normal AG", "Anion gap metabolic acidosis with appropriate respiratory compensation", "Non-anion gap metabolic acidosis with respiratory compensation", "Mixed respiratory alkalosis and metabolic acidosis"], correct: 1, rationale: "pH 7.28 = acidosis. HCO3 11 = metabolic acidosis (primary). PaCO2 24 = appropriate respiratory compensation (Winter's: 1.5 x 11 + 8 = 24.5). AG = 140 - 104 - 11 = 25 (elevated). This is a pure anion gap metabolic acidosis with appropriate respiratory compensation." },
      { question: "A COPD patient presents with pH 7.36, PaCO2 65, HCO3 36. Which best describes this ABG?", options: ["Acute respiratory acidosis", "Chronic compensated respiratory acidosis", "Metabolic alkalosis with respiratory compensation", "Mixed respiratory acidosis and metabolic alkalosis"], correct: 1, rationale: "PaCO2 is markedly elevated (respiratory acidosis) but pH is near normal (7.36), indicating renal compensation over days. Expected HCO3 rise for chronic respiratory acidosis: 3.5 per 10 mmHg above 40 = 3.5 x 2.5 = 8.75, so expected HCO3 = 24 + 8.75 = 32.75. Actual HCO3 36 is close, consistent with chronic compensated respiratory acidosis." },
      { question: "ABG: pH 7.52, PaCO2 30, HCO3 24. A-a gradient is 35 mmHg. What is the most likely diagnosis?", options: ["Anxiety-induced hyperventilation", "Pulmonary embolism", "Metabolic alkalosis from vomiting", "Chronic respiratory alkalosis"], correct: 1, rationale: "This is acute respiratory alkalosis (low PaCO2, high pH, normal HCO3 without metabolic compensation). The widened A-a gradient (normal < 15) indicates an intrapulmonary cause. Anxiety hyperventilation causes respiratory alkalosis but with a normal A-a gradient. PE causes respiratory alkalosis with a widened A-a gradient due to V/Q mismatch and dead space." }
    ]
  },

  "mechanical-ventilation-basics-rrt": {
    title: "Mechanical Ventilation Fundamentals",
    cellular: `Mechanical ventilation provides artificial respiratory support by generating positive pressure to deliver gas into the lungs. Understanding the fundamental principles, indications, initial settings, and monitoring parameters is essential for every respiratory therapist, as ventilator management is the single most tested domain on the NBRC TMC and CSE examinations.

Indications for mechanical ventilation include acute respiratory failure (Type I: hypoxemic with PaO2 < 60 on supplemental O2, or Type II: hypercapnic with PaCO2 > 50 with pH < 7.25), airway protection in patients with GCS ≤ 8 or absent gag/cough reflexes, anticipated clinical deterioration (massive hemoptysis, severe burns, unstable cervical spine), and post-operative respiratory support. The decision to intubate should be based on the clinical trajectory, not a single ABG value.

The equation of motion governs all mechanical ventilation: Paw = (VT / Compliance) + (Flow x Resistance) + PEEP. This equation states that the pressure the ventilator must generate equals the elastic pressure (tidal volume divided by compliance) plus the resistive pressure (flow times resistance) plus PEEP. In volume-controlled ventilation, VT and flow are set, so pressure varies depending on compliance and resistance. In pressure-controlled ventilation, pressure is set, so VT varies depending on compliance and resistance.

Volume-controlled ventilation (VCV) delivers a set tidal volume at a set flow rate. The advantage is guaranteed minute ventilation regardless of changes in lung mechanics. Peak inspiratory pressure (PIP) varies with changes in compliance and resistance — rising PIP with stable plateau pressure indicates increased airway resistance (bronchospasm, secretions, kinked ETT), while rising PIP with proportionally rising plateau pressure indicates decreased compliance (pneumothorax, ARDS progression, abdominal distension).

Pressure-controlled ventilation (PCV) delivers gas at a set inspiratory pressure for a set inspiratory time. The advantage is a decelerating flow pattern that distributes gas more evenly across lung units with different time constants, potentially reducing ventilator-induced lung injury. The disadvantage is that tidal volume varies with compliance and resistance changes, requiring close monitoring to detect hypoventilation if lung mechanics deteriorate.

Initial ventilator settings for a typical adult: mode AC/VC or AC/PC, tidal volume 6-8 mL/kg ideal body weight (IBW), respiratory rate 12-16 breaths/min, PEEP 5 cmH2O, FiO2 1.0 initially then wean rapidly to lowest FiO2 maintaining SpO2 92-96%. IBW is calculated from height: males = 50 + 2.3(height in inches - 60), females = 45.5 + 2.3(height in inches - 60). Never use actual body weight for VT calculation because lung size correlates with height, not weight.

Monitoring parameters include peak inspiratory pressure (PIP), plateau pressure (Pplat, measured during inspiratory hold — reflects alveolar pressure), driving pressure (Pplat - PEEP, should be < 15 cmH2O), static compliance (VT / (Pplat - PEEP), normal 50-100 mL/cmH2O), dynamic compliance (VT / (PIP - PEEP)), and auto-PEEP (measured during expiratory hold). ABGs should be obtained 20-30 minutes after initiating ventilation and after any settings change.`,
    riskFactors: [
      "Ventilator-induced lung injury (VILI) from volutrauma, barotrauma, atelectrauma, and biotrauma",
      "Ventilator-associated pneumonia (VAP) increasing with duration of intubation — 1-3% per day",
      "Auto-PEEP from insufficient expiratory time in obstructive disease causing air trapping and hemodynamic compromise",
      "Oxygen toxicity from prolonged FiO2 > 0.60 causing absorption atelectasis and oxidative alveolar damage",
      "Patient-ventilator dyssynchrony increasing work of breathing, sedation requirements, and ventilator days",
      "Diaphragm atrophy from prolonged controlled ventilation contributing to weaning failure",
      "Endotracheal tube complications: unplanned extubation, right mainstem migration, cuff leak, tracheal stenosis",
      "Hemodynamic compromise from positive intrathoracic pressure reducing venous return"
    ],
    diagnostics: [
      "Arterial blood gas 20-30 minutes after intubation and after every settings change",
      "Plateau pressure measurement via 0.5-second inspiratory hold (target < 30 cmH2O)",
      "Auto-PEEP measurement via end-expiratory hold (total PEEP = set PEEP + auto-PEEP)",
      "Static compliance calculation: VT / (Pplat - total PEEP) — normal 50-100 mL/cmH2O",
      "Chest X-ray post-intubation to confirm ETT position 3-5 cm above the carina",
      "Continuous waveform capnography for ventilation monitoring and ETT position confirmation",
      "Daily spontaneous breathing trial screening to assess liberation readiness",
      "Ventilator waveform analysis for auto-PEEP detection, dyssynchrony, and leak identification"
    ],
    management: [
      "Lung-protective ventilation for all patients: VT 6-8 mL/kg IBW, Pplat < 30, driving pressure < 15",
      "Titrate FiO2 to lowest level maintaining SpO2 92-96% (88-92% in COPD)",
      "Set PEEP to prevent end-expiratory alveolar collapse — minimum 5 cmH2O for most patients",
      "Adjust respiratory rate to target PaCO2 35-45 (or permissive hypercapnia in ARDS if pH > 7.20)",
      "Implement VAP prevention bundle: HOB 30-45 degrees, oral care q4h, subglottic suctioning, DVT prophylaxis",
      "Daily spontaneous awakening trial (SAT) paired with spontaneous breathing trial (SBT)",
      "Address patient-ventilator dyssynchrony before increasing sedation — check for auto-PEEP, flow mismatch, or inappropriate trigger sensitivity",
      "Suction airway PRN based on assessment findings, not on fixed schedule"
    ],
    nursingActions: [
      "Calculate and document IBW from measured height — post the IBW and target VT range at the bedside",
      "Measure and record Pplat every 4 hours and with each ABG — alert provider if Pplat exceeds 30 cmH2O",
      "Verify ETT position and cuff pressure (20-30 cmH2O) every shift and after repositioning",
      "Assess for auto-PEEP in any patient with obstructive disease or unexplained hemodynamic instability",
      "Document ventilator settings, measured values, and respiratory assessment findings hourly",
      "Screen daily for SBT readiness: FiO2 ≤ 0.40, PEEP ≤ 8, hemodynamically stable, adequate mental status",
      "Monitor for signs of dyssynchrony: patient biting ETT, accessory muscle use, paradoxical breathing, stacking breaths",
      "Ensure emergency equipment at bedside: manual resuscitation bag, suction, replacement ETT, end-tidal CO2 detector"
    ],
    signs: [
      "Adequate ventilation: stable PaCO2, symmetric chest rise, bilateral breath sounds, ETCO2 waveform present",
      "Worsening compliance: rising PIP and Pplat with unchanged VT suggesting pneumothorax, effusion, or ARDS progression",
      "Increased resistance: rising PIP with stable Pplat suggesting bronchospasm, secretions, or ETT obstruction",
      "Auto-PEEP: failure to return to baseline flow before next breath on flow-time waveform",
      "Dyssynchrony: double triggering, missed triggers, flow starvation (concave pressure waveform during inspiration)",
      "Hemodynamic compromise: hypotension coinciding with PEEP increases or high mean airway pressure"
    ],
    medications: [
      { name: "Propofol", dose: "5-80 mcg/kg/min IV infusion", route: "Intravenous", purpose: "Sedation for ventilated patients with rapid onset/offset allowing daily awakening trials" },
      { name: "Cisatracurium", dose: "0.15 mg/kg bolus then 1-3 mcg/kg/min infusion", route: "Intravenous", purpose: "Neuromuscular blockade for severe ARDS dyssynchrony or dangerously elevated Pplat" },
      { name: "Fentanyl", dose: "25-100 mcg/hr IV infusion", route: "Intravenous", purpose: "Analgesia-first sedation approach reducing overall sedation requirements" },
      { name: "Dexmedetomidine", dose: "0.2-1.5 mcg/kg/hr IV infusion", route: "Intravenous", purpose: "Sedation maintaining respiratory drive for transitioning to spontaneous breathing modes" }
    ],
    pearls: [
      "PIP minus Pplat reflects airway resistance — if PIP is 40 but Pplat is 25, the problem is in the airways (bronchospasm, secretions), not the alveoli",
      "Always use IBW for VT calculation — a 5'2\" female weighing 250 lbs should receive VT based on IBW of ~50 kg (300 mL), not actual weight",
      "Auto-PEEP is the most commonly missed cause of hemodynamic instability in ventilated obstructive patients — always check expiratory hold",
      "The driving pressure (Pplat - PEEP) is the strongest ventilator variable correlated with mortality — keep it below 15 cmH2O",
      "A sudden rise in PIP with unchanged Pplat is a resistance problem; a rise in both is a compliance problem — this distinction guides your response",
      "Minute ventilation = VT x RR. To lower PaCO2, increase VT (preferred) or RR. To raise PaCO2 (permissive hypercapnia), decrease RR"
    ],
    quiz: [
      { question: "A ventilated patient suddenly has PIP rise from 30 to 48 cmH2O, but Pplat remains at 22 cmH2O. What is the most likely cause?", options: ["Pneumothorax", "Bronchospasm or mucus plug", "ARDS progression", "Pulmonary edema"], correct: 1, rationale: "A rise in PIP without a rise in Pplat indicates increased airway resistance, not decreased compliance. PIP reflects both resistance and compliance, while Pplat reflects compliance alone. Bronchospasm and mucus plugging increase airway resistance. Pneumothorax, ARDS, and pulmonary edema decrease compliance and would raise both PIP and Pplat." },
      { question: "What is the target tidal volume for a 5'6\" female (IBW 57 kg) on lung-protective ventilation?", options: ["480 mL (8 mL/kg actual weight of 60 kg)", "342 mL (6 mL/kg IBW)", "420 mL (7 mL/kg actual weight)", "570 mL (10 mL/kg IBW)"], correct: 1, rationale: "Lung-protective ventilation targets 6 mL/kg IBW. For a 5'6\" female: IBW = 45.5 + 2.3(66-60) = 45.5 + 13.8 = 59.3 kg (approximately 57 kg using some formulas). At 6 mL/kg: 57 x 6 = 342 mL. Never use actual body weight — lung size correlates with height." },
      { question: "A mechanically ventilated patient develops sudden hypotension. Expiratory hold reveals total PEEP of 18 cmH2O with set PEEP of 5. What is the intervention?", options: ["Increase vasopressors immediately", "Disconnect from ventilator briefly to allow complete exhalation", "Increase PEEP to match the auto-PEEP", "Administer fluid bolus and continue current settings"], correct: 1, rationale: "Auto-PEEP of 13 cmH2O (18 total - 5 set) causes air trapping that compresses the vena cava and reduces venous return, causing hypotension. Brief disconnection allows trapped air to escape, immediately improving hemodynamics. Then adjust settings to reduce auto-PEEP: decrease RR, decrease VT, increase expiratory time, or treat underlying bronchospasm." }
    ]
  },

  "ventilator-modes-advanced-rrt": {
    title: "Advanced Ventilator Modes",
    cellular: `Advanced ventilator modes extend beyond basic volume and pressure control to address specific clinical scenarios including difficult weaning, severe ARDS, and optimizing patient-ventilator interaction. Understanding mode selection, advantages, limitations, and clinical applications is essential for the respiratory therapist managing complex critical care patients.

Synchronized Intermittent Mandatory Ventilation (SIMV) delivers a set number of mandatory breaths synchronized to the patient's inspiratory effort, with the patient able to take additional spontaneous breaths between mandatory cycles. SIMV can be combined with pressure support (PS) to augment spontaneous breaths. Historically used as a weaning mode by gradually reducing the mandatory rate, SIMV has fallen out of favor because it increases work of breathing during spontaneous breaths without adequate support, prolongs weaning duration compared to daily SBT protocols, and provides inconsistent minute ventilation. Current evidence supports direct SBT with T-piece or low PS over gradual SIMV weaning.

Pressure Support Ventilation (PSV) provides a set inspiratory pressure to augment each patient-initiated breath. The patient controls rate, inspiratory time, and tidal volume. PSV is purely a spontaneous mode — it provides no backup rate (the ventilator will not deliver breaths if the patient becomes apneic unless a backup apnea ventilation feature is activated). PSV is commonly used for weaning assessment (PS 5-8 cmH2O during SBT), as a stand-alone mode for spontaneously breathing patients, or combined with SIMV. Flow cycling in PSV terminates inspiration when flow decays to a percentage (typically 25%) of peak flow. In obstructive disease, delayed flow decay can cause prolonged inspiration and expiratory time limitation — adjusting the flow cycle percentage higher (e.g., 40-50%) may improve synchrony.

Pressure-Regulated Volume Control (PRVC) is a dual-control mode that targets a set tidal volume by automatically adjusting inspiratory pressure breath-to-breath. The ventilator delivers a test breath and measures resulting VT, then increases or decreases pressure on subsequent breaths to achieve the target VT at the lowest pressure possible. PRVC combines the advantages of guaranteed VT (as in volume control) with decelerating flow (as in pressure control). Limitations include the potential for pressure autocycling in the presence of leaks and the risk of inappropriately low pressure when compliance suddenly improves (e.g., after suctioning or recruitment), potentially providing excessive VT.

Airway Pressure Release Ventilation (APRV) maintains the lung at a high continuous positive airway pressure (P-high, typically 20-35 cmH2O) with brief, intermittent releases to a low pressure (P-low, typically 0-5 cmH2O) for ventilation. The T-high (time at P-high) is long (4-6 seconds) to maintain alveolar recruitment, and T-low (release time) is short (0.2-0.8 seconds) to allow CO2 elimination while preventing alveolar derecruitment. T-low is set to terminate at 75% of peak expiratory flow rate (PEFR) to maintain auto-PEEP and prevent atelectasis. Patients breathe spontaneously throughout the APRV cycle, which preserves diaphragm function and may improve V/Q matching. APRV is used primarily in ARDS as an open-lung strategy, though high-quality evidence supporting mortality benefit is limited.

Neurally Adjusted Ventilatory Assist (NAVA) uses the electrical activity of the diaphragm (Edi), measured via a specialized nasogastric catheter with electrodes positioned at the crural diaphragm, to trigger and proportion ventilator support. The ventilator delivers pressure proportional to the patient's neural respiratory drive, providing natural breath-to-breath variability. NAVA virtually eliminates trigger and cycle dyssynchrony because support is driven by neural signals rather than flow or pressure changes. NAVA is particularly useful for patients with difficult-to-manage dyssynchrony, NIV with excessive leak affecting triggering, and COPD patients with auto-PEEP-related trigger failure.

Proportional Assist Ventilation (PAV+) measures the patient's respiratory system compliance and resistance in real-time and provides pressure support proportional to the patient's instantaneous effort. The clinician sets the percentage of support (e.g., 50% means the ventilator provides half the work of breathing). PAV+ maintains the patient's natural breathing variability and proportional control of their ventilation, potentially reducing dyssynchrony and over-assistance.`,
    riskFactors: [
      "APRV with inadequate T-low causing excessive CO2 retention and respiratory acidosis",
      "PRVC auto-adjusting to inappropriately high pressures during acute compliance drops, potentially exceeding safe Pplat limits",
      "PSV without apnea backup in patients at risk for central apnea causing undetected hypoventilation",
      "NAVA catheter malposition providing inaccurate Edi signals and inappropriate support levels",
      "SIMV with insufficient pressure support on spontaneous breaths causing diaphragm fatigue",
      "APRV with excessive T-low allowing complete alveolar derecruitment and worsening shunt",
      "Over-reliance on advanced modes without understanding fundamental ventilation principles"
    ],
    diagnostics: [
      "Ventilator waveform analysis comparing flow, pressure, and volume scalars across modes",
      "Transpulmonary pressure measurement via esophageal manometry for APRV and PEEP optimization",
      "Edi signal quality assessment for NAVA catheter positioning (peak Edi, waveform morphology)",
      "ABG comparison before and after mode change to assess ventilation and oxygenation impact",
      "Respiratory mechanics measurement: compliance, resistance, time constants for mode selection",
      "Asynchrony index calculation (asynchronous breaths / total breaths x 100) — target < 10%",
      "Work of breathing assessment using esophageal pressure or P0.1 (airway occlusion pressure at 100 ms)"
    ],
    management: [
      "Select mode based on clinical scenario, not institutional habit — match mode to pathophysiology",
      "APRV for ARDS: set P-high at prior Pplat, T-high 4-6 seconds, P-low 0, T-low set to 75% of PEFR decay",
      "PSV for weaning assessment: set PS at level achieving VT 6-8 mL/kg, RR < 25, with PEEP 5 cmH2O",
      "PRVC for patients needing guaranteed VT with lung-protective pressures: set VT 6-8 mL/kg IBW, monitor auto-adjusting pressure",
      "NAVA for refractory dyssynchrony: titrate NAVA level to achieve adequate VT with comfortable breathing pattern",
      "Transition from controlled to spontaneous modes as patient improves: AC → SIMV+PS → PSV → SBT → extubation",
      "Monitor closely for 30-60 minutes after any mode change with serial vital signs and possible ABG"
    ],
    nursingActions: [
      "Document ventilator mode, all set parameters, and measured variables at least hourly",
      "Assess patient comfort and synchrony after mode changes — observe for accessory muscle use, paradoxical breathing, agitation",
      "Verify apnea backup settings are activated when using PSV or NAVA modes",
      "Monitor APRV auto-PEEP by observing expiratory flow waveform — flow should not return to zero before next T-high",
      "Confirm NAVA catheter position via Edi signal display and catheter positioning tool on ventilator",
      "Compare set VT to delivered VT in PRVC to ensure ventilator is not auto-adjusting to dangerous pressure levels",
      "Educate bedside nurses on alarm parameters specific to the advanced mode in use"
    ],
    signs: [
      "Successful mode transition: stable or improved RR, VT, SpO2, reduced work of breathing, patient comfort",
      "Mode failure: increasing RR > 30, decreasing VT, rising PaCO2, worsening SpO2 despite maximum mode settings",
      "Dyssynchrony in SIMV: paradoxical breathing during unsupported spontaneous breaths suggesting inadequate PS",
      "APRV success: improving P/F ratio, stable hemodynamics, comfortable spontaneous breathing at P-high",
      "NAVA over-assistance: excessive VT, low Edi suggesting ventilator is doing all the work, respiratory alkalosis",
      "PSV flow cycle mismatch in COPD: prolonged inspiratory time on waveform causing missed triggers"
    ],
    medications: [
      { name: "Propofol", dose: "5-50 mcg/kg/min IV infusion", route: "Intravenous", purpose: "Light sedation for patient comfort during advanced mode optimization while preserving respiratory drive" },
      { name: "Ketamine", dose: "0.5-2 mg/kg/hr IV infusion", route: "Intravenous", purpose: "Dissociative sedation maintaining respiratory drive — useful during APRV and spontaneous breathing modes" },
      { name: "Remifentanil", dose: "0.05-0.2 mcg/kg/min IV infusion", route: "Intravenous", purpose: "Ultra-short-acting opioid for analgesia allowing rapid titration during mode transitions and SBTs" }
    ],
    pearls: [
      "APRV T-low is the most critical setting — too long causes derecruitment, too short causes CO2 retention. Target 75% of PEFR decay",
      "PSV without apnea backup is dangerous in patients with altered mental status or high opioid doses — always verify backup ventilation",
      "PRVC pressure limits should be set to prevent the ventilator from auto-escalating to injurious pressures during acute compliance drops",
      "NAVA level and PEEP are the only two settings — simplicity is the advantage, but requires understanding neural triggering physiology",
      "No advanced mode has proven mortality benefit over standard lung-protective volume control in ARDS — don't chase novelty at the expense of evidence",
      "The asynchrony index should be calculated regularly — an index > 10% is associated with increased ventilator days and ICU mortality"
    ],
    quiz: [
      { question: "In APRV, the T-low is set based on what parameter?", options: ["Patient's respiratory rate", "75% decay of peak expiratory flow rate", "Target PaCO2 level", "Inspiratory-to-expiratory ratio"], correct: 1, rationale: "T-low in APRV is set so that expiration terminates when flow decays to 75% of peak expiratory flow rate (PEFR). This maintains intentional auto-PEEP at P-low, preventing alveolar derecruitment during the release phase while allowing adequate CO2 elimination." },
      { question: "A patient on PSV mode becomes apneic for 20 seconds. What should the ventilator do if properly configured?", options: ["Continue waiting for patient effort", "Switch to apnea backup ventilation at preset parameters", "Sound an alarm but take no ventilatory action", "Automatically switch to APRV mode"], correct: 1, rationale: "PSV is a purely spontaneous mode requiring patient effort to trigger each breath. If the patient becomes apneic, the ventilator should activate apnea backup ventilation (typically a controlled mode at preset parameters). Without apnea backup enabled, the patient receives no ventilation during apnea — this is a critical safety check for all spontaneous modes." },
      { question: "Which advanced mode uses diaphragmatic electrical activity to control ventilator support?", options: ["PRVC", "APRV", "NAVA", "PAV+"], correct: 2, rationale: "Neurally Adjusted Ventilatory Assist (NAVA) uses the electrical activity of the diaphragm (Edi) measured by electrodes on a specialized nasogastric catheter. Support is proportional to the Edi signal, providing the most physiologic patient-ventilator interaction by coupling support to neural respiratory drive rather than flow or pressure triggers." }
    ]
  },

  "ventilator-weaning-rrt": {
    title: "Ventilator Weaning and Liberation",
    cellular: `Ventilator liberation is the process of transitioning a patient from mechanical ventilatory support to spontaneous breathing and eventual extubation. Prolonged mechanical ventilation increases morbidity, mortality, and healthcare costs, making timely liberation a critical competency for respiratory therapists. Evidence-based weaning protocols driven by respiratory therapists reduce ventilator days, ICU length of stay, and VAP incidence.

Weaning readiness assessment follows specific criteria: resolution or improvement of the underlying condition that necessitated ventilation, adequate oxygenation (PaO2/FiO2 > 150, PEEP ≤ 8 cmH2O, FiO2 ≤ 0.40), hemodynamic stability (no or minimal vasopressors, no active myocardial ischemia), adequate neurological status (follows commands or has purposeful movement), and absence of planned operative procedures requiring general anesthesia. Patients should be screened daily for these criteria, ideally coordinated with a daily spontaneous awakening trial (SAT) — the "wake up and breathe" protocol.

The spontaneous breathing trial (SBT) is the definitive test of weaning readiness. Methods include T-piece trial (breathing through the ETT with supplemental oxygen but no ventilator support), CPAP with 0-5 cmH2O, or pressure support of 5-8 cmH2O with PEEP 5 cmH2O. The appropriate SBT duration is 30-120 minutes. SBT success criteria: respiratory rate < 35, SpO2 ≥ 90%, heart rate stable (no increase > 20%), blood pressure stable, no signs of respiratory distress (no accessory muscle use, no paradoxical breathing, no diaphoresis). SBT failure requires immediate return to full ventilatory support with reassessment of the cause of failure.

The Rapid Shallow Breathing Index (RSBI) is the most validated predictor of weaning success. RSBI = respiratory rate (breaths/min) / tidal volume (liters), measured during 1 minute of unassisted breathing. RSBI < 105 predicts successful extubation with 80% positive predictive value. RSBI > 105 predicts weaning failure. Other predictive indices include maximal inspiratory pressure (MIP or NIF), where more negative than -20 to -30 cmH2O suggests adequate inspiratory muscle strength, and minute ventilation < 10 L/min during spontaneous breathing.

Causes of weaning failure are categorized as pulmonary (unresolved pneumonia, persistent shunt, bronchospasm, secretion burden), cardiac (weaning-induced cardiac ischemia, left ventricular failure exacerbated by afterload increase when positive pressure is removed), neurological (inadequate respiratory drive, critical illness polyneuropathy/myopathy), metabolic (malnutrition, electrolyte imbalances — hypokalemia and hypophosphatemia impair diaphragm contractility), and psychological (anxiety, delirium, ventilator dependence).

Extubation assessment includes evaluation of airway patency and protection. The cuff leak test assesses for laryngeal edema: deflate the ETT cuff and measure the difference between inspiratory and expiratory VT — a cuff leak > 110 mL suggests adequate airway patency, while absent or minimal cuff leak suggests laryngeal edema and extubation failure risk. Patients at high risk for post-extubation stridor (prolonged intubation > 36-48 hours, traumatic intubation, female sex, large ETT) may benefit from systemic corticosteroids (methylprednisolone 20 mg IV q4h starting 12-24 hours before planned extubation).

Post-extubation management includes close monitoring for respiratory distress, stridor, and reintubation criteria. High-flow nasal cannula (HFNC) post-extubation reduces reintubation rates in high-risk patients. Prophylactic NIV immediately post-extubation reduces reintubation in patients with hypercapnic respiratory failure (COPD) or at high risk for extubation failure (age > 65, cardiac failure, RSBI > 80). Reintubation rates of 10-20% are typical; higher rates suggest overly conservative weaning, while lower rates may indicate delayed liberation.`,
    riskFactors: [
      "Prolonged mechanical ventilation > 7 days increasing VAP risk, diaphragm atrophy, and ICU-acquired weakness",
      "Critical illness polyneuropathy/myopathy (ICU-acquired weakness) from sepsis, prolonged NMB, or corticosteroid use",
      "Cardiac-induced weaning failure from increased afterload when positive pressure is removed",
      "Diaphragm dysfunction from ventilator-induced diaphragm atrophy (VIDD) or phrenic nerve injury",
      "Excessive sedation or delirium delaying weaning readiness assessment and SBT initiation",
      "Malnutrition and electrolyte imbalances (hypophosphatemia, hypokalemia, hypomagnesemia) impairing respiratory muscle function",
      "Unresolved pulmonary pathology (persistent ARDS, large pleural effusion, ongoing pneumonia)",
      "Laryngeal edema from prolonged intubation causing post-extubation stridor and reintubation"
    ],
    diagnostics: [
      "Rapid Shallow Breathing Index (RSBI = RR/VT in liters) during 1 minute of unassisted breathing — < 105 predicts success",
      "Maximum inspiratory pressure (MIP/NIF) via unidirectional valve — more negative than -20 cmH2O indicates adequate strength",
      "Cuff leak test: VT difference with cuff inflated vs deflated — leak > 110 mL suggests safe to extubate",
      "Diaphragm ultrasound measuring thickening fraction (> 30-36% suggests adequate diaphragm function)",
      "P0.1 (airway occlusion pressure at 100 ms) measuring respiratory drive — normal 1-4 cmH2O",
      "BNP or NT-proBNP to assess cardiac-induced weaning failure (fluid overload, LV dysfunction)",
      "Electrolyte panel assessing phosphate, potassium, magnesium, and calcium levels before SBT",
      "ABG during SBT to assess ventilation adequacy and detect hypercapnic weaning failure"
    ],
    management: [
      "Screen all mechanically ventilated patients daily for weaning readiness using standardized criteria",
      "Coordinate daily SAT (spontaneous awakening trial) with SBT — paired SAT/SBT protocol improves outcomes",
      "Conduct SBT using T-piece or PS 5-8/PEEP 5 for 30-120 minutes with continuous monitoring",
      "Terminate SBT immediately if failure criteria met: RR > 35, SpO2 < 88%, hemodynamic instability, severe distress",
      "If SBT fails, identify the cause before retrying — address cardiac failure, secretions, anxiety, or delirium",
      "Pre-treat with methylprednisolone before extubation in high-risk patients for post-extubation stridor",
      "Apply HFNC or prophylactic NIV immediately post-extubation in high-risk patients (age > 65, COPD, heart failure)",
      "For tracheostomy weaning: progressive downsizing, capping trials with continuous SpO2 monitoring"
    ],
    nursingActions: [
      "Calculate and document RSBI before every SBT — notify provider if > 105",
      "Monitor patient continuously during SBT — assess respiratory rate, SpO2, heart rate, blood pressure, and work of breathing every 5-10 minutes",
      "Have reintubation equipment immediately available during SBT and for 24-48 hours post-extubation",
      "Assess cuff leak before extubation in patients intubated > 48 hours and notify provider of absent leak",
      "Suction oropharynx above the cuff before cuff deflation during extubation to prevent aspiration",
      "Monitor for post-extubation stridor within 4-6 hours of extubation — administer racemic epinephrine if stridor occurs",
      "Document SBT parameters (start time, duration, physiological response, outcome) for every trial",
      "Encourage early mobility and upright positioning to promote respiratory muscle strength recovery"
    ],
    signs: [
      "SBT success: RR < 25, stable SpO2, comfortable breathing, able to cough and clear secretions, follows commands",
      "SBT failure: tachypnea > 35, tachycardia, diaphoresis, paradoxical breathing, accessory muscle use, agitation",
      "Cardiac-induced failure: rising blood pressure, tachycardia, new pulmonary crackles, elevated BNP during SBT",
      "Post-extubation stridor: inspiratory stridor within 2-6 hours suggesting laryngeal edema — assess for reintubation need",
      "Extubation success: sustained adequate ventilation and oxygenation for 48 hours without reintubation",
      "Diaphragm weakness: paradoxical inward abdominal movement during inspiration (abdominal paradox)"
    ],
    medications: [
      { name: "Methylprednisolone", dose: "20 mg IV q4h for 4 doses starting 12-24 hours pre-extubation", route: "Intravenous", purpose: "Reduce laryngeal edema and prevent post-extubation stridor in high-risk patients" },
      { name: "Racemic Epinephrine", dose: "0.5 mL of 2.25% solution via nebulizer", route: "Inhaled", purpose: "Treat post-extubation stridor by reducing upper airway mucosal edema" },
      { name: "Dexmedetomidine", dose: "0.2-0.7 mcg/kg/hr IV infusion", route: "Intravenous", purpose: "Provide anxiolysis during SBT while maintaining respiratory drive and cooperativeness" }
    ],
    pearls: [
      "RSBI < 105 is the best single predictor of weaning success — calculate it on every patient before SBT, every day",
      "The paired SAT/SBT protocol reduces ventilator days by 3 and mortality at 1 year — this is a must-implement protocol",
      "If an SBT fails, identify why before retrying tomorrow — cardiac echo, electrolytes, secretion assessment, and anxiety management",
      "Absent cuff leak does not mandate postponing extubation in all cases — steroid pretreatment may allow safe extubation despite minimal leak",
      "Post-extubation HFNC at 50-60 L/min reduces reintubation rates compared to conventional oxygen — use it as default for high-risk patients",
      "Weaning failure from diaphragm atrophy takes days to weeks to recover — inspiratory muscle training may accelerate recovery"
    ],
    quiz: [
      { question: "A patient has RR 28 and VT 0.25 L during 1 minute of unassisted breathing. What is the RSBI and interpretation?", options: ["RSBI 112 — likely to fail weaning", "RSBI 7 — ready to extubate", "RSBI 28 — ready to extubate", "RSBI 112 — ready to extubate"], correct: 0, rationale: "RSBI = RR / VT (in liters) = 28 / 0.25 = 112. An RSBI > 105 predicts weaning failure — rapid, shallow breathing indicates the patient cannot sustain adequate spontaneous ventilation. This patient should not proceed with extubation; identify and treat the cause of weaning failure." },
      { question: "Which post-extubation support reduces reintubation rates in patients with COPD and hypercapnic respiratory failure?", options: ["Standard nasal cannula at 4 L/min", "Prophylactic noninvasive ventilation (BiPAP)", "Incentive spirometry alone", "Heliox therapy"], correct: 1, rationale: "Prophylactic NIV (BiPAP) immediately post-extubation reduces reintubation rates and mortality in patients at high risk for extubation failure, particularly those with COPD and hypercapnic respiratory failure. NIV provides ventilatory support during the transition, preventing rapid CO2 accumulation and work of breathing." },
      { question: "A cuff leak test reveals only 40 mL difference between inspiratory and expiratory volumes. What does this suggest?", options: ["Normal finding — safe to extubate", "Significant laryngeal edema — high risk for post-extubation stridor", "Equipment malfunction requiring recalibration", "Need for immediate tracheostomy"], correct: 1, rationale: "A cuff leak < 110 mL (or absent leak) suggests significant laryngeal edema surrounding the ETT. This patient is at high risk for post-extubation stridor and potential reintubation. Options include delaying extubation, administering corticosteroids (methylprednisolone 20 mg IV q4h for 4 doses), and having reintubation equipment immediately ready." }
    ]
  },

  "noninvasive-ventilation-rrt": {
    title: "Noninvasive Ventilation",
    cellular: `Noninvasive ventilation (NIV) delivers positive pressure ventilatory support through a mask interface without an endotracheal tube. NIV has become a first-line therapy for specific conditions where it reduces intubation rates, ICU length of stay, and mortality. Understanding indications, contraindications, interfaces, settings, and monitoring is essential for respiratory therapists who initiate and manage NIV across hospital settings.

CPAP (Continuous Positive Airway Pressure) delivers a single constant pressure throughout the respiratory cycle. CPAP improves oxygenation by recruiting atelectatic alveoli, increasing FRC, reducing work of breathing, and splinting the upper airway open. CPAP does not provide ventilatory assistance (no inspiratory pressure augmentation above the CPAP level) — the patient must generate all tidal volume independently. Primary indications: acute cardiogenic pulmonary edema (level I evidence — reduces intubation by 50% and mortality by 25%), obstructive sleep apnea, and post-operative atelectasis. Typical CPAP settings: 5-15 cmH2O, titrated to SpO2 target.

BiPAP (Bilevel Positive Airway Pressure) delivers two pressure levels: IPAP (inspiratory positive airway pressure) during inspiration and EPAP (expiratory positive airway pressure) during expiration. The pressure support level equals IPAP minus EPAP. BiPAP provides both ventilatory support (the IPAP-EPAP difference augments tidal volume) and oxygenation support (EPAP functions as PEEP). The strongest evidence for BiPAP is in acute exacerbation of COPD with hypercapnic respiratory failure (pH 7.25-7.35, PaCO2 > 45): level I evidence shows reduced intubation, mortality, and hospital length of stay. Initial settings: IPAP 10-20 cmH2O, EPAP 4-8 cmH2O, backup rate 10-12, FiO2 titrated to SpO2 target.

Absolute contraindications for NIV include cardiac or respiratory arrest, inability to protect the airway, uncooperative or obtunded patient (GCS < 10), active upper GI bleeding with hematemesis, facial surgery or trauma preventing mask seal, and fixed upper airway obstruction. Relative contraindications include hemodynamic instability requiring vasopressors, excessive secretions with inability to clear, and recent upper airway or esophageal surgery.

Interface selection significantly affects NIV success. Oronasal (full-face) masks cover the nose and mouth, providing the most reliable delivery but with higher aspiration risk and claustrophobia. Nasal masks cover only the nose, are better tolerated, allow speech and expectoration, but lose effectiveness with mouth breathing. Full-face masks extend from forehead to chin, reducing pressure points but increasing dead space. Helmet interfaces cover the entire head, eliminate facial pressure points, allow patient communication, and may reduce aerosolization — increasingly used in immunocompromised patients and during infectious outbreaks.

Monitoring NIV effectiveness requires assessment within 1-2 hours of initiation. Indicators of success: decreasing respiratory rate, improving pH and PaCO2 on ABG, decreasing accessory muscle use, improving patient comfort, and stable or improving SpO2. Indicators of failure requiring escalation to intubation: persistent or worsening respiratory rate > 35, worsening ABG despite NIV optimization, inability to handle secretions, hemodynamic deterioration, decreased level of consciousness, or patient intolerance. Delaying intubation when NIV is clearly failing increases mortality — the 1-2 hour reassessment is a critical decision point.`,
    riskFactors: [
      "Mask leak exceeding 25-30 L/min preventing adequate pressure delivery and triggering",
      "Facial pressure injury from prolonged mask use — especially over nasal bridge and at mask-skin interface",
      "Gastric distension and aspiration risk from air swallowing, particularly at IPAP > 20 cmH2O",
      "Aerosol generation risk in infectious respiratory disease (COVID-19, TB) requiring airborne precautions",
      "Delayed intubation from inappropriate NIV trial in patients who should have been intubated immediately",
      "Patient-ventilator dyssynchrony from mask leak causing auto-triggering or missed triggers",
      "Claustrophobia and anxiety reducing patient tolerance and NIV effectiveness",
      "Dry eyes from mask leak directed toward eyes during sleep"
    ],
    diagnostics: [
      "ABG at baseline and at 1-2 hours after NIV initiation to assess pH, PaCO2, and PaO2 response",
      "Continuous SpO2 and respiratory rate monitoring throughout NIV therapy",
      "Leak monitoring via NIV device readout — total leak should be < 25-30 L/min for adequate therapy",
      "Exhaled tidal volume measurement to confirm adequate ventilatory support",
      "Chest X-ray if clinical deterioration despite NIV to assess for pneumothorax, effusion, or worsening infiltrate",
      "BNP level in acute dyspnea to differentiate cardiogenic (CPAP indication) from non-cardiogenic causes"
    ],
    management: [
      "CPAP 10-12 cmH2O for acute cardiogenic pulmonary edema — apply immediately, do not wait for diagnostic confirmation",
      "BiPAP for COPD exacerbation with pH 7.25-7.35: start IPAP 10-12, EPAP 4-5, titrate IPAP to reduce RR and improve pH",
      "Reassess with ABG at 1-2 hours — if pH worsening or no improvement, prepare for intubation",
      "Optimize mask fit before escalating pressures — leak management is the single most important NIV skill",
      "Use humidification to improve patient comfort and reduce nasal/oral mucosal drying",
      "Schedule breaks for eating and secretion management, but minimize off-NIV time in acute phase",
      "Transition from NIV to HFNC for rest periods if tolerated, maintaining oxygenation support",
      "Do not use NIV as a substitute for intubation in patients meeting absolute intubation criteria"
    ],
    nursingActions: [
      "Ensure proper mask sizing and fitting before initiation — try multiple interfaces if first choice has excessive leak",
      "Educate patient on NIV purpose, breathing technique (breathe with the machine, not against it), and ability to remove mask if needed",
      "Monitor for gastric distension — insert NG tube if abdominal distension compromises ventilation",
      "Assess skin integrity under mask every 2-4 hours — use protective barrier dressings on nasal bridge and pressure points",
      "Document NIV settings (IPAP, EPAP, FiO2, backup rate), leak percentage, exhaled VT, and patient response hourly",
      "Keep intubation equipment at bedside for all patients on NIV for acute respiratory failure",
      "Apply standard or airborne precautions as indicated — use viral filter on exhalation port",
      "Monitor for aspiration risk — position HOB ≥ 30 degrees and hold oral intake during acute phase"
    ],
    signs: [
      "NIV success: decreasing RR from 30+ to < 25 within 1-2 hours, improving pH, decreasing accessory muscle use",
      "NIV failure: persistent RR > 35, worsening pH despite IPAP optimization, inability to manage secretions",
      "Mask intolerance: agitation, pulling at mask, refusal to keep mask on despite reassurance and repositioning",
      "Air leak: audible hiss around mask, auto-triggering on ventilator display, reduced exhaled VT",
      "Gastric distension: increasing abdominal girth, nausea, tympanic percussion over stomach, reduced diaphragmatic excursion",
      "Successful weaning from NIV: tolerating increasing off-NIV intervals with stable SpO2 and comfortable RR"
    ],
    medications: [
      { name: "Furosemide", dose: "40-80 mg IV bolus", route: "Intravenous", purpose: "Diuresis in acute cardiogenic pulmonary edema combined with CPAP to reduce pulmonary congestion" },
      { name: "Nitroglycerin", dose: "0.4 mg SL or 5-200 mcg/min IV infusion", route: "Sublingual or IV", purpose: "Preload and afterload reduction in acute pulmonary edema synergistic with CPAP therapy" },
      { name: "Ipratropium/Albuterol", dose: "0.5 mg/3 mg via inline nebulizer through NIV circuit", route: "Inhaled via NIV", purpose: "Bronchodilation in COPD exacerbation delivered through the NIV circuit without removing the mask" },
      { name: "Methylprednisolone", dose: "125 mg IV x1 then prednisone 40 mg PO daily x 5 days", route: "IV then Oral", purpose: "Systemic corticosteroid for COPD exacerbation reducing airway inflammation and accelerating recovery" }
    ],
    pearls: [
      "In COPD exacerbation with pH 7.25-7.35, NIV reduces intubation from 70% to 30% and reduces mortality — it is first-line, not a last resort",
      "CPAP for flash pulmonary edema works within minutes — apply CPAP while drawing up IV furosemide and nitroglycerin",
      "Mask fit is the #1 determinant of NIV success — spend time optimizing the interface before escalating pressures",
      "The 1-2 hour ABG after NIV initiation is the critical decision point — if pH is not improving, intubate. Do not wait for further deterioration",
      "NIV does NOT protect the airway — it is contraindicated in patients who cannot handle their secretions or who have GCS < 10",
      "Helmet NIV may be superior to face mask NIV for ARDS due to reduced intubation rates and improved patient tolerance"
    ],
    quiz: [
      { question: "A COPD patient presents with pH 7.30, PaCO2 68, RR 32. What is the most appropriate initial intervention?", options: ["Immediate endotracheal intubation", "BiPAP with IPAP 12, EPAP 5", "High-flow nasal cannula at 60 L/min", "Simple face mask at 10 L/min"], correct: 1, rationale: "This patient has acute hypercapnic respiratory failure with pH 7.25-7.35, the optimal range for NIV benefit in COPD. BiPAP reduces intubation rates and mortality in this population. Intubation is not yet indicated since the patient has a treatable condition and pH > 7.25. HFNC and simple mask do not provide ventilatory support for the hypercapnia." },
      { question: "Which NIV mode is most appropriate for acute cardiogenic pulmonary edema?", options: ["BiPAP with high IPAP", "CPAP at 10-12 cmH2O", "BiPAP with high backup rate", "AVAPS mode"], correct: 1, rationale: "CPAP at 10-12 cmH2O is the first-line NIV for acute cardiogenic pulmonary edema. CPAP recruits flooded alveoli, increases FRC, reduces preload and afterload (reducing cardiac work), and improves oxygenation. Level I evidence shows CPAP reduces intubation by 50% and mortality by 25% in this population." },
      { question: "An ABG drawn 2 hours after initiating BiPAP for COPD exacerbation shows pH 7.22 (baseline was 7.28). What is the next step?", options: ["Increase IPAP by 2 cmH2O and recheck in 2 hours", "Continue current settings and monitor", "Prepare for endotracheal intubation", "Switch to CPAP mode"], correct: 2, rationale: "The pH has worsened from 7.28 to 7.22 after 2 hours of BiPAP — this is NIV failure. Worsening pH at the 1-2 hour reassessment point mandates escalation to intubation. Continuing to increase settings or monitor risks dangerous delayed intubation. The 1-2 hour ABG reassessment is the critical go/no-go decision point." }
    ]
  },

  "pulmonary-function-testing-rrt": {
    title: "Pulmonary Function Testing",
    cellular: `Pulmonary function testing (PFT) provides objective measurement of lung mechanics, volumes, and gas exchange capacity. PFTs are essential for diagnosing obstructive and restrictive lung diseases, grading disease severity, monitoring disease progression, assessing treatment response, and evaluating pre-operative pulmonary risk. Respiratory therapists perform, quality-control, and interpret PFTs as a core competency.

Spirometry is the most commonly performed PFT. The patient performs a maximal inspiration followed by a forced maximal expiration into a calibrated spirometer. Key measurements: FVC (forced vital capacity — total volume exhaled during forced expiration), FEV1 (forced expiratory volume in 1 second — volume exhaled in the first second), and FEV1/FVC ratio (the percentage of FVC exhaled in the first second, normally > 0.70 or > lower limit of normal). The flow-volume loop provides a graphical representation: the expiratory limb is effort-dependent initially (peak flow) then effort-independent (determined by lung elastic recoil and airway caliber), while the inspiratory limb is entirely effort-dependent.

Obstructive pattern: reduced FEV1/FVC ratio (< 0.70), reduced FEV1, normal or reduced FVC. The hallmark is disproportionate reduction of FEV1 relative to FVC due to airflow limitation. Severity grading by FEV1 % predicted: mild (≥ 80%), moderate (50-79%), severe (30-49%), very severe (< 30%). The flow-volume loop shows a scooped-out or concave expiratory limb. Causes: COPD, asthma, bronchiectasis, cystic fibrosis. Bronchodilator response (≥ 12% AND ≥ 200 mL improvement in FEV1 after inhaled bronchodilator) suggests reversible airflow obstruction and is characteristic of asthma.

Restrictive pattern: normal or elevated FEV1/FVC ratio (both FEV1 and FVC are reduced proportionally), with reduced total lung capacity (TLC < 80% predicted) as the confirmatory finding. Spirometry alone cannot confirm restriction — lung volume measurement is required because a reduced FVC may occur in obstruction (from air trapping) without true restriction. Causes: pulmonary fibrosis, chest wall deformity (kyphoscoliosis), neuromuscular disease (ALS, myasthenia gravis), obesity (extrinsic restriction), pleural disease.

Lung volume measurement uses body plethysmography (gold standard) or gas dilution techniques (helium dilution, nitrogen washout). Key volumes: TLC (total lung capacity), RV (residual volume — gas remaining after maximal expiration), FRC (functional residual capacity — gas remaining at resting end-expiration). In obstruction: TLC normal or increased (hyperinflation), RV markedly increased (air trapping), RV/TLC ratio elevated. In restriction: TLC reduced, RV normal or reduced.

Diffusing capacity (DLCO) measures the transfer of carbon monoxide across the alveolar-capillary membrane, reflecting gas exchange surface area and pulmonary capillary blood volume. Decreased DLCO: emphysema (alveolar destruction), pulmonary fibrosis (membrane thickening), pulmonary vascular disease (reduced capillary bed), anemia (reduced hemoglobin for CO binding). Increased DLCO: pulmonary hemorrhage (extra-vascular hemoglobin absorbs CO), polycythemia, asthma (usually normal DLCO), left-to-right shunt. DLCO should be corrected for hemoglobin and carboxyhemoglobin levels.

Quality criteria for acceptable spirometry: at least 3 acceptable efforts (no cough in first second, no early termination, no leak, no Valsalva), with 2 reproducible within 150 mL for FEV1 and FVC. The best FEV1 and best FVC (from any acceptable effort, not necessarily the same effort) are reported.`,
    riskFactors: [
      "Bronchospasm triggered by spirometry maneuver in hyperreactive airways",
      "Syncope or presyncope from sustained forceful expiration reducing venous return",
      "Pneumothorax in patients with severe bullous emphysema (rare but documented)",
      "Inaccurate results from poor patient effort, coaching, or technique",
      "Equipment calibration errors producing systematic measurement bias",
      "Cross-contamination between patients if disposable filters and mouthpieces are not used",
      "Misinterpretation of spirometry as restrictive when reduced FVC is actually due to air trapping in obstruction",
      "Withholding bronchodilators before testing in a patient with acute bronchospasm causing unnecessary distress"
    ],
    diagnostics: [
      "Pre- and post-bronchodilator spirometry: FVC, FEV1, FEV1/FVC, PEF, FEF25-75%",
      "Lung volumes via body plethysmography: TLC, RV, FRC, ERV, IC, RV/TLC ratio",
      "DLCO single-breath method corrected for hemoglobin and altitude",
      "Flow-volume loop analysis for obstructive, restrictive, fixed obstruction, and variable obstruction patterns",
      "Maximum voluntary ventilation (MVV) for pre-operative assessment and neuromuscular disease evaluation",
      "Bronchial challenge testing (methacholine or mannitol) when asthma is suspected but baseline spirometry is normal",
      "Cardiopulmonary exercise testing (CPET) for dyspnea of unclear etiology — integrates pulmonary and cardiac evaluation",
      "Six-minute walk test for functional exercise capacity and oxygen desaturation assessment"
    ],
    management: [
      "Order pre- and post-bronchodilator spirometry for initial evaluation of dyspnea, chronic cough, or wheezing",
      "Confirm restrictive pattern with lung volumes (TLC) — do not diagnose restriction from spirometry alone",
      "Grade obstructive severity using FEV1 % predicted per GOLD criteria for COPD treatment guidance",
      "Use DLCO to differentiate emphysema (decreased) from chronic bronchitis (normal) and from asthma (normal/elevated)",
      "Monitor PFT trends annually in chronic lung disease to detect disease progression",
      "Obtain PFTs pre-operatively for thoracic surgery — FEV1 > 60% predicted and DLCO > 60% predicted suggest acceptable surgical risk",
      "Perform bronchial challenge testing when asthma is clinically suspected but spirometry is normal — positive at PC20 < 8 mg/mL methacholine",
      "Withhold short-acting bronchodilators 4-6 hours and long-acting bronchodilators 12-24 hours before testing unless contraindicated"
    ],
    nursingActions: [
      "Coach patient with clear, enthusiastic technique instruction — demonstrate blast, sustain, and duration of effort",
      "Verify spirometer calibration daily with 3-liter calibration syringe (acceptable: 3.0 ± 0.090 L, i.e., ± 3%)",
      "Apply nose clips during all maneuvers to prevent nasal air leak",
      "Assess contraindications before testing: recent MI (< 1 week), unstable angina, aortic aneurysm, recent eye/chest/abdominal surgery",
      "Document patient position, height (measured, not reported), weight, age, sex, and race/ethnicity for reference equations",
      "Review quality criteria for each effort and repeat until 3 acceptable and 2 reproducible efforts are obtained",
      "Report best FEV1 and best FVC from any acceptable effort, even if from different efforts",
      "Interpret results systematically: FEV1/FVC ratio first → if low, obstructive; if normal with low FVC, get lung volumes for restriction"
    ],
    signs: [
      "Obstructive pattern: reduced FEV1/FVC ratio with scooped-out expiratory flow-volume loop",
      "Restrictive pattern: proportionally reduced FEV1 and FVC with normal ratio and reduced TLC on lung volumes",
      "Mixed obstructive-restrictive: reduced FEV1/FVC ratio AND reduced TLC — both obstruction and restriction present",
      "Bronchodilator response: ≥ 12% AND ≥ 200 mL improvement in FEV1 suggesting reversible obstruction (asthma)",
      "Fixed upper airway obstruction: flattened inspiratory AND expiratory limbs on flow-volume loop (tracheal stenosis, goiter)",
      "Variable extrathoracic obstruction: flattened inspiratory limb with normal expiratory limb (vocal cord paralysis)"
    ],
    medications: [
      { name: "Albuterol (bronchodilator response testing)", dose: "4 puffs (400 mcg) via MDI with spacer", route: "Inhaled", purpose: "Administered between pre- and post-bronchodilator spirometry to assess airflow reversibility" },
      { name: "Methacholine (bronchial challenge)", dose: "Escalating concentrations 0.03-16 mg/mL", route: "Inhaled via dosimeter", purpose: "Provoke bronchoconstriction in suspected asthma with normal baseline spirometry — positive at PC20 < 8 mg/mL" },
      { name: "Mannitol (bronchial challenge)", dose: "Escalating doses 0-635 mg via dry powder inhaler", route: "Inhaled", purpose: "Alternative indirect bronchial challenge agent — positive with ≥ 15% decline in FEV1" }
    ],
    pearls: [
      "A reduced FVC on spirometry does NOT confirm restriction — it may be due to air trapping in severe obstruction. Always confirm with lung volumes (TLC)",
      "Bronchodilator response requires BOTH ≥ 12% AND ≥ 200 mL improvement — one criterion alone is insufficient",
      "DLCO distinguishes emphysema (decreased) from chronic bronchitis (normal) — both show obstruction on spirometry",
      "FEF25-75% is the most sensitive indicator of small airway disease but has high variability and is not used for clinical classification",
      "The flow-volume loop shape is diagnostic: scooped-out = obstruction, truncated plateau = upper airway obstruction, miniature normal = restriction",
      "Always correct DLCO for hemoglobin — anemia falsely lowers DLCO, polycythemia falsely elevates it"
    ],
    quiz: [
      { question: "Spirometry shows FEV1 45% predicted, FVC 82% predicted, FEV1/FVC 0.55. What is the pattern and severity?", options: ["Mild restriction", "Moderate obstruction", "Severe obstruction", "Mixed obstructive-restrictive"], correct: 2, rationale: "FEV1/FVC ratio 0.55 (< 0.70) confirms obstruction. FEV1 45% predicted classifies severity as severe (30-49% predicted per GOLD criteria). FVC is relatively preserved (82%), typical of obstruction where air trapping reduces FEV1 disproportionately." },
      { question: "Which finding definitively confirms restrictive lung disease?", options: ["Reduced FVC on spirometry", "Reduced FEV1/FVC ratio", "Reduced TLC on body plethysmography", "Reduced DLCO"], correct: 2, rationale: "Reduced TLC (< 80% predicted) measured by body plethysmography is the definitive confirmatory finding for restriction. A reduced FVC alone may be caused by air trapping in obstruction (pseudorestriction). DLCO is reduced in many conditions. FEV1/FVC is reduced in obstruction, not restriction." },
      { question: "A patient with dyspnea has normal baseline spirometry. Which test would evaluate for occult asthma?", options: ["DLCO measurement", "Lung volume measurement", "Methacholine bronchial challenge test", "Cardiopulmonary exercise test"], correct: 2, rationale: "Methacholine bronchial challenge testing provokes bronchoconstriction in patients with hyperreactive airways. A positive result (PC20 < 8 mg/mL — concentration causing 20% fall in FEV1) confirms airway hyperresponsiveness consistent with asthma. This test is indicated when asthma is clinically suspected but baseline spirometry is normal." }
    ]
  },

  "ards-management-rrt": {
    title: "ARDS Management",
    cellular: `Acute Respiratory Distress Syndrome represents the most critical challenge in respiratory therapy, requiring precise ventilator management, evidence-based rescue therapies, and constant monitoring. ARDS is defined by the Berlin criteria: acute onset within 1 week of a known clinical insult, bilateral opacities on chest imaging not fully explained by effusions or atelectasis, respiratory failure not fully explained by cardiac failure or fluid overload, and PaO2/FiO2 ratio classification on PEEP ≥ 5 cmH2O (mild 200-300, moderate 100-200, severe < 100).

The ARDSNet lung-protective ventilation protocol is the foundation of ARDS management and has proven mortality benefit. Key elements: tidal volume 4-8 mL/kg IBW with initial target of 6 mL/kg IBW, plateau pressure < 30 cmH2O (reduce VT by 1 mL/kg if exceeded, minimum 4 mL/kg), permissive hypercapnia (accept PaCO2 elevation as long as pH > 7.20), PEEP titration using the ARDSNet FiO2/PEEP table (low or high PEEP table), and FiO2 titrated to target SpO2 88-95% or PaO2 55-80 mmHg. The IBW formula must be calculated from measured height: males = 50 + 2.3(height in inches - 60), females = 45.5 + 2.3(height in inches - 60).

Driving pressure (Pplat - PEEP) has emerged as the ventilator variable most strongly associated with ARDS mortality. A meta-analysis of individual patient data from multiple ARDSNet trials showed that driving pressure < 15 cmH2O was independently associated with improved survival, even when VT and Pplat were within "safe" ranges. Clinically: if Pplat is 28 cmH2O and PEEP is 16, driving pressure is only 12 — acceptable. But if Pplat is 28 and PEEP is 8, driving pressure is 20 — concerning, and PEEP should be increased or VT decreased.

Prone positioning is a first-line therapy for moderate-to-severe ARDS (P/F < 150 on FiO2 ≥ 0.60), not a rescue therapy. The PROSEVA trial demonstrated that prone positioning for ≥ 16 hours/day reduced 28-day and 90-day mortality by approximately 50% (absolute mortality reduction from 32.8% to 16.0%). Mechanisms: redistribution of perfusion to better-ventilated ventral lung regions, reduction of cardiac compression on dorsal lung, more homogeneous transpulmonary pressure distribution, improved secretion drainage, and alveolar recruitment. Prone positioning should be initiated early (within 12-24 hours of ARDS diagnosis) and continued until P/F > 150 on FiO2 ≤ 0.60 in supine position.

Neuromuscular blockade with cisatracurium for 48 hours was initially shown to improve mortality in severe ARDS (ACURASYS trial). However, the larger ROSE trial, using a lighter sedation protocol, showed no mortality benefit. Current practice: NMB should be reserved for severe dyssynchrony despite optimization of sedation and ventilator settings, dangerously elevated Pplat despite VT reduction, or severe refractory hypoxemia.

ECMO (extracorporeal membrane oxygenation) is considered for severe ARDS refractory to conventional therapy, including prone positioning. Referral criteria generally include P/F < 80 on FiO2 1.0 and PEEP ≥ 10 despite prone positioning and optimal ventilation, or pH < 7.20 with PaCO2 > 60 despite maximum RR. The EOLIA trial showed a trend toward mortality reduction but did not reach statistical significance; however, the high crossover rate (28% of control patients received rescue ECMO) likely diluted the treatment effect.

Conservative fluid management per the FACTT trial improves oxygenation, increases ventilator-free days, and shortens ICU stay without increasing shock or renal failure. Target CVP < 4 or PAOP < 8 once hemodynamically stable. Use furosemide to achieve negative fluid balance once vasopressors are weaned.`,
    riskFactors: [
      "Sepsis as the most common cause of ARDS, followed by aspiration pneumonia, pancreatitis, and trauma with transfusion",
      "Ventilator-induced lung injury from excessive VT, high Pplat, or inadequate PEEP causing atelectrauma",
      "Fluid overload worsening pulmonary edema and gas exchange — target euvolemia or negative balance",
      "VAP superinfection complicating the ARDS course and prolonging ventilation",
      "Barotrauma (pneumothorax, pneumomediastinum) from high airway pressures in non-compliant lungs",
      "Right ventricular failure from acute pulmonary hypertension (acute cor pulmonale) in severe ARDS",
      "Prolonged NMB causing ICU-acquired weakness and difficult weaning",
      "Prone positioning complications: facial edema, pressure injuries, ETT displacement, line disconnection, brachial plexus injury"
    ],
    diagnostics: [
      "Berlin criteria assessment: timing, bilateral opacities, origin (non-cardiogenic), P/F ratio classification on PEEP ≥ 5",
      "P/F ratio calculation with every ABG for ARDS severity tracking and therapy escalation triggers",
      "Plateau pressure via inspiratory hold — target < 30 cmH2O, measure minimum every 4 hours",
      "Driving pressure calculation (Pplat - PEEP) — target < 15 cmH2O as the strongest mortality predictor",
      "Static compliance (VT / (Pplat - PEEP)) — severely reduced in ARDS (typically 20-40 mL/cmH2O)",
      "Echocardiography to exclude cardiogenic edema and assess RV function (cor pulmonale)",
      "Dead space fraction (VD/VT) via volumetric capnography — > 0.60 independently predicts mortality",
      "CT chest for ARDS phenotyping: focal (positional recruitment) vs diffuse (PEEP-responsive)"
    ],
    management: [
      "Lung-protective ventilation: VT 6 mL/kg IBW, Pplat < 30, driving pressure < 15, permissive hypercapnia if pH > 7.20",
      "PEEP titration per ARDSNet FiO2/PEEP table or compliance-guided approach (best PEEP at highest compliance)",
      "Prone positioning ≥ 16 hours/day for P/F < 150 on FiO2 ≥ 0.60 — initiate early within 12-24 hours",
      "Conservative fluid management: target CVP < 4, achieve negative fluid balance with diuretics once hemodynamically stable",
      "NMB with cisatracurium for 48 hours only if severe dyssynchrony or Pplat > 30 despite maximum VT reduction",
      "Inhaled pulmonary vasodilators (iNO 5-40 ppm or inhaled epoprostenol) as rescue for refractory hypoxemia",
      "ECMO referral when P/F < 80 despite prone positioning and optimal conventional management",
      "Treat underlying cause: antibiotics for pneumonia, source control for sepsis, supportive care for pancreatitis"
    ],
    nursingActions: [
      "Calculate IBW from measured height and post target VT range at bedside — never use actual body weight",
      "Measure and document Pplat and driving pressure every 4 hours and with every ABG — alert if driving pressure > 15",
      "Calculate P/F ratio with every ABG and communicate ARDS severity trajectory to medical team",
      "Coordinate prone positioning: secure ETT and all lines, assign roles, document pressure point checks q2h",
      "Track daily fluid balance and advocate for conservative fluid management once vasopressors are weaned",
      "Implement VAP bundle: HOB 30-45, oral care q4h, subglottic suctioning, DVT prophylaxis, daily SBT screening",
      "Monitor for complications of prone positioning: facial edema, pressure injuries, ETT displacement, line occlusion",
      "Document ventilator settings, measured parameters, and clinical response with each assessment"
    ],
    signs: [
      "ARDS onset: acute bilateral infiltrates, refractory hypoxemia, increasing FiO2 and PEEP requirements, reduced compliance",
      "Worsening ARDS: declining P/F ratio, rising Pplat, increasing dead space fraction, hemodynamic instability",
      "Cor pulmonale: RV dilation on echo, elevated CVP with hypotension, new tricuspid regurgitation",
      "Barotrauma: sudden increase in PIP with unchanged Pplat, subcutaneous emphysema, hemodynamic deterioration",
      "Improving ARDS: rising P/F ratio, improving compliance, tolerating FiO2 and PEEP weaning",
      "Recovery: sustained P/F > 200 in supine, compliance improving, tolerating SBT"
    ],
    medications: [
      { name: "Cisatracurium", dose: "0.15 mg/kg IV bolus then 1-3 mcg/kg/min infusion x 48 hours", route: "Intravenous", purpose: "Neuromuscular blockade for severe dyssynchrony in ARDS reducing oxygen consumption and improving chest wall compliance" },
      { name: "Inhaled Nitric Oxide", dose: "5-40 ppm via ventilator circuit", route: "Inhaled", purpose: "Selective pulmonary vasodilation improving V/Q matching in refractory hypoxemia — does not improve mortality" },
      { name: "Furosemide", dose: "20-80 mg IV q6-12h or continuous infusion 5-20 mg/hr", route: "Intravenous", purpose: "Achieve negative fluid balance per FACTT protocol to reduce pulmonary edema and improve oxygenation" },
      { name: "Dexamethasone", dose: "20 mg IV daily x 5 days then 10 mg IV daily x 5 days", route: "Intravenous", purpose: "Reduce mortality in moderate-severe ARDS per DEXA-ARDS trial — anti-inflammatory effect on alveolar damage" }
    ],
    pearls: [
      "Driving pressure < 15 cmH2O is the strongest ventilator-associated predictor of ARDS survival — prioritize this over VT and Pplat targets",
      "Prone positioning for ≥ 16 hours/day reduces mortality by 50% in moderate-severe ARDS — treat it as first-line, not rescue therapy",
      "The P/F ratio must be calculated on PEEP ≥ 5 cmH2O for valid Berlin criteria staging — document the PEEP level with every P/F calculation",
      "Conservative fluid management improves outcomes without increasing organ failure — begin diuresis once off vasopressors",
      "Always calculate IBW from HEIGHT, not actual weight — a 5'0\" female at 300 lbs gets VT for IBW 45.5 kg (~273 mL), not for 136 kg",
      "Dead space fraction > 0.60 independently predicts mortality in ARDS — use volumetric capnography to measure VD/VT"
    ],
    quiz: [
      { question: "A patient with ARDS has Pplat 29, PEEP 14, VT 350 mL. What is the driving pressure and is it acceptable?", options: ["Driving pressure 29 — too high", "Driving pressure 15 — at the upper acceptable limit", "Driving pressure 14 — acceptable", "Driving pressure 43 — dangerously high"], correct: 1, rationale: "Driving pressure = Pplat - PEEP = 29 - 14 = 15 cmH2O. This is at the upper acceptable limit (target < 15). The Pplat is within the < 30 limit. However, efforts to reduce driving pressure further (decrease VT or increase PEEP if recruitable) would be beneficial since driving pressure is the strongest mortality predictor." },
      { question: "When should prone positioning be initiated in ARDS?", options: ["Only as a last resort before ECMO", "Within 12-24 hours if P/F < 150 on FiO2 ≥ 0.60", "Only after 48 hours of NMB has failed", "When P/F drops below 80"], correct: 1, rationale: "Prone positioning should be initiated early (within 12-24 hours) when P/F < 150 on FiO2 ≥ 0.60 (moderate-severe ARDS). The PROSEVA trial demonstrated 50% mortality reduction with early prone positioning for ≥ 16 hours/day. It is a first-line therapy, not a rescue therapy — waiting until all other options fail reduces its benefit." },
      { question: "A 5'4\" female (IBW 54 kg) with ARDS weighs 95 kg. What is the target tidal volume?", options: ["570 mL (6 mL/kg actual weight)", "324 mL (6 mL/kg IBW)", "475 mL (5 mL/kg actual weight)", "760 mL (8 mL/kg actual weight)"], correct: 1, rationale: "ARDS tidal volume is ALWAYS calculated using ideal body weight from height. For a 5'4\" female: IBW = 45.5 + 2.3(64-60) = 45.5 + 9.2 = 54.7 kg ≈ 54 kg. Target VT at 6 mL/kg IBW = 54 × 6 = 324 mL. Using actual weight of 95 kg would deliver dangerously excessive volumes causing volutrauma." }
    ]
  },

  "copd-management-rrt": {
    title: "COPD Respiratory Management",
    cellular: `Chronic Obstructive Pulmonary Disease encompasses emphysema and chronic bronchitis, characterized by progressive, incompletely reversible airflow limitation. COPD management is a core respiratory therapy competency spanning acute exacerbation management, stable disease optimization, oxygen therapy, pulmonary rehabilitation, and long-term care planning.

Emphysema is characterized by destruction of alveolar walls distal to the terminal bronchiole, resulting in permanent airspace enlargement, loss of elastic recoil, and reduced gas exchange surface area. Centriacinar (centrilobular) emphysema affects respiratory bronchioles primarily in upper lobes and is strongly associated with smoking. Panacinar (panlobular) emphysema affects the entire acinus uniformly, involves lower lobes, and is associated with alpha-1 antitrypsin deficiency. The loss of elastic recoil causes dynamic airway collapse during expiration, leading to air trapping, increased RV and TLC on PFTs, and auto-PEEP during mechanical ventilation.

Chronic bronchitis is clinically defined as productive cough for ≥ 3 months per year for ≥ 2 consecutive years, with mucus gland hypertrophy, airway inflammation, and increased mucus production. Unlike emphysema, chronic bronchitis has relatively preserved gas exchange surface area (normal DLCO) but prominent airway obstruction from mucosal edema, mucus plugging, and smooth muscle hypertrophy.

GOLD (Global Initiative for Chronic Obstructive Lung Disease) classification guides stable COPD management. Spirometric severity: GOLD 1 (mild, FEV1 ≥ 80%), GOLD 2 (moderate, 50-79%), GOLD 3 (severe, 30-49%), GOLD 4 (very severe, < 30%). The ABCD assessment tool combines symptom burden (mMRC dyspnea scale, CAT score) with exacerbation history to determine pharmacotherapy: Group A (low symptoms, low exacerbation risk) — SABA PRN; Group B (high symptoms, low exacerbation risk) — LABA or LAMA; Group E (any symptoms with ≥ 2 exacerbations or ≥ 1 hospitalization) — LABA + LAMA, add ICS if eosinophils > 300.

Acute COPD exacerbation management follows the ABC approach: Antibiotics (if purulent sputum, increased sputum volume, or increased dyspnea — 2 of 3 Anthonisen criteria, or any patient requiring hospitalization), Bronchodilators (SABA + SAMA via nebulizer or MDI q1-4h, add IV aminophylline only as last line), and Corticosteroids (prednisone 40 mg PO x 5 days or IV equivalent — longer courses provide no additional benefit). Controlled oxygen therapy targets SpO2 88-92%, not 94-98%, to avoid suppressing the hypoxic ventilatory drive in patients with chronic CO2 retention. The Haldane effect explains why excessive oxygen worsens hypercapnia: as hemoglobin becomes saturated with O2, it releases CO2 (Haldane effect), increasing dissolved CO2 and PaCO2. Additionally, oxygen relieves hypoxic pulmonary vasoconstriction, increasing perfusion to poorly ventilated units and worsening V/Q mismatch.

BiPAP is first-line for acute hypercapnic respiratory failure in COPD (pH 7.25-7.35, PaCO2 > 45 despite maximal therapy). Level I evidence shows NIV in this population reduces intubation rates from 70% to 30%, reduces mortality, and shortens hospital stay. If pH < 7.25 or the patient is obtunded, intubation may be necessary. During mechanical ventilation of COPD patients, the primary concern is auto-PEEP from incomplete expiration. Settings should prioritize prolonged expiratory time: lower RR (10-12), lower VT, shorter inspiratory time (I:E ratio 1:3 to 1:5). Applied PEEP should be set at 75-85% of measured auto-PEEP to reduce the inspiratory threshold load without worsening air trapping.

Long-term oxygen therapy (LTOT) criteria: PaO2 ≤ 55 mmHg or SpO2 ≤ 88% at rest, OR PaO2 56-59 mmHg with evidence of cor pulmonale, right heart failure, or polycythemia (Hct > 55%). LTOT for ≥ 15 hours/day improves survival in hypoxemic COPD patients (NOTT trial and MRC trial).`,
    riskFactors: [
      "Smoking as the primary cause — 15-20% of smokers develop clinically significant COPD",
      "Alpha-1 antitrypsin deficiency causing early-onset panacinar emphysema (screen if onset < 45 years)",
      "Occupational dust and chemical exposure (coal dust, cadmium, silica, grain dust)",
      "Frequent exacerbations accelerating lung function decline — each exacerbation may cause irreversible FEV1 loss",
      "Comorbid cardiac disease (30-40% of COPD mortality is cardiovascular)",
      "Malnutrition and muscle wasting reducing respiratory muscle strength and exercise tolerance",
      "Cor pulmonale from chronic hypoxic pulmonary vasoconstriction causing right ventricular failure",
      "Depression and anxiety complicating symptom perception and treatment adherence"
    ],
    diagnostics: [
      "Post-bronchodilator spirometry confirming FEV1/FVC < 0.70 — required for COPD diagnosis",
      "Lung volumes showing hyperinflation (increased TLC, increased RV, elevated RV/TLC ratio)",
      "DLCO distinguishing emphysema (decreased) from chronic bronchitis (normal)",
      "ABG for stable baseline PaCO2 documentation and during acute exacerbation",
      "Chest X-ray: hyperinflation, flat diaphragms, increased retrosternal air space, bullae in emphysema",
      "Alpha-1 antitrypsin level in patients with COPD onset < 45 years or family history",
      "6-minute walk test for functional capacity assessment and oxygen desaturation evaluation",
      "CT chest for bullae assessment, lung volume reduction surgery evaluation, and cancer screening"
    ],
    management: [
      "Acute exacerbation: SABA + SAMA nebulized q1-4h, prednisone 40 mg x 5 days, antibiotics if 2/3 Anthonisen criteria",
      "Controlled oxygen: target SpO2 88-92% — use Venturi mask for precise FiO2 delivery in acute exacerbation",
      "BiPAP for acute hypercapnic failure (pH 7.25-7.35): IPAP 10-20, EPAP 4-6, reassess ABG at 1-2 hours",
      "Mechanical ventilation: low RR, short inspiratory time, I:E 1:3-1:5, applied PEEP at 75-85% of auto-PEEP",
      "Stable COPD: inhaled bronchodilators per GOLD group (SABA PRN → LABA or LAMA → LABA + LAMA ± ICS)",
      "Pulmonary rehabilitation: exercise training, education, self-management — improves exercise capacity and QOL",
      "LTOT when PaO2 ≤ 55 or SpO2 ≤ 88% at rest — prescribe for ≥ 15 hours/day to improve survival",
      "Smoking cessation: most important intervention at any stage — combination of counseling + pharmacotherapy (NRT, bupropion, varenicline)"
    ],
    nursingActions: [
      "Titrate oxygen carefully to SpO2 88-92% — do NOT reflexively target 94-98% in COPD patients",
      "Monitor for oxygen-induced hypercapnia: check ABG 30-60 minutes after initiating or increasing oxygen",
      "Assess for auto-PEEP in ventilated COPD patients by performing expiratory hold maneuver",
      "Educate patients on proper inhaler technique — demonstrate, observe, correct. Reassess at each visit",
      "Encourage pursed-lip breathing to prolong expiration and prevent dynamic airway collapse",
      "Assess nutritional status — BMI < 20 in COPD is associated with increased mortality",
      "Screen for depression and anxiety — 40% of COPD patients have clinically significant psychological comorbidity",
      "Educate on exacerbation action plans: when to increase bronchodilators, when to start prednisone, when to seek emergency care"
    ],
    signs: [
      "Acute exacerbation: increased dyspnea, increased sputum volume/purulence, increased cough, worsening wheezing",
      "Hypercapnic respiratory failure: somnolence, confusion, asterixis, headache (from cerebral vasodilation)",
      "Cor pulmonale: peripheral edema, elevated JVP, hepatomegaly, tricuspid regurgitation murmur",
      "Auto-PEEP on ventilator: failure of expiratory flow to reach zero before next inspiration on flow waveform",
      "Barrel chest, pursed-lip breathing, tripod positioning, decreased breath sounds, prolonged expiratory phase",
      "Oxygen-induced hypercapnia: paradoxical worsening of somnolence after oxygen initiation"
    ],
    medications: [
      { name: "Albuterol (SABA)", dose: "2.5-5 mg nebulized or 4-8 puffs MDI q1-4h acute, PRN maintenance", route: "Inhaled", purpose: "Short-acting bronchodilator for acute relief and exacerbation management" },
      { name: "Ipratropium (SAMA)", dose: "0.5 mg nebulized or 4-8 puffs MDI q4-6h", route: "Inhaled", purpose: "Short-acting anticholinergic combined with SABA in acute exacerbation for additive bronchodilation" },
      { name: "Tiotropium (LAMA)", dose: "18 mcg DPI once daily or 2.5 mcg soft mist inhaler once daily", route: "Inhaled", purpose: "Long-acting anticholinergic maintenance therapy reducing exacerbations and improving FEV1" },
      { name: "Prednisone", dose: "40 mg PO daily x 5 days", route: "Oral", purpose: "Systemic corticosteroid for acute exacerbation reducing treatment failure and accelerating recovery" }
    ],
    pearls: [
      "SpO2 target in COPD is 88-92% — over-oxygenation kills through oxygen-induced hypercapnia via the Haldane effect and V/Q mismatch worsening",
      "5 days of prednisone is as effective as 14 days for COPD exacerbation with fewer side effects (REDUCE trial)",
      "Applied PEEP at 75-85% of auto-PEEP in ventilated COPD patients reduces work of triggering without worsening hyperinflation",
      "DLCO differentiates emphysema (low — alveolar destruction) from chronic bronchitis (normal — airways disease) when spirometry shows obstruction",
      "Alpha-1 antitrypsin deficiency should be tested in ALL COPD patients per guidelines — many cases are missed",
      "Smoking cessation at ANY stage of COPD slows FEV1 decline to near-normal rates — it is never too late to quit"
    ],
    quiz: [
      { question: "A COPD patient on 4 L/min nasal cannula has SpO2 96% and becomes increasingly drowsy. ABG shows pH 7.28, PaCO2 78. What happened?", options: ["Normal COPD progression", "Oxygen-induced hypercapnia from over-oxygenation", "Acute pulmonary embolism", "Medication side effect"], correct: 1, rationale: "SpO2 of 96% in a COPD patient with chronic hypercapnia indicates over-oxygenation. The excessive oxygen suppresses hypoxic ventilatory drive, worsens V/Q mismatch via release of hypoxic pulmonary vasoconstriction, and increases dissolved CO2 via the Haldane effect. Target SpO2 88-92% and reduce oxygen immediately." },
      { question: "During mechanical ventilation of a COPD patient, which I:E ratio would best reduce auto-PEEP?", options: ["1:1 (equal inspiration and expiration)", "2:1 (longer inspiration)", "1:4 (longer expiration)", "1:1.5 (slightly longer expiration)"], correct: 2, rationale: "COPD patients need prolonged expiratory time to empty their air-trapped lungs. An I:E ratio of 1:4 or 1:5 provides maximum expiratory time to reduce auto-PEEP. Combined with lower RR and shorter inspiratory time, this allows more complete exhalation and reduces dynamic hyperinflation." },
      { question: "Which criterion qualifies a COPD patient for long-term home oxygen therapy?", options: ["PaO2 ≤ 65 mmHg at rest", "SpO2 ≤ 92% at rest", "PaO2 ≤ 55 mmHg or SpO2 ≤ 88% at rest", "Any patient with GOLD stage 3 or 4 COPD"], correct: 2, rationale: "LTOT criteria: PaO2 ≤ 55 mmHg or SpO2 ≤ 88% at rest, OR PaO2 56-59 with cor pulmonale, right heart failure, or polycythemia. LTOT for ≥ 15 hours/day improves survival in hypoxemic COPD (NOTT and MRC trials). Not all severe COPD patients are hypoxemic enough to qualify." }
    ]
  },

  "asthma-respiratory-management-rrt": {
    title: "Asthma Respiratory Management",
    cellular: `Asthma is a chronic inflammatory airway disease characterized by variable airflow obstruction, bronchial hyperresponsiveness, and airway remodeling. Respiratory therapists manage asthma across the spectrum from chronic maintenance to life-threatening status asthmaticus. Understanding the pathophysiology, pharmacologic stepwise approach, acute exacerbation management, and ventilator strategies for severe asthma is essential for board certification and clinical excellence.

The pathophysiology of asthma involves three key processes: airway inflammation (eosinophilic infiltration, mast cell degranulation, T-helper 2 lymphocyte activation releasing IL-4, IL-5, IL-13), bronchospasm (smooth muscle contraction triggered by allergens, irritants, exercise, cold air), and mucus hypersecretion (goblet cell hyperplasia producing thick, tenacious mucus plugs). In chronic asthma, airway remodeling occurs: subepithelial fibrosis, smooth muscle hypertrophy, increased vascularity, and permanent narrowing. These changes explain why some long-standing asthma patients develop fixed airflow obstruction unresponsive to bronchodilators.

The NAEPP (National Asthma Education and Prevention Program) stepwise approach guides chronic asthma management. Step 1 (intermittent): SABA PRN (albuterol). Step 2 (mild persistent): low-dose ICS (fluticasone 88-264 mcg/day) or leukotriene modifier (montelukast). Step 3 (moderate persistent): low-dose ICS + LABA (fluticasone/salmeterol) or medium-dose ICS. Step 4 (severe persistent): medium-dose ICS + LABA. Step 5 (very severe): high-dose ICS + LABA. Step 6: add oral corticosteroid or biologic therapy (omalizumab for allergic asthma, mepolizumab/benralizumab for eosinophilic asthma, dupilumab for type 2 inflammation). Assess control at every visit and step up if uncontrolled, step down if well-controlled for ≥ 3 months.

Acute asthma exacerbation assessment uses clinical parameters: respiratory rate, accessory muscle use, ability to speak in sentences/phrases/words, peak expiratory flow (PEF) compared to personal best or predicted (mild > 70%, moderate 40-69%, severe < 40%), SpO2, and ABG when severe. Initial management: continuous albuterol nebulization (10-15 mg/hr) or high-dose MDI (8 puffs q20min x 3), ipratropium 0.5 mg q20min x 3 doses, systemic corticosteroids within the first hour (methylprednisolone 125 mg IV or prednisone 60 mg PO), and supplemental oxygen to target SpO2 ≥ 93%.

Status asthmaticus is a severe asthma exacerbation that does not respond to initial aggressive bronchodilator therapy and represents a life-threatening emergency. Clinical features: inability to speak, diaphoresis, altered mental status, silent chest on auscultation (no wheezing due to critically reduced airflow — an ominous sign), pulsus paradoxus > 25 mmHg, PEF < 25% predicted. ABG typically shows initial respiratory alkalosis progressing to metabolic acidosis and then respiratory acidosis as the patient fatigues — a normalizing PaCO2 in severe asthma is a danger sign indicating impending respiratory arrest.

Mechanical ventilation in severe asthma (status asthmaticus) is extremely high-risk due to severe dynamic hyperinflation and auto-PEEP. Key ventilator principles: permissive hypercapnia is essential (accept PaCO2 60-80+ as long as pH > 7.20), low respiratory rate (8-12), low tidal volume (6-8 mL/kg IBW), short inspiratory time (0.8-1.2 seconds), prolonged I:E ratio (1:4 to 1:5), and NO applied PEEP initially (auto-PEEP alone may be 15-25 cmH2O). Monitor for auto-PEEP constantly. If cardiovascular collapse occurs, disconnect from the ventilator for 30-60 seconds to allow complete exhalation — this is diagnostic and therapeutic for dynamic hyperinflation.`,
    riskFactors: [
      "History of near-fatal asthma (previous intubation or ICU admission for asthma)",
      "Frequent emergency department visits (> 2 per year) or hospitalizations for asthma",
      "Current or recent use of systemic corticosteroids indicating poorly controlled disease",
      "Failure to use maintenance inhaled corticosteroids (ICS non-adherence is the most common cause of poor control)",
      "Sensitivity to aspirin/NSAIDs (Samter's triad: asthma + nasal polyps + aspirin sensitivity)",
      "African American and Hispanic patients disproportionately affected by severe asthma and asthma mortality",
      "Psychosocial factors: depression, substance abuse, poor perception of dyspnea, limited healthcare access",
      "Environmental triggers: allergens (dust mites, mold, animal dander), air pollution, occupational exposures"
    ],
    diagnostics: [
      "Spirometry: reduced FEV1/FVC with significant bronchodilator response (≥ 12% AND ≥ 200 mL improvement in FEV1)",
      "Peak expiratory flow (PEF) monitoring for exacerbation severity assessment and home monitoring",
      "ABG in severe exacerbation — watch for normalizing PaCO2 as ominous sign of impending respiratory arrest",
      "Methacholine bronchial challenge when baseline spirometry is normal (positive at PC20 < 8 mg/mL)",
      "Fractional exhaled nitric oxide (FeNO) > 50 ppb suggesting eosinophilic airway inflammation responsive to ICS",
      "Blood eosinophil count and total IgE for biologic therapy eligibility assessment",
      "Chest X-ray in acute exacerbation to rule out pneumothorax, pneumonia, or pneumomediastinum",
      "Allergy testing (skin prick or serum IgE) to identify trigger allergens for avoidance strategies"
    ],
    management: [
      "Continuous albuterol nebulization 10-15 mg/hr for severe exacerbation unresponsive to intermittent dosing",
      "Systemic corticosteroids within 1 hour of ED presentation: methylprednisolone 125 mg IV or prednisone 60 mg PO",
      "Ipratropium 0.5 mg nebulized q20min x 3 doses in first hour — additive benefit to SABA in severe attacks",
      "IV magnesium sulfate 2 g over 20 minutes for refractory severe asthma (smooth muscle relaxant)",
      "Heliox 70:30 or 80:20 to reduce turbulent flow resistance in severe bronchospasm",
      "If intubation required: ketamine induction (bronchodilator properties), largest ETT possible, permissive hypercapnia strategy",
      "Stepwise chronic management: assess control → step up if uncontrolled, step down if controlled ≥ 3 months",
      "Asthma action plan for every patient: green (controlled), yellow (increasing symptoms — increase therapy), red (emergency)"
    ],
    nursingActions: [
      "Assess peak flow on arrival and after each treatment cycle to objectively track response",
      "Monitor for signs of deterioration during treatment: silent chest, inability to speak, normalizing PaCO2, altered mental status",
      "Administer systemic corticosteroids within 1 hour — early administration reduces hospitalization rates",
      "Coach proper MDI technique with spacer: shake, exhale fully, actuate at start of slow inhalation, hold breath 10 seconds",
      "Educate on ICS use: rinse mouth after each use to prevent oral candidiasis and dysphonia",
      "Review and update asthma action plan at every visit — ensure patient can identify red zone symptoms",
      "Assess trigger exposure and recommend environmental controls: HEPA filters, dust mite covers, mold remediation",
      "Monitor for systemic corticosteroid side effects in frequent users: hyperglycemia, osteoporosis, adrenal suppression"
    ],
    signs: [
      "Mild exacerbation: wheezing at end-expiration, speaks in full sentences, PEF > 70%, SpO2 > 95%",
      "Moderate exacerbation: wheezing throughout expiration, speaks in phrases, PEF 40-69%, SpO2 91-95%",
      "Severe exacerbation: wheezing throughout inspiration and expiration, speaks in words only, PEF < 40%, SpO2 < 91%",
      "Life-threatening: silent chest (no wheezing = no airflow), unable to speak, altered mental status, pulsus paradoxus > 25 mmHg",
      "Impending respiratory arrest: normalizing PaCO2 in a previously hypocapnic patient (exhaustion losing compensation)",
      "Air trapping during ventilation: auto-PEEP > 15, decreasing blood pressure with each breath, worsening hyperinflation on X-ray"
    ],
    medications: [
      { name: "Albuterol (SABA)", dose: "2.5-5 mg nebulized q20min x 3 then q1-4h, or continuous 10-15 mg/hr", route: "Inhaled", purpose: "Beta-2 agonist causing bronchial smooth muscle relaxation — first-line for acute bronchospasm" },
      { name: "Fluticasone/Salmeterol (ICS/LABA)", dose: "100/50 to 500/50 mcg DPI BID", route: "Inhaled", purpose: "Combination maintenance therapy: ICS reduces inflammation, LABA provides sustained bronchodilation" },
      { name: "Magnesium Sulfate", dose: "2 g IV over 20 minutes", route: "Intravenous", purpose: "Smooth muscle relaxant for severe refractory asthma — inhibits calcium-mediated bronchospasm" },
      { name: "Omalizumab (Xolair)", dose: "150-375 mg SQ q2-4 weeks (based on IgE and weight)", route: "Subcutaneous", purpose: "Anti-IgE monoclonal antibody for moderate-severe allergic asthma uncontrolled on Step 4-5 therapy" }
    ],
    pearls: [
      "A silent chest in asthma is NOT improving — it means airflow is critically reduced. This is a life-threatening emergency",
      "Normalizing PaCO2 in a tachypneic asthma patient signals fatigue and impending respiratory arrest — prepare for intubation",
      "In ventilated asthma: NO applied PEEP initially, low RR (8-12), prolonged expiratory time (I:E 1:4-1:5), permissive hypercapnia",
      "Ketamine is the preferred induction agent for intubation in severe asthma due to its bronchodilatory properties",
      "ICS adherence is the most impactful modifiable factor in asthma control — assess inhaler technique at EVERY visit",
      "PEF is effort-dependent but useful for trends — compare to patient's personal best, not population predicted values"
    ],
    quiz: [
      { question: "A severe asthma patient arrives with RR 36, ABG pH 7.44, PaCO2 32. One hour later: RR 28, ABG pH 7.38, PaCO2 42. What does this change indicate?", options: ["Improvement — PaCO2 is normalizing", "Worsening — respiratory muscle fatigue with impending arrest", "Normal finding — no intervention needed", "Improvement — pH is normalizing"], correct: 1, rationale: "In severe asthma, the initial response is hyperventilation causing respiratory alkalosis (low PaCO2). A normalizing PaCO2 in a patient who is still in distress (RR still elevated, severity unchanged) indicates respiratory muscle fatigue — the patient can no longer maintain hyperventilation to compensate. This is an ominous sign of impending respiratory arrest requiring immediate preparation for intubation." },
      { question: "Which ventilator setting is MOST important to optimize in a mechanically ventilated status asthmaticus patient?", options: ["High PEEP to counterbalance auto-PEEP", "Maximum tidal volume for effective ventilation", "Prolonged expiratory time (I:E 1:4-1:5) to reduce air trapping", "High respiratory rate to normalize PaCO2"], correct: 2, rationale: "The primary ventilator concern in status asthmaticus is dynamic hyperinflation from air trapping. Prolonging expiratory time (I:E 1:4-1:5) allows more complete exhalation, reducing auto-PEEP. This requires lower RR, shorter inspiratory time, and accepting permissive hypercapnia. High RR or VT worsens air trapping; applied PEEP should initially be zero." },
      { question: "What is the first-line medication for prevention of exercise-induced bronchospasm?", options: ["Oral montelukast 30 minutes before exercise", "Inhaled albuterol 15-30 minutes before exercise", "Inhaled corticosteroid immediately before exercise", "Oral theophylline 1 hour before exercise"], correct: 1, rationale: "Inhaled SABA (albuterol) 15-30 minutes before exercise is the first-line prophylactic treatment for exercise-induced bronchospasm (EIB). It provides 2-4 hours of protection. For patients with frequent EIB despite SABA pre-treatment, daily ICS or montelukast should be added as controller therapy." }
    ]
  },

  "neonatal-respiratory-care-rrt": {
    title: "Neonatal Respiratory Care",
    cellular: `Neonatal respiratory care demands specialized knowledge of fetal lung development, transitional physiology, surfactant biology, and size-appropriate ventilatory strategies. Respiratory therapists managing neonates must understand the unique challenges of premature lung disease, congenital anomalies, and the delicate balance between adequate oxygenation and oxygen toxicity.

Fetal lung development progresses through five stages: embryonic (3-7 weeks — airway branching begins), pseudoglandular (7-17 weeks — complete airway branching, type II pneumocytes begin appearing), canalicular (17-27 weeks — primitive gas exchange possible, surfactant production begins), saccular (28-36 weeks — terminal sac formation, surfactant production increases), and alveolar (36 weeks to 8 years — mature alveoli form). Viability threshold is approximately 23-24 weeks gestational age, corresponding to the late canalicular/early saccular stage when primitive gas exchange surfaces and minimal surfactant are present.

Surfactant is produced by type II alveolar pneumocytes and consists of approximately 90% lipids (primarily dipalmitoylphosphatidylcholine, DPPC) and 10% proteins (SP-A, SP-B, SP-C, SP-D). Surfactant reduces alveolar surface tension, preventing atelectasis at end-expiration (Laplace's Law: P = 2T/r — without surfactant, small alveoli have high collapsing pressure). Surfactant deficiency in premature neonates causes Respiratory Distress Syndrome (RDS), characterized by diffuse atelectasis, ground-glass opacities and air bronchograms on chest X-ray, hypoxemia, and hypercapnia. Antenatal betamethasone (two doses IM 24 hours apart) given to mothers at risk for preterm delivery at 24-34 weeks accelerates fetal lung maturation and surfactant production, reducing RDS incidence and severity.

Exogenous surfactant replacement therapy (beractant/Survanta, calfactant/Infasurf, poractant alfa/Curosurf) is administered via the endotracheal tube. Early rescue treatment within 2 hours of birth improves outcomes compared to delayed treatment. The INSURE technique (INtubate, SURfactant, Extubate to CPAP) reduces ventilator days. Less-invasive surfactant administration (LISA) delivers surfactant via thin catheter during spontaneous CPAP breathing, avoiding intubation entirely.

Neonatal ventilation strategies must account for tiny lung volumes (VT 4-6 mL/kg in neonates), high respiratory rates (normal 30-60), and extreme susceptibility to VILI. Volume-targeted ventilation is increasingly preferred over pressure-limited ventilation in neonates because it delivers consistent VT despite changing compliance. Target VT: 4-6 mL/kg. Permissive hypercapnia (target PaCO2 45-55 mmHg) reduces VILI. High-frequency oscillatory ventilation (HFOV) delivers very small tidal volumes (1-3 mL/kg) at very rapid rates (3-15 Hz = 180-900 breaths/min), maintaining lung recruitment with continuous distending pressure while generating CO2 elimination through molecular diffusion. HFOV is used as rescue for conventional ventilation failure in neonates.

Oxygen management in neonates requires precise targeting to avoid both hypoxemia and hyperoxemia. Target SpO2: 90-95% in premature neonates (not > 95%). Hyperoxemia causes retinopathy of prematurity (ROP) through inhibition of VEGF in the developing retinal vasculature, leading to abnormal neovascularization and potential blindness. Hyperoxemia also increases risk of bronchopulmonary dysplasia (BPD) and necrotizing enterocolitis. FiO2 should be continuously monitored and actively titrated, with oxygen analyzer verification of delivered FiO2.

Bronchopulmonary dysplasia (BPD) is the most common chronic lung disease of prematurity, defined as need for supplemental oxygen at 36 weeks corrected gestational age. New BPD reflects disrupted alveolar and pulmonary vascular development rather than the fibrotic scarring seen historically. Prevention strategies: minimize oxygen exposure, minimize ventilator duration, use volume-targeted ventilation, use caffeine (reduces BPD incidence), and provide adequate nutrition.`,
    riskFactors: [
      "Prematurity < 34 weeks with surfactant deficiency causing RDS",
      "Meconium aspiration syndrome causing chemical pneumonitis and airway obstruction",
      "Persistent pulmonary hypertension of the newborn (PPHN) causing right-to-left shunting",
      "Congenital diaphragmatic hernia (CDH) causing pulmonary hypoplasia and pulmonary hypertension",
      "Retinopathy of prematurity from excessive oxygen exposure in premature neonates",
      "Bronchopulmonary dysplasia from prolonged ventilation and oxygen exposure",
      "Transient tachypnea of the newborn (TTN) from delayed clearance of fetal lung fluid",
      "Congenital surfactant protein deficiency (rare, lethal without transplant)"
    ],
    diagnostics: [
      "Chest X-ray: ground-glass with air bronchograms (RDS), patchy infiltrates (MAS), whiteout (severe ARDS/PPHN)",
      "Arterial or capillary blood gas with pre- and post-ductal SpO2 comparison for PPHN screening",
      "Pre-ductal (right hand) and post-ductal (foot) SpO2 difference > 5-10% suggesting PPHN",
      "Echocardiography for PPHN assessment, patent ductus arteriosus, and cardiac anomaly evaluation",
      "Continuous pulse oximetry with SpO2 target 90-95% in premature neonates",
      "Oxygen analyzer verification of delivered FiO2 at least every 4 hours in all oxygen delivery systems",
      "Transcutaneous CO2 monitoring for non-invasive continuous ventilation assessment",
      "Lecithin-to-sphingomyelin (L/S) ratio > 2.0 or positive phosphatidylglycerol (PG) indicating fetal lung maturity"
    ],
    management: [
      "Exogenous surfactant replacement via ETT within 2 hours of birth for RDS — INSURE or LISA technique preferred",
      "Nasal CPAP 5-8 cmH2O as first-line respiratory support for premature neonates with RDS — reduces need for intubation",
      "Volume-targeted ventilation with VT 4-6 mL/kg and permissive hypercapnia (PaCO2 45-55) to minimize VILI",
      "HFOV as rescue for conventional ventilation failure — set MAP 2 cmH2O above prior MAP, amplitude for visible chest wiggle",
      "Inhaled nitric oxide 20 ppm for PPHN to selectively vasodilate pulmonary vasculature and reduce right-to-left shunting",
      "Gentle ventilation for CDH: permissive hypercapnia, peak pressures < 25 cmH2O, avoid hyperventilation-induced alkalosis",
      "Caffeine citrate for apnea of prematurity and BPD prevention: loading dose 20 mg/kg, maintenance 5-10 mg/kg/day",
      "Antenatal betamethasone for mothers at 24-34 weeks gestation at risk for preterm delivery"
    ],
    nursingActions: [
      "Titrate FiO2 continuously to maintain SpO2 90-95% in premature neonates — avoid SpO2 > 95%",
      "Monitor both pre-ductal and post-ductal SpO2 simultaneously to detect right-to-left ductal shunting",
      "Verify delivered FiO2 with calibrated oxygen analyzer every 4 hours and with any FiO2 change",
      "Maintain neutral thermal environment to minimize oxygen consumption — cold stress increases metabolic demand",
      "Suction gently and only when indicated — routine suctioning causes desaturation, bradycardia, and IVH risk",
      "Position infant with head midline and HOB slightly elevated to optimize cerebral venous drainage",
      "Monitor for surfactant administration complications: transient desaturation, bradycardia, ETT obstruction",
      "Cluster care activities to minimize disturbance and allow recovery periods between interventions"
    ],
    signs: [
      "RDS: tachypnea, nasal flaring, grunting (auto-PEEP mechanism), intercostal/substernal retractions within hours of birth",
      "PPHN: severe cyanosis, labile SpO2, pre-/post-ductal SpO2 gradient > 5-10%, systemic hypotension",
      "Meconium aspiration: meconium-stained amniotic fluid, respiratory distress, barrel-chest from air trapping",
      "TTN: tachypnea (RR 60-120) with mild oxygen requirement, resolving within 24-72 hours (self-limited)",
      "BPD developing: persistent oxygen requirement, inability to wean from respiratory support at 28 days of life",
      "Apnea of prematurity: cessation of breathing ≥ 20 seconds or shorter with bradycardia/desaturation"
    ],
    medications: [
      { name: "Beractant (Survanta)", dose: "100 mg/kg (4 mL/kg) intratracheal, up to 4 doses q6h", route: "Intratracheal", purpose: "Bovine-derived exogenous surfactant replacement for RDS — reduces surface tension and prevents atelectasis" },
      { name: "Inhaled Nitric Oxide", dose: "20 ppm initially, wean gradually to < 5 ppm before discontinuing", route: "Inhaled via ventilator circuit", purpose: "Selective pulmonary vasodilator for PPHN — reduces right-to-left shunting without systemic hypotension" },
      { name: "Caffeine Citrate", dose: "Loading: 20 mg/kg IV/PO, Maintenance: 5-10 mg/kg/day", route: "IV or Oral", purpose: "Central respiratory stimulant for apnea of prematurity — also reduces BPD incidence" },
      { name: "Betamethasone (antenatal)", dose: "12 mg IM q24h x 2 doses to mother", route: "Intramuscular (maternal)", purpose: "Accelerate fetal lung maturation and surfactant production in threatened preterm delivery at 24-34 weeks" }
    ],
    pearls: [
      "Grunting in neonates is physiologic auto-PEEP — the infant partially closes the glottis during expiration to maintain FRC. It is a sign of respiratory distress",
      "SpO2 target 90-95% in premature neonates — SpO2 > 95% increases ROP risk without improving outcomes",
      "Pre-ductal SpO2 (right hand) > post-ductal SpO2 (foot) by > 5-10% = PPHN until proven otherwise",
      "Caffeine citrate reduces BPD incidence by approximately 36% in addition to treating apnea — give it early to all premature neonates",
      "The INSURE technique (Intubate, Surfactant, Extubate to CPAP) reduces ventilator days and BPD compared to continued ventilation after surfactant",
      "In CDH, do NOT bag-mask ventilate — air enters the herniated bowel in the chest, further compressing the hypoplastic lung"
    ],
    quiz: [
      { question: "A 28-week premature neonate has ground-glass opacities with air bronchograms on chest X-ray, grunting, and nasal flaring. What is the most likely diagnosis and initial treatment?", options: ["TTN — observe and provide supplemental oxygen", "RDS — administer exogenous surfactant and initiate CPAP", "Pneumonia — start antibiotics and intubate", "PPHN — start inhaled nitric oxide"], correct: 1, rationale: "Ground-glass opacities with air bronchograms in a premature neonate is the classic radiographic finding of RDS (surfactant deficiency). Grunting and nasal flaring indicate respiratory distress. Initial management: surfactant replacement therapy (preferably via INSURE technique) and nasal CPAP support. TTN typically occurs in term/near-term neonates and has a different X-ray pattern." },
      { question: "A neonate has right hand SpO2 of 95% and left foot SpO2 of 80%. What does this gradient indicate?", options: ["Normal transitional circulation", "Persistent pulmonary hypertension with right-to-left ductal shunting", "Coarctation of the aorta", "Equipment malfunction"], correct: 1, rationale: "A pre-ductal (right hand) SpO2 significantly higher than post-ductal (foot) SpO2 indicates right-to-left shunting through the patent ductus arteriosus. This occurs in PPHN when pulmonary vascular resistance exceeds systemic vascular resistance. Treatment includes oxygen, inhaled nitric oxide 20 ppm, and hemodynamic support." },
      { question: "What is the target SpO2 range for a 26-week premature neonate?", options: ["95-100%", "90-95%", "85-90%", "80-85%"], correct: 1, rationale: "Target SpO2 for premature neonates is 90-95%. SpO2 > 95% increases the risk of retinopathy of prematurity (ROP) from hyperoxemia-induced disruption of retinal vascular development. SpO2 < 90% increases mortality risk. Continuous FiO2 titration and oxygen analyzer verification are essential." }
    ]
  },

  "pediatric-respiratory-care-rrt": {
    title: "Pediatric Respiratory Care",
    cellular: `Pediatric respiratory care requires understanding the anatomical and physiological differences between children and adults that influence respiratory disease presentation, assessment, and management. Children are not simply small adults — their unique airway anatomy, respiratory physiology, and developmental considerations demand specialized approaches.

Pediatric airway differences from adults include: proportionally larger head and occiput (head-tilt alone may obstruct the airway — use jaw thrust or shoulder roll), larger tongue relative to oral cavity, epiglottis that is omega-shaped and more cephalad (angled at 45 degrees vs adult horizontal), larynx positioned more anterior and cephalad (C3-C4 vs adult C4-C6), and the narrowest point of the pediatric airway is at the cricoid ring (subglottic, circular) vs the glottis (vocal cords) in adults. This means uncuffed ETTs were traditionally used in children < 8 years, though modern high-volume low-pressure cuffed tubes are now acceptable with careful cuff pressure monitoring (< 20-25 cmH2O). ETT size estimation: (age/4) + 4 for uncuffed, (age/4) + 3.5 for cuffed. ETT depth: internal diameter x 3 for oral tubes.

Respiratory physiology differences: higher metabolic rate (oxygen consumption 6-8 mL/kg/min vs adult 3-4 mL/kg/min) causing faster desaturation during apnea, higher respiratory rates (newborn 30-60, infant 24-38, toddler 22-30, preschool 20-28, school-age 16-24), smaller functional residual capacity (FRC) relative to closing volume making children more prone to atelectasis, more compliant chest wall (rib cage is cartilaginous, not ossified) causing visible retractions and chest wall collapse during respiratory distress, horizontal rib orientation (vs adult downward angle) limiting inspiratory reserve, and diaphragm-dependent breathing in infants (diaphragm is flatter, more horizontal, with fewer type I fatigue-resistant fibers making infants more susceptible to diaphragm fatigue).

Croup (laryngotracheobronchitis) is the most common cause of upper airway obstruction in children aged 6 months to 3 years. Caused by parainfluenza virus, it produces subglottic edema causing inspiratory stridor, barking (seal-like) cough, hoarseness, and the characteristic steeple sign on AP neck X-ray (subglottic narrowing). Management: single dose of dexamethasone 0.6 mg/kg PO/IM (effective even for mild croup), nebulized racemic epinephrine 0.5 mL of 2.25% solution for moderate-severe croup (temporary relief — observe for rebound effect for 3-4 hours), humidified oxygen, and close monitoring. Intubation is rarely needed; use an ETT 0.5-1 mm smaller than age-predicted.

Bronchiolitis, caused primarily by respiratory syncytial virus (RSV) in infants < 12 months, produces lower airway obstruction with wheezing, tachypnea, accessory muscle use, and feeding difficulty. Management is primarily supportive: supplemental oxygen for SpO2 < 90-92%, nasal suctioning (infants are obligate nasal breathers), IV or NG hydration if unable to feed, and HFNC or CPAP for impending respiratory failure. Importantly, bronchodilators and corticosteroids have NOT shown benefit in bronchiolitis and are NOT recommended. Palivizumab (Synagis) provides passive immunoprophylaxis for high-risk infants (premature < 29 weeks, hemodynamically significant congenital heart disease, chronic lung disease of prematurity).

Pediatric acute respiratory distress syndrome (PARDS) uses the Pediatric Acute Lung Injury Consensus Conference (PALICC) criteria: acute onset, bilateral infiltrates, non-cardiogenic, and oxygenation index (OI = MAP x FiO2 x 100 / PaO2) classification: mild OI 4-7.9, moderate OI 8-15.9, severe OI ≥ 16. Lung-protective ventilation with VT 5-8 mL/kg, Pplat < 28 cmH2O, and lower driving pressure targets applies to PARDS as well.`,
    riskFactors: [
      "Prematurity causing underdeveloped lungs with surfactant deficiency and predisposition to BPD",
      "RSV bronchiolitis in infants < 6 months with highest hospitalization and ICU admission rates",
      "Foreign body aspiration (peak age 1-3 years) causing acute airway obstruction — peanuts, grapes, small toys",
      "Asthma exacerbation in children — most common chronic disease of childhood",
      "Congenital airway anomalies: tracheomalacia, laryngomalacia, vascular rings",
      "Obesity increasingly affecting pediatric respiratory function (decreased FRC, increased work of breathing)",
      "Secondhand smoke exposure increasing respiratory infections, asthma, and SIDS risk",
      "Epiglottitis (rare post-Hib vaccine but still occurs) — medical emergency with potential complete airway obstruction"
    ],
    diagnostics: [
      "Respiratory rate assessment by age-appropriate norms (tachypnea is the most sensitive sign of respiratory distress)",
      "Assessment for retractions (substernal, intercostal, supraclavicular, suprasternal) grading respiratory distress severity",
      "AP neck X-ray for steeple sign (croup) vs thumb sign (epiglottitis)",
      "Chest X-ray: bilateral hyperinflation in bronchiolitis, focal opacity in pneumonia, unilateral air trapping in foreign body",
      "Pulse oximetry with age-appropriate SpO2 interpretation (> 94% normal in children, lower targets in specific conditions)",
      "Capillary blood gas for less invasive acid-base assessment in stable pediatric patients",
      "Flexible bronchoscopy for suspected foreign body aspiration or recurrent/persistent airway symptoms",
      "Oxygenation index (OI = MAP x FiO2 x 100 / PaO2) for PARDS severity classification"
    ],
    management: [
      "Croup: dexamethasone 0.6 mg/kg PO/IM single dose + nebulized racemic epinephrine for moderate-severe stridor",
      "Bronchiolitis: supportive care (nasal suctioning, hydration, oxygen for SpO2 < 90%), NO bronchodilators or steroids",
      "Pediatric asthma: weight-based albuterol (0.15 mg/kg nebulized, minimum 2.5 mg) + systemic corticosteroids for moderate-severe",
      "Foreign body aspiration: rigid bronchoscopy for removal — do NOT perform blind finger sweeps in conscious children",
      "PARDS: lung-protective ventilation (VT 5-8 mL/kg, Pplat < 28), PEEP titration, prone positioning for severe cases",
      "Epiglottitis: secure airway in OR with anesthesia team, IV antibiotics (ceftriaxone), do NOT examine throat in ED",
      "HFNC for infants with bronchiolitis showing increased work of breathing — provides PEEP effect and dead space washout",
      "Maintain normothermia — fever increases metabolic rate and oxygen consumption, worsening respiratory distress"
    ],
    nursingActions: [
      "Use age-appropriate respiratory rate norms — infant > 60, child > 40, adolescent > 30 are concerning",
      "Assess work of breathing using retractions, nasal flaring, grunting, head bobbing, seesaw breathing as key indicators",
      "Use Broselow tape or weight-based calculations for all medication dosing and equipment sizing",
      "Select appropriate-sized equipment: ETT size (age/4 + 4 uncuffed, age/4 + 3.5 cuffed), face mask, suction catheter",
      "Monitor for feeding difficulty in infants with respiratory distress — tachypnea > 60 makes safe feeding impossible",
      "Observe for 3-4 hours after racemic epinephrine in croup before discharge — rebound effect may occur",
      "Keep child with epiglottitis calm, upright, and in parent's arms — do NOT lay supine or agitate",
      "Educate caregivers on recognizing respiratory distress signs and when to seek emergency care"
    ],
    signs: [
      "Croup: inspiratory stridor, barking cough, hoarseness — worse at night, typically preceded by URI symptoms",
      "Epiglottitis: drooling, tripod positioning, muffled voice, dysphagia, toxic appearance, high fever (medical emergency)",
      "Bronchiolitis: wheezing, tachypnea, nasal flaring, intercostal retractions, poor feeding, preceded by rhinorrhea",
      "Foreign body aspiration: sudden-onset coughing, choking, unilateral wheezing or decreased breath sounds",
      "Pediatric respiratory failure: grunting, severe retractions, paradoxical breathing, cyanosis, altered mental status",
      "Impending arrest: bradycardia in a child (ominous sign — cardiac arrest in children is usually respiratory in origin)"
    ],
    medications: [
      { name: "Dexamethasone (for croup)", dose: "0.6 mg/kg PO or IM, single dose (max 10 mg)", route: "Oral or IM", purpose: "Reduce subglottic edema in croup — effective even for mild croup, onset within 2-4 hours, lasts 24-36 hours" },
      { name: "Racemic Epinephrine", dose: "0.5 mL of 2.25% solution nebulized", route: "Inhaled", purpose: "Reduce mucosal edema in moderate-severe croup — temporary relief (1-2 hours), observe for rebound" },
      { name: "Palivizumab (Synagis)", dose: "15 mg/kg IM monthly during RSV season", route: "Intramuscular", purpose: "RSV-specific monoclonal antibody passive immunoprophylaxis for high-risk premature infants" },
      { name: "Albuterol (pediatric)", dose: "0.15 mg/kg (min 2.5 mg) nebulized or 4-8 puffs MDI with spacer/mask", route: "Inhaled", purpose: "Beta-2 agonist bronchodilator for pediatric asthma exacerbation — NOT indicated for bronchiolitis" }
    ],
    pearls: [
      "Bradycardia in a child with respiratory distress is pre-arrest — cardiac arrest in children is almost always respiratory in origin",
      "Bronchodilators do NOT work in bronchiolitis (RSV causes direct epithelial injury, not bronchospasm) — only supportive care",
      "The narrowest point of the pediatric airway is the cricoid ring (not the vocal cords as in adults) — relevant for ETT sizing",
      "Epiglottitis: do NOT lay the child supine, do NOT examine the throat with a tongue blade, do NOT agitate — any of these can cause complete obstruction",
      "Foreign body aspiration most commonly lodges in the RIGHT mainstem bronchus (wider, more vertical angle) — unilateral wheezing is the classic finding",
      "A child who suddenly becomes quiet during respiratory distress is NOT improving — assess for exhaustion and impending arrest"
    ],
    quiz: [
      { question: "A 2-year-old presents with barking cough, inspiratory stridor, and hoarseness. What is the most appropriate initial treatment?", options: ["Nebulized albuterol", "IV antibiotics", "Dexamethasone 0.6 mg/kg PO and consider nebulized racemic epinephrine", "Immediate intubation"], correct: 2, rationale: "This is classic croup (laryngotracheobronchitis). Dexamethasone 0.6 mg/kg single dose is first-line for all croup severity levels. Nebulized racemic epinephrine is added for moderate-severe stridor (stridor at rest). Albuterol is ineffective (subglottic edema, not bronchospasm). Antibiotics are not indicated (viral etiology). Intubation is rarely needed." },
      { question: "An 8-month-old with RSV bronchiolitis has wheezing and SpO2 of 89%. Which intervention is most appropriate?", options: ["Nebulized albuterol 2.5 mg", "IV dexamethasone 0.6 mg/kg", "Supplemental oxygen and nasal suctioning", "Nebulized hypertonic saline"], correct: 2, rationale: "Bronchiolitis management is supportive: supplemental oxygen for SpO2 < 90%, nasal suctioning (infants are obligate nasal breathers), and IV/NG hydration if needed. AAP guidelines specifically recommend AGAINST bronchodilators and systemic corticosteroids in bronchiolitis — they do not improve outcomes. Hypertonic saline has inconsistent evidence and is optional." },
      { question: "What ETT size would you select for a 6-year-old child using a cuffed tube?", options: ["4.0 mm cuffed", "5.0 mm cuffed", "5.0 mm uncuffed", "6.0 mm cuffed"], correct: 1, rationale: "Cuffed ETT size = (age/4) + 3.5 = (6/4) + 3.5 = 1.5 + 3.5 = 5.0 mm. Always have one size larger and one size smaller available. Modern cuffed ETTs are acceptable in children of all ages with careful cuff pressure monitoring (< 20-25 cmH2O)." }
    ]
  },

  "airway-assessment-management-rrt": {
    title: "Airway Assessment and Management for RT",
    cellular: `Airway assessment and management is the single most critical skill in respiratory therapy. The ability to rapidly evaluate airway patency, predict difficult airway scenarios, select appropriate airway devices, and manage both elective and emergent airway situations is fundamental to patient safety and a heavily tested domain on respiratory therapy board examinations.

Airway assessment begins with evaluating the patient's current airway status: Is the airway patent? Is the patient able to protect their airway (intact gag and cough reflexes, able to handle secretions)? Is there stridor or other evidence of upper airway obstruction? The decision to secure the airway depends on the clinical context: definitive airway (endotracheal intubation) is indicated for GCS ≤ 8, inability to protect the airway, respiratory failure unresponsive to NIV, anticipated deterioration, or need for prolonged mechanical ventilation.

Difficult airway prediction uses multiple assessment tools. The Mallampati score (I-IV) evaluates oropharyngeal visualization: Class I (soft palate, fauces, uvula, pillars visible), Class II (soft palate, fauces, uvula visible), Class III (soft palate, base of uvula), Class IV (hard palate only). Classes III and IV predict difficult laryngoscopy. Additional predictors: thyromental distance < 6 cm (3 fingerbreadths), limited cervical extension (< 35 degrees), interincisor gap < 3 cm, short thick neck, receding mandible, protruding upper incisors, obesity (BMI > 35), and history of difficult intubation. The LEMON mnemonic provides a systematic assessment: Look externally, Evaluate 3-3-2 rule (mouth opening 3 fingers, hyoid-to-chin 3 fingers, thyroid-to-mouth floor 2 fingers), Mallampati, Obstruction, Neck mobility.

Endotracheal intubation technique: position the patient in the sniffing position (neck flexed, head extended on atlanto-occipital joint), pre-oxygenate with 100% FiO2 for 3-5 minutes (or 8 vital capacity breaths through NRB) to maximize oxygen reserve, perform laryngoscopy (direct with Macintosh or Miller blade, or video laryngoscopy), identify landmarks (epiglottis, vocal cords, arytenoid cartilages), pass the ETT through the vocal cords, inflate the cuff to 20-30 cmH2O, and confirm placement. ETT confirmation requires: primary — waveform capnography (gold standard, continuous ETCO2 waveform), and secondary — bilateral breath sounds, chest rise, misting in the tube, SpO2 maintenance, chest X-ray (ETT tip 3-5 cm above carina).

ETT sizing: adult females 7.0-7.5 mm, adult males 7.5-8.0 mm. ETT depth: 21 cm at the teeth for women, 23 cm for men (21/23 rule). Cuff pressure must be maintained at 20-30 cmH2O — too low causes aspiration and air leak, too high causes tracheal mucosal ischemia and eventual stenosis (capillary perfusion pressure of tracheal mucosa is approximately 25-30 cmH2O).

Supraglottic airways (SGAs) include the laryngeal mask airway (LMA), King airway, and i-gel. SGAs are used as rescue devices when endotracheal intubation fails, in the difficult airway algorithm, and as primary airways in some elective surgical settings. SGAs do NOT provide definitive airway protection against aspiration — they are temporizing devices. The Combitube and King LT are commonly used in prehospital settings.

Surgical airway (cricothyrotomy) is the final rescue when all other airway attempts fail — the can't-intubate, can't-oxygenate (CICO) scenario. The cricothyroid membrane is identified between the thyroid and cricoid cartilages, and a surgical or needle cricothyrotomy provides emergency airway access.`,
    riskFactors: [
      "Difficult airway anatomy: Mallampati III-IV, short thyromental distance, limited neck mobility, obesity",
      "Cervical spine injury requiring manual in-line stabilization during intubation",
      "Full stomach increasing aspiration risk during airway management (trauma, emergency, pregnancy)",
      "Upper airway edema from anaphylaxis, thermal burns, or angioedema",
      "Blood or vomitus in the airway obscuring visualization during laryngoscopy",
      "Failed first intubation attempt — success decreases and complications increase with each subsequent attempt",
      "Inadequate pre-oxygenation leading to rapid desaturation during intubation attempt",
      "Tracheal stenosis from prior prolonged intubation or tracheostomy complicating reintubation"
    ],
    diagnostics: [
      "Mallampati classification (I-IV) for difficult intubation prediction",
      "Thyromental distance measurement (< 6 cm suggests difficult direct laryngoscopy)",
      "Neck mobility assessment (extension < 35 degrees predicts poor glottic visualization)",
      "LEMON assessment: Look, Evaluate 3-3-2, Mallampati, Obstruction, Neck mobility",
      "Waveform capnography as gold standard for ETT position confirmation and continuous monitoring",
      "Chest X-ray confirming ETT tip 3-5 cm above the carina",
      "Cuff pressure measurement with manometer (target 20-30 cmH2O)",
      "Fiberoptic bronchoscopy for difficult intubation or ETT position verification"
    ],
    management: [
      "Pre-oxygenate with 100% FiO2 for 3-5 minutes before ALL intubation attempts",
      "Position in sniffing position (ramp obese patients with towels/blankets under torso/head)",
      "Have backup plan before first attempt: video laryngoscopy, bougie, SGA, surgical airway",
      "Limit to 3 total intubation attempts before declaring failed airway and transitioning to SGA or surgical airway",
      "Use video laryngoscopy as first-line for predicted difficult airways and in ICU/emergency settings",
      "Maintain cuff pressure 20-30 cmH2O — check every 8 hours and after repositioning",
      "Rapid sequence intubation (RSI): induction agent + neuromuscular blocker for emergency intubation with aspiration risk",
      "In CICO scenario: immediate cricothyrotomy — do not waste time on repeated failed attempts"
    ],
    nursingActions: [
      "Prepare all equipment before intubation: ETT (2 sizes), laryngoscope (2 blade types), bougie, SGA, suction, capnography",
      "Confirm waveform capnography immediately after intubation and maintain continuous ETCO2 monitoring",
      "Measure and record cuff pressure every 8 hours using a cuff pressure manometer — never inflate by palpation alone",
      "Secure ETT with commercial holder at verified depth — document cm marking at teeth/lips",
      "Assess ETT position with every patient repositioning, transport, and at start of each shift",
      "Perform subglottic suctioning before cuff deflation to prevent aspiration of pooled secretions",
      "Keep replacement ETT, bougie, and emergency airway kit at bedside for all intubated patients",
      "Monitor for ETT complications: unplanned extubation, right mainstem migration, cuff leak, tracheal injury"
    ],
    signs: [
      "Confirmed ETT placement: persistent waveform ETCO2, bilateral breath sounds, symmetric chest rise",
      "Esophageal intubation: absent or rapidly declining ETCO2, gastric distension, absent breath sounds, falling SpO2",
      "Right mainstem intubation: absent left-sided breath sounds, unilateral chest rise, SpO2 decline",
      "Cuff leak: audible air leak during ventilation, decreasing exhaled VT, loss of PEEP, aspiration risk",
      "Difficult airway indicators: Mallampati III-IV, inability to see beyond base of tongue, limited neck extension",
      "Post-extubation stridor: inspiratory stridor within 2-6 hours indicating laryngeal edema"
    ],
    medications: [
      { name: "Succinylcholine", dose: "1-1.5 mg/kg IV push", route: "Intravenous", purpose: "Depolarizing neuromuscular blocker for RSI — fastest onset (45-60 sec) and shortest duration (6-10 min)" },
      { name: "Rocuronium", dose: "1.2 mg/kg IV for RSI (0.6 mg/kg for standard)", route: "Intravenous", purpose: "Non-depolarizing NMB for RSI alternative to succinylcholine — longer duration but reversible with sugammadex" },
      { name: "Etomidate", dose: "0.3 mg/kg IV push", route: "Intravenous", purpose: "Induction agent for RSI — hemodynamically neutral, ideal for unstable patients" },
      { name: "Sugammadex", dose: "16 mg/kg IV for immediate reversal of rocuronium", route: "Intravenous", purpose: "Selective rocuronium reversal agent for can't-intubate situations after rocuronium RSI" }
    ],
    pearls: [
      "Waveform capnography is the GOLD STANDARD for ETT confirmation — if there is no persistent ETCO2 waveform, the tube is NOT in the trachea until proven otherwise",
      "Pre-oxygenation with 100% FiO2 for 3-5 minutes provides 3-8 minutes of safe apnea time depending on patient factors — never skip this step",
      "The bougie is the single most important rescue device — a gum elastic bougie improves first-pass success by 25% in difficult airways",
      "After 3 failed attempts at intubation, declare a failed airway and move to SGA or surgical airway — do not keep trying",
      "Cuff pressure > 30 cmH2O causes tracheal mucosal ischemia — always use a manometer, never inflate by palpation alone (the 'just right' feel is unreliable)",
      "In RSI, the most dangerous moment is between induction and intubation — if you cannot intubate, you must be able to oxygenate (bag-mask or SGA)"
    ],
    quiz: [
      { question: "What is the gold standard for confirming endotracheal tube placement?", options: ["Bilateral breath sounds", "Chest X-ray", "Waveform capnography showing persistent ETCO2", "Misting in the ETT"], correct: 2, rationale: "Waveform capnography showing a persistent ETCO2 waveform is the gold standard for confirming tracheal ETT placement. It provides immediate, continuous confirmation. Bilateral breath sounds can be misleading (gastric sounds transmitted). Chest X-ray is delayed. Misting can occur with esophageal placement. No single secondary method is as reliable as waveform capnography." },
      { question: "A patient has Mallampati IV, thyromental distance of 4 cm, and limited neck extension. What approach should be planned?", options: ["Standard direct laryngoscopy", "Video laryngoscopy with difficult airway cart immediately available", "Blind nasotracheal intubation", "Proceed without any special preparation"], correct: 1, rationale: "Multiple difficult airway predictors (Mallampati IV, short thyromental distance < 6 cm, limited neck extension) indicate high probability of difficult direct laryngoscopy. Video laryngoscopy should be planned as the primary approach, with the full difficult airway cart (SGA, bougie, surgical airway kit) immediately available. Expert help should be called if available." },
      { question: "During intubation, you cannot pass the ETT but can ventilate with bag-mask. After 3 attempts, what is the next step?", options: ["Try a 4th time with a smaller tube", "Place a supraglottic airway and call for help", "Proceed to immediate cricothyrotomy", "Continue bag-mask ventilation indefinitely"], correct: 1, rationale: "After 3 failed intubation attempts, this is a 'can't intubate, CAN oxygenate' scenario. Since bag-mask ventilation is effective, place a supraglottic airway (LMA) as a temporizing measure and call for expert help (anesthesia, ENT). Cricothyrotomy is reserved for 'can't intubate, can't oxygenate' (CICO) situations. Continuing to attempt intubation increases airway trauma and edema." }
    ]
  },

  "chest-xray-interpretation-rrt": {
    title: "Chest X-ray Interpretation for RT",
    cellular: `Chest X-ray interpretation is an essential competency for respiratory therapists who must rapidly identify conditions affecting ventilator management, device positioning, and respiratory status. While formal radiology interpretation remains the physician's responsibility, the RT must be able to recognize critical findings that require immediate intervention, verify equipment placement, and identify changes that explain clinical deterioration.

A systematic approach to chest X-ray interpretation follows the ABCDEFGH mnemonic: Airway (tracheal position, ETT placement), Bones (rib fractures, thoracic vertebral abnormalities), Cardiac (heart size, mediastinal width), Diaphragm (position, free air below), Effusion/Extra-pulmonary (pleural fluid, pneumothorax), Fields (lung parenchyma — infiltrates, consolidation, masses), Gastric bubble (below left diaphragm), and Hardware (lines, tubes, drains, pacemakers). Systematic review prevents the satisfaction of search error — finding one abnormality and stopping the review.

Equipment verification on chest X-ray: ETT tip should be 3-5 cm above the carina (approximately at the level of the aortic knob on PA view). Central venous catheter (CVC) tip should be at the junction of the SVC and right atrium. Nasogastric tube tip should be below the diaphragm in the stomach, with the side port also below the diaphragm. Chest tube position depends on the indication: anteriorly and apically for pneumothorax, posteriorly and basally for effusion. Swan-Ganz catheter tip should be in a main pulmonary artery, not beyond segmental branches (risk of PA rupture).

Common radiographic patterns in respiratory care: consolidation (dense opacification with air bronchograms — pneumonia, ARDS), ground-glass opacity (hazy opacification without obscuring underlying structures — early ARDS, pulmonary edema, PJP pneumonia), atelectasis (volume loss with ipsilateral mediastinal shift, elevated hemidiaphragm, crowded ribs), pleural effusion (meniscus sign on upright film, dependent layering on lateral decubitus), pneumothorax (visceral pleural line with absent lung markings beyond — tension pneumothorax adds mediastinal shift away and depressed hemidiaphragm), hyperinflation (flat diaphragms, > 10 posterior rib spaces visible, increased retrosternal air space — COPD, asthma, air trapping).

Silhouette sign: when two structures of the same radiographic density are in contact, the border between them is lost. Right heart border silhouetted → right middle lobe pathology. Left heart border silhouetted → lingula pathology. Right diaphragm silhouetted → right lower lobe pathology. This principle helps localize pathology to specific lobes.

Mediastinal shift direction differentiates conditions: shift toward the affected side occurs with atelectasis and post-pneumonectomy (volume loss pulling mediastinum). Shift away from the affected side occurs with tension pneumothorax, massive effusion, and space-occupying lesions (increased pressure pushing mediastinum). No shift: simple pneumonia, simple pneumothorax, and small effusion.`,
    riskFactors: [
      "Radiation exposure from repeated imaging — minimize unnecessary films using clinical assessment",
      "Incorrect ETT position on X-ray not acted upon leading to right mainstem intubation or accidental extubation",
      "Failure to identify tension pneumothorax on X-ray delaying needle decompression (this should be a clinical diagnosis)",
      "Misidentification of chronic changes as acute findings leading to unnecessary interventions",
      "Portable AP films (most ICU films) causing magnification of the cardiac silhouette leading to false cardiomegaly readings",
      "Rotated films creating asymmetric lung density mimicking pathology",
      "Supine positioning obscuring small effusions that layer dependently",
      "Satisfaction of search — finding one abnormality and failing to continue systematic review"
    ],
    diagnostics: [
      "Posteroanterior (PA) upright chest X-ray as standard (72-inch source-to-image distance for accurate cardiac size)",
      "Anteroposterior (AP) portable film for ICU patients (magnifies heart by ~15-20%, short source-to-image distance)",
      "Lateral decubitus film for suspected small pleural effusion (layering on dependent side = free-flowing effusion)",
      "Expiratory film for suspected small pneumothorax (accentuates the visceral pleural line)",
      "CT chest for equivocal findings, complex anatomy, or detailed assessment (pulmonary embolism, mass characterization)",
      "Point-of-care ultrasound (POCUS) for immediate pneumothorax, effusion, and lung consolidation assessment",
      "Daily chest X-ray in ICU patients with acute changes or new device placement — NOT routine daily films without indication"
    ],
    management: [
      "Verify ETT position at 3-5 cm above carina — adjust and reconfirm if malpositioned",
      "Identify tension pneumothorax clinically (tracheal deviation, absent breath sounds, hemodynamic compromise) — treat before X-ray",
      "Report new infiltrates, effusions, or pneumothorax findings to the medical team immediately",
      "Correlate radiographic findings with clinical changes — new opacity with fever and purulent secretions suggests VAP",
      "Use silhouette sign to localize pathology to specific lobes for targeted bronchial hygiene or positioning",
      "Compare current film to prior films to differentiate acute changes from chronic stable findings",
      "Document radiographic findings and their correlation with ventilator parameter changes in RT progress notes"
    ],
    nursingActions: [
      "Follow systematic ABCDEFGH approach for every chest X-ray to prevent missed findings",
      "Verify ETT position on every post-intubation and post-repositioning chest X-ray — document cm at teeth and X-ray ETT position",
      "Identify pneumothorax immediately in post-procedure films (central line, thoracentesis, lung biopsy)",
      "Assess for new infiltrates that may explain clinical changes (worsening oxygenation, new fever, increasing secretions)",
      "Compare cardiac silhouette size to prior films (cardiac-to-thoracic ratio > 0.50 on PA film suggests cardiomegaly)",
      "Verify all line and tube positions: CVC, NG, chest tube, Swan-Ganz, pacemaker leads",
      "Note free air under diaphragm (subdiaphragmatic air) — may indicate bowel perforation requiring surgical consultation"
    ],
    signs: [
      "Consolidation: dense opacification with air bronchograms — air-filled bronchi visible within fluid-filled lung (pneumonia, ARDS)",
      "Atelectasis: volume loss with mediastinal shift toward the opacified side, elevated hemidiaphragm, crowded ribs",
      "Tension pneumothorax: visceral pleural line, absent lung markings, mediastinal shift AWAY, depressed hemidiaphragm",
      "Pleural effusion: meniscus sign on upright film, blunting of costophrenic angle, layering on lateral decubitus",
      "Pulmonary edema: bilateral perihilar (bat-wing) opacities, Kerley B lines, peribronchial cuffing, pleural effusions",
      "COPD/hyperinflation: flat diaphragms, > 10 posterior ribs visible, increased retrosternal air space, elongated cardiac silhouette"
    ],
    medications: [],
    pearls: [
      "ETT tip should be at the level of the aortic knob on PA film (3-5 cm above carina) — if at the carina or below, right mainstem intubation is likely",
      "AP portable films magnify the cardiac silhouette by 15-20% — do not diagnose cardiomegaly from AP films alone",
      "Tension pneumothorax is a CLINICAL diagnosis (tracheal deviation, absent breath sounds, hypotension) — do NOT wait for X-ray confirmation to decompress",
      "Silhouette sign localizes pathology: right heart border = right middle lobe, left heart border = lingula, diaphragm = lower lobe",
      "Mediastinal shift TOWARD pathology = volume loss (atelectasis); shift AWAY = increased pressure (tension PTX, massive effusion)",
      "A new opacity with air bronchograms in a ventilated patient with fever and purulent secretions = VAP until proven otherwise"
    ],
    quiz: [
      { question: "A chest X-ray shows the ETT tip at the level of the right mainstem bronchus. What is the most appropriate action?", options: ["No action needed — position is acceptable", "Withdraw the ETT 2-3 cm and reconfirm with X-ray", "Remove the ETT and reintubate", "Advance the ETT further for better seal"], correct: 1, rationale: "ETT in the right mainstem bronchus means only the right lung is being ventilated, which can cause left lung atelectasis and right lung barotrauma. The ETT should be withdrawn 2-3 cm to position the tip 3-5 cm above the carina (at the aortic knob level on PA film). Reconfirm position with repeat X-ray and continuous capnography." },
      { question: "A ventilated ICU patient shows opacification of the right hemithorax with mediastinal shift to the RIGHT. What is the most likely diagnosis?", options: ["Right tension pneumothorax", "Massive right pleural effusion", "Right lung atelectasis", "Right-sided pneumonia"], correct: 2, rationale: "Mediastinal shift TOWARD the affected side indicates volume loss. Right hemithorax opacification with rightward mediastinal shift is atelectasis — the collapsed right lung pulls the mediastinum toward it. Tension pneumothorax and massive effusion cause shift AWAY from the affected side. Pneumonia typically does not cause enough volume change for mediastinal shift." },
      { question: "Which chest X-ray finding differentiates ARDS from cardiogenic pulmonary edema?", options: ["Bilateral opacities", "Pleural effusions and Kerley B lines favoring cardiogenic edema", "Ground-glass opacities", "Increased cardiac silhouette"], correct: 1, rationale: "Both ARDS and cardiogenic pulmonary edema can cause bilateral opacities. However, cardiogenic edema typically shows pleural effusions, Kerley B lines (interstitial edema), peribronchial cuffing, and often cardiomegaly. ARDS typically shows bilateral patchy or diffuse opacities WITHOUT significant effusions and with a normal cardiac silhouette. Clinical context (BNP, echo) is also essential." }
    ]
  }
};
