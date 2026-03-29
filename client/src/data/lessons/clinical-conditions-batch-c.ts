import type { LessonContent } from "./types";

export const clinicalConditionsBatchCLessons: Record<string, LessonContent> = {
  "dka-management-rpn": {
    title: "Diabetic Ketoacidosis",
    cellular: {
      title: "Pathophysiology of DKA",
      content: "Diabetic ketoacidosis (DKA) occurs when absolute or relative insulin deficiency prevents glucose from entering cells, triggering lipolysis and hepatic ketogenesis. Free fatty acids are converted to ketone bodies (beta-hydroxybutyrate, acetoacetate, acetone), causing metabolic acidosis. Hyperglycemia causes osmotic diuresis, leading to severe dehydration and electrolyte losses. The nurse monitors vital signs, fluid intake/output, blood glucose levels, and reports changes to the nurse or provider."
    },
    riskFactors: [
      "Type 1 diabetes mellitus (most common)",
      "Infection or illness (leading precipitant)",
      "Non-adherence with insulin therapy",
      "New-onset diabetes (DKA as initial presentation)",
      "Medication changes (corticosteroids, SGLT2 inhibitors)",
      "Emotional or physical stress",
      "Alcohol or substance use",
      "Pump malfunction in insulin pump users"
    ],
    diagnostics: [
      "Monitor blood glucose levels every 1-2 hours as ordered",
      "Report blood glucose >250 mg/dL or <70 mg/dL",
      "Monitor strict intake and output and report urine output <30 mL/hr",
      "Report vital sign changes including tachycardia or hypotension",
      "Monitor level of consciousness and report changes",
      "Report fruity breath odor or Kussmaul respirations",
      "Monitor IV fluid infusion rate as ordered"
    ],
    management: [
      "Administer IV fluids as ordered (normal saline typically first)",
      "Administer insulin infusion as ordered by RN supervision",
      "Maintain NPO or clear liquid diet as ordered",
      "Ensure continuous cardiac monitoring is maintained",
      "Monitor and report electrolyte results as communicated",
      "Maintain strict bed rest during acute phase as ordered"
    ],
    nursingActions: [
      "Monitor blood glucose hourly as directed and record results",
      "Report blood glucose values outside ordered parameters immediately",
      "Assess and report signs of hypokalemia: muscle weakness, cardiac rhythm changes",
      "Monitor IV site for patency and infiltration",
      "Measure and document strict I&O every hour",
      "Report changes in mental status or new confusion",
      "Assess skin turgor and mucous membranes for dehydration",
      "Report Kussmaul respirations (deep, rapid breathing) to the RN"
    ],
    signs: {
      left: [
        "Polyuria and polydipsia",
        "Blood glucose >250 mg/dL",
        "Nausea and vomiting",
        "Abdominal pain"
      ],
      right: [
        "Kussmaul respirations (deep, rapid)",
        "Fruity acetone breath",
        "Altered mental status",
        "Signs of dehydration (poor turgor, dry mucosa)"
      ]
    },
    medications: [
      { name: "Regular Insulin (IV)", type: "Rapid-acting insulin", action: "Facilitates cellular glucose uptake and halts ketogenesis", sideEffects: "Hypoglycemia, hypokalemia", contra: "Potassium <3.3 mEq/L (must correct K+ first)", pearl: "Only regular insulin is given IV. Monitor glucose hourly and report values outside parameters as ordered." },
      { name: "Normal Saline (0.9% NaCl)", type: "Isotonic crystalloid", action: "Restores intravascular volume and corrects dehydration", sideEffects: "Fluid overload, hyperchloremic acidosis", contra: "Severe heart failure (use cautiously)", pearl: "Initial bolus of 1-2 L is typical. Monitor for crackles and JVD indicating fluid overload." },
      { name: "Potassium Chloride", type: "Electrolyte replacement", action: "Replaces potassium lost through osmotic diuresis and shifted intracellularly by insulin", sideEffects: "Hyperkalemia, cardiac arrhythmias", contra: "K+ >5.0 mEq/L, anuria", pearl: "Potassium must be replaced BEFORE insulin if K+ <3.3. Insulin drives K+ into cells, worsening hypokalemia." }
    ],
    pearls: [
      "Never start insulin until potassium is confirmed to be ≥3.3 mEq/L",
      "Kussmaul respirations are the body's attempt to blow off CO2 and compensate for metabolic acidosis",
      "Fruity breath odor indicates the presence of acetone from ketone production",
      "Report any change in level of consciousness immediately as it may indicate cerebral edema",
      "DKA can be the first presentation of undiagnosed type 1 diabetes"
    ],
    quiz: [
      { question: "Which sign should the nurse report immediately in a patient being treated for DKA?", options: ["Blood glucose of 180 mg/dL", "New-onset confusion and lethargy", "Mild thirst", "Urine output of 50 mL/hr"], correct: 1, rationale: "New-onset confusion or lethargy may indicate worsening acidosis or cerebral edema, both life-threatening complications requiring immediate reporting." },
      { question: "Why is potassium monitored closely during DKA treatment?", options: ["Insulin causes potassium to shift into cells, risking hypokalemia", "DKA causes permanent potassium elevation", "Potassium is unaffected by insulin therapy", "Potassium levels only matter post-recovery"], correct: 0, rationale: "Insulin drives potassium into cells. Even if serum K+ appears normal or high initially, total body potassium is depleted. Insulin administration can cause dangerous hypokalemia." },
      { question: "What type of breathing pattern is characteristic of DKA?", options: ["Cheyne-Stokes respirations", "Biot's respirations", "Kussmaul respirations", "Apneustic breathing"], correct: 2, rationale: "Kussmaul respirations (deep, rapid breathing) are the body's compensatory mechanism to blow off CO2 and counteract metabolic acidosis in DKA." }
    ]
  },

  "thyroid-storm-rpn": {
    title: "Thyroid Storm",
    cellular: {
      title: "Thyrotoxic Crisis Pathophysiology",
      content: "Thyroid storm is a life-threatening exacerbation of hyperthyroidism characterized by an acute surge in thyroid hormone action. Excessive T3 and T4 dramatically increase cellular metabolic rate, oxygen consumption, and heat production. Beta-adrenergic receptor sensitivity is amplified, causing severe tachycardia, hypertension, and cardiac dysfunction. Multi-organ failure can occur from hyperthermia, cardiovascular collapse, and CNS dysfunction. The nurse monitors vital signs, temperature, neurological status, and cardiac rhythm, reporting all changes immediately."
    },
    riskFactors: [
      "Uncontrolled or untreated Graves' disease",
      "Abrupt discontinuation of antithyroid medications",
      "Thyroid surgery or radioactive iodine treatment without adequate preparation",
      "Infection or sepsis in a hyperthyroid patient",
      "Trauma or surgery in an undiagnosed hyperthyroid patient",
      "Iodinated contrast media administration",
      "Diabetic ketoacidosis or other acute illness",
      "Pregnancy or labor (rare)"
    ],
    diagnostics: [
      "Monitor continuous vital signs and report tachycardia (HR often >140 bpm)",
      "Monitor temperature and report hyperthermia (>38.5°C)",
      "Assess and report changes in mental status (agitation, delirium, psychosis)",
      "Monitor cardiac rhythm continuously as directed",
      "Report new-onset tremors, diaphoresis, or extreme restlessness",
      "Monitor strict intake and output",
      "Report diarrhea, vomiting, or abdominal pain"
    ],
    management: [
      "Maintain a cool environment and apply cooling measures as ordered",
      "Administer medications as ordered on schedule",
      "Maintain IV fluid access and infusions as directed",
      "Provide calm, low-stimulation environment",
      "Maintain continuous cardiac monitoring",
      "Maintain bed rest and safety precautions (fall prevention)"
    ],
    nursingActions: [
      "Monitor vital signs every 15-30 minutes as directed",
      "Apply cooling blankets and administer acetaminophen as ordered for hyperthermia",
      "Report heart rate >140 bpm or new irregular rhythms immediately",
      "Monitor for signs of heart failure: dyspnea, crackles, JVD",
      "Assess neurological status hourly and report confusion or obtundation",
      "Ensure adequate fluid intake and report signs of dehydration",
      "Administer antithyroid medications as ordered at scheduled times",
      "Avoid aspirin for fever (displaces thyroid hormone from binding proteins, worsening crisis)"
    ],
    signs: {
      left: [
        "Severe tachycardia (HR >140 bpm)",
        "High fever (>40°C/104°F)",
        "Profuse diaphoresis",
        "Tremors and agitation"
      ],
      right: [
        "Altered mental status (delirium, psychosis, coma)",
        "Nausea, vomiting, diarrhea",
        "Heart failure symptoms",
        "Jaundice (hepatic dysfunction)"
      ]
    },
    medications: [
      { name: "Propranolol", type: "Non-selective beta-blocker", action: "Controls tachycardia, hypertension, tremor, and blocks peripheral T4-to-T3 conversion", sideEffects: "Bradycardia, hypotension, bronchospasm", contra: "Severe heart failure, asthma, severe bradycardia", pearl: "First-line for symptom control in thyroid storm. Administer as ordered and report HR <60 or SBP <90." },
      { name: "Propylthiouracil (PTU)", type: "Thionamide antithyroid agent", action: "Blocks thyroid hormone synthesis and peripheral T4-to-T3 conversion", sideEffects: "Hepatotoxicity, agranulocytosis, rash", contra: "History of PTU-induced hepatotoxicity", pearl: "Preferred over methimazole in thyroid storm because it also blocks peripheral conversion. Report sore throat or fever (agranulocytosis risk)." },
      { name: "Acetaminophen", type: "Antipyretic", action: "Reduces fever through central thermoregulation", sideEffects: "Hepatotoxicity at high doses", contra: "Severe hepatic impairment", pearl: "Use acetaminophen, NOT aspirin, for fever in thyroid storm. Aspirin displaces T4 from protein binding, increasing free thyroid hormone levels." }
    ],
    pearls: [
      "Never give aspirin in thyroid storm — it increases free T4 by displacing thyroid hormone from binding proteins",
      "Thyroid storm is a clinical diagnosis scored on the Burch-Wartofsky scale",
      "Report any heart rate >140 or temperature >40°C immediately as these indicate worsening crisis",
      "Maintain a quiet, cool environment to reduce metabolic demands",
      "Thyroid storm has a mortality rate of 10-30% even with treatment"
    ],
    quiz: [
      { question: "Which medication should be AVOIDED for fever in a patient with thyroid storm?", options: ["Acetaminophen", "Aspirin", "Cooling blankets", "Propranolol"], correct: 1, rationale: "Aspirin displaces thyroid hormone from binding proteins, increasing free T4 levels and worsening the thyrotoxic state. Use acetaminophen instead." },
      { question: "What vital sign finding is most characteristic of thyroid storm?", options: ["Bradycardia and hypothermia", "Severe tachycardia with high fever", "Hypertension with slow pulse", "Normal temperature with low blood pressure"], correct: 1, rationale: "Thyroid storm presents with severe tachycardia (often >140 bpm) and high fever (>40°C) due to the hypermetabolic state from excessive thyroid hormone." },
      { question: "The nurse notes that a patient with thyroid storm becomes confused and agitated. What is the priority action?", options: ["Apply physical restraints", "Report the change in mental status to the nurse immediately", "Increase room temperature for comfort", "Administer aspirin for presumed fever"], correct: 1, rationale: "Altered mental status in thyroid storm indicates potential progression to thyrotoxic coma, requiring immediate reporting and medical intervention." }
    ]
  },

  "sepsis-management-rpn": {
    title: "Sepsis & Septic Shock",
    cellular: {
      title: "Infection-Driven Systemic Inflammatory",
      content: "Sepsis occurs when the body's immune response to infection becomes dysregulated, causing widespread tissue damage rather than contained pathogen elimination. Bacterial endotoxins and inflammatory mediators (TNF-alpha, interleukins) trigger systemic vasodilation, capillary leak, and microvascular thrombosis. This leads to tissue hypoperfusion, cellular hypoxia, and progressive organ dysfunction. Septic shock adds persistent hypotension unresponsive to fluid resuscitation, requiring vasopressors. The nurse monitors vital signs, urine output, and level of consciousness, reporting early warning signs to the nursing team."
    },
    riskFactors: [
      "Age >65 years or neonates",
      "Immunosuppression (chemotherapy, organ transplant, HIV, chronic steroids)",
      "Chronic diseases (diabetes, CKD, liver disease, COPD)",
      "Indwelling devices (central lines, urinary catheters, ventilators)",
      "Recent surgery or invasive procedures",
      "Nursing home or long-term care residence",
      "IV drug use",
      "Malnutrition"
    ],
    diagnostics: [
      "Monitor vital signs every 1-2 hours as directed",
      "Report any two or more SIRS criteria: temp >38°C or <36°C, HR >90, RR >20, WBC >12,000 or <4,000",
      "Monitor urine output hourly and report <0.5 mL/kg/hr",
      "Assess and report changes in mental status (confusion, lethargy)",
      "Monitor oxygen saturation and report SpO2 <92%",
      "Report skin changes: mottling, cool extremities, delayed capillary refill",
      "Monitor blood glucose and report hyperglycemia"
    ],
    management: [
      "Assist with obtaining blood cultures before antibiotic administration as directed",
      "Administer IV fluids and antibiotics as ordered on time",
      "Maintain oxygen therapy as ordered",
      "Keep the patient on continuous monitoring",
      "Maintain IV access and report infiltration or line issues",
      "Administer vasopressors through central line as directed (monitor only)"
    ],
    nursingActions: [
      "Perform vital sign assessment every 15-30 minutes during acute phase as directed",
      "Measure strict I&O and report urine output <0.5 mL/kg/hr",
      "Assess skin color, temperature, and capillary refill every assessment",
      "Report changes in level of consciousness immediately",
      "Monitor IV fluid rate and report when fluid bolus is complete",
      "Report signs of fluid overload: crackles, JVD, peripheral edema",
      "Assist with repositioning every 2 hours to prevent skin breakdown",
      "Monitor and report trends in temperature (new fever or hypothermia)"
    ],
    signs: {
      left: [
        "Fever >38°C or hypothermia <36°C",
        "Tachycardia (HR >90 bpm)",
        "Tachypnea (RR >20)",
        "Warm, flushed skin (early/warm sepsis)"
      ],
      right: [
        "Hypotension (SBP <90 or MAP <65)",
        "Altered mental status and confusion",
        "Oliguria (<0.5 mL/kg/hr urine output)",
        "Cool, mottled extremities (late/cold sepsis)"
      ]
    },
    medications: [
      { name: "Norepinephrine", type: "Vasopressor", action: "Alpha-1 agonist causing vasoconstriction to raise blood pressure", sideEffects: "Peripheral ischemia, arrhythmias, tissue necrosis if extravasated", contra: "Hypovolemia not yet corrected", pearl: "First-line vasopressor for septic shock. Must be administered via central line. Report any signs of extravasation immediately." },
      { name: "Normal Saline", type: "Isotonic crystalloid", action: "Expands intravascular volume to improve tissue perfusion", sideEffects: "Fluid overload, hyperchloremic acidosis", contra: "Volume overload with pulmonary edema", pearl: "Initial resuscitation: 30 mL/kg within first 3 hours per Surviving Sepsis Campaign guidelines. Report crackles or respiratory distress." },
      { name: "Broad-Spectrum Antibiotics", type: "Antimicrobial", action: "Kill or inhibit growth of causative bacteria before culture results are available", sideEffects: "Allergic reactions, C. difficile risk, nephrotoxicity (aminoglycosides)", contra: "Known allergy (verify allergy status before administration)", pearl: "Antibiotics must be administered within 1 hour of sepsis recognition. Each hour of delay increases mortality by approximately 7.6%." }
    ],
    pearls: [
      "Time is critical in sepsis: the 1-hour bundle includes blood cultures, antibiotics, fluids, and lactate measurement",
      "Report any new confusion in an elderly patient — altered mental status may be the first sign of sepsis",
      "Hypothermia (<36°C) in sepsis is an ominous sign and carries worse prognosis than fever",
      "Mottled skin and cool extremities indicate progression from warm to cold septic shock",
      "Always verify antibiotic allergies before administering the first dose"
    ],
    quiz: [
      { question: "Which finding should the nurse report immediately as a potential early sign of sepsis?", options: ["Blood pressure of 125/78 mmHg", "Temperature of 37.2°C", "New confusion with HR 105 and RR 24", "Urine output of 100 mL/hr"], correct: 2, rationale: "New confusion combined with tachycardia (HR >90) and tachypnea (RR >20) meets SIRS criteria and suggests early sepsis requiring immediate evaluation." },
      { question: "Why must antibiotics be administered within 1 hour of sepsis recognition?", options: ["Hospital policy requires documentation within 1 hour", "Each hour of delay increases mortality by approximately 7.6%", "Antibiotics lose potency after 1 hour", "Insurance requires timely administration"], correct: 1, rationale: "Research from the Surviving Sepsis Campaign demonstrates that each hour of antibiotic delay in sepsis increases mortality by approximately 7.6%." },
      { question: "Which skin finding indicates progression from early to late septic shock?", options: ["Warm, flushed skin", "Cool, mottled extremities", "Normal skin color and temperature", "Generalized rash"], correct: 1, rationale: "Cool, mottled extremities indicate vasoconstriction from failing compensatory mechanisms, suggesting progression from warm (vasodilated) to cold (vasoconstricted) septic shock." }
    ]
  },

  "sepsis-management-rn": {
    title: "Sepsis & Septic Shock",
    cellular: {
      title: "Sepsis Pathophysiology",
      content: "Sepsis is defined as life-threatening organ dysfunction caused by a dysregulated host response to infection (Sepsis-3 definition). Pathogen-associated molecular patterns (PAMPs) activate innate immune cells, triggering a cytokine storm (TNF-alpha, IL-1, IL-6). This produces systemic vasodilation (low SVR), increased capillary permeability, and microthrombi formation. The result is distributive shock with relative hypovolemia and maldistribution of blood flow. Lactate accumulates as tissues shift to anaerobic metabolism from hypoperfusion. Organ dysfunction manifests as acute kidney injury (oliguria), ARDS (refractory hypoxemia), hepatic dysfunction (coagulopathy, jaundice), and encephalopathy (altered mental status). The nurse implements the sepsis bundle, manages fluid resuscitation and vasopressors, performs serial reassessments, and coordinates the interdisciplinary response."
    },
    riskFactors: [
      "Extremes of age (neonates, elderly >65)",
      "Immunocompromised status (neutropenia, transplant, biologics, HIV/AIDS)",
      "Diabetes mellitus",
      "Chronic kidney or liver disease",
      "Indwelling medical devices (CVC, Foley catheter, ventilator)",
      "Recent hospitalization or surgery",
      "Community sources: pneumonia (most common), UTI, abdominal infection, skin/soft tissue",
      "Long-term care facility residence"
    ],
    diagnostics: [
      "Obtain two sets of blood cultures (aerobic and anaerobic) from two sites BEFORE antibiotics",
      "Order stat serum lactate: ≥2 mmol/L indicates tissue hypoperfusion; ≥4 mmol/L = severe",
      "Calculate qSOFA score: RR ≥22, altered mentation, SBP ≤100 (≥2 = high risk)",
      "Calculate SOFA score for organ dysfunction severity",
      "Order CBC with differential, CMP, coagulation studies (PT/INR, fibrinogen)",
      "Obtain procalcitonin (>0.5 ng/mL suggests bacterial infection)",
      "Obtain source-specific cultures: urine, sputum, wound, CSF as indicated",
      "Order imaging to identify source: chest X-ray, CT abdomen, ultrasound"
    ],
    management: [
      "Implement the Surviving Sepsis Campaign 1-hour bundle: cultures, antibiotics, fluids, lactate, vasopressors",
      "Administer broad-spectrum antibiotics within 1 hour of recognition (de-escalate when cultures return)",
      "Administer 30 mL/kg IV crystalloid for hypotension or lactate ≥4 within first 3 hours",
      "Initiate norepinephrine via central line if MAP remains <65 mmHg after fluid resuscitation",
      "Reassess volume status with dynamic measures: passive leg raise, pulse pressure variation",
      "Target MAP ≥65 mmHg and urine output ≥0.5 mL/kg/hr",
      "Repeat lactate within 2-4 hours; target ≥10% decrease as marker of adequate resuscitation",
      "Implement lung-protective ventilation if ARDS develops (TV 6 mL/kg ideal body weight)"
    ],
    nursingActions: [
      "Recognize sepsis early using screening tools (qSOFA, SIRS criteria, clinical judgment)",
      "Obtain blood cultures from two sites before antibiotics; do not delay antibiotics for cultures",
      "Administer first antibiotic within 1 hour of sepsis recognition (time-zero documentation)",
      "Monitor hemodynamic response to fluid boluses: reassess BP, HR, urine output, lactate",
      "Perform passive leg raise test to assess fluid responsiveness before additional boluses",
      "Monitor central venous pressure (CVP) and ScvO2 if central line is in place",
      "Assess for signs of multi-organ dysfunction: AKI, ARDS, DIC, hepatic failure",
      "Document time of sepsis recognition and bundle completion for quality metrics"
    ],
    signs: {
      left: [
        "Fever >38.3°C or hypothermia <36°C",
        "Tachycardia (HR >90 bpm)",
        "Tachypnea (RR ≥22/min)",
        "Leukocytosis (>12,000) or leukopenia (<4,000)",
        "Elevated lactate ≥2 mmol/L",
        "Elevated procalcitonin",
        "Warm, bounding pulses (early distributive phase)"
      ],
      right: [
        "Hypotension refractory to fluids (septic shock)",
        "MAP <65 mmHg",
        "Oliguria or anuria (AKI)",
        "Altered mental status (septic encephalopathy)",
        "Mottled, cool extremities (late phase)",
        "Coagulopathy (DIC signs: petechiae, oozing, elevated D-dimer)",
        "Refractory hypoxemia (ARDS)"
      ]
    },
    medications: [
      { name: "Norepinephrine", type: "First-line vasopressor", action: "Alpha-1 agonist (vasoconstriction) with mild beta-1 effect (inotropy); raises MAP by increasing SVR", sideEffects: "Digital ischemia, arrhythmias, tissue necrosis with extravasation", contra: "Uncorrected hypovolemia (must attempt fluid resuscitation first)", pearl: "First-line vasopressor per SSC guidelines. Central line preferred. Start at 0.1-0.5 mcg/kg/min. Add vasopressin as second-line if norepinephrine >0.25-0.5 mcg/kg/min needed." },
      { name: "Vasopressin", type: "Second-line vasopressor", action: "V1 receptor agonist causing vasoconstriction independent of catecholamine receptors", sideEffects: "Digital ischemia, mesenteric ischemia, hyponatremia", contra: "Not used as sole vasopressor (adjunct to norepinephrine)", pearl: "Fixed dose of 0.03-0.04 units/min. Not titrated. Added when norepinephrine requirements are escalating. Allows norepinephrine dose reduction." },
      { name: "Hydrocortisone", type: "Corticosteroid", action: "Reverses relative adrenal insufficiency and enhances vascular responsiveness to catecholamines", sideEffects: "Hyperglycemia, immunosuppression, GI bleeding, myopathy", contra: "Not recommended unless vasopressor-dependent (escalating doses)", pearl: "200 mg/day IV (50 mg every 6 hours). Only indicated in refractory septic shock requiring escalating vasopressors. Helps wean vasopressors." },
      { name: "Meropenem", type: "Carbapenem (broad-spectrum antibiotic)", action: "Binds penicillin-binding proteins to inhibit cell wall synthesis; covers gram-positive, gram-negative, and anaerobes", sideEffects: "Seizures (lower threshold), diarrhea, C. difficile, hypersensitivity", contra: "Known carbapenem allergy, history of seizures (use with caution)", pearl: "Empiric choice for severe sepsis when MDR organisms or intra-abdominal source suspected. De-escalate based on culture sensitivity within 48-72 hours." }
    ],
    pearls: [
      "The Surviving Sepsis 1-hour bundle: Measure lactate, obtain blood cultures, administer broad-spectrum antibiotics, begin 30 mL/kg crystalloid for hypotension/lactate ≥4, apply vasopressors if MAP <65 after fluids",
      "Lactate clearance ≥10% in 2-4 hours is a key marker of adequate resuscitation",
      "Blood cultures should be obtained before antibiotics but should NEVER delay antibiotic administration beyond 1 hour",
      "Hypothermia in sepsis carries a higher mortality rate than fever and may indicate immune exhaustion",
      "The qSOFA score (RR ≥22, altered mentation, SBP ≤100) identifies patients at highest risk for poor outcomes"
    ],
    quiz: [
      { question: "A patient with sepsis receives 30 mL/kg of IV crystalloid but MAP remains 58 mmHg. What is the priority intervention?", options: ["Administer another fluid bolus of 30 mL/kg", "Start norepinephrine infusion via central line", "Switch to colloid fluids", "Obtain an echocardiogram"], correct: 1, rationale: "Per SSC guidelines, norepinephrine is the first-line vasopressor initiated when MAP remains <65 mmHg despite adequate fluid resuscitation (30 mL/kg)." },
      { question: "What is the significance of a lactate level of 4.5 mmol/L in sepsis?", options: ["It is within normal limits", "It indicates severe tissue hypoperfusion and high mortality risk", "It only matters if the patient has diabetes", "It should be rechecked in 24 hours"], correct: 1, rationale: "Lactate ≥4 mmol/L indicates severe tissue hypoperfusion with anaerobic metabolism. It is associated with significantly increased mortality and mandates aggressive resuscitation." },
      { question: "Which action takes priority when sepsis is recognized in a patient with an unknown organism?", options: ["Wait for culture results before starting antibiotics", "Administer broad-spectrum antibiotics within 1 hour", "Start vasopressors immediately", "Obtain CT scan of the chest"], correct: 1, rationale: "Broad-spectrum antibiotics must be administered within 1 hour of sepsis recognition. Each hour of delay increases mortality by ~7.6%. Cultures should be drawn before antibiotics but must not delay administration." }
    ]
  },

  "sepsis-management-np": {
    title: "Sepsis & Septic Shock",
    cellular: {
      title: "Advanced Sepsis Immunopathology",
      content: "Sepsis pathogenesis involves a dual-phase immune response. The initial hyperinflammatory phase features activation of pattern recognition receptors (TLRs, NOD-like receptors) by PAMPs, triggering NF-κB-mediated cytokine release (TNF-alpha, IL-1β, IL-6). This cascade activates the complement system, coagulation cascade (tissue factor pathway), and endothelial dysfunction. Nitric oxide overproduction causes refractory vasodilation. Glycocalyx degradation increases capillary permeability. Subsequently, an immunosuppressive phase (immune paralysis) develops with lymphocyte apoptosis, monocyte deactivation, and increased susceptibility to secondary infections. Organ dysfunction is quantified by the SOFA score: a ≥2-point increase identifies sepsis. Septic shock is sepsis with vasopressor requirement to maintain MAP ≥65 and lactate >2 despite adequate fluid resuscitation. The clinician orders the initial resuscitation protocol, prescribes empiric antimicrobials, initiates vasopressor therapy, identifies and controls the infectious source, and manages multi-organ support."
    },
    riskFactors: [
      "Extremes of age with immunosenescence",
      "Immunosuppression: neutropenia (ANC <500), solid organ transplant, biologics, chronic corticosteroids",
      "Diabetes mellitus with microvascular disease",
      "Chronic organ dysfunction (CKD, cirrhosis, COPD, heart failure)",
      "Healthcare-associated risk: central venous catheters, urinary catheters, mechanical ventilation",
      "Recent antibiotic exposure (selecting resistant organisms)",
      "Splenectomy or functional asplenia",
      "Substance use disorder (IVDU, alcohol use disorder)"
    ],
    diagnostics: [
      "Order sepsis panel: CBC/diff, CMP, lactate, procalcitonin, blood cultures x2, coagulation studies",
      "Order organ-specific biomarkers: troponin (myocardial dysfunction), lipase, hepatic panel",
      "Calculate SOFA score: PaO2/FiO2 ratio, platelet count, bilirubin, MAP/vasopressors, GCS, creatinine/UOP",
      "Order source-directed imaging: CT abdomen/pelvis with contrast, chest X-ray, ultrasound",
      "Obtain procalcitonin trending: >0.5 strongly suggests bacterial infection; useful for antibiotic de-escalation",
      "Order DIC panel if coagulopathy suspected: fibrinogen, D-dimer, PT/INR, peripheral smear for schistocytes",
      "Consider echocardiogram to assess for sepsis-induced cardiomyopathy (new LV dysfunction)",
      "Calculate predicted fluid responsiveness: pulse pressure variation, IVC ultrasound, passive leg raise"
    ],
    management: [
      "Order SSC 1-hour bundle: lactate, blood cultures, broad-spectrum antibiotics, 30 mL/kg crystalloid (if hypotensive/lactate ≥4), vasopressors (if MAP <65 post-fluids)",
      "Prescribe empiric antibiotics based on suspected source and local antibiogram: adjust within 48-72 hours based on culture sensitivity",
      "Prescribe norepinephrine 0.1-0.5 mcg/kg/min via CVC as first-line vasopressor; titrate to MAP ≥65",
      "Add vasopressin 0.03-0.04 units/min (fixed dose) as catecholamine-sparing agent if norepinephrine >0.25 mcg/kg/min",
      "Prescribe stress-dose hydrocortisone 200 mg/day IV if refractory shock despite dual vasopressors",
      "Order source control within 6-12 hours: surgical drainage, device removal, debridement",
      "Prescribe lung-protective ventilation if intubated: TV 6 mL/kg IBW, PEEP per ARDSNet table, plateau pressure <30",
      "Order renal replacement therapy (CRRT) for severe AKI with volume overload or metabolic derangements"
    ],
    nursingActions: [
      "Implement sepsis screening protocol with automated EHR alerts for early identification",
      "Prescribe initial empiric antimicrobial regimen covering likely pathogens based on source",
      "Assess fluid responsiveness using dynamic parameters before each bolus beyond initial resuscitation",
      "Order arterial line and central venous catheter for continuous hemodynamic monitoring",
      "Calculate and trend SOFA score every 6-12 hours to assess organ dysfunction trajectory",
      "Consider adding phenylephrine or epinephrine as third-line vasopressor in refractory shock",
      "Manage blood glucose with insulin infusion targeting 140-180 mg/dL (avoid tight glucose control)",
      "Coordinate goals of care discussion early if multi-organ failure progresses despite maximal therapy"
    ],
    signs: {
      left: [
        "SOFA score increase ≥2 from baseline",
        "qSOFA ≥2 (RR ≥22, AMS, SBP ≤100)",
        "Lactate ≥2 mmol/L (≥4 = severe)",
        "Procalcitonin >0.5 ng/mL",
        "Positive blood cultures",
        "Leukocytosis or leukopenia with bandemia",
        "Coagulopathy (elevated PT/INR, low fibrinogen)"
      ],
      right: [
        "Refractory hypotension (MAP <65 despite fluids and vasopressors)",
        "Lactate >4 with failure to clear despite resuscitation",
        "Multi-organ dysfunction (AKI + ARDS + hepatic failure)",
        "DIC with microangiopathic hemolytic anemia",
        "Sepsis-induced cardiomyopathy (new LV dysfunction)",
        "ARDS (PaO2/FiO2 <300)",
        "Immune paralysis phase (secondary nosocomial infections)"
      ]
    },
    medications: [
      { name: "Piperacillin-Tazobactam", type: "Beta-lactam/beta-lactamase inhibitor", action: "Broad-spectrum bactericidal activity against gram-positive, gram-negative, and anaerobes by inhibiting cell wall synthesis", sideEffects: "Hypersensitivity, seizures (high dose), cytopenias, C. difficile", contra: "Penicillin allergy (cross-reactivity), history of piperacillin-associated hepatitis", pearl: "Common empiric choice for undifferentiated sepsis. Consider extended infusion (4 hours) for improved pharmacodynamic coverage. De-escalate within 48-72 hours." },
      { name: "Vancomycin", type: "Glycopeptide antibiotic", action: "Inhibits cell wall synthesis in gram-positive organisms including MRSA", sideEffects: "Nephrotoxicity, red man syndrome (infusion-rate related), ototoxicity", contra: "Previous vancomycin-associated nephrotoxicity (consider alternatives: linezolid, daptomycin)", pearl: "Load with 25-30 mg/kg IV, then dose by AUC/MIC monitoring (target AUC 400-600). Always infuse over ≥1 hour to prevent red man syndrome." },
      { name: "Norepinephrine", type: "First-line vasopressor", action: "Potent alpha-1 agonist with mild beta-1 activity; increases SVR and MAP", sideEffects: "Peripheral and mesenteric ischemia, arrhythmias, extravasation necrosis", contra: "Not used until adequate volume resuscitation attempted", pearl: "SSC first-line vasopressor. Start 0.1 mcg/kg/min, titrate to MAP ≥65. If >0.5 mcg/kg/min required, add vasopressin and consider stress-dose steroids." },
      { name: "Vasopressin", type: "Non-catecholamine vasopressor", action: "Acts on V1 receptors in vascular smooth muscle; restores vascular tone through catecholamine-independent pathway", sideEffects: "Digital ischemia, splanchnic ischemia, hyponatremia, skin necrosis", contra: "Should not be used as single first-line agent", pearl: "Fixed dose 0.03-0.04 units/min — do NOT titrate. Added as catecholamine-sparing agent. Particularly useful when metabolic acidosis impairs catecholamine receptor response." }
    ],
    pearls: [
      "Sepsis-3 definition: life-threatening organ dysfunction (SOFA ≥2) caused by dysregulated host response to infection",
      "The SSC 1-hour bundle is associated with 20-30% reduction in mortality when fully completed within 1 hour",
      "Balanced crystalloids (lactated Ringer's) may be preferred over normal saline for large-volume resuscitation to avoid hyperchloremic acidosis",
      "Source control (drainage, debridement, device removal) within 6-12 hours is as critical as antibiotics",
      "Procalcitonin-guided antibiotic de-escalation can safely reduce antibiotic duration without increasing mortality"
    ],
    quiz: [
      { question: "A patient with septic shock on norepinephrine 0.4 mcg/kg/min has MAP 60 mmHg. What is the next vasopressor to add?", options: ["Dopamine", "Vasopressin 0.03-0.04 units/min", "Phenylephrine", "Dobutamine"], correct: 1, rationale: "Per SSC guidelines, vasopressin (0.03-0.04 units/min fixed dose) is the recommended second-line vasopressor added to norepinephrine. It works via a different receptor pathway and allows catecholamine dose reduction." },
      { question: "Which SOFA score change identifies sepsis per the Sepsis-3 definition?", options: ["Any SOFA score elevation", "SOFA score ≥2 increase from baseline", "SOFA score >10", "SOFA score decrease of 2 points"], correct: 1, rationale: "Sepsis-3 defines sepsis as suspected infection with a SOFA score increase of ≥2 points from baseline, reflecting acute organ dysfunction." },
      { question: "When should stress-dose hydrocortisone be initiated in septic shock?", options: ["In all sepsis cases on admission", "When vasopressor requirements are escalating despite adequate resuscitation", "Only after blood cultures return positive", "When lactate normalizes"], correct: 1, rationale: "Stress-dose hydrocortisone (200 mg/day) is reserved for septic shock refractory to fluids and vasopressors. It treats relative adrenal insufficiency and improves vasopressor responsiveness." }
    ]
  },

  "antibiotic-stewardship-rpn": {
    title: "Antibiotic Stewardship",
    cellular: {
      title: "Mechanisms of Antibiotic Resistance",
      content: "Antibiotic resistance develops through genetic mutations or horizontal gene transfer (plasmids, transposons, transformation) that allow bacteria to survive antibiotic exposure. Resistance mechanisms include: enzymatic inactivation (beta-lactamases destroying penicillins), altered target sites (PBP mutations in MRSA), efflux pumps (tetracycline resistance), reduced permeability (porin channel mutations in gram-negatives), and biofilm formation. Inappropriate antibiotic use (unnecessary prescribing, subtherapeutic dosing, incomplete courses) accelerates selection of resistant organisms. The nurse contributes to stewardship by administering antibiotics at the correct time, reporting adverse effects, and educating patients on adherence."
    },
    riskFactors: [
      "Unnecessary antibiotic prescribing for viral infections",
      "Incomplete antibiotic courses by patients",
      "Prolonged or repeated antibiotic exposure",
      "Use of broad-spectrum antibiotics when narrow-spectrum would suffice",
      "Healthcare-associated infections from resistant organisms",
      "Immunocompromised patients requiring frequent antibiotic courses",
      "Agricultural antibiotic overuse in food animals",
      "Patient self-medication with leftover antibiotics"
    ],
    diagnostics: [
      "Report fever patterns and trends to the nursing team",
      "Collect specimens for culture as ordered (urine, sputum, wound, blood) using proper technique",
      "Report signs of infection: redness, warmth, swelling, purulent drainage",
      "Monitor and report antibiotic side effects (GI upset, rash, diarrhea)",
      "Monitor for signs of C. difficile infection: watery diarrhea ≥3 episodes/day",
      "Report signs of allergic reaction: rash, hives, difficulty breathing"
    ],
    management: [
      "Administer antibiotics at the exact scheduled time as ordered",
      "Ensure specimens are collected BEFORE the first antibiotic dose when directed",
      "Administer the full course as ordered without skipping doses",
      "Report missed doses immediately to the RN",
      "Monitor IV antibiotic infusion rates and site integrity",
      "Educate patients on the importance of completing the full antibiotic course"
    ],
    nursingActions: [
      "Administer antibiotics within the ordered time window (typically within 30 minutes of scheduled time)",
      "Verify patient allergies before every antibiotic administration",
      "Collect cultures using aseptic technique before antibiotics when ordered",
      "Monitor for adverse effects and report: rash, diarrhea, oral thrush, anaphylaxis signs",
      "Report signs of C. difficile: watery diarrhea, abdominal cramping, fever",
      "Educate patients not to share antibiotics or save leftover medications",
      "Reinforce the importance of completing the full prescribed course even if feeling better",
      "Practice hand hygiene and infection prevention measures consistently"
    ],
    signs: {
      left: [
        "Persistent fever despite antibiotic therapy",
        "New-onset watery diarrhea (C. difficile risk)",
        "Rash or hives after antibiotic administration",
        "Oral thrush (fungal overgrowth)"
      ],
      right: [
        "Worsening infection signs despite antibiotics",
        "Severe diarrhea with abdominal pain (C. difficile)",
        "Anaphylaxis: urticaria, angioedema, bronchospasm",
        "Red man syndrome (vancomycin infusion too fast)"
      ]
    },
    medications: [
      { name: "Amoxicillin", type: "Aminopenicillin", action: "Inhibits bacterial cell wall synthesis by binding penicillin-binding proteins", sideEffects: "Diarrhea, rash, allergic reactions", contra: "Penicillin allergy, mononucleosis (causes rash)", pearl: "Common first-line narrow-spectrum antibiotic. Always verify penicillin allergy status. Administer as ordered and report any rash." },
      { name: "Ciprofloxacin", type: "Fluoroquinolone", action: "Inhibits DNA gyrase and topoisomerase IV, preventing bacterial DNA replication", sideEffects: "Tendon rupture, peripheral neuropathy, QT prolongation, C. difficile risk", contra: "Concurrent use with tizanidine, myasthenia gravis, children <18 (relative)", pearl: "Black box warning for tendinitis and tendon rupture. Report Achilles pain immediately. Reserved for infections without safer alternatives." },
      { name: "Metronidazole", type: "Nitroimidazole", action: "Forms toxic metabolites that damage bacterial DNA; effective against anaerobes and C. difficile", sideEffects: "Metallic taste, nausea, peripheral neuropathy, disulfiram-like reaction with alcohol", contra: "First trimester pregnancy, concurrent alcohol use", pearl: "Educate patients about the severe disulfiram-like reaction with alcohol: avoid alcohol during treatment and for 48 hours after completion." }
    ],
    pearls: [
      "Always verify antibiotic allergies before the first dose and with each subsequent administration",
      "Time-sensitive antibiotics (those ordered every 6 or 8 hours) must be given on schedule to maintain therapeutic levels",
      "New-onset diarrhea during antibiotic therapy may indicate C. difficile infection — report immediately",
      "Cultures must be collected BEFORE antibiotic administration to avoid false-negative results",
      "Hand hygiene is the single most important intervention for preventing healthcare-associated infections"
    ],
    quiz: [
      { question: "When should cultures be collected relative to antibiotic administration?", options: ["After the second dose of antibiotics", "Before the first dose of antibiotics", "It does not matter when cultures are collected", "Only if the patient develops a fever"], correct: 1, rationale: "Cultures must be collected BEFORE the first antibiotic dose to avoid false-negative results. Antibiotics can suppress bacterial growth in culture media." },
      { question: "A patient on antibiotics develops three episodes of watery diarrhea in 12 hours. What should the nurse report?", options: ["This is a normal side effect that requires no action", "Report possible C. difficile infection to the nurse immediately", "Increase the patient's fluid intake and continue monitoring", "Hold all medications until the diarrhea resolves"], correct: 1, rationale: "Three or more episodes of watery diarrhea during antibiotic therapy is suspicious for C. difficile infection, which requires immediate reporting, testing, and potential isolation." },
      { question: "Why is it important to administer antibiotics at the scheduled time?", options: ["For documentation purposes only", "To maintain therapeutic drug levels and ensure effectiveness", "Hospital policy requires it but it has no clinical impact", "Patients prefer a regular medication schedule"], correct: 1, rationale: "Maintaining consistent antibiotic levels above the minimum inhibitory concentration (MIC) is essential for killing bacteria. Delayed or missed doses allow bacterial regrowth and can promote resistance." }
    ]
  },

  "antibiotic-stewardship-rn": {
    title: "Antibiotic Stewardship",
    cellular: {
      title: "Resistance Mechanisms & Pharmacodynamics of Antibiotic Resistance",
      content: "Antibiotic stewardship encompasses systematic strategies to optimize antimicrobial use, improve patient outcomes, and reduce the emergence of resistant organisms. Understanding resistance mechanisms at the molecular level is essential for RN-level clinical decision-making.\n\nBeta-lactamase production is the most common resistance mechanism in gram-negative bacteria. These enzymes hydrolyze the beta-lactam ring, rendering penicillins, cephalosporins, and carbapenems inactive. Extended-spectrum beta-lactamases (ESBLs), primarily CTX-M enzymes encoded on mobile plasmids, confer resistance to third-generation cephalosporins (ceftriaxone, ceftazidime) and are treated with carbapenems. Carbapenem-resistant Enterobacterales (CRE) produce carbapenemases (KPC in K. pneumoniae, NDM-1 in E. coli) that destroy even last-resort carbapenems — these infections carry 40-50% mortality and require ceftazidime-avibactam or polymyxin-based regimens.\n\nEfflux pumps are transmembrane protein complexes that actively transport antibiotics out of the bacterial cell before they can reach their intracellular targets. Multiple families exist: MexAB-OprM in Pseudomonas aeruginosa confers resistance to beta-lactams, fluoroquinolones, and chloramphenicol simultaneously. Efflux pump overexpression is a major contributor to multidrug resistance (MDR), as a single pump system can expel multiple antibiotic classes.\n\nTarget modification alters the antibiotic's binding site, reducing drug affinity. The mecA gene in MRSA encodes PBP2a, an altered penicillin-binding protein with low affinity for all beta-lactams — this is why MRSA requires vancomycin or daptomycin rather than any beta-lactam antibiotic. The vanA gene cluster in VRE modifies the peptidoglycan precursor terminus from D-Ala-D-Ala to D-Ala-D-Lac, preventing vancomycin binding. Ribosomal methylation (erm genes) confers macrolide resistance.\n\nPorin mutations in gram-negative bacteria reduce or eliminate outer membrane porin channels (OmpK35/K36 in Klebsiella, OprD in Pseudomonas), preventing antibiotic entry into the periplasmic space. Loss of OprD porin in P. aeruginosa specifically eliminates carbapenem entry, contributing to carbapenem resistance even without carbapenemase production.\n\nHorizontal gene transfer (HGT) allows bacteria to share resistance genes across species, accelerating resistance spread. Three mechanisms drive HGT: (1) Conjugation: direct cell-to-cell transfer of resistance plasmids through pili (most clinically significant — transfers ESBL, carbapenemase, and vanA genes between species); (2) Transformation: uptake of free DNA from lysed bacteria in the environment; (3) Transduction: bacteriophage-mediated transfer of resistance genes between bacteria. Mobile genetic elements (plasmids, transposons, integrons) carrying multiple resistance genes can be transferred in a single conjugation event, creating MDR organisms in one step.\n\nClinically significant resistant organisms the RN must recognize:\n- MRSA (methicillin-resistant Staphylococcus aureus): mecA gene, requires vancomycin/daptomycin/linezolid. Contact precautions.\n- VRE (vancomycin-resistant Enterococcus): vanA/vanB genes, requires linezolid/daptomycin. Contact precautions.\n- ESBL-producing Enterobacterales: plasmid-mediated CTX-M enzymes, requires carbapenems. Contact precautions.\n- CRE (carbapenem-resistant Enterobacterales): KPC/NDM enzymes, requires ceftazidime-avibactam or polymyxins. Enhanced contact precautions with dedicated equipment.\n\nPharmacodynamic principles guide dosing: time-dependent antibiotics (beta-lactams) require sustained levels above MIC — extended infusions (4-hour piperacillin-tazobactam) maximize efficacy. Concentration-dependent antibiotics (aminoglycosides, fluoroquinolones) require high peak-to-MIC ratios — once-daily aminoglycoside dosing exploits this. AUC-dependent antibiotics (vancomycin) target AUC/MIC ratios of 400-600. The nurse plays a critical role in stewardship through timely administration maintaining pharmacodynamic targets, proper culture collection technique, therapeutic drug level monitoring, recognizing adverse effects, coordinating antibiotic timeout reviews, and patient education on completing full courses."
    },
    riskFactors: [
      "Broad-spectrum antibiotic use without culture guidance",
      "Prolonged antibiotic courses beyond recommended duration",
      "Empiric therapy not de-escalated after culture results",
      "Poor infection control practices in healthcare facilities",
      "Antibiotic prescribing for non-bacterial infections (viral URI, viral bronchitis)",
      "Subtherapeutic dosing (levels below MIC)",
      "Prior antibiotic exposure within 90 days",
      "ICU admission with MDR organism colonization"
    ],
    diagnostics: [
      "Obtain cultures using proper aseptic technique from the correct site before antibiotics",
      "Interpret culture and sensitivity reports to identify effective narrow-spectrum alternatives",
      "Monitor therapeutic drug levels (vancomycin AUC/MIC, aminoglycoside peak/trough)",
      "Assess procalcitonin trends for antibiotic de-escalation decisions",
      "Monitor CBC with differential: resolving leukocytosis indicates treatment response",
      "Evaluate CRP trends as adjunctive marker of infection resolution",
      "Monitor renal function (creatinine, BUN) for dose-adjusted antibiotics"
    ],
    management: [
      "Participate in antimicrobial stewardship rounds and 48-72 hour antibiotic timeout reviews",
      "Advocate for de-escalation from broad-spectrum to targeted therapy once cultures return",
      "Ensure timed antibiotic administration: time-dependent antibiotics require sustained levels, concentration-dependent require peak levels",
      "Implement IV-to-PO conversion per protocol when patient meets criteria (tolerating oral intake, improving clinically)",
      "Monitor for and report antibiotic-associated complications: C. difficile, drug fever, cytopenias",
      "Calculate and verify appropriate dosing based on renal function for renally-cleared antibiotics",
      "Ensure adequate duration: avoid both insufficient and excessive antibiotic courses",
      "Implement contact isolation for patients with MDR organisms (MRSA, VRE, ESBL, CRE)"
    ],
    nursingActions: [
      "Verify allergy status and cross-reactivity risk before each antibiotic course initiation",
      "Draw peak and trough levels at correct times for therapeutic drug monitoring",
      "Perform 48-72 hour antibiotic reassessment: is the antibiotic still indicated? Can it be narrowed?",
      "Monitor IV access site for signs of phlebitis or extravasation with vesicant antibiotics",
      "Educate patients on expected course duration and importance of not self-discontinuing",
      "Coordinate with pharmacy for antimicrobial dose optimization (extended infusions, renal adjustments)",
      "Implement appropriate isolation precautions based on organism type",
      "Document antibiotic start time, infusion duration, and any adverse reactions"
    ],
    signs: {
      left: [
        "Clinical improvement: decreasing fever, WBC normalization",
        "Negative repeat cultures",
        "Improving inflammatory markers (CRP, procalcitonin)",
        "Resolution of localizing signs (wound healing, clear sputum)"
      ],
      right: [
        "Treatment failure: persistent or worsening fever",
        "Positive cultures with resistant organism",
        "C. difficile infection (new watery diarrhea)",
        "Drug fever (fever onset coinciding with antibiotic timeline)",
        "Nephrotoxicity (rising creatinine with vancomycin or aminoglycosides)",
        "Red man syndrome (histamine release from rapid vancomycin infusion)",
        "Bone marrow suppression (neutropenia with prolonged beta-lactam use)"
      ]
    },
    medications: [
      { name: "Vancomycin", type: "Glycopeptide", action: "Inhibits cell wall synthesis by binding D-Ala-D-Ala terminus of peptidoglycan precursors; effective against MRSA and gram-positive organisms", sideEffects: "Nephrotoxicity, ototoxicity, red man syndrome, neutropenia", contra: "No absolute contraindications; use with caution in renal impairment", pearl: "AUC-guided dosing (target 400-600 mg*hr/L) replacing trough-based monitoring. Infuse over ≥1 hour (≥2 hours if dose >1g). Red man syndrome is histamine-mediated, not allergy — slow the rate." },
      { name: "Piperacillin-Tazobactam", type: "Extended-spectrum penicillin + beta-lactamase inhibitor", action: "Broad-spectrum bactericidal against gram-positives, gram-negatives, and anaerobes", sideEffects: "Hypersensitivity, seizures (high dose), leukopenia, C. difficile", contra: "Penicillin allergy (assess severity: anaphylaxis vs. mild reaction)", pearl: "Extended infusion (4 hours) improves time above MIC and clinical outcomes. De-escalate within 48-72 hours based on culture results." },
      { name: "Gentamicin", type: "Aminoglycoside", action: "Binds 30S ribosomal subunit, causing misreading of mRNA and bactericidal activity; concentration-dependent killing", sideEffects: "Nephrotoxicity, ototoxicity (vestibular and cochlear), neuromuscular blockade", contra: "Myasthenia gravis, concurrent ototoxic or nephrotoxic agents", pearl: "Once-daily (extended-interval) dosing maximizes peak concentrations and bacterial killing. Monitor renal function daily. Trough must be <1 mcg/mL to prevent accumulation toxicity." },
      { name: "Oral Vancomycin/Fidaxomicin", type: "C. difficile targeted therapy", action: "Vancomycin: direct intraluminal activity against C. difficile; Fidaxomicin: narrower spectrum with lower recurrence rate", sideEffects: "Nausea, abdominal pain (both); minimal systemic absorption", contra: "None absolute for C. difficile indication", pearl: "Oral vancomycin 125 mg QID x10 days is first-line for C. difficile. Fidaxomicin has lower recurrence rates and is preferred for recurrent episodes. IV metronidazole is added for fulminant disease." }
    ],
    pearls: [
      "Red man syndrome is NOT a true allergy — it is a histamine-mediated reaction from rapid vancomycin infusion. Slow the rate and premedicate with diphenhydramine",
      "The 48-72 hour antibiotic timeout is a stewardship cornerstone: reassess indication, narrow spectrum, plan duration",
      "Extended-infusion beta-lactams (e.g., 4-hour piperacillin-tazobactam) improve pharmacodynamic outcomes compared to 30-minute infusions",
      "Procalcitonin <0.25 ng/mL supports safe antibiotic discontinuation in lower respiratory infections",
      "MRSA nasal swab PCR (negative predictive value >95%) can be used to de-escalate empiric vancomycin"
    ],
    quiz: [
      { question: "A patient develops diffuse flushing and pruritus during a vancomycin infusion. What is the priority action?", options: ["Stop vancomycin permanently and document allergy", "Slow the infusion rate and administer diphenhydramine", "Increase the infusion rate to complete the dose faster", "Switch to oral vancomycin"], correct: 1, rationale: "This describes red man syndrome, a histamine-mediated reaction from rapid vancomycin infusion. Slowing the rate and administering an antihistamine resolves symptoms. It is not a true allergy." },
      { question: "What is the purpose of the 48-72 hour antibiotic timeout?", options: ["To automatically discontinue all antibiotics", "To reassess indication, narrow spectrum based on cultures, and plan duration", "To switch all IV antibiotics to oral", "To verify insurance coverage for continued antibiotic use"], correct: 1, rationale: "The antibiotic timeout is a structured reassessment at 48-72 hours to determine if antibiotics are still indicated, if the spectrum can be narrowed based on culture results, and what the planned duration should be." },
      { question: "Why is extended-infusion (4-hour) piperacillin-tazobactam preferred over standard 30-minute infusion?", options: ["It reduces medication cost", "It maximizes time above MIC for this time-dependent antibiotic", "It reduces the risk of allergic reaction", "It allows faster patient discharge"], correct: 1, rationale: "Beta-lactams are time-dependent antibiotics requiring sustained levels above the MIC. Extended infusion over 4 hours maintains therapeutic levels longer, improving clinical outcomes." }
    ]
  },

  "antibiotic-stewardship-np": {
    title: "Antibiotic Stewardship",
    cellular: {
      title: "Antimicrobial Pharmacology",
      content: "Antibiotic stewardship at the clinician prescriptive level requires deep understanding of resistance mechanisms, pharmacokinetic/pharmacodynamic (PK/PD) optimization, and evidence-based prescribing. Key resistance mechanisms include: ESBL-producing Enterobacterales (plasmid-mediated CTX-M enzymes hydrolyzing third-generation cephalosporins), carbapenem-resistant Enterobacterales (CRE via KPC, NDM, OXA-48 enzymes), MRSA (mecA gene encoding PBP2a with reduced beta-lactam affinity), and vancomycin-resistant Enterococcus (vanA/vanB gene clusters). PK/PD targets drive dosing: time-dependent antibiotics (beta-lactams) target fT>MIC >40-70%, concentration-dependent antibiotics (aminoglycosides) target Cmax/MIC >10, and AUC-dependent antibiotics (vancomycin, fluoroquinolones) target AUC/MIC ratios. The clinician must select empiric therapy based on local antibiograms, optimize dosing using PK/PD principles, de-escalate based on culture data, determine appropriate duration, and implement stewardship quality metrics."
    },
    riskFactors: [
      "Healthcare-associated infections with MDR organisms (MRSA, VRE, ESBL, CRE)",
      "Prior antibiotic exposure within 90 days (strongest predictor of resistance)",
      "ICU admission with invasive devices",
      "Travel to regions with high endemic resistance (South/Southeast Asia for CRE)",
      "Known colonization with resistant organisms",
      "Immunosuppression requiring prophylactic antibiotics",
      "Structural lung disease with chronic Pseudomonas colonization",
      "Recurrent UTIs with prior fluoroquinolone exposure"
    ],
    diagnostics: [
      "Order appropriate cultures with susceptibility testing before empiric therapy",
      "Interpret antibiogram data to guide empiric prescribing for the institution",
      "Order rapid diagnostic panels (BCID, respiratory panels) when available for faster pathogen identification",
      "Order therapeutic drug monitoring: vancomycin AUC/MIC (target 400-600), aminoglycoside peak/trough",
      "Order procalcitonin for antibiotic initiation and de-escalation decisions",
      "Interpret MIC breakpoints and CLSI susceptibility categories (S, I, R) for dosing decisions",
      "Order MRSA nasal swab PCR to guide vancomycin de-escalation (NPV >95%)",
      "Order beta-D-glucan and galactomannan for invasive fungal infection workup when needed"
    ],
    management: [
      "Prescribe empiric antibiotics based on local antibiogram, suspected source, severity, and risk factors for MDR organisms",
      "Apply PK/PD optimization: extended infusions for beta-lactams, high-dose for concentration-dependent agents",
      "De-escalate to narrowest effective spectrum within 48-72 hours based on culture sensitivity",
      "Prescribe evidence-based duration: pneumonia 5-7 days, UTI 3-5 days (uncomplicated), skin/soft tissue 5-7 days, bacteremia 7-14 days (source-dependent)",
      "Implement outpatient parenteral antibiotic therapy (OPAT) program for stable patients requiring IV antibiotics",
      "Prescribe antifungal prophylaxis for high-risk patients (neutropenic fever: micafungin or fluconazole)",
      "Order and interpret C. difficile toxin testing; prescribe vancomycin PO or fidaxomicin based on severity and recurrence history",
      "Implement allergy assessment protocol: verify penicillin allergy (>90% of reported penicillin allergies are not true allergies); consider skin testing referral"
    ],
    nursingActions: [
      "Lead antimicrobial stewardship program initiatives and quality improvement projects",
      "Develop institution-specific antibiotic prescribing guidelines and order sets",
      "Educate prescribers on evidence-based antibiotic duration and de-escalation",
      "Track stewardship metrics: days of therapy (DOT), antibiotic starts, de-escalation rates, C. difficile rates",
      "Participate in antimicrobial stewardship committee and Pharmacy & Therapeutics meetings",
      "Review antibiotic prescribing for compliance with stewardship guidelines",
      "Implement prospective audit with feedback for targeted antibiotic optimization",
      "Counsel patients on appropriate antibiotic expectations (viral infections do not require antibiotics)"
    ],
    signs: {
      left: [
        "Clinical response to therapy: defervescence within 48-72 hours",
        "Decreasing WBC and inflammatory markers (CRP, procalcitonin)",
        "Negative surveillance cultures",
        "Improving organ function (renal, hepatic)",
        "Successful source control"
      ],
      right: [
        "Treatment failure: persistent bacteremia at 48-72 hours",
        "Breakthrough infection with resistant organism",
        "C. difficile infection complicating antibiotic therapy",
        "Drug-induced organ toxicity (nephrotoxicity, hepatotoxicity)",
        "Superinfection with fungal organisms (candidiasis)",
        "Antibiotic-associated cytopenias",
        "Development of MDR organism during therapy"
      ]
    },
    medications: [
      { name: "Meropenem", type: "Carbapenem", action: "Ultra-broad-spectrum beta-lactam that resists most beta-lactamases; bactericidal against gram-positives, gram-negatives, and anaerobes", sideEffects: "Seizures (lower threshold), C. difficile, cytopenias, cross-reactivity (~1% with penicillin allergy)", contra: "Known carbapenem hypersensitivity, concurrent valproic acid (reduces levels by 60-90%)", pearl: "Reserve for ESBL infections, serious polymicrobial infections, or failed first-line therapy. Extended infusion (3 hours) optimizes fT>MIC. Critical interaction: reduces valproic acid levels dramatically." },
      { name: "Ceftaroline", type: "Fifth-generation cephalosporin", action: "Binds PBP2a (MRSA) and PBP2x (penicillin-resistant streptococci); only beta-lactam with MRSA activity", sideEffects: "Diarrhea, nausea, rash, positive direct Coombs test", contra: "Known cephalosporin hypersensitivity", pearl: "The only beta-lactam active against MRSA. Alternative to vancomycin for MRSA bacteremia or endocarditis with persistent positive cultures. FDA-approved for ABSSSI and community-acquired pneumonia." },
      { name: "Fidaxomicin", type: "Macrocyclic antibiotic (narrow-spectrum)", action: "Inhibits RNA polymerase in C. difficile with minimal disruption to normal flora", sideEffects: "Nausea, abdominal pain, GI hemorrhage (rare)", contra: "Hypersensitivity to fidaxomicin", pearl: "Preferred over oral vancomycin for recurrent C. difficile episodes due to lower recurrence rate (13% vs 27%). Narrow spectrum preserves intestinal microbiome." },
      { name: "Daptomycin", type: "Lipopeptide antibiotic", action: "Inserts into gram-positive cell membrane, causing rapid depolarization and cell death", sideEffects: "CPK elevation (myopathy), eosinophilic pneumonia, rhabdomyolysis", contra: "Pneumonia (surfactant inactivates daptomycin in the lungs)", pearl: "Alternative to vancomycin for MRSA bacteremia. Cannot use for pneumonia — inactivated by pulmonary surfactant. Monitor CPK weekly. Dose at 6-10 mg/kg for bacteremia/endocarditis." }
    ],
    pearls: [
      "Over 90% of reported penicillin allergies are not true IgE-mediated allergies — penicillin skin testing can safely expand treatment options",
      "Daptomycin is inactivated by pulmonary surfactant — never use for pneumonia regardless of MRSA susceptibility",
      "Meropenem reduces valproic acid levels by 60-90%, potentially causing seizure breakthrough — this combination must be avoided",
      "Procalcitonin-guided de-escalation reduces antibiotic duration by 2-3 days without affecting mortality in lower respiratory infections",
      "The antibiogram should be reviewed annually to guide empiric prescribing; a ≥10% change in susceptibility patterns may require guideline updates"
    ],
    quiz: [
      { question: "A patient with MRSA pneumonia is being treated with vancomycin. The provider considers switching to daptomycin. What is the concern?", options: ["Daptomycin has no MRSA activity", "Daptomycin is inactivated by pulmonary surfactant and cannot treat pneumonia", "Daptomycin requires hepatic dose adjustment", "There is no concern; the switch is appropriate"], correct: 1, rationale: "Daptomycin is inactivated by pulmonary surfactant, making it ineffective for pneumonia regardless of susceptibility results. Vancomycin or linezolid should be used for MRSA pneumonia." },
      { question: "Which PK/PD principle guides the use of extended-infusion beta-lactams?", options: ["Maximizing peak concentration to MIC ratio", "Maximizing the time that drug concentration remains above the MIC", "Minimizing the AUC/MIC ratio", "Achieving the highest possible trough level"], correct: 1, rationale: "Beta-lactams are time-dependent antibiotics. Their killing efficacy depends on maintaining drug levels above the MIC for the longest possible duration (fT>MIC). Extended infusions achieve this more effectively than bolus dosing." },
      { question: "An NP is prescribing empiric antibiotics for a patient with a UTI and a documented penicillin allergy (hives 20 years ago). What is the best approach?", options: ["Avoid all beta-lactams permanently", "Refer for penicillin skin testing to determine if a true allergy exists", "Prescribe a fluoroquinolone as first-line therapy", "Administer penicillin without any assessment"], correct: 1, rationale: "Over 90% of reported penicillin allergies are not true IgE-mediated reactions, especially remote reactions. Penicillin skin testing can safely confirm or rule out allergy, potentially expanding safe, effective treatment options." }
    ]
  }
};
