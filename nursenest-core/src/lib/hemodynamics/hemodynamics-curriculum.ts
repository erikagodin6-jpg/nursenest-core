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

// ─── Lesson 4 — Pulmonary Artery Catheter Basics ─────────────────────────────

const lesson04: HemodynamicsLesson = {
  id: "pulmonary-artery-catheter",
  slug: "pa-catheter",
  number: 4,
  title: "Pulmonary Artery Catheter Basics",
  subtitle: "RA, RV, PA, and PAOP waveform progression — insertion to interpretation",
  level: "advanced",
  estimatedMinutes: 35,

  overview: {
    clinicalSignificance:
      "The pulmonary artery catheter (PAC), or Swan-Ganz catheter, is the only bedside tool that directly measures right-sided and pulmonary pressures, cardiac output by thermodilution, and mixed venous oxygen saturation simultaneously. In the right patient, it distinguishes cardiogenic from distributive shock, guides vasopressor vs inotrope selection, and answers the question 'is this pulmonary edema from the heart or the lungs?'",
    commonSettings: ["cardiogenic shock", "refractory septic shock requiring CO measurement", "complex post-cardiac surgery management", "severe ARDS vs cardiogenic pulmonary edema differentiation", "pulmonary hypertension evaluation"],
    keyQuestion: "What are the pressures on each side of the heart, what is the cardiac output, and are we treating the right problem?",
  },

  mechanism: {
    physiologicalBasis:
      "The PAC is floated from a central vein through the right heart and into the pulmonary artery using balloon inflation and cardiac flow. As the catheter advances, it crosses four anatomical positions — each with a characteristic pressure waveform. Once wedged (balloon inflated, pulmonary artery occluded), the distal tip measures pulmonary artery occlusion pressure (PAOP), which approximates left atrial pressure and left ventricular end-diastolic pressure when the mitral valve is open and there is no obstruction between the catheter tip and the left heart.",
    keyRelationships: [
      "RA position: low-amplitude a-c-v waveform, normal 2–8 mmHg",
      "RV position: high systolic (15–30), near-zero diastolic, no dicrotic notch — key differentiator from PA",
      "PA position: dicrotic notch present; PASP = RV systolic; PADP approximates PAOP in normal lungs",
      "PAOP (wedge): low-amplitude a-c-v; normal 6–12 mmHg; reflects LA pressure",
      "Thermodilution CO: cold/room temp saline injected into RA port → thermistor detects temp change at PA tip",
    ],
    whyItLooksLikeThis:
      "The dicrotic notch is the single most important waveform feature distinguishing PA position from RV position. RV diastolic pressure is near zero (compliant chamber with no downstream resistance); PA diastolic pressure is elevated (4–12 mmHg) because the pulmonary vascular bed maintains residual pressure between beats. Absence of the dicrotic notch in a 'PA-appearing' tracing means the catheter has migrated back into the RV — a dangerous situation requiring immediate repositioning.",
  },

  normalRanges: [
    { parameter: "RA pressure (CVP)", value: "2–8", unit: "mmHg", clinicalNote: "Right atrial pressure; elevated in RV failure, tamponade, fluid overload" },
    { parameter: "RV systolic", value: "15–30", unit: "mmHg", clinicalNote: "Should equal PASP; elevation = pulmonary hypertension or pulmonic stenosis" },
    { parameter: "RV diastolic", value: "0–8", unit: "mmHg", clinicalNote: "Near zero in normal RV; elevated in RV failure" },
    { parameter: "PA systolic (PASP)", value: "15–30", unit: "mmHg", clinicalNote: ">35 = pulmonary hypertension; mirrors RV systolic" },
    { parameter: "PA diastolic (PADP)", value: "4–12", unit: "mmHg", clinicalNote: "Approximates PAOP when PVR is normal; elevated in pulmonary HTN, ARDS" },
    { parameter: "MPAP (mean PA)", value: "9–20", unit: "mmHg", clinicalNote: ">25 = pulmonary hypertension; used to calculate PVR" },
    { parameter: "PAOP (wedge)", value: "6–12", unit: "mmHg", clinicalNote: ">18 = cardiogenic pulmonary edema; <6 = possible hypovolemia" },
    { parameter: "CO (thermodilution)", value: "4–8", unit: "L/min", clinicalNote: "Average 3 injections; discard outliers >10% apart" },
  ],

  abnormalPatterns: [
    {
      pattern: "PAOP >18 mmHg with low CO",
      direction: "high",
      causes: ["cardiogenic shock", "decompensated left heart failure", "mitral stenosis"],
      clinicalMeaning: "High left-sided filling pressure with poor output = pump failure and cardiogenic pulmonary edema. Avoid fluids; consider inotropes and diuresis.",
    },
    {
      pattern: "PAOP <6 mmHg with low CO",
      direction: "low",
      causes: ["hypovolemic shock", "distributive shock (early)", "over-diuresis"],
      clinicalMeaning: "Low filling pressure with low output = preload-dependent state. Volume challenge (with dynamic assessment) may improve CO.",
    },
    {
      pattern: "High PADP with normal PAOP (PADP–PAOP gradient >5)",
      direction: "abnormal",
      causes: ["ARDS", "pulmonary embolism", "pulmonary hypertension", "hypoxic pulmonary vasoconstriction"],
      clinicalMeaning: "Elevated pulmonary vascular resistance. Non-cardiogenic pulmonary edema if PAOP normal. PADP no longer reliable proxy for PAOP.",
    },
    {
      pattern: "RV waveform in PA position (no dicrotic notch)",
      direction: "abnormal",
      causes: ["catheter migration back to RV", "loop formation", "balloon deflated in RV"],
      clinicalMeaning: "Dangerous: RV perforation, arrhythmia risk. Notify provider immediately. Never inflate balloon in RV position.",
    },
  ],

  waveformOrMetricExplanation:
    "Thermodilution CO technique: inject exactly 10 mL iced or room-temperature normal saline rapidly and smoothly into the proximal (RA) port. The thermistor at the PA tip detects the temperature change and integrates the curve (Stewart-Hamilton equation). A normal curve rises sharply and descends smoothly to baseline — 3–4 injections at consistent points in the respiratory cycle, discard outliers, average the remainder. A flat or prolonged curve = low CO. A steep short curve = high CO or technical error (too-slow injection, injectate too warm).",

  nursingPriorities: [
    "Confirm catheter position at start of shift: check waveform morphology (dicrotic notch present = PA position)",
    "Never inflate the balloon with >1.5 mL air — use only supplied syringe; over-inflation risks pulmonary artery rupture",
    "Wedge time limit: inflate only until waveform changes to PAOP pattern; deflate immediately after reading — never >3 breaths or 8–15 seconds",
    "Never leave balloon inflated: pulmonary infarction occurs in minutes with sustained wedging",
    "Perform thermodilution CO measurements at consistent respiratory phase (end-expiration); average ≥3 values",
    "Monitor PA waveform continuously: spontaneous wedging (catheter migrated distally) appears as loss of PA pulsatility → notify provider",
    "Maintain catheter patency: continuous pressurized flush system at 300 mmHg",
    "Document all pressures at end-expiration; note ventilator settings (PEEP, FiO2) with every set of readings",
  ],

  troubleshooting: [
    { problem: "Spontaneous wedging (no balloon inflation, PAOP waveform appears)", cause: "Catheter migration distally into small PA branch", action: "Notify provider immediately. Do NOT inflate balloon. Patient may need catheter pull-back. Assess for chest pain." },
    { problem: "Unable to obtain PAOP on balloon inflation", cause: "Catheter too proximal, balloon rupture, or knotting", action: "Check balloon integrity (inject air and feel resistance — no resistance = rupture). Notify provider. Do not inject air if rupture suspected — use CO2." },
    { problem: "PA waveform loses dicrotic notch", cause: "Catheter migrated back to RV", action: "Notify provider immediately. RV position = arrhythmia and perforation risk. Prepare for repositioning." },
    { problem: "Thermodilution CO values vary widely (>10–15%)", cause: "Tricuspid regurgitation, arrhythmia, inconsistent injection technique, intracardiac shunt", action: "Standardize injection volume/speed/timing. Average 5+ values. Note rhythm and TR status. Alert provider to variability." },
  ],

  commonTraps: [
    "Confusing RV and PA waveforms — the dicrotic notch is the key: present in PA, absent in RV",
    "Leaving the balloon inflated — even 15–30 seconds of continuous wedging causes pulmonary infarction in the distal segment",
    "Over-inflating the balloon beyond 1.5 mL — pulmonary artery rupture, a rare but fatal complication",
    "Using PADP as a PAOP surrogate when PVR is elevated (ARDS, pulmonary HTN) — the PADP–PAOP gradient widens and PADP overestimates left-sided filling",
    "Injecting NaCl through the distal (PA) port — distal port is for PA pressure monitoring only, not medication infusions",
  ],

  notThisBecause: [
    {
      mimicker: "High PAOP (>18) = always give diuretics",
      differentiator: "In cardiogenic shock with MAP <65, diuresis must be balanced against preload. Excessive diuresis drops CO further. Inotropic support often needed before or alongside diuresis.",
    },
    {
      mimicker: "Normal PAOP = normal left heart function",
      differentiator: "In distributive shock, PAOP may be low-normal despite adequate cardiac function. Mitral stenosis falsely elevates PAOP without reflecting true LVEDP.",
    },
  ],

  caseApplication: {
    patientProfile: "61-year-old female, 6 hours post-anterior STEMI, transferred to cardiac ICU after PCI.",
    vitals: "BP 82/54 MAP 63, HR 114, RR 28, SpO2 90% on 60% FiO2, Temp 36.4°C",
    hemodynamicData: "PA pressures: 44/26, MPAP 32, PAOP 24. CO 2.8 L/min, CI 1.6 L/min/m², SVR 1640. CVP 16.",
    clinicalContext: "Bilateral crackles on auscultation. Urine output 12 mL/hr. Skin cool, mottled. Lactate 6.2 mmol/L.",
    question: "Interpret the hemodynamic profile and identify the two most dangerous nursing actions to avoid.",
    reasoning:
      "PAOP 24 + low CI (1.6) + high SVR = cardiogenic shock with significant pulmonary congestion. Pulmonary hypertension (MPAP 32) from elevated left-sided pressures backing up. Two most dangerous actions: (1) giving IV fluids — PAOP already 24, any volume will worsen pulmonary edema and desaturation; (2) leaving the PA balloon inflated after PAOP reading — causes pulmonary infarction. Correct actions: dobutamine for inotropic support, loop diuretic once MAP stabilized, continuous waveform monitoring for catheter position.",
    nursingActions: [
      "Notify intensivist and cardiology immediately — cardiogenic shock, PAOP 24",
      "Prepare dobutamine infusion (start 2.5 mcg/kg/min per anticipated order)",
      "Hold all IV fluid boluses — PAOP 24 contraindicates additional volume",
      "Deflate PA balloon immediately after PAOP reading; confirm return to PA waveform",
      "Increase FiO2; prepare for non-invasive or invasive ventilation if SpO2 not improving",
      "Strict hourly urine output; loop diuretic as ordered once MAP >65",
      "Continuous PA waveform monitoring — document position every hour",
    ],
  },

  practiceItems: [
    {
      stem: "While monitoring a patient's PA catheter, the nurse notes the waveform loses its dicrotic notch and shows high systolic with near-zero diastolic pressure. The correct action is:",
      choices: [
        "Inflate the balloon to 1.5 mL to obtain a wedge pressure reading",
        "Notify the provider — the catheter has migrated back to the RV position",
        "Increase the heparin flush rate to restore waveform quality",
        "Reposition the patient to the right lateral decubitus position",
      ],
      correct: 1,
      rationale:
        "Loss of the dicrotic notch with high systolic and near-zero diastolic = RV position. The catheter has migrated back into the right ventricle — a dangerous situation with arrhythmia and perforation risk. Inflating the balloon in the RV is contraindicated. Provider notification and catheter repositioning are required immediately.",
      trapGuarded: "Inflating the PA balloon in RV position (contraindicated — risk of rupture and arrhythmia)",
    },
    {
      stem: "A patient with cardiogenic shock has PAOP 22 mmHg and CI 1.5 L/min/m². The intensivist orders 500 mL NS bolus. The nurse's priority is:",
      choices: [
        "Administer the fluid bolus over 15 minutes as ordered",
        "Administer the bolus over 30 minutes to reduce speed",
        "Hold the bolus and report PAOP 22 with bilateral crackles before administering",
        "Administer 250 mL and reassess PAOP",
      ],
      correct: 2,
      rationale:
        "PAOP 22 mmHg indicates elevated left-sided filling pressure with pulmonary congestion. Administering additional fluid will worsen pulmonary edema, increase respiratory work, and risk acute respiratory failure. The nurse must report these findings and clarify the order — volume in cardiogenic shock with PAOP >18 is contraindicated unless there is specific clinical reason. This is a patient safety issue, not routine order questioning.",
      trapGuarded: "Administering fluids in cardiogenic shock with high PAOP without clinical correlation",
    },
  ],
};

