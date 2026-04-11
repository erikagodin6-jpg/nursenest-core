/**
 * Weak Area Multi-Dimensional Analysis
 *
 * Groups a user's weak topics across four clinical dimensions:
 *   1. Body System  — cardiovascular, respiratory, neuro, etc.
 *   2. Cognitive Level — recall vs application vs analysis/evaluation
 *   3. Question Type — MCQ, SATA, scenario, calculation
 *   4. Speed Profile — estimated effort per topic from session timing
 *
 * Uses a deterministic static mapping from topic strings — no extra DB queries.
 * Inputs: UserTopicStat rows and optional PracticeTest timing data.
 *
 * Pure function — no DB access. Caller supplies the raw rows.
 */

import type { UserTopicStat } from "@prisma/client";

// ── Body system taxonomy ──────────────────────────────────────────────────────

const BODY_SYSTEM_MAP: Array<{ system: string; keywords: string[] }> = [
  {
    system: "Cardiovascular",
    keywords: [
      "cardiac", "heart", "cardio", "angina", "myocardial", "arrhythmia",
      "dysrhythmia", "hypertension", "heart failure", "aortic", "vascular",
      "peripheral arterial", "atrial", "ventricular", "coronary", "pacemaker",
      "endocarditis", "pericarditis", "cardiomyopathy",
    ],
  },
  {
    system: "Respiratory",
    keywords: [
      "pulmonary", "respiratory", "asthma", "copd", "pneumonia", "tuberculosis",
      "lung", "breathing", "oxygen", "ventilator", "pleural", "pneumothorax",
      "bronchitis", "emphysema", "tracheo", "airway", "intubat",
    ],
  },
  {
    system: "Gastrointestinal",
    keywords: [
      "gastrointestinal", "bowel", "colon", "stomach", "hepatic", "liver",
      "gallbladder", "pancreatitis", "ulcer", "intestinal", "colitis",
      "crohn", "appendix", "rectal", "ileostomy", "colostomy", "cirrhosis",
      "esophag", "gastro",
    ],
  },
  {
    system: "Renal / Genitourinary",
    keywords: [
      "renal", "kidney", "urinary", "bladder", "dialysis", "uti",
      "urologic", "nephro", "prostate", "glomerul", "pyelonephritis",
      "catheter urinary", "incontinence",
    ],
  },
  {
    system: "Neurological",
    keywords: [
      "neuro", "brain", "stroke", "seizure", "headache", "cognitive",
      "alzheimer", "parkinson", "spinal", "cva", "tia", "meningitis",
      "encephalitis", "dementia", "intracranial", "lumbar",
    ],
  },
  {
    system: "Endocrine",
    keywords: [
      "diabetes", "thyroid", "adrenal", "hormonal", "insulin", "metabolic",
      "pituitary", "hypoglycemia", "hyperglycemia", "cushing", "addison",
      "hyperthyroid", "hypothyroid",
    ],
  },
  {
    system: "Hematological / Oncological",
    keywords: [
      "blood", "anemia", "hematology", "clotting", "coagulation", "platelet",
      "leukemia", "lymphoma", "cancer", "tumor", "chemotherapy", "radiation",
      "oncology", "malignant", "sickle",
    ],
  },
  {
    system: "Immunological",
    keywords: [
      "immune", "hiv", "aids", "lupus", "rheumatoid", "autoimmune",
      "allergy", "anaphylaxis", "immunosuppre",
    ],
  },
  {
    system: "Musculoskeletal",
    keywords: [
      "bone", "joint", "fracture", "orthopedic", "arthritis", "gout",
      "osteoporosis", "amputation", "cast", "traction", "bursitis",
    ],
  },
  {
    system: "Integumentary",
    keywords: [
      "skin", "wound", "burn", "pressure ulcer", "dermatology",
      "wound care", "decubitus", "cellulitis",
    ],
  },
  {
    system: "Maternal / Newborn",
    keywords: [
      "obstetric", "maternal", "pregnancy", "labor", "delivery",
      "postpartum", "prenatal", "neonatal", "newborn", "antepartum",
      "eclampsia", "preeclampsia", "breastfeed",
    ],
  },
  {
    system: "Pediatrics",
    keywords: [
      "pediatric", "infant", "child", "neonatal newborn", "developmental",
      "adolescent",
    ],
  },
  {
    system: "Psychiatric / Mental Health",
    keywords: [
      "mental health", "psychiatric", "depression", "anxiety", "schizophrenia",
      "bipolar", "addiction", "substance", "suicide", "therapeutic communication",
      "behavioral",
    ],
  },
  {
    system: "Infection Control",
    keywords: [
      "infection", "sepsis", "bacteria", "viral", "isolation", "mrsa",
      "c diff", "hand hygiene", "sterile technique", "wound infection",
    ],
  },
  {
    system: "Fluid & Electrolytes",
    keywords: [
      "fluid", "electrolyte", "sodium", "potassium", "calcium", "magnesium",
      "acid-base", "dehydration", "edema", "hyponatremia", "hypernatremia",
      "acidosis", "alkalosis",
    ],
  },
  {
    system: "Pharmacology",
    keywords: [
      "medication", "drug", "pharmacology", "dosage", "adverse effect",
      "drug interaction", "opioid", "antibiotic", "diuretic", "antihypertensive",
      "anticoagulant", "antidepressant",
    ],
  },
  {
    system: "Management & Safety",
    keywords: [
      "delegation", "prioritization", "safety", "management", "leadership",
      "triage", "emergency", "nclex", "scope of practice", "assignment",
      "restraint", "fall prevention",
    ],
  },
];

