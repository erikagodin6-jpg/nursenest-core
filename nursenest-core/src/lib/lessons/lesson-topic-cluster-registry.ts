/**
 * Canonical topic-cluster model for pathway lessons:
 * stable `topicSlug` buckets, navigation groups, and question-text → hub slug resolution.
 *
 * Add rows here when new `topicSlug` values ship in catalog/DB. Unknown slugs are still
 * safely inferred into the closest navigation group instead of falling into "More topics".
 */
import type { TopicCluster } from "@/lib/lessons/pathway-lesson-loader";

/** High-level buckets for hub navigation. */
export type TopicClusterGroupId =
  | "cardiovascular"
  | "respiratory"
  | "endocrine"
  | "neuro"
  | "pharmacology"
  | "safety_prioritization"
  | "fluids_renal_gi"
  | "maternity_pediatrics"
  | "mental_health"
  | "infection_immunology"
  | "gastrointestinal"
  | "hematology_oncology"
  | "musculoskeletal_integumentary"
  | "emergency_triage"
  | "other";

export const TOPIC_CLUSTER_GROUP_ORDER: TopicClusterGroupId[] = [
  "safety_prioritization",
  "cardiovascular",
  "respiratory",
  "endocrine",
  "neuro",
  "pharmacology",
  "fluids_renal_gi",
  "gastrointestinal",
  "infection_immunology",
  "maternity_pediatrics",
  "mental_health",
  "hematology_oncology",
  "musculoskeletal_integumentary",
  "emergency_triage",
  "other",
];

export function topicClusterGroupTitle(group: TopicClusterGroupId): string {
  const titles: Record<TopicClusterGroupId, string> = {
    cardiovascular: "Cardiovascular",
    respiratory: "Respiratory",
    endocrine: "Endocrine & diabetes",
    neuro: "Neurological",
    pharmacology: "Pharmacology",
    safety_prioritization: "Safety, prioritization & delegation",
    fluids_renal_gi: "Fluids, electrolytes & renal",
    maternity_pediatrics: "Maternity & pediatrics",
    mental_health: "Mental health",
    infection_immunology: "Infection control, immune & sepsis",
    gastrointestinal: "Gastrointestinal",
    hematology_oncology: "Hematology & oncology",
    musculoskeletal_integumentary: "Musculoskeletal & integumentary",
    emergency_triage: "Emergency, shock & critical care",
    other: "More topics",
  };

  return titles[group];
}

export type TopicClusterCanonicalDef = {
  topicSlug: string;
  label: string;
  group: TopicClusterGroupId;
  matchKeys: string[];
};

/**
 * One row per canonical topic slug used in lesson metadata.
 * Include both broad systems and common condition-level slugs so hub grouping stays clean.
 */
