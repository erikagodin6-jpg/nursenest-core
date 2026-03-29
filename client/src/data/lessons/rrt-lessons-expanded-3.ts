import type { LessonContent } from "./types";

export const rrtLessonsExpanded3: Record<string, LessonContent> = {
  "blood-gas-analyzers-poct-rrt": {
    title: "Blood Gas Analyzers and Point-of-Care Testing",
    cellular: `Blood gas analysis requires understanding both the clinical interpretation and the analytical process. Respiratory therapists operate and maintain blood gas analyzers, perform quality control, troubleshoot errors, and ensure accurate results that drive critical clinical decisions. Point-of-care testing (POCT) places analysis at the bedside, dramatically reducing turnaround time for time-sensitive results.

Modern blood gas analyzers use electrochemical sensors (electrodes) to measure pH, PaCO2, and PaO2 directly. The pH electrode (Sever-inghaus) uses a glass electrode sensitive to hydrogen ion concentration. The PaCO2 electrode (Severinghaus) is a modified pH electrode with a CO2-permeable membrane — dissolved CO2 from the blood sample diffuses across the membrane into a bicarbonate solution, changing pH proportionally to CO2 concentration. The PaO2 electrode (Clark) uses a polarographic electrode with an oxygen-permeable membrane — oxygen reduction at the cathode generates current proportional to PO2. HCO3 and base excess are CALCULATED values derived from the Henderson-Hasselbalch equation using measured pH and PaCO2.

Co-oximetry is an essential component of modern ABG analyzers. Standard pulse oximetry measures only functional SpO2 (oxyhemoglobin / (oxyhemoglobin + deoxyhemoglobin)). Co-oximetry measures fractional SaO2 including dyshemoglobins: carboxyhemoglobin (COHb — normal < 3% in non-smokers, < 10% in smokers) and methemoglobin (MetHb — normal < 1.5%). In carbon monoxide poisoning, standard pulse oximetry reads falsely normal because it cannot distinguish COHb from oxyhemoglobin — co-oximetry from an ABG is required for accurate diagnosis.

Quality control in blood gas analysis includes three levels: internal electronic quality control (QC), liquid QC using commercially prepared control solutions at two or three levels (acidotic, normal, alkalotic), and external proficiency testing (PT). Liquid QC must be run on every shift, after maintenance, after reagent changes, and when results are questioned. Results that fall outside acceptable ranges (typically ± 2 standard deviations) require troubleshooting before patient samples are analyzed.

Pre-analytical errors are the most common source of inaccurate ABG results. Air bubbles in the sample equilibrate with room air (PO2 ~150 mmHg, PCO2 ~0.3 mmHg), falsely raising PaO2 and lowering PaCO2. Excess liquid heparin dilutes the sample, lowering PaCO2 and HCO3 (use pre-heparinized syringes). Delayed analysis allows cellular metabolism to consume O2 and produce CO2, lowering PaO2 and raising PaCO2. Venous contamination produces falsely low PaO2 and elevated PaCO2. Samples should be analyzed within 10-15 minutes or transported on ice (slows metabolism).

Additional POCT measurements commonly performed alongside blood gases include electrolytes (Na, K, Ca, Cl), glucose, lactate, hemoglobin/hematocrit, and bilirubin. These expanded panels provide a comprehensive metabolic snapshot at the bedside, enabling faster clinical decision-making in emergency and critical care settings.`,
    riskFactors: [
      "Air bubbles in ABG sample causing falsely elevated PaO2 and decreased PaCO2",
      "Excess liquid heparin diluting sample and lowering PaCO2/HCO3 values",
      "Delayed analysis allowing cellular metabolism to alter gas values",
      "Venous contamination producing falsely low PaO2",
      "Failure to run quality control leading to inaccurate patient results",
      "Standard pulse oximetry missing carbon monoxide poisoning — co-oximetry required",
      "Hyperleukocytosis (WBC > 100,000) causing pseudohypoxemia from leukocyte O2 consumption in sample",
      "Temperature-uncorrected values in hypothermic patients leading to interpretation errors"
    ],
    diagnostics: [
      "ABG with co-oximetry: pH, PaCO2, PaO2, HCO3, BE, SaO2 (fractional), COHb, MetHb",
      "Quality control at minimum every shift with two or three levels of control solutions",
      "Proficiency testing per CLIA requirements for laboratory accreditation",
      "Calibration verification with known standards at regular intervals",
      "Electrolyte panel via POCT: Na, K, ionized Ca, Cl, glucose, lactate",
      "Hemoglobin and hematocrit measurement for oxygen content calculation",
      "Total bilirubin for neonatal jaundice assessment at point of care"
    ],
    management: [
      "Use pre-heparinized ABG syringes — avoid liquid heparin to prevent dilution errors",
      "Expel air bubbles immediately after sample collection — mix sample by rolling (not shaking)",
      "Analyze within 10-15 minutes or transport on ice to slow cellular metabolism",
      "Order co-oximetry for all suspected CO poisoning, smoke inhalation, and methemoglobinemia cases",
      "Run QC at start of shift, after maintenance, after reagent change, and when results are questioned",
      "Document FiO2, ventilator settings, patient temperature, and position at time of ABG draw",
      "Perform modified Allen test before radial artery puncture to confirm collateral circulation",
      "Apply pressure to puncture site for ≥ 5 minutes (longer if anticoagulated)"
    ],
    nursingActions: [
      "Verify analyzer QC status before running patient samples — do not report results on failed QC",
      "Label samples with patient ID, time of collection, FiO2, and body temperature",
      "Perform instrument maintenance per manufacturer schedule: membrane changes, electrode cleaning, calibration",
      "Troubleshoot out-of-range QC: check reagents, electrodes, temperature, membrane integrity",
      "Correlate co-oximetry results with clinical presentation — report COHb > 10% and MetHb > 3% to provider immediately",
      "Assess sample quality before analysis: no visible air bubbles, adequate volume, no clots",
      "Document QC results, corrective actions, and instrument maintenance in quality assurance log"
    ],
    signs: [
      "Pre-analytical error: results inconsistent with clinical picture (e.g., PaO2 > 150 on room air = air bubble)",
      "CO poisoning: normal SpO2 on pulse oximetry but elevated COHb on co-oximetry (SpO2 cannot detect CO)",
      "Methemoglobinemia: SpO2 reads approximately 85% regardless of actual oxygenation, chocolate-brown blood color",
      "QC failure: control values outside ± 2 SD range — instrument requires troubleshooting before patient testing",
      "Analyzer malfunction: electrode drift, membrane failure, temperature instability — indicated by trending QC"
    ],
    medications: [
      { name: "Methylene Blue", dose: "1-2 mg/kg IV over 5 minutes", route: "Intravenous", purpose: "Antidote for methemoglobinemia (MetHb > 20% or symptomatic) — acts as electron carrier to reduce MetHb to functional hemoglobin" },
      { name: "Hydroxocobalamin (Cyanokit)", dose: "5 g IV over 15 minutes", route: "Intravenous", purpose: "Antidote for cyanide poisoning — often co-administered with CO poisoning treatment in smoke inhalation" }
    ],
    pearls: [
      "HCO3 and base excess on the ABG are CALCULATED from pH and PaCO2 — they are NOT directly measured",
      "Standard pulse oximetry CANNOT detect carboxyhemoglobin — always order co-oximetry (ABG) for suspected CO poisoning",
      "Air bubbles are the most common pre-analytical error: they raise PaO2 toward 150 mmHg and lower PaCO2 toward zero",
      "MetHb causes pulse oximetry to read approximately 85% regardless of true saturation — a classic board exam fact",
      "Ice transport is needed ONLY if analysis will be delayed > 15 minutes — most modern POCT analyzers are at the bedside",
      "If ABG results don't match the clinical picture, suspect a pre-analytical error before changing treatment"
    ],
    quiz: [
      { question: "A firefighter rescued from a burning building has SpO2 99% on pulse oximetry but appears confused and tachycardic. What test is needed?", options: ["Repeat pulse oximetry", "ABG with co-oximetry", "Chest X-ray", "Serum troponin"], correct: 1, rationale: "Standard pulse oximetry cannot distinguish carboxyhemoglobin from oxyhemoglobin — both absorb light similarly at the wavelengths used. SpO2 reads falsely normal in CO poisoning. ABG with co-oximetry directly measures COHb and provides the true oxygen saturation. This patient likely has significant CO poisoning with falsely reassuring SpO2." },
      { question: "An ABG drawn on room air shows PaO2 of 165 mmHg. What is the most likely explanation?", options: ["Supplemental oxygen was administered without documentation", "Air bubble in the sample", "Severe polycythemia elevating oxygen carrying capacity", "Analyzer malfunction"], correct: 1, rationale: "PaO2 > 150 mmHg on room air (PiO2 ~150 mmHg at sea level) is physiologically impossible without supplemental oxygen. The most common explanation is an air bubble in the sample that equilibrated with room air (PO2 ~150 mmHg), falsely elevating the measured PaO2. Always expel air bubbles before analysis." },
      { question: "Which blood gas value is CALCULATED rather than directly measured?", options: ["pH", "PaCO2", "PaO2", "HCO3"], correct: 3, rationale: "pH, PaCO2, and PaO2 are directly measured by electrochemical sensors (glass electrode, Severinghaus electrode, and Clark electrode respectively). HCO3 is CALCULATED from the Henderson-Hasselbalch equation using measured pH and PaCO2. Base excess is also calculated. This distinction matters because calculation errors can occur if measured values are inaccurate." }
    ]
  },

  "ecmo-fundamentals-rrt": {
    title: "ECMO Fundamentals",
    cellular: `Extracorporeal membrane oxygenation (ECMO) provides temporary mechanical support for gas exchange (and in some configurations, circulatory support) when conventional therapies have failed. Respiratory therapists are integral members of ECMO teams, contributing to circuit management, ventilator optimization during ECMO, and weaning assessment.

ECMO circuits consist of a drainage cannula, centrifugal blood pump, membrane oxygenator (gas exchange device), heat exchanger, and return cannula. Venous blood is drained from the patient, pumped through the membrane oxygenator where oxygen is added and CO2 is removed, warmed to body temperature, and returned to the patient.

Venovenous (VV) ECMO provides respiratory support only — blood is drained from and returned to the venous system (typically femoral vein drainage to internal jugular return, or via a dual-lumen cannula in the IJ). The patient's native cardiac output delivers oxygenated blood to the systemic circulation. VV-ECMO is used for severe ARDS, severe pneumonia, bridge to lung transplant, and pulmonary contusion. VV-ECMO does NOT provide hemodynamic support.

Venoarterial (VA) ECMO provides both respiratory AND circulatory support — venous blood is drained and returned to the arterial system (femoral vein to femoral artery or central cannulation via sternotomy). VA-ECMO is used for cardiogenic shock, massive PE with hemodynamic collapse, cardiac arrest (E-CPR), post-cardiotomy failure, and bridge to cardiac transplant or ventricular assist device.

During VV-ECMO for respiratory failure, ventilator management shifts to "lung rest" settings to prevent further VILI while the lungs heal. Typical lung rest settings: low VT (4-6 mL/kg IBW), low RR (10-12), low FiO2 (0.30-0.40), moderate PEEP (10-15 cmH2O to maintain recruitment), and Pplat < 25 cmH2O. The ventilator is NOT providing gas exchange — ECMO is. The ventilator maintains lung recruitment, prevents atelectasis, and supports continued pulmonary blood flow.

ECMO flow and sweep gas management: ECMO blood flow rate determines oxygenation (typically 50-80 mL/kg/min for VV-ECMO). Sweep gas flow through the oxygenator determines CO2 removal (increasing sweep gas flow increases CO2 clearance). FiO2 through the oxygenator is typically set to 1.0 (100% oxygen). CO2 removal on ECMO is extremely efficient — PaCO2 can be lowered rapidly, which is dangerous in chronic CO2 retainers (rapid CO2 correction can cause cerebral vasoconstriction and alkalosis-related seizures).

ECMO weaning assessment evaluates native lung recovery. For VV-ECMO: gradually reduce sweep gas flow while monitoring patient's ABG — if PaO2 and PaCO2 remain acceptable on minimal sweep gas with modest ventilator settings, the patient may be ready for decannulation. An ECMO trial off (sweep gas flow to zero, maintaining blood flow to prevent clotting) for 1-4 hours with acceptable ABG on moderate ventilator settings confirms readiness for decannulation.

Complications include hemorrhage (systemic anticoagulation required — heparin with target ACT 180-220 seconds), cannula-related vascular injury, hemolysis (from pump shear forces), thromboembolism, infection, and circuit failure (oxygenator clotting, air embolism, pump malfunction). Monitoring includes frequent ACT/aPTT, plasma-free hemoglobin (hemolysis marker), fibrinogen (consumption by circuit), and platelet count (destruction by circuit).`,
    riskFactors: [
      "Hemorrhage from systemic anticoagulation — most common ECMO complication (20-40% of patients)",
      "Circuit clotting from inadequate anticoagulation causing oxygenator failure or thromboembolism",
      "Hemolysis from mechanical shear stress on red blood cells by the centrifugal pump",
      "Air embolism from circuit breaks or air entrainment — can be fatal",
      "Cannula-related vascular injury: vessel dissection, perforation, or limb ischemia (distal perfusion cannula needed for femoral VA-ECMO)",
      "Infection from prolonged cannulation and immunosuppression from blood exposure to circuit surfaces",
      "Rapid CO2 correction causing cerebral vasoconstriction and seizures in chronic CO2 retainers",
      "Differential hypoxemia (Harlequin syndrome) in VA-ECMO: upper body receives poorly oxygenated blood from native heart, lower body receives ECMO-oxygenated blood"
    ],
    diagnostics: [
      "Pre-ECMO: ABG showing refractory hypoxemia (P/F < 80) or hypercapnia despite optimal conventional therapy",
      "Activated clotting time (ACT) monitoring for anticoagulation management (target 180-220 seconds)",
      "Pre- and post-oxygenator blood gas to assess oxygenator function (post-membrane PO2 should be > 300 mmHg on FiO2 1.0)",
      "Plasma-free hemoglobin levels to detect hemolysis (> 50 mg/dL suggests significant hemolysis)",
      "Fibrinogen levels and platelet count to assess circuit-related consumption",
      "Daily chest X-ray to assess lung recovery and cannula position",
      "Echocardiography for cardiac function assessment during VA-ECMO and for weaning readiness"
    ],
    management: [
      "Initiate lung rest ventilator settings during VV-ECMO: VT 4-6 mL/kg, RR 10-12, PEEP 10-15, FiO2 0.30-0.40, Pplat < 25",
      "Adjust ECMO blood flow for oxygenation: higher flow = more O2 delivery to the patient",
      "Adjust sweep gas flow for ventilation: higher sweep = more CO2 removal from the blood",
      "Lower sweep gas flow GRADUALLY in chronic CO2 retainers — rapid correction causes seizures",
      "Maintain anticoagulation with heparin targeting ACT 180-220 seconds — balance bleeding vs clotting risk",
      "Place distal perfusion cannula in femoral VA-ECMO to prevent limb ischemia",
      "Monitor for differential hypoxemia in VA-ECMO: check right radial ABG (pre-ductal equivalent) for upper body oxygenation",
      "ECMO weaning trial: reduce sweep gas to zero, maintain blood flow, monitor ABG on moderate ventilator settings for 1-4 hours"
    ],
    nursingActions: [
      "Perform ECMO circuit checks every hour: inspect for clots, air, secure connections, verify pump speed and flow rates",
      "Monitor pre- and post-oxygenator pressures — rising transmembrane pressure gradient indicates oxygenator clotting",
      "Check ACT every 2-4 hours during heparin infusion — adjust infusion to maintain target range",
      "Assess cannulation sites for bleeding, hematoma, and signs of infection every shift",
      "Assess distal limb perfusion in VA-ECMO patients: pulses, capillary refill, temperature, color, sensation",
      "Draw pre- and post-oxygenator blood gases as ordered to verify oxygenator function",
      "Maintain ventilator at lung rest settings — do not adjust to normalize patient ABG (ECMO manages gas exchange)",
      "Monitor for hemolysis: plasma-free hemoglobin, urine color, LDH, haptoglobin"
    ],
    signs: [
      "Oxygenator failure: declining post-membrane PO2, rising transmembrane pressure, visible clot in oxygenator",
      "Circuit air: visible air in circuit tubing, air alarm on ECMO console, sudden drop in flow",
      "Hemolysis: pink or red plasma, dark urine, rising plasma-free hemoglobin, falling haptoglobin",
      "Differential hypoxemia (VA-ECMO): upper body cyanosis with pink lower extremities (Harlequin syndrome)",
      "ECMO weaning readiness: maintaining adequate ABG on sweep gas trial off with lung rest ventilator settings",
      "Recirculation (VV-ECMO): oxygenated blood returning through drainage cannula — poor systemic oxygenation despite adequate ECMO flow"
    ],
    medications: [
      { name: "Heparin (Unfractionated)", dose: "Continuous IV infusion titrated to ACT 180-220 seconds", route: "Intravenous", purpose: "Systemic anticoagulation to prevent circuit thrombosis — the balance between bleeding and clotting is the core ECMO challenge" },
      { name: "Bivalirudin", dose: "0.05-0.2 mg/kg/hr IV infusion", route: "Intravenous", purpose: "Direct thrombin inhibitor alternative for patients with heparin-induced thrombocytopenia (HIT) requiring ECMO anticoagulation" }
    ],
    pearls: [
      "On VV-ECMO, the ventilator provides LUNG REST, not gas exchange — do not chase normal ABG values on the ventilator",
      "ECMO sweep gas flow controls CO2 removal; ECMO blood flow controls oxygenation — know which to adjust for each problem",
      "Differential hypoxemia (Harlequin syndrome) occurs in peripheral VA-ECMO when recovering native cardiac output delivers poorly oxygenated blood to the upper body — monitor right radial ABG",
      "Rapid CO2 correction on ECMO initiation is DANGEROUS in chronic retainers — lower sweep gas gradually to prevent seizures and cerebral injury",
      "ACT target 180-220 seconds balances hemorrhage (most common complication) against circuit clotting — the art of ECMO management",
      "ECMO weaning: sweep gas off trial is the equivalent of an SBT for ventilator weaning — if the patient maintains acceptable ABG, native lung recovery is sufficient"
    ],
    quiz: [
      { question: "A patient on VV-ECMO has PaCO2 of 65 mmHg. Which ECMO parameter should be adjusted to reduce PaCO2?", options: ["Increase ECMO blood flow rate", "Increase sweep gas flow through the oxygenator", "Increase ventilator respiratory rate", "Decrease PEEP on the ventilator"], correct: 1, rationale: "CO2 removal on ECMO is controlled by sweep gas flow through the membrane oxygenator. Increasing sweep gas flow creates a greater CO2 concentration gradient across the membrane, enhancing CO2 elimination. ECMO blood flow primarily affects oxygenation. The ventilator is on lung rest settings and should not be adjusted to manage gas exchange during ECMO." },
      { question: "What ventilator strategy is used during VV-ECMO for severe ARDS?", options: ["High VT and PEEP to maximize oxygenation", "Lung rest: low VT, low RR, moderate PEEP, low FiO2", "No ventilator support — extubate the patient", "Match pre-ECMO settings to maintain continuity"], correct: 1, rationale: "During VV-ECMO, the ventilator provides lung rest to minimize ventilator-induced lung injury while the lungs heal. Settings: VT 4-6 mL/kg IBW, RR 10-12, PEEP 10-15 (to maintain recruitment), FiO2 0.30-0.40, Pplat < 25 cmH2O. The ECMO circuit handles gas exchange, not the ventilator." },
      { question: "What is the most common complication of ECMO therapy?", options: ["Air embolism", "Hemorrhage from systemic anticoagulation", "Oxygenator failure", "Infection"], correct: 1, rationale: "Hemorrhage is the most common ECMO complication, occurring in 20-40% of patients. ECMO requires systemic anticoagulation (typically heparin) to prevent circuit thrombosis, but this anticoagulation increases bleeding risk from cannulation sites, surgical sites, and into the GI tract, CNS, and lungs. Balancing anticoagulation is the central challenge of ECMO management." }
    ]
  },

  "respiratory-assessment-skills-rrt": {
    title: "Respiratory Assessment Skills",
    cellular: `Comprehensive respiratory assessment is the foundation of respiratory therapy practice. The ability to systematically evaluate a patient's respiratory status, identify abnormalities, and determine the need for intervention or escalation is tested extensively on board examinations and is essential for safe clinical practice.

The respiratory assessment follows the traditional framework of inspection, palpation, percussion, and auscultation, supplemented by vital sign interpretation and advanced monitoring data integration.

Inspection evaluates respiratory rate (adults: 12-20 normal, tachypnea > 20, bradypnea < 12), breathing pattern (regular, Cheyne-Stokes, Kussmaul, Biot's), depth of breathing, chest wall symmetry, use of accessory muscles (sternocleidomastoid, scalenes, intercostals indicating increased work of breathing), nasal flaring, pursed-lip breathing (self-applied PEEP in COPD), cyanosis (central — lips, tongue — indicating SaO2 < 85%, vs peripheral — fingers, toes — indicating poor perfusion), digital clubbing (chronic hypoxemia, lung cancer, CF, bronchiectasis), and body positioning (orthopnea, tripod positioning indicating severe dyspnea).

Palpation assesses chest wall expansion symmetry (place hands on posterolateral chest with thumbs at midline — asymmetric expansion suggests unilateral pathology), tactile fremitus (vibration felt through chest wall during phonation — increased with consolidation as solid tissue transmits vibration better than air-filled lung, decreased with effusion or pneumothorax as fluid or air blocks transmission), tracheal position (midline normally — deviated toward atelectasis, away from tension pneumothorax or massive effusion), subcutaneous emphysema (crepitus indicating air in subcutaneous tissue — associated with pneumothorax, pneumomediastinum, or post-procedural air leak).

Percussion distinguishes underlying tissue density: resonant (normal air-filled lung), hyperresonant (increased air — emphysema, pneumothorax), dull (decreased air — consolidation, effusion, atelectasis), flat (dense tissue — massive effusion, complete consolidation).

Auscultation with the stethoscope diaphragm assesses breath sounds systematically in a ladder pattern comparing right and left at each level. Normal breath sounds: vesicular (soft, low-pitched, inspiration > expiration, heard over peripheral lung), bronchovesicular (medium pitch, inspiration = expiration, heard over main bronchi), and bronchial (loud, high-pitched, expiration > inspiration, heard over trachea — abnormal if heard peripherally, indicates consolidation). Adventitious sounds: crackles (fine — inspiratory, indicating opening of collapsed alveoli in fibrosis, atelectasis, early pulmonary edema; coarse — inspiratory and expiratory, indicating secretions in larger airways), wheezes (continuous, high-pitched, musical — indicating bronchospasm, airway narrowing), rhonchi (continuous, low-pitched, rumbling — indicating secretions in large airways, may clear with cough), stridor (high-pitched inspiratory sound — indicating upper airway obstruction, laryngeal edema, foreign body), pleural friction rub (grating sound heard in both inspiration and expiration — indicating pleuritis).

Dyspnea assessment uses standardized scales: modified Borg scale (0-10 perceived exertion), mMRC dyspnea scale (0-4 grade), and visual analog scale. Acute dyspnea assessment includes the timing of onset, associated symptoms (chest pain, cough, fever, hemoptysis), exacerbating and relieving factors, and baseline functional status.`,
    riskFactors: [
      "Failure to recognize early signs of respiratory deterioration leading to delayed intervention",
      "Inconsistent assessment technique producing unreliable findings",
      "Ambient noise interfering with auscultation accuracy (ICU environment is challenging)",
      "Patient positioning affecting assessment findings (supine positioning alters breath sound distribution)",
      "Obesity limiting chest wall assessment — diminished breath sounds may be normal in obese patients",
      "Stethoscope placement over clothing producing artifact sounds misinterpreted as adventitious sounds",
      "Failure to compare bilateral findings leading to missed unilateral pathology"
    ],
    diagnostics: [
      "Systematic inspection, palpation, percussion, and auscultation at each respiratory assessment",
      "Vital sign trending: respiratory rate, heart rate, SpO2, blood pressure, temperature",
      "Modified Borg scale or mMRC dyspnea scale for standardized dyspnea documentation",
      "Peak cough flow measurement for cough effectiveness assessment (< 270 L/min = inadequate)",
      "Rapid shallow breathing index (RSBI = RR/VT) for weaning assessment",
      "Pulse oximetry with waveform quality assessment (pleth variability index)",
      "Capnography for ventilation assessment in intubated and sedated patients",
      "Glasgow Coma Scale for neurological status and airway protection assessment"
    ],
    management: [
      "Perform comprehensive respiratory assessment before initiating any respiratory therapy",
      "Reassess after every intervention to evaluate treatment response — document pre- and post-findings",
      "Escalate care for danger signs: RR > 30 or < 8, SpO2 < 88% not responding to O2, altered mental status, silent chest",
      "Use standardized early warning scores (NEWS, MEWS) to quantify deterioration and trigger escalation",
      "Correlate physical assessment with objective data (ABG, imaging, labs) for comprehensive clinical picture",
      "Differentiate upper airway sounds (stridor — inspiratory, indicates laryngeal/tracheal pathology) from lower airway sounds (wheezing — expiratory, indicates bronchospasm)",
      "Position patient for optimal assessment: sitting upright when possible, assess posterior and anterior chest",
      "Document assessment findings systematically using standardized respiratory assessment documentation"
    ],
    nursingActions: [
      "Assess respiratory rate by counting for a full 60 seconds — avoid estimating or relying solely on monitor values",
      "Auscultate in a systematic ladder pattern: anterior then posterior, comparing right to left at each level",
      "Place stethoscope directly on skin, NOT over clothing — clothing produces artifact sounds",
      "Assess for accessory muscle use, nasal flaring, retractions, and paradoxical breathing as indicators of increased work of breathing",
      "Palpate tracheal position and tactile fremitus to localize pathology (shift toward atelectasis, away from tension PTX/effusion)",
      "Document breath sounds using standardized terminology: vesicular, diminished, absent, crackles (fine/coarse), wheezes, rhonchi, stridor",
      "Correlate breath sound changes with ventilator parameter changes and patient complaints",
      "Assess cough strength, sputum characteristics, and ability to clear secretions"
    ],
    signs: [
      "Increased work of breathing: accessory muscle use, nasal flaring, intercostal/supraclavicular retractions, paradoxical breathing",
      "Consolidation (pneumonia): bronchial breath sounds peripherally, increased tactile fremitus, dullness to percussion, egophony",
      "Pleural effusion: absent breath sounds, decreased tactile fremitus, dullness to percussion, mediastinal shift away if large",
      "Pneumothorax: absent breath sounds, hyperresonance to percussion, tracheal deviation away (if tension)",
      "Bronchospasm: bilateral wheezing, prolonged expiratory phase, use of accessory muscles",
      "Upper airway obstruction: inspiratory stridor, tripod positioning, drooling, inability to speak"
    ],
    medications: [],
    pearls: [
      "Respiratory rate is the most sensitive vital sign for detecting clinical deterioration — always count for a full 60 seconds",
      "Bronchial breath sounds heard peripherally indicate consolidation — air-filled bronchi surrounded by solid (consolidated) lung tissue transmit high-frequency sounds",
      "Absent breath sounds can mean pneumothorax, massive effusion, or complete obstruction — percussion differentiates (hyperresonant = PTX, dull = effusion)",
      "Fine crackles that do NOT clear with cough suggest parenchymal disease (fibrosis, early edema); coarse crackles that clear suggest secretions",
      "A silent chest in asthma is NOT a good sign — it means there is no airflow. This is a life-threatening finding",
      "Tactile fremitus INCREASES over consolidation (solid transmits vibration) and DECREASES over effusion or pneumothorax (fluid/air blocks transmission)"
    ],
    quiz: [
      { question: "During auscultation, you hear loud, high-pitched breath sounds with expiration longer than inspiration over the right lower lobe. What does this indicate?", options: ["Normal vesicular breath sounds", "Bronchial breath sounds suggesting consolidation", "Wheezing indicating bronchospasm", "Pleural friction rub"], correct: 1, rationale: "Bronchial breath sounds (loud, high-pitched, expiration > inspiration) are normal over the trachea but abnormal when heard over peripheral lung. Their presence peripherally indicates consolidation — the solid, air-free lung tissue transmits the high-frequency tracheal sounds to the chest wall. This is a classic finding in pneumonia." },
      { question: "A patient has decreased breath sounds, dullness to percussion, and decreased tactile fremitus over the left base. What is the most likely finding?", options: ["Left lower lobe pneumonia", "Left pleural effusion", "Left pneumothorax", "Left bronchospasm"], correct: 1, rationale: "Decreased breath sounds + dullness to percussion + decreased fremitus = pleural effusion. The fluid blocks sound transmission (decreased sounds and fremitus) and produces dullness because fluid is denser than air. Pneumonia would show increased fremitus (consolidated lung transmits vibration). Pneumothorax would show hyperresonance. Bronchospasm would show wheezing." },
      { question: "Which abnormal breathing pattern is characterized by deep, rapid respirations seen in severe metabolic acidosis?", options: ["Cheyne-Stokes", "Biot's respiration", "Kussmaul breathing", "Apneustic breathing"], correct: 2, rationale: "Kussmaul breathing is deep, rapid, and regular — it is the respiratory compensation for severe metabolic acidosis (particularly DKA). The lungs attempt to blow off CO2 to raise pH. Cheyne-Stokes is crescendo-decrescendo with apnea periods (heart failure, brain injury). Biot's is irregular with apnea periods (brain damage). Apneustic has prolonged inspiratory pauses (pontine lesion)." }
    ]
  },

  "oxygen-therapy-complications-rrt": {
    title: "Oxygen Therapy Complications",
    cellular: `While oxygen is the most frequently used drug in respiratory therapy, it carries significant risks when used inappropriately. Understanding oxygen toxicity mechanisms, absorption atelectasis, oxygen-induced hypercapnia, fire hazards, and retinopathy of prematurity is essential for safe oxygen management.

Oxygen toxicity occurs when high FiO2 (> 0.60) is administered for prolonged periods (typically > 24-48 hours). The mechanism involves generation of reactive oxygen species (ROS) — superoxide radicals, hydrogen peroxide, and hydroxyl radicals — that overwhelm the lung's antioxidant defenses (superoxide dismutase, catalase, glutathione). Phase 1 (exudative, 0-72 hours): tracheobronchitis, decreased mucociliary clearance, surfactant inactivation, alveolar edema. Phase 2 (proliferative, > 72 hours): type I pneumocyte destruction, type II pneumocyte proliferation, interstitial fibrosis, and eventually ARDS-like pathology. Oxygen toxicity produces changes radiographically and physiologically indistinguishable from ARDS — a dangerous feedback loop where the treatment (high FiO2) worsens the condition it is treating.

Absorption atelectasis occurs when high FiO2 replaces nitrogen in alveoli. Nitrogen is poorly soluble in blood and acts as a "splint" maintaining alveolar volume. When FiO2 is high, nitrogen is washed out and replaced by oxygen, which is rapidly absorbed into the blood. In lung units with low V/Q ratios (where oxygen absorption outpaces replenishment), the alveolus collapses. This is particularly problematic during pre-oxygenation with 100% FiO2 before intubation — the resulting atelectasis reduces the oxygen reserve that pre-oxygenation was intended to create.

Oxygen-induced hypercapnia in COPD patients involves three mechanisms: suppression of hypoxic ventilatory drive (patients with chronic CO2 retention may depend partially on hypoxia as their ventilatory stimulus — excessive oxygen removes this drive), the Haldane effect (oxygenated hemoglobin has reduced CO2 carrying capacity, releasing CO2 into plasma and raising PaCO2), and release of hypoxic pulmonary vasoconstriction (oxygen restores perfusion to poorly ventilated lung units, worsening V/Q mismatch and overall gas exchange). The Haldane effect and V/Q mismatch changes are now considered the primary mechanisms, with hypoxic drive suppression being less important than historically taught.

Fire hazard: oxygen supports and accelerates combustion. An oxygen-enriched atmosphere (> 23.5% vs normal 21%) dramatically reduces the ignition temperature and increases the burning rate of flammable materials. Sources of ignition near oxygen include smoking, open flames, electrical equipment producing sparks, and friction. Patient safety measures: no smoking within 10 feet of oxygen equipment, no petroleum-based products near oxygen delivery (use water-based alternatives), verify electrical equipment is functioning properly, and educate patients and families on oxygen fire safety.

Retinopathy of prematurity (ROP) results from oxygen-induced disruption of retinal vascular development in premature neonates. Hyperoxemia causes regression of developing retinal vessels (vasoconstriction and vessel obliteration). When oxygen is subsequently reduced, the hypoxic retina produces excessive VEGF, causing abnormal neovascularization that can lead to retinal detachment and blindness. ROP risk increases with lower gestational age and higher/fluctuating oxygen levels. Prevention: maintain SpO2 90-95% in premature neonates, avoid SpO2 > 95%, use oxygen blenders with continuous FiO2 monitoring, and minimize SpO2 fluctuations.`,
    riskFactors: [
      "FiO2 > 0.60 for > 24-48 hours increasing risk of oxygen toxicity and ARDS-like changes",
      "Uncontrolled oxygen in COPD patients causing oxygen-induced hypercapnia and respiratory depression",
      "Premature neonates receiving unmonitored high FiO2 developing retinopathy of prematurity",
      "Absorption atelectasis from nitrogen washout during prolonged 100% FiO2 breathing",
      "Fire hazard in home oxygen users — especially those who smoke or use open flames near equipment",
      "SpO2 fluctuations in premature neonates (more harmful than steady-state elevated SpO2)",
      "Delayed weaning of FiO2 when clinical condition improves, prolonging unnecessary exposure",
      "False sense of security from normal SpO2 masking worsening underlying pathology"
    ],
    diagnostics: [
      "ABG with A-a gradient to assess oxygenation efficiency and guide FiO2 weaning",
      "Serial chest X-ray to detect oxygen toxicity changes (bilateral diffuse opacities indistinguishable from ARDS)",
      "PaCO2 monitoring 30-60 minutes after oxygen initiation in COPD patients to detect oxygen-induced hypercapnia",
      "Continuous SpO2 monitoring with alarm limits set to prevent both hypoxemia and hyperoxemia",
      "FiO2 verification with calibrated oxygen analyzer at the patient interface",
      "Retinal examinations by ophthalmology for premature neonates at risk for ROP (starting at 31 weeks PMA or 4 weeks chronological age)",
      "Carboxyhemoglobin level to interpret SpO2 accuracy in smokers and fire victims"
    ],
    management: [
      "Wean FiO2 to the lowest level maintaining target SpO2 — never leave high FiO2 running without reassessment",
      "Target SpO2 92-96% for most adults, 88-92% for COPD patients with chronic hypercapnia, 90-95% for premature neonates",
      "If FiO2 > 0.60 is required for > 24 hours, consider PEEP optimization, prone positioning, or other strategies to reduce FiO2",
      "Monitor PaCO2 in COPD patients 30-60 minutes after oxygen initiation — if rising, reduce FiO2 and consider NIV",
      "Implement fire safety education for all home oxygen patients: no smoking, no open flames, keep away from heat sources",
      "Use oxygen blenders for neonates to provide precise FiO2 — avoid connecting nasal cannula directly to wall oxygen",
      "In premature neonates: respond rapidly to desaturation events but avoid over-correction — target SpO2 90-95%",
      "Consider PEEP to treat absorption atelectasis rather than increasing FiO2 (PEEP recruits collapsed alveoli without nitrogen washout)"
    ],
    nursingActions: [
      "Reassess and document SpO2 target and current FiO2 every assessment — actively wean when possible",
      "Check ABG 30-60 minutes after initiating or changing oxygen therapy in COPD patients",
      "Educate home oxygen patients on fire safety: no smoking, no petroleum products, 10-foot rule from ignition sources",
      "Use Venturi mask for precise FiO2 in COPD patients to minimize hypercapnia risk",
      "Monitor SpO2 alarm limits in neonates — set upper alarm at 95% and lower alarm at 88-90%",
      "Document FiO2, delivery device, flow rate, and SpO2 at every assessment",
      "Advocate for FiO2 reduction when SpO2 is above target — oxygen is a drug requiring titration like any other",
      "Report signs of oxygen toxicity: worsening bilateral infiltrates on CXR, declining PaO2 despite maintained or increased FiO2"
    ],
    signs: [
      "Oxygen toxicity: tracheobronchitis symptoms (substernal burning, cough), followed by bilateral infiltrates on CXR similar to ARDS",
      "Absorption atelectasis: segmental or lobar collapse after prolonged high FiO2, often in dependent lung regions",
      "Oxygen-induced hypercapnia: increasing somnolence, confusion, asterixis after oxygen initiation in COPD patient",
      "ROP: detected on retinal examination — white ridge between vascularized and avascular retina, progressing to neovascularization",
      "Home oxygen fire: burns to face and upper airway, melted nasal cannula, singed nasal hair"
    ],
    medications: [
      { name: "Oxygen (as a drug)", dose: "Titrated to target SpO2 per clinical indication", route: "Inhaled", purpose: "Supplemental oxygen is a medication requiring prescription, titration, monitoring, and weaning — never leave on autopilot" },
      { name: "Bevacizumab (Avastin)", dose: "0.625 mg intravitreal injection", route: "Intravitreal", purpose: "Anti-VEGF therapy for severe ROP to inhibit abnormal retinal neovascularization (used by ophthalmology)" }
    ],
    pearls: [
      "Oxygen is a DRUG with a therapeutic range — over-oxygenation causes measurable harm (oxygen toxicity, CO2 retention, ROP)",
      "Absorption atelectasis from 100% FiO2 is worsened by low tidal volume breathing — this is why pre-oxygenation should include recruitment breaths",
      "The Haldane effect and V/Q mismatch worsening are now considered the PRIMARY mechanisms of oxygen-induced hypercapnia — not just hypoxic drive suppression",
      "Home oxygen fires kill approximately 50 people per year in the US — fire safety education is a mandatory patient education requirement",
      "In premature neonates, SpO2 FLUCTUATIONS are more damaging to retinal vasculature than steady-state elevated SpO2 — minimize alarm-response oscillations",
      "If a patient needs > 0.60 FiO2 for > 24 hours, the priority is to reduce FiO2 through other means (PEEP, prone positioning, diuresis) — not to accept the toxicity risk"
    ],
    quiz: [
      { question: "A COPD patient is started on 6 L/min nasal cannula. SpO2 improves to 97% but the patient becomes increasingly drowsy. What is the likely cause?", options: ["Oxygen toxicity from acute exposure", "Oxygen-induced hypercapnia", "Normal sleep response to improved oxygenation", "Pulmonary embolism"], correct: 1, rationale: "Over-oxygenation in COPD patients with chronic CO2 retention causes hypercapnia through the Haldane effect (oxygenated Hb releases CO2), release of hypoxic pulmonary vasoconstriction (worsening V/Q mismatch), and reduced hypoxic ventilatory drive. The drowsiness is CO2 narcosis. Reduce FiO2 to target SpO2 88-92% and check ABG." },
      { question: "Which mechanism causes absorption atelectasis during prolonged 100% oxygen therapy?", options: ["Direct oxygen toxicity to alveolar cells", "Nitrogen washout removing the alveolar splint, allowing oxygen to be completely absorbed", "Surfactant destruction by reactive oxygen species", "Decreased mucociliary clearance"], correct: 1, rationale: "At 100% FiO2, nitrogen (which normally acts as an inert gas 'splint' maintaining alveolar volume) is washed out and replaced by oxygen. In low V/Q lung units, all the oxygen is absorbed into the blood faster than it is replenished, and without nitrogen to maintain volume, the alveolus collapses. This is absorption atelectasis." },
      { question: "What SpO2 target prevents retinopathy of prematurity in premature neonates?", options: ["95-100%", "90-95%", "85-90%", "80-85%"], correct: 1, rationale: "SpO2 target of 90-95% in premature neonates balances adequate oxygenation (SpO2 > 90% reduces mortality) against ROP risk (SpO2 > 95% increases ROP incidence from hyperoxemia-induced retinal vascular damage). Continuous FiO2 titration and minimizing SpO2 fluctuations are critical components of ROP prevention." }
    ]
  },

  "respiratory-care-protocols-rrt": {
    title: "Respiratory Care Protocols",
    cellular: `Respiratory care protocols (RCPs) are evidence-based, algorithmic guidelines that enable respiratory therapists to independently initiate, modify, discontinue, and evaluate respiratory therapies within an approved scope of practice. Protocol-driven care has demonstrated improved patient outcomes, reduced unnecessary therapy, decreased costs, and enhanced RT professional autonomy.

The oxygen therapy protocol is the most fundamental RCP. It authorizes the RT to: initiate oxygen therapy based on SpO2 < 90-92% or clinical assessment of hypoxemia, select the appropriate delivery device based on FiO2 requirement and clinical scenario, titrate FiO2 to target SpO2 (88-92% for COPD, 92-96% for most others), escalate to higher-flow devices or HFNC when low-flow devices are inadequate, and discontinue oxygen when SpO2 remains at target on room air. The protocol includes assessment triggers, titration algorithms, escalation criteria, and documentation requirements.

The bronchodilator therapy protocol authorizes the RT to: assess patients referred for bronchodilator therapy, administer therapy when indicated (wheezing, increased work of breathing, bronchospasm), withhold therapy when not indicated (no clinical signs of bronchospasm, heart rate > 120-140), modify frequency based on assessment (increase during exacerbation, decrease during improvement), and change delivery device based on patient ability and clinical status. Studies show that RT-driven bronchodilator protocols reduce unnecessary treatments by 30-50% compared to physician-ordered therapy.

The ventilator weaning protocol is one of the most impactful RCPs. It authorizes the RT to: screen daily for weaning readiness criteria (FiO2 ≤ 0.40, PEEP ≤ 8, hemodynamic stability, adequate mental status), coordinate with nursing for daily SAT before SBT, initiate and monitor SBTs, assess weaning tolerance using standardized criteria, and recommend extubation when SBT is passed. Protocol-driven weaning reduces ventilator days, ICU length of stay, and VAP incidence compared to physician-directed weaning.

The hyperinflation therapy protocol covers incentive spirometry (IS), intermittent positive pressure breathing (IPPB), and positive expiratory pressure (PEP) therapy for atelectasis prevention and treatment. It authorizes assessment of risk factors (post-operative, immobility, pain, neuromuscular weakness), selection of appropriate modality (IS for cooperative patients, IPPB for those unable to take deep breaths, PEP for secretion-retaining patients), and therapy frequency adjustment based on response.

Developing and implementing new protocols requires: review of current evidence and best practice guidelines, multidisciplinary protocol development committee (RT, physician, nursing, pharmacy), clear inclusion/exclusion criteria, assessment and reassessment checkpoints, escalation and notification triggers, documentation requirements, quality assurance metrics, and ongoing protocol compliance monitoring.`,
    riskFactors: [
      "Protocol non-compliance from inadequate education or resistance to standardized care",
      "Over-reliance on protocol without clinical judgment — protocols are guidelines, not substitutes for critical thinking",
      "Outdated protocols not reflecting current evidence — regular review and updating required",
      "Scope of practice concerns if protocols are not properly approved by medical staff",
      "Inadequate documentation of protocol-driven care decisions and rationale",
      "Failure to escalate when protocol criteria are exceeded — knowing when to deviate from protocol is essential",
      "Patient-specific considerations not addressed by standardized algorithms (rare conditions, complex comorbidities)"
    ],
    diagnostics: [
      "Protocol compliance auditing: percentage of eligible patients receiving protocol-appropriate therapy",
      "Unnecessary therapy tracking: bronchodilator treatments administered without clinical indication",
      "Ventilator weaning metrics: ventilator days, time from weaning readiness to extubation, SBT compliance",
      "Patient outcome metrics: reintubation rate, VAP rate, ICU length of stay, hospital length of stay",
      "Cost analysis: reduction in unnecessary treatments, improved resource utilization",
      "Staff competency assessment: RT knowledge of protocol algorithms and decision points",
      "Quality improvement data: protocol outcomes compared to pre-protocol benchmarks"
    ],
    management: [
      "Implement evidence-based respiratory care protocols for oxygen therapy, bronchodilator therapy, hyperinflation therapy, and ventilator weaning",
      "Train all RTs on protocol algorithms, assessment criteria, documentation requirements, and escalation triggers",
      "Conduct regular protocol compliance audits and provide feedback to staff",
      "Review and update protocols annually or when new evidence warrants changes",
      "Ensure protocols are approved by the medical staff and aligned with institutional scope of practice policies",
      "Use clinical judgment to deviate from protocol when patient-specific factors warrant different management",
      "Document the clinical rationale for both protocol-driven actions and protocol deviations",
      "Track outcome metrics to demonstrate protocol effectiveness and identify areas for improvement"
    ],
    nursingActions: [
      "Assess patients before implementing protocol-directed therapy — the assessment drives the intervention decision",
      "Document protocol-based decisions clearly: assessment findings, protocol criteria met/not met, actions taken",
      "Notify the physician when assessment findings exceed protocol escalation criteria",
      "Educate patients on the purpose and expected outcomes of protocol-directed therapy",
      "Participate in quality improvement initiatives measuring protocol effectiveness and compliance",
      "Advocate for protocol implementation when institutions rely on generic standing orders",
      "Withhold unnecessary therapy when protocol assessment indicates no clinical benefit — document rationale",
      "Collaborate with nursing and medical staff to ensure multidisciplinary understanding of RT-driven protocols"
    ],
    signs: [
      "Protocol success: reduced unnecessary therapy, shorter ventilator days, decreased ICU length of stay, improved staff satisfaction",
      "Protocol failure indicators: high non-compliance rates, adverse events from protocol limitations, physician override frequency",
      "Appropriate protocol deviation: patient condition requires treatment outside protocol parameters — document clinical reasoning",
      "Effective bronchodilator protocol: reduced treatments per patient day, maintained or improved patient outcomes",
      "Effective weaning protocol: daily SBT screening compliance > 90%, average ventilator days reduced"
    ],
    medications: [],
    pearls: [
      "RT-driven bronchodilator protocols reduce unnecessary treatments by 30-50% without worsening patient outcomes — this is evidence-based practice",
      "Protocol-driven ventilator weaning reduces ventilator days by 1.5 on average compared to physician-directed weaning",
      "Protocols do NOT replace clinical judgment — they provide a framework within which expert RT assessment drives individualized care",
      "The most impactful RCP is the ventilator weaning protocol — daily SBT screening by RTs is the single best intervention for reducing ventilator duration",
      "Withholding unnecessary bronchodilator therapy is just as important as administering indicated therapy — RTs add value in both directions",
      "Protocol compliance monitoring and outcome tracking are essential for demonstrating RT professional value and justifying scope of practice"
    ],
    quiz: [
      { question: "A patient is referred for scheduled Q4 albuterol nebulizer treatments. The RT assesses the patient and finds clear breath sounds, no wheezing, RR 16, SpO2 96%. What should the RT do under a bronchodilator protocol?", options: ["Administer the treatment as ordered", "Hold the treatment and document assessment findings showing no indication", "Switch to MDI delivery instead", "Increase frequency to Q2 based on protocol"], correct: 1, rationale: "Under a bronchodilator therapy protocol, the RT has the authority to withhold treatment when clinical assessment shows no indication (no wheezing, no increased work of breathing, no bronchospasm). Administering unnecessary treatments wastes resources, exposes the patient to unnecessary medication side effects, and provides no clinical benefit. Document the assessment findings and rationale for holding." },
      { question: "What is the primary benefit of RT-driven ventilator weaning protocols compared to physician-directed weaning?", options: ["Lower cost of medications", "Reduced ventilator days and ICU length of stay", "Better pain management", "Improved surgical outcomes"], correct: 1, rationale: "RT-driven ventilator weaning protocols with daily screening and SBT initiation reduce ventilator days by an average of 1.5 days and decrease ICU length of stay. RTs assess patients more frequently than physicians and can initiate SBTs as soon as criteria are met, avoiding delays inherent in physician-dependent weaning orders." },
      { question: "Which is the most important element of a respiratory care protocol?", options: ["Physician signature", "Assessment-driven decision making based on clinical findings", "Standardized medication dosing", "Fixed treatment schedules"], correct: 1, rationale: "The hallmark of effective respiratory care protocols is assessment-driven decision making. The RT performs a clinical assessment at each encounter and uses the protocol algorithm to determine whether therapy is indicated, what modifications are needed, or whether therapy should be withheld or discontinued. Fixed schedules without assessment are the opposite of protocol-driven care." }
    ]
  },

  "high-flow-nasal-cannula-rrt": {
    title: "High-Flow Nasal Cannula Therapy",
    cellular: `High-flow nasal cannula (HFNC) therapy has emerged as a major advancement in oxygen delivery and respiratory support. By delivering heated, humidified gas at flows up to 60 L/min through specialized large-bore nasal prongs, HFNC provides physiological benefits beyond simple oxygenation that bridge the gap between conventional oxygen therapy and noninvasive ventilation.

HFNC mechanisms of action include: precise FiO2 delivery (the high flow rate meets or exceeds the patient's peak inspiratory flow, eliminating room air entrainment and delivering a consistent FiO2 from 0.21 to 1.0), nasopharyngeal dead space washout (continuous high-flow gas flushes CO2-rich exhaled gas from the nasopharyngeal reservoir, reducing dead space and improving alveolar ventilation), flow-dependent PEEP effect (estimated 0.5-1.0 cmH2O per 10 L/min with mouth closed, providing mild alveolar recruitment and improved FRC), reduced metabolic cost of gas conditioning (the heated humidified gas eliminates the metabolic expenditure of warming and humidifying inspired gas, which can be significant in tachypneic patients), and improved patient comfort and tolerance compared to face masks (allows eating, drinking, speaking, and oral medication administration).

The FLORALI trial (Frat et al., 2015) demonstrated that HFNC at 50 L/min reduced 90-day mortality compared to standard oxygen or NIV in patients with acute hypoxemic respiratory failure and PaO2/FiO2 ≤ 200, particularly in the subgroup with P/F ≤ 200. This landmark trial established HFNC as a first-line therapy for non-hypercapnic acute hypoxemic respiratory failure.

The ROX index (SpO2/FiO2 ÷ respiratory rate) is the primary tool for predicting HFNC success or failure. ROX ≥ 4.88 at 2, 6, or 12 hours predicts low intubation risk (HFNC success). ROX < 3.85 at 12 hours predicts high intubation risk (HFNC failure — consider escalation to NIV or intubation). ROX 3.85-4.88 is indeterminate and requires continued close monitoring. Serial ROX trending is more informative than single values — a declining ROX trajectory indicates worsening respiratory status requiring intervention.

HFNC has several evidence-based clinical applications: acute hypoxemic respiratory failure (first-line per FLORALI), post-extubation support (reduces reintubation rates compared to conventional oxygen in high-risk patients — particularly after cardiac surgery), pre-oxygenation before intubation (maintains oxygenation during apnea via transnasal humidified rapid-insufflation ventilatory exchange — THRIVE), and immunocompromised patients with acute respiratory failure (may reduce intubation rates compared to standard oxygen).

HFNC should NOT delay necessary intubation. The 1-2 hour reassessment window is critical: if clinical parameters (respiratory rate, work of breathing, SpO2) are not improving, escalation to NIV or intubation should not be postponed. Patients who fail HFNC and are intubated late have worse outcomes than those intubated early.

Post-extubation HFNC at 50-60 L/min has been shown to reduce reintubation rates compared to conventional oxygen therapy in high-risk patients (age > 65, heart failure, COPD, multiple comorbidities). The OPTINIV trial suggests that alternating HFNC with NIV post-extubation may further reduce reintubation risk in very high-risk patients.`,
    riskFactors: [
      "Delayed intubation from prolonged HFNC trial in patients who should have been escalated earlier",
      "Aerosol generation and potential pathogen dispersal — HFNC may aerosolize respiratory secretions",
      "Nasal mucosal irritation or epistaxis from high-flow gas delivery through nasal prongs",
      "Gastric distension from swallowed air at high flow rates",
      "Inability to provide adequate PEEP in severe hypoxemia — HFNC PEEP effect is modest and variable",
      "Patient removing nasal prongs during sleep reducing therapy effectiveness",
      "Skin breakdown from nasal prong contact during prolonged use"
    ],
    diagnostics: [
      "ROX index calculation at 2, 6, and 12 hours: (SpO2/FiO2) / RR — serial trending for trajectory assessment",
      "Continuous SpO2, respiratory rate, and heart rate monitoring throughout HFNC therapy",
      "ABG at baseline and at 1-2 hours to assess oxygenation and ventilation response",
      "P/F ratio calculation for oxygenation severity tracking (requires ABG with known FiO2)",
      "Clinical assessment of work of breathing: accessory muscle use, nasal flaring, paradoxical breathing",
      "Chest X-ray to identify underlying pathology and monitor progression",
      "Fluid balance assessment — dehydrated patients may have reduced HFNC humidification benefit"
    ],
    management: [
      "Initiate HFNC at 40-60 L/min, FiO2 titrated to target SpO2, heated to 37°C with 100% relative humidity",
      "Calculate and document ROX index at 2, 6, and 12 hours after HFNC initiation",
      "If ROX < 3.85 at 12 hours: escalate to NIV or prepare for intubation — do not continue failing HFNC trial",
      "Post-extubation: initiate HFNC at 50-60 L/min in high-risk patients immediately after extubation",
      "Wean FiO2 before weaning flow rate — maintain flow to preserve PEEP effect and dead space washout during weaning",
      "Instruct patient to breathe with mouth closed when possible to maximize PEEP effect",
      "Use during pre-oxygenation: HFNC at 60 L/min, FiO2 1.0 during apneic oxygenation for intubation",
      "For post-extubation high-risk: consider alternating HFNC with NIV per OPTINIV protocol"
    ],
    nursingActions: [
      "Calculate and document ROX index at 2, 6, and 12 hours — alert provider if ROX < 3.85 or declining trajectory",
      "Monitor and document flow rate, FiO2, temperature setting, and patient response hourly",
      "Assess comfort: nasal irritation, nostril fit (prongs should not occlude > 50% of nares), skin integrity",
      "Maintain water level in humidifier chamber — inadequate water causes inadequate humidification and mucosal drying",
      "Keep intubation equipment at bedside for all patients on HFNC for acute respiratory failure",
      "Encourage mouth-closed breathing to maximize PEEP effect — educate patient on the benefit",
      "Verify circuit connections are secure — disconnection causes immediate loss of therapy",
      "Apply appropriate infection control precautions — HFNC is considered an aerosol-generating procedure by some guidelines"
    ],
    signs: [
      "HFNC success: decreasing RR, improving SpO2, decreasing work of breathing, ROX ≥ 4.88, patient comfort",
      "HFNC failure: persistent RR > 30, ROX < 3.85 at 12 hours, worsening SpO2 despite FiO2 increase, increasing distress",
      "Impending failure: declining ROX trajectory over serial measurements even if absolute value is in indeterminate zone",
      "Adequate humidification: condensation visible in circuit, no patient complaints of nasal dryness",
      "PEEP effect: slight improvement in SpO2 when patient breathes with mouth closed vs open"
    ],
    medications: [],
    pearls: [
      "ROX ≥ 4.88 at 2 hours predicts HFNC success — calculate this on EVERY HFNC patient at 2, 6, and 12 hours",
      "Wean FiO2 BEFORE weaning flow rate — maintaining high flow preserves PEEP, dead space washout, and consistent FiO2 delivery",
      "HFNC generates approximately 0.5-1.0 cmH2O PEEP per 10 L/min with mouth closed — this is modest but clinically significant",
      "Delayed intubation after failed HFNC worsens outcomes — the 1-2 hour reassessment is a critical go/no-go decision point",
      "Post-extubation HFNC at 50 L/min reduces reintubation compared to conventional O2 in high-risk patients — use it as default post-extubation support",
      "HFNC cannot replace NIV for hypercapnic respiratory failure — it reduces dead space but does not provide the ventilatory support that BiPAP delivers"
    ],
    quiz: [
      { question: "A patient on HFNC at 50 L/min has SpO2 94%, FiO2 0.60, and RR 28 at 6 hours. What is the ROX index and interpretation?", options: ["ROX 5.6 — likely to succeed on HFNC", "ROX 3.4 — high risk of failure, escalate therapy", "ROX 4.2 — indeterminate, continue monitoring", "Cannot calculate ROX without ABG"], correct: 0, rationale: "ROX = (SpO2/FiO2) / RR = (94/60) / 28 = 1.567 / 28 = 0.056... Wait, let me recalculate. SpO2/FiO2 = 94/0.60 = 156.7. ROX = 156.7 / 28 = 5.6. ROX ≥ 4.88 at 6 hours predicts low intubation risk — this patient is likely to succeed on HFNC therapy. Continue monitoring with serial ROX assessments." },
      { question: "When weaning a patient from HFNC, which parameter should be reduced first?", options: ["Flow rate", "FiO2", "Temperature", "Both simultaneously"], correct: 1, rationale: "FiO2 should be weaned before flow rate. Maintaining high flow preserves the beneficial physiological effects of HFNC — PEEP effect, dead space washout, and consistent FiO2 delivery. Once FiO2 is at 0.30-0.40, flow can then be gradually reduced. Weaning flow first removes these benefits prematurely." },
      { question: "Which clinical application of HFNC has the strongest evidence for mortality reduction?", options: ["Post-extubation support", "Acute hypoxemic respiratory failure (FLORALI trial)", "Pre-oxygenation before intubation", "Stable COPD at home"], correct: 1, rationale: "The FLORALI trial demonstrated that HFNC at 50 L/min reduced 90-day mortality compared to standard oxygen and NIV in patients with acute non-hypercapnic hypoxemic respiratory failure (P/F ≤ 200). This is the strongest evidence base for HFNC and established it as first-line therapy for this indication." }
    ]
  },

  "ventilator-alarms-troubleshooting-rrt": {
    title: "Ventilator Alarms and Troubleshooting",
    cellular: `Ventilator alarm management and troubleshooting is a critical safety competency for respiratory therapists. The ability to rapidly identify the cause of an alarm, assess the patient, and intervene appropriately can prevent life-threatening complications. The universal rule: assess the patient first, then the equipment. Never silence an alarm without identifying and addressing its cause.

High pressure alarms activate when peak inspiratory pressure (PIP) exceeds the set alarm limit. Causes are categorized by where the pressure increase originates: patient-related (bronchospasm, secretions, biting ETT, coughing, fighting the ventilator, pneumothorax, abdominal distension, worsening compliance from ARDS/pulmonary edema) or circuit-related (water accumulation in circuit, kinked circuit tubing, kinked or occluded ETT). Troubleshooting approach: check Pplat. If PIP is high but Pplat is normal → resistance problem (secretions, bronchospasm, kinked tube). If both PIP and Pplat are high → compliance problem (pneumothorax, ARDS, effusion, abdominal distension).

Low pressure alarms activate when inspiratory pressure fails to reach the alarm threshold. This typically indicates a significant leak in the system: circuit disconnection, ETT cuff leak, chest tube with large bronchopleural fistula, or circuit component failure. Low pressure alarms require immediate attention because the patient may not be receiving adequate ventilation. Troubleshooting: check all circuit connections, verify ETT cuff pressure, assess for audible air leak around ETT, and inspect circuit for damage.

Low exhaled volume alarms indicate the ventilator is not receiving back the expected tidal volume. Causes include circuit leak (same as low pressure alarm causes), ETT cuff leak, chest tube air leak (bronchopleural fistula), patient disconnection, and in pressure modes, worsening compliance delivering lower VT at the same set pressure. This alarm essentially tells you air is going in but not coming back — find the leak.

High respiratory rate alarms activate when the total rate (set + patient-triggered breaths) exceeds the alarm limit. Causes: pain, anxiety, fever, metabolic acidosis (compensatory tachypnea), inadequate sedation, patient-ventilator dyssynchrony, and worsening respiratory failure. Before increasing sedation, first ensure the ventilator settings match the patient's needs — flow, sensitivity, mode, and support level.

Apnea alarms indicate no breath has been detected within the apnea interval (typically 20 seconds). In mandatory modes, this suggests ventilator malfunction. In spontaneous modes (PSV, CPAP), it indicates the patient is not breathing — check for oversedation, neurological event, or respiratory arrest. Verify apnea backup ventilation settings are activated.

The DOPE mnemonic provides a systematic approach to the acutely deteriorating ventilated patient: Displacement (ETT displaced — check depth, verify ETCO2), Obstruction (secretions, blood, kink in ETT — pass suction catheter, if unable to pass, ETT may need replacement), Pneumothorax (absent breath sounds, hyperresonance, tracheal deviation — needle decompression if tension), Equipment failure (ventilator malfunction, circuit issue — disconnect and manually ventilate with bag while troubleshooting).`,
    riskFactors: [
      "Alarm fatigue from excessive non-actionable alarms leading to delayed response to real emergencies",
      "Silencing alarms without identifying and addressing the cause",
      "Inappropriately wide alarm limits that fail to alert to clinically significant changes",
      "Inappropriately narrow alarm limits that generate excessive false alarms",
      "Failure to assess the patient first — troubleshooting equipment while the patient deteriorates",
      "Unrecognized auto-PEEP causing hemodynamic compromise misattributed to other causes",
      "Water in ventilator circuit obstructing gas flow and triggering pressure alarms"
    ],
    diagnostics: [
      "PIP measurement to identify high pressure events",
      "Pplat measurement to differentiate resistance (PIP high, Pplat normal) from compliance (both high) problems",
      "Auto-PEEP measurement via expiratory hold to detect air trapping",
      "Exhaled VT measurement to identify leaks (compare inspiratory to expiratory volumes)",
      "ETCO2 waveform verification for ETT position confirmation",
      "Chest auscultation for bilateral breath sounds, wheezing, absent sounds",
      "Circuit inspection for disconnection, kink, water accumulation, component failure",
      "Cuff pressure measurement to verify ETT cuff integrity (20-30 cmH2O)"
    ],
    management: [
      "ALWAYS assess the patient FIRST before troubleshooting equipment — use DOPE mnemonic for acute deterioration",
      "If unable to quickly identify and resolve the problem: disconnect from ventilator and manually ventilate with bag",
      "High PIP with normal Pplat: suction (secretions), bronchodilator (bronchospasm), check ETT for kink or obstruction",
      "High PIP with high Pplat: assess for pneumothorax, worsening ARDS, abdominal distension, pleural effusion",
      "Low pressure / low volume alarm: check all connections, verify cuff pressure, look for circuit breach",
      "Apnea alarm on spontaneous mode: stimulate patient, check sedation level, verify apnea backup is active",
      "High rate alarm: assess for pain, anxiety, metabolic acidosis, inadequate support — address the CAUSE before increasing sedation",
      "Set alarm limits appropriately for each patient: 10-15 cmH2O above current PIP for high pressure, ± 20% of set VT for volume alarms"
    ],
    nursingActions: [
      "NEVER silence an alarm without identifying its cause and documenting the reason and response",
      "Set patient-specific alarm limits at start of shift and adjust with any settings change",
      "Respond to ALL alarms within 30 seconds — even during another patient's assessment",
      "Use the DOPE mnemonic systematically for any acute ventilator-related deterioration",
      "Keep manual resuscitation bag (with PEEP valve and oxygen tubing connected) at every ventilator bedside",
      "Drain water from ventilator circuit into water traps — do NOT drain toward the patient or into humidifier",
      "Document every alarm event: type, cause identified, intervention performed, and patient response",
      "Educate bedside nurses on basic ventilator alarm significance and when to call the RT immediately"
    ],
    signs: [
      "High pressure: audible alarm, PIP exceeding set limit, possible patient coughing/biting or circuit obstruction",
      "Low pressure/disconnect: audible alarm, no pressure generation, possible audible air leak, patient not receiving ventilation",
      "Low exhaled volume: ventilator not recovering expected VT — look for leak, cuff problem, or worsening compliance in pressure mode",
      "Apnea: no spontaneous effort detected — patient oversedated, neurological event, or respiratory arrest",
      "Auto-PEEP: flow waveform not returning to zero before next inspiration, unexplained hemodynamic instability",
      "DOPE-identified problems: ETT displacement (no ETCO2), obstruction (cannot pass suction catheter), pneumothorax (absent sounds + hypotension)"
    ],
    medications: [
      { name: "Albuterol (for bronchospasm alarm)", dose: "2.5-5 mg via inline nebulizer", route: "Inhaled", purpose: "Treat bronchospasm causing high PIP alarm — reassess PIP after treatment to verify response" },
      { name: "Midazolam (for agitation alarm)", dose: "1-2 mg IV PRN", route: "Intravenous", purpose: "Treat acute agitation causing patient-ventilator dyssynchrony — only AFTER addressing ventilator synchrony issues" }
    ],
    pearls: [
      "ASSESS THE PATIENT FIRST, then the equipment — the most dangerous response to a ventilator alarm is to check the machine while the patient arrests",
      "High PIP + normal Pplat = RESISTANCE problem (airways). High PIP + high Pplat = COMPLIANCE problem (lungs/chest wall). This distinction guides every intervention",
      "DOPE mnemonic for acute deterioration: Displacement, Obstruction, Pneumothorax, Equipment — run through it systematically every time",
      "If you cannot quickly fix the problem: DISCONNECT from the ventilator and bag the patient. A functioning BVM is always available",
      "Alarm fatigue kills — set appropriate limits, respond to every alarm, and advocate for institutional alarm management policies",
      "Water in the ventilator circuit flows toward the patient (gravity + positive pressure) — drain water traps regularly and away from the patient"
    ],
    quiz: [
      { question: "A ventilated patient's PIP suddenly increases from 28 to 45 cmH2O. Pplat remains at 22 cmH2O. What is the most likely cause?", options: ["Pneumothorax", "ARDS progression", "Bronchospasm or mucus plugging", "Pleural effusion"], correct: 2, rationale: "High PIP with unchanged Pplat indicates increased airway RESISTANCE, not decreased compliance. PIP includes both resistive and elastic components; Pplat reflects only elastic (compliance). Bronchospasm and mucus plugging increase airway resistance. Pneumothorax, ARDS, and effusion decrease compliance, raising both PIP and Pplat." },
      { question: "A ventilated patient suddenly becomes hypotensive, tachycardic, and difficult to ventilate with absent left breath sounds. Using DOPE, what is the most likely cause?", options: ["D — ETT displacement", "O — ETT obstruction", "P — Left tension pneumothorax", "E — Equipment failure"], correct: 2, rationale: "Absent unilateral breath sounds + hypotension + difficulty ventilating = tension pneumothorax (P in DOPE). The air under pressure collapses the lung (absent breath sounds), compresses mediastinal structures (shifts trachea away), and impedes venous return (hypotension). This requires immediate needle decompression — do NOT wait for chest X-ray." },
      { question: "The low exhaled volume alarm is sounding. Which is the FIRST action?", options: ["Increase tidal volume setting", "Check all circuit connections for disconnection or leak", "Increase FiO2 to 100%", "Order a chest X-ray"], correct: 1, rationale: "Low exhaled volume means air is going in but not all of it is coming back — the most common cause is a circuit leak or disconnection. The first action is to systematically check all circuit connections, verify ETT cuff pressure, and listen for audible air leak. Once the leak is found and corrected, the exhaled volume should match the inspired volume." }
    ]
  },

  "pulmonary-rehabilitation-rrt": {
    title: "Pulmonary Rehabilitation",
    cellular: `Pulmonary rehabilitation is a comprehensive, multidisciplinary intervention for patients with chronic respiratory disease that integrates exercise training, education, behavior change, and psychosocial support. For respiratory therapists, pulmonary rehabilitation represents an opportunity to improve patient outcomes beyond the acute care setting, addressing the chronic disability and deconditioning that accompany progressive lung disease.

The evidence base for pulmonary rehabilitation is robust: Level I evidence demonstrates improvements in exercise capacity, dyspnea, health-related quality of life, and reduced hospitalizations in COPD patients. The 2013 ATS/ERS statement recommends pulmonary rehabilitation for all symptomatic COPD patients regardless of disease severity (GOLD stages I-IV), and emerging evidence supports rehabilitation in non-COPD conditions including pulmonary fibrosis, bronchiectasis, pulmonary hypertension, pre-/post-lung surgery, and post-acute COVID-19.

Exercise training is the cornerstone of pulmonary rehabilitation, typically conducted 2-3 times per week for 6-12 weeks (minimum 20 sessions). Components include lower extremity endurance training (walking, cycling — the most validated exercise mode), upper extremity training (arm ergometry, weight training — important for activities of daily living), inspiratory muscle training (threshold loading devices strengthening the diaphragm and accessory muscles), and flexibility/balance exercises. Exercise intensity is prescribed based on baseline exercise testing (6-minute walk test or cardiopulmonary exercise test) and titrated to achieve 60-80% of peak work rate or a Borg dyspnea score of 4-6 (moderate to somewhat severe).

Supplemental oxygen during exercise training should be prescribed for patients who desaturate below 88% during the 6-minute walk test. Oxygen flow is titrated to maintain SpO2 ≥ 90% during exercise. Ambulatory oxygen systems (portable concentrators, liquid oxygen) enable exercise training at appropriate intensity without hypoxemia-related exercise limitation.

Education components include disease self-management, medication management and inhaler technique, breathing strategies (pursed-lip breathing, diaphragmatic breathing), energy conservation techniques, nutritional counseling, smoking cessation support, advance care planning, and exacerbation action plans. Behavioral change techniques (motivational interviewing, goal setting, self-monitoring) promote long-term adherence to an active lifestyle after formal rehabilitation ends.

Outcome measurement includes the 6-minute walk distance (6MWD — minimum clinically important difference is 30 meters), shuttle walk test, dyspnea scales (mMRC, Borg), health-related quality of life questionnaires (SGRQ, CAT), and hospital readmission rates. Post-rehabilitation maintenance programs (home exercise programs, community exercise groups, telerehabilitation) are essential for sustaining benefits, as exercise tolerance declines within 6-12 months without ongoing activity.`,
    riskFactors: [
      "Exercise-induced desaturation below 88% in patients with advanced lung disease — prescribe ambulatory O2",
      "Cardiac arrhythmias during exercise in patients with pulmonary hypertension or coronary artery disease",
      "Musculoskeletal injury from exercise in deconditioned patients — progress gradually",
      "Exacerbation during rehabilitation program interrupting continuity and progress",
      "Depression and anxiety reducing motivation and program adherence (40% of COPD patients affected)",
      "Transportation barriers limiting access to outpatient rehabilitation programs",
      "Loss of rehabilitation gains within 6-12 months without maintenance exercise program"
    ],
    diagnostics: [
      "Six-minute walk test (6MWT) for baseline exercise capacity and oxygen desaturation assessment",
      "Cardiopulmonary exercise test (CPET) for detailed exercise physiology and exercise prescription",
      "Pulmonary function testing (spirometry, lung volumes, DLCO) for disease characterization",
      "mMRC dyspnea scale and CAT score for symptom burden assessment",
      "SpO2 monitoring during exercise to identify desaturation requiring supplemental oxygen",
      "Body composition assessment (BMI, lean body mass) for nutritional status evaluation",
      "Psychological screening for depression and anxiety (PHQ-9, GAD-7)"
    ],
    management: [
      "Refer all symptomatic COPD patients to pulmonary rehabilitation regardless of disease severity",
      "Prescribe exercise at 60-80% peak work rate or Borg 4-6 for 20-60 minutes per session, 2-3 times per week, minimum 20 sessions",
      "Titrate supplemental oxygen during exercise to maintain SpO2 ≥ 90%",
      "Include both lower and upper extremity training — upper extremity function is essential for ADLs",
      "Add inspiratory muscle training for patients with documented inspiratory muscle weakness (MIP < 60 cmH2O)",
      "Integrate education: disease management, breathing techniques, medications, nutrition, advance care planning",
      "Develop maintenance exercise program for post-rehabilitation sustainability",
      "Consider telerehabilitation for patients with transportation or access barriers"
    ],
    nursingActions: [
      "Perform pre-exercise assessment: vital signs, SpO2, dyspnea level, symptom review before each session",
      "Monitor SpO2, heart rate, blood pressure, and Borg dyspnea score continuously during exercise",
      "Stop exercise for: SpO2 < 85%, chest pain, dizziness, severe dyspnea (Borg > 8), new arrhythmia, SBP > 200 or DBP > 110",
      "Teach pursed-lip breathing: inhale through nose for 2 seconds, exhale through pursed lips for 4-6 seconds",
      "Coach diaphragmatic breathing: hand on abdomen, inhale through nose feeling abdomen rise, exhale slowly",
      "Document exercise parameters, patient response, and progress toward goals at each session",
      "Educate on energy conservation techniques: pacing, planning, prioritizing, and positioning",
      "Provide emotional support and motivational interviewing to address depression, anxiety, and adherence challenges"
    ],
    signs: [
      "Rehabilitation success: increased 6MWD by ≥ 30 meters, decreased mMRC dyspnea score, improved QOL scores, reduced hospitalizations",
      "Exercise intolerance: inability to achieve target intensity, excessive dyspnea or desaturation at low workloads",
      "Safe exercise response: SpO2 ≥ 90%, HR within target zone, Borg 4-6, no chest pain or arrhythmia",
      "Exercise termination criteria met: SpO2 < 85%, chest pain, dizziness, Borg > 8, hemodynamic instability",
      "Declining gains: failure to progress or loss of achieved exercise tolerance — reassess, modify program"
    ],
    medications: [
      { name: "Bronchodilator pre-exercise", dose: "Albuterol 2 puffs MDI 15-20 minutes before exercise", route: "Inhaled", purpose: "Optimize airway caliber before exercise to reduce dyspnea and improve exercise tolerance" },
      { name: "Supplemental Oxygen", dose: "Titrated to maintain SpO2 ≥ 90% during exercise", route: "Inhaled (portable system)", purpose: "Prevent exercise-induced hypoxemia enabling higher training intensity and longer exercise duration" }
    ],
    pearls: [
      "Pulmonary rehabilitation improves exercise capacity and quality of life more than ANY medication for COPD — it is underutilized",
      "The minimum clinically important difference for 6MWD is 30 meters — this is the benchmark for meaningful improvement",
      "Upper extremity training is essential — patients report that arm activities (bathing, dressing, cooking) cause more dyspnea than walking",
      "Benefits of rehabilitation fade within 6-12 months without maintenance — always include a home exercise maintenance plan",
      "Pursed-lip breathing creates 2-4 cmH2O back-pressure, slowing expiratory flow and preventing dynamic airway collapse in COPD",
      "Depression affects 40% of COPD patients and is the strongest predictor of rehab non-adherence — screen and treat proactively"
    ],
    quiz: [
      { question: "What is the minimum clinically important difference (MCID) for the 6-minute walk distance in COPD rehabilitation?", options: ["10 meters", "30 meters", "100 meters", "200 meters"], correct: 1, rationale: "The MCID for 6-minute walk distance is approximately 30 meters. This represents the smallest improvement that patients perceive as clinically meaningful. It is the standard outcome benchmark for evaluating pulmonary rehabilitation effectiveness. A 30-meter improvement in 6MWD is associated with reduced hospitalization risk." },
      { question: "At what SpO2 level should exercise be terminated during pulmonary rehabilitation?", options: ["SpO2 < 95%", "SpO2 < 90%", "SpO2 < 85%", "Any desaturation from baseline"], correct: 2, rationale: "Exercise should be terminated when SpO2 drops below 85%, indicating significant exercise-induced hypoxemia that risks cardiac arrhythmia and tissue injury. SpO2 88-90% during exercise with supplemental oxygen is often acceptable if the patient is symptomatically comfortable. Supplemental oxygen should be titrated to maintain SpO2 ≥ 90% during training." },
      { question: "Which breathing technique should be taught to COPD patients to prevent dynamic airway collapse during exertion?", options: ["Rapid deep breathing", "Breath holding during exertion", "Pursed-lip breathing", "Hyperventilation"], correct: 2, rationale: "Pursed-lip breathing creates back-pressure (2-4 cmH2O) during expiration that splints small airways open, preventing dynamic collapse from loss of elastic recoil in emphysema. It slows respiratory rate, improves tidal volume, enhances gas exchange, and reduces dyspnea during exertion." }
    ]
  },

  "bronchoscopy-assistance-rrt": {
    title: "Bronchoscopy Assistance",
    cellular: `Respiratory therapists provide critical support during bronchoscopy procedures, managing ventilation, monitoring, medication administration, and specimen handling. Understanding indications, contraindications, procedural support, and post-procedure care is essential for safe and effective bronchoscopy assistance.

Diagnostic bronchoscopy indications include: evaluation of abnormal chest imaging (masses, infiltrates, atelectasis), unexplained hemoptysis, persistent cough or stridor, suspected foreign body, lung cancer staging (endobronchial ultrasound-guided biopsy — EBUS), bronchoalveolar lavage (BAL) for infection diagnosis in immunocompromised patients, and transbronchial biopsy for diffuse lung disease (sarcoidosis, rejection monitoring in transplant patients).

Therapeutic bronchoscopy indications include: mucus plug removal for lobar atelectasis, foreign body extraction (rigid bronchoscopy preferred for large objects), airway stent placement for malignant obstruction, thermal ablation of endobronchial tumors (laser, electrocautery, cryotherapy), control of hemoptysis (endobronchial tamponade, cold saline lavage), and difficult intubation guidance (fiberoptic intubation).

During bronchoscopy in intubated patients, the RT manages ventilation while the bronchoscope occupies a significant portion of the ETT lumen. The bronchoscope (typically 5-6 mm outer diameter) within a standard ETT (7.5-8.0 mm) reduces the effective cross-sectional area by 40-66%, dramatically increasing airway resistance and auto-PEEP. Management includes: increasing FiO2 to 1.0, increasing PEEP by 2-5 cmH2O to compensate for air leak around the scope, switching to pressure control mode (compensates for variable resistance), reducing respiratory rate (prolonging expiratory time to reduce auto-PEEP), and monitoring closely for hemodynamic compromise.

BAL technique: the bronchoscope is wedged in a subsegmental bronchus, and 100-300 mL of sterile normal saline is instilled in 20-60 mL aliquots with gentle suction recovery between aliquots. Recovery of 40-60% of instilled volume is typical. BAL fluid is sent for cell count/differential, cultures (bacterial, fungal, mycobacterial, viral), cytology, and special stains (PJP, AFB). The return from the first aliquot is typically discarded (bronchial contamination) or sent separately.

Post-bronchoscopy monitoring includes: SpO2, respiratory rate, and hemodynamic monitoring for 2-4 hours, NPO until gag reflex returns (typically 2 hours after topical anesthesia), chest X-ray if transbronchial biopsy was performed (pneumothorax risk 1-6%), and assessment for complications (bleeding, pneumothorax, laryngospasm, bronchospasm, fever).`,
    riskFactors: [
      "Hypoxemia during procedure from bronchoscope occupying ETT lumen and BAL fluid instillation",
      "Pneumothorax from transbronchial biopsy (1-6% risk) — post-procedure CXR required",
      "Hemorrhage from biopsy sites — typically self-limited but massive hemorrhage possible (0.5-1%)",
      "Laryngospasm or bronchospasm from airway manipulation",
      "Aspiration risk if gag reflex assessed prematurely after topical anesthesia",
      "Auto-PEEP from reduced ETT effective diameter during bronchoscopy in intubated patients",
      "Cardiac arrhythmia from vagal stimulation or hypoxemia during the procedure",
      "Fever post-BAL from inflammatory response to lavage (not necessarily infection)"
    ],
    diagnostics: [
      "Pre-procedure: coagulation studies (PT/INR, platelets) — INR < 1.5, platelets > 50,000 for biopsy",
      "Continuous SpO2 and ECG monitoring throughout the procedure",
      "Post-procedure chest X-ray after transbronchial biopsy to rule out pneumothorax",
      "BAL fluid analysis: cell count, cultures, cytology, special stains based on clinical indication",
      "Endobronchial biopsy pathology for tissue diagnosis of masses and suspicious lesions",
      "Post-procedure ABG if hypoxemia occurred during the procedure",
      "Bronchoscopic visual assessment of airway anatomy, secretions, masses, and foreign bodies"
    ],
    management: [
      "Pre-procedure: increase FiO2 to 1.0, verify suction equipment, prepare topical lidocaine, have emergency equipment ready",
      "During intubated bronchoscopy: switch to pressure control, increase PEEP 2-5 cmH2O, reduce RR to minimize auto-PEEP",
      "Monitor SpO2 continuously — alert bronchoscopist if SpO2 drops below 90% for scope withdrawal and recovery",
      "Administer topical lidocaine (1-2% solution, max total dose 4-5 mg/kg) through the bronchoscope as directed",
      "Assist with BAL: prepare NS aliquots, manage suction, collect specimens in proper containers",
      "Post-procedure: reduce FiO2 back to pre-procedure level, monitor for complications for 2-4 hours",
      "NPO for 2 hours after procedure until gag reflex returns (test with small sip of water)",
      "Have emergency intubation equipment and chest tube tray available for post-biopsy pneumothorax"
    ],
    nursingActions: [
      "Verify pre-procedure consent, coagulation studies, NPO status, and IV access before procedure start",
      "Prepare and organize all equipment: bronchoscope, suction, topical lidocaine, specimen containers, oxygen setup",
      "Monitor and document SpO2, HR, BP, and respiratory status continuously during the procedure",
      "Assist with specimen collection and labeling — ensure proper handling for culture, cytology, and pathology specimens",
      "Manage ventilator adjustments during intubated bronchoscopy as described above",
      "Monitor post-procedure for hemorrhage (hemoptysis > scant), pneumothorax (dyspnea, absent sounds), and laryngospasm",
      "Assess gag reflex before allowing oral intake — test with small sip of water at 2 hours post-procedure",
      "Educate patient on expected post-procedure symptoms: mild hemoptysis, sore throat, low-grade fever"
    ],
    signs: [
      "Procedure complication — pneumothorax: sudden dyspnea, chest pain, absent breath sounds, subcutaneous emphysema",
      "Post-biopsy hemorrhage: ongoing hemoptysis > 50 mL, tachycardia, hypotension — position bleeding side down",
      "Bronchospasm: audible wheezing during or after procedure — administer inhaled bronchodilator",
      "Laryngospasm: inspiratory stridor, inability to ventilate — may require positive pressure ventilation or succinylcholine",
      "Successful procedure: adequate specimens obtained, patient stable, no significant complications"
    ],
    medications: [
      { name: "Lidocaine 1-2% topical", dose: "1-2 mL aliquots via bronchoscope (max total 4-5 mg/kg)", route: "Topical via bronchoscope", purpose: "Topical anesthesia of airway mucosa to suppress cough and gag reflex during bronchoscopy" },
      { name: "Midazolam", dose: "1-2 mg IV titrated to moderate sedation", route: "Intravenous", purpose: "Procedural sedation providing anxiolysis and amnesia during bronchoscopy" },
      { name: "Cold Saline (4°C)", dose: "20-30 mL aliquots instilled via bronchoscope", route: "Intrabronchial", purpose: "Topical vasoconstriction for biopsy-site hemorrhage control — tamponade effect + cold-induced vasoconstriction" }
    ],
    pearls: [
      "The bronchoscope in a standard ETT reduces cross-sectional area by 40-66% — switch to pressure control to compensate for variable resistance",
      "Increase FiO2 to 1.0 before the scope enters the ETT — hypoxemia during bronchoscopy is the most common complication",
      "Post-transbronchial biopsy CXR is mandatory — pneumothorax occurs in 1-6% and may be delayed",
      "NPO for 2 hours after procedure — topical anesthesia suppresses the gag reflex, creating aspiration risk",
      "Position the patient with the biopsy side DOWN if significant hemorrhage occurs — gravity keeps blood in the affected lung and protects the unaffected lung",
      "Post-BAL fever is common (inflammatory response) and does NOT necessarily indicate infection — observe for 24 hours before treating empirically"
    ],
    quiz: [
      { question: "During bronchoscopy in an intubated patient, which ventilator mode adjustment is most appropriate?", options: ["Increase tidal volume to compensate for leak", "Switch to pressure control mode to compensate for variable resistance", "Decrease PEEP to reduce airway pressure", "Switch to spontaneous mode"], correct: 1, rationale: "The bronchoscope within the ETT dramatically increases airway resistance. In volume control, this would cause dangerously high PIP. Pressure control mode automatically adjusts flow to maintain set pressure despite the variable resistance, providing safer ventilation. PEEP should actually be increased to compensate for leak around the scope." },
      { question: "After transbronchial lung biopsy, the patient develops sudden dyspnea and absent right breath sounds. What is the most likely complication?", options: ["Bronchospasm", "Right pneumothorax", "Mucus plug obstruction", "Pulmonary hemorrhage"], correct: 1, rationale: "Sudden dyspnea with absent unilateral breath sounds after transbronchial biopsy is pneumothorax until proven otherwise. Transbronchial biopsy carries a 1-6% pneumothorax risk from the biopsy needle penetrating the visceral pleura. Obtain immediate CXR and prepare for chest tube insertion if large or symptomatic." },
      { question: "How long should a patient remain NPO after bronchoscopy with topical airway anesthesia?", options: ["30 minutes", "1 hour", "2 hours until gag reflex returns", "6 hours"], correct: 2, rationale: "Topical lidocaine suppresses the gag reflex for approximately 2 hours. Eating or drinking before gag reflex recovery creates significant aspiration risk. Test gag reflex with a small sip of water at 2 hours — if the patient can swallow without coughing, oral intake can be resumed." }
    ]
  },

  "lung-transplant-respiratory-care-rrt": {
    title: "Lung Transplant Respiratory Care",
    cellular: `Respiratory therapists play an integral role in lung transplant care across the continuum — from pre-transplant optimization through post-operative ventilator management and long-term surveillance. The unique immunological and physiological considerations of the transplanted lung require specialized respiratory care knowledge.

Indications for lung transplant include end-stage lung diseases where medical therapy has been exhausted: COPD/emphysema (most common indication), idiopathic pulmonary fibrosis (IPF), cystic fibrosis, pulmonary arterial hypertension, and alpha-1 antitrypsin deficiency. Candidates undergo extensive evaluation including PFTs, 6MWT, cardiopulmonary exercise testing, and psychosocial assessment. Absolute contraindications include active malignancy, significant non-pulmonary organ dysfunction, non-adherence to medical therapy, and active substance abuse.

Post-operative ventilator management requires balancing adequate oxygenation and ventilation against the risk of primary graft dysfunction (PGD). PGD is the equivalent of ARDS in the transplanted lung, occurring within 72 hours of transplant, and is graded by P/F ratio (Grade 0: P/F > 300; Grade 1: P/F > 300 with infiltrates; Grade 2: P/F 200-300; Grade 3: P/F < 200). Lung-protective ventilation is essential: VT 6-8 mL/kg donor IBW, Pplat < 30 cmH2O, lowest FiO2 maintaining SpO2 > 92%, moderate PEEP. Early extubation (within 24-48 hours) is preferred when clinically feasible.

The transplanted lung has unique physiological considerations: denervation (cough reflex is absent below the anastomosis — patients cannot sense and clear secretions effectively), loss of mucociliary clearance at the anastomotic site, lymphatic disruption (increased susceptibility to pulmonary edema), and bronchial artery circulation is not reestablished (bronchial anastomotic healing depends on retrograde pulmonary artery blood flow — excessive airway pressures may compromise this).

Immunosuppression-related infection risk is the leading cause of mortality in the first year post-transplant. Opportunistic infections include CMV pneumonitis, Aspergillus airway colonization and invasive disease, Pneumocystis jirovecii pneumonia (PJP), and community-acquired respiratory viruses. Prophylactic regimens include valganciclovir (CMV), trimethoprim-sulfamethoxazole (PJP), and inhaled amphotericin or voriconazole (Aspergillus). Surveillance bronchoscopy with BAL and transbronchial biopsy is performed at scheduled intervals to detect subclinical rejection and infection.

Chronic lung allograft dysfunction (CLAD) is the major limitation to long-term survival, developing in 50% of recipients by 5 years. It manifests as bronchiolitis obliterans syndrome (BOS — progressive obstructive decline in FEV1) or restrictive allograft syndrome (RAS — restrictive decline with parenchymal opacities). Diagnosis requires serial PFT monitoring with sustained FEV1 decline > 20% from post-transplant baseline. There is no effective treatment for established BOS — prevention through adherence to immunosuppression and early detection through routine PFT surveillance is critical.`,
    riskFactors: [
      "Primary graft dysfunction (PGD) — the leading cause of early mortality post-transplant",
      "Opportunistic infections from lifelong immunosuppression (CMV, Aspergillus, PJP)",
      "Bronchial anastomotic complications: dehiscence, stenosis, malacia",
      "Chronic rejection (BOS/CLAD) developing in 50% of recipients by 5 years",
      "Aspiration risk from denervation-related absent cough reflex below anastomosis",
      "Pulmonary edema from lymphatic disruption in early post-operative period",
      "Medication toxicity from immunosuppressive regimen (renal, metabolic, malignancy risk)",
      "Impaired secretion clearance from denervation and anastomotic site mucociliary disruption"
    ],
    diagnostics: [
      "Serial PFTs (spirometry, lung volumes, DLCO) every 3-6 months for CLAD surveillance",
      "Surveillance bronchoscopy with BAL and transbronchial biopsy per institutional protocol",
      "BAL fluid analysis for infection (bacterial, fungal, viral, PJP) and cellular rejection markers",
      "Chest X-ray and CT for parenchymal assessment, anastomotic evaluation, and infection surveillance",
      "PGD grading by P/F ratio within 72 hours post-transplant",
      "6-minute walk test for functional capacity monitoring",
      "CMV viral load monitoring for asymptomatic viremia preceding clinical disease"
    ],
    management: [
      "Post-operative ventilation: VT 6-8 mL/kg donor IBW, Pplat < 30, FiO2 for SpO2 > 92%, moderate PEEP",
      "Target early extubation within 24-48 hours when clinically appropriate",
      "Aggressive bronchial hygiene: frequent suctioning, chest physiotherapy, early mobilization (absent cough reflex impairs clearance)",
      "Minimize airway pressures to protect bronchial anastomosis healing",
      "Implement CMV, PJP, and fungal prophylaxis per transplant protocol",
      "Monitor PFTs every 3-6 months post-transplant — > 20% sustained FEV1 decline from baseline triggers rejection workup",
      "Teach effective cough techniques and airway clearance strategies for home use (cough reflex is impaired)",
      "Maintain strict infection control — transplant patients are severely immunocompromised"
    ],
    nursingActions: [
      "Perform meticulous bronchial hygiene post-operatively — the denervated lung cannot clear secretions independently",
      "Monitor for signs of PGD: worsening oxygenation, bilateral infiltrates, declining compliance in first 72 hours",
      "Use strict infection control: hand hygiene, masking in patient room during respiratory illness season, visitor screening",
      "Educate patient on lifelong PFT monitoring importance — FEV1 decline is often the FIRST sign of rejection",
      "Teach airway clearance techniques for home use: PEP devices, huff coughing, chest physiotherapy",
      "Monitor immunosuppressant levels and educate on adherence — non-adherence is a major cause of rejection",
      "Assess anastomotic site during bronchoscopy assistance for granulation tissue, stenosis, or dehiscence",
      "Educate on infection avoidance: hand hygiene, avoiding crowds, wearing masks in public during respiratory virus season"
    ],
    signs: [
      "PGD: worsening oxygenation with bilateral infiltrates within 72 hours post-transplant (ARDS-equivalent in transplant lung)",
      "Acute rejection: dyspnea, low-grade fever, declining FEV1, diffuse infiltrates on CXR — requires biopsy confirmation",
      "BOS/CLAD: progressive FEV1 decline > 20% from best post-transplant baseline without other explanation",
      "Anastomotic complication: persistent air leak, focal atelectasis, stridor (stenosis), or fever (dehiscence/infection)",
      "Opportunistic infection: fever, productive cough, new infiltrates in an immunocompromised transplant patient",
      "Successful transplant outcome: stable or improving PFTs, functional independence, low infection frequency"
    ],
    medications: [
      { name: "Tacrolimus", dose: "0.05-0.1 mg/kg/day PO BID (trough-guided dosing)", route: "Oral", purpose: "Calcineurin inhibitor immunosuppressant preventing T-cell mediated acute rejection — lifelong therapy" },
      { name: "Valganciclovir", dose: "900 mg PO daily for prophylaxis, 900 mg PO BID for treatment", route: "Oral", purpose: "CMV prophylaxis for 6-12 months post-transplant or during intensified immunosuppression" },
      { name: "Trimethoprim/Sulfamethoxazole", dose: "SS or DS tablet PO daily or 3x/week", route: "Oral", purpose: "Lifelong PJP prophylaxis in lung transplant recipients" },
      { name: "Inhaled Amphotericin B", dose: "25 mg nebulized 3x/week for 3-6 months", route: "Inhaled", purpose: "Prophylaxis against Aspergillus colonization of the transplanted airway" }
    ],
    pearls: [
      "The transplanted lung has NO cough reflex below the anastomosis — aggressive bronchial hygiene is essential because the patient cannot clear secretions independently",
      "BOS (chronic rejection) develops in 50% of recipients by 5 years and is the #1 cause of long-term mortality — serial PFT monitoring is the only way to detect it early",
      "PGD is the transplant equivalent of ARDS — manage with lung-protective ventilation, minimize airway pressures, and target early extubation",
      "Minimize airway pressures to protect the bronchial anastomosis — the bronchial artery circulation is NOT reestablished and healing depends on retrograde pulmonary artery flow",
      "A > 20% decline in FEV1 from best post-transplant baseline = presumed rejection until proven otherwise — this triggers surveillance bronchoscopy",
      "Transplant patients are immunocompromised for LIFE — every respiratory infection is potentially life-threatening and requires aggressive workup and treatment"
    ],
    quiz: [
      { question: "Why is aggressive bronchial hygiene particularly important after lung transplantation?", options: ["Transplanted lungs produce more mucus", "The cough reflex is absent below the bronchial anastomosis due to denervation", "Immunosuppression thickens secretions", "Standard hygiene is sufficient"], correct: 1, rationale: "Lung transplantation severs the vagal nerve branches to the transplanted lung. The cough reflex below the anastomotic site is absent because sensory feedback from the transplanted airways cannot reach the brain. Patients cannot sense or effectively clear secretions from the transplanted lung, requiring aggressive airway clearance techniques." },
      { question: "What PFT finding triggers a rejection workup in a lung transplant recipient?", options: ["FEV1 decline of 5% from baseline", "FEV1 decline of > 20% from best post-transplant baseline", "Any reduction in DLCO", "FVC decline of 10%"], correct: 1, rationale: "A sustained decline in FEV1 > 20% from the best post-transplant baseline value, without other explanation (infection, native lung hyperinflation in single-lung transplant), is the diagnostic criterion for BOS and triggers surveillance bronchoscopy with BAL and transbronchial biopsy to assess for rejection." },
      { question: "What is primary graft dysfunction (PGD) and when does it occur?", options: ["Chronic rejection occurring years after transplant", "ARDS-equivalent occurring within 72 hours post-transplant", "Surgical complication at the anastomotic site", "Drug reaction to immunosuppression"], correct: 1, rationale: "PGD is the transplant equivalent of ARDS, occurring within 72 hours of lung transplantation. It is graded by P/F ratio (Grade 3: P/F < 200 = severe PGD). PGD is the leading cause of early post-transplant mortality. Management includes lung-protective ventilation, minimizing airway pressures, and supportive care. Severe PGD may require ECMO." }
    ]
  },

  "compliance-resistance-rrt": {
    title: "Compliance and Resistance in Respiratory Mechanics",
    cellular: `Compliance and resistance are the two fundamental mechanical properties governing ventilation. Understanding these concepts is essential for interpreting ventilator data, troubleshooting alarms, optimizing ventilator settings, and managing patients with diverse respiratory pathologies. These topics are heavily tested on the NBRC TMC and CSE examinations.

Compliance (C) measures the distensibility of the lungs and chest wall — it is the change in volume per unit change in pressure: C = ΔV / ΔP, expressed in mL/cmH2O. Normal total respiratory system compliance is 50-100 mL/cmH2O. Compliance has two components: lung compliance (determined by elastic tissue fibers and surface tension) and chest wall compliance (determined by rib cage rigidity, muscle tone, and abdominal contents).

Static compliance (Cst) is measured during a no-flow state (inspiratory hold) and reflects pure elastic properties: Cst = VT / (Pplat - total PEEP). Static compliance eliminates the resistive component because there is no gas flow during the measurement. It reflects parenchymal and chest wall conditions: decreased in ARDS, pulmonary fibrosis, pneumothorax, pleural effusion, abdominal distension, obesity, and chest wall rigidity; increased in emphysema (loss of elastic recoil).

Dynamic compliance (Cdyn) is calculated using peak inspiratory pressure, which includes both elastic and resistive forces: Cdyn = VT / (PIP - total PEEP). Dynamic compliance is always lower than static compliance because PIP includes the pressure needed to overcome airway resistance. The relationship between Cst and Cdyn provides diagnostic information: if Cdyn drops but Cst remains unchanged, the problem is increased RESISTANCE (secretions, bronchospasm, ETT obstruction). If both Cst and Cdyn drop together, the problem is decreased COMPLIANCE (pneumothorax, ARDS, effusion).

The compliance curve (pressure-volume curve) of the lung is sigmoid-shaped with two inflection points. The lower inflection point (LIP) represents the pressure at which significant alveolar recruitment begins — historically used to set PEEP above this point to prevent end-expiratory collapse (atelectrauma). The upper inflection point (UIP) represents the pressure above which further inflation causes overdistention without significant volume gain — the VT should be set to keep end-inspiratory pressure below this point. Modern PEEP titration has moved beyond simple LIP/UIP targeting, but understanding the compliance curve remains essential.

Resistance (R) measures the opposition to airflow through the conducting airways: R = ΔP / Flow = (PIP - Pplat) / Flow, expressed in cmH2O/L/sec. Normal airway resistance is 0.5-2.5 cmH2O/L/sec (slightly higher through ETT). Resistance is governed by Poiseuille's Law for laminar flow: R = 8ηL / πr⁴, where η is gas viscosity, L is airway length, and r is airway radius. Because resistance is inversely proportional to the FOURTH POWER of the radius, even small changes in airway caliber dramatically affect resistance — a 50% reduction in radius increases resistance 16-fold.

Airway resistance is increased in bronchospasm (smooth muscle contraction), secretion accumulation, mucosal edema (inflammation, infection), ETT obstruction (secretions, kinking, biting), and external compression (tumors, goiter). It is decreased by bronchodilators, suctioning, larger ETT, heliox (reduces gas density-dependent turbulent resistance), and humidification (reducing mucus viscosity).

Time constants (τ = compliance × resistance) determine how quickly lung units fill and empty. Long time constants (high compliance + high resistance, as in emphysema) require longer inspiratory and expiratory times. Short time constants (low compliance + normal resistance, as in ARDS) fill and empty rapidly. Heterogeneous time constants (different units filling at different rates) cause uneven ventilation distribution and are a major source of V/Q mismatch.`,
    riskFactors: [
      "Decreased compliance from ARDS, fibrosis, pneumothorax, effusion, or abdominal distension causing high plateau pressures",
      "Increased resistance from bronchospasm, secretions, or ETT obstruction causing high peak pressures",
      "Auto-PEEP from high resistance + inadequate expiratory time causing hemodynamic compromise",
      "Ventilator-induced lung injury from ventilating above the upper inflection point (overdistention) or below the lower inflection point (atelectrauma)",
      "Heterogeneous time constants causing uneven ventilation distribution and V/Q mismatch",
      "Failure to differentiate compliance vs resistance problems leading to inappropriate ventilator adjustments",
      "Small ETT dramatically increasing resistance (resistance ∝ 1/r⁴) — a 6.0 ETT has 2.4× the resistance of a 7.0 ETT"
    ],
    diagnostics: [
      "Static compliance: VT / (Pplat - total PEEP) — measured during inspiratory hold (normal 50-100 mL/cmH2O)",
      "Dynamic compliance: VT / (PIP - total PEEP) — calculated using peak pressure (always lower than Cst)",
      "Airway resistance: (PIP - Pplat) / inspiratory flow — normal 0.5-2.5 cmH2O/L/sec",
      "Inspiratory hold maneuver for Pplat measurement (0.5-second pause at end-inspiration)",
      "Expiratory hold maneuver for auto-PEEP measurement (total PEEP = set PEEP + auto-PEEP)",
      "Pressure-volume loop analysis for compliance curve assessment and PEEP optimization",
      "Flow-volume loop analysis for auto-PEEP detection (expiratory flow not reaching zero)"
    ],
    management: [
      "Differentiate compliance vs resistance problems using PIP and Pplat: PIP high + Pplat high = compliance; PIP high + Pplat normal = resistance",
      "For decreased compliance: address the cause (drain effusion, decompress pneumothorax), optimize PEEP, reduce VT if Pplat > 30",
      "For increased resistance: suction secretions, administer bronchodilator, check ETT for kink/obstruction, consider larger ETT",
      "Set PEEP above the lower inflection point to prevent atelectrauma in patients with recruitable lung",
      "Keep end-inspiratory pressure below the upper inflection point to prevent overdistention",
      "Calculate driving pressure (Pplat - PEEP) — target < 15 cmH2O as the best mortality predictor",
      "Manage auto-PEEP by prolonging expiratory time: decrease RR, decrease VT, shorten inspiratory time",
      "Use heliox to reduce density-dependent resistance in severe upper airway obstruction or refractory bronchospasm"
    ],
    nursingActions: [
      "Measure and document Pplat, PIP, Cst, and Cdyn at minimum every 4 hours and with clinical changes",
      "Calculate and trend driving pressure (Pplat - PEEP) with every Pplat measurement — alert if > 15 cmH2O",
      "Perform inspiratory hold for Pplat and expiratory hold for auto-PEEP at each assessment",
      "When PIP rises: immediately check Pplat to differentiate resistance from compliance problem before intervening",
      "Monitor flow-volume waveform for auto-PEEP: expiratory flow not reaching zero baseline indicates air trapping",
      "Document compliance and resistance trends to track disease progression and treatment response",
      "Correlate compliance changes with clinical events (prone positioning, recruitment maneuver, diuresis) to assess effectiveness"
    ],
    signs: [
      "Decreased compliance: rising Pplat and PIP with unchanged VT, reduced chest wall excursion, stiff lungs on ventilation",
      "Increased resistance: rising PIP with unchanged Pplat, audible wheezing, expiratory flow limitation on waveform",
      "Auto-PEEP: hemodynamic instability during ventilation, expiratory flow not reaching zero, difficulty triggering ventilator",
      "Improving compliance: falling Pplat at same VT after prone positioning, recruitment, or diuresis",
      "Heterogeneous time constants: uneven chest rise, variable waveform morphology breath-to-breath"
    ],
    medications: [
      { name: "Albuterol", dose: "2.5-5 mg nebulized or 4-8 puffs MDI", route: "Inhaled", purpose: "Reduce airway resistance from bronchospasm — reassess PIP-Pplat difference to confirm resistance reduction" },
      { name: "Heliox (Helium-Oxygen)", dose: "70:30 or 80:20 via tight-fitting mask or ventilator", route: "Inhaled", purpose: "Reduce gas density-dependent turbulent flow resistance in severe airway obstruction" },
      { name: "Furosemide", dose: "20-80 mg IV", route: "Intravenous", purpose: "Diuresis to reduce pulmonary edema and improve lung compliance in fluid-overloaded patients" }
    ],
    pearls: [
      "PIP high + Pplat normal = RESISTANCE problem (airways). PIP high + Pplat high = COMPLIANCE problem (lungs). This is THE most important ventilator troubleshooting principle",
      "Resistance is proportional to 1/r⁴ — reducing ETT from 8.0 to 7.0 mm increases resistance by 1.7×; from 8.0 to 6.0 mm by 3.2×",
      "Driving pressure (Pplat - PEEP) < 15 cmH2O is the strongest ventilator variable associated with ARDS survival — track it obsessively",
      "Auto-PEEP is measured ONLY during expiratory hold — it is invisible to the ventilator during normal cycling",
      "Static compliance improves with recruitment (PEEP, prone positioning) and worsens with overdistention — use compliance to guide PEEP titration",
      "Time constant = compliance × resistance. Emphysema has long time constants (needs long expiratory time). ARDS has short time constants (fills and empties quickly)."
    ],
    quiz: [
      { question: "A ventilated patient has PIP 42, Pplat 20, PEEP 5, VT 500 mL. What are the static compliance and resistance?", options: ["Cst = 33 mL/cmH2O, high resistance", "Cst = 12 mL/cmH2O, normal resistance", "Cst = 33 mL/cmH2O, normal resistance", "Cst = 100 mL/cmH2O, high resistance"], correct: 0, rationale: "Cst = VT / (Pplat - PEEP) = 500 / (20-5) = 500/15 = 33.3 mL/cmH2O (decreased, normal 50-100). The PIP-Pplat difference = 42-20 = 22 cmH2O, which is high (normal < 10 at standard flow), indicating increased airway resistance. This patient has BOTH decreased compliance AND increased resistance — investigate for dual pathology." },
      { question: "Poiseuille's Law states that airway resistance is inversely proportional to the radius to the fourth power. If airway radius is reduced by 50%, resistance increases by what factor?", options: ["2-fold", "4-fold", "8-fold", "16-fold"], correct: 3, rationale: "Resistance ∝ 1/r⁴. If radius is halved (r → r/2): R ∝ 1/(r/2)⁴ = 1/(r⁴/16) = 16/r⁴. Resistance increases 16-fold. This explains why even mild bronchospasm or mucosal edema can dramatically increase work of breathing and why children with small airways are so vulnerable to airway narrowing." },
      { question: "A patient's dynamic compliance is 25 mL/cmH2O and static compliance is 45 mL/cmH2O. What does this difference indicate?", options: ["Normal finding — Cdyn is always lower than Cst", "Significant airway resistance contribution to the PIP", "Decreased lung compliance from parenchymal disease", "Equipment malfunction"], correct: 1, rationale: "Cdyn uses PIP (includes resistive and elastic forces) while Cst uses Pplat (elastic forces only). When Cdyn is significantly lower than Cst, the difference is accounted for by airway resistance. A large Cdyn-Cst gap indicates significant resistance (secretions, bronchospasm, ETT obstruction). If Cst were also low, there would additionally be a compliance problem." }
    ]
  },

  "ventilation-calculations-rrt": {
    title: "Ventilation Calculations: VT, PEEP, FiO2, and Minute Ventilation",
    cellular: `Ventilation calculations are fundamental skills for respiratory therapists, tested extensively on board examinations and applied constantly in clinical practice. Mastering these calculations enables accurate ventilator setup, goal-directed ventilator management, and precise adjustments for changing clinical conditions.

Ideal Body Weight (IBW) is the essential first calculation for ventilator management because tidal volume is always based on IBW, not actual weight. Male IBW (kg) = 50 + 2.3 × (height in inches - 60). Female IBW (kg) = 45.5 + 2.3 × (height in inches - 60). For metric: Male IBW = 50 + 0.91 × (height in cm - 152.4). Female IBW = 45.5 + 0.91 × (height in cm - 152.4). A 6'0" male has IBW = 50 + 2.3(72-60) = 77.6 kg. A 5'4" female has IBW = 45.5 + 2.3(64-60) = 54.7 kg.

Tidal Volume (VT) targets: lung-protective ventilation = 6-8 mL/kg IBW (ARDS: target 6 mL/kg, general: 6-8 mL/kg). Example: 5'10" male IBW = 50 + 2.3(70-60) = 73 kg. VT at 6 mL/kg = 438 mL. VT at 8 mL/kg = 584 mL. Target range: 438-584 mL.

Minute Ventilation (VE) = VT × RR. Normal VE is 5-10 L/min. VE determines PaCO2 — increasing VE lowers PaCO2, decreasing VE raises PaCO2. To calculate the new RR needed to achieve a target PaCO2: new RR = (current VE × current PaCO2) / (VT × target PaCO2). Alternatively: new VE = current VE × (current PaCO2 / target PaCO2). Example: Patient has VT 500, RR 14 (VE = 7.0 L), PaCO2 55 mmHg. Target PaCO2 40 mmHg. New VE = 7.0 × (55/40) = 9.625 L/min. At VT 500: new RR = 9625/500 = 19.3 → set RR 20.

Alveolar Ventilation (VA) = (VT - VD) × RR, where VD is dead space volume. Anatomic dead space is approximately 1 mL/lb of IBW or approximately 150 mL for an average adult. Alveolar ventilation is the portion of minute ventilation that participates in gas exchange — increasing dead space reduces effective alveolar ventilation at the same minute ventilation.

FiO2 adjustments follow several clinical rules. The estimated FiO2-PaO2 relationship: every 10% increase in FiO2 should raise PaO2 by approximately 50 mmHg (this is a rough estimate that only works when shunt is minimal). More precisely, the target FiO2 can be estimated: desired FiO2 = (desired PaO2 / current PaO2) × current FiO2. Example: Patient on FiO2 0.40 has PaO2 55 mmHg. Target PaO2 80. Desired FiO2 = (80/55) × 0.40 = 0.58 → set FiO2 0.60.

P/F Ratio (PaO2/FiO2) standardizes oxygenation assessment independent of FiO2: normal > 400, ALI < 300, ARDS mild 200-300, ARDS moderate 100-200, ARDS severe < 100. Example: PaO2 85 on FiO2 0.60 → P/F = 85/0.60 = 142 = moderate ARDS.

Alveolar Gas Equation: PAO2 = FiO2 × (Pb - PH2O) - (PaCO2 / RQ). At sea level: PAO2 = FiO2 × (760 - 47) - (PaCO2 / 0.8) = FiO2 × 713 - (PaCO2 × 1.25). Example on room air: PAO2 = 0.21 × 713 - (40/0.8) = 149.7 - 50 = 99.7 mmHg.

A-a Gradient: PAO2 - PaO2. Normal = (age/4) + 4 or approximately 5-15 mmHg. Widened A-a gradient indicates intrapulmonary pathology (V/Q mismatch, shunt, diffusion impairment). Normal A-a gradient with hypoxemia = hypoventilation.

Oxygen Content (CaO2): CaO2 = (1.34 × Hb × SaO2) + (0.003 × PaO2). Normal: approximately 20 mL O2/dL. Example: Hb 12, SaO2 0.96, PaO2 80: CaO2 = (1.34 × 12 × 0.96) + (0.003 × 80) = 15.44 + 0.24 = 15.68 mL O2/dL.

PEEP management calculations: driving pressure = Pplat - PEEP (target < 15). Static compliance at different PEEP levels to identify "best PEEP": set incremental PEEP levels, measure Cst at each, and the PEEP with highest Cst indicates optimal recruitment without overdistention.`,
    riskFactors: [
      "Using actual body weight instead of IBW for VT calculation — most common and most dangerous ventilator calculation error",
      "Mathematical errors in VE calculation leading to inappropriate RR settings and CO2 derangement",
      "Failure to recalculate settings when clinical conditions change (worsening ARDS, improving compliance)",
      "Over-reliance on estimated FiO2-PaO2 relationships that are inaccurate in the presence of significant shunt",
      "Not accounting for dead space changes when calculating alveolar ventilation requirements",
      "Failure to correct A-a gradient calculation for the patient's age leading to false-normal interpretation",
      "Using P/F ratio calculated on PEEP < 5 cmH2O for ARDS staging (requires PEEP ≥ 5)"
    ],
    diagnostics: [
      "IBW calculation from measured height for every ventilated patient",
      "Minute ventilation measurement from ventilator display (VT × total RR including spontaneous breaths)",
      "P/F ratio calculation with every ABG (requires documenting FiO2 at time of draw)",
      "A-a gradient calculation to differentiate intrapulmonary from extrapulmonary hypoxemia",
      "CaO2 calculation to assess true oxygen carrying capacity (especially important in anemia)",
      "Driving pressure calculation (Pplat - PEEP) with every Pplat measurement",
      "Dead space fraction calculation via Bohr equation: VD/VT = (PaCO2 - PECO2) / PaCO2"
    ],
    management: [
      "Calculate IBW from measured height and post target VT range at bedside for every ventilated patient",
      "Adjust RR using VE equation to achieve target PaCO2: new RR = current VE × (current PaCO2 / target PaCO2) / VT",
      "Use P/F ratio for ARDS severity staging: < 300 mild, < 200 moderate, < 100 severe (on PEEP ≥ 5)",
      "Calculate A-a gradient with every room air ABG to differentiate intrapulmonary vs extrapulmonary hypoxemia",
      "Calculate CaO2 in anemic patients to assess true oxygen delivery capacity — normal PaO2/SpO2 may mask dangerously low CaO2",
      "Calculate driving pressure (Pplat - PEEP) and target < 15 cmH2O as the most important ventilator parameter",
      "Use compliance-guided PEEP titration: increase PEEP in steps, calculate Cst at each level, select PEEP with best Cst",
      "Estimate FiO2 adjustments: desired FiO2 = (desired PaO2 / current PaO2) × current FiO2 — verify with ABG 20-30 min after change"
    ],
    nursingActions: [
      "Measure patient height accurately (or obtain from records) and calculate IBW — this is step ONE before setting any ventilator",
      "Calculate and document P/F ratio, A-a gradient, and driving pressure with every ABG",
      "Use the VE equation when recommending RR changes: (current VE × current PaCO2) / target PaCO2 = target VE",
      "Verify FiO2 changes with ABG at 20-30 minutes — estimated calculations are approximations that need confirmation",
      "Calculate CaO2 for all patients with hemoglobin < 10 g/dL — SpO2 and PaO2 can be misleadingly normal despite low O2 content",
      "Document all calculations clearly in RT progress notes with formulas, values used, and results",
      "Post the IBW, target VT range, and current driving pressure at the patient's bedside for all team members"
    ],
    signs: [
      "Correct VT setting: appropriate Pplat (< 30), driving pressure (< 15), and ABG within acceptable range",
      "Excessive VT: high Pplat, high driving pressure, respiratory alkalosis (low PaCO2)",
      "Inadequate VT: rising PaCO2, respiratory acidosis, patient distress and tachypnea",
      "Appropriate FiO2: SpO2 within target range, P/F ratio trending appropriately",
      "Excessive FiO2: SpO2 consistently > 98% on FiO2 > 0.40 without clinical indication — wean down",
      "Optimal PEEP: best static compliance at current PEEP level, acceptable driving pressure and oxygenation"
    ],
    medications: [],
    pearls: [
      "IBW is ALWAYS calculated from HEIGHT, never from actual weight — this is the most important and most frequently tested ventilator concept",
      "Driving pressure < 15 cmH2O is the STRONGEST predictor of ARDS survival — calculate it with every Pplat measurement",
      "P/F ratio instantly tells you severity: > 400 normal, < 300 mild ARDS, < 200 moderate, < 100 severe — calculate it with every ABG",
      "The VE equation for PaCO2 adjustment: new VE = old VE × (old PaCO2 / desired PaCO2) — inversely proportional relationship",
      "CaO2 formula: (1.34 × Hb × SaO2) + (0.003 × PaO2) — the dissolved O2 component (0.003 × PaO2) is negligible and can be ignored for quick calculations",
      "A-a gradient normal value increases with age: (age/4) + 4 — a 70-year-old has a normal A-a gradient up to approximately 22 mmHg"
    ],
    quiz: [
      { question: "A 5'8\" female with ARDS weighs 95 kg. What is her IBW and target VT at 6 mL/kg?", options: ["IBW 95 kg, VT 570 mL", "IBW 64 kg, VT 384 mL", "IBW 77 kg, VT 462 mL", "IBW 54 kg, VT 324 mL"], correct: 1, rationale: "Female IBW = 45.5 + 2.3(height in inches - 60) = 45.5 + 2.3(68-60) = 45.5 + 18.4 = 63.9 kg ≈ 64 kg. VT at 6 mL/kg IBW = 64 × 6 = 384 mL. Never use actual weight of 95 kg — the lungs are sized by height, not body mass." },
      { question: "A patient has VT 500 mL, RR 14 (VE = 7.0 L/min), PaCO2 60 mmHg. What RR is needed to achieve PaCO2 40?", options: ["16", "18", "21", "24"], correct: 2, rationale: "New VE = current VE × (current PaCO2 / target PaCO2) = 7.0 × (60/40) = 7.0 × 1.5 = 10.5 L/min. New RR = new VE / VT = 10500 / 500 = 21 breaths/min. This inverse relationship means to halve PaCO2, you must double the minute ventilation (assuming constant dead space fraction)." },
      { question: "ABG on room air: PaO2 60, PaCO2 40. What is the A-a gradient? (Age 40, sea level)", options: ["A-a gradient 40 mmHg — widened", "A-a gradient 10 mmHg — normal", "A-a gradient 100 mmHg — widened", "Cannot calculate without FiO2"], correct: 0, rationale: "PAO2 = FiO2 × (760 - 47) - (PaCO2/0.8) = 0.21 × 713 - (40/0.8) = 149.7 - 50 = 99.7 mmHg. A-a gradient = PAO2 - PaO2 = 99.7 - 60 = 39.7 ≈ 40 mmHg. Normal for age 40 = (40/4) + 4 = 14 mmHg. A-a gradient of 40 is widened, indicating intrapulmonary pathology (V/Q mismatch, shunt, or diffusion impairment)." }
    ]
  }
};
