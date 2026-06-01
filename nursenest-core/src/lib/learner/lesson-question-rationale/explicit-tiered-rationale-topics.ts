/**
 * **Explicit topic signals → lesson slug** per tier (RN / PN / NP / Allied).
 * Highest priority in {@link rankRelatedLessonSlugsForQuestion}: deterministic, no DB.
 */
import { ACS_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/acute-coronary-syndrome-gold-standard";
import { CLINICAL_JUDGMENT_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/clinical-judgment-prioritization-gold-standard";
import { COPD_GOLD_STANDARD_SLUG } from "@/lib/lessons/scoped-lessons/copd-gold-standard";
import { FLUIDS_ELECTROLYTES_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/fluids-electrolytes-emergencies-gold-standard";
import { HIGH_ALERT_MEDS_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/high-alert-medications-gold-standard";
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
      np: NP_PRIMARY_CARE_FOUNDATIONS_GOLD_SLUG,
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
  // ── Blueprint gap-closure 2026 explicit topic rules ──────────────────────
  {
    id: "exp-dvt",
    topicKeys: ["dvt", "deep vein thrombosis", "venous thrombosis", "anticoagulation", "heparin", "warfarin", "enoxaparin", "hit", "heparin induced"],
    lessons: { pn_us: "us-pn-dvt-deep-vein-thrombosis", pn_ca: "ca-rpn-pulmonary-embolism", rn_nclex: "us-rn-pulmonary-embolism" },
    domain: "disease",
    linkKind: "disease_process",
  },
  {
    id: "exp-respiratory-failure",
    topicKeys: ["respiratory failure", "hypoxemia", "hypoxemic", "hypercapnia", "hypercapnic", "mechanical ventilation", "intubation", "ards", "respiratory arrest"],
    lessons: { pn_us: "us-pn-respiratory-failure", pn_ca: "ca-rpn-ards", rn_nclex: "respiratory-assessment-ngn" },
    domain: "disease",
    linkKind: "disease_process",
  },
  {
    id: "exp-oxygen-therapy",
    topicKeys: ["oxygen therapy", "nasal cannula", "non-rebreather", "venturi mask", "fio2", "supplemental oxygen", "oxygen delivery", "oxygen safety"],
    lessons: { pn_us: "us-pn-oxygen-therapy-fundamentals", pn_ca: "ca-rpn-copd-respiratory", rn_nclex: "respiratory-assessment-ngn" },
    domain: "medication_class",
    linkKind: "medication",
  },
  {
    id: "exp-diabetes-mgmt",
    topicKeys: ["diabetes mellitus", "type 1 diabetes", "type 2 diabetes", "diabetes management", "hba1c", "glycemic control", "diabetic", "glucose monitoring", "insulin resistance"],
    lessons: { pn_us: "us-pn-diabetes-management", pn_ca: "ca-rpn-insulin-hypoglycemia", np: "np-ca-cnple-chronic-disease-hypertension-diabetes-mgmt" },
    domain: "disease",
    linkKind: "disease_process",
  },
  {
    id: "exp-hyperglycemia",
    topicKeys: ["hyperglycemia", "dka", "diabetic ketoacidosis", "hhs", "hyperosmolar", "steroid induced hyperglycemia", "high blood sugar"],
    lessons: { pn_us: "us-pn-hyperglycemia-management", pn_ca: "bp26-carpn-pa-dka-vs-hhs", rn_nclex: "us-rn-heart-failure" },
    domain: "disease",
    linkKind: "disease_process",
  },
  {
    id: "exp-diuretics",
    topicKeys: ["diuretic", "furosemide", "lasix", "hydrochlorothiazide", "hctz", "spironolactone", "loop diuretic", "thiazide", "potassium sparing"],
    lessons: { pn_us: "us-pn-diuretics-pharmacology", pn_ca: "ca-rpn-heart-failure", rn_nclex: "us-rn-heart-failure" },
    domain: "medication_class",
    linkKind: "medication",
  },
  {
    id: "exp-cardiac-meds",
    topicKeys: ["digoxin", "digoxin toxicity", "beta blocker", "metoprolol", "carvedilol", "calcium channel blocker", "amlodipine", "diltiazem", "verapamil", "cardiac medication"],
    lessons: { pn_us: "us-pn-cardiac-medications", pn_ca: "ca-rpn-dysrhythmias", rn_nclex: "us-rn-heart-failure" },
    domain: "medication_class",
    linkKind: "medication",
  },
  {
    id: "exp-med-administration",
    topicKeys: ["medication administration", "six rights", "5 rights", "mar", "medication error", "high alert medication", "medication reconciliation", "verbal order", "barcode"],
    lessons: { pn_us: "us-pn-medication-administration-six-rights", pn_ca: "pn-scope-safety-basics", rn_nclex: HIGH_ALERT_MEDS_GOLD_SLUG },
    domain: "safety",
    linkKind: "safety",
  },
  {
    id: "exp-ethics-pn",
    topicKeys: ["ethics", "ethical", "autonomy", "informed consent", "hipaa", "confidentiality", "mandatory reporting", "scope of practice", "professional standards"],
    lessons: { pn_us: "us-pn-ethics-professional-standards", pn_ca: "ca-rpn-professional-responsibility-canada", np: "np-ca-cnple-professional-accountability-regulatory" },
    domain: "delegation",
    linkKind: "prioritization",
  },
  {
    id: "exp-client-education",
    topicKeys: ["client education", "patient education", "teach back", "health literacy", "teaching method", "discharge education", "learning readiness"],
    lessons: { pn_us: "us-pn-client-education-principles", pn_ca: "ca-rpn-client-safety-falls-restraints", rn_nclex: "us-rn-therapeutic-communication-fundamentals" },
    domain: "safety",
    linkKind: "topic_hub",
  },
  {
    id: "exp-therapeutic-communication",
    topicKeys: ["therapeutic communication", "active listening", "open ended", "non therapeutic", "false reassurance", "nurse patient relationship", "communication technique"],
    lessons: { rn_nclex: "us-rn-therapeutic-communication-fundamentals", pn_us: "therapeutic-communication", pn_ca: "ca-rpn-professional-responsibility-canada" },
    domain: "delegation",
    linkKind: "prioritization",
  },
  {
    id: "exp-postpartum-hemorrhage",
    topicKeys: ["postpartum hemorrhage", "uterine atony", "pph", "boggy uterus", "oxytocin", "methylergonovine", "methergine", "carboprost", "postpartum bleeding", "four t"],
    lessons: { rn_nclex: "us-rn-postpartum-hemorrhage", pn_us: "bp26-uslpn-mat-postpartum-hem", pn_ca: "postpartum-fundus-lochia" },
    domain: "disease",
    linkKind: "disease_process",
  },
  {
    id: "exp-preeclampsia",
    topicKeys: ["preeclampsia", "eclampsia", "hellp", "magnesium sulfate", "magnesium toxicity", "hypertension pregnancy", "gestational hypertension", "calcium gluconate antidote"],
    lessons: { rn_nclex: "us-rn-preeclampsia-eclampsia", pn_us: "bp26-uslpn-mat-labor-fhr", pn_ca: "postpartum-fundus-lochia" },
    domain: "disease",
    linkKind: "disease_process",
  },
  {
    id: "exp-pediatric-respiratory",
    topicKeys: ["croup", "bronchiolitis", "asthma exacerbation", "pediatric asthma", "epiglottitis", "rsv", "stridor", "barking cough", "silent chest", "racemic epinephrine"],
    lessons: { rn_nclex: "us-rn-pediatric-respiratory-asthma-croup-bronchiolitis", pn_ca: "ca-rpn-pediatric-fever-assessment" },
    domain: "disease",
    linkKind: "disease_process",
  },
  {
    id: "exp-pediatric-dehydration",
    topicKeys: ["pediatric dehydration", "oral rehydration", "ort", "holliday segar", "infant dehydration", "sunken fontanelle", "pediatric fluid"],
    lessons: { rn_nclex: "us-rn-pediatric-fluid-fever-dehydration", pn_ca: "ca-rpn-pediatric-fever-assessment" },
    domain: "disease",
    linkKind: "disease_process",
  },
  {
    id: "exp-pediatric-fever",
    topicKeys: ["febrile seizure", "pediatric fever", "infant fever", "neonatal fever", "fever management pediatric", "aspirin reye"],
    lessons: { pn_ca: "ca-rpn-pediatric-fever-assessment", rn_nclex: "us-rn-pediatric-fluid-fever-dehydration" },
    domain: "disease",
    linkKind: "disease_process",
  },
  {
    id: "exp-falls-restraints",
    topicKeys: ["fall prevention", "falls risk", "morse fall", "scd", "sequential compression", "restraint", "least restraint", "fall assessment", "bed alarm"],
    lessons: { pn_us: "bp26-uslpn-sf-falls-bed-exit", pn_ca: "ca-rpn-client-safety-falls-restraints", rn_nclex: "us-rn-therapeutic-communication-fundamentals" },
    domain: "safety",
    linkKind: "safety",
  },
  {
    id: "exp-delegation-ca",
    topicKeys: ["delegation", "rpn delegation", "unregulated care worker", "ucw", "psw delegation", "sbar handoff", "interprofessional communication"],
    lessons: { pn_us: "us-pn-delegation", pn_ca: "ca-rpn-delegation-interprofessional-collaboration", rn_nclex: "us-rn-therapeutic-communication-fundamentals" },
    domain: "delegation",
    linkKind: "prioritization",
  },
  {
    id: "exp-cnple-health-promotion",
    topicKeys: ["ctfphc", "canadian screening", "naci", "immunization schedule", "health promotion canada", "mammography canada", "cervical screening canada", "cultural safety"],
    lessons: { np: "np-ca-cnple-health-promotion-canadian-framework" },
    domain: "disease",
    linkKind: "topic_hub",
    pathwayIdsAllow: ["ca-np-cnple"],
  },
  {
    id: "exp-cnple-prenatal",
    topicKeys: ["prenatal care", "antenatal", "gestational diabetes", "gbs group b strep", "rhig", "prenatal screening", "obstetric screening", "prenatal canada"],
    lessons: { np: "np-ca-cnple-prenatal-care-obstetric-screening" },
    domain: "disease",
    linkKind: "topic_hub",
    pathwayIdsAllow: ["ca-np-cnple"],
  },
  {
    id: "exp-cnple-geriatrics",
    topicKeys: ["frailty", "frail scale", "cga", "comprehensive geriatric assessment", "delirium dementia", "beers criteria", "advance care planning", "goals of care", "capacity assessment"],
    lessons: { np: "np-ca-cnple-older-adult-geriatric-assessment-frailty" },
    domain: "disease",
    linkKind: "disease_process",
    pathwayIdsAllow: ["ca-np-cnple"],
  },
  {
    id: "exp-cnple-professional",
    topicKeys: ["cnple professional", "np regulatory", "np scope canada", "mandatory reporting np", "maid canada", "pipeda", "college of nurses", "np accountability"],
    lessons: { np: "np-ca-cnple-professional-accountability-regulatory" },
    domain: "delegation",
    linkKind: "prioritization",
    pathwayIdsAllow: ["ca-np-cnple"],
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
    // Early-career / transition cues (registry: tier-newgrad-orientation).
    "new graduate",
    "orientation",
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
    "new graduate",
    "orientation",
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
