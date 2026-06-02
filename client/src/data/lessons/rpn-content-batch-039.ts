import type { LessonContent } from "./types";

export const rpnContentBatch039Lessons: Record<string, LessonContent> = {
  "septic-shock-basics-rpn": {
    title: "Septic Shock Basics",
    cellular: {
      title: "Septic Shock Pathophysiology",
      content: "Septic shock is the most severe manifestation of sepsis, defined as sepsis with persistent hypotension requiring vasopressors to maintain MAP ≥ 65 mmHg and serum lactate > 2 mmol/L despite adequate fluid resuscitation. The pathophysiology involves a dysregulated host immune response to infection triggering massive cytokine release (cytokine storm) leading to widespread vasodilation, increased capillary permeability, and myocardial depression. Endotoxins from gram-negative bacteria and exotoxins from gram-positive organisms activate the inflammatory cascade including complement, coagulation, and fibrinolytic systems. Microvascular thrombosis impairs tissue oxygen delivery despite adequate cardiac output, leading to cellular hypoxia and lactate accumulation. Organ dysfunction progresses from reversible to irreversible, affecting kidneys (oliguria), lungs (ARDS), liver (coagulopathy), and brain (altered mental status). The Surviving Sepsis Campaign emphasizes the 1-hour bundle: blood cultures, broad-spectrum antibiotics, lactate measurement, and fluid resuscitation."
    },
    riskFactors: [
      "Active infection (pneumonia, UTI, intra-abdominal, skin/soft tissue)",
      "Immunocompromised state (chemotherapy, HIV, corticosteroids, organ transplant)",
      "Extremes of age (neonates and elderly > 65 years)",
      "Invasive devices (central lines, urinary catheters, mechanical ventilation)",
      "Chronic diseases (diabetes, cirrhosis, chronic kidney disease)"
    ],
    diagnostics: [
      "Serum lactate level (>2 mmol/L indicates tissue hypoperfusion)",
      "Blood cultures (at least 2 sets) before antibiotic administration",
      "Complete blood count with differential (WBC may be elevated or critically low)",
      "Procalcitonin level to help differentiate bacterial from non-bacterial causes"
    ],
    management: [
      "Administer broad-spectrum IV antibiotics within 1 hour of sepsis recognition",
      "IV crystalloid fluid bolus 30 mL/kg within first 3 hours",
      "Initiate vasopressors (norepinephrine first-line) if hypotension persists after fluids",
      "Repeat lactate measurement within 2-4 hours to assess treatment response"
    ],
    nursingActions: [
      "Recognize early sepsis signs: tachycardia, fever or hypothermia, altered mental status, tachypnea",
      "Obtain blood cultures BEFORE starting antibiotics but do not delay antibiotics for cultures",
      "Monitor vital signs continuously and urine output hourly",
      "Administer prescribed IV fluids rapidly with reassessment after each bolus",
      "Monitor serum lactate trending as a marker of tissue perfusion adequacy"
    ],
    signs: {
      left: [
        "MAP ≥ 65 mmHg without vasopressor support",
        "Lactate < 2 mmol/L and normalizing",
        "Urine output ≥ 0.5 mL/kg/hour",
        "Alert and oriented mental status"
      ],
      right: [
        "Hypotension (MAP < 65 mmHg) unresponsive to fluid boluses",
        "Serum lactate > 4 mmol/L (severe tissue hypoperfusion)",
        "Oliguria < 0.5 mL/kg/hour despite fluid resuscitation",
        "Altered mental status, mottled skin, cool extremities"
      ]
    },
    medications: [
      {
        name: "Norepinephrine (Levophed)",
        type: "First-line vasopressor for septic shock",
        action: "Potent alpha-1 and beta-1 agonist causing vasoconstriction and mild cardiac stimulation to raise MAP",
        sideEffects: "Tissue necrosis with extravasation, arrhythmias, peripheral ischemia",
        contra: "Must volume resuscitate first; administer through central line only",
        pearl: "First-line vasopressor in septic shock per Surviving Sepsis Campaign; titrate to MAP ≥ 65 mmHg."
      }
    ],
    pearls: [
      "Every hour delay in antibiotic administration increases septic shock mortality by 7-8%",
      "Lactate is a surrogate marker for tissue hypoperfusion - trend it to assess treatment response",
      "The sepsis 1-hour bundle: measure lactate, obtain blood cultures, start broad-spectrum antibiotics, give 30 mL/kg crystalloid for hypotension"
    ],
    quiz: [
      {
        question: "The first-line vasopressor for septic shock is:",
        options: ["Dopamine", "Epinephrine", "Norepinephrine", "Phenylephrine"],
        correct: 2,
        rationale: "Norepinephrine is the first-line vasopressor recommended by the Surviving Sepsis Campaign guidelines."
      },
      {
        question: "In the sepsis 1-hour bundle, broad-spectrum antibiotics should be administered within:",
        options: ["6 hours", "3 hours", "1 hour", "24 hours"],
        correct: 2,
        rationale: "The Surviving Sepsis Campaign 1-hour bundle requires antibiotic administration within 1 hour of sepsis recognition."
      },
      {
        question: "An elevated serum lactate in sepsis indicates:",
        options: ["Adequate tissue perfusion", "Tissue hypoperfusion and anaerobic metabolism", "Renal failure", "Liver function recovery"],
        correct: 1,
        rationale: "Elevated lactate indicates tissue hypoperfusion leading to anaerobic metabolism and is a key marker of sepsis severity."
      }
    ]
  },
  "anaphylactic-shock-basics-rpn": {
    title: "Anaphylactic Shock Basics",
    cellular: {
      title: "Anaphylaxis Immunopathology and Shock Progression",
      content: "Anaphylactic shock is a severe, life-threatening type I hypersensitivity reaction mediated by IgE antibodies. Upon re-exposure to an allergen, IgE bound to mast cells and basophils triggers massive degranulation releasing histamine, leukotrienes, prostaglandins, and other mediators. Histamine causes rapid vasodilation, increased vascular permeability, bronchospasm, and increased mucus production. Massive vasodilation and third-spacing of fluid cause distributive shock with profound hypotension. Laryngeal edema can cause complete airway obstruction within minutes. The biphasic response occurs in 5-20% of cases where symptoms recur 4-12 hours after initial resolution without re-exposure. Common triggers include medications (penicillin, NSAIDs), foods (peanuts, shellfish, tree nuts), insect stings (bee, wasp), latex, and contrast media. Epinephrine is the ONLY first-line treatment and must not be delayed."
    },
    riskFactors: [
      "Previous anaphylactic reaction to known allergen",
      "History of atopy (asthma, allergic rhinitis, eczema)",
      "Medication allergies, especially beta-lactam antibiotics",
      "Occupational latex exposure in healthcare workers",
      "Concurrent beta-blocker therapy (reduces epinephrine effectiveness)"
    ],
    diagnostics: [
      "Clinical diagnosis based on rapid onset of multisystem symptoms",
      "Serum tryptase level (elevated confirms mast cell degranulation)",
      "Pulse oximetry for hypoxemia assessment",
      "Continuous cardiac monitoring for dysrhythmias"
    ],
    management: [
      "Administer epinephrine IM to anterolateral thigh IMMEDIATELY",
      "Call emergency response team and prepare for airway management",
      "Position patient supine with legs elevated (unless respiratory distress)",
      "Establish IV access with large-bore catheter for fluid resuscitation"
    ],
    nursingActions: [
      "Administer epinephrine IM immediately - do not delay for other interventions",
      "Monitor airway patency and prepare for emergency intubation",
      "Administer high-flow oxygen via non-rebreather mask",
      "Initiate IV crystalloid bolus for hypotension (1-2 L NS rapidly)",
      "Observe for biphasic reaction for minimum 4-6 hours after initial treatment"
    ],
    signs: {
      left: [
        "Stable vital signs after epinephrine administration",
        "Patent airway without stridor or wheezing",
        "Resolution of urticaria and angioedema",
        "Alert and oriented without ongoing symptoms"
      ],
      right: [
        "Acute onset urticaria, angioedema, and pruritus",
        "Stridor and hoarseness indicating laryngeal edema",
        "Wheezing and severe bronchospasm",
        "Profound hypotension and tachycardia (distributive shock)"
      ]
    },
    medications: [
      {
        name: "Epinephrine 1:1000 (1 mg/mL) IM",
        type: "Adrenergic agonist (alpha and beta)",
        action: "Reverses vasodilation (alpha-1), bronchospasm (beta-2), and stabilizes mast cells to halt mediator release",
        sideEffects: "Tachycardia, palpitations, anxiety, headache, tremor",
        contra: "None in true anaphylaxis - epinephrine is always indicated",
        pearl: "0.3-0.5 mg IM in anterolateral thigh (NOT deltoid); may repeat every 5-15 minutes; there are NO contraindications to epinephrine in anaphylaxis."
      }
    ],
    pearls: [
      "Epinephrine is the ONLY first-line treatment for anaphylaxis - antihistamines and steroids are adjuncts, not replacements",
      "IM injection in the anterolateral thigh provides fastest absorption - never give subcutaneously or in the deltoid",
      "Monitor for biphasic reaction for at least 4-6 hours - symptoms can recur without re-exposure to the allergen"
    ],
    quiz: [
      {
        question: "The first medication administered for anaphylaxis is:",
        options: ["Diphenhydramine IV", "Methylprednisolone IV", "Epinephrine IM", "Albuterol nebulizer"],
        correct: 2,
        rationale: "Epinephrine IM is the first-line, life-saving treatment for anaphylaxis and must not be delayed."
      },
      {
        question: "The preferred injection site for epinephrine in anaphylaxis is:",
        options: ["Deltoid muscle", "Anterolateral thigh", "Gluteal muscle", "Subcutaneous in the arm"],
        correct: 1,
        rationale: "The anterolateral thigh (vastus lateralis) provides the fastest and most reliable absorption of IM epinephrine."
      },
      {
        question: "After successful treatment of anaphylaxis, the patient should be monitored for a minimum of:",
        options: ["30 minutes", "1 hour", "4-6 hours", "24 hours is not necessary"],
        correct: 2,
        rationale: "Biphasic reactions can occur 4-12 hours after initial resolution; minimum 4-6 hour observation is recommended."
      }
    ]
  },
  "respiratory-failure-basics-rpn": {
    title: "Respiratory Failure Basics",
    cellular: {
      title: "Acute Respiratory Failure Pathophysiology",
      content: "Acute respiratory failure occurs when the respiratory system fails to maintain adequate gas exchange, classified as Type I (hypoxemic, PaO2 < 60 mmHg) or Type II (hypercapnic, PaCO2 > 50 mmHg with acidosis). Type I failure results from ventilation-perfusion (V/Q) mismatch, shunt, or diffusion impairment seen in pneumonia, pulmonary edema, ARDS, and pulmonary embolism. Type II failure results from inadequate alveolar ventilation due to respiratory center depression (opioids, brainstem injury), neuromuscular disease (Guillain-Barré, myasthenia gravis), or severe airway obstruction (COPD exacerbation, asthma). Early signs include restlessness, anxiety, tachypnea, and accessory muscle use. Late signs include confusion, lethargy, cyanosis, and bradycardia indicating imminent respiratory arrest. Oxygen supplementation treats Type I failure, while ventilatory support (BiPAP or intubation) is needed for Type II failure."
    },
    riskFactors: [
      "COPD exacerbation with worsening air trapping",
      "Severe pneumonia or acute respiratory distress syndrome",
      "Opioid or sedative overdose depressing respiratory drive",
      "Neuromuscular diseases (Guillain-Barré, myasthenia crisis)",
      "Massive pulmonary embolism reducing gas exchange surface"
    ],
    diagnostics: [
      "Arterial blood gas (ABG) for PaO2, PaCO2, pH, and HCO3",
      "Pulse oximetry for continuous oxygen saturation monitoring",
      "Chest X-ray for underlying pulmonary pathology",
      "Respiratory rate, depth, and pattern assessment"
    ],
    management: [
      "Administer supplemental oxygen to maintain SpO2 > 90% (88-92% in COPD)",
      "Position upright (high Fowler's) to maximize lung expansion",
      "Prepare for non-invasive ventilation (BiPAP/CPAP) or intubation if worsening",
      "Treat underlying cause (antibiotics for pneumonia, bronchodilators for COPD)"
    ],
    nursingActions: [
      "Monitor respiratory rate, depth, SpO2, and work of breathing continuously",
      "Assess for accessory muscle use, nasal flaring, and tripod positioning",
      "Maintain head of bed elevated and ensure airway patency",
      "Have emergency intubation equipment at bedside (crash cart ready)",
      "Report changes in mental status immediately as this indicates worsening failure"
    ],
    signs: {
      left: [
        "Respiratory rate 12-20 with adequate tidal volume",
        "SpO2 > 94% on room air (or baseline for patient)",
        "ABG within normal parameters (PaO2 80-100, PaCO2 35-45)",
        "Alert and oriented without respiratory distress"
      ],
      right: [
        "Tachypnea > 24 with accessory muscle use and tripod positioning",
        "SpO2 < 90% despite supplemental oxygen",
        "PaCO2 > 50 mmHg with pH < 7.35 (respiratory acidosis)",
        "Confusion progressing to lethargy (late, ominous sign)"
      ]
    },
    medications: [
      {
        name: "Albuterol (Ventolin) nebulizer",
        type: "Short-acting beta-2 agonist bronchodilator",
        action: "Relaxes bronchial smooth muscle causing bronchodilation and improved airflow",
        sideEffects: "Tachycardia, tremor, anxiety, hypokalemia with repeated doses",
        contra: "Use caution in patients with known cardiac arrhythmias",
        pearl: "For acute bronchospasm contributing to respiratory failure; can be given continuously in severe cases; monitor heart rate and potassium."
      }
    ],
    pearls: [
      "Restlessness and anxiety are early signs of hypoxia - do not sedate without investigating the cause",
      "In COPD patients, maintain SpO2 at 88-92% to avoid suppressing hypoxic respiratory drive",
      "A patient who was tachypneic and agitated suddenly becoming calm and bradypneic may be decompensating, not improving"
    ],
    quiz: [
      {
        question: "The earliest clinical sign of respiratory failure is typically:",
        options: ["Cyanosis", "Bradycardia", "Restlessness and tachypnea", "Decreased urine output"],
        correct: 2,
        rationale: "Restlessness and tachypnea are early compensatory signs of hypoxemia before cyanosis and bradycardia develop."
      },
      {
        question: "Type II respiratory failure is characterized by:",
        options: ["Low PaO2 with normal PaCO2", "Elevated PaCO2 with respiratory acidosis", "Metabolic alkalosis", "High PaO2 with low pH"],
        correct: 1,
        rationale: "Type II failure involves hypercapnia (elevated PaCO2 > 50 mmHg) from inadequate ventilation causing respiratory acidosis."
      },
      {
        question: "For a COPD patient in respiratory failure, the target SpO2 is:",
        options: ["100%", "95-100%", "88-92%", "75-80%"],
        correct: 2,
        rationale: "COPD patients rely on hypoxic drive; excessive oxygen (SpO2 > 92%) can suppress respiratory drive and worsen CO2 retention."
      }
    ]
  },
  "mechanical-ventilation-awareness-rpn": {
    title: "Mechanical Ventilation Awareness",
    cellular: {
      title: "Mechanical Ventilation Principles for Practical Nurses",
      content: "Mechanical ventilation provides respiratory support by delivering positive pressure breaths through an endotracheal tube or tracheostomy when patients cannot maintain adequate oxygenation or ventilation independently. Common modes include assist-control (AC), which delivers a set number of breaths at a set tidal volume with patient-triggered additional breaths; synchronized intermittent mandatory ventilation (SIMV), which delivers set breaths while allowing spontaneous breathing between; and pressure support ventilation (PSV), which augments patient-initiated breaths. Key settings include FiO2 (fraction of inspired oxygen, 21-100%), tidal volume (6-8 mL/kg ideal body weight), respiratory rate, and PEEP (positive end-expiratory pressure that prevents alveolar collapse). Complications include ventilator-associated pneumonia (VAP), barotrauma, auto-PEEP, and ventilator-associated events. The VAP prevention bundle includes head of bed elevation, oral care with chlorhexidine, daily sedation vacation, and daily readiness-to-wean assessment."
    },
    riskFactors: [
      "Prolonged intubation duration increasing VAP risk",
      "Supine positioning allowing aspiration of oropharyngeal secretions",
      "Poor oral hygiene providing bacterial reservoir for aspiration",
      "Over-sedation preventing spontaneous breathing trials",
      "High ventilator pressures causing barotrauma"
    ],
    diagnostics: [
      "Continuous pulse oximetry and end-tidal CO2 monitoring",
      "Arterial blood gas analysis for ventilator setting adjustments",
      "Chest X-ray for ET tube position and lung pathology",
      "Ventilator waveform analysis for patient-ventilator synchrony"
    ],
    management: [
      "Maintain head of bed at 30-45 degrees to reduce aspiration risk",
      "Perform oral care with chlorhexidine every 2-4 hours per protocol",
      "Participate in daily sedation vacation and spontaneous breathing trial assessment",
      "Maintain cuff pressure at 20-30 cmH2O to prevent aspiration"
    ],
    nursingActions: [
      "Verify ET tube position and depth at beginning of each shift",
      "Monitor ventilator alarms and respond to high-pressure, low-pressure, and disconnect alarms",
      "Perform oral care and suctioning as needed using aseptic technique",
      "Maintain sedation at lowest effective level per assessment tools (RASS)",
      "Keep manual resuscitation bag at bedside at all times"
    ],
    signs: {
      left: [
        "SpO2 within target range on prescribed ventilator settings",
        "Synchronous breathing with ventilator (no fighting/bucking)",
        "ET tube secure at proper depth with bilateral breath sounds",
        "Cuff pressure 20-30 cmH2O preventing aspiration"
      ],
      right: [
        "Ventilator alarming: high pressure (kinked tube, secretions, biting)",
        "Ventilator alarming: low pressure or disconnect (tube displacement)",
        "Patient fighting the ventilator with agitation and desaturation",
        "Subcutaneous emphysema suggesting pneumothorax/barotrauma"
      ]
    },
    medications: [
      {
        name: "Propofol (Diprivan)",
        type: "IV sedative-hypnotic for ventilator sedation",
        action: "GABA-A receptor agonist producing dose-dependent sedation with rapid onset and offset",
        sideEffects: "Hypotension, respiratory depression, propofol infusion syndrome (rare with prolonged high-dose use)",
        contra: "Soy or egg allergy (lipid-based emulsion), propofol infusion syndrome risk with prolonged use",
        pearl: "Monitor triglycerides every 48 hours; count propofol calories as fat (1.1 kcal/mL); daily sedation vacations are essential."
      }
    ],
    pearls: [
      "If the ventilator alarms and the patient is in distress, disconnect the patient and manually ventilate with a bag-valve-mask while troubleshooting",
      "Head of bed at 30-45 degrees is the single most important VAP prevention measure",
      "Always keep a manual resuscitation bag at the bedside of every ventilated patient"
    ],
    quiz: [
      {
        question: "If a ventilated patient suddenly desaturates and the ventilator alarm sounds, the nurse should first:",
        options: ["Increase the FiO2", "Disconnect and manually ventilate with bag-valve-mask", "Silence the alarm", "Call respiratory therapy and wait"],
        correct: 1,
        rationale: "If the patient is in distress, disconnect from the ventilator and provide manual ventilation while assessing the problem."
      },
      {
        question: "The head of bed should be maintained at what angle for ventilated patients to prevent VAP?",
        options: ["Flat (0 degrees)", "15 degrees", "30-45 degrees", "90 degrees"],
        correct: 2,
        rationale: "Head of bed elevation 30-45 degrees reduces aspiration of oropharyngeal secretions and is a core VAP prevention measure."
      },
      {
        question: "ET tube cuff pressure should be maintained at:",
        options: ["5-10 cmH2O", "20-30 cmH2O", "40-50 cmH2O", "Pressure does not matter"],
        correct: 1,
        rationale: "Cuff pressure 20-30 cmH2O prevents aspiration while avoiding tracheal mucosal ischemia from over-inflation."
      }
    ]
  },
  "arterial-line-awareness-rpn": {
    title: "Arterial Line Awareness",
    cellular: {
      title: "Arterial Hemodynamic Monitoring Principles",
      content: "An arterial line (A-line) is an invasive catheter placed in a peripheral artery (most commonly radial, but also femoral, brachial, or dorsalis pedis) for continuous blood pressure monitoring and frequent arterial blood gas sampling. The radial artery is preferred due to collateral circulation from the ulnar artery (assessed by Allen test before insertion). The arterial waveform displays the cardiac cycle: the upstroke represents ventricular ejection (systole), the dicrotic notch represents aortic valve closure, and the downslope represents diastole. The transducer must be leveled at the phlebostatic axis (4th intercostal space, mid-axillary line) and zeroed to atmospheric pressure for accurate readings. Complications include hemorrhage from disconnection, thrombosis, infection, arterial spasm, and distal ischemia. Never administer medications or fluids through an arterial line, as arterial injection can cause tissue necrosis."
    },
    riskFactors: [
      "Hemodynamic instability requiring continuous BP monitoring",
      "Frequent arterial blood gas sampling needs in respiratory failure",
      "Vasopressor therapy requiring precise titration to MAP goals",
      "Critical care patients with unreliable non-invasive BP readings",
      "Peripheral vascular disease increasing risk of arterial thrombosis"
    ],
    diagnostics: [
      "Allen test before radial artery cannulation to verify collateral flow",
      "Continuous arterial waveform monitoring for morphology assessment",
      "Arterial blood gas sampling through the A-line stopcock",
      "Distal perfusion assessment (pulse, color, temperature, capillary refill)"
    ],
    management: [
      "Level and zero the transducer at the phlebostatic axis each shift",
      "Maintain continuous pressure monitoring with alarm limits set",
      "Assess insertion site and distal perfusion every 1-2 hours",
      "Ensure all connections are Luer-locked to prevent accidental hemorrhage"
    ],
    nursingActions: [
      "Check that all connections are secure and Luer-locked to prevent hemorrhage",
      "Assess the insertion site for signs of infection, hematoma, or bleeding",
      "Monitor distal extremity for color, warmth, pulses, and capillary refill",
      "NEVER inject medications or flush with air through the arterial line",
      "Maintain the pressure bag at 300 mmHg to prevent backflow of blood"
    ],
    signs: {
      left: [
        "Clear arterial waveform with dicrotic notch visible",
        "Distal extremity warm with strong pulse and capillary refill < 3 seconds",
        "Insertion site clean, dry, intact without erythema",
        "All connections secure and pressure bag inflated to 300 mmHg"
      ],
      right: [
        "Dampened waveform (clot, kink, air bubble, or positional)",
        "Pallor, coolness, or absent pulse distal to insertion site",
        "Bleeding from insertion site or disconnected tubing",
        "Signs of infection at insertion site (erythema, purulent drainage)"
      ]
    },
    medications: [
      {
        name: "Heparinized Saline (for A-line flush)",
        type: "Anticoagulant flush solution",
        action: "Maintains arterial line patency by preventing clot formation at the catheter tip",
        sideEffects: "Heparin-induced thrombocytopenia (HIT) with prolonged use (rare with flush doses)",
        contra: "Known HIT history (use plain normal saline flush instead)",
        pearl: "Maintain continuous flush at 3 mL/hour under 300 mmHg pressure; some facilities use plain NS without heparin."
      }
    ],
    pearls: [
      "NEVER inject anything through an arterial line - this can cause distal tissue necrosis and limb loss",
      "If the arterial line disconnects, apply direct pressure immediately - arterial hemorrhage can cause rapid exsanguination",
      "A dampened waveform with diminished pulse pressure usually indicates a positional problem, air bubble, or clot at the tip"
    ],
    quiz: [
      {
        question: "Before radial arterial line insertion, which test assesses collateral circulation?",
        options: ["Phalen test", "Allen test", "Tinel sign", "Homan sign"],
        correct: 1,
        rationale: "The Allen test assesses ulnar artery patency to ensure adequate collateral blood flow if radial artery occludes."
      },
      {
        question: "The transducer for an arterial line should be leveled at:",
        options: ["The level of the head", "The phlebostatic axis (4th ICS, mid-axillary)", "The level of the heart apex", "Any comfortable position"],
        correct: 1,
        rationale: "The phlebostatic axis provides accurate arterial pressure readings when the transducer is leveled and zeroed there."
      },
      {
        question: "Which action is CONTRAINDICATED for an arterial line?",
        options: ["Drawing blood samples", "Monitoring continuous BP", "Administering IV medications", "Maintaining pressure bag at 300 mmHg"],
        correct: 2,
        rationale: "NEVER inject medications through an arterial line - arterial injection causes severe tissue necrosis and potential limb loss."
      }
    ]
  },
  "central-line-awareness-rpn": {
    title: "Central Line Awareness",
    cellular: {
      title: "Central Venous Access and CLABSI Prevention",
      content: "A central venous catheter (CVC) is placed with the tip in the superior vena cava or right atrium, providing venous access for vesicant medications, TPN, vasopressors, hemodynamic monitoring, and hemodialysis. Common insertion sites include the internal jugular, subclavian, and femoral veins. Peripherally inserted central catheters (PICCs) provide central access through arm veins. Central line-associated bloodstream infections (CLABSIs) are a leading cause of preventable healthcare-associated death, with mortality rates of 12-25%. The CLABSI prevention bundle includes hand hygiene, maximal sterile barrier precautions during insertion, chlorhexidine skin preparation, optimal catheter site selection (subclavian preferred for lowest infection risk), and daily review of line necessity with prompt removal when no longer needed. Hub contamination from healthcare workers' hands is the most common route of infection after insertion."
    },
    riskFactors: [
      "Prolonged central line dwell time",
      "Femoral insertion site (highest infection and thrombosis risk)",
      "Multiple lumens providing more access points for contamination",
      "Frequent line access increasing hub contamination risk",
      "Immunocompromised patients with impaired infection response"
    ],
    diagnostics: [
      "Blood cultures drawn from line AND peripheral site to diagnose CLABSI",
      "Chest X-ray to confirm tip position after insertion",
      "Daily assessment of insertion site for infection signs",
      "CBC and inflammatory markers if CLABSI suspected"
    ],
    management: [
      "Implement CLABSI prevention bundle for all central lines",
      "Perform daily assessment of line necessity - remove when no longer needed",
      "Change dressings per protocol (transparent dressing every 7 days, gauze every 2 days)",
      "Scrub the hub with alcohol for 15 seconds before every access"
    ],
    nursingActions: [
      "Assess central line dressing and insertion site every shift",
      "Scrub all catheter hubs with 70% alcohol for 15 seconds before access",
      "Change transparent dressings every 7 days or when soiled, loose, or damp",
      "Flush each lumen per protocol to maintain patency",
      "Advocate for line removal when it is no longer clinically necessary"
    ],
    signs: {
      left: [
        "Dressing intact, clean, dry with visible insertion site",
        "No erythema, swelling, or tenderness at insertion site",
        "Lines flushing easily without resistance",
        "Patient afebrile with negative blood cultures"
      ],
      right: [
        "Erythema, purulent drainage, or tenderness at insertion site",
        "Fever, rigors, or hemodynamic instability with central line in place",
        "Line occlusion or inability to aspirate blood",
        "Dressing wet, soiled, or not intact"
      ]
    },
    medications: [
      {
        name: "Alteplase (Cathflo Activase)",
        type: "Thrombolytic for catheter clearance",
        action: "Dissolves fibrin clots occluding central line lumens by activating plasminogen",
        sideEffects: "Bleeding at catheter site, systemic fibrinolysis (rare with catheter dose)",
        contra: "Active internal bleeding, known intracranial pathology",
        pearl: "2 mg instilled into occluded lumen for 30-120 minutes; used for catheter occlusion ONLY, not systemic thrombolysis."
      }
    ],
    pearls: [
      "Scrub the hub for 15 seconds before every access - this is the #1 modifiable CLABSI prevention step post-insertion",
      "The subclavian vein is the preferred site for non-tunneled CVCs due to lowest infection and thrombosis risk",
      "Daily assessment of line necessity is mandatory - the safest central line is the one that has been removed"
    ],
    quiz: [
      {
        question: "The most important step to prevent CLABSI during routine line access is:",
        options: ["Using sterile gloves", "Scrubbing the hub with alcohol for 15 seconds", "Wearing a mask", "Applying antibiotic ointment to the site"],
        correct: 1,
        rationale: "Hub contamination is the most common infection route post-insertion; scrubbing the hub for 15 seconds is the critical prevention step."
      },
      {
        question: "Transparent central line dressings should be changed every:",
        options: ["24 hours", "48 hours", "7 days or when compromised", "14 days"],
        correct: 2,
        rationale: "Transparent dressings are changed every 7 days or immediately if soiled, loose, damp, or integrity is compromised."
      },
      {
        question: "Which central line insertion site has the lowest infection risk?",
        options: ["Femoral vein", "Internal jugular vein", "Subclavian vein", "All sites have equal risk"],
        correct: 2,
        rationale: "The subclavian site has the lowest CLABSI risk compared to internal jugular and femoral insertion sites."
      }
    ]
  },
  "rapid-response-activation-rpn": {
    title: "Rapid Response Team Activation",
    cellular: {
      title: "Early Deterioration Recognition and Escalation",
      content: "Rapid Response Teams (RRTs) are hospital-based teams activated when a patient shows signs of clinical deterioration outside of ICU settings, aiming to prevent cardiac arrest and unplanned ICU transfer. The concept is based on evidence that patients exhibit warning signs 6-24 hours before cardiac arrest, and early intervention can prevent progression to arrest. RRT activation criteria typically include acute changes in heart rate (<40 or >130 bpm), respiratory rate (<8 or >28/min), systolic blood pressure (<90 mmHg), oxygen saturation (<90%), urine output (<0.5 mL/kg/hr for 2+ hours), acute change in mental status, and staff member concern about the patient ('worried' criterion). Any healthcare team member, including practical nurses, can activate the RRT. The RRT typically includes a critical care nurse, physician or nurse practitioner, and respiratory therapist who respond within minutes to assess and stabilize the patient."
    },
    riskFactors: [
      "Patients recently transferred from ICU or step-down unit",
      "Post-surgical patients within first 24-48 hours",
      "Patients on high-risk medications (opioids, anticoagulants, insulin)",
      "Patients with multiple comorbidities and baseline fragility",
      "Inadequate nurse-to-patient ratios limiting close monitoring"
    ],
    diagnostics: [
      "Vital signs comparison to baseline and trending",
      "Point-of-care blood glucose measurement",
      "Pulse oximetry and cardiac rhythm assessment",
      "Rapid neurological assessment (GCS, pupil reactivity)"
    ],
    management: [
      "Activate RRT immediately when criteria are met - do not delay",
      "Stay with the patient and perform focused assessment",
      "Gather patient information using SBAR format for team report",
      "Prepare for potential escalation to code blue if needed"
    ],
    nursingActions: [
      "Activate RRT using hospital protocol when any single criterion is met",
      "Prepare SBAR report: Situation, Background, Assessment, Recommendation",
      "Stay with the patient and continue monitoring while awaiting RRT arrival",
      "Bring the chart, medication list, and recent vitals to the bedside",
      "Document the event, RRT response, interventions, and patient outcome"
    ],
    signs: {
      left: [
        "Vital signs within patient's normal parameters",
        "Alert and oriented at baseline mental status",
        "Urine output > 0.5 mL/kg/hour",
        "SpO2 > 94% on usual supplemental oxygen"
      ],
      right: [
        "Heart rate < 40 or > 130 bpm (acute change from baseline)",
        "Respiratory rate < 8 or > 28/min with increased work of breathing",
        "Systolic BP < 90 mmHg not responsive to position change",
        "Acute confusion or decreased level of consciousness"
      ]
    },
    medications: [
      {
        name: "Naloxone (Narcan)",
        type: "Opioid antagonist",
        action: "Competitively binds opioid receptors reversing respiratory depression, sedation, and hypotension from opioid overdose",
        sideEffects: "Acute opioid withdrawal symptoms, nausea, vomiting, tachycardia, agitation",
        contra: "Use caution in opioid-dependent patients (can precipitate severe withdrawal)",
        pearl: "Duration of action (30-90 min) may be shorter than the opioid causing the crisis - monitor for resedation and repeat doses as needed."
      }
    ],
    pearls: [
      "Trust your clinical instincts - 'I'm worried about my patient' is a valid and encouraged reason to activate the RRT",
      "Most patients who arrest on general floors show warning signs 6-24 hours before the event - early recognition saves lives",
      "Never wait to see if a patient improves before calling the RRT when criteria are met - early activation improves outcomes"
    ],
    quiz: [
      {
        question: "A practical nurse notices a patient's heart rate suddenly drops to 38 bpm. The appropriate action is to:",
        options: ["Wait and recheck in 15 minutes", "Document and continue monitoring", "Activate the Rapid Response Team immediately", "Ask the patient how they feel"],
        correct: 2,
        rationale: "Heart rate < 40 bpm meets RRT activation criteria and requires immediate team response."
      },
      {
        question: "When preparing to report to the RRT, the nurse should organize information using:",
        options: ["ABC format", "SBAR format", "Head-to-toe format", "Alphabetical order"],
        correct: 1,
        rationale: "SBAR (Situation, Background, Assessment, Recommendation) provides structured, efficient communication during emergencies."
      },
      {
        question: "Which criterion is unique to RRT activation compared to other emergency responses?",
        options: ["Cardiac arrest", "Staff member concern about patient condition", "Choking", "Fire emergency"],
        correct: 1,
        rationale: "The 'worried' criterion allows any team member to activate RRT based on clinical instinct even without meeting numerical criteria."
      }
    ]
  },
  "early-warning-scores-rpn": {
    title: "Early Warning Score Systems",
    cellular: {
      title: "Standardized Deterioration Detection Through Scoring",
      content: "Early warning score (EWS) systems are standardized tools that aggregate multiple vital sign parameters into a composite score to identify patients at risk for clinical deterioration. The National Early Warning Score 2 (NEWS2) assigns points based on respiratory rate, oxygen saturation, supplemental oxygen use, temperature, systolic blood pressure, heart rate, and level of consciousness. A total score of 0-4 indicates low risk, 5-6 indicates medium risk requiring increased monitoring, and ≥7 indicates high risk requiring urgent clinical review. The Modified Early Warning Score (MEWS) is a simpler version using five parameters. Pediatric Early Warning Score (PEWS) adapts criteria for children. Single-parameter triggers (any one vital sign severely abnormal) also warrant escalation regardless of total score. EWS systems standardize the recognition and communication of patient deterioration, reducing subjectivity and empowering all staff to escalate concerns objectively."
    },
    riskFactors: [
      "Failure to accurately measure and record vital signs",
      "Incorrect EWS calculation leading to missed escalation triggers",
      "Non-compliance with escalation protocols despite elevated scores",
      "Infrequent vital sign assessments missing early deterioration",
      "Lack of staff training on EWS interpretation and response protocols"
    ],
    diagnostics: [
      "Vital signs assessment: respiratory rate, SpO2, temperature, HR, BP",
      "Level of consciousness assessment (Alert, Voice, Pain, Unresponsive - AVPU)",
      "EWS calculation and comparison to previous scores",
      "Trending of individual parameters and composite score over time"
    ],
    management: [
      "Calculate EWS with every set of vital signs",
      "Follow escalation protocol based on score: low (routine), medium (increase frequency), high (urgent review)",
      "Reassess within 1 hour of any intervention for elevated scores",
      "Communicate score changes using structured handoff tools"
    ],
    nursingActions: [
      "Calculate EWS accurately each time vital signs are assessed",
      "Escalate care per protocol when scores indicate medium or high risk",
      "Increase monitoring frequency for patients with rising scores",
      "Document EWS score, interventions taken, and patient response",
      "Communicate score trends during shift handoff and interdisciplinary rounds"
    ],
    signs: {
      left: [
        "EWS score 0-4 (low risk, routine monitoring)",
        "Vital signs within normal parameters for patient",
        "Score trending stable or improving",
        "Patient alert and at baseline clinical status"
      ],
      right: [
        "EWS score 5-6 (medium risk, increase monitoring)",
        "EWS score ≥ 7 (high risk, urgent clinical review required)",
        "Any single parameter scoring maximum points (red trigger)",
        "Score trending upward despite interventions"
      ]
    },
    medications: [
      {
        name: "IV Normal Saline (0.9% NaCl)",
        type: "Isotonic crystalloid fluid",
        action: "Expands intravascular volume to improve blood pressure and tissue perfusion",
        sideEffects: "Fluid overload, peripheral edema, hyperchloremic acidosis with large volumes",
        contra: "Severe heart failure with pulmonary edema (may worsen congestion)",
        pearl: "A fluid bolus of 250-500 mL may be appropriate when elevated EWS is driven by hypotension; reassess after each bolus."
      }
    ],
    pearls: [
      "An upward trend in EWS is more significant than any single score - always compare to previous scores",
      "Respiratory rate is the most sensitive single vital sign for predicting deterioration - never estimate it",
      "EWS tools empower practical nurses to objectively escalate concerns even when physicians may not be immediately available"
    ],
    quiz: [
      {
        question: "A NEWS2 score of 7 or higher requires:",
        options: ["Routine monitoring", "Vital signs every 4 hours", "Urgent clinical review and escalation", "Discharge planning"],
        correct: 2,
        rationale: "A NEWS2 score ≥ 7 indicates high risk and requires urgent clinical review and consideration of higher level of care."
      },
      {
        question: "Which single vital sign is most sensitive for early detection of clinical deterioration?",
        options: ["Blood pressure", "Temperature", "Respiratory rate", "Heart rate"],
        correct: 2,
        rationale: "Respiratory rate changes often precede other vital sign abnormalities and is the most sensitive predictor of deterioration."
      },
      {
        question: "The purpose of early warning score systems is to:",
        options: ["Replace clinical judgment entirely", "Standardize recognition and escalation of patient deterioration", "Reduce nursing documentation", "Determine discharge readiness"],
        correct: 1,
        rationale: "EWS systems standardize deterioration detection and provide objective triggers for escalation, supplementing clinical judgment."
      }
    ]
  },
  "post-cardiac-arrest-care-rpn": {
    title: "Post-Cardiac Arrest Care Basics",
    cellular: {
      title: "Post-Resuscitation Syndrome and Targeted Care",
      content: "Post-cardiac arrest care addresses the unique pathophysiology that follows return of spontaneous circulation (ROSC) after cardiac arrest. The post-cardiac arrest syndrome includes brain injury from global ischemia-reperfusion, myocardial dysfunction (stunned myocardium), systemic ischemia-reperfusion response, and the persistent precipitating pathology. Targeted temperature management (TTM) at 32-36°C for 24 hours is the most evidence-based neuroprotective intervention, reducing cerebral metabolic demand and mitigating reperfusion injury. Hemodynamic optimization targets MAP > 65 mmHg and avoidance of hypotension. Oxygenation management avoids both hypoxemia (SpO2 < 94%) and hyperoxia (which generates free radicals). Glucose management targets 144-180 mg/dL avoiding hypoglycemia. Seizure management is critical as post-arrest seizures worsen neurological outcomes. Prognostication should be delayed at least 72 hours after normothermia to allow for accurate neurological assessment."
    },
    riskFactors: [
      "Prolonged cardiac arrest time before ROSC (>20 minutes)",
      "Unwitnessed arrest with unknown down time",
      "Non-shockable initial rhythm (PEA, asystole)",
      "Pre-existing cardiac disease and comorbidities",
      "Delay in initiating targeted temperature management"
    ],
    diagnostics: [
      "Continuous cardiac telemetry monitoring post-ROSC",
      "Serial troponin levels for myocardial injury assessment",
      "CT head to rule out neurological cause of arrest",
      "12-lead ECG for ST-elevation indicating need for cardiac catheterization"
    ],
    management: [
      "Initiate targeted temperature management per protocol (32-36°C for 24 hours)",
      "Maintain hemodynamic stability with MAP > 65 mmHg",
      "Avoid hyperoxia: titrate FiO2 to SpO2 94-96%",
      "Continuous EEG monitoring for seizure detection"
    ],
    nursingActions: [
      "Monitor temperature continuously during targeted temperature management",
      "Assess neurological status hourly including pupil reactivity and GCS",
      "Monitor for shivering during cooling and administer prescribed medications",
      "Maintain meticulous glucose monitoring and insulin protocol",
      "Provide emotional support to family during the uncertain post-arrest period"
    ],
    signs: {
      left: [
        "ROSC maintained with stable hemodynamics",
        "Temperature at target range during TTM protocol",
        "SpO2 94-96% without hyperoxia",
        "No seizure activity on monitoring"
      ],
      right: [
        "Recurrent cardiac arrest or hemodynamic instability",
        "Refractory hypothermia or uncontrolled hyperthermia",
        "Status epilepticus on EEG monitoring",
        "Signs of cardiogenic shock (elevated lactate, organ dysfunction)"
      ]
    },
    medications: [
      {
        name: "Amiodarone IV (post-arrest)",
        type: "Class III antiarrhythmic",
        action: "Prolongs action potential duration and refractory period, suppressing ventricular arrhythmias post-ROSC",
        sideEffects: "Hypotension (IV push), bradycardia, QT prolongation, thyroid dysfunction (chronic)",
        contra: "Cardiogenic shock, severe sinus node disease without pacemaker",
        pearl: "Continue maintenance infusion post-ROSC if given during resuscitation; monitor for QT prolongation and hypotension."
      }
    ],
    pearls: [
      "Targeted temperature management is the most important neuroprotective intervention after cardiac arrest",
      "Avoid hyperoxia after ROSC - titrate oxygen to SpO2 94-96% to prevent reperfusion oxidative injury",
      "Neurological prognostication should be delayed at least 72 hours after return to normothermia"
    ],
    quiz: [
      {
        question: "The most important neuroprotective intervention after cardiac arrest with ROSC is:",
        options: ["High-dose corticosteroids", "Targeted temperature management (32-36°C)", "Immediate MRI of the brain", "Hyperventilation"],
        correct: 1,
        rationale: "Targeted temperature management reduces cerebral metabolic demand and mitigates ischemia-reperfusion injury."
      },
      {
        question: "After ROSC, oxygen should be titrated to avoid:",
        options: ["Normal oxygen levels", "Both hypoxemia and hyperoxia", "Low CO2 levels", "Metabolic acidosis"],
        correct: 1,
        rationale: "Hyperoxia generates free radicals causing additional brain injury; target SpO2 94-96% after ROSC."
      },
      {
        question: "Neurological prognostication after cardiac arrest should be delayed at least:",
        options: ["6 hours", "24 hours", "72 hours after normothermia", "1 week"],
        correct: 2,
        rationale: "Early prognostication is unreliable due to sedation, hypothermia effects, and ongoing brain recovery processes."
      }
    ]
  },
  "status-epilepticus-basics-rpn": {
    title: "Status Epilepticus Basics",
    cellular: {
      title: "Prolonged Seizure Pathophysiology and Emergency Management",
      content: "Status epilepticus (SE) is defined as continuous seizure activity lasting > 5 minutes or two or more seizures without full recovery of consciousness between episodes. It is a medical emergency with mortality rates of 15-20%. Prolonged seizure activity causes excitotoxic neuronal injury through excessive glutamate release, calcium influx, and mitochondrial dysfunction. GABA receptor internalization occurs after 5-30 minutes, making benzodiazepines less effective with delayed treatment. Systemic complications include hyperthermia, rhabdomyolysis, metabolic acidosis, aspiration, cardiac arrhythmias, and respiratory failure. The most common cause in known epilepsy patients is anticonvulsant non-compliance or subtherapeutic drug levels. Other causes include CNS infection, stroke, metabolic derangements (hypoglycemia, hyponatremia), drug toxicity, and alcohol withdrawal. Treatment follows a staged protocol: first-line benzodiazepines, second-line IV antiepileptics, and third-line anesthetic agents if refractory."
    },
    riskFactors: [
      "Anticonvulsant medication non-compliance or subtherapeutic levels",
      "Known epilepsy with history of breakthrough seizures",
      "Acute brain injury (stroke, trauma, infection, tumor)",
      "Metabolic derangements (hypoglycemia, hyponatremia, uremia)",
      "Alcohol or benzodiazepine withdrawal"
    ],
    diagnostics: [
      "Blood glucose measurement immediately (rule out hypoglycemia)",
      "Anticonvulsant drug levels if on prescribed medications",
      "Basic metabolic panel for electrolyte abnormalities",
      "CT head and EEG for ongoing seizure detection"
    ],
    management: [
      "Administer IV lorazepam or IM midazolam immediately (first-line)",
      "Check blood glucose and administer dextrose if hypoglycemic",
      "Protect airway and position in lateral recovery position",
      "Administer second-line agent (fosphenytoin, levetiracetam, or valproate) if seizures persist"
    ],
    nursingActions: [
      "Note seizure onset time and call for emergency assistance",
      "Protect patient from injury - clear area, pad side rails, do NOT restrain",
      "Maintain airway: position laterally after seizure, suction as needed",
      "Administer prescribed benzodiazepines as rapidly as possible",
      "Monitor oxygen saturation and provide supplemental oxygen"
    ],
    signs: {
      left: [
        "Seizure terminated with treatment, patient recovering consciousness",
        "Vital signs stabilizing with adequate oxygenation",
        "Anticonvulsant levels therapeutic on follow-up lab draw",
        "No signs of aspiration or injury"
      ],
      right: [
        "Continuous tonic-clonic activity lasting > 5 minutes",
        "Repeated seizures without consciousness recovery between episodes",
        "Cyanosis and oxygen desaturation during seizure activity",
        "Hyperthermia, metabolic acidosis, or rhabdomyolysis developing"
      ]
    },
    medications: [
      {
        name: "Lorazepam (Ativan) IV",
        type: "Benzodiazepine anticonvulsant",
        action: "Enhances GABA-A receptor activity producing rapid anticonvulsant, anxiolytic, and sedative effects",
        sideEffects: "Respiratory depression, hypotension, sedation, paradoxical agitation",
        contra: "Severe respiratory failure without ventilator support",
        pearl: "First-line for status epilepticus: 0.1 mg/kg IV (max 4 mg/dose); may repeat once; effectiveness decreases with treatment delay."
      }
    ],
    pearls: [
      "Time is brain in status epilepticus - every minute of delay reduces benzodiazepine effectiveness due to GABA receptor internalization",
      "Do NOT put anything in the patient's mouth during a seizure - this causes injury and does not prevent tongue biting",
      "The most common cause of status epilepticus in known epilepsy patients is anticonvulsant non-compliance"
    ],
    quiz: [
      {
        question: "Status epilepticus is defined as continuous seizure activity lasting longer than:",
        options: ["30 seconds", "2 minutes", "5 minutes", "30 minutes"],
        correct: 2,
        rationale: "Current guidelines define status epilepticus as continuous seizure activity > 5 minutes or recurrent seizures without consciousness recovery."
      },
      {
        question: "The first-line treatment for status epilepticus is:",
        options: ["Phenytoin IV", "Lorazepam IV or midazolam IM", "Levetiracetam oral", "Carbamazepine"],
        correct: 1,
        rationale: "Benzodiazepines (lorazepam IV or midazolam IM) are the established first-line treatment for status epilepticus."
      },
      {
        question: "During an active seizure, the nurse should NOT:",
        options: ["Time the seizure duration", "Clear the area of hazards", "Place objects in the patient's mouth", "Monitor oxygen saturation"],
        correct: 2,
        rationale: "Placing objects in the mouth during a seizure causes injury to teeth and soft tissue and does not prevent tongue biting."
      }
    ]
  },
  "ards-basics-rpn": {
    title: "Acute Respiratory Distress Syndrome Basics",
    cellular: {
      title: "ARDS Pathophysiology and Lung Injury Cascade",
      content: "Acute respiratory distress syndrome (ARDS) is a rapidly progressive, non-cardiogenic pulmonary edema characterized by diffuse alveolar damage, refractory hypoxemia, and bilateral pulmonary infiltrates. The pathophysiology involves three phases: exudative (days 1-7) with damage to the alveolar-capillary membrane causing protein-rich fluid to flood the alveoli; proliferative (days 7-21) with type II pneumocyte proliferation and early fibrosis; and fibrotic (after day 21) with potential irreversible scarring. ARDS is defined by the Berlin criteria: acute onset within 1 week, bilateral opacities not fully explained by effusions, respiratory failure not fully explained by cardiac failure, and PaO2/FiO2 ratio classification (mild 200-300, moderate 100-200, severe <100). Common causes include sepsis, pneumonia, aspiration, pancreatitis, massive transfusion, and trauma. Lung-protective ventilation with low tidal volumes (6 mL/kg IBW) and plateau pressures <30 cmH2O is the cornerstone of management."
    },
    riskFactors: [
      "Sepsis (most common cause of ARDS)",
      "Aspiration of gastric contents",
      "Severe pneumonia (bacterial or viral)",
      "Massive blood product transfusion (TRALI)",
      "Major trauma with pulmonary contusion or multiple fractures"
    ],
    diagnostics: [
      "Chest X-ray showing bilateral opacities (white-out pattern)",
      "ABG showing refractory hypoxemia (low PaO2 despite increasing FiO2)",
      "PaO2/FiO2 ratio calculation for severity classification",
      "Echocardiography to rule out cardiogenic pulmonary edema"
    ],
    management: [
      "Lung-protective ventilation with low tidal volumes (6 mL/kg ideal body weight)",
      "PEEP optimization to recruit collapsed alveoli and improve oxygenation",
      "Prone positioning for moderate-severe ARDS (PaO2/FiO2 < 150)",
      "Conservative fluid management to minimize pulmonary edema"
    ],
    nursingActions: [
      "Monitor ventilator settings and alarms, report plateau pressure > 30 cmH2O",
      "Assist with prone positioning if indicated (12-16 hours per day)",
      "Monitor SpO2 and ABG results, report worsening oxygenation",
      "Maintain strict I&O and implement conservative fluid strategy",
      "Provide emotional support to family and explain the serious nature of ARDS"
    ],
    signs: {
      left: [
        "PaO2/FiO2 ratio improving with treatment",
        "Decreasing FiO2 requirements while maintaining SpO2",
        "Plateau pressure < 30 cmH2O on mechanical ventilation",
        "Bilateral infiltrates clearing on chest X-ray"
      ],
      right: [
        "Refractory hypoxemia despite high FiO2 and PEEP",
        "PaO2/FiO2 ratio < 100 (severe ARDS classification)",
        "Bilateral white-out on chest X-ray",
        "Worsening compliance requiring increasing ventilator pressures"
      ]
    },
    medications: [
      {
        name: "Cisatracurium (Nimbex)",
        type: "Neuromuscular blocking agent (paralytic)",
        action: "Blocks acetylcholine at the neuromuscular junction preventing skeletal muscle contraction for ventilator synchrony",
        sideEffects: "Complete paralysis requiring mechanical ventilation, prolonged weakness, awareness without ability to communicate",
        contra: "Inadequate sedation (patient must be deeply sedated before paralysis)",
        pearl: "Used in severe ARDS to improve ventilator synchrony and reduce oxygen consumption; MUST verify adequate sedation first - paralyzed patients can be awake and terrified."
      }
    ],
    pearls: [
      "Low tidal volume ventilation (6 mL/kg IBW) is the ONLY ventilator strategy proven to reduce ARDS mortality",
      "Prone positioning improves oxygenation by redistributing perfusion to better-ventilated lung regions",
      "ARDS is a clinical syndrome, not a disease - always identify and treat the underlying cause (sepsis, pneumonia, aspiration)"
    ],
    quiz: [
      {
        question: "The hallmark of ARDS on chest X-ray is:",
        options: ["Unilateral pleural effusion", "Bilateral pulmonary infiltrates", "Pneumothorax", "Cardiomegaly"],
        correct: 1,
        rationale: "ARDS shows bilateral opacities on chest X-ray not fully explained by effusions, reflecting diffuse alveolar damage."
      },
      {
        question: "Lung-protective ventilation in ARDS uses tidal volumes of:",
        options: ["10-12 mL/kg", "8-10 mL/kg", "6 mL/kg ideal body weight", "15 mL/kg"],
        correct: 2,
        rationale: "Low tidal volume ventilation (6 mL/kg IBW) reduces ventilator-induced lung injury and improves ARDS survival."
      },
      {
        question: "The most common cause of ARDS is:",
        options: ["Heart failure", "Sepsis", "Asthma", "Pulmonary embolism"],
        correct: 1,
        rationale: "Sepsis is the most common cause of ARDS, triggering the systemic inflammatory response that damages the alveolar-capillary membrane."
      }
    ]
  }
};
