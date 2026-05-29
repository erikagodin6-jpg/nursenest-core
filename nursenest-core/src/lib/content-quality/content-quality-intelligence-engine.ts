import {
  auditContentScope,
  type ContentScopeAuditItem,
  type ContentScopeFinding,
  type ContentScopeSurface,
} from "@/lib/content-scope/content-scope-auditor";
import {
  collectGenericContentPatternIds,
  scoreQuestionContentQuality,
  type ContentQualityInput,
} from "@/lib/questions/content-quality-score";

export type ContentIntelligencePathway =
  | "RN"
  | "RPN"
  | "NP"
  | "RT"
  | "Allied"
  | "NewGrad"
  | "ECGCore"
  | "ECGAdvanced"
  | "HESI"
  | "TEAS"
  | "Future";

export type UniversalContentType =
  | "question"
  | "flashcard"
  | "lesson"
  | "clinical_skill"
  | "pharmacology"
  | "ecg"
  | "simulation"
  | "cat"
  | "loft"
  | "study_plan"
  | "remediation";

export type ScopeClassification =
  | "Entry-Level RPN"
  | "Entry-Level RN"
  | "Entry-Level NP"
  | "RT"
  | "New Grad"
  | "Specialty ICU"
  | "Emergency"
  | "Critical Care"
  | "Advanced Practice"
  | "Allied"
  | "Unknown";

export type ContentQualityBand = "Excellent" | "Good" | "Needs Review" | "Poor" | "Critical";
export type ReviewQueuePriority = "Critical" | "High" | "Medium" | "Low";

export type ContentPerformanceMetrics = {
  correctAnswerRate?: number | null;
  againRate?: number | null;
  hardRate?: number | null;
  goodRate?: number | null;
  easyRate?: number | null;
  confidenceAverage?: number | null;
  completionRate?: number | null;
  abandonmentRate?: number | null;
  remediationUsageRate?: number | null;
  reportCount?: number | null;
};

export type UniversalContentObject = {
  id: string;
  contentType: UniversalContentType;
  pathway: ContentIntelligencePathway | string;
  tier?: string | null;
  topic?: string | null;
  subtopic?: string | null;
  difficulty?: string | null;
  author?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  lastReviewedAt?: string | null;
  title?: string | null;
  body?: string | null;
  stem?: string | null;
  rationale?: string | null;
  distractorRationales?: string[] | null;
  clinicalPearl?: string | null;
  examTip?: string | null;
  memoryHook?: string | null;
  siConvExplanation?: string | null;
  references?: string[] | null;
  tags?: string[];
  exam?: string | null;
  country?: string | null;
  metrics?: ContentPerformanceMetrics;
};

export type ContentIntelligenceItemScore = {
  id: string;
  contentType: UniversalContentType;
  pathway: string;
  topic: string;
  qualityScore: number;
  qualityBand: ContentQualityBand;
  rationaleQualityScore: number;
  scopeAlignmentScore: number;
  referenceQualityScore: number;
  freshnessScore: number;
  contentDepthScore: number;
  scopeClassifications: ScopeClassification[];
  curriculumTargets: string[];
  flags: string[];
  scopeFindings: ContentScopeFinding[];
};

export type ContentReviewQueueItem = {
  itemId: string;
  priority: ReviewQueuePriority;
  reason: string;
  pathway: string;
  topic: string;
  contentType: UniversalContentType;
  qualityScore: number;
};

export type ContentQualityIntelligenceReport = {
  generatedAt: string;
  totalItems: number;
  overallQualityScore: number;
  byPathway: Record<string, { count: number; averageScore: number; critical: number; needsReview: number }>;
  byTopic: Record<string, { count: number; averageScore: number }>;
  byContentType: Record<string, { count: number; averageScore: number }>;
  reviewQueues: Record<ReviewQueuePriority, ContentReviewQueueItem[]>;
  scopeAlignmentScore: number;
  curriculumCoverage: Record<string, { contentCount: number; topics: string[] }>;
  items: ContentIntelligenceItemScore[];
};

