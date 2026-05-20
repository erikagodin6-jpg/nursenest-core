#!/usr/bin/env npx tsx
/**
 * NP clinical layer: materializes published `tier=np` MCQs from Replit `exam_questions.json`,
 * tags with `exam:NP`, `overlay:NP`, topic keys aligned to shared RN topics, plus FNP overlay lessons
 * (no full duplicate of RN lessons—NP sections only; pair with `us-rn-*` in copy).
 *
 *   npx tsx scripts/generate-np-clinical-layer.ts
 */
import fs from "node:fs";
import path from "node:path";
import { stemHash } from "@/lib/content/stem-hash";

const REPLIT = path.join(process.cwd(), "data/replit-exports/exam_questions.json");
const OUT_DIR = path.join(process.cwd(), "data/materialized/np-clinical-layer-2026");

const BATCH_TAG = "batch-np-clinical-2026";
const PRESET_NP_TAG = "exam-preset-np-clinical-2026";

type TopicSpec = {
  key: string;
  label: string;
  topicSlug: string;
  bodySystem: string;
  categorySlug: string;
  test: RegExp;
};

/** Ordered: specific before broad (mirrors RN bank + NP extensions). */
const NP_TOPICS: TopicSpec[] = [
  {
    key: "pulmonary-embolism",
    label: "Pulmonary embolism",
    topicSlug: "pulmonary-embolism",
    bodySystem: "Respiratory",
    categorySlug: "respiratory",
    test: /\bpulmonary embolism\b|\bPE\b.*(lung|dyspnea|hypox)|DVT.*embol|embolus/i,
  },
  {
    key: "stroke",
    label: "Stroke & neurovascular",
    topicSlug: "stroke",
    bodySystem: "Neurologic",
    categorySlug: "neurologic",
    test: /\bstroke\b|\bCVA\b|cerebrovascular|\bTIA\b|hemorrhagic stroke|ischemic stroke|thrombectomy|tPA\b|alteplase/i,
  },
  {
    key: "heart-failure",
    label: "Heart failure",
    topicSlug: "heart-failure",
    bodySystem: "Cardiovascular",
    categorySlug: "cardiovascular",
    test: /\bheart failure\b|CHF|HFrEF|HFpEF|LVAD|volume overload.*heart/i,
  },
  {
    key: "myocardial-infarction",
    label: "Myocardial infarction",
    topicSlug: "acute-coronary",
    bodySystem: "Cardiovascular",
    categorySlug: "cardiovascular",
    test: /\bmyocardial infarction\b|\bSTEMI\b|\bNSTEMI\b|\bMI\b|acute coronary|heart attack/i,
  },
  {
    key: "shock",
    label: "Shock",
    topicSlug: "shock",
    bodySystem: "Cardiovascular",
    categorySlug: "cardiovascular",
    test: /\bshock\b|hypovolemic|cardiogenic|distributive|septic shock/i,
  },
  {
    key: "renal-failure",
    label: "Renal failure & CKD",
    topicSlug: "renal",
    bodySystem: "Renal",
    categorySlug: "renal",
    test: /\brenal failure\b|acute kidney|\bAKI\b|\bCKD\b|dialysis|\bGFR\b|nephrot|creatinine.*(elev|high|rise)/i,
  },
  {
    key: "gi-bleed",
    label: "GI bleed",
    topicSlug: "gi-bleed",
    bodySystem: "Gastrointestinal",
    categorySlug: "gastrointestinal",
    test: /\bGI bleed\b|gastrointestinal bleed|hematemesis|melena|variceal|upper GI bleed/i,
  },
  {
    key: "ards",
    label: "ARDS",
    topicSlug: "ards",
    bodySystem: "Respiratory",
    categorySlug: "respiratory",
    test: /\bARDS\b|acute respiratory distress|acute lung injury/i,
  },
  {
    key: "pneumonia",
    label: "Pneumonia",
    topicSlug: "pneumonia",
    bodySystem: "Respiratory",
    categorySlug: "respiratory",
    test: /\bpneumonia\b|lobar pneumonia|community-acquired pneumonia|CAP\b/i,
  },
  {
    key: "asthma",
    label: "Asthma",
    topicSlug: "asthma",
    bodySystem: "Respiratory",
    categorySlug: "respiratory",
    test: /\basthma\b|albuterol|salbutamol|inhaled corticosteroid|peak flow/i,
  },
  {
    key: "copd-respiratory",
    label: "COPD",
    topicSlug: "copd",
    bodySystem: "Respiratory",
    categorySlug: "respiratory",
    test: /\bCOPD\b|emphysema|chronic bronchitis/i,
  },
  {
    key: "abg-interpretation",
    label: "ABG interpretation",
    topicSlug: "abg",
    bodySystem: "Respiratory",
    categorySlug: "respiratory",
    test: /\bABG\b|arterial blood gas|PaCO2|PaO2|HCO3|respiratory acidosis|metabolic acidosis/i,
  },
  {
    key: "acid-base-advanced",
    label: "Acid–base disorders",
    topicSlug: "acid-base",
    bodySystem: "Renal",
    categorySlug: "fluids-electrolytes",
    test: /\banion gap\b|metabolic alkalosis|respiratory alkalosis|mixed acid-base|delta gap|Winter/i,
  },
  {
    key: "diabetes-metabolic",
    label: "Diabetes mellitus & complications",
    topicSlug: "diabetes",
    bodySystem: "Endocrine",
    categorySlug: "endocrine",
    test:
      /\binsulin\b|hypoglycemia|hyperglycemia|\bDKA\b|\bHbA1c\b|metformin|GLP-1|SGLT2|hyperosmolar|diabetic (keto|nephropathy|retinopathy|foot)|oral hypoglycemic/i,
  },
  {
    key: "sepsis",
    label: "Sepsis",
    topicSlug: "sepsis",
    bodySystem: "Immune",
    categorySlug: "infection",
    test: /\bsepsis\b|SIRS|qSOFA/i,
  },
  {
    key: "infection-control",
    label: "Infection control & isolation",
    topicSlug: "infection-control",
    bodySystem: "Infection control",
    categorySlug: "infection",
    test: /\binfection control\b|PPE|hand hygiene|Contact precautions|Droplet|Airborne|C\.diff|C diff|\bisolation\b/i,
  },
  {
    key: "sodium-imbalance",
    label: "Sodium imbalance",
    topicSlug: "sodium",
    bodySystem: "Renal",
    categorySlug: "fluids-electrolytes",
    test: /\bhyponatremia\b|\bhypernatremia\b|serum sodium|Na\+|sodium level/i,
  },
  {
    key: "potassium-imbalance",
    label: "Potassium imbalance",
    topicSlug: "potassium",
    bodySystem: "Renal",
    categorySlug: "fluids-electrolytes",
    test: /\bhypokalemia\b|\bhyperkalemia\b|serum potassium|K\+|potassium level|kayexalate/i,
  },
  {
    key: "fluid-balance",
    label: "Fluid volume",
    topicSlug: "fluids-electrolytes",
    bodySystem: "Renal",
    categorySlug: "fluids-electrolytes",
    test: /\bfluid (volume )?(deficit|overload|excess)\b|dehydration|hypervolemia|hypovolemia|\bFVE\b|\bFVD\b/i,
  },
  {
    key: "anticoagulants",
    label: "Anticoagulation",
    topicSlug: "anticoagulation",
    bodySystem: "Hematologic",
    categorySlug: "pharmacology",
    test: /\bwarfarin\b|heparin\b|DOAC|apixaban|rivaroxaban|dabigatran|\bINR\b|anticoagul/i,
  },
  {
    key: "antibiotics",
    label: "Antibiotics",
    topicSlug: "antibiotics",
    bodySystem: "Infection",
    categorySlug: "pharmacology",
    test: /\bantibiotic\b|antimicrobial|broad-spectrum|culture and sensitivity|vancomycin/i,
  },
  {
    key: "pain-management",
    label: "Pain management",
    topicSlug: "pain",
    bodySystem: "Neurologic",
    categorySlug: "pharmacology",
    test: /\bopioid\b|analgesic|pain scale|PCA\b|patient-controlled analgesia/i,
  },
  {
    key: "wound-care",
    label: "Wound care",
    topicSlug: "wounds",
    bodySystem: "Integumentary",
    categorySlug: "fundamentals",
    test: /\bwound\b|pressure ulcer|pressure injury|staging|debridement/i,
  },
  {
    key: "delegation",
    label: "Delegation & scope",
    topicSlug: "delegation",
    bodySystem: "General",
    categorySlug: "management-of-care",
    test: /\bdelegat|UAP\b|unlicensed assist|scope of practice|collaborative agreement/i,
  },
  {
    key: "prioritization-abcs",
    label: "Prioritization & safety",
    topicSlug: "prioritization",
    bodySystem: "General",
    categorySlug: "safety",
    test: /\bprioritiz|ABCs\b|first action|most urgent|safety.*(error|event)/i,
  },
  {
    key: "np-differential-diagnosis",
    label: "Differential diagnosis (NP)",
    topicSlug: "differential-diagnosis",
    bodySystem: "General",
    categorySlug: "clinical-reasoning",
    test: /\bmost likely diagnosis\b|differential|working diagnosis|clinical impression|rule out\b/i,
  },
  {
    key: "np-prescribing",
    label: "Prescribing & dose adjustment (NP)",
    topicSlug: "prescribing",
    bodySystem: "General",
    categorySlug: "pharmacology",
    test: /\bprescrib|dose adjustment|renal dosing|hepatic dosing|contraindicat|drug interaction|titrate the|change the dose/i,
  },
  {
    key: "np-chronic-management",
    label: "Chronic disease management (NP)",
    topicSlug: "chronic-care",
    bodySystem: "General",
    categorySlug: "primary-care",
    test: /\bfollow-up visit\b|chronic (care|disease)|medication reconciliation|care plan|interval.*visit|long-term management/i,
  },
];

