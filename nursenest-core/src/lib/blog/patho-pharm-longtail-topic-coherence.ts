/**
 * Clinical coherence gate for patho/pharm long-tail blog topics.
 * Registry rows must pass strict search-style patterns + duplicate-safe keys; synthetic rows must match curated allowlists.
 */

import {
  normalizeTopicKey,
  titleHasVaguePhrasing,
  titleMatchesBannedBroadOrNonClinicalTopic,
  titleMatchesStrictSearchPattern,
  titleSuggestsUnrelatedSystemPairing,
} from "./patho-pharm-longtail-topic-patterns";
import {
  BODY_SYSTEMS,
  CONDITION_SYMPTOM_PAIRS,
  DISEASE_MECHANISM_STEP_CONDITIONS,
  DRUG_EFFECT_PAIRS,
  DRUG_MONITORING_LIST,
  ELECTROLYTE_CONDITION_PAIRS,
  LAB_IN_CONDITION_PAIRS,
  NURSING_IMPLICATION_CONDITIONS,
  NURSING_IMPLICATION_DRUGS,
  SIGN_MECHANISM_DISEASE_TRIPLES,
  SYSTEM_BRIDGE_TRIPLES,
  TREATMENT_CONSEQUENCE_PAIRS,
} from "./patho-pharm-longtail-clinical-pairs";

export type ClinicalRelationshipType =
  | "condition_lab"
  | "condition_symptom"
  | "drug_adverse_effect"
  | "drug_monitoring"
  | "disease_mechanism";

export type TopicCoherenceInput = {
  title: string;
  slug: string;
  topicSource: "registry" | "synthetic";
  relationshipType: ClinicalRelationshipType;
};

/** Minimal validation surface (strict production gate). */
export type ClinicalTopicValidationResult = {
  ok: boolean;
  reason?: string;
};

export type ClinicalCoherenceResult = ClinicalTopicValidationResult & {
  relationshipType: ClinicalRelationshipType;
};

