/**
 * Canonical **topic cluster** model for pathway lessons: stable `topicSlug` buckets, navigation groups,
 * and question-text → hub slug resolution for rationale links.
 *
 * Add rows here when new `topicSlug` values ship in catalog/DB — keeps 500+ lessons grouped without ad-hoc UI logic.
 */
import type { TopicCluster } from "@/lib/lessons/pathway-lesson-loader";

/** High-level buckets for hub navigation (organ systems + cross-cutting themes). */
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
    infection_immunology: "Infection control & sepsis",
    gastrointestinal: "Gastrointestinal",
    hematology_oncology: "Hematology & oncology",
    musculoskeletal_integumentary: "Musculoskeletal & integumentary",
    emergency_triage: "Emergency & triage",
    other: "More topics",
  };
  return titles[group];
}

export type TopicClusterCanonicalDef = {
  topicSlug: string;
  label: string;
  group: TopicClusterGroupId;
  /**
   * Normalized lowercase fragments used to map bank `topicCode` / question text → this hub slug.
   * Prefer specific multi-word keys over noisy short tokens.
   */
  matchKeys: string[];
};

/**
 * One row per canonical `topicSlug` used in lesson metadata. Extend when new clusters appear in catalog/DB.
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
      "heart failure",
      "heart-failure",
      "acute coronary",
      "acute-coronary",
      "angina",
      "myocardial",
      "dysrhythmia",
      "arrhythmia",
      "pulmonary embolism",
      "pulmonary-embolism",
    ],
  },
  {
    topicSlug: "hypertension",
    label: "Hypertension",
    group: "cardiovascular",
    matchKeys: ["hypertension", "blood pressure", "anti-hypertensive"],
  },
  {
    topicSlug: "pneumonia",
    label: "Pneumonia",
    group: "respiratory",
    matchKeys: ["pneumonia", "cap ", "hap "],
  },
  {
    topicSlug: "copd",
    label: "COPD",
    group: "respiratory",
    matchKeys: ["copd", "chronic obstructive"],
  },
  {
    topicSlug: "respiratory",
    label: "Respiratory",
    group: "respiratory",
    matchKeys: [
      "respiratory",
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
    topicSlug: "diabetes-meds",
    label: "Diabetes medications",
    group: "endocrine",
    matchKeys: ["diabetes-meds", "diabetes med", "oral hypoglycemic", "insulin"],
  },
  {
    topicSlug: "endocrine",
    label: "Endocrine",
    group: "endocrine",
    matchKeys: ["endocrine", "thyroid", "adrenal", "pituitary", "diabetes mellitus", "glucose", "dka", "hhs"],
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
    matchKeys: ["pain management", "analgesic", "opioid", "sedation"],
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
    topicSlug: "medication-safety",
    label: "Medication safety",
    group: "safety_prioritization",
    matchKeys: ["medication safety", "medication-safety", "high alert", "five rights", "med error"],
  },
  {
    topicSlug: "infection-control",
    label: "Infection control",
    group: "infection_immunology",
    matchKeys: ["infection control", "infection-control", "ppe", "isolation", "contact precaution"],
  },
  {
    topicSlug: "sepsis",
    label: "Sepsis",
    group: "infection_immunology",
    matchKeys: ["sepsis", "septic", "sirs", "qsofa"],
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
    topicSlug: "renal-gu",
    label: "Renal & GU",
    group: "fluids_renal_gi",
    matchKeys: ["renal-gu", "renal", "kidney", "dialysis", "urinary", "genitourinary", "renal-genitourinary"],
  },
  {
    topicSlug: "gastrointestinal",
    label: "Gastrointestinal",
    group: "gastrointestinal",
    matchKeys: ["gastrointestinal", "gi bleed", "gi-bleed", "bowel", "liver", "pancreatitis"],
  },
  {
    topicSlug: "shock",
    label: "Shock",
    group: "emergency_triage",
    matchKeys: ["shock", "hypovolemic", "cardiogenic", "distributive", "obstructive"],
  },
  {
    topicSlug: "maternity",
    label: "Maternity",
    group: "maternity_pediatrics",
    matchKeys: ["maternity", "obstetric", "labor", "newborn", "maternal-newborn", "pregnancy"],
  },
  {
    topicSlug: "pediatrics",
    label: "Pediatrics",
    group: "maternity_pediatrics",
    matchKeys: ["pediatrics", "pediatric", "child", "neonatal", "pediatrics-care"],
  },
  {
    topicSlug: "mental-health",
    label: "Mental health",
    group: "mental_health",
    matchKeys: ["mental health", "mental-health", "psychiatric", "suicide", "crisis", "mental-health-crisis"],
  },
];

const DEF_BY_SLUG = new Map<string, TopicClusterCanonicalDef>(
  TOPIC_CLUSTER_DEFINITIONS.map((d) => [d.topicSlug, d]),
);

function scoreMatch(hay: string, key: string): number {
  if (!hay || !key) return 0;
  if (hay === key) return 10_000 + key.length;
  if (hay.includes(key)) return 1000 + key.length;
  if (key.includes(hay)) return 500 + hay.length;
  return 0;
}

/**
 * Map normalized question `topicCode` to the best canonical **lesson topic slug** (may not exist on every pathway).
 */
