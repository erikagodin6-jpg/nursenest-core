/**
 * Strict production pathophysiology / pharmacology long-tail topic registry.
 * Source: clinically vetted pairs in `patho-pharm-longtail-clinical-pairs.ts` (curated / audit-aligned bank),
 * materialized into search-style titles only, with `normalizeTopicKey` + `semanticMechanismDuplicateKey`
 * dedupe, sepsis–hypotension cluster collapse, and `validateClinicalTopicCoherence` on every row at build time.
 *
 * Consumed by `scripts/blog/lib/patho-pharm-longtail-post-builder.ts` (registry-first; no unvetted fill past exhaustion).
 */

import { BlogPostTemplate } from "@prisma/client";

import { ALLIED_PROFESSION_KEYS } from "@/lib/allied/allied-professions-registry";

import type { ClinicalRelationshipType } from "./patho-pharm-longtail-topic-coherence";
import { validateClinicalTopicCoherence, semanticMechanismDuplicateKey } from "./patho-pharm-longtail-topic-coherence";
import { normalizeTopicKey } from "./patho-pharm-longtail-topic-patterns";
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

export type PathoPharmLongtailAudience = {
  careerSlug: string;
  exam: string;
  label: string;
};

/** Production registry category (body-system / pharm axis). */
export type PathoPharmTopicRegistryCategory =
  | "cardio"
  | "resp"
  | "renal"
  | "endo"
  | "neuro"
  | "heme"
  | "infection"
  | "pharm";

/** Public relationship labels (map to `ClinicalRelationshipType` internally). */
export type PathoPharmTopicRegistryRelationship =
  | "condition_symptom"
  | "condition_lab"
  | "drug_effect"
  | "drug_monitoring"
  | "mechanism";

/** Public production contract (strict topic bank row). */
export type PathoPharmTopicRegistryItem = {
  id: string;
  title: string;
  slug: string;
  category: PathoPharmTopicRegistryCategory;
  relationshipType: PathoPharmTopicRegistryRelationship;
  keywords: string[];
};

/** Full registry row including generator metadata (`patternId`). */
export type PathoPharmTopicRegistryEntry = PathoPharmTopicRegistryItem & {
  patternId: number;
};

export function mapRegistryRelationshipToClinical(
  rt: PathoPharmTopicRegistryRelationship,
): ClinicalRelationshipType {
  if (rt === "drug_effect") return "drug_adverse_effect";
  if (rt === "mechanism") return "disease_mechanism";
  if (rt === "condition_lab") return "condition_lab";
  if (rt === "condition_symptom") return "condition_symptom";
  return "drug_monitoring";
}

/** Mirrors `LongTailTopicSpec` in the post-builder (kept here to avoid circular imports). */
export type PathoPharmLongtailRegistryTopic = {
  slug: string;
  title: string;
  kind: "pathophysiology" | "pharmacology";
  category: string;
  postTemplate: BlogPostTemplate;
  targetKeyword: string;
  bodySystem: string;
  anchorLabel: string;
  patternId: number;
  relationshipType: ClinicalRelationshipType;
  topicSource: "registry";
  careerSlug: string;
  exam: string;
};

function rotateAudience(idx: number): PathoPharmLongtailAudience {
  const alliedKey = ALLIED_PROFESSION_KEYS[idx % ALLIED_PROFESSION_KEYS.length]!;
  const cycle: readonly PathoPharmLongtailAudience[] = [
    { careerSlug: "rn", exam: "NCLEX_RN", label: "RN" },
    { careerSlug: "pn", exam: "NCLEX_PN", label: "PN" },
    { careerSlug: "np", exam: "NP", label: "NP" },
    /** Must match `professionKey` values used by `/allied-health/[slug]/blog` — not a synthetic `"allied"` bucket. */
    { careerSlug: alliedKey, exam: "ALLIED_HEALTH", label: "Allied Health" },
    { careerSlug: "rn", exam: "NEW_GRAD", label: "New Grad RN" },
  ];
  return cycle[idx % cycle.length]!;
}

function slugPart(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-")
    .slice(0, 48);
}

