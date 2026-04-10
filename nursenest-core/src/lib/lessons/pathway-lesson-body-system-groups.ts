import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";

export const PATHWAY_LESSON_SYSTEM_ORDER = [
  "Fundamentals",
  "Pharmacology",
  "Cardiovascular",
  "Respiratory",
  "Neurological",
  "Gastrointestinal",
  "Renal",
  "Endocrine",
  "Musculoskeletal",
  "Hematologic / Immune",
  "Integumentary",
  "Reproductive",
  "Maternity / Newborn",
  "Pediatrics",
  "Mental Health",
  "Leadership / Community",
] as const;

export type PathwayLessonSystemLabel = (typeof PATHWAY_LESSON_SYSTEM_ORDER)[number];

export type PathwayLessonSystemSection = {
  id: string;
  label: PathwayLessonSystemLabel;
  lessons: PathwayLessonRecord[];
  count: number;
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
  bodySystem: string | null | undefined,
  ...hints: Array<string | null | undefined>
): PathwayLessonSystemLabel {
  const system = normalizeText(bodySystem);
  const combined = [system, ...hints.map(normalizeText)].filter(Boolean).join(" ");

  if (
    hasKeyword(combined, [
      "maternity",
      "maternal",
      "obstetric",
      "obstetrics",
      "postpartum",
      "antepartum",
      "intrapartum",
      "labor",
      "labour",
      "newborn",
      "neonate",
      "neonatal",
      "nicu",
    ])
  ) {
    return "Maternity / Newborn";
  }
  if (
    hasKeyword(combined, [
      "pediatric",
      "paediatric",
      "pediatrics",
      "paediatrics",
      "infant",
      "child",
      "children",
      "adolescent",
      "teen",
      "well-child",
    ])
  ) {
    return "Pediatrics";
  }
  if (
    hasKeyword(combined, [
      "leadership",
      "community",
      "public health",
      "delegation",
      "prioritization",
      "prioritisation",
      "care coordination",
      "case management",
      "ethic",
      "legal",
      "professional",
    ])
  ) {
    return "Leadership / Community";
  }
  if (hasKeyword(combined, ["mental health", "psychi", "behavioral", "behavioural", "anxiety", "depression", "ptsd"])) {
    return "Mental Health";
  }
  if (hasKeyword(combined, ["reproductive", "gynec", "gynaec", "contrace", "fertility", "stis", "pelvic"])) {
    return "Reproductive";
  }
  if (hasKeyword(combined, ["pharmacology", "medication", "dosing", "drug", "pharm"])) {
    return "Pharmacology";
  }
  if (hasKeyword(combined, ["cardio", "heart", "coronary", "arrhythm", "vascular", "shock"])) {
    return "Cardiovascular";
  }
  if (hasKeyword(combined, ["respir", "pulmonary", "airway", "copd", "asthma", "oxygen"])) {
    return "Respiratory";
  }
  if (hasKeyword(combined, ["neuro", "stroke", "seizure", "brain", "spinal", "neurologic"])) {
    return "Neurological";
  }
  if (hasKeyword(combined, ["gastro", "hepatic", "liver", "bowel", "pancrea", "abdomen", "gi "])) {
    return "Gastrointestinal";
  }
  if (hasKeyword(combined, ["renal", "kidney", "electrolyte", "fluid balance", "uti", "dialysis"])) {
    return "Renal";
  }
  if (hasKeyword(combined, ["endocrine", "diabetes", "thyroid", "adrenal", "pituitary"])) {
    return "Endocrine";
  }
  if (hasKeyword(combined, ["musculoskeletal", "ortho", "rheum", "bone", "joint", "fracture"])) {
    return "Musculoskeletal";
  }
  if (hasKeyword(combined, ["hematologic", "haematologic", "hematology", "immune", "blood", "coag", "oncolog"])) {
    return "Hematologic / Immune";
  }
  if (hasKeyword(combined, ["integument", "skin", "wound", "burn", "pressure injury"])) {
    return "Integumentary";
  }
  if (hasKeyword(system, ["infection control", "infection", "general", "fundamentals"])) {
    return "Fundamentals";
  }

  return "Fundamentals";
}

export function buildPathwayLessonSystemSections(lessons: PathwayLessonRecord[]): PathwayLessonSystemSection[] {
  const grouped = new Map<PathwayLessonSystemLabel, PathwayLessonRecord[]>();

  for (const lesson of lessons) {
    const label = normalizePathwayLessonSystemLabel(lesson.bodySystem, lesson.topic, lesson.title);
    const bucket = grouped.get(label) ?? [];
    bucket.push(lesson);
    grouped.set(label, bucket);
  }

  return PATHWAY_LESSON_SYSTEM_ORDER.flatMap((label) => {
    const sectionLessons = grouped.get(label);
    if (!sectionLessons?.length) return [];
    return [
      {
        id: label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
        label,
        lessons: sectionLessons,
        count: sectionLessons.length,
      },
    ];
  });
}