export function mapTopicCodeToCanonicalClusterSlug(topicCode: string | null | undefined): string | null {
  if (!topicCode || topicCode === "general") return null;
  const hay = String(topicCode).toLowerCase();
  let best: { slug: string; score: number } | null = null;

  for (const def of TOPIC_CLUSTER_DEFINITIONS) {
    const slugScore = hay === def.topicSlug ? 8000 + def.topicSlug.length : 0;
    let keyBest = 0;
    for (const key of def.matchKeys) {
      keyBest = Math.max(keyBest, scoreMatch(hay, key));
    }
    const total = Math.max(slugScore, keyBest);
    if (total > 0 && (!best || total > best.score)) {
      best = { slug: def.topicSlug, score: total };
    }
  }

  return best?.slug ?? null;
}

/**
 * Pathway-aware: returns a `topicSlug` that exists for this pathway’s lesson index, or null (avoid 404 hub links).
 */
export function pickTopicClusterSlugForPathway(
  topicCode: string | null | undefined,
  pathwayTopicSlugs: ReadonlySet<string>,
): string | null {
  if (!topicCode || topicCode === "general") return null;
  const hay = String(topicCode).toLowerCase();

  if (pathwayTopicSlugs.has(hay)) return hay;

  const canonical = mapTopicCodeToCanonicalClusterSlug(topicCode);
  if (canonical && pathwayTopicSlugs.has(canonical)) return canonical;

  let best: { slug: string; score: number } | null = null;
  for (const def of TOPIC_CLUSTER_DEFINITIONS) {
    if (!pathwayTopicSlugs.has(def.topicSlug)) continue;
    const slugScore = hay === def.topicSlug ? 8000 + def.topicSlug.length : 0;
    let keyBest = 0;
    for (const key of def.matchKeys) {
      keyBest = Math.max(keyBest, scoreMatch(hay, key));
    }
    const total = Math.max(slugScore, keyBest);
    if (total > 0 && (!best || total > best.score)) {
      best = { slug: def.topicSlug, score: total };
    }
  }
  if (best) return best.slug;

  for (const s of pathwayTopicSlugs) {
    if (s.startsWith(hay) || hay.startsWith(s)) return s;
  }
  return null;
}

export type TopicClusterNavGroup = {
  groupId: TopicClusterGroupId;
  groupTitle: string;
  clusters: TopicCluster[];
};

/**
 * Groups live {@link TopicCluster} rows (from DB/catalog aggregates) under editorial buckets for hub UI.
 */
export function groupTopicClustersForNavigation(clusters: TopicCluster[]): TopicClusterNavGroup[] {
  const bucket = new Map<TopicClusterGroupId, TopicCluster[]>();
  for (const id of TOPIC_CLUSTER_GROUP_ORDER) {
    bucket.set(id, []);
  }

  for (const c of clusters) {
    const def = DEF_BY_SLUG.get(c.topicSlug);
    const gid = def?.group ?? "other";
    const list = bucket.get(gid) ?? bucket.get("other")!;
    list.push(c);
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