const NP_CATCH_ALL: TopicSpec = {
  key: "np-advanced-general",
  label: "Advanced practice — general",
  topicSlug: "np-general",
  bodySystem: "General",
  categorySlug: "primary-care",
  test: /(?!)/,
};

const OVERLAY_SLUGS: { key: string; rnPairSlug: string; title: string }[] = [
  { key: "heart-failure", rnPairSlug: "us-rn-heart-failure", title: "Heart failure — NP diagnosis & management (FNP)" },
  { key: "myocardial-infarction", rnPairSlug: "us-rn-myocardial-infarction", title: "MI / ACS — NP overlay (FNP)" },
  { key: "shock", rnPairSlug: "us-rn-shock", title: "Shock — NP resuscitation reasoning (FNP)" },
  { key: "abg-acid-base", rnPairSlug: "us-rn-abg-interpretation", title: "ABG & acid–base — NP interpretation (FNP)" },
  { key: "respiratory-acute", rnPairSlug: "us-rn-copd-respiratory", title: "COPD, asthma, ARDS, pneumonia, PE — NP respiratory overlay (FNP)" },
  { key: "diabetes-metabolic", rnPairSlug: "us-rn-insulin-hypoglycemia", title: "Diabetes & complications — NP overlay (FNP)" },
  { key: "sepsis-infection", rnPairSlug: "us-rn-sepsis", title: "Sepsis & infection control — NP overlay (FNP)" },
  { key: "electrolytes-volume", rnPairSlug: "us-rn-fluid-balance", title: "Electrolytes & volume — NP overlay (FNP)" },
  { key: "np-differential-prescribing-chronic", rnPairSlug: "fnp-differential-primary-care", title: "Differential, prescribing & chronic care — NP core (FNP)" },
];