export const TOPIC_CLUSTER_DEFINITIONS: TopicClusterCanonicalDef[] = [
  {
    topicSlug: "cardiovascular",
    label: "Cardiovascular",
    group: "cardiovascular",
    matchKeys: [
      "cardiovascular",
      "cardiac",
      "cardio",
      "heart",
      "heart failure",
      "heart-failure",
      "myocardial",
      "myocardial infarction",
      "myocardial-infarction",
      "acute coronary",
      "acute-coronary",
      "angina",
      "dysrhythmia",
      "arrhythmia",
      "hypertension",
      "blood pressure",
    ],
  },
  {
    topicSlug: "heart-failure",
    label: "Heart failure",
    group: "cardiovascular",
    matchKeys: ["heart failure", "heart-failure", "hf", "chf"],
  },
  {
    topicSlug: "myocardial-infarction",
    label: "Myocardial infarction",
    group: "cardiovascular",
    matchKeys: ["myocardial infarction", "myocardial-infarction", "mi", "stemi", "nstemi", "acute coronary"],
  },
  {
    topicSlug: "hypertension",
    label: "Hypertension",
    group: "cardiovascular",
    matchKeys: ["hypertension", "blood pressure", "anti-hypertensive", "antihypertensive"],
  },

  {
    topicSlug: "respiratory",
    label: "Respiratory",
    group: "respiratory",
    matchKeys: [
      "respiratory",
      "respiratory-acute",
      "pulmonary",
      "lung",
      "asthma",
      "ards",
      "abg",
      "acid-base",
      "acid base",
      "ventilator",
      "oxygenation",
    ],
  },
  {
    topicSlug: "respiratory-acute",
    label: "Acute respiratory care",
    group: "respiratory",
    matchKeys: ["respiratory-acute", "acute respiratory", "ards", "oxygenation", "ventilator"],
  },
  {
    topicSlug: "abg-acid-base",
    label: "ABG & acid-base",
    group: "respiratory",
    matchKeys: ["abg-acid-base", "abg", "acid-base", "acid base", "respiratory acidosis", "respiratory alkalosis"],
  },
  {
    topicSlug: "pneumonia",
    label: "Pneumonia",
    group: "respiratory",
    matchKeys: ["pneumonia", "cap ", "hap ", "vap "],
  },
  {
    topicSlug: "copd",
    label: "COPD",
    group: "respiratory",
    matchKeys: ["copd", "chronic obstructive"],
  },
  {
    topicSlug: "pulmonary-embolism",
    label: "Pulmonary embolism",
    group: "respiratory",
    matchKeys: ["pulmonary embolism", "pulmonary-embolism", "embolism", "pe "],
  },

  {
    topicSlug: "endocrine",
    label: "Endocrine",
    group: "endocrine",
    matchKeys: ["endocrine", "thyroid", "adrenal", "pituitary", "diabetes mellitus", "glucose", "dka", "hhs"],
  },
  {
    topicSlug: "endocrine-metabolic-fluids",
    label: "Endocrine, metabolic & fluids",
    group: "endocrine",
    matchKeys: ["endocrine-metabolic-fluids", "endocrine metabolic", "metabolic", "diabetes", "dka", "hhs"],
  },
  {
    topicSlug: "diabetes-metabolic",
    label: "Diabetes & metabolic",
    group: "endocrine",
    matchKeys: ["diabetes-metabolic", "diabetes", "insulin", "glucose", "dka", "hhs"],
  },
  {
    topicSlug: "diabetes-meds",
    label: "Diabetes medications",
    group: "endocrine",
    matchKeys: ["diabetes-meds", "diabetes med", "oral hypoglycemic", "insulin"],
  },

  {
    topicSlug: "neurological",
    label: "Neurological",
    group: "neuro",
    matchKeys: [
      "neurological",
      "neurologic",
      "stroke",
      "icp",
      "intracranial",
      "seizure",
      "neuro acute",
      "neurological-acute",
    ],
  },

  {
    topicSlug: "pharmacology",
    label: "Pharmacology",
    group: "pharmacology",
    matchKeys: ["pharmacology", "pharm", "drug class", "medication class"],
  },
  {
    topicSlug: "pharmacology-master",
    label: "Pharmacology",
    group: "pharmacology",
    matchKeys: ["pharmacology-master", "pharmacology", "pharm", "medication", "drug"],
  },
  {
    topicSlug: "antibiotics",
    label: "Antibiotics",
    group: "pharmacology",
    matchKeys: ["antibiotics", "antibiotic", "antimicrobial", "culture sensitiv"],
  },
  {
    topicSlug: "anticoagulation",
    label: "Anticoagulation",
    group: "pharmacology",
    matchKeys: ["anticoagulation", "anticoagulant", "warfarin", "heparin", "dabigatran", "rivaroxaban"],
  },
  {
    topicSlug: "pain",
    label: "Pain management",
    group: "pharmacology",
    matchKeys: ["pain", "pain management", "analgesic", "opioid", "sedation"],
  },
  {
    topicSlug: "medication-safety",
    label: "Medication safety",
    group: "pharmacology",
    matchKeys: ["medication safety", "medication-safety", "high alert", "five rights", "med error"],
  },
  {
    topicSlug: "np-differential-prescribing-chronic",
    label: "NP prescribing & chronic care",
    group: "pharmacology",
    matchKeys: ["np-differential-prescribing-chronic", "prescribing", "chronic", "differential"],
  },

  {
    topicSlug: "prioritization-delegation",
    label: "Prioritization & delegation",
    group: "safety_prioritization",
    matchKeys: [
      "prioritization-delegation",
      "prioritization",
      "prioritize",
      "delegation",
      "delegate",
      "clinical judgment",
      "triage",
    ],
  },
  {
    topicSlug: "prioritization",
    label: "Prioritization",
    group: "safety_prioritization",
    matchKeys: ["prioritization", "prioritize"],
  },
  {
    topicSlug: "delegation",
    label: "Delegation",
    group: "safety_prioritization",
    matchKeys: ["delegation", "delegate", "nursing scope", "scope of practice"],
  },
  {
    topicSlug: "safety",
    label: "Safety",
    group: "safety_prioritization",
    matchKeys: ["patient safety", "safety", "fall risk", "restraint"],
  },
  {
    topicSlug: "clinical-reasoning",
    label: "Clinical reasoning",
    group: "safety_prioritization",
    matchKeys: ["clinical-reasoning", "clinical reasoning", "judgment", "decision making"],
  },
  {
    topicSlug: "nclex-nursing-priorities-safety",
    label: "NCLEX priorities & safety",
    group: "safety_prioritization",
    matchKeys: [
      "nclex-nursing-priorities-safety",
      "delegation",
      "scope of practice",
      "incident reporting",
      "informed consent",
      "surrogate decision",
      "ethical communication",
      "urgent vs important",
    ],
  },

  {
    topicSlug: "fluids-electrolytes",
    label: "Fluids & electrolytes",
    group: "fluids_renal_gi",
    matchKeys: [
      "fluids-electrolytes",
      "fluid balance",
      "electrolyte",
      "sodium",
      "potassium",
      "calcium",
      "magnesium",
      "dehydration",
      "hypovolemia",
    ],
  },
  {
    topicSlug: "electrolytes-volume",
    label: "Electrolytes & volume",
    group: "fluids_renal_gi",
    matchKeys: ["electrolytes-volume", "electrolyte", "volume", "fluid", "sodium", "potassium"],
  },
  {
    topicSlug: "renal-gu",
    label: "Renal & GU",
    group: "fluids_renal_gi",
    matchKeys: ["renal-gu", "renal", "kidney", "dialysis", "urinary", "genitourinary", "renal-genitourinary"],
  },
  {
    topicSlug: "renal-genitourinary",
    label: "Renal & genitourinary",
    group: "fluids_renal_gi",
    matchKeys: ["renal-genitourinary", "renal", "kidney", "dialysis", "urinary", "genitourinary", "renal-gu"],
  },

  {
    topicSlug: "gastrointestinal",
    label: "Gastrointestinal",
    group: "gastrointestinal",
    matchKeys: ["gastrointestinal", "gi bleed", "gi-bleed", "bowel", "liver", "pancreatitis"],
  },

  {
    topicSlug: "infection-control",
    label: "Infection control",
    group: "infection_immunology",
    matchKeys: ["infection control", "infection-control", "ppe", "isolation", "contact precaution"],
  },
  {
    topicSlug: "infectious-disease",
    label: "Infectious disease",
    group: "infection_immunology",
    matchKeys: [
      "infectious-disease",
      "infectious disease",
      "tuberculosis",
      "hiv",
      "aids",
      "influenza",
      "antiviral",
      "c diff",
      "clostridioides",
      "osteomyelitis",
    ],
  },
  {
    topicSlug: "sepsis",
    label: "Sepsis",
    group: "infection_immunology",
    matchKeys: ["sepsis", "septic", "sirs", "qsofa"],
  },
  {
    topicSlug: "sepsis-infection",
    label: "Sepsis & infection",
    group: "infection_immunology",
    matchKeys: ["sepsis-infection", "sepsis", "septic", "infection", "sirs", "qsofa"],
  },
  {
    topicSlug: "integumentary-immune-autoimmune",
    label: "Integumentary, immune & autoimmune",
    group: "infection_immunology",
    matchKeys: [
      "integumentary-immune-autoimmune",
      "integumentary",
      "immune",
      "autoimmune",
      "lupus",
      "systemic lupus",
      "psoriasis",
      "stevens-johnson",
      "toxic epidermal",
      "scleroderma",
    ],
  },

  {
    topicSlug: "hematology-oncology-immunology",
    label: "Hematology, oncology & immunology",
    group: "hematology_oncology",
    matchKeys: ["hematology-oncology-immunology", "hematology", "oncology", "cancer", "immunology", "anemia"],
  },

  {
    topicSlug: "musculoskeletal",
    label: "Musculoskeletal",
    group: "musculoskeletal_integumentary",
    matchKeys: [
      "musculoskeletal",
      "osteoarthritis",
      "rheumatoid arthritis",
      "gout",
      "hip fracture",
      "osteoporosis",
      "compartment syndrome",
      "septic arthritis",
    ],
  },

  {
    topicSlug: "maternity",
    label: "Maternity",
    group: "maternity_pediatrics",
    matchKeys: ["maternity", "obstetric", "labor", "newborn", "maternal-newborn", "pregnancy"],
  },
  {
    topicSlug: "maternity-newborn",
    label: "Maternity & newborn",
    group: "maternity_pediatrics",
    matchKeys: ["maternity-newborn", "maternal newborn", "maternity", "obstetric", "labor", "pregnancy", "newborn"],
  },
  {
    topicSlug: "womens-health",
    label: "Women’s health",
    group: "maternity_pediatrics",
    matchKeys: ["womens-health", "women's health", "gynecology", "obstetric", "pregnancy"],
  },
  {
    topicSlug: "pediatrics",
    label: "Pediatrics",
    group: "maternity_pediatrics",
    matchKeys: ["pediatrics", "pediatric", "child", "neonatal", "pediatrics-care"],
  },
  {
    topicSlug: "adolescent-health",
    label: "Adolescent health",
    group: "maternity_pediatrics",
    matchKeys: ["adolescent-health", "adolescent", "teen", "pediatric"],
  },

  {
    topicSlug: "mental-health",
    label: "Mental health",
    group: "mental_health",
    matchKeys: ["mental health", "mental-health", "psychiatric", "suicide", "crisis", "mental-health-crisis"],
  },
  {
    topicSlug: "psychosocial",
    label: "Psychosocial",
    group: "mental_health",
    matchKeys: ["psychosocial", "therapeutic communication", "coping", "crisis"],
  },

  {
    topicSlug: "shock",
    label: "Shock",
    group: "emergency_triage",
    matchKeys: ["shock", "hypovolemic", "cardiogenic", "distributive", "obstructive"],
  },
  {
    topicSlug: "emergency-critical-perioperative",
    label: "Emergency, critical & perioperative",
    group: "emergency_triage",
    matchKeys: [
      "emergency-critical-perioperative",
      "emergency",
      "critical",
      "perioperative",
      "triage",
      "trauma",
      "shock",
    ],
  },

  {
    topicSlug: "health-promotion",
    label: "Health promotion",
    group: "other",
    matchKeys: ["health-promotion", "health promotion", "screening", "prevention"],
  },
  {
    topicSlug: "geriatrics",
    label: "Geriatrics",
    group: "other",
    matchKeys: ["geriatrics", "geriatric", "older adult", "elder"],
  },
];

