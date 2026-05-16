<<<<<<< HEAD
export type HemodynamicsLesson = {
  id: string;
  title: string;
  level: "foundational" | "intermediate" | "advanced" | "mastery";
  summary: string;
  mechanism: string;
  normalRanges: readonly { metric: string; range: string; clinicalMeaning: string }[];
  interpretationGuide: readonly string[];
  abnormalPatterns: readonly { pattern: string; suggests: string; nursingAction: string }[];
  nursingPriorities: readonly string[];
  troubleshooting: readonly { issue: string; clue: string; fix: string }[];
  traps: readonly string[];
  notThisBecause: readonly { lookAlike: string; distinguisher: string }[];
  caseApplication: {
    scenario: string;
    interpretation: string;
    nursingActions: readonly string[];
  };
  practiceItems: readonly {
    stem: string;
    answer: string;
    rationale: string;
  }[];
};

export const HEMODYNAMICS_LESSONS: readonly HemodynamicsLesson[] = [
  {
    id: "hd-introduction-to-hemodynamics",
    title: "Introduction to Hemodynamic Monitoring",
    level: "foundational",
    summary: "Builds the mental model for preload, afterload, contractility, MAP, perfusion, and shock physiology.",
    mechanism: "Hemodynamics describes pressure, flow, resistance, and oxygen delivery. Blood pressure is not perfusion by itself; perfusion depends on cardiac output, vascular tone, intravascular volume, hemoglobin, oxygenation, and microcirculatory flow.",
    normalRanges: [
      { metric: "MAP", range: "Usually ≥65 mmHg in adult critical care targets", clinicalMeaning: "Minimum pressure target commonly used to support organ perfusion; individual targets vary." },
      { metric: "Cardiac output", range: "4-8 L/min", clinicalMeaning: "Total blood flow pumped per minute." },
      { metric: "Cardiac index", range: "2.5-4.0 L/min/m²", clinicalMeaning: "Cardiac output adjusted to body size." },
      { metric: "SVR", range: "800-1200 dynes/sec/cm⁻⁵", clinicalMeaning: "Afterload/systemic vascular tone." },
    ],
    interpretationGuide: [
      "Start with the patient: mentation, urine output, skin, lactate, chest pain, work of breathing.",
      "Separate pressure from flow: a patient can have an acceptable BP with poor cardiac output.",
      "Ask which variable is failing: preload, pump, afterload, oxygen delivery, or obstruction.",
      "Trend values over time rather than reacting to one isolated number.",
    ],
    abnormalPatterns: [
      { pattern: "Low MAP + warm flushed skin", suggests: "Distributive shock physiology", nursingAction: "Escalate sepsis/anaphylaxis/neurogenic assessment, fluids/vasopressors per protocol." },
      { pattern: "Low MAP + cool clammy skin + pulmonary edema", suggests: "Cardiogenic shock", nursingAction: "Avoid blind fluid loading; escalate inotrope/vasopressor and provider assessment." },
      { pattern: "Falling urine output despite normal BP", suggests: "Occult hypoperfusion", nursingAction: "Report trend, assess MAP target, lactate, volume status, and renal perfusion." },
    ],
    nursingPriorities: [
      "Assess patient before interpreting monitor values.",
      "Validate waveform/device accuracy before escalating therapy.",
      "Trend MAP, urine output, mentation, lactate, and extremity perfusion together.",
      "Identify whether the problem is volume, pump, tone, obstruction, or oxygen delivery.",
      "Escalate unstable changes early.",
      "Document context: position, transducer level, vasoactive infusions, rhythm, ventilation status.",
      "Reassess after every intervention.",
    ],
    troubleshooting: [
      { issue: "Unexpected hypotension", clue: "Patient looks well and cuff/A-line disagree", fix: "Recheck cuff size, A-line leveling/zeroing, waveform quality, and limb position." },
      { issue: "False reassurance", clue: "BP acceptable but lactate/urine output worsening", fix: "Treat as perfusion problem, not just pressure problem." },
    ],
    traps: [
      "MAP is not the same as cardiac output.",
      "Normal CVP does not prove adequate preload.",
      "One number never classifies shock alone.",
    ],
    notThisBecause: [
      { lookAlike: "Simple hypotension", distinguisher: "Hemodynamic instability requires perfusion context, not just a low BP number." },
      { lookAlike: "Volume problem only", distinguisher: "Pump failure and vasodilation can also produce low pressure." },
    ],
    caseApplication: {
      scenario: "A septic patient has MAP 58, warm extremities, fever, lactate 4.1, and bounding pulses.",
      interpretation: "Distributive physiology: low vascular tone and maldistributed flow despite hyperdynamic appearance.",
      nursingActions: ["Escalate sepsis pathway", "Confirm cultures/lactate/antibiotics workflow", "Prepare fluids and vasopressor support per protocol", "Trend MAP and urine output"],
    },
    practiceItems: [
      { stem: "A patient has MAP 68 but new confusion and urine output 10 mL/hr. What matters most?", answer: "Possible hypoperfusion despite acceptable MAP.", rationale: "Organ perfusion signs can reveal shock before BP alone appears alarming." },
      { stem: "Which concept best describes SVR?", answer: "Afterload/systemic vascular resistance.", rationale: "SVR reflects vascular tone and resistance against which the ventricle ejects." },
    ],
  },
  {
    id: "hd-arterial-lines",
    title: "Arterial Lines and MAP Interpretation",
    level: "foundational",
    summary: "Teaches A-line setup, waveform morphology, MAP interpretation, damping, leveling, zeroing, and bedside safety.",
    mechanism: "An arterial catheter transduces intra-arterial pressure into an electrical signal. Accurate interpretation requires the transducer to be leveled to the phlebostatic axis and zeroed to atmospheric pressure.",
    normalRanges: [
      { metric: "MAP", range: "Often targeted ≥65 mmHg", clinicalMeaning: "Perfusion pressure target, individualized by condition." },
      { metric: "Arterial waveform", range: "Rapid upstroke, dicrotic notch, smooth downstroke", clinicalMeaning: "Reflects systolic ejection, aortic valve closure, and diastolic runoff." },
    ],
    interpretationGuide: ["Check waveform quality first.", "Compare A-line to cuff when values are unexpected.", "Use MAP for vasoactive titration when ordered.", "Assess limb perfusion and line complications."],
    abnormalPatterns: [
      { pattern: "Overdamped waveform", suggests: "Air bubble, clot, kink, loose connection", nursingAction: "Inspect tubing, flush per policy, check pressure bag, notify if unresolved." },
      { pattern: "Underdamped waveform", suggests: "Excessive resonance", nursingAction: "Suspect falsely high systolic/falsely low diastolic; troubleshoot setup." },
      { pattern: "Flattened waveform", suggests: "Disconnection, occlusion, transducer error", nursingAction: "Assess patient, secure system, troubleshoot immediately." },
    ],
    nursingPriorities: ["Level and zero transducer", "Maintain pressure bag per policy", "Assess waveform before trusting value", "Keep connections secure", "Monitor insertion site", "Assess distal circulation", "Use aseptic technique", "Escalate sudden waveform loss"],
    troubleshooting: [
      { issue: "Overdamping", clue: "Slurred upstroke, absent dicrotic notch", fix: "Check for air/clot/kink and square-wave test per unit policy." },
      { issue: "Transducer too low", clue: "Falsely high pressure", fix: "Level to phlebostatic axis." },
      { issue: "Transducer too high", clue: "Falsely low pressure", fix: "Re-level and re-zero." },
    ],
    traps: ["Treating an artifact number without checking the patient.", "Forgetting transducer height changes pressure readings.", "Using systolic alone instead of MAP for perfusion context."],
    notThisBecause: [
      { lookAlike: "True hypotension", distinguisher: "Bad waveform/cuff mismatch suggests measurement error first." },
      { lookAlike: "Arrhythmia artifact", distinguisher: "A-line artifact relates to pressure system quality; ECG artifact relates to electrical signal." },
    ],
    caseApplication: {
      scenario: "The A-line shows BP 68/38 but the patient is awake, warm, and cuff BP is 112/70. Waveform is flattened.",
      interpretation: "Likely overdamped or malfunctioning arterial line, not true shock until verified.",
      nursingActions: ["Assess patient", "Compare cuff", "Inspect line/tubing", "Level/zero", "Notify provider if waveform cannot be restored"],
    },
    practiceItems: [
      { stem: "A slurred A-line waveform with absent dicrotic notch suggests what?", answer: "Overdamping.", rationale: "Overdamping blunts waveform morphology and can under-read systolic pressure." },
      { stem: "What is the first step before titrating vasopressors to a surprising A-line value?", answer: "Validate waveform accuracy and assess the patient.", rationale: "Device artifact can cause unsafe titration." },
    ],
  },
  {
    id: "hd-cvp-monitoring",
    title: "Central Venous Pressure and Right-Sided Filling",
    level: "intermediate",
    summary: "Teaches CVP physiology, waveform components, limitations, and why CVP is not a simple fluid gauge.",
    mechanism: "CVP estimates right atrial pressure and right-sided filling conditions. It is affected by venous return, right ventricular compliance, intrathoracic pressure, PEEP, tamponade, pulmonary hypertension, and volume status.",
    normalRanges: [{ metric: "CVP", range: "Often 2-6 mmHg or 3-8 cmH₂O depending on unit convention", clinicalMeaning: "Right atrial pressure estimate; interpret with context." }],
    interpretationGuide: ["Trend CVP, do not use a single number alone.", "Correlate with lungs, edema, JVP, urine output, MAP, and shock state.", "Account for ventilation/PEEP and patient positioning.", "Differentiate low preload from poor RV compliance."],
    abnormalPatterns: [
      { pattern: "Low CVP + hypotension + flat neck veins", suggests: "Possible hypovolemia", nursingAction: "Assess bleeding/fluid loss and fluid responsiveness." },
      { pattern: "High CVP + hypotension + muffled signs/obstructive picture", suggests: "Tamponade/obstructive physiology", nursingAction: "Escalate urgently; assess pulsus paradoxus/echo pathway." },
      { pattern: "High CVP + pulmonary hypertension/RV failure", suggests: "Right-sided failure", nursingAction: "Avoid reflex fluids; escalate provider assessment." },
    ],
    nursingPriorities: ["Level/zero correctly", "Trend with full clinical assessment", "Assess respiratory/ventilator effects", "Watch for catheter complications", "Report sudden rises with hypotension", "Document units", "Avoid treating CVP in isolation"],
    troubleshooting: [
      { issue: "False high CVP", clue: "Transducer too low or high PEEP", fix: "Re-level and interpret with ventilator settings." },
      { issue: "No waveform", clue: "Flat tracing", fix: "Check stopcock, tubing, catheter patency per policy." },
    ],
    traps: ["CVP is not a direct blood-volume meter.", "High CVP does not mean give diuretics automatically.", "Low CVP does not always mean give fluids without context."],
    notThisBecause: [
      { lookAlike: "Preload certainty", distinguisher: "CVP is a pressure affected by compliance and intrathoracic pressure." },
      { lookAlike: "Left-sided filling pressure", distinguisher: "CVP reflects right atrial pressure, not PCWP." },
    ],
    caseApplication: {
      scenario: "Ventilated patient with PEEP 12 has CVP 14, MAP 62, cool extremities, and rising lactate.",
      interpretation: "High CVP may reflect intrathoracic pressure/RV strain, not adequate perfusion.",
      nursingActions: ["Report shock signs", "Review ventilator settings", "Assess RV/obstructive causes", "Trend lactate and urine output"],
    },
    practiceItems: [
      { stem: "Why should CVP not be used alone to decide fluids?", answer: "It is pressure, not volume, and is affected by compliance and intrathoracic pressure.", rationale: "CVP interpretation requires context." },
      { stem: "High CVP with hypotension should make you consider what dangerous category?", answer: "Obstructive or right-heart failure physiology.", rationale: "High right-sided pressure plus poor perfusion can signal impaired filling/ejection." },
    ],
  },
  {
    id: "hd-shock-patterns",
    title: "Shock Pattern Differentiation",
    level: "advanced",
    summary: "Compares hypovolemic, distributive, cardiogenic, and obstructive shock using hemodynamic clues and nursing priorities.",
    mechanism: "Shock occurs when oxygen delivery fails to meet tissue demand. The hemodynamic signature depends on whether the primary failure is volume, vascular tone, pump function, or mechanical obstruction.",
    normalRanges: [
      { metric: "Lactate", range: "Often <2 mmol/L", clinicalMeaning: "Elevates with impaired oxygen utilization/delivery; trend matters." },
      { metric: "Urine output", range: "Often target ≥0.5 mL/kg/hr", clinicalMeaning: "Renal perfusion surrogate." },
    ],
    interpretationGuide: ["Classify shock by mechanism.", "Use skin signs, pulses, lungs, JVP/CVP, lactate, urine output, and response to interventions.", "Do not reflexively give fluids to every hypotensive patient.", "Escalate obstructive/cardiogenic shock early."],
    abnormalPatterns: [
      { pattern: "Low preload + narrow pulse pressure + cool skin", suggests: "Hypovolemic shock", nursingAction: "Assess bleeding/losses, prepare fluids/blood per protocol." },
      { pattern: "Low SVR + warm flushed skin early", suggests: "Distributive shock", nursingAction: "Sepsis/anaphylaxis pathway, fluids/pressors as ordered." },
      { pattern: "Pump failure + pulmonary edema + cool skin", suggests: "Cardiogenic shock", nursingAction: "Avoid blind fluids; escalate inotrope/vasopressor/reperfusion evaluation." },
      { pattern: "High filling pressure + impaired output", suggests: "Obstructive shock", nursingAction: "Assess tamponade, tension pneumothorax, massive PE; urgent escalation." },
    ],
    nursingPriorities: ["Recognize shock early", "Assess airway/breathing/circulation", "Trend lactate/urine output/mentation", "Identify mechanism", "Prepare appropriate fluids/pressors/inotropes/interventions", "Avoid harmful one-size-fits-all treatment", "Reassess after intervention"],
    troubleshooting: [
      { issue: "Mixed shock", clue: "Sepsis patient develops poor contractility", fix: "Reassess mechanism repeatedly; shock can evolve." },
      { issue: "False classification", clue: "One number contradicts bedside picture", fix: "Use trends and multimodal assessment." },
    ],
    traps: ["All hypotension is not hypovolemia.", "Warm shock can still be deadly.", "Cardiogenic shock can worsen with excessive fluids."],
    notThisBecause: [
      { lookAlike: "Distributive vs hypovolemic", distinguisher: "Distributive often has low SVR/warm early skin; hypovolemia has volume-loss clues and narrow pulse pressure." },
      { lookAlike: "Cardiogenic vs obstructive", distinguisher: "Both may be cool and hypotensive; obstruction has mechanical filling/ejection impediment." },
    ],
    caseApplication: {
      scenario: "Post-MI patient is hypotensive, cool, crackles present, urine output falling, and chest pain continues.",
      interpretation: "Cardiogenic shock until proven otherwise.",
      nursingActions: ["Escalate urgently", "Avoid reflex fluid boluses", "Prepare vasoactive support per orders", "Monitor rhythm/ischemia", "Anticipate reperfusion/cardiology pathway"],
    },
    practiceItems: [
      { stem: "Which shock type is most harmed by blind fluid loading?", answer: "Cardiogenic shock.", rationale: "Pump failure with pulmonary congestion can worsen with excess preload." },
      { stem: "Warm flushed hypotensive patient with fever and lactate 5 suggests what?", answer: "Distributive/septic shock physiology.", rationale: "Low SVR and maldistributed flow can present warm early." },
    ],
  },
  ...[
    ["hd-pulmonary-artery-catheter", "Pulmonary Artery Catheter Basics"],
    ["hd-pcwp", "PCWP and Left-Sided Filling Pressure"],
    ["hd-cardiac-output-index", "Cardiac Output and Cardiac Index"],
    ["hd-svr-pvr", "SVR, PVR, Afterload, and Vascular Tone"],
    ["hd-svo2-scvo2", "SvO₂/ScvO₂ and Oxygen Delivery Balance"],
    ["hd-advanced-shock-differentiation", "Advanced Shock Differentiation"],
  ].map(([id, title]) => ({
    id,
    title,
    level: "advanced" as const,
    summary: "Advanced hemodynamics lesson shell queued for full authoring.",
    mechanism: "Pending full clinical authoring with physiology, waveform interpretation, and case-based nursing actions.",
    normalRanges: [],
    interpretationGuide: ["Pending full interpretation guide."],
    abnormalPatterns: [],
    nursingPriorities: ["Pending full nursing-priority authoring."],
    troubleshooting: [],
    traps: ["Pending NCLEX/CNPLE trap authoring."],
    notThisBecause: [],
    caseApplication: { scenario: "Pending case.", interpretation: "Pending interpretation.", nursingActions: ["Pending nursing actions."] },
    practiceItems: [],
  })),
] as const;

