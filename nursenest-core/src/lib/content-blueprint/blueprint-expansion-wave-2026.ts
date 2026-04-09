/**
 * Blueprint-driven lesson expansion (Wave 2026): distinct editorial roles per slot, no slug collision.
 * Used by `scripts/run-blueprint-lesson-expansion.ts` to merge catalog rows for pathways below the launch floor.
 */
import type { BlueprintDomainId } from "@/lib/content-blueprint/blueprint-domain";

export type ExpansionCategory =
  | "disease"
  | "syndrome"
  | "medication"
  | "safety"
  | "prioritization"
  | "delegation"
  | "labs"
  | "procedures"
  | "case_study"
  | "mental_health"
  | "maternity"
  | "pediatrics"
  | "leadership";

export type BlueprintExpansionSlot = {
  /** Stable key for slug fragment — unique across the wave. */
  slugKey: string;
  blueprintDomain: BlueprintDomainId;
  expansionCategory: ExpansionCategory;
  /** Priority rank (lower = higher yield first). */
  priority: number;
  titleStem: string;
  topic: string;
  topicSlug: string;
  bodySystem: string;
  /** One-line distinct role for editorial QA / rationale mapping. */
  blueprintRole: string;
};

const D = (x: Omit<BlueprintExpansionSlot, "priority"> & { priority?: number }): BlueprintExpansionSlot => ({
  priority: x.priority ?? 50,
  slugKey: x.slugKey,
  blueprintDomain: x.blueprintDomain,
  expansionCategory: x.expansionCategory,
  titleStem: x.titleStem,
  topic: x.topic,
  topicSlug: x.topicSlug,
  bodySystem: x.bodySystem,
  blueprintRole: x.blueprintRole,
});