function norm(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[’']/g, "'");
}

function pairKey(a: string, b: string): string {
  return `${norm(a)}|||${norm(b)}`;
}

function tripleKey(a: string, b: string, c: string): string {
  return `${norm(a)}|||${norm(b)}|||${norm(c)}`;
}

let cachedAllowlists: {
  conditionSymptom: Set<string>;
  drugEffect: Set<string>;
  labInCondition: Set<string>;
  diseaseMechanism: Set<string>;
  signMechanismDisease: Set<string>;
  systemBridge: Set<string>;
  systemBridgeAb: Set<string>;
  drugMonitoring: Set<string>;
  nursingDrug: Set<string>;
  nursingCondition: Set<string>;
} | null = null;

export function buildClinicalTopicAllowlists(): {
  conditionSymptom: Set<string>;
  drugEffect: Set<string>;
  labInCondition: Set<string>;
  diseaseMechanism: Set<string>;
  signMechanismDisease: Set<string>;
  systemBridge: Set<string>;
  systemBridgeAb: Set<string>;
  drugMonitoring: Set<string>;
  nursingDrug: Set<string>;
  nursingCondition: Set<string>;
} {
  if (cachedAllowlists) return cachedAllowlists;

  const conditionSymptom = new Set<string>();
  for (const [c, f] of CONDITION_SYMPTOM_PAIRS) conditionSymptom.add(pairKey(c, f));
  for (const [el, cond] of ELECTROLYTE_CONDITION_PAIRS) conditionSymptom.add(pairKey(el, cond));
  for (const [tx, cons] of TREATMENT_CONSEQUENCE_PAIRS) conditionSymptom.add(pairKey(tx, cons));

  const drugEffect = new Set<string>();
  for (const [d, e] of DRUG_EFFECT_PAIRS) drugEffect.add(pairKey(d, e));

  const labInCondition = new Set<string>();
  for (const [lab, cond] of LAB_IN_CONDITION_PAIRS) labInCondition.add(pairKey(lab, cond));

  const diseaseMechanism = new Set<string>();
  for (const [cond] of DISEASE_MECHANISM_STEP_CONDITIONS) diseaseMechanism.add(norm(cond));

  const signMechanismDisease = new Set<string>();
  for (const [sign, mech, dis] of SIGN_MECHANISM_DISEASE_TRIPLES) {
    signMechanismDisease.add(tripleKey(sign, mech, dis));
  }

  const systemBridge = new Set<string>();
  const systemBridgeAb = new Set<string>();
  for (const [a, b, ctx] of SYSTEM_BRIDGE_TRIPLES) {
    systemBridge.add(tripleKey(a, b, ctx));
    systemBridgeAb.add(pairKey(a, b));
  }

  const drugMonitoring = new Set<string>();
  for (const [d] of DRUG_MONITORING_LIST) drugMonitoring.add(norm(d));

  const nursingDrug = new Set<string>();
  for (const [d] of NURSING_IMPLICATION_DRUGS) nursingDrug.add(norm(d));

  const nursingCondition = new Set<string>();
  for (const [c] of NURSING_IMPLICATION_CONDITIONS) nursingCondition.add(norm(c));

  cachedAllowlists = {
    conditionSymptom,
    drugEffect,
    labInCondition,
    diseaseMechanism,
    signMechanismDisease,
    systemBridge,
    systemBridgeAb,
    drugMonitoring,
    nursingDrug,
    nursingCondition,
  };
  return cachedAllowlists;
}

const BODY_SYSTEM_NORM = new Set<string>(BODY_SYSTEMS.map((s) => norm(s)));

const MAX_TITLE_ENTITY_LEN = 95;

function titleSuggestsVersusComparison(title: string): boolean {
  return /\bvs\.?\b|\bversus\b|\bcompared to\b/i.test(title);
}

function titleEntitiesWithinSingleArticleScope(title: string): { ok: true } | { ok: false; reason: string } {
  const t = title.trim();
  const chunks: string[] = [];
  const m1 = /^Why does (.+?) cause (.+)\?$/i.exec(t);
  const m2 = /^Why does (.+?) lead to (.+)\?$/i.exec(t);
  const m3 = /^How does (.+?) cause (.+)\?$/i.exec(t);
  const m4 = /^How does (.+?) affect (.+?) physiologically\?$/i.exec(t);
  const m5 = /^What should nurses monitor in (.+?) and why\?$/i.exec(t);
  if (m1) {
    chunks.push(m1[1]!, m1[2]!);
  } else if (m2) {
    chunks.push(m2[1]!, m2[2]!);
  } else if (m3) {
    chunks.push(m3[1]!, m3[2]!);
  } else if (m4) {
    chunks.push(m4[1]!, m4[2]!);
  } else if (m5) {
    chunks.push(m5[1]!);
  }
  for (const c of chunks) {
    if (c.length > MAX_TITLE_ENTITY_LEN) {
      return { ok: false, reason: "title_entity_too_long_for_single_article" };
    }
  }
  return { ok: true };
}

/** @deprecated Prefer `titleMatchesStrictSearchPattern` from topic-patterns. */
export function titleLooksLikeNaturalSearchQuery(title: string): boolean {
  return titleMatchesStrictSearchPattern(title);
}

/**
 * Validates that a topic reflects a clinically plausible relationship and strict production phrasing.
 * Registry and synthetic rows share the same gate: title templates + curated allowlists (no registry bypass).
 */
export function validateClinicalTopicCoherence(topic: TopicCoherenceInput): ClinicalCoherenceResult {
  const rt = topic.relationshipType;
  const fail = (reason: string): ClinicalCoherenceResult => ({ ok: false, reason, relationshipType: rt });
  const ok = (): ClinicalCoherenceResult => ({ ok: true, relationshipType: rt });

  if (!titleMatchesStrictSearchPattern(topic.title)) {
    return fail("title_not_strict_search_pattern");
  }
  if (titleHasVaguePhrasing(topic.title)) {
    return fail("title_contains_vague_phrasing");
  }
  if (titleMatchesBannedBroadOrNonClinicalTopic(topic.title)) {
    return fail("title_banned_broad_or_non_clinical");
  }
  if (titleSuggestsUnrelatedSystemPairing(topic.title)) {
    return fail("title_unrelated_system_mashup");
  }
  if (titleSuggestsVersusComparison(topic.title)) {
    return fail("title_multi_mechanism_comparison");
  }
  const scope = titleEntitiesWithinSingleArticleScope(topic.title);
  if (!scope.ok) {
    return fail(scope.reason);
  }

  const lists = buildClinicalTopicAllowlists();
  const title = topic.title.trim();

  if (rt === "condition_symptom") {
    const mCause = /^Why does (.+?) cause (.+)\?$/i.exec(title);
    if (mCause && lists.conditionSymptom.has(pairKey(mCause[1]!, mCause[2]!))) {
      return ok();
    }
    const mLead = /^Why does (.+?) lead to (.+)\?$/i.exec(title);
    if (mLead && lists.conditionSymptom.has(pairKey(mLead[1]!, mLead[2]!))) {
      return ok();
    }
    return fail("pattern_mismatch_or_pair_not_in_condition_symptom_allowlist");
  }

  if (rt === "drug_adverse_effect") {
    const m = /^How does (.+?) cause (.+)\?$/i.exec(title);
    if (!m) return fail("pattern_mismatch_how_does_cause");
    if (!lists.drugEffect.has(pairKey(m[1]!, m[2]!))) return fail("pair_not_in_drug_effect_allowlist");
    return ok();
  }

  if (rt === "condition_lab") {
    const m = /^Why does (.+?) cause (.+)\?$/i.exec(title);
    if (!m) return fail("pattern_mismatch_why_does_cause_lab");
    if (!lists.labInCondition.has(pairKey(m[1]!, m[2]!))) return fail("pair_not_in_lab_condition_allowlist");
    return ok();
  }

  if (rt === "disease_mechanism") {
    const mPhys = /^How does (.+?) affect (.+?) physiologically\?$/i.exec(title);
    if (!mPhys) return fail("disease_mechanism_title_unrecognized");
    const a = mPhys[1]!;
    const b = mPhys[2]!;
    const na = norm(a);
    const nb = norm(b);
    if (lists.diseaseMechanism.has(na) && BODY_SYSTEM_NORM.has(nb)) return ok();
    for (const [sign, _mech, dis] of SIGN_MECHANISM_DISEASE_TRIPLES) {
      if (norm(sign) === na && norm(dis) === nb) return ok();
    }
    if (lists.systemBridgeAb.has(pairKey(a, b))) return ok();
    return fail("mechanism_pair_not_allowlisted");
  }

  if (rt === "drug_monitoring") {
    const m1 = /^What should nurses monitor in (.+?) and why\?$/i.exec(title);
    if (m1 && lists.drugMonitoring.has(norm(m1[1]!))) return ok();
    if (m1 && lists.nursingDrug.has(norm(m1[1]!))) return ok();
    if (m1 && lists.nursingCondition.has(norm(m1[1]!))) return ok();
    return fail("drug_monitoring_title_unrecognized");
  }

  return fail("unknown_relationship_type");
}

function pairSemanticDuplicateParts(a: string, b: string, kind: string): string {
  let ca = norm(a);
  let cb = norm(b);
  /* Collapse near-duplicate “sepsis spectrum + hypotension outcome” article ideas to one slot. */
  if (/^(sepsis|septic shock|severe sepsis)$/.test(ca) && /\b(hypotension|refractory hypotension)\b/.test(cb)) {
    ca = "__sepsis_spectrum__";
    cb = "__hypotension_outcome__";
  }
  return `${kind}|||${ca}|||${cb}`;
}

/**
 * Duplicate-safe key: parsed relationship slots + light clinical canonicalization (e.g. sepsis–hypotension cluster).
 */
export function semanticMechanismDuplicateKey(title: string): string {
  const t = title.trim();
  const whyCause = /^Why does (.+?) cause (.+)\?$/i.exec(t);
  if (whyCause) return pairSemanticDuplicateParts(whyCause[1]!, whyCause[2]!, "why_cause");
  const whyLead = /^Why does (.+?) lead to (.+)\?$/i.exec(t);
  if (whyLead) return pairSemanticDuplicateParts(whyLead[1]!, whyLead[2]!, "why_lead");
  const howCause = /^How does (.+?) cause (.+)\?$/i.exec(t);
  if (howCause) return pairSemanticDuplicateParts(howCause[1]!, howCause[2]!, "how_cause");
  const howPhys = /^How does (.+?) affect (.+?) physiologically\?$/i.exec(t);
  if (howPhys) return pairSemanticDuplicateParts(howPhys[1]!, howPhys[2]!, "how_phys");
  const mon = /^What should nurses monitor in (.+?) and why\?$/i.exec(t);
  if (mon) return `monitor|||${norm(mon[1]!)}`;
  return normalizeTopicKey(t.replace(/\?/g, ""));
}