function topicToBodySystem(topic: string): string {
  const lower = topic.toLowerCase();
  for (const entry of BODY_SYSTEM_MAP) {
    if (entry.keywords.some((kw) => lower.includes(kw))) return entry.system;
  }
  return "Other";
}

// ── Cognitive level mapping ───────────────────────────────────────────────────

export type CognitiveLevelKey = "knowledge" | "application" | "analysis_evaluation";

const COGNITIVE_ANALYSIS_KEYWORDS = [
  "delegation", "priorit", "triage", "which client", "first", "safety",
  "most appropriate", "best action", "outcomes", "evaluation", "interpret",
  "scenario", "case", "management",
];
const COGNITIVE_APPLICATION_KEYWORDS = [
  "nursing intervention", "action", "care plan", "complication", "monitoring",
  "assessment", "teaching", "medication", "dosage", "administer",
];

function topicToCognitiveLevel(topic: string): CognitiveLevelKey {
  const lower = topic.toLowerCase();
  if (COGNITIVE_ANALYSIS_KEYWORDS.some((kw) => lower.includes(kw)))
    return "analysis_evaluation";
  if (COGNITIVE_APPLICATION_KEYWORDS.some((kw) => lower.includes(kw)))
    return "application";
  return "knowledge";
}

const COGNITIVE_LABELS: Record<CognitiveLevelKey, string> = {
  knowledge: "Recall & Understanding",
  application: "Application",
  analysis_evaluation: "Analysis & Evaluation",
};

// ── Speed classification ──────────────────────────────────────────────────────

export type SpeedClassification = "slow" | "normal" | "fast";

/**
 * Sessions with total elapsedMs and question count — for rough speed calculation.
 * Each entry represents one completed practice test.
 */
export type SessionTimingEntry = {
  elapsedMs: number | null;
  questionCount: number;
};

function secondsPerQuestion(entries: SessionTimingEntry[]): number | null {
  const valid = entries.filter((e) => e.elapsedMs != null && e.questionCount > 0);
  if (valid.length === 0) return null;
  const totalMs = valid.reduce((s, e) => s + (e.elapsedMs ?? 0), 0);
  const totalQ = valid.reduce((s, e) => s + e.questionCount, 0);
  return Math.round(totalMs / totalQ / 1000);
}

function classifySpeed(avgSec: number | null): SpeedClassification {
  if (avgSec === null) return "normal";
  if (avgSec > 95) return "slow";
  if (avgSec < 45) return "fast";
  return "normal";
}

// ── Main analysis types ───────────────────────────────────────────────────────

export type Severity = "major_gap" | "needs_work" | "inconsistent" | "stable";

export type BodySystemGroup = {
  system: string;
  topics: string[];
  totalAttempts: number;
  correctCount: number;
  wrongCount: number;
  accuracyPct: number;
  severity: Severity;
};

export type CognitiveLevelGroup = {
  level: CognitiveLevelKey;
  label: string;
  totalAttempts: number;
  correctCount: number;
  accuracyPct: number;
  isWeakArea: boolean;
};

export type WeakAreaDimensions = {
  byBodySystem: BodySystemGroup[];
  byCognitiveLevel: CognitiveLevelGroup[];
  /** Avg seconds per question from recent sessions. */
  avgSecondsPerQuestion: number | null;
  speedClassification: SpeedClassification;
  /** 0–100 consistency score (higher = more consistent across sessions). */
  consistencyScore: number;
  consistencyLabel: "highly_consistent" | "moderate" | "inconsistent";
};

// ── Severity helper ───────────────────────────────────────────────────────────

function deriveSeverity(stat: UserTopicStat): Severity {
  const total = stat.correctCount + stat.wrongCount;
  if (total < 3) return "stable";
  const acc = stat.correctCount / total;
  if (stat.wrongStreak >= 3 || acc < 0.40) return "major_gap";
  if (stat.wrongStreak >= 1 || acc < 0.60) return "needs_work";
  if (acc < 0.70) return "inconsistent";
  return "stable";
}

