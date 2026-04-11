import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";

export const PATHWAY_LESSON_SYSTEM_ORDER = [
  "cardiovascular",
  "respiratory",
  "vital-signs",
  "neurological",
  "clinical-deterioration",
  "infection-immunity",
  "pharmacology",
  "special-populations",
  "communication-safety",
  "fundamentals",
] as const;

export type PathwayLessonSystemLabel = (typeof PATHWAY_LESSON_SYSTEM_ORDER)[number];

export type PathwayLessonSystemSection = {
  id: string;
  label: string;
  systemLabel: PathwayLessonSystemLabel;
  description: string;
  lessons: PathwayLessonRecord[];
  count: number;
};

export const PATHWAY_LESSON_SYSTEM_DESCRIPTIONS: Record<PathwayLessonSystemLabel, string> = {
  cardiovascular: "Cardiac perfusion, rhythm, and hemodynamic management.",
  respiratory: "Airway, ventilation, oxygenation, and pulmonary care.",
  "vital-signs": "Interpretation of trends in temperature, pulse, blood pressure, and oxygenation.",
  neurological: "Neuro assessment, cognition, stroke, seizure, and CNS priorities.",
  "clinical-deterioration": "Early recognition and escalation for unstable clinical states.",
  "infection-immunity": "Infectious processes, immune response, isolation, and sepsis care.",
  pharmacology: "Medication selection, safety checks, dosing, and adverse effects.",
  "special-populations": "Population-specific care across age, pregnancy, and comorbidity contexts.",
  "communication-safety": "Handoffs, documentation, delegation, and patient safety communication.",
  fundamentals: "Core assessment, safety, and foundational clinical decision rules.",
};

function normalizeText(value: string | null | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

function hasKeyword(haystack: string, keywords: readonly string[]): boolean {
  const tokenized = ` ${haystack.replace(/[^a-z0-9]+/g, " ")} `;
  return keywords.some((keyword) => {
    const normalizedKeyword = normalizeText(keyword);
    if (!normalizedKeyword) return false;
    if (normalizedKeyword.includes(" ") || normalizedKeyword.length <= 4) {
      return tokenized.includes(` ${normalizedKeyword} `);
    }
    return haystack.includes(normalizedKeyword) || tokenized.includes(` ${normalizedKeyword} `);
  });
}

export function normalizePathwayLessonSystemLabel(
  system: string | null | undefined,
): PathwayLessonSystemLabel {
  const normalizedSystem = normalizeText(system);
  if (!normalizedSystem) return "fundamentals";

  if (hasKeyword(normalizedSystem, ["cardiovascular", "cardio", "heart", "hemodynamic", "vascular"])) {
    return "cardiovascular";
  }
  if (hasKeyword(normalizedSystem, ["respiratory", "pulmonary", "airway", "ventilation", "oxygenation"])) {
    return "respiratory";
  }
  if (hasKeyword(normalizedSystem, ["vital signs", "vitals", "blood pressure", "temperature", "pulse", "spo2", "oxygen saturation"])) {
    return "vital-signs";
  }
  if (hasKeyword(normalizedSystem, ["neurological", "neurologic", "neuro", "stroke", "seizure", "cns"])) {
    return "neurological";
  }
  if (hasKeyword(normalizedSystem, ["clinical deterioration", "deterioration", "critical care", "rapid response", "shock", "unstable"])) {
    return "clinical-deterioration";
  }
  if (hasKeyword(normalizedSystem, ["infection", "infectious", "immunity", "immune", "sepsis", "isolation"])) {
    return "infection-immunity";
  }
  if (hasKeyword(normalizedSystem, ["pharmacology", "medication", "med safety", "drug", "pharm"])) {
    return "pharmacology";
  }
  if (hasKeyword(normalizedSystem, ["special populations", "population-specific", "pediatric", "geriatric", "obstetric", "maternal", "newborn", "pregnancy"])) {
    return "special-populations";
  }
  if (hasKeyword(normalizedSystem, ["communication", "safety", "handoff", "delegation", "documentation", "team communication"])) {
    return "communication-safety";
  }
  return "fundamentals";
}

export function buildPathwayLessonSystemSections(lessons: PathwayLessonRecord[]): PathwayLessonSystemSection[] {
  const grouped = new Map<PathwayLessonSystemLabel, PathwayLessonRecord[]>();

  for (const lesson of lessons) {
    const label = normalizePathwayLessonSystemLabel(lesson.system);
    const bucket = grouped.get(label) ?? [];
    bucket.push(lesson);
    grouped.set(label, bucket);
  }

  return PATHWAY_LESSON_SYSTEM_ORDER.flatMap((label) => {
    const sectionLessons = grouped.get(label);
    if (!sectionLessons?.length) return [];
    return [
      {
        id: label,
        label: lessonSystemLabel(label),
        systemLabel: label,
        description: PATHWAY_LESSON_SYSTEM_DESCRIPTIONS[label],
        lessons: sectionLessons,
        count: sectionLessons.length,
      },
    ];
  });
}

function lessonSystemLabel(key: PathwayLessonSystemLabel): string {
  switch (key) {
    case "cardiovascular":
      return "Cardiovascular";
    case "respiratory":
      return "Respiratory";
    case "vital-signs":
      return "Vital Signs";
    case "neurological":
      return "Neurological";
    case "clinical-deterioration":
      return "Clinical Deterioration";
    case "infection-immunity":
      return "Infection & Immunity";
    case "pharmacology":
      return "Pharmacology";
    case "special-populations":
      return "Special Populations";
    case "communication-safety":
      return "Communication & Safety";
    default:
      return "Fundamentals";
  }
}
