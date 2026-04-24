/**
 * Clinical coherence gate for patho/pharm long-tail blog topics.
 * Registry topics are pre-vetted; synthetic topics must match curated allowlists.
 */

import {
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

export type ClinicalCoherenceResult = {
  ok: boolean;
  reason: string;
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
  for (const [a, b, ctx] of SYSTEM_BRIDGE_TRIPLES) systemBridge.add(tripleKey(a, b, ctx));

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
    drugMonitoring,
    nursingDrug,
    nursingCondition,
  };
  return cachedAllowlists;
}

/** Heuristic: title reads like a focused search query (not a generic overview). */
export function titleLooksLikeNaturalSearchQuery(title: string): boolean {
  const t = title.trim();
  if (t.length < 18 || t.length > 200) return false;
  const words = t.split(/\s+/).length;
  if (words < 5 || words > 32) return false;
  if (/\b(overview of|introduction to|^what is\s+\w+\s*\?)\b/i.test(t)) return false;
  if (/\b(lorem ipsum|TODO|TBD|FIXME)\b/i.test(t)) return false;
  const mechanismStatement = /\bnursing implications of\b.+\bmechanism\b$/i.test(t);
  const explainMechanism = /^explain the mechanism behind\b/i.test(t);
  if (!t.includes("?") && !mechanismStatement && !explainMechanism) return false;
  return true;
}

/**
 * Validates that a topic reflects a clinically plausible relationship.
 * Registry rows are trusted; synthetic rows must match curated allowlists + title heuristics.
 */
export function validateClinicalTopicCoherence(topic: TopicCoherenceInput): ClinicalCoherenceResult {
  const rt = topic.relationshipType;

  if (topic.topicSource === "registry") {
    if (!titleLooksLikeNaturalSearchQuery(topic.title)) {
      return { ok: false, reason: "title_not_natural_search_query", relationshipType: rt };
    }
    return { ok: true, reason: "", relationshipType: rt };
  }

  if (!titleLooksLikeNaturalSearchQuery(topic.title)) {
    return { ok: false, reason: "title_not_natural_search_query", relationshipType: rt };
  }

  const lists = buildClinicalTopicAllowlists();
  const title = topic.title.trim();

  const fail = (reason: string): ClinicalCoherenceResult => ({ ok: false, reason, relationshipType: rt });

  if (rt === "condition_symptom") {
    const mCause = /^Why does (.+?) cause (.+)\?$/i.exec(title);
    if (mCause && lists.conditionSymptom.has(pairKey(mCause[1]!, mCause[2]!))) {
      return { ok: true, reason: "", relationshipType: rt };
    }
    const mHappen = /^Why does (.+?) happen in (.+)\?$/i.exec(title);
    if (mHappen && lists.conditionSymptom.has(pairKey(mHappen[1]!, mHappen[2]!))) {
      return { ok: true, reason: "", relationshipType: rt };
    }
    return fail("pattern_mismatch_or_pair_not_in_condition_symptom_allowlist");
  }

  if (rt === "drug_adverse_effect") {
    const m = /^How does (.+?) cause (.+)\?$/i.exec(title);
    if (!m) return fail("pattern_mismatch_how_does_cause");
    if (!lists.drugEffect.has(pairKey(m[1]!, m[2]!))) return fail("pair_not_in_drug_effect_allowlist");
    return { ok: true, reason: "", relationshipType: rt };
  }

  if (rt === "condition_lab") {
    const m = /^Why does (.+?) occur in (.+)\?$/i.exec(title);
    if (!m) return fail("pattern_mismatch_why_lab_in_condition");
    if (!lists.labInCondition.has(pairKey(m[1]!, m[2]!))) return fail("pair_not_in_lab_condition_allowlist");
    return { ok: true, reason: "", relationshipType: rt };
  }

  if (rt === "disease_mechanism") {
    const m1 = /^What happens in (.+?) pathophysiology step by step\?$/i.exec(title);
    if (m1) {
      if (!lists.diseaseMechanism.has(norm(m1[1]!))) return fail("condition_not_in_mechanism_allowlist");
      return { ok: true, reason: "", relationshipType: rt };
    }
    const m2 =
      /^Explain the mechanism behind (.+?) in (.+?) for bedside nursing$/i.exec(title) ||
      /^Explain the mechanism behind (.+?) in (.+?) for bedside nursing\.$/i.exec(title);
    if (m2) {
      const sign = m2[1]!;
      const disease = m2[2]!;
      let hit = false;
      for (const [s, mech, d] of SIGN_MECHANISM_DISEASE_TRIPLES) {
        if (norm(s) === norm(sign) && norm(d) === norm(disease)) {
          hit = true;
          break;
        }
      }
      if (!hit) return fail("sign_disease_not_in_mechanism_sign_allowlist");
      return { ok: true, reason: "", relationshipType: rt };
    }
    const m5 = /^How does (.+?) affect (.+?) during (.+)\?$/i.exec(title);
    if (m5) {
      if (!lists.systemBridge.has(tripleKey(m5[1]!, m5[2]!, m5[3]!))) return fail("system_bridge_not_allowlisted");
      return { ok: true, reason: "", relationshipType: rt };
    }
    return fail("disease_mechanism_title_unrecognized");
  }

  if (rt === "drug_monitoring") {
    const m1 = /^What should nurses monitor in (.+?) and why\?$/i.exec(title);
    if (m1 && lists.drugMonitoring.has(norm(m1[1]!))) return { ok: true, reason: "", relationshipType: rt };
    const m2 = /^Nursing implications of (.+?) mechanism$/i.exec(title);
    if (m2) {
      const subj = norm(m2[1]!);
      if (lists.nursingDrug.has(subj) || lists.nursingCondition.has(subj)) {
        return { ok: true, reason: "", relationshipType: rt };
      }
      return fail("nursing_implication_subject_not_allowlisted");
    }
    return fail("drug_monitoring_title_unrecognized");
  }

  return fail("unknown_relationship_type");
}
