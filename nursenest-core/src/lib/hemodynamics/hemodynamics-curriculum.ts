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
}
