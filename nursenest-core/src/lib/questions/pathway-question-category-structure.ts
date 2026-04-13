export type QuestionSubcategoryId =
  | "cardiovascular"
  | "respiratory"
  | "neurological"
  | "endocrine"
  | "gi"
  | "renal";

export type QuestionCategoryId =
  | "fundamentals"
  | "medical-surgical"
  | "maternal-newborn"
  | "pediatrics"
  | "mental-health"
  | "pharmacology"
  | "prioritization-safety";

export type QuestionCategoryDefinition = {
  id: QuestionCategoryId;
  title: string;
  description?: string;
  subcategories?: Array<{ id: QuestionSubcategoryId; title: string; description?: string }>;
};

export const QUESTION_CATEGORY_STRUCTURE: QuestionCategoryDefinition[] = [
  {
    id: "fundamentals",
    title: "Fundamentals",
    description: "Assessment basics, core nursing concepts, and foundational routines.",
  },
  {
    id: "medical-surgical",
    title: "Medical-Surgical",
    description: "System-based adult care question sets aligned to exam priorities.",
    subcategories: [
      { id: "cardiovascular", title: "Cardiovascular" },
      { id: "respiratory", title: "Respiratory" },
      { id: "neurological", title: "Neurological" },
      { id: "endocrine", title: "Endocrine" },
      { id: "gi", title: "GI" },
      { id: "renal", title: "Renal" },
    ],
  },
  {
    id: "maternal-newborn",
    title: "Maternal / Newborn",
    description: "Pregnancy, labor, postpartum, and newborn care priorities.",
  },
  {
    id: "pediatrics",
    title: "Pediatrics",
    description: "Growth and development, pediatric safety, and family-centered care.",
  },
  {
    id: "mental-health",
    title: "Mental Health",
    description: "Psychiatric assessment, therapeutic communication, and safety planning.",
  },
  {
    id: "pharmacology",
    title: "Pharmacology",
    description: "Medication safety, administration, and high-yield drug concepts.",
  },
  {
    id: "prioritization-safety",
    title: "Prioritization & Safety",
    description: "Delegation, first actions, escalation, and client safety decisions.",
  },
];

function hasAny(haystack: string, patterns: RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(haystack));
}

export function classifyQuestionTopicIntoLessonCategory(topicLabel: string): {
  categoryId: QuestionCategoryId;
  subcategoryId?: QuestionSubcategoryId;
} {
  const text = topicLabel.toLowerCase();

  if (hasAny(text, [/maternal|newborn|postpartum|labor|delivery|obstetric|pregnan/])) {
    return { categoryId: "maternal-newborn" };
  }
  if (hasAny(text, [/pediatric|paediatric|child|infant|adolescent/])) {
    return { categoryId: "pediatrics" };
  }
  if (hasAny(text, [/mental|psychi|depress|anxiety|suicid|behavioral/])) {
    return { categoryId: "mental-health" };
  }
  if (hasAny(text, [/pharmac|medication|drug|insulin|dosage/])) {
    return { categoryId: "pharmacology" };
  }
  if (hasAny(text, [/prioritiz|delegat|triage|safety|escalat|abcs/])) {
    return { categoryId: "prioritization-safety" };
  }

  if (hasAny(text, [/cardio|heart|coronary|ecg|arrhythm|hypertension/])) {
    return { categoryId: "medical-surgical", subcategoryId: "cardiovascular" };
  }
  if (hasAny(text, [/respir|airway|asthma|copd|oxygen|ventilat/])) {
    return { categoryId: "medical-surgical", subcategoryId: "respiratory" };
  }
  if (hasAny(text, [/neuro|stroke|seizure|cns|icp|delirium/])) {
    return { categoryId: "medical-surgical", subcategoryId: "neurological" };
  }
  if (hasAny(text, [/endocrine|diabet|thyroid|dka|hhs/])) {
    return { categoryId: "medical-surgical", subcategoryId: "endocrine" };
  }
  if (hasAny(text, [/\bgi\b|gastro|hepatic|liver|pancrea|bowel/])) {
    return { categoryId: "medical-surgical", subcategoryId: "gi" };
  }
  if (hasAny(text, [/renal|kidney|aki|ckd|dialysis|electrolyte/])) {
    return { categoryId: "medical-surgical", subcategoryId: "renal" };
  }

  return { categoryId: "fundamentals" };
}