/** Ordered: highest-yield domains first (safety → management → infection → physiology → pharm → psych → OB/peds → leadership). */
function wave2026Slots(): BlueprintExpansionSlot[] {
  return [
    D({ priority: 1, slugKey: "sf-falls-bed-exit", blueprintDomain: "safety_and_infection", expansionCategory: "safety", titleStem: "Fall risk & bed-exit alarms", topic: "Patient safety", topicSlug: "safety", bodySystem: "General", blueprintRole: "Safety: falls & alarm response" }),
    D({ priority: 2, slugKey: "sf-restraint-alternatives", blueprintDomain: "safety_and_infection", expansionCategory: "safety", titleStem: "Restraint alternatives & least restraint", topic: "Patient safety", topicSlug: "safety", bodySystem: "General", blueprintRole: "Safety: restraint ethics" }),
    D({ priority: 3, slugKey: "sf-med-reconciliation", blueprintDomain: "safety_and_infection", expansionCategory: "safety", titleStem: "Medication reconciliation at transitions", topic: "Medication safety", topicSlug: "medication-safety", bodySystem: "General", blueprintRole: "Safety: med rec" }),
    D({ priority: 4, slugKey: "sf-ppe-isolation", blueprintDomain: "safety_and_infection", expansionCategory: "safety", titleStem: "PPE sequence & isolation precautions", topic: "Infection control", topicSlug: "infection-control", bodySystem: "General", blueprintRole: "Safety: infection PPE" }),
    D({ priority: 5, slugKey: "mo-delegate-uap", blueprintDomain: "management_of_care", expansionCategory: "delegation", titleStem: "Delegating to assistive personnel", topic: "Delegation", topicSlug: "delegation", bodySystem: "General", blueprintRole: "Delegation: UAP tasks" }),
    D({ priority: 6, slugKey: "mo-shift-report-sbar", blueprintDomain: "management_of_care", expansionCategory: "prioritization", titleStem: "SBAR handoff & shift report", topic: "Prioritization", topicSlug: "prioritization", bodySystem: "General", blueprintRole: "Management: handoff" }),
    D({ priority: 7, slugKey: "mo-ethical-concern", blueprintDomain: "management_of_care", expansionCategory: "leadership", titleStem: "Raising ethical concerns safely", topic: "Professional ethics", topicSlug: "prioritization-delegation", bodySystem: "General", blueprintRole: "Leadership: ethics channel" }),
    D({ priority: 8, slugKey: "mo-care-conference", blueprintDomain: "management_of_care", expansionCategory: "leadership", titleStem: "Interprofessional care conference basics", topic: "Care coordination", topicSlug: "prioritization-delegation", bodySystem: "General", blueprintRole: "Community: team rounds" }),
    D({ priority: 9, slugKey: "ph-insulin-safety", blueprintDomain: "pharmacological_therapies", expansionCategory: "medication", titleStem: "Insulin administration safety", topic: "Diabetes medications", topicSlug: "diabetes-meds", bodySystem: "Endocrine", blueprintRole: "Pharm: insulin checks" }),
    D({ priority: 10, slugKey: "ph-anticoag-bridging", blueprintDomain: "pharmacological_therapies", expansionCategory: "medication", titleStem: "Anticoagulation monitoring cues", topic: "Anticoagulation", topicSlug: "anticoagulation", bodySystem: "Cardiovascular", blueprintRole: "Pharm: anticoag surveillance" }),
    D({ priority: 11, slugKey: "ph-abx-stewardship", blueprintDomain: "pharmacological_therapies", expansionCategory: "medication", titleStem: "Antibiotic stewardship for nurses", topic: "Antibiotics", topicSlug: "antibiotics", bodySystem: "Infection", blueprintRole: "Pharm: abx stewardship" }),
    D({ priority: 12, slugKey: "ph-opioid-resp-depr", blueprintDomain: "pharmacological_therapies", expansionCategory: "medication", titleStem: "Opioids & respiratory depression", topic: "Pain management", topicSlug: "pain", bodySystem: "Neurological", blueprintRole: "Pharm: opioid safety" }),
    D({ priority: 13, slugKey: "pa-sepsis-trending", blueprintDomain: "physiological_adaptation", expansionCategory: "disease", titleStem: "Trending vitals in suspected sepsis", topic: "Sepsis", topicSlug: "sepsis", bodySystem: "Multisystem", blueprintRole: "Disease: sepsis trending" }),
    D({ priority: 14, slugKey: "pa-shock-classify", blueprintDomain: "physiological_adaptation", expansionCategory: "syndrome", titleStem: "Shock patterns & nursing cues", topic: "Shock", topicSlug: "shock", bodySystem: "Cardiovascular", blueprintRole: "Syndrome: shock types" }),
    D({ priority: 15, slugKey: "pa-aki-urine-labs", blueprintDomain: "physiological_adaptation", expansionCategory: "labs", titleStem: "AKI: urine output & creatinine cues", topic: "Renal", topicSlug: "renal-gu", bodySystem: "Renal", blueprintRole: "Labs: AKI surveillance" }),
    D({ priority: 16, slugKey: "pa-dka-vs-hhs", blueprintDomain: "physiological_adaptation", expansionCategory: "syndrome", titleStem: "Hyperglycemic crises: assessment differences", topic: "Endocrine", topicSlug: "endocrine", bodySystem: "Endocrine", blueprintRole: "Syndrome: DKA vs HHS" }),
    D({ priority: 17, slugKey: "pa-chf-volume", blueprintDomain: "physiological_adaptation", expansionCategory: "disease", titleStem: "Heart failure: volume overload cues", topic: "Cardiovascular", topicSlug: "cardiovascular", bodySystem: "Cardiovascular", blueprintRole: "Disease: CHF volume" }),
    D({ priority: 18, slugKey: "pa-copd-exac", blueprintDomain: "physiological_adaptation", expansionCategory: "disease", titleStem: "COPD exacerbation: oxygen & work of breathing", topic: "COPD", topicSlug: "copd", bodySystem: "Respiratory", blueprintRole: "Disease: COPD exac" }),
    D({ priority: 19, slugKey: "pa-pe-suspect", blueprintDomain: "physiological_adaptation", expansionCategory: "disease", titleStem: "Suspected pulmonary embolism: first moves", topic: "Pulmonary embolism", topicSlug: "pulmonary-embolism", bodySystem: "Respiratory", blueprintRole: "Disease: PE suspicion" }),
    D({ priority: 20, slugKey: "pa-stroke-window", blueprintDomain: "physiological_adaptation", expansionCategory: "disease", titleStem: "Acute stroke: time-sensitive reporting", topic: "Neurological", topicSlug: "neurological", bodySystem: "Neurological", blueprintRole: "Disease: stroke timing" }),
    D({ priority: 21, slugKey: "pa-ich-nih", blueprintDomain: "physiological_adaptation", expansionCategory: "labs", titleStem: "Neuro checks after ICH pathway", topic: "Neurological", topicSlug: "neurological", bodySystem: "Neurological", blueprintRole: "Procedures: neuro checks" }),
    D({ priority: 22, slugKey: "pa-gi-bleed-stable", blueprintDomain: "physiological_adaptation", expansionCategory: "disease", titleStem: "GI bleed: hemodynamic stability cues", topic: "Gastrointestinal", topicSlug: "gastrointestinal", bodySystem: "Gastrointestinal", blueprintRole: "Disease: GI bleed" }),
    D({ priority: 23, slugKey: "pa-pneumonia-curbs", blueprintDomain: "physiological_adaptation", expansionCategory: "disease", titleStem: "Community pneumonia: severity thinking", topic: "Pneumonia", topicSlug: "pneumonia", bodySystem: "Respiratory", blueprintRole: "Disease: CAP severity" }),
    D({ priority: 24, slugKey: "pa-asthma-exac", blueprintDomain: "physiological_adaptation", expansionCategory: "disease", titleStem: "Asthma exacerbation: monitoring", topic: "Respiratory", topicSlug: "respiratory", bodySystem: "Respiratory", blueprintRole: "Disease: asthma" }),
    D({ priority: 25, slugKey: "pa-hyperk-emerg", blueprintDomain: "physiological_adaptation", expansionCategory: "labs", titleStem: "Hyperkalemia ECG & safety", topic: "Fluids & electrolytes", topicSlug: "fluids-electrolytes", bodySystem: "Renal", blueprintRole: "Labs: hyperK" }),
    D({ priority: 26, slugKey: "pa-hyponat-symp", blueprintDomain: "physiological_adaptation", expansionCategory: "labs", titleStem: "Hyponatremia symptoms & monitoring", topic: "Fluids & electrolytes", topicSlug: "fluids-electrolytes", bodySystem: "Renal", blueprintRole: "Labs: Na imbalance" }),
    D({ priority: 27, slugKey: "rr-pressure-injury", blueprintDomain: "risk_reduction", expansionCategory: "procedures", titleStem: "Pressure injury prevention bundle", topic: "Skin integrity", topicSlug: "safety", bodySystem: "Integumentary", blueprintRole: "Procedures: turning bundle" }),
    D({ priority: 28, slugKey: "rr-vte-mechanical", blueprintDomain: "risk_reduction", expansionCategory: "procedures", titleStem: "VTE prophylaxis: SCDs & ambulation", topic: "Surgical", topicSlug: "cardiovascular", bodySystem: "Cardiovascular", blueprintRole: "Procedures: VTE prophylaxis" }),
    D({ priority: 29, slugKey: "psy-anxiety-therapeutic", blueprintDomain: "psychosocial_integrity", expansionCategory: "mental_health", titleStem: "Therapeutic communication for anxiety", topic: "Mental health", topicSlug: "mental-health", bodySystem: "Psychosocial", blueprintRole: "Mental health: anxiety comm" }),
    D({ priority: 30, slugKey: "psy-suicide-safety", blueprintDomain: "psychosocial_integrity", expansionCategory: "mental_health", titleStem: "Suicide risk: nursing priorities", topic: "Mental health", topicSlug: "mental-health", bodySystem: "Psychosocial", blueprintRole: "Mental health: safety" }),
    D({ priority: 31, slugKey: "mat-postpartum-hem", blueprintDomain: "physiological_adaptation", expansionCategory: "maternity", titleStem: "Postpartum hemorrhage early cues", topic: "Maternity", topicSlug: "maternity", bodySystem: "Maternity", blueprintRole: "OB: PPH cues" }),
    D({ priority: 32, slugKey: "mat-labor-fhr", blueprintDomain: "physiological_adaptation", expansionCategory: "maternity", titleStem: "FHR category basics for nurses", topic: "Maternity", topicSlug: "maternity", bodySystem: "Maternity", blueprintRole: "OB: FHR monitoring" }),
    D({ priority: 33, slugKey: "ped-febrile-infant", blueprintDomain: "physiological_adaptation", expansionCategory: "pediatrics", titleStem: "Febrile infant: assessment priorities", topic: "Pediatrics", topicSlug: "pediatrics", bodySystem: "Pediatrics", blueprintRole: "Peds: fever workup" }),
    D({ priority: 34, slugKey: "ped-growth-chart", blueprintDomain: "health_promotion_maintenance", expansionCategory: "pediatrics", titleStem: "Growth charts & parental teaching", topic: "Pediatrics", topicSlug: "pediatrics", bodySystem: "Pediatrics", blueprintRole: "Peds: growth teaching" }),
    D({ priority: 35, slugKey: "hp-immunization-ed", blueprintDomain: "health_promotion_maintenance", expansionCategory: "leadership", titleStem: "Immunization education essentials", topic: "Health promotion", topicSlug: "health-promotion", bodySystem: "General", blueprintRole: "HP: immunization teaching" }),
    D({ priority: 36, slugKey: "bc-comfort-dying", blueprintDomain: "basic_care_comfort", expansionCategory: "mental_health", titleStem: "Comfort care at end of life", topic: "Palliative basics", topicSlug: "psychosocial", bodySystem: "General", blueprintRole: "Comfort: EOL nursing" }),
    D({ priority: 37, slugKey: "cs-multiorgan-triage", blueprintDomain: "management_of_care", expansionCategory: "case_study", titleStem: "Case: multi-system deterioration triage", topic: "Clinical judgment", topicSlug: "prioritization-delegation", bodySystem: "Multisystem", blueprintRole: "Case study: triage" }),
    D({ priority: 38, slugKey: "cs-two-patients", blueprintDomain: "management_of_care", expansionCategory: "case_study", titleStem: "Case: choosing between two unstable clients", topic: "Prioritization", topicSlug: "prioritization-delegation", bodySystem: "General", blueprintRole: "Case study: dual assignment" }),
    D({ priority: 39, slugKey: "pa-htn-crisis", blueprintDomain: "physiological_adaptation", expansionCategory: "disease", titleStem: "Hypertensive urgency vs emergency cues", topic: "Hypertension", topicSlug: "hypertension", bodySystem: "Cardiovascular", blueprintRole: "Disease: HTN crisis" }),
    D({ priority: 40, slugKey: "pa-afib-rate", blueprintDomain: "physiological_adaptation", expansionCategory: "disease", titleStem: "Atrial fibrillation: rate vs rhythm focus", topic: "Cardiovascular", topicSlug: "cardiovascular", bodySystem: "Cardiovascular", blueprintRole: "Disease: Afib nursing" }),
    D({ priority: 41, slugKey: "lab-abg-interpret", blueprintDomain: "physiological_adaptation", expansionCategory: "labs", titleStem: "ABG basics for nursing decisions", topic: "Respiratory", topicSlug: "respiratory", bodySystem: "Respiratory", blueprintRole: "Labs: ABG intro" }),
    D({ priority: 42, slugKey: "lab-cultures-timing", blueprintDomain: "safety_and_infection", expansionCategory: "labs", titleStem: "Blood cultures: timing with antibiotics", topic: "Infection", topicSlug: "infection-control", bodySystem: "Infection", blueprintRole: "Labs: culture timing" }),
    D({ priority: 43, slugKey: "proc-ngt-placement-care", blueprintDomain: "basic_care_comfort", expansionCategory: "procedures", titleStem: "NG tube care & placement checks", topic: "Procedures", topicSlug: "gastrointestinal", bodySystem: "Gastrointestinal", blueprintRole: "Procedures: NGT" }),
    D({ priority: 44, slugKey: "proc-cvc-dressing", blueprintDomain: "safety_and_infection", expansionCategory: "procedures", titleStem: "Central line dressing & CLABSI prevention", topic: "Infection control", topicSlug: "infection-control", bodySystem: "General", blueprintRole: "Procedures: CLABSI" }),
    D({ priority: 45, slugKey: "mo-legal-scope", blueprintDomain: "management_of_care", expansionCategory: "delegation", titleStem: "Scope of practice & unsafe orders", topic: "Delegation", topicSlug: "delegation", bodySystem: "General", blueprintRole: "Delegation: scope traps" }),
    D({ priority: 46, slugKey: "sf-fire-evac-chair", blueprintDomain: "safety_and_infection", expansionCategory: "safety", titleStem: "Fire safety & evacuation roles", topic: "Safety", topicSlug: "safety", bodySystem: "General", blueprintRole: "Safety: fire drill" }),
    D({ priority: 47, slugKey: "psy-dementia-wandering", blueprintDomain: "psychosocial_integrity", expansionCategory: "mental_health", titleStem: "Dementia: wandering & safety", topic: "Mental health", topicSlug: "mental-health", bodySystem: "Neurological", blueprintRole: "Mental health: dementia safety" }),
    D({ priority: 48, slugKey: "pa-dialysis-access", blueprintDomain: "physiological_adaptation", expansionCategory: "procedures", titleStem: "Dialysis access complications to report", topic: "Renal", topicSlug: "renal-gu", bodySystem: "Renal", blueprintRole: "Procedures: dialysis access" }),
    D({ priority: 49, slugKey: "ph-high-alert-rounds", blueprintDomain: "pharmacological_therapies", expansionCategory: "medication", titleStem: "High-alert medications: double checks", topic: "Medication safety", topicSlug: "medication-safety", bodySystem: "General", blueprintRole: "Pharm: high-alert" }),
    D({ priority: 50, slugKey: "pa-burn-fluid-first", blueprintDomain: "physiological_adaptation", expansionCategory: "disease", titleStem: "Burns: first-hour priorities", topic: "Emergency care", topicSlug: "shock", bodySystem: "Integumentary", blueprintRole: "Disease: burn shock" }),
  ];
}