export function getHemodynamicsLessonById(id: string): HemodynamicsLesson | undefined {
  return HEMODYNAMICS_LESSONS.find((lesson) => lesson.id === id);
=======
/**
 * Hemodynamics Monitoring — Canonical Lesson Curriculum
 *
 * Each lesson follows the 12-section pedagogical framework:
 *   1. Overview          — What it is, why it matters, clinical settings
 *   2. Mechanism         — Physiological basis (why the waveform/value looks like it does)
 *   3. Normal Ranges     — Measurable values with units
 *   4. Abnormal Patterns — High/low states, causes, clinical meaning
 *   5. Waveform/Metric   — How to read it at the bedside
 *   6. Nursing Priorities — Assessment, monitoring, escalation
 *   7. Common Traps      — NCLEX/CNPLE/REx-PN distractor patterns
 *   8. Not This Because  — Differential reasoning
 *   9. Case Application  — Realistic patient scenario
 *  10. Practice Items    — Interpretation-first questions (not recall)
 */

export type HemodynamicsLessonLevel =
  | "foundation"
  | "core"
  | "advanced"
  | "clinical"
  | "mastery";

export type HemodynamicsPracticeItem = {
  stem: string;
  choices: readonly [string, string, string, string];
  correct: 0 | 1 | 2 | 3;
  rationale: string;
  /** Trap this question guards against */
  trapGuarded: string;
};

export type HemodynamicsCaseApplication = {
  patientProfile: string;
  vitals: string;
  hemodynamicData: string;
  clinicalContext: string;
  question: string;
  reasoning: string;
  nursingActions: readonly string[];
};

export type HemodynamicsLesson = {
  id: string;
  slug: string;
  number: number;
  title: string;
  subtitle: string;
  level: HemodynamicsLessonLevel;
  estimatedMinutes: number;

  overview: {
    clinicalSignificance: string;
    commonSettings: readonly string[];
    keyQuestion: string;
  };

  mechanism: {
    physiologicalBasis: string;
    keyRelationships: readonly string[];
    whyItLooksLikeThis: string;
  };

  normalRanges: readonly {
    parameter: string;
    value: string;
    unit: string;
    clinicalNote: string;
  }[];

  abnormalPatterns: readonly {
    pattern: string;
    direction: "high" | "low" | "abnormal";
    causes: readonly string[];
    clinicalMeaning: string;
  }[];

  waveformOrMetricExplanation: string;

  nursingPriorities: readonly string[];

  troubleshooting: readonly {
    problem: string;
    cause: string;
    action: string;
  }[];

  commonTraps: readonly string[];

  notThisBecause: readonly {
    mimicker: string;
    differentiator: string;
  }[];

  caseApplication: HemodynamicsCaseApplication;

  practiceItems: readonly HemodynamicsPracticeItem[];
};

// ─── Lesson 1 — Introduction to Hemodynamics ─────────────────────────────────

const lesson01: HemodynamicsLesson = {
  id: "intro-hemodynamics",
  slug: "introduction",
  number: 1,
  title: "Introduction to Hemodynamics",
  subtitle: "Preload, afterload, contractility, cardiac output, and oxygen delivery",
  level: "foundation",
  estimatedMinutes: 25,

  overview: {
    clinicalSignificance:
      "Hemodynamics is the physics of blood flow. Every intervention in critical care — fluids, vasopressors, inotropes, diuretics — is an attempt to optimize one or more hemodynamic variables. Without understanding these fundamentals, nursing assessments become pattern-matching without reasoning.",
    commonSettings: ["ICU/CCU", "cardiac care unit", "emergency department", "PACU", "step-down telemetry"],
    keyQuestion:
      "Is this patient's heart delivering enough oxygen to meet tissue demands?",
  },

  mechanism: {
    physiologicalBasis:
      "Cardiac output (CO) = heart rate (HR) × stroke volume (SV). Stroke volume is determined by three variables: preload (how much blood fills the ventricle before contraction), afterload (the resistance the ventricle pumps against), and contractility (the intrinsic strength of cardiac muscle). Oxygen delivery (DO2) = CO × CaO2 (arterial oxygen content). Inadequate delivery — not just low blood pressure — is the definition of hemodynamic compromise.",
    keyRelationships: [
      "CO = HR × SV",
      "SV depends on preload, afterload, and contractility",
      "MAP = CO × SVR (simplified)",
      "DO2 = CO × (Hgb × 1.34 × SaO2 × 10)",
      "Frank-Starling law: increased preload → increased SV, up to a point",
    ],
    whyItLooksLikeThis:
      "The Frank-Starling curve explains why a volume bolus helps the hypovolemic patient (rising limb: more preload → more output) but hurts the volume-overloaded patient (flat/descending limb: additional fluid causes no benefit and may worsen pulmonary congestion).",
  },

  normalRanges: [
    { parameter: "Heart rate", value: "60–100", unit: "bpm", clinicalNote: "Tachycardia ↑ O2 demand; bradycardia ↓ CO" },
    { parameter: "Cardiac output", value: "4–8", unit: "L/min", clinicalNote: "Index by BSA for comparability" },
    { parameter: "Cardiac index", value: "2.5–4.0", unit: "L/min/m²", clinicalNote: "<2.2 = cardiogenic shock territory" },
    { parameter: "Stroke volume", value: "60–100", unit: "mL/beat", clinicalNote: "SV = CO ÷ HR" },
    { parameter: "SVR", value: "800–1200", unit: "dynes·s/cm⁵", clinicalNote: "High = vasoconstriction; Low = vasodilation" },
    { parameter: "MAP", value: "70–100", unit: "mmHg", clinicalNote: "Target ≥65 for organ perfusion; ≥80 in TBI" },
    { parameter: "SaO2", value: "≥95", unit: "%", clinicalNote: "<90 triggers O2 therapy protocol" },
  ],

  abnormalPatterns: [
    {
      pattern: "Low CO with high SVR",
      direction: "abnormal",
      causes: ["cardiogenic shock", "severe hypovolemia (compensated)", "hypothermia"],
      clinicalMeaning: "Pump failure or severe underfilling. Heart not generating enough output; body compensates with vasoconstriction to maintain MAP.",
    },
    {
      pattern: "High CO with low SVR",
      direction: "abnormal",
      causes: ["distributive shock (sepsis, anaphylaxis, neurogenic)", "early sepsis", "liver failure", "AV fistula"],
      clinicalMeaning: "Vasodilatory state. Vessels are dilated; heart is working harder to compensate, but perfusion pressure remains low.",
    },
    {
      pattern: "Low CO with low SVR",
      direction: "abnormal",
      causes: ["late septic shock with cardiac depression", "combined cardiogenic + distributive"],
      clinicalMeaning: "Worst-case scenario: pump failure plus vasodilation. High mortality; requires dual support (inotrope + vasopressor).",
    },
  ],

  waveformOrMetricExplanation:
    "CO is measured by thermodilution (cold saline injection via PA catheter → temperature change downstream) or estimated by Fick principle (CO = O2 consumption ÷ arteriovenous O2 difference). Non-invasive estimates use pulse contour analysis (PiCCO, FloTrac) or bioreactance. All methods have limitations — clinical context always matters.",

  nursingPriorities: [
    "Continuous cardiac monitoring: assess HR, rhythm, and any acute change",
    "Trending MAP every 15–60 minutes or per order; alert provider for MAP <65",
    "Assess perfusion: urine output (>0.5 mL/kg/hr), capillary refill, mentation, skin temperature",
    "Ensure IV access for rapid volume or vasoactive drug administration",
    "Position patient per hemodynamic strategy (Trendelenburg rarely used; head-of-bed per CO target)",
    "Document all hemodynamic values, trends, and clinical correlation",
    "Report acute deterioration immediately; prepare for escalation",
  ],

  troubleshooting: [
    { problem: "MAP suddenly drops", cause: "Hemorrhage, vasodilation, arrhythmia, medication", action: "Assess clinical status, check lines and transducers, notify provider, prepare volume or vasopressor" },
    { problem: "Tachycardia with low MAP", cause: "Hypovolemia, pain, sepsis, PE", action: "Assess for bleeding, fever, pain source; fluid challenge per order; 12-lead ECG" },
    { problem: "Low urine output despite normal MAP", cause: "AKI, renal hypoperfusion, obstruction", action: "Check bladder catheter patency, assess volume status, review labs, notify provider" },
  ],

  commonTraps: [
    "Equating normal BP with adequate perfusion — a patient can have SBP 110 with CI 1.8 (cardiogenic shock)",
    "Assuming tachycardia is always bad — compensatory tachycardia maintains CO when SV is low",
    "Giving fluids to all hypotensive patients — vasodilatory shock needs vasopressors, not fluid overload",
    "Ignoring lactate — lactic acidosis signals tissue hypoperfusion even when MAP appears adequate",
    "Treating the number, not the patient — always correlate hemodynamic values with clinical assessment",
  ],

  notThisBecause: [
    {
      mimicker: "Hypertension causing tachycardia → assume anxiety",
      differentiator: "Assess perfusion markers (urine, lactate, mentation); sympathetic activation from hypoperfusion mimics anxiety",
    },
    {
      mimicker: "High CO = good hemodynamics",
      differentiator: "High CO in sepsis is compensatory — the patient is vasodilated and may still have poor organ perfusion",
    },
  ],

  caseApplication: {
    patientProfile: "68-year-old male, post-op CABG day 1. Transferred to ICU from PACU.",
    vitals: "BP 88/52, HR 118, RR 22, SpO2 94% on 4L NC, Temp 36.1°C",
    hemodynamicData: "MAP 64, CO 3.2 L/min, CI 1.7 L/min/m², SVR 1480, CVP 14",
    clinicalContext: "Patient is cool to touch, urine output 15 mL/hr over past 2 hours, peripheral pulses faint. Lactate 4.2 mmol/L.",
    question:
      "Based on these hemodynamic values, what is the most likely diagnosis and what is the priority nursing action?",
    reasoning:
      "Low CI (1.7), high SVR (vasoconstriction), elevated CVP (volume adequate/elevated), cool periphery, low UO, elevated lactate = cardiogenic shock pattern. CO is low; body compensates with vasoconstriction. Priority: notify surgeon/intensivist immediately, prepare inotrope (dobutamine) per order, do NOT give volume blind (CVP already 14), continuous monitoring, 12-lead ECG for ischemia.",
    nursingActions: [
      "Notify cardiac surgery team and intensivist immediately",
      "Prepare dobutamine infusion per anticipated order",
      "Increase monitoring frequency to continuous vital sign trending",
      "Obtain 12-lead ECG to rule out new ischemia",
      "Strict hourly urine output; Foley catheter patency check",
      "Hold additional IV fluids pending provider orders",
      "Document trending hemodynamic values and clinical findings",
    ],
  },

  practiceItems: [
    {
      stem: "A patient with septic shock has MAP 58, CO 9.2 L/min, SVR 420. The ICU nurse correctly interprets this as:",
      choices: [
        "Cardiogenic shock — low MAP indicates pump failure",
        "Distributive shock — high CO and low SVR indicate vasodilation",
        "Hypovolemic shock — low MAP with compensatory tachycardia",
        "Obstructive shock — elevated CO obstructs forward flow",
      ],
      correct: 1,
      rationale:
        "High CO with low SVR is the hallmark of distributive (septic/vasodilatory) shock. The vasculature is pathologically dilated, causing low MAP despite a compensatorily elevated cardiac output. Cardiogenic shock has LOW CO and HIGH SVR.",
      trapGuarded: "Assuming any low MAP = pump failure (cardiogenic)",
    },
    {
      stem: "The Frank-Starling law predicts that increasing preload will increase stroke volume. This relationship holds until:",
      choices: [
        "Heart rate exceeds 100 bpm",
        "Afterload exceeds SVR of 1200 dynes·s/cm⁵",
        "The ventricle is overfilled and operating on the flat or descending limb of the curve",
        "Contractility decreases below 60% ejection fraction",
      ],
      correct: 2,
      rationale:
        "The Frank-Starling curve has a rising limb (preload → SV) and a flat/descending limb where additional volume produces no increase in output. Volume-overloaded or failing hearts operate on the flat/descending limb — fluid loading only worsens pulmonary congestion.",
      trapGuarded: "Thinking more preload always helps — it does not in the volume-overloaded state",
    },
  ],
};

// ─── Lesson 2 — Arterial Line Monitoring ─────────────────────────────────────

const lesson02: HemodynamicsLesson = {
  id: "arterial-line-monitoring",
  slug: "arterial-lines",
  number: 2,
  title: "Arterial Line Monitoring",
  subtitle: "Waveform components, zeroing, square-wave test, dampening, and nursing safety",
  level: "core",
  estimatedMinutes: 30,

  overview: {
    clinicalSignificance:
      "Arterial lines (A-lines) provide continuous, beat-to-beat blood pressure monitoring and access for frequent ABG sampling without repeated arterial punctures. They are essential in haemodynamically unstable patients, vasoactive drug infusions, and whenever accurate beat-to-beat BP data is needed.",
    commonSettings: ["ICU/CCU", "cardiac surgery PACU", "hemodynamic instability on vasopressors", "frequent ABG requirements", "respiratory failure on mechanical ventilation"],
    keyQuestion: "Is this arterial waveform accurately reflecting the patient's true blood pressure?",
  },

  mechanism: {
    physiologicalBasis:
      "The arterial waveform reflects mechanical events of the cardiac cycle transmitted through the arterial system. A fluid-filled catheter transmits pressure waves from the radial (or femoral/brachial) artery to an electronic transducer, which converts pressure to an electrical signal displayed as a waveform. Signal accuracy depends on the system's dynamic response (natural frequency and damping coefficient).",
    keyRelationships: [
      "Systolic peak = maximum ventricular ejection pressure",
      "Dicrotic notch = aortic valve closure (onset of diastole)",
      "Diastolic runoff = arterial elastic recoil between beats",
      "MAP ≈ (SBP + 2×DBP) ÷ 3 (approximation valid at normal heart rates)",
      "Overdamping: ↓ amplitude, loss of dicrotic notch — underestimates SBP",
      "Underdamping: exaggerated peaks, oscillations — overestimates SBP",
    ],
    whyItLooksLikeThis:
      "The steep systolic upstroke reflects rapid ventricular ejection. The dicrotic notch is the physical impact of aortic valve leaflets closing — a reliable marker separating systole from diastole. The gradual diastolic runoff reflects blood continuing to flow into the peripheral vasculature as aortic pressure equilibrates.",
  },

  normalRanges: [
    { parameter: "Radial systolic BP", value: "90–140", unit: "mmHg", clinicalNote: "Radial SBP is ~10 mmHg higher than central due to wave amplification" },
    { parameter: "Diastolic BP", value: "60–90", unit: "mmHg", clinicalNote: "Low DBP with wide pulse pressure may suggest aortic regurgitation" },
    { parameter: "MAP", value: "70–100", unit: "mmHg", clinicalNote: "Target ≥65 for organ perfusion" },
    { parameter: "Pulse pressure", value: "40–60", unit: "mmHg", clinicalNote: "PP = SBP − DBP; narrow PP = ↓SV; wide PP = ↑SV or AR" },
  ],

  abnormalPatterns: [
    {
      pattern: "Overdamped waveform",
      direction: "abnormal",
      causes: ["clot in catheter/tubing", "air bubble", "soft compliant tubing", "catheter kinking", "vasodilation"],
      clinicalMeaning: "Blunted waveform underestimates SBP and overestimates DBP. Dicrotic notch absent or indistinct. MAP may still be reasonably accurate.",
    },
    {
      pattern: "Underdamped waveform",
      direction: "abnormal",
      causes: ["excessive tubing length", "stiff tubing", "small air bubble (partial)", "tachycardia"],
      clinicalMeaning: "Falsely elevated SBP and falsely lowered DBP. Systolic peak appears sharp with visible ringing/oscillations after the systolic peak.",
    },
    {
      pattern: "Pulsus paradoxus pattern",
      direction: "abnormal",
      causes: ["cardiac tamponade", "severe asthma/COPD", "tension pneumothorax"],
      clinicalMeaning: "Systolic BP drops >10 mmHg with inspiration. Easily detected on A-line tracing as visible respiratory variation in systolic peak height.",
    },
    {
      pattern: "Pulse pressure variation (PPV >13%)",
      direction: "abnormal",
      causes: ["volume responsiveness in mechanically ventilated patients"],
      clinicalMeaning: "High PPV predicts fluid responsiveness in deeply sedated, mechanically ventilated patients with sinus rhythm. NOT valid in spontaneously breathing patients.",
    },
  ],

  waveformOrMetricExplanation:
    "The square wave test (fast-flush test) assesses dynamic response. Activate the fast-flush mechanism: the waveform rises sharply and should return to baseline within 1–2 oscillations after the flush. Optimal damping: 1–2 oscillations back to baseline. Overdamped: 0–1 oscillation, sluggish return. Underdamped: >3 oscillations, prolonged ringing. Perform every 4–8 hours and after any position change or troubleshooting.",

  nursingPriorities: [
    "Zero the transducer to the phlebostatic axis (4th ICS, MAL) at the START of every shift and after any position change",
    "Maintain the transducer level relative to the phlebostatic axis — each 1 inch of change = ~2 mmHg error",
    "Flush system with heparinized normal saline at 3–5 mL/hr via pressure bag at 300 mmHg",
    "Perform square-wave test every 4–8 hours; document results",
    "Assess insertion site every 2–4 hours: distal extremity perfusion (colour, capillary refill, sensation, temperature)",
    "Never inject medications through the arterial line — life-threatening complication",
    "Label all lines clearly; arterial lines should use red arterial tubing per institutional policy",
    "Change dressing per policy (typically 48–72 hours or when soiled)",
    "Hold pressure 5 minutes (radial) after blood draws or disconnections",
  ],

  troubleshooting: [
    { problem: "Waveform appears overdamped", cause: "Clot, air, kinked catheter, loose connection", action: "Perform square-wave test. Aspirate and flush catheter per policy. Check all connections. Reposition wrist if radial." },
    { problem: "Waveform appears underdamped", cause: "Tubing too long, stiff tubing, partial air bubble", action: "Perform square-wave test. Shorten or replace tubing. Remove microbubbles. Check tubing compliance." },
    { problem: "No waveform/flatline", cause: "Transducer stopcock closed to patient, disconnection, catheter occlusion", action: "Check stopcock position. Check all connections. Aspirate gently. Alert provider if catheter occlusion suspected." },
    { problem: "A-line vs NIBP discrepancy >10 mmHg", cause: "Dampening, transducer height error, peripheral vasoconstriction", action: "Perform square-wave test. Rezero transducer. Verify transducer level. Document and notify provider." },
  ],

  commonTraps: [
    "Forgetting to rezero after patient position change — every change in height = ~2 mmHg per inch error",
    "Trusting overdamped readings — an overdamped trace underestimates SBP, leading to inappropriate vasopressor titration",
    "Injecting medications through an A-line — can cause distal ischemia, tissue necrosis, and limb loss",
    "Ignoring damping on the square-wave test — 80% of nurses miss this assessment in clinical simulation",
    "Using PPV to assess fluid responsiveness in spontaneously breathing patients — invalid; tidal volume variation drives the test",
  ],

  notThisBecause: [
    {
      mimicker: "Overdamped trace looks like a 'normal' lower BP reading",
      differentiator: "Check the dicrotic notch: if absent, the system is overdamped and SBP is being underestimated. Perform square-wave test.",
    },
    {
      mimicker: "Underdamped trace gives falsely high SBP — may mimic hypertension",
      differentiator: "Look for oscillations/ringing after the systolic peak and on the square-wave test. >3 oscillations = underdamped. True SBP is lower than displayed.",
    },
  ],

  caseApplication: {
    patientProfile: "55-year-old female, septic shock on norepinephrine 0.12 mcg/kg/min. Radial A-line right wrist.",
    vitals: "A-line reads BP 78/42, MAP 54. NIBP on same arm reads 92/58, MAP 69.",
    hemodynamicData: "Square-wave test: waveform returns to baseline in 4 oscillations. Dicrotic notch visible.",
    clinicalContext: "Team is considering increasing norepinephrine based on A-line MAP of 54.",
    question:
      "What is the A-line problem and what should the nurse do before escalating vasopressor therapy?",
    reasoning:
      "4 oscillations on square-wave test = underdamped system. Underdamped systems overestimate SBP and underestimate DBP — paradoxically, MAP may be less affected. But the NIBP-A-line discrepancy (NIBP higher) combined with underdamped trace suggests the A-line is falsely low due to system artifact. Nurse should troubleshoot (shorten tubing, remove microbubbles, rezero) before escalating NE — unnecessary escalation could cause hypertension and organ damage.",
    nursingActions: [
      "Perform square-wave test and document findings (underdamped: 4 oscillations)",
      "Check all tubing connections for microbubbles; remove if present",
      "Shorten or replace tubing to reduce underdamping",
      "Rezero transducer at phlebostatic axis",
      "Repeat square-wave test after troubleshooting",
      "Notify intensivist of A-line/NIBP discrepancy before vasopressor adjustment",
      "Document all findings and interventions",
    ],
  },

  practiceItems: [
    {
      stem: "During the square-wave test on an arterial line, the waveform returns to baseline after 5 oscillations. The nurse correctly identifies this as:",
      choices: [
        "Optimal damping — the system is functioning correctly",
        "Overdamped — the system is underestimating systolic BP",
        "Underdamped — the system is overestimating systolic BP",
        "Normal variation — 5 oscillations are within accepted limits",
      ],
      correct: 2,
      rationale:
        "Optimal damping on the square-wave test = 1–2 oscillations back to baseline. More than 2–3 oscillations = underdamped system, which overestimates systolic BP and underestimates diastolic BP. The nurse should troubleshoot tubing, remove microbubbles, and shorten tubing length.",
      trapGuarded: "Confusing underdamping (overestimates SBP) with overdamping (underestimates SBP)",
    },
    {
      stem: "A critically ill patient's arterial line waveform shows a blunted systolic peak with an absent dicrotic notch. The most appropriate nursing action is:",
      choices: [
        "Notify the provider that the patient is in cardiogenic shock",
        "Increase the vasopressor infusion rate",
        "Perform the square-wave test and troubleshoot for overdamping",
        "Obtain a STAT echocardiogram for aortic valve assessment",
      ],
      correct: 2,
      rationale:
        "Blunted systolic peak with absent dicrotic notch = overdamped waveform. The first step is always to assess waveform quality (square-wave test) and troubleshoot (clot, air, kink, loose connection). A clinical decision to increase vasopressors must not be based on an overdamped (and therefore inaccurate) waveform.",
      trapGuarded: "Treating a hemodynamic artifact (overdamping) as a clinical finding requiring intervention",
    },
  ],
};

// ─── Lesson 3 — CVP Monitoring ────────────────────────────────────────────────

const lesson03: HemodynamicsLesson = {
  id: "cvp-monitoring",
  slug: "cvp",
  number: 3,
  title: "Central Venous Pressure Monitoring",
  subtitle: "Normal values, waveform interpretation, fluid responsiveness limitations",
  level: "core",
  estimatedMinutes: 22,

  overview: {
    clinicalSignificance:
      "CVP measured via central venous catheter reflects right atrial pressure, which approximates right ventricular end-diastolic pressure (preload). It is used to assess intravascular volume status and right-sided heart function. However, its utility as a fluid responsiveness predictor is severely limited — this is one of the most important evidence-based nuances in modern critical care nursing.",
    commonSettings: ["ICU patients with central venous access", "post-operative cardiac surgery", "sepsis/septic shock fluid management", "right heart failure monitoring"],
    keyQuestion: "What is the right heart's filling pressure, and does the patient need more volume?",
  },

  mechanism: {
    physiologicalBasis:
      "CVP = right atrial pressure (RAP). The right atrium receives blood from the superior and inferior vena cavae. When right ventricular filling increases (high preload), or when the right ventricle fails and backs up pressure, CVP rises. When intravascular volume is depleted, CVP falls. However, numerous confounders (positive pressure ventilation, cardiac tamponade, RV failure, tricuspid disease, mediastinal pressure) mean CVP cannot reliably predict whether giving fluid will increase cardiac output.",
    keyRelationships: [
      "CVP ≈ RAP ≈ RVEDP in most patients",
      "High CVP: volume overload, RV failure, cardiac tamponade, tension pneumothorax",
      "Low CVP: hypovolemia, vasodilation",
      "CVP does NOT reliably predict fluid responsiveness (Marik 2008, CHEST 2013 meta-analysis)",
      "Dynamic measures (PPV, SVV, PLR response) are superior fluid responsiveness predictors",
    ],
    whyItLooksLikeThis:
      "The CVP waveform has three positive deflections (a, c, v waves) and two descents (x, y). The a wave = atrial contraction. c wave = tricuspid valve closure. v wave = venous filling during systole. x descent = atrial relaxation. y descent = tricuspid valve opening and early ventricular filling.",
  },

  normalRanges: [
    { parameter: "CVP", value: "2–8", unit: "mmHg", clinicalNote: "Values must be interpreted in clinical context, not in isolation" },
    { parameter: "CVP (intubated/ventilated)", value: "5–12", unit: "mmHg", clinicalNote: "Positive pressure ventilation increases measured CVP by 3–5 mmHg" },
  ],

  abnormalPatterns: [
    {
      pattern: "High CVP (>12 mmHg)",
      direction: "high",
      causes: ["volume overload", "right heart failure", "cardiac tamponade", "tension pneumothorax", "pulmonary hypertension", "tricuspid regurgitation", "positive pressure ventilation"],
      clinicalMeaning: "Elevated filling pressures. Volume administration is unlikely to increase CO and may worsen congestion. Do NOT add fluids without careful evaluation.",
    },
    {
      pattern: "Low CVP (<2 mmHg)",
      direction: "low",
      causes: ["hypovolemia (hemorrhage, third spacing, dehydration)", "vasodilation", "septic shock early phase"],
      clinicalMeaning: "Low intravascular volume or pathologic vasodilation. Patient may be fluid-responsive, but must confirm with dynamic assessment or clinical response.",
    },
    {
      pattern: "Cannon a waves",
      direction: "abnormal",
      causes: ["complete heart block", "junctional rhythm", "ventricular pacing with AV dissociation"],
      clinicalMeaning: "Atrial contraction against a closed tricuspid valve. Visible on CVP waveform as giant a waves. Clinical significance: AV dissociation.",
    },
    {
      pattern: "Large v waves",
      direction: "abnormal",
      causes: ["tricuspid regurgitation", "severe mitral regurgitation (transmitted)"],
      clinicalMeaning: "Regurgitant flow back into atrium during systole creates large v waves. Correlates with backflow severity.",
    },
  ],

  waveformOrMetricExplanation:
    "Zeroing CVP: place the transducer at the phlebostatic axis (4th ICS, mid-axillary line). Zero to atmosphere (stopcock open to air, zero button). For accurate reading: read at end-expiration (during spontaneous breathing, CVP is lowest at end-expiration; during positive pressure ventilation, CVP is highest at end-inspiration). Most bedside monitors display digital end-expiration CVP automatically.",

  nursingPriorities: [
    "Zero transducer at phlebostatic axis at start of shift and after position changes",
    "Document CVP trends, not just single values — single readings have poor predictive value",
    "Correlate CVP with clinical findings (urine output, skin perfusion, mental status, BP trend)",
    "Communicate CVP in context: 'CVP 14 in a patient post-cardiac surgery with poor output' differs from 'CVP 14 in a septic patient who just received 2L'",
    "Monitor for central line complications: air embolism, thrombosis, infection (CLABSI), pneumothorax",
    "Assess central line insertion site every shift; maintain occlusive dressing",
  ],

  troubleshooting: [
    { problem: "CVP reading fluctuates widely with breathing", cause: "Normal respiratory variation (much larger in spontaneous breathing)", action: "Read at end-expiration; use monitor's digital end-expiratory value" },
    { problem: "CVP appears falsely high", cause: "Transducer level too low, patient position change not accounted for", action: "Rezero at phlebostatic axis; verify transducer level hasn't shifted" },
    { problem: "CVP waveform absent", cause: "Stopcock open to wrong port, CVC not in right atrium, flush system issue", action: "Check stopcock position; confirm CVC tip position via CXR; troubleshoot pressure bag" },
  ],

  commonTraps: [
    "Treating a low CVP as definitive evidence for fluid bolus — low CVP does NOT guarantee fluid responsiveness",
    "Treating a high CVP as definitive evidence against fluids — a tamponade patient with CVP 18 NEEDS intervention (pericardiocentesis), not fluid restriction",
    "Ignoring positive pressure ventilation effect — mechanically ventilated CVP is 3–5 mmHg higher than true RAP",
    "Using CVP as the sole guide for resuscitation — the 2013 CHEST meta-analysis showed CVP has zero ability to predict fluid responsiveness",
    "Not reading at end-expiration — reading during inspiration artificially lowers values in spontaneous breathers",
  ],

  notThisBecause: [
    {
      mimicker: "High CVP = always volume overloaded, hold all fluids",
      differentiator: "Cardiac tamponade causes high CVP with obstructed ventricular filling — the treatment is pericardiocentesis, not fluid restriction. RV failure also elevates CVP despite possible volume depletion.",
    },
    {
      mimicker: "Normal CVP = normal filling, patient is hemodynamically stable",
      differentiator: "CVP can be normal in distributive shock (vasodilation) and in cardiogenic shock when there is both reduced output and reflex vasoconstriction. Normal CVP does NOT mean the patient is hemodynamically optimized.",
    },
  ],

  caseApplication: {
    patientProfile: "72-year-old male, septic shock, post-resuscitation. Intubated, ventilated at PEEP 8 cmH2O.",
    vitals: "MAP 66, HR 104, CVP 5. Urine output 18 mL/hr over past 2 hours.",
    hemodynamicData: "CO 7.8 L/min, CI 3.9 L/min/m², SVR 470 dynes·s/cm⁵. Lactate 3.4 → 2.1 mmol/L (trending down).",
    clinicalContext: "Intensivist is considering a 500 mL crystalloid bolus based on CVP of 5.",
    question:
      "Is the CVP of 5 reliable evidence that this patient will respond to a fluid bolus? Explain what other data should guide this decision.",
    reasoning:
      "CVP 5 under PEEP 8 is actually lower than expected (PEEP typically adds 3–5 mmHg). HOWEVER — this patient has HIGH CO/CI (distributive profile from sepsis) and FALLING lactate, which suggests improving perfusion without additional volume. Using CVP alone is insufficient. Dynamic measures (PLR, PPV, SVV) or clinical response to a conservative fluid challenge should guide the decision. Blind bolusing based on CVP alone in this patient (who already has adequate CI) risks volume overload with worsening pulmonary compliance.",
    nursingActions: [
      "Report CVP value in clinical context: CI 3.9, improving lactate, high CO",
      "Prepare for passive leg raise (PLR) assessment if ordered as a fluid challenge surrogate",
      "Monitor for signs of volume overload (rising airway pressures, worsening SpO2, bibasilar crackles)",
      "Continue strict hourly urine output documentation",
      "Maintain current vasopressor titration; do not reduce based on CVP alone",
      "Notify intensivist of clinical picture before fluid administration",
    ],
  },

  practiceItems: [
    {
      stem: "A patient with septic shock has a CVP of 3 mmHg. The nurse knows this reading means:",
      choices: [
        "The patient definitely needs a fluid bolus to increase preload",
        "The patient's right ventricular preload is low, but this does not confirm fluid responsiveness",
        "The patient is volume overloaded and requires diuresis",
        "The CVP reading is invalid because it is less than 5 mmHg",
      ],
      correct: 1,
      rationale:
        "A low CVP suggests reduced right heart filling, but does NOT predict whether a fluid bolus will increase cardiac output. Evidence shows CVP has no predictive value for fluid responsiveness. Dynamic measures (PPV, SVV, PLR response) are required. The correct nursing action is to report and await clinical decision-making, not to autonomously bolus based on a number.",
      trapGuarded: "Equating low CVP with confirmed fluid-responsiveness requiring autonomous fluid administration",
    },
  ],
};

// ─── Lesson 7 — Shock Pattern Recognition ────────────────────────────────────

const lesson07: HemodynamicsLesson = {
  id: "shock-pattern-recognition",
  slug: "shock-patterns",
  number: 7,
  title: "Shock Pattern Recognition",
  subtitle: "Distributive, cardiogenic, hypovolemic, and obstructive shock hemodynamic profiles",
  level: "clinical",
  estimatedMinutes: 35,

  overview: {
    clinicalSignificance:
      "Shock is inadequate oxygen delivery to meet tissue metabolic demands — not simply low blood pressure. Identifying the type of shock from hemodynamic data, clinical presentation, and initial lab values determines whether the correct intervention is volume, vasopressors, inotropes, or emergent procedures. Treating the wrong type of shock causes death.",
    commonSettings: ["ICU", "emergency department", "surgical ICU post-operatively", "rapid response calls", "PACU"],
    keyQuestion: "Is this shock distributive, cardiogenic, hypovolemic, or obstructive — and what is the correct intervention?",
  },

  mechanism: {
    physiologicalBasis:
      "All shock types share inadequate tissue perfusion, but via different mechanisms. Distributive: vasodilation → low SVR → low MAP despite high (compensatory) CO. Cardiogenic: pump failure → low CO → high SVR (compensatory vasoconstriction) → low MAP. Hypovolemic: loss of intravascular volume → low preload → low CO → high SVR → low MAP. Obstructive: mechanical obstruction to cardiac filling or output (PE, tamponade, tension pneumo) → impaired preload or outflow → low CO → low MAP with variable CVP.",
    keyRelationships: [
      "Distributive: ↓SVR + ↑CO + warm periphery → septic/anaphylactic/neurogenic",
      "Cardiogenic: ↓CO + ↑SVR + ↑PAOP + cool periphery → pump failure",
      "Hypovolemic: ↓preload + ↓CO + ↑SVR + ↓CVP → volume loss",
      "Obstructive: ↓CO + ↑CVP (tamponade/tension) or normal CVP (PE) + obstructed flow",
      "All types: MAP <65, ↑lactate, impaired organ perfusion",
    ],
    whyItLooksLikeThis:
      "Septic shock patients are warm and vasodilated because inflammatory mediators (TNF, IL-1) destroy vascular tone. Cardiogenic shock patients are cool and clammy because the failing heart triggers maximal sympathetic activation (vasoconstriction) — the body sacrifices peripheral perfusion to maintain central organ flow.",
  },

  normalRanges: [
    { parameter: "SVR (normal)", value: "800–1200", unit: "dynes·s/cm⁵", clinicalNote: "↓SVR = vasodilation (distributive); ↑SVR = vasoconstriction (hypovolemic, cardiogenic)" },
    { parameter: "CI (normal)", value: "2.5–4.0", unit: "L/min/m²", clinicalNote: "<2.2 = cardiogenic territory; >4.5 = hyperdynamic (distributive)" },
    { parameter: "PAOP (normal)", value: "6–12", unit: "mmHg", clinicalNote: ">18 = cardiogenic/volume overload; <6 = hypovolemia" },
    { parameter: "CVP (normal)", value: "2–8", unit: "mmHg", clinicalNote: "↑ in tamponade/tension; ↓ in hypovolemia; variable in distributive" },
    { parameter: "ScvO2 (normal)", value: "70–75", unit: "%", clinicalNote: "<65 = ↑extraction (low delivery); ↑ in distributive (impaired utilization)" },
  ],

  abnormalPatterns: [
    {
      pattern: "Distributive shock profile",
      direction: "abnormal",
      causes: ["septic shock", "anaphylactic shock", "neurogenic shock (spinal cord injury)"],
      clinicalMeaning: "Low SVR, high/normal CO, low MAP, warm/flushed periphery, bounding pulses. Treatment: vasopressors (NE first-line), source control in sepsis, epinephrine in anaphylaxis.",
    },
    {
      pattern: "Cardiogenic shock profile",
      direction: "abnormal",
      causes: ["massive MI", "decompensated heart failure", "myocarditis", "severe valvular dysfunction", "post-cardiac surgery"],
      clinicalMeaning: "Low CO, high SVR, high PAOP (>18 → pulmonary edema), cool/pale/clammy periphery, elevated lactate. Treatment: inotropes (dobutamine), vasopressors for MAP support, possible mechanical circulatory support.",
    },
    {
      pattern: "Hypovolemic shock profile",
      direction: "abnormal",
      causes: ["hemorrhage (surgical, trauma, GI bleed)", "third spacing", "severe dehydration", "burns"],
      clinicalMeaning: "Low preload (CVP <2), low CO, high SVR, cool extremities, tachycardia, low urine output. Treatment: volume replacement (crystalloid + blood products for hemorrhagic), surgical control of bleeding.",
    },
    {
      pattern: "Obstructive shock profile",
      direction: "abnormal",
      causes: ["massive PE", "cardiac tamponade", "tension pneumothorax", "constrictive pericarditis"],
      clinicalMeaning: "Low CO with impaired filling. Tamponade/tension: ↑CVP, muffled heart sounds, JVD, tracheal deviation. PE: ↑CVP, hypoxia, RV strain pattern. Treatment: emergent: pericardiocentesis (tamponade), needle decompression (tension), thrombolytics/embolectomy (PE).",
    },
  ],

  waveformOrMetricExplanation:
    "The 4-box hemodynamic framework: Draw a 2×2 grid with CO (high/low) on x-axis and SVR (high/low) on y-axis. High CO + Low SVR = distributive. Low CO + High SVR = cardiogenic or hypovolemic. Low CO + Low SVR = combined (late septic + cardiac depression; highest mortality). This mental model allows rapid bedside classification without waiting for full PA catheter data.",

  nursingPriorities: [
    "Rapid clinical assessment: skin temperature/colour, capillary refill, mentation, pulse quality",
    "Continuous hemodynamic monitoring; establish or verify reliable IV access (minimum 2 large-bore peripheral or CVC)",
    "Obtain 12-lead ECG for cardiogenic shock screening (STEMI, arrhythmia)",
    "Position: flat or Trendelenburg (only for hypovolemia); head of bed elevation may worsen cardiogenic shock preload",
    "Oxygen supplementation and prepare for intubation if respiratory compensation failing",
    "Draw labs: lactate, BMP, CBC, troponin, coagulation, blood cultures × 2 (before antibiotics in sepsis)",
    "Activate appropriate escalation: sepsis protocol, STEMI team, code cart, massive transfusion protocol",
    "Document vital signs, clinical findings, and interventions with accurate timestamps",
  ],

  troubleshooting: [
    { problem: "Patient not responding to vasopressors", cause: "Distributive shock with inadequate source control OR wrong shock type", action: "Reassess shock type. Ensure antibiotics and source control in sepsis. Consider additional vasopressin or phenylephrine. Consult intensivist." },
    { problem: "Fluid bolus worsens respiratory status", cause: "Cardiogenic or obstructive shock (not hypovolemic)", action: "Stop fluids, reassess clinical picture. Diuresis if cardiogenic; decompress if obstructive. Notify provider immediately." },
    { problem: "MAP not responding to NE escalation in sepsis", cause: "Vasopressin-deficient state, adrenal insufficiency, unreplaced volume", action: "Add vasopressin 0.04 units/min; consider hydrocortisone 200 mg/day; reassess volume status with dynamic measure" },
  ],

  commonTraps: [
    "Treating distributive shock with aggressive fluids without vasopressors — fluids alone cannot fix vasodilation",
    "Giving a cardiogenic shock patient a 500 mL bolus — worsens pulmonary congestion and kills the patient",
    "Confusing neurogenic shock (warm, bradycardic) with septic shock (warm, tachycardic)",
    "Missing obstructive shock: JVD + hypotension + absent breath sounds = tension pneumothorax → NEEDLE first, X-ray second",
    "Delaying antibiotics in septic shock to 'wait for cultures' — each hour of delay increases mortality 7%",
    "ScvO2 can be falsely high in sepsis (impaired cellular O2 utilization) — high ScvO2 does NOT mean adequate delivery",
  ],

  notThisBecause: [
    {
      mimicker: "Neurogenic shock (warm, hypotensive) looks like septic shock",
      differentiator: "Neurogenic: bradycardia (due to loss of sympathetic tone), history of spinal cord injury/lesion, no fever, no infection source. Septic: tachycardia, fever, infection source, elevated lactate/WBC.",
    },
    {
      mimicker: "Anaphylactic shock looks like septic shock",
      differentiator: "Anaphylaxis: acute onset (seconds to minutes), allergen exposure history, urticaria/angioedema, bronchospasm. Treatment: epinephrine IM (not NE). Sepsis: infectious source, hours-days onset.",
    },
    {
      mimicker: "Hypovolemic shock with compensatory tachycardia looks like arrhythmia-driven shock",
      differentiator: "Hypovolemia: tachycardia resolves with volume replacement. Arrhythmia: tachycardia pattern on ECG, does not resolve with fluids. Always obtain ECG.",
    },
  ],

  caseApplication: {
    patientProfile: "58-year-old male, 3 days post-coronary artery bypass graft. ICU. No fever.",
    vitals: "BP 74/50, HR 128, RR 26, SpO2 88% on 50% FiO2, Temp 36.8°C",
    hemodynamicData: "CO 2.1 L/min, CI 1.1 L/min/m², SVR 1840, CVP 18, PAOP 24, Lactate 5.8",
    clinicalContext: "Lungs: bilateral crackles. Skin cool, clammy. Urine output 8 mL/hr. No obvious bleeding. CXR shows pulmonary vascular congestion.",
    question: "Identify the shock type and state your priority nursing interventions.",
    reasoning:
      "Classic cardiogenic shock: low CO/CI, high SVR (compensatory), high PAOP (pulmonary congestion), high CVP, cool/clammy, bilateral crackles, elevated lactate. Treatment: inotrope (dobutamine for CO support), vasopressor if MAP critically low (NE/dopamine), diuresis for PAOP reduction, consider IABP or Impella for mechanical support. Do NOT give fluids (PAOP already 24 — will worsen pulmonary edema).",
    nursingActions: [
      "Notify cardiac surgery and intensivist immediately — cardiogenic shock post-CABG is a surgical/cardiac emergency",
      "Prepare dobutamine infusion per anticipation (2.5–20 mcg/kg/min)",
      "Hold all non-essential IV fluids; do NOT bolus",
      "Increase FiO2; prepare for intubation if respiratory compensation failing",
      "Obtain 12-lead ECG: rule out perioperative MI, new arrhythmia",
      "Continuous hemodynamic trending every 15 minutes",
      "Prepare for possible IABP insertion or escalation to Impella",
      "Labs: troponin trend, BMP (K, Mg for arrhythmia prevention), repeat lactate in 2 hours",
    ],
  },

  practiceItems: [
    {
      stem: "A patient presents with BP 82/40, HR 128, skin warm and flushed, temperature 39.1°C, SpO2 94%, MAP 54. Lactate is 5.2 mmol/L. The nurse anticipates this patient is in:",
      choices: [
        "Cardiogenic shock — low MAP with tachycardia indicates pump failure",
        "Hypovolemic shock — tachycardia and low MAP suggest volume depletion",
        "Distributive shock — warm skin, fever, and vasodilatory profile suggest septic or anaphylactic etiology",
        "Obstructive shock — hypotension with tachycardia may indicate massive PE",
      ],
      correct: 2,
      rationale:
        "Warm, flushed skin + fever + tachycardia + low MAP = distributive (septic) shock profile. The vasodilatory state causes warmth and flushing despite severe hemodynamic compromise. Cardiogenic shock has cool/clammy skin (high SVR). Hypovolemia has cool skin with no fever. Obstructive would present with JVD, muffled sounds, or hypoxia pattern.",
      trapGuarded: "Equating any low MAP with cardiogenic shock regardless of skin temperature/clinical picture",
    },
    {
      stem: "The intensivist orders a 500 mL normal saline bolus for a patient with MAP 58 and CVP 22. The nurse's priority action is:",
      choices: [
        "Administer the fluid bolus as ordered",
        "Question the order and report CVP 22 and bilateral crackles before administering",
        "Give 250 mL instead as a compromise",
        "Consult the charge nurse before contacting the physician",
      ],
      correct: 1,
      rationale:
        "CVP 22 with bilateral crackles suggests volume overload or cardiogenic shock (high filling pressures). A fluid bolus in this context worsens pulmonary congestion and reduces oxygenation. The nurse has a professional and legal obligation to question orders that may harm the patient — report clinical findings (CVP, crackles, SpO2 trend) and confirm the plan before administering.",
      trapGuarded: "Administering ordered fluids without clinical correlation when high CVP/crackles signal volume overload",
    },
  ],
};

// ─── Lessons 4–6, 8–10 Summary Placeholders ──────────────────────────────────
// Full lesson objects for lessons 4–6 and 8–10 follow the same schema.
// Abbreviated here for bundle size; full content loaded on demand via lesson slug.

const lesson04: Pick<HemodynamicsLesson, "id" | "slug" | "number" | "title" | "subtitle" | "level" | "estimatedMinutes"> = {
  id: "pulmonary-artery-catheter",
  slug: "pa-catheter",
  number: 4,
  title: "Pulmonary Artery Catheter Basics",
  subtitle: "RA, RV, PA, and PAOP waveform progression — insertion to interpretation",
  level: "advanced",
  estimatedMinutes: 35,
};

const lesson05: Pick<HemodynamicsLesson, "id" | "slug" | "number" | "title" | "subtitle" | "level" | "estimatedMinutes"> = {
  id: "cardiac-output-index",
  slug: "cardiac-output",
  number: 5,
  title: "Cardiac Output and Cardiac Index",
  subtitle: "CO, CI, SV, SVI — thermodilution, Fick, and clinical interpretation",
  level: "core",
  estimatedMinutes: 25,
};

const lesson06: Pick<HemodynamicsLesson, "id" | "slug" | "number" | "title" | "subtitle" | "level" | "estimatedMinutes"> = {
  id: "svr-afterload",
  slug: "svr-afterload",
  number: 6,
  title: "Systemic Vascular Resistance and Afterload",
  subtitle: "SVR interpretation, vasodilation vs vasoconstriction, vasopressor and inotrope implications",
  level: "core",
  estimatedMinutes: 25,
};

const lesson08: Pick<HemodynamicsLesson, "id" | "slug" | "number" | "title" | "subtitle" | "level" | "estimatedMinutes"> = {
  id: "hemodynamics-sepsis",
  slug: "sepsis",
  number: 8,
  title: "Hemodynamics in Sepsis",
  subtitle: "MAP targets, lactate clearance, fluid responsiveness, vasopressor titration",
  level: "clinical",
  estimatedMinutes: 30,
};

const lesson09: Pick<HemodynamicsLesson, "id" | "slug" | "number" | "title" | "subtitle" | "level" | "estimatedMinutes"> = {
  id: "hemodynamics-cardiogenic-shock",
  slug: "cardiogenic-shock",
  number: 9,
  title: "Hemodynamics in Heart Failure & Cardiogenic Shock",
  subtitle: "Low CI, high SVR, pulmonary congestion, inotropes, mechanical support",
  level: "advanced",
  estimatedMinutes: 35,
};

const lesson10: Pick<HemodynamicsLesson, "id" | "slug" | "number" | "title" | "subtitle" | "level" | "estimatedMinutes"> = {
  id: "hemodynamic-case-interpretation",
  slug: "case-interpretation",
  number: 10,
  title: "Hemodynamic Case Interpretation",
  subtitle: "Integrated reasoning from vitals, waveforms, and labs to clinical action",
  level: "mastery",
  estimatedMinutes: 40,
};

// ─── Lesson index ─────────────────────────────────────────────────────────────

/** Full lesson objects (lessons 1, 2, 3, 7 have complete content). */
export const HEMODYNAMICS_FULL_LESSONS: readonly HemodynamicsLesson[] = [
  lesson01,
  lesson02,
  lesson03,
  lesson07,
];

/** All lesson metadata in order (1–10). */
export const HEMODYNAMICS_LESSON_INDEX = [
  lesson01,
  lesson02,
  lesson03,
  lesson04,
  lesson05,
  lesson06,
  lesson07,
  lesson08,
  lesson09,
  lesson10,
] as const;

export function getHemodynamicsLessonBySlug(
  slug: string,
): HemodynamicsLesson | undefined {
  return HEMODYNAMICS_FULL_LESSONS.find((l) => l.slug === slug);
}

export function getHemodynamicsLessonMeta(number: number) {
  return HEMODYNAMICS_LESSON_INDEX.find((l) => l.number === number);
}

/** Validate that all required pedagogical fields are present on a full lesson. */
export function validateHemodynamicsLesson(lesson: HemodynamicsLesson): string[] {
  const errors: string[] = [];
  if (!lesson.overview?.clinicalSignificance) errors.push(`${lesson.id}: missing overview.clinicalSignificance`);
  if (!lesson.mechanism?.physiologicalBasis) errors.push(`${lesson.id}: missing mechanism.physiologicalBasis`);
  if (!lesson.normalRanges?.length) errors.push(`${lesson.id}: missing normalRanges`);
  if (!lesson.abnormalPatterns?.length) errors.push(`${lesson.id}: missing abnormalPatterns`);
  if (!lesson.nursingPriorities?.length) errors.push(`${lesson.id}: missing nursingPriorities`);
  if (!lesson.commonTraps?.length) errors.push(`${lesson.id}: missing commonTraps`);
  if (!lesson.notThisBecause?.length) errors.push(`${lesson.id}: missing notThisBecause`);
  if (!lesson.caseApplication?.question) errors.push(`${lesson.id}: missing caseApplication`);
  if (!lesson.practiceItems?.length) errors.push(`${lesson.id}: missing practiceItems`);
  if (lesson.practiceItems.some((p) => !p.rationale)) errors.push(`${lesson.id}: practice item missing rationale`);
  return errors;
>>>>>>> 492b93443 (feat(navigation): enhance hemodynamics and ECG discoverability in navigation)
}
