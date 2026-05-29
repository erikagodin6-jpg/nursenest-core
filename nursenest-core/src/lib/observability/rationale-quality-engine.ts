/**
 * Rationale Quality Engine
 *
 * Detects weak, generic, or incomplete rationale text in NurseNest questions.
 * High-quality rationales explain clinical reasoning, not just confirm the answer.
 *
 * Detection patterns (text analysis without ML):
 *   1. Template/filler phrases ("Use the nursing process", "Prevent harm")
 *   2. Missing incorrect-option explanations (rationale only explains the right answer)
 *   3. Missing clinical reasoning (no pathophysiology, mechanism, or clinical context)
 *   4. Too short (< 80 words = insufficient explanation)
 *   5. Vague outcome language ("This is the correct answer because it is best")
 *   6. Missing patient safety context for priority/delegation questions
 *
 * Quality score: 0–100
 *   90–100: Excellent (clinical reasoning, explains all options)
 *   70–89:  Good (explains correct, some clinical context)
 *   50–69:  Adequate (functional but thin)
 *   30–49:  Poor (generic or missing key explanations)
 *   0–29:   Critical (needs rewrite)
 *
 * Usage:
 *   const score = analyzeRationaleQuality({ questionId, rationale, tier, topic });
 *   const flagged = getBatchRationaleReport(questions);
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type RationaleFlag =
  | "template_language"
  | "too_short"
  | "missing_clinical_reasoning"
  | "missing_incorrect_explanations"
  | "vague_outcome_language"
  | "generic_safety_language"
  | "missing_patient_context"
  | "priority_without_acuity"
  | "delegation_without_scope"
  | "pharmacology_without_mechanism";

export type RationaleQualityResult = {
  questionId: string;
  qualityScore: number;
  status: "excellent" | "good" | "adequate" | "poor" | "critical";
  flags: RationaleFlag[];
  wordCount: number;
  /** Specific problematic phrases found (excerpts ≤80 chars each). */
  flaggedPhrases: string[];
  recommendations: string[];
};

// ─── Filler/template patterns ─────────────────────────────────────────────────