const PAD_DOMAIN_ROT: BlueprintDomainId[] = [
  "safety_and_infection",
  "management_of_care",
  "pharmacological_therapies",
  "physiological_adaptation",
  "psychosocial_integrity",
  "risk_reduction",
  "health_promotion_maintenance",
  "basic_care_comfort",
];

const PAD_CAT_ROT: ExpansionCategory[] = [
  "disease",
  "labs",
  "medication",
  "safety",
  "prioritization",
  "mental_health",
  "maternity",
  "pediatrics",
  "procedures",
  "case_study",
];

const PAD_TOPIC_ROT: Array<{ topicSlug: string; topic: string; body: string }> = [
  { topicSlug: "cardiovascular", topic: "Cardiovascular", body: "Cardiovascular" },
  { topicSlug: "respiratory", topic: "Respiratory", body: "Respiratory" },
  { topicSlug: "neurological", topic: "Neurological", body: "Neurological" },
  { topicSlug: "renal-gu", topic: "Renal", body: "Renal" },
  { topicSlug: "endocrine", topic: "Endocrine", body: "Endocrine" },
  { topicSlug: "gastrointestinal", topic: "GI", body: "Gastrointestinal" },
  { topicSlug: "fluids-electrolytes", topic: "Fluids & electrolytes", body: "Renal" },
  { topicSlug: "infection-control", topic: "Infection", body: "Infection" },
  { topicSlug: "medication-safety", topic: "Medication safety", body: "General" },
  { topicSlug: "prioritization-delegation", topic: "Clinical judgment", body: "General" },
];