type RawQ = Record<string, unknown> & {
  id: string;
  stem: string;
  tier: string;
  exam: string;
  options: unknown;
  correct_answer?: unknown;
  rationale?: string;
  difficulty?: number;
  body_system?: string;
  topic?: string | null;
  subtopic?: string | null;
  status?: string;
  region_scope?: string | null;
};

function optArray(o: unknown): string[] | null {
  if (!o) return null;
  if (Array.isArray(o)) {
    const s = o.filter((x): x is string => typeof x === "string" && x.trim().length > 0);
    return s.length >= 2 ? s : null;
  }
  if (typeof o === "object") {
    const vals = Object.values(o as Record<string, unknown>).filter((x): x is string => typeof x === "string");
    return vals.length >= 2 ? vals : null;
  }
  return null;
}

function correctTexts(raw: RawQ, options: string[]): string[] | null {
  const ca = raw.correct_answer ?? raw.correctAnswer;
  if (typeof ca === "number" && Number.isInteger(ca) && ca >= 0 && ca < options.length) {
    return [options[ca]!];
  }
  if (Array.isArray(ca) && ca.length && typeof ca[0] === "number") {
    const texts: string[] = [];
    for (const x of ca as number[]) {
      if (typeof x !== "number" || x < 0 || x >= options.length) return null;
      texts.push(options[x]!);
    }
    return texts;
  }
  return null;
}