const DEF_BY_SLUG = new Map<string, TopicClusterCanonicalDef>(
  TOPIC_CLUSTER_DEFINITIONS.map((definition) => [definition.topicSlug, definition]),
);

function normalizeTopicText(value: string | null | undefined): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[_/]+/g, "-")
    .replace(/\s+/g, "-");
}

function readableTopicText(value: string | null | undefined): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ");
}

function scoreMatch(haystack: string, key: string): number {
  const hay = haystack.trim().toLowerCase();
  const needle = key.trim().toLowerCase();

  if (!hay || !needle) return 0;
  if (hay === needle) return 10_000 + needle.length;
  if (hay.includes(needle)) return 1000 + needle.length;
  if (needle.includes(hay)) return 500 + hay.length;

  return 0;
}

/**
 * Map normalized question topicCode, topicSlug, or free text to the best canonical lesson topic slug.
 */
export function mapTopicCodeToCanonicalClusterSlug(topicCode: string | null | undefined): string | null {
  const normalized = normalizeTopicText(topicCode);
  const readable = readableTopicText(topicCode);

  if (!normalized || normalized === "general") return null;

  if (DEF_BY_SLUG.has(normalized)) {
    return normalized;
  }

  let best: { slug: string; score: number } | null = null;

  for (const def of TOPIC_CLUSTER_DEFINITIONS) {
    const slugScore = normalized === def.topicSlug ? 8000 + def.topicSlug.length : 0;

    let keyBest = 0;
    for (const key of def.matchKeys) {
      keyBest = Math.max(
        keyBest,
        scoreMatch(normalized, key),
        scoreMatch(readable, key),
        scoreMatch(normalized, normalizeTopicText(key)),
      );
    }

    const total = Math.max(slugScore, keyBest);

    if (total > 0 && (!best || total > best.score)) {
      best = { slug: def.topicSlug, score: total };
    }
  }

  return best?.slug ?? null;
}