// ─── Lesson 5 — Cardiac Output and Cardiac Index ──────────────────────────────

const lesson05: HemodynamicsLesson = {
  id: "cardiac-output-index",
  slug: "cardiac-output",
  number: 5,
  title: "Cardiac Output and Cardiac Index",
  subtitle: "CO, CI, thermodilution, Fick principle, and clinical interpretation",
  level: "core",
  estimatedMinutes: 25,

  overview: {
    clinicalSignificance:
      "Cardiac output (CO) is the volume of blood the heart pumps per minute. It is the single most important hemodynamic variable because it determines oxygen delivery to every organ. Blood pressure can appear normal while CO is critically low (cardiogenic shock with compensatory vasoconstriction). Recognizing low-output states from clinical clues — and understanding what CO measurement tells you — is essential for ICU and cardiac care nurses.",
    commonSettings: ["ICU with PA catheter", "cardiac surgery post-op", "cardiogenic shock titration", "septic shock with refractory hypotension", "hemodynamic optimization with non-invasive CO monitoring"],
    keyQuestion: "How much blood is the heart actually pumping, and is it enough to meet this patient's oxygen demand?",
  },

  mechanism: {
    physiologicalBasis:
      "CO = Heart Rate × Stroke Volume. Stroke volume is determined by preload, afterload, and contractility. A normal resting adult pumps 5–6 L/min. Cardiac Index (CI) = CO ÷ Body Surface Area, normalizing for body size. CI <2.2 L/min/m² defines the hemodynamic threshold for cardiogenic shock. The body compensates for low CO by increasing heart rate, increasing SVR (vasoconstriction), and extracting more oxygen from blood — all measurable signs that CO is inadequate.",
    keyRelationships: [
      "CO = HR × SV (L/min)",
      "CI = CO ÷ BSA (L/min/m²); normal 2.5–4.0",
      "SV = CO ÷ HR × 1000 (mL/beat); normal 60–100 mL",
      "Low CO → compensatory ↑HR, ↑SVR, ↑O2 extraction (↓SvO2/ScvO2)",
      "Thermodilution CO: cold saline → thermistor integration (Stewart-Hamilton)",
      "Fick CO = VO2 ÷ (CaO2 − CvO2) × 10",
    ],
    whyItLooksLikeThis:
      "Thermodilution works because a temperature change is a reliable tracer of blood flow. The faster the blood flows (high CO), the faster the cold injectate is swept past the thermistor — creating a short, peaked temperature-time curve. Low CO creates a broad, prolonged curve. The area under the curve is inversely proportional to CO: smaller area = higher CO, larger area = lower CO.",
  },

  normalRanges: [
    { parameter: "Cardiac output", value: "4–8", unit: "L/min", clinicalNote: "Average adult at rest ~5–6 L/min; increases 3–4× with exercise" },
    { parameter: "Cardiac index", value: "2.5–4.0", unit: "L/min/m²", clinicalNote: "CI <2.2 = cardiogenic shock threshold; <1.8 = severe shock" },
    { parameter: "Stroke volume", value: "60–100", unit: "mL/beat", clinicalNote: "SV = CO ÷ HR × 1000" },
    { parameter: "Stroke volume index", value: "33–47", unit: "mL/beat/m²", clinicalNote: "SVI = CI ÷ HR × 1000; BSA-normalized SV" },
  ],

  abnormalPatterns: [
    {
      pattern: "Low CO + high SVR",
      direction: "low",
      causes: ["cardiogenic shock", "severe hypovolemia (compensated)", "hypothermia"],
      clinicalMeaning: "Pump failing or underfilled; body compensates with vasoconstriction. Classic cardiogenic or compensated hypovolemic profile. Cool extremities, narrow pulse pressure, oliguria.",
    },
    {
      pattern: "High CO + low SVR",
      direction: "high",
      causes: ["septic shock", "anaphylaxis", "neurogenic shock", "liver failure", "hyperthyroidism"],
      clinicalMeaning: "Hyperdynamic distributive state. Heart pumping supranormally to compensate for vasodilation. Despite high CO, MAP remains low because SVR is critically reduced.",
    },
    {
      pattern: "Low CO + low SVR",
      direction: "abnormal",
      causes: ["late septic shock with myocardial depression", "combined cardiogenic + distributive", "terminal shock"],
      clinicalMeaning: "Pump failure AND vasodilation simultaneously — highest mortality pattern. Requires both inotrope and vasopressor support. CO and MAP both critically impaired.",
    },
  ],

  waveformOrMetricExplanation:
    "Thermodilution technique (3-injection method): Use 10 mL iced or room-temperature saline. Inject smoothly and rapidly (<4 seconds) through the proximal (RA) port at a consistent point in the respiratory cycle (end-expiration preferred). Perform 3–4 measurements and average values within 10–15% of each other; discard outliers. Causes of falsely low CO readings: tricuspid regurgitation (injectate recirculates), intracardiac shunts, injectate too warm. Causes of falsely high CO: slow injection, injectate cooler than expected, improper port use.",

  nursingPriorities: [
    "Perform thermodilution measurements at end-expiration for consistency; average ≥3 valid readings",
    "Report CI <2.2 promptly — this meets hemodynamic criteria for cardiogenic shock regardless of BP",
    "Correlate CO/CI with clinical markers: urine output, lactate, mentation, skin temperature, cap refill",
    "When CO is high with low MAP (distributive): focus on SVR support (vasopressors), not inotropes",
    "When CO is low with high SVR (cardiogenic/hypovolemic): identify cause — pump, preload, or obstruction",
    "Document CO/CI with simultaneous HR, MAP, CVP, and ventilator settings for context",
    "Recheck after every major intervention (fluid, vasopressor, inotrope, diuretic)",
  ],

  troubleshooting: [
    { problem: "Widely variable CO values (>15% between injections)", cause: "Arrhythmia, tricuspid regurgitation, inconsistent injection technique, intracardiac shunt", action: "Average more injections (5+), standardize injection speed, note rhythm, alert provider to variability and possible TR" },
    { problem: "CO appears falsely high despite clinical low-output signs", cause: "Warm injectate, slow injection, TR recirculation", action: "Use iced saline to increase signal-to-noise ratio; improve injection technique; correlate clinically (ScvO2, lactate, urine output)" },
    { problem: "Non-invasive CO monitor reading inconsistent with clinical picture", cause: "Arrhythmia, poor signal quality, calibration error", action: "Verify device calibration, assess waveform quality, cross-reference with clinical markers" },
  ],

  commonTraps: [
    "Assuming normal MAP means normal CO — cardiogenic shock can have MAP 65+ with CI 1.5 due to compensatory vasoconstriction",
    "Giving inotropes for high CO distributive shock — the problem is vasodilation, not pump failure; adding inotrope worsens tachycardia without improving SVR",
    "Using CI <2.2 as the only cardiogenic shock criterion — clinical signs (lactate, UO, skin) must accompany the number",
    "Performing thermodilution in rapid atrial fibrillation without averaging enough readings — CO varies beat-to-beat; average 5+ injections",
    "Confusing CO (absolute L/min) with CI (L/min/m²) — a small patient with CO 3.5 may have CI 2.8 (normal); always index for body size",
  ],

  notThisBecause: [
    {
      mimicker: "High CO in sepsis = patient is hemodynamically fine",
      differentiator: "Septic shock patients often have CO 8–12 L/min, but MAP is critically low because SVR is near zero. High CO is compensatory, not reassuring. Tissue perfusion remains impaired.",
    },
    {
      mimicker: "Low CO always needs a fluid bolus",
      differentiator: "Low CO from pump failure (cardiogenic) worsens with fluids when PAOP is already elevated. Identify mechanism first: if low preload → fluid; if pump failure → inotrope ± vasopressor.",
    },
  ],

  caseApplication: {
    patientProfile: "74-year-old male, known ischemic cardiomyopathy (EF 20%), admitted for decompensated HF.",
    vitals: "BP 98/66 MAP 77, HR 108 sinus tachycardia, RR 26, SpO2 91% on 4L NC.",
    hemodynamicData: "CO 3.2 L/min, CI 1.8 L/min/m², SVR 1520, CVP 18, PAOP 22. Lactate 3.1 mmol/L.",
    clinicalContext: "Skin cool and clammy. Urine output 14 mL/hr. Jugular venous distension at 45°. Bilateral crackles.",
    question: "The MAP is 77 — should the nurse reassure the team that perfusion is adequate? Justify using CI and other markers.",
    reasoning:
      "MAP 77 is acceptable, but CI 1.8 (<2.2 = cardiogenic shock threshold) means the heart is not pumping enough to meet demand. The compensatory high SVR (1520) is artificially maintaining MAP by vasoconstricting. Clinical correlation confirms: elevated lactate (2.2), low UO (14 mL/hr), cool skin, JVD, crackles. This is cardiogenic shock with a preserved-appearing BP — a classic dangerous trap. The nurse should report CI 1.8, lactate, and clinical signs together — NOT be reassured by MAP 77.",
    nursingActions: [
      "Report CI 1.8 with clinical correlation to intensivist — this meets cardiogenic shock criteria",
      "Prepare dobutamine infusion per anticipated order (inotropic support for low CI)",
      "Hold IV fluid boluses — PAOP 22 contraindicates volume",
      "Strict hourly urine output with Foley; document trend",
      "Obtain 12-lead ECG — rule out new ischemic event driving decompensation",
      "Repeat lactate in 2 hours to track trend",
      "Continuous hemodynamic monitoring; alert provider for MAP <65 or further CI drop",
    ],
  },

  practiceItems: [
    {
      stem: "A post-cardiac surgery patient has MAP 72, HR 94, CO 3.1 L/min, CI 1.9 L/min/m², skin cool and mottled, urine output 10 mL/hr, lactate 4.8 mmol/L. The nurse correctly identifies this as:",
      choices: [
        "Hemodynamically stable — MAP 72 is within normal range",
        "Distributive shock — high lactate indicates sepsis",
        "Cardiogenic shock — CI below 2.2 with signs of end-organ hypoperfusion despite acceptable MAP",
        "Hypovolemic shock — urine output is low indicating volume depletion",
      ],
      correct: 2,
      rationale:
        "CI 1.9 (<2.2) with clinical markers of hypoperfusion (mottled skin, low UO, elevated lactate) = cardiogenic shock, even with MAP 72. The acceptable MAP reflects compensatory vasoconstriction (high SVR), not adequate perfusion. This is the classic 'normal BP, low output' trap. The nurse must report CI <2.2 with clinical signs — not be reassured by MAP.",
      trapGuarded: "Equating normal MAP with adequate cardiac output — cardiogenic shock can maintain MAP through vasoconstriction",
    },
    {
      stem: "When performing thermodilution cardiac output measurements, the nurse obtains three values: 4.2, 5.8, and 4.4 L/min. What is the correct action?",
      choices: [
        "Average all three values: CO = 4.8 L/min",
        "Discard the outlier (5.8) and average 4.2 and 4.4",
        "Discard the 5.8 outlier, obtain two more readings, and average values within 10–15% of each other",
        "Use the middle value (4.4) as the most accurate single measurement",
      ],
      correct: 2,
      rationale:
        "The 5.8 value is >15% higher than the 4.2 and 4.4 readings — it should be discarded as an outlier (likely slow injection or injectate too warm). Two valid readings are insufficient for reliable averaging. The correct approach is to obtain ≥3 consistent readings (within 10–15% of each other) and average them. Using outlier values can dangerously misguide treatment decisions.",
      trapGuarded: "Including outlier thermodilution values in the CO average — leads to false reassurance or inappropriate treatment",
    },
  ],
};

