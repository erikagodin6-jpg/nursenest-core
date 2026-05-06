/**
 * Long-tail pathophysiology / clinical teaching topics for {@link scripts/blog-ai-generate.ts}.
 * Covers RN, RPN/PN, NP, new graduate nurses, and allied health (SEO-oriented titles; not lesson slugs).
 */

export type BlogCliTopicTier = "rn" | "rpn" | "pn" | "np" | "new-grad" | "allied";

export type BlogCliCorpusTopic = {
  topic: string;
  tier: BlogCliTopicTier;
  /** Reserved for future filtering; all default rows are pathophysiology-style. */
  pathophysiology: boolean;
};

const TIER_CYCLE: BlogCliTopicTier[] = ["rn", "rpn", "pn", "np", "new-grad", "allied"];

/** Marquee long-tail examples (mix of audiences). */
const MARQUEE_TOPICS: BlogCliCorpusTopic[] = [
  { topic: "Hyperkalemia ECG changes and nursing interventions", tier: "rn", pathophysiology: true },
  { topic: "Early signs of sepsis in older adults for nursing students", tier: "new-grad", pathophysiology: true },
  { topic: "DKA vs HHS pathophysiology nursing comparison", tier: "rn", pathophysiology: true },
  { topic: "Heart failure fluid overload assessment for new nurses", tier: "new-grad", pathophysiology: true },
  { topic: "COPD exacerbation pathophysiology and oxygen therapy", tier: "rn", pathophysiology: true },
  { topic: "Acute kidney injury labs BUN creatinine urine output nursing", tier: "rn", pathophysiology: true },
  { topic: "Stroke assessment FAST NIHSS nursing priorities", tier: "rn", pathophysiology: true },
  { topic: "Cushing syndrome vs Addison disease nursing signs", tier: "np", pathophysiology: true },
  { topic: "SIADH vs diabetes insipidus sodium changes nursing", tier: "np", pathophysiology: true },
  { topic: "Pediatric respiratory distress signs for nursing students", tier: "new-grad", pathophysiology: true },
  { topic: "Postpartum hemorrhage pathophysiology and nursing priorities", tier: "rn", pathophysiology: true },
  { topic: "Neutropenic fever oncology nursing interventions", tier: "rn", pathophysiology: true },
  { topic: "Dialysis disequilibrium syndrome symptoms and prevention", tier: "rn", pathophysiology: true },
  { topic: "Compartment syndrome 6 Ps nursing assessment", tier: "rn", pathophysiology: true },
  {
    topic: "Pulmonary embolism signs symptoms diagnostics and nursing care",
    tier: "rn",
    pathophysiology: true,
  },
  { topic: "Hyperkalemia nursing assessment and ECG changes for REx-PN", tier: "rpn", pathophysiology: true },
  { topic: "Heart failure NYHA class nursing teaching for PN students", tier: "pn", pathophysiology: true },
  { topic: "Adult primary care asthma exacerbation pathophysiology for NP students", tier: "np", pathophysiology: true },
  { topic: "Respiratory therapy ABG interpretation in COPD exacerbation", tier: "allied", pathophysiology: true },
  { topic: "Paramedic stroke mimics and blood glucose field assessment", tier: "allied", pathophysiology: true },
  { topic: "Medical laboratory troponin trends and acute coronary syndrome", tier: "allied", pathophysiology: true },
  { topic: "Physiotherapy mobilization after total hip replacement precautions", tier: "allied", pathophysiology: true },
  { topic: "Occupational therapy energy conservation in heart failure patients", tier: "allied", pathophysiology: true },
  { topic: "Pharmacy technician anticoagulation monitoring basics in atrial fibrillation", tier: "allied", pathophysiology: true },
  { topic: "Diagnostic imaging red flags for cauda equina syndrome communication to nursing", tier: "allied", pathophysiology: true },
  { topic: "PSW skin integrity pressure injury prevention in immobile clients", tier: "allied", pathophysiology: true },
  { topic: "Dental hygiene bacterial endocarditis prevention counselling for cardiac patients", tier: "allied", pathophysiology: true },
  { topic: "Mental health and addictions withdrawal syndromes nursing overlap", tier: "allied", pathophysiology: true },
];

