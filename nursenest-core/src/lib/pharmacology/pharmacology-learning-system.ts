export type PharmacologyCategory = {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  topicSlug: string;
  lessonTopic: string;
  estimatedCards: number;
  masteryPct: number;
  safetyFocus: string;
  accentVar: string;
  icon: "pill" | "heart" | "droplet" | "brain" | "wind" | "shield" | "leaf" | "syringe" | "baby" | "activity";
};

export const PHARMACOLOGY_CATEGORIES: PharmacologyCategory[] = [
  {
    id: "cardiovascular",
    title: "Cardiovascular Medications",
    shortTitle: "Cardiac",
    description: "Antihypertensives, diuretics, antianginals, antidysrhythmics, and heart failure safety.",
    topicSlug: "cardiovascular-pharmacology",
    lessonTopic: "cardiovascular medications",
    estimatedCards: 96,
    masteryPct: 68,
    safetyFocus: "Vitals, potassium, pulse checks, orthostatic risk",
    accentVar: "--semantic-chart-1",
    icon: "heart",
  },
  {
    id: "endocrine",
    title: "Endocrine Medications",
    shortTitle: "Endocrine",
    description: "Insulin, oral diabetes agents, thyroid medications, corticosteroids, and glucose safety.",
    topicSlug: "endocrine-pharmacology",
    lessonTopic: "endocrine medications insulin diabetes thyroid steroids",
    estimatedCards: 82,
    masteryPct: 61,
    safetyFocus: "Hypoglycemia, sick-day teaching, timing with meals",
    accentVar: "--semantic-chart-3",
    icon: "droplet",
  },
  {
    id: "psych-neuro",
    title: "Neurological + Psychiatric Medications",
    shortTitle: "Psych + Neuro",
    description: "Antidepressants, antipsychotics, mood stabilizers, seizure medications, and sedation risks.",
    topicSlug: "psychiatric-neurological-pharmacology",
    lessonTopic: "psychiatric neurological medications",
    estimatedCards: 88,
    masteryPct: 55,
    safetyFocus: "Suicide risk, serotonin syndrome, EPS, lithium toxicity",
    accentVar: "--semantic-chart-5",
    icon: "brain",
  },
  {
    id: "respiratory",
    title: "Respiratory Medications",
    shortTitle: "Respiratory",
    description: "Bronchodilators, inhaled steroids, oxygen-adjacent medication teaching, and COPD/asthma safety.",
    topicSlug: "respiratory-pharmacology",
    lessonTopic: "respiratory medications bronchodilators inhaled steroids",
    estimatedCards: 64,
    masteryPct: 72,
    safetyFocus: "Inhaler sequence, tremor, tachycardia, rescue vs controller",
    accentVar: "--semantic-info",
    icon: "wind",
  },
  {
    id: "anti-infectives",
    title: "Infectious Disease / Antibiotics",
    shortTitle: "Antibiotics",
    description: "Antibiotic classes, culture timing, allergic reactions, C. difficile risk, and patient teaching.",
    topicSlug: "anti-infective-pharmacology",
    lessonTopic: "antibiotics anti infective medications",
    estimatedCards: 78,
    masteryPct: 64,
    safetyFocus: "Allergy, anaphylaxis, superinfection, renal considerations",
    accentVar: "--semantic-success",
    icon: "shield",
  },
  {
    id: "pain-sedation",
    title: "Pain Management",
    shortTitle: "Pain",
    description: "Opioids, non-opioids, NSAIDs, acetaminophen safety, reversal agents, and reassessment.",
    topicSlug: "pain-management-pharmacology",
    lessonTopic: "pain medications opioids nsaids acetaminophen",
    estimatedCards: 72,
    masteryPct: 58,
    safetyFocus: "Respirations, sedation scale, falls, acetaminophen limits",
    accentVar: "--semantic-warning",
    icon: "pill",
  },
  {
    id: "high-alert",
    title: "High-Alert + Emergency Medications",
    shortTitle: "High-alert",
    description: "Insulin, anticoagulants, opioids, emergency medications, and medication-error prevention.",
    topicSlug: "high-alert-emergency-pharmacology",
    lessonTopic: "high alert medications emergency medications",
    estimatedCards: 104,
    masteryPct: 49,
    safetyFocus: "Independent double checks, antidotes, hold parameters",
    accentVar: "--semantic-danger",
    icon: "syringe",
  },
  {
    id: "maternal-peds",
    title: "Maternal, Newborn + Pediatric Pharmacology",
    shortTitle: "Maternal + Peds",
    description: "Pregnancy safety, newborn medications, pediatric dose checks, and family teaching.",
    topicSlug: "maternal-pediatric-pharmacology",
    lessonTopic: "maternal newborn pediatric pharmacology",
    estimatedCards: 58,
    masteryPct: 52,
    safetyFocus: "Weight-based dosing, pregnancy contraindications, parent teaching",
    accentVar: "--semantic-chart-4",
    icon: "baby",
  },
  {
    id: "natural-supplements",
    title: "Natural Supplements + Herbal Medicine",
    shortTitle: "Supplements",
    description: "Herbal interactions, contraindications, integrative medicine teaching, and safe disclosure.",
    topicSlug: "natural-supplements-herbal-medicine",
    lessonTopic: "natural supplements herbal medicine interactions",
    estimatedCards: 46,
    masteryPct: 44,
    safetyFocus: "Warfarin, surgery holds, pregnancy, liver risk, disclosure",
    accentVar: "--semantic-chart-2",
    icon: "leaf",
  },
  {
    id: "med-surg",
    title: "Med-Surg Pharmacology",
    shortTitle: "Med-Surg",
    description: "Common medication decisions across GI, renal, fluids, electrolytes, and chronic disease.",
    topicSlug: "med-surg-pharmacology",
    lessonTopic: "med surg pharmacology renal gi electrolytes",
    estimatedCards: 92,
    masteryPct: 66,
    safetyFocus: "Labs, renal dosing cues, dehydration, adverse-effect recognition",
    accentVar: "--semantic-brand",
    icon: "activity",
  },
];

export function getPharmacologyCategory(id: string | null | undefined): PharmacologyCategory | null {
  const normalized = id?.trim().toLowerCase();
  if (!normalized) return null;
  return PHARMACOLOGY_CATEGORIES.find((category) => category.id === normalized || category.topicSlug === normalized) ?? null;
}

export function pharmacologyFlashcardsHref(pathwayId: string, category?: PharmacologyCategory | null, cardLimit = 20): string {
  const q = new URLSearchParams();
  q.set("pathwayId", pathwayId);
  q.set("includeCards", "1");
  q.set("shuffle", "1");
  q.set("cardLimit", String(cardLimit));
  q.set("topic", category?.topicSlug ?? "pharmacology");
  return `/app/flashcards/custom?${q.toString()}`;
}

export function pharmacologyLessonsHref(pathwayId: string, category?: PharmacologyCategory | null): string {
  const q = new URLSearchParams();
  q.set("pathwayId", pathwayId);
  q.set("topic", category?.lessonTopic ?? "pharmacology");
  return `/app/lessons?${q.toString()}`;
}
