export interface ProfessionPerspective {
  profession: string;
  professionSlug: string;
  approach: string;
  lessonSlugs: string[];
  practiceQuestionTopics: string[];
  flashcardTopics: string[];
}

export interface CrossProfessionCondition {
  conditionSlug: string;
  conditionName: string;
  perspectives: ProfessionPerspective[];
}

export const crossProfessionConditions: CrossProfessionCondition[] = [
  {
    conditionSlug: "pulmonary-embolism",
    conditionName: "Pulmonary Embolism",
    perspectives: [
      {
        profession: "Registered Nurse (RN)",
        professionSlug: "rn",
        approach: "RNs focus on early recognition of PE signs (sudden dyspnea, pleuritic chest pain, tachycardia), initiating anticoagulation therapy, monitoring for hemodynamic instability, and patient education on DVT prevention and warfarin management.",
        lessonSlugs: ["dvt-pe", "pulmonary-embolism-rn", "shock-types-recognition-rpn"],
        practiceQuestionTopics: ["PE assessment", "anticoagulation monitoring", "DVT prevention"],
        flashcardTopics: ["Wells score criteria", "heparin protocol", "INR monitoring"]
      },
      {
        profession: "Paramedic",
        professionSlug: "paramedic",
        approach: "Paramedics must rapidly identify PE in the field — sudden onset dyspnea with pleuritic chest pain, tachycardia, and hypoxia refractory to oxygen. Field management focuses on high-flow O2, IV access, positioning, and rapid transport. Massive PE may present as PEA arrest.",
        lessonSlugs: ["trauma-algorithm-paramedic", "cardiac-arrest-management-paramedic"],
        practiceQuestionTopics: ["prehospital PE recognition", "PEA arrest causes", "field oxygen therapy"],
        flashcardTopics: ["PE field signs", "obstructive shock", "ROSC management"]
      },
      {
        profession: "Respiratory Therapist (RRT)",
        professionSlug: "rrt",
        approach: "RRTs manage the ventilation-perfusion mismatch caused by PE — dead space ventilation where perfused alveoli are blocked. They optimize oxygenation, monitor ABGs for respiratory alkalosis progressing to acidosis, and assist with mechanical ventilation in massive PE.",
        lessonSlugs: ["vq-mismatch-rrt", "gas-exchange-physiology-rrt", "oxygen-delivery-systems-rrt", "abg-interpretation-rrt"],
        practiceQuestionTopics: ["V/Q mismatch in PE", "dead space ventilation", "ABG patterns in PE"],
        flashcardTopics: ["A-a gradient", "dead space fraction", "oxygen delivery devices"]
      },
      {
        profession: "Medical Laboratory Technologist (MLT)",
        professionSlug: "mlt",
        approach: "MLTs perform critical diagnostic testing for PE including D-dimer assays, coagulation studies (PT/INR, aPTT) for anticoagulation monitoring, ABG analysis, and troponin levels to assess right heart strain.",
        lessonSlugs: ["coagulation-cascade-mlt", "clinical-chemistry-mlt", "critical-value-reporting-mlt"],
        practiceQuestionTopics: ["D-dimer interpretation", "coagulation monitoring", "critical value reporting"],
        flashcardTopics: ["D-dimer sensitivity", "aPTT therapeutic range", "troponin in PE"]
      }
    ]
  },
  {
    conditionSlug: "myocardial-infarction",
    conditionName: "Myocardial Infarction",
    perspectives: [
      {
        profession: "Registered Nurse (RN)",
        professionSlug: "rn",
        approach: "RNs perform rapid cardiac assessment, administer MONA protocol (Morphine, Oxygen, Nitroglycerin, Aspirin), monitor cardiac rhythm for lethal arrhythmias, manage thrombolytic therapy, and provide post-MI education on lifestyle modifications.",
        lessonSlugs: ["mi-acute", "cardiac-assessment-ecg", "heart-failure"],
        practiceQuestionTopics: ["STEMI vs NSTEMI", "troponin interpretation", "post-MI nursing care"],
        flashcardTopics: ["MONA protocol", "12-lead ECG changes", "cardiac enzymes timeline"]
      },
      {
        profession: "Paramedic",
        professionSlug: "paramedic",
        approach: "Paramedics acquire prehospital 12-lead ECGs for early STEMI identification and cath lab activation. They administer aspirin, nitroglycerin, and manage cardiogenic shock or cardiac arrest in the field with ACLS protocols.",
        lessonSlugs: ["acls-pharmacology-paramedic", "cardiac-arrest-management-paramedic"],
        practiceQuestionTopics: ["prehospital 12-lead ECG", "STEMI field activation", "cardiogenic shock management"],
        flashcardTopics: ["STEMI criteria", "aspirin dose", "epinephrine in arrest"]
      },
      {
        profession: "Respiratory Therapist (RRT)",
        professionSlug: "rrt",
        approach: "RRTs manage oxygen therapy in acute MI, provide ventilatory support in cardiogenic pulmonary edema, and assist with BiPAP/CPAP for acute heart failure exacerbation post-MI.",
        lessonSlugs: ["oxygen-delivery-systems-rrt", "hemodynamic-positive-pressure-rrt", "abg-interpretation-rrt"],
        practiceQuestionTopics: ["oxygen therapy in MI", "CPAP for pulmonary edema", "ventilatory support"],
        flashcardTopics: ["oxygen targets in ACS", "BiPAP settings", "pulmonary edema ABG"]
      },
      {
        profession: "Medical Laboratory Technologist (MLT)",
        professionSlug: "mlt",
        approach: "MLTs run serial cardiac biomarkers (troponin I/T, CK-MB), coagulation studies for anticoagulation monitoring, lipid panels for risk stratification, and BNP/NT-proBNP for heart failure assessment.",
        lessonSlugs: ["clinical-chemistry-mlt", "critical-value-reporting-mlt", "coagulation-cascade-mlt"],
        practiceQuestionTopics: ["troponin kinetics", "CK-MB vs troponin", "critical cardiac values"],
        flashcardTopics: ["troponin rise timeline", "BNP interpretation", "lipid panel targets"]
      }
    ]
  },
  {
    conditionSlug: "pneumothorax",
    conditionName: "Pneumothorax",
    perspectives: [
      {
        profession: "Registered Nurse (RN)",
        professionSlug: "rn",
        approach: "RNs assess for absent breath sounds, tracheal deviation, and subcutaneous emphysema. They assist with chest tube insertion, manage chest drainage systems, and monitor for complications including tension pneumothorax.",
        lessonSlugs: ["respiratory-assessment", "ards-rn"],
        practiceQuestionTopics: ["chest tube management", "tension pneumothorax signs", "chest drainage systems"],
        flashcardTopics: ["chest tube assessment", "air leak monitoring", "water seal vs suction"]
      },
      {
        profession: "Paramedic",
        professionSlug: "paramedic",
        approach: "Paramedics perform needle decompression for tension pneumothorax in the field — a life-saving intervention when tracheal deviation, absent breath sounds, JVD, and hemodynamic collapse are identified during the primary survey.",
        lessonSlugs: ["trauma-algorithm-paramedic", "airway-emergencies-paramedic"],
        practiceQuestionTopics: ["needle decompression technique", "tension vs simple pneumothorax", "field assessment"],
        flashcardTopics: ["needle decompression landmarks", "tension pneumothorax signs", "chest seal application"]
      },
      {
        profession: "Respiratory Therapist (RRT)",
        professionSlug: "rrt",
        approach: "RRTs manage ventilation in pneumothorax patients, adjusting mechanical ventilator settings to avoid worsening air leak. They monitor chest tube output, assess for resolution, and manage the transition from mechanical ventilation.",
        lessonSlugs: ["mechanical-ventilation-modes-rrt", "ventilator-troubleshooting-rrt", "gas-exchange-physiology-rrt"],
        practiceQuestionTopics: ["ventilator management with chest tube", "air leak assessment", "PEEP considerations"],
        flashcardTopics: ["tidal volume in pneumothorax", "PEEP caution", "ventilator alarms"]
      }
    ]
  },
  {
    conditionSlug: "diabetic-ketoacidosis",
    conditionName: "Diabetic Ketoacidosis (DKA)",
    perspectives: [
      {
        profession: "Registered Nurse (RN)",
        professionSlug: "rn",
        approach: "RNs manage the DKA protocol: IV fluid resuscitation, continuous insulin infusion, potassium replacement, and hourly blood glucose monitoring. They assess for cerebral edema in pediatric patients and monitor for hypokalemia during treatment.",
        lessonSlugs: ["dka-management-rn", "diabetes-lifespan", "hyperkalemia-rn"],
        practiceQuestionTopics: ["DKA vs HHS", "insulin drip management", "potassium replacement in DKA"],
        flashcardTopics: ["DKA diagnostic criteria", "insulin infusion protocol", "anion gap calculation"]
      },
      {
        profession: "Paramedic",
        professionSlug: "paramedic",
        approach: "Paramedics identify DKA in the field through Kussmaul respirations, fruity breath odor, altered mental status, and glucometer readings. Prehospital management includes IV fluid bolus and rapid transport.",
        lessonSlugs: ["sepsis-recognition-paramedic", "pharmacology-field-drugs-paramedic"],
        practiceQuestionTopics: ["DKA field recognition", "prehospital fluid resuscitation", "altered mental status differential"],
        flashcardTopics: ["Kussmaul respirations", "DKA vs hypoglycemia", "field glucose management"]
      },
      {
        profession: "Respiratory Therapist (RRT)",
        professionSlug: "rrt",
        approach: "RRTs interpret the respiratory compensation in DKA — Kussmaul respirations represent maximal respiratory compensation for severe metabolic acidosis. ABG analysis shows metabolic acidosis with respiratory compensation (low pH, low HCO3, low PaCO2).",
        lessonSlugs: ["acid-base-disorders-rrt", "abg-interpretation-rrt", "gas-exchange-physiology-rrt"],
        practiceQuestionTopics: ["metabolic acidosis compensation", "ABG in DKA", "ventilation in metabolic acidosis"],
        flashcardTopics: ["Winter's formula", "anion gap", "ABG interpretation steps"]
      },
      {
        profession: "Medical Laboratory Technologist (MLT)",
        professionSlug: "mlt",
        approach: "MLTs perform serial blood glucose measurements, blood gas analysis, electrolyte panels (potassium monitoring is critical), serum ketone levels, and calculate the anion gap to guide DKA management.",
        lessonSlugs: ["clinical-chemistry-mlt", "critical-value-reporting-mlt", "quality-control-mlt"],
        practiceQuestionTopics: ["anion gap calculation", "potassium critical values", "ABG quality control"],
        flashcardTopics: ["electrolyte panels in DKA", "glucose critical values", "ketone testing methods"]
      }
    ]
  },
  {
    conditionSlug: "stroke",
    conditionName: "Stroke (CVA)",
    perspectives: [
      {
        profession: "Registered Nurse (RN)",
        professionSlug: "rn",
        approach: "RNs perform rapid neurological assessment using NIHSS, facilitate the stroke alert process, administer tPA within the 4.5-hour window, monitor for hemorrhagic conversion, and provide rehabilitation-focused nursing care.",
        lessonSlugs: ["stroke", "cranial-nerve-assessment", "increased-icp"],
        practiceQuestionTopics: ["tPA criteria", "NIHSS components", "hemorrhagic vs ischemic stroke"],
        flashcardTopics: ["FAST assessment", "tPA contraindications", "stroke syndromes"]
      },
      {
        profession: "Paramedic",
        professionSlug: "paramedic",
        approach: "Paramedics use prehospital stroke scales (Cincinnati, LAMS, RACE) for early identification and stroke center notification. They establish IV access, check blood glucose, document symptom onset time, and transport to the nearest stroke center.",
        lessonSlugs: ["stroke-recognition-paramedic", "field-triage-paramedic"],
        practiceQuestionTopics: ["prehospital stroke scales", "last known well time", "stroke mimics"],
        flashcardTopics: ["Cincinnati stroke scale", "large vessel occlusion signs", "stroke center triage"]
      },
      {
        profession: "Respiratory Therapist (RRT)",
        professionSlug: "rrt",
        approach: "RRTs manage airway protection in stroke patients with decreased consciousness or bulbar dysfunction. They provide mechanical ventilation for large territory strokes with herniation and manage oxygenation to prevent secondary brain injury.",
        lessonSlugs: ["airway-management-rrt", "mechanical-ventilation-modes-rrt", "oxygen-delivery-systems-rrt"],
        practiceQuestionTopics: ["airway protection in stroke", "ventilation targets in TBI", "aspiration risk management"],
        flashcardTopics: ["GCS and intubation", "PaCO2 targets in stroke", "airway assessment"]
      },
      {
        profession: "Medical Laboratory Technologist (MLT)",
        professionSlug: "mlt",
        approach: "MLTs perform STAT coagulation studies (PT/INR) to determine tPA eligibility, CBC for platelet count, blood glucose, and type and screen in case surgical intervention is needed.",
        lessonSlugs: ["coagulation-cascade-mlt", "critical-value-reporting-mlt", "hematology-fundamentals-mlt"],
        practiceQuestionTopics: ["STAT coagulation for tPA", "platelet count requirements", "critical value turnaround"],
        flashcardTopics: ["INR for tPA eligibility", "STAT lab turnaround", "coagulation pathway"]
      }
    ]
  },
  {
    conditionSlug: "sepsis",
    conditionName: "Sepsis",
    perspectives: [
      {
        profession: "Registered Nurse (RN)",
        professionSlug: "rn",
        approach: "RNs screen for sepsis using SIRS/qSOFA criteria, initiate the 1-hour sepsis bundle (blood cultures, lactate, antibiotics, IV fluids), monitor hemodynamics, manage vasopressors, and reassess for end-organ dysfunction.",
        lessonSlugs: ["sepsis", "sepsis-rn", "shock-types-recognition-rpn", "iv-therapy"],
        practiceQuestionTopics: ["sepsis bundle components", "qSOFA criteria", "vasopressor management"],
        flashcardTopics: ["SIRS criteria", "MAP target in sepsis", "lactate interpretation"]
      },
      {
        profession: "Paramedic",
        professionSlug: "paramedic",
        approach: "Paramedics identify sepsis in the field using altered mental status, tachycardia, hypotension, and fever. They initiate large-bore IV access, administer fluid boluses, and transport rapidly for early antibiotic administration.",
        lessonSlugs: ["sepsis-recognition-paramedic", "pharmacology-field-drugs-paramedic"],
        practiceQuestionTopics: ["prehospital sepsis screening", "field fluid resuscitation", "sepsis vs other shock"],
        flashcardTopics: ["qSOFA prehospital", "fluid bolus volume", "distributive shock signs"]
      },
      {
        profession: "Respiratory Therapist (RRT)",
        professionSlug: "rrt",
        approach: "RRTs manage respiratory failure in sepsis — ARDS is a common complication. They optimize mechanical ventilation using lung-protective strategies, manage prone positioning, and monitor for ventilator-associated complications.",
        lessonSlugs: ["ards-respiratory-failure-rrt", "mechanical-ventilation-modes-rrt", "ventilator-troubleshooting-rrt", "abg-interpretation-rrt"],
        practiceQuestionTopics: ["ARDS from sepsis", "lung-protective ventilation", "prone positioning protocol"],
        flashcardTopics: ["ARDS Berlin criteria", "tidal volume targets", "PEEP titration"]
      },
      {
        profession: "Medical Laboratory Technologist (MLT)",
        professionSlug: "mlt",
        approach: "MLTs process blood cultures (proper collection and incubation), perform Gram stains, run lactate levels, CBCs for WBC/bands, procalcitonin assays, and provide sensitivity testing to guide antibiotic therapy.",
        lessonSlugs: ["clinical-microbiology-mlt", "critical-value-reporting-mlt", "clinical-chemistry-mlt"],
        practiceQuestionTopics: ["blood culture technique", "Gram stain interpretation", "procalcitonin utility"],
        flashcardTopics: ["blood culture collection", "lactate critical values", "antibiotic sensitivity"]
      }
    ]
  },
  {
    conditionSlug: "asthma",
    conditionName: "Asthma",
    perspectives: [
      {
        profession: "Registered Nurse (RN)",
        professionSlug: "rn",
        approach: "RNs assess respiratory status, administer bronchodilators and corticosteroids, teach proper inhaler technique, develop asthma action plans, and monitor for status asthmaticus requiring escalation.",
        lessonSlugs: ["asthma-emergency", "respiratory-assessment"],
        practiceQuestionTopics: ["inhaler technique", "status asthmaticus", "asthma action plan zones"],
        flashcardTopics: ["SABA vs ICS", "peak flow zones", "silent chest significance"]
      },
      {
        profession: "Paramedic",
        professionSlug: "paramedic",
        approach: "Paramedics manage acute asthma exacerbations in the field with nebulized albuterol, ipratropium, IM epinephrine for severe bronchospasm, and prepare for advanced airway management in impending respiratory arrest.",
        lessonSlugs: ["airway-emergencies-paramedic", "pharmacology-field-drugs-paramedic"],
        practiceQuestionTopics: ["field bronchodilator therapy", "severe asthma management", "pediatric asthma"],
        flashcardTopics: ["nebulizer dosing", "epinephrine in asthma", "RSI indications"]
      },
      {
        profession: "Respiratory Therapist (RRT)",
        professionSlug: "rrt",
        approach: "RRTs are the primary providers of bronchodilator therapy, peak flow monitoring, and mechanical ventilation in status asthmaticus. They manage heliox therapy, continuous nebulization, and ventilator strategies for air trapping.",
        lessonSlugs: ["oxygen-delivery-systems-rrt", "mechanical-ventilation-modes-rrt", "ventilator-troubleshooting-rrt"],
        practiceQuestionTopics: ["continuous nebulization", "heliox therapy", "ventilating the asthmatic"],
        flashcardTopics: ["auto-PEEP", "I:E ratio in asthma", "peak flow interpretation"]
      }
    ]
  },
  {
    conditionSlug: "copd",
    conditionName: "Chronic Obstructive Pulmonary Disease (COPD)",
    perspectives: [
      {
        profession: "Registered Nurse (RN)",
        professionSlug: "rn",
        approach: "RNs manage COPD exacerbations with bronchodilator therapy, monitor for CO2 retention, educate on smoking cessation, oxygen therapy at home, and inhaler technique for long-term management.",
        lessonSlugs: ["copd-basics-rpn", "copd-management-np", "respiratory-assessment"],
        practiceQuestionTopics: ["COPD exacerbation management", "oxygen therapy in COPD", "GOLD classification"],
        flashcardTopics: ["hypoxic drive theory", "pursed-lip breathing", "COPD medications"]
      },
      {
        profession: "Paramedic",
        professionSlug: "paramedic",
        approach: "Paramedics manage acute COPD exacerbations with controlled oxygen therapy (avoid high-flow O2), nebulized bronchodilators, and CPAP in the field. They differentiate COPD exacerbation from pneumonia and heart failure.",
        lessonSlugs: ["airway-emergencies-paramedic", "pharmacology-field-drugs-paramedic"],
        practiceQuestionTopics: ["oxygen caution in COPD", "CPAP in COPD", "differential diagnosis"],
        flashcardTopics: ["target SpO2 in COPD", "field CPAP settings", "wheezing differential"]
      },
      {
        profession: "Respiratory Therapist (RRT)",
        professionSlug: "rrt",
        approach: "RRTs are central to COPD management — from pulmonary function testing for diagnosis and staging, to managing NIV during exacerbations, optimizing inhaler therapy, and managing chronic ventilatory failure.",
        lessonSlugs: ["gas-exchange-physiology-rrt", "oxygen-delivery-systems-rrt", "mechanical-ventilation-modes-rrt", "abg-interpretation-rrt", "acid-base-disorders-rrt"],
        practiceQuestionTopics: ["PFT interpretation", "NIV in COPD", "chronic respiratory acidosis"],
        flashcardTopics: ["FEV1/FVC ratio", "Venturi mask settings", "compensated acidosis"]
      },
      {
        profession: "Medical Laboratory Technologist (MLT)",
        professionSlug: "mlt",
        approach: "MLTs perform ABG analysis to assess acid-base status and oxygenation, alpha-1 antitrypsin levels for genetic screening, sputum cultures during infectious exacerbations, and CBC for polycythemia secondary to chronic hypoxia.",
        lessonSlugs: ["clinical-chemistry-mlt", "clinical-microbiology-mlt", "hematology-fundamentals-mlt"],
        practiceQuestionTopics: ["ABG in COPD", "alpha-1 antitrypsin testing", "sputum culture interpretation"],
        flashcardTopics: ["compensated respiratory acidosis", "polycythemia in COPD", "sputum Gram stain"]
      }
    ]
  },
  {
    conditionSlug: "anaphylaxis",
    conditionName: "Anaphylaxis",
    perspectives: [
      {
        profession: "Registered Nurse (RN)",
        professionSlug: "rn",
        approach: "RNs administer IM epinephrine immediately, establish IV access, manage airway, administer adjunctive medications (diphenhydramine, methylprednisolone), and monitor for biphasic reaction for 4-6 hours.",
        lessonSlugs: ["anaphylaxis", "shock-types-recognition-rpn", "medication-administration-safety"],
        practiceQuestionTopics: ["epinephrine administration", "biphasic reaction", "anaphylaxis triggers"],
        flashcardTopics: ["IM epinephrine dose", "anaphylaxis criteria", "distributive shock"]
      },
      {
        profession: "Paramedic",
        professionSlug: "paramedic",
        approach: "Paramedics are often first responders to anaphylaxis. They administer IM epinephrine, manage airway compromise from laryngeal edema, provide aggressive IV fluid resuscitation for distributive shock, and transport for observation.",
        lessonSlugs: ["pharmacology-field-drugs-paramedic", "airway-emergencies-paramedic"],
        practiceQuestionTopics: ["field epinephrine", "airway management in anaphylaxis", "shock fluid resuscitation"],
        flashcardTopics: ["EpiPen dosing", "cricothyrotomy indications", "anaphylaxis vs anaphylactoid"]
      },
      {
        profession: "Respiratory Therapist (RRT)",
        professionSlug: "rrt",
        approach: "RRTs manage the respiratory component of anaphylaxis — bronchospasm and upper airway edema. They provide nebulized epinephrine for stridor, bronchodilators for wheezing, and prepare for emergency intubation.",
        lessonSlugs: ["airway-management-rrt", "oxygen-delivery-systems-rrt"],
        practiceQuestionTopics: ["racemic epinephrine", "difficult airway in anaphylaxis", "bronchospasm management"],
        flashcardTopics: ["nebulized epinephrine dose", "stridor management", "emergency airway equipment"]
      }
    ]
  },
  {
    conditionSlug: "hypertension",
    conditionName: "Hypertension",
    perspectives: [
      {
        profession: "Registered Nurse (RN)",
        professionSlug: "rn",
        approach: "RNs perform accurate blood pressure assessment, administer antihypertensive medications, educate on lifestyle modifications (DASH diet, exercise), manage hypertensive crises, and monitor for target organ damage.",
        lessonSlugs: ["hypertension", "hypertensive-crisis-rn", "cardiac-assessment-ecg"],
        practiceQuestionTopics: ["BP staging", "hypertensive emergency vs urgency", "antihypertensive medications"],
        flashcardTopics: ["ACC/AHA BP guidelines", "DASH diet components", "antihypertensive classes"]
      },
      {
        profession: "Paramedic",
        professionSlug: "paramedic",
        approach: "Paramedics encounter hypertensive emergencies in the field with end-organ damage — stroke, aortic dissection, acute pulmonary edema. They manage acute symptoms, avoid rapid BP reduction, and transport to appropriate facilities.",
        lessonSlugs: ["stroke-recognition-paramedic", "cardiac-arrest-management-paramedic"],
        practiceQuestionTopics: ["hypertensive emergency field management", "aortic dissection recognition", "stroke from HTN"],
        flashcardTopics: ["target BP reduction rate", "aortic dissection signs", "HTN and stroke"]
      },
      {
        profession: "Medical Laboratory Technologist (MLT)",
        professionSlug: "mlt",
        approach: "MLTs perform renal function tests (BMP, creatinine, BUN), urinalysis for proteinuria indicating nephropathy, lipid panels for cardiovascular risk assessment, and HbA1c for diabetes screening in hypertensive patients.",
        lessonSlugs: ["clinical-chemistry-mlt", "urinalysis-body-fluids-mlt", "quality-control-mlt"],
        practiceQuestionTopics: ["renal function tests", "urinalysis interpretation", "lipid panel analysis"],
        flashcardTopics: ["GFR calculation", "proteinuria significance", "lipid targets"]
      }
    ]
  },
  {
    conditionSlug: "diabetes",
    conditionName: "Diabetes Mellitus",
    perspectives: [
      {
        profession: "Registered Nurse (RN)",
        professionSlug: "rn",
        approach: "RNs manage insulin administration, blood glucose monitoring, patient education on carbohydrate counting, foot care assessment, sick day management, and recognition of acute complications (DKA, HHS, hypoglycemia).",
        lessonSlugs: ["diabetes-lifespan", "dka-management-rn", "hhs-management-rn"],
        practiceQuestionTopics: ["insulin types and timing", "DKA vs HHS", "hypoglycemia management"],
        flashcardTopics: ["insulin onset/peak/duration", "Rule of 15", "HbA1c targets"]
      },
      {
        profession: "Paramedic",
        professionSlug: "paramedic",
        approach: "Paramedics frequently encounter diabetic emergencies — hypoglycemia causing altered mental status treated with oral glucose or IV dextrose, and DKA identified by Kussmaul respirations and hyperglycemia.",
        lessonSlugs: ["pharmacology-field-drugs-paramedic", "sepsis-recognition-paramedic"],
        practiceQuestionTopics: ["prehospital glucose management", "D50 administration", "DKA field recognition"],
        flashcardTopics: ["D50 dosing", "glucometer use", "hypoglycemia signs"]
      },
      {
        profession: "Medical Laboratory Technologist (MLT)",
        professionSlug: "mlt",
        approach: "MLTs perform HbA1c assays for long-term glucose monitoring, fasting glucose and OGTT for diagnosis, urine microalbumin for nephropathy screening, and point-of-care glucose quality control.",
        lessonSlugs: ["clinical-chemistry-mlt", "quality-control-mlt", "urinalysis-body-fluids-mlt"],
        practiceQuestionTopics: ["HbA1c methodology", "glucose testing standards", "microalbumin testing"],
        flashcardTopics: ["HbA1c diagnostic criteria", "OGTT protocol", "glucose QC requirements"]
      }
    ]
  },
  {
    conditionSlug: "heart-failure",
    conditionName: "Heart Failure",
    perspectives: [
      {
        profession: "Registered Nurse (RN)",
        professionSlug: "rn",
        approach: "RNs assess fluid status (daily weights, I&O, edema), administer diuretics and ACE inhibitors, educate on sodium restriction, monitor for decompensation signs, and manage complex medication regimens.",
        lessonSlugs: ["heart-failure", "heart-failure-rn", "cardiac-assessment-ecg", "iv-therapy"],
        practiceQuestionTopics: ["NYHA classification", "fluid management", "heart failure medications"],
        flashcardTopics: ["daily weight monitoring", "sodium restriction", "ACE inhibitor teaching"]
      },
      {
        profession: "Paramedic",
        professionSlug: "paramedic",
        approach: "Paramedics manage acute decompensated heart failure in the field — acute pulmonary edema with CPAP, nitroglycerin for preload reduction, and positioning. They differentiate HF from COPD and pneumonia.",
        lessonSlugs: ["cardiac-arrest-management-paramedic", "pharmacology-field-drugs-paramedic"],
        practiceQuestionTopics: ["field CPAP for CHF", "nitroglycerin in heart failure", "pulmonary edema management"],
        flashcardTopics: ["CPAP for CHF", "furosemide field dosing", "JVD assessment"]
      },
      {
        profession: "Respiratory Therapist (RRT)",
        professionSlug: "rrt",
        approach: "RRTs manage non-invasive ventilation (CPAP/BiPAP) for cardiogenic pulmonary edema, optimize oxygenation, and provide mechanical ventilation support in severe decompensation with respiratory failure.",
        lessonSlugs: ["hemodynamic-positive-pressure-rrt", "oxygen-delivery-systems-rrt", "mechanical-ventilation-modes-rrt"],
        practiceQuestionTopics: ["CPAP in pulmonary edema", "BiPAP settings", "cardiogenic vs non-cardiogenic edema"],
        flashcardTopics: ["CPAP hemodynamic effects", "PEEP in heart failure", "BiPAP vs CPAP"]
      },
      {
        profession: "Medical Laboratory Technologist (MLT)",
        professionSlug: "mlt",
        approach: "MLTs perform BNP/NT-proBNP for heart failure diagnosis and monitoring, basic metabolic panels for electrolyte monitoring during diuretic therapy, renal function tests, and cardiac biomarkers.",
        lessonSlugs: ["clinical-chemistry-mlt", "critical-value-reporting-mlt"],
        practiceQuestionTopics: ["BNP interpretation", "electrolyte monitoring", "renal function in HF"],
        flashcardTopics: ["BNP diagnostic cutoffs", "potassium in diuretic therapy", "creatinine trends"]
      }
    ]
  },
  {
    conditionSlug: "pneumonia",
    conditionName: "Pneumonia",
    perspectives: [
      {
        profession: "Registered Nurse (RN)",
        professionSlug: "rn",
        approach: "RNs assess respiratory status, administer antibiotics, monitor oxygen saturation, encourage incentive spirometry, implement aspiration precautions, and educate on pneumococcal vaccination.",
        lessonSlugs: ["pneumonia-basics-rpn", "respiratory-assessment", "sepsis"],
        practiceQuestionTopics: ["CAP vs HAP", "sputum collection", "VAP prevention bundle"],
        flashcardTopics: ["pneumonia pathogens", "CURB-65 score", "aspiration precautions"]
      },
      {
        profession: "Paramedic",
        professionSlug: "paramedic",
        approach: "Paramedics assess respiratory distress in pneumonia patients, provide supplemental oxygen, monitor for sepsis progression, and transport for imaging and antibiotic therapy.",
        lessonSlugs: ["sepsis-recognition-paramedic", "airway-emergencies-paramedic"],
        practiceQuestionTopics: ["pneumonia field assessment", "sepsis screening", "oxygen therapy"],
        flashcardTopics: ["lung auscultation findings", "sepsis red flags", "respiratory distress signs"]
      },
      {
        profession: "Respiratory Therapist (RRT)",
        professionSlug: "rrt",
        approach: "RRTs provide oxygen therapy, bronchial hygiene techniques, sputum collection for culture, chest physiotherapy, and mechanical ventilation for severe pneumonia progressing to ARDS.",
        lessonSlugs: ["oxygen-delivery-systems-rrt", "ards-respiratory-failure-rrt", "gas-exchange-physiology-rrt"],
        practiceQuestionTopics: ["sputum induction", "chest physiotherapy", "ARDS from pneumonia"],
        flashcardTopics: ["sputum quality criteria", "postural drainage positions", "shunt fraction"]
      },
      {
        profession: "Medical Laboratory Technologist (MLT)",
        professionSlug: "mlt",
        approach: "MLTs perform sputum Gram stain and culture, blood cultures, CBC with differential for WBC/bands, procalcitonin levels, and urinary antigen testing for Legionella and pneumococcal pneumonia.",
        lessonSlugs: ["clinical-microbiology-mlt", "hematology-fundamentals-mlt", "critical-value-reporting-mlt"],
        practiceQuestionTopics: ["sputum Gram stain", "blood culture technique", "urinary antigen tests"],
        flashcardTopics: ["Gram stain categories", "sputum quality criteria", "WBC differential in infection"]
      }
    ]
  },
  {
    conditionSlug: "acute-respiratory-distress-syndrome",
    conditionName: "Acute Respiratory Distress Syndrome (ARDS)",
    perspectives: [
      {
        profession: "Registered Nurse (RN)",
        professionSlug: "rn",
        approach: "RNs monitor for ARDS in at-risk patients (sepsis, pneumonia, trauma), manage prone positioning logistics, monitor ventilator settings and hemodynamics, and provide complex ICU nursing care.",
        lessonSlugs: ["ards-rn", "sepsis-rn", "mechanical-ventilation-rn"],
        practiceQuestionTopics: ["Berlin criteria", "prone positioning nursing care", "ARDS triggers"],
        flashcardTopics: ["P/F ratio classification", "prone positioning protocol", "ARDS risk factors"]
      },
      {
        profession: "Paramedic",
        professionSlug: "paramedic",
        approach: "Paramedics encounter ARDS rarely in the field but must recognize progressive respiratory failure unresponsive to supplemental oxygen. They provide high-flow O2, CPAP if available, and rapid transport to critical care.",
        lessonSlugs: ["airway-emergencies-paramedic", "trauma-algorithm-paramedic"],
        practiceQuestionTopics: ["refractory hypoxemia recognition", "field CPAP", "respiratory failure transport"],
        flashcardTopics: ["ARDS vs CHF", "shunt physiology", "high-flow oxygen"]
      },
      {
        profession: "Respiratory Therapist (RRT)",
        professionSlug: "rrt",
        approach: "RRTs are the lead clinicians managing ARDS ventilation — lung-protective strategy with low tidal volumes (6 mL/kg IBW), PEEP titration using ARDSNet tables, prone positioning coordination, and rescue therapies (iNO, ECMO referral).",
        lessonSlugs: ["ards-respiratory-failure-rrt", "mechanical-ventilation-modes-rrt", "ventilator-troubleshooting-rrt", "vq-mismatch-rrt"],
        practiceQuestionTopics: ["ARDSNet protocol", "PEEP titration", "rescue therapies"],
        flashcardTopics: ["6 mL/kg IBW", "plateau pressure target", "driving pressure concept"]
      },
      {
        profession: "Medical Laboratory Technologist (MLT)",
        professionSlug: "mlt",
        approach: "MLTs perform serial ABGs for P/F ratio trending, CBCs, inflammatory markers, and microbiologic cultures to identify the underlying cause of ARDS.",
        lessonSlugs: ["clinical-chemistry-mlt", "clinical-microbiology-mlt", "critical-value-reporting-mlt"],
        practiceQuestionTopics: ["P/F ratio calculation", "ABG trending", "inflammatory markers"],
        flashcardTopics: ["P/F ratio thresholds", "ABG sample handling", "lactate in ARDS"]
      }
    ]
  },
  {
    conditionSlug: "cardiac-arrest",
    conditionName: "Cardiac Arrest",
    perspectives: [
      {
        profession: "Registered Nurse (RN)",
        professionSlug: "rn",
        approach: "RNs initiate BLS/ACLS, perform high-quality CPR, administer code medications, manage post-cardiac arrest care including targeted temperature management, and support family during resuscitation.",
        lessonSlugs: ["cardiac-assessment-ecg", "shock-types-recognition-rpn"],
        practiceQuestionTopics: ["ACLS algorithms", "post-ROSC care", "code blue response"],
        flashcardTopics: ["shockable vs non-shockable rhythms", "epinephrine timing", "TTM protocol"]
      },
      {
        profession: "Paramedic",
        professionSlug: "paramedic",
        approach: "Paramedics manage cardiac arrest from scene arrival through transport — high-quality CPR, early defibrillation, ACLS pharmacology, advanced airway placement, and identification of reversible causes (Hs and Ts).",
        lessonSlugs: ["cardiac-arrest-management-paramedic", "acls-pharmacology-paramedic"],
        practiceQuestionTopics: ["Hs and Ts", "defibrillation technique", "ACLS medications"],
        flashcardTopics: ["CPR rate and depth", "joule settings", "amiodarone dosing"]
      },
      {
        profession: "Respiratory Therapist (RRT)",
        professionSlug: "rrt",
        approach: "RRTs manage the airway during cardiac arrest — bag-valve-mask ventilation, advanced airway placement, capnography monitoring for CPR quality and ROSC detection, and post-arrest ventilator management.",
        lessonSlugs: ["airway-management-rrt", "mechanical-ventilation-modes-rrt", "oxygen-delivery-systems-rrt"],
        practiceQuestionTopics: ["BVM technique", "ETT confirmation", "capnography in arrest"],
        flashcardTopics: ["ETCO2 in CPR", "ventilation rate in arrest", "post-ROSC ventilation"]
      }
    ]
  },
  {
    conditionSlug: "traumatic-brain-injury",
    conditionName: "Traumatic Brain Injury (TBI)",
    perspectives: [
      {
        profession: "Registered Nurse (RN)",
        professionSlug: "rn",
        approach: "RNs perform serial neurological assessments (GCS, pupil checks), manage ICP monitoring, maintain CPP, prevent secondary brain injury through positioning, temperature management, and seizure prophylaxis.",
        lessonSlugs: ["increased-icp", "cranial-nerve-assessment", "stroke"],
        practiceQuestionTopics: ["GCS assessment", "ICP management", "Cushing's triad"],
        flashcardTopics: ["GCS components", "CPP calculation", "herniation signs"]
      },
      {
        profession: "Paramedic",
        professionSlug: "paramedic",
        approach: "Paramedics assess GCS in the field, prevent secondary brain injury (avoid hypotension and hypoxia), maintain cervical spine immobilization, and transport to trauma centers with neurosurgical capability.",
        lessonSlugs: ["trauma-algorithm-paramedic", "field-triage-paramedic"],
        practiceQuestionTopics: ["field GCS assessment", "TBI transport criteria", "preventing secondary injury"],
        flashcardTopics: ["GCS score interpretation", "pupil assessment", "TBI field management"]
      },
      {
        profession: "Respiratory Therapist (RRT)",
        professionSlug: "rrt",
        approach: "RRTs manage ventilation in TBI to maintain PaCO2 35-40 mmHg (avoiding hyperventilation), optimize oxygenation to prevent secondary injury, and manage ventilator settings during ICP crises.",
        lessonSlugs: ["mechanical-ventilation-modes-rrt", "abg-interpretation-rrt", "airway-management-rrt"],
        practiceQuestionTopics: ["PaCO2 targets in TBI", "hyperventilation risks", "neuroprotective ventilation"],
        flashcardTopics: ["PaCO2 and cerebral blood flow", "ICP and ventilation", "sedation in TBI"]
      }
    ]
  },
  {
    conditionSlug: "acute-kidney-injury",
    conditionName: "Acute Kidney Injury (AKI)",
    perspectives: [
      {
        profession: "Registered Nurse (RN)",
        professionSlug: "rn",
        approach: "RNs monitor urine output hourly, track fluid balance, manage electrolyte imbalances (hyperkalemia), administer nephrotoxic medication cautiously, and prepare for dialysis if indicated.",
        lessonSlugs: ["aki-management-rn", "hyperkalemia-rn", "iv-therapy", "ckd-management-rn"],
        practiceQuestionTopics: ["AKI staging (KDIGO)", "prerenal vs intrarenal vs postrenal", "dialysis indications"],
        flashcardTopics: ["AKI criteria", "hyperkalemia treatment", "nephrotoxic medications"]
      },
      {
        profession: "Medical Laboratory Technologist (MLT)",
        professionSlug: "mlt",
        approach: "MLTs perform serial creatinine and BUN measurements, electrolyte panels for potassium monitoring, urinalysis with microscopy (casts, crystals), fractional excretion of sodium calculation, and blood gas analysis.",
        lessonSlugs: ["clinical-chemistry-mlt", "urinalysis-body-fluids-mlt", "critical-value-reporting-mlt"],
        practiceQuestionTopics: ["creatinine trending", "urine sediment analysis", "FENa calculation"],
        flashcardTopics: ["AKI lab criteria", "muddy brown casts", "BUN:creatinine ratio"]
      },
      {
        profession: "Respiratory Therapist (RRT)",
        professionSlug: "rrt",
        approach: "RRTs manage the respiratory complications of AKI — metabolic acidosis causing compensatory hyperventilation, pulmonary edema from fluid overload, and ventilator management during continuous renal replacement therapy.",
        lessonSlugs: ["acid-base-disorders-rrt", "abg-interpretation-rrt", "hemodynamic-positive-pressure-rrt"],
        practiceQuestionTopics: ["metabolic acidosis in AKI", "fluid overload management", "CRRT and ventilation"],
        flashcardTopics: ["ABG in metabolic acidosis", "pulmonary edema assessment", "bicarbonate therapy"]
      }
    ]
  },
  {
    conditionSlug: "gastrointestinal-bleeding",
    conditionName: "Gastrointestinal Bleeding",
    perspectives: [
      {
        profession: "Registered Nurse (RN)",
        professionSlug: "rn",
        approach: "RNs assess for upper vs lower GI bleeding, monitor hemodynamic stability, manage blood transfusions, administer proton pump inhibitors, and prepare patients for endoscopy.",
        lessonSlugs: ["shock-types-recognition-rpn", "blood-transfusion-rn", "iv-therapy"],
        practiceQuestionTopics: ["upper vs lower GI bleed", "hemorrhagic shock management", "transfusion protocols"],
        flashcardTopics: ["melena vs hematochezia", "Blatchford score", "PPI dosing"]
      },
      {
        profession: "Paramedic",
        professionSlug: "paramedic",
        approach: "Paramedics manage hemorrhagic shock from GI bleeding in the field — large-bore IV access, fluid resuscitation with permissive hypotension, and rapid transport for endoscopic intervention.",
        lessonSlugs: ["trauma-algorithm-paramedic", "pharmacology-field-drugs-paramedic"],
        practiceQuestionTopics: ["GI bleed field assessment", "hemorrhagic shock management", "IV access priority"],
        flashcardTopics: ["shock class by blood loss", "fluid resuscitation", "hematemesis management"]
      },
      {
        profession: "Medical Laboratory Technologist (MLT)",
        professionSlug: "mlt",
        approach: "MLTs perform STAT CBC for hemoglobin trending, type and crossmatch for blood products, coagulation studies, BMP for renal function, and fecal occult blood testing.",
        lessonSlugs: ["hematology-fundamentals-mlt", "blood-typing-crossmatching-mlt", "coagulation-cascade-mlt"],
        practiceQuestionTopics: ["serial hemoglobin monitoring", "crossmatch urgency", "coagulation in GI bleed"],
        flashcardTopics: ["type and screen vs crossmatch", "hemoglobin critical values", "transfusion triggers"]
      }
    ]
  },
  {
    conditionSlug: "shock",
    conditionName: "Shock (All Types)",
    perspectives: [
      {
        profession: "Registered Nurse (RN)",
        professionSlug: "rn",
        approach: "RNs differentiate shock types (hypovolemic, cardiogenic, distributive, obstructive), manage IV fluids and vasopressors, monitor hemodynamics, assess tissue perfusion, and intervene for deterioration.",
        lessonSlugs: ["shock-types-recognition-rpn", "sepsis-rn", "iv-therapy"],
        practiceQuestionTopics: ["shock type differentiation", "vasopressor selection", "fluid challenge assessment"],
        flashcardTopics: ["shock hemodynamic profiles", "MAP targets", "lactate in shock"]
      },
      {
        profession: "Paramedic",
        professionSlug: "paramedic",
        approach: "Paramedics identify and manage shock in the field using clinical assessment — skin signs, pulse quality, mental status. They initiate IV fluid resuscitation, apply tourniquets or pelvic binders as needed, and transport rapidly.",
        lessonSlugs: ["trauma-algorithm-paramedic", "sepsis-recognition-paramedic", "cardiac-arrest-management-paramedic"],
        practiceQuestionTopics: ["field shock assessment", "fluid resuscitation strategy", "shock differentiation"],
        flashcardTopics: ["shock classes", "permissive hypotension", "pelvic binder indications"]
      },
      {
        profession: "Respiratory Therapist (RRT)",
        professionSlug: "rrt",
        approach: "RRTs manage respiratory failure secondary to shock — intubation and mechanical ventilation, optimizing oxygen delivery, and understanding the hemodynamic effects of positive pressure ventilation on cardiac output.",
        lessonSlugs: ["hemodynamic-positive-pressure-rrt", "mechanical-ventilation-modes-rrt", "oxygen-delivery-systems-rrt"],
        practiceQuestionTopics: ["ventilation in shock", "positive pressure hemodynamics", "oxygen delivery optimization"],
        flashcardTopics: ["PPV and preload", "DO2 calculation", "PEEP in shock"]
      },
      {
        profession: "Medical Laboratory Technologist (MLT)",
        professionSlug: "mlt",
        approach: "MLTs perform lactate levels for tissue perfusion assessment, ABGs, CBC, coagulation studies, type and crossmatch for hemorrhagic shock, and blood cultures for septic shock.",
        lessonSlugs: ["clinical-chemistry-mlt", "blood-typing-crossmatching-mlt", "critical-value-reporting-mlt"],
        practiceQuestionTopics: ["lactate trending", "massive transfusion protocol labs", "DIC screening"],
        flashcardTopics: ["lactate normal values", "DIC lab findings", "MTP lab support"]
      }
    ]
  },
  {
    conditionSlug: "atrial-fibrillation",
    conditionName: "Atrial Fibrillation",
    perspectives: [
      {
        profession: "Registered Nurse (RN)",
        professionSlug: "rn",
        approach: "RNs monitor cardiac rhythm, manage rate vs rhythm control medications, assess for stroke risk using CHA2DS2-VASc score, administer anticoagulants, and educate on INR monitoring.",
        lessonSlugs: ["atrial-fibrillation-rn", "cardiac-assessment-ecg", "stroke"],
        practiceQuestionTopics: ["rate vs rhythm control", "anticoagulation in AF", "cardioversion nursing"],
        flashcardTopics: ["CHA2DS2-VASc score", "AF ECG features", "diltiazem vs metoprolol"]
      },
      {
        profession: "Paramedic",
        professionSlug: "paramedic",
        approach: "Paramedics identify AF on cardiac monitor, differentiate rapid ventricular response from other SVTs, manage hemodynamically unstable AF with synchronized cardioversion, and assess for associated stroke symptoms.",
        lessonSlugs: ["acls-pharmacology-paramedic", "cardiac-arrest-management-paramedic"],
        practiceQuestionTopics: ["AF rhythm identification", "cardioversion indications", "AF vs SVT"],
        flashcardTopics: ["irregular irregularity", "cardioversion joules", "adenosine contraindication in AF"]
      },
      {
        profession: "Medical Laboratory Technologist (MLT)",
        professionSlug: "mlt",
        approach: "MLTs monitor anticoagulation therapy — PT/INR for warfarin, anti-Xa levels for LMWH/DOACs, thyroid function tests (hyperthyroidism causes AF), and electrolytes that affect cardiac rhythm.",
        lessonSlugs: ["coagulation-cascade-mlt", "clinical-chemistry-mlt"],
        practiceQuestionTopics: ["INR monitoring", "anti-Xa assay", "thyroid and AF"],
        flashcardTopics: ["INR therapeutic range", "DOAC monitoring", "electrolyte effects on rhythm"]
      }
    ]
  },
  {
    conditionSlug: "deep-vein-thrombosis",
    conditionName: "Deep Vein Thrombosis (DVT)",
    perspectives: [
      {
        profession: "Registered Nurse (RN)",
        professionSlug: "rn",
        approach: "RNs assess for unilateral leg swelling, warmth, and pain; administer anticoagulants; monitor for PE progression; implement DVT prophylaxis protocols; and educate on compression stockings and activity.",
        lessonSlugs: ["dvt-pe", "pulmonary-embolism-rn", "iv-therapy"],
        practiceQuestionTopics: ["DVT assessment", "anticoagulation protocols", "DVT prophylaxis"],
        flashcardTopics: ["Virchow's triad", "heparin vs LMWH", "Homans sign reliability"]
      },
      {
        profession: "Medical Laboratory Technologist (MLT)",
        professionSlug: "mlt",
        approach: "MLTs perform D-dimer assays for DVT screening, coagulation studies for anticoagulation monitoring, and heparin anti-Xa levels for therapeutic monitoring.",
        lessonSlugs: ["coagulation-cascade-mlt", "clinical-chemistry-mlt", "critical-value-reporting-mlt"],
        practiceQuestionTopics: ["D-dimer specificity", "aPTT monitoring", "heparin-induced thrombocytopenia labs"],
        flashcardTopics: ["D-dimer sensitivity", "aPTT therapeutic range", "HIT testing"]
      }
    ]
  },
  {
    conditionSlug: "meningitis",
    conditionName: "Meningitis",
    perspectives: [
      {
        profession: "Registered Nurse (RN)",
        professionSlug: "rn",
        approach: "RNs assess for meningeal signs (nuchal rigidity, Kernig's, Brudzinski's), implement droplet isolation, administer IV antibiotics rapidly, monitor neurological status, and manage increased ICP.",
        lessonSlugs: ["meningitis-basics-rpn", "increased-icp", "cranial-nerve-assessment"],
        practiceQuestionTopics: ["meningeal signs", "isolation precautions", "lumbar puncture nursing"],
        flashcardTopics: ["Kernig vs Brudzinski", "bacterial vs viral CSF", "prophylaxis for contacts"]
      },
      {
        profession: "Paramedic",
        professionSlug: "paramedic",
        approach: "Paramedics recognize meningitis in the field through fever, headache, altered mental status, and petechial rash. They manage seizures, provide supportive care, and transport rapidly for lumbar puncture and antibiotics.",
        lessonSlugs: ["sepsis-recognition-paramedic", "pediatric-emergencies-paramedic"],
        practiceQuestionTopics: ["meningitis field recognition", "seizure management", "pediatric meningitis"],
        flashcardTopics: ["petechial rash significance", "meningococcemia signs", "field seizure drugs"]
      },
      {
        profession: "Medical Laboratory Technologist (MLT)",
        professionSlug: "mlt",
        approach: "MLTs perform CSF analysis — cell count, protein, glucose, Gram stain, culture — that is critical for differentiating bacterial from viral meningitis. They also perform blood cultures and molecular testing.",
        lessonSlugs: ["clinical-microbiology-mlt", "urinalysis-body-fluids-mlt", "critical-value-reporting-mlt"],
        practiceQuestionTopics: ["CSF analysis interpretation", "Gram stain of CSF", "bacterial vs viral CSF"],
        flashcardTopics: ["normal CSF values", "CSF Gram stain organisms", "CSF glucose ratio"]
      }
    ]
  },
  {
    conditionSlug: "seizures",
    conditionName: "Seizures / Status Epilepticus",
    perspectives: [
      {
        profession: "Registered Nurse (RN)",
        professionSlug: "rn",
        approach: "RNs implement seizure precautions, time seizure duration, protect the patient from injury, administer benzodiazepines for prolonged seizures, monitor for status epilepticus, and educate on antiepileptic medications.",
        lessonSlugs: ["seizure-types-priorities-rpn", "increased-icp", "cranial-nerve-assessment"],
        practiceQuestionTopics: ["seizure precautions", "status epilepticus management", "antiepileptic drug monitoring"],
        flashcardTopics: ["seizure types", "lorazepam vs diazepam dosing", "phenytoin monitoring"]
      },
      {
        profession: "Paramedic",
        professionSlug: "paramedic",
        approach: "Paramedics manage active seizures in the field — airway positioning, benzodiazepine administration (IM midazolam, IV lorazepam, intranasal midazolam), blood glucose check, and transport for first-time seizures.",
        lessonSlugs: ["pharmacology-field-drugs-paramedic", "pediatric-emergencies-paramedic"],
        practiceQuestionTopics: ["field seizure management", "midazolam routes", "febrile seizure assessment"],
        flashcardTopics: ["midazolam IM dose", "seizure airway management", "postictal assessment"]
      },
      {
        profession: "Medical Laboratory Technologist (MLT)",
        professionSlug: "mlt",
        approach: "MLTs perform therapeutic drug monitoring for antiepileptic medications (phenytoin, valproic acid, carbamazepine), metabolic panels to identify seizure causes (glucose, sodium, calcium), and toxicology screens.",
        lessonSlugs: ["clinical-chemistry-mlt", "critical-value-reporting-mlt", "quality-control-mlt"],
        practiceQuestionTopics: ["therapeutic drug monitoring", "metabolic seizure causes", "toxicology screening"],
        flashcardTopics: ["phenytoin therapeutic range", "sodium critical values", "drug level timing"]
      }
    ]
  },
  {
    conditionSlug: "burns",
    conditionName: "Burns",
    perspectives: [
      {
        profession: "Registered Nurse (RN)",
        professionSlug: "rn",
        approach: "RNs calculate TBSA using the Rule of Nines, manage Parkland formula fluid resuscitation, perform wound care, monitor for infection, manage pain, and assess for compartment syndrome in circumferential burns.",
        lessonSlugs: ["burn-management", "iv-therapy", "shock-types-recognition-rpn"],
        practiceQuestionTopics: ["Rule of Nines", "Parkland formula", "burn wound care"],
        flashcardTopics: ["burn depth classification", "fluid calculation", "escharotomy indications"]
      },
      {
        profession: "Paramedic",
        professionSlug: "paramedic",
        approach: "Paramedics provide initial burn care — stop the burning process, assess for inhalation injury, initiate fluid resuscitation, manage pain, cover burns with sterile dressings, and transport to burn centers.",
        lessonSlugs: ["trauma-algorithm-paramedic", "airway-emergencies-paramedic"],
        practiceQuestionTopics: ["burn field assessment", "inhalation injury signs", "burn center criteria"],
        flashcardTopics: ["Rule of Nines prehospital", "singed nasal hairs significance", "cooling guidelines"]
      },
      {
        profession: "Respiratory Therapist (RRT)",
        professionSlug: "rrt",
        approach: "RRTs manage inhalation injury — the leading cause of burn mortality. They perform bronchoscopy for assessment, manage airway edema with early intubation, and provide mechanical ventilation with strategies to minimize barotrauma.",
        lessonSlugs: ["airway-management-rrt", "mechanical-ventilation-modes-rrt", "oxygen-delivery-systems-rrt"],
        practiceQuestionTopics: ["inhalation injury assessment", "carboxyhemoglobin management", "burn ventilation strategy"],
        flashcardTopics: ["CO poisoning SpO2", "early intubation criteria", "humidified O2 in burns"]
      },
      {
        profession: "Medical Laboratory Technologist (MLT)",
        professionSlug: "mlt",
        approach: "MLTs perform carboxyhemoglobin levels for inhalation injury, serial CBCs and electrolytes during fluid resuscitation, wound cultures for infection monitoring, and coagulation studies for DIC screening.",
        lessonSlugs: ["clinical-chemistry-mlt", "hematology-fundamentals-mlt", "clinical-microbiology-mlt"],
        practiceQuestionTopics: ["carboxyhemoglobin testing", "burn lab monitoring", "wound culture technique"],
        flashcardTopics: ["COHb levels and symptoms", "fluid shift electrolyte changes", "burn wound pathogens"]
      }
    ]
  },
  {
    conditionSlug: "disseminated-intravascular-coagulation",
    conditionName: "Disseminated Intravascular Coagulation (DIC)",
    perspectives: [
      {
        profession: "Registered Nurse (RN)",
        professionSlug: "rn",
        approach: "RNs monitor for bleeding and thrombotic complications simultaneously, administer blood products (FFP, cryoprecipitate, platelets), protect skin integrity, and treat the underlying cause.",
        lessonSlugs: ["dic-management-rn", "blood-transfusion-rn", "sepsis-rn"],
        practiceQuestionTopics: ["DIC triggers", "blood product replacement", "DIC assessment"],
        flashcardTopics: ["DIC lab findings", "cryoprecipitate indications", "bleeding precautions"]
      },
      {
        profession: "Medical Laboratory Technologist (MLT)",
        professionSlug: "mlt",
        approach: "MLTs are critical in DIC diagnosis — performing PT/INR, aPTT, fibrinogen, D-dimer, platelet count, and peripheral smear for schistocytes. Serial testing guides blood product replacement therapy.",
        lessonSlugs: ["coagulation-cascade-mlt", "hematology-fundamentals-mlt", "critical-value-reporting-mlt"],
        practiceQuestionTopics: ["DIC lab panel", "fibrinogen trending", "schistocyte identification"],
        flashcardTopics: ["DIC diagnostic criteria", "fibrinogen critical values", "D-dimer in DIC"]
      }
    ]
  },
  {
    conditionSlug: "hyperkalemia",
    conditionName: "Hyperkalemia",
    perspectives: [
      {
        profession: "Registered Nurse (RN)",
        professionSlug: "rn",
        approach: "RNs monitor cardiac rhythm for ECG changes, administer calcium gluconate for cardiac membrane stabilization, insulin/dextrose for potassium shifting, and kayexalate for elimination. They assess for underlying causes.",
        lessonSlugs: ["hyperkalemia-rn", "aki-management-rn", "cardiac-assessment-ecg"],
        practiceQuestionTopics: ["hyperkalemia ECG progression", "emergency treatment sequence", "potassium sources"],
        flashcardTopics: ["ECG changes in hyperkalemia", "calcium gluconate mechanism", "insulin-glucose protocol"]
      },
      {
        profession: "Paramedic",
        professionSlug: "paramedic",
        approach: "Paramedics encounter hyperkalemia-related cardiac arrest in dialysis patients. They recognize peaked T waves and wide QRS on the monitor, administer calcium chloride and sodium bicarbonate per protocol.",
        lessonSlugs: ["acls-pharmacology-paramedic", "cardiac-arrest-management-paramedic"],
        practiceQuestionTopics: ["hyperkalemia in cardiac arrest", "calcium chloride dosing", "dialysis patient emergencies"],
        flashcardTopics: ["peaked T waves", "calcium chloride vs gluconate", "bicarbonate indications"]
      },
      {
        profession: "Medical Laboratory Technologist (MLT)",
        professionSlug: "mlt",
        approach: "MLTs must differentiate true hyperkalemia from pseudohyperkalemia (hemolysis, fist clenching, tourniquet time). They verify critical potassium values, check for hemolysis indices, and communicate results urgently.",
        lessonSlugs: ["clinical-chemistry-mlt", "pre-analytical-errors-mlt", "critical-value-reporting-mlt"],
        practiceQuestionTopics: ["pseudohyperkalemia causes", "hemolysis detection", "critical value protocols"],
        flashcardTopics: ["potassium critical values", "hemolysis index", "specimen rejection criteria"]
      }
    ]
  },
  {
    conditionSlug: "opioid-overdose",
    conditionName: "Opioid Overdose",
    perspectives: [
      {
        profession: "Registered Nurse (RN)",
        professionSlug: "rn",
        approach: "RNs administer naloxone, manage the airway with positioning and ventilation support, monitor for renarcotization (naloxone duration shorter than opioid duration), and provide harm reduction education.",
        lessonSlugs: ["medication-administration-safety", "respiratory-assessment"],
        practiceQuestionTopics: ["naloxone administration", "respiratory depression assessment", "renarcotization risk"],
        flashcardTopics: ["naloxone dose and routes", "opioid toxidrome", "respiratory rate thresholds"]
      },
      {
        profession: "Paramedic",
        professionSlug: "paramedic",
        approach: "Paramedics are often first responders to opioid overdoses. They administer intranasal or IM naloxone, provide bag-valve-mask ventilation for apneic patients, and manage agitated patients post-naloxone.",
        lessonSlugs: ["pharmacology-field-drugs-paramedic", "airway-emergencies-paramedic"],
        practiceQuestionTopics: ["intranasal naloxone", "BVM ventilation", "post-naloxone management"],
        flashcardTopics: ["naloxone IN dose", "opioid triad", "titration to respirations"]
      },
      {
        profession: "Respiratory Therapist (RRT)",
        professionSlug: "rrt",
        approach: "RRTs manage respiratory failure from opioid-induced respiratory depression — BVM ventilation, oxygen therapy, and monitoring for aspiration pneumonitis. They manage post-overdose ventilatory support.",
        lessonSlugs: ["airway-management-rrt", "oxygen-delivery-systems-rrt", "abg-interpretation-rrt"],
        practiceQuestionTopics: ["BVM technique", "aspiration risk", "hypoventilation ABG"],
        flashcardTopics: ["respiratory depression ABG", "aspiration management", "ventilation support"]
      }
    ]
  },
  {
    conditionSlug: "preeclampsia",
    conditionName: "Preeclampsia / Eclampsia",
    perspectives: [
      {
        profession: "Registered Nurse (RN)",
        professionSlug: "rn",
        approach: "RNs monitor blood pressure, assess for HELLP syndrome, administer magnesium sulfate for seizure prophylaxis, manage IV labetalol or hydralazine for severe hypertension, and monitor fetal status.",
        lessonSlugs: ["preeclampsia-management", "gestational-diabetes-rn", "postpartum-hemorrhage-rn"],
        practiceQuestionTopics: ["magnesium sulfate protocol", "HELLP syndrome criteria", "eclamptic seizure management"],
        flashcardTopics: ["preeclampsia criteria", "magnesium toxicity signs", "antidote for magnesium"]
      },
      {
        profession: "Paramedic",
        professionSlug: "paramedic",
        approach: "Paramedics manage eclamptic seizures in the field with magnesium sulfate, position the patient in left lateral decubitus, manage airway during seizures, and transport to facilities with OB capability.",
        lessonSlugs: ["ob-emergencies-paramedic", "pharmacology-field-drugs-paramedic"],
        practiceQuestionTopics: ["eclampsia field management", "magnesium administration", "OB transport criteria"],
        flashcardTopics: ["eclampsia vs seizure disorder", "left lateral position rationale", "magnesium dose"]
      },
      {
        profession: "Medical Laboratory Technologist (MLT)",
        professionSlug: "mlt",
        approach: "MLTs perform liver function tests (AST, ALT), platelet counts, peripheral smear for hemolysis (schistocytes), LDH, urine protein quantification, and magnesium levels for monitoring toxicity.",
        lessonSlugs: ["clinical-chemistry-mlt", "hematology-fundamentals-mlt", "urinalysis-body-fluids-mlt"],
        practiceQuestionTopics: ["HELLP labs", "proteinuria quantification", "magnesium monitoring"],
        flashcardTopics: ["HELLP diagnostic criteria", "LDH in hemolysis", "24-hour urine protein"]
      }
    ]
  },
  {
    conditionSlug: "pediatric-respiratory-emergencies",
    conditionName: "Pediatric Respiratory Emergencies",
    perspectives: [
      {
        profession: "Registered Nurse (RN)",
        professionSlug: "rn",
        approach: "RNs assess for respiratory distress vs failure in children, administer racemic epinephrine for croup, bronchodilators for asthma, monitor for decompensation, and manage oxygen delivery appropriate for age.",
        lessonSlugs: ["respiratory-assessment", "anaphylaxis"],
        practiceQuestionTopics: ["croup vs epiglottitis", "pediatric respiratory assessment", "weight-based dosing"],
        flashcardTopics: ["stridor vs wheezing", "Westley croup score", "pediatric vital sign normals"]
      },
      {
        profession: "Paramedic",
        professionSlug: "paramedic",
        approach: "Paramedics manage pediatric airway emergencies — croup, epiglottitis, foreign body aspiration, severe asthma. They use blow-by oxygen, nebulized medications, and prepare for pediatric advanced airways.",
        lessonSlugs: ["pediatric-emergencies-paramedic", "airway-emergencies-paramedic"],
        practiceQuestionTopics: ["pediatric airway anatomy", "croup field management", "foreign body aspiration"],
        flashcardTopics: ["pediatric ETT sizing", "blow-by oxygen", "back blows and chest thrusts"]
      },
      {
        profession: "Respiratory Therapist (RRT)",
        professionSlug: "rrt",
        approach: "RRTs provide specialized pediatric respiratory care — age-appropriate oxygen delivery, racemic epinephrine for croup, continuous albuterol for severe asthma, and pediatric mechanical ventilation with appropriate tidal volumes.",
        lessonSlugs: ["oxygen-delivery-systems-rrt", "airway-management-rrt", "mechanical-ventilation-modes-rrt"],
        practiceQuestionTopics: ["pediatric oxygen devices", "racemic epinephrine dosing", "pediatric ventilator settings"],
        flashcardTopics: ["pediatric tidal volume", "oxyhood for neonates", "croup score assessment"]
      }
    ]
  },
  {
    conditionSlug: "blood-transfusion-reactions",
    conditionName: "Blood Transfusion Reactions",
    perspectives: [
      {
        profession: "Registered Nurse (RN)",
        professionSlug: "rn",
        approach: "RNs monitor vital signs during transfusion, recognize reaction types (hemolytic, febrile, allergic, TRALI), stop the transfusion immediately, maintain IV access with NS, and notify the blood bank.",
        lessonSlugs: ["blood-transfusion-rn", "anaphylaxis", "shock-types-recognition-rpn"],
        practiceQuestionTopics: ["transfusion reaction types", "nursing response protocol", "TRALI recognition"],
        flashcardTopics: ["acute hemolytic reaction signs", "febrile vs allergic reaction", "TRALI criteria"]
      },
      {
        profession: "Medical Laboratory Technologist (MLT)",
        professionSlug: "mlt",
        approach: "MLTs investigate transfusion reactions — performing DAT (Coombs test), repeating ABO/Rh typing, visual plasma hemolysis check, haptoglobin and bilirubin levels, and tracking the clerical chain for identification errors.",
        lessonSlugs: ["blood-typing-crossmatching-mlt", "hematology-fundamentals-mlt", "critical-value-reporting-mlt"],
        practiceQuestionTopics: ["transfusion reaction workup", "DAT interpretation", "clerical error investigation"],
        flashcardTopics: ["DAT positive causes", "hemolysis markers", "ABO verification protocol"]
      },
      {
        profession: "Respiratory Therapist (RRT)",
        professionSlug: "rrt",
        approach: "RRTs manage TRALI — transfusion-related acute lung injury that presents like ARDS within 6 hours of transfusion. They provide respiratory support, mechanical ventilation, and differentiate TRALI from TACO (volume overload).",
        lessonSlugs: ["ards-respiratory-failure-rrt", "oxygen-delivery-systems-rrt", "mechanical-ventilation-modes-rrt"],
        practiceQuestionTopics: ["TRALI management", "TRALI vs TACO", "respiratory support in reactions"],
        flashcardTopics: ["TRALI criteria", "TACO vs TRALI", "BNP in differentiation"]
      }
    ]
  },
  {
    conditionSlug: "spinal-cord-injury",
    conditionName: "Spinal Cord Injury",
    perspectives: [
      {
        profession: "Registered Nurse (RN)",
        professionSlug: "rn",
        approach: "RNs manage neurogenic shock, autonomic dysreflexia, bladder/bowel programs, skin integrity assessment, DVT prophylaxis, and psychological support for spinal cord injury patients.",
        lessonSlugs: ["shock-types-recognition-rpn", "catheterization", "dvt-pe"],
        practiceQuestionTopics: ["neurogenic shock management", "autonomic dysreflexia", "spinal cord injury levels"],
        flashcardTopics: ["neurogenic vs spinal shock", "AD triggers and treatment", "dermatome levels"]
      },
      {
        profession: "Paramedic",
        professionSlug: "paramedic",
        approach: "Paramedics provide spinal immobilization, manage neurogenic shock with fluids and vasopressors, assess neurological level in the field, and transport to trauma centers with spine surgery capability.",
        lessonSlugs: ["trauma-algorithm-paramedic", "field-triage-paramedic"],
        practiceQuestionTopics: ["spinal immobilization techniques", "neurogenic shock recognition", "field neuro assessment"],
        flashcardTopics: ["C-spine clearance criteria", "neurogenic shock triad", "log roll technique"]
      },
      {
        profession: "Respiratory Therapist (RRT)",
        professionSlug: "rrt",
        approach: "RRTs manage respiratory failure in high cervical SCI — C3-C5 innervate the diaphragm. They provide mechanical ventilation, manage weaning protocols, and assess respiratory muscle strength for ventilator liberation.",
        lessonSlugs: ["mechanical-ventilation-modes-rrt", "airway-management-rrt", "gas-exchange-physiology-rrt"],
        practiceQuestionTopics: ["SCI respiratory levels", "ventilator weaning in SCI", "diaphragm innervation"],
        flashcardTopics: ["C3-C5 keeps you alive", "NIF measurement", "progressive ventilator weaning"]
      }
    ]
  }
];

export function getCrossProfessionByConditionSlug(slug: string): CrossProfessionCondition | undefined {
  return crossProfessionConditions.find(c => c.conditionSlug === slug);
}

export function getConditionSlugsForLesson(lessonSlug: string): string[] {
  const conditionSlugs: string[] = [];
  for (const condition of crossProfessionConditions) {
    for (const perspective of condition.perspectives) {
      if (perspective.lessonSlugs.includes(lessonSlug)) {
        if (!conditionSlugs.includes(condition.conditionSlug)) {
          conditionSlugs.push(condition.conditionSlug);
        }
      }
    }
  }
  return conditionSlugs;
}

export function getAllCrossProfessionConditionSlugs(): string[] {
  return crossProfessionConditions.map(c => c.conditionSlug);
}