function matchesTopic(row: RawQ, re: RegExp): boolean {
  const opts = optArray(row.options) ?? [];
  const blob = [row.stem, ...opts, row.rationale, row.topic, row.subtopic, row.body_system]
    .filter(Boolean)
    .join(" ");
  return re.test(blob);
}

function classifyNpTopic(row: RawQ): TopicSpec {
  for (const spec of NP_TOPICS) {
    if (matchesTopic(row, spec.test)) return spec;
  }
  return NP_CATCH_ALL;
}

function isNpTier(t: string) {
  return t.toLowerCase() === "np";
}

function normalizeRegionScope(rs: string | null | undefined): "US_ONLY" | "CA_ONLY" | "BOTH" {
  const u = String(rs ?? "BOTH")
    .trim()
    .toUpperCase()
    .replace(/-/g, "_");
  if (u === "US_ONLY" || u === "CA_ONLY" || u === "BOTH") return u as "US_ONLY" | "CA_ONLY" | "BOTH";
  return "BOTH";
}

function npOverlaySections(rnPairSlug: string, titleShort: string): Record<string, unknown>[] {
  return [
    {
      id: "intro",
      heading: "Introduction",
      kind: "intro",
      body: `This is an **NP overlay** for **${titleShort}**—not a repeat of the full RN lesson. Pair with the RN depth lesson \`${rnPairSlug}\` in your pathway catalog for pathophys and NCLEX-style drills, then use this block for **APRN-level** decisions.`,
    },
    {
      id: "diagnosis_np",
      heading: "Diagnosis considerations",
      kind: "clinical_meaning",
      body: `Frame **problem representation**, **red flags**, and **must-not-miss** diagnoses. Boards favor **next diagnostic step** vs **premature treatment**—tie history, exam, and targeted testing to pre-test probability.`,
    },
    {
      id: "management_np",
      heading: "Management plans",
      kind: "core_concept",
      body: `Outline **initial stabilization** (when implied), **guideline-concordant** therapy where the stem allows, **consult triggers**, and **when to defer** to specialty or ED. Prefer the option that matches **severity** and **comorbid constraints**.`,
    },
    {
      id: "meds_np",
      heading: "Medication adjustments",
      kind: "exam_relevance",
      body: `Expect **dose adjustment** for renal/hepatic function, **interaction** and **contraindication** traps, **deprescribing** when appropriate, and **monitoring** after a change (labs, vitals, toxicity screens).`,
    },
    {
      id: "followup_np",
      heading: "Follow-up & monitoring",
      kind: "clinical_scenario",
      body: `Choose **follow-up interval**, **patient education**, **safety netting**, and **reassessment targets** (symptoms, labs, adherence). NP items often test whether you **close the loop** on risk—not only the first visit action.`,
    },
  ];
}

