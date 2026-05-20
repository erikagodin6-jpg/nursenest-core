import type { LessonContent } from "./types";

export const rrtPulmonaryDiseasesLessons: Record<string, LessonContent> = {
  "pulmonary-embolism-rrt": {
    title: "Pulmonary Embolism",
    cellular: `Pulmonary embolism (PE) is the obstruction of one or more pulmonary arteries by a thrombus that typically originates from the deep venous system (DVT), most commonly the iliofemoral veins. PE is a life-threatening cardiopulmonary emergency that respiratory therapists must recognize and manage rapidly because it directly impairs gas exchange through creation of dead space ventilation and can precipitate acute right ventricular failure.

When a thrombus lodges in the pulmonary vasculature, it creates ventilated but unperfused alveoli — physiological dead space. The V/Q ratio in affected areas approaches infinity. Unaffected lung regions must compensate by increasing both ventilation and perfusion, leading to low V/Q units in those regions. The net result is hypoxemia from V/Q mismatch and increased A-a gradient. PaCO2 may be low initially due to reflex hyperventilation driven by hypoxemia and stimulation of juxta-capillary (J) receptors. In massive PE, cardiac output falls as the right ventricle fails against the acute increase in pulmonary vascular resistance, leading to systemic hypotension, decreased mixed venous oxygen saturation, and worsening hypoxemia.

Pulmonary infarction occurs in approximately 10-15% of PE cases, typically when distal segmental or subsegmental arteries are occluded and bronchial artery collateral flow is insufficient. Infarction produces wedge-shaped opacities on chest imaging (Hampton hump) and may cause hemoptysis, pleuritic chest pain, and pleural effusion.

The hemodynamic consequences of PE depend on clot burden and pre-existing cardiopulmonary reserve. Massive PE (>50% vascular occlusion or hemodynamic instability) causes acute right ventricular pressure overload. The RV dilates, interventricular septum shifts leftward (D-sign on echocardiography), LV filling is impaired, and cardiac output drops. This is obstructive shock. Submassive PE shows RV dysfunction without systemic hypotension but carries risk of deterioration.

US Protocol Notes (NBRC): The NBRC TMC and CSE exams emphasize recognition of PE as a cause of acute respiratory failure with widened A-a gradient, refractory hypoxemia despite supplemental oxygen, and hemodynamic instability. Understanding the pathophysiology of dead space ventilation in PE is a high-yield topic.

Canadian Protocol Notes (CBRC): Canadian guidelines follow the Canadian Thoracic Society recommendations for PE diagnosis and management. CTPA is the primary diagnostic imaging modality. Canadian RTs should be familiar with the Wells score for pre-test probability assessment and the use of D-dimer in low-probability patients. Canadian standards emphasize the RT role in monitoring anticoagulation therapy and recognizing signs of PE recurrence.`,
    riskFactors: [
      "Virchow's triad: venous stasis (immobilization, prolonged bed rest, long-distance travel), endothelial injury (surgery, trauma, central lines), and hypercoagulability (malignancy, oral contraceptives, inherited thrombophilias)",
      "Recent surgery especially orthopedic (hip/knee replacement) and abdominal procedures",
      "Active malignancy with associated hypercoagulable state",
      "Obesity (BMI > 30) increasing venous stasis and inflammatory prothrombotic state",
      "Pregnancy and postpartum period with increased clotting factor levels",
      "History of prior DVT/PE — recurrence rate 30% without anticoagulation",
      "Prolonged mechanical ventilation and ICU immobilization",
      "Central venous catheter placement — catheter-related thrombosis",
      "Heart failure with reduced cardiac output and venous congestion"
    ],
    diagnostics: [
      "CT pulmonary angiography (CTPA) — gold standard imaging for PE diagnosis with sensitivity >95%",
      "D-dimer assay — high negative predictive value in low pre-test probability patients (Wells score ≤4)",
      "ABG showing hypoxemia with widened A-a gradient and respiratory alkalosis from hyperventilation",
      "ECG: sinus tachycardia most common; classic S1Q3T3 pattern in massive PE; right axis deviation; new RBBB",
      "Echocardiography for RV dilation, septal bowing, McConnell sign (RV free wall akinesis with apical sparing)",
      "Lower extremity compression ultrasonography for concurrent DVT (positive in 50-70% of PE patients)",
      "Ventilation-perfusion (V/Q) scan when CTPA is contraindicated (renal insufficiency, contrast allergy)",
      "Troponin and BNP/NT-proBNP for risk stratification — elevated levels indicate RV strain"
    ],
    management: [
      "Supplemental oxygen to maintain SpO2 ≥ 92% — PE may cause refractory hypoxemia requiring high-flow oxygen",
      "Anticoagulation: unfractionated heparin bolus 80 units/kg then 18 units/kg/hr infusion, target aPTT 60-80 seconds",
      "Massive PE with hemodynamic instability: systemic thrombolysis (alteplase 100 mg IV over 2 hours)",
      "Submassive PE: anticoagulation with close monitoring; consider thrombolysis if clinical deterioration",
      "Mechanical ventilation if needed: use lung-protective settings; avoid excessive PEEP which further impedes RV function",
      "Fluid resuscitation: cautious small boluses (250-500 mL) — excessive fluid worsens RV dilation",
      "Vasopressors (norepinephrine) for persistent hypotension after initial fluid resuscitation",
      "Surgical embolectomy or catheter-directed therapy for massive PE when thrombolysis is contraindicated",
      "IVC filter placement when anticoagulation is absolutely contraindicated"
    ],
    nursingActions: [
      "Assess Wells score criteria to support clinical pre-test probability estimation",
      "Administer supplemental oxygen and titrate to target SpO2 — document response to oxygen therapy",
      "Monitor for signs of hemodynamic deterioration: tachycardia, hypotension, JVD, altered mental status",
      "Maintain IV access for heparin infusion and draw aPTT per protocol (typically q6h until therapeutic)",
      "Position patient upright (30-45 degrees) unless hemodynamically unstable — improves V/Q matching",
      "Assess for signs of bleeding during anticoagulation therapy: hematuria, melena, bruising, gum bleeding",
      "Prepare for emergent intubation if respiratory failure progresses — pre-oxygenate with 100% FiO2",
      "Implement DVT prophylaxis for all hospitalized patients: SCDs, early ambulation, pharmacologic prophylaxis"
    ],
    signs: [
      "Acute dyspnea with tachypnea (most common presentation) — often sudden onset at rest",
      "Pleuritic chest pain (sharp, worse with inspiration) in peripheral PE with pulmonary infarction",
      "Tachycardia (HR > 100) out of proportion to clinical situation",
      "Hypoxemia with widened A-a gradient not responsive to low-flow supplemental oxygen",
      "Hemoptysis from pulmonary infarction (present in 10-15% of cases)",
      "Signs of right heart failure: elevated JVP, new loud P2, RV heave, hepatomegaly"
    ],
    medications: [
      { name: "Unfractionated Heparin", dose: "80 units/kg IV bolus then 18 units/kg/hr infusion", route: "Intravenous", purpose: "Immediate anticoagulation to prevent clot propagation; monitor aPTT q6h, target 60-80 seconds" },
      { name: "Enoxaparin (Lovenox)", dose: "1 mg/kg SC q12h or 1.5 mg/kg SC daily", route: "Subcutaneous", purpose: "LMWH alternative to UFH for submassive PE; more predictable pharmacokinetics, less HIT risk" },
      { name: "Alteplase (tPA)", dose: "100 mg IV over 2 hours", route: "Intravenous", purpose: "Systemic thrombolysis for massive PE with hemodynamic instability — risk of major hemorrhage 6-13%" },
      { name: "Rivaroxaban", dose: "15 mg PO BID x 21 days then 20 mg daily", route: "Oral", purpose: "Direct oral anticoagulant for long-term PE treatment; no monitoring required" }
    ],
    pearls: [
      "PE is a dead space disease — ventilated but unperfused lung creates elevated dead space fraction and widened A-a gradient",
      "Normal D-dimer in a low-probability patient essentially rules out PE — but D-dimer is useless in hospitalized, post-surgical, or pregnant patients",
      "In massive PE with hemodynamic instability, do NOT delay thrombolysis for imaging if clinical suspicion is high",
      "Avoid excessive PEEP in PE patients — it further increases RV afterload and can precipitate cardiovascular collapse",
      "The classic S1Q3T3 ECG pattern is present in only 10-20% of PE cases — sinus tachycardia is far more common",
      "Cautious fluid resuscitation in PE: the failing RV is volume-sensitive, and excessive fluids worsen septal bowing and LV compromise"
    ],
    preTest: [
      { question: "What type of V/Q abnormality does pulmonary embolism primarily cause?", options: ["Intrapulmonary shunt (V/Q = 0)", "Dead space ventilation (V/Q = infinity)", "Diffusion impairment", "Normal V/Q matching"], correct: 1, rationale: "PE occludes pulmonary arteries, creating ventilated but unperfused alveoli — dead space ventilation where V/Q approaches infinity." },
      { question: "Which is the gold standard imaging test for diagnosing PE?", options: ["Chest X-ray", "V/Q scan", "CT pulmonary angiography (CTPA)", "MRI of the chest"], correct: 2, rationale: "CTPA has >95% sensitivity and specificity for PE and is the primary diagnostic imaging modality." }
    ],
    postTest: [
      { question: "A patient with massive PE is hypotensive (BP 70/40). What is the priority intervention?", options: ["Aggressive IV fluid resuscitation with 2L normal saline", "Systemic thrombolysis with alteplase", "Place patient in Trendelenburg position", "Start broad-spectrum antibiotics"], correct: 1, rationale: "Massive PE with hemodynamic instability requires systemic thrombolysis to dissolve the clot and restore pulmonary blood flow. Excessive fluids worsen RV failure. Alteplase 100 mg IV over 2 hours is standard." },
      { question: "Why should excessive PEEP be avoided in mechanically ventilated PE patients?", options: ["PEEP increases oxygen toxicity", "PEEP further increases RV afterload and can cause cardiovascular collapse", "PEEP causes bronchospasm", "PEEP reduces FiO2 delivery"], correct: 1, rationale: "PE already increases RV afterload from pulmonary vascular obstruction. Adding excessive PEEP further increases intrathoracic pressure and RV afterload, worsening RV failure and reducing cardiac output." }
    ],
    quiz: [
      { question: "A patient presents with sudden dyspnea, pleuritic chest pain, and SpO2 88% on room air. ABG shows pH 7.48, PaCO2 30, PaO2 58, with A-a gradient of 42 mmHg. What is the most likely diagnosis?", options: ["COPD exacerbation", "Pulmonary embolism", "Pneumothorax", "Asthma attack"], correct: 1, rationale: "Acute dyspnea with respiratory alkalosis (hyperventilation), hypoxemia, and a widened A-a gradient is classic for PE. The acute onset, pleuritic pain, and A-a gradient elevation point to an intrapulmonary cause of hypoxemia with dead space physiology." },
      { question: "What ECG finding is MOST commonly seen in acute PE?", options: ["ST elevation in leads V1-V4", "S1Q3T3 pattern", "Sinus tachycardia", "Complete heart block"], correct: 2, rationale: "Sinus tachycardia is the most common ECG finding in acute PE. The S1Q3T3 pattern, while classic, is present in only 10-20% of cases." },
      { question: "A low-risk patient (Wells score 2) presents with possible PE. D-dimer is negative. What is the next step?", options: ["Order CTPA to confirm", "PE is effectively ruled out — pursue alternative diagnosis", "Start empiric anticoagulation", "Order V/Q scan"], correct: 1, rationale: "In low pre-test probability patients (Wells ≤4), a negative D-dimer has a very high negative predictive value, effectively ruling out PE without imaging." }
    ]
  },

  "pneumothorax-rrt": {
    title: "Pneumothorax",
    cellular: `Pneumothorax is the presence of air in the pleural space, which disrupts the normal negative intrapleural pressure that maintains lung inflation. Understanding the pathophysiology, recognition, and emergency management of pneumothorax is critical for respiratory therapists because it can be iatrogenic (caused by positive pressure ventilation or procedures) and is a life-threatening emergency in its tension form.

The pleural space normally contains a thin film of fluid (5-15 mL) maintaining a negative pressure of approximately -5 cmH2O at end-expiration. This negative pressure keeps the visceral pleura apposed to the parietal pleura, maintaining lung expansion. When air enters the pleural space, this negative pressure is lost, the elastic recoil of the lung causes it to collapse, and ventilation of the affected side is compromised.

Primary spontaneous pneumothorax (PSP) occurs without obvious underlying lung disease, typically in tall, thin young males aged 15-35. Rupture of subpleural blebs at the lung apex is the typical mechanism. Secondary spontaneous pneumothorax (SSP) occurs in patients with underlying lung disease — COPD (most common cause), cystic fibrosis, tuberculosis, pneumonia, or interstitial lung disease. SSP is more dangerous because the already compromised lung has less reserve.

Traumatic pneumothorax results from blunt or penetrating chest trauma disrupting the parietal or visceral pleura. Iatrogenic pneumothorax is caused by medical procedures: central venous catheter insertion (especially subclavian), thoracentesis, transthoracic needle biopsy, bronchoscopy with transbronchial biopsy, and most importantly for RTs — barotrauma from mechanical ventilation.

Tension pneumothorax is the most dangerous form. A one-way valve mechanism allows air to enter the pleural space during inspiration but prevents escape during expiration. Progressive air accumulation causes complete lung collapse, mediastinal shift to the contralateral side, compression of the contralateral lung and great vessels, reduced venous return, and cardiovascular collapse. Tension pneumothorax is a clinical diagnosis requiring immediate needle decompression — do NOT delay treatment for imaging confirmation.

US Protocol Notes (NBRC): Ventilator-associated pneumothorax (barotrauma) is heavily tested on TMC and CSE. RTs must recognize the sudden increase in PIP and Pplat, sudden desaturation, and hemodynamic instability that suggest pneumothorax in a ventilated patient. Emergency response includes immediate assessment and calling for needle decompression.

Canadian Protocol Notes (CBRC): Canadian scope of practice for RTs includes recognition and initial stabilization of pneumothorax. While needle decompression is physician-performed in most Canadian jurisdictions, RTs in remote or emergency settings may perform this under medical directive. CBRC emphasizes the RT role in recognizing ventilator-associated barotrauma and managing chest tube drainage systems.`,
    riskFactors: [
      "Mechanical ventilation with high peak inspiratory pressures or high PEEP — barotrauma risk increases with Pplat > 30 cmH2O",
      "COPD with bullous disease — wall thinning predisposes to rupture",
      "Cystic fibrosis with advanced lung disease — prevalence of pneumothorax up to 20%",
      "Central venous catheter insertion (subclavian approach has highest pneumothorax risk: 1-6%)",
      "Tall, thin body habitus in young males (primary spontaneous pneumothorax)",
      "Thoracentesis, transthoracic needle biopsy, or bronchoscopy with transbronchial biopsy",
      "Prior pneumothorax — recurrence rate 30-50% without definitive treatment",
      "Positive pressure ventilation in patients with necrotizing pneumonia or ARDS",
      "Chest trauma (blunt or penetrating) disrupting pleural integrity"
    ],
    diagnostics: [
      "Chest X-ray (upright PA preferred): visible visceral pleural line with absent lung markings beyond the line",
      "CT chest: most sensitive imaging modality — detects small pneumothoraces missed on CXR",
      "Point-of-care ultrasound: absence of lung sliding and B-lines; presence of lung point is pathognomonic",
      "Ventilator waveform analysis: sudden rise in PIP and Pplat simultaneously with decreased tidal volume delivery",
      "Physical examination: decreased or absent breath sounds on affected side, hyperresonance to percussion",
      "Tracheal deviation: away from affected side in tension pneumothorax (late sign)",
      "ABG: hypoxemia with widened A-a gradient; respiratory acidosis if significant lung compromise"
    ],
    management: [
      "Tension pneumothorax: immediate needle decompression at 2nd intercostal space, midclavicular line with large-bore needle (14-16 gauge)",
      "Chest tube insertion (tube thoracostomy) for definitive management: typically 28-36 French for adult pneumothorax",
      "Small primary spontaneous pneumothorax (<2 cm on CXR): observation with supplemental oxygen (accelerates nitrogen reabsorption)",
      "In ventilated patients: reduce PIP and PEEP if possible while maintaining oxygenation; consider lowering VT",
      "Water-seal chest drainage system management: monitor air leak, drainage volume, and underwater seal fluctuation",
      "If pneumothorax occurs during mechanical ventilation: do NOT disconnect patient — maintain ventilation while preparing for decompression",
      "Pleurodesis for recurrent pneumothorax: chemical (talc, doxycycline) or surgical (VATS with mechanical pleurodesis)",
      "Supplemental oxygen at high FiO2 for conservatively managed pneumothorax — nitrogen washout accelerates pleural air reabsorption 4x faster"
    ],
    nursingActions: [
      "Recognize ventilator-associated pneumothorax immediately: sudden PIP/Pplat rise, desaturation, hemodynamic instability, absent breath sounds",
      "In tension pneumothorax: call for immediate needle decompression — this is a clinical diagnosis, do not wait for imaging",
      "Maintain chest tube drainage system: keep collection chamber below chest level, monitor water seal for air leak (bubbling)",
      "Assess chest tube insertion site for subcutaneous emphysema (crepitus), drainage volume, and tube patency",
      "Document hourly chest tube output (volume, color, character) and presence or absence of air leak",
      "Ensure all connections in chest drainage system are secure — accidental disconnection can cause pneumothorax recurrence",
      "Never clamp a chest tube with an active air leak — this can cause tension pneumothorax",
      "Monitor for resolution: decreasing air leak, lung re-expansion on CXR, normalized breath sounds"
    ],
    signs: [
      "Acute onset dyspnea with pleuritic chest pain (sharp, ipsilateral)",
      "Decreased or absent breath sounds on the affected side",
      "Hyperresonance to percussion on the affected side",
      "Tachycardia, tachypnea, and hypoxemia",
      "Subcutaneous emphysema (crepitus) palpable in chest wall, neck, or face",
      "Tension pneumothorax: JVD, tracheal deviation away from affected side, severe hypotension, pulsus paradoxus"
    ],
    medications: [
      { name: "Supplemental Oxygen (High-flow)", dose: "FiO2 1.0 via non-rebreather or HFNC", route: "Inhaled", purpose: "Nitrogen washout accelerates pleural air reabsorption — increases reabsorption rate from 1.25%/day to 5%/day" },
      { name: "Talc Slurry (Pleurodesis)", dose: "4-5 g in 50-100 mL NS instilled via chest tube", route: "Intrapleural", purpose: "Chemical pleurodesis creating adhesion between visceral and parietal pleura to prevent recurrence" },
      { name: "Lidocaine (Local)", dose: "1-2% solution, 10-20 mL at insertion site", route: "Local infiltration", purpose: "Local anesthesia for chest tube insertion or needle decompression" }
    ],
    pearls: [
      "Tension pneumothorax is a CLINICAL diagnosis — never delay treatment to obtain imaging confirmation",
      "In ventilated patients, a sudden simultaneous rise in BOTH PIP and Pplat with acute desaturation = suspect pneumothorax (compliance problem)",
      "High-flow supplemental oxygen accelerates pneumothorax resolution by washing out nitrogen, creating a larger absorption gradient for pleural air",
      "Never clamp a chest tube with an active air leak — the trapped air cannot escape and creates tension physiology",
      "The most common cause of iatrogenic pneumothorax is central line insertion (subclavian > IJ); always get a post-procedure CXR",
      "In ARDS patients requiring high PEEP, pneumothorax risk must be balanced against the need for alveolar recruitment"
    ],
    preTest: [
      { question: "What is the immediate intervention for tension pneumothorax?", options: ["Chest X-ray for confirmation", "Needle decompression at 2nd intercostal space, midclavicular line", "Intubation and mechanical ventilation", "CT scan of the chest"], correct: 1, rationale: "Tension pneumothorax is a clinical emergency requiring immediate needle decompression. Do not delay for imaging." },
      { question: "What ventilator finding suggests pneumothorax in a mechanically ventilated patient?", options: ["Decreased PIP with stable Pplat", "Sudden simultaneous rise in PIP and Pplat", "Decreased respiratory rate", "Increased tidal volume delivery"], correct: 1, rationale: "Pneumothorax decreases lung compliance, causing both PIP and Pplat to rise simultaneously, with decreased tidal volume delivery in pressure-controlled modes." }
    ],
    postTest: [
      { question: "A ventilated ARDS patient suddenly desaturates to SpO2 78% with PIP rising from 32 to 55 cmH2O and Pplat from 28 to 50 cmH2O. Absent breath sounds on the right. What is the priority action?", options: ["Increase PEEP to recruit alveoli", "Suction the ETT for mucus plug", "Notify physician for needle decompression — suspected tension pneumothorax", "Increase FiO2 to 100% and observe"], correct: 2, rationale: "Sudden rise in both PIP and Pplat with absent breath sounds and acute desaturation in a ventilated ARDS patient is classic for tension pneumothorax. This requires immediate needle decompression. Do not increase PEEP — this would worsen the pneumothorax." },
      { question: "Why does supplemental high-flow oxygen accelerate pneumothorax resolution?", options: ["Oxygen has anti-inflammatory properties", "Nitrogen washout creates a larger absorption gradient for pleural air", "Oxygen increases surfactant production", "Oxygen stimulates pleural lymphatic drainage"], correct: 1, rationale: "Breathing high FiO2 replaces nitrogen in the blood with oxygen. Since pleural air is mostly nitrogen, this creates a larger partial pressure gradient for nitrogen absorption from the pleural space into the blood, increasing reabsorption rate from 1.25%/day to approximately 5%/day." }
    ],
    quiz: [
      { question: "Which ventilator parameter combination change is most consistent with pneumothorax?", options: ["Rising PIP with stable Pplat (resistance problem)", "Rising PIP AND Pplat simultaneously (compliance problem)", "Decreasing PIP with stable Pplat", "Stable PIP with rising Pplat"], correct: 1, rationale: "Pneumothorax is a compliance problem — air in the pleural space reduces lung compliance. Both PIP and Pplat rise. Rising PIP alone with stable Pplat indicates a resistance problem (bronchospasm, secretions)." },
      { question: "A patient with a chest tube for pneumothorax has continuous bubbling in the water seal chamber. What does this indicate?", options: ["Normal chest tube function", "Persistent air leak from the lung", "Chest tube is obstructed", "Pneumothorax has resolved"], correct: 1, rationale: "Continuous bubbling in the water seal chamber indicates an ongoing air leak — air is still escaping from the lung into the pleural space and being evacuated through the chest tube. This requires continued chest tube drainage until the air leak resolves." },
      { question: "Which patient population has the highest risk for primary spontaneous pneumothorax?", options: ["Elderly females with osteoporosis", "Tall, thin young males aged 15-35", "Obese middle-aged patients", "Neonates born at term"], correct: 1, rationale: "Primary spontaneous pneumothorax typically occurs in tall, thin young males due to rupture of subpleural apical blebs. The tall body habitus creates greater negative pleural pressure at the apex, predisposing to bleb formation and rupture." }
    ]
  },

  "cystic-fibrosis-rrt": {
    title: "Cystic Fibrosis",
    cellular: `Cystic fibrosis (CF) is an autosomal recessive genetic disorder caused by mutations in the cystic fibrosis transmembrane conductance regulator (CFTR) gene on chromosome 7. The CFTR protein is a chloride and bicarbonate channel expressed on epithelial cell surfaces throughout the body. In the lungs, defective CFTR leads to impaired chloride secretion and excessive sodium absorption, resulting in dehydrated, thick, viscous mucus that obstructs airways, impairs mucociliary clearance, and creates a favorable environment for chronic bacterial colonization and progressive bronchiectasis.

The pulmonary manifestations dominate CF morbidity and mortality. Thick, tenacious mucus plugs small airways, causing air trapping, atelectasis, and progressive bronchiectasis. Chronic infection with Pseudomonas aeruginosa occurs in 60-80% of adult CF patients and is associated with accelerated lung function decline. Staphylococcus aureus (including MRSA), Burkholderia cepacia complex, and Stenotrophomonas maltophilia are other important pathogens. The chronic infection-inflammation cycle drives progressive airway destruction, leading to respiratory failure and death — lung disease accounts for >90% of CF mortality.

Pulmonary function testing in CF shows an obstructive pattern: reduced FEV1, reduced FEV1/FVC ratio, and increased residual volume from air trapping. FEV1 is the single most important predictor of prognosis in CF — FEV1 <30% predicted indicates severe disease and triggers evaluation for lung transplantation. The rate of FEV1 decline over time is the best indicator of disease trajectory.

CF exacerbations are characterized by increased cough, sputum production, dyspnea, decreased exercise tolerance, and decline in FEV1 ≥10% from baseline. Treatment involves intensified airway clearance, IV antibiotics targeting Pseudomonas (typically dual therapy with aminoglycoside + beta-lactam), and nutritional support. Hemoptysis (mild to massive) is a complication of bronchiectasis and may require bronchial artery embolization.

US Protocol Notes (NBRC): NBRC exams test CF as a chronic obstructive disease requiring intensive airway clearance therapy. Key topics include oscillating PEP therapy, dornase alfa (Pulmozyme) as CF-specific mucolytic, hypertonic saline therapy, and recognition of CF exacerbation management. Lung transplant evaluation criteria are tested on the CSE.

Canadian Protocol Notes (CBRC): CF care in Canada is organized through dedicated CF clinics following Cystic Fibrosis Canada (CFC) clinical guidelines. Canadian RTs should be familiar with the CF Canada registry and outcomes data. Tobramycin inhalation (TOBI) and aztreonam inhalation (Cayston) are commonly used for chronic Pseudomonas suppression. Canadian guidelines emphasize the RT role in airway clearance education and pulmonary function monitoring.`,
    riskFactors: [
      "Autosomal recessive inheritance — both parents must carry CFTR mutation (1 in 25 Caucasians are carriers)",
      "Delta-F508 mutation is the most common (70% of alleles) — causes severe CFTR protein misfolding",
      "Chronic Pseudomonas aeruginosa colonization — accelerates lung function decline",
      "Poor nutritional status (BMI <19) — correlates with worse pulmonary outcomes",
      "Pancreatic insufficiency (85-90% of CF patients) — malabsorption of fat-soluble vitamins (A, D, E, K)",
      "CF-related diabetes (CFRD) — develops in 40-50% of adult CF patients",
      "Allergic bronchopulmonary aspergillosis (ABPA) — occurs in 2-15% of CF patients",
      "Pneumothorax — prevalence up to 20% in advanced CF lung disease",
      "Massive hemoptysis from bronchial artery erosion in severe bronchiectasis"
    ],
    diagnostics: [
      "Sweat chloride test — gold standard for CF diagnosis: >60 mmol/L diagnostic, 30-59 mmol/L intermediate",
      "CFTR genetic testing for mutation identification — over 2,000 known CFTR mutations",
      "Pulmonary function testing (spirometry): FEV1 is the primary outcome measure — obstructive pattern with air trapping",
      "Sputum culture and sensitivity to guide antibiotic selection — routine monitoring for Pseudomonas, S. aureus, B. cepacia",
      "Chest CT showing bronchiectasis, mucus plugging, air trapping, and progressive structural lung damage",
      "Chest X-ray: hyperinflation, peribronchial thickening, bronchiectasis, and upper lobe predominant disease",
      "Fecal elastase for pancreatic exocrine function assessment (<200 mcg/g indicates insufficiency)",
      "Oral glucose tolerance test for CFRD screening (recommended annually after age 10)"
    ],
    management: [
      "Airway clearance therapy: oscillating PEP (Acapella, Aerobika, Flutter) is first-line — performed BID minimum, increase during exacerbation",
      "Dornase alfa (Pulmozyme) 2.5 mg nebulized daily — CF-specific mucolytic that cleaves extracellular DNA in sputum",
      "Hypertonic saline (7%) 4 mL nebulized BID — osmotic mucoactive agent improving mucociliary clearance",
      "Inhaled tobramycin (TOBI) 300 mg BID alternating months — chronic Pseudomonas suppression",
      "CFTR modulators (elexacaftor/tezacaftor/ivacaftor — Trikafta) for eligible mutations — disease-modifying therapy",
      "Pancreatic enzyme replacement therapy (PERT) with all meals and snacks for malabsorption",
      "IV antibiotics for exacerbations: dual anti-pseudomonal therapy (tobramycin + ceftazidime or piperacillin-tazobactam)",
      "Lung transplant evaluation when FEV1 <30% predicted or rapidly declining despite maximal therapy",
      "Nutritional supplementation: high-calorie, high-fat diet with fat-soluble vitamin supplementation (A, D, E, K)"
    ],
    nursingActions: [
      "Perform and educate on oscillating PEP therapy at every visit — technique assessment and optimization",
      "Administer dornase alfa 30 minutes BEFORE airway clearance therapy for optimal mucus mobilization",
      "Administer bronchodilator BEFORE hypertonic saline to prevent bronchospasm",
      "Monitor sputum characteristics (volume, color, consistency) and report changes suggesting exacerbation",
      "Track FEV1 trends at every clinic visit — decline >10% from baseline triggers exacerbation evaluation",
      "Assess nutritional status: BMI, weight trends, pancreatic enzyme adherence",
      "Implement strict infection control: individual exam rooms, 6-foot distance between CF patients, contact precautions for B. cepacia",
      "Educate on CFTR modulator therapy adherence — take with fat-containing food for absorption"
    ],
    signs: [
      "Chronic productive cough with thick, purulent sputum (hallmark symptom)",
      "Digital clubbing from chronic hypoxemia and inflammation",
      "Barrel chest from air trapping and hyperinflation",
      "Recurrent sinusitis and nasal polyps (present in 30-40% of CF patients)",
      "Failure to thrive in children, malnutrition in adults despite adequate caloric intake",
      "Steatorrhea (fatty, foul-smelling stools) from pancreatic exocrine insufficiency"
    ],
    medications: [
      { name: "Dornase Alfa (Pulmozyme)", dose: "2.5 mg nebulized once daily", route: "Inhaled via jet nebulizer", purpose: "Recombinant human DNase that cleaves extracellular DNA in CF sputum, reducing viscosity — CF-SPECIFIC, not for non-CF bronchiectasis" },
      { name: "Hypertonic Saline (7%)", dose: "4 mL nebulized BID", route: "Inhaled", purpose: "Osmotic mucoactive agent drawing water into airways to hydrate mucus and improve clearance" },
      { name: "Tobramycin Inhalation (TOBI)", dose: "300 mg nebulized BID x 28 days on / 28 days off", route: "Inhaled", purpose: "Aminoglycoside antibiotic for chronic Pseudomonas aeruginosa suppression — alternating month regimen" },
      { name: "Elexacaftor/Tezacaftor/Ivacaftor (Trikafta)", dose: "2 tabs AM + 1 tab PM", route: "Oral", purpose: "Triple CFTR modulator correcting protein folding and potentiating channel function — effective for ≥90% of CF patients with at least one F508del allele" }
    ],
    pearls: [
      "Dornase alfa (Pulmozyme) is effective ONLY in CF — do NOT use for non-CF bronchiectasis (no benefit, may be harmful)",
      "FEV1 <30% predicted triggers lung transplant evaluation — this is the single most important threshold in CF care",
      "Always administer bronchodilator BEFORE hypertonic saline — 7% saline frequently causes significant bronchospasm",
      "Trikafta (elexacaftor/tezacaftor/ivacaftor) has revolutionized CF care — most patients show 10-15% FEV1 improvement",
      "CF patients should NEVER share respiratory equipment or sit within 6 feet of each other due to cross-infection risk",
      "Sweat chloride >60 mmol/L is diagnostic of CF — this is a classic board exam fact"
    ],
    preTest: [
      { question: "What is the gold standard diagnostic test for cystic fibrosis?", options: ["Chest X-ray", "Sputum culture", "Sweat chloride test", "Genetic testing alone"], correct: 2, rationale: "The sweat chloride test is the gold standard. A value >60 mmol/L is diagnostic of CF." },
      { question: "Which airway clearance device is first-line for CF patients?", options: ["Standard CPT", "Oscillating PEP (Acapella, Aerobika)", "IPPB", "Incentive spirometry"], correct: 1, rationale: "Oscillating PEP devices are first-line for CF airway clearance, combining positive expiratory pressure with oscillations to mobilize secretions." }
    ],
    postTest: [
      { question: "A CF patient's FEV1 has declined from 45% to 28% predicted over the past year despite maximal therapy. What is the next step?", options: ["Increase airway clearance to TID", "Refer for lung transplant evaluation", "Add a third inhaled antibiotic", "Switch to a different PEP device"], correct: 1, rationale: "FEV1 <30% predicted is the threshold for lung transplant evaluation in CF. Rapidly declining FEV1 despite maximal therapy indicates the need for transplant assessment." },
      { question: "In what order should inhaled CF medications be administered?", options: ["Hypertonic saline, then dornase alfa, then bronchodilator", "Bronchodilator, then dornase alfa (30 min before ACT), then hypertonic saline, then airway clearance", "Dornase alfa, then hypertonic saline, then bronchodilator", "Order does not matter"], correct: 1, rationale: "Optimal sequence: bronchodilator first (open airways), dornase alfa 30 minutes before airway clearance (break down DNA in mucus), hypertonic saline (hydrate mucus), then airway clearance therapy to mobilize and clear secretions." }
    ],
    quiz: [
      { question: "Which mucolytic is effective ONLY in cystic fibrosis and should NOT be used for non-CF bronchiectasis?", options: ["Acetylcysteine (Mucomyst)", "Hypertonic saline", "Dornase alfa (Pulmozyme)", "Normal saline"], correct: 2, rationale: "Dornase alfa cleaves extracellular DNA released from neutrophils in CF sputum. This mechanism is specific to the neutrophil-dominant inflammation in CF airways. Studies show no benefit and potential harm in non-CF bronchiectasis." },
      { question: "What is the most common pathogen in adult CF patients associated with accelerated lung function decline?", options: ["Staphylococcus aureus", "Pseudomonas aeruginosa", "Haemophilus influenzae", "Streptococcus pneumoniae"], correct: 1, rationale: "Pseudomonas aeruginosa chronically colonizes 60-80% of adult CF patients and is associated with accelerated FEV1 decline, increased exacerbation frequency, and worse prognosis. Chronic Pseudomonas suppression with inhaled tobramycin is standard." },
      { question: "A sweat chloride level of 75 mmol/L is consistent with:", options: ["Normal — no CF", "Borderline — needs repeat testing", "Diagnostic of cystic fibrosis", "Indicative of CF carrier status only"], correct: 2, rationale: "Sweat chloride >60 mmol/L is diagnostic of CF. Values 30-59 mmol/L are intermediate/borderline. Values <30 mmol/L are normal. A level of 75 mmol/L is clearly diagnostic." }
    ]
  },

  "interstitial-lung-disease-rrt": {
    title: "Interstitial Lung Disease",
    cellular: `Interstitial lung disease (ILD) encompasses a heterogeneous group of disorders characterized by inflammation and fibrosis of the lung parenchyma, primarily affecting the pulmonary interstitium — the tissue between the alveolar epithelium and capillary endothelium. The result is thickening of the alveolar-capillary membrane, reduced lung compliance, impaired gas exchange (particularly oxygen diffusion), and progressive restrictive ventilatory impairment.

Idiopathic pulmonary fibrosis (IPF) is the most common and most deadly ILD, with a median survival of 3-5 years from diagnosis. IPF is characterized by the usual interstitial pneumonia (UIP) pattern on CT: bilateral, basal-predominant reticular opacities, honeycombing, and traction bronchiectasis with minimal ground-glass opacity. The pathological hallmark is fibroblastic foci — areas of active fibrosis at the interface between normal and scarred lung. IPF progresses relentlessly with episodic acute exacerbations (rapid decline with new bilateral ground-glass opacities) that carry high mortality.

Other important ILDs include: hypersensitivity pneumonitis (immune response to inhaled organic antigens — bird droppings, mold, hay), sarcoidosis (non-caseating granulomas affecting lungs and lymph nodes, more common in African Americans), connective tissue disease-associated ILD (rheumatoid arthritis, systemic sclerosis, polymyositis/dermatomyositis), and occupational ILDs (asbestosis, silicosis, coal workers' pneumoconiosis).

The physiological consequences are restrictive: reduced total lung capacity (TLC), reduced vital capacity (VC), and reduced FRC. The FEV1/FVC ratio is preserved or increased (>80%) because both volumes decrease proportionally or FVC decreases more. The hallmark gas exchange abnormality is reduced DLCO (diffusing capacity for carbon monoxide), reflecting thickened alveolar-capillary membrane. Hypoxemia is typically exercise-induced initially (desaturation during activity) and progresses to resting hypoxemia as disease advances. PaCO2 is usually normal or low until very late disease when respiratory muscle fatigue leads to hypercapnia.

US Protocol Notes (NBRC): ILD is tested on the TMC as a restrictive lung disease with reduced DLCO. Key concepts include differentiating restrictive from obstructive patterns on PFTs, understanding that oxygen is the primary therapy, and recognizing that lung transplant is the only cure for IPF.

Canadian Protocol Notes (CBRC): Canadian guidelines follow the Canadian Thoracic Society ILD committee recommendations. Anti-fibrotic therapy (nintedanib, pirfenidone) is available through provincial formularies. Canadian RTs play a key role in pulmonary rehabilitation for ILD patients and oxygen titration for exercise-induced desaturation.`,
    riskFactors: [
      "Age >50 years (IPF typically presents in the 6th-7th decade)",
      "Smoking history — risk factor for IPF and desquamative interstitial pneumonia",
      "Occupational dust exposure: asbestos (shipyard, construction), silica (mining, sandblasting), coal dust",
      "Environmental antigen exposure: bird feeder's lung, farmer's lung (hypersensitivity pneumonitis)",
      "Connective tissue diseases: rheumatoid arthritis, systemic sclerosis, polymyositis",
      "Drug-induced ILD: amiodarone, methotrexate, bleomycin, nitrofurantoin, radiation therapy",
      "Gastroesophageal reflux — microaspiration may contribute to IPF progression",
      "Family history of ILD — familial pulmonary fibrosis in 2-20% of IPF cases"
    ],
    diagnostics: [
      "High-resolution CT (HRCT): gold standard imaging — UIP pattern (honeycombing, traction bronchiectasis, basal-predominant reticulation)",
      "Pulmonary function testing: restrictive pattern (reduced TLC, VC, FRC) with preserved FEV1/FVC ratio and reduced DLCO",
      "Six-minute walk test (6MWT): exercise-induced desaturation and functional capacity assessment",
      "Bronchoalveolar lavage (BAL): cell count and differential for diagnostic classification",
      "Surgical lung biopsy (VATS): may be needed when HRCT pattern is not definitive for UIP",
      "Serologic testing: ANA, RF, anti-CCP, anti-Scl-70 for connective tissue disease-associated ILD",
      "ABG: hypoxemia (initially exercise-induced, later at rest) with normal or low PaCO2",
      "Chest X-ray: bilateral reticular opacities, reduced lung volumes, ground-glass opacities"
    ],
    management: [
      "Supplemental oxygen therapy for resting or exercise-induced hypoxemia — titrate to SpO2 ≥ 88-92%",
      "Anti-fibrotic therapy for IPF: pirfenidone or nintedanib — slows FVC decline but does not reverse fibrosis",
      "Pulmonary rehabilitation: exercise training, breathing retraining, and education — improves quality of life and functional capacity",
      "Immunosuppressive therapy for inflammatory ILDs (sarcoidosis, HP, CTD-ILD): corticosteroids, mycophenolate, azathioprine",
      "Antigen avoidance in hypersensitivity pneumonitis — critical for disease management",
      "Lung transplant evaluation for progressive disease: referral when DLCO <39% predicted or FVC decline >10% over 6 months",
      "Acute exacerbation of IPF: high-dose corticosteroids (pulse methylprednisolone), supportive care, often fatal despite treatment",
      "Avoid high-flow oxygen during exacerbation if possible — IPF lungs are susceptible to ventilator-induced lung injury"
    ],
    nursingActions: [
      "Monitor SpO2 at rest and during activity — exercise-induced desaturation is often the earliest sign of ILD progression",
      "Titrate supplemental oxygen to maintain SpO2 ≥ 88% during rest and ≥ 85-88% during exercise (per individual targets)",
      "Assess for drug-induced ILD: review medication list for known culprits (amiodarone, methotrexate, bleomycin)",
      "Monitor DLCO and FVC trends over time — FVC decline >10% in 6 months indicates poor prognosis",
      "Educate on energy conservation techniques and pacing for activities of daily living",
      "Assess for signs of pulmonary hypertension (RV failure): JVD, peripheral edema, hepatomegaly",
      "Coordinate pulmonary rehabilitation referral and exercise prescription",
      "Document cough assessment: dry cough is a hallmark of ILD and significantly impacts quality of life"
    ],
    signs: [
      "Progressive exertional dyspnea — often the first symptom, developing insidiously over months to years",
      "Dry, nonproductive cough (prominent in IPF)",
      "Fine inspiratory crackles (Velcro-like) heard bilaterally at lung bases on auscultation",
      "Digital clubbing (present in 25-50% of IPF patients — rare in other ILDs)",
      "Tachypnea and shallow breathing pattern (restrictive physiology limits tidal volume)",
      "Exercise-induced desaturation (SpO2 drops >4% or below 88% during 6MWT)"
    ],
    medications: [
      { name: "Pirfenidone (Esbriet)", dose: "801 mg PO TID with food", route: "Oral", purpose: "Anti-fibrotic agent slowing FVC decline in IPF — most common side effects: photosensitivity, nausea, rash" },
      { name: "Nintedanib (Ofev)", dose: "150 mg PO BID", route: "Oral", purpose: "Tyrosine kinase inhibitor anti-fibrotic for IPF — reduces FVC decline rate by approximately 50%; main side effect: diarrhea" },
      { name: "Prednisone", dose: "0.5-1 mg/kg/day for inflammatory ILDs, tapering over months", route: "Oral", purpose: "Corticosteroid for inflammatory ILDs (sarcoidosis, HP, CTD-ILD) — NOT effective for IPF" },
      { name: "Mycophenolate Mofetil", dose: "1000-1500 mg PO BID", route: "Oral", purpose: "Steroid-sparing immunosuppressant for CTD-ILD, particularly scleroderma-associated ILD" }
    ],
    pearls: [
      "ILD = restrictive pattern on PFTs: reduced TLC, reduced VC, PRESERVED or increased FEV1/FVC ratio, and reduced DLCO",
      "Velcro-like inspiratory crackles at the lung bases are the hallmark auscultatory finding of IPF",
      "Corticosteroids are NOT effective for IPF and may be harmful — anti-fibrotic drugs (pirfenidone, nintedanib) are the only proven medical therapy",
      "Exercise-induced desaturation often precedes resting hypoxemia by months to years — always check SpO2 during exertion",
      "DLCO is the most sensitive PFT parameter for detecting ILD — it may be abnormal before spirometry shows restriction",
      "Lung transplant is the only curative treatment for IPF — refer early when DLCO <39% or FVC declining rapidly"
    ],
    preTest: [
      { question: "What PFT pattern is characteristic of interstitial lung disease?", options: ["Obstructive pattern with reduced FEV1/FVC", "Restrictive pattern with reduced TLC and preserved FEV1/FVC", "Normal spirometry", "Mixed obstructive-restrictive pattern"], correct: 1, rationale: "ILD causes a restrictive pattern: reduced TLC, VC, and FRC with preserved or increased FEV1/FVC ratio. DLCO is also characteristically reduced." },
      { question: "What is the characteristic auscultatory finding in IPF?", options: ["Wheezing", "Rhonchi", "Fine inspiratory (Velcro-like) crackles at the bases", "Stridor"], correct: 2, rationale: "Fine inspiratory crackles with a Velcro-like quality heard bilaterally at the lung bases are the hallmark finding of IPF." }
    ],
    postTest: [
      { question: "A patient with IPF has FVC declining from 65% to 52% predicted over 6 months. DLCO is 35%. What is the most appropriate next step?", options: ["Start corticosteroids", "Increase anti-fibrotic therapy dose", "Refer for lung transplant evaluation", "Repeat PFTs in 6 months"], correct: 2, rationale: "FVC decline >10% over 6 months and DLCO <39% are triggers for lung transplant referral in IPF. Corticosteroids are not effective for IPF." },
      { question: "Why is DLCO characteristically reduced in ILD?", options: ["Airway obstruction reduces gas flow", "Thickening of the alveolar-capillary membrane impairs gas diffusion", "Reduced cardiac output limits pulmonary blood flow", "Surfactant deficiency collapses alveoli"], correct: 1, rationale: "ILD thickens the alveolar-capillary membrane through inflammation and fibrosis, directly impairing the diffusion of gases (particularly oxygen and CO) across the membrane. This is the pathophysiological basis for reduced DLCO." }
    ],
    quiz: [
      { question: "Which anti-fibrotic medication is approved specifically for IPF?", options: ["Prednisone", "Methotrexate", "Pirfenidone (Esbriet)", "Azathioprine"], correct: 2, rationale: "Pirfenidone and nintedanib are the two anti-fibrotic drugs approved for IPF. They slow FVC decline but do not reverse fibrosis. Prednisone is not effective for IPF and may be harmful." },
      { question: "A 6-minute walk test in an ILD patient shows SpO2 dropping from 96% to 82% during exercise. What does this indicate?", options: ["Normal exercise response", "Exercise-induced desaturation indicating disease progression", "Pulse oximeter malfunction", "Hyperventilation syndrome"], correct: 1, rationale: "Exercise-induced desaturation (SpO2 drop >4% or below 88%) is characteristic of ILD and indicates impaired gas exchange under increased metabolic demand. Supplemental oxygen during exercise is indicated." },
      { question: "What is the HRCT pattern diagnostic of usual interstitial pneumonia (UIP) in IPF?", options: ["Bilateral ground-glass opacity with upper lobe predominance", "Basal-predominant honeycombing, traction bronchiectasis, and reticular opacities", "Centrilobular nodules with tree-in-bud pattern", "Bilateral pleural effusions with mediastinal lymphadenopathy"], correct: 1, rationale: "The UIP pattern on HRCT shows basal-predominant, peripheral reticular opacities with honeycombing and traction bronchiectasis. This pattern is diagnostic of IPF when clinical context is appropriate, often eliminating the need for surgical lung biopsy." }
    ]
  },

  "tuberculosis-rrt": {
    title: "Tuberculosis",
    cellular: `Tuberculosis (TB) is a communicable disease caused by Mycobacterium tuberculosis, an aerobic acid-fast bacillus transmitted primarily through airborne droplet nuclei. TB primarily affects the lungs (pulmonary TB) but can disseminate to virtually any organ system (extrapulmonary TB). Respiratory therapists must understand TB pathophysiology, infection control requirements, and the respiratory management of patients with active TB because of the airborne transmission risk and the disease's impact on pulmonary function.

M. tuberculosis is transmitted when an infected person coughs, sneezes, speaks, or sings, releasing droplet nuclei (1-5 microns) that can remain suspended in air for hours. Inhalation of as few as 1-10 organisms can establish infection. Once inhaled, the bacilli reach the terminal alveoli and are engulfed by alveolar macrophages. However, M. tuberculosis has evolved to survive within macrophages by preventing phagosome-lysosome fusion. The cell-mediated immune response develops over 2-12 weeks, during which T-lymphocytes and macrophages form granulomas (tubercles) that contain the infection.

Latent TB infection (LTBI) occurs when the immune system successfully contains the bacilli within granulomas. The person is infected but not infectious and has no symptoms. LTBI is detected by tuberculin skin test (TST/PPD) or interferon-gamma release assay (IGRA). Approximately 5-10% of immunocompetent individuals with LTBI will progress to active TB during their lifetime, with the highest risk in the first 2 years after infection.

Active pulmonary TB develops when immune containment fails and bacilli multiply, causing caseous necrosis within granulomas that can liquefy and cavitate. Cavitary disease, typically in the upper lobes (where high PO2 favors mycobacterial growth), creates direct communication with airways, producing highly infectious sputum. Upper lobe cavitary disease with positive sputum smears represents the most infectious form of TB.

US Protocol Notes (NBRC): NBRC exams test TB as a reportable infectious disease requiring airborne isolation precautions (negative pressure room, N95 respirators for healthcare workers, patient in surgical mask during transport). Understanding the distinction between LTBI and active TB, and the infection control requirements, is essential.

Canadian Protocol Notes (CBRC): TB incidence in Canada varies significantly by region, with higher rates in northern Indigenous communities and among recent immigrants from high-burden countries. Canadian guidelines (Canadian Tuberculosis Standards) emphasize culturally sensitive approaches to TB care in Indigenous populations. IGRA testing is preferred over TST for BCG-vaccinated individuals (most Canadian-born individuals received BCG). Canadian RTs must understand airborne precautions per provincial infection control standards.`,
    riskFactors: [
      "Close contact with active TB case — household contacts have 30-50% infection rate",
      "HIV/AIDS — highest risk factor for LTBI reactivation (7-10% annual risk vs 5-10% lifetime risk in HIV-negative)",
      "Immigration from high-burden countries (India, China, Philippines, South Africa, Indonesia)",
      "Indigenous populations in Northern Canada — rates 50-300x higher than Canadian-born non-Indigenous",
      "Immunosuppressive therapy: TNF-alpha inhibitors, corticosteroids, organ transplant medications",
      "Diabetes mellitus — 2-3x increased risk of active TB development",
      "Chronic kidney disease and dialysis patients",
      "Silicosis — 30x increased risk of active TB",
      "Healthcare workers with repeated occupational exposure",
      "Incarceration, homelessness, and congregate living settings"
    ],
    diagnostics: [
      "Tuberculin skin test (TST/PPD): intradermal injection of purified protein derivative, read at 48-72 hours — induration ≥5mm, ≥10mm, or ≥15mm positive depending on risk group",
      "Interferon-gamma release assay (IGRA): QuantiFERON-TB Gold or T-SPOT.TB — preferred in BCG-vaccinated individuals",
      "Sputum AFB smear and culture: three early-morning specimens — culture on Lowenstein-Jensen medium takes 4-8 weeks; liquid culture (BACTEC MGIT) takes 1-3 weeks",
      "Nucleic acid amplification test (NAAT/GeneXpert): rapid detection of M. tuberculosis and rifampin resistance in 2 hours",
      "Chest X-ray: upper lobe infiltrates, cavitary lesions, hilar/mediastinal lymphadenopathy; miliary pattern in disseminated TB",
      "CT chest: more sensitive than CXR for detecting cavitation, lymphadenopathy, and tree-in-bud pattern",
      "Drug susceptibility testing (DST): essential for guiding treatment — identifies resistance to first-line drugs"
    ],
    management: [
      "Airborne isolation: negative pressure room, N95 respirator for all staff entering room, patient wears surgical mask during transport",
      "Standard 4-drug regimen for active TB (RIPE): rifampin, isoniazid, pyrazinamide, ethambutol for 2 months initial phase",
      "Continuation phase: rifampin + isoniazid for 4 months (total 6 months for drug-susceptible pulmonary TB)",
      "Directly observed therapy (DOT): gold standard for treatment adherence — healthcare worker observes each dose",
      "LTBI treatment: isoniazid 300 mg daily for 9 months OR rifampin 600 mg daily for 4 months",
      "MDR-TB (resistant to rifampin and isoniazid): extended regimen 18-20 months with second-line drugs",
      "Monitor for drug toxicity: hepatotoxicity (isoniazid, rifampin, pyrazinamide), optic neuritis (ethambutol), peripheral neuropathy (isoniazid — give pyridoxine B6 supplement)",
      "Respiratory support: supplemental oxygen for hypoxemia; avoid aerosolizing procedures unless in negative pressure with appropriate PPE"
    ],
    nursingActions: [
      "Implement airborne precautions immediately upon TB suspicion — do not wait for laboratory confirmation",
      "Fit-test N95 respirator and ensure proper seal before entering airborne isolation room",
      "Collect three early-morning sputum specimens on consecutive days for AFB smear and culture",
      "Educate patient on cough hygiene: cover mouth with tissue, dispose of tissues properly, wear surgical mask outside room",
      "Monitor treatment adherence and assess for drug side effects: jaundice, visual changes, numbness/tingling",
      "Report all confirmed active TB cases to public health authorities — TB is a reportable disease in all US states and Canadian provinces",
      "Coordinate contact investigation: identify and screen all close contacts of the active TB case",
      "Discontinue airborne precautions only after three consecutive negative AFB smears on separate days, clinical improvement, and at least 2 weeks of effective therapy"
    ],
    signs: [
      "Chronic cough lasting >2-3 weeks (most common symptom)",
      "Night sweats and fever (often low-grade, intermittent)",
      "Unintentional weight loss and anorexia (constitutional symptoms)",
      "Hemoptysis from cavitary disease or erosion into bronchial vessels",
      "Upper lobe crackles on auscultation — post-tussive crackles are suggestive",
      "Cachexia and wasting in advanced disease"
    ],
    medications: [
      { name: "Isoniazid (INH)", dose: "5 mg/kg daily (max 300 mg) or 15 mg/kg 2x/week", route: "Oral", purpose: "First-line bactericidal anti-TB drug — always give with pyridoxine (B6) 25-50 mg daily to prevent peripheral neuropathy" },
      { name: "Rifampin (RIF)", dose: "10 mg/kg daily (max 600 mg)", route: "Oral", purpose: "First-line bactericidal anti-TB drug — potent CYP450 inducer causing many drug interactions; turns body fluids orange-red" },
      { name: "Pyrazinamide (PZA)", dose: "15-30 mg/kg daily (max 2000 mg)", route: "Oral", purpose: "Bactericidal in acidic environment of macrophage phagolysosomes — essential for shortening treatment to 6 months" },
      { name: "Ethambutol (EMB)", dose: "15-25 mg/kg daily", route: "Oral", purpose: "Bacteriostatic anti-TB drug — monitor visual acuity and color vision monthly (optic neuritis is dose-dependent and reversible)" }
    ],
    pearls: [
      "TB requires airborne precautions — negative pressure room, N95 respirators, NOT just droplet precautions with a surgical mask",
      "Three consecutive negative AFB smears + clinical improvement + 2 weeks effective therapy = criteria to discontinue airborne isolation",
      "IGRA is preferred over TST in BCG-vaccinated individuals because TST cross-reacts with BCG, causing false positives",
      "Upper lobe cavitary disease = most infectious form of TB — high bacillary load in sputum",
      "Rifampin turns body fluids orange-red (urine, tears, sweat) — warn patients this is expected and harmless",
      "Isoniazid + rifampin hepatotoxicity requires baseline and monthly liver function monitoring — stop drugs if ALT >3x ULN with symptoms"
    ],
    preTest: [
      { question: "What type of infection control precautions are required for active pulmonary TB?", options: ["Standard precautions only", "Droplet precautions", "Airborne precautions with negative pressure room", "Contact precautions"], correct: 2, rationale: "TB is transmitted via airborne droplet nuclei (1-5 microns) that remain suspended in air. Airborne precautions require a negative pressure room and N95 respirators for staff." },
      { question: "What is the standard first-line drug regimen for active TB?", options: ["Amoxicillin and azithromycin", "RIPE: Rifampin, Isoniazid, Pyrazinamide, Ethambutol", "Vancomycin and metronidazole", "Doxycycline monotherapy"], correct: 1, rationale: "The standard 4-drug RIPE regimen (Rifampin, Isoniazid, Pyrazinamide, Ethambutol) is used for the initial 2-month intensive phase of active TB treatment." }
    ],
    postTest: [
      { question: "A patient on isoniazid reports tingling and numbness in their hands and feet. What vitamin supplement should be co-administered to prevent this?", options: ["Vitamin C", "Vitamin B12", "Pyridoxine (Vitamin B6)", "Vitamin D"], correct: 2, rationale: "Isoniazid causes peripheral neuropathy by depleting pyridoxine (vitamin B6). Co-administration of pyridoxine 25-50 mg daily prevents this side effect." },
      { question: "When can airborne precautions be discontinued for a hospitalized TB patient?", options: ["After 24 hours of antibiotic therapy", "After three consecutive negative AFB smears, clinical improvement, and 2 weeks of effective therapy", "After chest X-ray improvement", "After negative TB skin test"], correct: 1, rationale: "Airborne precautions for TB require three consecutive negative AFB sputum smears on separate days, clinical improvement, and at least 2 weeks of effective anti-TB therapy." }
    ],
    quiz: [
      { question: "A healthcare worker's TST shows 12 mm induration. The worker had BCG vaccination as a child. What test would better determine if this is true TB infection?", options: ["Repeat TST in 2 weeks", "Interferon-gamma release assay (IGRA)", "Chest X-ray only", "Sputum AFB smear"], correct: 1, rationale: "IGRA (QuantiFERON or T-SPOT) is preferred over TST in BCG-vaccinated individuals because it tests for M. tuberculosis-specific antigens not present in BCG vaccine, eliminating false positives from prior BCG vaccination." },
      { question: "Which lung zone is most commonly affected in reactivation pulmonary TB?", options: ["Lower lobes bilaterally", "Right middle lobe", "Upper lobes (apical and posterior segments)", "Lingula"], correct: 2, rationale: "Reactivation TB favors the upper lobes because the relatively higher PO2 and lower lymphatic drainage in the apices create a favorable environment for M. tuberculosis growth. Cavitary lesions in the upper lobes are classic for reactivation TB." },
      { question: "What is the minimum particle size that must be filtered by an N95 respirator?", options: ["0.01 microns", "0.3 microns (filters ≥95% of particles this size)", "1 micron", "5 microns"], correct: 1, rationale: "N95 respirators filter at least 95% of airborne particles 0.3 microns in diameter — this is the most penetrating particle size (MPPS). TB droplet nuclei (1-5 microns) are efficiently captured." }
    ]
  },

  "pleural-effusion-rrt": {
    title: "Pleural Effusion",
    cellular: `Pleural effusion is the abnormal accumulation of fluid in the pleural space. Under normal conditions, the pleural space contains 5-15 mL of serous fluid that lubricates the visceral and parietal pleural surfaces during respiration. Pleural fluid dynamics are governed by Starling forces: fluid enters the pleural space from the parietal pleural capillaries (high hydrostatic pressure) and is absorbed by the visceral pleural capillaries and lymphatics. Pleural effusion develops when the rate of fluid formation exceeds the rate of absorption.

Pleural effusions are classified as transudative or exudative based on Light's criteria. Transudative effusions result from systemic imbalances in hydrostatic or oncotic pressure — the pleural membranes are not directly involved. Causes include congestive heart failure (most common cause of transudative effusion), hepatic hydrothorax (cirrhosis), nephrotic syndrome, and hypoalbuminemia. Exudative effusions result from local pleural disease causing increased capillary permeability or impaired lymphatic drainage. Causes include pneumonia (parapneumonic effusion), malignancy, pulmonary embolism, tuberculosis, and connective tissue diseases.

Light's criteria classify an effusion as exudative if ANY of the following are met: pleural fluid protein/serum protein ratio >0.5, pleural fluid LDH/serum LDH ratio >0.6, or pleural fluid LDH >2/3 the upper limit of normal for serum LDH. These criteria have 98% sensitivity but approximately 75% specificity for exudative effusions — some transudative effusions (particularly with diuretic therapy) may be misclassified as exudative.

The respiratory consequences of pleural effusion include compressive atelectasis of underlying lung, reduced lung volumes (restrictive physiology), V/Q mismatch from collapsed lung regions, and diaphragmatic dysfunction. Large effusions (>1000 mL) can cause significant dyspnea, mediastinal shift, and hemodynamic compromise.

US Protocol Notes (NBRC): NBRC exams test recognition of pleural effusion on chest X-ray (blunting of costophrenic angles, meniscus sign), physical exam findings (decreased breath sounds, dullness to percussion, decreased tactile fremitus), and Light's criteria classification. RTs should understand the indications for thoracentesis.

Canadian Protocol Notes (CBRC): Canadian guidelines follow similar diagnostic algorithms to US guidelines. Thoracentesis is the primary diagnostic procedure, and Canadian RTs assist with positioning, monitoring, and post-procedure assessment. Ultrasound-guided thoracentesis is standard of care in Canada, reducing procedural complication rates.`,
    riskFactors: [
      "Congestive heart failure — most common cause of transudative pleural effusion",
      "Pneumonia — parapneumonic effusions develop in 20-40% of bacterial pneumonia cases",
      "Malignancy — lung cancer, breast cancer, lymphoma are most common causes of malignant effusion",
      "Hepatic cirrhosis — hepatic hydrothorax from diaphragmatic defects allowing ascitic fluid into pleural space",
      "Pulmonary embolism — effusions present in up to 50% of PE cases",
      "Renal failure and nephrotic syndrome — fluid overload and hypoalbuminemia",
      "Tuberculosis — TB pleuritis is a common cause of exudative effusion in endemic areas",
      "Post-cardiac surgery — effusions develop in up to 90% of patients, usually transudative",
      "Connective tissue diseases: rheumatoid arthritis, systemic lupus erythematosus"
    ],
    diagnostics: [
      "Chest X-ray (upright PA): blunting of costophrenic angle (requires ~200 mL for detection), meniscus sign, opacification of hemithorax in massive effusion",
      "Lateral decubitus X-ray: determines if effusion is free-flowing (layers on dependent side) — layering >10 mm suggests enough fluid for safe thoracentesis",
      "Chest ultrasound: most sensitive bedside tool for detecting effusion, guides thoracentesis, identifies septations/loculations",
      "Thoracentesis with pleural fluid analysis: cell count, protein, LDH, glucose, pH, cytology, culture, gram stain",
      "Light's criteria application: protein ratio >0.5, LDH ratio >0.6, or fluid LDH >2/3 upper normal serum LDH = exudative",
      "CT chest with contrast: evaluates underlying parenchymal disease, pleural thickening/nodularity suggesting malignancy",
      "Pleural fluid pH <7.20 in parapneumonic effusion: indicates complicated effusion requiring chest tube drainage",
      "Pleural fluid cytology: positive in 60-70% of malignant effusions on first sample"
    ],
    management: [
      "Therapeutic thoracentesis for symptomatic relief: remove up to 1000-1500 mL per session to avoid re-expansion pulmonary edema",
      "Treat underlying cause: diuretics for CHF, antibiotics for parapneumonic effusion, chemotherapy for malignant effusion",
      "Chest tube drainage for complicated parapneumonic effusion (pH <7.20, glucose <60 mg/dL, positive gram stain/culture) or empyema",
      "Pleurodesis for recurrent malignant effusion: talc slurry via chest tube or talc poudrage via VATS",
      "Indwelling pleural catheter (PleurX) for recurrent malignant effusion as alternative to pleurodesis",
      "Supplemental oxygen for hypoxemia — typically responds well to low-flow oxygen",
      "Post-thoracentesis monitoring: CXR to assess lung re-expansion and rule out pneumothorax (complication rate 2-5%)",
      "Intrapleural fibrinolytic therapy (tPA + DNase) for loculated parapneumonic effusions not adequately drained by tube alone"
    ],
    nursingActions: [
      "Position patient upright and leaning slightly forward for thoracentesis — optimizes fluid accessibility and patient comfort",
      "Monitor vital signs, SpO2, and respiratory status during and after thoracentesis",
      "Assess for post-thoracentesis complications: pneumothorax (sudden dyspnea, chest pain), re-expansion pulmonary edema (cough, frothy sputum)",
      "Monitor chest tube output: color (serous, serosanguinous, purulent), volume per hour, and character",
      "Auscultate breath sounds bilaterally before and after fluid drainage — document improvement in aeration",
      "Assess for signs of infection progression in parapneumonic effusion: fever, increasing WBC, worsening dyspnea",
      "Maintain accurate I&O records — track daily fluid balance in CHF-related effusions",
      "Educate patient on signs of effusion recurrence: increasing dyspnea, pleuritic pain, decreased exercise tolerance"
    ],
    signs: [
      "Dyspnea — severity correlates with effusion size and rate of accumulation",
      "Decreased or absent breath sounds on affected side (fluid attenuates sound transmission)",
      "Dullness to percussion over the effusion (replaces normal resonance)",
      "Decreased tactile fremitus over the effusion (fluid blocks vibration transmission)",
      "Tracheal deviation away from affected side in massive effusion",
      "Pleuritic chest pain (sharp, worse with inspiration) if pleural inflammation is present"
    ],
    medications: [
      { name: "Furosemide (Lasix)", dose: "20-80 mg IV/PO for CHF-related effusion", route: "IV or Oral", purpose: "Loop diuretic reducing intravascular volume and hydrostatic pressure to decrease transudative effusion formation" },
      { name: "Talc Slurry", dose: "4-5 g in 50-100 mL NS via chest tube", route: "Intrapleural", purpose: "Chemical pleurodesis agent creating inflammatory adhesion between pleural surfaces to prevent recurrent effusion" },
      { name: "Alteplase (tPA) + Dornase Alfa", dose: "tPA 10 mg + DNase 5 mg intrapleural BID x 3 days", route: "Intrapleural via chest tube", purpose: "Fibrinolytic + DNase combination for loculated parapneumonic effusions — breaks down fibrin and DNA in pleural space" }
    ],
    pearls: [
      "200 mL of pleural fluid is needed to blunt the costophrenic angle on upright CXR — smaller effusions require lateral decubitus views or ultrasound",
      "Light's criteria have 98% sensitivity for exudative effusions — if criteria are met, the effusion is exudative until proven otherwise",
      "Pleural fluid pH <7.20 in parapneumonic effusion = complicated effusion requiring chest tube drainage, not just antibiotics",
      "Limit thoracentesis drainage to 1000-1500 mL per session to avoid re-expansion pulmonary edema — a dangerous complication",
      "Transudative effusion = systemic problem (treat the CHF, cirrhosis, renal failure); exudative = local pleural problem (treat the infection, malignancy, inflammation)",
      "Physical exam triad of decreased breath sounds, dullness to percussion, and decreased fremitus = classic pleural effusion"
    ],
    preTest: [
      { question: "What physical exam finding differentiates pleural effusion from pneumothorax?", options: ["Both have decreased breath sounds", "Pleural effusion has dullness to percussion; pneumothorax has hyperresonance", "Both have increased tactile fremitus", "There is no physical exam difference"], correct: 1, rationale: "Pleural effusion causes dullness to percussion (fluid is dense), while pneumothorax causes hyperresonance (air is less dense than normal lung). Both have decreased breath sounds on the affected side." },
      { question: "What are Light's criteria used for?", options: ["Determining effusion size", "Classifying effusion as transudative or exudative", "Deciding if thoracentesis is safe", "Measuring pleural pressure"], correct: 1, rationale: "Light's criteria classify pleural effusions as transudative or exudative based on pleural fluid protein ratio, LDH ratio, and absolute LDH level." }
    ],
    postTest: [
      { question: "A parapneumonic effusion has pH 7.10, glucose 35 mg/dL, and positive gram stain. What management is required?", options: ["Antibiotics alone", "Therapeutic thoracentesis only", "Chest tube drainage — this is a complicated effusion/empyema", "Observation and repeat imaging in 48 hours"], correct: 2, rationale: "Pleural fluid pH <7.20, glucose <60 mg/dL, and positive gram stain indicate a complicated parapneumonic effusion or empyema. Antibiotics alone are insufficient — chest tube drainage is required to evacuate the infected fluid." },
      { question: "After removing 1200 mL of pleural fluid via thoracentesis, the patient develops sudden cough with frothy pink sputum. What complication has occurred?", options: ["Pneumothorax", "Pulmonary embolism", "Re-expansion pulmonary edema", "Allergic reaction to local anesthetic"], correct: 2, rationale: "Re-expansion pulmonary edema occurs when rapid removal of large effusions causes sudden re-expansion of collapsed lung tissue, leading to transudation of fluid into the re-expanded alveoli. Symptoms include cough, frothy sputum, and dyspnea. Limit drainage to 1000-1500 mL per session." }
    ],
    quiz: [
      { question: "A CHF patient has bilateral pleural effusions. Thoracentesis shows protein ratio 0.4, LDH ratio 0.3. This is:", options: ["Exudative effusion from infection", "Transudative effusion from heart failure", "Malignant effusion", "Indeterminate — need additional testing"], correct: 1, rationale: "None of Light's criteria are met (protein ratio <0.5, LDH ratio <0.6), confirming a transudative effusion. CHF is the most common cause of bilateral transudative effusions. Treatment focuses on diuresis and heart failure management." },
      { question: "What is the most common cause of transudative pleural effusion?", options: ["Pneumonia", "Lung cancer", "Congestive heart failure", "Tuberculosis"], correct: 2, rationale: "Congestive heart failure is the most common cause of transudative pleural effusion. Elevated left atrial pressure is transmitted to the pulmonary vasculature, increasing hydrostatic pressure and driving fluid into the pleural space." },
      { question: "What finding on chest X-ray is the earliest sign of pleural effusion?", options: ["Complete hemithorax opacification", "Blunting of the costophrenic angle", "Mediastinal shift", "Tracheal deviation"], correct: 1, rationale: "Blunting of the costophrenic angle is the earliest CXR sign, requiring approximately 200 mL of fluid. As the effusion increases, a meniscus sign forms, and eventually the hemithorax may become completely opacified." }
    ]
  },

  "pneumonia-management-rrt": {
    title: "Pneumonia Management",
    cellular: `Pneumonia is an infection of the lung parenchyma causing inflammation, alveolar consolidation, and impaired gas exchange. It is one of the most common reasons for respiratory therapy consultation and intervention. Understanding the classification, pathophysiology, and respiratory management strategies for pneumonia is essential for respiratory therapists managing patients across the care continuum.

Community-acquired pneumonia (CAP) develops outside the hospital in a non-immunocompromised host. The most common pathogen is Streptococcus pneumoniae (pneumococcal pneumonia), followed by atypical organisms (Mycoplasma pneumoniae, Chlamydophila pneumoniae, Legionella pneumophila), Haemophilus influenzae, and respiratory viruses (influenza, RSV, SARS-CoV-2). Typical bacterial pneumonia presents with abrupt onset of fever, productive cough with purulent sputum, and lobar consolidation on CXR. Atypical pneumonia tends to have a more insidious onset with dry cough, lower fevers, and diffuse bilateral infiltrates.

Hospital-acquired pneumonia (HAP) develops ≥48 hours after hospital admission. Ventilator-associated pneumonia (VAP) is a subset of HAP developing ≥48 hours after endotracheal intubation. VAP is the most common nosocomial infection in ICU patients, occurring in 10-20% of mechanically ventilated patients, with attributable mortality of 10-15%. Common VAP pathogens include Pseudomonas aeruginosa, MRSA, Acinetobacter baumannii, and Klebsiella pneumoniae — these organisms are frequently multidrug-resistant.

The gas exchange consequences of pneumonia result from alveolar consolidation creating intrapulmonary shunt (perfused but unventilated alveoli, V/Q = 0). Unlike dead space ventilation, true shunt does not respond well to supplemental oxygen because blood passes through consolidated lung without encountering ventilated alveoli. This explains why pneumonia patients may have refractory hypoxemia requiring positive pressure ventilation. The A-a gradient is widened, and the degree of shunt determines the response to oxygen therapy.

US Protocol Notes (NBRC): The NBRC heavily tests VAP prevention bundles, including head-of-bed elevation, daily sedation interruption, oral care, subglottic suctioning, DVT and peptic ulcer prophylaxis, and daily SBT assessment. Understanding the pathophysiology of shunt in pneumonia and the limitations of supplemental oxygen for shunt-related hypoxemia is critical for board exams.

Canadian Protocol Notes (CBRC): Canadian guidelines follow the Canadian Thoracic Society recommendations for CAP management. Severity assessment tools (CURB-65, Pneumonia Severity Index) guide disposition decisions. Canadian standards emphasize antimicrobial stewardship and de-escalation when culture results are available. Canadian RTs play a key role in sputum collection, airway clearance for pneumonia patients, and VAP prevention in ICUs.`,
    riskFactors: [
      "Advanced age (>65 years) — impaired mucociliary clearance and immune function",
      "Mechanical ventilation — VAP risk increases 1-3% per ventilator day",
      "Aspiration risk: impaired swallowing, altered consciousness, GERD, NG/OG tubes",
      "Chronic lung disease (COPD, bronchiectasis) — impaired local lung defense mechanisms",
      "Immunosuppression: HIV, chemotherapy, organ transplant, chronic corticosteroid use",
      "Smoking — damages mucociliary escalator and impairs alveolar macrophage function",
      "Post-operative status (abdominal and thoracic surgery) — impaired cough and deep breathing",
      "Prolonged hospitalization — colonization with hospital-acquired multidrug-resistant organisms",
      "Malnutrition — impaired immune function and respiratory muscle weakness"
    ],
    diagnostics: [
      "Chest X-ray: lobar consolidation (typical bacterial), bilateral diffuse infiltrates (atypical or viral), air bronchograms within consolidation",
      "Sputum culture and gram stain: guide antibiotic therapy — collect before starting antibiotics when possible",
      "Blood cultures (two sets): positive in 5-14% of CAP patients, more often in pneumococcal bacteremia",
      "ABG: hypoxemia with widened A-a gradient; shunt fraction correlates with extent of consolidation",
      "Procalcitonin: differentiates bacterial from viral pneumonia — levels >0.25 mcg/L suggest bacterial etiology",
      "CT chest: more sensitive for infiltrates, effusions, empyema, and abscess formation",
      "Bronchoalveolar lavage (BAL): quantitative cultures for VAP diagnosis (≥10^4 CFU/mL diagnostic threshold)",
      "CURB-65 score (Confusion, Uremia, Respiratory rate ≥30, BP <90/60, age ≥65): guides severity and disposition"
    ],
    management: [
      "Empiric antibiotics within 1 hour of sepsis recognition or within 4 hours of presentation for non-septic pneumonia",
      "CAP outpatient: amoxicillin or doxycycline for healthy adults; respiratory fluoroquinolone or beta-lactam + macrolide for comorbidities",
      "CAP inpatient: beta-lactam (ceftriaxone) + macrolide (azithromycin) or respiratory fluoroquinolone (levofloxacin)",
      "HAP/VAP: anti-pseudomonal beta-lactam + anti-pseudomonal fluoroquinolone or aminoglycoside ± MRSA coverage (vancomycin or linezolid)",
      "Supplemental oxygen titrated to SpO2 ≥ 92% — recognize that shunt-related hypoxemia may require PEEP or positive pressure ventilation",
      "Mechanical ventilation for severe pneumonia with respiratory failure: lung-protective settings with appropriate PEEP to recruit consolidated lung",
      "Bronchial hygiene therapy: chest physiotherapy, PEP therapy, incentive spirometry for secretion mobilization",
      "VAP prevention bundle: HOB 30-45°, daily oral care with chlorhexidine, subglottic suctioning ETT, daily SBT assessment, DVT and PUD prophylaxis"
    ],
    nursingActions: [
      "Obtain sputum specimen for culture before initiating antibiotics — adequate specimen has >25 PMNs and <10 squamous epithelial cells per LPF",
      "Implement VAP prevention bundle for ALL mechanically ventilated patients from day one",
      "Position patient upright (30-45 degrees) to optimize lung expansion and prevent aspiration",
      "Administer bronchial hygiene therapy: incentive spirometry q1-2h while awake, cough and deep breathing exercises",
      "Monitor temperature trends, WBC count, and sputum characteristics for treatment response assessment",
      "De-escalate antibiotics when culture and sensitivity results are available — antibiotic stewardship",
      "Assess for sepsis criteria: temperature, heart rate, respiratory rate, WBC, mental status, lactate",
      "Coordinate early mobility for hospitalized pneumonia patients — reduces ICU and hospital length of stay"
    ],
    signs: [
      "Fever (>38°C/100.4°F) or hypothermia (<36°C/96.8°F) in severe sepsis",
      "Productive cough with purulent (yellow-green) sputum in bacterial pneumonia",
      "Bronchial breath sounds over area of consolidation (loud, high-pitched, expiration > inspiration heard peripherally)",
      "Increased tactile fremitus over consolidated lung (solid tissue transmits vibration better than air)",
      "Dullness to percussion over consolidated areas",
      "Egophony (E-to-A change) and whispered pectoriloquy over consolidation"
    ],
    medications: [
      { name: "Ceftriaxone", dose: "1-2 g IV daily", route: "Intravenous", purpose: "Third-generation cephalosporin for empiric CAP treatment — covers S. pneumoniae and H. influenzae" },
      { name: "Azithromycin", dose: "500 mg IV/PO day 1, then 250 mg daily x 4 days", route: "IV or Oral", purpose: "Macrolide antibiotic covering atypical organisms (Mycoplasma, Chlamydophila, Legionella) — anti-inflammatory properties" },
      { name: "Piperacillin-Tazobactam (Zosyn)", dose: "4.5 g IV q6h", route: "Intravenous", purpose: "Anti-pseudomonal beta-lactam for HAP/VAP empiric therapy — covers gram-negatives including Pseudomonas" },
      { name: "Vancomycin", dose: "15-20 mg/kg IV q8-12h, target trough 15-20 mcg/mL", route: "Intravenous", purpose: "MRSA coverage in HAP/VAP when risk factors present — monitor trough levels and renal function" }
    ],
    pearls: [
      "Pneumonia causes intrapulmonary shunt (V/Q = 0) — this explains why some pneumonia patients have refractory hypoxemia not responsive to supplemental oxygen alone",
      "The VAP prevention bundle is the MOST effective strategy for reducing VAP — every element must be implemented for every ventilated patient",
      "Bronchial breath sounds heard peripherally (not just over the trachea) indicate consolidation — a key physical exam finding",
      "Procalcitonin <0.1 mcg/L strongly suggests viral etiology — can guide antibiotic discontinuation decisions",
      "CURB-65 score ≥3 suggests severe pneumonia requiring ICU admission — 0-1 can be treated outpatient",
      "De-escalate antibiotics when culture results are available — narrow-spectrum targeted therapy reduces resistance and side effects"
    ],
    preTest: [
      { question: "What V/Q abnormality does pneumonia with alveolar consolidation primarily cause?", options: ["Dead space ventilation (V/Q = infinity)", "Intrapulmonary shunt (V/Q = 0)", "Diffusion impairment", "Normal V/Q matching"], correct: 1, rationale: "Consolidated alveoli are perfused but cannot be ventilated, creating intrapulmonary shunt where blood passes through without gas exchange (V/Q = 0)." },
      { question: "What is the most common pathogen in community-acquired pneumonia?", options: ["Pseudomonas aeruginosa", "Staphylococcus aureus", "Streptococcus pneumoniae", "Klebsiella pneumoniae"], correct: 2, rationale: "Streptococcus pneumoniae (pneumococcus) is the most common identified cause of CAP." }
    ],
    postTest: [
      { question: "A mechanically ventilated patient develops fever, purulent sputum, new infiltrate on CXR, and WBC 18,000 on ventilator day 5. What is the most likely diagnosis and initial management?", options: ["CAP — start azithromycin", "VAP — obtain respiratory cultures and start anti-pseudomonal coverage", "PE — start anticoagulation", "Atelectasis — increase incentive spirometry"], correct: 1, rationale: "New onset fever, purulent sputum, new CXR infiltrate, and leukocytosis ≥48 hours after intubation meets clinical criteria for VAP. Management includes obtaining respiratory cultures and starting broad-spectrum empiric antibiotics covering Pseudomonas and MRSA." },
      { question: "Which element is NOT part of the standard VAP prevention bundle?", options: ["Head of bed elevation 30-45 degrees", "Daily oral care with chlorhexidine", "Prophylactic antibiotics for all ventilated patients", "Daily spontaneous breathing trial assessment"], correct: 2, rationale: "Prophylactic antibiotics are NOT part of the VAP bundle. The bundle includes HOB elevation, daily oral care, subglottic suctioning ETT, daily SBT assessment, DVT prophylaxis, and peptic ulcer prophylaxis." }
    ],
    quiz: [
      { question: "What physical examination finding over consolidated lung differentiates pneumonia from pleural effusion?", options: ["Both have decreased breath sounds", "Consolidation has INCREASED tactile fremitus; effusion has DECREASED fremitus", "Both have hyperresonance to percussion", "There is no difference"], correct: 1, rationale: "Consolidated lung transmits vibrations better than normal lung (increased fremitus) because solid tissue conducts sound. Pleural effusion blocks vibration transmission (decreased fremitus) because fluid attenuates sound." },
      { question: "A pneumonia patient has PaO2 55 mmHg on 6 L/min nasal cannula (estimated FiO2 44%). Increasing to 10 L/min NRB (FiO2 ~80%) only improves PaO2 to 62 mmHg. What does this suggest?", options: ["Equipment malfunction", "Significant intrapulmonary shunt that does not respond to supplemental oxygen alone", "The patient needs a higher flow rate", "The ABG sample was improperly collected"], correct: 1, rationale: "Poor response to supplemental oxygen (refractory hypoxemia) is the hallmark of intrapulmonary shunt. In shunt, blood passes through unventilated consolidated alveoli and never encounters the supplemental oxygen. PEEP and positive pressure ventilation may be needed to recruit consolidated lung." },
      { question: "What is the recommended head-of-bed elevation for ventilated patients to prevent VAP?", options: ["Flat (0 degrees)", "15-20 degrees", "30-45 degrees", "90 degrees upright"], correct: 2, rationale: "Head of bed elevation to 30-45 degrees reduces gastric aspiration risk and is a core element of the VAP prevention bundle. This position minimizes reflux of gastric contents into the oropharynx." }
    ]
  },

  "lung-cancer-respiratory-rrt": {
    title: "Lung Cancer & Respiratory Implications",
    cellular: `Lung cancer is the leading cause of cancer death worldwide and has profound respiratory implications that directly affect respiratory therapy practice. RTs encounter lung cancer patients requiring pre-operative pulmonary assessment, post-surgical respiratory support, management of respiratory complications (airway obstruction, pleural effusion, atelectasis), and palliative respiratory care.

Lung cancers are broadly classified into non-small cell lung cancer (NSCLC, 85% of cases) and small cell lung cancer (SCLC, 15%). NSCLC subtypes include adenocarcinoma (most common, 40% — often peripheral), squamous cell carcinoma (30% — typically central, associated with smoking), and large cell carcinoma (10%). SCLC is almost exclusively associated with smoking, tends to be centrally located, grows rapidly, and metastasizes early.

Central airway tumors (squamous cell, SCLC) can cause airway obstruction leading to post-obstructive pneumonia, atelectasis, wheezing (unilateral fixed monophonic wheeze), hemoptysis, and stridor if tracheal involvement is significant. These tumors may require emergent interventional procedures: rigid bronchoscopy, stent placement, laser ablation, or endobronchial brachytherapy.

Malignant pleural effusion develops in approximately 15% of lung cancer patients, causing dyspnea and compressive atelectasis. Superior vena cava (SVC) syndrome occurs when mediastinal tumor or lymph node enlargement compresses the SVC, causing facial/upper extremity edema, JVD, and dyspnea — this is a medical emergency.

Pre-operative pulmonary assessment for lung resection is a core RT competency. The predicted post-operative FEV1 (ppoFEV1) estimates residual lung function after surgery. Patients with ppoFEV1 >60% are generally surgical candidates without further evaluation. ppoFEV1 40-60% requires cardiopulmonary exercise testing (CPET). ppoFEV1 <40% or maximal oxygen consumption (VO2max) <15 mL/kg/min indicates high surgical risk.

US Protocol Notes (NBRC): Pre-operative pulmonary function assessment for lung resection is a TMC and CSE topic. RTs must understand predicted post-operative FEV1 calculations, split-function quantitative V/Q scanning, and post-operative respiratory complications. Oxygen titration in palliative lung cancer care is also tested.

Canadian Protocol Notes (CBRC): Canadian lung cancer care follows the Canadian Cancer Society and provincial cancer agency guidelines. Pre-operative PFT assessment follows similar criteria to US guidelines. Canadian RTs should be aware of lung cancer screening programs using low-dose CT in high-risk populations (age 50-74 with ≥20 pack-year smoking history).`,
    riskFactors: [
      "Cigarette smoking — 85-90% of lung cancers are smoking-related; dose-response relationship (pack-years)",
      "Secondhand smoke exposure — 20-30% increased lung cancer risk",
      "Occupational carcinogen exposure: asbestos, radon, arsenic, chromium, nickel, vinyl chloride",
      "Radiation therapy to the chest (prior treatment for other malignancies)",
      "Pre-existing lung disease: COPD, pulmonary fibrosis (increased risk independent of smoking)",
      "Family history of lung cancer — 2-3x increased risk in first-degree relatives",
      "Radon exposure (second leading cause of lung cancer after smoking)",
      "Air pollution exposure in urban environments"
    ],
    diagnostics: [
      "Low-dose CT (LDCT) screening: recommended for adults 50-80 years with ≥20 pack-year smoking history (US Preventive Services Task Force)",
      "Chest X-ray: solitary pulmonary nodule, hilar mass, pleural effusion, post-obstructive atelectasis",
      "CT chest with contrast: tumor characterization, lymph node assessment, staging evaluation",
      "PET-CT: metabolic activity assessment for staging and treatment planning",
      "Bronchoscopy with biopsy: central lesion tissue diagnosis, endobronchial ultrasound (EBUS) for lymph node sampling",
      "CT-guided transthoracic needle biopsy: peripheral lesions not accessible by bronchoscopy",
      "Pre-operative PFTs: FEV1, DLCO, predicted post-operative FEV1 calculation for surgical candidacy",
      "Quantitative V/Q scan: split-function assessment determining each lung's contribution to overall function"
    ],
    management: [
      "Surgical resection (lobectomy, pneumonectomy) for early-stage NSCLC with adequate pulmonary reserve",
      "Pre-operative pulmonary rehabilitation to optimize lung function before surgery",
      "Post-operative respiratory care: incentive spirometry, early mobilization, pain management for effective coughing",
      "Airway management for central obstructing tumors: rigid bronchoscopy, stent placement, laser debulking",
      "Malignant pleural effusion: therapeutic thoracentesis, pleurodesis, or indwelling pleural catheter",
      "Supplemental oxygen for cancer-related hypoxemia — titrate to comfort in palliative setting",
      "Palliative respiratory care: opioids for dyspnea relief, fan therapy, positioning, anxiety management",
      "Radiation pneumonitis management: corticosteroids (prednisone 1 mg/kg) for symptomatic radiation-induced lung inflammation"
    ],
    nursingActions: [
      "Perform pre-operative PFTs including spirometry and DLCO — calculate predicted post-operative FEV1",
      "Implement aggressive post-operative pulmonary toilet: incentive spirometry q1-2h, cough and deep breathing, early ambulation",
      "Monitor for post-pneumonectomy complications: bronchopleural fistula (air leak, subcutaneous emphysema), mediastinal shift, cardiac herniation",
      "After pneumonectomy: position patient with operative side DOWN to prevent fluid flooding the remaining lung",
      "Assess for SVC syndrome: facial edema, upper extremity swelling, JVD, dyspnea — medical emergency",
      "Manage hemoptysis: position patient with affected side down, prepare for possible bronchoscopy, ensure IV access",
      "Provide palliative respiratory care: titrate oxygen for comfort, administer opioids for dyspnea per protocol",
      "Educate on smoking cessation — even after diagnosis, cessation improves treatment outcomes and quality of life"
    ],
    signs: [
      "Persistent cough (most common presenting symptom) — new cough or change in chronic cough pattern",
      "Hemoptysis (coughing blood) — especially concerning in smokers over 40",
      "Dyspnea from airway obstruction, pleural effusion, or parenchymal destruction",
      "Unintentional weight loss and anorexia (cancer cachexia)",
      "Unilateral fixed monophonic wheeze (central obstructing tumor)",
      "Hoarseness from recurrent laryngeal nerve involvement by left hilar tumor or mediastinal lymphadenopathy"
    ],
    medications: [
      { name: "Morphine (Palliative Dyspnea)", dose: "2-5 mg PO/SL q4h PRN or 1-2 mg IV q2-4h PRN", route: "Oral/Sublingual/IV", purpose: "Opioid for palliative dyspnea relief — reduces respiratory drive and air hunger perception without necessarily changing SpO2" },
      { name: "Dexamethasone", dose: "4-8 mg IV/PO daily", route: "IV or Oral", purpose: "Corticosteroid for airway edema reduction around tumors, radiation pneumonitis treatment, and SVC syndrome adjunct" },
      { name: "Prednisone", dose: "1 mg/kg daily tapering over 4-12 weeks", route: "Oral", purpose: "Treatment of symptomatic radiation pneumonitis occurring 2-6 months after thoracic radiation" }
    ],
    pearls: [
      "Predicted post-operative FEV1 (ppoFEV1) >60% predicted = acceptable surgical risk for lobectomy without further workup",
      "After pneumonectomy, position patient with operative side DOWN — prevents fluid from flooding the remaining lung",
      "A unilateral fixed monophonic wheeze in a smoker = consider central obstructing lung tumor until proven otherwise",
      "Low-dose CT screening saves lives — recommended for adults 50-80 with ≥20 pack-year smoking history",
      "Opioids are the most effective medication for cancer-related dyspnea — they reduce the perception of breathlessness",
      "SVC syndrome is a medical emergency — elevate head of bed, administer corticosteroids, and urgent oncology consultation"
    ],
    preTest: [
      { question: "What is the most important pre-operative PFT measurement for lung resection candidacy?", options: ["Peak flow rate", "Total lung capacity", "Predicted post-operative FEV1 (ppoFEV1)", "Maximum voluntary ventilation"], correct: 2, rationale: "The predicted post-operative FEV1 estimates how much lung function will remain after resection and is the primary determinant of surgical candidacy." },
      { question: "What is the leading cause of lung cancer?", options: ["Asbestos exposure", "Radon exposure", "Cigarette smoking", "Air pollution"], correct: 2, rationale: "Cigarette smoking causes 85-90% of lung cancers with a dose-response relationship to pack-years of exposure." }
    ],
    postTest: [
      { question: "A post-pneumonectomy patient develops sudden dyspnea with subcutaneous emphysema. What complication is most likely?", options: ["Pneumothorax of the remaining lung", "Bronchopleural fistula", "Pulmonary embolism", "Myocardial infarction"], correct: 1, rationale: "Bronchopleural fistula (BPF) is a serious post-pneumonectomy complication where the bronchial stump breaks down, creating air leak into the post-pneumonectomy space. Subcutaneous emphysema, fever, and sudden dyspnea are classic signs." },
      { question: "How should a post-pneumonectomy patient be positioned?", options: ["Good lung down (operative side up)", "Operative side down", "Flat and supine", "Prone"], correct: 1, rationale: "After pneumonectomy, position the patient with the operative (surgical) side DOWN. This prevents fluid from the pneumonectomy space from flooding across to the remaining lung. The remaining lung should be up for optimal ventilation." }
    ],
    quiz: [
      { question: "A patient with right hilar lung mass has a monophonic wheeze on the right side that does not change with bronchodilator therapy. What is the likely cause?", options: ["Asthma exacerbation", "COPD exacerbation", "Central airway obstruction from tumor", "Vocal cord dysfunction"], correct: 2, rationale: "A fixed, unilateral, monophonic wheeze that does not respond to bronchodilators suggests mechanical airway obstruction from a central tumor. Asthma and COPD produce bilateral, polyphonic wheezes that respond to bronchodilators." },
      { question: "What ppoFEV1 threshold generally indicates unacceptable surgical risk for lobectomy?", options: ["ppoFEV1 > 80%", "ppoFEV1 60-80%", "ppoFEV1 40-60%", "ppoFEV1 < 40%"], correct: 3, rationale: "ppoFEV1 <40% predicted indicates high surgical risk and is generally considered an unacceptable risk level without further evaluation (CPET with VO2max). Additional testing may identify patients who can tolerate surgery despite low ppoFEV1." },
      { question: "What is the most effective pharmacologic intervention for cancer-related dyspnea in the palliative setting?", options: ["Albuterol nebulizer", "Oral morphine", "Inhaled corticosteroids", "IV furosemide"], correct: 1, rationale: "Opioids (particularly morphine) are the most effective pharmacologic intervention for cancer-related dyspnea. They reduce the central perception of breathlessness, decrease anxiety, and reduce respiratory drive, providing symptomatic relief." }
    ]
  }
};