// ── Consistency across sessions ───────────────────────────────────────────────

/**
 * Rough session-to-session consistency using accuracy variance.
 * Accepts an array of per-session accuracy values [0–100].
 */
function computeConsistencyScore(sessionAccuracies: number[]): number {
  if (sessionAccuracies.length < 2) return 75; // not enough data — assume moderate
  const mean = sessionAccuracies.reduce((a, b) => a + b, 0) / sessionAccuracies.length;
  const variance =
    sessionAccuracies.reduce((acc, v) => acc + (v - mean) ** 2, 0) / sessionAccuracies.length;
  const stdDev = Math.sqrt(variance);
  // StdDev of 0 → score 100; stdDev of 30+ → score 0
  return Math.max(0, Math.min(100, Math.round(100 - stdDev * 100 / 30)));
}

function consistencyLabel(score: number): WeakAreaDimensions["consistencyLabel"] {
  if (score >= 72) return "highly_consistent";
  if (score >= 50) return "moderate";
  return "inconsistent";
}

// ── Main export ───────────────────────────────────────────────────────────────

export function computeWeakAreaDimensions(args: {
  topicStats: UserTopicStat[];
  sessionTimings?: SessionTimingEntry[];
  /** Per-session accuracy values (0–100) for consistency calculation. */
  sessionAccuracies?: number[];
}): WeakAreaDimensions {
  const { topicStats } = args;

  // ── Body system grouping ─────────────────────────────────────────────────
  const systemMap = new Map<string, { topics: string[]; correct: number; wrong: number }>();
  for (const stat of topicStats) {
    const system = topicToBodySystem(stat.topic);
    const prev = systemMap.get(system) ?? { topics: [], correct: 0, wrong: 0 };
    prev.topics.push(stat.topic);
    prev.correct += stat.correctCount;
    prev.wrong += stat.wrongCount;
    systemMap.set(system, prev);
  }

  const byBodySystem: BodySystemGroup[] = [...systemMap.entries()]
    .map(([system, data]) => {
      const total = data.correct + data.wrong;
      const acc = total > 0 ? Math.round((data.correct / total) * 100) : 0;
      // Find the worst stat in this group to derive severity
      const groupStats = topicStats.filter((s) => topicToBodySystem(s.topic) === system);
      const worstStat = groupStats.sort((a, b) => {
        const aAcc = a.correctCount / Math.max(1, a.correctCount + a.wrongCount);
        const bAcc = b.correctCount / Math.max(1, b.correctCount + b.wrongCount);
        return aAcc - bAcc;
      })[0];
      return {
        system,
        topics: [...new Set(data.topics)].slice(0, 8),
        totalAttempts: total,
        correctCount: data.correct,
        wrongCount: data.wrong,
        accuracyPct: acc,
        severity: worstStat ? deriveSeverity(worstStat) : "stable",
      };
    })
    .filter((g) => g.totalAttempts >= 2)
    .sort((a, b) => a.accuracyPct - b.accuracyPct); // worst first

  // ── Cognitive level grouping ─────────────────────────────────────────────
  const cogMap = new Map<CognitiveLevelKey, { correct: number; total: number }>();
  for (const stat of topicStats) {
    const level = topicToCognitiveLevel(stat.topic);
    const prev = cogMap.get(level) ?? { correct: 0, total: 0 };
    prev.correct += stat.correctCount;
    prev.total += stat.correctCount + stat.wrongCount;
    cogMap.set(level, prev);
  }

  const cogOrder: CognitiveLevelKey[] = ["knowledge", "application", "analysis_evaluation"];
  const byCognitiveLevel: CognitiveLevelGroup[] = cogOrder
    .filter((lvl) => (cogMap.get(lvl)?.total ?? 0) >= 2)
    .map((level) => {
      const data = cogMap.get(level)!;
      const acc = Math.round((data.correct / data.total) * 100);
      return {
        level,
        label: COGNITIVE_LABELS[level],
        totalAttempts: data.total,
        correctCount: data.correct,
        accuracyPct: acc,
        isWeakArea: acc < 65,
      };
    });

  // ── Speed profile ────────────────────────────────────────────────────────
  const avgSec = secondsPerQuestion(args.sessionTimings ?? []);
  const speedClassification = classifySpeed(avgSec);

  // ── Consistency ──────────────────────────────────────────────────────────
  const score = computeConsistencyScore(args.sessionAccuracies ?? []);

  return {
    byBodySystem,
    byCognitiveLevel,
    avgSecondsPerQuestion: avgSec,
    speedClassification,
    consistencyScore: score,
    consistencyLabel: consistencyLabel(score),
  };
}
