import { pool } from "./storage";
import { getMemoryLevel } from "./memory-monitor";

export interface AssemblyConfig {
  templateId: string;
  examCode: string;
  questionCount: number;
  timeLimitMinutes: number;
  domainWeights: { domain: string; weight: number }[];
  difficultyDistribution: { foundational: number; moderate: number; difficult: number };
  formatMix: { mcqSingle: number; selectAllThatApply: number; scenarioBased: number; prioritization: number; delegation: number };
  passingStandard: number;
  seed: number;
  tier: string;
  bodySystems?: string[];
}

export interface AssembledQuestion {
  id: string;
  stem: string;
  options: string[];
  correctAnswer: number;
  rationale: string;
  domain: string;
  topic: string;
  subtopic: string;
  difficulty: number;
  questionType: string;
}

export interface ScoreReport {
  overallScore: number;
  totalCorrect: number;
  totalQuestions: number;
  passingStandard: number;
  passed: boolean;
  domainBreakdown: {
    domain: string;
    correct: number;
    total: number;
    percentage: number;
    targetWeight: number;
    status: "above" | "near" | "below";
  }[];
  timeAnalysis: {
    totalTimeSeconds: number;
    avgTimePerQuestion: number;
    fastestQuestion: number;
    slowestQuestion: number;
    questionsUnderPace: number;
    questionsOverPace: number;
    idealPaceSeconds: number;
  };
  weakAreas: {
    domain: string;
    accuracy: number;
    questionsAttempted: number;
    recommendation: string;
  }[];
  difficultyBreakdown: {
    level: string;
    correct: number;
    total: number;
    percentage: number;
  }[];
  formatBreakdown: {
    format: string;
    correct: number;
    total: number;
    percentage: number;
  }[];
  readinessIndicator: "exam_ready" | "almost_ready" | "developing" | "early_preparation";
  readinessScore: number;
}

function getDifficultyBucket(d: number): "foundational" | "moderate" | "difficult" {
  if (d <= 2) return "foundational";
  if (d <= 3) return "moderate";
  return "difficult";
}

function mapTierToBodySystemColumn(tier: string): string {
  if (tier === "rpn" || tier === "rn") return "body_system";
  return "body_system";
}

const BODY_SYSTEM_TO_DOMAIN_RN: Record<string, string> = {
  "Cardiovascular": "Physiological Adaptation",
  "Respiratory": "Physiological Adaptation",
  "Neurological": "Physiological Adaptation",
  "Gastrointestinal": "Physiological Adaptation",
  "Renal & Metabolic": "Physiological Adaptation",
  "Endocrine": "Physiological Adaptation",
  "Hematology & Oncology": "Pharmacological Therapies",
  "Musculoskeletal & Skin": "Reduction of Risk Potential",
  "Arrhythmias & ECG": "Physiological Adaptation",
  "Maternity & Obstetrics": "Health Promotion and Maintenance",
  "Women's Health & Reproductive": "Health Promotion and Maintenance",
  "Neonatal": "Health Promotion and Maintenance",
  "Pediatrics": "Health Promotion and Maintenance",
  "Psychiatry & Mental Health": "Psychosocial Integrity",
  "Pharmacology": "Pharmacological Therapies",
  "Clinical Procedures": "Reduction of Risk Potential",
  "Infectious Disease": "Safety and Infection Control",
  "Shock & Emergency": "Physiological Adaptation",
  "Safety & Forensic Nursing": "Safety and Infection Control",
  "Infection Control & Safety": "Safety and Infection Control",
  "Assessment Skills": "Reduction of Risk Potential",
  "Delegation & Prioritization": "Management of Care",
  "Clinical Scenarios & Prioritization": "Management of Care",
  "Med Math & Calculations": "Pharmacological Therapies",
  "Pre-Nursing Foundations": "Basic Care and Comfort",
  "Nursing Fundamentals": "Basic Care and Comfort",
  "Fluid & Electrolytes": "Physiological Adaptation",
};