/** Pad with distinct blueprint roles until at least `min` slots (spread across domains). */
function padSlotsToMinimum(base: BlueprintExpansionSlot[], min: number): BlueprintExpansionSlot[] {
  const seen = new Set(base.map((s) => s.slugKey));
  const out = [...base];
  let seq = 0;
  let pri = 300;
  while (out.length < min) {
    const di = seq % PAD_DOMAIN_ROT.length;
    const ci = seq % PAD_CAT_ROT.length;
    const ti = seq % PAD_TOPIC_ROT.length;
    const dom = PAD_DOMAIN_ROT[di]!;
    const cat = PAD_CAT_ROT[ci]!;
    const tp = PAD_TOPIC_ROT[ti]!;
    const slugKey = `pad-${String(seq).padStart(3, "0")}-${dom}-${tp.topicSlug}`;
    if (!seen.has(slugKey)) {
      seen.add(slugKey);
      out.push(
        D({
          priority: pri++,
          slugKey,
          blueprintDomain: dom,
          expansionCategory: cat,
          titleStem: `Integrated review: ${tp.topic} (${cat.replace(/_/g, " ")}) #${seq + 1}`,
          topic: tp.topic,
          topicSlug: tp.topicSlug,
          bodySystem: tp.body,
          blueprintRole: `Extended practice: ${dom} × ${cat} × ${tp.topicSlug}`,
        }),
      );
    }
    seq += 1;
    if (seq > 10_000) throw new Error("padSlotsToMinimum: could not fill");
  }
  return out.sort((a, b) => a.priority - b.priority);
}

