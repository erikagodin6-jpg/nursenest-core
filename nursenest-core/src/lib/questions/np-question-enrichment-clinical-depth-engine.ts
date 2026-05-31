import {
  auditQuestionEnrichment,
  summarizeQuestionEnrichment,
  type QuestionEnrichmentAuditResult,
  type QuestionEnrichmentAuditRow,
  type QuestionEnrichmentMissingField,
} from "./question-enrichment-governance";

export type NpQuestionPathway = "CNPLE" | "FNP" | "AGPCNP" | "PMHNP" | "PNP-PC" | "WHNP" | "ENP";

export type NpClinicalDepthGap =
  | "diagnostic_reasoning"
  | "differential_diagnosis"
  | "guideline_based_management"
  | "prescribing_relevance"
  | "follow_up_planning"
  | "advanced_clinical_judgment"
  | "advanced_rationale"
  | "diagnostic_explanation"
  | "clinical_pearl"
  | "memory_anchor"
  | "flashcard_output"
  | "blueprint_mapping";

export type NpQuestionClinicalDepthScores = {
  readonly diagnosticReasoning: number;
  readonly differentialDiagnosis: number;
  readonly guidelineManagement: number;
  readonly prescribingRelevance: number;
  readonly followUpPlanning: number;
  readonly clinicalJudgment: number;
  readonly npDepthScore: number;
};

export type NpClinicalDepthRemediationDraft = {
  readonly diagnosticExplanationDraft?: string;
  readonly differentialDiagnosisDraft?: string;
  readonly guidelineManagementDraft?: string;
  readonly prescribingRelevanceDraft?: string;
  readonly followUpPlanDraft?: string;
  readonly advancedClinicalJudgmentDraft?: string;
  readonly advancedRationaleDraft?: string;
  readonly clinicalPearlDraft?: string;
  readonly memoryAnchorDraft?: string;
  readonly flashcardOutputDraft?: {
    readonly front: string;
    readonly back: string;
    readonly clinicalPearl: string;
    readonly memoryAnchor: string;
    readonly examRelevance: string;
  };
  readonly publishable: false;
};

export type NpQuestionClinicalDepthAuditResult = QuestionEnrichmentAuditResult & {
  readonly npPathways: readonly NpQuestionPathway[];
  readonly clinicalDepthGaps: readonly NpClinicalDepthGap[];
  readonly clinicalDepthScores: NpQuestionClinicalDepthScores;
  readonly npPublicationBlocked: boolean;
  readonly npRemediationDraft: NpClinicalDepthRemediationDraft;
};

export type NpQuestionClinicalDepthDashboard = {
  readonly totalNpQuestions: number;
  readonly diagnosticReasoningCoverage: number;
  readonly differentialDiagnosisCoverage: number;
  readonly prescribingCoverage: number;
  readonly guidelineManagementCoverage: number;
  readonly followUpPlanningCoverage: number;
  readonly blueprintCoverage: number;
  readonly publicationReadinessPercent: number;
  readonly monetizationReadinessPercent: number;
  readonly byPathway: Record<NpQuestionPathway, { total: number; publicationReady: number; monetizationReady: number; averageDepthScore: number }>;
  readonly remediationPlan: readonly string[];
};

const NP_PATHWAYS: readonly NpQuestionPathway[] = ["CNPLE", "FNP", "AGPCNP", "PMHNP", "PNP-PC", "WHNP", "ENP"] as const;

