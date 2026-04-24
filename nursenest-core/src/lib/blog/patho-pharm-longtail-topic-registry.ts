/**
 * Curated long-tail pathophysiology / pharmacology blog topics (≥500 clinically vetted rows).
 * Consumed by `scripts/blog/lib/patho-pharm-longtail-post-builder.ts` before any synthetic expansion.
 */

import { BlogPostTemplate } from "@prisma/client";

import type { ClinicalRelationshipType } from "./patho-pharm-longtail-topic-coherence";
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

const AUDIENCES: readonly PathoPharmLongtailAudience[] = [
  { careerSlug: "rn", exam: "NCLEX_RN", label: "RN" },
  { careerSlug: "pn", exam: "NCLEX_PN", label: "PN" },
  { careerSlug: "np", exam: "NP", label: "NP" },
  { careerSlug: "allied", exam: "ALLIED_HEALTH", label: "Allied Health" },
  { careerSlug: "rn", exam: "NEW_GRAD", label: "New Grad RN" },
] as const;

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

let memo: PathoPharmLongtailRegistryTopic[] | null = null;

/**
 * Deterministic curated catalog (≥500). All rows use vetted clinical pairings only.
 */
export function getPathoPharmLongtailTopicRegistry(): readonly PathoPharmLongtailRegistryTopic[] {
  if (memo) return memo;

  const seenSlugs = new Set<string>();
  const seenTitles = new Set<string>();
  const out: PathoPharmLongtailRegistryTopic[] = [];
  let idx = 0;

  const push = (row: Omit<PathoPharmLongtailRegistryTopic, "topicSource">) => {
    const title = row.title.trim();
    const k = title.toLowerCase();
    if (seenTitles.has(k)) return;
    seenTitles.add(k);
    const slug = uniqueSlug(row.slug, seenSlugs);
    out.push({ ...row, slug, title, topicSource: "registry" });
    idx += 1;
  };

  for (const [condition, finding] of CONDITION_SYMPTOM_PAIRS) {
    const aud = AUDIENCES[idx % AUDIENCES.length]!;
    const title = `Why does ${condition} cause ${finding}?`;
    push({
      slug: `lt-reg-cs-${slugPart(condition)}-${slugPart(finding)}`,
      title,
      kind: "pathophysiology",
      category: "Pathophysiology",
      postTemplate: BlogPostTemplate.DISEASE_PROCESS_EXPLAINER,
      targetKeyword: title.toLowerCase().replace(/\?/g, "").slice(0, 200),
      bodySystem: inferSystem(condition, finding, idx),
      anchorLabel: condition,
      patternId: 1,
      relationshipType: "condition_symptom",
      careerSlug: aud.careerSlug,
      exam: aud.exam,
    });
  }

  for (const [drug, effect] of DRUG_EFFECT_PAIRS) {
    const aud = AUDIENCES[idx % AUDIENCES.length]!;
    const title = `How does ${drug} cause ${effect}?`;
    push({
      slug: `lt-reg-de-${slugPart(drug)}-${slugPart(effect)}`,
      title,
      kind: "pharmacology",
      category: "Pharmacology",
      postTemplate: BlogPostTemplate.MEDICATION_REVIEW,
      targetKeyword: title.toLowerCase().replace(/\?/g, "").slice(0, 200),
      bodySystem: "multisystem",
      anchorLabel: drug,
      patternId: 2,
      relationshipType: "drug_adverse_effect",
      careerSlug: aud.careerSlug,
      exam: aud.exam,
    });
  }

  for (const [lab, condition] of LAB_IN_CONDITION_PAIRS) {
    const aud = AUDIENCES[idx % AUDIENCES.length]!;
    const title = `Why does ${lab} occur in ${condition}?`;
    push({
      slug: `lt-reg-lab-${slugPart(lab)}-${slugPart(condition)}`,
      title,
      kind: "pathophysiology",
      category: "Pathophysiology",
      postTemplate: BlogPostTemplate.DISEASE_PROCESS_EXPLAINER,
      targetKeyword: title.toLowerCase().replace(/\?/g, "").slice(0, 200),
      bodySystem: inferSystem(condition, lab, idx),
      anchorLabel: condition,
      patternId: 4,
      relationshipType: "condition_lab",
      careerSlug: aud.careerSlug,
      exam: aud.exam,
    });
  }

  for (const [condition, sys] of DISEASE_MECHANISM_STEP_CONDITIONS) {
    const aud = AUDIENCES[idx % AUDIENCES.length]!;
    const title = `What happens in ${condition} pathophysiology step by step?`;
    push({
      slug: `lt-reg-mech-${slugPart(condition)}-step`,
      title,
      kind: "pathophysiology",
      category: "Pathophysiology",
      postTemplate: BlogPostTemplate.DISEASE_PROCESS_EXPLAINER,
      targetKeyword: title.toLowerCase().replace(/\?/g, "").slice(0, 200),
      bodySystem: sys,
      anchorLabel: condition,
      patternId: 3,
      relationshipType: "disease_mechanism",
      careerSlug: aud.careerSlug,
      exam: aud.exam,
    });
  }

  for (const [sign, mechanism, disease, sys] of SIGN_MECHANISM_DISEASE_TRIPLES) {
    const aud = AUDIENCES[idx % AUDIENCES.length]!;
    const title = `Explain the mechanism behind ${sign} in ${disease} for bedside nursing`;
    push({
      slug: `lt-reg-sign-${slugPart(sign)}-${slugPart(disease)}`,
      title,
      kind: "pathophysiology",
      category: "Pathophysiology",
      postTemplate: BlogPostTemplate.DISEASE_PROCESS_EXPLAINER,
      targetKeyword: title.toLowerCase().replace(/\?/g, "").slice(0, 200),
      bodySystem: sys,
      anchorLabel: disease,
      patternId: 6,
      relationshipType: "disease_mechanism",
      careerSlug: aud.careerSlug,
      exam: aud.exam,
    });
  }

  for (const [tx, cons, sys] of TREATMENT_CONSEQUENCE_PAIRS) {
    const aud = AUDIENCES[idx % AUDIENCES.length]!;
    const title = `Why does ${tx} cause ${cons}?`;
    push({
      slug: `lt-reg-tx-${slugPart(tx)}-${slugPart(cons)}`,
      title,
      kind: "pathophysiology",
      category: "Pathophysiology",
      postTemplate: BlogPostTemplate.DISEASE_PROCESS_EXPLAINER,
      targetKeyword: title.toLowerCase().replace(/\?/g, "").slice(0, 200),
      bodySystem: sys,
      anchorLabel: tx,
      patternId: 7,
      relationshipType: "condition_symptom",
      careerSlug: aud.careerSlug,
      exam: aud.exam,
    });
  }

  for (const [el, cond, sys] of ELECTROLYTE_CONDITION_PAIRS) {
    const aud = AUDIENCES[idx % AUDIENCES.length]!;
    const title = `Why does ${el} happen in ${cond}?`;
    push({
      slug: `lt-reg-el-${slugPart(el)}-${slugPart(cond)}`,
      title,
      kind: "pathophysiology",
      category: "Pathophysiology",
      postTemplate: BlogPostTemplate.DISEASE_PROCESS_EXPLAINER,
      targetKeyword: title.toLowerCase().replace(/\?/g, "").slice(0, 200),
      bodySystem: sys,
      anchorLabel: cond,
      patternId: 10,
      relationshipType: "condition_symptom",
      careerSlug: aud.careerSlug,
      exam: aud.exam,
    });
  }

  for (const [a, b, ctx, sys] of SYSTEM_BRIDGE_TRIPLES) {
    const aud = AUDIENCES[idx % AUDIENCES.length]!;
    const title = `How does ${a} affect ${b} during ${ctx}?`;
    push({
      slug: `lt-reg-br-${slugPart(a)}-${slugPart(b)}-${slugPart(ctx)}`,
      title,
      kind: "pathophysiology",
      category: "Pathophysiology",
      postTemplate: BlogPostTemplate.DISEASE_PROCESS_EXPLAINER,
      targetKeyword: title.toLowerCase().replace(/\?/g, "").slice(0, 200),
      bodySystem: sys,
      anchorLabel: ctx,
      patternId: 9,
      relationshipType: "disease_mechanism",
      careerSlug: aud.careerSlug,
      exam: aud.exam,
    });
  }

  for (const [drug, sys] of DRUG_MONITORING_LIST) {
    const aud = AUDIENCES[idx % AUDIENCES.length]!;
    const title = `What should nurses monitor in ${drug} and why?`;
    push({
      slug: `lt-reg-mon-${slugPart(drug)}`,
      title,
      kind: "pharmacology",
      category: "Pharmacology",
      postTemplate: BlogPostTemplate.MEDICATION_REVIEW,
      targetKeyword: title.toLowerCase().replace(/\?/g, "").slice(0, 200),
      bodySystem: sys,
      anchorLabel: drug,
      patternId: 8,
      relationshipType: "drug_monitoring",
      careerSlug: aud.careerSlug,
      exam: aud.exam,
    });
  }

  for (const [drug, sys] of NURSING_IMPLICATION_DRUGS) {
    const aud = AUDIENCES[idx % AUDIENCES.length]!;
    const title = `Nursing implications of ${drug} mechanism`;
    push({
      slug: `lt-reg-ni-d-${slugPart(drug)}`,
      title,
      kind: "pharmacology",
      category: "Pharmacology",
      postTemplate: BlogPostTemplate.MEDICATION_REVIEW,
      targetKeyword: title.toLowerCase().replace(/\?/g, "").slice(0, 200),
      bodySystem: sys,
      anchorLabel: drug,
      patternId: 5,
      relationshipType: "drug_monitoring",
      careerSlug: aud.careerSlug,
      exam: aud.exam,
    });
  }

  for (const [cond, sys] of NURSING_IMPLICATION_CONDITIONS) {
    const aud = AUDIENCES[idx % AUDIENCES.length]!;
    const title = `Nursing implications of ${cond} mechanism`;
    push({
      slug: `lt-reg-ni-c-${slugPart(cond)}`,
      title,
      kind: "pathophysiology",
      category: "Pathophysiology",
      postTemplate: BlogPostTemplate.DISEASE_PROCESS_EXPLAINER,
      targetKeyword: title.toLowerCase().replace(/\?/g, "").slice(0, 200),
      bodySystem: sys,
      anchorLabel: cond,
      patternId: 5,
      relationshipType: "drug_monitoring",
      careerSlug: aud.careerSlug,
      exam: aud.exam,
    });
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
