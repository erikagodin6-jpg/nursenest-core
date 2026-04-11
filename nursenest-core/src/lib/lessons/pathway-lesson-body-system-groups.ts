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
  label: string;
  systemLabel: PathwayLessonSystemLabel;
  description: string;
  lessons: PathwayLessonRecord[];
  count: number;
};

const MAX_LESSONS_PER_SECTION = 8;

export const PATHWAY_LESSON_SYSTEM_DESCRIPTIONS: Record<PathwayLessonSystemLabel, string> = {
  Fundamentals: "Core safety, assessment, and foundational care decisions.",
  Pharmacology: "Medication principles, dosing, and adverse-effect priorities.",
  Cardiovascular: "Hemodynamics, perfusion, rhythm, and cardiac emergencies.",
  Respiratory: "Airway, oxygenation, ventilation, and pulmonary disease care.",
  Neurological: "Neuro assessment, stroke, seizures, and CNS care priorities.",
  Gastrointestinal: "GI function, liver and pancreas disorders, and nutrition-linked care.",
  Renal: "Kidney function, fluids/electrolytes, and renal replacement concepts.",
  Endocrine: "Hormonal regulation, diabetes, thyroid, and metabolic control.",
  Musculoskeletal: "Bone, joint, mobility, and musculoskeletal injury management.",
  "Hematologic / Immune": "Blood disorders, clotting risks, and immune-mediated conditions.",
  Integumentary: "Skin integrity, wounds, burns, and pressure injury prevention.",
  Reproductive: "Gynecologic and reproductive health assessment and management.",
  "Maternity / Newborn": "Pregnancy, labor, postpartum, and newborn stabilization.",
  Pediatrics: "Infant, child, and adolescent-focused clinical care concepts.",
  "Mental Health": "Psychiatric assessment, crisis response, and therapeutic communication.",
  "Leadership / Community": "Delegation, prioritization, ethics, and community-level care.",
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
    return splitSystemSections(label, sectionLessons);
  });
}

function splitSystemSections(
  systemLabel: PathwayLessonSystemLabel,
  lessons: PathwayLessonRecord[],
): PathwayLessonSystemSection[] {
  const topicGroups = new Map<string, { topicLabel: string; lessons: PathwayLessonRecord[]; firstIndex: number }>();

  for (const [index, lesson] of lessons.entries()) {
    const topicLabel =
      lesson.topic?.trim() ||
      lesson.bodySystem?.trim() ||
      systemLabel;
    const topicKey = normalizeText(topicLabel) || normalizeText(systemLabel);
    if (!topicGroups.has(topicKey)) {
      topicGroups.set(topicKey, { topicLabel, lessons: [], firstIndex: index });
    }
    topicGroups.get(topicKey)!.lessons.push(lesson);
  }

  const orderedTopicGroups = [...topicGroups.values()].sort((a, b) => a.firstIndex - b.firstIndex);
  const chunks: PathwayLessonRecord[][] = [];
  let currentChunk: PathwayLessonRecord[] = [];

  for (const group of orderedTopicGroups) {
    let cursor = 0;
    while (cursor < group.lessons.length) {
      const room = MAX_LESSONS_PER_SECTION - currentChunk.length;
      if (room === 0) {
        chunks.push(currentChunk);
        currentChunk = [];
        continue;
      }

      const slice = group.lessons.slice(cursor, cursor + room);
      currentChunk = [...currentChunk, ...slice];
      cursor += slice.length;

      if (currentChunk.length === MAX_LESSONS_PER_SECTION) {
        chunks.push(currentChunk);
        currentChunk = [];
      }
    }
  }

  if (currentChunk.length > 0) chunks.push(currentChunk);

  const slugBase = systemLabel.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const usedLabels = new Map<string, number>();

  return chunks.map((chunk, index) => {
    const label = sectionLabelForSplit(systemLabel, chunk);
    const collisionCount = (usedLabels.get(label) ?? 0) + 1;
    usedLabels.set(label, collisionCount);
    const uniqueLabel = collisionCount > 1 ? `${label} (${collisionCount})` : label;

    return {
      id: chunks.length === 1 ? slugBase : `${slugBase}-${index + 1}`,
      label: uniqueLabel,
      systemLabel,
      description: PATHWAY_LESSON_SYSTEM_DESCRIPTIONS[systemLabel],
      lessons: chunk,
      count: chunk.length,
    };
  });
}

function sectionLabelForSplit(systemLabel: PathwayLessonSystemLabel, chunk: PathwayLessonRecord[]): string {
  const topicCounts = new Map<string, number>();
  for (const lesson of chunk) {
    const topic = lesson.topic?.trim();
    if (!topic) continue;
    if (normalizeText(topic) === normalizeText(systemLabel)) continue;
    topicCounts.set(topic, (topicCounts.get(topic) ?? 0) + 1);
  }

  const bestTopic = [...topicCounts.entries()].sort((a, b) => {
    if (b[1] !== a[1]) return b[1] - a[1];
    return a[0].localeCompare(b[0]);
  })[0]?.[0];

  if (!bestTopic) return systemLabel;
  return `${systemLabel} — ${bestTopic}`;
}
