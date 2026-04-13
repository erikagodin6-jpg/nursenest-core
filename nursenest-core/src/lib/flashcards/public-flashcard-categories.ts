type DeckInput = {
  title: string;
  description: string | null;
  tags: Array<{ slug: string; name: string }>;
};

export type PublicFlashcardSubcategoryId =
  | "cardiovascular"
  | "respiratory"
  | "neurological"
  | "endocrine"
  | "gastrointestinal"
  | "renal"
  | "hematologic";

export type PublicFlashcardCategoryId =
  | "fundamentals"
  | "medical-surgical"
  | "maternal-newborn"
  | "pediatrics"
  | "mental-health"
  | "pharmacology"
  | "prioritization-safety";

export const PUBLIC_FLASHCARD_CATEGORIES: Array<{
  id: PublicFlashcardCategoryId;
  title: string;
  description: string;
  subcategories?: Array<{ id: PublicFlashcardSubcategoryId; title: string }>;
}> = [
  {
    id: "fundamentals",
    title: "Fundamentals",
    description: "Core nursing concepts, assessment basics, and foundational bedside routines.",
  },
  {
    id: "medical-surgical",
    title: "Medical-Surgical",
    description: "System-based adult care concepts aligned to high-volume exam conditions.",
    subcategories: [
      { id: "cardiovascular", title: "Cardiovascular" },
      { id: "respiratory", title: "Respiratory" },
      { id: "neurological", title: "Neurological" },
      { id: "endocrine", title: "Endocrine" },
      { id: "gastrointestinal", title: "Gastrointestinal" },
      { id: "renal", title: "Renal" },
      { id: "hematologic", title: "Hematologic" },
    ],
  },
  {
    id: "maternal-newborn",
    title: "Maternal / Newborn",
    description: "Pregnancy, labor, postpartum, and newborn transition essentials.",
  },
  {
    id: "pediatrics",
    title: "Pediatrics",
    description: "Growth, development, family-centered care, and pediatric safety priorities.",
  },
  {
    id: "mental-health",
    title: "Mental Health",
    description: "Therapeutic communication, safety, and common psychiatric presentations.",
  },
  {
    id: "pharmacology",
    title: "Pharmacology",
    description: "Medication mechanisms, safety checks, and exam-critical administration cues.",
  },
  {
    id: "prioritization-safety",
    title: "Prioritization & Safety",
    description: "Delegation, first-action decisions, and client safety escalation patterns.",
  },
];

function haystackFromDeck(deck: DeckInput): string {
  const tags = deck.tags.map((t) => `${t.slug} ${t.name}`).join(" ");
  return `${deck.title} ${deck.description ?? ""} ${tags}`.toLowerCase();
}

function hasAny(text: string, patterns: RegExp[]): boolean {
  return patterns.some((p) => p.test(text));
}

export function classifyPublicFlashcardDeck(deck: DeckInput): {
  categoryId: PublicFlashcardCategoryId;
  subcategoryId?: PublicFlashcardSubcategoryId;
  highYield: boolean;
} {
  const text = haystackFromDeck(deck);

  const highYield = hasAny(text, [/must[-\s]?know/i, /high[-\s]?yield/i, /priority/i, /urgent/i]);

  if (hasAny(text, [/maternal|newborn|postpartum|labor|delivery|obstetric|pregnan/i])) {
    return { categoryId: "maternal-newborn", highYield };
  }
  if (hasAny(text, [/pediatric|paediatric|infant|child|adolescent/i])) {
    return { categoryId: "pediatrics", highYield };
  }
  if (hasAny(text, [/mental|psychi|depress|anxiety|suicid|behavioral/i])) {
    return { categoryId: "mental-health", highYield };
  }
  if (hasAny(text, [/pharmac|medication|drug|insulin|dosage/i])) {
    return { categoryId: "pharmacology", highYield };
  }
  if (hasAny(text, [/prioritiz|delegat|safety|triage|abcs|escalat/i])) {
    return { categoryId: "prioritization-safety", highYield };
  }

  if (hasAny(text, [/cardio|heart|coronary|ecg|arrhythm|hypertension/i])) {
    return { categoryId: "medical-surgical", subcategoryId: "cardiovascular", highYield };
  }
  if (hasAny(text, [/respir|airway|asthma|copd|oxygen|ventilat/i])) {
    return { categoryId: "medical-surgical", subcategoryId: "respiratory", highYield };
  }
  if (hasAny(text, [/neuro|stroke|seizure|cns|icp|delirium/i])) {
    return { categoryId: "medical-surgical", subcategoryId: "neurological", highYield };
  }
  if (hasAny(text, [/endocrine|diabet|thyroid|dka|hhs/i])) {
    return { categoryId: "medical-surgical", subcategoryId: "endocrine", highYield };
  }
  if (hasAny(text, [/gastro|gi\b|hepatic|liver|pancrea|bowel/i])) {
    return { categoryId: "medical-surgical", subcategoryId: "gastrointestinal", highYield };
  }
  if (hasAny(text, [/renal|kidney|aki\b|ckd|dialysis|electrolyte/i])) {
    return { categoryId: "medical-surgical", subcategoryId: "renal", highYield };
  }
  if (hasAny(text, [/hemat|anemia|coag|bleed|thrombo|transfusion/i])) {
    return { categoryId: "medical-surgical", subcategoryId: "hematologic", highYield };
  }

  return { categoryId: "fundamentals", highYield };
}

export function lessonSlugFromSourceKey(sourceKey: string | null | undefined): string | null {
  if (!sourceKey || !sourceKey.startsWith("lesson:")) return null;
  const parts = sourceKey.split(":");
  const slug = parts[1]?.trim();
  return slug && slug.length > 0 ? slug : null;
}

export function lessonNameFromSlug(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