const STEMS: readonly string[] = [
  "Acute pancreatitis pain patterns and enzyme trends",
  "GI bleed upper vs lower nursing assessment and hemodynamics",
  "Hypertensive emergency pathophysiology and drip monitoring",
  "Hypovolemic shock compensatory stage nursing recognition",
  "Distributive shock warm vs cold sepsis patterns",
  "Cardiogenic shock low cardiac output nursing monitoring",
  "Acute coronary syndrome STEMI vs NSTEMI triage",
  "Atrial flutter vs atrial fibrillation rate control nursing",
  "Hyperosmolar hyperglycemic state fluid deficits nursing",
  "Diabetic ketoacidosis potassium shifts and insulin cautions",
  "Thyroid storm vs myxedema coma differentiation for nurses",
  "Adrenal insufficiency crisis sodium and glucose nursing",
  "Electrolyte emergencies calcium magnesium phosphate nursing",
  "Rhabdomyolysis CK trends and fluid resuscitation nursing",
  "Acute liver failure encephalopathy and ammonia nursing",
  "Esophageal varices bleeding balloon therapy nursing overview",
  "Bowel obstruction fluid shifts and NG tube nursing",
  "Clostridioides difficile infection isolation and hydration nursing",
  "Cellulitis vs necrotizing fasciitis border nursing vigilance",
  "Meningitis headache photophobia and isolation nursing",
  "Increased intracranial pressure herniation signs nursing",
  "Status epilepticus benzodiazepine ladder nursing support",
  "Spinal cord injury autonomic dysreflexia nursing prevention",
  "Burn shock fluid resuscitation Parkland overview nursing",
  "Heat stroke vs heat exhaustion field-to-ward nursing",
  "Hypothermia rewarming stages and arrhythmia nursing",
  "Anaphylaxis epinephrine timing and observation nursing",
  "Transfusion reaction febrile vs hemolytic nursing response",
  "Disseminated intravascular coagulation labs and bleeding nursing",
  "Sickle cell vaso-occlusive crisis pain and oxygen nursing",
  "Deep vein thrombosis prevention SCDs and pharmacology nursing",
  "Pleural effusion thoracentesis preparation nursing",
  "ARDS lung protective ventilation concepts for bedside nurses",
  "Acute glomerulonephritis hematuria and edema nursing",
  "Nephrotic syndrome edema and infection risk nursing",
  "Urinary retention postoperative catheter indications nursing",
  "BPH urinary retention pathophysiology and catheter care nursing",
  "Pelvic inflammatory disease sepsis risk nursing teaching",
  "Ectopic pregnancy rupture shock signs nursing priorities",
  "Preeclampsia proteinuria and seizure prophylaxis nursing",
  "Gestational diabetes glucose targets and fetal movement nursing",
  "Neonatal hypoglycemia feeding cues and warming nursing",
  "Bronchiolitis wheezing dehydration and oxygen nursing",
  "Croup stridor corticosteroids and escalation nursing",
  "Kawasaki disease fever and mucosal changes nursing",
  "Febrile neutropenia time-to-antibiotics nursing advocacy",
  "Tumor lysis syndrome labs and hydration nursing",
  "Spinal anesthesia headache positioning and fluids nursing",
  "Epidural hematoma postoperative neuro checks nursing",
  "Delirium hypoactive vs hyperactive prevention bundles nursing",
  "Alcohol withdrawal CIWA scoring and seizure precautions nursing",
  "Opioid overdose naloxone dosing and airway nursing",
  "Serotonin syndrome clonus and autonomic instability nursing",
  "Neuroleptic malignant syndrome fever rigidity nursing",
  "Suicide risk safety planning and observation nursing",
];

const TAILS: readonly string[] = [
  "pathophysiology and nursing priorities for licensing exams",
  "assessment cues red flags and escalation for bedside practice",
  "exam-style prioritisation and clinical judgement review",
  "labs diagnostics and monitoring trends nurses must recognise",
  "patient education adherence and safety teaching points",
];

function dedupeTopics(rows: BlogCliCorpusTopic[]): BlogCliCorpusTopic[] {
  const seen = new Set<string>();
  const out: BlogCliCorpusTopic[] = [];
  for (const r of rows) {
    const k = r.topic.trim().toLowerCase();
    if (k.length < 8 || seen.has(k)) continue;
    seen.add(k);
    out.push(r);
  }
  return out;
}

/** Build the default ≥200-topic corpus (deduped). */
export function buildDefaultBlogCliCorpus(): BlogCliCorpusTopic[] {
  const grid: BlogCliCorpusTopic[] = [];
  let idx = 0;
  for (const stem of STEMS) {
    for (const tail of TAILS) {
      grid.push({
        topic: `${stem}: ${tail}`,
        tier: TIER_CYCLE[idx % TIER_CYCLE.length]!,
        pathophysiology: true,
      });
      idx += 1;
    }
  }
  return dedupeTopics([...MARQUEE_TOPICS, ...grid]);
}

/** Singleton corpus for CLI and tests. */
export const BLOG_CLI_PATHOPHYSIOLOGY_CORPUS: BlogCliCorpusTopic[] = buildDefaultBlogCliCorpus();

export function filterCorpusTopics(params: {
  entries: readonly BlogCliCorpusTopic[];
  pathophysiologyOnly: boolean;
  tier: BlogCliTopicTier | null;
}): BlogCliCorpusTopic[] {
  let rows = [...params.entries];
  if (params.pathophysiologyOnly) {
    rows = rows.filter((r) => r.pathophysiology);
  }
  if (params.tier) {
    rows = rows.filter((r) => r.tier === params.tier);
  }
  return rows;
}

/** Shuffle copy (Fisher–Yates); mutates the copy only. */
export function shuffleBlogCliCorpusTopics<T>(rows: T[]): T[] {
  const a = [...rows];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

export function pickCorpusSlice(entries: readonly BlogCliCorpusTopic[], limit: number): BlogCliCorpusTopic[] {
  const cap = Math.max(1, Math.floor(limit));
  const shuffled = shuffleBlogCliCorpusTopics([...entries]);
  return shuffled.slice(0, Math.min(cap, shuffled.length));
}

/** Test helper: assert each tier appears at least once in corpus. */
export function corpusTierCoverage(entries: readonly BlogCliCorpusTopic[]): Record<BlogCliTopicTier, boolean> {
  const tiers: BlogCliTopicTier[] = ["rn", "rpn", "pn", "np", "new-grad", "allied"];
  const out = {} as Record<BlogCliTopicTier, boolean>;
  for (const t of tiers) out[t] = entries.some((e) => e.tier === t);
  return out;
}
