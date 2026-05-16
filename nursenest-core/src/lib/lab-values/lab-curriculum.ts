/**
 * Lab Values Mastery — Canonical A-to-Z Curriculum
 *
 * Educational content only. This file teaches interpretation, clinical reasoning,
 * common traps, and retention questions. It is not a treatment protocol.
 */

export type LabLessonLevel = "foundation" | "core" | "advanced" | "clinical" | "mastery";

export type LabPracticeItem = {
  stem: string;
  choices: readonly [string, string, string, string];
  correct: 0 | 1 | 2 | 3;
  rationale: string;
  trapGuarded: string;
};

export type LabLesson = {
  id: string;
  slug: string;
  number: number;
  title: string;
  subtitle: string;
  level: LabLessonLevel;
  estimatedMinutes: number;
  bodySystem: string;
  teachFromZero: string;
  whatItMeasures: string;
  normalRanges: readonly { population: string; range: string; unit: string; note: string }[];
  highMeaning: readonly string[];
  lowMeaning: readonly string[];
  commonCauses: readonly string[];
  rareButImportantCauses: readonly string[];
  dangerSignals: readonly string[];
  clinicianPriorities: readonly string[];
  interpretationFramework: readonly string[];
  commonTraps: readonly string[];
  miniCase: {
    presentation: string;
    labs: string;
    question: string;
    reasoning: string;
    safeNextSteps: readonly string[];
  };
  practiceItems: readonly LabPracticeItem[];
};

const q = (
  stem: string,
  choices: readonly [string, string, string, string],
  correct: 0 | 1 | 2 | 3,
  rationale: string,
  trapGuarded: string,
): LabPracticeItem => ({ stem, choices, correct, rationale, trapGuarded });