const BODY_SYSTEM_TO_DOMAIN_RPN: Record<string, string> = {
  "Cardiovascular": "Foundations of Practice",
  "Respiratory": "Foundations of Practice",
  "Neurological": "Foundations of Practice",
  "Gastrointestinal": "Foundations of Practice",
  "Pharmacology": "Foundations of Practice",
  "Pediatrics": "Collaborative Practice",
  "Maternity": "Collaborative Practice",
  "Mental Health": "Collaborative Practice",
  "Safety & Ethics": "Professional Practice",
  "Infection Control": "Professional Practice",
  "Palliative & End of Life": "Ethical Practice",
  "Delegation & Prioritization": "Professional Practice",
};

const BODY_SYSTEM_TO_DOMAIN_NP: Record<string, string> = {
  "Cardiovascular": "Therapeutics",
  "Respiratory": "Therapeutics",
  "Neurological": "Diagnosis",
  "Gastrointestinal": "Diagnosis",
  "Endocrine": "Therapeutics",
  "Pharmacology": "Therapeutics",
  "Assessment Skills": "Health Assessment",
  "Pediatrics": "Health Assessment",
  "Women's Health & Reproductive": "Health Promotion & Disease Prevention",
  "Safety & Ethics": "Professional Role & Responsibility",
  "Delegation & Prioritization": "Professional Role & Responsibility",
};

const EXAM_CODE_TO_TIER_MAP: Record<string, string> = {
  "NCLEX-RN": "rn",
  "NCLEX-PN": "rpn",
  "REX-PN": "rpn",
  "AANP": "np",
  "AANP-FNP": "np",
  "ANCC": "np",
  "ANCC-FNP": "np",
  "AGNP": "np",
  "ACNP": "np",
  "AGPCNP": "np",
  "AGPCNP-AANP": "np",
  "AGPCNP-ANCC": "np",
  "AGACNP": "np",
  "PMHNP": "np",
  "PNP": "np",
  "WHNP": "np",
  "ENP": "np",
  "CNPE": "np",
};

function mapBodySystemToDomain(bodySystem: string, tier: string, examCode?: string): string {
  const resolvedTier = examCode ? (EXAM_CODE_TO_TIER_MAP[examCode] || tier) : tier;
  const map = resolvedTier === "np" ? BODY_SYSTEM_TO_DOMAIN_NP
    : resolvedTier === "rn" ? BODY_SYSTEM_TO_DOMAIN_RN
    : BODY_SYSTEM_TO_DOMAIN_RPN;
  return map[bodySystem] || Object.values(map)[0] || "General";
}

const QUESTION_TYPE_TO_FORMAT: Record<string, string> = {
  "MCQ_SINGLE": "mcqSingle",
  "MCQ_MULTI": "selectAllThatApply",
  "SATA": "selectAllThatApply",
  "SELECT_ALL_THAT_APPLY": "selectAllThatApply",
  "SCENARIO": "scenarioBased",
  "CASE_STUDY": "scenarioBased",
  "PRIORITIZATION": "prioritization",
  "ORDERING": "prioritization",
  "DRAG_DROP": "prioritization",
  "DELEGATION": "delegation",
  "HOTSPOT": "mcqSingle",
};