function uniqueSlug(base: string, seen: Set<string>): string {
  let s = base.slice(0, 118);
  let n = 0;
  while (seen.has(s)) {
    n += 1;
    s = `${base.slice(0, 110)}-x${n}`;
  }
  seen.add(s);
  return s;
}

/** Populated while building `PATHO_PHARM_TOPIC_REGISTRY` (dedupe + validation drops). */
export const PATHO_PHARM_REGISTRY_BUILD_STATS = {
  duplicateNormalizedKey: 0,
  duplicateSemantic: 0,
  duplicateCluster: 0,
  validationFailed: 0,
};

function normPairKey(a: string, b: string): string {
  return `${a.trim().toLowerCase()}|||${b.trim().toLowerCase()}`;
}

/** One slot for near-duplicate “sepsis spectrum + hypotension outcome” variants (clinical mechanism overlap). */
function conditionSymptomClusterSlot(condition: string, finding: string): string {
  const c = condition.trim().toLowerCase();
  const f = finding.trim().toLowerCase();
  if (/^(sepsis|septic shock|severe sepsis)$/.test(c) && /\b(hypotension|refractory hypotension)\b/.test(f)) {
    return "__cluster__:sepsis-spectrum-hypotension";
  }
  return normPairKey(condition, finding);
}

function registryCategoryFromBodySystem(bodySystem: string, kind: "pathophysiology" | "pharmacology"): PathoPharmTopicRegistryCategory {
  if (kind === "pharmacology") return "pharm";
  const s = bodySystem.toLowerCase();
  if (/cardio|vascular|heart/i.test(s)) return "cardio";
  if (/respir|pulm|lung/i.test(s)) return "resp";
  if (/renal|kidney|urin|electroly/i.test(s)) return "renal";
  if (/endo|thyroid|diabet|insulin|glucose|cortisol/i.test(s)) return "endo";
  if (/neuro|brain|spinal|seizure|mening|ictal/i.test(s)) return "neuro";
  if (/hema|anemia|platelet|coagul|sickle|thromb|bleed|dic\b/i.test(s)) return "heme";
  return "infection";
}

function keywordsForEntry(title: string, anchor: string, category: PathoPharmTopicRegistryCategory): string[] {
  const words = title
    .toLowerCase()
    .replace(/\?/g, "")
    .split(/\s+/)
    .map((w) => w.replace(/[^a-z0-9-]/g, ""))
    .filter((w) => w.length > 4);
  const merged = [anchor, category, ...words];
  const out: string[] = [];
  const seen = new Set<string>();
  for (const x of merged) {
    const k = x.trim().toLowerCase();
    if (!k || seen.has(k)) continue;
    seen.add(k);
    out.push(k);
    if (out.length >= 10) break;
  }
  return out;
}

