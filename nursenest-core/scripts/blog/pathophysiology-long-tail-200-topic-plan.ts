/**
 * Exactly 200 unique long-tail pathophysiology topics for NurseNest blog seeding.
 * Tier distribution: RN 55, RPN/PN 45, NP 40, Allied 40, New Grad 15, Pre-Nursing 5.
 * Consumed by `seed-long-tail-patho-blog-posts.mts` (not bundled in the Next app).
 */

export const PATHOPHYSIOLOGY_LONG_TAIL_200_LEGACY_SOURCE = "pathophysiology-long-tail-200-seed" as const;

export type PathophysiologyLongTailTier =
  | "RN"
  | "RPN_PN"
  | "NP"
  | "ALLIED"
  | "NEW_GRAD"
  | "PRE_NURSING";

export type PathophysiologyLongTailTopicPlan = {
  slug: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  tier: PathophysiologyLongTailTier;
  exam: string | null;
  careerSlug: string | null;
  bodySystem: string;
  targetKeyword: string;
  category: string;
  /** Short label used in FAQs and anchors */
  anchorFocus: string;
};

const MODIFIERS = [
  "compensatory mechanisms and red flags",
  "oxygen delivery, perfusion, and monitoring cues",
  "fluid shifts, electrolytes, and safety thresholds",
  "exam prioritisation and escalation triggers",
  "patient teaching and interprofessional handoffs",
] as const;