export const LAB_VALUES_CURRICULUM: readonly LabLesson[] = [
  {
    id: "lab-interpretation-foundations",
    slug: "lab-interpretation-foundations",
    number: 1,
    title: "How to Interpret Labs From Zero",
    subtitle: "Trends, reference ranges, specimen quality, critical values, and clinical correlation",
    level: "foundation",
    estimatedMinutes: 30,
    bodySystem: "Foundations",
    teachFromZero:
      "A lab result is a measured clue, not a diagnosis. New clinicians should ask: what does the value measure, is it truly abnormal for this patient, is it new or chronic, could the specimen be inaccurate, and does the patient assessment match the number? A safe interpretation uses the result, the trend, the baseline, medications, fluids, timing, and the bedside assessment together.",
    whatItMeasures:
      "This lesson teaches a universal framework for interpreting any lab value before moving into individual labs.",
    normalRanges: [
      { population: "Most adult labs", range: "Institution-specific", unit: "varies", note: "Always compare with the local reference interval and patient baseline." },
    ],
    highMeaning: ["A high value may reflect overproduction, impaired clearance, concentration, cell injury, medication effect, or specimen artifact."],
    lowMeaning: ["A low value may reflect loss, dilution, underproduction, consumption, impaired absorption, or specimen artifact."],
    commonCauses: ["dehydration or dilution", "infection or inflammation", "bleeding", "renal impairment", "medication effect", "post-operative stress"],
    rareButImportantCauses: ["specimen hemolysis", "tube contamination", "tumour lysis", "adrenal crisis", "TTP/HUS", "massive transfusion effect"],
    dangerSignals: ["Any critical value", "Any rapid change from baseline", "Abnormal labs with unstable vital signs, altered mental status, chest pain, syncope, seizure, active bleeding, oliguria, or severe dyspnea"],
    clinicianPriorities: ["Assess the patient first", "Check trend and baseline", "Verify specimen quality and timing", "Escalate critical values using local policy", "Document communication and reassessment"],
    interpretationFramework: ["Identify lab and unit", "Compare with reference range and baseline", "Decide acute versus chronic", "Check clinical match", "Check artifact or collection error", "Escalate based on patient risk"],
    commonTraps: ["Treating the number instead of the patient", "Ignoring units", "Missing a dangerous trend because the value is barely normal", "Forgetting line draws can be contaminated by IV fluid"],
    miniCase: {
      presentation: "A stable patient has an unexpected abnormal electrolyte result after a difficult blood draw.",
      labs: "The result is flagged critical and the specimen comment mentions hemolysis.",
      question: "What thinking process should a learner use?",
      reasoning: "The result could be real or artifact. The safe response is to assess the patient, verify the specimen issue, escalate according to policy, and repeat the lab when clinically appropriate rather than ignoring it or treating blindly.",
      safeNextSteps: ["Assess symptoms and vital signs", "Review specimen comments", "Notify using local critical-result policy", "Repeat/confirm if ordered", "Monitor for clinical change"],
    },
    practiceItems: [
      q("Which question best prevents unsafe lab interpretation?", ["Is the value highlighted?", "Does the lab match the patient and trend?", "Is the value outside a textbook range?", "Can it be corrected with one medication?"], 1, "The safest interpretation connects value, trend, baseline, specimen quality, and bedside assessment.", "Reacting to flags without reasoning"),
      q("A critical lab is phoned to the unit. The safest general response is:", ["Wait until rounds", "Document only", "Use closed-loop communication and follow local escalation policy", "Tell the family first"], 2, "Critical results require closed-loop communication and appropriate escalation according to policy.", "Passive documentation without escalation"),
      q("A lab drawn near an active IV may be inaccurate because:", ["Venous blood is never accurate", "IV fluid can dilute or contaminate the sample", "Only arterial labs are valid", "The tube colour changes the diagnosis"], 1, "Infusing fluid can dilute or contaminate specimens and distort results.", "Missing pre-analytical error"),
    ],
  },
  {
    id: "hemoglobin-hematocrit",
    slug: "hemoglobin-hematocrit",
    number: 2,
    title: "Hemoglobin and Hematocrit",
    subtitle: "Oxygen-carrying capacity, anemia patterns, bleeding, dilution, and transfusion reasoning",
    level: "core",
    estimatedMinutes: 35,
    bodySystem: "Hematology",
    teachFromZero:
      "Hemoglobin is the oxygen-carrying protein inside red blood cells. Hematocrit is the proportion of blood volume made of red cells. A learner can imagine hemoglobin as oxygen delivery trucks and cardiac output as how fast the trucks move. Oxygen saturation can be normal while total oxygen delivery is poor if hemoglobin is very low. A falling hemoglobin after surgery or trauma should trigger bleeding assessment; chronic low hemoglobin requires pattern recognition such as iron deficiency, chronic kidney disease, inflammation, marrow disease, or hemolysis.",
    whatItMeasures: "Hemoglobin measures oxygen-carrying protein concentration; hematocrit estimates red-cell concentration in whole blood.",
    normalRanges: [
      { population: "Adult female hemoglobin", range: "120–160", unit: "g/L", note: "Baseline varies with pregnancy, chronic disease, and lab." },
      { population: "Adult male hemoglobin", range: "135–175", unit: "g/L", note: "Baseline varies with age, altitude, smoking, and disease." },
      { population: "Hematocrit", range: "0.36–0.50", unit: "L/L", note: "Approximate adult range; interpret with hydration status." },
    ],
    highMeaning: ["Hemoconcentration", "Chronic hypoxemia", "Polycythemia pattern", "Excess erythropoietin or androgen effect"],
    lowMeaning: ["Reduced oxygen-carrying capacity", "Blood loss", "Decreased production", "Hemolysis", "Dilution after fluids"],
    commonCauses: ["iron deficiency", "GI blood loss", "post-operative blood loss", "chronic kidney disease", "anemia of inflammation", "heavy menstrual bleeding"],
    rareButImportantCauses: ["hemolytic transfusion reaction", "TTP/HUS", "aplastic anemia", "acute leukemia", "mechanical valve hemolysis", "paroxysmal nocturnal hemoglobinuria"],
    dangerSignals: ["Rapid fall from baseline", "Low hemoglobin with dyspnea, chest pain, syncope, ischemic changes, hypotension, tachycardia, active bleeding, or poor perfusion"],
    clinicianPriorities: ["Assess for bleeding", "Assess oxygen delivery and perfusion", "Trend against baseline", "Review fluids because dilution can change results", "Prepare ordered blood-bank work if transfusion is being considered"],
    interpretationFramework: ["Acute drop plus instability suggests bleeding until proven otherwise", "Low MCV points toward iron deficiency or chronic blood loss", "High MCV suggests B12, folate, liver, alcohol, or medication patterns", "Hemolysis pattern requires bilirubin, LDH, reticulocytes, smear context", "High hemoglobin with dehydration signs suggests concentration"],
    commonTraps: ["Thinking normal SpO2 proves oxygen delivery is adequate", "Missing occult GI bleeding", "Assuming all anemia needs transfusion", "Ignoring symptoms in cardiac patients"],
    miniCase: {
      presentation: "A post-operative patient becomes pale and dizzy when sitting up.",
      labs: "Hemoglobin has fallen substantially compared with yesterday and heart rate is rising.",
      question: "What problem should the learner consider first?",
      reasoning: "A rapid hemoglobin drop with symptoms and rising heart rate after surgery is concerning for acute blood loss or hemodilution that requires prompt assessment and escalation.",
      safeNextSteps: ["Assess wound, drains, stool, urine, and vital signs", "Escalate concern promptly", "Trend hemoglobin as ordered", "Prepare ordered blood-bank testing", "Increase reassessment frequency"],
    },
    practiceItems: [
      q("A patient has normal SpO2 but very low hemoglobin and chest pain. The learner should understand that:", ["Oxygen delivery may still be inadequate", "Pulse oximetry proves delivery is normal", "Chest pain cannot relate to anemia", "Hematocrit matters but hemoglobin does not"], 0, "SpO2 measures saturation, not total oxygen-carrying capacity.", "Equating saturation with oxygen delivery"),
      q("A sudden post-operative hemoglobin drop most urgently requires:", ["Only dietary teaching", "Assessment for bleeding, dilution, and instability", "No action if SpO2 is normal", "Immediate diagnosis of iron deficiency"], 1, "Acute drops must be correlated with bleeding signs, fluids, and vital signs.", "Treating acute anemia like chronic anemia"),
      q("Which finding makes anemia more concerning?", ["Stable baseline", "Mild chronic fatigue only", "Tachycardia, hypotension, and black stool", "Normal appetite"], 2, "Melena with instability suggests active blood loss and impaired perfusion.", "Ignoring clinical instability"),
    ],
  },
  {
    id: "potassium",
    slug: "potassium",
    number: 3,
    title: "Potassium",
    subtitle: "Cardiac excitability, high/low potassium patterns, ECG clues, and replacement safety concepts",
    level: "core",
    estimatedMinutes: 40,
    bodySystem: "Electrolytes / Cardiac",
    teachFromZero:
      "Potassium is central to electrical stability in nerves and cardiac muscle. Most potassium lives inside cells, so a small blood change can represent a large physiologic problem. High potassium can destabilize cardiac conduction; low potassium can promote ectopy, weakness, ileus, and medication toxicity. New clinicians must connect potassium to kidney function, acid-base status, glucose/insulin shifts, tissue breakdown, medications, and ECG findings.",
    whatItMeasures: "Serum extracellular potassium concentration, which is only a small fraction of total body potassium.",
    normalRanges: [{ population: "Adult potassium", range: "3.5–5.0", unit: "mmol/L", note: "Some cardiac/ICU patients have narrower ordered targets." }],
    highMeaning: ["Reduced renal excretion", "Shift out of cells", "Tissue breakdown", "Medication effect", "Specimen hemolysis artifact"],
    lowMeaning: ["GI loss", "Renal loss", "Shift into cells", "Low intake", "Medication effect", "Associated magnesium deficiency"],
    commonCauses: ["AKI or CKD", "diuretics", "vomiting or diarrhea", "DKA and its treatment", "ACE-I/ARB or potassium-sparing diuretics", "beta-agonist or insulin shift"],
    rareButImportantCauses: ["tumour lysis", "rhabdomyolysis", "periodic paralysis", "adrenal crisis", "pseudohyperkalemia", "digoxin toxicity risk with hypokalemia"],
    dangerSignals: ["Markedly high or low potassium", "Any potassium abnormality with ECG changes, syncope, palpitations, weakness, renal failure, or acid-base disorder"],
    clinicianPriorities: ["Assess rhythm and symptoms", "Verify hemolysis if the result is unexpected", "Review kidney function and urine output", "Review medications", "Use local policy for monitoring, replacement, or escalation", "Never treat potassium as an isolated number"],
    interpretationFramework: ["High potassium: real or artifact", "Check ECG and symptoms", "Check kidney function", "Check acidosis, glucose, and tissue breakdown", "Low potassium: losses versus shifts", "Consider magnesium when potassium remains low"],
    commonTraps: ["Ignoring specimen hemolysis but also ignoring true hyperkalemia", "Forgetting kidney function before replacement", "Missing magnesium relationship", "Assuming the patient must look unstable before rhythm risk exists"],
    miniCase: {
      presentation: "A patient with kidney disease reports weakness after missed renal therapy.",
      labs: "Potassium is markedly elevated and ECG changes are reported.",
      question: "What concept matters most?",
      reasoning: "Potassium abnormalities with ECG changes are high-risk because cardiac conduction can deteriorate quickly. The learner should prioritize assessment, monitoring, urgent communication, and local emergency pathway use.",
      safeNextSteps: ["Assess symptoms and vital signs", "Ensure rhythm monitoring as appropriate", "Escalate promptly", "Review renal function and medication list", "Prepare for ordered interventions and repeat testing"],
    },
    practiceItems: [
      q("Why is potassium especially high-risk?", ["It only affects bones", "It affects cardiac electrical stability", "It only changes oxygen saturation", "It only measures hydration"], 1, "Potassium strongly affects cardiac conduction and muscle function.", "Missing cardiac risk"),
      q("Unexpected high potassium with a hemolyzed sample should lead to:", ["Ignoring the value completely", "Clinical assessment and confirmation according to policy", "Giving dietary teaching only", "Assuming sodium is low"], 1, "Hemolysis can falsely elevate potassium, but the patient still needs safe assessment and confirmation.", "Overcorrecting for artifact"),
      q("Recurrent low potassium may be difficult to correct when which value is also low?", ["Magnesium", "D-dimer", "BNP", "Platelets"], 0, "Low magnesium can promote potassium wasting.", "Missing magnesium-potassium relationship"),
    ],
  },
  {
    id: "abg-vbg-acid-base",
    slug: "abg-vbg-acid-base",
    number: 4,
    title: "ABG/VBG and Acid–Base Interpretation",
    subtitle: "pH, CO2, bicarbonate, oxygenation, compensation, and mixed disorders",
    level: "clinical",
    estimatedMinutes: 45,
    bodySystem: "Respiratory / Metabolic",
    teachFromZero:
      "An ABG helps answer two different questions: is the blood too acidic or alkaline, and is arterial oxygenation adequate? pH tells acidemia or alkalemia. CO2 is the respiratory acid: high CO2 pushes pH down and low CO2 pushes pH up. Bicarbonate is the metabolic buffer: low bicarbonate points to metabolic acidosis and high bicarbonate points to metabolic alkalosis or compensation. Compensation is the body's attempt to move pH back toward normal, not a second disease by itself. Mixed disorders occur when the numbers do not fit a single primary pattern.",
    whatItMeasures: "Arterial or venous pH, carbon dioxide, bicarbonate/base excess, and arterial oxygenation when arterial blood is used.",
    normalRanges: [
      { population: "pH", range: "7.35–7.45", unit: "", note: "Below is acidemia; above is alkalemia." },
      { population: "PaCO2", range: "35–45", unit: "mmHg", note: "Respiratory component." },
      { population: "HCO3", range: "22–26", unit: "mmol/L", note: "Metabolic component." },
      { population: "PaO2", range: "80–100", unit: "mmHg", note: "Depends on age and inspired oxygen." },
    ],
    highMeaning: ["High CO2 suggests hypoventilation", "High bicarbonate suggests metabolic alkalosis or compensation", "High pH indicates alkalemia"],
    lowMeaning: ["Low CO2 suggests hyperventilation", "Low bicarbonate suggests metabolic acidosis", "Low pH indicates acidemia", "Low PaO2 indicates hypoxemia"],
    commonCauses: ["COPD exacerbation", "sedation-related hypoventilation", "sepsis or shock", "DKA", "renal failure", "vomiting or gastric suction", "pain or anxiety hyperventilation"],
    rareButImportantCauses: ["toxic alcohol ingestion", "salicylate toxicity", "malignant hyperthermia", "cyanide toxicity", "mitochondrial toxicity", "massive PE"],
    dangerSignals: ["Severe pH abnormality", "Rising CO2 with declining mental status", "Low oxygenation despite support", "Acid-base abnormality with shock, DKA, renal failure, or suspected toxin"],
    clinicianPriorities: ["Assess airway and work of breathing", "Correlate with pulse oximetry and mental status", "Review ventilator or oxygen settings", "Trend repeat gases after interventions", "Escalate severe or worsening abnormalities"],
    interpretationFramework: ["Step 1: Is pH acid or alkaline?", "Step 2: Does CO2 explain it?", "Step 3: Does bicarbonate explain it?", "Step 4: Decide primary disorder", "Step 5: Decide whether compensation is present", "Step 6: Look for mixed disorder", "Step 7: Match to the patient"],
    commonTraps: ["Using oxygen saturation alone to judge ventilation", "Missing chronic compensation", "Calling every low CO2 anxiety", "Ignoring mixed disorders"],
    miniCase: {
      presentation: "A patient with suspected DKA is breathing deeply and appears dehydrated.",
      labs: "pH is low, bicarbonate is low, CO2 is low, glucose and ketones are elevated.",
      question: "What is the primary disorder?",
      reasoning: "Low pH plus low bicarbonate indicates metabolic acidosis. Low CO2 is respiratory compensation through deep breathing.",
      safeNextSteps: ["Escalate according to DKA pathway", "Monitor fluid status", "Trend glucose/electrolytes/gases", "Assess mental status", "Watch potassium trend"],
    },
    practiceItems: [
      q("Low pH with high CO2 most directly indicates:", ["Respiratory acidosis", "Respiratory alkalosis", "Metabolic alkalosis", "Normal compensation only"], 0, "CO2 is respiratory acid; high CO2 lowers pH.", "Confusing CO2 direction"),
      q("Deep rapid breathing in metabolic acidosis is often:", ["Compensation", "Always panic", "A platelet problem", "A sign oxygenation is normal"], 0, "The body lowers CO2 to compensate for metabolic acidosis.", "Missing compensation"),
      q("A VBG is least useful for precise assessment of:", ["pH trend", "Bicarbonate trend", "Arterial oxygenation", "Screening acid-base status"], 2, "Venous blood does not accurately measure arterial oxygenation.", "Using venous oxygen values incorrectly"),
    ],
  },
];

export const LAB_VALUES_CURRICULUM_BY_SLUG = new Map(
  LAB_VALUES_CURRICULUM.map((lesson) => [lesson.slug, lesson] as const),
);

export function getLabLessonBySlug(slug: string): LabLesson | undefined {
  return LAB_VALUES_CURRICULUM_BY_SLUG.get(slug);
}

export const LAB_VALUES_CURRICULUM_METADATA = {
  totalLessons: LAB_VALUES_CURRICULUM.length,
  minimumPracticeItemsPerLesson: 3,
  coveredDomains: Array.from(new Set(LAB_VALUES_CURRICULUM.map((lesson) => lesson.bodySystem))),
} as const;
