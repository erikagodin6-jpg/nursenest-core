import { EmergencyNursingQuestion } from "./types";

export const respiratoryEmergency1Questions: EmergencyNursingQuestion[] = [
  {
    stem: "A 22-year-old male with a history of asthma presents in acute respiratory distress. He is sitting upright, using accessory muscles, and can only speak in single words. RR 36, SpO2 88% on room air, HR 128 bpm. Auscultation reveals minimal air movement bilaterally. Peak flow is unmeasurable. Which finding is MOST concerning for imminent respiratory failure?",
    options: [
      "The tachycardia at 128 bpm",
      "The minimal air movement (silent chest) on auscultation",
      "The inability to speak in full sentences",
      "The SpO2 of 88% on room air"
    ],
    correctAnswer: 1,
    rationaleLong: "While all findings indicate severe asthma exacerbation, the 'silent chest' (minimal or absent air movement on auscultation) is the most ominous and concerning sign of imminent respiratory failure. In acute asthma, wheezing is caused by turbulent airflow through narrowed airways. As the airways become progressively more constricted, airflow decreases to the point where there is insufficient air movement to generate wheezing - this results in a 'silent chest.' Paradoxically, the disappearance of wheezing in a deteriorating asthma patient represents worsening, not improvement. A silent chest indicates critical airflow limitation with air trapping and is a pre-arrest finding requiring immediate aggressive intervention. The patient is at risk for respiratory arrest and cardiovascular collapse. Immediate management includes: (1) continuous nebulized albuterol (not intermittent), (2) ipratropium bromide 0.5 mg nebulized, (3) IV magnesium sulfate 2 grams over 20 minutes (smooth muscle relaxer), (4) IV methylprednisolone 125 mg (reduces inflammation), (5) IV epinephrine 0.3-0.5 mg IM or IV if not responding (powerful bronchodilator), (6) preparation for endotracheal intubation if patient continues to deteriorate. Intubation of the severe asthmatic is extremely high-risk due to bronchospasm, air trapping, and hemodynamic instability. Ketamine is the preferred induction agent due to its bronchodilatory properties. The other findings - tachycardia, inability to speak in sentences, and hypoxemia - all indicate severe asthma but are not as immediately ominous as a silent chest.",
    learningObjective: "Identify the 'silent chest' as the most ominous finding in acute severe asthma indicating imminent respiratory failure",
    blueprintCategory: "Respiratory Emergencies",
    subtopic: "Acute Severe Asthma",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Disappearing wheezing in a deteriorating asthma patient = WORSENING, not improvement (silent chest = pre-arrest)",
    clinicalPearls: [
      "Silent chest in asthma = critical airflow limitation = pre-arrest finding",
      "IV magnesium sulfate 2g is a potent bronchodilator for severe asthma",
      "Ketamine is the preferred induction agent for intubation of severe asthmatics",
      "Continuous (not intermittent) nebulized albuterol for severe exacerbation"
    ],
    safetyNote: "Intubation of severe asthmatics is extremely high-risk - have vasopressors ready as positive pressure ventilation can cause cardiovascular collapse",
    distractorRationales: [
      "Tachycardia indicates severity but is not as immediately ominous as silent chest",
      "Silent chest represents critical airflow limitation and imminent respiratory failure",
      "Inability to speak in sentences indicates severe exacerbation but not imminent arrest",
      "SpO2 of 88% is concerning but the silent chest indicates a more immediate threat"
    ],
    lessonLink: "/emergency/lessons/acute-severe-asthma"
  },
  {
    stem: "A 68-year-old male with COPD presents with worsening dyspnea, productive cough, and confusion. ABG shows pH 7.24, PaCO2 78 mmHg, PaO2 52 mmHg, HCO3 34 mEq/L. SpO2 is 84% on room air. Which intervention should the emergency nurse initiate first?",
    options: [
      "High-flow oxygen at 15 L/min via non-rebreather mask",
      "BiPAP with IPAP 12, EPAP 5 cm H2O",
      "Immediate endotracheal intubation for respiratory failure",
      "Low-flow oxygen at 2 L/min via nasal cannula"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient presents with an acute exacerbation of COPD with acute-on-chronic respiratory failure. The ABG shows respiratory acidosis with chronic compensation (elevated bicarbonate of 34 indicates chronic CO2 retention) and acute worsening (pH 7.24 is significantly acidotic, indicating the acute component has overwhelmed the chronic compensation). The patient has both hypoxemia (PaO2 52) and hypercapnia (PaCO2 78) with altered mental status (confusion). BiPAP (bilevel positive airway pressure) is the first-line intervention for COPD exacerbation with respiratory acidosis (pH < 7.35). Multiple randomized controlled trials and meta-analyses have shown that BiPAP in COPD exacerbation reduces intubation rates by 65%, reduces mortality by 46%, and decreases ICU length of stay. BiPAP provides two levels of pressure: IPAP (inspiratory positive airway pressure) assists ventilation and reduces the work of breathing, while EPAP (expiratory positive airway pressure) provides PEEP to keep airways open and improve oxygenation. Starting settings of IPAP 12 and EPAP 5 can be titrated based on response. High-flow oxygen at 15 L/min via non-rebreather is inappropriate for COPD patients because it can suppress the hypoxic ventilatory drive. In chronic CO2 retainers, the respiratory drive has shifted from CO2-based (which is blunted due to chronic elevation) to hypoxia-based. Flooding these patients with high-flow O2 removes the hypoxic drive and can cause respiratory arrest. However, this does NOT mean withholding oxygen from a hypoxic COPD patient - the target SpO2 is 88-92%. Low-flow O2 at 2 L/min alone is insufficient given the severity of this presentation (confusion, severe acidosis). Immediate intubation may be needed if BiPAP fails but is not the first intervention when BiPAP is available.",
    learningObjective: "Initiate BiPAP as first-line ventilatory support for COPD exacerbation with respiratory acidosis",
    blueprintCategory: "Respiratory Emergencies",
    subtopic: "COPD Exacerbation",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "BiPAP reduces intubation by 65% in COPD exacerbation - it should be tried before intubation in most cases",
    clinicalPearls: [
      "BiPAP for COPD: reduces intubation by 65%, mortality by 46%",
      "Target SpO2 88-92% in COPD patients (not 94-98% as for other patients)",
      "Elevated HCO3 indicates chronic CO2 retention with renal compensation",
      "BiPAP contraindicated if: obtunded, vomiting, facial trauma, unable to protect airway"
    ],
    safetyNote: "Do NOT withhold oxygen from a hypoxic COPD patient - hypoxia kills faster than CO2 retention; target SpO2 88-92%",
    distractorRationales: [
      "High-flow O2 can suppress hypoxic ventilatory drive in chronic CO2 retainers",
      "BiPAP is first-line for COPD with respiratory acidosis and reduces intubation rates",
      "Intubation is reserved for patients who fail BiPAP or who cannot protect their airway",
      "Low-flow O2 alone is insufficient for this degree of respiratory failure"
    ],
    lessonLink: "/emergency/lessons/copd-exacerbation"
  },
  {
    stem: "A 45-year-old male presents with sudden onset pleuritic chest pain and dyspnea after a long international flight. He is tachycardic at 112 bpm, BP 126/78 mmHg, SpO2 93% on room air. D-dimer is elevated at 2,400 ng/mL. CT pulmonary angiography confirms bilateral subsegmental pulmonary emboli. RV function is normal on echocardiography. How should this PE be classified and managed?",
    options: [
      "Massive PE requiring systemic thrombolysis",
      "Submassive PE requiring catheter-directed therapy",
      "Low-risk PE appropriate for outpatient anticoagulation",
      "Intermediate-risk (submassive) PE requiring anticoagulation and monitoring"
    ],
    correctAnswer: 2,
    rationaleLong: "This patient has a pulmonary embolism that meets criteria for low-risk classification based on several factors: (1) hemodynamically stable (normal BP), (2) normal RV function on echocardiography (no RV dilation or dysfunction), (3) the PE burden is subsegmental, and (4) the patient appears clinically stable. PE risk stratification is critical for guiding management: Massive (high-risk) PE: sustained hypotension (SBP < 90 for > 15 minutes), requiring vasopressors, or cardiac arrest → systemic thrombolysis. Submassive (intermediate-risk) PE: hemodynamically stable BUT with RV dysfunction (echocardiography showing RV dilation, RV/LV ratio > 0.9, or McConnell's sign) OR elevated cardiac biomarkers (troponin, BNP) → anticoagulation with close monitoring, consider escalation to thrombolysis or catheter-directed therapy if deterioration occurs. Low-risk PE: hemodynamically stable with normal RV function and normal biomarkers → anticoagulation with consideration for outpatient management. Multiple validated scoring systems (sPESI, Hestia criteria, PESI) help identify patients with low-risk PE who may be safely managed as outpatients with direct oral anticoagulants (DOACs such as rivaroxaban or apixaban). Outpatient PE management criteria include: hemodynamic stability, no signs of RV strain, no active bleeding, adequate social support, ability to follow up within 24-48 hours, and absence of high-risk features. The emergency nurse should initiate anticoagulation promptly (weight-based heparin or DOAC), provide PE education, and arrange close follow-up if the patient meets outpatient criteria.",
    learningObjective: "Classify PE severity by hemodynamic status and RV function to guide appropriate management intensity",
    blueprintCategory: "Respiratory Emergencies",
    subtopic: "Pulmonary Embolism",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Not all PEs require hospitalization - low-risk PE with normal RV function may be managed outpatient with DOACs",
    clinicalPearls: [
      "PE risk: Massive (hypotension) > Submassive (stable + RV dysfunction) > Low-risk (stable + normal RV)",
      "sPESI score of 0 identifies low-risk PE patients for potential outpatient management",
      "RV/LV ratio > 0.9 on echo or CT indicates RV strain (submassive PE)",
      "DOACs (rivaroxaban, apixaban) are first-line anticoagulation for most PE patients"
    ],
    safetyNote: "Even low-risk PE patients need reliable follow-up within 24-48 hours and clear return precautions",
    distractorRationales: [
      "Massive PE requires hypotension or hemodynamic instability, which is not present",
      "Submassive PE requires RV dysfunction, which is not present in this case",
      "Low-risk PE with normal hemodynamics and RV function may be managed outpatient",
      "Intermediate-risk classification requires RV dysfunction or elevated biomarkers"
    ],
    lessonLink: "/emergency/lessons/pulmonary-embolism"
  },
  {
    stem: "A 30-year-old tall, thin male presents with sudden onset right-sided chest pain and dyspnea while playing basketball. Breath sounds are absent on the right side. Chest X-ray shows a large (>50%) right pneumothorax with tracheal deviation to the left. HR 124 bpm, BP 86/52 mmHg, SpO2 82%. What is the emergency nurse's immediate action?",
    options: [
      "Apply high-flow oxygen and obtain CT chest for confirmation",
      "Perform needle decompression at the 2nd intercostal space, midclavicular line, right chest",
      "Insert a large-bore chest tube (28-32 Fr) at the 5th intercostal space, anterior axillary line",
      "Position the patient in left lateral decubitus position to improve ventilation"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient presents with a tension pneumothorax, evidenced by: absent breath sounds on the right, tracheal deviation to the LEFT (away from the affected side), hypotension, tachycardia, and severe hypoxemia. Tension pneumothorax occurs when air enters the pleural space through a one-way valve mechanism but cannot escape, causing progressive accumulation of air under pressure. This progressively collapses the affected lung, shifts the mediastinum to the opposite side (causing tracheal deviation), compresses the contralateral lung, kinks the great vessels, and impairs venous return to the heart, ultimately causing cardiovascular collapse and death if not treated immediately. Tension pneumothorax is a CLINICAL diagnosis that requires immediate treatment - do NOT delay for imaging confirmation. The immediate intervention is needle decompression (needle thoracostomy) at the 2nd intercostal space, midclavicular line on the affected side, using a 14-gauge angiocatheter (minimum 5 cm length for adults). The needle is inserted just above the 3rd rib to avoid the neurovascular bundle running along the inferior border of each rib. This converts the tension pneumothorax to a simple pneumothorax by releasing the trapped air under pressure. Needle decompression is followed by definitive chest tube insertion (28-32 Fr tube thoracostomy) at the 5th intercostal space, anterior or midaxillary line. The classic presentation of this patient (tall, thin male with spontaneous pneumothorax) is consistent with a primary spontaneous pneumothorax that has progressed to tension physiology. CT and positioning will delay definitive treatment of this life-threatening condition.",
    learningObjective: "Recognize tension pneumothorax as a clinical diagnosis requiring immediate needle decompression without imaging delay",
    blueprintCategory: "Respiratory Emergencies",
    subtopic: "Pneumothorax",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Tension pneumothorax is a CLINICAL diagnosis - never delay treatment for imaging confirmation",
    clinicalPearls: [
      "Tension pneumothorax: absent breath sounds + tracheal deviation AWAY + hypotension + tachycardia",
      "Needle decompression: 14-gauge catheter, 2nd ICS, midclavicular line, just ABOVE 3rd rib",
      "Needle decompression is temporizing - always follow with definitive chest tube placement",
      "Primary spontaneous pneumothorax: tall, thin males (Marfan habitus), smokers"
    ],
    safetyNote: "Insert the needle just ABOVE the rib to avoid the neurovascular bundle running along the inferior border of each rib",
    distractorRationales: [
      "Imaging delays treatment of a life-threatening condition that is diagnosed clinically",
      "Needle decompression is the correct immediate intervention for tension pneumothorax",
      "Chest tube is definitive treatment but takes longer to set up - needle decompression is faster",
      "Positioning alone cannot treat tension pneumothorax"
    ],
    lessonLink: "/emergency/lessons/pneumothorax"
  },
  {
    stem: "A 55-year-old female with a history of recent upper respiratory infection presents with stridor, drooling, and a 'hot potato' voice. She is sitting forward with her jaw thrust forward. Temperature is 39.2°C. Which diagnosis and intervention should the emergency nurse prioritize?",
    options: [
      "Epiglottitis - prepare for emergent intubation in a controlled environment with surgical airway backup",
      "Peritonsillar abscess - prepare for needle aspiration",
      "Croup - administer nebulized racemic epinephrine",
      "Foreign body aspiration - prepare for bronchoscopy"
    ],
    correctAnswer: 0,
    rationaleLong: "This patient presents with classic signs of acute epiglottitis in an adult: stridor (indicating upper airway obstruction), drooling (inability to swallow secretions due to swollen epiglottis), 'hot potato' voice (muffled voice from supraglottic edema), fever (indicating infection), and the classic posture of sitting forward with jaw thrust forward (tripod or sniffing position to maximize airway patency). Adult epiglottitis is a life-threatening airway emergency that can progress to complete airway obstruction. Unlike pediatric epiglottitis (which has dramatically decreased since the Hib vaccine), adult epiglottitis is more common than previously recognized, often caused by Streptococcus, Staphylococcus, or Haemophilus species. The priority is airway management: (1) keep the patient calm and in their position of comfort (do NOT lay them down as this can cause complete airway obstruction), (2) prepare for emergent intubation in a controlled environment (OR is preferred if the patient is stable enough to transport) with the most experienced intubator available, (3) have a surgical airway setup (cricothyrotomy) immediately available at the bedside as backup, (4) administer IV antibiotics (ceftriaxone + vancomycin for empiric coverage), (5) IV dexamethasone to reduce edema. Direct laryngoscopy examination in the ED should be avoided as manipulation of the epiglottis can trigger complete spasm and obstruction. If the diagnosis is uncertain and the patient is stable, lateral neck soft tissue X-ray may show the 'thumb sign' (enlarged epiglottis). CT neck with contrast can also confirm the diagnosis. Peritonsillar abscess causes trismus and unilateral tonsillar swelling, not stridor. Croup is a pediatric disease. Foreign body would have a more acute onset without fever.",
    learningObjective: "Recognize adult epiglottitis and prepare for controlled airway management with surgical airway backup",
    blueprintCategory: "Respiratory Emergencies",
    subtopic: "Upper Airway Emergencies",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Do NOT attempt direct laryngoscopy in the ED for suspected epiglottitis - can trigger complete airway obstruction",
    clinicalPearls: [
      "Epiglottitis triad: stridor, drooling, hot potato voice with fever",
      "Keep patient upright and calm - laying them down can cause complete obstruction",
      "Thumb sign on lateral neck X-ray = enlarged epiglottis",
      "Adult epiglottitis is caused by Strep, Staph, or H. influenzae"
    ],
    safetyNote: "Always have a surgical airway (cricothyrotomy) setup at the bedside when managing suspected epiglottitis",
    distractorRationales: [
      "Epiglottitis is the correct diagnosis based on stridor, drooling, hot potato voice, and fever",
      "Peritonsillar abscess causes trismus and unilateral swelling, not stridor",
      "Croup is a pediatric disease characterized by barking cough, not adult presentation",
      "Foreign body aspiration would have acute onset without fever or drooling"
    ],
    lessonLink: "/emergency/lessons/upper-airway-emergencies"
  },
  {
    stem: "A 70-year-old male with COPD is on BiPAP for an acute exacerbation. After 2 hours, his ABG shows worsening: pH 7.18 (was 7.24), PaCO2 92 mmHg (was 78), PaO2 58 mmHg. He is becoming increasingly drowsy. What should the emergency nurse prepare for?",
    options: [
      "Increase the BiPAP settings to IPAP 20, EPAP 10",
      "Endotracheal intubation for invasive mechanical ventilation",
      "Switch to high-flow nasal cannula at 60 L/min",
      "Add heliox (helium-oxygen mixture) to the BiPAP circuit"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient is failing BiPAP therapy, as evidenced by worsening respiratory acidosis (pH decreased from 7.24 to 7.18, PaCO2 increased from 78 to 92 mmHg) and progressive somnolence despite 2 hours of noninvasive ventilation. The criteria for BiPAP failure and the need for intubation include: (1) worsening or unchanged ABG after 1-2 hours of optimized BiPAP, (2) inability to tolerate the mask, (3) inability to clear secretions, (4) decreasing level of consciousness, (5) hemodynamic instability, and (6) persistent hypoxemia despite high FiO2. This patient meets multiple criteria: worsening ABG, increasing drowsiness (decreasing consciousness), and persistent hypoxemia. Continued BiPAP in a patient with declining consciousness is dangerous because the risk of aspiration increases significantly. The patient is losing the ability to protect their airway, which is an absolute contraindication to noninvasive ventilation. Increasing BiPAP settings has already been attempted implicitly (the scenario states 2 hours of treatment without improvement) and would not address the fundamental problem of a deteriorating patient who cannot protect their airway. High-flow nasal cannula provides less ventilatory support than BiPAP and would be a step backward. Heliox can reduce airway resistance in upper airway obstruction but has limited evidence in COPD exacerbation and would not address the airway protection concern. The emergency nurse should prepare for RSI (rapid sequence intubation) with: appropriate medications (ketamine or etomidate for induction, rocuronium or succinylcholine for paralysis), airway equipment, ventilator setup, and post-intubation sedation. Ventilator settings for COPD should use low respiratory rates and prolonged expiratory times to minimize air trapping.",
    learningObjective: "Recognize BiPAP failure criteria and prepare for intubation when noninvasive ventilation is not improving respiratory status",
    blueprintCategory: "Respiratory Emergencies",
    subtopic: "COPD Exacerbation",
    difficulty: 4,
    cognitiveLevel: "evaluation",
    questionType: "MCQ_SINGLE",
    examTrap: "Decreasing consciousness on BiPAP = airway protection concern = time to intubate",
    clinicalPearls: [
      "BiPAP failure criteria: worsening ABG after 1-2 hours, decreasing consciousness, inability to clear secretions",
      "Declining consciousness is an absolute contraindication to continued noninvasive ventilation",
      "COPD ventilator strategy: low rate, prolonged expiratory time, minimize air trapping",
      "Permissive hypercapnia is acceptable in COPD - target pH improvement, not normal PaCO2"
    ],
    safetyNote: "Continuing BiPAP in a patient who cannot protect their airway risks aspiration pneumonia - intubate when criteria are met",
    distractorRationales: [
      "Increasing BiPAP won't address the declining consciousness and airway protection concern",
      "Intubation is indicated when BiPAP fails and the patient's consciousness is declining",
      "HFNC provides less ventilatory support than BiPAP and would be a step backward",
      "Heliox has limited evidence in COPD and doesn't address airway protection"
    ],
    lessonLink: "/emergency/lessons/copd-exacerbation"
  },
  {
    stem: "A 35-year-old female with no medical history presents with acute respiratory distress. She was diagnosed with influenza 5 days ago. SpO2 is 78% despite high-flow nasal cannula at 60 L/min FiO2 100%. Chest X-ray shows bilateral diffuse infiltrates. P/F ratio is 62. What condition has developed?",
    options: [
      "Bacterial pneumonia superinfection",
      "Acute respiratory distress syndrome (ARDS)",
      "Bilateral pleural effusions from heart failure",
      "Diffuse alveolar hemorrhage"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient presents with acute respiratory distress syndrome (ARDS), which is defined by the Berlin criteria: (1) acute onset (within 1 week of clinical insult or new/worsening respiratory symptoms), (2) bilateral opacities on chest imaging not fully explained by effusions, lobar collapse, or nodules, (3) respiratory failure not fully explained by cardiac failure or fluid overload (requires objective assessment such as echocardiography to exclude cardiogenic pulmonary edema), and (4) impaired oxygenation as measured by P/F ratio (PaO2/FiO2 ratio) with a minimum PEEP of 5 cm H2O. ARDS severity: Mild (P/F 200-300), Moderate (P/F 100-200), Severe (P/F < 100). This patient's P/F ratio of 62 classifies as severe ARDS. The clinical timeline (influenza diagnosis 5 days ago with progressive respiratory failure), bilateral infiltrates, and severe hypoxemia despite maximum noninvasive oxygen therapy all point to ARDS. Influenza is a well-known trigger for ARDS through direct viral pneumonitis and the resulting inflammatory cascade that damages the alveolar-capillary membrane, causing protein-rich pulmonary edema. Management of severe ARDS includes: (1) intubation and mechanical ventilation with lung-protective strategy (low tidal volume 4-6 mL/kg ideal body weight, plateau pressure < 30 cm H2O), (2) higher PEEP to maintain alveolar recruitment, (3) prone positioning for 12-16 hours/day (improves mortality by 50% in severe ARDS per the PROSEVA trial), (4) conservative fluid management, and (5) consider neuromuscular blockade in the first 48 hours for severe cases. The emergency nurse should prepare for intubation, ensure lung-protective ventilator settings are discussed, and be aware that prone positioning may be initiated early.",
    learningObjective: "Diagnose ARDS using Berlin criteria and classify severity by P/F ratio",
    blueprintCategory: "Respiratory Emergencies",
    subtopic: "ARDS",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "P/F ratio classifies ARDS severity: Mild 200-300, Moderate 100-200, Severe < 100",
    clinicalPearls: [
      "Berlin criteria: acute onset + bilateral infiltrates + not cardiogenic + P/F ratio impaired",
      "Lung-protective ventilation: Vt 4-6 mL/kg IBW, plateau pressure < 30 cm H2O",
      "Prone positioning reduces mortality by 50% in severe ARDS (PROSEVA trial)",
      "Conservative fluid management improves outcomes in ARDS"
    ],
    safetyNote: "High tidal volumes in ARDS cause ventilator-induced lung injury - strict adherence to 4-6 mL/kg IBW is essential",
    distractorRationales: [
      "Bacterial superinfection is possible but the bilateral infiltrates with severe hypoxemia indicate ARDS",
      "ARDS is the correct diagnosis based on Berlin criteria with P/F ratio of 62",
      "Heart failure would show cardiomegaly, elevated BNP, and central edema pattern",
      "Diffuse alveolar hemorrhage would present with hemoptysis and dropping hemoglobin"
    ],
    lessonLink: "/emergency/lessons/ards"
  },
  {
    stem: "A 60-year-old male presents with sudden massive hemoptysis, coughing up approximately 200 mL of bright red blood. He has a history of lung cancer. SpO2 is 91%, RR 28, BP 108/72 mmHg. What is the emergency nurse's priority positioning?",
    options: [
      "Sitting upright at 90 degrees to prevent aspiration",
      "Affected (bleeding) lung dependent (lateral decubitus with bleeding side down)",
      "Supine with head of bed flat for hemodynamic support",
      "Trendelenburg position to promote venous return"
    ],
    correctAnswer: 1,
    rationaleLong: "In massive hemoptysis (defined as > 100-600 mL in 24 hours, depending on the source), the primary cause of death is asphyxiation from blood flooding the airways, not exsanguination. Therefore, the priority is protecting the non-bleeding lung from blood aspiration. The patient should be positioned with the affected (bleeding) lung in the dependent (down) position - lateral decubitus positioning with the bleeding side down. This uses gravity to: (1) keep blood pooling in the affected lung and prevent it from crossing into the non-bleeding lung, and (2) maintain gas exchange in the unaffected (non-dependent) lung. If the side of bleeding is unknown, the patient should be positioned in whatever lateral position improves oxygenation, or remain upright. Sitting upright at 90 degrees does not specifically protect the unaffected lung and may allow blood to flow into both bronchi. Supine positioning is the worst option as it allows blood to flow freely into both lungs. Trendelenburg can cause blood to flow proximally into the trachea and potentially into the unaffected bronchus. Additional management includes: (1) establishing large-bore IV access, (2) typing and crossmatching blood, (3) administering tranexamic acid (TXA) 1 gram IV, (4) preparing for emergent bronchoscopy (for bleeding localization and potential tamponade), (5) preparing for potential selective intubation (placing the ET tube into the unaffected mainstem bronchus to isolate the bleeding lung), and (6) interventional radiology consultation for bronchial artery embolization (definitive treatment in most cases). The emergency nurse should have suction immediately available and monitor for airway compromise.",
    learningObjective: "Position massive hemoptysis patients with the bleeding lung dependent to protect the unaffected lung from blood aspiration",
    blueprintCategory: "Respiratory Emergencies",
    subtopic: "Massive Hemoptysis",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "The primary cause of death in massive hemoptysis is ASPHYXIATION, not exsanguination - protect the good lung",
    clinicalPearls: [
      "Bleeding lung DOWN (dependent) to protect the unaffected lung",
      "Primary cause of death in hemoptysis is asphyxiation, not blood loss",
      "Bronchial artery embolization is the definitive treatment for most massive hemoptysis",
      "Selective mainstem intubation can isolate and protect the non-bleeding lung"
    ],
    safetyNote: "If the bleeding side is unknown, position the patient upright or in the position that optimizes oxygenation until determined",
    distractorRationales: [
      "Upright positioning does not specifically protect the unaffected lung",
      "Bleeding lung dependent keeps blood from crossing to the unaffected lung",
      "Supine allows blood to flow freely into both lungs - worst position for hemoptysis",
      "Trendelenburg can cause blood to flow into the trachea and non-bleeding bronchus"
    ],
    lessonLink: "/emergency/lessons/massive-hemoptysis"
  },
  {
    stem: "A 40-year-old female presents with progressive dyspnea over 2 weeks. She was recently started on amiodarone for atrial fibrillation. Chest X-ray shows bilateral ground-glass opacities. Which medication-induced pulmonary toxicity should the emergency nurse suspect?",
    options: [
      "Amiodarone pulmonary toxicity causing interstitial pneumonitis",
      "Amiodarone-induced thyrotoxicosis with pulmonary edema",
      "Aspiration pneumonitis from amiodarone-related nausea",
      "Allergic bronchopulmonary reaction to amiodarone"
    ],
    correctAnswer: 0,
    rationaleLong: "Amiodarone pulmonary toxicity (APT) is one of the most serious adverse effects of amiodarone, occurring in approximately 5-7% of patients taking the drug. APT can present as interstitial pneumonitis, organizing pneumonia, or acute respiratory distress syndrome. The clinical presentation typically includes progressive dyspnea, non-productive cough, low-grade fever, and bilateral ground-glass opacities or interstitial infiltrates on chest imaging. Risk factors include higher daily doses (> 400 mg/day), longer duration of therapy (though APT can occur within weeks of starting), pre-existing lung disease, and high cumulative dose. The mechanism involves direct cytotoxic damage to pneumocytes (type II alveolar cells) and an immune-mediated inflammatory reaction. Amiodarone concentrates in lung tissue at 10-100 times the plasma concentration due to its lipophilic properties and extremely long half-life (40-55 days). Diagnosis is primarily clinical, supported by imaging findings and exclusion of other causes (infection, heart failure). Bronchoalveolar lavage may show foamy macrophages. Treatment includes: (1) immediate discontinuation of amiodarone, (2) systemic corticosteroids (prednisone 40-60 mg/day with slow taper over months), and (3) supportive care. Because of amiodarone's extremely long half-life, symptoms may persist or even worsen for weeks after discontinuation. The emergency nurse should be aware that APT can develop at any time during therapy and should inquire about amiodarone use in any patient presenting with unexplained respiratory symptoms. Amiodarone-induced thyrotoxicosis can occur but would not explain bilateral ground-glass opacities.",
    learningObjective: "Recognize amiodarone pulmonary toxicity as a cause of progressive dyspnea with bilateral ground-glass opacities",
    blueprintCategory: "Respiratory Emergencies",
    subtopic: "Drug-Induced Pulmonary Disease",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Amiodarone pulmonary toxicity can occur weeks to years after starting therapy - always ask about medication history",
    clinicalPearls: [
      "APT occurs in 5-7% of amiodarone users and can be fatal",
      "Amiodarone concentrates in lung tissue at 10-100x plasma levels",
      "Amiodarone half-life is 40-55 days - toxicity may persist weeks after discontinuation",
      "Treatment: stop amiodarone + systemic corticosteroids with slow taper"
    ],
    safetyNote: "Patients on amiodarone should have baseline and periodic pulmonary function tests and chest X-rays to detect early toxicity",
    distractorRationales: [
      "APT causing interstitial pneumonitis best explains the progressive dyspnea and bilateral ground-glass opacities",
      "Thyrotoxicosis would present with tachycardia and weight loss, not ground-glass opacities",
      "Aspiration pneumonitis presents acutely and is typically unilateral or dependent segments",
      "Allergic bronchopulmonary reactions present with wheezing and eosinophilia, not ground-glass opacities"
    ],
    lessonLink: "/emergency/lessons/drug-induced-pulmonary-disease"
  },
  {
    stem: "A 25-year-old male with cystic fibrosis presents with worsening dyspnea and thick, green sputum production. His SpO2 is 90% on his usual 2 L/min home oxygen. He has a history of Pseudomonas colonization. What is the most appropriate initial antibiotic approach?",
    options: [
      "Oral azithromycin 500 mg as outpatient treatment",
      "IV anti-pseudomonal antibiotics (piperacillin-tazobactam) with inhaled tobramycin",
      "IV ceftriaxone 2 grams for community-acquired pneumonia coverage",
      "Oral amoxicillin-clavulanate 875 mg twice daily"
    ],
    correctAnswer: 1,
    rationaleLong: "Patients with cystic fibrosis (CF) and known Pseudomonas aeruginosa colonization who present with acute pulmonary exacerbation require IV anti-pseudomonal antibiotic therapy. Pseudomonas aeruginosa is the most common pathogen in adult CF patients, colonizing the airways of approximately 60-80% of adults with CF. CF pulmonary exacerbations are defined by increased sputum production, change in sputum color or consistency, worsening dyspnea, decreased exercise tolerance, and declining pulmonary function. The antibiotic regimen for CF exacerbations with Pseudomonas typically includes: (1) an IV anti-pseudomonal beta-lactam (piperacillin-tazobactam, ceftazidime, cefepime, meropenem, or aztreonam) PLUS (2) an IV or inhaled aminoglycoside (tobramycin) for synergistic killing. The combination provides broad anti-pseudomonal coverage and minimizes the development of resistance. Inhaled tobramycin delivers high drug concentrations directly to the infected airways while minimizing systemic toxicity. Treatment duration is typically 14-21 days, often initiated in the hospital and completed at home with IV access. Standard community-acquired pneumonia antibiotics (ceftriaxone, azithromycin, amoxicillin-clavulanate) are inadequate because they have poor anti-pseudomonal activity. Oral antibiotics alone are generally insufficient for acute CF exacerbations with worsening symptoms and oxygen requirements. Additional management includes: aggressive chest physiotherapy and airway clearance techniques, hypertonic saline nebulization to thin secretions, dornase alfa (Pulmozyme) if the patient uses it at home, and nutritional support. The emergency nurse should prepare for IV access (often a PICC line for prolonged therapy), obtain sputum cultures to guide antibiotic therapy, and coordinate with the patient's CF care center.",
    learningObjective: "Select anti-pseudomonal antibiotics for CF pulmonary exacerbations with known Pseudomonas colonization",
    blueprintCategory: "Respiratory Emergencies",
    subtopic: "Cystic Fibrosis Exacerbation",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Standard pneumonia antibiotics (ceftriaxone, azithromycin) are NOT effective against Pseudomonas in CF patients",
    clinicalPearls: [
      "Pseudomonas colonizes 60-80% of adult CF patients",
      "CF exacerbations need anti-pseudomonal beta-lactam + aminoglycoside combination",
      "Inhaled tobramycin delivers high local concentrations with minimal systemic toxicity",
      "Always obtain sputum cultures before starting antibiotics in CF patients"
    ],
    safetyNote: "Monitor aminoglycoside levels closely in CF patients to prevent nephrotoxicity and ototoxicity",
    distractorRationales: [
      "Azithromycin has no anti-pseudomonal activity and is inadequate for this presentation",
      "Anti-pseudomonal IV antibiotics with inhaled tobramycin is the correct approach for CF with Pseudomonas",
      "Ceftriaxone lacks adequate anti-pseudomonal activity",
      "Oral amoxicillin-clavulanate has no anti-pseudomonal coverage"
    ],
    lessonLink: "/emergency/lessons/cystic-fibrosis"
  },
  {
    stem: "A 50-year-old female presents with acute stridor after eating at a restaurant. She has facial and tongue swelling. She recently started lisinopril 2 weeks ago. She denies any allergic history or previous similar episodes. Which condition should the emergency nurse suspect?",
    options: [
      "Anaphylaxis to food allergen requiring epinephrine",
      "ACE inhibitor-induced angioedema requiring supportive care and drug discontinuation",
      "Hereditary angioedema from C1 esterase inhibitor deficiency",
      "Foreign body aspiration from food"
    ],
    correctAnswer: 1,
    rationaleLong: "The clinical presentation of angioedema (facial and tongue swelling) with stridor in a patient recently started on lisinopril (an ACE inhibitor) is most consistent with ACE inhibitor-induced angioedema (ACEi-AE). ACEi-AE occurs in approximately 0.1-0.7% of patients taking ACE inhibitors and is caused by the accumulation of bradykinin, which is normally degraded by ACE. When ACE is inhibited, bradykinin levels increase, causing vasodilation and increased vascular permeability, leading to angioedema. Key distinguishing features from anaphylaxis include: (1) ACEi-AE typically involves the face, lips, tongue, and larynx WITHOUT urticaria (hives), (2) no associated bronchospasm or hypotension (unless airway obstruction causes hypoxia), (3) no pruritus, and (4) ACEi-AE does NOT respond to epinephrine, antihistamines, or corticosteroids because the mechanism is bradykinin-mediated, not histamine-mediated. ACEi-AE can occur at any time during therapy but often presents within the first few weeks to months. It has a higher incidence in African American patients. Management includes: (1) immediate discontinuation of the ACE inhibitor (permanently), (2) airway management is the priority - prepare for intubation or surgical airway if stridor progresses, (3) consider icatibant (bradykinin B2 receptor antagonist) or C1 esterase inhibitor concentrate (off-label but may be effective), (4) observation for at least 6-12 hours as angioedema can progress. If there is any doubt about anaphylaxis vs ACEi-AE, administer epinephrine first (it won't hurt even if it doesn't help). Hereditary angioedema is possible but the recent ACE inhibitor start is a more likely trigger.",
    learningObjective: "Recognize ACE inhibitor-induced angioedema as a bradykinin-mediated condition distinct from histamine-mediated anaphylaxis",
    blueprintCategory: "Respiratory Emergencies",
    subtopic: "Angioedema",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "ACE inhibitor angioedema does NOT respond to epinephrine or antihistamines - it's bradykinin-mediated, not histamine-mediated",
    clinicalPearls: [
      "ACEi angioedema: face/tongue/lip swelling WITHOUT urticaria or bronchospasm",
      "Does not respond to epinephrine, antihistamines, or corticosteroids",
      "Higher incidence in African Americans (up to 5x higher risk)",
      "Can occur at any time during therapy - even after years of use"
    ],
    safetyNote: "If uncertain between anaphylaxis and ACEi angioedema, give epinephrine first - it won't cause harm even if ineffective",
    distractorRationales: [
      "Anaphylaxis would typically present with urticaria, bronchospasm, and hypotension",
      "ACEi angioedema is most likely given the recent lisinopril start and presentation without hives",
      "Hereditary angioedema is possible but ACE inhibitor use is a more likely trigger",
      "Foreign body aspiration would have acute choking, not progressive swelling"
    ],
    lessonLink: "/emergency/lessons/angioedema"
  },
  {
    stem: "A 78-year-old male resident of a nursing home presents with fever, productive cough with rust-colored sputum, and right-sided pleuritic chest pain. Chest X-ray shows right lower lobe consolidation with air bronchograms. Which pathogen is the most likely cause?",
    options: [
      "Staphylococcus aureus",
      "Streptococcus pneumoniae",
      "Klebsiella pneumoniae",
      "Mycoplasma pneumoniae"
    ],
    correctAnswer: 1,
    rationaleLong: "The clinical presentation of acute onset fever, productive cough with rust-colored sputum, pleuritic chest pain, and lobar consolidation with air bronchograms on chest X-ray is the classic presentation of Streptococcus pneumoniae (pneumococcal) pneumonia. S. pneumoniae remains the most common cause of community-acquired pneumonia (CAP) across all age groups and clinical settings, including nursing home residents. The 'rust-colored' sputum is a classic teaching point - it results from alveolar hemorrhage mixing with inflammatory exudate, creating the characteristic rusty appearance that is highly suggestive of pneumococcal infection. The lobar consolidation with air bronchograms indicates complete filling of alveolar spaces with inflammatory exudate while the bronchi remain air-filled, creating the air bronchogram sign on X-ray. This pattern of lobar pneumonia is typical of S. pneumoniae. Staphylococcus aureus pneumonia tends to present with necrotizing pneumonia, multiple cavitary lesions, and is commonly seen after influenza or in ICU patients. Klebsiella pneumoniae (Friedlander's pneumonia) is associated with alcoholism and immunocompromise, classically causing upper lobe cavitary pneumonia with 'currant jelly' sputum (thick, bloody mucus). Mycoplasma pneumoniae causes atypical pneumonia with dry cough, diffuse bilateral interstitial infiltrates (not focal consolidation), and tends to affect younger patients. Empiric treatment for CAP in a nursing home resident should cover typical and atypical organisms: a respiratory fluoroquinolone (levofloxacin 750 mg) or a beta-lactam (ceftriaxone) plus a macrolide (azithromycin).",
    learningObjective: "Identify Streptococcus pneumoniae as the classic pathogen for lobar pneumonia with rust-colored sputum",
    blueprintCategory: "Respiratory Emergencies",
    subtopic: "Pneumonia",
    difficulty: 2,
    cognitiveLevel: "recall",
    questionType: "MCQ_SINGLE",
    examTrap: "Rust-colored sputum + lobar consolidation + air bronchograms = classic Streptococcus pneumoniae pneumonia",
    clinicalPearls: [
      "S. pneumoniae is the #1 cause of CAP across all age groups",
      "Rust-colored sputum is characteristic of pneumococcal pneumonia",
      "Air bronchograms indicate alveolar consolidation with patent airways",
      "Empiric CAP treatment: respiratory fluoroquinolone OR beta-lactam + macrolide"
    ],
    safetyNote: "Obtain blood cultures before antibiotics in hospitalized pneumonia patients - do not delay antibiotics for cultures in septic patients",
    distractorRationales: [
      "S. aureus causes necrotizing/cavitary pneumonia, often post-influenza",
      "S. pneumoniae is the classic cause of lobar pneumonia with rust-colored sputum",
      "Klebsiella causes upper lobe cavitary pneumonia with currant jelly sputum in alcoholics",
      "Mycoplasma causes atypical pneumonia with dry cough and interstitial infiltrates"
    ],
    lessonLink: "/emergency/lessons/pneumonia"
  },
  {
    stem: "A 28-year-old female with a history of anxiety presents with severe dyspnea, chest tightness, and bilateral hand tingling. RR is 32, SpO2 99% on room air. ABG shows pH 7.52, PaCO2 24 mmHg, PaO2 108 mmHg. Before diagnosing hyperventilation syndrome, what must the emergency nurse ensure?",
    options: [
      "That the patient has a documented history of panic attacks",
      "That all organic causes of tachypnea have been excluded",
      "That the patient responds to reassurance and coaching of slow breathing",
      "That the patient's chest X-ray is normal"
    ],
    correctAnswer: 1,
    rationaleLong: "Hyperventilation syndrome is a diagnosis of exclusion, meaning that all organic (physiological) causes of tachypnea must be systematically excluded before attributing the presentation to anxiety or psychogenic hyperventilation. This is critically important because many life-threatening conditions can present with hyperventilation and respiratory alkalosis, including: pulmonary embolism, metabolic acidosis (the body hyperventilates to compensate for metabolic acid, such as in DKA or sepsis), acute asthma, early pneumothorax, aspirin toxicity (which causes primary respiratory alkalosis), CNS pathology (stroke, meningitis), and cardiac ischemia. The ABG in this patient shows respiratory alkalosis (elevated pH, low PaCO2, normal PaO2), which is consistent with hyperventilation but does not differentiate between psychogenic and organic causes. The bilateral hand tingling (carpal pedal spasm) is caused by alkalosis-induced hypocalcemia - when blood pH rises, more calcium binds to albumin, reducing ionized calcium levels and causing neuromuscular excitability. While this is classic for hyperventilation syndrome, it can occur from any cause of respiratory alkalosis. A history of panic attacks is helpful context but does not exclude concurrent organic disease. Response to coaching is encouraging but does not rule out organic causes (a patient with PE may temporarily slow their breathing with coaching but will resume tachypnea as hypoxemia worsens). A normal chest X-ray does not exclude PE, early pneumothorax, or cardiac causes. The emergency nurse should obtain a thorough history, perform a complete physical examination, and obtain appropriate diagnostic studies (ECG, chest X-ray, basic metabolic panel, consider D-dimer or CT angiography based on clinical suspicion) before concluding the diagnosis is psychogenic.",
    learningObjective: "Recognize hyperventilation syndrome as a diagnosis of exclusion requiring systematic evaluation for organic causes",
    blueprintCategory: "Respiratory Emergencies",
    subtopic: "Hyperventilation Syndrome",
    difficulty: 3,
    cognitiveLevel: "evaluation",
    questionType: "MCQ_SINGLE",
    examTrap: "Never assume tachypnea is anxiety until PE, DKA, aspirin toxicity, and other organic causes are excluded",
    clinicalPearls: [
      "Hyperventilation syndrome is a diagnosis of EXCLUSION",
      "Respiratory alkalosis occurs in PE, DKA compensation, aspirin toxicity, and CNS pathology",
      "Carpopedal spasm is caused by alkalosis-induced hypocalcemia",
      "Never use a paper bag for hyperventilation - can worsen hypoxemia if organic cause is present"
    ],
    safetyNote: "NEVER use the paper bag rebreathing technique - it can cause hypoxemia and death if the hyperventilation has an organic cause",
    distractorRationales: [
      "History of panic attacks does not exclude concurrent organic disease",
      "All organic causes must be excluded before diagnosing psychogenic hyperventilation",
      "Response to coaching does not rule out organic causes of tachypnea",
      "Normal chest X-ray does not exclude PE, cardiac causes, or metabolic derangements"
    ],
    lessonLink: "/emergency/lessons/hyperventilation-syndrome"
  },
  {
    stem: "A 65-year-old male presents with worsening dyspnea, orthopnea, and paroxysmal nocturnal dyspnea. On examination, he has bilateral crackles to the mid-lung fields, S3 gallop, and bilateral lower extremity edema. BNP is 1,850 pg/mL. What should the emergency nurse administer first?",
    options: [
      "IV furosemide 40-80 mg for acute diuresis",
      "Oral metoprolol 25 mg for heart rate control",
      "IV dobutamine 5 mcg/kg/min for inotropic support",
      "Oral lisinopril 10 mg for afterload reduction"
    ],
    correctAnswer: 0,
    rationaleLong: "This patient presents with acute decompensated heart failure (ADHF) characterized by the classic symptom triad of dyspnea, orthopnea, and paroxysmal nocturnal dyspnea, along with physical findings of volume overload (bilateral crackles, lower extremity edema) and systolic dysfunction (S3 gallop). The markedly elevated BNP (1,850 pg/mL, normal < 100) confirms heart failure. The first-line pharmacologic treatment for ADHF with volume overload is IV loop diuretic therapy, specifically IV furosemide 40-80 mg (or 1-2x the patient's oral home dose if known). IV furosemide works within 5-15 minutes when given intravenously, producing rapid diuresis and volume reduction. It also has an early venodilatory effect (within minutes, before diuresis begins) that reduces preload and provides immediate symptomatic relief. The IV route is essential because gut edema from right-sided heart failure impairs absorption of oral medications. Additional first-line measures include: positioning the patient upright (high Fowler's position), applying supplemental oxygen to maintain SpO2 > 94%, nitroglycerin for preload/afterload reduction if blood pressure is adequate (SBP > 90), and BiPAP if respiratory distress is severe. Oral metoprolol should NOT be initiated acutely in decompensated heart failure as beta-blockers can worsen acute decompensation. While beta-blockers are essential chronic heart failure medications, they should be started or uptitrated only when the patient is euvolemic and stable. IV dobutamine is reserved for cardiogenic shock (SBP < 90 with signs of hypoperfusion), not for volume-overloaded patients with adequate blood pressure. Oral lisinopril acts too slowly for acute management and oral absorption is impaired.",
    learningObjective: "Initiate IV loop diuretic therapy as first-line treatment for acute decompensated heart failure with volume overload",
    blueprintCategory: "Respiratory Emergencies",
    subtopic: "Acute Heart Failure",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Do NOT start or increase beta-blockers during acute decompensated heart failure - they can worsen hemodynamics",
    clinicalPearls: [
      "IV furosemide onset: 5-15 minutes IV, 30-60 minutes oral",
      "IV diuretics have early venodilatory effect before diuresis begins",
      "BNP > 400 pg/mL strongly suggests heart failure; BNP < 100 largely excludes it",
      "S3 gallop indicates volume overload and systolic dysfunction"
    ],
    safetyNote: "Monitor potassium closely with loop diuretics - hypokalemia can cause dangerous arrhythmias, especially in heart failure patients on digoxin",
    distractorRationales: [
      "IV furosemide is first-line for acute volume overload in decompensated heart failure",
      "Beta-blockers should not be initiated during acute decompensation",
      "Dobutamine is reserved for cardiogenic shock with hypotension, not volume overload",
      "Oral medications are poorly absorbed in gut edema and act too slowly for acute management"
    ],
    lessonLink: "/emergency/lessons/acute-heart-failure"
  },
  {
    stem: "A 45-year-old obese male is found obtunded with pinpoint pupils. RR is 4, SpO2 70% on room air. An empty bottle of oxycodone is found nearby. After administering naloxone 0.4 mg IV with return of spontaneous respirations, the patient's RR improves to 16 and SpO2 to 95%. Twenty minutes later, his RR drops back to 6 and SpO2 is 82%. Why is this occurring?",
    options: [
      "The naloxone dose was insufficient and a higher dose is needed",
      "The naloxone half-life (30-90 minutes) is shorter than the opioid's duration of action",
      "The patient has taken additional opioids since the initial naloxone dose",
      "The patient has developed opioid-induced pulmonary edema"
    ],
    correctAnswer: 1,
    rationaleLong: "The recurrence of respiratory depression after initial naloxone response is due to the pharmacokinetic mismatch between naloxone and most opioids. Naloxone (Narcan) has a relatively short half-life of 30-90 minutes, while most opioids of abuse (oxycodone, methadone, morphine, fentanyl patches, extended-release formulations) have significantly longer durations of action. When the naloxone wears off, the opioid that is still circulating in the body re-occupies the opioid receptors, causing recurrent respiratory depression - this is called 're-narcotization.' This is a critical concept for emergency nurses because: (1) patients who respond to naloxone MUST be monitored for at least 2-4 hours after the last naloxone dose (longer for long-acting opioids like methadone, which can have a half-life of 8-59 hours), (2) recurrent respiratory depression requires repeat naloxone dosing or a continuous naloxone infusion (typically 2/3 of the effective bolus dose per hour), and (3) patients should NEVER be discharged immediately after naloxone reversal because of re-narcotization risk. The initial 0.4 mg dose was effective (it reversed the respiratory depression), so a higher dose is not needed - the same dose should be repeated. The patient was obtunded and found with the empty bottle, making additional opioid ingestion unlikely. Opioid-induced pulmonary edema (negative pressure pulmonary edema) is possible but the recurrence pattern matching naloxone duration is more consistent with re-narcotization. The emergency nurse should administer a repeat naloxone dose, consider starting a naloxone infusion, and ensure continuous monitoring with capnography.",
    learningObjective: "Understand re-narcotization as a consequence of naloxone's shorter half-life compared to most opioids",
    blueprintCategory: "Respiratory Emergencies",
    subtopic: "Opioid Overdose",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Naloxone half-life (30-90 min) is SHORTER than most opioids - always monitor for re-narcotization for 2-4+ hours",
    clinicalPearls: [
      "Naloxone half-life: 30-90 minutes vs opioid durations of 4-72+ hours",
      "Re-narcotization: respiratory depression returns as naloxone wears off",
      "Naloxone infusion: 2/3 of effective bolus dose per hour",
      "Extended monitoring needed: methadone (8-59 hr half-life), extended-release opioids"
    ],
    safetyNote: "NEVER discharge a patient immediately after naloxone reversal - monitor for re-narcotization for at least 2-4 hours (longer for long-acting opioids)",
    distractorRationales: [
      "The initial dose was effective, so the same dose should be repeated, not increased",
      "Re-narcotization from naloxone's shorter half-life is the correct explanation",
      "The patient was obtunded and unable to take additional opioids",
      "Pulmonary edema is possible but the timing pattern matches re-narcotization"
    ],
    lessonLink: "/emergency/lessons/opioid-overdose"
  },
  {
    stem: "A 33-year-old female scuba diver ascends rapidly from 100 feet to the surface after running out of air. She presents with severe chest pain, subcutaneous emphysema in the neck, and hoarse voice. SpO2 is 88%. Chest X-ray shows pneumomediastinum. What is the most likely diagnosis?",
    options: [
      "Decompression sickness (the bends)",
      "Pulmonary barotrauma with arterial gas embolism",
      "Tension pneumothorax from alveolar rupture",
      "Nitrogen narcosis with delayed effects"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient presents with pulmonary barotrauma following a rapid ascent from depth. During ascent, the surrounding water pressure decreases, causing gas in the lungs to expand according to Boyle's law (as pressure decreases, gas volume increases proportionally). If the diver does not exhale during ascent (such as during an emergency ascent after running out of air), the expanding gas can rupture alveoli, causing: (1) pneumomediastinum (air dissecting along the mediastinum, as seen in this patient), (2) subcutaneous emphysema (air tracking into the neck soft tissues), (3) pneumothorax (air entering the pleural space), and (4) arterial gas embolism (AGE) - the most feared complication, where air enters the pulmonary vasculature and travels to the systemic arterial circulation, potentially causing stroke, myocardial infarction, or sudden death. The combination of pneumomediastinum, subcutaneous emphysema, and respiratory symptoms following rapid ascent is diagnostic of pulmonary barotrauma. The most dangerous complication is AGE, which requires emergent recompression (hyperbaric oxygen therapy). The emergency nurse should: (1) place the patient on 100% oxygen via non-rebreather, (2) position supine (not Trendelenburg, which was previously recommended), (3) obtain IV access for fluid resuscitation, (4) arrange emergent transfer to the nearest hyperbaric chamber, (5) monitor for neurological signs of AGE (focal deficits, altered consciousness, seizures). Decompression sickness (DCS) from dissolved nitrogen forming bubbles in tissues can present similarly but typically has a more gradual onset (minutes to hours after surfacing) with joint pain ('the bends'), skin mottling, and neurological symptoms. Nitrogen narcosis resolves upon ascent and does not cause delayed symptoms.",
    learningObjective: "Recognize pulmonary barotrauma from rapid ascent and prepare for emergent hyperbaric oxygen therapy",
    blueprintCategory: "Respiratory Emergencies",
    subtopic: "Diving Emergencies",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Pulmonary barotrauma from rapid ascent = immediate onset; DCS (the bends) = delayed onset minutes to hours after surfacing",
    clinicalPearls: [
      "Boyle's law: gas volume increases as pressure decreases during ascent",
      "Pneumomediastinum + subcutaneous emphysema after diving = pulmonary barotrauma",
      "Arterial gas embolism is the most feared complication - requires hyperbaric O2",
      "Position patient supine (NOT Trendelenburg) and administer 100% O2"
    ],
    safetyNote: "Contact the Divers Alert Network (DAN) emergency hotline for guidance on hyperbaric chamber location and diving emergency management",
    distractorRationales: [
      "DCS has a more gradual onset and presents with joint pain and skin mottling",
      "Pulmonary barotrauma with AGE risk best explains the immediate symptoms after rapid ascent",
      "Tension pneumothorax may develop but pneumomediastinum is the primary finding",
      "Nitrogen narcosis resolves upon ascent and does not cause post-ascent symptoms"
    ],
    lessonLink: "/emergency/lessons/diving-emergencies"
  },
  {
    stem: "A 72-year-old female is intubated for respiratory failure. The ventilator alarm sounds with high peak airway pressures. The emergency nurse notices the patient is becoming increasingly agitated. SpO2 drops to 85%. What systematic approach should the nurse use to troubleshoot?",
    options: [
      "Increase the FiO2 to 100% and call respiratory therapy",
      "Disconnect the patient from the ventilator and hand-ventilate with BVM while assessing DOPE mnemonic",
      "Suction the endotracheal tube and increase PEEP to improve oxygenation",
      "Administer a sedation bolus to reduce patient-ventilator asynchrony"
    ],
    correctAnswer: 1,
    rationaleLong: "When a ventilator alarms with high peak pressures and the patient is desaturating, the systematic approach is to disconnect the patient from the ventilator, hand-ventilate with a bag-valve mask (BVM) connected to 100% oxygen, and assess using the DOPE mnemonic. This approach immediately determines whether the problem is with the patient or the ventilator. If hand ventilation is easy and the patient improves, the problem is with the ventilator circuit. If hand ventilation is difficult, the problem is with the patient or the tube. DOPE mnemonic: D - Displacement: Is the endotracheal tube displaced (too deep into right mainstem bronchus or pulled back into the pharynx)? Check tube depth marking at the lip, listen for bilateral breath sounds, and use capnography. O - Obstruction: Is the tube obstructed by mucus plug, blood clot, or the patient biting the tube? Pass a suction catheter through the ET tube. If the catheter won't pass, the tube is obstructed and may need to be replaced. P - Pneumothorax: Has a pneumothorax developed? Assess for unilateral absent breath sounds, tracheal deviation, subcutaneous emphysema, and hemodynamic instability. Tension pneumothorax requires immediate needle decompression. E - Equipment failure: Is there a problem with the ventilator circuit (kinked tubing, disconnected circuit, water in the circuit, malfunctioning valve)? Simply increasing FiO2 or sedation without identifying the cause can be dangerous - a tension pneumothorax or displaced tube requires immediate specific intervention. Suctioning may help if the problem is a mucus plug but should not be done blindly without the systematic DOPE assessment. The BVM allows direct assessment of lung compliance and airway resistance.",
    learningObjective: "Apply the DOPE mnemonic for systematic troubleshooting of ventilator emergencies",
    blueprintCategory: "Respiratory Emergencies",
    subtopic: "Ventilator Management",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "When the ventilator alarms, disconnect and hand-ventilate first - this quickly distinguishes patient problems from machine problems",
    clinicalPearls: [
      "DOPE: Displacement, Obstruction, Pneumothorax, Equipment failure",
      "Disconnect and hand-ventilate to determine if the problem is patient or machine",
      "Easy hand ventilation = machine problem; difficult hand ventilation = patient/tube problem",
      "Always have BVM at the bedside of every intubated patient"
    ],
    safetyNote: "Never increase sedation for ventilator alarms without first ruling out displacement, obstruction, and pneumothorax",
    distractorRationales: [
      "Increasing FiO2 without identifying the cause delays treatment of potentially lethal causes",
      "Disconnecting and hand-ventilating with DOPE assessment is the correct systematic approach",
      "Suctioning addresses only one of several possible causes and skips the systematic assessment",
      "Sedation without ruling out life-threatening causes (pneumothorax, displacement) is dangerous"
    ],
    lessonLink: "/emergency/lessons/ventilator-management"
  },
  {
    stem: "A 58-year-old female with a tracheostomy presents with acute respiratory distress. The inner cannula is clogged with dried secretions and cannot be cleared with suctioning. SpO2 is dropping to 76%. The emergency nurse removes the inner cannula but the patient remains obstructed. What is the next step?",
    options: [
      "Attempt to pass a suction catheter through the outer cannula to clear the obstruction",
      "Remove the entire tracheostomy tube and ventilate through the stoma",
      "Cover the stoma and attempt oral endotracheal intubation",
      "Administer nebulized saline through the tracheostomy to loosen secretions"
    ],
    correctAnswer: 1,
    rationaleLong: "When a tracheostomy becomes obstructed and cannot be cleared by removing the inner cannula or suctioning, the emergency algorithm requires removal of the entire tracheostomy tube. This allows: (1) direct ventilation through the stoma opening using a BVM with a pediatric mask or a tracheostomy mask placed over the stoma, (2) insertion of a smaller tracheostomy tube or endotracheal tube through the stoma to re-establish the artificial airway. The emergency tracheostomy management algorithm follows this sequence: (1) Remove inner cannula and attempt suction → (2) If still obstructed, remove the entire tracheostomy tube → (3) Attempt to ventilate through the stoma (with or without a replacement tube) → (4) If stoma ventilation fails, cover the stoma and attempt orotracheal intubation from above. The stoma should be attempted first because it is an established surgical airway that provides the most direct route for ventilation. The stoma tract is already formed and a replacement tube or standard ET tube can often be passed through it. If the stoma has recently been created (< 7 days) or is stenotic, the tract may close rapidly after tube removal, making reinsertion difficult - in this case, oral intubation may be needed. Attempting to pass a suction catheter through an obstructed outer cannula wastes time when the patient is critically desaturating. Nebulized saline is a maintenance technique, not an emergency intervention for acute obstruction at SpO2 76%. The emergency nurse should always have a replacement tracheostomy tube (same size and one size smaller), an ETT, and a BVM at the bedside of every tracheostomy patient.",
    learningObjective: "Follow the emergency tracheostomy obstruction algorithm: remove inner cannula → remove entire tube → stoma ventilation → oral intubation",
    blueprintCategory: "Respiratory Emergencies",
    subtopic: "Tracheostomy Emergencies",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Don't be afraid to remove the entire tracheostomy tube in an emergency - the stoma provides an established airway",
    clinicalPearls: [
      "Tracheostomy emergency algorithm: remove inner cannula → suction → remove entire tube → stoma ventilation",
      "Keep replacement tracheostomy tube (same size + one size smaller) and ETT at bedside",
      "A pediatric face mask can be used over the stoma for BVM ventilation",
      "If stoma is < 7 days old, the tract may close rapidly after tube removal"
    ],
    safetyNote: "Every tracheostomy patient must have emergency airway equipment at the bedside: replacement tubes, ETT, BVM, and suction",
    distractorRationales: [
      "Suctioning through an obstructed outer cannula wastes critical time",
      "Removing the entire tube and ventilating through the stoma is the correct next step",
      "Oral intubation is a backup option if stoma ventilation fails",
      "Nebulized saline is a maintenance technique, not an emergency intervention"
    ],
    lessonLink: "/emergency/lessons/tracheostomy-emergencies"
  }
];
