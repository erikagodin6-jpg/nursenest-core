/**
 * Declarative **question signals → lesson slug** mappings.
 *
 * **Extending:** append a row with a unique `id`, stable `lessonSlug`, and a conservative `haystackPattern`.
 * Prefer explicit `pathwayIdsAllow` / `countryCodesAllow` over embedding geography in regex.
 */
import { CountryCode } from "@prisma/client";
import { CLINICAL_JUDGMENT_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/clinical-judgment-prioritization-gold-standard";
import { SEPSIS_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/sepsis-early-recognition-gold-standard";
import { FLUIDS_ELECTROLYTES_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/fluids-electrolytes-emergencies-gold-standard";
import { ACS_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/acute-coronary-syndrome-gold-standard";
import { HIGH_ALERT_MEDS_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/high-alert-medications-gold-standard";
import { STROKE_ICP_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/stroke-increased-icp-gold-standard";
import { SHOCK_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/shock-gold-standard";
import { CANADIAN_RPN_HIGH_YIELD_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/canadian-rpn-high-yield-gold-standard";
import { COPD_GOLD_STANDARD_SLUG } from "@/lib/lessons/scoped-lessons/copd-gold-standard";
import type { LessonRationaleMappingEntry } from "@/lib/learner/lesson-question-rationale/types";
import { RN_NCLEX_CATALOG_RATIONALE_ENTRIES } from "@/lib/learner/lesson-question-rationale/rn-nclex-catalog-rationale-registry";
import { TIER_RATIONALE_REGISTRY_EXPANSION } from "@/lib/learner/lesson-question-rationale/tier-rationale-registry-expansion";

const CA = CountryCode.CA;

/**
 * Ordered for human review; matching does **not** depend on order (best score wins per slug in the matcher).
 */
export const LESSON_RATIONALE_MAPPING_ENTRIES: LessonRationaleMappingEntry[] = [
  // —— Core disease / syndrome gold ——
  {
    id: "disease-sepsis",
    lessonSlug: SEPSIS_GOLD_SLUG,
    domain: "disease",
    linkKind: "disease_process",
    haystackPattern: /\b(sepsis|septic|qsofa|sofa|lactate)\b/i,
    baseWeight: 95,
    topicKeyBonus: { keys: ["sepsis"], bonus: 6 },
  },
  {
    id: "syndrome-shock",
    lessonSlug: SHOCK_GOLD_SLUG,
    domain: "syndrome",
    linkKind: "disease_process",
    haystackPattern: /\b(shock|hypovolemi\w*|distributive|cardiogenic|anaphylactic\s+shock)\b/i,
    baseWeight: 92,
  },
  {
    id: "syndrome-stroke-icp",
    lessonSlug: STROKE_ICP_GOLD_SLUG,
    domain: "syndrome",
    linkKind: "disease_process",
    haystackPattern: /\b(stroke|cva|tia|icp|increased\s+intracranial|neuro\s+deficit)\b/i,
    baseWeight: 92,
  },
  {
    id: "disease-acs",
    lessonSlug: ACS_GOLD_SLUG,
    domain: "disease",
    linkKind: "disease_process",
    haystackPattern: /\b(acs|stemi|nstemi|myocardial\s+infarction|angina|nitroglycerin)\b/i,
    baseWeight: 90,
  },
  {
    id: "syndrome-fluids-electrolytes",
    lessonSlug: FLUIDS_ELECTROLYTES_GOLD_SLUG,
    domain: "syndrome",
    linkKind: "disease_process",
    haystackPattern: /\b(dka|hhs|hyperglycem|hypoglycem|potassium|sodium|fluid\s+overload|dehydration|electrolyte)\b/i,
    baseWeight: 88,
  },
  {
    id: "disease-copd-asthma",
    lessonSlug: COPD_GOLD_STANDARD_SLUG,
    domain: "disease",
    linkKind: "disease_process",
    haystackPattern: /\b(copd|asthma|bronchodilator|inhaler|wheez)\b/i,
    baseWeight: 85,
  },
  // —— Prioritization / clinical judgment ——
  {
    id: "prioritization-cj-gold",
    lessonSlug: CLINICAL_JUDGMENT_GOLD_SLUG,
    domain: "prioritization",
    linkKind: "prioritization",
    haystackPattern:
      /\b(prioritization|prioritiz\w*|delegation|delegat\w*|triage|first\s+action|most\s+urgent|acute\s+change|rapid\s+response)\b/i,
    baseWeight: 88,
  },
  {
    id: "safety-high-alert",
    lessonSlug: HIGH_ALERT_MEDS_GOLD_SLUG,
    domain: "safety",
    linkKind: "safety",
    haystackPattern:
      /\b(high[\s-]?alert|insulin|heparin|chemotherapy|look[\s-]?alike|sound[\s-]?alike|double\s+check)\b/i,
    baseWeight: 90,
  },
  // —— Medication class families (exam-complete) ——
  {
    id: "med-class-antibiotics",
    lessonSlug: "med-family-antibiotics-gold",
    domain: "medication_class",
    linkKind: "medication",
    haystackPattern: /\b(antibiotic|antimicrobial|culture|sensitivity|c\.?\s*diff|clostridium)\b/i,
    baseWeight: 82,
  },
  {
    id: "med-class-anticoag",
    lessonSlug: "med-family-anticoagulants-gold",
    domain: "medication_class",
    linkKind: "medication",
    haystackPattern: /\b(warfarin|heparin|anticoag|inr|aptt|anti[\s-]?xa|dabigatran|rivaroxaban|apixaban)\b/i,
    baseWeight: 84,
  },
  {
    id: "med-class-diabetes",
    lessonSlug: "med-family-insulin-diabetes-gold",
    domain: "medication_class",
    linkKind: "medication",
    haystackPattern: /\b(insulin|diabetes|glucose|a1c|sglt2|glp[\s-]?1|metformin)\b/i,
    baseWeight: 84,
  },
  {
    id: "med-class-cardiac",
    lessonSlug: "med-family-cardiac-gold",
    domain: "medication_class",
    linkKind: "medication",
    haystackPattern: /\b(beta[\s-]?blocker|digoxin|antiarrhythmic|nitrate|cardiac\s+med)\b/i,
    baseWeight: 80,
  },
  {
    id: "med-class-antihtn",
    lessonSlug: "med-family-antihypertensives-gold",
    domain: "medication_class",
    linkKind: "medication",
    haystackPattern: /\b(ace\s+inhibitor|arb|hypertens|lisinopril|amlodipine|blood\s+pressure\s+med)\b/i,
    baseWeight: 80,
  },
  {
    id: "med-class-respiratory",
    lessonSlug: "med-family-respiratory-gold",
    domain: "medication_class",
    linkKind: "medication",
    haystackPattern: /\b(nebulizer|albuterol|respiratory\s+med|theophylline|laba|lama|ics)\b/i,
    baseWeight: 78,
  },
  {
    id: "med-class-psych",
    lessonSlug: "med-family-psychotropic-gold",
    domain: "medication_class",
    linkKind: "medication",
    haystackPattern: /\b(ssri|snri|antipsych|lithium|benzodiazep|serotonin)\b/i,
    baseWeight: 78,
  },
  {
    id: "med-class-pain",
    lessonSlug: "med-family-pain-sedation-gold",
    domain: "medication_class",
    linkKind: "medication",
    haystackPattern: /\b(opioid|naloxone|pca|analges|pain\s+med|sedation)\b/i,
    baseWeight: 82,
  },
  {
    id: "med-class-emergency",
    lessonSlug: "med-family-emergency-response-gold",
    domain: "medication_class",
    linkKind: "medication",
    haystackPattern: /\b(epinephrine|anaphylaxis|atropine|code\s+blue|resuscitat|acls)\b/i,
    baseWeight: 80,
  },
  // —— Safety families ——
  {
    id: "safety-infection-control",
    lessonSlug: "safety-family-infection-control-gold",
    domain: "safety",
    linkKind: "safety",
    haystackPattern: /\b(infection\s+control|ppe|hand\s+hygiene|standard\s+precautions|needlestick)\b/i,
    baseWeight: 82,
  },
  {
    id: "safety-isolation",
    lessonSlug: "safety-family-isolation-precautions-gold",
    domain: "safety",
    linkKind: "safety",
    haystackPattern: /\b(isolation|airborne|droplet|contact\s+precautions|c?diff\s+precautions)\b/i,
    baseWeight: 82,
  },
  {
    id: "safety-falls",
    lessonSlug: "safety-family-falls-prevention-gold",
    domain: "safety",
    linkKind: "safety",
    haystackPattern: /\b(fall\s+risk|falls|morse|stratify)\b/i,
    baseWeight: 82,
  },
  {
    id: "safety-restraints",
    lessonSlug: "safety-family-restraints-alternatives-gold",
    domain: "safety",
    linkKind: "safety",
    haystackPattern: /\b(restraint|least\s+restrictive)\b/i,
    baseWeight: 80,
  },
  {
    id: "safety-med-admin",
    lessonSlug: "safety-family-medication-administration-gold",
    domain: "safety",
    linkKind: "safety",
    haystackPattern: /\b(med(ication)?\s+safety|five\s+rights|six\s+rights|barcode|wrong\s+dose)\b/i,
    baseWeight: 82,
  },
  {
    id: "delegation-safety-family",
    lessonSlug: "safety-family-delegation-supervision-gold",
    domain: "delegation",
    linkKind: "safety",
    haystackPattern: /\b(delegation|delegat\w*|supervision|unlicensed|uap|nursing\s+assistant)\b/i,
    baseWeight: 78,
  },
  {
    id: "safety-escalation",
    lessonSlug: "safety-family-escalation-notification-gold",
    domain: "safety",
    linkKind: "safety",
    haystackPattern: /\b(escalation|escalat\w*|notify|rapid\s+response|met\s+call|sbar)\b/i,
    baseWeight: 78,
  },
  {
    id: "prioritization-uncertainty",
    lessonSlug: "safety-family-prioritization-uncertainty-gold",
    domain: "prioritization",
    linkKind: "prioritization",
    haystackPattern: /\b(uncertain|ambiguous|worst\s+case|multiple\s+clients|competing\s+priority)\b/i,
    baseWeight: 76,
  },
  // —— Canada RPN scope (pathway-gated) ——
  {
    id: "ca-rpn-scope-gold",
    lessonSlug: CANADIAN_RPN_HIGH_YIELD_GOLD_SLUG,
    domain: "delegation",
    linkKind: "safety",
    haystackPattern: /\b(rpn|rex[\s-]?pn|canadian\s+practical|college\s+standard|scope)\b/i,
    baseWeight: 86,
    pathwayIdsAllow: ["ca-rpn-rex-pn"],
    countryCodesAllow: [CA],
  },
  // —— Clinical casebook (requires case framing + theme) ——
  {
    id: "casebook-sepsis",
    lessonSlug: "clinical-casebook-sepsis-rapid-response-gold",
    domain: "case_study",
    linkKind: "case_study",
    haystackPattern:
      /(?=.*\b(case\s+study|casebook|clinical\s+case|vignette)\b)(?=.*\b(sepsis|septic|qsofa|bundle)\b)/i,
    baseWeight: 93,
  },
  {
    id: "casebook-acs",
    lessonSlug: "clinical-casebook-acs-chest-pain-gold",
    domain: "case_study",
    linkKind: "case_study",
    haystackPattern: /(?=.*\b(case\s+study|casebook|clinical\s+case|vignette)\b)(?=.*\b(acs|stemi|chest\s+pain|mi)\b)/i,
    baseWeight: 92,
  },
  {
    id: "casebook-respiratory",
    lessonSlug: "clinical-casebook-respiratory-distress-gold",
    domain: "case_study",
    linkKind: "case_study",
    haystackPattern:
      /(?=.*\b(case\s+study|casebook|clinical\s+case|vignette)\b)(?=.*\b(respiratory\s+distress|hypox|sob|wheez)\b)/i,
    baseWeight: 91,
  },
  {
    id: "casebook-glucose",
    lessonSlug: "clinical-casebook-glucose-dka-hypoglycemia-gold",
    domain: "case_study",
    linkKind: "case_study",
    haystackPattern:
      /(?=.*\b(case\s+study|casebook|clinical\s+case|vignette)\b)(?=.*\b(dka|hypoglycem|glucose|hyperosmolar)\b)/i,
    baseWeight: 91,
  },
  {
    id: "casebook-electrolyte",
    lessonSlug: "clinical-casebook-electrolyte-crisis-gold",
    domain: "case_study",
    linkKind: "case_study",
    haystackPattern:
      /(?=.*\b(case\s+study|casebook|clinical\s+case|vignette)\b)(?=.*\b(electrolyte|sodium|potassium|calcium|magnesium)\b)/i,
    baseWeight: 90,
  },
  {
    id: "casebook-maternal",
    lessonSlug: "clinical-casebook-maternal-newborn-emergency-gold",
    domain: "case_study",
    linkKind: "case_study",
    haystackPattern:
      /(?=.*\b(case\s+study|casebook|clinical\s+case|vignette)\b)(?=.*\b(labor|postpartum|preeclampsia|newborn|obstetric)\b)/i,
    baseWeight: 90,
  },
  {
    id: "casebook-pediatric",
    lessonSlug: "clinical-casebook-pediatric-fever-dehydration-gold",
    domain: "case_study",
    linkKind: "case_study",
    haystackPattern:
      /(?=.*\b(case\s+study|casebook|clinical\s+case|vignette)\b)(?=.*\b(pediatric|child|infant|fever|dehydration)\b)/i,
    baseWeight: 90,
  },
  {
    id: "casebook-mental-health",
    lessonSlug: "clinical-casebook-mental-health-safety-gold",
    domain: "case_study",
    linkKind: "case_study",
    haystackPattern:
      /(?=.*\b(case\s+study|casebook|clinical\s+case|vignette)\b)(?=.*\b(suicid|self[\s-]?harm|psychiatr|agitation|hallucin)\b)/i,
    baseWeight: 90,
  },
  ...RN_NCLEX_CATALOG_RATIONALE_ENTRIES,
  ...TIER_RATIONALE_REGISTRY_EXPANSION,
];
