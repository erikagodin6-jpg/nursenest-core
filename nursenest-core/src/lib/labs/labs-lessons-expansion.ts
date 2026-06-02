import type { LabLessonDefinition } from "@/lib/labs/labs-engine";

/**
 * Additional electrolyte + NP-depth lessons merged into the Labs catalog.
 * Keeps flagship potassium/renal/etc. in labs-engine.ts; expansion grows IA per track.
 */
export const LABS_EXPANSION_LESSONS: readonly LabLessonDefinition[] = [
  {
    slug: "sodium-fluid-osmolality-patterns",
    category: "electrolytes",
    title: "Sodium and fluid balance: osmolality, perfusion, and safe correction",
    shortTitle: "Sodium",
    description:
      "Interpret hyponatremia and hypernatremia with fluid status, neurologic risk, and correction pacing — not isolated sodium memorization.",
    freePreviewBlurb:
      "Sodium problems are usually fluid problems. The lab value matters less than whether the brain is at risk and how fast you can safely correct it.",
    normalRange: "135-145 mmol/L (institution-specific)",
    physiology: [
      "Sodium sets extracellular tonicity; water follows sodium gradients across compartments.",
      "ADH and thirst regulate water balance; perfusion and volume status drive ADH even when sodium looks normal.",
      "Acute shifts in tonicity threaten neurologic stability faster than chronic adaptation.",
    ],
    causesHigh: [
      "Water deficit from poor intake, diabetes insipidus, or excessive insensible losses",
      "Hypertonic fluids or sodium-retaining states",
      "Hyperglycemia can lower measured sodium until glucose is corrected",
    ],
    causesLow: [
      "SIADH, heart failure, cirrhosis, renal failure with water retention",
      "GI losses replaced with hypotonic fluids",
      "Diuretics, adrenal insufficiency, and post-operative fluid shifts",
    ],
    signsSymptoms: [
      "Altered mental status, seizures, headache, nausea in acute hyponatremia",
      "Thirst, confusion, and hyperreflexia in hypernatremia",
      "Volume clues: edema, hypotension, dry mucosa, weight trends",
    ],
    priorityThresholds: [
      {
        label: "Symptomatic hyponatremia",
        threshold: "Acute neurologic change with low sodium",
        whyItMatters: "Cerebral edema risk requires urgent escalation and controlled correction — not rapid bolus fixes.",
      },
      {
        label: "Severe hypernatremia",
        threshold: "Na > 160 mmol/L or rapid rise with altered mental status",
        whyItMatters: "Free-water deficit and neurologic injury drive disposition and correction rate.",
      },
    ],
    nursingInterventions: [
      "Assess neurologic status, seizure precautions, and volume status before choosing fluids.",
      "Trend sodium slowly; avoid overcorrection in chronic hyponatremia.",
      "Review diuretics, fluids, ADH-related medications, and intake/output.",
      "Escalate when mental status changes or sodium shifts faster than expected.",
    ],
    treatmentAlgorithm: [
      { step: "1", action: "Determine acute vs chronic and whether symptoms are present.", why: "Correction limits depend on duration and neurologic risk." },
      { step: "2", action: "Classify volume status: hypovolemic, euvolemic, or hypervolemic.", why: "The same low sodium can need different fluid strategies." },
      { step: "3", action: "Treat the mechanism (hold diuretics, restrict fluids, replace deficits) with provider orders.", why: "Isolated sodium replacement without mechanism review is unsafe." },
      { step: "4", action: "Monitor neurologic status and repeat sodium on a controlled interval.", why: "Overcorrection causes osmotic demyelination risk." },
    ],
    medicationsAffecting: ["Diuretics", "SSRIs and other SIADH triggers", "Hypertonic saline (only with close monitoring)", "Desmopressin"],
    labConditionRelationships: ["Heart failure and cirrhosis often present with dilutional hyponatremia.", "DKA correction changes sodium and potassium together."],
    clinicalPearls: [
      "Correct the glucose before interpreting sodium in hyperglycemia.",
      "Chronic hyponatremia tolerates slower correction; acute symptomatic cases need protocol-driven care.",
    ],
    clientEducation: ["Teach daily weights, fluid limits, and when to report confusion or seizures."],
    nclexTraps: [
      "Giving free water bolus to every low sodium without assessing volume and chronicity",
      "Ignoring neurologic symptoms because the sodium is only mildly low",
    ],
    trendInterpretation: [
      "Rising sodium with falling mental status may mean correction is too fast.",
      "Stable low sodium with worsening edema suggests ongoing water retention, not sodium deficit alone.",
    ],
    patternRecognition: [
      {
        title: "SIADH pattern",
        pattern: ["Low sodium", "Euvolemic exam", "Concentrated urine"],
        interpretation: "Water retention with inappropriate ADH activity.",
        firstAction: "Fluid restriction and sodium trend per protocol; escalate for neurologic change.",
      },
    ],
    priorityDecisionMaking: [
      "Neurologic symptoms outrank the absolute sodium number.",
      "Volume status determines whether fluids help or harm.",
    ],
    microScenarios: [
      {
        title: "Post-op confusion",
        stem: "A post-operative patient becomes confused with Na 128 and euvolemic exam.",
        findings: ["Urine osmolality high", "No edema", "Recent opioid and IV fluids"],
        question: "What is the priority nursing interpretation?",
        answer: "Suspect dilutional hyponatremia with neurologic risk and escalate for protocol-driven correction.",
        rationale: "Mental status change makes this urgent even when the sodium is not critically low.",
      },
      {
        title: "Hypernatremia dehydration",
        stem: "An older adult with poor intake has Na 154 and dry mucosa.",
        findings: ["Weight down", "Urine concentrated", "Altered attention"],
        question: "What is the first action mindset?",
        answer: "Treat free-water deficit slowly with close neurologic monitoring.",
        rationale: "Hypernatremia reflects water loss; rapid correction can also injure the brain.",
      },
    ],
    tierFocus: {
      rn: ["Link sodium to fluid volume, neurologic status, and correction limits.", "Prioritize symptomatic hyponatremia over memorizing formulas."],
      pn: ["Report mental status changes early and monitor intake/output trends.", "Recognize when a low sodium needs urgent escalation."],
      np: ["Differentiate SIADH, adrenal insufficiency, and hypovolemic hyponatremia with diagnostic planning.", "Set correction rates and disposition with complication surveillance."],
      allied: ["Laboratory roles emphasize correct specimen handling; bedside roles focus on neurologic red flags and fluid documentation."],
    },
    supportedTracks: ["rn", "pn", "np", "allied"],
    practiceQuestionTopic: "sodium",
  },
  {
    slug: "magnesium-refractory-electrolytes",
    category: "electrolytes",
    title: "Magnesium: refractory potassium, rhythm risk, and replacement safety",
    shortTitle: "Magnesium",
    description:
      "Treat magnesium as the electrolyte that unlocks potassium correction and stabilizes cardiac excitability.",
    freePreviewBlurb:
      "Persistent hypokalemia often means magnesium is still low. Magnesium also sits at the center of dysrhythmia risk when calcium and potassium shift together.",
    normalRange: "1.7-2.2 mg/dL (0.70-0.90 mmol/L; institution-specific)",
    physiology: [
      "Magnesium is a cofactor for ATP-dependent potassium uptake and neuromuscular stability.",
      "Low magnesium increases potassium wasting and can perpetuate dysrhythmias.",
      "Serum magnesium may not reflect total body depletion.",
    ],
    causesHigh: ["Renal failure", "Excess supplementation", "Lithium"],
    causesLow: [
      "Alcohol use disorder, malnutrition, GI losses",
      "Loop and thiazide diuretics",
      "DKA treatment and refeeding",
    ],
    signsSymptoms: [
      "Muscle cramps, tremor, weakness",
      "Torsades risk with QT prolongation",
      "Refractory hypokalemia despite replacement",
    ],
    priorityThresholds: [
      {
        label: "Symptomatic hypomagnesemia",
        threshold: "Cramping, weakness, or arrhythmia with low Mg",
        whyItMatters: "Rhythm instability can precede obvious potassium correction failure.",
      },
      {
        label: "Torsades context",
        threshold: "QT prolongation with electrolyte instability",
        whyItMatters: "Magnesium is often first-line stabilization while causes are corrected.",
      },
    ],
    nursingInterventions: [
      "Check magnesium when potassium will not stay corrected.",
      "Monitor deep tendon reflexes and renal function during IV replacement.",
      "Coordinate telemetry when replacing magnesium in cardiac patients.",
    ],
    treatmentAlgorithm: [
      { step: "1", action: "Identify whether hypomagnesemia is driving refractory hypoK or rhythm risk.", why: "Replacement order changes urgency." },
      { step: "2", action: "Replace per protocol with renal dosing awareness.", why: "Excess IV magnesium depresses reflexes and respiration." },
      { step: "3", action: "Replete potassium and calcium as indicated after magnesium strategy starts.", why: "Electrolytes interact; fixing one in isolation often fails." },
    ],
    medicationsAffecting: ["PPI long-term use", "Diuretics", "Aminoglycosides", "Chemotherapy"],
    labConditionRelationships: ["Alcohol withdrawal and malnutrition clusters.", "DKA correction increases magnesium demand."],
    clinicalPearls: ["Always ask about magnesium when potassium keeps dropping after replacement."],
    clientEducation: ["Explain diet sources and adherence when oral replacement is ordered."],
    nclexTraps: ["Chasing potassium alone when magnesium remains low", "Missing QT prolongation on monitor"],
    trendInterpretation: ["Magnesium normalization should precede declaring potassium replacement a success."],
    patternRecognition: [
      {
        title: "Refractory hypoK",
        pattern: ["K remains low", "Mg low", "Ongoing diuretic use"],
        interpretation: "Magnesium depletion perpetuates potassium loss.",
        firstAction: "Escalate magnesium repletion and review diuretic plan.",
      },
    ],
    priorityDecisionMaking: ["Rhythm instability with low magnesium is treat-now.", "Renal function guides replacement rate."],
    microScenarios: [
      {
        title: "Post-diuretic cramps",
        stem: "A heart failure patient on furosemide has K 3.0 despite oral potassium.",
        findings: ["Mg 1.3", "QT 480 ms", "Muscle cramps"],
        question: "What should happen before more potassium alone?",
        answer: "Magnesium repletion with rhythm monitoring.",
        rationale: "Low magnesium perpetuates potassium loss and arrhythmia risk.",
      },
    ],
    tierFocus: {
      rn: ["Pair magnesium with potassium protocols and telemetry."],
      pn: ["Report cramps, QT changes, and persistent low potassium."],
      np: ["Integrate diuretic strategy, renal dosing, and rhythm stabilization."],
      allied: ["Focus on specimen timing and medication lists affecting magnesium."],
    },
    supportedTracks: ["rn", "pn", "np", "allied"],
    practiceQuestionTopic: "magnesium",
  },
  {
    slug: "calcium-ionized-hypocalcemia",
    category: "electrolytes",
    title: "Calcium: ionized values, QT risk, and transfusion-related hypocalcemia",
    shortTitle: "Calcium",
    description:
      "Prioritize ionized calcium for acute decisions, link QT changes to replacement, and recognize citrate and vitamin D interactions.",
    freePreviewBlurb:
      "Total calcium can mislead when albumin is low. Bedside priorities are ionized calcium, neurologic irritability, and QT interval on the monitor.",
    normalRange: "Ionized calcium about 1.12-1.32 mmol/L (institution-specific)",
    physiology: [
      "Ionized calcium drives neuromuscular excitability and cardiac repolarization.",
      "Albumin binds calcium; hypoalbuminemia lowers total calcium without true ionized deficit.",
      "Vitamin D and PTH regulate calcium balance with phosphate and magnesium.",
    ],
    causesHigh: ["Malignancy-related mechanisms", "Hyperparathyroidism", "Excess supplementation"],
    causesLow: [
      "Hypoalbuminemia with normal ionized calcium",
      "Vitamin D deficiency, hypoparathyroidism, pancreatitis",
      "Massive transfusion with citrate toxicity",
    ],
    signsSymptoms: ["Perioral numbness, tetany, Chvostek/Trousseau", "QT prolongation", "Seizures in severe cases"],
    priorityThresholds: [
      {
        label: "Symptomatic hypocalcemia",
        threshold: "Tetany, seizures, or QT prolongation with low ionized calcium",
        whyItMatters: "Neurologic and cardiac excitability require urgent replacement and monitoring.",
      },
    ],
    nursingInterventions: [
      "Prioritize ionized calcium for acute decisions.",
      "Monitor QT and neurologic status during replacement.",
      "Review albumin, magnesium, phosphate, and transfusion volume.",
    ],
    treatmentAlgorithm: [
      { step: "1", action: "Confirm ionized calcium when total calcium is low.", why: "Avoid unnecessary treatment of adjusted totals only." },
      { step: "2", action: "Treat symptomatic hypocalcemia per protocol with cardiac monitoring.", why: "QT changes can precede arrest." },
      { step: "3", action: "Correct magnesium and review citrate load in massive transfusion.", why: "Calcium instability is often multifactorial." },
    ],
    medicationsAffecting: ["Vitamin D", "Bisphosphonates", "Citrate in blood products", "PPIs long-term"],
    labConditionRelationships: ["Post-thyroidectomy hypoparathyroidism.", "Sepsis and critical illness calcium shifts."],
    clinicalPearls: ["Check ionized calcium during massive transfusion protocols."],
    clientEducation: ["Teach tingling, muscle spasm, and when to seek care."],
    nclexTraps: ["Treating total calcium without checking albumin or ionized value", "Ignoring QT prolongation"],
    trendInterpretation: ["Falling ionized calcium during rapid transfusion requires proactive monitoring."],
    patternRecognition: [
      {
        title: "Transfusion-related hypocalcemia",
        pattern: ["Rapid blood product infusion", "Ionized Ca falling", "QT lengthening"],
        interpretation: "Citrate toxicity binding calcium.",
        firstAction: "Escalate per massive transfusion protocol and monitor ionized calcium.",
      },
    ],
    priorityDecisionMaking: ["Symptoms and QT trump the total calcium number.", "Magnesium must be sufficient for calcium therapies to work."],
    microScenarios: [
      {
        title: "Post-transfusion tetany",
        stem: "During MTP activation the patient develops perioral numbness and a prolonged QT.",
        findings: ["Ionized Ca low", "Mg borderline", "Continuing product infusion"],
        question: "What is the priority action mindset?",
        answer: "Treat symptomatic hypocalcemia with protocol-driven calcium and monitor QT.",
        rationale: "Citrate load lowers ionized calcium during rapid transfusion.",
      },
    ],
    tierFocus: {
      rn: ["Use ionized calcium for acute decisions and link to QT monitoring."],
      pn: ["Report numbness, spasms, and monitor changes during transfusion."],
      np: ["Integrate PTH/vitamin D workup and transfusion protocols."],
      allied: ["Lab roles emphasize ionized vs total calcium specimen handling."],
    },
    supportedTracks: ["rn", "pn", "np", "allied"],
    practiceQuestionTopic: "calcium",
  },
  {
    slug: "np-advanced-acid-base-lab-synthesis",
    category: "abgs",
    title: "NP depth: acid-base, ABG, and electrolyte synthesis for complex patients",
    shortTitle: "Acid-base synthesis",
    description:
      "Integrate ABG interpretation with electrolyte shifts, perfusion, ventilation, and renal compensation for advanced practice decision-making.",
    freePreviewBlurb:
      "Advanced practice lab reasoning connects acid-base status, potassium shifts, lactate, and renal compensation in the same clinical story.",
    normalRange: "pH 7.35-7.45; PaCO2 35-45 mmHg; HCO3 22-26 mEq/L (institution-specific)",
    physiology: [
      "Ventilation regulates CO2; kidneys regulate bicarbonate over hours to days.",
      "Acid-base shifts redistribute potassium and affect medication clearance.",
      "Compensation is never complete in acute mixed disorders without time.",
    ],
    causesHigh: ["Respiratory failure", "Metabolic acidosis from sepsis, DKA, or renal failure"],
    causesLow: ["Chronic respiratory alkalosis", "Hyperventilation from pain or anxiety"],
    signsSymptoms: ["Altered mental status", "Kussmaul breathing or hypoventilation", "Hemodynamic instability"],
    priorityThresholds: [
      {
        label: "Life-threatening acidemia",
        threshold: "pH < 7.20 with hemodynamic or neurologic compromise",
        whyItMatters: "Requires simultaneous treatment of perfusion, ventilation, and underlying cause.",
      },
      {
        label: "Ventilatory failure",
        threshold: "Rising PaCO2 with altered mental status",
        whyItMatters: "Airway and ventilation take priority over calculator-based acid-base labeling.",
      },
    ],
    nursingInterventions: [
      "Trend ABG/VBG with lactate, potassium, and renal function together.",
      "Coordinate ventilator changes with provider and respiratory therapy.",
      "Anticipate potassium shifts during correction of acid-base disorders.",
    ],
    treatmentAlgorithm: [
      { step: "1", action: "Identify primary respiratory vs metabolic disorder and acute vs chronic context.", why: "Compensation expectations change management." },
      { step: "2", action: "Treat perfusion and ventilation threats before fine-tuning numbers.", why: "Patients die from the cause, not the label." },
      { step: "3", action: "Plan electrolyte monitoring during bicarbonate or insulin therapy.", why: "Shifts are predictable and dangerous if ignored." },
    ],
    medicationsAffecting: ["Sodium bicarbonate", "Insulin and DKA protocols", "Diuretics", "Salicylates"],
    labConditionRelationships: ["Sepsis, DKA, COPD exacerbation, and renal failure produce recognizable combined patterns."],
    clinicalPearls: ["When the story and the ABG disagree, repeat the sample and reassess perfusion."],
    clientEducation: ["Explain disease-specific monitoring for chronic respiratory and renal patients."],
    nclexTraps: ["Treating a number without identifying the primary disorder", "Ignoring mixed disorders in shock"],
    trendInterpretation: ["Improving lactate with persistent acidosis suggests ongoing hypoperfusion or compensatory lag."],
    patternRecognition: [
      {
        title: "DKA mixed picture",
        pattern: ["Low pH", "Low bicarbonate", "Hyperglycemia", "Potassium may be high despite total body deficit"],
        interpretation: "Metabolic acidosis with predictable electrolyte shifts during treatment.",
        firstAction: "Follow DKA protocol with hourly electrolytes and cardiac monitoring.",
      },
    ],
    priorityDecisionMaking: ["Perfusion and airway trump calculator exercises.", "Electrolyte shifts are part of the treatment plan, not a side note."],
    microScenarios: [
      {
        title: "Septic shock acidosis",
        stem: "A patient in septic shock has pH 7.18, lactate 6.2, and K 5.6.",
        findings: ["Low MAP on pressors", "Urine output falling", "Creatinine rising"],
        question: "What is the NP-level priority frame?",
        answer: "Treat perfusion and source control while monitoring potassium and planning renal support.",
        rationale: "Acidosis is a marker of severity; hemodynamics and organ perfusion drive outcomes.",
      },
      {
        title: "COPD retention",
        stem: "A COPD patient presents somnolent with pH 7.28 and PaCO2 68.",
        findings: ["RR low", "Accessory muscle fatigue", "On home steroids"],
        question: "What is the primary problem to address first?",
        answer: "Ventilatory failure requiring controlled CO2 correction and airway support.",
        rationale: "This is respiratory acidosis with acute-on-chronic compensation limits.",
      },
    ],
    tierFocus: {
      rn: [],
      pn: [],
      np: [
        "Synthesize ABG, lactate, electrolytes, and renal function for disposition decisions.",
        "Anticipate treatment-induced potassium and calcium shifts during DKA and bicarbonate therapy.",
      ],
      allied: [],
    },
    supportedTracks: ["np"],
    practiceQuestionTopic: "abg",
  },
  {
    slug: "np-critical-care-lab-escalation-panel",
    category: "cardiac",
    title: "NP depth: critical-care lab panel integration and escalation mapping",
    shortTitle: "Critical-care panel",
    description:
      "Map troponin, lactate, BNP, renal function, and coagulation into a single escalation narrative for unstable patients.",
    freePreviewBlurb:
      "Critical-care lab reasoning is timeline integration: injury markers, perfusion, strain, renal clearance, and coagulation in one escalation story.",
    normalRange: "Interpret relative to baseline and serial trends (institution-specific)",
    physiology: [
      "Troponin reflects myocardial injury; timing and delta matter more than one value.",
      "Lactate reflects tissue perfusion and clearance.",
      "BNP supports strain context but does not replace bedside assessment.",
    ],
    causesHigh: ["Ischemia", "Sepsis", "Pulmonary embolism", "Renal failure slowing clearance"],
    causesLow: [],
    signsSymptoms: ["Chest pain, dyspnea, hypotension, oliguria, bleeding"],
    priorityThresholds: [
      {
        label: "Rising troponin with instability",
        threshold: "Positive delta with hypotension, arrhythmia, or ischemic symptoms",
        whyItMatters: "Defines acute coronary syndrome workup urgency and monitoring intensity.",
      },
      {
        label: "Lactate clearance failure",
        threshold: "Lactate rising despite resuscitation",
        whyItMatters: "Signals ongoing hypoperfusion or mitochondrial dysfunction.",
      },
    ],
    nursingInterventions: [
      "Serial troponin and ECG per protocol.",
      "Trend lactate with blood pressure and urine output.",
      "Coordinate anticoagulation labs when heparin or thrombolysis is considered.",
    ],
    treatmentAlgorithm: [
      { step: "1", action: "Stabilize airway, breathing, circulation.", why: "Labs interpret perfusion; they do not replace it." },
      { step: "2", action: "Build a timeline of injury, strain, perfusion, and renal markers.", why: "Pattern integration prevents tunnel vision." },
      { step: "3", action: "Escalate to ICU/interventional pathways when deltas and symptoms align.", why: "Disposition follows trajectory, not one lab." },
    ],
    medicationsAffecting: ["Anticoagulants", "Inotropes", "Nephrotoxins"],
    labConditionRelationships: ["Cardiorenal syndrome links BNP, creatinine, and diuretic response."],
    clinicalPearls: ["A falling BNP does not rule out acute worsening if perfusion is crumbling."],
    clientEducation: ["Explain why serial labs are required during chest pain workups."],
    nclexTraps: ["Ordering troponin without ECG and symptom correlation", "Ignoring lactate trend in sepsis"],
    trendInterpretation: ["Troponin delta with falling blood pressure is an escalation trigger."],
    patternRecognition: [
      {
        title: "Type 2 injury pattern",
        pattern: ["Troponin rise", "Sepsis or anemia", "No classic ischemic chest pain"],
        interpretation: "Demand ischemia or myocardial injury from supply-demand mismatch.",
        firstAction: "Treat perfusion and supply-demand balance while evaluating for primary ACS.",
      },
    ],
    priorityDecisionMaking: ["Integrate labs with hemodynamics.", "Repeat values beat one-off interpretation."],
    microScenarios: [
      {
        title: "Sepsis with troponin rise",
        stem: "A septic patient has rising troponin, lactate 4.8, and MAP 58 on norepinephrine.",
        findings: ["Creatinine rising", "BNP elevated", "Tachycardia"],
        question: "What is the best NP-level integration?",
        answer: "Treat septic shock and perfusion while evaluating for concurrent ACS with serial ECG/troponin.",
        rationale: "Injury markers can rise from demand ischemia; perfusion restoration is still central.",
      },
    ],
    tierFocus: {
      rn: [],
      pn: [],
      np: [
        "Build escalation maps that combine cardiac injury, perfusion, renal function, and anticoagulation labs.",
        "Use deltas and symptoms together for ICU and cardiology consultation thresholds.",
      ],
      allied: [],
    },
    supportedTracks: ["np"],
    practiceQuestionTopic: "cardiac-labs",
  },
];
