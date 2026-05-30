import {
  auditContentScope,
  type ContentScopeAuditItem,
  type ContentScopeFinding,
  type ContentScopeSeverity,
  type ContentScopeSurface,
} from "@/lib/content-scope/content-scope-auditor";

export type ScopeAlignmentClassification =
  | "Entry-Level RPN"
  | "Entry-Level RN"
  | "Entry-Level NP"
  | "RT"
  | "Specialty ICU"
  | "Emergency"
  | "Critical Care"
  | "Advanced Practice";

export type ScopeAlignmentQueuePriority = "Critical" | "High" | "Medium" | "Low";

export type ScopeAlignmentScoredItem = {
  itemId: string;
  surface: ContentScopeSurface;
  pathway: string;
  topic: string;
  title: string;
  classifications: ScopeAlignmentClassification[];
  scopeAlignmentScore: number;
  findings: ContentScopeFinding[];
  flags: string[];
};

export type ScopeAlignmentSummary = {
  audited: number;
  flagged: number;
  averageScore: number;
  criticalFindings: number;
};

export type ScopeAlignmentReviewQueueItem = {
  itemId: string;
  priority: ScopeAlignmentQueuePriority;
  surface: ContentScopeSurface;
  pathway: string;
  topic: string;
  score: number;
  reason: string;
  evidence: string[];
  suggestedCorrection: string;
};

export type ScopeAlignmentIntelligenceReport = {
  generatedAt: string;
  totalItems: number;
  overallScore: number;
  byPathway: Record<string, ScopeAlignmentSummary>;
  byTopic: Record<string, ScopeAlignmentSummary>;
  byContentType: Record<ContentScopeSurface, ScopeAlignmentSummary>;
  reviewQueues: Record<ScopeAlignmentQueuePriority, ScopeAlignmentReviewQueueItem[]>;
  items: ScopeAlignmentScoredItem[];
};

const SURFACES: ContentScopeSurface[] = [
  "question",
  "lesson",
  "flashcard",
  "clinical_skill",
  "pharmacology",
  "ecg",
  "simulation",
];

const ICU_MARKERS = [
  "icu",
  "mechanical ventilation",
  "ventilator",
  "plateau pressure",
  "auto-peep",
  "prone ventilation",
  "vasopressor",
  "crrt",
  "ecmo",
  "iabp",
  "pulmonary artery catheter",
];

const EMERGENCY_MARKERS = [
  "emergency",
  "rapid response",
  "trauma",
  "stroke alert",
  "stemi",
  "sepsis",
  "shock",
  "anaphylaxis",
  "cardiac arrest",
];

const ADVANCED_PRACTICE_MARKERS = [
  "differential diagnosis",
  "prescribe",
  "diagnostic workup",
  "order ct",
  "order mri",
  "initiate antibiotic therapy",
  "advanced practice",
  "provider management",
];

function normalize(value: string | null | undefined): string {
  return String(value ?? "").trim().toLowerCase();
}

function display(value: string | null | undefined, fallback: string): string {
  const clean = String(value ?? "").trim();
  return clean || fallback;
}

function itemBlob(item: ContentScopeAuditItem): string {
  return [
    item.id,
    item.surface,
    item.title,
    item.body,
    item.tier,
    item.exam,
    item.country,
    item.careerType,
    item.pathwayId,
    item.topic,
    ...(item.tags ?? []),
  ]
    .filter(Boolean)
    .join("\n")
    .toLowerCase();
}

function includesAny(blob: string, markers: readonly string[]): boolean {
  return markers.some((marker) => blob.includes(marker));
}

function severityPenalty(severity: ContentScopeSeverity): number {
  switch (severity) {
    case "critical":
      return 36;
    case "high":
      return 22;
    case "medium":
      return 12;
    default:
      return 5;
  }
}

function severityPriority(severity: ContentScopeSeverity): ScopeAlignmentQueuePriority {
  switch (severity) {
    case "critical":
      return "Critical";
    case "high":
      return "High";
    case "medium":
      return "Medium";
    default:
      return "Low";
  }
}

function scoreAverage(values: number[]): number {
  if (values.length === 0) return 100;
  return Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 10) / 10;
}

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function classifyScopeAlignment(item: ContentScopeAuditItem): ScopeAlignmentClassification[] {
  const blob = itemBlob(item);
  const tier = normalize(item.tier);
  const pathway = normalize(item.pathwayId);
  const career = normalize(item.careerType);
  const exam = normalize(item.exam);
  const surface = item.surface;
  const classifications = new Set<ScopeAlignmentClassification>();

  if (/\b(?:rpn|lpn|pn|rpn_lpn)\b/.test(tier) || exam.includes("rex-pn") || exam.includes("nclex-pn")) {
    classifications.add("Entry-Level RPN");
  }
  if (/\brn\b/.test(tier) || pathway.includes("nclex-rn") || exam.includes("nclex-rn")) {
    classifications.add("Entry-Level RN");
  }
  if (/\bnp\b/.test(tier) || pathway.includes("cnple") || exam.includes("cnple")) {
    classifications.add("Entry-Level NP");
  }
  if (tier.includes("rt") || career.includes("respiratory") || pathway.includes("rt") || /\brt\b/.test(blob)) {
    classifications.add("RT");
  }
  if (includesAny(blob, ICU_MARKERS)) {
    classifications.add("Specialty ICU");
  }
  if (includesAny(blob, EMERGENCY_MARKERS)) {
    classifications.add("Emergency");
  }
  if (blob.includes("critical care") || blob.includes("hemodynamic") || blob.includes("vasopressor") || blob.includes("shock")) {
    classifications.add("Critical Care");
  }
  if (includesAny(blob, ADVANCED_PRACTICE_MARKERS) || tier.includes("np")) {
    classifications.add("Advanced Practice");
  }
  if (surface === "ecg" && (blob.includes("advanced telemetry") || blob.includes("pacemaker") || blob.includes("overdrive pacing"))) {
    classifications.add("Critical Care");
  }

  return [...classifications];
}