/**
 * Pathway-aware: returns a `topicSlug` that exists for this pathway’s lesson index, or null.
 */
export function pickTopicClusterSlugForPathway(
  topicCode: string | null | undefined,
  pathwayTopicSlugs: ReadonlySet<string>,
): string | null {
  const normalized = normalizeTopicText(topicCode);

  if (!normalized || normalized === "general") return null;
  if (pathwayTopicSlugs.has(normalized)) return normalized;

  const canonical = mapTopicCodeToCanonicalClusterSlug(topicCode);
  if (canonical && pathwayTopicSlugs.has(canonical)) return canonical;

  let best: { slug: string; score: number } | null = null;

  for (const slug of pathwayTopicSlugs) {
    const def = DEF_BY_SLUG.get(slug);
    const slugScore = scoreMatch(normalized, slug);
    const readableScore = scoreMatch(readableTopicText(topicCode), readableTopicText(slug));

    let defScore = 0;
    if (def) {
      for (const key of def.matchKeys) {
        defScore = Math.max(defScore, scoreMatch(normalized, key), scoreMatch(readableTopicText(topicCode), key));
      }
    }

    const total = Math.max(slugScore, readableScore, defScore);

    if (total > 0 && (!best || total > best.score)) {
      best = { slug, score: total };
    }
  }

  return best?.slug ?? null;
}