export async function assembleExam(config: AssemblyConfig): Promise<AssembledQuestion[]> {
  const { questionCount, domainWeights, difficultyDistribution, formatMix, tier, seed, examCode, bodySystems } = config;

  const tierFilter = tier === "np" ? "np" : tier === "rn" ? "rn" : "rpn";
  const MAX_POOL_SIZE = 1500;
  const memoryLevel = getMemoryLevel();
  let poolMultiplier = 5;
  if (memoryLevel === "critical") {
    poolMultiplier = 1.5;
  } else if (memoryLevel === "protection") {
    poolMultiplier = 2;
  } else if (memoryLevel === "warning") {
    poolMultiplier = 3;
  }
  const rawPoolSize = Math.ceil(questionCount * poolMultiplier);
  const poolSize = Math.min(rawPoolSize, MAX_POOL_SIZE);
  console.log(`[ExamAssembly] Pool sizing: questionCount=${questionCount} | multiplier=${poolMultiplier}x | memoryLevel=${memoryLevel} | poolSize=${poolSize} | tier=${tierFilter} | examCode=${examCode}`);
  if (poolMultiplier < 5) {
    console.warn(`[ExamAssembly] Memory-aware pool reduction: multiplier=${poolMultiplier}x (memoryLevel=${memoryLevel}), poolSize=${poolSize} (from default ${questionCount * 5})`);
  }
  if (rawPoolSize > MAX_POOL_SIZE) {
    console.warn(`[ExamAssembly] Pool size capped from ${rawPoolSize} to ${MAX_POOL_SIZE}`);
  }

  let bodySystemFilter = "";
  const params: any[] = [tierFilter, seed || Date.now().toString(), poolSize];
  if (bodySystems && bodySystems.length > 0) {
    const placeholders = bodySystems.map((_, i) => `$${i + 4}`).join(",");
    bodySystemFilter = `AND body_system IN (${placeholders})`;
    params.push(...bodySystems);
  }

  const result = await pool.query(
    `WITH candidate_ids AS (
       SELECT id FROM exam_questions
       WHERE tier = $1 AND status = 'published' ${bodySystemFilter}
       ORDER BY md5(id::text || $2::text)
       LIMIT $3
     )
     SELECT eq.id, eq.stem, eq.options, eq.correct_answer, eq.rationale, eq.body_system, eq.topic, eq.subtopic, eq.difficulty, eq.question_type
     FROM exam_questions eq
     JOIN candidate_ids c ON eq.id = c.id`,
    params
  );

  if (result.rows.length === 0) {
    return [];
  }

  const allQuestions = result.rows.map((r: any) => ({
    id: r.id,
    stem: r.stem,
    options: r.options || [],
    correctAnswer: Array.isArray(r.correct_answer) ? r.correct_answer[0] : (r.correct_answer || 0),
    rationale: r.rationale || "",
    bodySystem: r.body_system || "General",
    domain: mapBodySystemToDomain(r.body_system || "General", tier, examCode),
    topic: r.topic || r.body_system || "General",
    subtopic: r.subtopic || "",
    difficulty: r.difficulty || 3,
    questionType: r.question_type || "MCQ_SINGLE",
    formatCategory: QUESTION_TYPE_TO_FORMAT[r.question_type || "MCQ_SINGLE"] || "mcqSingle",
  }));

  const formatTargets: Record<string, number> = {};
  const formatKeys = Object.keys(formatMix) as (keyof typeof formatMix)[];
  for (const fk of formatKeys) {
    const target = Math.max(0, Math.round(questionCount * (formatMix[fk] || 0)));
    if (target > 0) formatTargets[fk] = target;
  }

  const domainBuckets: Record<string, typeof allQuestions> = {};
  for (const dw of domainWeights) {
    domainBuckets[dw.domain] = [];
  }
  const unmappedDomain = domainWeights[0]?.domain || "General";

  for (const q of allQuestions) {
    if (domainBuckets[q.domain]) {
      domainBuckets[q.domain].push(q);
    } else {
      if (!domainBuckets[unmappedDomain]) domainBuckets[unmappedDomain] = [];
      domainBuckets[unmappedDomain].push(q);
    }
  }

  const selected: typeof allQuestions = [];
  const usedIds = new Set<string>();
  const formatCounts: Record<string, number> = {};

  const scoreQuestion = (q: typeof allQuestions[0], targetDiff: string, formatKey: string): number => {
    let score = 0;
    if (getDifficultyBucket(q.difficulty) === targetDiff) score += 2;
    if (q.formatCategory === formatKey && (formatCounts[formatKey] || 0) < (formatTargets[formatKey] || 0)) score += 3;
    return score;
  };

  for (const dw of domainWeights) {
    const targetCount = Math.max(1, Math.round(questionCount * dw.weight));
    const available = (domainBuckets[dw.domain] || []).filter(q => !usedIds.has(q.id));

    const foundTarget = Math.round(targetCount * difficultyDistribution.foundational);
    const modTarget = Math.round(targetCount * difficultyDistribution.moderate);
    const diffTarget = targetCount - foundTarget - modTarget;

    const diffSlots: string[] = [
      ...Array(foundTarget).fill("foundational"),
      ...Array(modTarget).fill("moderate"),
      ...Array(diffTarget).fill("difficult"),
    ];

    const underRepresentedFormat = (): string => {
      let bestFormat = "mcqSingle";
      let bestDeficit = -Infinity;
      for (const [fmt, target] of Object.entries(formatTargets)) {
        const deficit = target - (formatCounts[fmt] || 0);
        if (deficit > bestDeficit) { bestDeficit = deficit; bestFormat = fmt; }
      }
      return bestFormat;
    };

    for (const targetDiff of diffSlots) {
      if (selected.length >= questionCount) break;
      const wantedFormat = underRepresentedFormat();
      const remaining = available.filter(q => !usedIds.has(q.id));
      if (remaining.length === 0) break;

      remaining.sort((a, b) => scoreQuestion(b, targetDiff, wantedFormat) - scoreQuestion(a, targetDiff, wantedFormat));
      const pick = remaining[0];
      selected.push(pick);
      usedIds.add(pick.id);
      formatCounts[pick.formatCategory] = (formatCounts[pick.formatCategory] || 0) + 1;
    }
  }

  let deficit = questionCount - selected.length;
  if (deficit > 0) {
    const leftover = allQuestions.filter(q => !usedIds.has(q.id));
    leftover.sort((a, b) => {
      const wantedFormat = Object.entries(formatTargets)
        .sort(([, ta], [, tb]) => ((tb) - (formatCounts[Object.keys(formatTargets).find(k => tb === formatTargets[k])!] || 0)) - ((ta) - (formatCounts[Object.keys(formatTargets).find(k => ta === formatTargets[k])!] || 0)))
        .map(([k]) => k)[0] || "mcqSingle";
      return (b.formatCategory === wantedFormat ? 1 : 0) - (a.formatCategory === wantedFormat ? 1 : 0);
    });
    for (const q of leftover) {
      if (deficit <= 0) break;
      selected.push(q);
      usedIds.add(q.id);
      formatCounts[q.formatCategory] = (formatCounts[q.formatCategory] || 0) + 1;
      deficit--;
    }
  }

  const seededRng = createSeededRng(seed);
  for (let i = selected.length - 1; i > 0; i--) {
    const j = Math.floor(seededRng() * (i + 1));
    [selected[i], selected[j]] = [selected[j], selected[i]];
  }

  return selected.slice(0, questionCount).map(q => ({
    id: q.id,
    stem: q.stem,
    options: q.options,
    correctAnswer: q.correctAnswer,
    rationale: q.rationale,
    domain: q.domain,
    topic: q.topic,
    subtopic: q.subtopic,
    difficulty: q.difficulty,
    questionType: q.questionType,
  }));
}

function createSeededRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

export function computeScoreReport(
  questions: AssembledQuestion[],
  answers: Record<string, { selectedIndex: number; timeSpent: number }>,
  config: AssemblyConfig
): ScoreReport {
  let totalCorrect = 0;
  const domainStats: Record<string, { correct: number; total: number; targetWeight: number }> = {};
  const difficultyStats: Record<string, { correct: number; total: number }> = {};
  const formatStats: Record<string, { correct: number; total: number }> = {};
  const timings: number[] = [];

  for (const dw of config.domainWeights) {
    domainStats[dw.domain] = { correct: 0, total: 0, targetWeight: dw.weight };
  }

  for (const q of questions) {
    const ans = answers[q.id];
    const isCorrect = ans && ans.selectedIndex === q.correctAnswer;
    if (isCorrect) totalCorrect++;

    if (!domainStats[q.domain]) {
      domainStats[q.domain] = { correct: 0, total: 0, targetWeight: 0 };
    }
    domainStats[q.domain].total++;
    if (isCorrect) domainStats[q.domain].correct++;

    const diffLabel = getDifficultyBucket(q.difficulty);
    if (!difficultyStats[diffLabel]) difficultyStats[diffLabel] = { correct: 0, total: 0 };
    difficultyStats[diffLabel].total++;
    if (isCorrect) difficultyStats[diffLabel].correct++;

    const fmtLabel = q.questionType || "MCQ_SINGLE";
    if (!formatStats[fmtLabel]) formatStats[fmtLabel] = { correct: 0, total: 0 };
    formatStats[fmtLabel].total++;
    if (isCorrect) formatStats[fmtLabel].correct++;

    if (ans) {
      timings.push(ans.timeSpent || 0);
    }
  }

  const overallScore = questions.length > 0 ? Math.round((totalCorrect / questions.length) * 100) : 0;
  const passed = overallScore >= config.passingStandard;

  const domainBreakdown = Object.entries(domainStats).map(([domain, stats]) => {
    const percentage = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
    let status: "above" | "near" | "below" = "near";
    if (percentage >= config.passingStandard + 10) status = "above";
    else if (percentage < config.passingStandard - 10) status = "below";
    return {
      domain,
      correct: stats.correct,
      total: stats.total,
      percentage,
      targetWeight: stats.targetWeight,
      status,
    };
  });

  const totalTime = timings.reduce((s, t) => s + t, 0);
  const idealPace = (config.timeLimitMinutes * 60) / config.questionCount;
  const timeAnalysis = {
    totalTimeSeconds: totalTime,
    avgTimePerQuestion: timings.length > 0 ? Math.round(totalTime / timings.length) : 0,
    fastestQuestion: timings.length > 0 ? Math.min(...timings) : 0,
    slowestQuestion: timings.length > 0 ? Math.max(...timings) : 0,
    questionsUnderPace: timings.filter(t => t < idealPace).length,
    questionsOverPace: timings.filter(t => t > idealPace).length,
    idealPaceSeconds: Math.round(idealPace),
  };

  const weakAreas = domainBreakdown
    .filter(d => d.percentage < config.passingStandard)
    .sort((a, b) => a.percentage - b.percentage)
    .map(d => ({
      domain: d.domain,
      accuracy: d.percentage,
      questionsAttempted: d.total,
      recommendation: d.percentage < 40
        ? `Focus intensive review on ${d.domain}. Consider re-studying core concepts and practicing more questions in this area.`
        : `Review ${d.domain} concepts. You're close to passing — targeted practice should help close the gap.`,
    }));

  const difficultyBreakdown = Object.entries(difficultyStats).map(([level, stats]) => ({
    level,
    correct: stats.correct,
    total: stats.total,
    percentage: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
  }));

  const formatBreakdown = Object.entries(formatStats).map(([format, stats]) => ({
    format,
    correct: stats.correct,
    total: stats.total,
    percentage: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
  }));

  let readinessScore = overallScore;
  const weakPenalty = weakAreas.length * 3;
  readinessScore = Math.max(0, readinessScore - weakPenalty);

  let readinessIndicator: ScoreReport["readinessIndicator"];
  if (readinessScore >= 85) readinessIndicator = "exam_ready";
  else if (readinessScore >= 65) readinessIndicator = "almost_ready";
  else if (readinessScore >= 40) readinessIndicator = "developing";
  else readinessIndicator = "early_preparation";

  return {
    overallScore,
    totalCorrect,
    totalQuestions: questions.length,
    passingStandard: config.passingStandard,
    passed,
    domainBreakdown,
    timeAnalysis,
    weakAreas,
    difficultyBreakdown,
    formatBreakdown,
    readinessIndicator,
    readinessScore,
  };
}

export async function ensureMockExamTemplatesTable(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS mock_exam_templates (
      id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
      template_id TEXT NOT NULL UNIQUE,
      exam_code TEXT NOT NULL,
      exam_name TEXT NOT NULL,
      template_name TEXT NOT NULL,
      description TEXT,
      question_count INTEGER NOT NULL,
      time_limit_minutes INTEGER NOT NULL,
      difficulty_distribution JSONB NOT NULL,
      domain_weights JSONB NOT NULL,
      format_mix JSONB NOT NULL,
      passing_standard INTEGER DEFAULT 65,
      seed INTEGER DEFAULT 0,
      tier TEXT NOT NULL,
      active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL
    )
  `);
}