function plain(value: unknown): string {
  return String(value ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function pct(part: number, whole: number): number {
  return whole > 0 ? Number(((part / whole) * 100).toFixed(1)) : 0;
}

function average(values: readonly number[]): number {
  return values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : 0;
}

function normalizedSearchText(row: QuestionEnrichmentAuditRow): string {
  return [
    row.id,
    row.exam,
    row.tier,
    row.questionType,
    row.stem,
    row.rationale,
    row.correctAnswerExplanation,
    row.clinicalReasoning,
    row.clinicalPearl,
    row.examStrategy,
    row.clinicalTrap,
    row.keyTakeaway,
    row.bodySystem,
    row.topic,
    row.subtopic,
    row.nclexClientNeedsCategory,
    row.nclexClientNeedsSubcategory,
    ...(row.tags ?? []),
  ]
    .map(plain)
    .join(" ")
    .toLowerCase();
}

export function classifyNpQuestionPathways(row: QuestionEnrichmentAuditRow): readonly NpQuestionPathway[] {
  const text = normalizedSearchText(row).replace(/pnp_pc/g, "pnp-pc");
  const exam = plain(row.exam).toUpperCase().replace(/_/g, "-");
  if (exam === "CNPLE") return ["CNPLE"];
  if (exam === "FNP" || exam === "AANP-FNP" || exam === "ANCC-FNP") return ["FNP"];
  if (exam === "AGPCNP" || exam === "ANCC-AGPCNP" || exam === "AGNP") return ["AGPCNP"];
  if (exam === "PMHNP") return ["PMHNP"];
  if (exam === "PNP-PC" || exam === "PEDIATRIC-PC-NP") return ["PNP-PC"];
  if (exam === "WHNP" || exam === "WOMENS-HEALTH-NP") return ["WHNP"];
  if (exam === "ENP") return ["ENP"];

  const pathways = new Set<NpQuestionPathway>();

  if (/\bcnple\b|canadian np|canada np|np licensure/.test(text)) pathways.add("CNPLE");
  if (/\bfnp\b|family nurse practitioner|family np|aanp-fnp|ancc-fnp/.test(text)) pathways.add("FNP");
  if (/\bagpcnp\b|adult gerontology|adult-gerontology|agpcnp/.test(text)) pathways.add("AGPCNP");
  if (/\bpmhnp\b|psychiatric mental health|psych mental health/.test(text)) pathways.add("PMHNP");
  if (/\bpnp-pc\b|pediatric primary care|paediatric primary care|pediatric np/.test(text)) pathways.add("PNP-PC");
  if (/\bwhnp\b|women.?s health np|reproductive health np/.test(text)) pathways.add("WHNP");
  if (/\benp\b|emergency nurse practitioner|emergency np/.test(text)) pathways.add("ENP");
  if (/\bnp\b|nurse practitioner|advanced practice|prescrib/.test(text) && pathways.size === 0) pathways.add("FNP");

  return NP_PATHWAYS.filter((pathway) => pathways.has(pathway));
}

export function isNpQuestion(row: QuestionEnrichmentAuditRow): boolean {
  if (classifyNpQuestionPathways(row).length > 0) return true;
  const text = normalizedSearchText(row);
  return /\bnp\b|nurse practitioner|advanced practice|prescrib|differential diagnosis|diagnostic reasoning/.test(text);
}

function hasAny(text: string, patterns: readonly RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(text));
}

function scoreSignal(text: string, patterns: readonly RegExp[]): number {
  const hits = patterns.filter((pattern) => pattern.test(text)).length;
  if (hits >= 2) return 100;
  if (hits === 1) return 85;
  return 40;
}

function clinicalDepthScores(row: QuestionEnrichmentAuditRow): NpQuestionClinicalDepthScores {
  const text = normalizedSearchText(row);
  const scores = {
    diagnosticReasoning: scoreSignal(text, [/\bdiagnos|diagnostic|workup|assessment finding|clinical reasoning/, /\blab|imaging|ecg|spirometry|screening|test/]),
    differentialDiagnosis: scoreSignal(text, [/\bdifferential|distinguish|differentiate|rule out|competing/, /\bred flag|life.?threat|mimic|alternative/]),
    guidelineManagement: scoreSignal(text, [/\bguideline|evidence|canmat|kdigo|diabetes canada|hypertension canada|cdc|aanp|ancc|cps|standard/, /\bmanagement|treatment|therapy|care plan/]),
    prescribingRelevance: scoreSignal(text, [/\bprescrib|medication|dose|contraindication|interaction|adverse|pharmacologic/, /\bmonitor|renal|hepatic|pregnancy|allergy|controlled/]),
    followUpPlanning: scoreSignal(text, [/\bfollow.?up|monitoring|reassess|return precautions|interval|longitudinal/, /\bweeks?|months?|repeat|trend|surveillance/]),
    clinicalJudgment: scoreSignal(text, [/\bclinical judgment|priorit|safety|escalat|red flag|risk/, /\bpatient|client|scenario|case|trajectory/]),
    npDepthScore: 0,
  };
  scores.npDepthScore = average([
    scores.diagnosticReasoning,
    scores.differentialDiagnosis,
    scores.guidelineManagement,
    scores.prescribingRelevance,
    scores.followUpPlanning,
    scores.clinicalJudgment,
  ]);
  return scores;
}

function clinicalDepthGaps(row: QuestionEnrichmentAuditRow, base: QuestionEnrichmentAuditResult, scores: NpQuestionClinicalDepthScores): readonly NpClinicalDepthGap[] {
  const gaps: NpClinicalDepthGap[] = [];
  const missing = new Set<QuestionEnrichmentMissingField>(base.missingFields);
  const text = normalizedSearchText(row);
  const explanationWords = [row.rationale, row.correctAnswerExplanation, row.clinicalReasoning, row.examStrategy]
    .map(plain)
    .filter(Boolean)
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;

  if (scores.diagnosticReasoning < 90) gaps.push("diagnostic_reasoning");
  if (scores.differentialDiagnosis < 90) gaps.push("differential_diagnosis");
  if (scores.guidelineManagement < 90) gaps.push("guideline_based_management");
  if (scores.prescribingRelevance < 90) gaps.push("prescribing_relevance");
  if (scores.followUpPlanning < 90) gaps.push("follow_up_planning");
  if (scores.clinicalJudgment < 90) gaps.push("advanced_clinical_judgment");
  if (missing.has("correct_rationale") || explanationWords < 100) gaps.push("advanced_rationale");
  if (!hasAny(text, [/\bdiagnos|diagnostic|workup|labs?|imaging|ecg|differential/])) gaps.push("diagnostic_explanation");
  if (missing.has("clinical_pearl")) gaps.push("clinical_pearl");
  if (missing.has("memory_anchor")) gaps.push("memory_anchor");
  if (missing.has("flashcard_output")) gaps.push("flashcard_output");
  if (missing.has("blueprint_mapping")) gaps.push("blueprint_mapping");

  return gaps;
}

function buildRemediationDraft(row: QuestionEnrichmentAuditRow, gaps: readonly NpClinicalDepthGap[]): NpClinicalDepthRemediationDraft {
  const topic = plain(row.topic) || plain(row.subtopic) || "the NP decision";
  const stem = plain(row.stem);
  const exam = plain(row.exam) || "NP certification";
  const pearl = plain(row.clinicalPearl) || `${topic}: NP-level items should connect diagnosis, risk, management, and follow-up rather than stopping at recognition.`;
  const memoryAnchor = plain(row.memoryHook || row.mnemonic) || `${topic}: diagnose, differentiate, manage, monitor.`;

  return {
    diagnosticExplanationDraft: gaps.includes("diagnostic_explanation") || gaps.includes("diagnostic_reasoning")
      ? `Draft for review: Explain which findings support ${topic}, which findings would change urgency, and which diagnostic test or assessment step discriminates the most important competing diagnoses.`
      : undefined,
    differentialDiagnosisDraft: gaps.includes("differential_diagnosis")
      ? `Draft for review: Add a focused differential for ${topic}, including at least one dangerous alternative diagnosis and one cue that makes it more or less likely.`
      : undefined,
    guidelineManagementDraft: gaps.includes("guideline_based_management")
      ? "Draft for review: Tie the management choice to an applicable guideline, standard, or evidence-based care pathway without making unsupported official-exam claims."
      : undefined,
    prescribingRelevanceDraft: gaps.includes("prescribing_relevance")
      ? "Draft for review: Add prescribing safety considerations such as contraindications, interactions, renal/hepatic function, pregnancy/lactation status, monitoring, and patient education."
      : undefined,
    followUpPlanDraft: gaps.includes("follow_up_planning")
      ? "Draft for review: Specify monitoring parameters, reassessment interval, red flags, and when escalation or referral is required."
      : undefined,
    advancedClinicalJudgmentDraft: gaps.includes("advanced_clinical_judgment")
      ? "Draft for review: Explain how the NP prioritizes risk, chooses among reasonable options, and avoids RN-level recognition-only reasoning."
      : undefined,
    advancedRationaleDraft: gaps.includes("advanced_rationale")
      ? "Draft for review: Expand the rationale to include diagnosis, differential, management rationale, prescribing or nonprescribing safety, follow-up, and why each distractor is tempting but incorrect."
      : undefined,
    clinicalPearlDraft: gaps.includes("clinical_pearl") ? pearl : undefined,
    memoryAnchorDraft: gaps.includes("memory_anchor") ? memoryAnchor : undefined,
    flashcardOutputDraft: gaps.includes("flashcard_output")
      ? {
          front: `What NP-level decision framework applies to this scenario? ${stem}`,
          back: `Answer with diagnosis/differential, management, prescribing safety when relevant, and follow-up. Topic: ${topic}.`,
          clinicalPearl: pearl,
          memoryAnchor,
          examRelevance: `${exam} / ${topic}`,
        }
      : undefined,
    publishable: false,
  };
}

export function auditNpQuestionClinicalDepth(row: QuestionEnrichmentAuditRow): NpQuestionClinicalDepthAuditResult | null {
  if (!isNpQuestion(row)) return null;
  const base = auditQuestionEnrichment(row);
  const scores = clinicalDepthScores(row);
  const gaps = clinicalDepthGaps(row, base, scores);

  const npPublicationBlocked =
    gaps.length > 0 ||
    !base.publicationReady ||
    !base.flashcardReady ||
    !base.practiceExamReady ||
    !base.adaptiveLearningReady ||
    scores.npDepthScore < 90;

  return {
    ...base,
    pathwayGroup: "NP",
    npPathways: classifyNpQuestionPathways(row),
    clinicalDepthGaps: gaps,
    clinicalDepthScores: scores,
    npPublicationBlocked,
    npRemediationDraft: buildRemediationDraft(row, gaps),
  };
}

export function auditNpQuestionClinicalDepthBatch(rows: readonly QuestionEnrichmentAuditRow[]): readonly NpQuestionClinicalDepthAuditResult[] {
  return rows.map(auditNpQuestionClinicalDepth).filter((result): result is NpQuestionClinicalDepthAuditResult => Boolean(result));
}

export function buildNpReadinessDashboard(results: readonly NpQuestionClinicalDepthAuditResult[]): NpQuestionClinicalDepthDashboard {
  const byPathway = Object.fromEntries(
    NP_PATHWAYS.map((pathway) => {
      const rows = results.filter((result) => result.npPathways.includes(pathway));
      return [
        pathway,
        {
          total: rows.length,
          publicationReady: rows.filter((result) => !result.npPublicationBlocked).length,
          monetizationReady: rows.filter((result) => result.monetizationReady && !result.npPublicationBlocked).length,
          averageDepthScore: average(rows.map((result) => result.clinicalDepthScores.npDepthScore)),
        },
      ];
    }),
  ) as NpQuestionClinicalDepthDashboard["byPathway"];

  return {
    totalNpQuestions: results.length,
    diagnosticReasoningCoverage: pct(results.filter((result) => !result.clinicalDepthGaps.includes("diagnostic_reasoning")).length, results.length),
    differentialDiagnosisCoverage: pct(results.filter((result) => !result.clinicalDepthGaps.includes("differential_diagnosis")).length, results.length),
    prescribingCoverage: pct(results.filter((result) => !result.clinicalDepthGaps.includes("prescribing_relevance")).length, results.length),
    guidelineManagementCoverage: pct(results.filter((result) => !result.clinicalDepthGaps.includes("guideline_based_management")).length, results.length),
    followUpPlanningCoverage: pct(results.filter((result) => !result.clinicalDepthGaps.includes("follow_up_planning")).length, results.length),
    blueprintCoverage: pct(results.filter((result) => !result.clinicalDepthGaps.includes("blueprint_mapping")).length, results.length),
    publicationReadinessPercent: pct(results.filter((result) => !result.npPublicationBlocked).length, results.length),
    monetizationReadinessPercent: pct(results.filter((result) => result.monetizationReady && !result.npPublicationBlocked).length, results.length),
    byPathway,
    remediationPlan: [
      "Block NP questions that are RN-level recognition items without diagnosis, differential, management, and follow-up reasoning.",
      "Expand weak items with diagnostic explanation, differential diagnosis, guideline-based management, prescribing relevance, and monitoring plans.",
      "Prioritize prescribing-safety and diagnostic-reasoning gaps before flashcard-only cleanup.",
      "Promote NP items only after advanced rationale, blueprint mapping, flashcard output, adaptive readiness, and monetization readiness all pass.",
    ],
  };
}