// ─── Lesson 6 — SVR and Afterload ─────────────────────────────────────────────

const lesson06: HemodynamicsLesson = {
  id: "svr-afterload",
  slug: "svr-afterload",
  number: 6,
  title: "Systemic Vascular Resistance and Afterload",
  subtitle: "SVR calculation, vasodilation vs vasoconstriction patterns, and vasopressor/vasodilator implications",
  level: "core",
  estimatedMinutes: 25,

  overview: {
    clinicalSignificance:
      "Systemic vascular resistance (SVR) is the afterload against which the left ventricle pumps with every beat. It determines how hard the heart must work to maintain cardiac output. Critically low SVR (distributive shock) causes refractory hypotension despite normal or high CO. Critically high SVR (cardiogenic/hypovolemic) maintains blood pressure while sacrificing peripheral perfusion. Understanding SVR directs the single most important vasoactive drug decision in the ICU: vasopressor or vasodilator?",
    commonSettings: ["vasopressor titration in septic shock", "afterload reduction in cardiogenic shock/heart failure", "post-cardiac surgery hemodynamic management", "distinguishing shock types by hemodynamic profile"],
    keyQuestion: "Is the SVR too high (vasoconstriction compensating for low output) or too low (vasodilation causing refractory hypotension)?",
  },

  mechanism: {
    physiologicalBasis:
      "SVR = (MAP − CVP) × 80 ÷ CO. This formula expresses vascular resistance as the pressure drop from arteries to veins, divided by flow. SVR is regulated by arteriolar smooth muscle tone, which is controlled by the sympathetic nervous system, vasoactive hormones (angiotensin II, vasopressin, catecholamines), local metabolic signals, and inflammatory mediators. Vasodilation (low SVR): smooth muscle relaxes, arterioles dilate, resistance falls, blood pools in the periphery. Vasoconstriction (high SVR): smooth muscle contracts, arterioles narrow, MAP is supported but organ perfusion may be impaired at the microvascular level.",
    keyRelationships: [
      "SVR = (MAP − CVP) × 80 ÷ CO (dynes·s/cm⁵)",
      "MAP = CO × SVR/80 + CVP (simplified)",
      "Low SVR: distributive shock — sepsis, anaphylaxis, neurogenic, liver failure",
      "High SVR: cardiogenic shock (compensatory), hypovolemia (compensatory), vasopressor excess",
      "Vasopressor effect: ↑SVR → ↑MAP; may ↓CO in failing heart if afterload increases further",
      "Vasodilator effect: ↓SVR → ↓MAP; may ↑CO in heart failure (reduced afterload improves ejection)",
    ],
    whyItLooksLikeThis:
      "In distributive shock, inflammatory mediators (TNF-α, IL-1, nitric oxide) disable smooth muscle contraction, causing profound vasodilation. SVR falls to 300–500 dynes·s/cm⁵ (vs. normal 800–1200), and even a hyperdynamic CO of 9 L/min cannot maintain MAP against nearly absent resistance. In cardiogenic shock, the failing heart reflexively activates the sympathetic system, driving SVR to 1600–2000+ — a compensatory response that maintains MAP but at the cost of catastrophically reduced organ perfusion.",
  },

  normalRanges: [
    { parameter: "SVR", value: "800–1200", unit: "dynes·s/cm⁵", clinicalNote: "Normal arteriolar tone; adjust treatment targets per clinical context" },
    { parameter: "SVRI (indexed)", value: "1970–2390", unit: "dynes·s·m²/cm⁵", clinicalNote: "BSA-normalized SVR; comparable across body sizes" },
    { parameter: "PVR (pulmonary)", value: "20–130", unit: "dynes·s/cm⁵", clinicalNote: "Right heart afterload; elevated in pulmonary HTN, ARDS, PE" },
  ],

  abnormalPatterns: [
    {
      pattern: "SVR <600 with low MAP",
      direction: "low",
      causes: ["septic shock", "anaphylaxis", "neurogenic shock", "cirrhotic liver failure", "vasodilator overdose"],
      clinicalMeaning: "Critical vasodilation. Heart may be pumping well (high CO) but MAP collapses because resistance is near zero. Requires vasopressors (norepinephrine first-line) to restore SVR and MAP.",
    },
    {
      pattern: "SVR >1600 with low CO",
      direction: "high",
      causes: ["cardiogenic shock", "severe hypovolemia", "hypothermia", "vasopressor excess"],
      clinicalMeaning: "Compensatory vasoconstriction. Body is sacrificing peripheral perfusion to support central MAP. In cardiogenic shock, reducing SVR (afterload reduction) may improve CO. Excess vasopressor-driven SVR worsens cardiac work.",
    },
    {
      pattern: "SVR >1600 with normal or high CO",
      direction: "high",
      causes: ["vasopressor excess", "extreme pain/anxiety (catecholamine surge)", "pheochromocytoma", "severe hypertensive emergency"],
      clinicalMeaning: "Pathological vasoconstriction with intact pump. Afterload is excessively high, increasing myocardial oxygen demand. May require vasodilator therapy if not clinically indicated vasopressor.",
    },
  ],

  waveformOrMetricExplanation:
    "SVR is not directly measured — it is calculated from MAP, CVP, and CO. This means SVR accuracy depends on accuracy of all three inputs. Common error sources: incorrect MAP from overdamped A-line (underestimates MAP → underestimates SVR); CVP measurement error; single thermodilution CO reading without averaging. Clinical proxy for SVR at the bedside: skin temperature and pulse quality. Warm, bounding pulses = low SVR (vasodilation). Cool, clammy skin with faint thready pulses = high SVR (vasoconstriction). These physical signs often correlate better with moment-to-moment SVR changes than calculated values.",

  nursingPriorities: [
    "Recognize high-SVR state clinically: cool extremities, clammy skin, faint pulses, narrow pulse pressure — report these alongside calculated SVR",
    "Recognize low-SVR state clinically: warm/flushed skin, bounding pulses, wide pulse pressure with low MAP — vasopressor indication",
    "When titrating norepinephrine: target MAP ≥65 (or per order), avoid SVR >1800 (excess afterload worsens cardiac output in failing hearts)",
    "When afterload reducing in HF/cardiogenic shock: use MAP as the floor — never reduce SVR below the point that MAP drops under 60",
    "Document calculated SVR with each CO measurement set; trend alongside MAP, CO/CI, and clinical perfusion markers",
    "Reassess SVR calculation after any change in vasopressor dose, fluid administration, or vasoactive drug adjustment",
  ],

  troubleshooting: [
    { problem: "Calculated SVR inconsistent with clinical picture (e.g., SVR 'normal' but patient is warm/vasodilated)", cause: "A-line overdamping falsely lowering MAP estimate, or CO measurement outlier", action: "Repeat square-wave test on A-line; repeat thermodilution CO (average 3+); use clinical skin/pulse signs as corroborating data" },
    { problem: "SVR rising despite vasopressor reduction", cause: "Worsening cardiac output (pump failure), pain, hypothermia, or unrecognized hemorrhage", action: "Assess CO/CI; check temperature; reassess clinical picture for new etiology" },
    { problem: "SVR falling despite vasopressor escalation", cause: "Vasopressin-deficient state, inadequately treated septic source, adrenal insufficiency, massive anaphylaxis", action: "Add vasopressin 0.03–0.04 units/min; consider hydrocortisone 200 mg/day; ensure source control; check epinephrine if anaphylaxis" },
  ],

  commonTraps: [
    "Giving more vasopressor for persistent low MAP without checking CO — if CO is also falling (cardiogenic component), increasing SVR further worsens cardiac work and downstream ischemia",
    "Reducing afterload (vasodilators) in distributive shock with low SVR — will precipitously drop MAP in a patient already critically vasodilated",
    "Using skin temperature alone to assess SVR without correlating with MAP and CO — early cardiogenic shock can have warm skin if sympathetic response is blunted",
    "Forgetting that SVR calculation errors compound — a wrong CO and a wrong MAP create a doubly wrong SVR; always validate each input",
  ],

  notThisBecause: [
    {
      mimicker: "High SVR = patient needs volume (vasoconstriction = hypovolemia)",
      differentiator: "High SVR also occurs in cardiogenic shock as a compensatory response. CVP, PAOP, and CO/CI distinguish volume depletion (low CVP/PAOP, may respond to fluids) from pump failure (high CVP/PAOP, needs inotrope).",
    },
    {
      mimicker: "Low SVR = always needs vasopressors immediately",
      differentiator: "In anaphylaxis, epinephrine is first-line (not norepinephrine) because it also reverses bronchospasm and mast cell mediators. In neurogenic shock, phenylephrine may be preferred to avoid tachycardia. Mechanism determines the correct vasopressor.",
    },
  ],

  caseApplication: {
    patientProfile: "48-year-old female, 36-hour post-spinal cord injury at T4, in the neurological ICU.",
    vitals: "BP 72/38, MAP 49, HR 52, RR 18, SpO2 97% on room air, Temp 36.2°C.",
    hemodynamicData: "CO 6.4 L/min, CI 3.8 L/min/m², SVR 440, CVP 4.",
    clinicalContext: "Skin warm and dry. No fever, no infection source. No ongoing bleeding. Urine output 40 mL/hr. Lactate 1.4 mmol/L.",
    question: "Identify the shock type, the mechanism of low SVR, and the correct vasopressor choice.",
    reasoning:
      "Neurogenic shock: high CO (pump intact), very low SVR (loss of sympathetic tone from cord injury), bradycardia (loss of sympathetic cardiac acceleration), warm dry skin. Distinguished from sepsis by: bradycardia, no fever, no infection source, normal lactate. Vasopressor of choice: phenylephrine (pure α1 agonist) or norepinephrine — phenylephrine preferred if tachycardia must be avoided (but this patient is bradycardic, so NE reasonable). Avoid dobutamine — CO already high. Atropine or cardiac pacing if bradycardia is symptomatic.",
    nursingActions: [
      "Notify provider with full hemodynamic data: SVR 440, CO 6.4, bradycardia — neurogenic shock pattern",
      "Prepare phenylephrine infusion (first-line in neurogenic shock to avoid worsening bradycardia)",
      "Titrate vasopressor to MAP ≥85 per spinal cord injury protocol (higher MAP target to protect cord perfusion)",
      "Continuous cardiac monitoring — bradycardia may require atropine or temporary pacing",
      "Warm environment and warming blankets — hypothermia risk from poikilothermia in spinal cord injury",
      "Do NOT give IV fluid boluses as primary treatment — SVR is the problem, not volume",
      "Hourly neurological assessment and documentation of cord level",
    ],
  },

  practiceItems: [
    {
      stem: "A patient in septic shock has MAP 54, CO 9.8 L/min, CI 5.2 L/min/m², SVR 310, warm flushed skin, and bounding pulses. The priority intervention is:",
      choices: [
        "Dobutamine 5 mcg/kg/min to improve cardiac contractility",
        "500 mL crystalloid bolus for volume loading",
        "Norepinephrine infusion titrated to MAP ≥65 to restore SVR",
        "Epinephrine 0.5 mg IM for suspected anaphylaxis",
      ],
      correct: 2,
      rationale:
        "This is distributive (septic) shock: high CO, low SVR, low MAP. The pump is working; the vasculature is failing. The correct intervention is a vasopressor (norepinephrine first-line per Surviving Sepsis guidelines) to restore SVR and MAP. Dobutamine increases CO that is already supranormal and worsens tachycardia. Fluid alone cannot fix vasodilation. Epinephrine is first-line for anaphylaxis, not sepsis.",
      trapGuarded: "Using inotropes for distributive shock — the problem is SVR, not contractility",
    },
    {
      stem: "SVR is calculated as 1880 dynes·s/cm⁵ in a patient with cardiogenic shock and CI 1.7 L/min/m². The nurse understands this elevated SVR indicates:",
      choices: [
        "The patient should receive a vasopressor to further increase SVR",
        "The patient is volume depleted and requires a fluid bolus",
        "The body is compensating via vasoconstriction; afterload reduction may improve CO in this failing heart",
        "SVR >1800 is normal in post-cardiac surgery patients and requires no action",
      ],
      correct: 2,
      rationale:
        "In cardiogenic shock, the failing heart triggers sympathetic activation → high SVR (compensatory vasoconstriction) to maintain MAP. This high afterload actually impairs the already-failing ventricle further. Careful afterload reduction (nitroglycerin, sodium nitroprusside, or milrinone) can decrease SVR and improve CO — but only when MAP is adequate to tolerate vasodilation. Adding more vasopressor drives SVR higher and worsens cardiac work.",
      trapGuarded: "Adding vasopressor to already high SVR in cardiogenic shock — worsens pump failure",
    },
  ],
};