export type TopicClusterNavGroup = {
  groupId: TopicClusterGroupId;
  groupTitle: string;
  clusters: TopicCluster[];
};

function groupForTopicSlug(topicSlug: string): TopicClusterGroupId {
  const direct = DEF_BY_SLUG.get(topicSlug);
  if (direct) return direct.group;

  const inferredSlug = mapTopicCodeToCanonicalClusterSlug(topicSlug);
  if (inferredSlug) {
    return DEF_BY_SLUG.get(inferredSlug)?.group ?? "other";
  }

  return "other";
}

/**
 * Groups live TopicCluster rows under editorial buckets for hub UI.
 *
 * Critical behavior:
 * Unknown condition-level slugs such as `heart-failure`, `myocardial-infarction`,
 * `sepsis-infection`, or `endocrine-metabolic-fluids` are inferred into their parent
 * clinical group instead of appearing under "More topics".
 */
export function groupTopicClustersForNavigation(clusters: TopicCluster[]): TopicClusterNavGroup[] {
  const bucket = new Map<TopicClusterGroupId, TopicCluster[]>();

  for (const id of TOPIC_CLUSTER_GROUP_ORDER) {
    bucket.set(id, []);
  }

  for (const cluster of clusters) {
    const normalizedSlug = normalizeTopicText(cluster.topicSlug);
    const groupId = groupForTopicSlug(normalizedSlug);
    const list = bucket.get(groupId) ?? bucket.get("other")!;
    list.push(cluster);
  }

  const out: TopicClusterNavGroup[] = [];

  for (const groupId of TOPIC_CLUSTER_GROUP_ORDER) {
    const clustersInGroup = bucket.get(groupId) ?? [];
    if (clustersInGroup.length === 0) continue;

    clustersInGroup.sort((a, b) => a.label.localeCompare(b.label));

    out.push({
      groupId,
      groupTitle: topicClusterGroupTitle(groupId),
      clusters: clustersInGroup,
    });
  }

  return out;
}