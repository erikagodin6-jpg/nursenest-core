/**
 * Hemodynamics Monitoring — Canonical Lesson Curriculum
 *
 * This file intentionally keeps the public module contract small and stable:
 * - HEMODYNAMICS_LESSON_INDEX powers the module overview page.
 * - HEMODYNAMICS_FULL_LESSONS powers lesson previews and validation.
 * - getHemodynamicsLessonBySlug/getHemodynamicsLessonMeta are used by lesson routes.
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

type HemodynamicsLessonMeta = Pick<
  HemodynamicsLesson,
  "id" | "slug" | "number" | "title" | "subtitle" | "level" | "estimatedMinutes"
>;

const baseLesson = {
  overview: {
    clinicalSignificance:
      "Hemodynamic monitoring connects blood pressure, flow, resistance, preload, afterload, contractility, and oxygen delivery to bedside nursing decisions.",
    commonSettings: ["ICU", "cardiac care", "emergency department", "PACU", "step-down telemetry"],
    keyQuestion: "Is this patient delivering enough oxygenated blood to the tissues?",
  },
  mechanism: {
    physiologicalBasis:
      "Cardiac output depends on heart rate and stroke volume; stroke volume depends on preload, afterload, and contractility. Perfusion requires adequate pressure, flow, oxygen content, and microcirculatory delivery.",
    keyRelationships: [
      "CO = HR × SV",
      "MAP is influenced by CO and SVR",
      "Low blood pressure does not always equal low cardiac output",
      "Normal blood pressure does not always equal adequate perfusion",
    ],
    whyItLooksLikeThis:
      "Hemodynamic values shift in predictable patterns when the primary problem is volume, pump function, vascular tone, or obstruction.",
  },
  normalRanges: [
    { parameter: "MAP", value: "≥65", unit: "mmHg", clinicalNote: "Common minimum adult critical-care perfusion target; individual targets vary." },
    { parameter: "Cardiac index", value: "2.5–4.0", unit: "L/min/m²", clinicalNote: "Low values suggest impaired forward flow." },
    { parameter: "SVR", value: "800–1200", unit: "dynes·s/cm⁵", clinicalNote: "High suggests vasoconstriction; low suggests vasodilation." },
  ],
  abnormalPatterns: [
    {
      pattern: "Low CI with high SVR",
      direction: "abnormal" as const,
      causes: ["cardiogenic shock", "severe hypovolemia", "compensatory vasoconstriction"],
      clinicalMeaning: "Forward flow is low and the body is attempting to maintain pressure through vasoconstriction.",
    },
    {
      pattern: "High or normal CI with low SVR",
      direction: "abnormal" as const,
      causes: ["sepsis", "anaphylaxis", "neurogenic shock"],
      clinicalMeaning: "Distributive physiology with pathologic vasodilation and maldistributed perfusion.",
    },
  ],
  waveformOrMetricExplanation:
    "Before acting on a number, validate the device, waveform quality, patient position, transducer level, and clinical context.",
  nursingPriorities: [
    "Assess the patient before treating the monitor.",
    "Trend values instead of reacting to one isolated number.",
    "Validate line setup, transducer level, zeroing, and waveform quality.",
    "Escalate signs of poor perfusion: altered mentation, low urine output, rising lactate, cool skin, chest pain, or respiratory distress.",
  ],
  troubleshooting: [
    {
      problem: "Unexpected hemodynamic value",
      cause: "Artifact, position change, damping, line issue, or true deterioration",
      action: "Reassess patient, compare against another measurement source, and troubleshoot the monitoring system before titration.",
    },
  ],
  commonTraps: [
    "Equating blood pressure with perfusion.",
    "Giving fluids reflexively to every hypotensive patient.",
    "Ignoring waveform or device artifact.",
  ],
  notThisBecause: [
    {
      mimicker: "Simple hypotension",
      differentiator: "Shock classification requires perfusion signs, pressure, flow, resistance, volume status, and clinical context.",
    },
  ],
  caseApplication: {
    patientProfile: "Adult ICU patient with acute hypotension and worsening urine output.",
    vitals: "MAP 58, HR 118, RR 24, SpO₂ 94% on oxygen.",
    hemodynamicData: "Cardiac index, SVR, CVP/PAOP, lactate, and urine output must be interpreted together.",
    clinicalContext: "The patient may have volume loss, distributive shock, cardiogenic shock, or obstructive physiology.",
    question: "What pattern is present, and what intervention matches the underlying physiology?",
    reasoning:
      "Hemodynamic reasoning starts by deciding whether the primary failure is preload, pump, afterload/vascular tone, obstruction, or oxygen delivery.",
    nursingActions: [
      "Assess perfusion and airway/breathing/circulation.",
      "Validate monitoring accuracy.",
      "Notify the provider of trends and context.",
      "Prepare physiology-matched interventions as ordered.",
    ],
  },
  practiceItems: [
    {
      stem: "A patient has MAP 68 but new confusion and urine output 10 mL/hr. What is the safest interpretation?",
      choices: [
        "The patient is stable because MAP is above 65",
        "The patient may still have poor organ perfusion",
        "The patient must be fluid overloaded",
        "The monitor is definitely wrong",
      ],
      correct: 1 as const,
      rationale: "Organ perfusion signs can reveal shock even when a pressure target appears acceptable.",
      trapGuarded: "Treating a single MAP value as proof of adequate perfusion.",
    },
  ],
} satisfies Omit<
  HemodynamicsLesson,
  "id" | "slug" | "number" | "title" | "subtitle" | "level" | "estimatedMinutes"
>;

function fullLesson(meta: HemodynamicsLessonMeta, overrides: Partial<HemodynamicsLesson> = {}): HemodynamicsLesson {
  return {
    ...baseLesson,
    ...meta,
    ...overrides,
    overview: { ...baseLesson.overview, ...overrides.overview },
    mechanism: { ...baseLesson.mechanism, ...overrides.mechanism },
    caseApplication: { ...baseLesson.caseApplication, ...overrides.caseApplication },
  };
}

const lesson01 = fullLesson({
  id: "intro-hemodynamics",
  slug: "introduction",
  number: 1,
  title: "Introduction to Hemodynamics",
  subtitle: "Preload, afterload, contractility, cardiac output, and oxygen delivery",
  level: "foundation",
  estimatedMinutes: 25,
});

const lesson02 = fullLesson({
  id: "arterial-line-monitoring",
  slug: "arterial-lines",
  number: 2,
  title: "Arterial Line Monitoring",
  subtitle: "Waveform components, zeroing, square-wave test, damping, and nursing safety",
  level: "core",
  estimatedMinutes: 30,
});

const lesson03 = fullLesson({
  id: "cvp-monitoring",
  slug: "cvp",
  number: 3,
  title: "Central Venous Pressure Monitoring",
  subtitle: "Normal values, waveform interpretation, and fluid responsiveness limitations",
  level: "core",
  estimatedMinutes: 22,
});

const lesson04: HemodynamicsLessonMeta = {
  id: "pulmonary-artery-catheter",
  slug: "pa-catheter",
  number: 4,
  title: "Pulmonary Artery Catheter Basics",
  subtitle: "RA, RV, PA, and PAOP waveform progression from insertion to interpretation",
  level: "advanced",
  estimatedMinutes: 35,
};

const lesson05: HemodynamicsLessonMeta = {
  id: "cardiac-output-index",
  slug: "cardiac-output",
  number: 5,
  title: "Cardiac Output and Cardiac Index",
  subtitle: "CO, CI, SV, SVI, thermodilution, Fick, and clinical interpretation",
  level: "core",
  estimatedMinutes: 25,
};

const lesson06: HemodynamicsLessonMeta = {
  id: "svr-afterload",
  slug: "svr-afterload",
  number: 6,
  title: "Systemic Vascular Resistance and Afterload",
  subtitle: "SVR interpretation, vasodilation, vasoconstriction, vasopressors, and inotropes",
  level: "core",
  estimatedMinutes: 25,
};

const lesson07 = fullLesson({
  id: "shock-pattern-recognition",
  slug: "shock-patterns",
  number: 7,
  title: "Shock Pattern Recognition",
  subtitle: "Distributive, cardiogenic, hypovolemic, and obstructive shock profiles",
  level: "clinical",
  estimatedMinutes: 35,
});

const lesson08: HemodynamicsLessonMeta = {
  id: "hemodynamics-sepsis",
  slug: "sepsis",
  number: 8,
  title: "Hemodynamics in Sepsis",
  subtitle: "MAP targets, lactate clearance, fluid responsiveness, and vasopressor titration",
  level: "clinical",
  estimatedMinutes: 30,
};

const lesson09: HemodynamicsLessonMeta = {
  id: "hemodynamics-cardiogenic-shock",
  slug: "cardiogenic-shock",
  number: 9,
  title: "Hemodynamics in Heart Failure & Cardiogenic Shock",
  subtitle: "Low CI, high SVR, pulmonary congestion, inotropes, and mechanical support",
  level: "advanced",
  estimatedMinutes: 35,
};

const lesson10: HemodynamicsLessonMeta = {
  id: "hemodynamic-case-interpretation",
  slug: "case-interpretation",
  number: 10,
  title: "Hemodynamic Case Interpretation",
  subtitle: "Integrated reasoning from vitals, waveforms, and labs to clinical action",
  level: "mastery",
  estimatedMinutes: 40,
};

export const HEMODYNAMICS_FULL_LESSONS: readonly HemodynamicsLesson[] = [
  lesson01,
  lesson02,
  lesson03,
  lesson07,
];

export const HEMODYNAMICS_LESSON_INDEX: readonly (HemodynamicsLesson | HemodynamicsLessonMeta)[] = [
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
];

export function getHemodynamicsLessonBySlug(slug: string): HemodynamicsLesson | undefined {
  return HEMODYNAMICS_FULL_LESSONS.find((lesson) => lesson.slug === slug);
}

export function getHemodynamicsLessonById(id: string): HemodynamicsLesson | undefined {
  return HEMODYNAMICS_FULL_LESSONS.find((lesson) => lesson.id === id);
}

export function getHemodynamicsLessonMeta(number: number) {
  return HEMODYNAMICS_LESSON_INDEX.find((lesson) => lesson.number === number);
}

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
  if (lesson.practiceItems.some((item) => !item.rationale)) errors.push(`${lesson.id}: practice item missing rationale`);
  return errors;
}