function buildPathoPharmTopicRegistryEntries(): PathoPharmTopicRegistryEntry[] {
  PATHO_PHARM_REGISTRY_BUILD_STATS.duplicateNormalizedKey = 0;
  PATHO_PHARM_REGISTRY_BUILD_STATS.duplicateSemantic = 0;
  PATHO_PHARM_REGISTRY_BUILD_STATS.duplicateCluster = 0;
  PATHO_PHARM_REGISTRY_BUILD_STATS.validationFailed = 0;

  const seenNorm = new Set<string>();
  const seenSemantic = new Set<string>();
  const seenCondFinding = new Set<string>();
  const seenMonitoringSubject = new Set<string>();
  const out: PathoPharmTopicRegistryEntry[] = [];
  let idn = 0;

  const tryPush = (args: {
    title: string;
    slugBase: string;
    anchor: string;
    bodySystem: string;
    kind: "pathophysiology" | "pharmacology";
    relationshipType: PathoPharmTopicRegistryRelationship;
    patternId: number;
    clusterKey?: string;
  }) => {
    const title = args.title.trim();
    if (args.clusterKey) {
      if (seenCondFinding.has(args.clusterKey)) {
        PATHO_PHARM_REGISTRY_BUILD_STATS.duplicateCluster += 1;
        return;
      }
      seenCondFinding.add(args.clusterKey);
    }
    const nk = normalizeTopicKey(title);
    if (seenNorm.has(nk)) {
      PATHO_PHARM_REGISTRY_BUILD_STATS.duplicateNormalizedKey += 1;
      return;
    }
    const sk = semanticMechanismDuplicateKey(title);
    if (seenSemantic.has(sk)) {
      PATHO_PHARM_REGISTRY_BUILD_STATS.duplicateSemantic += 1;
      return;
    }
    const clinicalRt = mapRegistryRelationshipToClinical(args.relationshipType);
    const slug = `lt-reg-${args.slugBase}`.slice(0, 118);
    const coh = validateClinicalTopicCoherence({
      title,
      slug,
      topicSource: "registry",
      relationshipType: clinicalRt,
    });
    if (!coh.ok) {
      PATHO_PHARM_REGISTRY_BUILD_STATS.validationFailed += 1;
      return;
    }
    seenNorm.add(nk);
    seenSemantic.add(sk);
    const cat = registryCategoryFromBodySystem(args.bodySystem, args.kind);
    out.push({
      id: `pph-${String(idn++).padStart(5, "0")}`,
      title,
      slug,
      category: cat,
      relationshipType: args.relationshipType,
      patternId: args.patternId,
      keywords: keywordsForEntry(title, args.anchor, cat),
    });
  };

  let pairIdx = 0;
  for (const [condition, finding] of CONDITION_SYMPTOM_PAIRS) {
    const bodySystem = inferSystem(condition, finding, pairIdx++);
    tryPush({
      title: `Why does ${condition} cause ${finding}?`,
      slugBase: `cs-${slugPart(condition)}-${slugPart(finding)}`,
      anchor: condition,
      bodySystem,
      kind: "pathophysiology",
      relationshipType: "condition_symptom",
      patternId: 1,
      clusterKey: conditionSymptomClusterSlot(condition, finding),
    });
  }

  for (const [drug, effect] of DRUG_EFFECT_PAIRS) {
    const bodySystem = "multisystem";
    tryPush({
      title: `How does ${drug} cause ${effect}?`,
      slugBase: `de-${slugPart(drug)}-${slugPart(effect)}`,
      anchor: drug,
      bodySystem,
      kind: "pharmacology",
      relationshipType: "drug_effect",
      patternId: 2,
    });
  }

  for (const [lab, condition] of LAB_IN_CONDITION_PAIRS) {
    const bodySystem = inferSystem(condition, lab, pairIdx++);
    tryPush({
      title: `Why does ${lab} cause ${condition}?`,
      slugBase: `lab-${slugPart(lab)}-${slugPart(condition)}`,
      anchor: condition,
      bodySystem,
      kind: "pathophysiology",
      relationshipType: "condition_lab",
      patternId: 4,
      clusterKey: normPairKey(lab, condition),
    });
  }

  for (const [condition, sys] of DISEASE_MECHANISM_STEP_CONDITIONS) {
    tryPush({
      title: `How does ${condition} affect ${sys} physiologically?`,
      slugBase: `mech-${slugPart(condition)}-${slugPart(sys)}`,
      anchor: condition,
      bodySystem: sys,
      kind: "pathophysiology",
      relationshipType: "mechanism",
      patternId: 3,
    });
  }

  for (const [sign, _mechanism, disease, sys] of SIGN_MECHANISM_DISEASE_TRIPLES) {
    tryPush({
      title: `How does ${sign} affect ${disease} physiologically?`,
      slugBase: `sign-${slugPart(sign)}-${slugPart(disease)}`,
      anchor: disease,
      bodySystem: sys,
      kind: "pathophysiology",
      relationshipType: "mechanism",
      patternId: 6,
    });
  }

  for (const [tx, cons, sys] of TREATMENT_CONSEQUENCE_PAIRS) {
    tryPush({
      title: `Why does ${tx} lead to ${cons}?`,
      slugBase: `tx-${slugPart(tx)}-${slugPart(cons)}`,
      anchor: tx,
      bodySystem: sys,
      kind: "pathophysiology",
      relationshipType: "condition_symptom",
      patternId: 7,
      clusterKey: normPairKey(tx, cons),
    });
  }

  for (const [el, cond, sys] of ELECTROLYTE_CONDITION_PAIRS) {
    tryPush({
      title: `Why does ${el} lead to ${cond}?`,
      slugBase: `el-${slugPart(el)}-${slugPart(cond)}`,
      anchor: cond,
      bodySystem: sys,
      kind: "pathophysiology",
      relationshipType: "condition_symptom",
      patternId: 10,
      clusterKey: normPairKey(el, cond),
    });
  }

  for (const [a, b, _ctx, sys] of SYSTEM_BRIDGE_TRIPLES) {
    tryPush({
      title: `How does ${a} affect ${b} physiologically?`,
      slugBase: `br-${slugPart(a)}-${slugPart(b)}`,
      anchor: b,
      bodySystem: sys,
      kind: "pathophysiology",
      relationshipType: "mechanism",
      patternId: 9,
    });
  }

  const monitoringSubjects = new Map<string, { display: string; sys: string }>();
  for (const [drug, sys] of DRUG_MONITORING_LIST) {
    const k = drug.trim().toLowerCase();
    monitoringSubjects.set(k, { display: drug, sys });
  }
  for (const [drug, sys] of NURSING_IMPLICATION_DRUGS) {
    const k = drug.trim().toLowerCase();
    if (!monitoringSubjects.has(k)) monitoringSubjects.set(k, { display: drug, sys });
  }
  for (const { display, sys } of monitoringSubjects.values()) {
    const k = display.trim().toLowerCase();
    if (seenMonitoringSubject.has(k)) continue;
    seenMonitoringSubject.add(k);
    tryPush({
      title: `What should nurses monitor in ${display} and why?`,
      slugBase: `mon-${slugPart(display)}`,
      anchor: display,
      bodySystem: sys,
      kind: "pharmacology",
      relationshipType: "drug_monitoring",
      patternId: 8,
    });
  }

  for (const [cond, sys] of NURSING_IMPLICATION_CONDITIONS) {
    const k = cond.trim().toLowerCase();
    if (seenMonitoringSubject.has(k)) continue;
    seenMonitoringSubject.add(k);
    tryPush({
      title: `What should nurses monitor in ${cond} and why?`,
      slugBase: `mon-cond-${slugPart(cond)}`,
      anchor: cond,
      bodySystem: sys,
      kind: "pathophysiology",
      relationshipType: "drug_monitoring",
      patternId: 5,
    });
  }

  return out;
}

