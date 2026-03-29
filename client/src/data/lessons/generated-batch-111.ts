import type { LessonContent } from "./types";

export const generatedBatch111Lessons: Record<string, LessonContent> = {
  "hospital-acquired-infections": {
    title: "Hospital-Acquired Infections (HAIs)",
    cellular: {
      title: "Pathophysiology of HAIs",
      content: "Hospital-acquired infections develop 48+ hours after admission and are not present or incubating at the time of hospitalization. Common organisms include MRSA, VRE, C. difficile, and Pseudomonas aeruginosa. These pathogens exploit compromised host defenses in the hospital environment.\n\nTransmission occurs via contact (direct/indirect), droplet, or airborne routes. Biofilm formation on medical devices creates reservoirs resistant to antibiotics and host immunity. Risk increases with invasive devices, immunosuppression, prolonged hospitalization, and broad-spectrum antibiotic use.\n\nPrevention strategies focus on breaking the chain of infection through hand hygiene compliance, environmental cleaning, antimicrobial stewardship, and device management bundles."
    },
    riskFactors: [
      "Prolonged hospitalization >72 hours",
      "Invasive devices (central lines, Foley catheters, ventilators)",
      "Immunosuppression or chronic illness",
      "Broad-spectrum antibiotic exposure"
    ],
    diagnostics: [
      "Blood cultures, urine cultures, wound cultures",
      "CBC with differential showing leukocytosis",
      "Procalcitonin and CRP for infection markers"
    ],
    management: [
      "Targeted antibiotic therapy based on culture sensitivity",
      "Remove or replace colonized invasive devices",
      "Implement contact precautions for resistant organisms"
    ],
    nursingActions: [
      "Perform hand hygiene before and after patient contact",
      "Monitor for signs of infection: fever, WBC elevation, purulent drainage",
      "Ensure compliance with device insertion and maintenance bundles"
    ],
    signs: {
      left: ["Fever >38.3°C (101°F)", "Elevated WBC >12,000", "Purulent drainage from wound or device site"],
      right: ["Positive blood or site cultures", "Elevated procalcitonin >0.5 ng/mL", "New infiltrate on chest X-ray (pneumonia)"]
    },
    medications: [{
      name: "Vancomycin",
      type: "Glycopeptide antibiotic",
      action: "Inhibits bacterial cell wall synthesis by binding D-ala-D-ala",
      sideEffects: "Red man syndrome, nephrotoxicity, ototoxicity",
      contra: "Known hypersensitivity; monitor trough levels",
      pearl: "Infuse over 60+ minutes to prevent red man syndrome; target trough 15-20 mcg/mL for serious infections"
    }],
    pearls: [
      "Hand hygiene is the single most effective measure to prevent HAIs",
      "C. difficile requires soap and water — alcohol-based sanitizers are ineffective against spores",
      "Bundle compliance (central line, ventilator, catheter) reduces HAI rates by 50-70%"
    ],
    quiz: [
      {
        question: "Which intervention is MOST effective in preventing hospital-acquired infections?",
        options: ["Prophylactic antibiotics for all patients", "Hand hygiene compliance", "Routine blood cultures on admission", "Restricting visitor access"],
        correct: 1,
        rationale: "Hand hygiene before and after patient contact is the single most effective intervention to prevent transmission of healthcare-associated pathogens."
      },
      {
        question: "A patient develops diarrhea after 10 days of broad-spectrum antibiotics. What is the priority nursing action?",
        options: ["Administer loperamide", "Place patient on contact precautions and test for C. difficile", "Increase IV fluid rate", "Obtain a surgical consult"],
        correct: 1,
        rationale: "Antibiotic-associated diarrhea raises suspicion for C. difficile. Contact precautions and stool testing are the priority. Loperamide is contraindicated as it can worsen toxin retention."
      }
    ]
  },

  "central-line-infection-prevention": {
    title: "Central Line-Associated Bloodstream Infection",
    cellular: {
      title: "CLABSI Pathophysiology",
      content: "Central line-associated bloodstream infections occur when microorganisms colonize the catheter tip or hub and enter the bloodstream. Organisms migrate along the external surface from the insertion site or intraluminally through the hub during manipulation.\n\nBiofilm formation on the catheter surface provides a protective environment for bacteria, making them resistant to antibiotics and immune defenses. Common organisms include coagulase-negative staphylococci, S. aureus, enterococci, and Candida species.\n\nThe CLABSI bundle—evidence-based interventions applied together—has dramatically reduced infection rates. Each element of the bundle addresses a specific point in the infection pathway."
    },
    riskFactors: [
      "Femoral insertion site (highest infection risk)",
      "Prolonged catheter dwell time >7 days",
      "Frequent line manipulation without aseptic technique",
      "Immunocompromised status or TPN administration"
    ],
    diagnostics: [
      "Paired blood cultures (one from line, one peripheral)",
      "Differential time to positivity (line culture positive ≥2 hours before peripheral)",
      "CBC, lactate, procalcitonin for sepsis evaluation"
    ],
    management: [
      "Remove catheter if CLABSI confirmed and clinically feasible",
      "Targeted antibiotic therapy based on culture results",
      "Antibiotic lock therapy if catheter salvage is attempted"
    ],
    nursingActions: [
      "Perform daily assessment of line necessity—advocate for removal when no longer needed",
      "Use maximal sterile barriers during insertion",
      "Scrub the hub for 15 seconds before each access"
    ],
    signs: {
      left: ["Fever and chills during or after line use", "Erythema or purulence at insertion site", "Hemodynamic instability without other source"],
      right: ["Positive blood cultures from central line", "Elevated WBC and procalcitonin", "Signs of sepsis: tachycardia, hypotension"]
    },
    medications: [{
      name: "Chlorhexidine gluconate (CHG)",
      type: "Antiseptic agent",
      action: "Disrupts bacterial cell membranes; provides residual antimicrobial activity",
      sideEffects: "Skin irritation, rare allergic reactions",
      contra: "Known CHG allergy; use povidone-iodine as alternative",
      pearl: "CHG-impregnated dressings and daily CHG bathing reduce CLABSI rates significantly"
    }],
    pearls: [
      "The CLABSI bundle: hand hygiene, maximal barriers, CHG skin prep, optimal site selection (subclavian preferred), daily line necessity review",
      "Scrub the hub for 15 seconds with alcohol and allow to dry before accessing",
      "Femoral lines carry the highest infection risk; subclavian lines have the lowest"
    ],
    quiz: [
      {
        question: "Which central line insertion site has the LOWEST infection risk?",
        options: ["Femoral vein", "Internal jugular vein", "Subclavian vein", "Peripheral IV converted to midline"],
        correct: 2,
        rationale: "The subclavian vein has the lowest CLABSI rate due to lower bacterial colonization at the insertion site compared to femoral or jugular sites."
      },
      {
        question: "A nurse is accessing a central line port. What is the correct technique?",
        options: ["Wipe hub once quickly with alcohol", "Scrub the hub vigorously for 15 seconds and allow to dry", "Flush the line without cleaning the hub", "Use clean gloves only"],
        correct: 1,
        rationale: "Scrubbing the hub for at least 15 seconds with 70% alcohol and allowing it to dry reduces intraluminal contamination, which is the primary route of CLABSI in long-dwelling catheters."
      }
    ]
  },

  "catheter-associated-uti": {
    title: "Catheter-Associated Urinary Tract Infection",
    cellular: {
      title: "CAUTI Pathophysiology",
      content: "Catheter-associated UTIs occur when bacteria ascend along the external surface of the indwelling catheter or migrate intraluminally through the drainage system. Biofilm develops on the catheter surface within 24 hours of insertion, providing a nidus for bacterial colonization.\n\nCommon causative organisms include E. coli, Klebsiella, Enterococcus, Pseudomonas, and Candida. The presence of the catheter bypasses natural urinary defense mechanisms including urethral flora, bladder mucus, and the washout effect of voiding.\n\nCAUTI risk increases approximately 3-7% per day the catheter remains in place. Prevention centers on avoiding unnecessary catheterization, early removal, and maintaining a closed drainage system."
    },
    riskFactors: [
      "Prolonged catheterization >2 days",
      "Female sex (shorter urethra)",
      "Diabetes mellitus or immunosuppression",
      "Break in closed drainage system"
    ],
    diagnostics: [
      "Urinalysis showing pyuria (>10 WBC/hpf) and bacteriuria",
      "Urine culture with ≥10³ CFU/mL from catheter specimen",
      "CBC and blood cultures if systemic infection suspected"
    ],
    management: [
      "Remove or replace catheter before starting antibiotics",
      "Targeted antibiotic therapy based on urine culture sensitivity",
      "Consider alternatives: intermittent catheterization, condom catheter, bladder scanner"
    ],
    nursingActions: [
      "Assess daily for continued catheter necessity and advocate for removal",
      "Maintain closed drainage system; keep bag below bladder level",
      "Perform perineal hygiene and secure catheter to prevent traction"
    ],
    signs: {
      left: ["New-onset fever in catheterized patient", "Cloudy or foul-smelling urine", "Suprapubic tenderness or flank pain"],
      right: ["Pyuria on urinalysis", "Positive urine culture ≥10³ CFU/mL", "Elevated WBC if systemic spread"]
    },
    medications: [{
      name: "Ciprofloxacin",
      type: "Fluoroquinolone antibiotic",
      action: "Inhibits bacterial DNA gyrase and topoisomerase IV",
      sideEffects: "Tendon rupture, QT prolongation, C. difficile risk, photosensitivity",
      contra: "Myasthenia gravis; concurrent use with tizanidine; children <18 (relative)",
      pearl: "Reserve fluoroquinolones for complicated UTIs; do not use empirically for simple CAUTI due to resistance concerns"
    }],
    pearls: [
      "The #1 intervention to prevent CAUTI is to avoid unnecessary catheterization",
      "Never disconnect the catheter from the drainage bag — maintain a closed system",
      "Nurse-driven catheter removal protocols reduce CAUTI rates by 50%+"
    ],
    quiz: [
      {
        question: "Which nursing intervention is MOST important in preventing CAUTI?",
        options: ["Routine catheter irrigation", "Daily assessment of catheter necessity", "Prophylactic antibiotic administration", "Changing the catheter every 48 hours"],
        correct: 1,
        rationale: "Daily assessment of continued catheter need with prompt removal when no longer indicated is the most effective CAUTI prevention strategy."
      },
      {
        question: "A catheterized patient develops fever and cloudy urine. What should the nurse do FIRST?",
        options: ["Irrigate the catheter", "Obtain a urine specimen for culture and notify the provider", "Increase IV fluids", "Administer antipyretics"],
        correct: 1,
        rationale: "Obtaining a urine culture before starting antibiotics ensures appropriate therapy. The provider should be notified to evaluate for CAUTI and consider catheter removal."
      }
    ]
  },

  "antibiotic-stewardship-principles": {
    title: "Antibiotic Stewardship Principles",
    cellular: {
      title: "Antimicrobial Resistance Mechanisms",
      content: "Antibiotic stewardship is the systematic effort to optimize antimicrobial use—selecting the right drug, dose, duration, and route—to improve patient outcomes while minimizing resistance development. Bacteria develop resistance through mutation, horizontal gene transfer (plasmids, transposons), and selective pressure from antibiotic exposure.\n\nResistance mechanisms include enzymatic degradation (beta-lactamases), target site modification (altered penicillin-binding proteins in MRSA), efflux pumps, and reduced permeability. Multi-drug resistant organisms (MDROs) including MRSA, VRE, ESBL-producing gram-negatives, and CRE pose significant treatment challenges.\n\nStewardship programs reduce adverse drug events, C. difficile infections, antimicrobial resistance, and healthcare costs while improving clinical outcomes."
    },
    riskFactors: [
      "Unnecessary or prolonged antibiotic courses",
      "Empiric broad-spectrum therapy without de-escalation",
      "Prior antibiotic exposure within 90 days",
      "Lack of culture-guided therapy"
    ],
    diagnostics: [
      "Blood cultures before first antibiotic dose (×2 sets from different sites)",
      "Site-specific cultures (sputum, urine, wound) with sensitivity testing",
      "Procalcitonin to guide antibiotic duration in respiratory infections"
    ],
    management: [
      "De-escalate from broad-spectrum to narrow-spectrum based on culture results",
      "Use shortest effective duration (many infections need only 5-7 days)",
      "IV-to-oral switch when clinically appropriate"
    ],
    nursingActions: [
      "Obtain cultures BEFORE administering first dose of antibiotics",
      "Monitor and report antibiotic trough/peak levels when ordered",
      "Educate patients on completing prescribed course and not sharing antibiotics"
    ],
    signs: {
      left: ["Clinical improvement: defervescence, decreasing WBC", "Negative repeat cultures", "Resolution of infection signs"],
      right: ["Treatment failure: persistent fever, worsening labs", "New resistance patterns on repeat cultures", "Development of C. difficile (antibiotic side effect)"]
    },
    medications: [{
      name: "Piperacillin-Tazobactam (Zosyn)",
      type: "Extended-spectrum penicillin + beta-lactamase inhibitor",
      action: "Inhibits cell wall synthesis; tazobactam inhibits beta-lactamase enzymes",
      sideEffects: "Diarrhea, rash, thrombocytopenia, hypokalemia",
      contra: "Penicillin allergy (cross-reactivity risk); dose adjust for renal impairment",
      pearl: "Common empiric broad-spectrum agent — always de-escalate once culture results are available"
    }],
    pearls: [
      "Cultures BEFORE antibiotics — once antibiotics are given, cultures may be falsely negative",
      "Procalcitonin-guided therapy can safely reduce antibiotic duration in sepsis and pneumonia",
      "De-escalation is NOT inferior care — it is evidence-based best practice"
    ],
    quiz: [
      {
        question: "A patient's blood cultures show MSSA. The patient is on vancomycin. What should the nurse anticipate?",
        options: ["Continue vancomycin as ordered", "De-escalation to nafcillin or cefazolin", "Add a second antibiotic for synergy", "Switch to oral amoxicillin immediately"],
        correct: 1,
        rationale: "MSSA (methicillin-sensitive S. aureus) is best treated with nafcillin or cefazolin, which are more effective than vancomycin for susceptible organisms. De-escalation is a stewardship priority."
      },
      {
        question: "When is the BEST time to obtain blood cultures?",
        options: ["After the first antibiotic dose", "Before initiating antibiotic therapy", "24 hours after admission", "Only when the patient spikes a fever"],
        correct: 1,
        rationale: "Blood cultures should be drawn before the first dose of antibiotics to maximize the chance of identifying the causative organism and guiding targeted therapy."
      }
    ]
  },

  "isolation-precautions-advanced": {
    title: "Isolation Precautions: Advanced Concepts",
    cellular: {
      title: "Transmission-Based Precautions",
      content: "Standard precautions apply to ALL patients regardless of diagnosis and include hand hygiene, PPE based on anticipated exposure, respiratory hygiene, safe injection practices, and sterile technique for invasive procedures. Transmission-based precautions are added when standard precautions alone are insufficient.\n\nContact precautions (gown and gloves) are used for MRSA, VRE, C. difficile, scabies, and wound infections with resistant organisms. Droplet precautions (surgical mask within 3 feet) apply to influenza, pertussis, meningococcal disease, and mumps. Airborne precautions (N95 respirator, negative pressure room) are required for TB, measles, varicella, and disseminated herpes zoster.\n\nProper donning and doffing sequences are critical — most contamination occurs during PPE removal. Gloves are removed first, followed by gown, then hand hygiene, and finally mask/respirator removal outside the room."
    },
    riskFactors: [
      "Undiagnosed infectious disease in symptomatic patients",
      "Immunocompromised patients requiring protective isolation",
      "Multi-drug resistant organism colonization or infection",
      "Aerosolizing procedures (intubation, bronchoscopy, suctioning)"
    ],
    diagnostics: [
      "Rapid PCR testing for respiratory viruses (influenza, COVID-19, RSV)",
      "AFB smear and culture for tuberculosis",
      "Nasal swab for MRSA screening on admission"
    ],
    management: [
      "Implement appropriate transmission-based precautions immediately on suspicion",
      "Place airborne precaution patients in negative pressure rooms",
      "Cohort patients with same organism when private rooms unavailable"
    ],
    nursingActions: [
      "Verify correct PPE donning/doffing sequence; self-monitor for breaks in technique",
      "Educate patients and visitors on isolation requirements and hand hygiene",
      "Ensure N95 fit testing is current before caring for airborne precaution patients"
    ],
    signs: {
      left: ["Productive cough with hemoptysis (suspect TB)", "Vesicular rash (varicella/herpes zoster)", "Profuse watery diarrhea (C. difficile)"],
      right: ["Positive AFB smear (TB confirmed)", "Positive MRSA nares swab", "Positive C. difficile toxin assay"]
    },
    medications: [{
      name: "Oseltamivir (Tamiflu)",
      type: "Neuraminidase inhibitor (antiviral)",
      action: "Blocks viral neuraminidase, preventing release of new viral particles",
      sideEffects: "Nausea, vomiting, headache, rare neuropsychiatric events",
      contra: "Severe renal impairment requires dose adjustment",
      pearl: "Most effective when started within 48 hours of symptom onset; droplet precautions for influenza patients"
    }],
    pearls: [
      "Airborne = private room, negative pressure, N95: TB, measles, varicella (\"MTV\")",
      "Droplet = surgical mask within 3 feet; can cohort patients with same organism",
      "C. difficile requires SOAP and WATER — alcohol gel does NOT kill spores"
    ],
    quiz: [
      {
        question: "A patient is admitted with suspected active tuberculosis. Which precaution is required?",
        options: ["Contact precautions with gown and gloves", "Droplet precautions with surgical mask", "Airborne precautions with N95 in negative pressure room", "Standard precautions only"],
        correct: 2,
        rationale: "TB is transmitted via airborne nuclei (<5 microns) that remain suspended in air. Airborne precautions require an N95 respirator and negative pressure room."
      },
      {
        question: "During PPE removal (doffing), which item should be removed FIRST?",
        options: ["N95 respirator", "Face shield", "Gloves", "Gown"],
        correct: 2,
        rationale: "Gloves are the most contaminated PPE item and should be removed first, followed by gown, hand hygiene, then face shield/mask removal outside the room."
      }
    ]
  },

  "chest-pain-differential": {
    title: "Chest Pain Differential Diagnosis",
    cellular: {
      title: "Mechanisms of Chest Pain",
      content: "Chest pain can originate from cardiac, pulmonary, gastrointestinal, musculoskeletal, or psychogenic sources. Cardiac chest pain typically results from myocardial ischemia due to coronary artery obstruction, causing anaerobic metabolism and lactic acid accumulation that stimulates pain fibers.\n\nLife-threatening causes that must be rapidly excluded include acute coronary syndrome (ACS), pulmonary embolism, aortic dissection, tension pneumothorax, and cardiac tamponade. Each has distinct presentations but may overlap, making systematic evaluation essential.\n\nNon-cardiac causes include GERD (burning, postprandial), musculoskeletal (reproducible with palpation), pleuritis (sharp, worse with breathing), and anxiety (associated with hyperventilation). History, ECG, troponin, and imaging guide the differential."
    },
    riskFactors: [
      "Coronary artery disease risk factors: HTN, DM, hyperlipidemia, smoking",
      "History of DVT or immobility (PE risk)",
      "Marfan syndrome or uncontrolled hypertension (dissection risk)",
      "Recent trauma or instrumentation"
    ],
    diagnostics: [
      "12-lead ECG within 10 minutes of presentation",
      "Serial troponin levels (0 and 3-6 hours)",
      "Chest X-ray, CT angiography if PE or dissection suspected"
    ],
    management: [
      "ACS: aspirin, nitroglycerin, morphine, oxygen (if SpO2 <94%), heparin",
      "PE: anticoagulation with heparin; thrombolytics if massive PE",
      "Aortic dissection: IV beta-blockers to lower HR and BP; surgical consult"
    ],
    nursingActions: [
      "Obtain 12-lead ECG immediately and notify provider of ST changes",
      "Establish IV access and draw troponin, CBC, BMP, coagulation studies",
      "Assess pain using PQRST mnemonic; monitor vital signs continuously"
    ],
    signs: {
      left: ["Substernal pressure radiating to jaw/left arm (ACS)", "Sudden pleuritic chest pain with dyspnea (PE)", "Tearing pain radiating to back (aortic dissection)"],
      right: ["ST elevation on ECG (STEMI)", "Elevated D-dimer (PE screening)", "Widened mediastinum on CXR (dissection)"]
    },
    medications: [{
      name: "Nitroglycerin",
      type: "Nitrate vasodilator",
      action: "Relaxes vascular smooth muscle, reducing preload and myocardial oxygen demand",
      sideEffects: "Hypotension, headache, reflex tachycardia",
      contra: "Systolic BP <90 mmHg; use of PDE5 inhibitors (sildenafil) within 24-48 hours; right ventricular infarction",
      pearl: "Give sublingual q5min ×3 doses; hold if SBP <90 or patient took erectile dysfunction medication"
    }],
    pearls: [
      "Always consider the 5 life-threatening causes: ACS, PE, aortic dissection, tension pneumothorax, cardiac tamponade",
      "Aortic dissection is a contraindication for thrombolytics — must rule out before treating suspected STEMI",
      "Women and diabetics may present atypically: fatigue, nausea, dyspnea without classic chest pain"
    ],
    quiz: [
      {
        question: "A patient presents with sudden tearing chest pain radiating to the back and unequal arm blood pressures. What do you suspect?",
        options: ["Acute myocardial infarction", "Pulmonary embolism", "Aortic dissection", "Pericarditis"],
        correct: 2,
        rationale: "Tearing chest pain radiating to the back with blood pressure differential between arms is classic for aortic dissection. This is a surgical emergency."
      },
      {
        question: "Which diagnostic test should be obtained within 10 minutes of a chest pain presentation?",
        options: ["CT angiography", "Troponin level", "12-lead ECG", "Echocardiogram"],
        correct: 2,
        rationale: "A 12-lead ECG should be obtained within 10 minutes to identify ST changes suggestive of STEMI, which requires immediate intervention."
      }
    ]
  },

  "shortness-of-breath-differential": {
    title: "Shortness of Breath: Differential Diagnosis",
    cellular: {
      title: "Mechanisms of Dyspnea",
      content: "Dyspnea results from a mismatch between ventilatory demand and the body's ability to meet it. Mechanisms include increased airway resistance (asthma, COPD), impaired gas exchange (pneumonia, pulmonary edema), reduced lung compliance (fibrosis, pleural effusion), and neuromuscular weakness.\n\nAcute dyspnea requires rapid assessment for life-threatening causes: pulmonary embolism, tension pneumothorax, acute pulmonary edema, anaphylaxis, and airway obstruction. Chronic dyspnea is more commonly associated with heart failure, COPD, interstitial lung disease, and deconditioning.\n\nThe assessment should include onset (sudden vs gradual), associated symptoms (orthopnea, PND, wheezing, chest pain), oxygen saturation, respiratory pattern, and lung auscultation to narrow the differential."
    },
    riskFactors: [
      "Heart failure or valvular disease",
      "COPD, asthma, or interstitial lung disease",
      "Immobility or recent surgery (PE risk)",
      "Obesity or neuromuscular disorders"
    ],
    diagnostics: [
      "Chest X-ray for pulmonary edema, pneumothorax, or infiltrates",
      "ABG for oxygenation and ventilation status",
      "BNP/NT-proBNP to differentiate cardiac vs pulmonary cause"
    ],
    management: [
      "Supplemental oxygen to maintain SpO2 ≥94% (88-92% in COPD)",
      "Diuretics (furosemide) for pulmonary edema; bronchodilators for bronchospasm",
      "CPAP/BiPAP for acute respiratory distress; intubation if failing"
    ],
    nursingActions: [
      "Position upright (high Fowler's) to maximize lung expansion",
      "Apply oxygen and monitor SpO2 continuously",
      "Assess breath sounds, work of breathing, and respiratory rate frequently"
    ],
    signs: {
      left: ["Orthopnea and paroxysmal nocturnal dyspnea (HF)", "Wheezing with prolonged expiratory phase (asthma/COPD)", "Absent breath sounds on one side (pneumothorax)"],
      right: ["Elevated BNP >400 pg/mL (heart failure)", "ABG showing hypoxemia and hypercapnia", "CXR showing bilateral infiltrates or effusion"]
    },
    medications: [{
      name: "Furosemide (Lasix)",
      type: "Loop diuretic",
      action: "Inhibits Na-K-2Cl cotransporter in loop of Henle, promoting diuresis",
      sideEffects: "Hypokalemia, hypotension, ototoxicity, dehydration",
      contra: "Anuria, severe hypovolemia, electrolyte depletion",
      pearl: "IV onset in 5 minutes — monitor urine output, potassium, and daily weights"
    }],
    pearls: [
      "BNP >400 pg/mL strongly suggests heart failure as the cause of dyspnea",
      "Sudden-onset dyspnea with clear lungs and hypoxemia: think pulmonary embolism",
      "Tripod positioning, accessory muscle use, and inability to speak in full sentences indicate severe respiratory distress"
    ],
    quiz: [
      {
        question: "A patient with sudden dyspnea has clear lung sounds bilaterally but SpO2 of 85%. What should the nurse suspect?",
        options: ["Pneumonia", "Heart failure", "Pulmonary embolism", "Asthma exacerbation"],
        correct: 2,
        rationale: "Sudden-onset hypoxemia with clear lungs is a hallmark of pulmonary embolism. PE causes V/Q mismatch without parenchymal disease, so lungs are often clear on auscultation."
      },
      {
        question: "A COPD patient is dyspneic. What is the target oxygen saturation?",
        options: ["100%", "98-100%", "94-98%", "88-92%"],
        correct: 3,
        rationale: "In COPD patients, the hypoxic drive may be the primary respiratory stimulus. Targeting SpO2 88-92% prevents suppression of respiratory drive from excessive oxygen."
      }
    ]
  },

  "altered-mental-status-differential": {
    title: "Altered Mental Status: Differential Diagnosis",
    cellular: {
      title: "Mechanisms of Altered Consciousness",
      content: "Altered mental status (AMS) results from disruption of the reticular activating system (RAS) in the brainstem or bilateral cerebral cortex dysfunction. Causes span metabolic, structural, infectious, toxicologic, and psychiatric categories.\n\nThe mnemonic AEIOU-TIPS helps organize the differential: Alcohol/Acidosis, Epilepsy/Encephalopathy, Insulin (hypo/hyperglycemia), Opiates/Overdose, Uremia, Trauma, Infection, Psychiatric, Stroke/Shock. Hypoglycemia is the most rapidly reversible and dangerous cause.\n\nSystematic assessment includes glucose check (immediate), vital signs, pupil exam, neurological assessment, and targeted labs. Glasgow Coma Scale (GCS) provides standardized severity grading."
    },
    riskFactors: [
      "Diabetes mellitus (hypo/hyperglycemia)",
      "Substance abuse or polypharmacy (especially elderly)",
      "History of stroke, seizures, or CNS disease",
      "Hepatic or renal failure (metabolic encephalopathy)"
    ],
    diagnostics: [
      "Point-of-care glucose (STAT — most urgent test)",
      "CT head without contrast to rule out stroke or hemorrhage",
      "BMP (electrolytes, glucose, renal function), ammonia, toxicology screen"
    ],
    management: [
      "Correct hypoglycemia immediately with D50 IV or glucagon IM",
      "Naloxone for suspected opioid overdose (titrate to respiratory effort)",
      "Treat underlying cause: antibiotics for meningitis, anticonvulsants for seizures"
    ],
    nursingActions: [
      "Check blood glucose FIRST in any patient with altered mental status",
      "Assess and protect airway — position lateral if no spinal injury suspected",
      "Perform and document neurological assessment including GCS every 15-30 minutes"
    ],
    signs: {
      left: ["Pinpoint pupils (opioid toxicity)", "Unilateral weakness or facial droop (stroke)", "Fruity breath odor (DKA)"],
      right: ["Blood glucose <70 mg/dL or >400 mg/dL", "CT showing hemorrhage or mass lesion", "Elevated ammonia (hepatic encephalopathy)"]
    },
    medications: [{
      name: "Dextrose 50% (D50W)",
      type: "Hypertonic glucose solution",
      action: "Rapidly restores blood glucose levels in hypoglycemia",
      sideEffects: "Hyperglycemia, phlebitis at IV site, tissue necrosis if infiltrated",
      contra: "Hyperglycemia; ensure IV patency before administration",
      pearl: "Always check glucose before giving D50; give thiamine before dextrose in suspected alcoholism to prevent Wernicke encephalopathy"
    }],
    pearls: [
      "Check glucose FIRST — hypoglycemia is the fastest reversible cause of AMS",
      "Give thiamine BEFORE dextrose in malnourished or alcoholic patients to prevent Wernicke encephalopathy",
      "New-onset confusion in elderly: always consider UTI, medications, and dehydration"
    ],
    quiz: [
      {
        question: "A patient is found unresponsive. What is the FIRST assessment the nurse should perform after confirming airway patency?",
        options: ["CT scan of the head", "Check blood glucose", "Toxicology screen", "Lumbar puncture"],
        correct: 1,
        rationale: "Blood glucose is the most rapidly reversible cause of altered mental status. Point-of-care glucose testing should be performed immediately."
      },
      {
        question: "An unresponsive patient has pinpoint pupils and respiratory rate of 6. What medication should be administered?",
        options: ["Flumazenil", "Naloxone", "Dextrose 50%", "Epinephrine"],
        correct: 1,
        rationale: "Pinpoint pupils and respiratory depression are classic signs of opioid toxicity. Naloxone is the opioid antagonist; titrate to respiratory effort, not full consciousness."
      }
    ]
  },

  "fever-workup-sepsis": {
    title: "Fever Workup and Sepsis Recognition",
    cellular: {
      title: "Fever and the Sepsis Cascade",
      content: "Fever is mediated by pyrogens (IL-1, IL-6, TNF-alpha) acting on the hypothalamic thermoregulatory center, raising the set point. While fever is a protective immune response, it may indicate serious infection requiring systematic evaluation.\n\nSepsis is a life-threatening organ dysfunction caused by a dysregulated host response to infection. The sepsis cascade involves pathogen recognition, massive cytokine release, endothelial dysfunction, microvascular thrombosis, and progressive organ failure. Early recognition and treatment within the first hour dramatically improve survival.\n\nThe Sepsis-3 criteria define sepsis as suspected infection plus ≥2 SOFA score points. qSOFA (quick SOFA) screens for sepsis using: SBP ≤100 mmHg, RR ≥22, altered mentation."
    },
    riskFactors: [
      "Age extremes (very young or elderly >65)",
      "Immunosuppression (chemotherapy, steroids, HIV)",
      "Invasive devices (central lines, Foley catheters)",
      "Recent surgery or hospitalization"
    ],
    diagnostics: [
      "Blood cultures ×2 sets before antibiotics",
      "Lactate level (>2 mmol/L indicates tissue hypoperfusion)",
      "CBC, BMP, urinalysis, chest X-ray; site-specific cultures"
    ],
    management: [
      "SEP-1 bundle: cultures, lactate, antibiotics within 1 hour, 30 mL/kg crystalloid if hypotensive",
      "Vasopressors (norepinephrine first-line) if MAP <65 after fluid resuscitation",
      "Source control: drain abscesses, remove infected devices"
    ],
    nursingActions: [
      "Recognize sepsis early using SIRS/qSOFA criteria and escalate immediately",
      "Administer IV antibiotics within 1 hour of sepsis recognition",
      "Monitor urine output (target ≥0.5 mL/kg/hr) and mean arterial pressure"
    ],
    signs: {
      left: ["Fever >38.3°C or hypothermia <36°C", "Tachycardia >90 bpm and tachypnea >20", "Altered mental status or confusion"],
      right: ["Lactate >2 mmol/L (>4 mmol/L = severe)", "WBC >12,000 or <4,000 or >10% bands", "Positive blood cultures"]
    },
    medications: [{
      name: "Norepinephrine (Levophed)",
      type: "Alpha-1 adrenergic agonist (vasopressor)",
      action: "Potent vasoconstriction increasing SVR and MAP",
      sideEffects: "Tissue necrosis with extravasation, arrhythmias, peripheral ischemia",
      contra: "Hypovolemia (must fluid resuscitate first); mesenteric/peripheral ischemia",
      pearl: "First-line vasopressor for septic shock; requires central line for infusion; titrate to MAP ≥65 mmHg"
    }],
    pearls: [
      "Each hour delay in antibiotics for sepsis increases mortality by 7-8%",
      "Lactate >4 mmol/L indicates severe tissue hypoperfusion — requires aggressive resuscitation",
      "Hypothermia in suspected sepsis is MORE concerning than fever — indicates poor prognosis"
    ],
    quiz: [
      {
        question: "A septic patient has received 30 mL/kg crystalloid but MAP remains 58 mmHg. What is the next intervention?",
        options: ["Give additional fluid bolus of 30 mL/kg", "Start norepinephrine infusion", "Administer hydrocortisone", "Obtain a CT scan"],
        correct: 1,
        rationale: "When MAP remains <65 mmHg after initial fluid resuscitation (30 mL/kg), vasopressors should be initiated. Norepinephrine is the first-line vasopressor for septic shock."
      },
      {
        question: "What is the target time for antibiotic administration once sepsis is recognized?",
        options: ["Within 6 hours", "Within 3 hours", "Within 1 hour", "Within 30 minutes"],
        correct: 2,
        rationale: "Current sepsis guidelines recommend antibiotic administration within 1 hour of sepsis recognition. Each hour of delay increases mortality significantly."
      }
    ]
  },

  "syncope-evaluation": {
    title: "Syncope Evaluation",
    cellular: {
      title: "Pathophysiology of Syncope",
      content: "Syncope is a transient loss of consciousness due to global cerebral hypoperfusion, with spontaneous and complete recovery. The brain requires continuous perfusion pressure; a drop in systolic BP to 60 mmHg or cessation of cerebral blood flow for 6-8 seconds causes loss of consciousness.\n\nCauses are classified as: reflex/vasovagal (most common — triggered by emotional stress, prolonged standing), orthostatic (volume depletion, autonomic dysfunction, medications), and cardiac (arrhythmias, structural heart disease — most dangerous). Cardiac syncope carries highest mortality risk.\n\nEvaluation focuses on identifying cardiac causes through history (exertional syncope, palpitations, family history of sudden death), ECG, and orthostatic vital signs. High-risk features warrant admission for monitoring."
    },
    riskFactors: [
      "Structural heart disease or known arrhythmia",
      "Age >60 with new-onset syncope",
      "Exertional syncope or syncope while supine",
      "Antihypertensives, diuretics, or QT-prolonging medications"
    ],
    diagnostics: [
      "12-lead ECG (look for arrhythmia, prolonged QT, Brugada, WPW)",
      "Orthostatic vital signs (drop ≥20/10 mmHg or symptoms on standing)",
      "Echocardiogram if cardiac cause suspected; Holter monitor for arrhythmias"
    ],
    management: [
      "Vasovagal: education on prodromal recognition, counter-pressure maneuvers, hydration",
      "Orthostatic: volume repletion, medication review, compression stockings",
      "Cardiac: antiarrhythmics, pacemaker, or ICD based on etiology"
    ],
    nursingActions: [
      "Obtain orthostatic vital signs (supine, sitting, standing at 1 and 3 minutes)",
      "Ensure continuous cardiac monitoring for patients with suspected cardiac syncope",
      "Implement fall precautions and educate on prodromal symptom recognition"
    ],
    signs: {
      left: ["Prodrome: lightheadedness, warmth, diaphoresis, nausea (vasovagal)", "Syncope with exertion (cardiac cause)", "Orthostatic dizziness on standing"],
      right: ["ECG showing prolonged QT or heart block", "Orthostatic BP drop ≥20/10 mmHg", "Echocardiogram showing aortic stenosis or HCM"]
    },
    medications: [{
      name: "Midodrine",
      type: "Alpha-1 adrenergic agonist",
      action: "Increases peripheral vascular resistance by arterial and venous vasoconstriction",
      sideEffects: "Supine hypertension, urinary retention, piloerection, scalp tingling",
      contra: "Severe heart disease, urinary retention, pheochromocytoma",
      pearl: "Do not take within 4 hours of bedtime due to supine hypertension risk; used for refractory orthostatic hypotension"
    }],
    pearls: [
      "Exertional syncope or syncope while supine = cardiac until proven otherwise",
      "Vasovagal syncope has a prodrome (warmth, nausea, tunnel vision); cardiac syncope is often sudden without warning",
      "Family history of sudden cardiac death in young patient with syncope: rule out HCM, long QT, Brugada"
    ],
    quiz: [
      {
        question: "A 25-year-old collapses during a marathon and loses consciousness briefly. Which cause is MOST concerning?",
        options: ["Vasovagal syncope", "Dehydration", "Hypertrophic cardiomyopathy", "Anxiety attack"],
        correct: 2,
        rationale: "Exertional syncope in a young person raises concern for hypertrophic cardiomyopathy (HCM), the leading cause of sudden cardiac death in young athletes. Requires urgent cardiac evaluation."
      },
      {
        question: "What constitutes a positive orthostatic vital sign test?",
        options: ["Heart rate increase of 5 bpm on standing", "SBP drop ≥20 mmHg or DBP drop ≥10 mmHg on standing", "Blood pressure increase on standing", "No change in vitals from supine to standing"],
        correct: 1,
        rationale: "Orthostatic hypotension is defined as a SBP drop ≥20 mmHg or DBP drop ≥10 mmHg within 3 minutes of standing, with or without symptoms."
      }
    ]
  },

  "shock-recognition-patterns": {
    title: "Shock Recognition Patterns",
    cellular: {
      title: "Pathophysiology of Shock",
      content: "Shock is inadequate tissue perfusion leading to cellular hypoxia and organ dysfunction. All types share the final common pathway of impaired oxygen delivery to tissues, anaerobic metabolism, lactic acidosis, and eventual cell death if untreated.\n\nFour categories: Hypovolemic (blood/fluid loss — decreased preload), Cardiogenic (pump failure — decreased contractility), Distributive (vasodilation — decreased SVR, includes septic, anaphylactic, neurogenic), and Obstructive (mechanical obstruction — tension pneumothorax, cardiac tamponade, massive PE).\n\nEarly compensatory mechanisms include tachycardia, vasoconstriction, and increased respiratory rate. Decompensation presents with hypotension, altered mental status, and oliguria. Early recognition of compensated shock is critical for survival."
    },
    riskFactors: [
      "Trauma or hemorrhage (hypovolemic)",
      "Acute MI or cardiomyopathy (cardiogenic)",
      "Infection or allergen exposure (distributive)",
      "Chest trauma or known DVT/PE (obstructive)"
    ],
    diagnostics: [
      "Lactate level (>2 mmol/L indicates tissue hypoperfusion)",
      "Hemodynamic monitoring: CVP, cardiac output, SVR, ScvO2",
      "Echocardiogram for cardiac function; focused assessment in trauma"
    ],
    management: [
      "Hypovolemic: aggressive fluid resuscitation and blood products; control bleeding",
      "Cardiogenic: inotropes (dobutamine), vasopressors, mechanical support; avoid excessive fluids",
      "Distributive (septic): fluids + vasopressors + antibiotics; anaphylactic: epinephrine IM"
    ],
    nursingActions: [
      "Recognize early signs: tachycardia, narrowed pulse pressure, delayed capillary refill, anxiety",
      "Monitor MAP (target ≥65 mmHg), urine output, and lactate trends",
      "Establish two large-bore IVs (16-18 gauge) for rapid fluid administration"
    ],
    signs: {
      left: ["Tachycardia with weak, thready pulse", "Cool, clammy skin (hypovolemic/cardiogenic) or warm, flushed skin (distributive)", "Altered mental status and restlessness"],
      right: ["Lactate >2 mmol/L and rising", "Hypotension: SBP <90 or MAP <65 mmHg", "Urine output <0.5 mL/kg/hr"]
    },
    medications: [{
      name: "Epinephrine",
      type: "Adrenergic agonist (alpha and beta)",
      action: "Increases HR, contractility, vasoconstriction, and bronchodilation",
      sideEffects: "Tachyarrhythmias, hypertension, myocardial ischemia, tremor",
      contra: "No absolute contraindications in anaphylaxis (life-saving)",
      pearl: "IM epinephrine 0.3-0.5 mg (1:1000) for anaphylaxis; IV epinephrine (1:10,000) for cardiac arrest — NEVER give 1:1000 IV"
    }],
    pearls: [
      "Warm shock (septic/distributive) = warm skin, bounding pulse, wide pulse pressure; Cold shock = cool skin, thready pulse, narrow pulse pressure",
      "Cardiogenic shock: do NOT fluid overload — use inotropes and vasopressors",
      "Compensated shock: normal BP with tachycardia — the body is compensating; intervene before decompensation"
    ],
    quiz: [
      {
        question: "A patient is hypotensive with distended neck veins, muffled heart sounds, and tachycardia. What type of shock?",
        options: ["Hypovolemic", "Cardiogenic", "Obstructive (cardiac tamponade)", "Septic"],
        correct: 2,
        rationale: "Beck's triad (hypotension, distended neck veins, muffled heart sounds) is classic for cardiac tamponade, a form of obstructive shock requiring emergent pericardiocentesis."
      },
      {
        question: "In early compensated shock, which finding would the nurse expect?",
        options: ["Hypotension and bradycardia", "Normal BP with tachycardia and restlessness", "Warm flushed skin with bounding pulses", "Absence of symptoms"],
        correct: 1,
        rationale: "In compensated shock, sympathetic activation maintains blood pressure via tachycardia and vasoconstriction. Restlessness and anxiety are early CNS signs of decreased perfusion."
      }
    ]
  },

  "sepsis-protocol-algorithm": {
    title: "Sepsis Protocol Algorithm",
    cellular: {
      title: "The Hour-1 Sepsis Bundle",
      content: "The Surviving Sepsis Campaign Hour-1 Bundle represents time-critical interventions that should be initiated immediately upon sepsis recognition. The bundle approach ensures all elements are addressed simultaneously rather than sequentially.\n\nThe bundle includes: (1) Measure lactate — remeasure if >2 mmol/L, (2) Obtain blood cultures before antibiotics, (3) Administer broad-spectrum antibiotics, (4) Begin rapid infusion of 30 mL/kg crystalloid for hypotension or lactate ≥4 mmol/L, (5) Apply vasopressors if hypotension persists after fluid resuscitation to maintain MAP ≥65 mmHg.\n\nNursing recognition is the rate-limiting step. Screening tools (SIRS, qSOFA, NEWS) help identify at-risk patients. Once sepsis is suspected, the clock starts — each hour of delay in antibiotics increases mortality by 7-8%."
    },
    riskFactors: [
      "Delayed recognition of sepsis symptoms",
      "Inadequate initial fluid resuscitation",
      "Failure to obtain cultures before antibiotics",
      "Delay in antibiotic administration >1 hour"
    ],
    diagnostics: [
      "Serial lactate levels to assess perfusion and response to treatment",
      "Blood cultures ×2 sets (aerobic and anaerobic) from different sites",
      "Procalcitonin to guide antibiotic duration"
    ],
    management: [
      "Hour-1 bundle: lactate, cultures, antibiotics, fluids, vasopressors as indicated",
      "Reassess volume status after initial 30 mL/kg bolus using dynamic measures",
      "De-escalate antibiotics within 48-72 hours based on culture results"
    ],
    nursingActions: [
      "Screen patients using institutional sepsis screening tool every shift",
      "Initiate sepsis bundle immediately upon recognition — do not wait for physician orders",
      "Document time of recognition, interventions, and reassessment findings"
    ],
    signs: {
      left: ["qSOFA ≥2: SBP ≤100, RR ≥22, altered mentation", "SIRS: temp >38.3 or <36, HR >90, RR >20, WBC >12K or <4K", "Signs of end-organ dysfunction: oliguria, confusion, mottled skin"],
      right: ["Lactate >2 mmol/L (tissue hypoperfusion)", "Lactate >4 mmol/L (severe — high mortality)", "Positive blood cultures confirming source"]
    },
    medications: [{
      name: "Meropenem",
      type: "Carbapenem (broad-spectrum beta-lactam)",
      action: "Inhibits cell wall synthesis; resistant to most beta-lactamases",
      sideEffects: "Seizures (especially with renal impairment), diarrhea, C. difficile, rash",
      contra: "Carbapenem allergy; use caution in CNS disorders (seizure risk)",
      pearl: "Reserved for severe infections with MDR gram-negative organisms; de-escalate as soon as sensitivities are available"
    }],
    pearls: [
      "The Hour-1 Bundle means START within 1 hour — not complete within 1 hour",
      "Crystalloid (LR or NS) is the initial fluid of choice — 30 mL/kg for lactate ≥4 or hypotension",
      "Measure lactate early and REPEAT in 2-4 hours — lactate clearance >10% indicates adequate resuscitation"
    ],
    quiz: [
      {
        question: "A patient meets sepsis criteria. The nurse draws blood cultures. What is the NEXT priority action?",
        options: ["Wait for culture results before treating", "Administer broad-spectrum antibiotics within 1 hour", "Order a CT scan to find the source", "Start a dopamine drip"],
        correct: 1,
        rationale: "After obtaining cultures, broad-spectrum antibiotics should be administered within 1 hour of sepsis recognition. Do not wait for culture results to start empiric therapy."
      },
      {
        question: "A septic patient's initial lactate is 5.2 mmol/L. After fluid resuscitation, the repeat lactate is 4.8 mmol/L. What does this indicate?",
        options: ["Adequate resuscitation — continue current management", "Inadequate resuscitation — reassess and escalate treatment", "Normal lactate clearance", "No clinical significance"],
        correct: 1,
        rationale: "Lactate clearance of <10% suggests inadequate tissue perfusion. The patient needs reassessment of volume status and potentially vasopressor support."
      }
    ]
  },

  "acls-cardiac-arrest": {
    title: "ACLS Cardiac Arrest Algorithm",
    cellular: {
      title: "Cardiac Arrest Pathophysiology and Response",
      content: "Cardiac arrest occurs when the heart ceases effective pumping, resulting in absence of circulation. The four arrest rhythms are: ventricular fibrillation (VF), pulseless ventricular tachycardia (pVT) — both shockable, and pulseless electrical activity (PEA) and asystole — both non-shockable.\n\nHigh-quality CPR is the foundation of resuscitation. Chest compressions generate approximately 25-30% of normal cardiac output, providing critical perfusion to the brain and heart. Compression depth (≥2 inches), rate (100-120/min), full recoil, and minimal interruptions are essential.\n\nThe ACLS algorithm follows a systematic approach: assess rhythm, shock if indicated, resume CPR immediately, establish IV/IO access, administer medications, and identify/treat reversible causes (H's and T's)."
    },
    riskFactors: [
      "Acute myocardial infarction or cardiomyopathy",
      "Electrolyte imbalances (hyperkalemia, hypomagnesemia)",
      "Drug toxicity or overdose",
      "Hypoxia, hypothermia, or tension pneumothorax"
    ],
    diagnostics: [
      "Cardiac monitor for rhythm identification (VF/pVT vs PEA/asystole)",
      "End-tidal CO2 (ETCO2 >10 mmHg confirms effective CPR; sudden rise may indicate ROSC)",
      "Point-of-care labs: potassium, glucose, blood gas"
    ],
    management: [
      "Shockable (VF/pVT): Defibrillate → CPR 2 min → recheck rhythm → repeat; epinephrine q3-5 min, amiodarone after 3rd shock",
      "Non-shockable (PEA/asystole): CPR → epinephrine q3-5 min → identify reversible causes (H's and T's)",
      "Post-ROSC: targeted temperature management (TTM), PCI if STEMI, hemodynamic support"
    ],
    nursingActions: [
      "Begin high-quality CPR immediately: 100-120/min, ≥2 inches depth, allow full recoil",
      "Minimize interruptions in compressions (<10 seconds for rhythm checks)",
      "Prepare and administer medications via IV/IO; document resuscitation timeline"
    ],
    signs: {
      left: ["Unresponsive, no pulse, no breathing (or agonal gasps)", "VF/pVT on monitor (shockable rhythms)", "PEA or asystole on monitor (non-shockable)"],
      right: ["ETCO2 >10 mmHg during CPR (effective compressions)", "ROSC signs: ETCO2 spike, arterial waveform, spontaneous movement", "Post-ROSC: assess neurologic status, 12-lead ECG"]
    },
    medications: [{
      name: "Epinephrine (cardiac arrest dose)",
      type: "Adrenergic agonist",
      action: "Alpha-1 vasoconstriction increases coronary and cerebral perfusion pressure during CPR",
      sideEffects: "Post-ROSC hypertension, tachyarrhythmias, myocardial oxygen demand",
      contra: "No contraindications during cardiac arrest",
      pearl: "1 mg IV/IO every 3-5 minutes; for shockable rhythms, give after 2nd shock; for non-shockable, give as soon as IV/IO access established"
    }],
    pearls: [
      "High-quality CPR saves lives: push hard (≥2\"), push fast (100-120/min), allow full recoil, minimize interruptions",
      "H's and T's for reversible causes: Hypovolemia, Hypoxia, Hydrogen ion (acidosis), Hypo/Hyperkalemia, Hypothermia; Tension pneumothorax, Tamponade, Toxins, Thrombosis (PE/MI)",
      "ETCO2 <10 mmHg during CPR: improve compression quality; sudden rise to 35-40 mmHg suggests ROSC"
    ],
    quiz: [
      {
        question: "A patient is in ventricular fibrillation. After the first defibrillation, what should the nurse do IMMEDIATELY?",
        options: ["Check for a pulse", "Resume CPR for 2 minutes", "Administer amiodarone", "Intubate the patient"],
        correct: 1,
        rationale: "After defibrillation, immediately resume CPR for 2 minutes before rechecking the rhythm. Pausing for pulse checks wastes valuable perfusion time."
      },
      {
        question: "During cardiac arrest, epinephrine 1 mg IV is administered. When should the next dose be given?",
        options: ["Every 1-2 minutes", "Every 3-5 minutes", "Every 10 minutes", "Only once during the code"],
        correct: 1,
        rationale: "Epinephrine is given every 3-5 minutes during cardiac arrest to maintain coronary and cerebral perfusion pressure."
      }
    ]
  },

  "stroke-protocol-thrombolytic": {
    title: "Stroke Protocol and Thrombolytic Therapy",
    cellular: {
      title: "Ischemic Stroke Pathophysiology",
      content: "Ischemic stroke occurs when blood flow to a brain region is interrupted by a thrombus or embolus, causing neuronal death in the core infarct and reversible ischemia in the surrounding penumbra. The penumbra is the target of reperfusion therapy — saving this tissue reduces disability.\n\nThe ischemic cascade begins within minutes: ATP depletion leads to ion pump failure, calcium influx, glutamate excitotoxicity, free radical production, and cell death. Time is brain — approximately 1.9 million neurons die every minute during an untreated stroke.\n\nAlteplase (tPA) is the FDA-approved thrombolytic for acute ischemic stroke. The treatment window is up to 4.5 hours from symptom onset (last known well). Mechanical thrombectomy extends the window up to 24 hours for large vessel occlusions in selected patients."
    },
    riskFactors: [
      "Atrial fibrillation (cardioembolic source)",
      "Hypertension, diabetes, hyperlipidemia",
      "Carotid artery stenosis",
      "Previous stroke or TIA"
    ],
    diagnostics: [
      "CT head without contrast STAT (rule out hemorrhagic stroke before tPA)",
      "CT angiography for large vessel occlusion assessment",
      "NIHSS score for stroke severity and treatment decisions"
    ],
    management: [
      "Alteplase (tPA) 0.9 mg/kg IV (max 90 mg): 10% bolus, 90% infused over 60 min within 4.5 hours",
      "Mechanical thrombectomy for large vessel occlusion within 24 hours (if eligible)",
      "Permissive hypertension (do not lower BP unless >220/120 or >185/110 if tPA candidate)"
    ],
    nursingActions: [
      "Perform NIHSS assessment and document last known well time",
      "Monitor neurological status every 15 minutes during and after tPA infusion",
      "Hold anticoagulants and antiplatelets for 24 hours post-tPA; monitor for bleeding"
    ],
    signs: {
      left: ["Sudden unilateral weakness or paralysis", "Speech difficulties (aphasia or dysarthria)", "Facial droop and arm drift"],
      right: ["CT showing no hemorrhage (eligible for tPA)", "NIHSS score documenting deficits", "CTA showing large vessel occlusion"]
    },
    medications: [{
      name: "Alteplase (tPA)",
      type: "Tissue plasminogen activator (thrombolytic)",
      action: "Converts plasminogen to plasmin, dissolving fibrin clots",
      sideEffects: "Hemorrhage (intracranial is most feared), angioedema, allergic reaction",
      contra: "Active internal bleeding, recent surgery (<14 days), hemorrhagic stroke, BP >185/110 uncontrolled, platelets <100K, INR >1.7",
      pearl: "Door-to-needle time goal is <60 minutes; monitor for hemorrhagic conversion — stop infusion and get STAT CT if neurological decline"
    }],
    pearls: [
      "TIME IS BRAIN — 1.9 million neurons die per minute; door-to-needle goal <60 minutes",
      "CT head BEFORE tPA — must rule out hemorrhagic stroke (tPA contraindicated in hemorrhage)",
      "BP must be <185/110 before tPA administration and <180/105 for 24 hours after"
    ],
    quiz: [
      {
        question: "A stroke patient's CT head shows no hemorrhage. Last known well was 3 hours ago. NIHSS is 12. What is the priority intervention?",
        options: ["Administer aspirin 325 mg", "Prepare for alteplase (tPA) administration", "Lower blood pressure to 120/80", "Schedule MRI brain"],
        correct: 1,
        rationale: "The patient is within the 4.5-hour tPA window with significant deficits (NIHSS 12) and no hemorrhage on CT. tPA administration is the priority to restore perfusion."
      },
      {
        question: "During tPA infusion, the patient develops a severe headache and new neurological deficits. What is the priority action?",
        options: ["Increase the tPA infusion rate", "Stop the tPA infusion and obtain STAT CT head", "Administer morphine for headache", "Continue infusion and monitor"],
        correct: 1,
        rationale: "New headache and neurological decline during tPA infusion suggest hemorrhagic conversion. Stop the infusion immediately and obtain STAT CT to confirm. Prepare to administer cryoprecipitate."
      }
    ]
  },

  "dka-management-algorithm": {
    title: "DKA Management Algorithm",
    cellular: {
      title: "Diabetic Ketoacidosis Pathophysiology",
      content: "DKA results from absolute or relative insulin deficiency leading to uncontrolled lipolysis and hepatic ketogenesis. Without insulin, cells cannot utilize glucose, triggering counter-regulatory hormones (glucagon, cortisol, catecholamines) that worsen hyperglycemia through gluconeogenesis and glycogenolysis.\n\nFree fatty acids are converted to ketone bodies (acetoacetate, beta-hydroxybutyrate, acetone), causing metabolic acidosis. Hyperglycemia causes osmotic diuresis leading to severe dehydration, electrolyte losses (especially potassium), and hypovolemia. The combination of acidosis, dehydration, and electrolyte derangement can be fatal.\n\nDKA diagnostic criteria: glucose >250 mg/dL, pH <7.3, bicarbonate <18 mEq/L, positive serum ketones, elevated anion gap. Treatment priorities: fluids first, then insulin, then potassium replacement."
    },
    riskFactors: [
      "Type 1 diabetes (most common) or insulin omission",
      "Infection or illness (most common precipitant)",
      "New-onset diabetes (DKA may be initial presentation)",
      "Medication non-compliance or insulin pump failure"
    ],
    diagnostics: [
      "BMP: glucose, potassium, sodium, bicarbonate, BUN/creatinine, anion gap",
      "ABG showing metabolic acidosis with pH <7.3",
      "Serum ketones (beta-hydroxybutyrate) and urinalysis"
    ],
    management: [
      "IV fluids: NS 1-1.5 L/hr initially; switch to D5 1/2NS when glucose <200",
      "Insulin drip 0.1-0.14 units/kg/hr (do NOT bolus if K+ <3.3; replace K+ first)",
      "Potassium replacement: add 20-40 mEq/L to IV fluids if K+ <5.3"
    ],
    nursingActions: [
      "Monitor blood glucose hourly and potassium every 2 hours during insulin infusion",
      "Assess for cerebral edema: headache, altered mental status, Cushing response (children especially)",
      "Monitor I&O strictly; assess for fluid overload during aggressive resuscitation"
    ],
    signs: {
      left: ["Kussmaul respirations (deep, rapid breathing)", "Fruity acetone breath odor", "Abdominal pain, nausea, vomiting, dehydration"],
      right: ["Blood glucose >250 mg/dL", "pH <7.3 with anion gap >12", "Serum potassium may be high initially but total body K+ is depleted"]
    },
    medications: [{
      name: "Regular Insulin (IV drip)",
      type: "Rapid-acting insulin",
      action: "Facilitates cellular glucose uptake; suppresses lipolysis and ketogenesis",
      sideEffects: "Hypoglycemia, hypokalemia (insulin drives K+ intracellularly)",
      contra: "Hypokalemia <3.3 mEq/L (replace potassium BEFORE starting insulin)",
      pearl: "Do NOT start insulin until potassium is ≥3.3; goal is glucose drop of 50-70 mg/dL/hr; switch to subQ when gap closes and patient eating"
    }],
    pearls: [
      "NEVER start insulin if potassium <3.3 — insulin drives K+ into cells, causing fatal hypokalemia",
      "Serum K+ may be normal or high in DKA despite massive total body depletion — it will DROP with insulin",
      "Close the anion gap, not just the glucose — continue insulin drip with dextrose until gap normalizes"
    ],
    quiz: [
      {
        question: "A DKA patient has blood glucose of 450 mg/dL and potassium of 3.0 mEq/L. What is the priority?",
        options: ["Start insulin drip immediately", "Replace potassium before starting insulin", "Administer sodium bicarbonate", "Give oral glucose"],
        correct: 1,
        rationale: "Potassium <3.3 mEq/L is a contraindication to starting insulin. Insulin drives potassium intracellularly, which can cause fatal cardiac arrhythmias. Replace K+ first."
      },
      {
        question: "DKA glucose has dropped to 180 mg/dL but anion gap remains 18. What should the nurse expect?",
        options: ["Discontinue insulin drip and transition to subQ insulin", "Continue insulin drip and add D5 to IV fluids", "Stop all IV fluids", "Administer a bolus dose of insulin"],
        correct: 1,
        rationale: "The anion gap has not closed (normal <12), indicating ongoing ketoacidosis. Continue the insulin drip but add dextrose to prevent hypoglycemia while the gap closes."
      }
    ]
  },

  "hyperkalemia-treatment-algorithm": {
    title: "Hyperkalemia Treatment Algorithm",
    cellular: {
      title: "Hyperkalemia Pathophysiology",
      content: "Hyperkalemia (K+ >5.0 mEq/L) disrupts the normal resting membrane potential of cardiac and skeletal muscle cells. Elevated extracellular potassium decreases the resting membrane potential, making cells more excitable initially but eventually leading to depolarization block and conduction failure.\n\nCauses include decreased renal excretion (AKI, CKD, medications like ACE inhibitors and spironolactone), transcellular shift (acidosis, tissue destruction, insulin deficiency), and increased intake. Pseudohyperkalemia from hemolyzed specimens must be excluded.\n\nECG changes progress with severity: peaked T-waves (mild) → widened QRS → loss of P-waves → sine wave pattern (pre-arrest). Treatment follows a 3-step approach: stabilize the membrane, shift K+ intracellularly, then remove K+ from the body."
    },
    riskFactors: [
      "Chronic kidney disease or acute kidney injury",
      "ACE inhibitors, ARBs, potassium-sparing diuretics, NSAIDs",
      "Metabolic acidosis (shifts K+ extracellularly)",
      "Massive tissue destruction: rhabdomyolysis, burns, tumor lysis"
    ],
    diagnostics: [
      "Serum potassium level (repeat if hemolysis suspected)",
      "12-lead ECG for cardiac conduction changes",
      "BMP including BUN/creatinine; ABG for acid-base status"
    ],
    management: [
      "Stabilize myocardium: IV calcium gluconate 10% (onset 1-3 min, does NOT lower K+)",
      "Shift K+ intracellularly: insulin 10 units + D50 (with glucose to prevent hypoglycemia), albuterol nebulizer, sodium bicarbonate (if acidotic)",
      "Remove K+: sodium polystyrene sulfonate (Kayexalate), loop diuretics, or hemodialysis (most effective)"
    ],
    nursingActions: [
      "Place on continuous cardiac monitoring immediately",
      "Administer calcium gluconate first if ECG changes present (protects heart within minutes)",
      "Monitor glucose closely after insulin administration (hypoglycemia risk)"
    ],
    signs: {
      left: ["Muscle weakness and paresthesias", "Nausea and abdominal cramping", "Cardiac palpitations or irregular pulse"],
      right: ["Peaked T-waves on ECG (earliest change)", "Widened QRS complex (>0.12 seconds)", "Sine wave pattern (pre-arrest — emergency)"]
    },
    medications: [{
      name: "Calcium Gluconate 10%",
      type: "Membrane stabilizer",
      action: "Raises cardiac cell depolarization threshold, counteracting hyperkalemia's effect on conduction",
      sideEffects: "Bradycardia if given too fast, tissue necrosis with extravasation",
      contra: "Concurrent digoxin use (can precipitate digoxin toxicity); give slowly over 2-3 min",
      pearl: "Does NOT lower potassium — only protects the heart temporarily (30-60 min); must follow with K+-lowering interventions"
    }],
    pearls: [
      "Calcium gluconate is FIRST if ECG changes present — it stabilizes the heart but does NOT lower K+",
      "Insulin + glucose shifts K+ intracellularly within 15-30 minutes (most rapid K+-lowering intervention)",
      "Hemodialysis is the most effective method to remove potassium from the body"
    ],
    quiz: [
      {
        question: "A patient has K+ of 6.8 mEq/L with peaked T-waves. What is the FIRST medication to administer?",
        options: ["Insulin with D50", "Sodium polystyrene sulfonate", "Calcium gluconate IV", "Furosemide"],
        correct: 2,
        rationale: "With ECG changes present, calcium gluconate is the FIRST priority to stabilize the cardiac membrane and prevent arrhythmias. It acts within 1-3 minutes."
      },
      {
        question: "After administering insulin 10 units IV for hyperkalemia, what must the nurse monitor?",
        options: ["Serum sodium levels", "Blood glucose levels (hypoglycemia risk)", "Respiratory rate", "Urine specific gravity"],
        correct: 1,
        rationale: "Insulin drives potassium and glucose into cells. Blood glucose must be monitored closely; D50 is co-administered to prevent hypoglycemia."
      }
    ]
  },

  "chest-pain-emergency-algorithm": {
    title: "Chest Pain Emergency Algorithm",
    cellular: {
      title: "Acute Coronary Syndrome Emergency Response",
      content: "The chest pain emergency algorithm is a standardized approach to rapidly identify and treat life-threatening causes of chest pain, with acute coronary syndrome (ACS) as the primary concern. ACS encompasses unstable angina, NSTEMI, and STEMI, representing a spectrum of coronary ischemia.\n\nSTEMI results from complete coronary occlusion requiring emergent reperfusion. Door-to-balloon time (PCI) goal is <90 minutes; door-to-needle time (thrombolytics) goal is <30 minutes. NSTEMI and unstable angina involve partial occlusion and are managed with anticoagulation and risk stratification.\n\nThe immediate approach follows MONA (Morphine, Oxygen, Nitroglycerin, Aspirin) with modifications: aspirin is given first, oxygen only if SpO2 <94%, morphine is used cautiously (may increase mortality in some studies), and nitroglycerin is contraindicated with hypotension or right ventricular infarction."
    },
    riskFactors: [
      "Known coronary artery disease or previous MI",
      "Multiple cardiac risk factors (HTN, DM, smoking, dyslipidemia)",
      "Cocaine or stimulant use (coronary vasospasm)",
      "Family history of premature CAD (<55 males, <65 females)"
    ],
    diagnostics: [
      "12-lead ECG within 10 minutes (right-sided ECG if inferior STEMI)",
      "Serial troponin at 0, 3, and 6 hours",
      "Chest X-ray to rule out other causes (dissection, pneumothorax)"
    ],
    management: [
      "STEMI: activate cath lab for emergent PCI (door-to-balloon <90 min)",
      "NSTEMI/UA: anticoagulation (heparin), antiplatelet therapy, cardiology consult",
      "All ACS: aspirin 162-325 mg chewed, dual antiplatelet therapy, statin"
    ],
    nursingActions: [
      "Administer aspirin 162-325 mg (chewed) immediately upon ACS suspicion",
      "Obtain 12-lead ECG and notify provider of ST changes within 10 minutes",
      "Establish IV access, continuous cardiac monitoring, and serial vital signs"
    ],
    signs: {
      left: ["Crushing substernal chest pressure", "Diaphoresis, nausea, dyspnea", "Pain radiating to left arm, jaw, or back"],
      right: ["ST elevation ≥1 mm in 2 contiguous leads (STEMI)", "Elevated troponin (NSTEMI)", "New left bundle branch block"]
    },
    medications: [{
      name: "Aspirin",
      type: "Antiplatelet agent (COX inhibitor)",
      action: "Irreversibly inhibits cyclooxygenase, blocking thromboxane A2 and platelet aggregation",
      sideEffects: "GI bleeding, allergic reaction, Reye syndrome in children",
      contra: "Active GI bleeding, aspirin allergy (use clopidogrel as alternative)",
      pearl: "CHEW 162-325 mg for fastest absorption; the single most important medication in ACS — reduces mortality by 23%"
    }],
    pearls: [
      "Aspirin is the FIRST medication in ACS — chewing provides faster absorption than swallowing",
      "Right ventricular infarction (inferior STEMI): nitroglycerin is CONTRAINDICATED (preload dependent)",
      "Women, elderly, and diabetics may present with atypical symptoms: fatigue, nausea, back pain, dyspnea"
    ],
    quiz: [
      {
        question: "A patient presents with chest pain and the ECG shows ST elevation in leads II, III, and aVF. What is the priority action?",
        options: ["Administer sublingual nitroglycerin", "Activate the cardiac catheterization lab", "Obtain a right-sided ECG", "Schedule stress testing"],
        correct: 1,
        rationale: "ST elevation in II, III, aVF indicates inferior STEMI requiring emergent PCI. Activate the cath lab immediately. A right-sided ECG should also be obtained to assess for RV involvement."
      },
      {
        question: "Which medication is CONTRAINDICATED in a patient with inferior STEMI and suspected right ventricular infarction?",
        options: ["Aspirin", "Nitroglycerin", "Heparin", "Atorvastatin"],
        correct: 1,
        rationale: "Nitroglycerin reduces preload, which the right ventricle is dependent on for adequate output. In RV infarction, nitroglycerin can cause severe hypotension."
      }
    ]
  },

  "shock-overview-lesson": {
    title: "Shock: Comprehensive",
    cellular: {
      title: "Understanding Shock States",
      content: "Shock is a state of inadequate tissue perfusion resulting in cellular hypoxia, anaerobic metabolism, and organ dysfunction. Despite varied etiologies, all shock types share the final common pathway of impaired oxygen delivery relative to metabolic demand.\n\nThe four categories are distinguished by hemodynamic profiles: Hypovolemic (decreased preload, high SVR), Cardiogenic (decreased CO, high SVR, high preload), Distributive (decreased SVR, high CO initially — septic, anaphylactic, neurogenic), and Obstructive (mechanical barrier to CO — tamponade, tension pneumothorax, massive PE).\n\nShock progresses through compensated (tachycardia, vasoconstriction maintain BP), decompensated (hypotension, organ dysfunction), and irreversible (refractory organ failure, death) stages. Early recognition during the compensated phase is key to survival."
    },
    riskFactors: [
      "Hemorrhage, dehydration, or third-spacing (hypovolemic)",
      "Acute MI, heart failure, dysrhythmias (cardiogenic)",
      "Sepsis, anaphylaxis, spinal cord injury (distributive)",
      "Tension pneumothorax, cardiac tamponade, massive PE (obstructive)"
    ],
    diagnostics: [
      "Lactate: tissue perfusion marker (>2 mmol/L indicates hypoperfusion)",
      "Echocardiogram: assess cardiac function and filling",
      "Central venous catheter: CVP, ScvO2, and cardiac output monitoring"
    ],
    management: [
      "Hypovolemic: volume resuscitation with crystalloids and blood products",
      "Cardiogenic: inotropes (dobutamine), vasopressors, avoid fluid overload",
      "Distributive: vasopressors (norepinephrine), treat underlying cause"
    ],
    nursingActions: [
      "Recognize early signs: tachycardia, restlessness, delayed capillary refill (>3 sec)",
      "Establish large-bore IV access (2 sites, 16-18 gauge) and initiate fluid resuscitation",
      "Monitor urine output hourly (target ≥0.5 mL/kg/hr as perfusion marker)"
    ],
    signs: {
      left: ["Tachycardia and tachypnea (earliest signs)", "Cool/clammy skin (hypovolemic) vs warm/flushed (distributive early)", "Altered mentation, restlessness, confusion"],
      right: ["MAP <65 mmHg", "Lactate >2 mmol/L", "Urine output <0.5 mL/kg/hr"]
    },
    medications: [{
      name: "Dobutamine",
      type: "Synthetic catecholamine (beta-1 agonist)",
      action: "Increases cardiac contractility and cardiac output",
      sideEffects: "Tachycardia, arrhythmias, hypotension (due to beta-2 vasodilation)",
      contra: "Idiopathic hypertrophic subaortic stenosis (IHSS); hypovolemia",
      pearl: "First-line inotrope for cardiogenic shock; may cause hypotension — often combined with norepinephrine"
    }],
    pearls: [
      "Tachycardia is often the FIRST sign of shock — do not dismiss unexplained tachycardia",
      "In cardiogenic shock, fluids can WORSEN the situation — use inotropes instead",
      "MAP ≥65 mmHg is the universal perfusion target in shock management"
    ],
    quiz: [
      {
        question: "A patient post-MI has BP 78/50, HR 120, JVD, and crackles bilaterally. What type of shock?",
        options: ["Hypovolemic", "Cardiogenic", "Septic", "Neurogenic"],
        correct: 1,
        rationale: "Post-MI with hypotension, tachycardia, JVD (elevated preload), and pulmonary crackles (fluid backup) indicates cardiogenic shock from pump failure."
      },
      {
        question: "Which intervention is CONTRAINDICATED in cardiogenic shock?",
        options: ["Dobutamine infusion", "Aggressive fluid resuscitation", "Vasopressor support", "Intra-aortic balloon pump"],
        correct: 1,
        rationale: "In cardiogenic shock, the heart cannot handle additional volume. Aggressive fluids will worsen pulmonary edema. Treatment focuses on inotropes and afterload reduction."
      }
    ]
  },

  "electrolyte-imbalances-overview": {
    title: "Electrolyte Imbalances: Comprehensive",
    cellular: {
      title: "Electrolyte Homeostasis",
      content: "Electrolytes are essential for cellular function, nerve conduction, muscle contraction, and fluid balance. The major electrolytes include sodium (135-145 mEq/L), potassium (3.5-5.0 mEq/L), calcium (8.5-10.5 mg/dL), magnesium (1.5-2.5 mEq/L), and phosphorus (2.5-4.5 mg/dL).\n\nSodium controls fluid distribution between compartments through osmosis. Hyponatremia (<135) causes cellular swelling (cerebral edema); hypernatremia (>145) causes cellular dehydration. Potassium is critical for cardiac and neuromuscular function — both hypo- and hyperkalemia can cause fatal arrhythmias.\n\nCalcium and phosphorus have an inverse relationship and are regulated by PTH, vitamin D, and calcitonin. Magnesium is essential for neuromuscular function and potassium/calcium regulation — always check magnesium when potassium is refractory to replacement."
    },
    riskFactors: [
      "Renal failure (impaired excretion of K+, phosphorus, magnesium)",
      "Diuretic therapy (loop diuretics waste K+, Mg2+, Ca2+)",
      "GI losses: vomiting, diarrhea, NG suction",
      "Endocrine disorders: hyperparathyroidism, SIADH, diabetes insipidus"
    ],
    diagnostics: [
      "Comprehensive metabolic panel (CMP) for sodium, potassium, calcium, glucose, renal function",
      "Magnesium and phosphorus levels (not included in standard BMP)",
      "ECG for cardiac effects of potassium and calcium imbalances"
    ],
    management: [
      "Correct the underlying cause (e.g., discontinue offending medications)",
      "Replace deficits gradually to avoid overcorrection (especially sodium — risk of osmotic demyelination)",
      "Restrict or remove excess electrolytes (e.g., potassium restriction in hyperkalemia)"
    ],
    nursingActions: [
      "Monitor cardiac rhythm continuously for potassium and calcium abnormalities",
      "Administer IV potassium via pump (never push IV KCl); maximum 10 mEq/hr peripherally",
      "Assess neurological status with sodium imbalances (confusion, seizures)"
    ],
    signs: {
      left: ["Hypokalemia: U-waves, flat T-waves, muscle weakness, ileus", "Hypocalcemia: Trousseau sign, Chvostek sign, tetany, prolonged QT", "Hyponatremia: headache, confusion, seizures, cerebral edema"],
      right: ["Hyperkalemia: peaked T-waves, widened QRS, cardiac arrest", "Hypercalcemia: shortened QT, lethargy, kidney stones, bone pain", "Hypernatremia: thirst, dry mucous membranes, altered mentation"]
    },
    medications: [{
      name: "Potassium Chloride (KCl)",
      type: "Electrolyte replacement",
      action: "Replaces potassium deficit to restore normal cellular membrane potential",
      sideEffects: "Hyperkalemia, GI irritation (oral), phlebitis (IV), cardiac arrest if given too fast",
      contra: "Hyperkalemia >5.0; severe renal impairment without monitoring",
      pearl: "NEVER push IV potassium; max 10 mEq/hr via peripheral line, 20 mEq/hr via central line with cardiac monitoring"
    }],
    pearls: [
      "Hypomagnesemia makes hypokalemia refractory to treatment — always check and replace Mg2+ first",
      "Correct sodium slowly: no more than 8-10 mEq/L in 24 hours to prevent osmotic demyelination syndrome",
      "Calcium and phosphorus are inversely related — when one goes up, the other goes down"
    ],
    quiz: [
      {
        question: "A patient's potassium remains low despite IV replacement. What should the nurse check?",
        options: ["Sodium level", "Magnesium level", "Chloride level", "Phosphorus level"],
        correct: 1,
        rationale: "Hypomagnesemia causes renal potassium wasting, making hypokalemia refractory to replacement. Magnesium must be corrected before potassium will normalize."
      },
      {
        question: "A patient with hyponatremia (Na+ 118 mEq/L) is having seizures. What is the maximum safe correction rate?",
        options: ["20 mEq/L in 24 hours", "8-10 mEq/L in 24 hours", "Correct to normal as fast as possible", "2 mEq/L per hour"],
        correct: 1,
        rationale: "Rapid correction of chronic hyponatremia can cause osmotic demyelination syndrome (central pontine myelinolysis). Limit correction to 8-10 mEq/L in 24 hours."
      }
    ]
  },

  "heart-failure-overview-lesson": {
    title: "Heart Failure: Comprehensive",
    cellular: {
      title: "Heart Failure Pathophysiology",
      content: "Heart failure (HF) occurs when the heart cannot pump sufficient blood to meet metabolic demands. Left-sided HF causes pulmonary congestion (backward failure) and decreased systemic perfusion (forward failure). Right-sided HF causes systemic venous congestion (peripheral edema, hepatomegaly, JVD).\n\nHFrEF (reduced ejection fraction, EF <40%) involves impaired contractility — the ventricle cannot eject adequately. HFpEF (preserved ejection fraction, EF ≥50%) involves impaired relaxation — the ventricle cannot fill adequately. Neurohormonal activation (RAAS, sympathetic nervous system, BNP) initially compensates but eventually worsens HF through remodeling.\n\nTreatment targets the neurohormonal cascade: ACE inhibitors/ARBs reduce afterload and prevent remodeling, beta-blockers reduce sympathetic activation, diuretics manage fluid overload, and aldosterone antagonists improve survival."
    },
    riskFactors: [
      "Coronary artery disease and prior MI (most common cause)",
      "Uncontrolled hypertension",
      "Valvular heart disease",
      "Cardiomyopathy (dilated, hypertrophic, restrictive)"
    ],
    diagnostics: [
      "BNP >400 pg/mL or NT-proBNP >900 pg/mL (confirms HF diagnosis)",
      "Echocardiogram for EF, wall motion, valvular function",
      "Chest X-ray showing cardiomegaly, pulmonary vascular congestion, pleural effusions"
    ],
    management: [
      "GDMT: ACE inhibitor/ARB/ARNI + beta-blocker + aldosterone antagonist + SGLT2 inhibitor",
      "Diuretics (furosemide) for volume management — titrate to dry weight",
      "Sodium restriction (<2g/day), fluid restriction (1.5-2L/day), daily weights"
    ],
    nursingActions: [
      "Weigh daily at same time — report gain >2 lbs/day or 5 lbs/week",
      "Monitor I&O and assess for fluid overload: crackles, JVD, peripheral edema",
      "Educate on medication compliance, low-sodium diet, and when to call provider"
    ],
    signs: {
      left: ["Dyspnea, orthopnea, paroxysmal nocturnal dyspnea", "Crackles (rales) in lung bases", "S3 gallop (volume overload)"],
      right: ["Jugular venous distension (JVD)", "Peripheral edema (dependent)", "Hepatomegaly and ascites"]
    },
    medications: [{
      name: "Carvedilol",
      type: "Non-selective beta-blocker with alpha-blocking activity",
      action: "Reduces heart rate, BP, and myocardial oxygen demand; prevents remodeling",
      sideEffects: "Bradycardia, hypotension, fatigue, dizziness, weight gain",
      contra: "Decompensated HF (do not start during acute exacerbation), severe bradycardia, 2nd/3rd degree AV block",
      pearl: "Start low, go slow — do NOT initiate during acute decompensation; proven to reduce mortality in HFrEF"
    }],
    pearls: [
      "Daily weights are the best indicator of fluid status — gain of 2+ lbs/day indicates fluid retention",
      "Left-sided HF = lungs (crackles, dyspnea); Right-sided HF = body (JVD, edema, ascites)",
      "Beta-blockers improve survival but must NOT be started during acute decompensation"
    ],
    quiz: [
      {
        question: "A patient with HF gains 4 lbs overnight. The nurse should anticipate which order?",
        options: ["Increase oral fluid intake", "Administer IV furosemide", "Discontinue all medications", "Encourage ambulation"],
        correct: 1,
        rationale: "Rapid weight gain indicates fluid retention. IV furosemide will promote diuresis. Weight gain >2 lbs/day or 5 lbs/week requires intervention."
      },
      {
        question: "Which assessment finding is MOST consistent with left-sided heart failure?",
        options: ["Hepatomegaly", "Jugular venous distension", "Crackles in lung bases", "Peripheral edema"],
        correct: 2,
        rationale: "Left-sided HF causes blood to back up into the pulmonary circulation, resulting in pulmonary congestion manifesting as crackles. Hepatomegaly, JVD, and peripheral edema are right-sided HF signs."
      }
    ]
  },

  "respiratory-failure-overview-lesson": {
    title: "Respiratory Failure: Comprehensive",
    cellular: {
      title: "Types of Respiratory Failure",
      content: "Respiratory failure occurs when the respiratory system fails to maintain adequate gas exchange. Type I (hypoxemic) involves PaO2 <60 mmHg with normal or low PaCO2 — caused by V/Q mismatch, shunt, or diffusion impairment (pneumonia, ARDS, PE). Type II (hypercapnic) involves PaCO2 >50 mmHg — caused by alveolar hypoventilation (COPD exacerbation, neuromuscular disease, drug overdose).\n\nAcute Respiratory Distress Syndrome (ARDS) is a severe form of Type I failure characterized by bilateral pulmonary infiltrates, PaO2/FiO2 ratio ≤300, and non-cardiogenic pulmonary edema. The pathology involves diffuse alveolar damage, surfactant dysfunction, and refractory hypoxemia.\n\nManagement follows a stepwise approach: supplemental oxygen → high-flow nasal cannula → non-invasive ventilation (CPAP/BiPAP) → mechanical ventilation with lung-protective strategies (low tidal volume 6 mL/kg, plateau pressure <30 cmH2O)."
    },
    riskFactors: [
      "COPD, asthma, or interstitial lung disease",
      "Pneumonia, sepsis, or aspiration",
      "Neuromuscular disorders (Guillain-Barré, myasthenia gravis)",
      "Trauma, burns, or pancreatitis (ARDS risk)"
    ],
    diagnostics: [
      "ABG: PaO2 <60 (Type I) or PaCO2 >50 (Type II)",
      "PaO2/FiO2 ratio for ARDS classification (≤300 mild, ≤200 moderate, ≤100 severe)",
      "Chest X-ray showing bilateral infiltrates (ARDS) or hyperinflation (COPD)"
    ],
    management: [
      "Oxygen therapy titrated to SpO2 ≥94% (88-92% in COPD)",
      "NIV (BiPAP) for COPD exacerbation or acute cardiogenic pulmonary edema",
      "Mechanical ventilation with lung-protective settings for ARDS (Vt 6 mL/kg IBW)"
    ],
    nursingActions: [
      "Monitor respiratory status continuously: RR, SpO2, work of breathing, ABG trends",
      "Position upright; prone positioning for ARDS patients on ventilator (16+ hrs/day)",
      "Assess ventilator alarms, tube placement, and signs of complications (pneumothorax, VAP)"
    ],
    signs: {
      left: ["Dyspnea, tachypnea, accessory muscle use", "Cyanosis and refractory hypoxemia", "Altered mental status from hypoxia or hypercapnia"],
      right: ["ABG: PaO2 <60 mmHg on room air", "PaO2/FiO2 ≤300 (ARDS criteria)", "Bilateral infiltrates on CXR (ARDS)"]
    },
    medications: [{
      name: "Methylprednisolone",
      type: "Corticosteroid",
      action: "Reduces inflammation, stabilizes alveolar-capillary membrane",
      sideEffects: "Hyperglycemia, immunosuppression, GI bleeding, adrenal suppression",
      contra: "Active untreated infection (relative); do not abruptly discontinue",
      pearl: "Used in COPD exacerbation and some ARDS protocols; taper gradually to prevent adrenal crisis"
    }],
    pearls: [
      "Type I (hypoxemic) = oxygenation problem; Type II (hypercapnic) = ventilation problem",
      "Prone positioning in ARDS improves oxygenation by recruiting dorsal lung segments",
      "Low tidal volume ventilation (6 mL/kg) reduces ventilator-induced lung injury and mortality in ARDS"
    ],
    quiz: [
      {
        question: "A COPD patient has ABG: pH 7.28, PaCO2 65, PaO2 55, HCO3 32. What type of respiratory failure?",
        options: ["Type I (hypoxemic)", "Type II (hypercapnic)", "Mixed respiratory and metabolic", "Normal ABG"],
        correct: 1,
        rationale: "PaCO2 >50 mmHg with acidosis indicates Type II (hypercapnic) respiratory failure. The elevated HCO3 suggests chronic compensation (COPD) with acute decompensation."
      },
      {
        question: "A ventilated ARDS patient has PaO2/FiO2 ratio of 90. Which intervention improves oxygenation?",
        options: ["Increase tidal volume to 10 mL/kg", "Initiate prone positioning", "Decrease PEEP", "Remove the ventilator and use nasal cannula"],
        correct: 1,
        rationale: "Severe ARDS (P/F ratio ≤100) benefits from prone positioning for 16+ hours/day, which improves V/Q matching and reduces mortality."
      }
    ]
  },

  "renal-failure-overview-lesson": {
    title: "Renal Failure: Comprehensive",
    cellular: {
      title: "Acute and Chronic Kidney Disease",
      content: "Acute kidney injury (AKI) is a rapid decline in renal function over hours to days, characterized by rising creatinine and decreased urine output. Causes are classified as prerenal (hypoperfusion — dehydration, HF, sepsis), intrarenal (direct kidney damage — ATN, glomerulonephritis, nephrotoxins), and postrenal (obstruction — kidney stones, BPH, tumors).\n\nChronic kidney disease (CKD) is a progressive irreversible loss of nephron function over months to years, staged by GFR (Stage 1: GFR >90 with markers, to Stage 5: GFR <15 = ESRD). CKD leads to fluid overload, electrolyte imbalances (hyperkalemia, hyperphosphatemia), metabolic acidosis, anemia, and uremic symptoms.\n\nComplications of renal failure include hyperkalemia (cardiac risk), fluid overload (pulmonary edema), uremia (encephalopathy, pericarditis), metabolic acidosis, and secondary hyperparathyroidism from phosphorus-calcium imbalance."
    },
    riskFactors: [
      "Diabetes mellitus (leading cause of CKD)",
      "Hypertension (second leading cause of CKD)",
      "Nephrotoxic medications (NSAIDs, aminoglycosides, contrast dye)",
      "Hypovolemia, sepsis, or heart failure (prerenal AKI)"
    ],
    diagnostics: [
      "Serum creatinine and BUN (rising creatinine = declining GFR)",
      "GFR calculation for CKD staging",
      "Urinalysis: casts (muddy brown = ATN, RBC = glomerulonephritis), proteinuria"
    ],
    management: [
      "AKI: treat underlying cause, maintain euvolemia, avoid nephrotoxins",
      "CKD: BP control (ACEi/ARB for proteinuria), glucose management in diabetics",
      "Dialysis: indicated for refractory hyperkalemia, fluid overload, acidosis, uremia, or toxin removal"
    ],
    nursingActions: [
      "Monitor strict I&O and daily weights; assess for fluid overload",
      "Monitor potassium closely — restrict dietary K+ and administer binders as ordered",
      "Educate on renal diet: low sodium, low potassium, low phosphorus, protein management"
    ],
    signs: {
      left: ["Decreased urine output (<0.5 mL/kg/hr in AKI)", "Peripheral edema, weight gain", "Uremic symptoms: fatigue, nausea, confusion, pruritus"],
      right: ["Rising creatinine and BUN", "Hyperkalemia (K+ >5.0)", "Metabolic acidosis (low bicarbonate)"]
    },
    medications: [{
      name: "Sevelamer (Renvela)",
      type: "Phosphate binder",
      action: "Binds dietary phosphorus in GI tract, preventing absorption",
      sideEffects: "Constipation, nausea, abdominal pain",
      contra: "Bowel obstruction; hypophosphatemia",
      pearl: "Must be taken WITH meals to bind phosphorus from food; does not contain calcium (preferred in CKD with hypercalcemia)"
    }],
    pearls: [
      "Prerenal AKI: BUN:creatinine ratio >20:1; concentrated urine (FENa <1%)",
      "Dialysis emergencies (AEIOU): Acidosis, Electrolytes (K+), Ingestion (toxins), Overload (fluid), Uremia",
      "ACE inhibitors are renoprotective in CKD but may cause a small initial creatinine rise — this is expected"
    ],
    quiz: [
      {
        question: "A patient with CKD has potassium of 6.2, creatinine of 8.5, and confusion. What intervention is MOST urgent?",
        options: ["Start ACE inhibitor", "Initiate hemodialysis", "Begin renal diet education", "Schedule kidney biopsy"],
        correct: 1,
        rationale: "Hyperkalemia with uremic symptoms (confusion) in CKD indicates dialysis is needed. This is an emergent situation given the cardiac risk of hyperkalemia."
      },
      {
        question: "Which finding differentiates prerenal AKI from intrarenal AKI?",
        options: ["Elevated creatinine", "BUN:Creatinine ratio >20:1", "Hyperkalemia", "Metabolic acidosis"],
        correct: 1,
        rationale: "Prerenal AKI shows a disproportionately elevated BUN relative to creatinine (ratio >20:1) because urea is reabsorbed in the setting of decreased perfusion, while creatinine is not."
      }
    ]
  },

  "cardiac-dysrhythmias-overview": {
    title: "Cardiac Dysrhythmias: Comprehensive",
    cellular: {
      title: "Cardiac Conduction and Arrhythmias",
      content: "Normal cardiac rhythm originates from the SA node (60-100 bpm), travels through the atria to the AV node (40-60 bpm), then through the bundle of His and Purkinje fibers (20-40 bpm). Dysrhythmias result from abnormal automaticity, triggered activity, or re-entry circuits.\n\nBradyarrhythmias include sinus bradycardia and heart blocks (1st degree, 2nd degree Type I/II, 3rd degree). Tachyarrhythmias include SVT, atrial fibrillation/flutter, ventricular tachycardia, and ventricular fibrillation. The clinical significance depends on hemodynamic stability — treat the patient, not the monitor.\n\nAtrial fibrillation is the most common sustained arrhythmia. It increases stroke risk 5-fold due to atrial stasis and clot formation. Rate control, rhythm control, and anticoagulation (CHA₂DS₂-VASc score) are the treatment pillars."
    },
    riskFactors: [
      "Structural heart disease (MI, cardiomyopathy, valvular disease)",
      "Electrolyte imbalances (hypokalemia, hypomagnesemia, hypercalcemia)",
      "Drug toxicity (digoxin, antiarrhythmics, sympathomimetics)",
      "Hypoxia, acidosis, or thyroid disorders"
    ],
    diagnostics: [
      "12-lead ECG and continuous cardiac monitoring",
      "Electrolytes: potassium, magnesium, calcium",
      "Echocardiogram for structural heart disease; Holter monitor for intermittent arrhythmias"
    ],
    management: [
      "Unstable tachycardia: synchronized cardioversion",
      "Stable narrow-complex tachycardia: vagal maneuvers → adenosine",
      "Symptomatic bradycardia: atropine → transcutaneous pacing → transvenous pacing"
    ],
    nursingActions: [
      "Identify rhythm, assess hemodynamic stability, and treat based on symptoms",
      "Keep defibrillator/pacing equipment at bedside for high-risk patients",
      "Monitor therapeutic drug levels for antiarrhythmics (digoxin, amiodarone)"
    ],
    signs: {
      left: ["Palpitations, dizziness, syncope", "Chest pain or dyspnea with rapid rates", "Irregular pulse (atrial fibrillation)"],
      right: ["ECG: absent P-waves with irregular R-R (atrial fibrillation)", "ECG: wide QRS tachycardia (ventricular tachycardia)", "ECG: progressive PR prolongation (Mobitz Type I)"]
    },
    medications: [{
      name: "Amiodarone",
      type: "Class III antiarrhythmic (potassium channel blocker)",
      action: "Prolongs action potential and refractory period in all cardiac tissue",
      sideEffects: "Pulmonary fibrosis, thyroid dysfunction, hepatotoxicity, corneal deposits, blue-gray skin",
      contra: "Severe sinus node disease, 2nd/3rd degree AV block, baseline QT prolongation",
      pearl: "Monitor thyroid, liver, and pulmonary function regularly; very long half-life (40-55 days); drug interactions with warfarin and digoxin"
    }],
    pearls: [
      "Treat the PATIENT, not the MONITOR — assess hemodynamic stability first",
      "Atrial fibrillation + rapid ventricular rate: control rate with beta-blockers or calcium channel blockers; anticoagulate based on CHA₂DS₂-VASc",
      "3rd degree (complete) heart block: P-waves and QRS march independently; requires pacemaker"
    ],
    quiz: [
      {
        question: "A patient on telemetry shows a wide-complex tachycardia at 180 bpm with BP 70/40. What is the priority intervention?",
        options: ["Administer adenosine", "Perform synchronized cardioversion", "Start an amiodarone drip", "Apply vagal maneuvers"],
        correct: 1,
        rationale: "Wide-complex tachycardia with hemodynamic instability (hypotension) requires immediate synchronized cardioversion. Unstable = electricity first."
      },
      {
        question: "A patient with new-onset atrial fibrillation has a CHA₂DS₂-VASc score of 3. What medication should the nurse anticipate?",
        options: ["Aspirin only", "Anticoagulation with apixaban or warfarin", "Amiodarone for rhythm control", "No medication needed"],
        correct: 1,
        rationale: "CHA₂DS₂-VASc score ≥2 in males or ≥3 in females warrants anticoagulation to reduce stroke risk in atrial fibrillation."
      }
    ]
  },

  "clinical-prioritization-frameworks": {
    title: "Clinical Prioritization Frameworks",
    cellular: {
      title: "Nursing Prioritization Models",
      content: "Clinical prioritization is the systematic process of determining which patient needs require immediate attention. Frameworks help nurses make safe, consistent decisions under pressure. The most fundamental framework is Maslow's Hierarchy applied to nursing: physiological needs (ABCs) take priority over safety, then psychosocial needs.\n\nThe ABCs (Airway, Breathing, Circulation) framework is universally applied: airway patency first, then adequate oxygenation/ventilation, then hemodynamic stability. The nursing process (Assessment before Intervention) guides question analysis — always assess before acting unless the situation is emergent.\n\nAdditional frameworks include: Acute vs Chronic (new/acute findings take priority), Actual vs Potential (actual problems before risk reduction), and the CURE framework (Critical/Urgent/Routine/Expected) for patient assignment prioritization."
    },
    riskFactors: [
      "Multiple patients with competing priorities",
      "Inadequate staffing or resource limitations",
      "Inexperience with acuity assessment",
      "Communication failures during handoff"
    ],
    diagnostics: [
      "Rapid patient assessment using ABCs framework",
      "Early warning scores (NEWS, MEWS) for deterioration detection",
      "Focused assessment based on presenting complaint"
    ],
    management: [
      "Address life-threatening conditions first (ABCs)",
      "Delegate stable, predictable tasks to UAP; retain assessment and critical thinking",
      "Reassess and reprioritize continuously as patient conditions change"
    ],
    nursingActions: [
      "Use systematic prioritization: ABC → acute before chronic → actual before potential",
      "Communicate priorities clearly using SBAR during handoff",
      "Document reassessment findings and rationale for prioritization decisions"
    ],
    signs: {
      left: ["Airway compromise: stridor, gurgling, inability to speak", "Breathing emergency: SpO2 <90%, severe dyspnea, cyanosis", "Circulation crisis: chest pain, uncontrolled hemorrhage, altered LOC"],
      right: ["Early warning score indicating deterioration", "Change in patient condition from baseline", "New onset of abnormal vital signs"]
    },
    medications: [{
      name: "Naloxone (Narcan)",
      type: "Opioid antagonist",
      action: "Competitively binds opioid receptors, reversing respiratory depression",
      sideEffects: "Acute opioid withdrawal, tachycardia, hypertension, pulmonary edema",
      contra: "No absolute contraindications in life-threatening opioid overdose",
      pearl: "Prioritization example: respiratory depression (Airway/Breathing) takes priority — administer naloxone immediately; titrate to respiratory effort, not alertness"
    }],
    pearls: [
      "When in doubt: Assess before Intervene, ABC order, Acute before Chronic",
      "Maslow's applied to nursing: Physiological → Safety → Psychosocial → Self-actualization",
      "The patient with a CHANGE in condition takes priority over a patient with stable chronic findings"
    ],
    quiz: [
      {
        question: "A nurse has four patients. Which should be assessed FIRST?",
        options: ["Patient with chronic HF and 2+ pitting edema", "Patient 1-day post-op with new-onset chest pain", "Patient with diabetes requesting insulin education", "Patient with stable COPD on 2L nasal cannula"],
        correct: 1,
        rationale: "New-onset chest pain is an acute, potentially life-threatening finding (possible PE, MI). Acute takes priority over chronic stable conditions."
      },
      {
        question: "Using the ABC framework, which patient is the HIGHEST priority?",
        options: ["Patient with BP 88/56 and altered mental status", "Patient with RR 32 and SpO2 82%", "Patient with stridor and drooling after bee sting", "Patient with chest pain rated 7/10"],
        correct: 2,
        rationale: "Airway always comes first. Stridor and drooling suggest airway compromise (anaphylaxis). This is an Airway emergency — takes priority over Breathing and Circulation problems."
      }
    ]
  },

  "delegation-exam-scenarios": {
    title: "Delegation and Exam Scenarios",
    cellular: {
      title: "Delegation Principles for Nursing",
      content: "Delegation is the transfer of responsibility for performing a task while retaining accountability for the outcome. The nurse retains accountability for all delegated tasks. The Five Rights of Delegation guide safe practice: Right Task, Right Circumstance, Right Person, Right Direction/Communication, Right Supervision.\n\nTasks that CAN be delegated to UAP (unlicensed assistive personnel): vital signs on stable patients, ambulation, bathing, feeding, I&O measurement, fingerstick glucose. Tasks that CANNOT be delegated: assessment, teaching, evaluation, care planning, medication administration, and any task requiring clinical judgment.\n\nThe nurse must assess the patient first, determine appropriate delegation, provide clear instructions including expected outcomes and when to report back, and supervise/evaluate the delegated task."
    },
    riskFactors: [
      "Delegating assessment or clinical judgment tasks to UAP",
      "Insufficient communication of expectations and limits",
      "Failure to verify competency of delegatee",
      "Delegating unstable or complex patient care to LPN/UAP"
    ],
    diagnostics: [
      "Evaluate task complexity against delegatee's scope and competency",
      "Assess patient stability and predictability of outcomes",
      "Review institutional policies on delegation"
    ],
    management: [
      "Apply Five Rights of Delegation to every delegation decision",
      "RN retains assessment, teaching, evaluation, and care of unstable patients",
      "LPN can perform focused assessments, medication administration (with some restrictions), and care of stable patients"
    ],
    nursingActions: [
      "Assess patient stability BEFORE delegating any task",
      "Provide clear, specific instructions including what to report and when",
      "Follow up and evaluate outcomes of all delegated tasks"
    ],
    signs: {
      left: ["Appropriate delegation: stable patient, routine task, competent delegatee", "Clear communication with defined parameters", "Supervision and follow-up provided"],
      right: ["Inappropriate delegation: unstable patient tasks given to UAP", "Assessment or teaching delegated to non-RN", "No supervision or follow-up on delegated tasks"]
    },
    medications: [{
      name: "Insulin (delegation context)",
      type: "Hormone replacement",
      action: "Facilitates glucose uptake into cells",
      sideEffects: "Hypoglycemia, injection site reactions",
      contra: "Hypoglycemia (<70 mg/dL)",
      pearl: "UAP can perform fingerstick glucose but CANNOT administer insulin. RN or LPN must assess and administer; UAP reports the result."
    }],
    pearls: [
      "The nurse can DELEGATE a task but can NEVER delegate ACCOUNTABILITY",
      "If a question asks 'Which patient can be assigned to the LPN?' — choose the most STABLE, PREDICTABLE patient",
      "UAP can COLLECT data (VS, I&O, glucose) but cannot ASSESS, INTERPRET, or TEACH"
    ],
    quiz: [
      {
        question: "Which task can the nurse safely delegate to a UAP?",
        options: ["Initial assessment of a new admission", "Ambulating a stable postoperative patient", "Educating a patient on insulin administration", "Evaluating effectiveness of pain medication"],
        correct: 1,
        rationale: "Ambulating a stable postoperative patient is a routine task that does not require nursing judgment. Assessment, teaching, and evaluation cannot be delegated to UAP."
      },
      {
        question: "An RN has a UAP and an LPN on the team. Which patient should be assigned to the LPN?",
        options: ["A newly admitted patient requiring a comprehensive assessment", "A stable patient with a tracheostomy requiring routine suctioning", "A patient receiving IV chemotherapy", "A patient in the immediate post-cardiac catheterization period"],
        correct: 1,
        rationale: "A stable patient with predictable needs (routine tracheostomy care) is appropriate for the LPN. New admissions, chemotherapy, and unstable post-procedure patients require RN care."
      }
    ]
  },

  "nclex-question-strategies": {
    title: "Question Strategies",
    cellular: {
      title: "Test-Taking Framework",
      content: "The NCLEX uses Computer Adaptive Testing (CAT) that adjusts question difficulty based on performance. Questions test clinical judgment using the NCSBN Clinical Judgment Measurement Model (CJMM) with six cognitive skills: recognize cues, analyze cues, prioritize hypotheses, generate solutions, take action, evaluate outcomes.\n\nQuestion types include traditional multiple choice, select-all-that-apply (SATA), ordered response (drag and drop), hot spot, fill-in-the-blank calculation, and Next Generation (NGN) case studies with enhanced item types (matrix, cloze, bowtie, trend).\n\nKey strategies: read the question stem carefully for what is ACTUALLY being asked, identify the topic and framework (ABCs, Maslow, nursing process), eliminate obviously wrong answers, and choose the MOST correct answer. For priority questions, use ABC → Maslow → Acute vs Chronic → Assessment before Intervention."
    },
    riskFactors: [
      "Misreading the question stem or missing key words",
      "Overthinking and adding information not in the question",
      "Not applying prioritization frameworks systematically",
      "Test anxiety affecting performance and pacing"
    ],
    diagnostics: [
      "Identify the topic being tested (what system, what concept?)",
      "Determine the question type (priority, delegation, assessment, intervention)",
      "Apply the appropriate framework (ABC, Maslow, nursing process)"
    ],
    management: [
      "Read the LAST line of the question first to understand what is being asked",
      "Eliminate two obviously wrong answers first, then compare remaining choices",
      "For SATA: treat each option independently as true/false"
    ],
    nursingActions: [
      "Practice with NCLEX-style questions daily; review rationales for ALL options",
      "Use the process of elimination: remove clearly wrong answers first",
      "Manage test anxiety with deep breathing; trust your preparation"
    ],
    signs: {
      left: ["Priority question keywords: FIRST, BEST, MOST important, INITIAL", "Delegation keywords: delegate, assign, UAP, LPN", "Assessment keywords: assess, monitor, evaluate, check"],
      right: ["Intervention keywords: administer, implement, perform, provide", "Teaching keywords: educate, instruct, correct understanding", "Evaluation keywords: expected outcome, effective, resolved"]
    },
    medications: [{
      name: "NCLEX Medication Strategy",
      type: "Test-taking framework",
      action: "Apply drug classification knowledge — if you know the class, you can reason about unknown drugs",
      sideEffects: "Know common side effects by drug class (e.g., -olol = beta-blocker = bradycardia, hypotension)",
      contra: "Recognize contraindications by mechanism (e.g., beta-blockers in asthma, ACEi in pregnancy)",
      pearl: "Drug name stems reveal the class: -pril (ACEi), -sartan (ARB), -olol (beta-blocker), -dipine (CCB), -statin (HMG-CoA), -pam/-lam (benzo)"
    }],
    pearls: [
      "When two answers both seem correct, choose the one that is MOST inclusive or addresses the immediate need",
      "NCLEX wants the textbook answer, not the 'real world' answer — choose the ideal, evidence-based response",
      "For SATA: do not look for a pattern in the number of correct answers; each option stands alone"
    ],
    quiz: [
      {
        question: "A question asks: 'Which action should the nurse take FIRST?' What framework should you apply?",
        options: ["Choose the most complex intervention", "Apply ABCs → Maslow → Nursing Process → Acute vs Chronic", "Always choose assessment as the answer", "Select the option with the most detail"],
        correct: 1,
        rationale: "Priority questions use a hierarchy: Airway first, then Breathing, Circulation, then Maslow's (physiological before psychosocial), then Nursing Process (assess before intervene unless emergent)."
      },
      {
        question: "On a SATA question, you are sure about 3 options but unsure about a 4th. What should you do?",
        options: ["Select all options to be safe", "Only select the 3 you are certain about", "Evaluate the 4th option independently as true or false", "Skip the question"],
        correct: 2,
        rationale: "For SATA questions, evaluate each option independently as if it were a true/false question. Select or deselect each based on its own merit, not on how many you've already selected."
      }
    ]
  }
};
