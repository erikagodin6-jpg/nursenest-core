export type ParamedicCardiologyLesson = {
  slug: string;
  title: string;
  level: "foundation" | "operational" | "advanced";
  estimatedMinutes: number;
  learningObjectives: string[];
  operationalFocus: string[];
  transportConsiderations: string[];
  ecgIntegration: string[];
  highRiskPitfalls: string[];
  scenarioLinks: string[];
  practiceTags: string[];
};

export const PARAMEDIC_CARDIOLOGY_FOUNDATIONS: readonly ParamedicCardiologyLesson[] = [
  {
    slug: "prehospital-acs-recognition",
    title: "Prehospital ACS Recognition and STEMI Priorities",
    level: "foundation",
    estimatedMinutes: 35,
    learningObjectives: [
      "Recognize unstable ACS presentations beyond classic chest pain.",
      "Connect ECG findings to transport urgency and perfusion status.",
      "Prioritize STEMI activation and reassessment during transport.",
    ],
    operationalFocus: [
      "time-sensitive reperfusion",
      "transport destination selection",
      "field reassessment",
    ],
    transportConsiderations: [
      "PCI-capable destination",
      "rural transport delays",
      "repeat ECG during transport",
    ],
    ecgIntegration: [
      "st-t-changes",
      "inferior STEMI",
      "anterior STEMI",
    ],
    highRiskPitfalls: [
      "Treating STEMI as stable chest pain",
      "Delayed STEMI alert activation",
      "Failure to reassess hypotension",
    ],
    scenarioLinks: ["inferior-stemi-rural-transport"],
    practiceTags: ["acs", "stemi", "transport", "ecg", "reassessment"],
  },
  {
    slug: "unstable-bradycardia-and-perfusion",
    title: "Unstable Bradycardia and Perfusion Failure",
    level: "operational",
    estimatedMinutes: 40,
    learningObjectives: [
      "Recognize when bradycardia is causing shock.",
      "Correlate LOC and skin signs with perfusion deterioration.",
      "Use reassessment to identify peri-arrest progression.",
    ],
    operationalFocus: [
      "perfusion assessment",
      "peri-arrest recognition",
      "transport escalation",
    ],
    transportConsiderations: [
      "ALS intercept decisions",
      "rapid transport during instability",
    ],
    ecgIntegration: [
      "complete-heart-block",
      "second-degree-block-type-2",
      "sinus-bradycardia",
    ],
    highRiskPitfalls: [
      "Treating monitor numbers without assessing perfusion",
      "Missing worsening mental status",
      "Delaying transport during instability",
    ],
    scenarioLinks: ["inferior-stemi-rural-transport"],
    practiceTags: ["bradycardia", "shock", "ecg", "perfusion", "transport"],
  },
  {
    slug: "wide-complex-tachycardia-prehospital",
    title: "Wide-Complex Tachycardia in the Field",
    level: "advanced",
    estimatedMinutes: 45,
    learningObjectives: [
      "Differentiate stable versus unstable tachycardia presentations.",
      "Default uncertain wide-complex tachycardias toward VT-safe thinking.",
      "Integrate ECG interpretation with transport urgency.",
    ],
    operationalFocus: [
      "unstable rhythm recognition",
      "field escalation",
      "rapid reassessment",
    ],
    transportConsiderations: [
      "closest appropriate destination",
      "peri-arrest preparation",
    ],
    ecgIntegration: [
      "ventricular-tachycardia",
      "wide-complex-tachycardia",
      "torsades",
    ],
    highRiskPitfalls: [
      "Assuming SVT with aberrancy without evidence",
      "Ignoring hypotension or confusion",
      "Delaying escalation during instability",
    ],
    scenarioLinks: ["unstable-wide-complex-transport"],
    practiceTags: ["vt", "tachycardia", "ecg", "unstable-rhythm", "acls"],
  },
];

export const PARAMEDIC_CARDIOLOGY_FOUNDATIONS_READINESS_PERCENT = 96;