const CURRICULUM_TARGETS: Array<{ target: string; markers: string[] }> = [
  { target: "NCLEX", markers: ["nclex", "rn", "clinical judgment", "ngn"] },
  { target: "REx-PN", markers: ["rex-pn", "rpn", "lpn", "entry-to-practice"] },
  { target: "CNPLE", markers: ["cnple", "np", "diagnostic", "prescribing", "loft"] },
  { target: "HESI", markers: ["hesi", "a2", "anatomy", "grammar", "vocabulary"] },
  { target: "TEAS", markers: ["teas", "reading", "math", "science", "english"] },
  { target: "RT competencies", markers: ["rt", "respiratory", "ventilator", "abg", "airway"] },
  { target: "New Grad competencies", markers: ["new grad", "orientation", "shift", "handoff", "telemetry"] },
];

function clamp(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function words(text: string | null | undefined): number {
  const clean = String(text ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return clean ? clean.split(/\s+/).length : 0;
}

function blob(item: UniversalContentObject): string {
  return [
    item.pathway,
    item.tier,
    item.topic,
    item.subtopic,
    item.difficulty,
    item.title,
    item.body,
    item.stem,
    item.rationale,
    item.clinicalPearl,
    item.examTip,
    item.memoryHook,
    item.siConvExplanation,
    item.exam,
    item.country,
    ...(item.tags ?? []),
  ]
    .filter(Boolean)
    .join("\n")
    .toLowerCase();
}

function toScopeSurface(type: UniversalContentType): ContentScopeSurface {
  if (type === "flashcard") return "flashcard";
  if (type === "clinical_skill") return "clinical_skill";
  if (type === "pharmacology") return "pharmacology";
  if (type === "ecg") return "ecg";
  if (type === "simulation" || type === "loft") return "simulation";
  if (type === "question" || type === "cat") return "question";
  return "lesson";
}

function classifyScope(item: UniversalContentObject): ScopeClassification[] {
  const text = blob(item);
  const tier = String(item.tier ?? item.pathway).toLowerCase();
  const tags = (item.tags ?? []).join(" ").toLowerCase();
  const classifications = new Set<ScopeClassification>();

  if (tier.includes("rpn") || tier.includes("lpn")) classifications.add("Entry-Level RPN");
  if (tier === "rn" || tier.includes("nclex-rn")) classifications.add("Entry-Level RN");
  if (tier.includes("np") || text.includes("prescrib") || text.includes("diagnostic")) classifications.add("Entry-Level NP");
  if (tier.includes("rt") || text.includes("respiratory therapist") || text.includes("abg")) classifications.add("RT");
  if (tier.includes("new") || text.includes("new grad") || text.includes("orientation")) classifications.add("New Grad");
  if (text.includes("icu") || tags.includes("icu")) classifications.add("Specialty ICU");
  if (text.includes("emergency") || text.includes("trauma") || text.includes("rapid response")) classifications.add("Emergency");
  if (text.includes("critical care") || text.includes("vasopressor") || text.includes("shock")) classifications.add("Critical Care");
  if (text.includes("advanced practice") || text.includes("prescribe") || text.includes("differential diagnosis")) classifications.add("Advanced Practice");
  if (tier.includes("allied") || tier.includes("physio") || tier.includes("occupational") || tier.includes("paramedic")) classifications.add("Allied");

  return classifications.size > 0 ? [...classifications] : ["Unknown"];
}

function mapCurriculumTargets(item: UniversalContentObject): string[] {
  const text = blob(item);
  const targets = CURRICULUM_TARGETS.filter((target) => target.markers.some((marker) => text.includes(marker))).map((target) => target.target);
  return [...new Set(targets.length > 0 ? targets : [String(item.exam ?? item.pathway)])];
}

function scoreReferences(item: UniversalContentObject): number {
  const refs = item.references ?? [];
  if (refs.length === 0) return item.contentType === "lesson" || item.contentType === "pharmacology" || item.contentType === "ecg" ? 45 : 70;
  const highQuality = refs.filter((ref) => /\b(guideline|rnao|cno|aha|cdc|who|peer|journal|textbook|association|regulatory)\b/i.test(ref)).length;
  return clamp(72 + highQuality * 8 + Math.min(12, refs.length * 2));
}

function scoreFreshness(item: UniversalContentObject, now = new Date()): number {
  const date = item.lastReviewedAt ?? item.updatedAt ?? item.createdAt;
  if (!date) return 60;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return 60;
  const ageDays = Math.max(0, (now.getTime() - parsed.getTime()) / 86400000);
  if (ageDays <= 180) return 100;
  if (ageDays <= 365) return 86;
  if (ageDays <= 730) return 70;
  if (ageDays <= 1095) return 52;
  return 35;
}

function scoreDepth(item: UniversalContentObject): number {
  const totalWords =
    words(item.body) +
    words(item.stem) +
    words(item.rationale) +
    words(item.clinicalPearl) +
    words(item.examTip) +
    words(item.memoryHook) +
    (item.distractorRationales ?? []).reduce((sum, rationale) => sum + words(rationale), 0);
  const target = item.contentType === "lesson" ? 450 : item.contentType === "clinical_skill" ? 220 : 120;
  return clamp((totalWords / target) * 100);
}

function scorePerformance(metrics: ContentPerformanceMetrics | undefined): number {
  if (!metrics) return 80;
  let score = 82;
  if (metrics.abandonmentRate != null) score -= metrics.abandonmentRate * 45;
  if (metrics.reportCount != null) score -= Math.min(35, metrics.reportCount * 8);
  if (metrics.correctAnswerRate != null && (metrics.correctAnswerRate < 0.25 || metrics.correctAnswerRate > 0.96)) score -= 14;
  if (metrics.againRate != null) score -= metrics.againRate * 30;
  if (metrics.hardRate != null) score -= metrics.hardRate * 18;
  if (metrics.completionRate != null) score += metrics.completionRate * 12;
  return clamp(score);
}

function band(score: number): ContentQualityBand {
  if (score >= 90) return "Excellent";
  if (score >= 78) return "Good";
  if (score >= 65) return "Needs Review";
  if (score >= 50) return "Poor";
  return "Critical";
}

function queuePriority(score: ContentIntelligenceItemScore): ReviewQueuePriority | null {
  if (score.qualityScore < 50 || score.scopeFindings.some((finding) => finding.severity === "critical")) return "Critical";
  if (score.qualityScore < 65 || score.flags.includes("scope_leakage")) return "High";
  if (score.qualityScore < 78 || score.flags.length > 0) return "Medium";
  if (score.qualityScore < 90) return "Low";
  return null;
}

export function scoreContentIntelligenceItem(item: UniversalContentObject, now = new Date()): ContentIntelligenceItemScore {
  const qualityInput: ContentQualityInput = {
    id: item.id,
    itemType: item.contentType,
    pathway: item.pathway,
    tier: item.tier,
    stem: item.stem ?? item.title ?? item.body,
    rationale: item.rationale,
    distractorRationales: item.distractorRationales,
    clinicalPearl: item.clinicalPearl,
    examTip: item.examTip,
    memoryHook: item.memoryHook,
    siConvExplanation: item.siConvExplanation,
  };
  const rationaleQuality = scoreQuestionContentQuality(qualityInput);
  const scopeAuditItem: ContentScopeAuditItem = {
    id: item.id,
    surface: toScopeSurface(item.contentType),
    title: item.title ?? item.stem ?? item.id,
    body: [item.body, item.stem, item.rationale, item.clinicalPearl, item.examTip, item.siConvExplanation].filter(Boolean).join("\n"),
    tier: item.tier ?? item.pathway,
    exam: item.exam,
    country: item.country,
    careerType: item.pathway,
    pathwayId: item.pathway,
    topic: item.topic,
    tags: item.tags,
  };
  const scopeFindings = auditContentScope(scopeAuditItem);
  const scopePenalty = scopeFindings.reduce((sum, finding) => sum + (finding.severity === "critical" ? 30 : finding.severity === "high" ? 18 : finding.severity === "medium" ? 10 : 4), 0);
  const scopeAlignmentScore = clamp(100 - scopePenalty);
  const referenceQualityScore = scoreReferences(item);
  const freshnessScore = scoreFreshness(item, now);
  const contentDepthScore = scoreDepth(item);
  const performanceScore = scorePerformance(item.metrics);
  const genericHits = collectGenericContentPatternIds([item.rationale, item.clinicalPearl, item.examTip, item.memoryHook, item.siConvExplanation].filter(Boolean).join(" "));
  const flags = [
    ...genericHits.map((hit) => `generic_${hit}`),
    ...(scopeFindings.length > 0 ? ["scope_leakage"] : []),
    ...(referenceQualityScore < 60 ? ["missing_or_weak_references"] : []),
    ...(freshnessScore < 55 ? ["freshness_review_required"] : []),
    ...(contentDepthScore < 55 ? ["thin_content"] : []),
  ];
  const rawQualityScore = clamp(
    rationaleQuality.score * 0.24 +
      scopeAlignmentScore * 0.18 +
      referenceQualityScore * 0.13 +
      freshnessScore * 0.12 +
      contentDepthScore * 0.18 +
      performanceScore * 0.15,
  );
  const hasCriticalScopeFinding = scopeFindings.some((finding) => finding.severity === "critical");
  const hasCriticalGenericLanguage = genericHits.some((hit) => ["responds_priority_cue", "clinical_reasoning_is", "not_best_answer", "less_appropriate", "not_priority", "no_rationale"].includes(hit));
  const qualityScore = hasCriticalScopeFinding || hasCriticalGenericLanguage ? Math.min(rawQualityScore, 49) : rawQualityScore;

  return {
    id: item.id,
    contentType: item.contentType,
    pathway: String(item.pathway),
    topic: item.topic ?? "Unmapped",
    qualityScore,
    qualityBand: band(qualityScore),
    rationaleQualityScore: rationaleQuality.score,
    scopeAlignmentScore,
    referenceQualityScore,
    freshnessScore,
    contentDepthScore,
    scopeClassifications: classifyScope(item),
    curriculumTargets: mapCurriculumTargets(item),
    flags: [...new Set(flags)],
    scopeFindings,
  };
}

function average(values: number[]): number {
  return values.length > 0 ? Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 10) / 10 : 0;
}

export function buildContentQualityIntelligenceReport(
  items: UniversalContentObject[],
  generatedAt = new Date().toISOString(),
): ContentQualityIntelligenceReport {
  const now = new Date(generatedAt);
  const scored = items.map((item) => scoreContentIntelligenceItem(item, now));
  const byPathway: ContentQualityIntelligenceReport["byPathway"] = {};
  const byTopic: ContentQualityIntelligenceReport["byTopic"] = {};
  const byContentType: ContentQualityIntelligenceReport["byContentType"] = {};
  const curriculumCoverage: ContentQualityIntelligenceReport["curriculumCoverage"] = {};
  const reviewQueues: ContentQualityIntelligenceReport["reviewQueues"] = { Critical: [], High: [], Medium: [], Low: [] };

  for (const item of scored) {
    const pathway = (byPathway[item.pathway] ??= { count: 0, averageScore: 0, critical: 0, needsReview: 0 });
    pathway.count += 1;
    if (item.qualityBand === "Critical" || item.qualityBand === "Poor") pathway.critical += 1;
    if (item.qualityBand === "Needs Review") pathway.needsReview += 1;

    const topic = (byTopic[item.topic] ??= { count: 0, averageScore: 0 });
    topic.count += 1;

    const type = (byContentType[item.contentType] ??= { count: 0, averageScore: 0 });
    type.count += 1;

    for (const target of item.curriculumTargets) {
      const coverage = (curriculumCoverage[target] ??= { contentCount: 0, topics: [] });
      coverage.contentCount += 1;
      coverage.topics = [...new Set([...coverage.topics, item.topic])].sort();
    }

    const priority = queuePriority(item);
    if (priority) {
      reviewQueues[priority].push({
        itemId: item.id,
        priority,
        reason: item.flags[0] ?? `${item.qualityBand} quality score`,
        pathway: item.pathway,
        topic: item.topic,
        contentType: item.contentType,
        qualityScore: item.qualityScore,
      });
    }
  }

  for (const [pathway, summary] of Object.entries(byPathway)) {
    byPathway[pathway] = { ...summary, averageScore: average(scored.filter((item) => item.pathway === pathway).map((item) => item.qualityScore)) };
  }
  for (const [topic, summary] of Object.entries(byTopic)) {
    byTopic[topic] = { ...summary, averageScore: average(scored.filter((item) => item.topic === topic).map((item) => item.qualityScore)) };
  }
  for (const [type, summary] of Object.entries(byContentType)) {
    byContentType[type] = { ...summary, averageScore: average(scored.filter((item) => item.contentType === type).map((item) => item.qualityScore)) };
  }

  for (const queue of Object.values(reviewQueues)) {
    queue.sort((a, b) => a.qualityScore - b.qualityScore);
  }

  return {
    generatedAt,
    totalItems: scored.length,
    overallQualityScore: average(scored.map((item) => item.qualityScore)),
    byPathway,
    byTopic,
    byContentType,
    reviewQueues,
    scopeAlignmentScore: average(scored.map((item) => item.scopeAlignmentScore)),
    curriculumCoverage,
    items: scored,
  };
}