const CONDITIONS: { focus: string; system: string; keyword: string }[] = [
  { focus: "left-sided heart failure with pulmonary congestion", system: "Cardiovascular", keyword: "heart failure pathophysiology" },
  { focus: "right-sided heart failure with systemic congestion", system: "Cardiovascular", keyword: "right heart failure nursing" },
  { focus: "acute coronary syndrome and myocardial oxygen balance", system: "Cardiovascular", keyword: "ACS pathophysiology NCLEX" },
  { focus: "atrial fibrillation with rapid ventricular response", system: "Cardiovascular", keyword: "afib RVR mechanism" },
  { focus: "hypertensive emergency and autoregulation limits", system: "Cardiovascular", keyword: "hypertensive crisis pathophysiology" },
  { focus: "hypovolemic shock and compensatory vasoconstriction", system: "Cardiovascular", keyword: "hypovolemic shock nursing" },
  { focus: "cardiogenic shock and forward output failure", system: "Cardiovascular", keyword: "cardiogenic shock pathophysiology" },
  { focus: "acute pulmonary embolism and ventilation-perfusion mismatch", system: "Cardiovascular", keyword: "PE pathophysiology nursing" },
  { focus: "deep vein thrombosis formation and Virchow triad", system: "Hematologic", keyword: "DVT pathophysiology" },
  { focus: "disseminated intravascular coagulation in critical illness", system: "Hematologic", keyword: "DIC nursing pathophysiology" },
  { focus: "iron deficiency anemia and oxygen-carrying capacity", system: "Hematologic", keyword: "anemia pathophysiology" },
  { focus: "sickle cell vaso-occlusive crisis", system: "Hematologic", keyword: "sickle cell crisis nursing" },
  { focus: "COPD exacerbation, air trapping, and dynamic hyperinflation", system: "Respiratory", keyword: "COPD exacerbation pathophysiology" },
  { focus: "severe asthma attack and bronchospasm physiology", system: "Respiratory", keyword: "asthma exacerbation NCLEX" },
  { focus: "acute respiratory distress syndrome and alveolar-capillary leak", system: "Respiratory", keyword: "ARDS pathophysiology" },
  { focus: "pneumonia, consolidation, and gas exchange impairment", system: "Respiratory", keyword: "pneumonia pathophysiology nursing" },
  { focus: "pulmonary oedema and fluid movement across alveoli", system: "Respiratory", keyword: "pulmonary oedema mechanism" },
  { focus: "obstructive sleep apnoea and intermittent hypoxia", system: "Respiratory", keyword: "sleep apnoea pathophysiology" },
  { focus: "acute kidney injury and tubular stress", system: "Renal", keyword: "AKI pathophysiology nursing" },
  { focus: "chronic kidney disease mineral and bone disorder", system: "Renal", keyword: "CKD-MBD nursing" },
  { focus: "hyperkalemia and resting membrane potential changes", system: "Electrolyte", keyword: "hyperkalemia pathophysiology" },
  { focus: "hyponatremia and cerebral water shifts", system: "Electrolyte", keyword: "hyponatremia nursing NCLEX" },
  { focus: "hypocalcemia and neuromuscular excitability", system: "Electrolyte", keyword: "hypocalcemia pathophysiology" },
  { focus: "metabolic acidosis and bicarbonate buffering", system: "Acid-base", keyword: "metabolic acidosis nursing" },
  { focus: "respiratory acidosis in acute ventilatory failure", system: "Acid-base", keyword: "respiratory acidosis pathophysiology" },
  { focus: "diabetic ketoacidosis and ketogenesis", system: "Endocrine", keyword: "DKA pathophysiology NCLEX" },
  { focus: "hyperosmolar hyperglycemic state and osmotic diuresis", system: "Endocrine", keyword: "HHS nursing pathophysiology" },
  { focus: "thyroid storm and thermogenesis and adrenergic surge", system: "Endocrine", keyword: "thyroid storm pathophysiology" },
  { focus: "myxedema coma and slowed metabolism", system: "Endocrine", keyword: "myxedema coma nursing" },
  { focus: "acute pancreatitis and inflammatory cascade", system: "Gastrointestinal", keyword: "pancreatitis pathophysiology" },
  { focus: "cirrhosis decompensation, portal hypertension, and ascites", system: "Gastrointestinal", keyword: "cirrhosis pathophysiology" },
  { focus: "upper gastrointestinal bleeding and perfusion risk", system: "Gastrointestinal", keyword: "GI bleed nursing pathophysiology" },
  { focus: "bowel obstruction and third-spacing pressures", system: "Gastrointestinal", keyword: "bowel obstruction pathophysiology" },
  { focus: "ischemic stroke and penumbra perfusion", system: "Neurological", keyword: "stroke pathophysiology NCLEX" },
  { focus: "intracranial pressure elevation after brain injury", system: "Neurological", keyword: "raised ICP nursing" },
  { focus: "seizure activity and neuronal metabolic demand", system: "Neurological", keyword: "seizure pathophysiology nursing" },
  { focus: "Guillain-Barré demyelination and ascending weakness", system: "Neurological", keyword: "GBS pathophysiology" },
  { focus: "meningitis, blood-brain barrier, and inflammation", system: "Neurological", keyword: "meningitis pathophysiology" },
  { focus: "sepsis recognition and systemic inflammatory response", system: "Immune", keyword: "sepsis pathophysiology NCLEX" },
  { focus: "septic shock and distributive vasodilation", system: "Immune", keyword: "septic shock nursing" },
  { focus: "cellulitis and spreading soft-tissue inflammation", system: "Integumentary", keyword: "cellulitis pathophysiology" },
  { focus: "major burns and capillary leak physiology", system: "Integumentary", keyword: "burn injury pathophysiology" },
  { focus: "pressure injury and localized ischaemia", system: "Integumentary", keyword: "pressure injury mechanism" },
  { focus: "rheumatoid arthritis flare and synovitis", system: "Musculoskeletal", keyword: "RA flare pathophysiology" },
  { focus: "gout flare and urate crystal inflammation", system: "Musculoskeletal", keyword: "gout pathophysiology nursing" },
  { focus: "acute compartment syndrome and perfusion pressure", system: "Musculoskeletal", keyword: "compartment syndrome nursing" },
  { focus: "preeclampsia and endothelial dysfunction", system: "Obstetric", keyword: "preeclampsia pathophysiology" },
  { focus: "postpartum haemorrhage and haemodynamic collapse", system: "Obstetric", keyword: "PPH pathophysiology" },
  { focus: "hyperemesis gravidarum and fluid-electrolyte losses", system: "Obstetric", keyword: "hyperemesis pathophysiology" },
];

function slugify(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-")
    .slice(0, 72);
}

