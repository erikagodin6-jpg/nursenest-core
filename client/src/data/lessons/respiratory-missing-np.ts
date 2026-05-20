import type { LessonContent } from "./types";

export const respiratoryMissingNpLessons: Record<string, LessonContent> = {
  "endemic-fungal-pneumonias-np": {
    "title": "Endemic Fungal Pneumonias",
    "cellular": {
      "title": "Fungal Pathogenesis in Lung Tissue",
      "content": "Endemic mycoses (histoplasmosis, blastomycosis, coccidioidomycosis) are caused by dimorphic fungi that exist as moulds in soil and convert to yeast at body temperature. Inhalation of conidia leads to alveolar macrophage phagocytosis. In immunocompetent hosts the cell-mediated immune response (Th1 pathway) typically contains infection as granulomas. In immunocompromised patients or with high inoculum exposure, disseminated disease occurs. Histoplasma capsulatum is endemic to the Ohio and Mississippi River valleys. Blastomyces dermatitidis is found in the Great Lakes and St. Lawrence River regions of Ontario and Quebec. Nurse practitioners must consider travel and occupational exposure history when evaluating chronic pneumonia unresponsive to antibiotics."
    },
    "riskFactors": [
      "Residence in or travel to endemic regions (Ontario Great Lakes, Ohio-Mississippi valleys)",
      "Immunocompromised status (HIV/AIDS with CD4 < 200 cells/mcL, organ transplant)",
      "Occupational exposure (farming, construction, spelunking, excavation)",
      "TNF-alpha inhibitor or high-dose corticosteroid therapy",
      "Chronic lung disease (COPD, bronchiectasis)",
      "Age > 55 years with comorbid diabetes mellitus"
    ],
    "diagnostics": [
      "Chest radiograph showing mediastinal lymphadenopathy or cavitary lesions",
      "Serum and urine antigen testing (Histoplasma urine antigen sensitivity > 90% in disseminated disease)",
      "Fungal cultures from sputum or BAL (may take 2-4 weeks)",
      "Serology: complement fixation and immunodiffusion antibody titres",
      "CT chest with contrast for parenchymal and mediastinal assessment",
      "Biopsy with GMS or PAS staining showing characteristic yeast forms"
    ],
    "management": [
      "Prescribe itraconazole 200 mg PO BID for mild-moderate pulmonary disease (6-12 months)",
      "Order amphotericin B lipid formulation IV for severe or disseminated disease",
      "Monitor itraconazole trough levels (target 1-4 mcg/mL) and hepatic function",
      "Consult infectious disease for immunocompromised patients or treatment failure",
      "Counsel on environmental avoidance of high-risk exposures",
      "Reassess with serial CXR and antigen levels every 3 months",
      "Coordinate with public health if occupational cluster suspected"
    ],
    "signs": {
      "left": [
        "Mild cough with low-grade fever resolving spontaneously",
        "Isolated pulmonary nodule on incidental imaging",
        "Positive serology without symptoms (prior exposure)",
        "Mild fatigue and arthralgia in acute phase"
      ],
      "right": [
        "Disseminated disease: hepatosplenomegaly, pancytopenia, mucosal ulcers",
        "Cavitary lung disease with hemoptysis",
        "CNS involvement: meningitis with headache and confusion",
        "Adrenal insufficiency from bilateral adrenal involvement"
      ]
    },
    "medications": [
      {
        "name": "Itraconazole",
        "type": "Triazole Antifungal",
        "action": "Inhibits lanosterol 14-alpha-demethylase blocking ergosterol synthesis in fungal cell membranes",
        "sideEffects": "Hepatotoxicity, GI upset, peripheral neuropathy, CHF exacerbation, QT prolongation",
        "contra": "Concurrent simvastatin or cisapride, severe CHF (EF < 30%), pregnancy",
        "pearl": "Requires acidic pH for absorption. Monitor trough levels and LFTs monthly. Significant CYP3A4 interactions."
      },
      {
        "name": "Amphotericin B (liposomal)",
        "type": "Polyene Antifungal",
        "action": "Binds ergosterol in fungal cell membranes creating transmembrane pores causing cell lysis",
        "sideEffects": "Nephrotoxicity, infusion reactions (fever, rigors), hypomagnesemia, anemia",
        "contra": "Severe renal impairment (use with caution), known hypersensitivity",
        "pearl": "Pre-medicate with acetaminophen and diphenhydramine. Monitor BUN, Cr, K, Mg daily. Liposomal formulation reduces nephrotoxicity."
      }
    ],
    "pearls": [
      "NPs must obtain thorough travel and occupational history when evaluating chronic pneumonia unresponsive to standard antibiotics - endemic fungal infections are frequently misdiagnosed as bacterial CAP or TB",
      "Histoplasma urine antigen is the most sensitive rapid diagnostic test for disseminated histoplasmosis but cross-reacts with blastomycosis - correlate with clinical presentation",
      "Itraconazole has critical CYP3A4 drug interactions - review the complete medication list before prescribing and monitor trough levels"
    ],
    "quiz": [
      {
        "question": "A 58-year-old from rural Ontario presents with 6-week productive cough, low-grade fever, and weight loss unresponsive to two courses of antibiotics. CXR shows a right upper lobe cavitary lesion. Which test should the clinician order first?",
        "options": [
          "Sputum AFB smear and culture",
          "Blastomyces urine antigen and fungal cultures",
          "CT pulmonary angiogram",
          "Bronchoscopy with biopsy"
        ],
        "correct": 1,
        "rationale": "Ontario is endemic for blastomycosis. Chronic pneumonia with cavitary lesion unresponsive to antibiotics suggests fungal infection. Urine antigen provides rapid results while cultures confirm diagnosis."
      }
    ]
  },
  "metabolic-respiratory-disturbances-np": {
    "title": "Metabolic Respiratory Disturbances",
    "cellular": {
      "title": "Acid-Base Compensation Mechanisms",
      "content": "The respiratory system compensates for metabolic acid-base disorders through chemoreceptor-mediated changes in ventilation. Central chemoreceptors in the medulla respond to CSF pH changes driven by arterial CO2, while peripheral chemoreceptors in the carotid and aortic bodies detect arterial pH and PaO2. In metabolic acidosis (pH < 7.35, HCO3 < 22 mmol/L), the respiratory centre increases ventilation rate and depth (Kussmaul breathing) to lower PaCO2. Winter's formula (expected PaCO2 = 1.5 x HCO3 + 8 +/- 2) predicts respiratory compensation. In metabolic alkalosis, ventilation decreases to retain CO2 though compensation is limited by hypoxic drive. The clinician must interpret ABGs systematically and calculate the anion gap (Na - Cl - HCO3, normal 8-12 mmol/L)."
    },
    "riskFactors": [
      "Diabetic ketoacidosis - most common cause of high anion gap metabolic acidosis in type 1 diabetes",
      "Chronic kidney disease with GFR < 30 mL/min/1.73m2 (uremic acidosis)",
      "Severe diarrhea or intestinal fistulae (bicarbonate loss)",
      "Lactic acidosis from sepsis, shock, or tissue hypoperfusion",
      "Salicylate, methanol, or ethylene glycol poisoning",
      "Prolonged vomiting or NG suction (metabolic alkalosis)"
    ],
    "diagnostics": [
      "ABG analysis: pH, PaCO2, PaO2, HCO3, base excess",
      "Serum electrolytes: Na, K, Cl, HCO3 to calculate anion gap",
      "Serum lactate (normal < 2.0 mmol/L, critical > 4.0 mmol/L)",
      "Serum ketones and blood glucose for DKA evaluation",
      "Renal function panel: BUN, creatinine, eGFR",
      "Toxicology screen and osmolal gap if poisoning suspected"
    ],
    "management": [
      "Order ABG and BMP to establish primary disorder and compensation",
      "Calculate anion gap and apply Winter's formula",
      "Treat underlying cause: insulin and fluids for DKA, dialysis for uremic acidosis",
      "Prescribe sodium bicarbonate IV only when pH < 7.1 with hemodynamic instability",
      "Monitor potassium closely during acidosis correction (K shifts intracellularly as pH normalizes)",
      "Initiate continuous cardiac monitoring for pH < 7.2 or > 7.55",
      "Repeat ABG in 2-4 hours to assess treatment response"
    ],
    "signs": {
      "left": [
        "Mild tachypnea compensating for metabolic acidosis",
        "Normal mental status with stable vital signs",
        "Serum bicarbonate 18-22 mmol/L with partial compensation",
        "Expected PaCO2 matches Winter's formula"
      ],
      "right": [
        "Kussmaul breathing (severe metabolic acidosis pH < 7.2)",
        "Altered consciousness, confusion, or coma",
        "Cardiac arrhythmias from electrolyte shifts",
        "Hemodynamic instability with hypotension"
      ]
    },
    "medications": [
      {
        "name": "Sodium Bicarbonate",
        "type": "Alkalinizing Agent",
        "action": "Provides exogenous bicarbonate to buffer excess hydrogen ions raising serum pH",
        "sideEffects": "Hypernatremia, fluid overload, paradoxical intracellular acidosis, hypokalemia",
        "contra": "Metabolic or respiratory alkalosis, severe hypernatremia, hypokalemia",
        "pearl": "Only administer when pH < 7.1 with hemodynamic compromise. Calculate dose: 0.3 x weight x base deficit. Give half initially and recheck ABG."
      },
      {
        "name": "Acetazolamide",
        "type": "Carbonic Anhydrase Inhibitor",
        "action": "Inhibits carbonic anhydrase in proximal renal tubule promoting bicarbonate excretion",
        "sideEffects": "Metabolic acidosis, paresthesias, drowsiness, nephrolithiasis, hypokalemia",
        "contra": "Severe hepatic insufficiency, severe renal failure, hypokalemia, sulfonamide allergy",
        "pearl": "Useful for metabolic alkalosis in patients on loop diuretics or mechanical ventilation. Monitor electrolytes and ABGs."
      }
    ],
    "pearls": [
      "Always calculate the anion gap when metabolic acidosis is present - high AG (> 12) points to MUDPILES causes (Methanol, Uremia, DKA, Propylene glycol, Isoniazid, Lactic acidosis, Ethylene glycol, Salicylates)",
      "Winter's formula determines if respiratory compensation is appropriate - if actual PaCO2 differs from expected, a mixed disorder is present",
      "Potassium shifts during acidosis correction are dangerous - for every 0.1 pH increase, K drops approximately 0.6 mmol/L requiring proactive replacement"
    ],
    "quiz": [
      {
        "question": "An NP reviews ABG: pH 7.28, PaCO2 22 mmHg, HCO3 10 mmol/L. Na 140, Cl 104, K 5.8. What is the primary disorder and anion gap?",
        "options": [
          "Respiratory alkalosis with AG 26",
          "Metabolic acidosis with AG 26",
          "Mixed acidosis with AG 36",
          "Metabolic acidosis with normal AG"
        ],
        "correct": 1,
        "rationale": "pH 7.28 = acidosis. Low HCO3 = metabolic. Low PaCO2 = respiratory compensation. AG = 140-104-10 = 26 (elevated). Winter's: 1.5(10)+8 = 23, matching PaCO2 22. Simple high AG metabolic acidosis with appropriate compensation."
      }
    ]
  },
  "asthma-pathophysiology-np": {
    "title": "Asthma Pathophysiology",
    "cellular": {
      "title": "Airway Inflammation and Remodeling",
      "content": "Asthma is a chronic inflammatory disorder of the airways characterized by reversible airflow obstruction, bronchial hyperresponsiveness, and airway remodeling. The pathophysiology involves a Th2-mediated immune response with eosinophilic inflammation. Allergen exposure triggers dendritic cell presentation to naive T cells, driving Th2 differentiation and release of IL-4, IL-5, and IL-13. IL-4 promotes IgE class switching in B cells, IL-5 recruits and activates eosinophils, and IL-13 stimulates goblet cell hyperplasia and mucus hypersecretion. Mast cell degranulation releases histamine, prostaglandins, and leukotrienes (especially LTC4, LTD4, LTE4) causing bronchoconstriction. Chronic inflammation leads to airway remodeling: subepithelial fibrosis, smooth muscle hypertrophy, angiogenesis, and mucous gland hyperplasia, resulting in fixed airflow limitation over time."
    },
    "riskFactors": [
      "Personal or family history of atopy (allergic rhinitis, eczema, food allergy)",
      "Environmental allergen exposure (dust mites, mould, pet dander, cockroach)",
      "Occupational sensitizers (isocyanates, flour dust, wood dust)",
      "Respiratory viral infections in early childhood (RSV, rhinovirus)",
      "Tobacco smoke exposure (active or passive)",
      "Obesity (BMI > 30 kg/m2)",
      "GERD contributing to airway irritation"
    ],
    "diagnostics": [
      "Spirometry with bronchodilator reversibility (FEV1 increase >= 12% and >= 200 mL)",
      "Peak expiratory flow (PEF) variability > 20% over 2 weeks",
      "Fractional exhaled nitric oxide (FeNO) > 25 ppb suggests eosinophilic inflammation",
      "Methacholine or exercise challenge test for suspected asthma with normal spirometry",
      "Serum total IgE and specific IgE or skin prick testing for allergen sensitization",
      "CBC with differential (eosinophilia > 0.3 x 10^9/L)"
    ],
    "management": [
      "Classify severity (intermittent, mild/moderate/severe persistent) using GINA guidelines",
      "Prescribe ICS as cornerstone controller therapy starting at lowest effective dose",
      "Add LABA to ICS for Step 3+ (formoterol-budesonide preferred for MART strategy)",
      "Prescribe SABA PRN for rescue (or low-dose ICS-formoterol PRN in mild asthma)",
      "Develop written asthma action plan with green/yellow/red zones",
      "Assess and address modifiable triggers: allergen avoidance, smoking cessation, GERD treatment",
      "Refer to respirology for severe/refractory asthma or consideration of biologics"
    ],
    "signs": {
      "left": [
        "Intermittent wheeze and cough responsive to SABA",
        "Normal spirometry between exacerbations",
        "Well-controlled symptoms with low-dose ICS",
        "PEF variability < 20%"
      ],
      "right": [
        "Severe dyspnea with accessory muscle use and inability to speak in sentences",
        "Silent chest on auscultation (critical airflow limitation)",
        "SpO2 < 92% with respiratory rate > 30/min",
        "Altered consciousness indicating respiratory failure"
      ]
    },
    "medications": [
      {
        "name": "Budesonide-Formoterol (Symbicort)",
        "type": "ICS-LABA Combination",
        "action": "Budesonide reduces airway inflammation by suppressing cytokine and mediator release; formoterol relaxes bronchial smooth muscle via beta-2 agonism with rapid onset",
        "sideEffects": "Oral candidiasis, dysphonia, tachycardia, tremor, adrenal suppression with high-dose ICS",
        "contra": "Known hypersensitivity; formoterol monotherapy without ICS is contraindicated in asthma",
        "pearl": "Can be used as both maintenance and reliever therapy (MART). Instruct patient to rinse mouth after each dose. Maximum 12 inhalations per day."
      },
      {
        "name": "Montelukast",
        "type": "Leukotriene Receptor Antagonist",
        "action": "Blocks CysLT1 receptors preventing LTD4-mediated bronchoconstriction, mucus secretion, and eosinophil recruitment",
        "sideEffects": "Headache, GI upset, neuropsychiatric effects (agitation, depression, suicidal ideation - FDA black box warning)",
        "contra": "Known hypersensitivity; not for acute bronchospasm relief",
        "pearl": "FDA black box warning for neuropsychiatric events. Counsel patients to report mood changes. Useful adjunct for exercise-induced asthma and concurrent allergic rhinitis."
      }
    ],
    "pearls": [
      "GINA now recommends against SABA-only treatment for any asthma patient - even mild intermittent asthma should receive PRN low-dose ICS-formoterol to reduce exacerbation risk and prevent airway remodeling",
      "FeNO > 25 ppb supports eosinophilic asthma phenotype and predicts good ICS response - this guides the clinician in selecting appropriate controller therapy",
      "The MART strategy (maintenance and reliever therapy) with budesonide-formoterol reduces severe exacerbations by 60% compared to traditional ICS + SABA PRN"
    ],
    "quiz": [
      {
        "question": "A 32-year-old presents with nocturnal cough 3 times per week and exercise-induced wheeze. Spirometry shows FEV1 78% predicted with 15% improvement post-bronchodilator. According to GINA, what is the appropriate initial treatment?",
        "options": [
          "SABA PRN only",
          "Low-dose ICS daily with SABA PRN",
          "Medium-dose ICS-LABA combination",
          "Oral montelukast alone"
        ],
        "correct": 1,
        "rationale": "Symptoms occurring > 2 times per week with reduced FEV1 indicate mild persistent asthma. GINA Step 2 recommends low-dose ICS as the cornerstone controller with SABA PRN for rescue. SABA-only is no longer recommended. ICS-LABA is for Step 3+ when low-dose ICS is insufficient."
      }
    ]
  },
  "copd-pathophysiology-np": {
    "title": "COPD Pathophysiology",
    "cellular": {
      "title": "Protease-Antiprotease Imbalance",
      "content": "COPD is characterized by persistent airflow limitation caused by a combination of small airway disease (obstructive bronchiolitis) and parenchymal destruction (emphysema). Cigarette smoke and other noxious particles trigger an abnormal inflammatory response involving neutrophils, macrophages, and CD8+ T lymphocytes. Neutrophils release elastase and matrix metalloproteinases (MMPs) that degrade elastin and collagen in lung parenchyma. Alpha-1 antitrypsin (AAT) normally inhibits neutrophil elastase, but the protease-antiprotease balance is overwhelmed by ongoing inflammation or genetically deficient in AAT deficiency (PiZZ phenotype). Emphysema results from alveolar wall destruction, loss of elastic recoil, and air trapping. Chronic bronchitis involves goblet cell hyperplasia, mucus hypersecretion, and squamous metaplasia of ciliated epithelium. Pulmonary hypertension develops from hypoxic vasoconstriction of pulmonary arteries, eventually leading to cor pulmonale."
    },
    "riskFactors": [
      "Tobacco smoking (> 20 pack-year history accounts for 80-90% of COPD cases)",
      "Alpha-1 antitrypsin deficiency (suspect in patients < 45 years or non-smokers)",
      "Occupational dust and chemical exposure (mining, grain, cadmium)",
      "Indoor biomass fuel exposure (cooking fires in developing countries)",
      "History of childhood respiratory infections or asthma",
      "Air pollution exposure (PM2.5 and NO2)",
      "Low socioeconomic status and malnutrition"
    ],
    "diagnostics": [
      "Post-bronchodilator spirometry: FEV1/FVC < 0.70 confirms airflow limitation",
      "GOLD staging by FEV1 % predicted: 1 (>= 80%), 2 (50-79%), 3 (30-49%), 4 (< 30%)",
      "ABCD assessment using mMRC dyspnea scale and exacerbation history",
      "Alpha-1 antitrypsin level for all newly diagnosed COPD patients (CTS guideline)",
      "6-minute walk test for functional capacity assessment",
      "CT chest to evaluate emphysema distribution and rule out lung malignancy"
    ],
    "management": [
      "Smoking cessation: prescribe pharmacotherapy (varenicline, NRT, bupropion) and refer to cessation program",
      "Prescribe bronchodilators based on GOLD group: LAMA (tiotropium) first-line for Group B-D",
      "Add ICS to LABA-LAMA only if blood eosinophils >= 300 cells/mcL or >= 100 with frequent exacerbations",
      "Order pulmonary rehabilitation for all patients with mMRC >= 2",
      "Prescribe home oxygen if PaO2 <= 55 mmHg or SpO2 <= 88% at rest (LTOT criteria)",
      "Administer annual influenza and pneumococcal vaccines (PCV20 or PCV15 + PPSV23)",
      "Develop COPD action plan for early self-management of exacerbations"
    ],
    "signs": {
      "left": [
        "Mild dyspnea on exertion with FEV1 >= 80% predicted",
        "Occasional productive cough in the morning",
        "Normal oxygen saturation at rest",
        "Able to complete 6MWT > 350 metres"
      ],
      "right": [
        "Severe dyspnea at rest with accessory muscle use and pursed-lip breathing",
        "Cyanosis with SpO2 < 88% on room air",
        "Signs of right heart failure: JVD, peripheral edema, hepatomegaly",
        "Cachexia and respiratory muscle wasting (BMI < 21 kg/m2)"
      ]
    },
    "medications": [
      {
        "name": "Tiotropium (Spiriva)",
        "type": "Long-Acting Muscarinic Antagonist (LAMA)",
        "action": "Blocks M3 muscarinic receptors on airway smooth muscle preventing acetylcholine-mediated bronchoconstriction; 24-hour duration",
        "sideEffects": "Dry mouth (most common), urinary retention, constipation, tachycardia, angle-closure glaucoma exacerbation",
        "contra": "Narrow-angle glaucoma, prostatic hyperplasia with urinary retention, known ipratropium allergy",
        "pearl": "First-line maintenance bronchodilator for COPD. Reduces exacerbations by 25% vs placebo. Do not co-prescribe with short-acting anticholinergics. Handihaler (dry powder) or Respimat (soft mist) inhaler."
      },
      {
        "name": "Roflumilast",
        "type": "PDE4 Inhibitor",
        "action": "Selectively inhibits phosphodiesterase-4, reducing intracellular cAMP degradation in inflammatory cells, leading to decreased neutrophilic inflammation and mucus secretion",
        "sideEffects": "Weight loss (5-10%), nausea, diarrhea, headache, insomnia, depression and suicidal ideation",
        "contra": "Moderate-severe hepatic impairment, concurrent theophylline use, active suicidal ideation",
        "pearl": "Reserved for severe COPD (FEV1 < 50%) with chronic bronchitis phenotype and frequent exacerbations despite triple therapy. Monitor weight and psychiatric symptoms. Not a bronchodilator."
      }
    ],
    "pearls": [
      "All newly diagnosed COPD patients should be tested for alpha-1 antitrypsin deficiency regardless of age or smoking history - this is a Canadian Thoracic Society Grade A recommendation that is frequently overlooked",
      "ICS should NOT be prescribed to all COPD patients - only add ICS when blood eosinophils >= 300 or >= 100 with 2+ moderate/1 hospitalized exacerbation, as ICS increases pneumonia risk in COPD",
      "The GOLD ABE assessment tool now replaces ABCD: Group A (low symptoms, low risk), Group B (high symptoms, low risk), Group E (any exacerbation history) - this simplifies initial pharmacotherapy decisions"
    ],
    "quiz": [
      {
        "question": "A 62-year-old with 40 pack-year smoking history has FEV1/FVC 0.58, FEV1 42% predicted, mMRC 3, and 2 moderate exacerbations last year. Blood eosinophils 350 cells/mcL. What is the most appropriate initial therapy?",
        "options": [
          "SABA PRN only",
          "LAMA monotherapy",
          "LAMA + LABA combination",
          "LAMA + LABA + ICS triple therapy"
        ],
        "correct": 3,
        "rationale": "GOLD Group E (exacerbation history) with FEV1 42% (GOLD 3) and elevated eosinophils (350 >= 300). Initial therapy for Group E with eosinophils >= 300 is LAMA + LABA + ICS triple therapy. The elevated eosinophil count predicts ICS benefit and justifies starting triple therapy from the outset."
      }
    ]
  },
  "pneumonia-gas-exchange-np": {
    "title": "Pneumonia and Gas Exchange",
    "cellular": {
      "title": "Alveolar-Capillary Membrane Disruption",
      "content": "Pneumonia disrupts gas exchange by filling alveoli with inflammatory exudate (neutrophils, bacteria, fluid, fibrin), creating intrapulmonary shunt physiology. Ventilation-perfusion (V/Q) mismatch occurs when perfused alveoli are not adequately ventilated due to consolidation or atelectasis. The resulting hypoxemia is initially responsive to supplemental oxygen unless massive consolidation creates a true shunt (V/Q = 0). The A-a gradient (PAO2 - PaO2) widens in pneumonia (normal < 15 mmHg in young adults, increases with age). Community-acquired pneumonia (CAP) is most commonly caused by Streptococcus pneumoniae, followed by Haemophilus influenzae, Mycoplasma pneumoniae, and respiratory viruses. Hospital-acquired pneumonia (HAP) involves more resistant organisms including MRSA, Pseudomonas aeruginosa, and Klebsiella pneumoniae. The clinician must calculate severity scores (CRB-65 or PSI/PORT) to guide site-of-care decisions."
    },
    "riskFactors": [
      "Age >= 65 years with multiple comorbidities",
      "Chronic lung disease (COPD, bronchiectasis, CF)",
      "Immunosuppression (chemotherapy, HIV, biologics, transplant)",
      "Dysphagia and aspiration risk (stroke, dementia, GERD)",
      "Recent hospitalization or long-term care residence",
      "Smoking (active or recent cessation < 1 year)",
      "Poor oral hygiene (aspiration pneumonia risk)"
    ],
    "diagnostics": [
      "Chest radiograph PA and lateral (consolidation, air bronchograms, pleural effusion)",
      "CBC with differential (leukocytosis with left shift or leukopenia in severe cases)",
      "Blood cultures x2 before antibiotics if hospitalized",
      "Sputum Gram stain and culture (quality specimen: > 25 PMNs, < 10 squamous per LPF)",
      "Procalcitonin to guide antibiotic initiation and duration (> 0.25 mcg/L suggests bacterial)",
      "Legionella and pneumococcal urinary antigens if moderate-severe CAP"
    ],
    "management": [
      "Calculate CRB-65 score (Confusion, RR >= 30, BP systolic < 90 or diastolic <= 60, age >= 65)",
      "Outpatient CAP: amoxicillin 1g TID (first-line) or doxycycline if penicillin allergy",
      "Inpatient CAP: IV ampicillin + azithromycin or respiratory fluoroquinolone monotherapy",
      "Severe CAP/ICU: IV ceftriaxone + azithromycin +/- vancomycin if MRSA risk",
      "Reassess at 48-72 hours for clinical response and de-escalation opportunity",
      "Target SpO2 92-96% (88-92% if COPD with CO2 retention risk)",
      "Order follow-up CXR at 6-8 weeks to confirm radiographic resolution"
    ],
    "signs": {
      "left": [
        "Productive cough with purulent sputum and low-grade fever",
        "Focal crackles on auscultation with dullness to percussion",
        "SpO2 >= 94% on room air with stable vital signs",
        "CRB-65 score 0: suitable for outpatient management"
      ],
      "right": [
        "High fever >= 39 C with rigors and pleuritic chest pain",
        "SpO2 < 92% requiring supplemental oxygen",
        "Septic: hypotension, tachycardia > 120, altered mental status",
        "Multilobar involvement or necrotizing pneumonia on imaging"
      ]
    },
    "medications": [
      {
        "name": "Amoxicillin",
        "type": "Aminopenicillin Antibiotic",
        "action": "Inhibits bacterial cell wall synthesis by binding penicillin-binding proteins (PBPs), preventing peptidoglycan cross-linking",
        "sideEffects": "Diarrhea, nausea, rash (maculopapular - not true allergy), Clostridioides difficile-associated diarrhea, anaphylaxis (rare)",
        "contra": "True penicillin allergy (anaphylaxis, angioedema), infectious mononucleosis (causes rash)",
        "pearl": "First-line for outpatient CAP in previously healthy adults (Canadian guidelines). High-dose 1g TID preferred for Streptococcus pneumoniae coverage. Complete full course even if symptoms improve."
      },
      {
        "name": "Azithromycin",
        "type": "Macrolide Antibiotic",
        "action": "Binds 50S ribosomal subunit inhibiting bacterial protein synthesis; also covers atypical organisms (Mycoplasma, Chlamydophila, Legionella)",
        "sideEffects": "QT prolongation, GI upset, hepatotoxicity (rare), ototoxicity with prolonged use",
        "contra": "Known macrolide allergy, concurrent QT-prolonging medications, myasthenia gravis (may worsen)",
        "pearl": "Used in combination with beta-lactam for inpatient CAP to cover atypical organisms. 5-day course (500mg day 1, then 250mg days 2-5). Monitor QTc in patients on other QT-prolonging drugs."
      }
    ],
    "pearls": [
      "CRB-65 is the preferred community assessment tool in Canada: 0 = outpatient, 1-2 = consider admission, 3-4 = urgent hospitalization and possible ICU - this guides the NP's site-of-care decision",
      "Procalcitonin < 0.25 mcg/L has high negative predictive value for bacterial pneumonia - the clinician can use this to safely withhold antibiotics in viral lower respiratory tract infections",
      "Follow-up chest radiograph at 6-8 weeks is essential to confirm resolution - persistent infiltrate in a smoker >= 50 years requires further investigation to exclude underlying malignancy"
    ],
    "quiz": [
      {
        "question": "A 72-year-old presents with fever 38.8 C, productive cough, RR 32, BP 85/50, and confusion. CXR shows right lower lobe consolidation. What is the CRB-65 score and appropriate management?",
        "options": [
          "CRB-65 = 2, admit to medical ward",
          "CRB-65 = 3, admit to ward with IV antibiotics",
          "CRB-65 = 4, urgent ICU admission with IV ceftriaxone + azithromycin",
          "CRB-65 = 3, outpatient with oral fluoroquinolone"
        ],
        "correct": 2,
        "rationale": "CRB-65 criteria met: Confusion (1), RR >= 30 (1), BP systolic < 90 (1), age >= 65 (1) = score 4. This indicates severe CAP requiring urgent ICU admission. Treatment is IV ceftriaxone + azithromycin (or respiratory fluoroquinolone) per Canadian guidelines for severe CAP."
      }
    ]
  },
  "asthma-diagnostic-criteria-np": {
    "title": "Asthma Diagnostic Criteria",
    "cellular": {
      "title": "Objective Confirmation of Variable Airflow",
      "content": "Asthma diagnosis requires demonstration of variable expiratory airflow limitation. Spirometry showing bronchodilator reversibility (FEV1 increase >= 12% AND >= 200 mL after 200-400 mcg salbutamol) is the gold standard. If spirometry is normal, provocation testing with methacholine (PC20 < 4 mg/mL is diagnostic, 4-16 mg/mL is borderline) or exercise challenge (FEV1 decrease >= 10-15%) can confirm bronchial hyperresponsiveness. Peak flow variability > 10% in adults (> 13% in children) over 2 weeks supports the diagnosis. FeNO > 50 ppb in steroid-naive adults strongly supports eosinophilic asthma. The clinician must distinguish asthma from COPD, vocal cord dysfunction, and cardiac dyspnea using clinical history and objective testing. GINA guidelines emphasize that asthma should never be diagnosed on symptoms alone."
    },
    "riskFactors": [
      "Family history of asthma or atopy (strongest predictor)",
      "Personal history of allergic rhinitis, eczema, or food allergy",
      "Obesity (BMI > 30 associated with more severe, less corticosteroid-responsive asthma)",
      "Early-life respiratory infections (RSV bronchiolitis)",
      "Environmental tobacco smoke exposure in childhood",
      "Occupational sensitizer exposure (onset correlates with work exposure)",
      "Air pollution and indoor allergens (dust mites, mould)"
    ],
    "diagnostics": [
      "Pre and post-bronchodilator spirometry (FEV1 reversibility >= 12% and >= 200 mL)",
      "Methacholine challenge test if spirometry normal (PC20 < 4 mg/mL diagnostic)",
      "Peak expiratory flow diary over 2 weeks (variability > 10%)",
      "FeNO measurement (> 50 ppb steroid-naive; > 25 ppb in treated patients suggests ongoing eosinophilic inflammation)",
      "Allergy testing: skin prick test or serum specific IgE panel",
      "CBC with differential for eosinophil count (> 0.3 x 10^9/L supports diagnosis)"
    ],
    "management": [
      "Document baseline spirometry before starting controller therapy",
      "Initiate ICS at dose appropriate to severity classification",
      "Reassess in 2-3 months with repeat spirometry to confirm response",
      "If diagnosis uncertain, consider therapeutic trial of ICS for 6-8 weeks",
      "Refer to respirology if diagnostic uncertainty persists or severe presentation",
      "Develop individualized asthma action plan with written instructions",
      "Assess inhaler technique at every visit using teach-back method"
    ],
    "signs": {
      "left": [
        "Variable wheeze and cough worse at night and early morning",
        "Clear bronchodilator response on spirometry",
        "Normal lung function between episodes",
        "Symptoms triggered by identifiable allergens or exercise"
      ],
      "right": [
        "Fixed airflow obstruction on serial spirometry (consider COPD overlap)",
        "Stridor suggesting vocal cord dysfunction (not asthma)",
        "Unilateral wheeze raising concern for endobronchial lesion",
        "Progressive dyspnea without variability (consider cardiac or restrictive disease)"
      ]
    },
    "medications": [
      {
        "name": "Salbutamol (Ventolin)",
        "type": "Short-Acting Beta-2 Agonist (SABA)",
        "action": "Selectively stimulates beta-2 adrenergic receptors on bronchial smooth muscle, activating adenylyl cyclase and increasing cAMP, causing rapid bronchodilation within 5 minutes lasting 4-6 hours",
        "sideEffects": "Tremor, tachycardia, palpitations, hypokalemia with repeated dosing, paradoxical bronchospasm (rare)",
        "contra": "Known hypersensitivity; use with caution in thyrotoxicosis, cardiovascular disease, diabetes",
        "pearl": "Used for diagnostic spirometry reversibility testing and rescue relief. Overuse (> 3 canisters/year) indicates poor asthma control requiring controller therapy escalation. Each canister provides approximately 200 doses."
      },
      {
        "name": "Methacholine",
        "type": "Cholinergic Bronchoprovocation Agent",
        "action": "Synthetic muscarinic agonist that causes dose-dependent bronchoconstriction in hyperresponsive airways; used diagnostically, not therapeutically",
        "sideEffects": "Bronchoconstriction, chest tightness, cough, dyspnea during testing (reversed with salbutamol)",
        "contra": "FEV1 < 60% predicted, recent MI or stroke, uncontrolled hypertension, pregnancy, breastfeeding",
        "pearl": "Administered in specialized pulmonary function labs with emergency equipment available. PC20 < 4 mg/mL = positive (asthma likely). PC20 4-16 = borderline. PC20 > 16 = negative (asthma unlikely). Always reverse with salbutamol post-test."
      }
    ],
    "pearls": [
      "Never diagnose asthma on symptoms alone - GINA and CTS require objective confirmation of variable airflow limitation through spirometry, PEF variability, or provocation testing before starting long-term controller therapy",
      "FeNO is a complementary biomarker that guides therapy but does not replace spirometry for diagnosis - high FeNO (> 50 ppb) predicts good ICS response while low FeNO (< 25 ppb) suggests non-eosinophilic asthma phenotype requiring different treatment approach",
      "Methacholine challenge has excellent negative predictive value (> 95%) - a negative test essentially rules out current asthma, making it the most useful test when the clinician suspects asthma but spirometry is normal"
    ],
    "quiz": [
      {
        "question": "A 28-year-old reports episodic wheeze and cough for 6 months. Spirometry shows FEV1 92% predicted with FEV1/FVC 0.82. Post-bronchodilator FEV1 increases by 8% (150 mL). What is the next best diagnostic step?",
        "options": [
          "Diagnose asthma and start ICS",
          "Order methacholine challenge test",
          "Obtain CT chest",
          "Prescribe SABA PRN and reassess in 3 months"
        ],
        "correct": 1,
        "rationale": "Spirometry is normal and bronchodilator response does not meet criteria (requires >= 12% AND >= 200 mL). With normal spirometry and subthreshold reversibility, methacholine challenge is the next best test to assess bronchial hyperresponsiveness. A positive result (PC20 < 4 mg/mL) would confirm asthma diagnosis."
      }
    ]
  },
  "copd-diagnostic-criteria-np": {
    "title": "COPD Diagnostic Criteria and GOLD Staging",
    "cellular": {
      "title": "Post-Bronchodilator Spirometry",
      "content": "COPD diagnosis requires post-bronchodilator spirometry demonstrating a fixed ratio of FEV1/FVC < 0.70. Unlike asthma, airflow limitation in COPD is not fully reversible. GOLD severity staging uses post-bronchodilator FEV1 percent predicted: GOLD 1 (mild) >= 80%, GOLD 2 (moderate) 50-79%, GOLD 3 (severe) 30-49%, GOLD 4 (very severe) < 30%. The 2024 GOLD ABE assessment combines symptom burden (mMRC or CAT score) with exacerbation history: Group A (low symptoms, low exacerbation risk), Group B (high symptoms, low exacerbation risk), Group E (any exacerbation history). This replaces the previous ABCD tool. COPD phenotyping (emphysema-predominant vs chronic bronchitis-predominant vs asthma-COPD overlap) guides therapy selection. Blood eosinophils are a key biomarker: >= 300 cells/mcL predicts ICS benefit while < 100 cells/mcL predicts increased pneumonia risk with ICS."
    },
    "riskFactors": [
      "Tobacco smoking >= 10 pack-years (strongest risk factor)",
      "Alpha-1 antitrypsin deficiency (screen all COPD patients)",
      "Occupational exposures: coal, silica, cadmium, grain dust",
      "Biomass fuel smoke exposure (wood, dung, crop residues)",
      "History of severe childhood respiratory infections",
      "Passive smoke exposure throughout childhood",
      "Low socioeconomic status and malnutrition"
    ],
    "diagnostics": [
      "Post-bronchodilator spirometry: FEV1/FVC < 0.70 (mandatory for diagnosis)",
      "GOLD staging by FEV1 % predicted after bronchodilator",
      "mMRC dyspnea scale or CAT score for symptom assessment",
      "Alpha-1 antitrypsin level (serum; if low, confirm with phenotype/genotype)",
      "CBC with differential for eosinophil count (guides ICS decision)",
      "CT chest for emphysema characterization and lung cancer screening eligibility"
    ],
    "management": [
      "Smoking cessation: prescribe varenicline (most effective), NRT, or bupropion",
      "Group A: short-acting bronchodilator PRN",
      "Group B: LAMA monotherapy (tiotropium) or LAMA + LABA if severe symptoms",
      "Group E: LAMA + LABA; add ICS if eosinophils >= 300 or >= 100 with frequent exacerbations",
      "Refer to pulmonary rehabilitation for all patients with mMRC >= 2",
      "Prescribe supplemental O2 if PaO2 <= 55 mmHg or SpO2 <= 88% at rest",
      "Administer pneumococcal (PCV20) and annual influenza vaccines"
    ],
    "signs": {
      "left": [
        "Mild exertional dyspnea with chronic productive cough",
        "FEV1 >= 50% predicted with 0-1 exacerbations per year",
        "Adequate exercise tolerance (6MWT > 350 metres)",
        "Oxygen saturation >= 92% at rest on room air"
      ],
      "right": [
        "Severe dyspnea at rest, barrel chest, pursed-lip breathing",
        "FEV1 < 30% with frequent severe exacerbations",
        "Cor pulmonale: JVD, peripheral edema, loud P2",
        "BMI < 21 with muscle wasting and cachexia"
      ]
    },
    "medications": [
      {
        "name": "Umeclidinium-Vilanterol (Anoro Ellipta)",
        "type": "LAMA-LABA Combination",
        "action": "Umeclidinium blocks M3 receptors (anticholinergic bronchodilation); vilanterol stimulates beta-2 receptors (sympathomimetic bronchodilation); complementary mechanisms provide superior bronchodilation",
        "sideEffects": "Nasopharyngitis, headache, cough, UTI, dry mouth, urinary retention, tachycardia",
        "contra": "Severe milk protein allergy (lactose carrier), narrow-angle glaucoma, urinary retention",
        "pearl": "Once-daily inhalation. Preferred for GOLD Group B and Group E without elevated eosinophils. Superior FEV1 improvement compared to either agent alone. Does not replace rescue SABA."
      },
      {
        "name": "Fluticasone-Umeclidinium-Vilanterol (Trelegy Ellipta)",
        "type": "ICS-LAMA-LABA Triple Therapy",
        "action": "Fluticasone (ICS) reduces airway inflammation; umeclidinium (LAMA) and vilanterol (LABA) provide dual bronchodilation; triple therapy for maximum benefit",
        "sideEffects": "Pneumonia (ICS-associated), oral candidiasis, dysphonia, urinary retention, tachycardia",
        "contra": "Severe milk protein allergy, active TB, untreated systemic fungal infections",
        "pearl": "Once-daily single inhaler triple therapy. Only add ICS if eosinophils >= 300 or >= 100 with 2+ exacerbations. IMPACT trial showed 25% exacerbation reduction vs dual bronchodilation. Monitor for pneumonia."
      }
    ],
    "pearls": [
      "Post-bronchodilator FEV1/FVC < 0.70 is mandatory for COPD diagnosis - never diagnose COPD without spirometry, and never use pre-bronchodilator values alone as they overdiagnose COPD in older adults",
      "Blood eosinophils are the key biomarker guiding ICS use in COPD: >= 300 cells/mcL = add ICS, 100-299 = consider ICS if frequent exacerbations, < 100 = avoid ICS due to pneumonia risk without benefit",
      "Alpha-1 antitrypsin testing is recommended for ALL newly diagnosed COPD patients by the Canadian Thoracic Society - this is one of the most commonly missed diagnoses in COPD management"
    ],
    "quiz": [
      {
        "question": "A 55-year-old with 30 pack-year history has post-BD FEV1/FVC 0.62, FEV1 45% predicted, CAT score 22, 3 moderate exacerbations last year, blood eosinophils 85 cells/mcL. What is the recommended initial therapy?",
        "options": [
          "LAMA monotherapy",
          "LAMA + LABA",
          "LAMA + LABA + ICS",
          "ICS + LABA"
        ],
        "correct": 1,
        "rationale": "GOLD 3 (FEV1 45%), Group E (3 exacerbations). However, eosinophils are < 100, which predicts NO benefit from ICS and increased pneumonia risk. Initial therapy should be LAMA + LABA without ICS. ICS should be avoided when eosinophils < 100."
      }
    ]
  },
  "pneumonia-diagnostic-criteria-np": {
    "title": "Pneumonia Diagnostic Criteria and Severity",
    "cellular": {
      "title": "CRB-65 and PSI Scoring Systems",
      "content": "Pneumonia diagnosis combines clinical presentation (cough, fever, dyspnea, pleuritic pain) with radiographic confirmation (new infiltrate on CXR). The clinician must differentiate community-acquired (CAP), hospital-acquired (HAP >= 48h after admission), and aspiration pneumonia. Severity assessment using validated tools guides site-of-care decisions. CRB-65 (Confusion, Respiratory rate >= 30, Blood pressure systolic < 90 or diastolic <= 60, age >= 65): score 0 = outpatient, 1-2 = consider admission, 3-4 = urgent hospitalization. The Pneumonia Severity Index (PSI/PORT) uses demographics, comorbidities, vital signs, and labs to stratify into classes I-V. Biomarkers aid diagnosis: procalcitonin > 0.25 mcg/L supports bacterial etiology, CRP > 100 mg/L with fever and consolidation has 96% specificity for bacterial pneumonia. Blood cultures are recommended for all hospitalized patients before antibiotic administration."
    },
    "riskFactors": [
      "Age >= 65 years (highest incidence and mortality)",
      "Chronic lung disease especially COPD and bronchiectasis",
      "Immunosuppression from any cause",
      "Dysphagia and aspiration risk (neurological conditions)",
      "Recent viral upper respiratory infection",
      "Institutionalization (long-term care, group homes)",
      "Alcohol use disorder (aspiration risk, immunosuppression)"
    ],
    "diagnostics": [
      "Chest radiograph PA and lateral (gold standard for pneumonia diagnosis)",
      "CBC with differential, BMP, hepatic panel for severity assessment",
      "Blood cultures x2 (before antibiotics in all hospitalized patients)",
      "Sputum Gram stain and culture (if productive cough and quality specimen obtainable)",
      "Procalcitonin level (> 0.25 supports bacterial, < 0.1 suggests viral)",
      "Legionella urinary antigen if moderate-severe CAP or risk factors"
    ],
    "management": [
      "Calculate CRB-65 at initial assessment to guide disposition",
      "Outpatient CAP: amoxicillin 1g TID x5-7 days (healthy, no recent antibiotics)",
      "Outpatient CAP with comorbidities: amoxicillin-clavulanate 875/125 BID + macrolide",
      "Inpatient non-ICU: ampicillin IV + azithromycin or respiratory FQ monotherapy",
      "Inpatient ICU: ceftriaxone + azithromycin; add vancomycin if MRSA risk",
      "Reassess clinical response at 48-72 hours",
      "Switch IV to PO when afebrile 48h, tolerating PO, and clinically improving"
    ],
    "signs": {
      "left": [
        "Productive cough, fever < 38.5 C, focal crackles, CRB-65 = 0",
        "SpO2 >= 94%, normal mental status, tolerating PO fluids",
        "Unilateral consolidation on CXR without pleural effusion",
        "Improving symptoms after 48-72 hours of antibiotics"
      ],
      "right": [
        "CRB-65 >= 3: confusion, RR >= 30, hypotension, elderly",
        "Multilobar involvement or rapidly progressing infiltrates",
        "Complicated parapneumonic effusion or empyema",
        "Septic shock requiring vasopressors and ICU admission"
      ]
    },
    "medications": [
      {
        "name": "Amoxicillin-Clavulanate",
        "type": "Aminopenicillin + Beta-Lactamase Inhibitor",
        "action": "Amoxicillin inhibits cell wall synthesis; clavulanate irreversibly inhibits beta-lactamases extending spectrum to H. influenzae, M. catarrhalis, and some anaerobes",
        "sideEffects": "Diarrhea (common due to clavulanate), nausea, vulvovaginal candidiasis, hepatitis (rare), C. difficile",
        "contra": "True penicillin anaphylaxis, previous amoxicillin-clavulanate hepatitis, infectious mononucleosis",
        "pearl": "Preferred for outpatient CAP in patients with comorbidities (COPD, diabetes, renal disease). Use 875/125 formulation BID to minimize GI side effects. Pair with macrolide for atypical coverage."
      },
      {
        "name": "Moxifloxacin",
        "type": "Respiratory Fluoroquinolone",
        "action": "Inhibits bacterial DNA gyrase (topoisomerase II) and topoisomerase IV, preventing DNA replication and transcription; excellent gram-positive and atypical coverage",
        "sideEffects": "Tendon rupture, QT prolongation, peripheral neuropathy, C. difficile, aortic aneurysm/dissection risk, dysglycemia",
        "contra": "Concurrent QT-prolonging medications, history of tendon disorder with FQ use, myasthenia gravis, pregnancy",
        "pearl": "Reserve for penicillin allergy or inpatient monotherapy. Black box warnings: tendinopathy, peripheral neuropathy, CNS effects. Avoid in patients > 60 years, on corticosteroids, or with renal impairment. Effective as monotherapy for inpatient CAP."
      }
    ],
    "pearls": [
      "CRB-65 = 0 safely identifies low-risk patients who can be managed as outpatients - unnecessary hospitalization for pneumonia is costly and exposes patients to nosocomial risks",
      "Procalcitonin-guided antibiotic stewardship reduces antibiotic exposure by 2-3 days in respiratory infections without increasing adverse outcomes - the clinician should order procalcitonin and use it to guide duration of therapy",
      "Always obtain follow-up CXR at 6-8 weeks in patients >= 50 years or smokers to confirm radiographic resolution - persistent infiltrate may indicate underlying malignancy requiring further investigation"
    ],
    "quiz": [
      {
        "question": "A 70-year-old with COPD presents with purulent cough, fever 38.5 C, RR 28, BP 130/80, and oriented. CXR shows left lower lobe consolidation. CRB-65 score is 1. What is the most appropriate antibiotic regimen?",
        "options": [
          "Amoxicillin 1g TID alone",
          "Amoxicillin-clavulanate 875/125 BID + azithromycin 500mg day 1 then 250mg x4 days",
          "IV ceftriaxone + azithromycin",
          "IV meropenem + vancomycin"
        ],
        "correct": 1,
        "rationale": "CRB-65 = 1 (age >= 65) is borderline - consider outpatient vs short observation. With COPD comorbidity, outpatient treatment with amoxicillin-clavulanate (covering beta-lactamase producers) plus azithromycin (covering atypicals) is appropriate per Canadian guidelines for CAP with comorbidities."
      }
    ]
  },
  "asthma-step-therapy-np": {
    "title": "Asthma Step Therapy",
    "cellular": {
      "title": "GINA Stepwise Approach",
      "content": "GINA step therapy provides a systematic approach to asthma controller escalation and de-escalation. Step 1-2: PRN low-dose ICS-formoterol (preferred) or daily low-dose ICS + SABA PRN. Step 3: low-dose ICS-LABA maintenance (budesonide-formoterol preferred for MART). Step 4: medium-dose ICS-LABA +/- LTRA or tiotropium. Step 5: high-dose ICS-LABA + tiotropium; consider anti-IgE (omalizumab), anti-IL5 (mepolizumab, benralizumab), anti-IL4R (dupilumab), or anti-TSLP (tezepelumab) biologics based on phenotype. The clinician prescribes initial therapy based on severity classification and adjusts every 2-3 months based on symptom control assessment (ACT or ACQ scores). Step-down is attempted after 3 months of well-controlled asthma, reducing ICS dose by 25-50% while monitoring."
    },
    "riskFactors": [
      "Uncontrolled asthma despite adherence (step-up indication)",
      "Poor inhaler technique (most common cause of apparent treatment failure)",
      "Ongoing allergen or occupational exposure",
      "Active smoking (reduces ICS efficacy by up to 50%)",
      "Obesity and untreated GERD",
      "Non-adherence to controller therapy",
      "Frequent SABA use (> 2 canisters per year predicts exacerbation risk)"
    ],
    "diagnostics": [
      "Asthma Control Test (ACT): score < 20 indicates uncontrolled asthma",
      "Spirometry with bronchodilator at each step change",
      "FeNO monitoring to assess eosinophilic inflammation and ICS adherence",
      "Peak flow diary to assess variability and response to therapy",
      "Inhaler technique assessment using standardized checklist",
      "Blood eosinophils and total IgE for biologic eligibility assessment"
    ],
    "management": [
      "Assess control using ACT/ACQ at every visit before adjusting therapy",
      "Verify inhaler technique and adherence before any step-up",
      "Step up if asthma uncontrolled for 2-3 months despite correct technique",
      "Step down by reducing ICS dose 25-50% after 3 months well-controlled",
      "Never discontinue ICS entirely - maintain at least low-dose ICS or PRN ICS-formoterol",
      "Add tiotropium (Spiriva Respimat) as add-on at Step 4 before biologics",
      "Refer to severe asthma clinic for Step 5 biologic consideration"
    ],
    "signs": {
      "left": [
        "ACT score >= 20 (well-controlled)",
        "Daytime symptoms <= 2 days per week",
        "No night-time awakening due to asthma",
        "SABA use <= 2 times per week",
        "No activity limitation"
      ],
      "right": [
        "ACT score < 16 (very poorly controlled)",
        "Daily symptoms with frequent night-time awakening",
        "SABA use daily or multiple times daily",
        "Frequent exacerbations requiring oral corticosteroids",
        "Significant activity limitation despite treatment"
      ]
    },
    "medications": [
      {
        "name": "Budesonide-Formoterol (MART)",
        "type": "ICS-LABA for Maintenance and Reliever",
        "action": "Single inhaler used as both daily controller (low-dose BID) and as-needed reliever; formoterol's rapid onset allows rescue use while budesonide provides anti-inflammatory protection with every dose",
        "sideEffects": "Oral candidiasis, dysphonia, tachycardia, tremor; lower systemic effects at low-dose",
        "contra": "Known hypersensitivity; not appropriate with alternative LABA-containing regimens",
        "pearl": "MART strategy reduces severe exacerbations by 60% vs traditional regimens. Maximum 12 inhalations/day. Turbuhaler device - teach proper technique. Step 3 preferred approach in GINA 2024."
      },
      {
        "name": "Omalizumab (Xolair)",
        "type": "Anti-IgE Monoclonal Antibody",
        "action": "Binds free circulating IgE preventing attachment to FcepsilonRI receptors on mast cells and basophils, reducing allergic cascade activation and IgE-mediated inflammation",
        "sideEffects": "Injection site reactions, anaphylaxis (0.1-0.2%), headache, arthralgia",
        "contra": "Non-IgE-mediated asthma, very high IgE (> 1500 IU/mL - outside dosing tables)",
        "pearl": "Step 5 add-on for allergic asthma with elevated total IgE (30-1500 IU/mL) and positive skin prick testing. Administered SC every 2-4 weeks based on weight and IgE level. Observe 2 hours after first 3 doses for anaphylaxis."
      }
    ],
    "pearls": [
      "GINA 2024 no longer recommends SABA-only treatment at any step - even Step 1 patients should receive PRN low-dose ICS-formoterol to reduce exacerbation risk and prevent airway remodeling from untreated inflammation",
      "Before stepping up therapy, the clinician must always rule out the three most common causes of apparent treatment failure: poor inhaler technique (up to 80% of patients), non-adherence (check prescription refill frequency), and ongoing trigger exposure",
      "Blood eosinophils >= 150 cells/mcL and FeNO >= 20 ppb are the key biomarkers determining biologic eligibility - the clinician should obtain these before referral to a severe asthma specialist"
    ],
    "quiz": [
      {
        "question": "A patient on low-dose ICS-LABA has ACT 16, night symptoms 3x/week, uses SABA 5x/week. Inhaler technique is correct and adherence confirmed. What is the next step?",
        "options": [
          "Continue current therapy and reassess in 3 months",
          "Step up to medium-dose ICS-LABA",
          "Add oral montelukast and continue low-dose ICS-LABA",
          "Switch to SABA PRN only"
        ],
        "correct": 1,
        "rationale": "ACT 16 indicates poorly controlled asthma. With confirmed correct technique and adherence, the next GINA step is to increase to medium-dose ICS-LABA (Step 4). Adding LTRA is an alternative but medium-dose ICS-LABA is preferred. Never step down or remove ICS when control is poor."
      }
    ]
  },
  "copd-lama-laba-ics-np": {
    "title": "COPD Pharmacotherapy: LAMA, LABA, and ICS",
    "cellular": {
      "title": "Triple Therapy and Eosinophil-Guided ICS Use",
      "content": "COPD pharmacotherapy follows a stepwise approach guided by the GOLD ABE assessment and blood eosinophil count. LAMA (tiotropium, umeclidinium) provides 24-hour bronchodilation via M3 receptor blockade and reduces exacerbations. LABA (salmeterol, formoterol, vilanterol, indacaterol) provides sustained beta-2-mediated bronchodilation. LAMA + LABA dual bronchodilation is preferred over ICS-LABA for most COPD patients. ICS addition (triple therapy) is reserved for patients with blood eosinophils >= 300 cells/mcL or >= 100 with recurrent exacerbations, as the IMPACT and ETHOS trials demonstrated exacerbation reduction in this phenotype. ICS increases pneumonia risk in COPD (NNH approximately 30 per year) and should be avoided when eosinophils < 100. PDE4 inhibitors (roflumilast) are add-on therapy for chronic bronchitis phenotype with FEV1 < 50%. Azithromycin prophylaxis (250mg daily or 3x/week) reduces exacerbations in former smokers without hearing impairment or QT prolongation."
    },
    "riskFactors": [
      "Continued smoking despite COPD diagnosis",
      "Poor inhaler technique (up to 70% of patients in primary care)",
      "Frequent exacerbations (>= 2 moderate or >= 1 hospitalized per year)",
      "Eosinophilic phenotype with inadequate ICS step-down",
      "Comorbid conditions: CHF, osteoporosis, depression",
      "Non-adherence to maintenance therapy",
      "Failure to attend pulmonary rehabilitation"
    ],
    "diagnostics": [
      "Post-bronchodilator spirometry to confirm FEV1/FVC < 0.70 and monitor progression",
      "Blood eosinophil count to guide ICS therapy decisions",
      "Sputum culture if frequent purulent exacerbations",
      "ECG and echocardiogram if cor pulmonale suspected",
      "Annual screening CT chest if eligible for lung cancer screening",
      "Bone densitometry if on ICS > 1 year (osteoporosis risk)"
    ],
    "management": [
      "Prescribe LAMA monotherapy for Group B (tiotropium or umeclidinium)",
      "Prescribe LAMA + LABA for Group B with severe dyspnea or Group E with eos < 300",
      "Prescribe LAMA + LABA + ICS for Group E with eos >= 300 or >= 100 with 2+ exacerbations",
      "Consider ICS withdrawal if eosinophils < 100 and pneumonia events occurring",
      "Add roflumilast for chronic bronchitis phenotype with FEV1 < 50% on maximal inhaled therapy",
      "Consider azithromycin prophylaxis for exacerbation-prone patients (monitor QT and hearing)",
      "Verify inhaler technique at every visit using device-specific checklist"
    ],
    "signs": {
      "left": [
        "Symptom improvement after LAMA initiation (mMRC decrease >= 1)",
        "Exacerbation frequency reduced with optimized therapy",
        "Stable FEV1 decline < 40 mL/year on treatment",
        "Maintained exercise capacity and functional independence"
      ],
      "right": [
        "Persistent dyspnea despite triple therapy (refractory COPD)",
        "3+ exacerbations per year despite maximal inhaled therapy",
        "Rapid FEV1 decline > 60 mL/year suggesting accelerated disease",
        "Recurrent pneumonia on ICS requiring ICS withdrawal assessment"
      ]
    },
    "medications": [
      {
        "name": "Tiotropium (Spiriva Respimat)",
        "type": "Long-Acting Muscarinic Antagonist",
        "action": "Selective M3 muscarinic receptor antagonist providing 24-hour bronchodilation and reducing mucus hypersecretion",
        "sideEffects": "Dry mouth, urinary retention, constipation, angle-closure glaucoma exacerbation",
        "contra": "Narrow-angle glaucoma, significant prostatic hyperplasia with urinary retention",
        "pearl": "Respimat soft mist inhaler delivers slower aerosol improving lung deposition. Reduces exacerbations by 25% vs placebo. Foundation of COPD pharmacotherapy for Group B and E."
      },
      {
        "name": "Budesonide-Glycopyrrolate-Formoterol (Breztri Aerosphere)",
        "type": "ICS-LAMA-LABA Triple Therapy",
        "action": "Budesonide reduces eosinophilic inflammation; glycopyrrolate (LAMA) and formoterol (LABA) provide complementary bronchodilation via anticholinergic and sympathomimetic pathways",
        "sideEffects": "Pneumonia (ICS-related), oral candidiasis, dry mouth, UTI, tachycardia",
        "contra": "Active TB, untreated systemic fungal infections, severe milk protein allergy",
        "pearl": "Single inhaler triple therapy administered BID. ETHOS trial showed 24% exacerbation reduction vs LAMA-LABA. Only appropriate when eosinophils support ICS use. Rinse mouth after each dose."
      }
    ],
    "pearls": [
      "Blood eosinophils are the single most important biomarker guiding ICS use in COPD: >= 300 = start ICS, 100-299 = consider if exacerbating, < 100 = avoid ICS and consider withdrawal if already prescribed",
      "The WISDOM and SUNSET trials demonstrated that ICS withdrawal is safe in COPD patients with eosinophils < 300 who are on dual bronchodilation - the clinician should periodically reassess ICS necessity",
      "Azithromycin 250mg daily reduces COPD exacerbations by approximately 27% but requires baseline ECG (QTc), audiometry, and sputum cultures for NTM before initiation"
    ],
    "quiz": [
      {
        "question": "A COPD patient on LAMA + LABA has 3 exacerbations this year. Blood eosinophils are 420 cells/mcL. FEV1 38% predicted. What should the clinician add?",
        "options": [
          "Oral theophylline",
          "ICS (escalate to triple therapy)",
          "Roflumilast",
          "Azithromycin prophylaxis"
        ],
        "correct": 1,
        "rationale": "With eosinophils 420 (>= 300) and frequent exacerbations on dual bronchodilation, adding ICS to create triple therapy is indicated per GOLD guidelines. The IMPACT trial demonstrated significant exacerbation reduction with triple therapy when eosinophils are elevated."
      }
    ]
  },
  "copd-exacerbation-rx-np": {
    "title": "COPD Exacerbation Management",
    "cellular": {
      "title": "Acute Exacerbation Pathophysiology",
      "content": "AECOPD is defined as an acute worsening of respiratory symptoms beyond normal day-to-day variation requiring a change in therapy. Exacerbations are classified as mild (managed with increased bronchodilators), moderate (requires systemic corticosteroids and/or antibiotics), or severe (requires hospitalization or ED visit). The most common triggers are viral respiratory infections (50-60%), bacterial infections (40-50%, predominantly H. influenzae, M. catarrhalis, S. pneumoniae), and environmental pollutants. Exacerbations accelerate FEV1 decline, reduce quality of life, and increase mortality (in-hospital mortality for severe exacerbations is 3-10%). The clinician must prescribe a short course of systemic corticosteroids (prednisone 40mg daily x 5 days) and antibiotics when purulent sputum is present or ventilatory support is required."
    },
    "riskFactors": [
      "History of previous exacerbations (strongest predictor)",
      "FEV1 < 50% predicted (GOLD 3-4)",
      "Persistent eosinophilia (paradoxically increases exacerbation risk)",
      "GERD with aspiration",
      "Continued smoking",
      "Poor adherence to maintenance bronchodilators",
      "Winter season and viral epidemic periods"
    ],
    "diagnostics": [
      "ABG if moderate-severe exacerbation (assess for respiratory acidosis and hypercapnia)",
      "CBC to assess WBC and eosinophil response",
      "CXR to exclude pneumonia, pneumothorax, or pleural effusion",
      "Sputum culture if purulent sputum and failure of initial antibiotics",
      "ECG to rule out arrhythmia or right heart strain",
      "BNP/NT-proBNP if cardiac decompensation suspected"
    ],
    "management": [
      "Increase SABA frequency: salbutamol 400-800 mcg via MDI+spacer or nebulizer q1-4h",
      "Prescribe prednisone 40 mg PO daily x 5 days (do not taper)",
      "Prescribe antibiotics if purulent sputum: amoxicillin-clavulanate or azithromycin x 5 days",
      "Initiate controlled oxygen therapy targeting SpO2 88-92% (avoid hyperoxia-induced hypercapnia)",
      "Assess need for NIV: pH < 7.35 with PaCO2 > 45 mmHg = BiPAP indication",
      "Review and optimize maintenance therapy before discharge",
      "Ensure follow-up within 1-4 weeks post-exacerbation"
    ],
    "signs": {
      "left": [
        "Increased dyspnea and cough above baseline",
        "Sputum volume increase without purulence",
        "SpO2 > 92% with stable hemodynamics",
        "Responds to increased bronchodilator therapy alone"
      ],
      "right": [
        "Severe dyspnea at rest with accessory muscle use",
        "Altered level of consciousness (hypercapnic encephalopathy)",
        "Respiratory acidosis: pH < 7.35, PaCO2 > 50 mmHg",
        "Hemodynamic instability or new arrhythmia"
      ]
    },
    "medications": [
      {
        "name": "Prednisone",
        "type": "Systemic Corticosteroid",
        "action": "Suppresses inflammatory cytokines (IL-1, IL-6, TNF-alpha), reduces eosinophil and neutrophil recruitment, decreases airway edema and mucus production",
        "sideEffects": "Hyperglycemia, insomnia, GI upset, mood changes, immunosuppression, adrenal suppression with prolonged use",
        "contra": "Active untreated infection, uncontrolled diabetes (relative - monitor glucose closely)",
        "pearl": "40 mg daily x 5 days is standard for AECOPD (REDUCE trial). No taper needed for courses <= 7 days. Monitor blood glucose in diabetic patients. Equivalent efficacy to IV methylprednisolone in most cases."
      },
      {
        "name": "Amoxicillin-Clavulanate",
        "type": "Aminopenicillin + Beta-Lactamase Inhibitor",
        "action": "Broad-spectrum coverage including H. influenzae, M. catarrhalis, and S. pneumoniae including beta-lactamase producers",
        "sideEffects": "Diarrhea, nausea, C. difficile, hepatitis (rare)",
        "contra": "Penicillin anaphylaxis, previous amoxicillin-clavulanate cholestatic hepatitis",
        "pearl": "Indicated for AECOPD with at least 2 of 3 Anthonisen criteria: increased dyspnea, increased sputum volume, increased sputum purulence. 5-day course is standard. Alternative: azithromycin or doxycycline for penicillin allergy."
      }
    ],
    "pearls": [
      "The Anthonisen criteria guide antibiotic use in AECOPD: antibiotics are indicated when 2 of 3 cardinal symptoms are present (increased dyspnea, increased sputum volume, increased sputum purulence) with purulence being the strongest indication",
      "Prednisone 40mg x 5 days is equally effective as 14-day courses (REDUCE trial) - the clinician should prescribe the short course to minimize steroid side effects",
      "Controlled oxygen targeting SpO2 88-92% is critical in severe COPD - excessive oxygen supplementation suppresses hypoxic ventilatory drive causing CO2 retention and respiratory acidosis"
    ],
    "quiz": [
      {
        "question": "A patient with COPD GOLD 3 presents with increased dyspnea, purulent sputum, and fever. ABG shows pH 7.32, PaCO2 58, PaO2 52 on room air. What is the most appropriate management?",
        "options": [
          "Nebulized salbutamol + high-flow O2 at 15 L/min",
          "Salbutamol neb + controlled O2 (target 88-92%) + prednisone 40mg + amoxicillin-clavulanate + consider BiPAP",
          "IV methylprednisolone 250mg + broad-spectrum antibiotics + intubation",
          "SABA PRN and oral prednisone only, reassess in 24 hours"
        ],
        "correct": 1,
        "rationale": "Severe AECOPD with respiratory acidosis (pH < 7.35, elevated PaCO2) and hypoxemia. Management requires: SABA nebulization, controlled O2 targeting 88-92% (NOT high-flow which worsens CO2 retention), systemic corticosteroids, antibiotics (purulent sputum = Anthonisen criteria met), and BiPAP consideration given acidosis."
      }
    ]
  },
  "pneumonia-outpatient-abx-np": {
    "title": "Pneumonia Outpatient Antibiotic Selection",
    "cellular": {
      "title": "Evidence-Based Antibiotic Prescribing for CAP",
      "content": "The clinician prescribes outpatient CAP antibiotics based on patient comorbidity status and local resistance patterns. For previously healthy adults without recent antibiotic use, amoxicillin 1g TID is first-line (Canadian guidelines). For patients with comorbidities (COPD, diabetes, CKD, alcoholism, immunosuppression) or recent antibiotic use within 3 months, amoxicillin-clavulanate 875/125 BID plus a macrolide (azithromycin) or a respiratory fluoroquinolone (moxifloxacin, levofloxacin) as monotherapy are recommended. Duration of therapy is typically 5-7 days, guided by clinical response and procalcitonin levels. The clinician must consider drug allergies (cross-reactivity between penicillins and cephalosporins is < 2% with 3rd/4th generation), drug interactions (macrolides and QT prolongation, fluoroquinolones and warfarin), and patient factors (pregnancy, renal function, age)."
    },
    "riskFactors": [
      "COPD or structural lung disease (increased risk of H. influenzae, P. aeruginosa)",
      "Diabetes mellitus (impaired immune function)",
      "Recent antibiotic use within 3 months (resistance selection)",
      "Chronic alcohol use (aspiration risk, Klebsiella)",
      "Chronic renal disease",
      "Immunosuppressive therapy",
      "Residence in long-term care facility"
    ],
    "diagnostics": [
      "CXR to confirm diagnosis and assess severity",
      "CRB-65 calculation to confirm outpatient suitability (score 0)",
      "Pulse oximetry (SpO2 >= 94% for outpatient management)",
      "Consider procalcitonin if viral vs bacterial etiology uncertain",
      "Sputum culture not routinely indicated for outpatient CAP",
      "Basic metabolic panel if comorbidities present"
    ],
    "management": [
      "Healthy adult, no comorbidities: amoxicillin 1g PO TID x 5 days",
      "With comorbidities or recent antibiotics: amoxicillin-clavulanate 875/125 BID + azithromycin x 5 days",
      "Penicillin allergy (non-anaphylaxis): cephalosporin (cefuroxime) + macrolide",
      "Penicillin anaphylaxis: respiratory fluoroquinolone (moxifloxacin 400mg daily x 5 days)",
      "Reassess at 48-72 hours by phone or in-person for clinical response",
      "Counsel on return precautions: worsening dyspnea, persistent high fever, confusion",
      "Follow-up CXR at 6-8 weeks for patients >= 50 years or smokers"
    ],
    "signs": {
      "left": [
        "Improving cough and reduced sputum production after 48-72 hours",
        "Defervescence within 48-72 hours of antibiotic initiation",
        "Maintained SpO2 >= 94% and oral intake",
        "Able to complete ADLs independently"
      ],
      "right": [
        "No clinical improvement or worsening after 48-72 hours of antibiotics",
        "New confusion or altered mental status developing",
        "SpO2 dropping below 92% or increasing respiratory distress",
        "Unable to tolerate oral medications due to vomiting"
      ]
    },
    "medications": [
      {
        "name": "Amoxicillin (high-dose)",
        "type": "Aminopenicillin",
        "action": "Inhibits bacterial cell wall synthesis by binding PBPs; high-dose 1g TID achieves concentrations above MIC for penicillin-intermediate S. pneumoniae",
        "sideEffects": "Diarrhea, nausea, rash, C. difficile (uncommon with short courses), anaphylaxis (rare)",
        "contra": "Penicillin anaphylaxis, infectious mononucleosis",
        "pearl": "First-line for healthy outpatient CAP in Canada. High dose (1g TID) overcomes intermediate penicillin resistance in S. pneumoniae. 5-day course is sufficient when clinical improvement occurs by day 3."
      },
      {
        "name": "Doxycycline",
        "type": "Tetracycline Antibiotic",
        "action": "Inhibits bacterial protein synthesis by binding 30S ribosomal subunit; covers typical and atypical CAP organisms",
        "sideEffects": "Photosensitivity, GI upset, esophageal ulceration (take upright with water), dental staining in children",
        "contra": "Pregnancy, breastfeeding, children < 8 years (dental and bone effects)",
        "pearl": "Alternative to macrolides for atypical coverage. 100mg BID x 5-7 days. Effective against M. pneumoniae, C. pneumoniae, and most S. pneumoniae. Avoid concurrent antacids or dairy which reduce absorption."
      }
    ],
    "pearls": [
      "Canadian guidelines recommend amoxicillin 1g TID (not standard 500mg) as first-line for outpatient CAP in healthy adults - the higher dose achieves pharmacodynamic targets against penicillin-intermediate S. pneumoniae",
      "Fluoroquinolones should be reserved for patients with true penicillin allergy or treatment failure - overuse drives resistance and carries serious adverse effects (tendinopathy, neuropathy, aortic dissection)",
      "5-day antibiotic courses are as effective as 7-10 day courses for outpatient CAP when clinical improvement occurs by day 3 - the clinician should prescribe the shortest effective course to reduce resistance selection"
    ],
    "quiz": [
      {
        "question": "A 45-year-old with COPD and type 2 diabetes presents with productive cough, fever 38.2 C, and right lower lobe consolidation. CRB-65 = 0, SpO2 95%. Last antibiotic use was 2 months ago. What is the appropriate prescription?",
        "options": [
          "Amoxicillin 1g TID x 5 days",
          "Amoxicillin-clavulanate 875/125 BID + azithromycin x 5 days",
          "Moxifloxacin 400mg daily x 5 days",
          "Ciprofloxacin 500mg BID x 7 days"
        ],
        "correct": 1,
        "rationale": "CRB-65 = 0 supports outpatient management. However, this patient has comorbidities (COPD, diabetes) and recent antibiotic use within 3 months. Canadian guidelines recommend amoxicillin-clavulanate + macrolide for this scenario. Ciprofloxacin lacks adequate gram-positive/atypical coverage for CAP."
      }
    ]
  },
  "systemic-pulmonary-circulation-np": {
    "title": "Systemic and Pulmonary Circulation",
    "cellular": {
      "title": "Pulmonary Vascular Physiology",
      "content": "The pulmonary circulation is a low-pressure, high-compliance system (mean PAP 8-20 mmHg) receiving the entire cardiac output. Unlike systemic arterioles which dilate in response to hypoxia, pulmonary arterioles constrict during hypoxia (hypoxic pulmonary vasoconstriction or HPV) to redirect blood away from poorly ventilated alveoli, optimizing V/Q matching. Chronic hypoxia from COPD, ILD, or OSA causes sustained pulmonary vasoconstriction, smooth muscle hypertrophy, and intimal fibrosis leading to pulmonary hypertension (mPAP >= 20 mmHg at rest). The right ventricle, adapted for volume work against low pressures, eventually fails under chronic pressure overload, producing cor pulmonale. Pulmonary embolism acutely increases pulmonary vascular resistance, causing right ventricular dilation and potential hemodynamic collapse."
    },
    "riskFactors": [
      "COPD with chronic hypoxemia (Group 3 PH)",
      "Obstructive sleep apnea (nocturnal hypoxemia)",
      "Left heart disease (Group 2 PH - most common cause overall)",
      "Chronic thromboembolic disease (Group 4 PH)",
      "Connective tissue diseases (scleroderma, SLE)",
      "Congenital heart disease with Eisenmenger syndrome",
      "Idiopathic pulmonary arterial hypertension (rare, young women)"
    ],
    "diagnostics": [
      "Echocardiogram: estimated RVSP > 35 mmHg suggests pulmonary hypertension",
      "Right heart catheterization: gold standard for PH diagnosis (mPAP >= 20 mmHg)",
      "CT pulmonary angiogram for PE diagnosis (sensitivity > 95%)",
      "NT-proBNP for RV dysfunction assessment (> 300 pg/mL significant)",
      "6-minute walk test for functional capacity",
      "Polysomnography if OSA suspected as contributing factor"
    ],
    "management": [
      "Treat underlying cause: LTOT for hypoxemic COPD, CPAP for OSA, anticoagulation for CTEPH",
      "Prescribe supplemental oxygen to maintain SpO2 >= 90% in Group 3 PH",
      "Refer to PH specialist for consideration of PAH-specific therapy in Group 1",
      "Initiate diuretics for right heart failure symptom management",
      "Assess fluid status and sodium restriction education",
      "Monitor BNP/NT-proBNP trend for treatment response",
      "Avoid vasodilators in Group 2 PH (may worsen pulmonary edema)"
    ],
    "signs": {
      "left": [
        "Mild exertional dyspnea with preserved exercise capacity",
        "Normal JVP and no peripheral edema",
        "Echocardiographic RVSP < 35 mmHg",
        "Compensated right heart function"
      ],
      "right": [
        "Progressive dyspnea with syncope on exertion",
        "Elevated JVP, hepatojugular reflux, peripheral edema",
        "Loud P2, right-sided S3, tricuspid regurgitation murmur",
        "Signs of low cardiac output: cool extremities, hypotension"
      ]
    },
    "medications": [
      {
        "name": "Sildenafil",
        "type": "PDE5 Inhibitor (PAH-specific)",
        "action": "Inhibits phosphodiesterase-5 in pulmonary vascular smooth muscle, increasing cGMP and causing pulmonary vasodilation and reduced RV afterload",
        "sideEffects": "Headache, flushing, visual disturbances, hypotension, priapism (rare)",
        "contra": "Concurrent nitrate therapy (severe hypotension), PDE5 inhibitor allergy, severe hepatic impairment",
        "pearl": "Used in Group 1 PAH only. 20mg TID is the approved PAH dose. Do NOT use in Group 2 or 3 PH without specialist guidance. Improves 6MWT distance and hemodynamics."
      },
      {
        "name": "Riociguat",
        "type": "Soluble Guanylate Cyclase Stimulator",
        "action": "Directly stimulates sGC independent of NO availability and sensitizes sGC to endogenous NO, increasing cGMP-mediated pulmonary vasodilation",
        "sideEffects": "Hypotension, headache, dizziness, GI upset, hemoptysis",
        "contra": "Pregnancy (teratogenic - requires negative test before initiation), concurrent PDE5 inhibitors or nitrates, severe hepatic or renal impairment",
        "pearl": "Approved for Group 4 CTEPH (chronic thromboembolic PH) in patients who are not surgical candidates. Also used in Group 1 PAH. Requires careful dose titration. REMS program required."
      }
    ],
    "pearls": [
      "Hypoxic pulmonary vasoconstriction (HPV) is a unique feature of the pulmonary circulation - unlike systemic vessels that dilate in hypoxia, pulmonary vessels constrict to optimize V/Q matching, but chronic HPV leads to pulmonary hypertension and cor pulmonale",
      "Right heart catheterization is the gold standard for PH diagnosis - echocardiographic estimated RVSP correlates poorly with invasive measurements and should not be used alone to initiate PAH-specific therapy",
      "PAH-specific vasodilators (PDE5 inhibitors, endothelin receptor antagonists) are only appropriate for Group 1 PAH - using them in Group 2 (left heart) or Group 3 (lung disease) PH can worsen outcomes"
    ],
    "quiz": [
      {
        "question": "A patient with severe COPD has progressive dyspnea, JVD, and peripheral edema. Echo shows RVSP 55 mmHg. What is the most appropriate initial management?",
        "options": [
          "Start sildenafil 20mg TID",
          "Optimize COPD therapy and initiate LTOT targeting SpO2 >= 90%",
          "Refer for right heart catheterization and start bosentan",
          "Initiate IV epoprostenol"
        ],
        "correct": 1,
        "rationale": "This is Group 3 PH (due to lung disease). The primary management is treating the underlying COPD and correcting hypoxemia with LTOT. PAH-specific vasodilators (sildenafil, bosentan, epoprostenol) are NOT indicated for Group 3 PH and may worsen V/Q mismatch."
      }
    ]
  },
  "asthma-step-therapy-core-np": {
    "title": "Asthma Step Therapy Core Concepts",
    "cellular": {
      "title": "Controller vs Reliever Therapy",
      "content": "The foundation of asthma management separates controller therapy (daily anti-inflammatory agents) from reliever therapy (rescue bronchodilators). ICS is the cornerstone controller reducing airway inflammation, hyperresponsiveness, and remodeling. GINA 2024 introduced a paradigm shift: anti-inflammatory reliever (AIR) therapy with low-dose ICS-formoterol PRN replaces SABA-only rescue across all steps. This ensures every reliever dose delivers anti-inflammatory therapy, reducing the dissociation between symptom relief and inflammation control. The as-needed ICS-formoterol approach reduces severe exacerbations by 60% compared to SABA-only reliever. For patients on traditional fixed-dose ICS, SABA remains the reliever, but SABA overuse (> 3 canisters/year) is a marker of poor control and increased mortality risk. The clinician must understand these distinctions to prescribe appropriately."
    },
    "riskFactors": [
      "SABA overuse: > 3 rescue inhalers per year (increased mortality risk)",
      "Failure to prescribe ICS (undertreated inflammation)",
      "Stepping down too quickly after control achieved",
      "Not addressing comorbidities: rhinitis, GERD, obesity",
      "Patient preference for SABA due to immediate relief perception",
      "Lack of asthma action plan",
      "Missing allergen and trigger assessment"
    ],
    "diagnostics": [
      "ACT score at every visit (>= 20 well controlled, 16-19 partly, < 16 poorly)",
      "Spirometry before and after step changes",
      "FeNO to assess ICS adherence and eosinophilic inflammation",
      "Prescription refill records to assess SABA vs ICS usage ratio",
      "Exacerbation frequency and oral corticosteroid courses per year",
      "Inhaler technique assessment with device-specific checklist"
    ],
    "management": [
      "Prescribe ICS for ALL persistent asthma (no exceptions)",
      "PRN ICS-formoterol preferred over SABA-only for Step 1-2 (GINA Track 1)",
      "MART (maintenance and reliever therapy) with budesonide-formoterol for Step 3-4",
      "Assess control at 2-3 month intervals using ACT/ACQ",
      "Step down only after 3+ months of good control: reduce ICS 25-50%",
      "Never eliminate ICS entirely - maintain minimum effective dose",
      "Educate patients why ICS is essential even when asymptomatic"
    ],
    "signs": {
      "left": [
        "ACT >= 20 sustained for 3+ months",
        "No exacerbations or OCS courses in past year",
        "SABA use <= 2x per week",
        "Normal spirometry and exercise tolerance"
      ],
      "right": [
        "ACT < 16 despite Step 4 therapy",
        "2+ OCS courses in past year",
        "Daily SABA use or > 3 canisters/year",
        "Persistent airflow limitation on spirometry (remodeling)"
      ]
    },
    "medications": [
      {
        "name": "Beclomethasone dipropionate (QVAR)",
        "type": "Inhaled Corticosteroid",
        "action": "Suppresses airway inflammation by inhibiting inflammatory gene transcription, reducing eosinophils, mast cells, and cytokine release in airway mucosa",
        "sideEffects": "Oral candidiasis, dysphonia, adrenal suppression at high doses, growth velocity reduction in children (temporary)",
        "contra": "Active pulmonary TB, untreated fungal infections",
        "pearl": "Low-dose ICS is the minimum therapy for any persistent asthma. Extra-fine particle formulation reaches small airways. Rinse mouth after use. Reassess dose every 3 months for step-down opportunity."
      },
      {
        "name": "Formoterol-Budesonide PRN",
        "type": "ICS-LABA Anti-Inflammatory Reliever",
        "action": "Formoterol provides rapid bronchodilation (onset 1-3 min) while budesonide delivers anti-inflammatory protection with every reliever dose, preventing inflammation-symptom dissociation",
        "sideEffects": "Similar to regular ICS-LABA: candidiasis, dysphonia, tachycardia, tremor",
        "contra": "Known hypersensitivity; not to be combined with another LABA-containing product",
        "pearl": "GINA Track 1 preferred reliever across all steps. Reduces severe exacerbations by 60% vs SABA-only. Maximum 12 inhalations/day as reliever. Each reliever dose provides anti-inflammatory benefit."
      }
    ],
    "pearls": [
      "SABA overuse (> 3 canisters per year) is independently associated with increased asthma mortality - the clinician must monitor SABA prescription refills and intervene when overuse is detected",
      "GINA 2024 Track 1 (preferred) uses ICS-formoterol as both controller and reliever at all steps - this eliminates the need for a separate SABA rescue inhaler and ensures anti-inflammatory therapy with every dose",
      "Never diagnose asthma control without spirometry - patients may adapt to reduced lung function and report minimal symptoms despite significant airflow limitation"
    ],
    "quiz": [
      {
        "question": "A patient with mild intermittent asthma has been using SABA PRN only. She refills her salbutamol inhaler 5 times per year. What change should the clinician make?",
        "options": [
          "Continue current management as symptoms are intermittent",
          "Switch to PRN low-dose ICS-formoterol (budesonide-formoterol)",
          "Add daily medium-dose ICS",
          "Prescribe oral montelukast daily"
        ],
        "correct": 1,
        "rationale": "SABA overuse (5 canisters/year > 3) indicates uncontrolled asthma and increased mortality risk. GINA 2024 recommends PRN low-dose ICS-formoterol for all patients including mild intermittent asthma (Step 1 Track 1), providing anti-inflammatory relief with every dose and reducing exacerbation risk by 60%."
      }
    ]
  },
  "copd-gold-staging-np": {
    "title": "COPD GOLD Staging and ABE Assessment",
    "cellular": {
      "title": "Integrated COPD Assessment Framework",
      "content": "The GOLD 2024 framework integrates spirometric severity, symptom burden, and exacerbation risk into a comprehensive assessment. Spirometric classification uses post-bronchodilator FEV1 % predicted: GOLD 1 (>= 80%), GOLD 2 (50-79%), GOLD 3 (30-49%), GOLD 4 (< 30%). The ABE assessment tool (replacing ABCD) uses mMRC dyspnea scale (0-4) or CAT score (0-40) for symptoms, and exacerbation history for risk stratification. Group A: low symptoms (mMRC 0-1, CAT < 10) and low exacerbation risk (0-1 moderate, no hospitalized). Group B: high symptoms (mMRC >= 2, CAT >= 10) and low exacerbation risk. Group E (Exacerbation): any exacerbation history >= 2 moderate or >= 1 hospitalized, regardless of symptom level. Initial pharmacotherapy follows: A = bronchodilator, B = LAMA (preferred) or LAMA+LABA, E = LAMA+LABA (+/- ICS based on eosinophils)."
    },
    "riskFactors": [
      "Current smoking (accelerates FEV1 decline by 60+ mL/year vs 20-30 mL/year in non-smokers)",
      "Frequent exacerbations (strongest predictor of future exacerbations)",
      "High symptom burden with low physical activity level",
      "Low body mass index (< 21 kg/m2 - BODE index component)",
      "Presence of emphysema on CT (predictor of accelerated decline)",
      "Chronic mucus hypersecretion (chronic bronchitis phenotype)",
      "Air pollution exposure (PM2.5 > 25 mcg/m3)"
    ],
    "diagnostics": [
      "Post-bronchodilator spirometry: FEV1/FVC < 0.70 with FEV1 % predicted for GOLD staging",
      "mMRC dyspnea scale assessment (0-4) at each visit",
      "CAT questionnaire for comprehensive symptom assessment",
      "Exacerbation history documentation (number, severity, hospitalizations in past 12 months)",
      "Blood eosinophil count for pharmacotherapy guidance",
      "BODE index (BMI, Obstruction, Dyspnea, Exercise) for prognostication"
    ],
    "management": [
      "Document GOLD stage and ABE group at diagnosis and reassess annually",
      "Group A: short-acting bronchodilator PRN (SABA or SAMA)",
      "Group B: LAMA monotherapy; escalate to LAMA+LABA if persistent dyspnea",
      "Group E: LAMA+LABA initial therapy; add ICS only if eos >= 300 or >= 100 + exacerbations",
      "Smoking cessation at every visit (5 As: Ask, Advise, Assess, Assist, Arrange)",
      "Pulmonary rehabilitation referral for mMRC >= 2",
      "LTOT assessment if SpO2 <= 88% or PaO2 <= 55 mmHg"
    ],
    "signs": {
      "left": [
        "GOLD 1-2 with Group A: minimal impact on daily function",
        "Mild dyspnea on moderate exertion only",
        "Infrequent productive cough",
        "Preserved exercise tolerance on 6MWT"
      ],
      "right": [
        "GOLD 3-4 with Group E: significant functional limitation",
        "Dyspnea limiting ADLs and self-care",
        "Frequent purulent exacerbations requiring hospitalization",
        "Cachexia with BODE score >= 7 (high mortality risk)"
      ]
    },
    "medications": [
      {
        "name": "Indacaterol-Glycopyrrolate (Ultibro Breezhaler)",
        "type": "LAMA-LABA Combination",
        "action": "Indacaterol (ultra-LABA, 24h beta-2 agonism) combined with glycopyrrolate (LAMA, M3 antagonism) provides complementary dual bronchodilation",
        "sideEffects": "Nasopharyngitis, cough, headache, oropharyngeal pain, urinary retention",
        "contra": "Narrow-angle glaucoma, urinary retention, severe lactose allergy (carrier in capsule)",
        "pearl": "Once-daily capsule inhalation. FLAME trial demonstrated superiority over ICS-LABA (salmeterol-fluticasone) for exacerbation prevention in COPD. Preferred for Group E with eosinophils < 300."
      },
      {
        "name": "Varenicline (Champix)",
        "type": "Nicotinic Receptor Partial Agonist",
        "action": "Partial agonist at alpha-4-beta-2 nicotinic receptors providing moderate dopamine release to reduce cravings while blocking full agonist effect of nicotine",
        "sideEffects": "Nausea (30%), vivid dreams, insomnia, headache; FDA removed black box warning for neuropsychiatric events in 2016",
        "contra": "Severe renal impairment (dose adjust), known hypersensitivity; use caution with psychiatric history",
        "pearl": "Most effective smoking cessation pharmacotherapy. Start 1 week before quit date. 0.5mg daily x 3 days, then 0.5mg BID x 4 days, then 1mg BID x 12 weeks (extend to 24 weeks if needed). Can combine with NRT for additional benefit."
      }
    ],
    "pearls": [
      "The GOLD ABE tool simplifies initial therapy by creating only 3 groups - Group E captures all patients with significant exacerbation history regardless of symptom level, appropriately directing them to dual bronchodilation",
      "FEV1 alone does not predict symptoms or quality of life - two patients with the same FEV1 may have vastly different symptom burdens, which is why the GOLD framework integrates both spirometric and clinical assessments",
      "Smoking cessation is the ONLY intervention proven to slow FEV1 decline in COPD - the clinician must prescribe pharmacotherapy (varenicline preferred) and refer to cessation counseling at every visit"
    ],
    "quiz": [
      {
        "question": "A patient with post-BD FEV1/FVC 0.65, FEV1 55%, mMRC 3, CAT 24, and 1 moderate exacerbation in the past year. What is the GOLD stage and group?",
        "options": [
          "GOLD 2, Group A",
          "GOLD 2, Group B",
          "GOLD 2, Group E",
          "GOLD 3, Group B"
        ],
        "correct": 1,
        "rationale": "FEV1 55% = GOLD 2 (50-79%). mMRC 3 and CAT 24 = high symptoms. Only 1 moderate exacerbation (Group E requires >= 2 moderate or >= 1 hospitalized). Therefore Group B: high symptoms, low exacerbation risk. Initial therapy: LAMA monotherapy or LAMA+LABA."
      }
    ]
  },
  "pneumonia-outpatient-np": {
    "title": "Outpatient Pneumonia Management",
    "cellular": {
      "title": "Risk Stratification and Ambulatory Care",
      "content": "Outpatient management of CAP is appropriate for low-risk patients identified by CRB-65 score of 0 (no confusion, RR < 30, BP systolic >= 90 and diastolic > 60, age < 65) or PSI class I-II. The clinician must confirm adequate oxygenation (SpO2 >= 94%), oral medication tolerance, reliable follow-up, and social supports. Clinical reassessment at 48-72 hours (in-person or telephone) evaluates antibiotic response: fever should resolve within 72 hours, cough improvement within 5-7 days. Failure to improve by 72 hours requires diagnostic re-evaluation (repeat CXR, blood cultures, atypical pathogen testing) and consideration of hospitalization. Return-to-work guidance generally allows return when afebrile 24 hours and symptoms are improving. Complete symptomatic recovery typically takes 4-6 weeks for healthy adults."
    },
    "riskFactors": [
      "Outpatient treatment failure (delayed hospitalization increases mortality)",
      "Social isolation with inability to access emergency care",
      "Inability to tolerate oral medications",
      "Unstable comorbidities (decompensated CHF, poorly controlled DM)",
      "Alcoholism or drug use disorder",
      "Cognitive impairment affecting self-care",
      "Lack of home support or transportation for follow-up"
    ],
    "diagnostics": [
      "CXR confirming consolidation (required for definitive diagnosis)",
      "Pulse oximetry: SpO2 >= 94% required for outpatient management",
      "CRB-65 score calculation and documentation",
      "Temperature, respiratory rate, blood pressure assessment",
      "Consideration of point-of-care CRP or procalcitonin if available",
      "Clinical assessment of oral fluid and medication tolerance"
    ],
    "management": [
      "Prescribe first-line antibiotic appropriate to risk category",
      "Provide clear written return precautions: worsening dyspnea, persistent fever > 72h, confusion, chest pain",
      "Schedule 48-72 hour telephone or in-person reassessment",
      "Advise adequate hydration (2-3 L per day if no fluid restriction)",
      "Recommend acetaminophen for fever and discomfort management",
      "Counsel on smoking cessation if applicable",
      "Order follow-up CXR at 6-8 weeks for patients >= 50 years or smokers"
    ],
    "signs": {
      "left": [
        "Low-grade fever < 38.5 C with productive cough",
        "SpO2 >= 94% on room air",
        "CRB-65 = 0 with no comorbidity concerns",
        "Tolerating oral fluids and medications"
      ],
      "right": [
        "Fever > 38.5 C not improving after 48-72 hours of antibiotics",
        "Increasing dyspnea with SpO2 dropping below 92%",
        "New confusion or inability to self-care",
        "Intractable vomiting preventing oral medication absorption"
      ]
    },
    "medications": [
      {
        "name": "Amoxicillin 1g TID",
        "type": "High-Dose Aminopenicillin",
        "action": "Bactericidal against S. pneumoniae including intermediately resistant strains at high dose through enhanced time-above-MIC pharmacodynamics",
        "sideEffects": "Diarrhea, nausea, rash, rare anaphylaxis, C. difficile (uncommon)",
        "contra": "True penicillin anaphylaxis, infectious mononucleosis",
        "pearl": "Canadian first-line for healthy outpatient CAP. 5-day course sufficient when clinical improvement by day 3. Can be used in pregnancy. Cheap, effective, narrow-spectrum."
      },
      {
        "name": "Cefuroxime",
        "type": "Second-Generation Cephalosporin",
        "action": "Inhibits cell wall synthesis through PBP binding with enhanced stability against beta-lactamases compared to first-generation cephalosporins",
        "sideEffects": "GI upset, headache, rash, C. difficile, rare blood dyscrasias",
        "contra": "True cephalosporin anaphylaxis (cross-reactivity with penicillin < 2% for 2nd+ generation)",
        "pearl": "Alternative for patients with non-anaphylactic penicillin allergy. 500mg BID x 5-7 days with food for oral bioavailability. Covers S. pneumoniae, H. influenzae, M. catarrhalis. Add macrolide for atypical coverage."
      }
    ],
    "pearls": [
      "CRB-65 = 0 identifies patients who can be safely managed as outpatients with < 1% 30-day mortality - unnecessary hospitalization exposes these patients to nosocomial infections, VTE risk, and healthcare costs",
      "Clinical reassessment at 48-72 hours is mandatory for outpatient CAP - failure to improve should trigger diagnostic re-evaluation and hospitalization consideration, as delayed admission increases mortality",
      "Five-day antibiotic courses are as effective as longer courses for outpatient CAP when clinical improvement occurs by day 3 - shorter courses reduce C. difficile risk, adverse drug reactions, and antimicrobial resistance selection"
    ],
    "quiz": [
      {
        "question": "A 40-year-old previously healthy non-smoker has 3-day cough, fever 38.3 C, and left lower lobe infiltrate on CXR. SpO2 96%, oriented, RR 18, BP 125/80. CRB-65 = 0. What is the management plan?",
        "options": [
          "Hospitalize for IV antibiotics",
          "Amoxicillin 1g TID x 5 days with 48-72h phone reassessment",
          "Amoxicillin-clavulanate + azithromycin",
          "Moxifloxacin 400mg daily"
        ],
        "correct": 1,
        "rationale": "CRB-65 = 0, previously healthy, SpO2 96%, hemodynamically stable. Outpatient management is appropriate. First-line is amoxicillin 1g TID x 5 days per Canadian guidelines for healthy adults without comorbidities. Follow-up at 48-72 hours is essential to confirm improvement."
      }
    ]
  },
  "tb-basics-np": {
    "title": "Tuberculosis Fundamentals",
    "cellular": {
      "title": "Mycobacterium tuberculosis Pathogenesis",
      "content": "M. tuberculosis is an acid-fast aerobic bacillus transmitted via airborne droplet nuclei (1-5 micrometres). After inhalation, bacilli are phagocytosed by alveolar macrophages. The organism survives intracellularly by inhibiting phagosome-lysosome fusion. Cell-mediated immunity (CD4+ T cells and activated macrophages) develops over 2-12 weeks, forming granulomas that contain but rarely eliminate the organism (latent TB infection, LTBI). Approximately 5-10% of immunocompetent individuals with LTBI will progress to active TB disease in their lifetime, with half occurring within 2 years of infection. Reactivation risk increases dramatically with HIV (7-10% per year), TNF-alpha inhibitors, organ transplant, and other immunosuppressive states. Active TB presents as pulmonary (85% of cases) or extrapulmonary disease (lymph node, pleural, bone, CNS). The clinician must understand the difference between LTBI (positive TST/IGRA, no symptoms, non-infectious) and active TB (symptoms, potentially infectious, requires multi-drug therapy and public health notification)."
    },
    "riskFactors": [
      "Birth in or travel to high-incidence countries (Philippines, India, China, sub-Saharan Africa)",
      "Indigenous communities in Canada (higher incidence)",
      "HIV co-infection (greatest risk factor for LTBI progression)",
      "Immunosuppressive therapy (TNF-alpha inhibitors, post-transplant)",
      "Close contact with active pulmonary TB case",
      "Homelessness, incarceration, injection drug use",
      "Healthcare workers in high-risk settings"
    ],
    "diagnostics": [
      "Tuberculin skin test (TST/Mantoux): >= 5mm positive in HIV+, contacts, CXR changes; >= 10mm in other risk groups",
      "Interferon-gamma release assay (IGRA): QuantiFERON-TB Gold or T-SPOT (preferred in BCG-vaccinated)",
      "Chest radiograph: upper lobe infiltrates, cavitation, hilar lymphadenopathy",
      "Sputum AFB smear x3 (early morning specimens on consecutive days)",
      "Sputum mycobacterial culture (gold standard, takes 2-8 weeks)",
      "GeneXpert MTB/RIF (rapid PCR for TB DNA and rifampin resistance in 2 hours)"
    ],
    "management": [
      "LTBI treatment: isoniazid 300mg daily x 9 months OR rifampin 600mg daily x 4 months",
      "Active TB: RIPE therapy (rifampin, isoniazid, pyrazinamide, ethambutol) x 2 months then RI x 4 months",
      "Prescribe pyridoxine (vitamin B6) 25mg daily with isoniazid to prevent peripheral neuropathy",
      "Monitor hepatic function monthly during treatment (ALT, AST, bilirubin)",
      "Directly Observed Therapy (DOT) for all active TB cases",
      "Notify public health for all active TB and initiate contact investigation",
      "Airborne precautions: negative pressure room, N95 respirator, patient surgical mask"
    ],
    "signs": {
      "left": [
        "Positive TST/IGRA without symptoms (LTBI - not infectious)",
        "Normal CXR with positive screening test",
        "No constitutional symptoms (fever, night sweats, weight loss)",
        "Granulomas on imaging without active disease features"
      ],
      "right": [
        "Chronic productive cough > 3 weeks with hemoptysis",
        "Constitutional symptoms: night sweats, weight loss > 5%, low-grade fever",
        "Upper lobe cavitary disease on CXR",
        "Positive sputum AFB smear (highly infectious)"
      ]
    },
    "medications": [
      {
        "name": "Isoniazid (INH)",
        "type": "First-Line Anti-Tuberculosis Agent",
        "action": "Inhibits mycolic acid synthesis (essential component of mycobacterial cell wall) by forming a complex with InhA after activation by KatG enzyme",
        "sideEffects": "Hepatotoxicity (age-related, monitor LFTs monthly), peripheral neuropathy (pyridoxine prevents), drug-induced lupus, optic neuritis",
        "contra": "Active hepatitis, previous INH-induced hepatotoxicity, acute liver disease",
        "pearl": "Most important first-line TB drug. Always co-prescribe pyridoxine 25mg daily. Monthly hepatotoxicity monitoring (ALT). Potent CYP inhibitor - check interactions with phenytoin, carbamazepine, warfarin. Metabolized by NAT2 (slow acetylators at higher toxicity risk)."
      },
      {
        "name": "Rifampin",
        "type": "Rifamycin Antibiotic",
        "action": "Inhibits bacterial DNA-dependent RNA polymerase, blocking mRNA transcription in M. tuberculosis; bactericidal and sterilizing activity",
        "sideEffects": "Orange discoloration of body fluids (urine, tears, sweat), hepatotoxicity, thrombocytopenia, flu-like syndrome, drug interactions via CYP3A4 induction",
        "contra": "Concurrent protease inhibitors (subtherapeutic levels), severe hepatic disease",
        "pearl": "Potent CYP3A4 and CYP2C inducer - reduces efficacy of OCP, warfarin, HIV PIs, azole antifungals. Women must use non-hormonal contraception. Warn about orange body fluids (stains contact lenses). Cornerstone of short-course TB therapy."
      }
    ],
    "pearls": [
      "IGRA (QuantiFERON) is preferred over TST in BCG-vaccinated individuals (most immigrants) because IGRA does not cross-react with BCG, eliminating false positives that lead to unnecessary LTBI treatment",
      "Active TB is a reportable disease in all Canadian provinces - the clinician must notify public health immediately upon suspicion, before culture confirmation, to initiate contact investigation and DOT",
      "Rifampin is the most potent CYP3A4 inducer in clinical use - the clinician must perform a comprehensive drug interaction review before prescribing, with particular attention to OCP, anticoagulants, HIV medications, and immunosuppressants"
    ],
    "quiz": [
      {
        "question": "A 35-year-old immigrant from the Philippines (BCG-vaccinated at birth) has a TST of 12mm. She is asymptomatic with a normal CXR. What is the next step?",
        "options": [
          "Start RIPE therapy for active TB",
          "Order IGRA to confirm LTBI (BCG may cause false-positive TST)",
          "No further action - TST positive due to BCG vaccination",
          "Start isoniazid 300mg daily for 9 months immediately"
        ],
        "correct": 1,
        "rationale": "In BCG-vaccinated individuals, TST has reduced specificity. IGRA (QuantiFERON) does not cross-react with BCG and should be ordered to confirm true LTBI before starting treatment. If IGRA positive with normal CXR and no symptoms, then LTBI treatment (INH 9 months or rifampin 4 months) is indicated."
      }
    ]
  },
  "anticholinergics-resp-np": {
    "title": "Anticholinergics in Respiratory Care",
    "cellular": {
      "title": "Muscarinic Receptor Pharmacology",
      "content": "Anticholinergic bronchodilators block muscarinic (M) receptors on airway smooth muscle. Three subtypes are clinically relevant: M1 (ganglionic, facilitates neurotransmission), M2 (presynaptic, inhibits ACh release - negative feedback), and M3 (postsynaptic smooth muscle, mediates bronchoconstriction and mucus secretion). Ideal anticholinergic bronchodilators selectively block M3 and M1 while sparing M2 to prevent paradoxical ACh release. Short-acting muscarinic antagonists (SAMAs) like ipratropium block all three subtypes non-selectively with 6-8 hour duration. Long-acting muscarinic antagonists (LAMAs) like tiotropium have kinetic selectivity: slow dissociation from M3 (dwell time > 24 hours) but rapid dissociation from M2, providing functional M3 selectivity and once-daily dosing. LAMAs are first-line maintenance bronchodilators for COPD, reducing exacerbations and improving lung function."
    },
    "riskFactors": [
      "Narrow-angle glaucoma (anticholinergic mydriasis raises IOP)",
      "Benign prostatic hyperplasia with urinary retention",
      "Concurrent use of other anticholinergic medications (cumulative burden)",
      "Elderly patients (increased sensitivity to anticholinergic effects)",
      "Constipation or GI motility disorders",
      "Tachyarrhythmias (anticholinergics increase heart rate)",
      "Cognitive impairment (anticholinergics worsen cognition in elderly)"
    ],
    "diagnostics": [
      "Assess anticholinergic burden using validated scales (ACB scale)",
      "Monitor heart rate and rhythm during initiation",
      "Assess urinary symptoms before prescribing (IPSS score in males)",
      "Measure intraocular pressure if glaucoma risk",
      "Cognitive screening in elderly patients (MoCA)",
      "Spirometry to confirm bronchodilator response"
    ],
    "management": [
      "Prescribe LAMA as first-line maintenance bronchodilator for COPD Group B-E",
      "Do not co-prescribe LAMA and SAMA (therapeutic duplication)",
      "Screen for anticholinergic contraindications before prescribing",
      "Teach proper inhaler technique for each specific device",
      "Advise to avoid spraying soft mist inhaler directly into eyes",
      "Monitor for urinary retention symptoms, especially in elderly males",
      "Review total anticholinergic burden with concurrent medications"
    ],
    "signs": {
      "left": [
        "Improved FEV1 and reduced dyspnea after LAMA initiation",
        "Mild dry mouth (most common, usually tolerable)",
        "Stable heart rate and blood pressure",
        "Reduced exacerbation frequency"
      ],
      "right": [
        "Acute urinary retention (inability to void, bladder distension)",
        "Acute angle-closure glaucoma (eye pain, halos, vision loss - emergency)",
        "Severe constipation or ileus",
        "Tachycardia > 120 bpm or new arrhythmia"
      ]
    },
    "medications": [
      {
        "name": "Ipratropium bromide (Atrovent)",
        "type": "Short-Acting Muscarinic Antagonist (SAMA)",
        "action": "Non-selectively blocks M1, M2, M3 muscarinic receptors in airway smooth muscle providing bronchodilation for 6-8 hours; onset 15-30 minutes",
        "sideEffects": "Dry mouth, bitter taste, urinary retention, angle-closure glaucoma if sprayed in eyes, paradoxical bronchospasm (rare)",
        "contra": "Soy or peanut allergy (MDI contains soy lecithin), narrow-angle glaucoma, prostatic hyperplasia with retention",
        "pearl": "Used for acute COPD exacerbations combined with SABA (e.g., Combivent). Not recommended as sole maintenance therapy when LAMA available. Available as MDI or nebulizer solution."
      },
      {
        "name": "Glycopyrrolate (Seebri Breezhaler)",
        "type": "Long-Acting Muscarinic Antagonist (LAMA)",
        "action": "Quaternary ammonium compound with high M3 selectivity providing sustained bronchodilation for 12-24 hours with minimal systemic absorption",
        "sideEffects": "Dry mouth, nasopharyngitis, UTI, urinary retention (less common than with tiotropium)",
        "contra": "Narrow-angle glaucoma, urinary retention, severe renal impairment (eGFR < 30)",
        "pearl": "Available as monotherapy (BID) or in fixed combinations with LABA (indacaterol) or ICS-LABA (triple therapy). Quaternary structure limits CNS penetration. Alternative LAMA for patients intolerant of tiotropium."
      }
    ],
    "pearls": [
      "LAMAs are preferred over SAMAs for maintenance COPD therapy due to superior duration, M3 selectivity, and proven exacerbation reduction - SAMAs should only be used for acute exacerbation management alongside SABA",
      "Never co-prescribe LAMA and SAMA - this is therapeutic duplication that increases anticholinergic side effects without additional bronchodilation benefit",
      "Total anticholinergic burden must be assessed in elderly patients - concurrent use of LAMA with anticholinergic medications for bladder (oxybutynin), GI (hyoscine), or psychiatric (olanzapine) conditions can cause delirium, urinary retention, and falls"
    ],
    "quiz": [
      {
        "question": "A 70-year-old male with COPD starts tiotropium and develops difficulty urinating 2 weeks later. He also takes oxybutynin for overactive bladder. What should the clinician do?",
        "options": [
          "Continue both medications and catheterize",
          "Discontinue tiotropium and switch to ICS-LABA",
          "Review anticholinergic burden - consider stopping oxybutynin and monitoring urinary symptoms",
          "Increase tiotropium dose for better bronchodilation"
        ],
        "correct": 2,
        "rationale": "The patient has high anticholinergic burden from tiotropium (LAMA) plus oxybutynin (anticholinergic bladder medication). Urinary retention is a predictable cumulative anticholinergic effect. The clinician should assess total anticholinergic burden, consider stopping oxybutynin (which is counterproductive with concurrent LAMA), and monitor for symptom resolution."
      }
    ]
  },
  "antibiotic-selection-resp-np": {
    "title": "Antibiotic Selection for Respiratory",
    "cellular": {
      "title": "Empiric vs Targeted Respiratory Antibiotic",
      "content": "Antibiotic selection for respiratory infections requires understanding of the most likely pathogens based on clinical syndrome, patient factors, and local resistance patterns. CAP: S. pneumoniae (most common), H. influenzae, M. pneumoniae, C. pneumoniae, Legionella. AECOPD: H. influenzae, M. catarrhalis, S. pneumoniae. HAP/VAP: MRSA, P. aeruginosa, Klebsiella, Acinetobacter. The clinician must consider pharmacokinetic-pharmacodynamic (PK-PD) principles: beta-lactams are time-dependent (efficacy depends on time above MIC), aminoglycosides and fluoroquinolones are concentration-dependent (efficacy depends on Cmax/MIC ratio). Antibiotic stewardship principles include using the narrowest effective spectrum, shortest effective duration, de-escalation based on culture results, and avoiding unnecessary antibiotics for viral infections."
    },
    "riskFactors": [
      "Previous antibiotic use within 3 months (resistance selection)",
      "Hospitalization within 90 days (nosocomial flora colonization)",
      "Immunosuppression (broader organism coverage needed)",
      "Structural lung disease (increased Pseudomonas risk)",
      "MRSA colonization or previous MRSA infection",
      "Penicillin allergy (limits first-line options)",
      "Chronic renal or hepatic disease (dose adjustment needed)"
    ],
    "diagnostics": [
      "Sputum Gram stain and culture for inpatient pneumonia",
      "Blood cultures x2 before antibiotics for all hospitalized patients",
      "Procalcitonin to guide antibiotic initiation and duration",
      "Legionella and pneumococcal urinary antigens for moderate-severe CAP",
      "MRSA nasal swab (negative predictive value > 95% for MRSA pneumonia)",
      "C-reactive protein as adjunct inflammatory marker"
    ],
    "management": [
      "Select empiric therapy based on clinical syndrome and risk stratification",
      "CAP outpatient healthy: amoxicillin 1g TID (first-line Canadian guidelines)",
      "CAP outpatient with comorbidities: amoxicillin-clavulanate + macrolide",
      "CAP inpatient: ampicillin IV + azithromycin OR respiratory FQ monotherapy",
      "De-escalate to narrow-spectrum once culture results available",
      "Duration: 5 days for uncomplicated CAP, 5-7 days for AECOPD",
      "Avoid antibiotics for acute bronchitis (almost always viral)"
    ],
    "signs": {
      "left": [
        "Clinical improvement by 48-72 hours on appropriate antibiotics",
        "Defervescence and decreasing CRP/procalcitonin",
        "Sputum becoming less purulent",
        "WBC normalizing on repeat CBC"
      ],
      "right": [
        "No improvement or worsening after 72 hours (treatment failure)",
        "Development of complications: empyema, lung abscess",
        "Superinfection with resistant organism or C. difficile",
        "Allergic reaction: rash, anaphylaxis, serum sickness-like reaction"
      ]
    },
    "medications": [
      {
        "name": "Ceftriaxone",
        "type": "Third-Generation Cephalosporin",
        "action": "Inhibits cell wall synthesis with extended gram-negative spectrum and excellent CSF penetration; long half-life allows once-daily dosing",
        "sideEffects": "Biliary sludging (especially neonates), C. difficile, injection site pain, hypersensitivity, disulfiram-like reaction with alcohol",
        "contra": "Neonates receiving calcium-containing IV solutions (ceftriaxone-calcium precipitates), true cephalosporin anaphylaxis",
        "pearl": "Workhorse for inpatient CAP (2g IV daily). Covers S. pneumoniae, H. influenzae, M. catarrhalis, Klebsiella. Does NOT cover atypicals - pair with azithromycin. Does NOT cover MRSA or Pseudomonas."
      },
      {
        "name": "Levofloxacin",
        "type": "Respiratory Fluoroquinolone",
        "action": "Inhibits DNA gyrase and topoisomerase IV with excellent coverage of typical and atypical respiratory pathogens including drug-resistant S. pneumoniae",
        "sideEffects": "Tendon rupture, QT prolongation, peripheral neuropathy, C. difficile, aortic dissection, dysglycemia",
        "contra": "Concurrent QT-prolonging drugs, history of FQ-associated tendinopathy, myasthenia gravis, pregnancy",
        "pearl": "Reserve for penicillin allergy or treatment failure. 750mg daily x 5 days for CAP. FDA black box warnings. Avoid in elderly on corticosteroids. Excellent oral bioavailability (switch IV to PO easily). Renal dose adjustment needed."
      }
    ],
    "pearls": [
      "Antibiotic stewardship is a core clinical competency - prescribing antibiotics for viral bronchitis drives resistance and C. difficile without patient benefit; use procalcitonin to differentiate viral from bacterial infection",
      "Canadian CAP guidelines recommend amoxicillin (not azithromycin) as first-line for healthy outpatient adults due to increasing macrolide resistance in S. pneumoniae (approximately 25% in Canada)",
      "MRSA nasal screening has > 95% negative predictive value - a negative nasal swab allows confident de-escalation from vancomycin/linezolid in suspected MRSA pneumonia cases"
    ],
    "quiz": [
      {
        "question": "A hospitalized patient with CAP on ceftriaxone + azithromycin is improving at day 3. Cultures grow penicillin-sensitive S. pneumoniae. What should the clinician do?",
        "options": [
          "Continue current broad-spectrum therapy for 10 days",
          "De-escalate to amoxicillin 1g TID PO to complete 5-day total course",
          "Switch to moxifloxacin monotherapy",
          "Add vancomycin for synergy"
        ],
        "correct": 1,
        "rationale": "Antibiotic stewardship principles: de-escalate to the narrowest effective agent once susceptibilities are known. Penicillin-sensitive S. pneumoniae is best treated with amoxicillin (aminopenicillin). Switch IV to PO when improving and tolerating oral. Complete 5-day course total (not 5 more days)."
      }
    ]
  },
  "pediatric-asthma-np": {
    "title": "Pediatric Asthma Assessment",
    "cellular": {
      "title": "Age-Specific Asthma Diagnosis and Management",
      "content": "Pediatric asthma diagnosis is challenging, particularly in children < 5 years where spirometry is unreliable. In this age group, diagnosis relies on symptom pattern (recurrent wheeze, cough, dyspnea triggered by viral infections, allergens, exercise, or cold air), family history of atopy, and therapeutic response to ICS trial. The modified Asthma Predictive Index (mAPI) helps predict asthma persistence: at least 3 wheezing episodes in past year PLUS one major criterion (parental asthma, atopic dermatitis, aeroallergen sensitization) OR two minor criteria (food allergy, eosinophilia > 4%, wheezing apart from colds). In children >= 6 years, spirometry with bronchodilator reversibility (FEV1 increase >= 12%) confirms diagnosis. Asthma phenotypes in children include viral-triggered wheeze (transient, resolves by school age), multi-trigger wheeze (persistent, atopic), and exercise-induced bronchoconstriction. Treatment follows a step-wise approach adapted for age with ICS as the cornerstone controller."
    },
    "riskFactors": [
      "Family history of asthma in first-degree relative (OR 3-6x)",
      "Personal atopic dermatitis or allergic rhinitis",
      "Aeroallergen sensitization (dust mite, cat, dog, mould)",
      "Prematurity and neonatal respiratory complications",
      "RSV bronchiolitis in infancy (associated with recurrent wheeze)",
      "Environmental tobacco smoke exposure (prenatal and postnatal)",
      "Obesity in school-age children"
    ],
    "diagnostics": [
      "Spirometry with bronchodilator in children >= 6 years",
      "Modified Asthma Predictive Index (mAPI) for children < 5 years",
      "Therapeutic trial of ICS (8-12 weeks) if diagnosis uncertain in preschoolers",
      "Allergy testing (skin prick or specific IgE) for trigger identification",
      "FeNO measurement in children >= 5 years (age-specific thresholds)",
      "Peak flow monitoring in school-age children (diary)"
    ],
    "management": [
      "Step 1 (< 6 years): PRN SABA alone for intermittent symptoms",
      "Step 2 (< 6 years): low-dose ICS daily (fluticasone 100mcg/day via spacer+mask)",
      "Step 3-4: medium-dose ICS or add LTRA (montelukast approved age >= 6 months)",
      "ICS delivery: MDI + valved holding chamber (spacer) + face mask for < 4 years",
      "Educate caregivers on asthma action plan with green/yellow/red zones",
      "Annually reassess and attempt step-down after 3 months good control",
      "Refer to pediatric respirology if uncontrolled despite Step 3 therapy"
    ],
    "signs": {
      "left": [
        "Occasional viral-triggered wheeze resolving spontaneously",
        "Good interval wellness between episodes",
        "Normal growth and development",
        "Responds well to low-dose ICS with infrequent SABA use"
      ],
      "right": [
        "Persistent daily wheeze and cough affecting sleep and play",
        "Growth faltering from chronic respiratory compromise",
        "Severe exacerbation requiring hospitalization or ICU",
        "Status asthmaticus: silent chest, cyanosis, altered consciousness"
      ]
    },
    "medications": [
      {
        "name": "Fluticasone propionate (Flovent HFA)",
        "type": "Inhaled Corticosteroid",
        "action": "Potent topical anti-inflammatory with high receptor binding affinity and first-pass hepatic metabolism (low systemic bioavailability)",
        "sideEffects": "Oral candidiasis (rinse mouth), growth velocity reduction (0.5-1 cm in first year, generally catch-up by adulthood), adrenal suppression at high doses",
        "contra": "Active pulmonary TB, untreated systemic fungal infections",
        "pearl": "Low dose: 100-200 mcg/day for children 6-11y. Always use with spacer device (MDI+VHC). Growth monitoring at every visit. Step down after 3 months of good control to find minimum effective dose."
      },
      {
        "name": "Montelukast",
        "type": "Leukotriene Receptor Antagonist",
        "action": "Blocks CysLT1 receptor reducing bronchoconstriction, mucus secretion, and eosinophilic inflammation; oral formulation advantageous for young children",
        "sideEffects": "Headache, abdominal pain, behavioral changes, sleep disturbances, neuropsychiatric effects (FDA boxed warning: agitation, aggression, depression)",
        "contra": "Known hypersensitivity; not for acute bronchospasm",
        "pearl": "Approved from 6 months of age. FDA boxed warning for neuropsychiatric events - counsel caregivers to report mood/behavior changes. Second-line to ICS. Useful adjunct for exercise-induced symptoms and concurrent allergic rhinitis."
      }
    ],
    "pearls": [
      "The modified Asthma Predictive Index (mAPI) helps the clinician predict which preschool wheezers will develop persistent asthma - a positive mAPI increases the probability of asthma at school age from 30% to 77%",
      "ICS growth velocity effects are small (0.5-1 cm) and generally temporary - the clinician should not withhold ICS due to growth concerns, as uncontrolled asthma itself impairs growth more significantly",
      "MDI + valved holding chamber (spacer) is the preferred delivery system for children - nebulizers are no more effective and should be reserved for children unable to use a spacer"
    ],
    "quiz": [
      {
        "question": "A 3-year-old has had 4 wheezing episodes in the past year triggered by viral infections and exercise. Mother has asthma. The child has eczema. What does the mAPI predict?",
        "options": [
          "Transient wheeze that will resolve by school age",
          "High likelihood of persistent asthma (positive mAPI)",
          "Vocal cord dysfunction",
          "Need for immediate spirometry"
        ],
        "correct": 1,
        "rationale": "mAPI requires 3+ wheezing episodes PLUS major or minor criteria. This child has 4 episodes plus parental asthma (major) AND atopic dermatitis (major). Positive mAPI predicts 77% probability of persistent asthma by school age. The clinician should initiate a trial of low-dose ICS."
      }
    ]
  },
  "pediatric-asthma-management-np": {
    "title": "Pediatric Asthma Management",
    "cellular": {
      "title": "Age-Adapted Step Therapy and Device Selection",
      "content": "Pediatric asthma management adapts adult step therapy principles to age-specific physiology and device capabilities. For children 0-5 years, ICS via MDI with valved holding chamber (VHC) and face mask is the standard delivery system. Nebulizers are reserved for severe exacerbations or children who cannot use VHC. Step therapy for ages 0-5: Step 1 = PRN SABA, Step 2 = low-dose ICS daily, Step 3 = double ICS dose or add LTRA, Step 4 = refer to specialist. For children 6-11 years, spirometry guides therapy, and dry powder inhalers (DPI) can be used if inspiratory flow is adequate (typically >= 30 L/min). LABA can be added at Step 3 (always with ICS, never alone). Exercise-induced bronchoconstriction is managed with SABA 15-30 minutes before exercise or daily LTRA. Biologic therapy (omalizumab approved >= 6 years) is considered at Step 5 for severe allergic asthma uncontrolled despite adherent high-dose ICS-LABA therapy."
    },
    "riskFactors": [
      "Poor inhaler technique (most common cause of apparent treatment failure)",
      "Incorrect spacer/mask use or fit in young children",
      "Non-adherence to daily controller therapy (parental and child factors)",
      "Ongoing allergen exposure in the home",
      "Secondhand smoke exposure",
      "Obesity affecting both asthma severity and medication response",
      "Psychosocial factors: parental health literacy, socioeconomic barriers"
    ],
    "diagnostics": [
      "Spirometry pre and post bronchodilator in children >= 6 years at diagnosis and step changes",
      "Inhaler technique assessment at every visit (standardized checklist)",
      "Asthma control assessment using C-ACT (children 4-11) or ACT (>= 12)",
      "Peak flow monitoring for school-age children with moderate-severe asthma",
      "Allergy testing to identify modifiable environmental triggers",
      "Growth velocity monitoring every 6-12 months on ICS"
    ],
    "management": [
      "Start ICS at dose appropriate to severity and age",
      "Always use MDI + VHC (+ mask if < 4 years) for ICS delivery",
      "Teach proper spacer technique: shake MDI, insert, 5-10 tidal breaths per puff",
      "Reassess control every 2-3 months and attempt step-down after 3 months well-controlled",
      "Address barriers to adherence: simplify regimens, involve child in self-management",
      "Develop age-appropriate asthma action plan with caregiver and school",
      "Pre-exercise SABA or daily LTRA for exercise-induced bronchoconstriction"
    ],
    "signs": {
      "left": [
        "Controlled asthma: C-ACT >= 20",
        "SABA use < 2 times per week (excluding pre-exercise)",
        "No school absences due to asthma",
        "Normal growth and physical activity participation"
      ],
      "right": [
        "Uncontrolled asthma: C-ACT < 16",
        "Frequent school absences and activity limitation",
        "Multiple emergency visits or hospitalizations for asthma",
        "Growth faltering or need for frequent oral corticosteroid courses"
      ]
    },
    "medications": [
      {
        "name": "Fluticasone-Salmeterol (Advair)",
        "type": "ICS-LABA (children >= 4 years)",
        "action": "Fluticasone provides anti-inflammatory control; salmeterol provides sustained bronchodilation. LABA must never be used without ICS in pediatric asthma",
        "sideEffects": "Oral candidiasis, growth effects, tachycardia, tremor, adrenal suppression at high doses",
        "contra": "LABA monotherapy (never without ICS), severe milk protein allergy (Diskus)",
        "pearl": "Step 3 option for children 4-11 years. Available as Diskus (DPI) or MDI. Diskus requires inspiratory flow >= 30 L/min. Growth monitoring required. Step down to ICS alone when controlled."
      },
      {
        "name": "Prednisolone oral solution",
        "type": "Systemic Corticosteroid (Acute Exacerbation)",
        "action": "Suppresses inflammatory cascade in acute asthma exacerbation reducing airway edema, mucus production, and bronchial hyperresponsiveness",
        "sideEffects": "Hyperactivity, appetite increase, GI upset, mood changes, hyperglycemia, immunosuppression",
        "contra": "Active varicella or measles exposure without immunity (relative - weigh risk/benefit)",
        "pearl": "1-2 mg/kg/day (max 40-60mg) for 3-5 days for acute exacerbation. No taper needed for courses <= 7 days. Palatable liquid formulation preferred for young children. Early administration reduces hospitalization."
      }
    ],
    "pearls": [
      "MDI + spacer is equivalent or superior to nebulizer for bronchodilator delivery in pediatric asthma - the clinician should educate families that nebulizers are NOT more effective and spacers are more portable and cost-effective",
      "LABA must NEVER be prescribed as monotherapy in children - LABA without ICS increases the risk of serious asthma-related events including death; always prescribe as fixed-combination ICS-LABA",
      "The clinician should assess inhaler technique at every visit using teach-back method - studies show that up to 80% of children and caregivers use inhalers incorrectly, making technique assessment the most important intervention before any medication change"
    ],
    "quiz": [
      {
        "question": "A 7-year-old on low-dose fluticasone MDI with spacer has C-ACT 14, uses SABA 4x/week, and misses PE class due to wheeze. Inhaler technique is correct. Next step?",
        "options": [
          "Continue current therapy and reassess in 3 months",
          "Step up to low-dose ICS-LABA combination",
          "Switch to oral montelukast alone",
          "Add ipratropium nebulizer twice daily"
        ],
        "correct": 1,
        "rationale": "C-ACT 14 indicates poorly controlled asthma. With confirmed correct technique and adherence to low-dose ICS, step-up to ICS-LABA combination (e.g., fluticasone-salmeterol) is appropriate for children >= 4 years at Step 3. Montelukast alone is less effective than ICS. Ipratropium is for acute exacerbation, not maintenance."
      }
    ]
  },
  "spontaneous-pneumothorax-np": {
    "title": "Spontaneous Pneumothorax",
    "cellular": {
      "title": "Pleural Space Physiology and Air Leak",
      "content": "Pneumothorax occurs when air enters the pleural space, disrupting the negative intrapleural pressure (-3 to -5 cmH2O) that maintains lung expansion. Primary spontaneous pneumothorax (PSP) occurs without underlying lung disease, typically in tall, thin males aged 15-35 due to rupture of subpleural apical blebs. Secondary spontaneous pneumothorax (SSP) occurs in patients with underlying lung disease (COPD, CF, Pneumocystis pneumonia, Marfan syndrome). Tension pneumothorax occurs when a one-way valve mechanism allows air entry during inspiration but prevents exit during expiration, causing progressive mediastinal shift, IVC compression, and hemodynamic collapse. The clinician must recognize tension pneumothorax as a clinical diagnosis requiring immediate needle decompression before imaging. Management of non-tension pneumothorax depends on size (small < 2 cm apex-to-cupola vs large >= 2 cm) and symptoms."
    },
    "riskFactors": [
      "Tall, thin male body habitus (PSP: height-to-weight ratio)",
      "Tobacco smoking (increases risk 20-fold for PSP)",
      "COPD with emphysema (most common cause of SSP)",
      "Cystic fibrosis and bronchiectasis",
      "Marfan or Ehlers-Danlos syndrome (connective tissue disorders)",
      "Catamenial pneumothorax (related to menstrual cycle, endometriosis)",
      "Mechanical ventilation with high PEEP"
    ],
    "diagnostics": [
      "Chest radiograph PA erect (visceral pleural line visible without lung markings beyond)",
      "Measure apex-to-cupola distance for size classification (< 2 cm small, >= 2 cm large)",
      "CT chest if diagnosis uncertain, recurrent pneumothorax, or surgical planning",
      "ABG if respiratory compromise suspected",
      "Monitor SpO2 continuously",
      "Chest ultrasound (absence of lung sliding sign) - sensitivity > 90% at bedside"
    ],
    "management": [
      "Small PSP (< 2 cm) in stable patient: observation 4-6 hours with repeat CXR, discharge if stable with follow-up in 2-4 weeks",
      "Large PSP (>= 2 cm) or symptomatic: needle aspiration (14-16G, 2nd ICS MCL) or chest tube (small-bore 8-14 Fr)",
      "SSP: chest tube insertion regardless of size (underlying lung disease prevents re-expansion)",
      "Tension pneumothorax: immediate needle decompression (14G, 2nd ICS MCL) followed by chest tube",
      "Supplemental oxygen (accelerates pleural air reabsorption 4-fold)",
      "Advise against flying until complete radiographic resolution (6-8 weeks)",
      "Refer to thoracic surgery for recurrent pneumothorax (VATS pleurodesis)"
    ],
    "signs": {
      "left": [
        "Small pneumothorax: mild pleuritic chest pain with dyspnea",
        "Reduced breath sounds on affected side",
        "SpO2 >= 92% with stable hemodynamics",
        "CXR shows small apex-to-cupola distance < 2 cm"
      ],
      "right": [
        "Tension pneumothorax: severe dyspnea, hypotension, tracheal deviation AWAY from affected side",
        "Distended neck veins, absent breath sounds, hyperresonance",
        "Cardiac arrest (PEA) from obstructive shock",
        "Large pneumothorax with subcutaneous emphysema"
      ]
    },
    "medications": [
      {
        "name": "Supplemental Oxygen",
        "type": "Therapeutic Gas",
        "action": "Increases alveolar-pleural nitrogen gradient, accelerating pleural air reabsorption from approximately 1.25% per day on room air to approximately 5% per day on high-flow oxygen",
        "sideEffects": "Oxygen toxicity with prolonged high-flow use (absorptive atelectasis, oxidative stress)",
        "contra": "Caution in COPD patients with CO2 retention risk; adjust flow to target SpO2 88-92% in these patients",
        "pearl": "High-flow oxygen (10-15 L/min via non-rebreather) accelerates pneumothorax resolution 4-fold by creating a nitrogen gradient favouring pleural air absorption. Indicated for all pneumothorax patients regardless of size."
      },
      {
        "name": "Lidocaine 1% (local anesthetic)",
        "type": "Amide Local Anesthetic",
        "action": "Blocks sodium channels in sensory nerve fibres preventing pain signal transmission; used for local anesthesia prior to needle aspiration or chest tube insertion",
        "sideEffects": "Toxicity at high doses: perioral numbness, tinnitus, seizures, cardiac arrhythmias",
        "contra": "True amide local anesthetic allergy (rare), maximum dose 4.5 mg/kg without epinephrine",
        "pearl": "Infiltrate skin, subcutaneous tissue, and parietal pleura at insertion site. Maximum 300mg in 70kg adult. Always aspirate before injecting to avoid intravascular injection. Wait 3-5 minutes for full anesthetic effect before procedure."
      }
    ],
    "pearls": [
      "Tension pneumothorax is a CLINICAL diagnosis treated with immediate needle decompression - NEVER delay treatment to obtain a chest radiograph; signs include hypotension, tracheal deviation, distended neck veins, and absent breath sounds",
      "All patients with pneumothorax should receive supplemental oxygen even if SpO2 is normal - oxygen accelerates pleural air reabsorption 4-fold by creating a nitrogen gradient across the visceral pleura",
      "Recurrence rate for PSP is approximately 30% after first episode and 50% after second - the clinician should refer for surgical evaluation (VATS pleurodesis) after the first recurrence or for SSP with any size pneumothorax"
    ],
    "quiz": [
      {
        "question": "A tall, thin 22-year-old male presents with sudden right-sided pleuritic chest pain. CXR shows 3 cm apex-to-cupola distance on the right with no tracheal deviation. BP 120/75, HR 88, SpO2 96%. What is the most appropriate management?",
        "options": [
          "Observation for 4-6 hours and repeat CXR",
          "Needle aspiration with 14-16G catheter at 2nd ICS midclavicular line",
          "Immediate chest tube insertion (28 Fr)",
          "Intubation and mechanical ventilation"
        ],
        "correct": 1,
        "rationale": "Large PSP (>= 2 cm apex-to-cupola distance) in a hemodynamically stable patient. No signs of tension pneumothorax (no tracheal deviation, stable BP). Management: needle aspiration first (less invasive than chest tube). If aspiration fails to re-expand the lung, proceed to small-bore chest tube."
      }
    ]
  }
};