const TEMPLATE_PATTERNS: Array<{ pattern: RegExp; flag: RationaleFlag; label: string }> = [
  {
    pattern: /\buse the nursing process\b/i,
    flag: "template_language",
    label: "\"Use the nursing process\" — too generic",
  },
  {
    pattern: /\bprioritize client safety\b/i,
    flag: "generic_safety_language",
    label: "\"Prioritize client safety\" — needs specifics",
  },
  {
    pattern: /\brespond to the priority cue\b/i,
    flag: "template_language",
    label: "\"Respond to the priority cue\" — template filler",
  },
  {
    pattern: /\bprevent harm\b/i,
    flag: "generic_safety_language",
    label: "\"Prevent harm\" without clinical context",
  },
  {
    pattern: /\bthis is the (correct|best) (answer|option) because (it is|it's) (correct|best)\b/i,
    flag: "vague_outcome_language",
    label: "Circular explanation — restates answer without reasoning",
  },
  {
    pattern: /\bthe nurse should\b.*\bbecause it is (appropriate|correct|best)\b/i,
    flag: "vague_outcome_language",
    label: "Vague justification pattern",
  },
  {
    pattern: /\bfollow (standard|hospital|facility) protocol\b/i,
    flag: "template_language",
    label: "\"Follow protocol\" — cite specific protocol or reasoning",
  },
  {
    pattern: /\bapply clinical judgment\b/i,
    flag: "template_language",
    label: "\"Apply clinical judgment\" — specify what clinical judgment entails",
  },
  {
    pattern: /\bremember that\b.*\bis always (important|critical|essential)\b/i,
    flag: "template_language",
    label: "Vague \"always important\" language",
  },
];

const CLINICAL_REASONING_TERMS = [
  "pathophysiology", "mechanism", "etiology", "pathogen", "receptor", "enzyme",
  "hemodynamic", "cardiac output", "renal", "hepatic", "metabolic", "inflammatory",
  "vasoconstrict", "vasodilat", "perfusion", "oxygenation", "ventilation",
  "assessment", "auscultate", "palpate", "percussion", "vital signs",
  "contraindicated", "adverse effect", "side effect", "drug interaction",
  "priority", "acuity", "deteriorating", "stable", "unstable",
  "delegation", "unlicensed", "scope of practice", "RN", "LPN", "RPN",
  "ABG", "CBC", "electrolyte", "potassium", "sodium", "glucose",
];

const INCORRECT_OPTION_INDICATORS = [
  "incorrect because", "wrong because", "not appropriate because",
  "this option is incorrect", "distractor", "although", "however",
  "option a", "option b", "option c", "option d",
  "while", "despite", "even though",
];

// ─── Analysis ─────────────────────────────────────────────────────────────────

export function analyzeRationaleQuality(opts: {
  questionId: string;
  rationale: string;
  tier?: string;
  topic?: string;
}): RationaleQualityResult {
  const { questionId, rationale, tier, topic } = opts;
  const text = rationale.trim();
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  let score = 100;
  const flags: RationaleFlag[] = [];
  const flaggedPhrases: string[] = [];
  const recommendations: string[] = [];

  // Check: too short
  if (wordCount < 40) {
    score -= 35;
    flags.push("too_short");
    recommendations.push("Rationale is very short (<40 words). Add clinical context and option explanations.");
  } else if (wordCount < 80) {
    score -= 15;
    flags.push("too_short");
    recommendations.push("Rationale is thin (<80 words). Consider expanding with mechanism/context.");
  }

  // Check: template/filler language
  for (const { pattern, flag, label } of TEMPLATE_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      score -= 12;
      if (!flags.includes(flag)) flags.push(flag);
      flaggedPhrases.push(label);
    }
  }

  // Check: missing clinical reasoning
  const hasClinicalTerms = CLINICAL_REASONING_TERMS.some((term) =>
    text.toLowerCase().includes(term.toLowerCase()),
  );
  if (!hasClinicalTerms && wordCount >= 40) {
    score -= 20;
    flags.push("missing_clinical_reasoning");
    recommendations.push(
      "Rationale lacks clinical reasoning terms. Add pathophysiology, mechanism, or clinical context.",
    );
  }

  // Check: missing incorrect-option explanations
  const hasIncorrectExplanations = INCORRECT_OPTION_INDICATORS.some((phrase) =>
    text.toLowerCase().includes(phrase),
  );
  if (!hasIncorrectExplanations && wordCount >= 60) {
    score -= 15;
    flags.push("missing_incorrect_explanations");
    recommendations.push(
      "Rationale only explains the correct answer. Add explanations for why distractors are wrong.",
    );
  }

  // Topic-specific checks
  const topicLower = (topic ?? "").toLowerCase();
  if (topicLower.includes("pharmacol") || topicLower.includes("medication")) {
    const hasMechanism = /mechanism|receptor|binds|blocks|inhibit|activate|metabol/i.test(text);
    if (!hasMechanism) {
      score -= 10;
      flags.push("pharmacology_without_mechanism");
      recommendations.push("Pharmacology rationale should explain mechanism of action.");
    }
  }

  if (topicLower.includes("priorit") || topicLower.includes("delegation")) {
    const hasAcuity = /acute|unstable|deteriorat|urgent|emergent|critical|Maslow|ABCs/i.test(text);
    if (!hasAcuity && !topicLower.includes("delegation")) {
      score -= 8;
      flags.push("priority_without_acuity");
      recommendations.push("Priority question rationale should reference acuity, ABCs, or Maslow framework.");
    }
    const hasScope = /scope|unlicensed|UAP|CNA|LPN|RPN|delegate|supervision/i.test(text);
    if (!hasScope && topicLower.includes("delegation")) {
      score -= 8;
      flags.push("delegation_without_scope");
      recommendations.push("Delegation rationale should reference scope of practice.");
    }
  }

  score = Math.max(0, Math.min(100, score));

  const statusMap: Array<[number, RationaleQualityResult["status"]]> = [
    [90, "excellent"],
    [70, "good"],
    [50, "adequate"],
    [30, "poor"],
    [0, "critical"],
  ];
  const status = statusMap.find(([min]) => score >= min)?.[1] ?? "critical";

  return {
    questionId,
    qualityScore: score,
    status,
    flags,
    wordCount,
    flaggedPhrases,
    recommendations,
  };
}

/** Analyze a batch of questions and return those needing attention. */
export function getBatchRationaleReport(
  questions: Array<{ questionId: string; rationale: string; tier?: string; topic?: string }>,
  statusFilter?: RationaleQualityResult["status"][],
): RationaleQualityResult[] {
  const results = questions.map(analyzeRationaleQuality);
  if (!statusFilter) return results.sort((a, b) => a.qualityScore - b.qualityScore);
  return results
    .filter((r) => statusFilter.includes(r.status))
    .sort((a, b) => a.qualityScore - b.qualityScore);
}

/** Platform summary: what fraction of rationales need work? */
export function summarizeRationaleQuality(
  results: RationaleQualityResult[],
): {
  total: number;
  excellent: number;
  good: number;
  adequate: number;
  poor: number;
  critical: number;
  avgScore: number;
  topFlags: Array<{ flag: RationaleFlag; count: number }>;
} {
  const counts = { excellent: 0, good: 0, adequate: 0, poor: 0, critical: 0 };
  let totalScore = 0;
  const flagCounts = new Map<RationaleFlag, number>();

  for (const r of results) {
    counts[r.status]++;
    totalScore += r.qualityScore;
    for (const f of r.flags) {
      flagCounts.set(f, (flagCounts.get(f) ?? 0) + 1);
    }
  }

  const topFlags = [...flagCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([flag, count]) => ({ flag, count }));

  return {
    total: results.length,
    ...counts,
    avgScore: results.length > 0 ? Math.round(totalScore / results.length) : 0,
    topFlags,
  };
}
