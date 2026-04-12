/**
 * Additional **keyword + pathway-gated** rationale→lesson rows for PN, NP, Allied, and new-graduate cohorts.
 * @see explicit-tiered-rationale-topics.ts for topic-slug explicit tier mapping (higher priority).
 */
import type { LessonRationaleMappingEntry } from "@/lib/learner/lesson-question-rationale/types";
import { CLINICAL_JUDGMENT_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/clinical-judgment-prioritization-gold-standard";
import { NP_PRIMARY_CARE_FOUNDATIONS_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/np-primary-care-foundations-gold-standard";

const PN_US = ["us-lpn-nclex-pn"] as const;
const PN_CA = ["ca-rpn-rex-pn"] as const;
const NP_ALL = [
  "us-np-fnp",
  "us-np-agpcnp",
  "us-np-pmhnp",
  "us-np-whnp",
  "us-np-pnp-pc",
  "ca-np-cnple",
] as const;
const ALLIED = ["us-allied-core", "ca-allied-core"] as const;
const RN_US_NEW_GRAD = ["us-rn-nclex-rn", "us-lpn-nclex-pn"] as const;

const PN_WEIGHT = 103;
const NP_WEIGHT = 104;
const ALLIED_WEIGHT = 87;
const NEW_GRAD_WEIGHT = 89;

/** Slugs introduced here (for allowlist merge in match.ts). */
export const TIER_RATIONALE_REGISTRY_EXTRA_SLUGS: string[] = [];

function pushUniqueSlug(slug: string) {
  if (!TIER_RATIONALE_REGISTRY_EXTRA_SLUGS.includes(slug)) TIER_RATIONALE_REGISTRY_EXTRA_SLUGS.push(slug);
}

function entry(e: LessonRationaleMappingEntry): LessonRationaleMappingEntry {
  pushUniqueSlug(e.lessonSlug);
  return e;
}

const PN_PAIRS: Array<{ id: string; slugUs: string; slugCa: string; pattern: RegExp }> = [
  { id: "pn-x-pneumonia", slugUs: "us-pn-pneumonia", slugCa: "ca-rpn-pneumonia", pattern: /\b(pneumonia|lobar pneumonia|community[\s-]acquired pneumonia)\b/i },
  { id: "pn-x-asthma", slugUs: "us-pn-asthma", slugCa: "ca-rpn-asthma", pattern: /\b(asthma|wheez|bronchospasm)\b/i },
  { id: "pn-x-htn", slugUs: "us-pn-hypertension", slugCa: "ca-rpn-hypertension", pattern: /\b(hypertension|anti[\s-]?hypertensive|blood pressure crisis)\b/i },
  { id: "pn-x-wound", slugUs: "us-pn-wound-care", slugCa: "ca-rpn-wound-care", pattern: /\b(wound care|pressure injury|pressure ulcer|staged ulcer)\b/i },
  { id: "pn-x-pain", slugUs: "us-pn-pain-management", slugCa: "ca-rpn-pain-management", pattern: /\b(pain assessment|pain scale|pca\b|opioid)\b/i },
  { id: "pn-x-abg", slugUs: "us-pn-abg-interpretation", slugCa: "ca-rpn-abg-interpretation", pattern: /\b(abg|arterial blood gas|acidosis|alkalosis|paco2)\b/i },
  { id: "pn-x-therapeutic", slugUs: "therapeutic-communication", slugCa: "therapeutic-communication", pattern: /\b(therapeutic communication|active listening|non[\s-]?therapeutic)\b/i },
];

const expansion: LessonRationaleMappingEntry[] = [];

for (const p of PN_PAIRS) {
  expansion.push(
    entry({
      id: `tier-pn-us-${p.id}`,
      lessonSlug: p.slugUs,
      domain: "disease",
      linkKind: "disease_process",
      haystackPattern: p.pattern,
      baseWeight: PN_WEIGHT,
      pathwayIdsAllow: [...PN_US],
    }),
    entry({
      id: `tier-pn-ca-${p.id}`,
      lessonSlug: p.slugCa,
      domain: "disease",
      linkKind: "disease_process",
      haystackPattern: p.pattern,
      baseWeight: PN_WEIGHT,
      pathwayIdsAllow: [...PN_CA],
    }),
  );
}

expansion.push(
  entry({
    id: "tier-np-foundations-haystack",
    lessonSlug: NP_PRIMARY_CARE_FOUNDATIONS_GOLD_SLUG,
    domain: "prioritization",
    linkKind: "prioritization",
    haystackPattern: /\b(primary care|outpatient|follow[\s-]?up|chronic care|care plan)\b/i,
    baseWeight: NP_WEIGHT,
    pathwayIdsAllow: [...NP_ALL],
  }),
  entry({
    id: "tier-np-differential",
    lessonSlug: "fnp-differential-primary-care",
    domain: "disease",
    linkKind: "disease_process",
    haystackPattern: /\b(differential diagnosis|differential|most likely diagnosis|clinical reasoning)\b/i,
    baseWeight: NP_WEIGHT,
    pathwayIdsAllow: [...NP_ALL],
  }),
  entry({
    id: "tier-np-diabetes-overlay",
    lessonSlug: "fnp-overlay-diabetes-metabolic",
    domain: "disease",
    linkKind: "disease_process",
    haystackPattern: /\b(type\s?1 diabetes|type\s?2 diabetes|a1c|hyperglycemia|insulin adjustment)\b/i,
    baseWeight: NP_WEIGHT,
    pathwayIdsAllow: [...NP_ALL],
  }),
  entry({
    id: "tier-allied-vitals",
    lessonSlug: CLINICAL_JUDGMENT_GOLD_SLUG,
    domain: "safety",
    linkKind: "safety",
    haystackPattern: /\b(vital signs|blood pressure|temperature|pulse ox|spo2|tachycardia)\b/i,
    baseWeight: ALLIED_WEIGHT,
    pathwayIdsAllow: [...ALLIED],
    roleTracksAllow: ["allied"],
  }),
  entry({
    id: "tier-allied-scope",
    lessonSlug: CLINICAL_JUDGMENT_GOLD_SLUG,
    domain: "safety",
    linkKind: "safety",
    haystackPattern: /\b(scope of practice|allied health|paramedic|emt|technician|therapy assistant)\b/i,
    baseWeight: ALLIED_WEIGHT - 1,
    pathwayIdsAllow: [...ALLIED],
    roleTracksAllow: ["allied"],
  }),
  entry({
    id: "tier-newgrad-orientation",
    lessonSlug: "clinical-judgment-prioritization-gold",
    domain: "prioritization",
    linkKind: "prioritization",
    haystackPattern: /\b(new graduate|new grad|orientation|nursing school|first semester|student nurse|skills lab)\b/i,
    baseWeight: NEW_GRAD_WEIGHT,
    pathwayIdsAllow: [...RN_US_NEW_GRAD],
  }),
);

export const TIER_RATIONALE_REGISTRY_EXPANSION: LessonRationaleMappingEntry[] = expansion;