// ─── Lesson 8 — Hemodynamics in Sepsis ───────────────────────────────────────

const lesson08: HemodynamicsLesson = {
  id: "hemodynamics-sepsis",
  slug: "sepsis",
  number: 8,
  title: "Hemodynamics in Sepsis",
  subtitle: "MAP targets, lactate clearance, fluid responsiveness, and vasopressor titration",
  level: "clinical",
  estimatedMinutes: 30,

  overview: {
    clinicalSignificance:
      "Septic shock is the most common cause of distributive shock in the ICU and carries 30–50% mortality. Its hemodynamic signature — high CO, low SVR, low MAP — is the opposite of cardiogenic shock, requiring an opposite treatment strategy: vasopressors over inotropes, and evidence-based fluid resuscitation over reflexive bolusing. Every hour of delayed vasopressor initiation and antibiotic administration increases mortality. Hemodynamic competency in sepsis directly saves lives.",
    commonSettings: ["ICU/medical ICU", "emergency department sepsis alert", "post-operative sepsis", "onco-hematology unit", "step-down/HDU with rapid response activation"],
    keyQuestion: "Is MAP adequate for organ perfusion, is lactate clearing, and what vasopressor dose and fluid strategy will achieve this?",
  },

  mechanism: {
    physiologicalBasis:
      "Sepsis triggers a massive inflammatory cascade (TNF-α, IL-1, IL-6, nitric oxide) that causes widespread arteriolar vasodilation, capillary leak, and mitochondrial dysfunction. SVR falls dramatically. The heart initially compensates by increasing CO (hyperdynamic phase). But tissue perfusion remains impaired due to microcirculatory dysfunction — blood bypasses capillary beds, oxygen extraction fails, and lactate rises from anaerobic metabolism. Late septic shock adds myocardial depression (IL-1, TNF-α directly suppress contractility), converting the picture to combined low-SVR + low-CO.",
    keyRelationships: [
      "Early/hyperdynamic sepsis: ↓SVR + ↑CO + ↓MAP — warm, flushed, bounding",
      "Late septic cardiomyopathy: ↓SVR + ↓CO + ↓MAP — worst prognosis",
      "Lactate >2 mmol/L = tissue hypoperfusion marker; >4 = high mortality threshold",
      "Surviving Sepsis 1-hour bundle: cultures, antibiotics, 30 mL/kg crystalloid, vasopressors for MAP <65",
      "MAP target: ≥65 mmHg (≥80 in chronic hypertension or TBI per some protocols)",
      "ScvO2 >70%: adequate delivery-consumption balance; <65% = ↑extraction (delivery failing)",
    ],
    whyItLooksLikeThis:
      "Norepinephrine (NE) is the first-line vasopressor in septic shock because it has strong α1 (vasoconstriction → ↑SVR) with modest β1 (modest ↑HR and contractility). It corrects the primary problem (low SVR) without driving dangerous tachycardia. Vasopressin is added (not substituted) when NE requirements exceed 0.25–0.4 mcg/kg/min — it acts on V1 receptors independently of the adrenergic system, which is often depleted in prolonged sepsis.",
  },

  normalRanges: [
    { parameter: "MAP target (septic shock)", value: "≥65", unit: "mmHg", clinicalNote: "≥80 for chronic HTN patients; individualize per response" },
    { parameter: "Lactate (target)", value: "<2", unit: "mmol/L", clinicalNote: "Clearance ≥10%/2 hours is the resuscitation target; trend matters" },
    { parameter: "ScvO2 (target)", value: "≥70", unit: "%", clinicalNote: "<65 = oxygen delivery insufficient; >80 in sepsis may reflect impaired cellular O2 utilization" },
    { parameter: "Urine output target", value: "≥0.5", unit: "mL/kg/hr", clinicalNote: "Oliguria persisting despite MAP ≥65 suggests AKI or ongoing hypoperfusion" },
    { parameter: "NE dose (typical range)", value: "0.01–0.5", unit: "mcg/kg/min", clinicalNote: ">0.25 = refractory; consider adding vasopressin and assessing for adrenal insufficiency" },
  ],

  abnormalPatterns: [
    {
      pattern: "Persistent lactate >4 despite MAP ≥65",
      direction: "abnormal",
      causes: ["microcirculatory dysfunction", "mitochondrial failure", "inadequate CO (late cardiomyopathy)", "ongoing ischemia", "liver failure with impaired lactate clearance"],
      clinicalMeaning: "Macrocirculatory targets (MAP) met, but tissue perfusion still inadequate. Reassess CO/CI, look for unresolved source, consider additional vasopressor or dobutamine if CI is low.",
    },
    {
      pattern: "NE requirement escalating rapidly",
      direction: "abnormal",
      causes: ["inadequate source control", "adrenal insufficiency", "vasopressin deficiency", "worsening cardiac depression", "unreplaced blood loss"],
      clinicalMeaning: "Refractory vasoplegic shock. Add vasopressin 0.03–0.04 units/min. Consider hydrocortisone 200 mg/day. Assess CO: if CI falling, add dobutamine.",
    },
    {
      pattern: "High ScvO2 (>80%) despite ongoing shock",
      direction: "abnormal",
      causes: ["cellular O2 utilization failure (mitochondrial dysfunction)", "arteriovenous shunting", "catheter malposition sampling arterial blood"],
      clinicalMeaning: "Oxygen is being delivered but cells cannot use it — metabolic shock. ScvO2 is NOT reassuring here. Lactate, clinical perfusion, and CO guide management, not ScvO2 alone.",
    },
  ],

  waveformOrMetricExplanation:
    "Passive Leg Raise (PLR) as fluid responsiveness test: with patient supine, raise both legs to 45° for 60–90 seconds. This shifts ~300 mL of venous blood from legs to central circulation — an autologous fluid challenge. Measure CO or pulse pressure before and after. A rise in CO ≥10–15% (or pulse pressure ≥9–10%) = fluid responsive. PLR is valid in spontaneously breathing patients (unlike PPV/SVV). Critically: return legs to horizontal and observe for CO returning to baseline — confirms the effect was truly preload-mediated.",

  nursingPriorities: [
    "Obtain blood cultures (2 sets from 2 sites) BEFORE antibiotics — do not delay antibiotics >45 minutes for culture collection",
    "Administer antibiotics within 1 hour of septic shock recognition — document time",
    "Begin 30 mL/kg crystalloid (250–500 mL boluses with reassessment, not one large infusion) within 3 hours",
    "Start norepinephrine for MAP <65 despite initial fluid resuscitation — do not wait for full volume load if MAP is critically low",
    "Reassess fluid responsiveness after each bolus using dynamic measures (PLR, PPV, SVV, IVC collapsibility)",
    "Monitor lactate every 2 hours until <2; report non-clearing lactate to intensivist",
    "Add vasopressin when NE >0.25–0.4 mcg/kg/min per order; document dose escalation",
    "Assess and report signs of late cardiomyopathy: falling CO, worsening lactate, cool extremities despite adequate MAP",
  ],

  troubleshooting: [
    { problem: "MAP not responding to NE escalation", cause: "Vasopressin depletion, adrenal insufficiency, inadequate source control, intravascular volume deficit", action: "Add vasopressin 0.03 units/min per order; consider hydrocortisone; ensure cultures + antibiotics + source control; reassess volume status dynamically" },
    { problem: "Fluid resuscitation worsening respiratory status (rising airway pressures, falling SpO2)", cause: "Volume overload, ARDS development, cardiogenic component", action: "Stop fluids; reassess fluid responsiveness; alert provider; prepare for NIV/intubation if SpO2 declining" },
    { problem: "Lactate not clearing despite adequate MAP", cause: "Liver failure (impaired clearance), ongoing tissue ischemia, late cardiomyopathy", action: "Measure CO/CI; assess for new cardiomyopathy; check LFTs; report to intensivist with full hemodynamic picture" },
  ],

  commonTraps: [
    "Delaying vasopressors to 'complete fluid resuscitation first' — MAP <65 causes organ ischemia; start NE and fluids concurrently",
    "Stopping fluids after 30 mL/kg regardless of fluid responsiveness — reassess each bolus; some patients need more, some none",
    "Interpreting high ScvO2 in sepsis as 'adequate delivery' — cellular utilization failure elevates ScvO2 despite ongoing tissue hypoperfusion",
    "Reducing vasopressor when MAP first hits 65 — wait for lactate clearance and clinical improvement, not just one MAP reading",
    "Using dopamine instead of NE — RCTs show dopamine has higher arrhythmia rates with no mortality benefit; NE is first-line",
  ],

  notThisBecause: [
    {
      mimicker: "Warm, flushed, high-CO patient — must be hemodynamically OK",
      differentiator: "Warm distributive septic shock has critically low MAP and rising lactate despite the hyperdynamic appearance. High CO in sepsis is compensatory, not reassuring. Treat MAP and lactate, not the skin.",
    },
    {
      mimicker: "NE is pushing MAP too high, so reduce it",
      differentiator: "MAP 70–75 during vasopressor therapy is appropriate to ensure organ perfusion. Reducing NE prematurely to 'save the heart from tachycardia' risks re-dropping MAP and worsening ischemia. Titrate to MAP target, not to limit vasopressor dose.",
    },
  ],

  caseApplication: {
    patientProfile: "67-year-old male, admitted from ED with urinary source septic shock. Now 4 hours into ICU stay.",
    vitals: "MAP 61 on NE 0.18 mcg/kg/min. HR 118, SpO2 94% on 4L NC, Temp 39.2°C.",
    hemodynamicData: "CO 9.8 L/min, CI 5.1 L/min/m², SVR 340. CVP 8. ScvO2 82%. Lactate 4.8 → 3.6 mmol/L (improving).",
    clinicalContext: "Received 3L crystalloid over 4 hours. PLR test negative (CO unchanged). Urine output 28 mL/hr. Bilateral clear breath sounds. Cultures drawn; antibiotics given at hour 1.",
    question: "The team asks whether more fluid is indicated. What is the nursing response and what is the next vasopressor step?",
    reasoning:
      "PLR negative = not fluid responsive. CO 9.8 L/min is supranormal (distributive profile). Adding more fluid will cause volume overload without improving CO or MAP. The problem is SVR 340 (vasodilation) — the correct escalation is vasopressor. MAP still below 65 on NE 0.18: titrate NE toward MAP 65, or add vasopressin at 0.03 units/min per order (NE still below 0.25 threshold but MAP unresponsive). Lactate is clearing (4.8→3.6) — good sign. Document PLR result and rationale for withholding fluids.",
    nursingActions: [
      "Report PLR-negative result to intensivist — fluid is not indicated",
      "Titrate NE upward per order to achieve MAP ≥65",
      "Prepare vasopressin infusion 0.03 units/min per anticipated order",
      "Continue antibiotics and confirm source control plan (urology consult for urosepsis)",
      "Recheck lactate in 2 hours — trend toward clearance is encouraging",
      "Monitor for fluid overload signs: rising airway pressures, worsening SpO2, peripheral edema",
      "Document NE dose escalation with rationale and MAP response",
    ],
  },

  practiceItems: [
    {
      stem: "A septic shock patient has MAP 58 despite 3L crystalloid. The nurse prepares to start norepinephrine. A colleague says 'wait until we finish the 30 mL/kg.' The correct response is:",
      choices: [
        "Agree — complete the fluid resuscitation protocol before starting vasopressors",
        "Start norepinephrine concurrently — prolonged MAP <65 causes organ ischemia; fluids and vasopressors are not mutually exclusive",
        "Reduce the fluid rate and start vasopressin as an alternative to norepinephrine",
        "Wait 30 minutes and reassess MAP before considering vasopressors",
      ],
      correct: 1,
      rationale:
        "Surviving Sepsis Guidelines recommend starting norepinephrine when MAP <65 persists despite initial fluid resuscitation — vasopressors and fluids run concurrently, not sequentially. Waiting for 30 mL/kg completion while MAP remains 58 allows ongoing organ ischemia. Norepinephrine is first-line; vasopressin is added, not substituted at this point.",
      trapGuarded: "Delaying vasopressors to complete a fluid protocol — organ ischemia occurs during every minute of MAP <65",
    },
    {
      stem: "A septic shock patient has ScvO2 of 83%, MAP 68 on NE 0.12 mcg/kg/min, lactate 4.2 mmol/L, and urine output 15 mL/hr. The nurse correctly interprets the ScvO2 as:",
      choices: [
        "Reassuring — ScvO2 >70% means oxygen delivery is adequate",
        "Falsely elevated — high ScvO2 in sepsis may reflect impaired cellular O2 utilization, not adequate delivery",
        "Indicating the need to reduce FiO2, as the patient is being over-oxygenated",
        "Suggesting the central venous catheter is malpositioned in arterial blood",
      ],
      correct: 1,
      rationale:
        "In septic shock, high ScvO2 (>80%) despite ongoing hypoperfusion (lactate 4.2, oliguria) indicates mitochondrial dysfunction — cells cannot extract and use the oxygen being delivered. This is a critical trap: do not use ScvO2 >70% to declare resuscitation complete while lactate remains elevated and urine output is low. All perfusion markers must normalize together.",
      trapGuarded: "Using high ScvO2 to stop resuscitation despite persistent lactate elevation and oliguria",
    },
  ],
};

