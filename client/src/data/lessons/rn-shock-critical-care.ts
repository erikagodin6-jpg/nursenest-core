import type { LessonContent } from "./types";

export const rnShockCriticalCareLessons: Record<string, LessonContent> = {
  "hypovolemic-shock-rn": {
    title: "Hypovolemic Shock: RN Clinical Management",
    cellular: {
      title: "Pathophysiology of Hypovolemic Shock",
      content: "Hypovolemic shock is the most common type of shock, resulting from a critical reduction in intravascular volume (>15-30% of circulating blood volume). It is classified as hemorrhagic (trauma, GI bleed, ruptured aneurysm, postpartum hemorrhage, surgical bleeding) or non-hemorrhagic (severe dehydration, third-spacing from burns/pancreatitis, excessive diuresis, vomiting/diarrhea). The fundamental defect is decreased preload leading to reduced stroke volume and cardiac output. Compensatory mechanisms activate in stages: Stage I (compensated) involves baroreceptor-mediated sympathetic activation causing tachycardia, peripheral vasoconstriction, and venoconstriction to maintain MAP; the renin-angiotensin-aldosterone system (RAAS) retains sodium and water; and ADH secretion concentrates urine. Stage II (progressive) shows worsening tachycardia, narrowing pulse pressure, cool/clammy skin from vasoconstriction, oliguria (<0.5 mL/kg/hr), anxiety, and rising lactate as tissues shift to anaerobic metabolism. Stage III (irreversible/refractory) involves cellular death, loss of vascular tone, organ failure, and refractory hypotension despite maximal resuscitation. At the cellular level, inadequate oxygen delivery causes mitochondrial dysfunction, ATP depletion, lactic acidosis, and eventual cell membrane rupture releasing intracellular contents (potassium, phosphate, myoglobin) that compound organ injury. The ischemia-reperfusion injury that occurs during resuscitation generates reactive oxygen species (ROS) that cause additional cellular damage."
    },
    riskFactors: [
      "Trauma with hemorrhage (most common cause globally)",
      "Gastrointestinal bleeding (upper or lower GI hemorrhage)",
      "Ruptured abdominal aortic aneurysm",
      "Postpartum hemorrhage (leading cause of maternal mortality)",
      "Ectopic pregnancy rupture",
      "Severe dehydration from vomiting, diarrhea, or diabetic ketoacidosis",
      "Third-spacing from burns >20% TBSA, pancreatitis, or bowel obstruction",
      "Excessive diuresis or adrenal insufficiency",
      "Coagulopathy (DIC, liver failure, anticoagulant therapy)",
      "Surgical bleeding or post-procedural hemorrhage"
    ],
    diagnostics: [
      "Serial hemoglobin/hematocrit (may be falsely normal early due to hemoconcentration; drops after fluid resuscitation)",
      "Serum lactate level (>2 mmol/L indicates tissue hypoperfusion; >4 mmol/L indicates severe shock; trend to assess resuscitation adequacy)",
      "Arterial blood gas: metabolic acidosis with base deficit (base deficit >6 correlates with significant hemorrhage)",
      "Type and crossmatch for blood product availability",
      "Coagulation studies: PT/INR, aPTT, fibrinogen (monitor for dilutional coagulopathy or DIC)",
      "Basic metabolic panel: BUN/creatinine ratio >20:1 suggests prerenal azotemia",
      "Point-of-care ultrasound (FAST exam) for trauma to identify free fluid",
      "Urine output monitoring via Foley catheter (target >0.5 mL/kg/hr in adults)",
      "Central venous pressure (CVP) and ScvO2 if central line placed"
    ],
    management: [
      "Establish two large-bore (14-16 gauge) peripheral IV lines immediately",
      "Administer warmed crystalloid bolus (1-2 L isotonic saline or lactated Ringer's) as ordered; reassess after each bolus",
      "Initiate massive transfusion protocol (MTP) for hemorrhagic shock unresponsive to crystalloid: 1:1:1 ratio of pRBCs:FFP:platelets",
      "Apply direct pressure to external hemorrhage; prepare for surgical hemostasis",
      "Administer tranexamic acid (TXA) within 3 hours of hemorrhagic injury as prescribed",
      "Maintain permissive hypotension (SBP 80-90 mmHg) in penetrating trauma until surgical control obtained",
      "Position supine with legs elevated 20-30 degrees (modified Trendelenburg) unless contraindicated",
      "Maintain normothermia using warming blankets and warm IV fluids (hypothermia worsens coagulopathy)",
      "Prepare for vasopressor support (norepinephrine) if hypotension persists after adequate volume resuscitation"
    ],
    nursingActions: [
      "Monitor vital signs every 5-15 minutes during active resuscitation",
      "Monitor MAP continuously (report MAP <65 mmHg immediately)",
      "Assess for signs of adequate perfusion: mental status, capillary refill <3 seconds, warm extremities, urine output >0.5 mL/kg/hr",
      "Monitor urine output hourly via indwelling catheter",
      "Track all fluid intake and blood product administration with precise documentation",
      "Monitor serial lactate clearance (>10% decrease in 6 hours indicates adequate resuscitation)",
      "Assess skin color, temperature, and mottling (mottling score correlates with mortality)",
      "Anticipate and report signs of the lethal triad: hypothermia + acidosis + coagulopathy",
      "Monitor for transfusion reactions during blood product administration",
      "Maintain IV access patency and prepare for central line if peripheral access inadequate"
    ],
    assessmentFindings: [
      "Tachycardia (earliest compensatory sign; heart rate >100 bpm)",
      "Narrowing pulse pressure (difference between systolic and diastolic <20 mmHg)",
      "Hypotension (late sign; SBP <90 mmHg indicates >30% volume loss)",
      "Cool, clammy, pale skin with delayed capillary refill (>3 seconds)",
      "Oliguria progressing to anuria (<0.5 mL/kg/hr)",
      "Altered mental status: anxiety and restlessness progressing to confusion and obtundation",
      "Rapid, thready pulse with orthostatic hypotension",
      "Flat neck veins (JVD absent) distinguishing from cardiogenic and obstructive shock",
      "Metabolic acidosis with elevated lactate on ABG"
    ],
    signs: {
      left: [
        "Tachycardia >100 bpm (earliest sign)",
        "Narrowing pulse pressure (<20 mmHg)",
        "Cool, clammy, pale skin",
        "Anxiety and restlessness (early)",
        "Rapid, thready peripheral pulses",
        "Orthostatic hypotension"
      ],
      right: [
        "Hypotension SBP <90 mmHg (late sign: >30% blood loss)",
        "Oliguria to anuria",
        "Altered LOC progressing to obtundation",
        "Metabolic acidosis with elevated lactate",
        "Flat neck veins (low CVP)",
        "Mottled skin (refractory shock)"
      ]
    },
    medications: [
      {
        name: "Lactated Ringer's Solution",
        type: "Isotonic Crystalloid",
        action: "Volume expansion to restore intravascular volume and tissue perfusion; contains electrolytes (Na, K, Ca, lactate) that are metabolized to bicarbonate, helping correct acidosis",
        sideEffects: "Fluid overload, pulmonary edema if over-resuscitated, peripheral edema, dilutional coagulopathy with large volumes",
        contra: "Caution with hyperkalemia (contains 4 mEq/L K+); avoid mixing with blood products (calcium can cause clotting in tubing)",
        pearl: "Preferred over normal saline for resuscitation to avoid hyperchloremic metabolic acidosis; approximately 3 mL crystalloid needed per 1 mL blood lost (3:1 rule); warm to 37-40°C to prevent hypothermia"
      },
      {
        name: "Norepinephrine (Levophed)",
        type: "Alpha-1 and Beta-1 Adrenergic Agonist (Vasopressor)",
        action: "Potent vasoconstriction via alpha-1 stimulation increases SVR and MAP; mild beta-1 effect increases cardiac contractility and heart rate",
        sideEffects: "Peripheral ischemia (digits, mesentery), tissue necrosis with extravasation, arrhythmias, reflex bradycardia",
        contra: "Uncorrected hypovolemia (must volume-resuscitate first); mesenteric or peripheral vascular thrombosis",
        pearl: "First-line vasopressor after adequate fluid resuscitation; administer via central line; if extravasation occurs, infiltrate area with phentolamine 5-10 mg in 10 mL NS within 12 hours"
      },
      {
        name: "Tranexamic Acid (TXA)",
        type: "Antifibrinolytic Agent",
        action: "Inhibits plasminogen activation, preventing fibrin clot breakdown; reduces bleeding in traumatic hemorrhage",
        sideEffects: "Nausea, diarrhea, rare seizures at high doses, thromboembolic events (theoretical risk)",
        contra: "Active thromboembolic disease, history of seizures (use caution), DIC with predominant thrombotic component",
        pearl: "Must be given within 3 hours of injury (CRASH-2 trial); 1 g IV over 10 minutes, then 1 g infusion over 8 hours; shown to reduce mortality from hemorrhage by 30% when given early"
      }
    ],
    pearls: [
      "The four classes of hemorrhagic shock by blood loss: Class I (<15%/750 mL) - minimal signs; Class II (15-30%/750-1500 mL) - tachycardia, narrowing pulse pressure; Class III (30-40%/1500-2000 mL) - tachycardia, hypotension, confusion; Class IV (>40%/>2000 mL) - severe hypotension, lethargy, moribund",
      "The lethal triad of trauma is hypothermia + acidosis + coagulopathy; each worsens the others in a vicious cycle; break the cycle by warming, correcting acidosis, and replacing clotting factors",
      "Lactate clearance (>10% in 6 hours) is a better predictor of outcome than a single lactate value",
      "Massive transfusion protocol uses 1:1:1 ratio of packed RBCs, fresh frozen plasma, and platelets to prevent dilutional coagulopathy",
      "In young healthy patients, compensatory tachycardia may maintain blood pressure until >30% volume is lost, making tachycardia the most important early warning sign",
      "Flat neck veins in a hypotensive patient strongly suggest hypovolemic shock rather than cardiogenic or obstructive shock"
    ],
    quiz: [
      {
        question: "A trauma patient arrives with HR 128, BP 84/62, cool clammy skin, and anxiety. Estimated blood loss is 1800 mL. What class of hemorrhagic shock is this?",
        options: ["Class I - compensated", "Class II - mild", "Class III - moderate to severe", "Class IV - severe/moribund"],
        correct: 2,
        rationale: "1800 mL blood loss represents 30-40% of circulating volume (Class III). Signs include tachycardia >120, hypotension, altered mental status (anxiety/confusion), and cool clammy skin. Class III requires aggressive crystalloid AND blood product resuscitation."
      },
      {
        question: "Which assessment finding best differentiates hypovolemic shock from cardiogenic shock?",
        options: ["Tachycardia", "Hypotension", "Flat neck veins in hypovolemic vs JVD in cardiogenic", "Cool, clammy skin"],
        correct: 2,
        rationale: "Flat neck veins (low CVP) indicate inadequate preload in hypovolemic shock, while JVD (elevated CVP) indicates fluid backing up from pump failure in cardiogenic shock. Both types share tachycardia, hypotension, and cool skin."
      },
      {
        question: "A patient receiving massive transfusion develops oozing from IV sites, petechiae, and prolonged aPTT. The nurse suspects:",
        options: ["Allergic transfusion reaction", "Dilutional coagulopathy from large-volume crystalloid resuscitation", "Anaphylactic shock", "Neurogenic shock"],
        correct: 1,
        rationale: "Large-volume crystalloid resuscitation dilutes clotting factors and platelets, causing dilutional coagulopathy. This is part of the lethal triad. Treatment includes balanced blood product transfusion (1:1:1 ratio) and warming."
      }
    ]
  },

  "distributive-shock-overview-rn": {
    title: "Distributive Shock Overview: RN Clinical Management",
    cellular: {
      title: "Pathophysiology of Distributive Shock",
      content: "Distributive shock is characterized by massive systemic vasodilation leading to maldistribution of blood flow, decreased systemic vascular resistance (SVR), and relative hypovolemia despite normal or elevated circulating blood volume. The three major subtypes are septic shock (most common: inflammatory mediators cause vasodilation and capillary leak), anaphylactic shock (IgE-mediated mast cell degranulation releases histamine, causing vasodilation and bronchospasm), and neurogenic shock (loss of sympathetic tone from spinal cord injury above T6 causes vasodilation with bradycardia). In distributive shock, the pathological mechanism is fundamentally different from hypovolemic or cardiogenic shock: the blood vessels lose their tone and dilate massively, causing blood to pool in the periphery. This reduces venous return (preload), drops SVR and MAP, and impairs tissue perfusion despite adequate or even elevated cardiac output (in early septic shock). Capillary leak syndrome accompanies septic and anaphylactic shock, with fluid shifting from intravascular to interstitial space, worsening effective circulating volume. The hemodynamic profile shows low SVR, low-to-normal CVP/PAWP, and high cardiac output (warm shock phase) or low cardiac output (cold shock phase in late sepsis). Vasopressors targeting alpha-1 receptors are the cornerstone of management after volume resuscitation."
    },
    riskFactors: [
      "Infection/sepsis (most common cause of distributive shock)",
      "Anaphylaxis triggers: medications (antibiotics, contrast dye), foods, insect stings, latex",
      "Spinal cord injury above T6 (neurogenic shock)",
      "Spinal or epidural anesthesia",
      "Adrenal crisis/acute adrenal insufficiency",
      "Severe pancreatitis or systemic inflammatory conditions",
      "Toxic shock syndrome (Staphylococcal or Streptococcal)",
      "Drug overdose causing vasodilation (calcium channel blockers, nitrates)"
    ],
    diagnostics: [
      "Hemodynamic monitoring: low SVR (<800 dyn-s-cm-5) is the hallmark finding across all subtypes",
      "Cardiac output/cardiac index: elevated in early septic shock (hyperdynamic phase), may be normal in anaphylactic, low in neurogenic",
      "CVP/PAWP: low to normal (relative hypovolemia from vasodilation)",
      "Serum lactate: elevated in septic shock (>2 mmol/L indicates tissue hypoperfusion)",
      "Mixed venous oxygen saturation (SvO2): may be elevated in early sepsis (cells cannot extract oxygen despite delivery)",
      "Blood cultures, procalcitonin for septic shock; tryptase level for anaphylaxis confirmation",
      "ABG: metabolic acidosis from inadequate tissue perfusion",
      "ECG: monitor for arrhythmias; bradycardia distinguishes neurogenic shock"
    ],
    management: [
      "Identify and treat the underlying cause (antibiotics for sepsis, epinephrine for anaphylaxis, vasopressors for neurogenic)",
      "Aggressive IV crystalloid bolus (30 mL/kg for septic shock within first 3 hours)",
      "Vasopressor therapy (norepinephrine first-line) to restore SVR and maintain MAP >65 mmHg",
      "Add vasopressin (0.03-0.04 units/min) as second agent if MAP remains low on norepinephrine",
      "Epinephrine IM/IV for anaphylactic shock (addresses vasodilation AND bronchospasm)",
      "Stress-dose steroids (hydrocortisone 200 mg/day) for refractory septic shock or adrenal crisis",
      "Maintain airway and breathing; prepare for intubation if respiratory failure develops",
      "Avoid over-resuscitation after initial bolus; use dynamic measures (passive leg raise, pulse pressure variation) to guide additional fluids"
    ],
    nursingActions: [
      "Monitor vital signs continuously; recognize unique hemodynamic patterns for each subtype",
      "Differentiate warm shock (warm, flushed skin, bounding pulses, wide pulse pressure) from cold shock (cool, mottled skin, weak pulses)",
      "Monitor MAP target >65 mmHg; titrate vasopressors per protocol",
      "Assess for the cause: fever/infection source (septic), allergen exposure (anaphylactic), spinal cord injury (neurogenic)",
      "Monitor urine output hourly (target >0.5 mL/kg/hr)",
      "Assess for progression to multi-organ dysfunction (MODS)",
      "Document medication administration times precisely (antibiotics within 1 hour for sepsis)",
      "Monitor for adverse effects of vasopressor therapy: peripheral ischemia, arrhythmias"
    ],
    signs: {
      left: [
        "Warm, flushed, dry skin (early/warm phase)",
        "Bounding pulses with wide pulse pressure",
        "Tachycardia (septic, anaphylactic) or bradycardia (neurogenic)",
        "Low SVR on hemodynamic monitoring"
      ],
      right: [
        "Hypotension unresponsive to fluid resuscitation alone",
        "High cardiac output with low SVR (septic)",
        "Bronchospasm and angioedema (anaphylactic)",
        "Progression to cold shock with mottled skin and organ failure"
      ]
    },
    medications: [
      {
        name: "Norepinephrine (Levophed)",
        type: "Alpha-1/Beta-1 Agonist Vasopressor",
        action: "Potent alpha-1 vasoconstriction restores SVR; mild beta-1 effect supports cardiac output; first-line for septic and distributive shock",
        sideEffects: "Peripheral ischemia, tissue necrosis with extravasation, arrhythmias",
        contra: "Must have adequate volume resuscitation first",
        pearl: "First-line vasopressor for ALL forms of distributive shock after fluid resuscitation; titrate to MAP >65 mmHg; central line preferred"
      },
      {
        name: "Vasopressin (ADH analog)",
        type: "Non-catecholamine Vasopressor",
        action: "V1 receptor-mediated vasoconstriction independent of catecholamine pathways; supplements norepinephrine in refractory shock",
        sideEffects: "Digital ischemia, mesenteric ischemia, hyponatremia, cardiac ischemia",
        contra: "Responsive shock (not needed as first-line)",
        pearl: "Fixed dose 0.03-0.04 units/min (not titrated); added when norepinephrine alone insufficient; may allow norepinephrine dose reduction"
      }
    ],
    pearls: [
      "Distributive shock = LOW SVR; the blood vessels are dilated, not the volume depleted (though relative hypovolemia exists)",
      "Warm skin + hypotension = think distributive; cold skin + hypotension = think hypovolemic or cardiogenic",
      "Neurogenic shock is the ONLY shock type with bradycardia + hypotension + warm skin; all others have tachycardia",
      "Early septic shock is hyperdynamic (high CO, low SVR, warm extremities); late septic shock becomes hypodynamic (low CO, cold extremities) indicating myocardial depression",
      "SVR is the key differentiator: LOW in distributive, HIGH in hypovolemic and cardiogenic, VARIABLE in obstructive"
    ],
    quiz: [
      {
        question: "A patient in the ICU has the following hemodynamic readings: CVP 4 mmHg, PAWP 8 mmHg, CO 8.2 L/min, SVR 480 dyn-s-cm-5. Which type of shock do these findings indicate?",
        options: ["Hypovolemic shock", "Cardiogenic shock", "Distributive shock", "Obstructive shock"],
        correct: 2,
        rationale: "Low SVR (normal 800-1200) with elevated cardiac output and low-normal filling pressures is the classic hemodynamic profile of distributive shock (warm phase). Hypovolemic would show low CO with high SVR. Cardiogenic would show high filling pressures with low CO."
      },
      {
        question: "Which assessment finding distinguishes neurogenic shock from septic shock?",
        options: ["Hypotension", "Warm skin below the level of injury", "Bradycardia in neurogenic vs tachycardia in septic", "Both cause vasodilation"],
        correct: 2,
        rationale: "Neurogenic shock causes loss of sympathetic tone resulting in BOTH vasodilation AND loss of cardiac sympathetic drive (bradycardia). Septic shock activates compensatory sympathetic responses causing tachycardia. This is the key differentiating feature."
      }
    ]
  },

  "sepsis-septic-shock-rn": {
    title: "Sepsis & Septic Shock: RN Clinical Management",
    cellular: {
      title: "Inflammatory Cascade in Sepsis",
      content: "Sepsis is defined as life-threatening organ dysfunction caused by a dysregulated host response to infection (Sepsis-3 definition, 2016). The pathophysiology begins when pathogen-associated molecular patterns (PAMPs) such as bacterial endotoxin (LPS) activate innate immune receptors (Toll-like receptors, TLR4) on macrophages and neutrophils. This triggers a massive release of pro-inflammatory cytokines (TNF-alpha, IL-1, IL-6) creating a cytokine storm. The inflammatory cascade causes: (1) Endothelial dysfunction with increased capillary permeability leading to third-spacing and tissue edema; (2) Nitric oxide-mediated vasodilation causing decreased SVR and distributive shock; (3) Activation of the coagulation cascade creating microvascular thrombosis (DIC), further impairing tissue oxygen delivery; (4) Mitochondrial dysfunction (cytopathic hypoxia) where cells cannot utilize oxygen even when delivered; (5) Myocardial depression from circulating cardiodepressant factors (IL-1, TNF-alpha) reducing contractility. Septic shock is defined as sepsis with persistent hypotension requiring vasopressors to maintain MAP >65 mmHg AND serum lactate >2 mmol/L despite adequate fluid resuscitation. The qSOFA score (quick Sequential Organ Failure Assessment) uses three bedside criteria (RR >22, altered mentation GCS <15, SBP <100 mmHg) to identify patients at risk outside the ICU. The full SOFA score tracks six organ systems to quantify dysfunction. The Surviving Sepsis Campaign (SSC) Hour-1 Bundle mandates: measure lactate, obtain blood cultures before antibiotics, administer broad-spectrum antibiotics, begin 30 mL/kg crystalloid for hypotension or lactate >4, and start vasopressors if hypotensive during or after fluid resuscitation."
    },
    riskFactors: [
      "Age >65 years or neonates/infants",
      "Immunosuppression (chemotherapy, chronic steroids, HIV/AIDS, transplant recipients)",
      "Chronic comorbidities (diabetes, COPD, chronic kidney disease, liver cirrhosis, heart failure)",
      "Invasive devices (central venous catheters, urinary catheters, endotracheal tubes, surgical drains)",
      "Recent surgery, hospitalization, or ICU admission",
      "Malnutrition and poor functional status",
      "Skin breakdown, wounds, or pressure injuries",
      "IV drug use or injection drug use",
      "Asplenia (functional or anatomic)",
      "Pregnancy and postpartum period"
    ],
    diagnostics: [
      "Blood cultures (at least 2 sets from different sites) BEFORE antibiotic administration",
      "Serum lactate level: >2 mmol/L indicates tissue hypoperfusion; >4 mmol/L indicates severe shock; repeat within 2-4 hours if initially elevated",
      "Procalcitonin: elevated in bacterial infections; useful for antibiotic de-escalation decisions",
      "qSOFA score at bedside: RR >22, altered mentation, SBP <100 (score >2 = high risk)",
      "Full SOFA score: PaO2/FiO2 ratio, platelet count, bilirubin, MAP/vasopressor dose, GCS, creatinine/urine output",
      "CBC with differential (leukocytosis or leukopenia), metabolic panel, coagulation studies",
      "Source-specific cultures: urine, sputum, wound, CSF as indicated",
      "Imaging to identify source: chest X-ray, CT abdomen/pelvis, ultrasound",
      "Central venous oxygen saturation (ScvO2): <70% suggests inadequate oxygen delivery"
    ],
    management: [
      "Hour-1 Bundle: Measure lactate, draw blood cultures, administer broad-spectrum antibiotics, start 30 mL/kg crystalloid, vasopressors for MAP <65 mmHg",
      "Antibiotics within 1 hour of recognition (each hour delay increases mortality 7.6%)",
      "Aggressive fluid resuscitation: 30 mL/kg isotonic crystalloid within first 3 hours for sepsis-induced hypoperfusion",
      "Start norepinephrine (first-line vasopressor) for MAP <65 mmHg despite adequate fluid resuscitation",
      "Add vasopressin (0.03 units/min) as second-line vasopressor; may allow norepinephrine dose reduction",
      "Stress-dose hydrocortisone (200 mg/day IV) for septic shock refractory to fluids and vasopressors",
      "Source control within 6-12 hours (surgical drainage, line removal, debridement)",
      "Lung-protective ventilation if mechanical ventilation required (6 mL/kg IBW tidal volume)",
      "Target glucose 140-180 mg/dL with insulin infusion if needed",
      "DVT prophylaxis and stress ulcer prophylaxis in mechanically ventilated patients"
    ],
    nursingActions: [
      "Screen all patients using qSOFA or institutional sepsis screening criteria",
      "Obtain blood cultures BEFORE antibiotic administration (do not delay antibiotics >45 minutes for cultures)",
      "Document exact time of antibiotic administration (within 1 hour of sepsis recognition)",
      "Administer 30 mL/kg crystalloid bolus and reassess response every 30 minutes",
      "Monitor MAP continuously; titrate vasopressors to maintain MAP >65 mmHg per protocol",
      "Monitor lactate clearance: repeat lactate within 2-4 hours; target >10% decrease",
      "Monitor urine output hourly (report <0.5 mL/kg/hr)",
      "Assess end-organ perfusion: mental status, skin mottling, capillary refill",
      "Perform comprehensive reassessment every 1-2 hours during acute phase",
      "Communicate changes using SBAR format; escalate deterioration immediately",
      "Monitor for complications: DIC, ARDS, acute kidney injury, hepatic dysfunction"
    ],
    assessmentFindings: [
      "SIRS criteria: Temperature >38.3°C or <36°C, HR >90 bpm, RR >20 or PaCO2 <32 mmHg, WBC >12,000 or <4,000 or >10% bands",
      "qSOFA positive: 2 or more of RR >22, altered mentation, SBP <100 mmHg",
      "Early sepsis (warm shock): warm flushed skin, bounding pulses, wide pulse pressure, tachycardia, fever",
      "Late sepsis (cold shock): cool mottled skin, weak pulses, narrow pulse pressure, hypothermia",
      "Altered mental status: confusion, lethargy, agitation (earliest sign of inadequate cerebral perfusion)",
      "Elevated lactate >2 mmol/L",
      "Oliguria <0.5 mL/kg/hr despite fluid resuscitation"
    ],
    signs: {
      left: [
        "Temperature >38.3°C or <36°C",
        "Heart rate >90 bpm",
        "Respiratory rate >20",
        "WBC >12,000 or <4,000",
        "Warm, flushed skin (early sepsis)",
        "Wide pulse pressure"
      ],
      right: [
        "Lactate >2 mmol/L (>4 = severe)",
        "MAP <65 mmHg requiring vasopressors",
        "Altered mental status",
        "Oliguria despite fluid resuscitation",
        "Mottled, cool skin (late sepsis)",
        "Evidence of organ dysfunction (rising creatinine, falling platelets)"
      ]
    },
    medications: [
      {
        name: "Norepinephrine (Levophed)",
        type: "First-line Vasopressor for Septic Shock",
        action: "Alpha-1 vasoconstriction restores SVR lost from sepsis-mediated vasodilation; mild beta-1 effect supports cardiac contractility",
        sideEffects: "Peripheral ischemia, digital necrosis, arrhythmias, tissue necrosis with extravasation",
        contra: "Uncorrected hypovolemia (must give fluid bolus first)",
        pearl: "Start early if MAP <65 after initial fluid bolus; central line preferred; titrate in 2-5 mcg/min increments; doses >0.5 mcg/kg/min suggest refractory shock"
      },
      {
        name: "Vasopressin",
        type: "Non-catecholamine Vasopressor (Second-line)",
        action: "V1 receptor vasoconstriction independent of catecholamine pathways; restores vascular tone depleted in sepsis",
        sideEffects: "Digital ischemia, mesenteric ischemia, hyponatremia, cardiac ischemia",
        contra: "Not recommended as single first-line agent",
        pearl: "Fixed dose 0.03-0.04 units/min (NOT titrated); added to norepinephrine when MAP remains <65; may reduce norepinephrine requirement; acts on different receptor pathway"
      },
      {
        name: "Hydrocortisone",
        type: "Stress-dose Corticosteroid",
        action: "Replaces cortisol in critical illness-related corticosteroid insufficiency (CIRCI); enhances vascular catecholamine sensitivity",
        sideEffects: "Hyperglycemia, immunosuppression, myopathy, GI bleeding risk",
        contra: "Active fungal infection (relative)",
        pearl: "200 mg/day IV (50 mg q6h or continuous infusion); indicated for septic shock refractory to fluids + vasopressors; improves vasopressor response and may reduce time to shock reversal"
      }
    ],
    pearls: [
      "Hour-1 Bundle: Lactate, Blood cultures, Antibiotics, Fluids (30 mL/kg), Vasopressors - start ALL within 1 hour of sepsis recognition",
      "Each hour delay in antibiotic administration increases mortality by approximately 7.6% in septic shock",
      "Blood cultures BEFORE antibiotics but do NOT delay antibiotics more than 45 minutes to obtain cultures",
      "Lactate clearance (>10% decrease in 6 hours) is the best bedside marker of adequate resuscitation",
      "qSOFA is a rapid bedside tool: RR >22 + altered mentation + SBP <100; score >2 predicts poor outcomes",
      "Septic shock = sepsis + vasopressors needed for MAP >65 + lactate >2 mmol/L despite adequate fluid resuscitation",
      "The most common sources of sepsis are pneumonia (lungs), UTI (urinary tract), intra-abdominal infection, and skin/soft tissue infection",
      "Warm shock transitions to cold shock as myocardial depression develops; this indicates worsening prognosis"
    ],
    quiz: [
      {
        question: "A patient with pneumonia has temp 39.2°C, HR 118, RR 26, BP 76/44, WBC 18,500, and lactate 4.8 mmol/L. After 2L of NS, BP remains 72/40. What is the priority nursing action?",
        options: ["Continue fluid bolus with another 2L NS", "Start norepinephrine infusion per protocol and notify provider", "Administer acetaminophen for the fever", "Obtain a chest X-ray"],
        correct: 1,
        rationale: "This patient has septic shock (sepsis + hypotension refractory to fluids + lactate >4). After adequate fluid resuscitation, vasopressor therapy (norepinephrine first-line) is the priority per the Hour-1 Bundle to maintain MAP >65 mmHg. Continued fluids alone are not addressing the vasodilation."
      },
      {
        question: "Which sequence correctly represents the Surviving Sepsis Campaign Hour-1 Bundle?",
        options: [
          "Measure lactate, blood cultures, broad-spectrum antibiotics, 30 mL/kg crystalloid, vasopressors if needed",
          "Chest X-ray, sputum culture, start antibiotics, monitor temperature",
          "CBC, urinalysis, start IV fluids, call respiratory therapy",
          "CT scan, blood cultures, wait for culture results, then start antibiotics"
        ],
        correct: 0,
        rationale: "The SSC Hour-1 Bundle mandates within 1 hour: (1) Measure lactate, (2) Obtain blood cultures before antibiotics, (3) Administer broad-spectrum antibiotics, (4) Begin 30 mL/kg crystalloid for hypotension or lactate >4, (5) Start vasopressors if hypotensive during/after fluids."
      }
    ]
  },

  "anaphylactic-shock-rn": {
    title: "Anaphylactic Shock: RN Clinical Management",
    cellular: {
      title: "IgE-Mediated Anaphylaxis Pathophysiology",
      content: "Anaphylaxis is a severe, potentially fatal systemic hypersensitivity reaction (Type I) mediated by immunoglobulin E (IgE). During initial sensitization, the immune system produces allergen-specific IgE antibodies that bind to high-affinity FcepsilonRI receptors on mast cells and basophils throughout the body (skin, respiratory tract, GI tract, vasculature). Upon re-exposure, the allergen cross-links two IgE molecules on the mast cell surface, triggering immediate degranulation within seconds to minutes. The massive release of preformed mediators (histamine, tryptase, heparin) and newly synthesized mediators (leukotrienes C4/D4/E4, prostaglandin D2, platelet-activating factor) produces the hallmark effects: (1) Massive vasodilation and increased vascular permeability causing hypotension and angioedema; (2) Bronchospasm from smooth muscle contraction in lower airways causing wheezing and respiratory distress; (3) Upper airway edema (laryngeal, pharyngeal, tongue) causing stridor and potential complete airway obstruction; (4) Urticaria and flushing from cutaneous mast cell degranulation; (5) GI smooth muscle contraction causing nausea, vomiting, diarrhea, abdominal cramping. Biphasic anaphylaxis occurs in 5-20% of cases where symptoms recur 4-12 hours after initial resolution without re-exposure to the allergen, likely from late-phase inflammatory mediators. This necessitates observation periods of 4-6 hours after initial treatment. Epinephrine is the ONLY first-line treatment because it addresses ALL pathophysiological mechanisms: alpha-1 vasoconstriction reverses vasodilation, beta-1 increases cardiac output, and beta-2 causes bronchodilation and inhibits further mast cell degranulation."
    },
    riskFactors: [
      "Previous anaphylactic reaction (strongest predictor)",
      "Known allergies: foods (peanuts, tree nuts, shellfish, milk, eggs), medications (penicillin, cephalosporins, NSAIDs, contrast dye), insect stings (Hymenoptera), latex",
      "History of atopy (asthma, eczema, allergic rhinitis) increases severity",
      "Beta-blocker use (blocks beta-2 bronchodilation and makes epinephrine less effective)",
      "ACE inhibitor use (increases angioedema risk via bradykinin accumulation)",
      "Exercise-induced anaphylaxis (often food-dependent)",
      "Mastocytosis or elevated baseline tryptase",
      "Alpha-gal syndrome (mammalian meat allergy from tick bite)"
    ],
    diagnostics: [
      "Clinical diagnosis based on rapid symptom onset: skin (urticaria, flushing, angioedema) + respiratory (wheezing, stridor, dyspnea) + cardiovascular (hypotension, tachycardia) + GI (cramping, vomiting)",
      "Serum tryptase: peaks 1-2 hours after onset; confirms mast cell degranulation (>11.4 ng/mL); draw within 1-3 hours",
      "Continuous vital sign monitoring (hypotension may be profound and rapid)",
      "Continuous pulse oximetry (monitor for bronchospasm and respiratory compromise)",
      "Peak flow measurement if patient can cooperate (assess bronchospasm severity)",
      "Post-episode allergen-specific IgE testing and referral to allergist for identification of trigger"
    ],
    management: [
      "EPINEPHRINE IM is the FIRST and MOST IMPORTANT intervention: 0.3-0.5 mg (0.3-0.5 mL of 1:1000) into anterolateral thigh; repeat every 5-15 minutes if symptoms persist",
      "Remove the allergen if possible (stop IV medication, remove stinger)",
      "Position supine with legs elevated UNLESS respiratory distress (then position of comfort/semi-Fowler's)",
      "Establish large-bore IV access and administer NS bolus (1-2 L) for hypotension",
      "Administer supplemental oxygen (high-flow or 100% non-rebreather)",
      "Prepare for emergent intubation or cricothyrotomy if airway edema progresses",
      "Second-line medications: diphenhydramine 25-50 mg IV (H1 blocker), ranitidine/famotidine IV (H2 blocker), methylprednisolone 125 mg IV (prevents late-phase reaction)",
      "Albuterol nebulization for persistent bronchospasm refractory to epinephrine",
      "IV epinephrine infusion (1-10 mcg/min) for refractory anaphylactic shock",
      "Observe minimum 4-6 hours for biphasic reaction; consider 24-hour observation for severe cases"
    ],
    nursingActions: [
      "Administer epinephrine IM immediately upon recognition (do NOT delay for IV access or other medications)",
      "Assess and maintain airway: monitor for stridor, voice changes, tongue/lip swelling indicating upper airway compromise",
      "Monitor vital signs every 5 minutes during acute phase",
      "Assess respiratory status: auscultate for wheezing, monitor SpO2, assess work of breathing",
      "Establish IV access with large-bore catheter; prepare fluid bolus",
      "Document exact time of allergen exposure, symptom onset, and epinephrine administration",
      "Prepare emergency airway equipment at bedside (intubation supplies, cricothyrotomy kit)",
      "Reassess for biphasic reaction: educate patient that symptoms can recur 4-12 hours later",
      "Ensure patient/family education on epinephrine auto-injector use before discharge",
      "Arrange allergist referral and provide medical alert bracelet recommendation"
    ],
    signs: {
      left: [
        "Urticaria (hives) and flushing (90% of cases)",
        "Angioedema (lips, tongue, face, hands)",
        "Pruritus (itching) often the first symptom",
        "Bronchospasm with wheezing and dyspnea",
        "Tachycardia (compensatory)"
      ],
      right: [
        "Stridor and hoarseness (laryngeal edema - impending airway loss)",
        "Hypotension and cardiovascular collapse",
        "Abdominal cramping, nausea, vomiting, diarrhea",
        "Sense of impending doom",
        "Loss of consciousness"
      ]
    },
    medications: [
      {
        name: "Epinephrine 1:1000 (1 mg/mL) IM",
        type: "Alpha and Beta Adrenergic Agonist - FIRST LINE",
        action: "Alpha-1: vasoconstriction reverses hypotension and reduces mucosal edema. Beta-1: increases cardiac output. Beta-2: bronchodilation + inhibits further mast cell degranulation",
        sideEffects: "Tachycardia, palpitations, tremor, anxiety, headache, hypertension",
        contra: "NO absolute contraindications in anaphylaxis; benefits always outweigh risks; use caution in elderly/cardiac patients but DO NOT withhold",
        pearl: "IM into anterolateral thigh (vastus lateralis) for fastest absorption; 0.3-0.5 mg adult, 0.01 mg/kg pediatric (max 0.3 mg); repeat every 5-15 min PRN; auto-injectors deliver fixed 0.15 mg or 0.3 mg"
      },
      {
        name: "Diphenhydramine (Benadryl)",
        type: "H1-receptor Antagonist (Antihistamine) - Second line",
        action: "Blocks histamine at H1 receptors reducing urticaria, pruritus, and flushing; does NOT reverse bronchospasm or hypotension",
        sideEffects: "Sedation, dry mouth, urinary retention, blurred vision",
        contra: "Narrow-angle glaucoma, urinary retention",
        pearl: "NEVER use as first-line or substitute for epinephrine; 25-50 mg IV/IM; adjunct only; combine with H2 blocker for synergistic effect"
      }
    ],
    pearls: [
      "Epinephrine is the ONLY first-line treatment for anaphylaxis; there is NO substitute; antihistamines are adjuncts ONLY",
      "IM injection into anterolateral thigh provides fastest absorption (subcutaneous is slower and less reliable)",
      "Biphasic reaction occurs in 5-20% of cases, 4-12 hours after initial event; all patients must be observed minimum 4-6 hours",
      "Beta-blocker patients may have refractory anaphylaxis; consider glucagon 1-5 mg IV for beta-blocker-resistant cases (glucagon bypasses beta receptors)",
      "The most common cause of death in anaphylaxis is delayed or withheld epinephrine administration",
      "Patients in anaphylaxis should be positioned SUPINE (improves venous return); sitting or standing can cause fatal cardiovascular collapse (empty ventricle syndrome)"
    ],
    quiz: [
      {
        question: "A patient develops urticaria, wheezing, and BP 74/40 five minutes after IV antibiotic administration. What is the FIRST nursing action?",
        options: ["Administer diphenhydramine 50 mg IV", "Stop the antibiotic and administer epinephrine 0.3-0.5 mg IM", "Start a normal saline bolus", "Call the rapid response team"],
        correct: 1,
        rationale: "The first action is STOP the allergen (stop the antibiotic) and administer epinephrine IM immediately. Epinephrine addresses all pathophysiological mechanisms. Diphenhydramine is an adjunct only and does NOT reverse bronchospasm or hypotension. Fluids and RRT are important but secondary to epinephrine."
      },
      {
        question: "A patient treated for anaphylaxis with epinephrine is symptom-free after 2 hours. The patient requests discharge. What is the appropriate nursing response?",
        options: ["Discharge is appropriate since symptoms have resolved", "The patient must be observed for at least 4-6 hours due to risk of biphasic reaction", "The patient can leave after taking oral diphenhydramine", "Observation is only needed if the patient received IV epinephrine"],
        correct: 1,
        rationale: "Biphasic anaphylaxis occurs in 5-20% of cases, typically 4-12 hours after initial resolution. All patients must be observed for a minimum of 4-6 hours after successful treatment. Severe cases warrant 24-hour observation."
      }
    ]
  },

  "neurogenic-shock-rn": {
    title: "Neurogenic Shock: RN Clinical Management",
    cellular: {
      title: "Loss of Sympathetic Tone",
      content: "Neurogenic shock results from acute loss of sympathetic nervous system outflow, most commonly from traumatic spinal cord injury above the T6 level. The sympathetic nervous system exits the spinal cord from T1 through L2 (thoracolumbar outflow). When the cord is injured above this level, sympathetic signals to blood vessels and the heart are disrupted below the injury. This produces two hallmark features: (1) Massive vasodilation below the injury level due to unopposed parasympathetic tone, causing blood to pool in peripheral vasculature and reducing venous return (preload); (2) Bradycardia from loss of sympathetic cardiac accelerator fibers (T1-T4) leaving the vagus nerve (parasympathetic) unopposed on the heart. The combination of bradycardia + hypotension + warm dry skin is UNIQUE to neurogenic shock and distinguishes it from all other shock types (which present with tachycardia and cool clammy skin). Additional features include poikilothermia (inability to thermoregulate below the injury because sympathetic control of sweat glands and cutaneous blood flow is lost), priapism, and loss of motor/sensory function below the injury. Neurogenic shock must be differentiated from spinal shock, which is a neurological phenomenon (loss of reflexes below the injury) rather than a hemodynamic emergency. They often coexist. Treatment focuses on restoring vascular tone with vasopressors and supporting heart rate with chronotropic agents while maintaining strict spinal immobilization."
    },
    riskFactors: [
      "Traumatic spinal cord injury above T6 (most common cause)",
      "Cervical spine injury (highest risk due to disruption of all thoracic sympathetic outflow)",
      "High thoracic spinal cord injury (T1-T6)",
      "Spinal or epidural anesthesia (chemical sympathectomy)",
      "Severe brainstem injury",
      "Spinal cord tumors or compression",
      "Transverse myelitis with rapid onset"
    ],
    diagnostics: [
      "Continuous vital sign monitoring: characteristic pattern of hypotension WITH bradycardia",
      "Neurological assessment: motor and sensory level determination (ASIA scale)",
      "Spinal imaging: CT spine, MRI for cord injury characterization",
      "Arterial line for continuous blood pressure monitoring in ICU",
      "Arterial blood gas: monitor for respiratory failure (high cervical injuries compromise diaphragm C3-C5)",
      "Core temperature monitoring (poikilothermia expected)",
      "Pulmonary function tests if cervical injury (monitor vital capacity, tidal volume)"
    ],
    management: [
      "Maintain strict spinal immobilization with cervical collar and logroll precautions",
      "Administer IV fluids cautiously (bolus 500-1000 mL NS); avoid over-resuscitation as heart cannot increase rate to compensate",
      "Start vasopressor therapy early: norepinephrine or phenylephrine to restore SVR and maintain MAP 85-90 mmHg for cord perfusion",
      "Administer atropine 0.5 mg IV for symptomatic bradycardia (HR <50 with symptoms)",
      "Maintain normothermia using warming blankets (patient cannot thermoregulate)",
      "Ensure adequate oxygenation; prepare for intubation if cervical injury compromises respiratory muscles (C3-C5 phrenic nerve)",
      "Initiate DVT prophylaxis early (high risk for VTE due to immobility and venous stasis)"
    ],
    nursingActions: [
      "Recognize the classic triad: bradycardia + hypotension + warm dry skin below injury level",
      "Differentiate from hypovolemic shock (which presents with tachycardia and cool clammy skin in trauma)",
      "Maintain strict spinal alignment with logroll for all repositioning",
      "Monitor heart rate continuously; report HR <50 bpm or symptomatic bradycardia",
      "Monitor temperature every 1-2 hours; regulate environmental temperature",
      "Assess respiratory status frequently: monitor for diaphragmatic fatigue in cervical injuries (vital capacity <1 L may require intubation)",
      "Perform comprehensive neurological assessments every 2-4 hours (motor, sensory, reflexes)",
      "Monitor for autonomic dysreflexia if injury is chronic (develops after spinal shock resolves)",
      "Implement skin breakdown prevention: reposition every 2 hours, pressure-relieving surfaces",
      "Monitor bladder function: insert indwelling catheter as ordered (neurogenic bladder expected)"
    ],
    signs: {
      left: [
        "Hypotension with BRADYCARDIA (unique triad)",
        "Warm, dry, flushed skin BELOW injury level",
        "Loss of motor function below injury",
        "Loss of sensory function below injury",
        "Flaccid paralysis (areflexia in acute phase)"
      ],
      right: [
        "Poikilothermia (core temp matches environment)",
        "Priapism (sustained erection from parasympathetic dominance)",
        "Respiratory failure (cervical injuries C3-C5)",
        "Profound hypotension unresponsive to fluids",
        "Absent sweating below injury level"
      ]
    },
    medications: [
      {
        name: "Norepinephrine",
        type: "Alpha-1/Beta-1 Vasopressor",
        action: "Alpha-1 vasoconstriction restores SVR; beta-1 effect provides mild chronotropic support; preferred when BOTH hypotension AND bradycardia present",
        sideEffects: "Peripheral ischemia, arrhythmias, tissue necrosis with extravasation",
        contra: "Must have adequate fluid resuscitation first (though fluid tolerance is limited in neurogenic shock)",
        pearl: "Preferred vasopressor when both HR and BP are low; provides vasoconstriction AND some cardiac stimulation; titrate to MAP 85-90 mmHg for spinal cord perfusion"
      },
      {
        name: "Atropine",
        type: "Anticholinergic (Parasympathetic Blocker)",
        action: "Blocks vagal (parasympathetic) stimulation at the SA node, increasing heart rate in symptomatic bradycardia",
        sideEffects: "Tachycardia, dry mouth, urinary retention, mydriasis, confusion in elderly",
        contra: "Angle-closure glaucoma",
        pearl: "0.5 mg IV every 3-5 minutes (max 3 mg total) for symptomatic bradycardia; temporary measure; if persistent bradycardia, transcutaneous or transvenous pacing may be needed"
      }
    ],
    pearls: [
      "Neurogenic shock = Bradycardia + Hypotension + Warm skin (the ONLY shock type with this combination)",
      "Do NOT over-resuscitate with fluids: the heart CANNOT compensate with tachycardia, so excess fluids cause pulmonary edema without improving hemodynamics",
      "Target MAP 85-90 mmHg (higher than standard 65 mmHg) to maintain spinal cord perfusion pressure and prevent secondary cord injury",
      "Differentiate neurogenic shock (hemodynamic instability) from spinal shock (loss of reflexes below injury): they often coexist but require different management",
      "High cervical injuries (C3-C5) may cause respiratory failure because the phrenic nerve (diaphragm innervation) exits at C3-C5; monitor vital capacity and prepare for intubation",
      "Neurogenic shock is a diagnosis of exclusion in trauma: always rule out hemorrhage first (more common and immediately life-threatening)"
    ],
    quiz: [
      {
        question: "A patient with a C5 spinal cord injury has HR 44, BP 68/38, and warm dry skin. The nurse correctly identifies this as neurogenic shock because:",
        options: [
          "All shock types present with bradycardia",
          "Bradycardia with hypotension and warm skin indicates loss of sympathetic tone, unique to neurogenic shock",
          "The patient has a fever causing vasodilation",
          "This is the normal presentation of hypovolemic shock in trauma"
        ],
        correct: 1,
        rationale: "The triad of bradycardia + hypotension + warm dry skin is pathognomonic for neurogenic shock. Loss of sympathetic tone below the injury causes vasodilation (warm skin) and loss of cardiac acceleration (bradycardia). All other shock types present with compensatory tachycardia."
      },
      {
        question: "A patient in neurogenic shock is hypotensive after 1L NS bolus. What is the concern with administering large fluid volumes?",
        options: [
          "Risk of pulmonary edema because the heart cannot increase rate to handle the volume",
          "Fluids are contraindicated in all spinal cord injuries",
          "Large volumes will worsen the spinal cord injury",
          "Fluids will dilute vasopressor medications"
        ],
        correct: 0,
        rationale: "In neurogenic shock, the heart cannot mount a compensatory tachycardia. Excessive IV fluids increase preload without the heart being able to increase cardiac output proportionally, leading to pulmonary edema. Fluids should be given cautiously with early vasopressor initiation."
      }
    ]
  },

  "obstructive-shock-rn": {
    title: "Obstructive Shock: RN Clinical Management",
    cellular: {
      title: "Mechanical Obstruction to Cardiac Output",
      content: "Obstructive shock results from a mechanical barrier that prevents adequate cardiac filling or ejection, causing acute reduction in cardiac output despite adequate intravascular volume and myocardial function. The three primary causes are: (1) Cardiac tamponade: accumulation of fluid, blood, or air in the pericardial space compresses the heart, preventing diastolic filling. As little as 100-200 mL of rapid fluid accumulation can cause hemodynamic collapse (chronic effusions can tolerate 1-2 L due to gradual pericardial stretching). Equalization of diastolic pressures (RA = RV = PA diastolic = PAWP) is the hemodynamic hallmark. (2) Tension pneumothorax: air enters the pleural space through a one-way valve mechanism and cannot escape, progressively compressing the ipsilateral lung and shifting mediastinal structures (heart, great vessels, trachea) to the contralateral side. This kinks the great veins, preventing venous return and dramatically reducing preload. (3) Massive pulmonary embolism: a large clot (or saddle embolus) obstructs the pulmonary vasculature, preventing right ventricular outflow to the pulmonary circulation. Acute right ventricular pressure overload causes RV dilation and failure, interventricular septum bowing into the left ventricle, and reduced left ventricular filling and output. All three causes share the common mechanism of impaired cardiac filling or ejection, elevated central venous pressure (JVD), and rapid cardiovascular collapse. The definitive treatment is ALWAYS removing the obstruction (pericardiocentesis, needle decompression, thrombolysis/embolectomy); fluids and vasopressors are temporizing measures only."
    },
    riskFactors: [
      "Chest trauma (tension pneumothorax, cardiac tamponade from penetrating or blunt injury)",
      "Pericardial effusion (malignancy, uremia, autoimmune disease, post-cardiac surgery)",
      "Mechanical ventilation with high PEEP (can worsen obstructive physiology)",
      "Central venous catheter placement (risk of pneumothorax and cardiac perforation)",
      "Deep vein thrombosis with massive pulmonary embolism",
      "Post-cardiac surgery (tamponade from mediastinal bleeding)",
      "Constrictive pericarditis",
      "Mediastinal tumors compressing great vessels"
    ],
    diagnostics: [
      "Bedside echocardiography/FAST exam: pericardial effusion with diastolic chamber collapse (tamponade); RV dilation with septal bowing (massive PE)",
      "Chest X-ray: widened mediastinum (tamponade); absent lung markings with mediastinal shift (tension pneumothorax)",
      "Hemodynamic monitoring: elevated CVP with low cardiac output; equalization of diastolic pressures in tamponade",
      "CT pulmonary angiography for PE confirmation (if patient stable enough for transport)",
      "Point-of-care ultrasound (POCUS) for rapid diagnosis at bedside",
      "ECG: electrical alternans and low voltage in tamponade; right heart strain pattern in massive PE (S1Q3T3)",
      "Arterial blood gas: assess oxygenation and acid-base status"
    ],
    management: [
      "CARDIAC TAMPONADE: Emergency pericardiocentesis or pericardial window; IV fluid bolus to increase preload as bridge",
      "TENSION PNEUMOTHORAX: Immediate needle decompression at 2nd intercostal space, midclavicular line, followed by chest tube insertion",
      "MASSIVE PE: Systemic thrombolysis (alteplase), catheter-directed therapy, or surgical embolectomy; IV heparin anticoagulation",
      "Administer IV fluids to maintain preload (temporizing measure until obstruction relieved)",
      "Vasopressor support (norepinephrine) for persistent hypotension",
      "Avoid positive pressure ventilation if possible (worsens preload compromise in tamponade and tension pneumothorax)",
      "Prepare for emergency surgical intervention as indicated"
    ],
    nursingActions: [
      "Recognize Beck's triad (tamponade): JVD + muffled heart sounds + hypotension",
      "Recognize tension pneumothorax: absent breath sounds on one side + tracheal deviation away from affected side + JVD + hypotension",
      "Recognize massive PE: sudden dyspnea + pleuritic chest pain + hypotension + JVD + right heart strain on ECG",
      "Monitor for pulsus paradoxus (>10 mmHg drop in SBP during inspiration) suggesting tamponade",
      "Prepare emergency equipment: pericardiocentesis tray, large-bore needle (14-gauge) for needle decompression, chest tube tray",
      "Maintain large-bore IV access and prepare fluid bolus",
      "Monitor continuous vital signs and cardiac rhythm",
      "Document serial assessments and notify provider immediately of any deterioration",
      "If PEA arrest occurs: consider obstructive causes first (tamponade, tension pneumothorax, PE are treatable causes of PEA)"
    ],
    signs: {
      left: [
        "Jugular venous distension (JVD) - present in ALL obstructive shock causes",
        "Tachycardia (compensatory)",
        "Dyspnea and tachypnea",
        "Narrowing pulse pressure",
        "Elevated CVP with low cardiac output"
      ],
      right: [
        "Beck's triad: JVD + muffled heart sounds + hypotension (tamponade)",
        "Tracheal deviation + absent breath sounds (tension pneumothorax)",
        "Pulsus paradoxus >10 mmHg (tamponade)",
        "PEA arrest (think reversible obstructive causes)",
        "Rapid cardiovascular collapse"
      ]
    },
    medications: [
      {
        name: "IV Normal Saline Bolus",
        type: "Volume Expander (Temporizing)",
        action: "Increases preload to partially compensate for obstructed filling; maintains coronary perfusion pressure",
        sideEffects: "Fluid overload if obstruction not relieved",
        contra: "Not definitive treatment; must relieve obstruction",
        pearl: "Fluid bolus buys time in tamponade and PE but will NOT resolve shock; definitive treatment is removing the mechanical obstruction"
      },
      {
        name: "Alteplase (tPA) for Massive PE",
        type: "Thrombolytic Agent",
        action: "Converts plasminogen to plasmin, lysing the fibrin clot obstructing the pulmonary vasculature",
        sideEffects: "Major hemorrhage (intracranial most feared), minor bleeding",
        contra: "Active internal bleeding, recent surgery/trauma, hemorrhagic stroke, intracranial neoplasm",
        pearl: "100 mg IV over 2 hours for massive PE with hemodynamic instability; indication: massive PE with shock or cardiac arrest; monitor for bleeding complications"
      }
    ],
    pearls: [
      "JVD is present in obstructive shock but ABSENT in hypovolemic shock: this is a key differentiator in a hypotensive patient",
      "Obstructive shock has TREATABLE causes: pericardiocentesis for tamponade, needle decompression for tension pneumo, thrombolysis for PE",
      "PEA arrest: always consider the reversible causes (H's and T's): tamponade, tension pneumothorax, and thromboembolism are the obstructive causes",
      "Tension pneumothorax is a CLINICAL diagnosis: do NOT wait for chest X-ray; needle decompression is performed based on clinical findings alone",
      "Pulsus paradoxus >10 mmHg (exaggerated drop in SBP during inspiration) is a sensitive sign of cardiac tamponade",
      "Avoid positive pressure ventilation (PPV) in tamponade and tension pneumothorax if possible: PPV further reduces venous return and worsens hemodynamics"
    ],
    quiz: [
      {
        question: "A trauma patient develops sudden respiratory distress with absent breath sounds on the right, tracheal deviation to the left, JVD, and BP 62/34. What is the priority intervention?",
        options: [
          "Obtain a stat chest X-ray for confirmation",
          "Immediate needle decompression at 2nd intercostal space, right midclavicular line",
          "Start IV fluids and vasopressors",
          "Prepare for emergent intubation"
        ],
        correct: 1,
        rationale: "This is tension pneumothorax (absent breath sounds + tracheal deviation + JVD + hypotension). It is a CLINICAL diagnosis requiring immediate needle decompression. Do NOT wait for imaging. This is immediately life-threatening and requires emergent intervention."
      }
    ]
  },

  "mods-organ-dysfunction-rn": {
    title: "Multiple Organ Dysfunction Syndrome (MODS): RN Critical Care Management",
    cellular: {
      title: "Sequential Organ Failure in Critical Illness",
      content: "Multiple Organ Dysfunction Syndrome (MODS) represents the progressive failure of two or more organ systems in acutely ill patients, most commonly triggered by sepsis, severe trauma, major burns, or pancreatitis. The pathophysiology follows a two-hit model: the initial insult activates the innate immune system, releasing damage-associated molecular patterns (DAMPs) and pathogen-associated molecular patterns (PAMPs). These activate inflammatory cascades through Toll-like receptors, triggering a cytokine storm (TNF-alpha, IL-1, IL-6, IL-8). The resulting systemic inflammatory response causes: (1) Endothelial dysfunction with widespread microvascular thrombosis, capillary leak, and tissue edema; (2) Mitochondrial dysfunction (cytopathic hypoxia) where cells cannot utilize oxygen; (3) Immune dysregulation with both hyperinflammation and immunoparalysis; (4) Microcirculatory failure with shunting of blood away from capillary beds. Organ failure progresses sequentially, typically affecting the lungs first (ARDS with PaO2/FiO2 ratio declining), then cardiovascular system (vasopressor-dependent hypotension), kidneys (oliguria, rising creatinine), liver (rising bilirubin, coagulopathy), hematologic system (thrombocytopenia, DIC), and finally the neurological system (encephalopathy). The Sequential Organ Failure Assessment (SOFA) score quantifies dysfunction across six organ systems: respiratory (PaO2/FiO2), coagulation (platelets), hepatic (bilirubin), cardiovascular (MAP/vasopressors), neurological (GCS), and renal (creatinine/urine output). Mortality increases 15-20% for each additional failing organ: 1 organ failure ~20% mortality, 2 organs ~40%, 3 organs ~60-70%, 4+ organs >80%. Management is supportive: treat the underlying cause, provide organ-specific support, and engage in early goals-of-care discussions."
    },
    riskFactors: [
      "Sepsis and septic shock (most common precipitant)",
      "Severe trauma with hemorrhagic shock and massive transfusion",
      "Major burns >30% TBSA",
      "Acute necrotizing pancreatitis",
      "Prolonged surgical procedures with intraoperative complications",
      "Advanced age with diminished physiologic reserve",
      "Pre-existing chronic organ dysfunction (CKD, COPD, cirrhosis, heart failure)",
      "Immunosuppression or malnutrition",
      "Delayed source control (undrained abscess, non-debrided necrotic tissue)"
    ],
    diagnostics: [
      "Serial SOFA score calculation (every 24 hours minimum): tracks 6 organ systems; increase of >2 points from baseline defines sepsis-related organ dysfunction",
      "Arterial blood gas with PaO2/FiO2 ratio: <300 = ARDS; <200 = moderate ARDS; <100 = severe ARDS",
      "Serum lactate trending (every 4-6 hours): persistent elevation >4 mmol/L indicates tissue hypoperfusion and poor prognosis",
      "Complete blood count: thrombocytopenia indicates DIC or consumptive coagulopathy",
      "Coagulation panel: PT/INR, aPTT, fibrinogen, D-dimer for DIC screening",
      "Comprehensive metabolic panel: creatinine trending for AKI; bilirubin for hepatic dysfunction",
      "Procalcitonin trending for infection assessment",
      "Mixed venous oxygen saturation (SvO2): <65% indicates inadequate oxygen delivery to tissues"
    ],
    management: [
      "Source control: identify and treat the underlying trigger (surgical drainage, antibiotic optimization, debridement)",
      "Lung-protective ventilation for ARDS: tidal volume 6 mL/kg ideal body weight, plateau pressure <30 cmH2O, PEEP optimization",
      "Hemodynamic optimization: norepinephrine first-line vasopressor; add vasopressin as second agent; target MAP >65 mmHg",
      "Fluid management: initial resuscitation with crystalloid; transition to conservative fluid strategy once resuscitated (avoid fluid overload)",
      "Renal replacement therapy (CRRT) for AKI with refractory fluid overload, severe acidosis, or hyperkalemia",
      "Stress ulcer prophylaxis with PPI in mechanically ventilated patients",
      "DVT prophylaxis with LMWH or UFH and sequential compression devices",
      "Nutritional support: early enteral nutrition within 24-48 hours if GI tract functional",
      "Glucose management: target 140-180 mg/dL; avoid hypoglycemia",
      "Early goals-of-care discussion with family and palliative care team given high mortality"
    ],
    nursingActions: [
      "Calculate and document SOFA score every 24 hours; trend and report increases",
      "Monitor each organ system with specific parameters: lungs (PaO2/FiO2, vent settings), cardiovascular (MAP, vasopressor doses), kidneys (hourly urine output, creatinine), liver (bilirubin, coags), hematologic (platelets, DIC labs), neuro (GCS)",
      "Implement lung-protective ventilation protocols: verify tidal volume 6 mL/kg IBW, monitor plateau pressure",
      "Monitor fluid balance meticulously: daily weights, strict I&O, cumulative balance trending",
      "Titrate vasopressors per protocol to maintain MAP >65 mmHg",
      "Monitor for signs of DIC: petechiae, oozing from IV sites, prolonged bleeding, new hematuria",
      "Implement evidence-based ICU bundles: head of bed elevation 30-45 degrees, oral care every 4 hours, spontaneous breathing trial daily, early mobility",
      "Facilitate family communication and goals-of-care discussions",
      "Monitor for iatrogenic complications: ventilator-associated pneumonia, CAUTI, CLABSI",
      "Document clinical trajectory for team communication and prognostication"
    ],
    signs: {
      left: [
        "Respiratory: increasing FiO2 requirements, declining PaO2/FiO2 ratio",
        "Cardiovascular: escalating vasopressor requirements",
        "Renal: declining urine output, rising creatinine",
        "Hepatic: rising bilirubin, worsening coagulopathy",
        "Hematologic: falling platelet count, DIC labs worsening",
        "Neurologic: declining GCS, new confusion or obtundation"
      ],
      right: [
        "Refractory hypotension requiring multiple high-dose vasopressors",
        "Severe ARDS with PaO2/FiO2 <100 despite maximal ventilator support",
        "Anuria with rapidly rising creatinine requiring emergent dialysis",
        "Overt DIC with uncontrolled hemorrhage from multiple sites",
        "Hepatic failure with encephalopathy and coagulopathy",
        "Lactic acidosis >4 mmol/L unresponsive to resuscitation"
      ]
    },
    medications: [
      {
        name: "Norepinephrine",
        type: "First-line Vasopressor",
        action: "Alpha-1 vasoconstriction increases SVR; beta-1 effect supports contractility; maintains organ perfusion pressure",
        sideEffects: "Peripheral ischemia, arrhythmias, tissue necrosis with extravasation",
        contra: "Uncorrected hypovolemia",
        pearl: "Central line administration preferred; titrate to MAP >65 mmHg; doses >0.5 mcg/kg/min suggest refractory shock; consider adding vasopressin"
      },
      {
        name: "Hydrocortisone (Stress-dose)",
        type: "Corticosteroid for Shock",
        action: "Replaces cortisol in critical illness-related corticosteroid insufficiency; enhances vascular catecholamine sensitivity; may reduce time to shock reversal",
        sideEffects: "Hyperglycemia, immunosuppression, myopathy, GI bleeding risk",
        contra: "Active fungal infection (relative)",
        pearl: "200 mg/day IV (50 mg q6h or continuous infusion); indicated for refractory septic shock; may reduce vasopressor duration; monitor glucose closely"
      }
    ],
    pearls: [
      "SOFA score increase >2 points from baseline defines sepsis-related organ dysfunction; trend it every 24 hours",
      "Mortality increases 15-20% per additional failing organ: 1 organ ~20%, 2 organs ~40%, 3+ organs >60-80%",
      "The lungs are typically the first organ to fail (ARDS), followed by cardiovascular, renal, hepatic, hematologic, and neurologic systems",
      "Lung-protective ventilation (6 mL/kg IBW, Pplat <30) is the single most impactful intervention for ARDS in MODS",
      "Lactate clearance is the best surrogate marker for adequate resuscitation; persistent elevation predicts poor outcomes",
      "Early goals-of-care discussions are essential: families need honest prognostic information to make informed decisions about treatment intensity",
      "Conservative fluid management after initial resuscitation reduces ventilator days and improves outcomes (FACTT trial)"
    ],
    quiz: [
      {
        question: "A patient in the ICU with sepsis develops PaO2/FiO2 ratio of 150, platelet count of 80,000, creatinine of 3.2 (baseline 0.9), and requires norepinephrine at 15 mcg/min. How many organ systems are failing based on SOFA criteria?",
        options: ["1 organ system", "2 organ systems", "3 organ systems", "4 organ systems"],
        correct: 3,
        rationale: "Four organ systems are failing: (1) Respiratory - PaO2/FiO2 150 = moderate ARDS, (2) Hematologic - platelets 80,000 = SOFA 2, (3) Renal - creatinine 3.2 from baseline 0.9 = significant AKI, (4) Cardiovascular - requiring high-dose vasopressor. This carries >80% mortality and requires urgent goals-of-care discussion."
      }
    ]
  },

  "burns-critical-care-rn": {
    title: "Burns: RN Critical Care Management",
    cellular: {
      title: "Burn Injury Pathophysiology and Systemic Response",
      content: "Burn injury causes tissue destruction in concentric zones: the Zone of Coagulation (center, irreversible necrosis), Zone of Stasis (surrounding area with compromised but potentially salvageable tissue), and Zone of Hyperemia (outermost area with increased blood flow that typically recovers). The depth classification includes: Superficial (1st degree) involving epidermis only with erythema and pain; Superficial partial-thickness (2nd degree) involving epidermis and superficial dermis with blisters, moist appearance, and severe pain; Deep partial-thickness (2nd degree) extending into deep dermis with mottled appearance and decreased sensation; Full-thickness (3rd degree) involving entire dermis, appearing white/charred/leathery with absent pain; and Subdermal/4th degree extending into fascia, muscle, or bone. Burns >20% TBSA trigger a massive systemic inflammatory response: capillary permeability increases dramatically within minutes, causing fluid shifts from intravascular to interstitial space (burn edema). This creates two distinct phases: the Emergent/Resuscitative Phase (0-48 hours) characterized by massive fluid loss, hypovolemic shock, hyperkalemia (from cellular destruction), and risk of renal failure from myoglobinuria; and the Acute/Wound Care Phase (48 hours to wound closure) characterized by infection risk (loss of skin barrier), hypermetabolic state (metabolic rate increases 100-200% in major burns), protein catabolism, and immunosuppression. The Parkland Formula guides crystalloid resuscitation: 4 mL x body weight (kg) x %TBSA burned, with half given in the first 8 hours from the time of injury and the remaining half over the next 16 hours. The target endpoint is urine output of 0.5-1 mL/kg/hr in adults. Rule of Nines estimates TBSA: each arm 9%, each leg 18%, anterior trunk 18%, posterior trunk 18%, head 9%, perineum 1% (modified for children). Inhalation injury significantly increases mortality and should be suspected with facial burns, singed nasal hairs, carbonaceous sputum, hoarseness, or stridor."
    },
    riskFactors: [
      "Children (scalds are the most common mechanism in pediatrics)",
      "Elderly (impaired mobility, decreased sensation, thinner skin)",
      "Occupational exposure (firefighters, industrial workers, electricians)",
      "Smoking while using supplemental oxygen",
      "Substance abuse (impaired judgment and reaction time)",
      "Psychiatric illness (self-immolation)",
      "Inadequate fire safety measures (no smoke detectors, fire extinguishers)",
      "Epilepsy or neurological conditions causing loss of consciousness"
    ],
    diagnostics: [
      "Burn depth assessment: visual inspection, capillary refill, sensation testing, laser Doppler imaging",
      "TBSA calculation using Rule of Nines (adult), Lund-Browder chart (most accurate, required for children)",
      "Hourly urine output monitoring via Foley catheter: target 0.5-1 mL/kg/hr adult, 1-2 mL/kg/hr child",
      "Carboxyhemoglobin level if inhalation injury suspected (>10% significant, >50% usually fatal)",
      "Arterial blood gas: monitor oxygenation, ventilation, and acid-base status",
      "CBC, CMP, coagulation studies, type and screen",
      "Serum lactate (monitor perfusion adequacy during resuscitation)",
      "CK/CPK and urine myoglobin if deep burns or electrical injury (rhabdomyolysis risk)",
      "Chest X-ray for baseline and if inhalation injury suspected",
      "Bronchoscopy for confirmed inhalation injury (soot in airways, mucosal erythema/edema)"
    ],
    management: [
      "AIRWAY is #1 priority: assess for inhalation injury (singed nasal hairs, carbonaceous sputum, hoarseness, stridor); intubate early if any suspicion (airway edema progresses rapidly)",
      "Fluid resuscitation per Parkland Formula: 4 mL x kg x %TBSA; half in first 8 hours FROM TIME OF INJURY, second half over 16 hours; titrate to urine output",
      "Use Lactated Ringer's for resuscitation (preferred crystalloid; avoid normal saline to prevent hyperchloremic acidosis)",
      "Wound care: debride devitalized tissue, apply topical antimicrobials (silver sulfadiazine, mafenide acetate), sterile dressings",
      "Escharotomy for circumferential full-thickness burns compromising circulation or ventilation",
      "Pain management: IV opioids (morphine, hydromorphone) titrated to effect; procedural pain management before dressing changes",
      "Tetanus prophylaxis as indicated",
      "Nutritional support: early enteral nutrition (Curreri formula: 25 kcal/kg/day + 40 kcal/%TBSA/day); high-protein diet",
      "Maintain normothermia: environmental temperature 85-90°F, warming blankets, warm IV fluids"
    ],
    nursingActions: [
      "Assess and secure airway as first priority; monitor for signs of inhalation injury progression",
      "Calculate TBSA accurately using Rule of Nines or Lund-Browder chart; document burn map",
      "Calculate Parkland Formula and initiate fluid resuscitation; monitor urine output hourly",
      "Adjust fluid rate every 1-2 hours based on urine output (target 0.5-1 mL/kg/hr adult)",
      "Monitor vital signs every 15-30 minutes during resuscitation phase",
      "Assess for compartment syndrome in circumferentially burned extremities (pain, decreased pulses, delayed cap refill)",
      "Perform wound care using strict aseptic technique; assess burn depth and wound changes",
      "Administer pain medication 30-60 minutes before dressing changes and procedures",
      "Monitor temperature and maintain warm environment (burn patients are hypothermia-prone due to loss of skin barrier)",
      "Monitor for signs of infection: fever, increasing wound erythema, purulent drainage, positive wound cultures",
      "Elevate burned extremities above heart level to reduce edema",
      "Provide psychosocial support: body image concerns, PTSD risk, family coping"
    ],
    signs: {
      left: [
        "Superficial: erythema, pain, blanches with pressure",
        "Partial-thickness: blisters, moist pink/red, SEVERE pain",
        "Full-thickness: white/charred/leathery, NO pain (nerve destruction)",
        "Rule of Nines: arm 9%, leg 18%, trunk 36%, head 9%"
      ],
      right: [
        "Inhalation injury: singed nasal hairs, hoarseness, stridor, carbonaceous sputum",
        "Hypovolemic shock: tachycardia, hypotension, decreased urine output",
        "Compartment syndrome: pain, decreased pulses in circumferential burns",
        "Infection signs: fever spike, wound cellulitis, sepsis",
        "Hyperkalemia (early): from massive cellular destruction"
      ]
    },
    medications: [
      {
        name: "Lactated Ringer's Solution (Parkland Formula)",
        type: "Isotonic Crystalloid for Burn Resuscitation",
        action: "Volume replacement to counteract massive capillary leak and intravascular volume loss; electrolyte composition mimics plasma",
        sideEffects: "Over-resuscitation causes pulmonary edema, abdominal compartment syndrome, extremity compartment syndrome (fluid creep)",
        contra: "Avoid excessive resuscitation; titrate to urine output NOT to a fixed volume",
        pearl: "Parkland Formula: 4 mL x kg x %TBSA; half in FIRST 8 hours from TIME OF INJURY (not time of hospital arrival); titrate to urine output 0.5-1 mL/kg/hr"
      },
      {
        name: "Silver Sulfadiazine (Silvadene)",
        type: "Topical Antimicrobial for Burn Wounds",
        action: "Bactericidal against gram-negative and gram-positive organisms; inhibits bacterial DNA synthesis",
        sideEffects: "Transient leukopenia (reversible), skin discoloration, rare Stevens-Johnson syndrome",
        contra: "Sulfa allergy, pregnancy (near term), neonates <2 months, avoid on face (use bacitracin instead)",
        pearl: "Apply 1/16 inch thick with sterile tongue blade; causes painless white pseudoeschar that must be removed before reapplication; monitor WBC weekly for leukopenia"
      },
      {
        name: "Morphine Sulfate IV",
        type: "Opioid Analgesic",
        action: "Mu-opioid receptor agonist providing analgesia for severe burn pain",
        sideEffects: "Respiratory depression, hypotension, constipation, pruritus",
        contra: "Respiratory depression, hemodynamic instability (use with caution)",
        pearl: "Burns cause SEVERE pain; administer IV (NOT IM due to unpredictable absorption from edematous tissue); give 30-60 min before dressing changes; consider PCA for continuous pain control"
      }
    ],
    pearls: [
      "AIRWAY is always the #1 priority in burns: intubate EARLY if any suspicion of inhalation injury because airway edema can progress to complete obstruction within hours",
      "Parkland Formula: 4 mL x kg x %TBSA; the clock starts at TIME OF INJURY, not time of arrival to hospital; subtract prehospital fluids from calculated amount",
      "Fluid creep: over-resuscitation is as dangerous as under-resuscitation; titrate to urine output (0.5-1 mL/kg/hr adult) rather than a fixed volume target",
      "Full-thickness burns are PAINLESS because nerve endings are destroyed; presence of severe pain actually indicates partial-thickness depth (nerve endings intact)",
      "The Rule of Nines is modified for children: a child's head is proportionally larger (18% for infant vs 9% for adult) and legs are smaller",
      "Never use ice on burns: causes vasoconstriction and worsens the zone of stasis; use cool running water for 20 minutes within 3 hours of injury",
      "Carbon monoxide poisoning: treat with 100% O2 via non-rebreather; pulse oximetry is FALSELY NORMAL (reads COHb as oxyhemoglobin); confirm with co-oximetry ABG"
    ],
    quiz: [
      {
        question: "A 70 kg patient sustains 40% TBSA burns at 1400. Using the Parkland Formula, how much LR should be administered in the first 8 hours?",
        options: ["5,600 mL total (half = 2,800 mL in first 8 hours)", "11,200 mL in first 8 hours", "5,600 mL in first 8 hours", "2,800 mL total"],
        correct: 0,
        rationale: "Parkland Formula: 4 mL x 70 kg x 40% TBSA = 11,200 mL total in 24 hours. Half (5,600 mL) is given in the first 8 hours from time of injury. The remaining 5,600 mL is given over the next 16 hours. Always calculate from time of injury."
      },
      {
        question: "A patient with facial burns arrives alert and talking but with singed nasal hairs and mild hoarseness. What is the priority nursing action?",
        options: ["Apply silver sulfadiazine to the facial burns", "Prepare for early endotracheal intubation", "Administer IV morphine for pain", "Calculate TBSA using Rule of Nines"],
        correct: 1,
        rationale: "Singed nasal hairs and hoarseness indicate inhalation injury. Airway edema can progress rapidly to complete obstruction. Early intubation while the patient can still be intubated is critical. Waiting until stridor or respiratory distress develops makes intubation extremely difficult or impossible."
      }
    ]
  },

  "status-epilepticus-rn": {
    title: "Status Epilepticus: RN Emergency Management",
    cellular: {
      title: "Sustained Seizure Pathophysiology and Excitotoxicity",
      content: "Status epilepticus (SE) is defined as a seizure lasting >5 minutes OR two or more seizures without return to baseline consciousness between episodes. This represents a neurological emergency with a mortality rate of 15-22% in adults. The pathophysiology involves failure of normal seizure termination mechanisms: as seizures persist, inhibitory GABA-A receptors internalize (become less effective), while excitatory NMDA glutamate receptors are upregulated and traffic to the synaptic surface, creating a self-sustaining cycle of excitation. This explains why benzodiazepines (GABA-A agonists) become less effective the longer a seizure continues - the receptors they target are physically removed from the cell membrane. Excitotoxicity occurs as excessive glutamate release through NMDA receptors causes massive calcium influx into neurons, activating destructive enzymes (calpains, phospholipases, endonucleases) that damage cellular structures and trigger apoptotic pathways. Sustained seizure activity dramatically increases cerebral metabolic demand (up to 300% of normal): neurons consume oxygen and glucose at unsustainable rates, leading to energy failure, ATP depletion, and neuronal death. Systemically, prolonged convulsive SE causes: lactic acidosis from sustained muscle contraction, hyperthermia from excessive motor activity, rhabdomyolysis with myoglobinuria and acute kidney injury risk, respiratory compromise from impaired ventilation, autonomic instability with arrhythmias, and aspiration pneumonia. Brain injury from SE begins after 30 minutes of continuous seizure activity, making rapid treatment essential. The time-dependent loss of GABA-A receptors is why the American Epilepsy Society guidelines emphasize: benzodiazepines within 5 minutes (first-line), second-line anticonvulsant within 20 minutes, and third-line therapy (intubation and anesthetic infusion) within 40 minutes."
    },
    riskFactors: [
      "History of epilepsy with subtherapeutic anticonvulsant levels (most common cause)",
      "Non-compliance or abrupt discontinuation of antiepileptic drugs",
      "Acute brain injury: stroke, traumatic brain injury, CNS infection (meningitis, encephalitis)",
      "Metabolic derangements: severe hypoglycemia, hyponatremia, hypocalcemia, uremia, hepatic encephalopathy",
      "Drug or alcohol withdrawal (benzodiazepine, barbiturate, alcohol)",
      "Drug overdose or toxicity (isoniazid, tricyclic antidepressants, cocaine, sympathomimetics)",
      "Brain tumors or mass lesions",
      "Febrile illness in children with prior febrile seizures",
      "Eclampsia in pregnancy",
      "Hypoxic-ischemic brain injury (post-cardiac arrest)"
    ],
    diagnostics: [
      "Bedside glucose (finger stick) IMMEDIATELY to rule out hypoglycemia as cause",
      "Continuous EEG monitoring: gold standard for confirming seizure activity, especially non-convulsive SE",
      "Antiepileptic drug levels: phenytoin, valproic acid, carbamazepine, levetiracetam (identify subtherapeutic levels)",
      "Comprehensive metabolic panel: sodium, calcium, magnesium, glucose, BUN/creatinine, LFTs",
      "Arterial blood gas: assess for metabolic acidosis (lactic acidosis from muscle activity)",
      "Toxicology screen: identify drug-related causes",
      "CT head without contrast: rule out structural causes (hemorrhage, mass, edema)",
      "Lumbar puncture: if CNS infection suspected (after CT rules out mass effect)",
      "CK level: monitor for rhabdomyolysis from sustained muscle contraction"
    ],
    management: [
      "FIRST-LINE (0-5 min): Benzodiazepines immediately - IV lorazepam 0.1 mg/kg (max 4 mg, may repeat once) OR midazolam 10 mg IM if no IV access",
      "SECOND-LINE (5-20 min): If seizures continue, administer IV fosphenytoin 20 mg PE/kg (max rate 150 mg PE/min) OR IV valproate 40 mg/kg OR IV levetiracetam 60 mg/kg",
      "THIRD-LINE (>20-40 min): Refractory SE requires intubation and continuous IV anesthetic infusion: propofol, midazolam, or pentobarbital with continuous EEG monitoring",
      "Check bedside glucose IMMEDIATELY and administer D50W if hypoglycemic",
      "Administer thiamine 100 mg IV BEFORE dextrose in suspected alcohol withdrawal or malnutrition",
      "Protect airway: suction, position on side, supplemental oxygen; prepare for intubation",
      "Treat underlying cause: correct electrolytes, administer antibiotics for infection, treat toxin exposure"
    ],
    nursingActions: [
      "Note TIME of seizure onset (critical for treatment algorithm timing)",
      "Protect the patient: pad side rails, remove harmful objects, do NOT restrain or place anything in mouth",
      "Position on side (recovery position) when possible to protect airway and prevent aspiration",
      "Suction oropharynx as needed; maintain airway patency",
      "Administer high-flow oxygen and monitor SpO2 continuously",
      "Establish IV access; administer benzodiazepine within 5 minutes of seizure onset",
      "Check bedside glucose immediately and treat hypoglycemia",
      "Monitor vital signs continuously: cardiac monitor, pulse oximetry, blood pressure",
      "Prepare for intubation if seizures persist beyond 20 minutes or if respiratory compromise occurs",
      "Monitor for post-ictal state: assess level of consciousness, neurological exam, maintain safety",
      "Document seizure characteristics: type of movement, duration, body parts involved, LOC changes",
      "Monitor for complications: aspiration, hyperthermia, rhabdomyolysis, metabolic acidosis"
    ],
    signs: {
      left: [
        "Generalized tonic-clonic movements lasting >5 minutes",
        "Loss of consciousness with rhythmic jerking",
        "Tongue biting and incontinence",
        "Sequential seizures without return to consciousness",
        "Tachycardia and hypertension (sympathetic activation)"
      ],
      right: [
        "Cyanosis and desaturation (respiratory compromise)",
        "Hyperthermia from sustained muscle activity (>40°C)",
        "Metabolic acidosis (lactic acid from anaerobic muscle metabolism)",
        "Non-convulsive SE: subtle eye movements, altered consciousness without convulsions (requires EEG for diagnosis)",
        "Post-ictal: confusion, lethargy, focal neurological deficits (Todd paralysis)"
      ]
    },
    medications: [
      {
        name: "Lorazepam (Ativan) IV",
        type: "Benzodiazepine (First-line for SE)",
        action: "Enhances GABA-A receptor inhibition, rapidly terminating seizure activity; longer duration of antiseizure effect than diazepam (12-24 hours vs 15-20 minutes)",
        sideEffects: "Respiratory depression, sedation, hypotension; effectiveness decreases with prolonged seizure (GABA-A receptor internalization)",
        contra: "Acute narrow-angle glaucoma, severe respiratory depression (relative in SE emergency)",
        pearl: "0.1 mg/kg IV (max 4 mg/dose), may repeat once after 5 minutes; preferred first-line IV benzodiazepine for SE due to longer antiseizure duration; administer at 2 mg/min; must be refrigerated"
      },
      {
        name: "Fosphenytoin (Cerebyx) IV",
        type: "Hydantoin Anticonvulsant (Second-line)",
        action: "Prodrug of phenytoin; stabilizes neuronal membranes by blocking voltage-gated sodium channels, preventing repetitive firing",
        sideEffects: "Hypotension, cardiac arrhythmias, purple glove syndrome (with phenytoin, not fosphenytoin), nystagmus, ataxia",
        contra: "Sinus bradycardia, SA block, 2nd/3rd degree AV block, Adams-Stokes syndrome",
        pearl: "20 mg PE/kg IV at max 150 mg PE/min (3x faster than phenytoin); continuous cardiac monitoring required during infusion; dosed in PE (phenytoin equivalents); can be given IM unlike phenytoin"
      },
      {
        name: "Midazolam IM",
        type: "Benzodiazepine (First-line when no IV access)",
        action: "Rapid-acting GABA-A agonist; IM route provides reliable absorption when IV access unavailable",
        sideEffects: "Respiratory depression, sedation, hypotension",
        contra: "Severe respiratory depression (relative in SE emergency)",
        pearl: "10 mg IM for adults >40 kg; RAMPART trial showed IM midazolam is as effective as IV lorazepam when IV access is delayed; critical for prehospital and ER management when IV access is difficult during active seizure"
      }
    ],
    pearls: [
      "Time is critical: benzodiazepines within 5 minutes, second-line within 20 minutes, third-line within 40 minutes; delayed treatment = worse outcomes and treatment resistance",
      "Benzodiazepines become less effective over time because GABA-A receptors internalize during prolonged seizures; this is why early treatment is essential",
      "If no IV access, give midazolam IM (10 mg) into deltoid or anterolateral thigh; do NOT delay treatment to obtain IV access",
      "Always check bedside glucose FIRST: hypoglycemia is a rapidly reversible cause of seizures; give D50W 50 mL IV if glucose <60 mg/dL",
      "Non-convulsive status epilepticus (NCSE) can present as altered consciousness without convulsions; requires continuous EEG for diagnosis; suspect in any patient with prolonged altered mental status after convulsive seizure",
      "Monitor for rhabdomyolysis after prolonged convulsive SE: check CK, monitor urine for myoglobinuria, maintain aggressive IV hydration (target UO 200-300 mL/hr)",
      "Do NOT use phenytoin in absence seizures or myoclonic epilepsy (can worsen); use valproate or levetiracetam instead"
    ],
    quiz: [
      {
        question: "A patient has been seizing for 8 minutes. IV lorazepam 4 mg was given 3 minutes ago without effect. What is the next medication the nurse should prepare?",
        options: ["Repeat lorazepam 4 mg IV", "Prepare IV fosphenytoin 20 mg PE/kg loading dose", "Administer diazepam rectally", "Wait 10 more minutes for lorazepam to take effect"],
        correct: 1,
        rationale: "After first-line benzodiazepine failure (seizure continuing >5 minutes after initial dose), the algorithm advances to second-line therapy. Fosphenytoin 20 mg PE/kg, valproate 40 mg/kg, or levetiracetam 60 mg/kg are second-line options. Repeated benzodiazepine doses have diminishing returns due to GABA-A receptor internalization."
      },
      {
        question: "Why do benzodiazepines become less effective the longer a seizure continues?",
        options: [
          "The liver metabolizes benzodiazepines faster during seizures",
          "GABA-A receptors internalize (are removed from the cell surface) during prolonged seizure activity",
          "Benzodiazepines cannot cross the blood-brain barrier during seizures",
          "Seizures cause renal excretion of benzodiazepines"
        ],
        correct: 1,
        rationale: "During prolonged seizure activity, GABA-A receptors are physically internalized (endocytosed) from the synaptic membrane, reducing the number of targets for benzodiazepines. Simultaneously, excitatory NMDA receptors are upregulated. This time-dependent receptor trafficking is why early treatment (within 5 minutes) is critical."
      }
    ]
  },

  "traumatic-brain-injury-rn": {
    title: "Traumatic Brain Injury: RN Assessment & Management",
    cellular: {
      title: "Primary and Secondary Brain Injury",
      content: "Traumatic brain injury (TBI) involves two phases of injury: Primary injury occurs at the moment of impact and includes direct tissue damage from mechanical forces: contusions (coup-contrecoup), diffuse axonal injury (DAI) from rotational acceleration-deceleration shearing white matter tracts, skull fractures, and intracranial hemorrhage (epidural, subdural, subarachnoid, intraparenchymal). Primary injury is irreversible and can only be prevented, not treated. Secondary injury develops hours to days after the initial insult and is the primary target of nursing management. The cascade includes: (1) Cerebral edema from blood-brain barrier disruption and cellular swelling (cytotoxic and vasogenic edema); (2) Increased intracranial pressure (ICP) as brain swelling within the rigid skull compresses brain tissue (Monro-Kellie doctrine: skull contains fixed volume of brain, blood, CSF; increase in one must be compensated by decrease in another); (3) Decreased cerebral perfusion pressure (CPP = MAP - ICP; goal >60 mmHg); (4) Excitotoxicity from glutamate release causing calcium-mediated neuronal death; (5) Inflammation and free radical damage; (6) Cerebral ischemia from vasospasm, microvascular thrombosis, and impaired autoregulation. Cushing's triad (hypertension with widening pulse pressure, bradycardia, irregular respirations) is a LATE and ominous sign of critically elevated ICP indicating impending brainstem herniation. Normal ICP is 5-15 mmHg; sustained ICP >20-22 mmHg requires treatment. The nurse's role focuses on preventing and detecting secondary injury through meticulous neurological assessment, ICP monitoring, CPP optimization, and avoiding activities that increase ICP."
    },
    riskFactors: [
      "Motor vehicle accidents (most common cause in young adults)",
      "Falls (most common cause in elderly >65 and children <5)",
      "Violence (assault, gunshot wounds)",
      "Sports-related injuries (concussion spectrum)",
      "Military blast injuries",
      "Anticoagulant therapy (increases risk of intracranial hemorrhage with minor trauma)",
      "Alcohol intoxication (impairs protective reflexes and complicates assessment)",
      "Elderly patients (cerebral atrophy creates space for bridging vein stretching, increasing subdural hematoma risk)"
    ],
    diagnostics: [
      "Glasgow Coma Scale (GCS): baseline and serial assessments; score 13-15 = mild TBI, 9-12 = moderate, 3-8 = severe",
      "Pupil assessment: size, symmetry, reactivity (unilateral fixed dilated pupil = ipsilateral uncal herniation)",
      "CT head without contrast: initial imaging of choice (identifies hemorrhage, fractures, midline shift, edema)",
      "ICP monitoring: external ventricular drain (EVD) is gold standard (allows both monitoring AND therapeutic CSF drainage)",
      "Cerebral perfusion pressure calculation: CPP = MAP - ICP (goal CPP >60 mmHg)",
      "Serial neurological assessments every 1-2 hours (motor response, pupil reactivity, GCS trending)",
      "CT angiography if vascular injury suspected",
      "MRI when patient stable (better for DAI, brainstem injury, prognostication)"
    ],
    management: [
      "Maintain CPP >60 mmHg: optimize MAP (vasopressors if needed) and reduce ICP",
      "ICP management tiered approach: HOB elevation 30 degrees, head midline, sedation/analgesia, CSF drainage via EVD, osmotic therapy (mannitol or hypertonic saline), neuromuscular blockade, decompressive craniectomy (last resort)",
      "Osmotic therapy for elevated ICP: mannitol 20% (0.25-1 g/kg IV) OR hypertonic saline 3% (250 mL bolus) or 23.4% (30 mL via central line)",
      "Maintain euvolemia and normotension (SBP >100 mmHg in severe TBI)",
      "Temperature management: target normothermia (36-37°C); treat fever aggressively (fever increases ICP and worsens outcomes)",
      "Seizure prophylaxis: levetiracetam or phenytoin for 7 days post-injury in severe TBI",
      "Maintain blood glucose 80-180 mg/dL; avoid hypoglycemia",
      "Correct coagulopathy if present (reverse anticoagulants emergently)"
    ],
    nursingActions: [
      "Perform GCS and neurological assessment every 1-2 hours; report any decline >2 points immediately",
      "Assess pupil size and reactivity every 1-2 hours; report new asymmetry or fixed dilation immediately (sign of herniation)",
      "Maintain head of bed at 30 degrees with head in neutral midline position (promotes venous drainage from brain)",
      "Monitor ICP continuously if EVD/monitor placed; report ICP >20-22 mmHg sustained >5 minutes",
      "Calculate and document CPP every hour (CPP = MAP - ICP); report CPP <60 mmHg",
      "Avoid activities that increase ICP: cluster nursing care, avoid hip flexion >90 degrees, prevent Valsalva (stool softeners), maintain calm environment, premedicate before suctioning",
      "Suction only when necessary and limit passes to <10 seconds; preoxygenate with 100% FiO2 before suctioning",
      "Monitor for Cushing's triad (hypertension + bradycardia + irregular respirations) as LATE sign of brain herniation",
      "Administer osmotic therapy as ordered; monitor serum osmolality (hold mannitol if >320 mOsm/kg) and serum sodium",
      "Maintain normothermia: treat fever promptly with cooling measures and antipyretics",
      "Implement seizure precautions: suction at bedside, padded side rails, oxygen available",
      "Monitor CSF drainage via EVD: color (clear = normal; bloody = hemorrhage; cloudy = infection), amount, and ICP waveform"
    ],
    signs: {
      left: [
        "Declining GCS score (earliest and most reliable indicator of deterioration)",
        "New or worsening headache",
        "Nausea and vomiting (increased ICP)",
        "Altered level of consciousness (confusion, restlessness, lethargy)",
        "Contralateral motor weakness (hemiparesis)"
      ],
      right: [
        "Cushing's triad: hypertension + bradycardia + irregular respirations (LATE, ominous sign of herniation)",
        "Unilateral fixed dilated pupil (ipsilateral uncal herniation compressing CN III)",
        "Bilateral fixed dilated pupils (bilateral herniation or brainstem death)",
        "Decerebrate posturing (extension: brainstem dysfunction)",
        "Decorticate posturing (flexion: cortical dysfunction)",
        "Diabetes insipidus (polyuria, low specific gravity): pituitary injury"
      ]
    },
    medications: [
      {
        name: "Mannitol 20%",
        type: "Osmotic Diuretic for ICP Reduction",
        action: "Creates osmotic gradient pulling free water from brain interstitial space into intravascular compartment, reducing cerebral edema and ICP within 15-30 minutes",
        sideEffects: "Hypotension (due to osmotic diuresis), hypovolemia, electrolyte imbalances, rebound ICP elevation with repeated doses, acute kidney injury",
        contra: "Serum osmolality >320 mOsm/kg, hypovolemia, active intracranial bleeding (may worsen hemorrhage)",
        pearl: "0.25-1 g/kg IV bolus over 15-20 min; check serum osmolality q6h (hold if >320); maintain Foley catheter; rebound effect with repeated doses; use through filter IV set (mannitol crystallizes at room temp)"
      },
      {
        name: "Hypertonic Saline (3% or 23.4%)",
        type: "Osmotic Agent for ICP Reduction",
        action: "Creates osmotic gradient shifting water from cerebral tissue to intravascular space; also improves cerebral blood flow and reduces inflammation",
        sideEffects: "Hypernatremia, central pontine myelinolysis (if sodium corrected too rapidly in chronic hyponatremia), fluid overload, phlebitis (23.4% requires central line)",
        contra: "Hypernatremia (Na >155 mEq/L), decompensated heart failure",
        pearl: "3% NaCl: 250 mL bolus or continuous infusion targeting Na 145-155 mEq/L; 23.4% NaCl: 30 mL via central line for acute herniation; may be preferred over mannitol in hypotensive patients (does not cause diuresis)"
      }
    ],
    pearls: [
      "CPP = MAP - ICP; goal CPP >60 mmHg; the nurse must KNOW this formula and calculate it hourly",
      "GCS declining by 2 or more points is a neurosurgical emergency requiring immediate notification and intervention",
      "Cushing's triad is a LATE sign of herniation; do not wait for it; the nurse should detect rising ICP BEFORE herniation occurs through trending GCS, pupil checks, and ICP values",
      "HOB at 30 degrees + head midline + avoid neck flexion = promotes jugular venous drainage and reduces ICP; this is a FREE nursing intervention",
      "A unilateral fixed dilated pupil indicates IPSILATERAL uncal herniation compressing CN III; this is the SAME side as the expanding mass lesion",
      "Cluster care to minimize ICP spikes; space activities 10-15 minutes apart; preoxygenate before suctioning",
      "Fever increases cerebral metabolic rate by 10-13% per degree Celsius, worsening secondary brain injury; treat aggressively"
    ],
    quiz: [
      {
        question: "A patient with severe TBI has an ICP of 28 mmHg and MAP of 78 mmHg. What is the CPP and is it adequate?",
        options: [
          "CPP = 50 mmHg; inadequate (goal >60)",
          "CPP = 106 mmHg; too high",
          "CPP = 28 mmHg; inadequate",
          "CPP cannot be calculated with this information"
        ],
        correct: 0,
        rationale: "CPP = MAP - ICP = 78 - 28 = 50 mmHg. The goal CPP is >60 mmHg. A CPP of 50 indicates inadequate cerebral perfusion. Interventions to improve CPP include reducing ICP (osmotic therapy, CSF drainage, sedation) and/or increasing MAP (fluid bolus, vasopressors)."
      },
      {
        question: "A nurse notes a patient's right pupil is newly fixed and dilated at 6 mm while the left pupil is 3 mm and reactive. What does this indicate?",
        options: [
          "Normal finding after sedation",
          "Ipsilateral (right-sided) uncal herniation compressing cranial nerve III",
          "Bilateral herniation with brainstem death",
          "Medication side effect from atropine"
        ],
        correct: 1,
        rationale: "A unilateral fixed dilated pupil indicates uncal herniation on the SAME side. The temporal lobe herniates through the tentorium, compressing CN III (oculomotor nerve) which controls pupillary constriction. This is a neurosurgical emergency requiring immediate ICP-lowering measures and neurosurgical consultation."
      }
    ]
  },

  "hemodynamic-monitoring-basics-rn": {
    title: "Hemodynamic Monitoring Basics: RN Clinical Application",
    cellular: {
      title: "Invasive Hemodynamic Monitoring Principles",
      content: "Hemodynamic monitoring provides objective, continuous measurement of cardiovascular function to guide critical care management. The fundamental concepts are: Preload (the volume of blood stretching the ventricle at end-diastole, measured by CVP for the right heart and PAWP/PCWP for the left heart), Afterload (the resistance the ventricle must overcome to eject blood, measured by SVR for the left ventricle and PVR for the right ventricle), and Contractility (the intrinsic force of myocardial contraction, inferred from cardiac output/cardiac index in relation to preload). Cardiac Output (CO = Heart Rate x Stroke Volume) is the total volume of blood pumped per minute (normal 4-8 L/min); Cardiac Index (CI = CO/BSA) adjusts for body size (normal 2.5-4.0 L/min/m2). Mean Arterial Pressure (MAP = [(2 x Diastolic) + Systolic] / 3) represents the average pressure driving organ perfusion (target >65 mmHg). An arterial line provides continuous, beat-to-beat blood pressure monitoring and allows arterial blood sampling. Central venous pressure (CVP) is measured via a central venous catheter (internal jugular, subclavian, or femoral vein) and reflects right heart preload (normal 2-8 mmHg). A pulmonary artery (Swan-Ganz) catheter is threaded through the right heart into the pulmonary artery, providing: RA pressure (preload), RV pressure, PA pressure, and PAWP/wedge pressure (left heart preload proxy, normal 8-12 mmHg). When the balloon is inflated, it occludes forward flow and the transducer reads the downstream pressure, which approximates left atrial pressure and LVEDP. SVR (normal 800-1200 dyn-s-cm-5) is calculated from MAP, CVP, and CO: SVR = [(MAP - CVP) / CO] x 80. The phlebostatic axis (4th intercostal space at mid-axillary line) is the reference point for transducer leveling; all readings should be taken at end-expiration to eliminate respiratory artifact."
    },
    riskFactors: [
      "Critical illness requiring vasoactive medication titration",
      "Cardiogenic shock requiring preload and afterload optimization",
      "Septic shock requiring fluid and vasopressor management",
      "ARDS requiring fluid balance monitoring",
      "Complex cardiac surgery post-operative management",
      "Pulmonary hypertension assessment",
      "Differentiation of shock types when clinical assessment alone is insufficient"
    ],
    diagnostics: [
      "CVP monitoring (normal 2-8 mmHg): reflects right heart preload and volume status",
      "Arterial line monitoring: continuous MAP, systolic/diastolic pressure, arterial waveform analysis",
      "PA catheter readings: PA systolic (15-30 mmHg), PA diastolic (8-15 mmHg), PA mean (10-20 mmHg)",
      "PAWP/PCWP (normal 8-12 mmHg): left ventricular preload indicator; obtained by inflating balloon at catheter tip",
      "Cardiac output measurement: thermodilution technique (inject cold saline and measure temperature change) or continuous CO monitoring",
      "Cardiac index calculation: CI = CO / BSA (normal 2.5-4.0 L/min/m2)",
      "SVR calculation: [(MAP - CVP) / CO] x 80 (normal 800-1200 dyn-s-cm-5)",
      "Mixed venous oxygen saturation (SvO2) from PA catheter: normal 60-80%; reflects balance of oxygen supply and demand",
      "ScvO2 from central venous catheter: surrogate for SvO2; normal >70%"
    ],
    management: [
      "Level and zero the transducer at the phlebostatic axis (4th ICS, mid-axillary line) at start of shift and with any position change",
      "Obtain all hemodynamic readings at end-expiration for consistency",
      "Interpret readings in clinical context: no single number determines treatment; trend changes are more important than absolute values",
      "Titrate vasoactive medications based on hemodynamic targets: vasopressors for low SVR, inotropes for low CO, vasodilators for high afterload",
      "Assess and maintain arterial line patency: continuous flush system at 300 mmHg, heparinized saline",
      "PA catheter: keep balloon deflated except during wedge readings; never leave inflated (PA rupture risk)",
      "Monitor for complications: catheter-related bloodstream infection (CLABSI), PA rupture, arrhythmias, air embolism, pneumothorax"
    ],
    nursingActions: [
      "Level transducer at phlebostatic axis (4th ICS, mid-axillary line) at start of each shift, with position changes, and whenever readings seem inconsistent with clinical picture",
      "Zero the system per unit protocol (confirms accuracy of pressure measurements)",
      "Take all readings at end-expiration (respiratory cycle affects intrathoracic pressure and readings)",
      "Identify and troubleshoot waveform problems: dampened waveform (air bubbles, clot, kink, loose connection), catheter whip, over-shoot",
      "Square wave test (fast flush test): assess dynamic response; optimal shows 1-2 oscillations before return to baseline",
      "Assess arterial line insertion site every shift: circulation (pulse check distal), color, temperature, sensation",
      "Perform Allen test before radial arterial line insertion (confirm dual blood supply to hand)",
      "Maintain continuous flush system at 300 mmHg; change tubing and flush per protocol (typically every 96 hours)",
      "NEVER infuse medications through arterial line (causes distal ischemia and necrosis)",
      "Monitor for PA catheter complications: balloon rupture (blood in syringe during inflation), PA rupture (hemoptysis), arrhythmias during insertion/positioning",
      "Correlate hemodynamic data with clinical assessment (hemodynamic numbers must match clinical picture)"
    ],
    signs: {
      left: [
        "CVP 2-8 mmHg = adequate right heart preload",
        "PAWP 8-12 mmHg = adequate left heart preload",
        "CI 2.5-4.0 L/min/m2 = normal cardiac output",
        "SVR 800-1200 dyn-s-cm-5 = normal afterload",
        "SvO2 60-80% = adequate oxygen delivery",
        "MAP >65 mmHg = adequate perfusion pressure"
      ],
      right: [
        "High PAWP + Low CO + High SVR = Cardiogenic shock",
        "Low CVP + Low CO + High SVR = Hypovolemic shock",
        "Low SVR + High CO + Low-normal CVP = Distributive shock (early)",
        "High CVP + Low CO + Equalized diastolic pressures = Cardiac tamponade",
        "SvO2 <60% = Inadequate O2 delivery or increased extraction",
        "Dampened waveform = troubleshoot: air, clot, kink, loose connection"
      ]
    },
    medications: [
      {
        name: "Norepinephrine",
        type: "Vasopressor (increases SVR/afterload)",
        action: "Alpha-1 vasoconstriction increases SVR; used when hemodynamic monitoring shows LOW SVR with adequate preload (distributive shock pattern)",
        sideEffects: "Peripheral ischemia, arrhythmias, excessive afterload increase",
        contra: "High SVR states (would worsen afterload and decrease CO)",
        pearl: "Monitor SVR response to titration; if SVR normalizes but CO remains low, consider adding inotrope (dobutamine)"
      },
      {
        name: "Dobutamine",
        type: "Inotrope (increases contractility/CO)",
        action: "Beta-1 agonist increases myocardial contractility and CO; mild beta-2 vasodilation may reduce afterload; used when hemodynamic monitoring shows low CO with adequate preload",
        sideEffects: "Tachycardia, arrhythmias, hypotension (beta-2 vasodilation), increased myocardial oxygen demand",
        contra: "Hypovolemia (preload must be adequate first), HOCM (dynamic outflow obstruction)",
        pearl: "Start at 2-5 mcg/kg/min, titrate to CI >2.2-2.5; monitor heart rate (dose-limiting side effect); increases myocardial O2 demand unlike milrinone"
      },
      {
        name: "Milrinone",
        type: "Phosphodiesterase-3 Inhibitor (Inodilator)",
        action: "Increases contractility AND causes vasodilation (reduces afterload); useful when both low CO and high SVR present; works independently of beta receptors",
        sideEffects: "Hypotension (vasodilation), arrhythmias, thrombocytopenia",
        contra: "Severe aortic or pulmonic stenosis, hypotension",
        pearl: "Preferred over dobutamine in patients on beta-blockers (bypasses beta receptors); 'inodilator' = inotropy + vasodilation; monitor platelets; may cause significant hypotension"
      }
    ],
    pearls: [
      "Phlebostatic axis = 4th ICS at mid-axillary line; ALWAYS level the transducer here; incorrect leveling causes inaccurate readings",
      "Read ALL hemodynamic pressures at END-EXPIRATION to eliminate the effects of intrathoracic pressure on intravascular measurements",
      "Hemodynamic shock profiles to memorize: Cardiogenic = high PAWP, low CO, high SVR; Hypovolemic = low CVP, low CO, high SVR; Distributive = low SVR, high CO (early), low-normal CVP; Obstructive = high CVP, low CO",
      "MAP = [(2 x Diastolic) + Systolic] / 3; target MAP >65 mmHg for adequate organ perfusion",
      "Never leave PA catheter balloon inflated: risk of PA rupture (fatal hemorrhage); inflate only briefly for wedge readings, then immediately deflate",
      "Allen test before radial arterial line: compress both radial and ulnar arteries, release ulnar, hand should reperfuse in <7 seconds confirming dual supply",
      "Dampened arterial waveform: check for air bubbles (aspirate and flush), clot at catheter tip, kink in tubing, or loose connection; perform square wave test"
    ],
    quiz: [
      {
        question: "A patient has CVP 16 mmHg, PAWP 24 mmHg, CI 1.6 L/min/m2, and SVR 2,400 dyn-s-cm-5. Which type of shock do these values indicate?",
        options: ["Hypovolemic shock", "Cardiogenic shock", "Septic shock", "Neurogenic shock"],
        correct: 1,
        rationale: "Elevated CVP (>8) and PAWP (>12) indicate fluid backing up from pump failure. Low CI (<2.5) indicates inadequate cardiac output. High SVR (>1200) indicates compensatory vasoconstriction. This classic profile = cardiogenic shock (the heart is failing as a pump)."
      },
      {
        question: "The nurse obtains a dampened arterial waveform. The square wave test shows a slow return to baseline with no oscillations. What should the nurse do FIRST?",
        options: [
          "Notify the provider that the arterial line needs replacement",
          "Assess the system for air bubbles, clots, kinks, or loose connections and perform troubleshooting",
          "Document the reading as obtained",
          "Increase the flush bag pressure to 400 mmHg"
        ],
        correct: 1,
        rationale: "A dampened waveform with an over-damped square wave response (slow return, no oscillations) indicates a system problem: air bubbles, partial clot, kinked tubing, or loose connection. The nurse should systematically troubleshoot the system before relying on the readings or calling for line replacement."
      },
      {
        question: "At what anatomical landmark should the hemodynamic transducer be leveled?",
        options: [
          "Sternal notch",
          "Phlebostatic axis: 4th intercostal space at mid-axillary line",
          "Xiphoid process",
          "2nd intercostal space at midclavicular line"
        ],
        correct: 1,
        rationale: "The phlebostatic axis (4th ICS at mid-axillary line) approximates the level of the right atrium. Leveling the transducer here ensures accurate pressure readings. If leveled too high, readings will be falsely low; if too low, readings will be falsely high."
      }
    ]
  }
};