function main() {
  const rawList = JSON.parse(fs.readFileSync(REPLIT, "utf8")) as RawQ[];
  const usedStemHashes = new Set<string>();
  const questionsOut: Record<string, unknown>[] = [];
  const topicCounts: Record<string, number> = {};

  const sorted = [...rawList].sort((a, b) => a.id.localeCompare(b.id));

  for (const row of sorted) {
    if (row.status !== "published" || !isNpTier(String(row.tier))) continue;
    const opts = optArray(row.options);
    if (!opts || !correctTexts(row, opts)) continue;
    const sh = stemHash(row.stem);
    if (usedStemHashes.has(sh)) continue;
    usedStemHashes.add(sh);

    const spec = classifyNpTopic(row);
    topicCounts[spec.key] = (topicCounts[spec.key] ?? 0) + 1;

    const baseDiff = typeof row.difficulty === "number" ? row.difficulty : 3;
    const diff = Math.min(5, Math.max(4, baseDiff));
    const regionScope = normalizeRegionScope(row.region_scope);
    const exam = String(row.exam ?? "NP").slice(0, 80);

    const tags = Array.from(
      new Set([
        BATCH_TAG,
        PRESET_NP_TAG,
        "exam:NP",
        "overlay:NP",
        `topic:${spec.key}`,
        `category:${spec.categorySlug}`,
        `difficulty:${diff}`,
        "priority:high_yield_np",
        "source:replit-exam_questions.json",
        `sourceExam:${String(row.exam ?? "NP").replace(/[^a-zA-Z0-9]+/g, "-").slice(0, 48)}`,
      ]),
    );

    const rowOut: Record<string, unknown> = {
      id: row.id,
      stem: row.stem,
      options: opts,
      correctAnswer: correctTexts(row, opts)!,
      questionType: "multiple_choice",
      tier: "np",
      exam,
      status: "published",
      regionScope,
      careerType: "nursing",
      rationale: row.rationale ?? "",
      topic: spec.label,
      bodySystem: row.body_system ?? spec.bodySystem,
      tags,
      difficulty: diff,
      stemHash: sh,
    };
    if (regionScope === "US_ONLY") rowOut.countryCode = "US";
    if (regionScope === "CA_ONLY") rowOut.countryCode = "CA";
    questionsOut.push(rowOut);
  }

  const lessons: Record<string, unknown>[] = [];
  for (const o of OVERLAY_SLUGS) {
    lessons.push({
      slug: `fnp-overlay-${o.key}`,
      title: o.title,
      topic: o.title.split("—")[0]?.trim() ?? o.title,
      topicSlug: o.key,
      bodySystem: "General",
      previewSectionCount: 1,
      seoTitle: `${o.title} | NurseNest`,
      seoDescription: `FNP NP overlay paired with RN lesson slug ${o.rnPairSlug}; APRN diagnosis, management, prescribing, and follow-up.`,
      sections: npOverlaySections(o.rnPairSlug, o.title.split("—")[0]?.trim() ?? o.title),
    });
  }

  const flashcards: Record<string, unknown>[] = [];
  let fi = 0;
  const seenFront = new Set<string>();
  const FC_CAP = 320;
  for (const q of questionsOut) {
    if (flashcards.length >= FC_CAP) break;
    const rat = typeof q.rationale === "string" ? q.rationale.trim() : "";
    if (rat.length < 45) continue;
    const stem = String(q.stem);
    const fp = stem.slice(0, 48);
    if (seenFront.has(fp)) continue;
    seenFront.add(fp);
    const topicTag = (q.tags as string[]).find((t) => t.startsWith("topic:"))?.slice(6) ?? "np";
    flashcards.push({
      id: `fc_np2026_${String(fi).padStart(4, "0")}`,
      front: stem.length > 130 ? `${stem.slice(0, 127)}…` : stem,
      back: rat.slice(0, 900),
      country: "US",
      tier: "NP",
      topicKey: topicTag,
      categorySlug: "fundamentals",
      sourceQuestionId: q.id,
    });
    fi += 1;
  }

  const stats = {
    sourceFile: "data/replit-exports/exam_questions.json",
    emittedQuestions: questionsOut.length,
    emittedFlashcards: flashcards.length,
    overlayLessons: lessons.length,
    topicQuestionCounts: topicCounts,
    dedupe: "stemHash global within NP tier",
  };

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUT_DIR, "questions.json"), JSON.stringify(questionsOut), "utf8");
  fs.writeFileSync(path.join(OUT_DIR, "flashcards.json"), JSON.stringify(flashcards, null, 2), "utf8");
  fs.writeFileSync(path.join(OUT_DIR, "np-generation-stats.json"), JSON.stringify(stats, null, 2), "utf8");
  fs.writeFileSync(path.join(OUT_DIR, "catalog-np-overlays.json"), JSON.stringify({ usNpFnp: lessons }, null, 2), "utf8");
  fs.writeFileSync(
    path.join(OUT_DIR, "practice-exam-presets.json"),
    JSON.stringify(
      [
        {
          id: "preset_np_clinical_2026",
          examId: "exam_np_clinical_practice_2026",
          tag: PRESET_NP_TAG,
          title: "NP clinical practice (25)",
          questionCount: 25,
          tierFilter: "np",
        },
      ],
      null,
      2,
    ),
    "utf8",
  );

  console.log(JSON.stringify(stats, null, 2));
}

main();
