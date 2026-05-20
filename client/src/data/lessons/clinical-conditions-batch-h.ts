import type { LessonContent } from "./types";

export const clinicalConditionsBatchHLessons: Record<string, LessonContent> = {
  "vancomycin-therapy-rpn": {
    title: "Vancomycin Therapy",
    cellular: {
      title: "Vancomycin Pharmacology Basics",
      content: "Vancomycin is a glycopeptide antibiotic that inhibits bacterial cell wall synthesis by binding to D-alanyl-D-alanine terminal of peptidoglycan precursors, preventing cross-linking. It is the drug of choice for serious methicillin-resistant Staphylococcus aureus (MRSA) infections including bacteremia, endocarditis, osteomyelitis, and pneumonia. Vancomycin must be administered intravenously for systemic infections as oral bioavailability is negligible; oral vancomycin is reserved exclusively for Clostridioides difficile colitis. The nurse monitors infusion parameters, observes for adverse reactions, and reports changes to the RN."
    },
    riskFactors: [
      "MRSA colonization or prior infection",
      "Hospitalization or long-term care residence",
      "Indwelling devices (central lines, prosthetics)",
      "Recent antibiotic use",
      "Immunocompromised status",
      "Chronic kidney disease",
      "Advanced age",
      "Surgical wound infections"
    ],
    diagnostics: [
      "Monitor vital signs during and after infusion as directed",
      "Report signs of infusion reaction: flushing, erythema on face/neck/chest",
      "Monitor urine output and report if decreased",
      "Document and report trough level results as communicated by the RN",
      "Monitor for hearing changes and report immediately",
      "Observe IV site for infiltration or phlebitis"
    ],
    management: [
      "Administer vancomycin IV infusion over minimum 60 minutes as ordered",
      "Never administer as rapid IV push",
      "Maintain adequate IV hydration as ordered",
      "Report any flushing, pruritus, or hypotension during infusion immediately",
      "Stop infusion and call RN if signs of anaphylaxis develop (hives, angioedema, wheezing)",
      "Follow prescribed infusion rate without adjustment"
    ],
    nursingActions: [
      "Verify infusion rate and duration before starting: minimum 60 minutes",
      "Monitor patient during entire infusion for vancomycin infusion reaction (VIR)",
      "Assess for red man syndrome: flushing, erythema, pruritus of face, neck, chest",
      "Differentiate VIR from anaphylaxis: hives, angioedema, wheezing suggest anaphylaxis",
      "Report any muscle pain, spasms, or dyspnea during infusion",
      "Monitor and document IV site integrity every shift",
      "Report any hearing changes or tinnitus immediately"
    ],
    signs: {
      left: [
        "Red man syndrome: flushing of face/neck/chest",
        "Pruritus during infusion",
        "Muscle pain or spasms",
        "Hypotension during rapid infusion"
      ],
      right: [
        "Anaphylaxis: hives, angioedema, wheezing",
        "Ototoxicity: tinnitus, hearing loss",
        "Nephrotoxicity: decreased urine output",
        "Phlebitis at IV site"
      ]
    },
    medications: [
      { name: "Vancomycin", type: "Glycopeptide antibiotic", action: "Inhibits bacterial cell wall synthesis by binding to D-ala-D-ala precursors", sideEffects: "Red man syndrome, nephrotoxicity, ototoxicity, phlebitis", contra: "Known hypersensitivity", pearl: "Must be infused over at least 60 minutes to prevent VIR. Report flushing or hypotension immediately." },
      { name: "Diphenhydramine", type: "Antihistamine", action: "Blocks H1 receptors to reduce histamine-mediated flushing and pruritus", sideEffects: "Drowsiness, dry mouth, urinary retention", contra: "Narrow-angle glaucoma, MAO inhibitor use", pearl: "May be given as premedication before vancomycin infusion to reduce VIR symptoms." }
    ],
    pearls: [
      "Red man syndrome is a rate-related infusion reaction, NOT a true allergy — slowing the infusion rate often resolves symptoms",
      "Hives, lip swelling (angioedema), and wheezing during infusion suggest true anaphylaxis — stop infusion and call for help",
      "If infusion reaction occurs, stop the infusion immediately and notify the RN",
      "Oral vancomycin does not treat systemic infections — it stays in the GI tract and is used only for C. difficile",
      "Always verify the infusion time: rapid administration is the most common cause of VIR"
    ],
    quiz: [
      { question: "During a vancomycin infusion, the patient develops flushing and itching on the face and neck. What should the nurse do first?", options: ["Continue the infusion and document the finding", "Stop the infusion and notify the nurse immediately", "Administer epinephrine", "Increase the infusion rate"], correct: 1, rationale: "Flushing and itching during vancomycin infusion suggest vancomycin infusion reaction (red man syndrome). The nurse should stop the infusion and notify the nurse for further orders, which may include slowing the rate or premedication." },
      { question: "What is the minimum infusion time for IV vancomycin to reduce the risk of infusion reaction?", options: ["15 minutes", "30 minutes", "60 minutes", "120 minutes"], correct: 2, rationale: "Vancomycin should be infused over a minimum of 60 minutes. Rapid administration increases the risk of vancomycin infusion reaction (red man syndrome)." },
      { question: "Which finding during a vancomycin infusion is most suggestive of true anaphylaxis rather than red man syndrome?", options: ["Facial flushing", "Chest pruritus", "Angioedema with wheezing", "Mild hypotension"], correct: 2, rationale: "Angioedema (lip/tongue swelling) and wheezing indicate true anaphylaxis. Flushing, pruritus, and mild hypotension are more typical of rate-related vancomycin infusion reaction." }
    ]
  },

  "vancomycin-therapy-rn": {
    title: "Vancomycin Therapy",
    cellular: {
      title: "Vancomycin Pharmacokinetics and Toxicity",
      content: "Vancomycin exhibits time-dependent bactericidal activity against gram-positive organisms by inhibiting cell wall synthesis. Its pharmacokinetics follow a two-compartment model with distribution into tissues including bone, lung, and peritoneal fluid. Vancomycin is primarily eliminated renally, making dose adjustment essential in renal impairment. Therapeutic drug monitoring via trough levels guides dosing to maintain efficacy while minimizing nephrotoxicity and ototoxicity. The target AUC/MIC ratio of 400-600 is now the preferred pharmacokinetic target over trough-only monitoring. The nurse must manage infusion protocols, interpret trough levels, assess for toxicity, and coordinate with pharmacy for dose adjustments."
    },
    riskFactors: [
      "MRSA bacteremia or endocarditis",
      "Prosthetic joint or device infections",
      "Surgical site infections with resistant organisms",
      "Healthcare-associated pneumonia",
      "Concurrent nephrotoxic medications (aminoglycosides, NSAIDs)",
      "Pre-existing renal impairment",
      "Obesity (altered volume of distribution)",
      "Prolonged therapy duration (>7 days)"
    ],
    diagnostics: [
      "Obtain vancomycin trough levels 30 minutes before the 4th dose (steady state)",
      "Target trough: 15-20 mcg/mL for serious infections (bacteremia, endocarditis, osteomyelitis)",
      "Target trough: 10-15 mcg/mL for less serious infections (skin/soft tissue)",
      "Monitor serum creatinine and BUN at baseline and every 2-3 days during therapy",
      "Calculate creatinine clearance to assess renal function",
      "Obtain baseline audiometry if prolonged therapy anticipated",
      "Monitor CBC with differential for treatment response"
    ],
    management: [
      "Administer loading dose as prescribed (25-30 mg/kg for serious infections)",
      "Infuse over at least 60 minutes; extend to 90-120 minutes for doses >1g",
      "Premedicate with diphenhydramine or slow infusion rate for patients with prior VIR",
      "Hold dose and notify provider if trough >20 mcg/mL (supratherapeutic)",
      "Coordinate with pharmacy for dose adjustments based on trough levels and renal function",
      "Monitor for drug interactions: concurrent aminoglycosides increase nephrotoxicity risk",
      "Ensure adequate IV hydration to support renal function during therapy"
    ],
    nursingActions: [
      "Draw trough level at the correct time: 30 minutes before the next scheduled dose",
      "Assess renal function trends: rising creatinine may indicate nephrotoxicity",
      "Perform baseline and ongoing auditory assessment: ask about tinnitus or hearing changes",
      "Assess IV site for phlebitis; consider PICC line for prolonged courses",
      "Calculate and verify dose based on patient weight and renal function",
      "Differentiate VIR from anaphylaxis: VIR = rate-related flushing; anaphylaxis = urticaria, angioedema, bronchospasm",
      "If VIR occurs: stop infusion, administer diphenhydramine, restart at slower rate per protocol",
      "If anaphylaxis occurs: stop infusion, administer IM epinephrine, call rapid response"
    ],
    signs: {
      left: [
        "Therapeutic response: decreasing WBC, resolving fever",
        "Red man syndrome (rate-related)",
        "Pruritus and flushing during infusion",
        "Mild hypotension during infusion"
      ],
      right: [
        "Nephrotoxicity: rising creatinine, oliguria",
        "Ototoxicity: tinnitus, hearing loss, vertigo",
        "Anaphylaxis: urticaria, angioedema, bronchospasm",
        "Neutropenia with prolonged therapy (>14 days)"
      ]
    },
    medications: [
      { name: "Vancomycin", type: "Glycopeptide antibiotic", action: "Inhibits cell wall synthesis in gram-positive bacteria by binding D-ala-D-ala peptidoglycan precursors", sideEffects: "Red man syndrome, nephrotoxicity, ototoxicity, neutropenia", contra: "Known hypersensitivity to vancomycin", pearl: "Draw trough 30 min before 4th dose. Target trough 15-20 for serious infections. Rising creatinine requires dose adjustment." },
      { name: "Epinephrine", type: "Sympathomimetic", action: "Alpha and beta agonist causing bronchodilation, vasoconstriction, and cardiac stimulation", sideEffects: "Tachycardia, hypertension, tremor, anxiety", contra: "No absolute contraindications in anaphylaxis", pearl: "Administer IM 0.3-0.5 mg for anaphylaxis during vancomycin infusion. Do not delay for true anaphylaxis." },
      { name: "Linezolid", type: "Oxazolidinone antibiotic", action: "Inhibits bacterial protein synthesis at 50S ribosomal subunit", sideEffects: "Thrombocytopenia, serotonin syndrome, lactic acidosis, optic neuropathy", contra: "Concurrent use of serotonergic agents, uncontrolled hypertension", pearl: "Alternative to vancomycin for MRSA when nephrotoxicity limits use. Monitor platelets weekly." }
    ],
    pearls: [
      "Drawing trough levels at the wrong time is the most common error: must be 30 minutes before the NEXT dose, not after a dose",
      "Red man syndrome is NOT an allergy — it is a histamine-mediated rate reaction that resolves with slower infusion",
      "Concurrent aminoglycosides (gentamicin, tobramycin) significantly increase nephrotoxicity risk: monitor creatinine closely",
      "Vancomycin-induced neutropenia is reversible and typically occurs with therapy >14 days: monitor CBC weekly",
      "AUC-guided dosing is now preferred over trough-only monitoring per 2020 guidelines"
    ],
    quiz: [
      { question: "When should the nurse draw a vancomycin trough level?", options: ["Immediately after the infusion ends", "2 hours after the dose", "30 minutes before the next scheduled dose at steady state", "At any random time during therapy"], correct: 2, rationale: "Vancomycin trough levels should be drawn 30 minutes before the 4th dose (steady state) to accurately reflect the lowest drug concentration and guide dosing." },
      { question: "A patient on vancomycin and gentamicin develops a rising serum creatinine. What is the priority nursing action?", options: ["Continue both medications and recheck creatinine in one week", "Hold both medications and notify the provider", "Increase IV fluids only", "Switch to oral vancomycin"], correct: 1, rationale: "Concurrent vancomycin and aminoglycosides significantly increase nephrotoxicity risk. A rising creatinine warrants holding both nephrotoxic agents and notifying the provider for dose adjustment." },
      { question: "A patient develops urticaria, lip swelling, and wheezing during vancomycin infusion. What is the priority action?", options: ["Slow the infusion rate", "Administer diphenhydramine and continue", "Stop the infusion and administer IM epinephrine", "Reassess in 15 minutes"], correct: 2, rationale: "Urticaria, angioedema (lip swelling), and wheezing indicate anaphylaxis, not simple VIR. The infusion must be stopped immediately and IM epinephrine administered." }
    ]
  },

  "vancomycin-therapy-np": {
    title: "Vancomycin Therapy",
    cellular: {
      title: "Vancomycin Pharmacokinetics",
      content: "Vancomycin's bactericidal activity against gram-positive organisms is concentration-independent and time-dependent, with efficacy best predicted by the AUC/MIC ratio. The 2020 ASHP/IDSA/SIDP guidelines recommend AUC-guided dosing targeting AUC/MIC 400-600 mg·h/L (assuming MIC ≤1 mcg/mL) rather than trough-only monitoring to optimize efficacy while reducing nephrotoxicity. Vancomycin distributes into most body tissues but CNS penetration is variable. Renal elimination accounts for 80-90% of clearance, necessitating dosage adjustment based on creatinine clearance or estimated GFR. The clinician must prescribe appropriate loading and maintenance doses, order therapeutic drug monitoring, interpret pharmacokinetic parameters, and manage complications including nephrotoxicity, ototoxicity, and infusion reactions."
    },
    riskFactors: [
      "MRSA infections with MIC ≤1 mcg/mL (appropriate for vancomycin)",
      "MRSA bacteremia requiring 4-6 weeks of therapy",
      "Prosthetic valve endocarditis",
      "Osteomyelitis requiring prolonged IV therapy",
      "CNS infections requiring high-dose therapy",
      "Obesity requiring weight-based dosing adjustments",
      "Renal impairment requiring dose reduction",
      "Concurrent nephrotoxic agents"
    ],
    diagnostics: [
      "Order AUC-guided monitoring using Bayesian software or two-level sampling (peak and trough)",
      "Target AUC/MIC 400-600 mg·h/L for serious MRSA infections",
      "Order baseline and serial serum creatinine, BUN, and eGFR",
      "Order vancomycin MIC from culture susceptibility to guide therapy selection",
      "If MIC >1: consider alternative agents (daptomycin, linezolid, ceftaroline)",
      "Order baseline audiometry for anticipated therapy >14 days",
      "Monitor CBC weekly for vancomycin-induced neutropenia"
    ],
    management: [
      "Prescribe loading dose of 25-30 mg/kg actual body weight for critically ill patients",
      "Prescribe maintenance dose of 15-20 mg/kg every 8-12 hours based on renal function",
      "Adjust dosing interval based on creatinine clearance: q12h if CrCl 50-80, q24h if CrCl 20-49, per levels if CrCl <20",
      "Transition to AUC-guided dosing using Bayesian pharmacokinetic software when available",
      "Switch to alternative agent if MRSA MIC ≥2 mcg/mL (vancomycin MIC creep)",
      "Prescribe daptomycin 6-10 mg/kg IV daily for MRSA bacteremia when vancomycin fails or is contraindicated",
      "Order PICC line placement for courses expected >7 days",
      "Prescribe outpatient parenteral antibiotic therapy (OPAT) for stable patients completing prolonged courses"
    ],
    nursingActions: [
      "Calculate loading and maintenance doses based on actual body weight and renal function",
      "Interpret AUC/MIC ratios and adjust dosing to maintain 400-600 target",
      "Evaluate for treatment failure: persistent bacteremia, rising MIC, clinical deterioration",
      "Assess for vancomycin-resistant enterococci (VRE) risk in prolonged therapy",
      "Coordinate infectious disease consultation for complex cases",
      "Monitor for red man syndrome vs anaphylaxis and adjust infusion protocol accordingly",
      "Plan de-escalation to narrow-spectrum therapy when culture sensitivities allow",
      "Evaluate renal function trends and adjust dose before nephrotoxicity develops"
    ],
    signs: {
      left: [
        "Therapeutic response: negative blood cultures by 72 hours",
        "Resolving leukocytosis and fever",
        "Improving inflammatory markers (CRP, ESR, procalcitonin)",
        "Wound healing in skin/soft tissue infections"
      ],
      right: [
        "Treatment failure: persistent bacteremia >7 days",
        "Nephrotoxicity: AKI with creatinine rise >0.5 mg/dL",
        "Ototoxicity: irreversible sensorineural hearing loss",
        "Vancomycin MIC creep (MIC trending toward 2)"
      ]
    },
    medications: [
      { name: "Vancomycin", type: "Glycopeptide antibiotic", action: "Bactericidal against gram-positive organisms via cell wall synthesis inhibition", sideEffects: "Nephrotoxicity, ototoxicity, red man syndrome, neutropenia, linear IgA bullous dermatosis", contra: "Hypersensitivity, MRSA MIC ≥2 mcg/mL (consider alternatives)", pearl: "AUC/MIC 400-600 is the current target per 2020 guidelines. Loading dose 25-30 mg/kg for serious infections. Monitor renal function closely." },
      { name: "Daptomycin", type: "Lipopeptide antibiotic", action: "Depolarizes bacterial cell membrane causing rapid cell death", sideEffects: "CPK elevation, myopathy, eosinophilic pneumonia", contra: "Pneumonia (inactivated by surfactant)", pearl: "Alternative to vancomycin for MRSA bacteremia. Dose 6 mg/kg for bacteremia, 8-10 mg/kg for endocarditis. Monitor CPK weekly." },
      { name: "Ceftaroline", type: "5th-generation cephalosporin", action: "Binds PBP2a in MRSA, providing anti-MRSA activity unique among cephalosporins", sideEffects: "Rash, diarrhea, neutropenia", contra: "Cephalosporin allergy", pearl: "FDA-approved for MRSA skin infections and community-acquired pneumonia. Consider for salvage therapy in persistent MRSA bacteremia." },
      { name: "Linezolid", type: "Oxazolidinone antibiotic", action: "Inhibits protein synthesis at 50S ribosomal subunit; bacteriostatic against MRSA", sideEffects: "Thrombocytopenia, serotonin syndrome, lactic acidosis, peripheral neuropathy, optic neuropathy", contra: "Concurrent serotonergic agents (SSRIs, MAOIs), uncontrolled hypertension, pheochromocytoma", pearl: "Oral bioavailability is 100%, enabling IV-to-PO switch. Limit therapy to <28 days to reduce myelosuppression risk. Monitor platelets weekly." }
    ],
    pearls: [
      "AUC/MIC 400-600 is the current gold standard for vancomycin dosing — trough-only monitoring is being phased out",
      "If MRSA blood cultures remain positive at 72 hours on vancomycin, consider treatment failure and evaluate alternative agents",
      "Daptomycin cannot be used for pneumonia — it is inactivated by pulmonary surfactant",
      "Vancomycin MIC creep (MIC approaching 2 mcg/mL) predicts clinical failure even if technically susceptible",
      "Loading dose of 25-30 mg/kg in critically ill patients achieves therapeutic levels faster without increasing toxicity"
    ],
    quiz: [
      { question: "Per current guidelines, what is the recommended pharmacokinetic target for vancomycin in serious MRSA infections?", options: ["Trough 10-15 mcg/mL", "Peak 25-40 mcg/mL", "AUC/MIC 400-600 mg·h/L", "Random level >15 mcg/mL"], correct: 2, rationale: "The 2020 ASHP/IDSA/SIDP guidelines recommend AUC/MIC-guided dosing with a target of 400-600 mg·h/L for serious MRSA infections, replacing trough-only monitoring." },
      { question: "An MRSA blood culture has an MIC of 2 mcg/mL. What is the NP's best course of action?", options: ["Continue vancomycin at higher doses", "Switch to daptomycin or ceftaroline", "Add gentamicin to vancomycin", "Switch to oral vancomycin"], correct: 1, rationale: "An MRSA MIC of 2 mcg/mL indicates vancomycin MIC creep and predicts clinical failure. Alternative agents such as daptomycin or ceftaroline should be considered." },
      { question: "Why is daptomycin contraindicated for the treatment of MRSA pneumonia?", options: ["It does not penetrate lung tissue", "It is inactivated by pulmonary surfactant", "It causes eosinophilic pneumonia in all patients", "It has no gram-positive activity in the lungs"], correct: 1, rationale: "Daptomycin is inactivated by pulmonary surfactant, rendering it ineffective for pneumonia despite excellent activity against MRSA in other body sites." }
    ]
  },

  "insulin-pump-management-rpn": {
    title: "Insulin Pump Management",
    cellular: {
      title: "Insulin Pump Physiology",
      content: "An insulin pump delivers rapid-acting insulin (lispro, aspart, or glulisine) as a continuous subcutaneous infusion through a small catheter inserted into the abdominal subcutaneous tissue and secured with an adhesive patch. The pump mimics physiologic insulin secretion by providing a continuous basal rate and patient-initiated bolus doses before meals. Because only rapid-acting insulin is used, any pump malfunction causes rapid hyperglycemia and potential diabetic ketoacidosis (DKA) within hours. The nurse monitors blood glucose levels, assists with pump site assessment, and reports abnormalities to the RN."
    },
    riskFactors: [
      "Type 1 diabetes mellitus",
      "Brittle diabetes with frequent hypoglycemia or hyperglycemia",
      "Pregnancy with pre-existing diabetes",
      "Patients requiring precise insulin dosing",
      "Active lifestyle requiring flexible insulin delivery",
      "History of severe hypoglycemia or hypoglycemia unawareness",
      "Adolescents and children with type 1 diabetes",
      "Patients on intensive insulin regimens"
    ],
    diagnostics: [
      "Monitor capillary blood glucose as ordered (finger stick)",
      "Report blood glucose results outside target range to the RN",
      "Monitor for signs and symptoms of hypoglycemia (BG <4 mmol/L or <70 mg/dL)",
      "Monitor for signs of hyperglycemia and possible DKA",
      "Check pump insertion site for redness, swelling, or leakage each shift",
      "Document pump alarms and report to the RN"
    ],
    management: [
      "Assist patient with blood glucose monitoring as ordered",
      "Report hypoglycemia immediately and follow facility glucose protocol",
      "Report persistent hyperglycemia (>14 mmol/L or >250 mg/dL) to the RN",
      "Do not adjust pump settings independently — report and await RN/provider orders",
      "Ensure patient has rapid-acting glucose source at bedside (juice, glucose tablets)",
      "Report any pump alarms, site concerns, or patient complaints about the device"
    ],
    nursingActions: [
      "Verify pump is functioning by checking display for error messages",
      "Assess insertion site every shift for signs of infection or dislodgement",
      "Monitor blood glucose per ordered frequency and document results",
      "Report signs of hypoglycemia: tremors, diaphoresis, confusion, tachycardia",
      "Report signs of hyperglycemia: polyuria, polydipsia, fruity breath, Kussmaul respirations",
      "Ensure the pump is not removed or disconnected without RN guidance",
      "Assist with meals and ensure patient boluses before eating"
    ],
    signs: {
      left: [
        "Hypoglycemia: tremors, diaphoresis, pallor",
        "Tachycardia and anxiety",
        "Confusion or altered LOC",
        "Hunger and irritability"
      ],
      right: [
        "Hyperglycemia: polyuria, polydipsia, blurred vision",
        "DKA: Kussmaul respirations, fruity breath",
        "Nausea, vomiting, abdominal pain",
        "Site infection: erythema, warmth, drainage"
      ]
    },
    medications: [
      { name: "Insulin Lispro (Humalog)", type: "Rapid-acting insulin", action: "Mimics physiologic prandial insulin release; onset 15 minutes, peak 1-2 hours, duration 3-5 hours", sideEffects: "Hypoglycemia, injection site reactions, lipodystrophy", contra: "During episodes of hypoglycemia", pearl: "Used in insulin pumps for both basal continuous infusion and meal-time bolus doses. Any pump interruption causes rapid hyperglycemia." },
      { name: "Glucagon", type: "Hyperglycemic agent", action: "Stimulates hepatic glycogenolysis to rapidly raise blood glucose", sideEffects: "Nausea, vomiting, transient hyperglycemia", contra: "Pheochromocytoma, insulinoma", pearl: "Emergency treatment for severe hypoglycemia when patient cannot take oral glucose. Administer IM or SC and position patient on side to prevent aspiration." }
    ],
    pearls: [
      "Insulin pumps use ONLY rapid-acting insulin — there is no long-acting insulin as backup, so pump failure causes rapid hyperglycemia",
      "Never disconnect or silence the pump without consulting the RN — alarms indicate potential safety issues",
      "If the patient is NPO for a procedure, the basal rate typically continues but bolus doses are held — confirm with the RN",
      "Site rotation every 2-3 days prevents lipodystrophy and absorption issues",
      "Severe hypoglycemia in an unconscious patient: administer glucagon IM, not oral glucose"
    ],
    quiz: [
      { question: "A patient with an insulin pump has a blood glucose of 320 mg/dL and reports nausea. What should the nurse do first?", options: ["Increase the pump basal rate", "Report findings to the nurse immediately", "Administer oral glucose", "Remove the pump and apply a new site"], correct: 1, rationale: "Persistent hyperglycemia with nausea in a pump patient may indicate DKA or pump malfunction. The nurse should report to the nurse immediately for assessment and intervention." },
      { question: "Which type of insulin is used in an insulin pump?", options: ["NPH intermediate-acting insulin", "Glargine long-acting insulin", "Rapid-acting insulin (lispro or aspart)", "Regular insulin mixed with NPH"], correct: 2, rationale: "Insulin pumps deliver rapid-acting insulin (lispro, aspart, or glulisine) as continuous basal infusion and bolus doses. No other insulin types are used in pumps." },
      { question: "What is the RPN's priority action when a patient's insulin pump alarms?", options: ["Silence the alarm and document", "Report the alarm to the RN", "Remove the pump immediately", "Administer a manual insulin injection"], correct: 1, rationale: "Pump alarms may indicate occlusion, low insulin, battery issues, or other safety concerns. The nurse should report to the nurse for assessment rather than independently managing the device." }
    ]
  },

  "insulin-pump-management-rn": {
    title: "Insulin Pump Management",
    cellular: {
      title: "Continuous Subcutaneous Insulin Infusion",
      content: "Continuous subcutaneous insulin infusion (CSII) via insulin pump delivers rapid-acting insulin analogs to mimic physiologic insulin secretion. The basal rate provides continuous low-dose insulin to suppress hepatic glucose production between meals and overnight, while patient-programmed bolus doses cover carbohydrate intake and correct hyperglycemia. Modern pumps may integrate with continuous glucose monitors (CGM) in sensor-augmented pump therapy or hybrid closed-loop systems. Pump therapy reduces A1C and glycemic variability compared to multiple daily injections (MDI) but carries unique risks: site failure, pump malfunction, and rapid progression to DKA because no long-acting insulin depot exists. The nurse must manage pump therapy during hospitalization, troubleshoot device issues, and implement sick day protocols."
    },
    riskFactors: [
      "Infusion site failure (occlusion, kinking, dislodgement)",
      "Pump mechanical malfunction",
      "Battery failure",
      "Insulin degradation from heat exposure",
      "Lipodystrophy at overused infusion sites",
      "User error in bolus calculations",
      "DKA risk within 4-6 hours of pump interruption",
      "Infection at infusion site"
    ],
    diagnostics: [
      "Monitor blood glucose every 4-6 hours or per facility protocol in hospitalized pump patients",
      "Obtain point-of-care BG to verify CGM accuracy if readings seem discordant",
      "Monitor for ketones (urine or serum beta-hydroxybutyrate) if BG >250 mg/dL",
      "Assess A1C to evaluate long-term glycemic control",
      "Review pump download data: basal rates, bolus history, correction doses",
      "Monitor electrolytes if DKA is suspected (potassium, bicarb, anion gap)",
      "Assess infusion site for signs of infection or lipodystrophy"
    ],
    management: [
      "Allow competent patients to self-manage their pump during hospitalization per policy",
      "Document pump settings: basal rates, insulin-to-carb ratios, correction factor, active insulin time",
      "Implement sick day rules: check BG every 2-4 hours, check ketones if BG >250",
      "If pump fails: transition to subcutaneous injection regimen (basal-bolus with glargine + lispro)",
      "Change infusion site every 48-72 hours to prevent site failure and lipodystrophy",
      "If BG >250 with ketones: give correction via syringe (not pump), change site, check for occlusion",
      "Coordinate with endocrinology for pump management during surgery or procedures",
      "For NPO status: continue basal rate, hold bolus doses, monitor BG hourly"
    ],
    nursingActions: [
      "Verify pump settings with the patient and document basal rate, bolus settings, and active insulin on admission",
      "Assess competency of patient to self-manage pump; involve diabetes educator if needed",
      "Troubleshoot unexplained hyperglycemia: check site, tubing, insulin reservoir, pump battery",
      "Implement DKA protocol if ketones positive: IV fluids, IV insulin drip, electrolyte replacement",
      "Educate on site rotation pattern: abdomen (fastest absorption), then arms, thighs, buttocks",
      "Coordinate with pharmacy for insulin supply if patient's pump cartridge runs low",
      "Ensure patient has backup insulin (pen or vial/syringe) in case of pump failure",
      "Remove pump and transition to IV insulin for critical illness, surgery, or hemodynamic instability"
    ],
    signs: {
      left: [
        "Controlled glycemia: BG 70-180 mg/dL",
        "Stable basal rate maintaining overnight BG",
        "Appropriate post-meal BG return to baseline",
        "No hypoglycemic episodes"
      ],
      right: [
        "Pump failure: unexplained persistent hyperglycemia",
        "DKA: Kussmaul respirations, fruity breath, lethargy",
        "Site failure: erythema, induration, leakage at site",
        "Hypoglycemia: incorrect bolus dosing, stacking insulin"
      ]
    },
    medications: [
      { name: "Insulin Aspart (NovoLog)", type: "Rapid-acting insulin", action: "Binds insulin receptors to facilitate cellular glucose uptake; onset 10-20 min, peak 1-3 hours", sideEffects: "Hypoglycemia, lipodystrophy, allergic reactions", contra: "Hypoglycemia, hypersensitivity to insulin aspart", pearl: "Most commonly used in pumps. If unexplained hyperglycemia occurs, give correction via syringe first, then troubleshoot the pump." },
      { name: "Insulin Glargine (Lantus)", type: "Long-acting basal insulin", action: "Forms microprecipitates in subcutaneous tissue providing steady insulin release over 24 hours", sideEffects: "Hypoglycemia, injection site reactions", contra: "During hypoglycemic episodes", pearl: "Used as backup basal coverage when transitioning OFF the pump. Calculate total daily basal from pump and give 80% as glargine once daily." },
      { name: "Dextrose 50% (D50W)", type: "Hypertonic glucose solution", action: "Rapidly raises blood glucose via direct IV glucose administration", sideEffects: "Hyperglycemia, phlebitis, tissue necrosis if extravasated", contra: "Known allergy to corn products", pearl: "Give 25-50 mL IV push for severe hypoglycemia in hospitalized patients with IV access. Follow with dextrose-containing IV fluids." }
    ],
    pearls: [
      "If BG is >250 with ketones in a pump patient: give correction via SYRINGE (not through the pump) because the pump/site may be malfunctioning",
      "Insulin stacking occurs when bolus doses are given too close together before prior dose has peaked — check active insulin on board before correcting",
      "Total daily dose on pump = 24-hour basal total + all bolus doses; use this to calculate transition to MDI if needed",
      "CGM readings can lag behind actual BG by 10-15 minutes — always confirm with fingerstick before treating hypoglycemia",
      "During surgery: most protocols recommend suspending the pump and starting an IV insulin infusion for tight glucose control"
    ],
    quiz: [
      { question: "A pump patient has a BG of 340 mg/dL with positive ketones. What is the RN's priority action?", options: ["Increase the pump basal rate", "Give correction dose via syringe, change the infusion site, and check for pump malfunction", "Give oral glucose tablets", "Continue current pump settings and recheck in 2 hours"], correct: 1, rationale: "High BG with ketones in a pump patient suggests site or pump failure. Correction should be given via syringe (bypassing the potentially malfunctioning pump), the site changed, and the pump/tubing inspected for occlusion." },
      { question: "How should the nurse calculate a transition from insulin pump to subcutaneous basal-bolus injections?", options: ["Give the same basal rate as a single injection of NPH", "Calculate total daily basal from pump and give 80% as glargine once daily", "Administer regular insulin IV continuously", "Use sliding scale insulin only"], correct: 1, rationale: "When transitioning off a pump, total the 24-hour basal rate from the pump and give approximately 80% of that total as once-daily glargine to account for the different pharmacokinetics." },
      { question: "A hospitalized patient on an insulin pump is going to surgery. What is the appropriate management?", options: ["Continue the pump at current settings throughout surgery", "Suspend the pump and start an IV insulin infusion", "Give NPH insulin the morning of surgery", "Disconnect the pump and give no insulin"], correct: 1, rationale: "For surgery, the pump is typically suspended and an IV insulin infusion started for precise glucose control. The patient's basal needs are still present but are best managed with IV insulin during anesthesia." }
    ]
  },

  "insulin-pump-management-np": {
    title: "Insulin Pump Management",
    cellular: {
      title: "Pump Therapeutics and Closed-Loop Systems",
      content: "Advanced insulin pump therapy encompasses sensor-augmented pump (SAP) therapy, predictive low-glucose suspend (PLGS) systems, and hybrid closed-loop (HCL) systems that automatically adjust basal insulin delivery based on CGM trends. HCL systems use algorithms to increase basal delivery when glucose rises and decrease or suspend delivery when glucose drops, significantly improving time-in-range (70-180 mg/dL) while reducing hypoglycemia. The clinician prescribes and initiates pump therapy, determines initial basal rates and bolus parameters, adjusts settings based on CGM data and A1C trends, manages perioperative insulin protocols, and handles complex sick day management including DKA prevention. Understanding pump pharmacokinetics, carbohydrate counting accuracy, and algorithm behavior is essential for optimizing outcomes."
    },
    riskFactors: [
      "Inadequate carbohydrate counting skills",
      "Non-adherence to site rotation schedule",
      "Psychological barriers (body image, alarm fatigue)",
      "Exercise-induced glycemic variability",
      "Gastroparesis affecting meal absorption timing",
      "Pregnancy requiring rapidly changing insulin needs",
      "Adolescent risk-taking behavior",
      "Technology malfunction or user error"
    ],
    diagnostics: [
      "Review CGM ambulatory glucose profile (AGP): time in range, time below range, coefficient of variation",
      "Target: >70% time in range (70-180 mg/dL), <4% time below range (<70 mg/dL)",
      "Order A1C every 3 months; target <7% for most adults, individualized for special populations",
      "Review pump data downloads: basal rate adequacy, bolus-to-basal ratio, active insulin time",
      "Assess insulin-to-carb ratios using post-meal BG patterns (target <180 at 2 hours post-meal)",
      "Evaluate correction factor using BG-to-target response",
      "Order C-peptide if differentiating type 1 from type 2 diabetes on pump"
    ],
    management: [
      "Prescribe initial basal rate: total daily dose × 0.5 (basal portion) ÷ 24 hours",
      "Set insulin-to-carb ratio: 500 ÷ total daily dose (rule of 500)",
      "Set correction factor: 1800 ÷ total daily dose (rule of 1800 for rapid-acting)",
      "Adjust basal rates based on fasting and overnight CGM trends",
      "Adjust I:C ratios based on 2-hour post-meal CGM data",
      "Prescribe HCL system (e.g., Medtronic 780G, Omnipod 5, Tandem Control-IQ) when appropriate",
      "Develop perioperative insulin management protocol: suspend pump, start IV insulin at 0.5-1 unit/hr",
      "Prescribe sick day protocol: check BG every 2-4 hours, check ketones if >250, increase basal by 10-20%"
    ],
    nursingActions: [
      "Evaluate patient readiness for pump therapy: motivation, carb counting skills, diabetes self-management",
      "Perform comprehensive pump start education or coordinate with certified diabetes educator",
      "Review and adjust pump settings at each visit based on data download analysis",
      "Manage pregnancy pump patients: anticipate increasing insulin needs by 50-100% in third trimester",
      "Develop individualized exercise protocols: temporary basal rate reductions 30-60 minutes before activity",
      "Manage gastroparesis: prescribe extended bolus or dual-wave bolus strategies",
      "Coordinate transition from pediatric to adult pump management",
      "Evaluate and prescribe CGM integration and closed-loop system upgrades"
    ],
    signs: {
      left: [
        "Optimal: A1C <7%, >70% time in range",
        "Coefficient of variation <36% (stable glycemia)",
        "No severe hypoglycemia episodes",
        "Improved quality of life metrics"
      ],
      right: [
        "Poor control: A1C >9%, <50% time in range",
        "Recurrent DKA episodes suggesting pump/site issues",
        "Frequent severe hypoglycemia",
        "Lipodystrophy causing erratic absorption"
      ]
    },
    medications: [
      { name: "Insulin Lispro-aabc (Lyumjev)", type: "Ultra-rapid-acting insulin", action: "Faster onset (onset ~5 min) than standard lispro due to added treprostinil and citrate for faster subcutaneous absorption", sideEffects: "Hypoglycemia, injection site reactions", contra: "During hypoglycemia", pearl: "Approved for pump use. Faster onset may improve postprandial glucose control. May cause more infusion site reactions than standard rapid-acting analogs." },
      { name: "Pramlintide (Symlin)", type: "Amylin analog", action: "Slows gastric emptying, suppresses glucagon secretion, promotes satiety", sideEffects: "Nausea, vomiting, severe hypoglycemia", contra: "Hypoglycemia unawareness, gastroparesis", pearl: "Can be used adjunctively with pump therapy to reduce postprandial glucose spikes. Must reduce mealtime bolus by 50% when initiating to prevent severe hypoglycemia." },
      { name: "Diazoxide", type: "Potassium channel opener", action: "Inhibits insulin secretion from pancreatic beta cells", sideEffects: "Fluid retention, hyperglycemia, hirsutism", contra: "Aortic coarctation, AV shunt", pearl: "Used in rare cases of hyperinsulinemic hypoglycemia (insulinoma, nesidioblastosis). Not routine in pump management but important differential." }
    ],
    pearls: [
      "Rule of 500 for I:C ratio and Rule of 1800 for correction factor are starting points — fine-tune using CGM data",
      "Hybrid closed-loop systems still require manual meal boluses — patients must carb count accurately",
      "Time in range >70% correlates with an A1C of approximately 7% and is now a primary glycemic metric",
      "In pregnancy, insulin needs may increase 50-100% by the third trimester — adjust pump settings every 1-2 weeks",
      "When converting from MDI to pump: reduce total daily dose by 10-20% initially to account for more consistent subcutaneous delivery"
    ],
    quiz: [
      { question: "Using the Rule of 500, what is the insulin-to-carb ratio for a patient with a total daily dose of 50 units?", options: ["1:5", "1:10", "1:15", "1:20"], correct: 1, rationale: "Rule of 500: 500 ÷ 50 (TDD) = 10. The patient needs 1 unit of insulin for every 10 grams of carbohydrate (1:10 ratio)." },
      { question: "What percentage of time in range (70-180 mg/dL) is recommended as the target for most adults with type 1 diabetes?", options: [">50%", ">60%", ">70%", ">90%"], correct: 2, rationale: "International consensus recommends >70% time in range (70-180 mg/dL) for most adults with type 1 diabetes, which correlates with an A1C of approximately 7%." },
      { question: "When initiating hybrid closed-loop pump therapy, what patient skill remains essential?", options: ["Manual basal rate programming", "Accurate carbohydrate counting for meal boluses", "Adjusting correction factor settings daily", "Performing manual glucose corrections via syringe"], correct: 1, rationale: "Even with hybrid closed-loop systems that auto-adjust basal insulin, patients must still manually bolus for meals. Accurate carbohydrate counting is essential for effective meal-time dosing." }
    ]
  },

  "anticoagulation-therapy-rpn": {
    title: "Anticoagulation Therapy",
    cellular: {
      title: "Anticoagulation Basics",
      content: "Anticoagulant medications prevent thrombus formation and propagation by interfering with the coagulation cascade. Heparin (unfractionated) acts by potentiating antithrombin III to inactivate thrombin and factor Xa. Low-molecular-weight heparins (enoxaparin) preferentially inhibit factor Xa. Warfarin inhibits vitamin K-dependent clotting factor synthesis (II, VII, IX, X). Direct oral anticoagulants (DOACs) directly inhibit thrombin (dabigatran) or factor Xa (rivaroxaban, apixaban). These medications carry significant bleeding risk. The nurse monitors for signs of bleeding, administers medications as ordered, and reports abnormal findings to the RN."
    },
    riskFactors: [
      "Deep vein thrombosis (DVT)",
      "Pulmonary embolism (PE)",
      "Atrial fibrillation",
      "Mechanical heart valve",
      "Post-surgical thromboprophylaxis",
      "Stroke prevention",
      "History of thromboembolism",
      "Inherited thrombophilia"
    ],
    diagnostics: [
      "Monitor vital signs and report tachycardia or hypotension (may indicate bleeding)",
      "Observe for signs of bleeding: bruising, petechiae, blood in urine/stool",
      "Report dark or tarry stools (melena) immediately",
      "Monitor for hematuria and report",
      "Check for gum bleeding during oral care",
      "Report headache, confusion, or vision changes (may indicate intracranial bleeding)",
      "Monitor injection sites for excessive bruising or hematoma"
    ],
    management: [
      "Administer anticoagulants at prescribed times exactly as ordered",
      "Administer subcutaneous heparin/enoxaparin using proper technique (do not aspirate, do not rub)",
      "Apply gentle pressure to injection sites without rubbing",
      "Report any signs of bleeding to the nurse immediately",
      "Implement fall prevention measures (anticoagulated patients are at higher bleeding risk with falls)",
      "Ensure patient has appropriate identification indicating anticoagulant use"
    ],
    nursingActions: [
      "Administer subcutaneous injections in the abdomen as ordered, rotating sites",
      "Do not aspirate before injecting subcutaneous heparin/LMWH",
      "Do not massage or rub the injection site after administration",
      "Monitor for bleeding at all puncture sites, IV sites, and surgical wounds",
      "Report any nosebleeds, hemoptysis, hematemesis, melena, or hematuria",
      "Implement bleeding precautions: soft toothbrush, electric razor, avoid IM injections",
      "Report any falls immediately — increased risk of internal bleeding"
    ],
    signs: {
      left: [
        "Bruising or ecchymosis",
        "Petechiae",
        "Gingival bleeding",
        "Prolonged bleeding from minor cuts"
      ],
      right: [
        "Melena or hematochezia",
        "Hematuria",
        "Hemoptysis or hematemesis",
        "Severe headache (intracranial hemorrhage)"
      ]
    },
    medications: [
      { name: "Enoxaparin (Lovenox)", type: "Low-molecular-weight heparin", action: "Preferentially inhibits factor Xa to prevent thrombus formation", sideEffects: "Bleeding, injection site bruising, thrombocytopenia (HIT)", contra: "Active major bleeding, HIT, severe thrombocytopenia", pearl: "Inject into the abdomen subcutaneously. Do NOT aspirate or rub the site. Rotate injection sites." },
      { name: "Warfarin (Coumadin)", type: "Vitamin K antagonist", action: "Inhibits vitamin K-dependent clotting factors (II, VII, IX, X)", sideEffects: "Bleeding, skin necrosis (rare), teratogenicity", contra: "Pregnancy, active bleeding, severe liver disease", pearl: "Monitor INR — therapeutic range is typically 2-3. Takes 3-5 days to reach therapeutic effect. Antidote is vitamin K." }
    ],
    pearls: [
      "When giving subcutaneous heparin or LMWH: NEVER aspirate and NEVER rub the injection site",
      "Melena (dark tarry stools) indicates GI bleeding — report immediately",
      "Falls in anticoagulated patients are medical emergencies due to internal bleeding risk",
      "Patients on warfarin should use a soft toothbrush and electric razor to minimize bleeding risk",
      "All signs of bleeding, even minor ones, should be reported to the RN"
    ],
    quiz: [
      { question: "When administering subcutaneous enoxaparin, which technique is correct?", options: ["Aspirate before injection and massage the site after", "Do not aspirate, inject into the abdomen, do not rub the site", "Inject into the deltoid muscle with a 90-degree angle", "Aspirate and apply firm pressure for 5 minutes after injection"], correct: 1, rationale: "Subcutaneous LMWH should be injected into the abdomen without aspiration before injection and without rubbing the site afterward to minimize bruising and hematoma formation." },
      { question: "A patient on warfarin reports dark, tarry stools. What should the nurse do?", options: ["Document the finding and reassess at next shift", "Report to the nurse immediately as this may indicate GI bleeding", "Increase fluid intake", "Administer an antacid"], correct: 1, rationale: "Dark tarry stools (melena) in a patient on anticoagulation indicate possible GI bleeding, a potentially life-threatening complication requiring immediate notification of the RN." },
      { question: "Which safety measure should the nurse implement for a patient on anticoagulation therapy?", options: ["Encourage vigorous tooth brushing for oral hygiene", "Use a soft toothbrush and electric razor", "Administer IM injections for pain management", "Encourage participation in contact sports"], correct: 1, rationale: "Bleeding precautions include using a soft toothbrush and electric razor to prevent tissue trauma and bleeding in anticoagulated patients." }
    ]
  },

  "anticoagulation-therapy-rn": {
    title: "Anticoagulation Therapy",
    cellular: {
      title: "Coagulation Cascade",
      content: "The coagulation cascade involves intrinsic and extrinsic pathways converging on the common pathway to generate thrombin, which converts fibrinogen to fibrin. Unfractionated heparin (UFH) potentiates antithrombin III, inactivating thrombin (factor IIa) and factor Xa, monitored by aPTT. Low-molecular-weight heparins (LMWH) have greater factor Xa selectivity and more predictable pharmacokinetics, monitored by anti-Xa levels in specific populations. Warfarin depletes vitamin K-dependent factors (II, VII, IX, X, protein C and S), monitored by PT/INR with a narrow therapeutic index. Direct oral anticoagulants (DOACs) directly inhibit either thrombin (dabigatran) or factor Xa (rivaroxaban, apixaban, edoxaban) with predictable pharmacokinetics requiring minimal monitoring. The nurse manages anticoagulation protocols, interprets coagulation labs, implements bridging therapy, and recognizes life-threatening bleeding."
    },
    riskFactors: [
      "Atrial fibrillation with CHA2DS2-VASc score ≥2",
      "Acute DVT or PE",
      "Mechanical prosthetic heart valves",
      "Post-orthopedic surgery thromboprophylaxis",
      "Antiphospholipid syndrome",
      "Cancer-associated thrombosis",
      "Recurrent thromboembolism",
      "Cerebrovascular disease"
    ],
    diagnostics: [
      "Monitor aPTT for unfractionated heparin: therapeutic range 1.5-2.5× control (typically 60-80 seconds)",
      "Draw aPTT 6 hours after heparin dose adjustment and adjust per protocol",
      "Monitor PT/INR for warfarin: therapeutic INR 2.0-3.0 (2.5-3.5 for mechanical valves)",
      "Monitor anti-Xa levels for LMWH in renal impairment, obesity, or pregnancy",
      "Monitor CBC for heparin-induced thrombocytopenia (HIT): platelet drop >50% from baseline",
      "Monitor renal function: DOACs require dose adjustment for CrCl <50 mL/min",
      "Assess for occult bleeding: guaiac stool testing, serial hemoglobin levels"
    ],
    management: [
      "Initiate heparin drip per weight-based protocol with loading bolus",
      "Adjust heparin drip based on aPTT results per institutional nomogram",
      "Bridge from heparin to warfarin: overlap for minimum 5 days until INR therapeutic for 24 hours",
      "Hold warfarin and notify provider if INR >3.0 (or per institutional threshold)",
      "Administer vitamin K (phytonadione) for INR >9 or active bleeding on warfarin",
      "For major bleeding on heparin: stop infusion, administer protamine sulfate",
      "Implement bleeding precautions: avoid IM injections, use smallest gauge IV, apply prolonged pressure",
      "Coordinate anticoagulation management with pharmacy anticoag service"
    ],
    nursingActions: [
      "Draw aPTT from non-heparinized line (contralateral to heparin infusion)",
      "Never draw coagulation labs from a heparinized port or line — results will be falsely elevated",
      "Assess neurological status frequently in patients on anticoagulation (intracranial hemorrhage risk)",
      "Monitor surgical and IV sites for oozing or hematoma formation",
      "Assess for HIT: unexplained platelet drop >50%, new thrombosis on heparin",
      "Calculate and verify heparin drip rate using weight-based protocol",
      "Educate warfarin patients on consistent vitamin K intake (not avoidance)",
      "Coordinate bridging therapy transitions and ensure overlap periods are maintained"
    ],
    signs: {
      left: [
        "Therapeutic anticoagulation: aPTT/INR in target range",
        "Resolution of thrombotic symptoms",
        "Minor bruising at injection sites",
        "Stable hemoglobin levels"
      ],
      right: [
        "Life-threatening bleeding: hemodynamic instability with hemorrhage",
        "Heparin-induced thrombocytopenia (HIT): platelet drop + paradoxical thrombosis",
        "Warfarin skin necrosis: purpuric lesions on fatty areas",
        "Intracranial hemorrhage: sudden severe headache, altered LOC, focal deficits"
      ]
    },
    medications: [
      { name: "Heparin (unfractionated)", type: "Anticoagulant", action: "Potentiates antithrombin III to inactivate thrombin and factor Xa", sideEffects: "Bleeding, HIT, osteoporosis (long-term)", contra: "Active bleeding, HIT, severe thrombocytopenia", pearl: "Monitor aPTT 6 hours after dose changes. Draw from non-heparinized line. Antidote: protamine sulfate (1 mg per 100 units heparin)." },
      { name: "Warfarin (Coumadin)", type: "Vitamin K antagonist", action: "Inhibits vitamin K epoxide reductase, depleting factors II, VII, IX, X", sideEffects: "Bleeding, teratogenicity, skin necrosis, purple toe syndrome", contra: "Pregnancy (category X), active bleeding, recent CNS surgery", pearl: "Takes 3-5 days for full effect. INR target 2-3 (2.5-3.5 for mechanical valves). Counsel on consistent (not reduced) vitamin K intake. Antidote: vitamin K + FFP/4-factor PCC." },
      { name: "Protamine sulfate", type: "Heparin antidote", action: "Binds to heparin forming an inactive complex, neutralizing anticoagulant effect", sideEffects: "Hypotension, bradycardia, anaphylaxis (fish allergy)", contra: "Fish allergy (derived from fish sperm)", pearl: "1 mg protamine neutralizes approximately 100 units of heparin. Administer slowly IV. Higher risk of reaction in patients with fish allergy." },
      { name: "Vitamin K (Phytonadione)", type: "Warfarin antidote", action: "Restores hepatic synthesis of vitamin K-dependent clotting factors", sideEffects: "Anaphylaxis (IV route), flushing", contra: "No absolute contraindications in life-threatening bleeding", pearl: "For INR >9 without bleeding: oral vitamin K 2.5-5 mg. For major bleeding: IV vitamin K 10 mg + 4-factor PCC. Takes 6-24 hours for full reversal." }
    ],
    pearls: [
      "NEVER draw coagulation labs from a heparinized line — this gives falsely elevated results and leads to inappropriate dose changes",
      "Heparin bridging to warfarin requires a minimum 5-day overlap and two consecutive therapeutic INR values 24 hours apart",
      "HIT is a clinical diagnosis: suspect when platelets drop >50% on days 5-10 of heparin therapy, especially with new thrombosis",
      "Warfarin patients should maintain CONSISTENT vitamin K intake — the teaching is NOT to avoid vitamin K foods but to eat them consistently",
      "Protamine is derived from fish sperm — ask about fish/shellfish allergy before administration"
    ],
    quiz: [
      { question: "A patient on a heparin drip has an aPTT of 120 seconds (target 60-80). What is the priority nursing action?", options: ["Continue the infusion and recheck in 6 hours", "Stop the heparin infusion and notify the provider", "Administer protamine sulfate immediately", "Increase the heparin rate"], correct: 1, rationale: "An aPTT of 120 seconds is supratherapeutic and indicates excessive anticoagulation with high bleeding risk. The heparin infusion should be stopped and the provider notified for further orders." },
      { question: "When educating a patient about warfarin and dietary vitamin K, what is the correct guidance?", options: ["Avoid all foods containing vitamin K", "Maintain a consistent intake of vitamin K-containing foods", "Take vitamin K supplements daily", "Eat extra vitamin K foods to counteract the warfarin"], correct: 1, rationale: "Patients on warfarin should maintain consistent vitamin K intake, not avoid it. Fluctuations in vitamin K intake cause INR instability and increase bleeding or clotting risk." },
      { question: "The nurse suspects heparin-induced thrombocytopenia (HIT). Which finding supports this diagnosis?", options: ["Platelet count stable at 250,000", "Platelet count dropped from 200,000 to 85,000 on day 7 of heparin", "INR of 2.5 on warfarin", "Elevated aPTT above therapeutic range"], correct: 1, rationale: "HIT typically presents 5-10 days after heparin initiation with a platelet drop >50% from baseline. Paradoxical thrombosis may also occur despite the thrombocytopenia." }
    ]
  },

  "anticoagulation-therapy-np": {
    title: "Anticoagulation Therapy",
    cellular: {
      title: "Anticoagulation Pharmacology and Prescribing",
      content: "The clinician must navigate complex anticoagulation decisions across multiple clinical scenarios. DOACs (dabigatran, rivaroxaban, apixaban, edoxaban) have largely replaced warfarin for non-valvular atrial fibrillation and VTE treatment due to predictable pharmacokinetics, fewer drug-food interactions, and no routine monitoring requirement. However, warfarin remains essential for mechanical heart valves and antiphospholipid syndrome. The choice of anticoagulant depends on indication, renal function, drug interactions, bleeding risk (HAS-BLED score), and patient factors. Reversal agents are now available for most anticoagulants: protamine for heparin, vitamin K and 4-factor PCC for warfarin, idarucizumab for dabigatran, and andexanet alfa for anti-Xa inhibitors. The clinician must prescribe, monitor, adjust, and manage transitions and complications across the anticoagulation spectrum."
    },
    riskFactors: [
      "CHA2DS2-VASc score ≥2 for atrial fibrillation stroke risk",
      "Unprovoked or recurrent VTE requiring extended anticoagulation",
      "Cancer-associated thrombosis (consider LMWH or DOAC per CLOT, HOKUSAI-VTE trials)",
      "Antiphospholipid syndrome (warfarin remains first-line)",
      "Mechanical prosthetic valves (warfarin only — DOACs contraindicated)",
      "High HAS-BLED score requiring careful risk-benefit analysis",
      "Renal impairment altering DOAC clearance",
      "Age >75 with increased bleeding risk"
    ],
    diagnostics: [
      "Calculate CHA2DS2-VASc score to determine stroke risk and anticoagulation need",
      "Calculate HAS-BLED score to assess bleeding risk on anticoagulation",
      "Order baseline and serial renal function (CrCl) for DOAC dose determination",
      "Order CBC with baseline platelet count before initiating therapy",
      "Monitor INR for warfarin patients: target 2-3 (non-valvular AF, VTE) or 2.5-3.5 (mechanical valves)",
      "Order DOAC-specific drug levels (anti-Xa calibrated to specific drug) only in emergencies or special populations",
      "Screen for drug interactions: CYP3A4 and P-glycoprotein inhibitors/inducers affect DOACs"
    ],
    management: [
      "Prescribe apixaban 5 mg BID for non-valvular AF (reduce to 2.5 mg BID if ≥2 criteria: age ≥80, weight ≤60 kg, Cr ≥1.5)",
      "Prescribe rivaroxaban 20 mg daily with food for non-valvular AF (reduce to 15 mg daily if CrCl 15-50)",
      "For acute VTE: prescribe apixaban 10 mg BID × 7 days, then 5 mg BID; or rivaroxaban 15 mg BID × 21 days, then 20 mg daily",
      "Prescribe warfarin for mechanical heart valves — DOACs are CONTRAINDICATED (RE-ALIGN trial: increased thromboembolism)",
      "Prescribe LMWH or DOAC (edoxaban, rivaroxaban) for cancer-associated thrombosis",
      "Manage perioperative bridging: hold DOAC 24-48 hours pre-procedure (longer if CrCl <50); warfarin bridge with LMWH if high-risk",
      "For DOAC reversal: idarucizumab 5g IV for dabigatran; andexanet alfa for rivaroxaban/apixaban",
      "For warfarin reversal in major bleeding: 4-factor PCC + IV vitamin K 10 mg"
    ],
    nursingActions: [
      "Select appropriate anticoagulant based on indication, renal function, and patient factors",
      "Evaluate drug interactions before prescribing: strong CYP3A4/P-gp inhibitors increase DOAC levels",
      "Manage transitions between anticoagulants: heparin-to-warfarin bridge, warfarin-to-DOAC switch",
      "Assess and manage bleeding risk: modify reversible HAS-BLED factors",
      "Coordinate with anticoagulation clinic for warfarin management",
      "Develop patient-specific perioperative anticoagulation plans",
      "Evaluate duration of therapy: provoked VTE (3 months), unprovoked VTE (indefinite), AF (lifelong)",
      "Monitor for treatment failure: recurrent thrombosis despite adequate anticoagulation"
    ],
    signs: {
      left: [
        "Therapeutic anticoagulation without bleeding complications",
        "Stroke prevention in AF: no ischemic events",
        "VTE resolution: improving leg swelling, no PE symptoms",
        "Stable INR in target range for warfarin patients"
      ],
      right: [
        "Major bleeding: GI hemorrhage, intracranial hemorrhage",
        "Treatment failure: recurrent DVT/PE on adequate anticoagulation",
        "Drug interaction: excessive anticoagulation from concurrent medications",
        "Renal deterioration: DOAC accumulation and increased bleeding risk"
      ]
    },
    medications: [
      { name: "Apixaban (Eliquis)", type: "Direct factor Xa inhibitor", action: "Directly and reversibly inhibits free and clot-bound factor Xa", sideEffects: "Bleeding, anemia, nausea", contra: "Active pathological bleeding, prosthetic heart valves", pearl: "Least renal-dependent DOAC (25% renal elimination). Preferred in elderly and renal impairment. ARISTOTLE trial showed superior stroke prevention and less bleeding vs warfarin." },
      { name: "Dabigatran (Pradaxa)", type: "Direct thrombin inhibitor", action: "Directly inhibits free and clot-bound thrombin (factor IIa)", sideEffects: "Bleeding, dyspepsia, GI bleeding (higher than warfarin)", contra: "Mechanical heart valves (RE-ALIGN), CrCl <30, active bleeding", pearl: "80% renally eliminated — contraindicated in severe renal impairment. Specific reversal agent: idarucizumab (Praxbind) 5g IV. Store in original container — moisture degrades the drug." },
      { name: "Idarucizumab (Praxbind)", type: "Dabigatran reversal agent", action: "Humanized monoclonal antibody fragment that binds dabigatran with 350× higher affinity than thrombin", sideEffects: "Headache, hypokalemia, delirium", contra: "No absolute contraindications in life-threatening bleeding", pearl: "5g IV (two 2.5g vials) for immediate reversal of dabigatran. Full reversal within minutes. RE-VERSE AD trial demonstrated efficacy." },
      { name: "Andexanet alfa (Andexxa)", type: "Factor Xa inhibitor reversal agent", action: "Recombinant modified factor Xa that acts as a decoy receptor to sequester factor Xa inhibitors", sideEffects: "Infusion reactions, thromboembolic events", contra: "Known hypersensitivity", pearl: "Reverses rivaroxaban and apixaban in life-threatening bleeding. Very expensive. 4-factor PCC is used when andexanet is unavailable." }
    ],
    pearls: [
      "DOACs are CONTRAINDICATED in mechanical heart valves — the RE-ALIGN trial with dabigatran showed increased thromboembolism and bleeding",
      "Apixaban has the best safety profile among DOACs for elderly patients and those with renal impairment (only 25% renal elimination)",
      "For acute VTE treatment with apixaban: the dose is 10 mg BID for 7 days, then 5 mg BID — this higher initial dose replaces parenteral anticoagulation",
      "Duration of anticoagulation: provoked VTE = 3 months; unprovoked VTE = consider indefinite; AF = lifelong unless contraindicated",
      "CHA2DS2-VASc ≥2 in men or ≥3 in women warrants anticoagulation for AF; score of 1 (men) or 2 (women) = consider anticoagulation"
    ],
    quiz: [
      { question: "A patient with a mechanical mitral valve asks about switching from warfarin to a DOAC. What is the NP's response?", options: ["Switch to apixaban for better safety profile", "Switch to dabigatran for easier management", "DOACs are contraindicated in mechanical heart valves — continue warfarin", "Switch to rivaroxaban with closer monitoring"], correct: 2, rationale: "DOACs are contraindicated in mechanical heart valves. The RE-ALIGN trial demonstrated that dabigatran caused increased thromboembolism and bleeding compared to warfarin in this population." },
      { question: "An NP is prescribing apixaban for a new diagnosis of acute DVT. What is the correct initial dosing?", options: ["5 mg BID immediately", "2.5 mg BID with LMWH bridge", "10 mg BID for 7 days, then 5 mg BID", "20 mg daily with food"], correct: 2, rationale: "For acute VTE, apixaban is started at 10 mg BID for the first 7 days, then reduced to 5 mg BID for ongoing treatment. The higher initial dose eliminates the need for parenteral anticoagulation bridging." },
      { question: "A patient on dabigatran presents with life-threatening intracranial hemorrhage. Which reversal agent should the clinician order?", options: ["Vitamin K 10 mg IV", "Protamine sulfate", "Idarucizumab (Praxbind) 5g IV", "Andexanet alfa"], correct: 2, rationale: "Idarucizumab (Praxbind) is the specific reversal agent for dabigatran. It is a monoclonal antibody fragment that binds dabigatran with extremely high affinity, providing immediate reversal." }
    ]
  },

  "opioid-management-rpn": {
    title: "Opioid Management",
    cellular: {
      title: "Opioid Pharmacology Basics",
      content: "Opioid analgesics act on mu, kappa, and delta receptors in the central nervous system and peripheral tissues to modulate pain perception and emotional response to pain. Mu receptor activation provides analgesia, euphoria, and respiratory depression. Opioids reduce the perception of pain at the level of the spinal cord (ascending pathways) and activate descending inhibitory pathways. The most dangerous adverse effect is respiratory depression, which occurs through direct suppression of the medullary respiratory center. The nurse monitors pain levels, vital signs (especially respiratory rate and oxygen saturation), level of consciousness, and reports concerns to the RN."
    },
    riskFactors: [
      "Post-surgical pain management",
      "Acute trauma or injury",
      "Cancer pain",
      "Chronic non-cancer pain (cautious use)",
      "History of opioid use or substance use disorder",
      "Concurrent CNS depressant use (benzodiazepines, alcohol)",
      "Respiratory compromise (COPD, sleep apnea)",
      "Elderly or debilitated patients"
    ],
    diagnostics: [
      "Monitor respiratory rate before and after opioid administration — hold and report if RR <12",
      "Monitor oxygen saturation continuously or per protocol",
      "Assess level of consciousness using sedation scale",
      "Monitor pain level using appropriate pain scale (numeric, FLACC, Wong-Baker)",
      "Monitor bowel function: assess for constipation daily",
      "Monitor urine output: report urinary retention",
      "Report any changes in mental status or excessive sedation"
    ],
    management: [
      "Administer opioids exactly as prescribed — do not adjust dose independently",
      "Assess pain before and 30-60 minutes after opioid administration",
      "Hold opioid and notify RN if respiratory rate is <12 breaths/min",
      "Keep naloxone (Narcan) readily available at bedside",
      "Implement fall precautions due to sedation and dizziness",
      "Provide stool softener/laxative as ordered (opioids cause constipation)",
      "Assist with ambulation due to fall risk from sedation"
    ],
    nursingActions: [
      "Check respiratory rate, SpO2, and sedation level BEFORE administering each opioid dose",
      "Report respiratory rate <12, excessive sedation, or pinpoint pupils immediately",
      "Administer naloxone per emergency protocol if respiratory depression occurs",
      "Assess pain using standardized scale and document response to medication",
      "Monitor for common side effects: nausea, constipation, pruritus, urinary retention",
      "Implement non-pharmacological pain interventions as adjuncts: positioning, ice, relaxation",
      "Report unrelieved pain to the nurse for possible intervention adjustment"
    ],
    signs: {
      left: [
        "Effective pain relief: decreased pain score",
        "Mild sedation (expected with initial doses)",
        "Constipation (expected with ongoing use)",
        "Pruritus and mild nausea"
      ],
      right: [
        "Respiratory depression: RR <12, shallow breathing",
        "Excessive sedation: difficult to arouse",
        "Pinpoint pupils (miosis)",
        "Hypotension and bradycardia"
      ]
    },
    medications: [
      { name: "Morphine", type: "Opioid agonist", action: "Binds mu receptors in the CNS to block ascending pain signals and activate descending inhibitory pathways", sideEffects: "Respiratory depression, constipation, nausea, sedation, pruritus, urinary retention", contra: "Severe respiratory depression, paralytic ileus, known hypersensitivity", pearl: "Always check RR before administration. Hold if RR <12 and notify RN. Keep naloxone at bedside." },
      { name: "Naloxone (Narcan)", type: "Opioid antagonist", action: "Competitively blocks opioid receptors, reversing respiratory depression and sedation", sideEffects: "Acute opioid withdrawal (pain, agitation, tachycardia, diaphoresis), pulmonary edema", contra: "No absolute contraindication in life-threatening respiratory depression", pearl: "Onset 1-2 minutes IV. Short duration (30-90 min) — may need repeated doses. Monitor for return of respiratory depression." }
    ],
    pearls: [
      "The most dangerous complication of opioid use is respiratory depression — monitor RR before EVERY dose",
      "If a patient is difficult to arouse and RR is <8, administer naloxone and call for help immediately",
      "Naloxone wears off faster than most opioids — patient must be monitored for return of respiratory depression",
      "Constipation is the ONE opioid side effect that patients do NOT develop tolerance to — always provide bowel regimen",
      "Pinpoint pupils (miosis) are a classic sign of opioid effect — report in combination with sedation"
    ],
    quiz: [
      { question: "Before administering morphine, the nurse finds the patient's respiratory rate is 10 breaths/min. What is the correct action?", options: ["Administer the morphine as scheduled", "Hold the morphine and notify the nurse immediately", "Administer half the prescribed dose", "Wait 30 minutes and recheck the respiratory rate"], correct: 1, rationale: "A respiratory rate of <12 breaths/min is a contraindication to opioid administration. The nurse should hold the dose and notify the nurse immediately for further assessment." },
      { question: "Which opioid side effect does NOT develop tolerance over time?", options: ["Sedation", "Nausea", "Constipation", "Respiratory depression"], correct: 2, rationale: "Constipation is the one opioid side effect to which patients do not develop tolerance. A prophylactic bowel regimen should be maintained throughout opioid therapy." },
      { question: "A patient receiving IV morphine becomes unresponsive with a respiratory rate of 6. What is the priority action?", options: ["Administer naloxone and call for help", "Position the patient on their side and wait", "Administer another dose of morphine for pain", "Increase the IV fluid rate"], correct: 0, rationale: "Unresponsiveness with a RR of 6 indicates severe opioid-induced respiratory depression. Naloxone must be administered immediately to reverse the opioid effect, and emergency help should be called." }
    ]
  },

  "opioid-management-rn": {
    title: "Opioid Management",
    cellular: {
      title: "Opioid Receptor Pharmacology",
      content: "Opioid analgesics produce their effects primarily through mu (μ) receptor agonism in the CNS. Mu-1 receptors mediate supraspinal analgesia, while mu-2 receptors mediate respiratory depression, constipation, and physical dependence. Kappa receptors contribute to spinal analgesia and dysphoria. The nurse must understand equianalgesic dosing for opioid rotation, the multimodal analgesia approach combining opioids with non-opioid agents (acetaminophen, NSAIDs, gabapentinoids) to reduce opioid requirements, and patient-controlled analgesia (PCA) management. Opioid-induced respiratory depression remains the primary safety concern, monitored through the Pasero Opioid-Induced Sedation Scale (POSS) and continuous pulse oximetry or capnography."
    },
    riskFactors: [
      "Opioid-naïve patients (highest risk for respiratory depression)",
      "Concurrent CNS depressants (benzodiazepines, gabapentin, alcohol)",
      "Obesity and obstructive sleep apnea",
      "Advanced age (>65) with altered pharmacokinetics",
      "Hepatic or renal impairment affecting drug metabolism/excretion",
      "Chronic respiratory disease (COPD, asthma)",
      "History of substance use disorder",
      "Post-operative patients receiving neuraxial opioids (epidural/intrathecal)"
    ],
    diagnostics: [
      "Assess pain using validated multidimensional tools: numeric rating scale, CPOT for intubated patients",
      "Monitor POSS (Pasero Opioid-Induced Sedation Scale) every 1-2 hours during opioid initiation",
      "Monitor respiratory rate, depth, oxygen saturation, and end-tidal CO2 (capnography if available)",
      "Assess for signs of oversedation: POSS 3 (frequent drowsiness) or 4 (somnolent, minimal arousal)",
      "Monitor bowel sounds and bowel movement frequency for opioid-induced constipation",
      "Evaluate functional outcomes: ability to deep breathe, cough, ambulate with adequate pain control",
      "Screen for opioid use disorder risk using validated tools (ORT, SOAPP-R)"
    ],
    management: [
      "Implement multimodal analgesia: schedule acetaminophen and/or NSAIDs around the clock, use opioids for breakthrough",
      "Program and manage PCA pump: set loading dose, demand dose, lockout interval, and hourly maximum",
      "Calculate equianalgesic conversions when rotating opioids (morphine 10 mg IV = 30 mg PO = hydromorphone 1.5 mg IV)",
      "Apply 25-50% dose reduction when converting between opioids to account for incomplete cross-tolerance",
      "Titrate opioids to pain score <4 while maintaining RR >12 and POSS ≤2",
      "Order and manage bowel regimen: senna + docusate; escalate to methylnaltrexone for refractory OIC",
      "Implement naloxone protocol: 0.04-0.4 mg IV for respiratory depression, titrate to effect",
      "Coordinate with pain management service for complex cases"
    ],
    nursingActions: [
      "Perform comprehensive pain assessment using PQRST framework before and after interventions",
      "Calculate and verify equianalgesic doses when transitioning routes or opioid agents",
      "Set up PCA with double-nurse verification of drug, concentration, and pump settings",
      "Educate patient on PCA use: only the patient should press the button (never by family or staff)",
      "Implement POSS monitoring q1-2h and escalate care for score ≥3",
      "Recognize that sedation precedes respiratory depression — intervene at excessive sedation level",
      "Manage opioid side effects proactively: antiemetics for nausea, bowel regimen for constipation",
      "Coordinate discharge opioid prescribing: use lowest effective dose for shortest duration"
    ],
    signs: {
      left: [
        "Adequate analgesia: pain score <4/10",
        "Functional improvement: ambulating, deep breathing",
        "Mild sedation (POSS 1-2): acceptable",
        "Expected side effects managed: nausea controlled, bowel moving"
      ],
      right: [
        "Oversedation: POSS 3-4, difficult to arouse",
        "Respiratory depression: RR <8, SpO2 <90%, apneic episodes",
        "Opioid-induced ileus: absent bowel sounds, distension",
        "Urinary retention: bladder distension, inability to void"
      ]
    },
    medications: [
      { name: "Hydromorphone (Dilaudid)", type: "Opioid agonist", action: "5-7× more potent than morphine at mu receptors; onset 5 min IV, 15-30 min PO", sideEffects: "Respiratory depression, sedation, constipation, nausea, pruritus", contra: "Respiratory depression, paralytic ileus, opioid-naïve patients at high doses", pearl: "Equianalgesic: hydromorphone 1.5 mg IV = morphine 10 mg IV. Preferred over morphine in renal impairment (no active metabolites like morphine-6-glucuronide)." },
      { name: "Fentanyl", type: "Opioid agonist", action: "80-100× more potent than morphine; rapid onset IV (1-2 min), highly lipophilic", sideEffects: "Respiratory depression, chest wall rigidity (rapid IV), bradycardia, constipation", contra: "Opioid-naïve patients (transdermal), acute/postoperative pain (patch)", pearl: "Transdermal patch: 72-hour duration, 12-17 hours to peak effect — NOT for acute pain. Patch takes up to 17 hours to reach full effect. IV fentanyl is titrated for acute pain." },
      { name: "Naloxone (Narcan)", type: "Opioid antagonist", action: "Competitive mu receptor antagonist; reverses respiratory depression within 1-2 minutes IV", sideEffects: "Acute withdrawal, severe pain return, pulmonary edema, tachycardia", contra: "None absolute in respiratory emergency", pearl: "Start with 0.04 mg IV and titrate up in post-surgical patients to avoid complete opioid reversal and acute pain crisis. Duration 30-90 min — shorter than most opioids, may need redosing." },
      { name: "Methylnaltrexone (Relistor)", type: "Peripheral opioid antagonist", action: "Blocks peripheral mu receptors in the GI tract without crossing BBB — reverses constipation without affecting analgesia", sideEffects: "Abdominal pain, diarrhea, nausea, flatulence", contra: "Known or suspected GI obstruction", pearl: "Subcutaneous injection for opioid-induced constipation refractory to laxatives. Does not reverse analgesia because it does not cross the blood-brain barrier." }
    ],
    pearls: [
      "Sedation ALWAYS precedes respiratory depression — if the patient is increasingly sedated, intervene before respiratory arrest",
      "In post-surgical patients, use the smallest effective naloxone dose (0.04 mg IV) to avoid complete reversal and severe pain",
      "Transdermal fentanyl takes 12-17 hours to reach peak effect — it is NEVER appropriate for acute post-operative pain",
      "PCA rule: only the PATIENT should press the PCA button. Family or nurse-activated PCA (PCA by proxy) increases respiratory depression risk",
      "When converting between opioids, always reduce the calculated equianalgesic dose by 25-50% due to incomplete cross-tolerance"
    ],
    quiz: [
      { question: "A patient's POSS score is 3 (frequently drowsy, arousable but drifts off during conversation). What is the RN's priority action?", options: ["Continue monitoring every 4 hours", "Hold further opioid doses and increase monitoring frequency", "Administer naloxone immediately", "Give the next scheduled opioid dose"], correct: 1, rationale: "POSS 3 indicates unacceptable sedation that may progress to respiratory depression. The nurse should hold further opioid doses, increase monitoring frequency, and notify the provider. Naloxone is not yet indicated unless respiratory depression develops." },
      { question: "When converting a patient from morphine 10 mg IV to an equianalgesic dose of oral hydromorphone, the calculated dose is 6 mg PO. What dose should the nurse administer?", options: ["6 mg PO (full calculated dose)", "3-4.5 mg PO (25-50% reduction)", "1.5 mg PO (75% reduction)", "12 mg PO (double the calculated dose)"], correct: 1, rationale: "When rotating between opioids, a 25-50% dose reduction from the calculated equianalgesic dose is recommended due to incomplete cross-tolerance, reducing the risk of oversedation." },
      { question: "Why is a transdermal fentanyl patch inappropriate for acute post-operative pain management?", options: ["Fentanyl is not potent enough for surgical pain", "The patch takes 12-17 hours to reach peak analgesic effect", "Fentanyl patches cannot be used in hospitalized patients", "The patch delivers too much medication too quickly"], correct: 1, rationale: "Transdermal fentanyl takes 12-17 hours to reach full analgesic effect and provides continuous analgesia for 72 hours. It is designed for chronic stable pain, not acute post-operative pain requiring rapid titration." }
    ]
  },

  "opioid-management-np": {
    title: "Opioid Management",
    cellular: {
      title: "Opioid Prescribing and Pain Management",
      content: "The clinician must navigate evidence-based opioid prescribing within the context of the opioid epidemic, balancing adequate pain management with harm reduction. Acute pain management follows multimodal protocols combining non-opioid analgesics, regional anesthesia, and short-course opioids at the lowest effective dose. Chronic pain management requires comprehensive assessment, risk stratification using the Opioid Risk Tool, prescription drug monitoring program (PDMP) checks, treatment agreements, and consideration of non-opioid alternatives. For chronic opioid therapy, the concept of morphine milligram equivalents (MME) guides risk assessment: doses >50 MME/day double the overdose risk, and doses >90 MME/day are associated with significantly increased mortality. The clinician prescribes opioid agonist therapy (buprenorphine, methadone) for opioid use disorder and manages naloxone co-prescribing for patients at overdose risk."
    },
    riskFactors: [
      "Total daily dose >50 MME (increased overdose risk)",
      "Concurrent benzodiazepine prescriptions (10× overdose risk)",
      "History of substance use disorder",
      "Mental health comorbidities (depression, PTSD, anxiety)",
      "Previous opioid overdose",
      "Sleep-disordered breathing",
      "Concurrent use of gabapentinoids or muscle relaxants",
      "Social isolation and limited monitoring capability"
    ],
    diagnostics: [
      "Calculate total daily morphine milligram equivalents (MME) for all opioid prescriptions",
      "Check PDMP before every new opioid prescription and periodically during chronic therapy",
      "Order urine drug screening at baseline and randomly during chronic opioid therapy",
      "Use Opioid Risk Tool (ORT) to stratify risk: low (<3), moderate (4-7), high (≥8)",
      "Assess functional outcomes: pain-related disability, activity level, sleep quality",
      "Monitor for aberrant behaviors: early refill requests, lost prescriptions, escalating doses",
      "Evaluate treatment agreement compliance at each visit"
    ],
    management: [
      "Prescribe multimodal analgesia first: acetaminophen, NSAIDs, topical agents, nerve blocks, physical therapy",
      "For acute pain: prescribe 3-7 day opioid supply at lowest effective dose with no refills",
      "Keep total daily dose <50 MME when possible; if >50 MME required, co-prescribe naloxone",
      "If >90 MME/day: reassess, consider pain specialist referral, implement risk mitigation strategies",
      "Taper chronic opioids by 10% per week when discontinuing; never abruptly stop",
      "Prescribe buprenorphine/naloxone (Suboxone) for opioid use disorder (NP with X-waiver or DEA registration)",
      "Co-prescribe intranasal naloxone (Narcan) for all patients on chronic opioids or with risk factors",
      "Order non-opioid adjuvants: gabapentin/pregabalin for neuropathic pain, duloxetine for musculoskeletal chronic pain"
    ],
    nursingActions: [
      "Develop and implement opioid treatment agreements for chronic therapy",
      "Review PDMP at each prescribing visit — document in chart",
      "Perform pill counts randomly for patients on chronic opioids",
      "Interpret urine drug screens: confirm prescribed opioid present, screen for non-prescribed substances",
      "Calculate and document MME at each visit to track dose trajectory",
      "Counsel patients on safe opioid storage and disposal (drug take-back programs)",
      "Train patients and families on naloxone use for emergency overdose reversal",
      "Implement evidence-based opioid tapering protocols when reducing dose"
    ],
    signs: {
      left: [
        "Effective chronic pain management: improved function, stable dose",
        "Treatment agreement compliance",
        "Clean urine drug screens",
        "Appropriate refill patterns"
      ],
      right: [
        "Opioid use disorder: escalating doses, cravings, continued use despite harm",
        "Overdose: pinpoint pupils, RR <8, unresponsive",
        "Diversion: inconsistent urine drug screens, early refills, lost prescriptions",
        "Opioid-induced hyperalgesia: worsening pain despite dose escalation"
      ]
    },
    medications: [
      { name: "Buprenorphine/Naloxone (Suboxone)", type: "Partial opioid agonist/antagonist", action: "Partial mu agonist with ceiling effect on respiratory depression; naloxone component deters IV misuse", sideEffects: "Headache, nausea, constipation, insomnia, diaphoresis, precipitated withdrawal if given too early", contra: "Active full agonist opioid use (must be in mild-moderate withdrawal before induction, COWS ≥8)", pearl: "Sublingual administration. Patient must be in withdrawal (COWS ≥8-12) before first dose to prevent precipitated withdrawal. Ceiling effect makes overdose less likely than full agonists." },
      { name: "Methadone", type: "Full opioid agonist and NMDA antagonist", action: "Long-acting mu agonist (half-life 24-36 hours) with NMDA receptor antagonism providing unique analgesic properties", sideEffects: "QTc prolongation, respiratory depression (delayed due to long half-life), sedation, constipation", contra: "QTc >500 ms, concurrent QTc-prolonging drugs", pearl: "For OUD: must be dispensed from certified opioid treatment program (OTP). For pain: can be prescribed by any provider but requires expertise due to complex pharmacokinetics and variable half-life." },
      { name: "Naltrexone (Vivitrol)", type: "Opioid antagonist", action: "Long-acting competitive opioid antagonist that blocks mu receptors for 28 days (IM injection)", sideEffects: "Hepatotoxicity, injection site reactions, nausea, precipitated withdrawal", contra: "Current opioid use (must be opioid-free 7-10 days), acute hepatitis, liver failure", pearl: "Extended-release IM injection monthly for OUD relapse prevention. Patient must be opioid-free for 7-10 days before initiation or will precipitate severe withdrawal." },
      { name: "Naloxone nasal spray (Narcan)", type: "Opioid antagonist (rescue formulation)", action: "Intranasal competitive mu receptor antagonist for emergency opioid overdose reversal", sideEffects: "Precipitated withdrawal, acute pain return", contra: "None in emergency situations", pearl: "Co-prescribe for all patients on chronic opioids, especially >50 MME/day. Train patient and family on use: 1 spray in 1 nostril, repeat in 2-3 minutes if no response. Call 911." }
    ],
    pearls: [
      "50 MME/day threshold: above this, overdose risk doubles — co-prescribe naloxone and increase monitoring",
      "NEVER start buprenorphine while patient is on full agonist opioids — must wait for withdrawal (COWS ≥8-12) to prevent precipitated withdrawal",
      "Opioid-induced hyperalgesia (OIH) is paradoxical increasing pain from opioid use — the treatment is dose REDUCTION, not increase",
      "When tapering chronic opioids: reduce by no more than 10% per week to minimize withdrawal; slower for long-term users",
      "Methadone's analgesic half-life (6-8 hours) is much shorter than its elimination half-life (24-36 hours) — this mismatch causes accumulation and delayed respiratory depression"
    ],
    quiz: [
      { question: "An NP calculates a patient's total daily opioid intake as 75 MME. What action should be taken in addition to ongoing management?", options: ["No additional actions needed below 90 MME", "Co-prescribe intranasal naloxone and reassess the treatment plan", "Immediately taper to below 50 MME", "Switch to a transdermal fentanyl patch"], correct: 1, rationale: "At >50 MME/day, overdose risk doubles. Guidelines recommend co-prescribing naloxone, reassessing the pain management plan, and considering risk mitigation strategies. Abrupt tapering is not recommended." },
      { question: "Before initiating buprenorphine/naloxone for opioid use disorder, what clinical criterion must be met?", options: ["Patient must be on a stable dose of full agonist opioid", "Patient must be in mild-moderate opioid withdrawal (COWS ≥8)", "Patient must have been opioid-free for 30 days", "Patient must fail methadone therapy first"], correct: 1, rationale: "Buprenorphine is a partial agonist that will displace full agonists from receptors and cause precipitated withdrawal. The patient must already be in mild-moderate withdrawal (COWS ≥8-12) before the first dose." },
      { question: "A patient on chronic opioids reports worsening pain despite multiple dose increases. What should the clinician suspect?", options: ["Drug-seeking behavior", "Opioid-induced hyperalgesia", "Medication tolerance requiring higher doses", "Inadequate opioid selection"], correct: 1, rationale: "Opioid-induced hyperalgesia (OIH) is a paradoxical condition where opioids cause increased pain sensitivity. It is distinguished from tolerance by the diffuse, worsening nature of pain despite dose escalation. The treatment is opioid dose reduction, not increase." }
    ]
  }
};