/**
 * Strict production topic registry (validated titles + deduped).
 * Rows satisfy {@link PathoPharmTopicRegistryItem}; `patternId` is included for the long-tail post builder.
 */
export const PATHO_PHARM_TOPIC_REGISTRY: readonly PathoPharmTopicRegistryEntry[] = Object.freeze(
  buildPathoPharmTopicRegistryEntries(),
);

let memo: PathoPharmLongtailRegistryTopic[] | null = null;

/**
 * Deterministic curated catalog (≥500). Built from `PATHO_PHARM_TOPIC_REGISTRY` + audience rotation.
 */
export function getPathoPharmLongtailTopicRegistry(): readonly PathoPharmLongtailRegistryTopic[] {
  if (memo) return memo;

  const seenSlugs = new Set<string>();
  const out: PathoPharmLongtailRegistryTopic[] = [];
  let idx = 0;
  for (const row of PATHO_PHARM_TOPIC_REGISTRY) {
    const aud = rotateAudience(idx);
    const clinicalRt = mapRegistryRelationshipToClinical(row.relationshipType);
    const kind: "pathophysiology" | "pharmacology" =
      row.relationshipType === "drug_effect" || row.relationshipType === "drug_monitoring"
        ? "pharmacology"
        : "pathophysiology";
    const postTemplate =
      kind === "pharmacology" ? BlogPostTemplate.MEDICATION_REVIEW : BlogPostTemplate.DISEASE_PROCESS_EXPLAINER;
    const anchor = row.keywords[0] ?? row.slug;
    const bodySystem =
      kind === "pharmacology" && row.relationshipType === "drug_effect"
        ? "multisystem"
        : inferSystem(anchor, row.title, idx);
    const slug = uniqueSlug(row.slug.slice(0, 110), seenSlugs);
    const categoryLabel = row.category === "pharm" ? "Pharmacology" : "Pathophysiology";
    out.push({
      slug,
      title: row.title,
      kind,
      category: categoryLabel,
      postTemplate,
      targetKeyword: row.title.toLowerCase().replace(/\?/g, "").slice(0, 200),
      bodySystem,
      anchorLabel: anchor,
      patternId: row.patternId,
      relationshipType: clinicalRt,
      topicSource: "registry",
      careerSlug: aud.careerSlug,
      exam: aud.exam,
    });
    idx += 1;
  }

  memo = out;
  return memo;
}