function tierMeta(tier: PathophysiologyLongTailTier): {
  exam: string | null;
  careerSlug: string | null;
  titleSuffix: string;
  audienceTag: string;
} {
  switch (tier) {
    case "RN":
      return {
        exam: "NCLEX_RN",
        careerSlug: "rn",
        titleSuffix: "for NCLEX-RN nursing students",
        audienceTag: "NCLEX-RN",
      };
    case "RPN_PN":
      return {
        exam: "REX_PN",
        careerSlug: "rpn",
        titleSuffix: "for Canadian practical nursing and REx-PN preparation",
        audienceTag: "REx-PN",
      };
    case "NP":
      return {
        exam: "NP_PNP_PC",
        careerSlug: "np",
        titleSuffix: "for nurse practitioner clinical reasoning",
        audienceTag: "NP",
      };
    case "ALLIED":
      return {
        exam: "ALLIED_HEALTH",
        careerSlug: "allied",
        titleSuffix: "for allied health learners supporting nursing care",
        audienceTag: "allied health",
      };
    case "NEW_GRAD":
      return {
        exam: "NCLEX_RN",
        careerSlug: "rn",
        titleSuffix: "for new graduate nurses building clinical judgement",
        audienceTag: "new graduate",
      };
    case "PRE_NURSING":
      return {
        exam: null,
        careerSlug: null,
        titleSuffix: "foundational pathophysiology for pre-nursing learners",
        audienceTag: "pre-nursing",
      };
    default:
      return { exam: null, careerSlug: null, titleSuffix: "", audienceTag: "" };
  }
}

function buildRow(
  tier: PathophysiologyLongTailTier,
  cond: (typeof CONDITIONS)[number],
  modifier: string,
  serial: number,
): PathophysiologyLongTailTopicPlan {
  const meta = tierMeta(tier);
  const title = `Pathophysiology of ${cond.focus}: ${modifier} ${meta.titleSuffix}`;
  const slug = `patho-lt-${slugify(tier)}-${slugify(cond.focus)}-${slugify(modifier)}-${serial}`.slice(0, 118);
  const seoTitle = `${cond.keyword} — ${meta.audienceTag} | NurseNest`.slice(0, 60);
  const metaDescription =
    `Learn ${cond.focus} through ${modifier}: assessment cues, diagnostics, treatment overview, and nursing implications for ${meta.audienceTag}. Educational content only.`.slice(
      0,
      158,
    );
  return {
    slug,
    title,
    seoTitle,
    metaDescription,
    tier,
    exam: meta.exam,
    careerSlug: meta.careerSlug,
    bodySystem: cond.system,
    targetKeyword: `${cond.keyword} ${meta.audienceTag}`.slice(0, 200),
    category: "Pathophysiology",
    anchorFocus: cond.focus.slice(0, 120),
  };
}

/**
 * Expands CONDITIONS × MODIFIERS (40×5 = 200) and assigns tiers in required proportions.
 */
export function getPathophysiologyLongTail200TopicPlan(): PathophysiologyLongTailTopicPlan[] {
  const conds = CONDITIONS.slice(0, 40);
  if (conds.length !== 40) {
    throw new Error(`pathophysiology long-tail plan: need at least 40 CONDITIONS rows, got ${conds.length}`);
  }
  const pool: { cond: (typeof CONDITIONS)[number]; modifier: string; serial: number }[] = [];
  let serial = 0;
  for (const cond of conds) {
    for (const modifier of MODIFIERS) {
      pool.push({ cond, modifier, serial: serial++ });
    }
  }
  if (pool.length !== 200) {
    throw new Error(`pathophysiology long-tail plan: expected 200 combinations, got ${pool.length}`);
  }

  const tierOrder: PathophysiologyLongTailTier[] = [
    ...Array.from({ length: 55 }, (): PathophysiologyLongTailTier => "RN"),
    ...Array.from({ length: 45 }, (): PathophysiologyLongTailTier => "RPN_PN"),
    ...Array.from({ length: 40 }, (): PathophysiologyLongTailTier => "NP"),
    ...Array.from({ length: 40 }, (): PathophysiologyLongTailTier => "ALLIED"),
    ...Array.from({ length: 15 }, (): PathophysiologyLongTailTier => "NEW_GRAD"),
    ...Array.from({ length: 5 }, (): PathophysiologyLongTailTier => "PRE_NURSING"),
  ];
  if (tierOrder.length !== 200) {
    throw new Error(`pathophysiology long-tail plan: tierOrder length ${tierOrder.length}`);
  }

  return pool.map((p, i) => buildRow(tierOrder[i]!, p.cond, p.modifier, p.serial));
}
