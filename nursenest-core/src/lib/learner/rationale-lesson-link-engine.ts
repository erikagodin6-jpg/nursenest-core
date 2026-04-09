/**
 * Infer **scoped pathway lesson slugs** from question metadata (tags, topic, subtopic, body system).
 * Conservative: only emits links when keyword signals are strong enough — avoids random links.
 */
import { normalizeTopicKey } from "@/lib/learner/topic-normalize";
import { CLINICAL_JUDGMENT_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/clinical-judgment-prioritization-gold-standard";
import { SEPSIS_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/sepsis-early-recognition-gold-standard";
import { FLUIDS_ELECTROLYTES_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/fluids-electrolytes-emergencies-gold-standard";
import { ACS_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/acute-coronary-syndrome-gold-standard";
import { HIGH_ALERT_MEDS_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/high-alert-medications-gold-standard";
import { STROKE_ICP_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/stroke-increased-icp-gold-standard";
import { SHOCK_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/shock-gold-standard";
import { CANADIAN_RPN_HIGH_YIELD_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/canadian-rpn-high-yield-gold-standard";
import { COPD_GOLD_STANDARD_SLUG } from "@/lib/lessons/scoped-lessons/copd-gold-standard";
import { EXAM_COMPLETE_MED_SAFETY_SLUGS } from "@/lib/lessons/scoped-lessons/exam-complete-med-safety-specs";

export type RationaleLessonLinkKind =
  | "prioritization"
  | "disease_process"
  | "medication"
  | "safety"
  | "case_study"
  | "topic_hub";

export type RationaleLessonSlugCandidate = {
  slug: string;
  kind: RationaleLessonLinkKind;
  /** Higher = more relevant; used for ordering and deduplication. */
  score: number;
};

const MED_SAFETY_SLUG_SET = new Set(EXAM_COMPLETE_MED_SAFETY_SLUGS);

type Rule = {
  re: RegExp;
  slug: string;
  kind: RationaleLessonLinkKind;
  score: number;
};

function haystackFromQuestion(args: {
  topic?: string | null;
  subtopic?: string | null;
  bodySystem?: string | null;
  tags: string[];
}): string {
  const parts = [
    ...(args.tags ?? []).map((t) => String(t)),
    args.topic ?? "",
    args.subtopic ?? "",
    args.bodySystem ?? "",
  ];
  return parts.join(" ").toLowerCase();
}

/**
 * Rules are evaluated in order; later rules can raise scores for the same slug (max wins).
 * Regexes are **word-boundary friendly** where possible; keep patterns specific to reduce false positives.
 */
function buildRules(pathwayId: string | null): Rule[] {
  const isCaRpn = pathwayId === "ca-rpn-rex-pn";
  const base: Rule[] = [
    { re: /\b(sepsis|septic|qsofa|sofa|lactate)\b/i, slug: SEPSIS_GOLD_SLUG, kind: "disease_process", score: 95 },
    {
      re: /\b(shock|hypovolemi\w*|distributive|cardiogenic|anaphylactic\s+shock)\b/i,
      slug: SHOCK_GOLD_SLUG,
      kind: "disease_process",
      score: 92,
    },
    { re: /\b(stroke|cva|tia|icp|increased\s+intracranial|neuro\s+deficit)\b/i, slug: STROKE_ICP_GOLD_SLUG, kind: "disease_process", score: 92 },
    { re: /\b(acs|stemi|nstemi|myocardial\s+infarction|angina|nitroglycerin)\b/i, slug: ACS_GOLD_SLUG, kind: "disease_process", score: 90 },
    { re: /\b(dka|hhs|hyperglycem|hypoglycem|potassium|sodium|fluid\s+overload|dehydration|electrolyte)\b/i, slug: FLUIDS_ELECTROLYTES_GOLD_SLUG, kind: "disease_process", score: 88 },
    { re: /\b(copd|asthma|bronchodilator|inhaler|wheez)\b/i, slug: COPD_GOLD_STANDARD_SLUG, kind: "disease_process", score: 85 },
    {
      re: /\b(prioritization|prioritiz\w*|delegation|delegat\w*|triage|first\s+action|most\s+urgent|acute\s+change|rapid\s+response)\b/i,
      slug: CLINICAL_JUDGMENT_GOLD_SLUG,
      kind: "prioritization",
      score: 88,
    },
    {
      re: /\b(high[\s-]?alert|insulin|heparin|chemotherapy|look[\s-]?alike|sound[\s-]?alike|double\s+check)\b/i,
      slug: HIGH_ALERT_MEDS_GOLD_SLUG,
      kind: "safety",
      score: 90,
    },
    { re: /\b(antibiotic|antimicrobial|culture|sensitivity|c\.?\s*diff|clostridium)\b/i, slug: "med-family-antibiotics-gold", kind: "medication", score: 82 },
    { re: /\b(warfarin|heparin|anticoag|inr|aptt|anti[\s-]?xa|dabigatran|rivaroxaban|apixaban)\b/i, slug: "med-family-anticoagulants-gold", kind: "medication", score: 84 },
    { re: /\b(insulin|diabetes|glucose|a1c|sglt2|glp[\s-]?1|metformin)\b/i, slug: "med-family-insulin-diabetes-gold", kind: "medication", score: 84 },
    { re: /\b(beta[\s-]?blocker|digoxin|antiarrhythmic|nitrate|cardiac\s+med)\b/i, slug: "med-family-cardiac-gold", kind: "medication", score: 80 },
    { re: /\b(ace\s+inhibitor|arb|hypertens|lisinopril|amlodipine|blood\s+pressure\s+med)\b/i, slug: "med-family-antihypertensives-gold", kind: "medication", score: 80 },
    { re: /\b(nebulizer|albuterol|respiratory\s+med|theophylline|laba|lama|ics)\b/i, slug: "med-family-respiratory-gold", kind: "medication", score: 78 },
    { re: /\b(ssri|snri|antipsych|lithium|benzodiazep|serotonin)\b/i, slug: "med-family-psychotropic-gold", kind: "medication", score: 78 },
    { re: /\b(opioid|naloxone|pca|analges|pain\s+med|sedation)\b/i, slug: "med-family-pain-sedation-gold", kind: "medication", score: 82 },
    { re: /\b(epinephrine|anaphylaxis|atropine|code\s+blue|resuscitat|acls)\b/i, slug: "med-family-emergency-response-gold", kind: "medication", score: 80 },
    { re: /\b(infection\s+control|ppe|hand\s+hygiene|standard\s+precautions|needlestick)\b/i, slug: "safety-family-infection-control-gold", kind: "safety", score: 82 },
    { re: /\b(isolation|airborne|droplet|contact\s+precautions|c?diff\s+precautions)\b/i, slug: "safety-family-isolation-precautions-gold", kind: "safety", score: 82 },
    { re: /\b(fall\s+risk|falls|morse|stratify)\b/i, slug: "safety-family-falls-prevention-gold", kind: "safety", score: 82 },
    { re: /\b(restraint|least\s+restrictive)\b/i, slug: "safety-family-restraints-alternatives-gold", kind: "safety", score: 80 },
    {
      re: /\b(med(ication)?\s+safety|five\s+rights|six\s+rights|barcode|wrong\s+dose)\b/i,
      slug: "safety-family-medication-administration-safety-gold",
      kind: "safety",
      score: 82,
    },
    {
      re: /\b(delegation|delegat\w*|supervision|unlicensed|uap|nursing\s+assistant)\b/i,
      slug: "safety-family-delegation-supervision-gold",
      kind: "safety",
      score: 78,
    },
    {
      re: /\b(escalation|escalat\w*|notify|rapid\s+response|met\s+call|sbar)\b/i,
      slug: "safety-family-escalation-notification-gold",
      kind: "safety",
      score: 78,
    },
    {
      re: /\b(uncertain|ambiguous|worst\s+case|multiple\s+clients|competing\s+priority)\b/i,
      slug: "safety-family-prioritization-uncertainty-gold",
      kind: "prioritization",
      score: 76,
    },
  ];

  if (isCaRpn) {
    base.push({
      re: /\b(rpn|rex[\s-]?pn|canadian\s+practical|college\s+standard|scope)\b/i,
      slug: CANADIAN_RPN_HIGH_YIELD_GOLD_SLUG,
      kind: "safety",
      score: 86,
    });
  }

  return base;
}

function isAllowedSlug(slug: string): boolean {
  if (MED_SAFETY_SLUG_SET.has(slug)) return true;
  const knownCore: Set<string> = new Set([
    CLINICAL_JUDGMENT_GOLD_SLUG,
    SEPSIS_GOLD_SLUG,
    FLUIDS_ELECTROLYTES_GOLD_SLUG,
    ACS_GOLD_SLUG,
    HIGH_ALERT_MEDS_GOLD_SLUG,
    STROKE_ICP_GOLD_SLUG,
    SHOCK_GOLD_SLUG,
    CANADIAN_RPN_HIGH_YIELD_GOLD_SLUG,
    COPD_GOLD_STANDARD_SLUG,
  ]);
  return knownCore.has(slug);
}

/**
 * Returns up to `max` slug candidates with scores, deduped by slug (highest score wins).
 */
export function inferRationaleLessonSlugCandidates(
  args: {
    topic?: string | null;
    subtopic?: string | null;
    bodySystem?: string | null;
    tags: string[];
    pathwayId?: string | null;
  },
  max = 3,
): RationaleLessonSlugCandidate[] {
  const pathwayId = args.pathwayId ?? null;
  const hay = haystackFromQuestion({
    topic: args.topic,
    subtopic: args.subtopic,
    bodySystem: args.bodySystem,
    tags: args.tags ?? [],
  });
  if (hay.trim().length < 3) return [];

  const bySlug = new Map<string, RationaleLessonSlugCandidate>();

  for (const rule of buildRules(pathwayId)) {
    if (!rule.re.test(hay)) continue;
    if (!isAllowedSlug(rule.slug)) continue;
    const prev = bySlug.get(rule.slug);
    if (!prev || rule.score > prev.score) {
      bySlug.set(rule.slug, { slug: rule.slug, kind: rule.kind, score: rule.score });
    }
  }

  const sorted = [...bySlug.values()].sort((a, b) => b.score - a.score);
  return sorted.slice(0, max);
}

/**
 * Topic-cluster fallback when no lesson slug matched — uses normalized topic key as `topicSlug` segment.
 */
export function topicClusterSlugForHub(topicCode: string | null): string | null {
  if (!topicCode || topicCode === "general") return null;
  return topicCode;
}

export function normalizedTopicCodeForQuestion(args: {
  topic?: string | null;
  subtopic?: string | null;
  bodySystem?: string | null;
}): string | null {
  const sub = (args.subtopic ?? "").trim();
  if (sub.length > 1) return normalizeTopicKey(sub);
  const top = (args.topic ?? "").trim();
  if (top.length > 1) return normalizeTopicKey(top);
  const bs = (args.bodySystem ?? "").trim();
  if (bs.length > 1) return normalizeTopicKey(bs);
  return null;
}