// ─── Lesson 9 — Hemodynamics in Heart Failure & Cardiogenic Shock ─────────────

const lesson09: HemodynamicsLesson = {
  id: "hemodynamics-cardiogenic-shock",
  slug: "cardiogenic-shock",
  number: 9,
  title: "Hemodynamics in Heart Failure & Cardiogenic Shock",
  subtitle: "Low CI, high SVR, pulmonary congestion, inotropes, and mechanical circulatory support",
  level: "advanced",
  estimatedMinutes: 35,

  overview: {
    clinicalSignificance:
      "Cardiogenic shock (CS) carries 40–50% in-hospital mortality even with modern care. It is the hemodynamic emergency where identifying and managing the correct targets — CI, PAOP, SVR, MAP — is the difference between survival and death. The two cardinal errors are: giving fluids to a volume-overloaded failing heart, and withholding inotropic support while waiting for BP to drop further. Early recognition of the low-CO, high-SVR, high-PAOP pattern drives every correct intervention.",
    commonSettings: ["acute MI complicated by CS (most common cause)", "decompensated heart failure (new or chronic)", "myocarditis", "post-cardiac surgery low-output syndrome", "valvular emergency (acute MR, AS)"],
    keyQuestion: "Is the heart unable to generate adequate output, and how do we support it without worsening pulmonary congestion?",
  },

  mechanism: {
    physiologicalBasis:
      "Cardiogenic shock = pump failure → ↓CO → ↓oxygen delivery to tissues. The body compensates by activating the renin-angiotensin-aldosterone system and sympathetic nervous system → ↑SVR (vasoconstriction) and ↑HR. This partially maintains MAP but dramatically worsens the failing heart's afterload (more SVR = harder for the sick ventricle to eject → further CO reduction: the 'vicious cycle of cardiogenic shock'). Simultaneously, reduced LV emptying → elevated LV end-diastolic pressure → elevated LA pressure → elevated PAOP → pulmonary edema → hypoxia → further myocardial ischemia.",
    keyRelationships: [
      "CS criteria: CI <2.2 L/min/m² + signs of hypoperfusion (lactate, oliguria, cool skin) ± MAP <65",
      "High PAOP (>18): pulmonary congestion — no fluid; treat with inotrope + careful diuresis",
      "High SVR (>1600): excessive afterload — worsens LV ejection; afterload reduction may ↑CO if MAP tolerates",
      "Dobutamine: β1 agonist → ↑contractility, ↑CO, ↑HR; first-line inotrope in CS",
      "Milrinone: PDE-3 inhibitor → ↑CO + vasodilation; use with caution in hypotension (↓SVR + ↓MAP)",
      "IABP: diastolic augmentation → ↑coronary perfusion; modest CO improvement (~0.5 L/min)",
      "Impella: transvalvular pump → directly unloads LV; larger CO improvement (up to +2–3 L/min)",
    ],
    whyItLooksLikeThis:
      "The classic 'wet and cold' cardiogenic shock profile: wet (PAOP >18 → pulmonary edema → crackles, hypoxia, bilateral infiltrates) + cold (low CO → poor perfusion → cool clammy skin, mottling, faint pulses, oliguria). The high SVR explains the paradox of acceptable MAP despite terrible CO — the body squeezes blood pressure out of vasoconstriction at the expense of peripheral organ perfusion.",
  },

  normalRanges: [
    { parameter: "CI threshold (CS)", value: "<2.2", unit: "L/min/m²", clinicalNote: "Hemodynamic criterion for cardiogenic shock; <1.8 = severe" },
    { parameter: "PAOP in CS", value: ">18", unit: "mmHg", clinicalNote: "Elevated left-sided filling; >22–24 = moderate-severe pulmonary edema" },
    { parameter: "SVR in CS", value: "1600–2200+", unit: "dynes·s/cm⁵", clinicalNote: "Compensatory vasoconstriction; may support MAP while worsening pump afterload" },
    { parameter: "MAP minimum (inotrope/vasopressor threshold)", value: "65", unit: "mmHg", clinicalNote: "Must maintain ≥65 before vasodilating; if <65, vasopressor first" },
    { parameter: "Dobutamine starting dose", value: "2.5–5", unit: "mcg/kg/min", clinicalNote: "Titrate by 2.5 mcg/kg/min every 30 min; max 20 mcg/kg/min; monitor HR and arrhythmias" },
  ],

  abnormalPatterns: [
    {
      pattern: "CI <2.2 + PAOP >18 + high SVR ('wet and cold')",
      direction: "abnormal",
      causes: ["acute MI", "decompensated HF (EF <25%)", "myocarditis", "peripartum cardiomyopathy"],
      clinicalMeaning: "Classic cardiogenic shock. Inotrope (dobutamine) for CO support. Judicious diuresis for PAOP reduction. Vasopressor (NE) if MAP <65. No fluids.",
    },
    {
      pattern: "CI <2.2 + low PAOP + high SVR ('dry and cold')",
      direction: "abnormal",
      causes: ["RV failure dominant", "relative hypovolemia in CS (over-diuresis)", "early CS before congestion develops"],
      clinicalMeaning: "Low preload variant — limited cautious fluid may be appropriate (unlike wet CS). RV failure: avoid fluids if CVP already high; RV-specific support.",
    },
    {
      pattern: "Worsening hypoxia with stable MAP in decompensated HF",
      direction: "abnormal",
      causes: ["rising PAOP (→18–25) before BP drops", "preclinical CS", "flash pulmonary edema (acute MR, HTN emergency)"],
      clinicalMeaning: "PAOP rising before CO falls and MAP drops — early window. Treat pulmonary congestion urgently (diuresis, NPPV) to prevent full CS development.",
    },
  ],

  waveformOrMetricExplanation:
    "The hemodynamic Forrester classification (from PA catheter data) stratifies heart failure into four quadrants: (1) Normal CI + Normal PAOP = normal; (2) Low CI + High PAOP = 'wet and cold' = CS; (3) Normal/High CI + High PAOP = 'wet and warm' = decompensated HF without shock; (4) Low CI + Low PAOP = 'dry and cold' = hypovolemic component or RV failure. Each quadrant has a distinct treatment strategy, making this the most clinically useful hemodynamic framework for heart failure management.",

  nursingPriorities: [
    "Do NOT administer IV fluid boluses when PAOP >18 — this is the most dangerous intervention in CS",
    "Prepare dobutamine as an anticipated order in any CI <2.2 with signs of hypoperfusion",
    "Titrate dobutamine to CI improvement, NOT to a target heart rate — acceptable HR increase is a side effect",
    "If MAP <65 despite dobutamine, add norepinephrine (not vasopressin alone, not phenylephrine) to maintain perfusion pressure",
    "Continuous PA waveform monitoring if PA catheter in situ — trend PAOP and CO/CI every 1–2 hours",
    "Obtain 12-lead ECG for new ischemia — STEMI-associated CS requires emergent reperfusion (PCI), not just hemodynamic support",
    "Hourly urine output; loop diuretic as ordered once MAP ≥65 — target PAOP reduction to <18",
    "Prepare for mechanical circulatory support escalation (IABP, Impella) — alert cardiac team if CI failing to respond to pharmacotherapy",
  ],

  troubleshooting: [
    { problem: "Dobutamine not improving CI", cause: "Inadequate dose, severe pump failure beyond inotropic compensation, arrhythmia (dobutamine-induced AF/VT), or ischemia worsening", action: "Titrate dose; obtain 12-lead ECG; check K/Mg for arrhythmia prevention; notify intensivist/cardiology; escalate MCS evaluation" },
    { problem: "MAP dropping after dobutamine initiation", cause: "Dobutamine's mild vasodilatory effect lowering SVR in a patient dependent on high SVR to maintain MAP", action: "Add NE to restore MAP; do not discontinue dobutamine — CI support is critical; titrate both simultaneously" },
    { problem: "CI improving but PAOP not falling", cause: "Insufficient diuresis, worsening mitral regurgitation, or fluid administration elsewhere", action: "Escalate loop diuretic dose per order; reassess fluid balance; check for new MR (new murmur); restrict all non-essential IV fluids" },
  ],

  commonTraps: [
    "Giving fluids to a CS patient with MAP 62 'to support preload' — PAOP is already elevated; fluids worsen pulmonary edema and hypoxia",
    "Waiting for MAP to fall below 65 to start dobutamine — the inotrope indication is low CI with hypoperfusion, not just a MAP number",
    "Using milrinone as first-line inotrope when MAP is borderline — milrinone also vasodilates (drops SVR and MAP); dobutamine is preferred when MAP is tenuous",
    "Stopping NE when MAP hits 65 during concurrent dobutamine infusion — MAP may fall again as dobutamine vasodilates; titrate NE alongside dobutamine",
    "Missing STEMI-associated CS — inotropes buy time, but reperfusion (emergent PCI) is the definitive treatment; hemodynamic support without reperfusion has poor outcome",
  ],

  notThisBecause: [
    {
      mimicker: "Low BP in CS = needs vasopressin",
      differentiator: "Vasopressin alone raises SVR but doesn't improve CO — it may worsen afterload on the failing heart. NE is preferred for vasopressor support in CS because it has modest β1 effects that modestly improve contractility alongside the α1-mediated SVR increase. Vasopressin is added as an adjunct, not first-line.",
    },
    {
      mimicker: "Cardiogenic shock = always wet (volume overloaded)",
      differentiator: "'Dry and cold' CS exists — RV failure, early CS, or CS after aggressive diuresis may have low-normal PAOP with low CI. PAOP must be measured or estimated before reflexively restricting all fluids. Underfilling an RV-dominant CS patient worsens RV preload and CI.",
    },
  ],

  caseApplication: {
    patientProfile: "59-year-old male, inferior STEMI, PCI completed 2 hours ago (door-to-balloon 68 minutes). Now in cardiac ICU.",
    vitals: "BP 86/58 MAP 67, HR 108, RR 30, SpO2 89% on 50% FiO2, Temp 36.3°C.",
    hemodynamicData: "CO 2.4 L/min, CI 1.3 L/min/m², SVR 1920, PAOP 26, CVP 14. Lactate 5.4 mmol/L.",
    clinicalContext: "Bilateral crackles on auscultation. Skin cold, mottled to knees. Urine output 6 mL/hr last 2 hours. Troponin markedly elevated. Echo: EF 20%, moderate RV dilation.",
    question: "State the correct hemodynamic management strategy. What is the one intervention that would most immediately worsen this patient?",
    reasoning:
      "CS profile: CI 1.3 (<2.2), PAOP 26 (severe pulmonary congestion), SVR 1920 (compensatory vasoconstriction), MAP marginally adequate at 67. Most dangerous intervention: IV fluid bolus — PAOP already 26, additional volume will flood the pulmonary circulation and cause acute respiratory failure. Management: dobutamine 2.5–5 mcg/kg/min for CI support; loop diuretic (furosemide) to reduce PAOP once MAP stable; NE to maintain MAP if dobutamine drops SVR too much; consider urgent IABP or Impella given CI 1.3 (profound shock); RV dilation warrants avoiding RV preload reduction too aggressively.",
    nursingActions: [
      "Prepare dobutamine infusion — notify intensivist of CI 1.3 immediately",
      "Do NOT administer IV fluid boluses under any circumstances — PAOP 26 is contraindication",
      "Administer loop diuretic (furosemide 40–80 mg IV) per anticipated order; target PAOP <18",
      "Increase FiO2; prepare for CPAP/BiPAP or intubation if SpO2 not improving with positioning",
      "Monitor for arrhythmias continuously — dobutamine increases arrhythmia risk; check K+ and Mg2+",
      "Alert cardiac catheterization team for potential Impella escalation — CI 1.3 is profound CS",
      "Obtain 12-lead ECG: rule out re-occlusion; document troponin trend",
      "Repeat lactate in 2 hours; report non-clearance immediately",
    ],
  },

  practiceItems: [
    {
      stem: "A patient in cardiogenic shock has CI 1.6 L/min/m², PAOP 24, MAP 66. The nurse's priority action is:",
      choices: [
        "Administer a 250 mL IV fluid bolus to maintain preload",
        "Prepare dobutamine infusion and notify the provider of CI 1.6 with PAOP 24",
        "Start vasopressin to increase SVR and MAP",
        "Reduce FiO2 — SpO2 is 94% and the patient is at risk for O2 toxicity",
      ],
      correct: 1,
      rationale:
        "CI 1.6 (<2.2) with PAOP 24 = cardiogenic shock with severe pulmonary congestion. The correct intervention is inotropic support (dobutamine) to improve CO, not fluids (PAOP 24 contraindicates volume). MAP 66 is adequate to start dobutamine. Vasopressin raises SVR without improving CO — worsens cardiac afterload. Notify provider immediately with the full hemodynamic picture.",
      trapGuarded: "Giving fluids to maintain preload when PAOP is already critically elevated",
    },
    {
      stem: "A patient on dobutamine for cardiogenic shock develops MAP of 58. The correct addition to the treatment plan is:",
      choices: [
        "Stop dobutamine — it is causing hypotension",
        "Add norepinephrine to restore MAP while maintaining dobutamine for CO support",
        "Start a rapid 500 mL NS bolus to restore preload and MAP",
        "Switch to milrinone for better vasodilatory afterload reduction",
      ],
      correct: 1,
      rationale:
        "Dobutamine has mild vasodilatory properties that may reduce SVR enough to drop MAP. The correct action is NOT to stop dobutamine (the patient needs the inotropic support for CI) but to ADD norepinephrine to restore MAP — this allows simultaneous CO improvement and MAP maintenance. Fluids are still contraindicated if PAOP is elevated. Milrinone has stronger vasodilatory effects than dobutamine and would further drop MAP in this already hypotensive patient.",
      trapGuarded: "Stopping the inotrope when MAP drops — the correct response is dual-agent therapy (inotrope + vasopressor)",
    },
  ],
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

/** Full lesson objects with complete clinical content. */
export const HEMODYNAMICS_FULL_LESSONS: readonly HemodynamicsLesson[] = [
  lesson01,
  lesson02,
  lesson03,
  lesson04,
  lesson05,
  lesson06,
  lesson07,
  lesson08,
  lesson09,
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
}
