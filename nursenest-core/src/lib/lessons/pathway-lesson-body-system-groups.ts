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
  cardiovascular: "Heart, circulation, and vascular conditions — monitoring, chronic management, and safe care.",
  respiratory: "Airway, oxygen therapy, breathing support, and respiratory condition management.",
  "vital-signs": "Measuring, documenting, and recognizing abnormalities in temperature, pulse, respirations, blood pressure, and SpO₂.",
  neurological: "Neurological assessment, cognition, stroke care, seizure management, and CNS conditions.",
  "clinical-deterioration": "Recognizing change in patient status, escalating early, and responding safely within scope.",
  "infection-immunity": "Infection prevention, transmission-based precautions, hand hygiene, PPE, and anti-infective therapy.",
  pharmacology: "Medication rights, dosage calculations, drug classes, administration routes, and high-alert medication safety.",
  "special-populations": "Population-specific care: pediatric, maternal, newborn, geriatric, and mental health contexts.",
  "communication-safety": "Therapeutic communication, SBAR, documentation, delegation, scope of practice, and patient safety.",
  fundamentals: "Foundational clinical skills — skin care, wound care, elimination, hygiene, mobility, nutrition, and comfort.",
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

/**
 * Maps a single string (system or bodySystem field value) to a universal system label.
 * Returns "fundamentals" when no specific system matches — callers should chain with
 * `classifyLessonForHub` for richer lesson-level classification.
 */
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
  if (hasKeyword(normalizedSystem, ["special populations", "population-specific", "pediatric", "geriatric", "obstetric", "maternal", "newborn", "pregnancy", "maternity", "mental health", "psychosocial", "psych"])) {
    return "special-populations";
  }
  if (hasKeyword(normalizedSystem, ["communication", "handoff", "delegation", "documentation", "team communication", "safety"])) {
    return "communication-safety";
  }
  return "fundamentals";
}

/**
 * Numeric sort score for a lesson — higher = shown first within a system section.
 * Uses `examRelevance` when present; falls back to alphabetical tiebreak in callers.
 */
function lessonPriorityScore(lesson: PathwayLessonRecord): number {
  switch (lesson.examRelevance) {
    case "high_yield": return 3;
    case "core": return 2;
    case "specialty": return 1;
    default: return 2;
  }
}

/**
 * Full lesson-level classifier: uses the explicit `system` field first, then `bodySystem`,
 * then falls back to title/topic/topicSlug keyword matching. This correctly handles
 * catalog lessons where `system` is absent or set to a broad value like "General".
 */
export function classifyLessonForHub(lesson: PathwayLessonRecord): PathwayLessonSystemLabel {
  // 1. Explicit system key — trust it when it resolves to something specific
  if (lesson.system) {
    const bySystem = normalizePathwayLessonSystemLabel(lesson.system);
    if (bySystem !== "fundamentals") return bySystem;
  }

  // 2. bodySystem field — covers most catalog lessons
  if (lesson.bodySystem) {
    const byBodySystem = normalizePathwayLessonSystemLabel(lesson.bodySystem);
    if (byBodySystem !== "fundamentals") return byBodySystem;
  }

  // 3. Title / topic / slug keyword fallback — catches "General" and other broad categories
  const h = `${lesson.title} ${lesson.topic} ${lesson.topicSlug} ${lesson.seoDescription}`.toLowerCase();

  if (/vital.?sign|escalat|early.?warn|temperature|spo2|oxygen.?sat/.test(h)) return "vital-signs";
  if (/cardiovascular|cardiac|heart|hypertension|blood.?pressure|afib|atrial/.test(h)) return "cardiovascular";
  if (/respiratory|copd|asthma|oxygen|airway|breath|inhaler|nebulizer/.test(h)) return "respiratory";
  if (/neuro|stroke|seizure|cva|dementia|delirium|cogniti|alzheimer|parkinson/.test(h)) return "neurological";
  if (/deteriorat|unstable|clinical.?judgment|abcs|rapid.?response|case:.?choosing/.test(h)) return "clinical-deterioration";
  if (/infection|ppe|isolation|hand.?hygiene|precaution|mrsa|c.?diff|antibiotic|sterile/.test(h)) return "infection-immunity";
  if (/pharm|medic|drug|insulin|injection|dosage|calculation|high.?alert|anticoagul|antihypertensive|diuretic/.test(h)) return "pharmacology";
  if (/postpartum|newborn|matern|obstetric|prenatal|breastfeed|neonatal|contraception|pediatric|child|growth.?chart|immunization|mental.?health|psycho|depress|anxiety|dementia|suicid|substance.?use|de.?escalat/.test(h)) return "special-populations";
  if (/scope|delegat|document|sbar|handoff|shift.?report|communication|ethical|care.?coord|interprofession|restraint|falls?.?risk|incident|two.?identifier|patient.?id|report.?to.?rn|safety|prioritiz/.test(h)) return "communication-safety";

  return "fundamentals";
}

export function buildPathwayLessonSystemSections(lessons: PathwayLessonRecord[]): PathwayLessonSystemSection[] {
  const grouped = new Map<PathwayLessonSystemLabel, PathwayLessonRecord[]>();

  for (const lesson of lessons) {
    const label = classifyLessonForHub(lesson);
    const bucket = grouped.get(label) ?? [];
    bucket.push(lesson);
    grouped.set(label, bucket);
  }

  return PATHWAY_LESSON_SYSTEM_ORDER.flatMap((label) => {
    const sectionLessons = grouped.get(label);
    if (!sectionLessons?.length) return [];

    // Sort within each system: priority score descending, then title alphabetically
    const sorted = [...sectionLessons].sort((a, b) => {
      const scoreDiff = lessonPriorityScore(b) - lessonPriorityScore(a);
      if (scoreDiff !== 0) return scoreDiff;
      return a.title.localeCompare(b.title, undefined, { sensitivity: "base" });
    });

    return [
      {
        id: label,
        label: lessonSystemLabel(label),
        systemLabel: label,
        description: PATHWAY_LESSON_SYSTEM_DESCRIPTIONS[label],
        lessons: sorted,
        count: sorted.length,
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