/** Additional slots 51–160: programmatic spread without repeating slugKeys. */
function additionalSlots(startPriority: number): BlueprintExpansionSlot[] {
  const extra: BlueprintExpansionSlot[] = [];
  const blocks: Array<{
    cat: ExpansionCategory;
    dom: BlueprintDomainId;
    topicSlug: string;
    topic: string;
    body: string;
    stems: string[];
  }> = [
    {
      cat: "disease",
      dom: "physiological_adaptation",
      topicSlug: "cardiovascular",
      topic: "Cardiovascular",
      body: "Cardiovascular",
      stems: [
        "STEMI vs NSTEMI: first nursing moves",
        "Angina vs infarction: data that changes risk",
        "Heart failure discharge teaching",
        "Pacemaker site monitoring",
        "Cardiac catheterization post-procedure care",
      ],
    },
    {
      cat: "disease",
      dom: "physiological_adaptation",
      topicSlug: "respiratory",
      topic: "Respiratory",
      body: "Respiratory",
      stems: ["Pleural effusion: breath sounds & positioning", "Home oxygen teaching", "Pneumothorax signs"],
    },
    {
      cat: "labs",
      dom: "risk_reduction",
      topicSlug: "fluids-electrolytes",
      topic: "Fluids & electrolytes",
      body: "Renal",
      stems: ["Calcium imbalance cues", "Magnesium monitoring on replacement", "Fluid restriction teaching"],
    },
    {
      cat: "medication",
      dom: "pharmacological_therapies",
      topicSlug: "pharmacology",
      topic: "Pharmacology",
      body: "General",
      stems: ["Beta-blocker hold peri-op considerations", "Diuretic teaching & orthostasis", "Steroid taper teaching"],
    },
    {
      cat: "mental_health",
      dom: "psychosocial_integrity",
      topicSlug: "mental-health",
      topic: "Mental health",
      body: "Psychosocial",
      stems: ["Delirium vs dementia: nursing differentiation", "Substance withdrawal monitoring", "Trauma-informed care basics"],
    },
    {
      cat: "maternity",
      dom: "physiological_adaptation",
      topicSlug: "maternity",
      topic: "Maternity",
      body: "Maternity",
      stems: ["Preeclampsia symptom triad", "Newborn thermoregulation", "Breastfeeding latch troubleshooting"],
    },
    {
      cat: "pediatrics",
      dom: "physiological_adaptation",
      topicSlug: "pediatrics",
      topic: "Pediatrics",
      body: "Pediatrics",
      stems: ["Pediatric dosing verification mindset", "Airway obstruction in toddlers", "Immunization catch-up planning"],
    },
    {
      cat: "safety",
      dom: "safety_and_infection",
      topicSlug: "safety",
      topic: "Patient safety",
      body: "General",
      stems: ["Wrong-patient near-miss reporting", "Barcode scanning discipline", "Line identification & labeling"],
    },
    {
      cat: "prioritization",
      dom: "management_of_care",
      topicSlug: "prioritization-delegation",
      topic: "Clinical judgment",
      body: "General",
      stems: ["First-day admissions: data collection order", "Rapid response activation criteria", "Overflow unit prioritization"],
    },
    {
      cat: "leadership",
      dom: "health_promotion_maintenance",
      topicSlug: "prioritization-delegation",
      topic: "Community health",
      body: "General",
      stems: ["Chronic disease self-management coaching", "Health literacy & teach-back", "Social determinants screening"],
    },
  ];

  let p = startPriority;
  let n = 0;
  for (const b of blocks) {
    for (const stem of b.stems) {
      n += 1;
      const slugKey = `x${String(n).padStart(3, "0")}-${stem
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .slice(0, 40)}`;
      extra.push(
        D({
          priority: p++,
          slugKey,
          blueprintDomain: b.dom,
          expansionCategory: b.cat,
          titleStem: stem,
          topic: b.topic,
          topicSlug: b.topicSlug,
          bodySystem: b.body,
          blueprintRole: `${b.cat}: ${stem.slice(0, 60)}`,
        }),
      );
    }
  }
  return extra;
}

export function allBlueprintExpansionSlots2026(): BlueprintExpansionSlot[] {
  const a = wave2026Slots();
  const b = additionalSlots(51);
  const merged = [...a, ...b].sort((x, y) => x.priority - y.priority);
  return padSlotsToMinimum(merged, 160);
}

export const PATHWAY_EXPANSION_LABEL: Record<string, string> = {
  "us-lpn-nclex-pn": "NCLEX-PN (United States)",
  "ca-rpn-rex-pn": "REx-PN (Canada)",
  "us-np-fnp": "FNP certification preparation (United States)",
};