function pathwayKey(item: ContentScopeAuditItem): string {
  const pathway = display(item.pathwayId, "");
  if (pathway) return pathway;
  const tier = display(item.tier, "");
  const exam = display(item.exam, "");
  const career = display(item.careerType, "");
  return [tier, exam, career].filter(Boolean).join(" / ") || "Unmapped";
}

function topicKey(item: ContentScopeAuditItem): string {
  return display(item.topic, "Unmapped");
}

function flagsFor(findings: ContentScopeFinding[], classifications: ScopeAlignmentClassification[]): string[] {
  const flags = new Set<string>();
  for (const finding of findings) flags.add(finding.issueType);
  if (classifications.includes("Entry-Level RN") && classifications.includes("Specialty ICU")) flags.add("rn_specialty_leakage_risk");
  if (classifications.includes("Entry-Level RPN") && classifications.includes("Advanced Practice")) flags.add("rpn_advanced_practice_leakage_risk");
  return [...flags];
}

export function scoreScopeAlignmentItem(item: ContentScopeAuditItem): ScopeAlignmentScoredItem {
  const findings = auditContentScope(item);
  const classifications = classifyScopeAlignment(item);
  const flags = flagsFor(findings, classifications);
  const penalty = findings.reduce((sum, finding) => sum + severityPenalty(finding.severity), 0) + Math.max(0, flags.length - findings.length) * 8;

  return {
    itemId: item.id,
    surface: item.surface,
    pathway: pathwayKey(item),
    topic: topicKey(item),
    title: item.title,
    classifications,
    scopeAlignmentScore: clampScore(100 - penalty),
    findings,
    flags,
  };
}

function emptySummary(): ScopeAlignmentSummary {
  return { audited: 0, flagged: 0, averageScore: 100, criticalFindings: 0 };
}

function addSummary(
  target: Record<string, ScopeAlignmentSummary>,
  key: string,
  item: ScopeAlignmentScoredItem,
): void {
  const row = (target[key] ??= emptySummary());
  const previousTotal = row.averageScore * row.audited;
  row.audited += 1;
  row.flagged += item.findings.length > 0 ? 1 : 0;
  row.criticalFindings += item.findings.filter((finding) => finding.severity === "critical").length;
  row.averageScore = Math.round(((previousTotal + item.scopeAlignmentScore) / row.audited) * 10) / 10;
}

function queueItem(scored: ScopeAlignmentScoredItem, finding: ContentScopeFinding): ScopeAlignmentReviewQueueItem {
  return {
    itemId: scored.itemId,
    priority: severityPriority(finding.severity),
    surface: scored.surface,
    pathway: scored.pathway,
    topic: scored.topic,
    score: scored.scopeAlignmentScore,
    reason: finding.issueType,
    evidence: finding.evidence,
    suggestedCorrection: finding.suggestedCorrection,
  };
}

export function buildScopeAlignmentIntelligenceReport(
  items: ContentScopeAuditItem[],
  generatedAt = new Date().toISOString(),
): ScopeAlignmentIntelligenceReport {
  const scored = items.map(scoreScopeAlignmentItem);
  const byPathway: Record<string, ScopeAlignmentSummary> = {};
  const byTopic: Record<string, ScopeAlignmentSummary> = {};
  const byContentType = Object.fromEntries(SURFACES.map((surface) => [surface, emptySummary()])) as Record<ContentScopeSurface, ScopeAlignmentSummary>;
  const reviewQueues: ScopeAlignmentIntelligenceReport["reviewQueues"] = { Critical: [], High: [], Medium: [], Low: [] };

  for (const item of scored) {
    addSummary(byPathway, item.pathway, item);
    addSummary(byTopic, item.topic, item);
    addSummary(byContentType, item.surface, item);
    for (const finding of item.findings) {
      const priority = severityPriority(finding.severity);
      reviewQueues[priority].push(queueItem(item, finding));
    }
  }

  for (const queue of Object.values(reviewQueues)) {
    queue.sort((a, b) => a.score - b.score || a.pathway.localeCompare(b.pathway) || a.topic.localeCompare(b.topic));
  }

  return {
    generatedAt,
    totalItems: scored.length,
    overallScore: scoreAverage(scored.map((item) => item.scopeAlignmentScore)),
    byPathway,
    byTopic,
    byContentType,
    reviewQueues,
    items: scored,
  };
}
