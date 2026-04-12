/**
 * **Explicit topic signals → lesson slug** per tier (RN / PN / NP / Allied).
 * Highest priority in {@link rankRelatedLessonSlugsForQuestion}: deterministic, no DB.
 */
import { ACS_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/acute-coronary-syndrome-gold-standard";
import { CLINICAL_JUDGMENT_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/clinical-judgment-prioritization-gold-standard";
import { COPD_GOLD_STANDARD_SLUG } from "@/lib/lessons/scoped-lessons/copd-gold-standard";
import { FLUIDS_ELECTROLYTES_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/fluids-electrolytes-emergencies-gold-standard";
import { HIGH_ALERT_MEDS_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/high-alert-medications-gold-standard";
import { NP_NEUROLOGY_OUTPATIENT_PRIMARY_CARE_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/np-neurology-outpatient-primary-care-gold-standard";
import { NP_PRIMARY_CARE_FOUNDATIONS_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/np-primary-care-foundations-gold-standard";
import { SEPSIS_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/sepsis-early-recognition-gold-standard";
import { SHOCK_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/shock-gold-standard";
import { STROKE_ICP_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/stroke-increased-icp-gold-standard";
import { normalizeTopicKey } from "@/lib/learner/topic-normalize";
import type {
  LessonConceptDomain,
  PathwayRationaleContext,
  QuestionRationaleSignals,
  RankedLessonSlug,
  RationaleLessonLinkKind,
} from "@/lib/learner/lesson-question-rationale/types";
import { gatesAllowEntry } from "@/lib/learner/lesson-question-rationale/tier-rationale-gates";

/** Tier bucket for catalog + explicit lesson slug selection. */
export type RationaleTierGroup = "rn_nclex" | "pn_us" | "pn_ca" | "np" | "allied";

const RN_NCLEX_PATHWAYS = new Set(["us-rn-nclex-rn", "ca-rn-nclex-rn"]);
const PN_US_PATHWAYS = new Set(["us-lpn-nclex-pn"]);
const PN_CA_PATHWAYS = new Set(["ca-rpn-rex-pn"]);
const NP_PATHWAYS = new Set([
  "us-np-fnp",
  "us-np-agpcnp",
  "us-np-pmhnp",
  "us-np-whnp",
  "us-np-pnp-pc",
  "ca-np-cnple",
]);
const ALLIED_PATHWAYS = new Set(["us-allied-core", "ca-allied-core"]);

export function rationaleTierGroupFromPathwayId(pathwayId: string | null | undefined): RationaleTierGroup | null {
  const id = (pathwayId ?? "").trim();
  if (!id) return null;
  if (RN_NCLEX_PATHWAYS.has(id)) return "rn_nclex";
  if (PN_US_PATHWAYS.has(id)) return "pn_us";
  if (PN_CA_PATHWAYS.has(id)) return "pn_ca";
  if (NP_PATHWAYS.has(id)) return "np";
  if (ALLIED_PATHWAYS.has(id)) return "allied";
  return null;
}

export type ExplicitTieredTopicRule = {
  id: string;
  /** Normalized topic-like keys (from bank topic/subtopic/tags/topicCode). */
  topicKeys: string[];
  lessons: Partial<Record<RationaleTierGroup, string>>;
  domain: LessonConceptDomain;
  linkKind: RationaleLessonLinkKind;
  /** Optional extra gates (pathway allow/deny). */
  pathwayIdsAllow?: string[];
  pathwayIdsDeny?: string[];
};

/**
 * Prioritized clinical topics for rationale deep links (editorial list).
 * Slugs must exist in the pathway catalog or gold registry for the tier.
 */
export const EXPLICIT_TIERED_TOPIC_RULES: ExplicitTieredTopicRule[] = [
  {
    id: "exp-sepsis",
    topicKeys: ["sepsis", "septic shock", "qsofa", "septicemia", "bacteremia"],
    lessons: {
      rn_nclex: "sepsis-nclex-rn",
      pn_us: "us-pn-sepsis",
      pn_ca: "ca-rpn-sepsis",
      np: "fnp-overlay-sepsis-infection",
      allied: SEPSIS_GOLD_SLUG,
    },
    domain: "disease",
    linkKind: "disease_process",
  },
  {
    id: "exp-shock",
    topicKeys: ["shock", "hypovolemic shock", "cardiogenic shock", "distributive shock"],
    lessons: {
      rn_nclex: SHOCK_GOLD_SLUG,
      pn_us: "us-pn-shock",
      pn_ca: "ca-rpn-shock",
      np: "fnp-overlay-shock",
      allied: SHOCK_GOLD_SLUG,
    },
    domain: "syndrome",
    linkKind: "disease_process",
  },
  {
    id: "exp-mi",
    topicKeys: [
      "myocardial-infarction",
      "myocardial infarction",
      "stemi",
      "nstemi",
      "acute coronary",
      "acute-coronary",
      "troponin",
    ],
    lessons: {
      rn_nclex: "myocardial-infarction-nclex-rn",
      pn_us: "us-pn-myocardial-infarction",
      pn_ca: "ca-rpn-myocardial-infarction",
      np: "fnp-overlay-myocardial-infarction",
      allied: ACS_GOLD_SLUG,
    },
    domain: "disease",
    linkKind: "disease_process",
  },
  {
    id: "exp-hf",
    topicKeys: ["heart failure", "heart-failure", "chf", "hfpref", "hfref", "reduced ejection"],
    lessons: {
      rn_nclex: "heart-failure-nclex-rn",
      pn_us: "us-pn-heart-failure",
      pn_ca: "ca-rpn-heart-failure",
      np: "fnp-overlay-heart-failure",
      allied: CLINICAL_JUDGMENT_GOLD_SLUG,
    },
    domain: "disease",
    linkKind: "disease_process",
  },
  {
    id: "exp-pe",
    topicKeys: ["pulmonary embolism", "pulmonary-embolism", "venous thromboembolism", "vte", "deep vein thrombosis", "dvt"],
    lessons: {
      rn_nclex: "pulmonary-embolism-nclex-rn",
      pn_us: "us-pn-pulmonary-embolism",
      pn_ca: "ca-rpn-pulmonary-embolism",
      np: NP_PRIMARY_CARE_FOUNDATIONS_GOLD_SLUG,
      allied: NP_PRIMARY_CARE_FOUNDATIONS_GOLD_SLUG,
    },
    domain: "disease",
    linkKind: "disease_process",
  },
  {
    id: "exp-copd",
    topicKeys: ["copd", "chronic obstructive", "emphysema", "chronic bronchitis"],
    lessons: {
      rn_nclex: "copd-nclex-rn",
      pn_us: "us-pn-copd-respiratory",
      pn_ca: "ca-rpn-copd-respiratory",
      np: "fnp-overlay-respiratory-acute",
      allied: COPD_GOLD_STANDARD_SLUG,
    },
    domain: "disease",
    linkKind: "disease_process",
  },
  {
    id: "exp-dka",
    topicKeys: ["dka", "diabetic ketoacidosis", "ketoacidosis", "hyperglycemic hyperosmolar", "hhs"],
    lessons: {
      rn_nclex: "diabetic-ketoacidosis-nclex-rn",
      pn_us: "us-pn-insulin-hypoglycemia",
      pn_ca: "ca-rpn-insulin-hypoglycemia",
      np: "fnp-overlay-diabetes-metabolic",
      allied: FLUIDS_ELECTROLYTES_GOLD_SLUG,
    },
    domain: "disease",
    linkKind: "disease_process",
  },
  {
    id: "exp-stroke",
    topicKeys: ["stroke", "cva", "tia", "intracranial", "icp", "increased intracranial"],
    lessons: {
      rn_nclex: "increased-intracranial-pressure-nclex-rn",
      pn_us: "us-pn-hypertension",
      pn_ca: "ca-rpn-hypertension",
      np: NP_NEUROLOGY_OUTPATIENT_PRIMARY_CARE_GOLD_SLUG,
      allied: STROKE_ICP_GOLD_SLUG,
    },
    domain: "disease",
    linkKind: "disease_process",
  },
  {
    id: "exp-delegation",
    topicKeys: ["delegation", "lpn scope", "pn scope", "uap", "nursing assistant", "assignment"],
    lessons: {
      rn_nclex: "safety-family-delegation-supervision-gold",
      pn_us: "us-pn-delegation",
      pn_ca: "ca-rpn-delegation",
      np: NP_PRIMARY_CARE_FOUNDATIONS_GOLD_SLUG,
      allied: "safety-family-delegation-supervision-gold",
    },
    domain: "delegation",
    linkKind: "safety",
  },
  {
    id: "exp-prioritization",
    topicKeys: ["prioritization", "prioritisation", "first action", "most urgent", "triage"],
    lessons: {
      rn_nclex: "clinical-judgment-prioritization-gold",
      pn_us: "us-pn-prioritization-abcs",
      pn_ca: "ca-rpn-prioritization-abcs",
      np: "bp26-usnp-x028-rapid-response-activation-criteria",
      allied: "clinical-judgment-prioritization-gold",
    },
    domain: "prioritization",
    linkKind: "prioritization",
  },
  {
    id: "exp-infection",
    topicKeys: ["infection control", "ppe", "isolation", "standard precautions", "hand hygiene"],
    lessons: {
      rn_nclex: "safety-family-infection-control-gold",
      pn_us: "us-pn-infection-control",
      pn_ca: "ca-rpn-infection-control",
      np: "fnp-overlay-sepsis-infection",
      allied: "safety-family-infection-control-gold",
    },
    domain: "safety",
    linkKind: "safety",
  },
  {
    id: "exp-medsafety",
    topicKeys: ["high alert", "high-alert", "medication safety", "five rights", "six rights", "insulin"],
    lessons: {
      rn_nclex: HIGH_ALERT_MEDS_GOLD_SLUG,
      pn_us: "us-pn-insulin-hypoglycemia",
      pn_ca: "ca-rpn-insulin-hypoglycemia",
      np: NP_PRIMARY_CARE_FOUNDATIONS_GOLD_SLUG,
      allied: HIGH_ALERT_MEDS_GOLD_SLUG,
    },
    domain: "safety",
    linkKind: "safety",
  },
];

function collectNormalizedLookupKeys(signals: QuestionRationaleSignals): string[] {
  const raw: Array<string | null | undefined> = [
    signals.subtopic,
    signals.topic,
    signals.bodySystem,
    signals.topicCode,
    ...signals.tags,
  ];
  const out: string[] = [];
  for (const r of raw) {
    const t = (r ?? "").trim();
    if (t.length < 2) continue;
    const k = normalizeTopicKey(t);
    if (k && k !== "general") out.push(k);
  }
  return [...new Set(out)];
}

function keyMatchesTopicRule(lookupKeys: string[], ruleKeys: string[]): boolean {
  for (const k of lookupKeys) {
    for (const r of ruleKeys) {
      const rn = normalizeTopicKey(r);
      if (k === rn) return true;
      if (rn.length >= 5 && (k.includes(rn) || rn.includes(k))) return true;
    }
  }
  return false;
}

/** Score for explicit tier matches — above catalog regex weights (~103). */
export const EXPLICIT_TIER_TOPIC_SCORE = 115;

/**
 * Deterministic explicit links from topic/subtopic/tags/topicCode for the learner pathway tier.
 */
export function tryExplicitTieredTopicLinks(
  signals: QuestionRationaleSignals,
  pathwayCtx: PathwayRationaleContext | null,
): RankedLessonSlug[] {
  const tier = rationaleTierGroupFromPathwayId(pathwayCtx?.pathwayId);
  if (!tier) return [];

  const lookupKeys = collectNormalizedLookupKeys(signals);
  if (lookupKeys.length === 0) return [];

  const pseudoEntry = (rule: ExplicitTieredTopicRule) => ({
    pathwayIdsAllow: rule.pathwayIdsAllow,
    pathwayIdsDeny: rule.pathwayIdsDeny,
  });

  const out: RankedLessonSlug[] = [];
  for (const rule of EXPLICIT_TIERED_TOPIC_RULES) {
    if (!keyMatchesTopicRule(lookupKeys, rule.topicKeys)) continue;
    if (!gatesAllowEntry(pseudoEntry(rule), pathwayCtx)) continue;
    const slug = rule.lessons[tier];
    if (!slug) continue;
    out.push({
      lessonSlug: slug,
      kind: rule.linkKind,
      domain: rule.domain,
      score: EXPLICIT_TIER_TOPIC_SCORE,
      matchedEntryId: rule.id,
    });
  }
  return out;
}

/** Topic keys used for coverage audits / tooling. */
export const PRIORITIZED_RATIONALE_TOPIC_KEYS_BY_TIER: Record<RationaleTierGroup, string[]> = {
  rn_nclex: [
    "sepsis",
    "shock",
    "myocardial infarction",
    "heart failure",
    "pulmonary embolism",
    "copd",
    "dka",
    "stroke",
    "delegation",
    "prioritization",
    "infection control",
    "medication safety",
  ],
  pn_us: [
    "sepsis",
    "shock",
    "myocardial infarction",
    "heart failure",
    "pulmonary embolism",
    "copd",
    "insulin",
    "delegation",
    "prioritization",
    "infection control",
  ],
  pn_ca: [
    "sepsis",
    "shock",
    "myocardial infarction",
    "heart failure",
    "pulmonary embolism",
    "copd",
    "delegation",
    "infection control",
  ],
  np: [
    "primary care",
    "sepsis",
    "diabetes",
    "hypertension",
    "respiratory",
    "mental health",
    "women's health",
    "pediatric fever",
  ],
  allied: [
    "infection control",
    "medication safety",
    "vital signs",
    "documentation",
    "airway",
    "emergency response",
  ],
};
