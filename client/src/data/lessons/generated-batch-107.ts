import type { LessonContent } from "./types";

export const generatedBatch107Lessons: Record<string, LessonContent> = {


  "septic-shock-management": {
    title: "Septic Shock Management",
    cellular: {
      title: "Pathophysiology of Septic Shock",
      content: "Septic shock is defined as sepsis with persisting hypotension requiring vasopressors to maintain MAP ≥65 mmHg and serum lactate >2 mmol/L despite adequate volume resuscitation. It represents the most severe manifestation of the body's dysregulated response to infection, carrying a mortality rate of 40-60%.\n\nThe pathophysiology begins when pathogen-associated molecular patterns (PAMPs) such as lipopolysaccharide (gram-negative) or lipoteichoic acid (gram-positive) activate innate immune cells via toll-like receptors. This triggers a massive release of pro-inflammatory cytokines including TNF-alpha, IL-1, and IL-6. These cytokines activate the complement cascade, coagulation pathways, and induce widespread endothelial dysfunction. Nitric oxide synthase is upregulated, producing excessive nitric oxide that causes profound vasodilation and refractory hypotension.\n\nEndothelial injury increases capillary permeability, causing third-spacing of fluid into the interstitium. This leads to intravascular hypovolemia despite total body fluid overload. The glycocalyx layer lining the endothelium is degraded, further worsening vascular leak. Simultaneously, the coagulation cascade is activated with widespread microthrombi formation (disseminated intravascular coagulation), consuming clotting factors and platelets while paradoxically causing microvascular thrombosis that impairs organ perfusion.\n\nAt the mitochondrial level, cytopathic hypoxia occurs: even when oxygen delivery is restored, mitochondria become unable to utilize oxygen effectively due to direct mitochondrial damage by inflammatory mediators and reactive oxygen species. This explains why patients may die of multiorgan failure despite adequate oxygen delivery parameters. Myocardial depression also occurs in approximately 50% of septic shock patients, mediated by circulating myocardial depressant factors."
    },
    riskFactors: [
      "Extremes of age (neonates, elderly >65 years)",
      "Immunosuppression (chemotherapy, organ transplant, HIV/AIDS, chronic steroids)",
      "Indwelling devices (central lines, urinary catheters, endotracheal tubes)",
      "Chronic comorbidities (diabetes, chronic kidney disease, liver cirrhosis)",
      "Recent surgery or invasive procedures",
      "Malnutrition and poor wound healing"
    ],
    diagnostics: [
      "Blood cultures (at least 2 sets from different sites BEFORE antibiotics)",
      "Serum lactate level (>2 mmol/L indicates tissue hypoperfusion)",
      "Procalcitonin (PCT) elevation supports bacterial infection",
      "Complete blood count showing leukocytosis or leukopenia, thrombocytopenia",
      "Comprehensive metabolic panel: elevated creatinine (AKI), elevated bilirubin (liver dysfunction)",
      "Coagulation studies: elevated INR, decreased fibrinogen if DIC develops"
    ],
    management: [
      "Hour-1 Bundle: obtain cultures, administer broad-spectrum antibiotics, begin 30 mL/kg crystalloid bolus, measure lactate",
      "Norepinephrine as first-line vasopressor to target MAP ≥65 mmHg",
      "Add vasopressin (0.03 units/min) as second-line agent if norepinephrine inadequate",
      "Source control: drain abscesses, remove infected devices, debride necrotic tissue",
      "Hydrocortisone 200 mg/day IV if shock refractory to vasopressors and fluids",
      "Reassess volume status using dynamic measures (passive leg raise, pulse pressure variation)"
    ],
    nursingActions: [
      "Obtain blood cultures from two separate sites BEFORE initiating antibiotics",
      "Administer antibiotics within 1 hour of sepsis recognition (every hour delay increases mortality 7-8%)",
      "Infuse 30 mL/kg isotonic crystalloid within first 3 hours; reassess after each bolus",
      "Monitor and trend serial lactate levels every 2-4 hours to guide resuscitation",
      "Maintain strict I&O monitoring; insert Foley catheter for accurate urine output",
      "Assess end-organ perfusion: mental status changes, mottled skin, capillary refill >3 seconds"
    ],
    signs: {
      left: [
        "Hypotension (MAP <65 mmHg despite fluids)",
        "Tachycardia (HR >100 bpm)",
        "Warm, flushed skin (early/warm shock)",
        "Fever >38.3°C or hypothermia <36°C",
        "Altered mental status or confusion"
      ],
      right: [
        "Tachypnea (RR >22 breaths/min)",
        "Elevated lactate (>2 mmol/L)",
        "Oliguria despite fluid resuscitation",
        "Cool, mottled extremities (late/cold shock)",
        "Bounding pulses (early) progressing to weak pulses (late)",
        "Widened pulse pressure (early) narrowing (late)"
      ]
    },
    medications: [
      { name: "Norepinephrine", type: "Vasopressor (alpha-1 predominant, beta-1)", action: "Potent alpha-1 vasoconstriction increases SVR and MAP; mild beta-1 effect supports cardiac output", sideEffects: "Peripheral ischemia, arrhythmias, tissue necrosis with extravasation, acute kidney injury", contra: "Uncorrected hypovolemia (relative); mesenteric ischemia", pearl: "First-line vasopressor in septic shock per Surviving Sepsis Campaign; start at 0.1-0.5 mcg/kg/min and titrate to MAP ≥65 mmHg" },
      { name: "Vasopressin", type: "Non-catecholamine vasopressor (V1 receptor agonist)", action: "Acts on V1 receptors on vascular smooth muscle causing vasoconstriction independent of catecholamine receptors", sideEffects: "Digital ischemia, mesenteric ischemia, hyponatremia, cardiac ischemia", contra: "Responsive hypotension (not indicated as first-line)", pearl: "Used at fixed dose of 0.03-0.04 units/min; added to norepinephrine to reduce catecholamine requirements; do NOT titrate" }
    ],
    pearls: [
      "The SEP-1 bundle requires lactate measurement, blood cultures, broad-spectrum antibiotics, and 30 mL/kg crystalloid ALL within 1 hour",
      "Septic shock has a UNIQUE hemodynamic profile: LOW SVR, HIGH cardiac output (early), LOW PCWP",
      "Lactate clearance >10% in 6 hours is associated with improved outcomes",
      "Source control is as important as antibiotics - always identify and address the infection source",
      "Early septic shock is 'warm shock' (vasodilated); late/decompensated septic shock becomes 'cold shock' (vasoconstricted)"
    ],
    quiz: [
      { question: "A patient with suspected sepsis has a lactate of 4.2 mmol/L and BP 78/42 mmHg after 2L of normal saline. What is the nurse's priority action?", options: ["Administer another 1L normal saline bolus", "Initiate norepinephrine infusion per protocol", "Obtain additional blood cultures", "Request an infectious disease consultation"], correct: 1, rationale: "With persistent hypotension despite adequate fluid resuscitation (30 mL/kg), vasopressor therapy (norepinephrine) should be initiated to achieve MAP ≥65 mmHg. Further fluid boluses without vasopressors will delay achieving target perfusion pressure." },
      { question: "Which action must occur BEFORE initiating antibiotic therapy in a patient with suspected sepsis?", options: ["CT scan to identify infection source", "Blood cultures obtained from two separate sites", "Central line placement for vasopressor access", "Procalcitonin level resulted"], correct: 1, rationale: "Blood cultures must be obtained before antibiotics to maximize the chance of identifying the causative organism. However, obtaining cultures should not significantly delay antibiotic administration - both should ideally occur within the first hour." }
    ]
  },

  "acute-respiratory-failure": {
    title: "Acute Respiratory Failure",
    cellular: {
      title: "Pathophysiology of Acute Respiratory Failure",
      content: "Acute respiratory failure occurs when the respiratory system fails to maintain adequate gas exchange, resulting in hypoxemia (PaO2 <60 mmHg) and/or hypercapnia (PaCO2 >50 mmHg with pH <7.35). It is classified into two types: Type I (hypoxemic) and Type II (hypercapnic/ventilatory), though mixed presentations are common.\n\nType I respiratory failure is caused by ventilation-perfusion (V/Q) mismatch, intrapulmonary shunting, or diffusion impairment. In conditions like ARDS, pneumonia, or pulmonary edema, alveoli are flooded with fluid, inflammatory exudate, or collapsed (atelectasis). Blood perfuses these non-ventilated alveoli but receives no oxygen, creating a right-to-left intrapulmonary shunt. The hallmark is hypoxemia that is refractory to supplemental oxygen (shunt physiology), because oxygen cannot reach the blood flowing past non-functional alveoli.\n\nType II respiratory failure results from inadequate alveolar ventilation. The respiratory pump (diaphragm, chest wall muscles, neural drive) fails to generate sufficient minute ventilation to eliminate CO2. Causes include neuromuscular diseases (myasthenia gravis, Guillain-Barré), CNS depression (opioid overdose, brainstem stroke), severe COPD exacerbation, and chest wall deformities. Rising PaCO2 leads to respiratory acidosis, and because alveolar ventilation is reduced, PaO2 also falls.\n\nAt the cellular level, hypoxemia triggers a cascade of injury. Cells shift to anaerobic glycolysis, producing only 2 ATP per glucose molecule instead of 36-38. Lactic acid accumulates, lowering intracellular pH. The sodium-potassium ATPase pump fails, leading to cellular swelling and loss of membrane integrity. Brain cells are particularly vulnerable; neuronal dysfunction manifests as confusion, agitation, and eventually obtundation within minutes of severe hypoxemia. Hypercapnia causes cerebral vasodilation, increased intracranial pressure, and narcosis at extremely elevated levels."
    },
    riskFactors: [
      "COPD or severe asthma exacerbation",
      "Pneumonia (community-acquired, ventilator-associated, aspiration)",
      "Opioid or sedative overdose causing CNS respiratory depression",
      "Neuromuscular disease (myasthenia gravis, Guillain-Barré, ALS)",
      "Acute respiratory distress syndrome (ARDS) triggers: sepsis, aspiration, trauma",
      "Obesity hypoventilation syndrome"
    ],
    diagnostics: [
      "Arterial blood gas (ABG): PaO2 <60 mmHg (Type I), PaCO2 >50 mmHg with acidosis (Type II)",
      "P/F ratio (PaO2/FiO2): <300 indicates acute lung injury, <200 indicates ARDS",
      "Chest X-ray: bilateral infiltrates (ARDS), lobar consolidation (pneumonia), hyperinflation (COPD)",
      "Pulse oximetry trending downward despite increasing supplemental O2",
      "Pulmonary function tests: reduced FEV1/FVC in obstructive disease",
      "CT chest for detailed parenchymal assessment when indicated"
    ],
    management: [
      "Supplemental oxygen titrated to SpO2 92-96% (88-92% in COPD with chronic CO2 retention)",
      "Non-invasive ventilation (BiPAP/CPAP) for COPD exacerbation and cardiogenic pulmonary edema",
      "Endotracheal intubation and mechanical ventilation for severe or worsening respiratory failure",
      "ARDS management: lung-protective ventilation (tidal volume 6 mL/kg ideal body weight, plateau pressure <30 cmH2O)",
      "Prone positioning for 16+ hours/day in moderate-severe ARDS (P/F <150)",
      "Treat underlying cause: antibiotics for pneumonia, naloxone for opioid overdose, bronchodilators for COPD"
    ],
    nursingActions: [
      "Continuous pulse oximetry and assess respiratory rate, depth, and pattern every 15 minutes",
      "Position patient upright (high Fowler's) to optimize diaphragmatic excursion",
      "Monitor ABG results and report worsening PaO2, rising PaCO2, or falling pH immediately",
      "Ensure intubation equipment is at bedside (rapid sequence intubation kit ready)",
      "Assess for signs of respiratory muscle fatigue: accessory muscle use, paradoxical breathing",
      "Suction airway as needed; encourage coughing and deep breathing if patient is alert"
    ],
    signs: {
      left: [
        "Tachypnea (RR >24 breaths/min)",
        "SpO2 <90% on room air",
        "Accessory muscle use (sternocleidomastoid, intercostals)",
        "Nasal flaring",
        "Diaphoresis"
      ],
      right: [
        "Cyanosis (central: lips, tongue)",
        "Altered mental status (restlessness → lethargy)",
        "Paradoxical abdominal breathing (diaphragm fatigue)",
        "Inability to speak in full sentences",
        "Tripod positioning",
        "Declining ABG values despite increasing O2 support"
      ]
    },
    medications: [
      { name: "Albuterol", type: "Short-acting beta-2 agonist bronchodilator", action: "Relaxes bronchial smooth muscle via beta-2 receptor stimulation, increasing airway diameter and airflow", sideEffects: "Tachycardia, tremor, hypokalemia, palpitations, nervousness", contra: "Known hypersensitivity; use cautiously in severe cardiovascular disease", pearl: "In acute respiratory failure from bronchospasm, administer via nebulizer continuously (10-15 mg/hr) rather than intermittent dosing" },
      { name: "Naloxone", type: "Opioid antagonist", action: "Competitively binds to opioid receptors, rapidly reversing respiratory depression caused by opioid overdose", sideEffects: "Acute opioid withdrawal (agitation, vomiting, diaphoresis, tachycardia), pulmonary edema (rare)", contra: "Known hypersensitivity; use cautiously in opioid-dependent patients (titrate slowly)", pearl: "Duration of naloxone (30-90 min) is shorter than most opioids; re-dosing or continuous infusion may be needed to prevent re-narcotization" }
    ],
    pearls: [
      "Type I (hypoxemic) failure responds to supplemental O2 unless shunt physiology is present",
      "Type II (hypercapnic) failure requires ventilatory support - oxygen alone will not fix hypercarbia",
      "In COPD patients, excessive O2 can worsen hypercapnia by suppressing hypoxic drive and worsening V/Q mismatch",
      "The P/F ratio is calculated by dividing PaO2 by FiO2 (as a decimal): normal is >400, ARDS is <200",
      "Paradoxical breathing (abdomen moves inward during inspiration) is a late sign of imminent respiratory arrest"
    ],
    quiz: [
      { question: "A COPD patient presents with ABG values: pH 7.28, PaCO2 68 mmHg, PaO2 52 mmHg, HCO3 32 mEq/L. Which type of respiratory failure is this?", options: ["Type I (hypoxemic) only", "Type II (hypercapnic) with chronic compensation", "Mixed Type I and Type II respiratory failure", "Metabolic acidosis with respiratory compensation"], correct: 2, rationale: "This patient has both hypoxemia (PaO2 52) and hypercapnia (PaCO2 68) with acidosis (pH 7.28), indicating mixed Type I and Type II failure. The elevated HCO3 (32) suggests chronic CO2 retention with acute-on-chronic decompensation." },
      { question: "A patient with ARDS has a PaO2 of 58 mmHg on FiO2 0.80. What is the P/F ratio and what does it indicate?", options: ["72.5 - severe ARDS", "116 - moderate ARDS", "145 - moderate ARDS", "290 - mild ARDS"], correct: 0, rationale: "P/F ratio = PaO2/FiO2 = 58/0.80 = 72.5. This is severe ARDS (P/F <100). The Berlin criteria classify ARDS severity: mild (200-300), moderate (100-200), severe (<100)." }
    ]
  },

  "mechanical-ventilation-basics": {
    title: "Mechanical Ventilation Basics",
    cellular: {
      title: "Physiology of Mechanical Ventilation",
      content: "Mechanical ventilation is a life-sustaining intervention that replaces or augments the patient's own respiratory effort by delivering positive-pressure breaths. Understanding the physics and physiology behind mechanical ventilation is essential for safe nursing management of ventilated patients.\n\nNormal spontaneous breathing is driven by negative pressure: the diaphragm contracts and descends, creating negative intrapleural pressure that draws air into the lungs. Mechanical ventilation reverses this by pushing air into the lungs with positive pressure. This fundamental difference has important hemodynamic consequences: positive intrathoracic pressure decreases venous return to the right heart, potentially reducing cardiac output and blood pressure, especially in hypovolemic patients.\n\nThe ventilator delivers breaths based on set parameters. Tidal volume (Vt) determines how much air is delivered per breath (typically 6-8 mL/kg ideal body weight). Respiratory rate (RR) determines how many breaths per minute. FiO2 (fraction of inspired oxygen) controls the oxygen concentration (21-100%). PEEP (positive end-expiratory pressure) maintains a baseline positive pressure at end-expiration to prevent alveolar collapse and improve oxygenation by recruiting atelectatic alveoli.\n\nVentilator modes determine how breaths are initiated and delivered. In Assist-Control (AC) mode, the ventilator delivers a set number of mandatory breaths but also assists patient-triggered breaths. In Synchronized Intermittent Mandatory Ventilation (SIMV), the ventilator delivers mandatory breaths synchronized with patient effort, but spontaneous breaths between mandatory breaths receive no additional volume support (unless pressure support is added). Pressure Support Ventilation (PSV) provides pressure assistance only when the patient initiates a breath, making it a purely spontaneous mode used during weaning. Understanding the interaction between patient effort and ventilator delivery is crucial for preventing patient-ventilator dyssynchrony."
    },
    riskFactors: [
      "Prolonged intubation (>48 hours increases VAP risk)",
      "High FiO2 (>0.60 for prolonged periods causes oxygen toxicity)",
      "High tidal volumes (>8 mL/kg IBW causes ventilator-induced lung injury)",
      "Inadequate PEEP (leads to cyclic atelectasis and atelectrauma)",
      "Excessive PEEP (decreases venous return, causes barotrauma)",
      "Immobility and sedation (deconditioning, ICU-acquired weakness)"
    ],
    diagnostics: [
      "Arterial blood gas (ABG) to assess ventilation (PaCO2) and oxygenation (PaO2)",
      "Peak inspiratory pressure (PIP) and plateau pressure (Pplat) monitoring",
      "Chest X-ray to confirm ETT placement (2-4 cm above carina) and assess lung status",
      "End-tidal CO2 (EtCO2) monitoring for continuous ventilation assessment",
      "Spontaneous breathing trial (SBT) parameters for weaning readiness",
      "Rapid shallow breathing index (RSBI = RR/Vt): <105 predicts successful extubation"
    ],
    management: [
      "Lung-protective ventilation: Vt 6-8 mL/kg IBW, Pplat <30 cmH2O",
      "Titrate FiO2 to maintain SpO2 92-96% (88-92% in COPD)",
      "PEEP titration to optimize oxygenation while minimizing hemodynamic compromise",
      "Daily sedation interruption (spontaneous awakening trial) paired with spontaneous breathing trial",
      "Head of bed elevation ≥30 degrees to prevent ventilator-associated pneumonia",
      "DVT prophylaxis and stress ulcer prophylaxis per ICU protocols"
    ],
    nursingActions: [
      "Verify ventilator settings match ordered parameters at the beginning of every shift",
      "Assess and document ETT position (cm marking at lip line) and cuff pressure (20-30 cmH2O)",
      "Perform oral care with chlorhexidine every 2 hours to reduce VAP risk",
      "Suction only when clinically indicated (not routinely); use closed suction system",
      "Monitor for patient-ventilator dyssynchrony: bucking, air hunger, agitation",
      "Maintain sedation at lightest effective level using RASS or SAS scale"
    ],
    signs: {
      left: [
        "High peak pressures (>40 cmH2O)",
        "Patient-ventilator dyssynchrony (bucking the vent)",
        "Decreasing SpO2 despite adequate FiO2",
        "Auto-PEEP (air trapping) visible on flow waveform"
      ],
      right: [
        "ETT cuff leak (audible, visible on Vt discrepancy)",
        "Subcutaneous emphysema (barotrauma)",
        "Diminished breath sounds unilaterally (ETT migration to right mainstem)",
        "Hemodynamic instability from excessive positive pressure"
      ]
    },
    medications: [
      { name: "Propofol", type: "Sedative-hypnotic (GABA-A agonist)", action: "Provides continuous sedation for ventilated patients by enhancing GABA-A receptor activity in the CNS", sideEffects: "Hypotension, bradycardia, hypertriglyceridemia, propofol infusion syndrome (rare, fatal)", contra: "Egg or soy allergy (relative), propofol infusion syndrome risk with doses >80 mcg/kg/min for >48 hours", pearl: "Check triglyceride levels every 48 hours; propofol infusion syndrome presents with metabolic acidosis, rhabdomyolysis, and cardiac failure" },
      { name: "Cisatracurium", type: "Neuromuscular blocking agent (non-depolarizing)", action: "Blocks acetylcholine at the neuromuscular junction, producing paralysis for ventilator synchrony in severe ARDS", sideEffects: "Prolonged paralysis, ICU-acquired weakness, awareness if inadequately sedated", contra: "Must have adequate sedation and analgesia BEFORE and DURING paralytic use", pearl: "Always ensure sedation is confirmed (BIS monitor <60) before initiating paralysis; 'the patient can feel everything but cannot move or communicate'" }
    ],
    pearls: [
      "The VAP prevention bundle: HOB ≥30°, daily sedation vacation, DVT prophylaxis, peptic ulcer prophylaxis, oral care with chlorhexidine",
      "To improve OXYGENATION: increase FiO2 or PEEP. To improve VENTILATION (lower CO2): increase respiratory rate or tidal volume",
      "Ideal body weight (not actual weight) is used to calculate tidal volume - prevents VILI in obese patients",
      "Plateau pressure reflects alveolar pressure; peak pressure reflects airway resistance + alveolar pressure",
      "A patient 'bucking the vent' may need assessment for pain, anxiety, hypoxia, or secretions BEFORE increasing sedation"
    ],
    quiz: [
      { question: "A ventilated patient's ABG shows PaCO2 55 mmHg and pH 7.30. Which ventilator adjustment will best correct this?", options: ["Increase PEEP from 5 to 10 cmH2O", "Increase FiO2 from 40% to 60%", "Increase respiratory rate from 12 to 16 breaths/min", "Decrease tidal volume from 450 to 350 mL"], correct: 2, rationale: "Elevated PaCO2 (hypercapnia) with respiratory acidosis requires increased minute ventilation. Increasing RR from 12 to 16 will increase minute ventilation and CO2 elimination. PEEP and FiO2 affect oxygenation, not ventilation. Decreasing Vt would worsen hypercapnia." },
      { question: "Which finding indicates the endotracheal tube may have migrated into the right mainstem bronchus?", options: ["Bilateral crackles with pink frothy sputum", "Absent breath sounds on the LEFT with decreased SpO2", "Symmetric chest rise with high peak pressures", "Subcutaneous emphysema in the neck and chest"], correct: 1, rationale: "If the ETT advances too far, it preferentially enters the right mainstem bronchus (due to less acute angle). This causes the left lung to be unventilated, resulting in absent left-sided breath sounds and hypoxemia. Immediate intervention: pull ETT back and confirm placement with chest X-ray." }
    ]
  },

  "ventilator-alarms": {
    title: "Ventilator Alarms & Troubleshooting",
    cellular: {
      title: "Physiology Behind Ventilator Alarms",
      content: "Ventilator alarms are safety mechanisms designed to alert clinicians to potentially life-threatening changes in the patient-ventilator system. Understanding the physiological basis behind each alarm type is essential for rapid assessment and intervention. Every alarm represents a deviation from set parameters and may indicate a patient problem, a circuit problem, or a ventilator malfunction.\n\nHigh-pressure alarms activate when the peak inspiratory pressure (PIP) exceeds the set upper limit (usually 10 cmH2O above baseline). Physiologically, this occurs when resistance to airflow increases or lung compliance decreases. Increased airway resistance can result from bronchospasm (smooth muscle contraction narrowing the airways), mucus plugging (secretions obstructing the ETT or airways), or the patient biting the endotracheal tube. Decreased compliance occurs with pneumothorax (air in the pleural space stiffening the chest wall), pulmonary edema (fluid-filled alveoli requiring more pressure to inflate), ARDS progression, or abdominal distension pushing up on the diaphragm.\n\nLow-pressure alarms indicate a loss of pressure in the ventilator circuit, most commonly from a circuit disconnection or leak. This is an emergency because the patient is no longer receiving mechanical breaths. Air leaks can also occur from an underinflated ETT cuff (air escaping around the tube), a chest tube with a large air leak, or a cracked ventilator circuit connection. The patient's minute ventilation drops precipitously, leading to rapid hypoxemia and hypercapnia.\n\nLow tidal volume or low minute ventilation alarms indicate the patient is not receiving or generating adequate breath volumes. This may indicate a partial circuit leak, patient weakness or fatigue, over-sedation suppressing respiratory drive, or worsening neuromuscular disease. Apnea alarms signal that no breath has been detected within the set apnea interval, indicating complete cessation of breathing - a medical emergency requiring immediate assessment and manual ventilation with a bag-valve-mask while troubleshooting."
    },
    riskFactors: [
      "Excessive secretions or inadequate airway suctioning",
      "Patient agitation or dyssynchrony with the ventilator",
      "Improper circuit connections or equipment malfunction",
      "Changing pulmonary compliance (ARDS progression, pneumothorax)",
      "Inadequate sedation or analgesia causing patient distress",
      "ETT migration or cuff leak"
    ],
    diagnostics: [
      "Review ventilator waveforms (flow, pressure, volume) for clues to alarm cause",
      "Assess peak pressure vs plateau pressure to differentiate airway resistance from compliance issues",
      "Auscultate bilateral breath sounds to identify unilateral or absent ventilation",
      "Check ETT cuff pressure with manometer (target 20-30 cmH2O)",
      "Chest X-ray if pneumothorax, ETT migration, or new infiltrate suspected",
      "ABG to assess impact of alarm event on gas exchange"
    ],
    management: [
      "High-pressure alarm: suction ETT, assess for bronchospasm (administer bronchodilators), check for biting (insert bite block)",
      "Low-pressure alarm: check all circuit connections, assess ETT cuff integrity, reconnect or replace circuit",
      "If unable to troubleshoot quickly: disconnect patient from ventilator and manually bag with 100% O2",
      "Apnea alarm: stimulate patient, assess consciousness, check sedation level, ensure ventilator is functioning",
      "High PEEP alarm: evaluate for auto-PEEP/air trapping, consider adjusting I:E ratio or respiratory rate",
      "Notify respiratory therapy and physician for persistent or unexplained alarms"
    ],
    nursingActions: [
      "NEVER silence an alarm without first assessing the patient",
      "Assess the patient FIRST, then the equipment: Airway, Breathing, Circulation before checking circuit",
      "Keep a manual resuscitation bag (Ambu bag) connected to oxygen at the bedside at ALL times",
      "Document alarm events, interventions, and patient response",
      "Perform systematic circuit check: ETT → circuit tubing → humidifier → ventilator connections",
      "Communicate alarm trends to respiratory therapy and the medical team during rounds"
    ],
    signs: {
      left: [
        "High-pressure alarm: sudden increase in PIP",
        "Patient coughing or biting ETT",
        "Visible secretions in ETT",
        "Decreased chest rise on one side (pneumothorax, mainstem intubation)"
      ],
      right: [
        "Low-pressure alarm: audible air leak",
        "Circuit disconnection visible",
        "Sudden drop in SpO2",
        "Apnea alarm with no visible chest rise",
        "Low exhaled tidal volume on ventilator display"
      ]
    },
    medications: [
      { name: "Albuterol (Inhaled)", type: "Short-acting beta-2 agonist bronchodilator", action: "Relaxes bronchial smooth muscle to relieve bronchospasm causing high-pressure ventilator alarms", sideEffects: "Tachycardia, tremor, hypokalemia, palpitations", contra: "Use with caution in patients with tachyarrhythmias or severe cardiac disease", pearl: "In ventilated patients, use MDI with spacer adapter in the circuit; more efficient drug delivery than nebulizer and does not affect ventilator flow sensors" },
      { name: "Succinylcholine", type: "Depolarizing neuromuscular blocker", action: "Ultra-short-acting paralytic used emergently when patient is severely dyssynchronous and at risk for self-extubation or barotrauma", sideEffects: "Hyperkalemia (fatal in burns, crush injuries, neuromuscular disease), malignant hyperthermia, bradycardia", contra: "Hyperkalemia, burn patients >24 hours post-injury, denervation injuries, malignant hyperthermia history", pearl: "Only use for emergent situations; onset in 30-60 seconds, duration 5-10 minutes; have intubation equipment ready" }
    ],
    pearls: [
      "The universal first response to ANY ventilator alarm: ASSESS THE PATIENT, not the machine",
      "If you cannot identify and fix the alarm cause within 30 seconds, disconnect and bag the patient with 100% FiO2",
      "High PIP with normal Pplat = airway resistance problem (secretions, bronchospasm, kinked tube)",
      "High PIP with high Pplat = compliance problem (pneumothorax, pulmonary edema, ARDS, abdominal distension)",
      "The most dangerous alarm is the one that is silenced without investigation"
    ],
    quiz: [
      { question: "A ventilated patient's high-pressure alarm activates. PIP is 52 cmH2O (baseline 28), and plateau pressure is 30 cmH2O. What is the most likely cause?", options: ["Worsening ARDS", "Tension pneumothorax", "Mucus plug or bronchospasm", "Circuit disconnection"], correct: 2, rationale: "High PIP with normal plateau pressure indicates an airway resistance problem. The pressure is needed to overcome resistance (secretions, bronchospasm, kinked tube) but once air reaches the alveoli, pressure normalizes. ARDS and pneumothorax would elevate BOTH PIP and Pplat (compliance problem)." },
      { question: "A ventilated patient's low-pressure alarm sounds and SpO2 drops from 96% to 82%. What is the nurse's FIRST action?", options: ["Silence the alarm and increase FiO2", "Check the ventilator circuit connections", "Disconnect from ventilator and bag with 100% O2", "Call respiratory therapy"], correct: 2, rationale: "With a rapidly desaturating patient and a low-pressure alarm (likely disconnection or major leak), the immediate priority is to ensure ventilation by disconnecting from the ventilator and manually bagging with 100% O2. This addresses the immediate life threat while you troubleshoot." }
    ]
  },

  "pulmonary-embolism-management": {
    title: "Pulmonary Embolism Management",
    cellular: {
      title: "Pathophysiology of Pulmonary Embolism",
      content: "Pulmonary embolism (PE) occurs when a thrombus, most commonly originating from the deep veins of the lower extremities (DVT), dislodges and travels through the right heart to occlude the pulmonary vasculature. The pathophysiology is governed by Virchow's triad: venous stasis, endothelial injury, and hypercoagulability.\n\nThrombus formation typically begins in the deep veins of the calves, where blood flow is slowest. Venous stasis allows activated clotting factors to accumulate rather than being cleared by hepatic metabolism. The clot propagates proximally into the popliteal and iliofemoral veins. When a portion of the thrombus breaks free (embolizes), it travels through the inferior vena cava and right heart chambers to lodge in the pulmonary arterial system. The hemodynamic consequences depend on the size of the embolus and the patient's cardiopulmonary reserve.\n\nA massive PE occludes >50% of the pulmonary vascular bed, acutely increasing pulmonary vascular resistance (PVR) and right ventricular afterload. The thin-walled right ventricle, designed as a volume pump operating at low pressure, cannot generate sufficient pressure to overcome the obstruction. Right ventricular pressure overload causes RV dilation, which shifts the interventricular septum leftward (ventricular interdependence), compressing the left ventricle and reducing its filling. This decreases left ventricular cardiac output, causing systemic hypotension and shock.\n\nAt the cellular level, the occluded pulmonary vasculature creates dead space ventilation - alveoli that are ventilated but not perfused. Gas exchange is severely impaired. Additionally, platelet aggregation at the clot surface releases vasoactive mediators (serotonin, thromboxane A2) that cause local and potentially diffuse pulmonary vasoconstriction, further worsening PVR. The right ventricle becomes ischemic because coronary perfusion of the RV depends on the pressure gradient between the aorta and RV; when RV pressure rises and aortic pressure falls, RV myocardial oxygen supply drops while demand increases."
    },
    riskFactors: [
      "Recent surgery (especially orthopedic hip/knee replacement)",
      "Prolonged immobility or bedrest (>3 days)",
      "Active malignancy and cancer treatment",
      "Oral contraceptive use or hormone replacement therapy",
      "Obesity (BMI >30)",
      "Prior history of DVT or PE",
      "Inherited thrombophilias (Factor V Leiden, Protein C/S deficiency)"
    ],
    diagnostics: [
      "CT pulmonary angiography (CTPA) - gold standard for diagnosis",
      "D-dimer (highly sensitive but not specific; useful to rule out PE in low-risk patients)",
      "ECG: sinus tachycardia (most common), S1Q3T3, right axis deviation, RBBB (all suggest right heart strain)",
      "Echocardiography: RV dilation, RV hypokinesis, McConnell's sign (RV free wall akinesis with apical sparing)",
      "Troponin and BNP elevation indicate RV strain and myocardial injury",
      "Lower extremity duplex ultrasound to identify DVT source"
    ],
    management: [
      "Anticoagulation: heparin bolus 80 units/kg then 18 units/kg/hr infusion (goal aPTT 60-80 seconds)",
      "Massive PE with hemodynamic instability: systemic thrombolysis with alteplase 100 mg IV over 2 hours",
      "Submassive PE: risk-stratify using troponin, BNP, and RV function to determine thrombolysis candidacy",
      "Surgical embolectomy or catheter-directed therapy for patients with contraindications to thrombolytics",
      "IVC filter placement when anticoagulation is contraindicated or recurrent PE despite anticoagulation",
      "Transition to oral anticoagulation (warfarin, rivaroxaban, or apixaban) for minimum 3 months"
    ],
    nursingActions: [
      "Initiate heparin infusion immediately upon diagnosis; do not delay for therapeutic aPTT",
      "Monitor for signs of hemorrhage: bleeding gums, hematuria, melena, intracranial hemorrhage symptoms",
      "Assess respiratory status frequently: oxygen saturation, respiratory rate, work of breathing",
      "Maintain bedrest during acute phase to prevent further embolization",
      "Monitor aPTT every 6 hours and adjust heparin per protocol",
      "Educate patient on anticoagulation therapy, signs of bleeding, and importance of follow-up"
    ],
    signs: {
      left: [
        "Sudden-onset dyspnea (most common symptom)",
        "Pleuritic chest pain (sharp, worse with inspiration)",
        "Tachypnea (RR >20)",
        "Tachycardia",
        "Hypotension (massive PE)"
      ],
      right: [
        "Hemoptysis",
        "Unilateral leg swelling (concurrent DVT)",
        "Low-grade fever",
        "Syncope or near-syncope",
        "Jugular venous distension",
        "Accentuated P2 heart sound (pulmonary hypertension)"
      ]
    },
    medications: [
      { name: "Heparin (Unfractionated)", type: "Anticoagulant (indirect thrombin inhibitor)", action: "Potentiates antithrombin III to inhibit thrombin (factor IIa) and factor Xa, preventing clot propagation", sideEffects: "Hemorrhage, HIT (heparin-induced thrombocytopenia), osteoporosis with long-term use", contra: "Active uncontrolled bleeding, severe thrombocytopenia, recent CNS surgery", pearl: "Monitor aPTT every 6 hours; therapeutic range is 1.5-2.5x control (60-80 seconds); check platelet count baseline and every 2-3 days for HIT" },
      { name: "Alteplase (tPA)", type: "Thrombolytic (fibrinolytic)", action: "Directly converts plasminogen bound to fibrin into plasmin, which lyses the existing clot in pulmonary arteries", sideEffects: "Major hemorrhage (intracranial bleeding most feared), bleeding at access sites, reperfusion arrhythmias", contra: "Active bleeding, hemorrhagic stroke, recent major surgery (<3 weeks), intracranial neoplasm, aortic dissection", pearl: "For massive PE: 100 mg over 2 hours; for PE during cardiac arrest: 50 mg bolus; hold heparin during tPA infusion" }
    ],
    pearls: [
      "PE should be suspected in ANY patient with sudden dyspnea, especially with DVT risk factors",
      "A normal D-dimer effectively rules out PE in low-probability patients (high negative predictive value)",
      "The most common ECG finding in PE is sinus tachycardia, NOT S1Q3T3",
      "Massive PE = hemodynamic instability; Submassive PE = stable BP with RV dysfunction; Low-risk PE = stable with no RV strain",
      "Heparin does not dissolve existing clots - it prevents clot propagation while the body's fibrinolytic system works"
    ],
    quiz: [
      { question: "A post-operative patient suddenly develops dyspnea, chest pain, SpO2 84%, HR 128, and BP 76/50. CTPA confirms massive bilateral PE. What is the priority intervention?", options: ["Start heparin infusion at 18 units/kg/hr", "Administer alteplase 100 mg IV over 2 hours", "Place an IVC filter", "Increase supplemental oxygen and reposition"], correct: 1, rationale: "Massive PE with hemodynamic instability (hypotension) requires systemic thrombolysis with alteplase. Heparin alone prevents clot propagation but does not lyse the existing clot causing acute obstruction. IVC filters prevent future emboli but do not treat current obstruction." },
      { question: "A nurse is monitoring a patient on heparin therapy for PE. The aPTT result is 120 seconds (therapeutic range 60-80 seconds). What is the appropriate action?", options: ["Continue the infusion at the current rate", "Hold the infusion and notify the provider per protocol", "Administer protamine sulfate immediately", "Increase the infusion rate"], correct: 1, rationale: "An aPTT of 120 seconds is supratherapeutic (goal 60-80), indicating excessive anticoagulation and increased bleeding risk. Per heparin protocol, the infusion should be held and the provider notified for dose adjustment. Protamine is reserved for active hemorrhage." }
    ]
  },

  "massive-hemorrhage-protocol": {
    title: "Massive Hemorrhage Protocol",
    cellular: {
      title: "Pathophysiology of Massive Hemorrhage",
      content: "Massive hemorrhage is defined as the loss of one total blood volume within 24 hours, loss of 50% of blood volume within 3 hours, or ongoing blood loss exceeding 150 mL/min. The adult blood volume is approximately 70 mL/kg (about 5 liters in a 70-kg adult). Massive hemorrhage triggers a cascade of physiological derangements that, if not rapidly corrected, leads to the 'lethal triad' of death: hypothermia, acidosis, and coagulopathy.\n\nWhen significant blood volume is lost, cardiac preload drops precipitously, reducing stroke volume and cardiac output. Baroreceptors in the carotid sinus and aortic arch detect the decreased pressure and trigger sympathetic activation: catecholamine release increases heart rate, myocardial contractility, and peripheral vasoconstriction. Blood is shunted away from non-essential vascular beds (skin, gut, kidneys) to preserve perfusion to the brain and heart. This compensatory mechanism maintains blood pressure initially (compensated shock) but at the cost of tissue ischemia in underperfused organs.\n\nAs hemorrhage continues beyond 30-40% of blood volume (Class III hemorrhage), compensatory mechanisms fail. Hypotension develops, and widespread tissue hypoperfusion forces cells into anaerobic metabolism, producing lactic acid. The resulting metabolic acidosis impairs the function of clotting factors, which are pH-dependent enzymes. Simultaneously, the massive consumption of clotting factors and platelets at the injury site depletes circulating coagulation components, producing a dilutional and consumptive coagulopathy.\n\nHypothermia develops from exposure, infusion of cold fluids and blood products, and impaired thermoregulation from shock. Core temperature below 34°C significantly impairs platelet aggregation and the enzymatic activity of the coagulation cascade. Each element of the lethal triad worsens the others in a self-reinforcing cycle: acidosis and hypothermia worsen coagulopathy, which increases bleeding, which worsens acidosis and hypothermia. Breaking this cycle requires simultaneous correction of all three components through damage control resuscitation."
    },
    riskFactors: [
      "Major trauma (blunt or penetrating)",
      "Gastrointestinal hemorrhage (variceal bleeding, peptic ulcer)",
      "Obstetric hemorrhage (postpartum hemorrhage, placental abruption)",
      "Major surgical procedures (cardiac, hepatic, vascular)",
      "Anticoagulant or antiplatelet therapy",
      "Coagulopathy (hemophilia, DIC, liver failure)"
    ],
    diagnostics: [
      "Serial hemoglobin/hematocrit (note: may not reflect acute blood loss initially due to hemoconcentration)",
      "Coagulation studies: PT/INR, aPTT, fibrinogen level, platelet count",
      "Thromboelastography (TEG) or rotational thromboelastometry (ROTEM) for real-time coagulation assessment",
      "Arterial blood gas with lactate to assess severity of shock and acidosis",
      "Type and crossmatch; activate massive transfusion protocol (MTP)",
      "FAST exam (Focused Assessment with Sonography in Trauma) for intra-abdominal bleeding"
    ],
    management: [
      "Activate Massive Transfusion Protocol (MTP): balanced ratio of 1:1:1 (pRBCs:FFP:platelets)",
      "Damage control resuscitation: permissive hypotension (target SBP 80-90 mmHg until surgical control)",
      "Tranexamic acid (TXA) 1 gram IV within 3 hours of injury onset",
      "Surgical or interventional radiology source control as soon as possible",
      "Warm all IV fluids and blood products; use fluid warmers and forced-air warming blankets",
      "Correct acidosis through volume resuscitation and source control; avoid bicarbonate unless pH <7.1"
    ],
    nursingActions: [
      "Establish two large-bore IVs (14-16 gauge) or intraosseous access if IV access cannot be obtained",
      "Activate MTP per institutional protocol and coordinate blood product delivery from blood bank",
      "Monitor for transfusion reactions: fever, hives, dyspnea, hemoglobinuria",
      "Use rapid infuser devices for high-volume blood product administration",
      "Monitor core temperature continuously; prevent and treat hypothermia aggressively",
      "Document all blood products administered, times, and volumes; maintain strict I&O"
    ],
    signs: {
      left: [
        "Tachycardia (earliest sign of hemorrhage)",
        "Hypotension (SBP <90 mmHg indicates >30% volume loss)",
        "Tachypnea",
        "Narrowed pulse pressure",
        "Cool, clammy, pale skin"
      ],
      right: [
        "Altered mental status (confusion, agitation, lethargy)",
        "Oliguria (<0.5 mL/kg/hr)",
        "Weak, thready peripheral pulses",
        "Delayed capillary refill (>3 seconds)",
        "Hypothermia (core temp <36°C)",
        "Visible or suspected source of bleeding"
      ]
    },
    medications: [
      { name: "Tranexamic Acid (TXA)", type: "Antifibrinolytic", action: "Inhibits plasminogen activation, preventing clot breakdown and reducing blood loss at injury sites", sideEffects: "Nausea, vomiting, diarrhea, thromboembolic events (DVT, PE), seizures (rare, with high doses)", contra: "Active thromboembolic disease, history of seizures (relative), DIC with predominant thrombosis", pearl: "Must be given within 3 hours of injury onset; after 3 hours, TXA may INCREASE mortality (CRASH-2 trial). Dose: 1g IV over 10 minutes, then 1g over 8 hours" },
      { name: "Calcium Gluconate", type: "Electrolyte replacement", action: "Replaces calcium depleted by citrate in transfused blood products; calcium is essential for clotting cascade function", sideEffects: "Bradycardia, hypotension if administered too rapidly, tissue necrosis with extravasation", contra: "Concurrent digoxin use (relative - may precipitate digitalis toxicity)", pearl: "Give 1g calcium gluconate IV for every 4 units of blood products transfused; citrate in stored blood chelates ionized calcium, worsening coagulopathy if uncorrected" }
    ],
    pearls: [
      "The lethal triad of trauma: Hypothermia + Acidosis + Coagulopathy - each worsens the others",
      "Initial hemoglobin may be NORMAL in acute hemorrhage due to hemoconcentration; trending is key",
      "Permissive hypotension (SBP 80-90 mmHg) reduces ongoing bleeding while maintaining minimum perfusion",
      "MTP ratio of 1:1:1 (pRBCs:FFP:platelets) approximates whole blood and reduces dilutional coagulopathy",
      "TXA within 3 hours reduces mortality by 10% in trauma hemorrhage; after 3 hours it may cause harm"
    ],
    quiz: [
      { question: "A trauma patient has received 6 units of packed RBCs in 1 hour. Which electrolyte abnormality should the nurse anticipate and monitor?", options: ["Hyperkalemia and hypocalcemia", "Hyponatremia and hypomagnesemia", "Hypernatremia and hyperphosphatemia", "Hypochloremia and metabolic alkalosis"], correct: 0, rationale: "Stored blood products have elevated potassium (from RBC hemolysis during storage) and contain citrate preservative that chelates ionized calcium. Massive transfusion commonly causes hyperkalemia and hypocalcemia, both of which can cause fatal cardiac arrhythmias." },
      { question: "A bleeding trauma patient arrives 2 hours post-injury. Which medication should be administered as part of the massive hemorrhage protocol?", options: ["Warfarin 5 mg oral", "Aminocaproic acid 5g IV", "Tranexamic acid 1g IV over 10 minutes", "Heparin 5000 units subcutaneous"], correct: 2, rationale: "TXA (tranexamic acid) 1g IV should be given within 3 hours of injury onset per CRASH-2 evidence. Warfarin and heparin are anticoagulants that would worsen bleeding. TXA is the antifibrinolytic agent specifically indicated in hemorrhage protocols." }
    ]
  },

  "rapid-response-activation": {
    title: "Rapid Response Activation",
    cellular: {
      title: "Physiology of Clinical Deterioration",
      content: "Rapid Response Teams (RRTs) were developed based on evidence that clinical deterioration precedes most in-hospital cardiac arrests by 6-8 hours, and that early intervention during this window significantly reduces mortality. The physiological basis for rapid response activation centers on recognizing the body's compensatory mechanisms as they begin to fail.\n\nWhen a patient develops an acute illness or complication, the body initially compensates through homeostatic mechanisms. The sympathetic nervous system increases heart rate and vasoconstriction to maintain blood pressure. The respiratory center increases respiratory rate to maintain gas exchange. The kidneys concentrate urine to preserve volume. These compensatory responses are reflected in vital sign changes that can be detected through systematic monitoring.\n\nThe Modified Early Warning Score (MEWS) and National Early Warning Score (NEWS) systems quantify physiological derangement by assigning points based on deviations in heart rate, respiratory rate, blood pressure, temperature, oxygen saturation, and level of consciousness. As compensatory mechanisms are overwhelmed, vital signs progressively deteriorate. Tachycardia worsens, blood pressure begins to fall, respiratory rate increases further, oxygen saturation drops, and mental status declines from alert to confused to obtunded.\n\nAt the cellular level, progressive clinical deterioration reflects worsening tissue oxygen delivery-consumption mismatch. As cardiac output falls or oxygen content decreases, cells cannot maintain aerobic metabolism. The shift to anaerobic metabolism produces lactate and hydrogen ions, causing metabolic acidosis. Critical organ systems begin to fail in a predictable sequence: the brain (altered consciousness), kidneys (oliguria), and gut (ileus) are early indicators. Without intervention, this progresses to cardiovascular collapse, respiratory failure, and cardiac arrest - which has a significantly worse outcome than early intervention during the deterioration phase."
    },
    riskFactors: [
      "Recent transfer from ICU to general ward",
      "Post-operative patients within first 48 hours",
      "Patients with acute coronary syndromes or recent cardiac procedures",
      "New onset of sepsis or systemic infection",
      "Patients on opioids or sedatives (respiratory depression risk)",
      "Elderly patients with multiple comorbidities",
      "Patients receiving blood transfusions or new medications"
    ],
    diagnostics: [
      "Modified Early Warning Score (MEWS) ≥4 triggers RRT activation",
      "NEWS2 score calculation at every vital sign assessment",
      "Point-of-care lactate to assess tissue perfusion",
      "12-lead ECG if cardiac etiology suspected",
      "Stat ABG for respiratory or metabolic assessment",
      "Bedside glucose check to rule out hypoglycemia"
    ],
    management: [
      "Activate Rapid Response Team when trigger criteria are met - do NOT delay",
      "Perform ABCDE primary assessment while awaiting team arrival",
      "Establish IV access if not already present; draw stat labs",
      "Apply continuous monitoring (telemetry, pulse oximetry, BP cycling every 5 minutes)",
      "Implement initial ACLS/BLS protocols if patient progresses to arrest",
      "Prepare for potential ICU transfer with appropriate handoff communication (SBAR)"
    ],
    nursingActions: [
      "Trust your clinical instinct - 'worried about the patient' is a valid reason to activate RRT",
      "Use SBAR format when calling the RRT: Situation, Background, Assessment, Recommendation",
      "Gather the patient's chart, medication list, and recent labs before team arrives",
      "Designate roles during the response: airway management, IV access, recorder, medications",
      "Perform a focused assessment: airway patency, breathing effort, circulation (pulses, skin), disability (GCS/AVPU)",
      "Document the timeline of events, interventions, and patient responses meticulously"
    ],
    signs: {
      left: [
        "Heart rate <40 or >130 bpm",
        "Systolic BP <90 mmHg",
        "Respiratory rate <8 or >28 breaths/min",
        "SpO2 <90% on supplemental oxygen",
        "Acute change in mental status"
      ],
      right: [
        "New-onset chest pain or dyspnea",
        "Temperature <35°C or >39°C",
        "Urine output <0.5 mL/kg/hr for 2+ hours",
        "Seizure activity",
        "Nurse intuition: 'something is not right'",
        "Uncontrolled pain or agitation"
      ]
    },
    medications: [
      { name: "Epinephrine", type: "Catecholamine (alpha and beta agonist)", action: "First-line medication in cardiac arrest; stimulates alpha-1 (vasoconstriction) and beta-1 (chronotropy, inotropy) receptors", sideEffects: "Tachyarrhythmias, hypertension, myocardial ischemia, tissue necrosis with extravasation", contra: "No absolute contraindications in cardiac arrest", pearl: "In cardiac arrest: 1 mg IV/IO every 3-5 minutes. In anaphylaxis: 0.3-0.5 mg IM (1:1000) into lateral thigh. NEVER give 1:1000 concentration IV" },
      { name: "Atropine", type: "Anticholinergic (muscarinic antagonist)", action: "Blocks vagal stimulation at the SA and AV nodes, increasing heart rate in symptomatic bradycardia", sideEffects: "Tachycardia, dry mouth, urinary retention, blurred vision, paradoxical bradycardia at low doses", contra: "Ineffective for infranodal (Mobitz Type II, third-degree) heart block", pearl: "Dose: 1 mg IV every 3-5 minutes, max 3 mg. If bradycardia persists after max atropine, consider transcutaneous pacing or dopamine/epinephrine infusion" }
    ],
    pearls: [
      "Most in-hospital cardiac arrests are preceded by 6-8 hours of detectable vital sign deterioration",
      "A respiratory rate >27 is the single strongest predictor of cardiac arrest within 72 hours",
      "Nursing intuition ('I'm worried about this patient') has been validated as a legitimate RRT activation criterion",
      "Early RRT activation reduces code blue events by 17-65% depending on the institution",
      "Use SBAR communication: 'I am calling about [patient]. They were admitted for [X]. I am concerned because [vital signs/assessment]. I recommend [specific action].'"
    ],
    quiz: [
      { question: "A nurse notes the following vital signs on a post-operative patient: HR 118, BP 94/58, RR 26, SpO2 91% on 2L NC, temperature 38.8°C. What is the priority action?", options: ["Increase oxygen to 4L NC and reassess in 30 minutes", "Activate the Rapid Response Team", "Administer acetaminophen for the fever and continue monitoring", "Call the attending physician for new orders"], correct: 1, rationale: "This patient meets multiple RRT activation criteria: tachycardia, hypotension, tachypnea, declining SpO2, and fever. This constellation suggests possible sepsis or hemorrhage. Delaying activation for individual interventions risks further deterioration." },
      { question: "Which communication framework should the nurse use when activating the Rapid Response Team?", options: ["RACE (Rescue, Alarm, Contain, Extinguish)", "SBAR (Situation, Background, Assessment, Recommendation)", "AIDET (Acknowledge, Introduce, Duration, Explanation, Thank)", "HEAD (History, Exam, Assessment, Disposition)"], correct: 1, rationale: "SBAR (Situation, Background, Assessment, Recommendation) is the standardized communication framework for urgent clinical communication. It provides a structured, concise format that ensures all critical information is conveyed efficiently during time-sensitive situations." }
    ]
  },

  "trauma-primary-survey": {
    title: "Trauma Primary Survey (ABCDE)",
    cellular: {
      title: "Pathophysiology of Traumatic Injury",
      content: "The trauma primary survey is a systematic, rapid assessment framework (ABCDE) designed to identify and treat immediately life-threatening injuries. It is based on the physiological principle that threats to life should be addressed in order of the speed at which they will cause death: airway obstruction kills in minutes, breathing failure in minutes to hours, and circulatory failure over hours.\n\nAirway compromise in trauma can result from facial fractures displacing anatomy, blood or vomitus in the oropharynx, laryngeal fractures disrupting the airway architecture, or cervical spine injuries causing neurogenic loss of airway tone. At the cellular level, complete airway obstruction causes oxygen deprivation to the brain within 4-6 minutes, leading to irreversible neuronal death through excitotoxicity (excessive glutamate release), calcium influx, and mitochondrial failure.\n\nBreathing emergencies include tension pneumothorax, open pneumothorax (sucking chest wound), massive hemothorax, and flail chest. Tension pneumothorax causes progressive mediastinal shift, kinking the great veins and causing obstructive shock. Flail chest (≥3 consecutive ribs fractured in ≥2 places each) causes paradoxical chest wall movement, dramatically reducing ventilatory efficiency. The underlying pulmonary contusion causes hemorrhagic consolidation and impaired gas exchange at the alveolar-capillary membrane.\n\nCirculatory assessment focuses on identifying hemorrhagic shock, the leading cause of preventable trauma death. Hemorrhage classification (I-IV) correlates blood loss volume with physiological responses. Class I (<750 mL, <15%) shows minimal vital sign changes. Class III (1500-2000 mL, 30-40%) produces tachycardia, hypotension, altered mental status, and decreased urine output. Class IV (>2000 mL, >40%) is immediately life-threatening with profound shock. Disability assessment evaluates neurological status using Glasgow Coma Scale (GCS) and pupillary response, while Exposure involves completely undressing the patient to identify all injuries while preventing hypothermia."
    },
    riskFactors: [
      "Motor vehicle collisions (leading cause of traumatic injury)",
      "Falls from height (especially elderly)",
      "Penetrating trauma (gunshot wounds, stab wounds)",
      "Pedestrian struck by vehicle",
      "Alcohol or substance intoxication (impaired protective reflexes)",
      "Extremes of age (children: different injury patterns; elderly: comorbidities, anticoagulants)"
    ],
    diagnostics: [
      "FAST exam (Focused Assessment with Sonography for Trauma): identifies free fluid in abdomen, pelvis, and pericardium",
      "Chest X-ray (portable AP): pneumothorax, hemothorax, mediastinal widening",
      "Pelvic X-ray: pelvic fracture (major source of occult hemorrhage)",
      "CT scan (head, c-spine, chest, abdomen/pelvis) once patient stabilized",
      "Glasgow Coma Scale (GCS) for neurological baseline and trending",
      "Arterial blood gas and lactate to quantify shock severity"
    ],
    management: [
      "A - Airway: establish patent airway with c-spine protection; jaw thrust (not head tilt), suction, definitive airway if needed",
      "B - Breathing: needle decompression for tension pneumothorax, occlusive dressing for open chest wound, chest tube for hemothorax",
      "C - Circulation: control hemorrhage with direct pressure, establish 2 large-bore IVs, begin crystalloid and blood product resuscitation",
      "D - Disability: assess GCS, pupil size and reactivity; manage elevated ICP if indicated",
      "E - Exposure: completely undress patient, log-roll to assess posterior surfaces, prevent hypothermia with warm blankets",
      "Apply pelvic binder for suspected pelvic fracture; apply tourniquet for life-threatening extremity hemorrhage"
    ],
    nursingActions: [
      "Maintain cervical spine immobilization until cleared by imaging and clinical exam",
      "Assist with rapid sequence intubation if definitive airway is needed",
      "Apply direct pressure to compressible bleeding sites; apply tourniquet 2-3 inches proximal to wound for extremity hemorrhage",
      "Insert two 14-16 gauge IVs and draw trauma labs (type and screen, CBC, CMP, coags, lactate, ethanol level)",
      "Continuously monitor vital signs and report changes in GCS to the trauma team",
      "Document times of all interventions, medications, and fluid/blood product administration"
    ],
    signs: {
      left: [
        "Airway: stridor, gurgling, inability to speak",
        "Breathing: absent breath sounds, tracheal deviation, flail segment",
        "Circulation: tachycardia, hypotension, weak pulses, external hemorrhage",
        "Disability: GCS <8, unequal pupils, posturing"
      ],
      right: [
        "Exposure: abrasions, ecchymosis (seatbelt sign), deformities",
        "Subcutaneous emphysema (pneumothorax/airway injury)",
        "Distended abdomen (intra-abdominal hemorrhage)",
        "Pelvic instability on compression",
        "Open fractures with visible bone",
        "Battle's sign, raccoon eyes (basilar skull fracture)"
      ]
    },
    medications: [
      { name: "Tranexamic Acid (TXA)", type: "Antifibrinolytic", action: "Inhibits plasminogen activation to stabilize formed blood clots and reduce hemorrhage in trauma", sideEffects: "Nausea, vomiting, thromboembolic events, seizures at high doses", contra: "Administration >3 hours from injury (may increase mortality)", pearl: "Give 1g IV over 10 minutes within 3 hours of injury; follow with 1g IV over 8 hours. CRASH-2 trial showed significant mortality reduction when given early" },
      { name: "Ketamine", type: "Dissociative anesthetic (NMDA antagonist)", action: "Provides sedation and analgesia for procedures while maintaining airway reflexes and hemodynamic stability", sideEffects: "Emergence reactions (hallucinations), increased secretions, hypertension, elevated ICP", contra: "Elevated intracranial pressure (relative), severe hypertension, psychotic disorders", pearl: "Preferred induction agent for RSI in hypotensive trauma patients because it does not cause hypotension like propofol or etomidate; dose 1-2 mg/kg IV" }
    ],
    pearls: [
      "The primary survey should take <2 minutes; treat life threats AS THEY ARE FOUND before moving to the next letter",
      "GCS ≤8 = definitive airway needed (patient cannot protect own airway)",
      "Assume cervical spine injury in all blunt trauma patients until proven otherwise",
      "The most common preventable cause of trauma death is uncontrolled hemorrhage",
      "Pelvic fractures can cause life-threatening retroperitoneal hemorrhage of 3-5 liters - apply pelvic binder early"
    ],
    quiz: [
      { question: "During the primary survey of a trauma patient, you note absent breath sounds on the left, tracheal deviation to the right, and JVD. What is the immediate intervention?", options: ["Obtain a chest X-ray to confirm the diagnosis", "Needle decompression at the 2nd intercostal space, left midclavicular line", "Intubate the patient immediately", "Start 2 large-bore IVs and bolus normal saline"], correct: 1, rationale: "These findings indicate left-sided tension pneumothorax. This is a clinical diagnosis requiring immediate needle decompression during the 'B' (Breathing) step. Delaying for imaging is inappropriate in this life-threatening emergency." },
      { question: "A trauma patient has a GCS of 6 (E1, V2, M3). According to the primary survey, what does this indicate?", options: ["The patient needs emergent CT scan", "The patient requires a definitive airway (intubation)", "Spinal cord injury is confirmed", "The patient should receive IV mannitol immediately"], correct: 1, rationale: "GCS ≤8 indicates the patient cannot protect their own airway. During the 'A' (Airway) and 'D' (Disability) assessment, a GCS of 6 mandates securing a definitive airway through endotracheal intubation to prevent aspiration and ensure adequate ventilation." }
    ]
  },

  "secondary-trauma-survey": {
    title: "Secondary Trauma Survey",
    cellular: {
      title: "Pathophysiology Principles in Comprehensive",
      content: "The secondary trauma survey is a systematic head-to-toe assessment performed AFTER all life-threatening injuries have been identified and addressed during the primary survey. Its purpose is to identify ALL injuries, including those that are not immediately life-threatening but may cause significant morbidity if missed. The secondary survey is never performed at the expense of primary survey priorities.\n\nThe pathophysiology of missed injuries is a significant concern in trauma care. Distracting injuries - highly painful or dramatic injuries that draw attention away from more subtle but potentially dangerous injuries - are a leading cause of missed diagnoses. For example, a patient with a dramatic open femur fracture may have attention focused on the extremity while a slowly developing epidural hematoma goes undetected. Similarly, retroperitoneal injuries (duodenal perforation, pancreatic laceration) may present with minimal initial findings but progress to sepsis and death if not identified.\n\nThe secondary survey incorporates the AMPLE history framework, which captures critical information that guides diagnostic workup and treatment. Allergies determine safe medication choices. Medications reveal anticoagulant use (increased bleeding risk), beta-blockers (may blunt tachycardic response to hemorrhage), or insulin (risk of hypoglycemia). Past medical history identifies comorbidities that affect injury patterns and treatment options. Last meal timing is essential if surgery is anticipated (aspiration risk). Events surrounding the injury provide mechanism information that predicts injury patterns (e.g., frontal collision → sternal fracture → cardiac contusion; fall from height → calcaneal fracture → lumbar burst fracture).\n\nAt the tissue level, many injuries evolve over hours. Solid organ injuries (liver, spleen lacerations) may initially tamponade but later decompensate with delayed hemorrhage. Compartment syndrome develops as interstitial pressure within a fascial compartment rises above capillary perfusion pressure, causing muscle ischemia that progresses to necrosis within 6-8 hours. These time-dependent pathologies underscore the importance of serial reassessment and monitoring after the secondary survey is completed."
    },
    riskFactors: [
      "High-energy mechanism of injury (high-speed MVC, fall >20 feet)",
      "Altered level of consciousness (unable to report symptoms)",
      "Intoxication masking pain responses",
      "Distracting injuries that draw attention from occult injuries",
      "Elderly patients with atypical presentations and fragile tissues",
      "Anticoagulated patients with delayed bleeding manifestations"
    ],
    diagnostics: [
      "CT head without contrast for altered mental status, skull fracture, or focal neurological deficits",
      "CT cervical spine to clear c-spine in obtunded patients",
      "CT chest/abdomen/pelvis with IV contrast for thoracoabdominal injuries",
      "Extremity X-rays for suspected fractures based on physical exam",
      "Urinalysis for hematuria (renal/bladder injury)",
      "Serial abdominal exams and hemoglobin monitoring for delayed hemorrhage"
    ],
    management: [
      "Complete head-to-toe examination: scalp, face, neck, chest, abdomen, pelvis, extremities, back (log-roll)",
      "Obtain AMPLE history: Allergies, Medications, Past medical history, Last meal, Events of injury",
      "Splint fractures, apply wound dressings, and reassess neurovascular status of all extremities",
      "Insert nasogastric tube (orogastric if facial fractures suspected) and Foley catheter (if no urethral injury signs)",
      "Tetanus prophylaxis and antibiotic prophylaxis for open fractures and contaminated wounds",
      "Plan definitive imaging and specialist consultations based on findings"
    ],
    nursingActions: [
      "Systematically assess each body region: inspect, palpate, auscultate, and document findings",
      "Perform neurovascular checks on all extremities every 30-60 minutes (pulses, sensation, motor, pain, pallor)",
      "Monitor for developing compartment syndrome: pain out of proportion, pain with passive stretch, paresthesias",
      "Log-roll patient with spinal precautions to assess posterior surfaces (back, buttocks, flanks)",
      "Collect and document AMPLE history from patient, family, or EMS providers",
      "Communicate all findings clearly using SBAR format to the trauma team"
    ],
    signs: {
      left: [
        "Battle's sign (mastoid ecchymosis - basilar skull fracture)",
        "Raccoon eyes (periorbital ecchymosis - anterior fossa fracture)",
        "CSF otorrhea or rhinorrhea (skull base fracture)",
        "Seatbelt sign across abdomen (hollow viscus injury)",
        "Flank ecchymosis (Grey Turner sign - retroperitoneal bleeding)"
      ],
      right: [
        "Pain out of proportion to visible injury (compartment syndrome)",
        "Progressive abdominal distension (internal hemorrhage)",
        "Hemotympanum (blood behind tympanic membrane)",
        "Perineal or scrotal ecchymosis (pelvic fracture, urethral injury)",
        "Cullen sign (periumbilical ecchymosis - intra-abdominal hemorrhage)",
        "Gross hematuria (renal, bladder, or urethral injury)"
      ]
    },
    medications: [
      { name: "Tetanus Toxoid (Td/Tdap)", type: "Vaccine/Toxoid", action: "Stimulates active immunity against Clostridium tetani toxin for wound infection prevention", sideEffects: "Injection site pain, swelling, low-grade fever, malaise", contra: "Severe allergic reaction to previous tetanus vaccination; defer in acute febrile illness (relative)", pearl: "Give Td booster if last vaccination >5 years ago for contaminated wounds or >10 years for clean wounds; Tdap preferred if not previously received" },
      { name: "Cefazolin", type: "First-generation cephalosporin antibiotic", action: "Bactericidal against gram-positive organisms; prophylaxis for open fractures (Gustilo Type I-II)", sideEffects: "Allergic reactions (cross-reactivity with penicillin 1-2%), GI upset, C. difficile infection", contra: "Severe penicillin allergy (anaphylaxis); use clindamycin as alternative", pearl: "Administer within 1 hour of open fracture identification; add gentamicin for Gustilo Type III (farm/soil contamination)" }
    ],
    pearls: [
      "The secondary survey NEVER takes priority over the primary survey - always reassess ABCDEs first",
      "AMPLE history: Allergies, Medications, Past medical history, Last meal, Events/Environment of injury",
      "Beta-blockers can mask tachycardia in hemorrhaging patients - do not rely on HR alone for shock assessment",
      "Compartment syndrome is a clinical diagnosis; the 5 Ps: Pain (out of proportion), Pressure, Paresthesias, Paralysis, Pulselessness (late sign)",
      "Blood at the urethral meatus, high-riding prostate, or scrotal hematoma = DO NOT insert Foley catheter (urethral injury)"
    ],
    quiz: [
      { question: "During the secondary survey, a nurse notes blood at the urethral meatus and scrotal ecchymosis. What is the appropriate action?", options: ["Insert a Foley catheter to assess for hematuria", "Do NOT insert a Foley catheter and notify the urologist", "Perform a rectal exam to assess prostate position", "Apply an external condom catheter and monitor output"], correct: 1, rationale: "Blood at the urethral meatus and scrotal ecchymosis are classic signs of urethral injury. Inserting a Foley catheter could convert a partial urethral tear into a complete disruption. Urology consultation is required for retrograde urethrogram before catheter placement." },
      { question: "A patient involved in a high-speed MVC has a seatbelt sign (ecchymosis) across the lower abdomen. What injury should the nurse be most concerned about?", options: ["Pulmonary contusion", "Cervical spine fracture", "Hollow viscus (intestinal) injury", "Pelvic ring fracture"], correct: 2, rationale: "The seatbelt sign (linear ecchymosis across the abdomen from a lap belt) is strongly associated with hollow viscus injuries (small bowel perforation, mesenteric tears). These injuries may have delayed presentation and require serial abdominal assessments and CT imaging." }
    ]
  },

  "post-op-complications": {
    title: "Post-Operative Complications",
    cellular: {
      title: "Post-Operative Complications",
      content: "Post-operative complications arise from the combined physiological stresses of surgical tissue injury, anesthesia, immobility, and the body's inflammatory and healing responses. Understanding the timeline of when complications typically occur helps nurses anticipate, prevent, and recognize problems early.\n\nIn the immediate post-operative period (0-24 hours), the primary concerns are airway compromise, hemorrhage, and cardiovascular instability. Residual anesthetic effects depress the respiratory center, reduce pharyngeal muscle tone, and impair protective airway reflexes. At the cellular level, volatile anesthetics reduce the hypoxic ventilatory response and impair mucociliary clearance. Post-operative hemorrhage occurs when surgical hemostasis fails - either from a slipped ligature, coagulopathy from hypothermia and dilution, or rebound anticoagulation. Hypothermia from the cold operating room environment causes peripheral vasoconstriction, and as the patient rewarms, vasodilation unmasks hypovolemia.\n\nIn the early post-operative period (1-3 days), atelectasis is the most common cause of fever. Anesthesia, pain-limited deep breathing, and immobility allow alveolar collapse, particularly in dependent lung zones. Collapsed alveoli release inflammatory cytokines that cause low-grade fever. If atelectasis is not addressed with incentive spirometry and mobilization, retained secretions become infected, progressing to pneumonia (typically days 3-5). Paralytic ileus occurs because surgical manipulation of the bowel, opioid analgesics, and sympathetic activation inhibit intestinal motility at the level of the myenteric plexus.\n\nLate complications (days 5-14+) include surgical site infections, which develop as bacteria colonize the wound during the inflammatory phase of healing. Deep vein thrombosis peaks around days 5-7, as Virchow's triad is fully active: venous stasis from immobility, endothelial injury from surgery, and hypercoagulability from the acute phase response. Wound dehiscence typically occurs around days 5-10, when sutures bear maximum tension as inflammatory edema resolves before collagen deposition provides adequate wound strength."
    },
    riskFactors: [
      "Advanced age (>70 years) with multiple comorbidities",
      "Obesity (BMI >35) increasing wound complications and DVT risk",
      "Diabetes mellitus (impaired wound healing, infection risk)",
      "Smoking (impaired tissue oxygenation, poor wound healing)",
      "Prolonged surgical time (>3 hours increases infection and DVT risk)",
      "Emergency surgery (limited optimization, higher complication rates)",
      "Immunosuppression (steroids, chemotherapy)"
    ],
    diagnostics: [
      "Post-operative vital signs every 15 minutes x4, then every 30 minutes x2, then every 4 hours",
      "CBC: trending hemoglobin for hemorrhage, WBC for infection",
      "Chest X-ray for respiratory complications (atelectasis, pneumonia, pleural effusion)",
      "CT abdomen/pelvis for suspected anastomotic leak or intra-abdominal abscess",
      "Lower extremity duplex ultrasound for suspected DVT",
      "Wound culture and sensitivity if surgical site infection suspected"
    ],
    management: [
      "Respiratory: incentive spirometry 10 times per hour while awake, early ambulation, cough and deep breathing",
      "DVT prophylaxis: sequential compression devices and pharmacological prophylaxis (enoxaparin or heparin)",
      "Pain management: multimodal analgesia (scheduled acetaminophen/NSAIDs + PRN opioids) to facilitate mobility",
      "Surgical site infection: prophylactic antibiotics within 60 minutes of incision, redose for long cases",
      "Paralytic ileus: NPO, NG tube if vomiting, early ambulation, chewing gum (stimulates vagal tone)",
      "Wound dehiscence: cover with sterile saline-soaked dressing, do NOT reapproximate; notify surgeon urgently"
    ],
    nursingActions: [
      "Assess surgical site every shift: redness, warmth, swelling, drainage (COCA: Color, Odor, Consistency, Amount)",
      "Encourage early mobility: dangle at bedside day of surgery, ambulate POD1 if able",
      "Perform neurovascular checks on operative extremities (orthopedic cases): circulation, sensation, motor, pain",
      "Monitor for urinary retention: assess for bladder distension, straight catheterize if no void within 6-8 hours post-op",
      "Assess bowel sounds and document return of flatus; advance diet as tolerated",
      "Educate patient on signs requiring immediate notification: fever, increasing wound pain, drainage, dyspnea, calf pain"
    ],
    signs: {
      left: [
        "Post-op day 1-2: low-grade fever (atelectasis)",
        "Post-op day 3-5: productive cough, higher fever (pneumonia)",
        "Post-op day 5-7: calf pain, swelling (DVT)",
        "Wound erythema, warmth, purulent drainage (SSI)"
      ],
      right: [
        "Increasing incisional pain after initial improvement",
        "Absent bowel sounds, abdominal distension (ileus)",
        "Oliguria or anuria (urinary retention or renal injury)",
        "Serosanguinous drainage surge from wound (dehiscence)",
        "Sudden dyspnea with pleuritic chest pain (PE)",
        "Mental status changes in elderly (delirium)"
      ]
    },
    medications: [
      { name: "Enoxaparin (Lovenox)", type: "Low-molecular-weight heparin (LMWH)", action: "Inhibits factor Xa to prevent venous thromboembolism in post-operative patients", sideEffects: "Bleeding, injection site bruising, thrombocytopenia (HIT less common than UFH)", contra: "Active major bleeding, HIT, severe renal impairment (CrCl <30 - use UFH instead)", pearl: "Give 40 mg subcutaneously daily for moderate-risk surgical patients; do NOT expel air bubble (ensures full dose delivery); inject into abdominal fat fold" },
      { name: "Ondansetron (Zofran)", type: "5-HT3 receptor antagonist (antiemetic)", action: "Blocks serotonin receptors in the chemoreceptor trigger zone and vagal afferents to prevent post-operative nausea and vomiting", sideEffects: "Headache, constipation, QT prolongation (dose-dependent)", contra: "Congenital long QT syndrome, concurrent use of other QT-prolonging drugs", pearl: "Give 4 mg IV at end of surgery for PONV prophylaxis; maximum single IV dose 16 mg; check baseline QTc in patients on other QT-prolonging medications" }
    ],
    pearls: [
      "Post-op fever timeline: Wind (atelectasis) day 1-2, Water (UTI) day 3-5, Wound (SSI) day 5-7, Walking (DVT/PE) day 5+, Wonder drugs (drug fever) anytime",
      "Incentive spirometry is the MOST effective intervention to prevent post-operative atelectasis and pneumonia",
      "Early ambulation prevents the most common post-op complications: atelectasis, DVT, ileus, and urinary retention",
      "Wound dehiscence often presents with a gush of serosanguinous drainage (peritoneal fluid) - cover with saline-soaked gauze and call the surgeon",
      "The most common cause of post-operative fever in the first 48 hours is atelectasis, NOT infection"
    ],
    quiz: [
      { question: "A patient is 36 hours post-abdominal surgery with a temperature of 38.2°C, diminished breath sounds at the bases, and no cough. What is the most likely cause?", options: ["Surgical site infection", "Urinary tract infection", "Atelectasis", "Deep vein thrombosis"], correct: 2, rationale: "Fever on post-operative day 1-2 is most commonly caused by atelectasis (Wind). The diminished basilar breath sounds and early post-operative timing support this diagnosis. SSI typically presents days 5-7, UTI days 3-5, and DVT days 5+." },
      { question: "A nurse notices a sudden gush of pink, serosanguinous fluid from a patient's abdominal incision on post-op day 7. What is the priority nursing action?", options: ["Apply a pressure dressing and elevate the head of bed", "Cover the wound with sterile saline-moistened gauze and notify the surgeon immediately", "Remove the staples to relieve wound tension", "Apply butterfly closures to reapproximate the wound edges"], correct: 1, rationale: "A sudden gush of serosanguinous fluid from a surgical wound on POD 5-10 suggests wound dehiscence or evisceration. The nurse should cover the wound with sterile saline-moistened gauze to protect tissue, place the patient in low Fowler's, and notify the surgeon immediately. Never attempt to push organs back in or reapproximate the wound." }
    ]
  },

};