function inferSystem(condition: string, finding: string, i: number): string {
  const s = `${condition} ${finding}`.toLowerCase();
  const rules: [RegExp, string][] = [
    [/heart|cardiac|coronary|shock|tamponade|hypertens|hypotens|edema|pe\b|dvt|jv|murmur|stemi|acs\b|afib|vt\b|wpw|pericard|tamponade|aortic|mitral|tricuspid|endocard|cardiogenic|cor pulmonale|preload|afterload/i, "cardiovascular"],
    [/lung|pneum|copd|asthma|respir|hypox|hypercap|wheeze|stridor|ards|pleur|bronch|apnea|tension pneumo/i, "respiratory"],
    [/kidney|renal|urin|nephro|dialysis|creatinine|potassium|sodium|acidosis|alkalosis|electrolyte|oliguria|polyuria|glomerul|tubular|azotemia|k\b|aki\b/i, "renal"],
    [/brain|neuro|seizure|stroke|mening|encephal|icp|spinal|guillain|myasthen|parkinson|dementia|delirium|neuropathy|coma|ictal|subarachnoid/i, "neurological"],
    [/thyroid|diabet|insulin|glucose|cortisol|addison|cushing|pheochrom|adrenal|endocrine|keto|siadh|adh\b|hhs|dka/i, "endocrine"],
    [/liver|hepat|biliary|cholecyst|pancreat|bowel|gi\b|gastro|mesenter|varice|ascites|periton|enterocol|necrotizing fasciitis/i, "gastrointestinal"],
    [/hemat|anemia|platelet|coagul|thromb|bleed|dic\b|ttp|hus|itp|sickle|thalassem|transfusion|febrile neutropenia/i, "hematologic"],
    [/sepsis|infection|septic|meningitis|cellulitis|pneumonia|covid|hiv|immune|anaphyl|fasciitis|cdiff|c diff|uti\b/i, "immune"],
    [/pregnan|eclamps|preeclamp|postpartum|HELLP|amniotic|obstetr|uterine|neonat|pediatr|bronchiol|croup|nec\b|fetal|gestational/i, "multisystem"],
    [/bone|joint|muscle|rhabdo|compartment|fracture|osteomyelitis|arthritis/i, "musculoskeletal"],
    [/skin|cellulitis|rash|burn|pressure injury|wound/i, "integumentary"],
  ];
  for (const [re, sys] of rules) {
    if (re.test(s)) return sys;
  }
  const fallback = ["multisystem", "cardiovascular", "renal", "respiratory", "neurological", "endocrine"] as const;
  return fallback[i % fallback.length]!;
}

export const PATHO_PHARM_LONGTAIL_TOPIC_REGISTRY_MIN = 500;

export function assertRegistryMeetsMinimum(): void {
  const n = getPathoPharmLongtailTopicRegistry().length;
  if (n < PATHO_PHARM_LONGTAIL_TOPIC_REGISTRY_MIN) {
    throw new Error(`patho-pharm topic registry too small: ${n} < ${PATHO_PHARM_LONGTAIL_TOPIC_REGISTRY_MIN}`);
  }
}

export { normalizeTopicKey } from "./patho-pharm-longtail-topic-patterns";
export { validateClinicalTopicCoherence, semanticMechanismDuplicateKey } from "./patho-pharm-longtail-topic-coherence";
