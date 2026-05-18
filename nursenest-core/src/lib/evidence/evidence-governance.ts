export type EvidenceSourceType =
  | "clinical-guideline"
  | "drug-reference"
  | "textbook"
  | "peer-reviewed-study"
  | "regulatory-source"
  | "professional-standard"
  | "local-policy"
  | "expert-review";

export type EvidenceConfidence = "low" | "moderate" | "high" | "authoritative";

export type EvidenceRiskDomain =
  | "general"
  | "medication-safety"
  | "pediatrics"
  | "pregnancy-lactation"
  | "critical-care"
  | "cardiac-acls"
  | "sepsis"
  | "infection-control"
  | "mental-health-safety"
  | "scope-of-practice";

export type EvidenceSource = {
  id: string;
  title: string;
  organization?: string;
  sourceType: EvidenceSourceType;
  publicationYear?: number;
  version?: string;
  url?: string;
  doi?: string;
  confidence: EvidenceConfidence;
  riskDomains: EvidenceRiskDomain[];
  reviewCadenceMonths: number;
};

export type ContentEvidenceCitation = {
  sourceId: string;
  claim: string;
  supports: "answer" | "rationale" | "distractor" | "clinical-reasoning" | "exam-strategy" | "general";
  quoteOrLocator?: string;
  addedBy?: string;
  reviewedBy?: string;
  reviewedAt?: string;
};

export type EvidenceGovernanceInput = {
  contentId?: string | null;
  topic?: string | null;
  bodySystem?: string | null;
  stem?: string | null;
  rationale?: string | null;
  clinicalReasoning?: string | null;
  citations?: ContentEvidenceCitation[] | null;
  sources?: EvidenceSource[] | null;
  highRiskDomains?: EvidenceRiskDomain[] | null;
  now?: Date;
};

export type EvidenceGovernanceIssueCode =
  | "NO_CITATIONS"
  | "SOURCE_NOT_FOUND"
  | "LOW_CONFIDENCE_SOURCE"
  | "STALE_SOURCE"
  | "MISSING_REVIEWER"
  | "MISSING_LOCATOR"
  | "HIGH_RISK_DOMAIN_UNSUPPORTED"
  | "CLAIM_TOO_VAGUE"
  | "MISSING_ANSWER_SUPPORT"
  | "MISSING_RATIONALE_SUPPORT";

export type EvidenceGovernanceIssue = {
  code: EvidenceGovernanceIssueCode;
  severity: "info" | "review" | "blocker";
  message: string;
  remediation: string;
};

export type EvidenceGovernanceResult = {
  evidenceScore: number;
  publishable: boolean;
  confidence: EvidenceConfidence;
  freshness: "current" | "review-due" | "stale" | "unknown";
  supportedClaims: number;
  issues: EvidenceGovernanceIssue[];
};

const confidenceRank: Record<EvidenceConfidence, number> = {
  low: 1,
  moderate: 2,
  high: 3,
  authoritative: 4,
};

function monthsBetween(a: Date, b: Date): number {
  return Math.abs((a.getFullYear() - b.getFullYear()) * 12 + (a.getMonth() - b.getMonth()));
}

function parseDate(value: string | undefined): Date | null {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function text(value: string | null | undefined): string {
  return typeof value === "string" ? value.trim() : "";
}

function inferRiskDomains(input: EvidenceGovernanceInput): EvidenceRiskDomain[] {
  const explicit = input.highRiskDomains ?? [];
  const combined = [input.topic, input.bodySystem, input.stem, input.rationale, input.clinicalReasoning]
    .map(text)
    .join(" ")
    .toLowerCase();
  const inferred = new Set<EvidenceRiskDomain>(explicit);

  if (/insulin|warfarin|heparin|opioid|potassium|digoxin|vancomycin|anticoag|dose|medication/.test(combined)) {
    inferred.add("medication-safety");
  }
  if (/pediatric|paediatric|infant|child|neonate|newborn/.test(combined)) inferred.add("pediatrics");
  if (/pregnan|lactat|breastfeed|fetal|trimester/.test(combined)) inferred.add("pregnancy-lactation");
  if (/sepsis|septic/.test(combined)) inferred.add("sepsis");
  if (/acls|cardiac arrest|defibrillat|arrhythmia|myocardial|acute coronary/.test(combined)) inferred.add("cardiac-acls");
  if (/ventilat|vasopressor|shock|icu|critical care/.test(combined)) inferred.add("critical-care");
  if (/isolation|ppe|infection control|cdc|precaution/.test(combined)) inferred.add("infection-control");
  if (/suicide|self-harm|restraint|seclusion|violence/.test(combined)) inferred.add("mental-health-safety");
  if (/scope|delegate|assignment|rn|lpn|rpn|np/.test(combined)) inferred.add("scope-of-practice");

  if (inferred.size === 0) inferred.add("general");
  return [...inferred];
}

function hasSupport(citations: ContentEvidenceCitation[], supports: ContentEvidenceCitation["supports"]): boolean {
  return citations.some((citation) => citation.supports === supports || citation.supports === "general");
}

function highestConfidence(sources: EvidenceSource[]): EvidenceConfidence {
  if (sources.length === 0) return "low";
  return sources.reduce((best, source) =>
    confidenceRank[source.confidence] > confidenceRank[best] ? source.confidence : best,
  sources[0].confidence);
}

export function evaluateEvidenceGovernance(input: EvidenceGovernanceInput): EvidenceGovernanceResult {
  const issues: EvidenceGovernanceIssue[] = [];
  const citations = input.citations ?? [];
  const sources = input.sources ?? [];
  const sourceById = new Map(sources.map((source) => [source.id, source]));
  const riskDomains = inferRiskDomains(input);
  const now = input.now ?? new Date();

  if (citations.length === 0) {
    issues.push({
      code: "NO_CITATIONS",
      severity: "blocker",
      message: "Content has no evidence citations.",
      remediation: "Attach at least one source that supports the answer and rationale before publication.",
    });
  }

  for (const citation of citations) {
    const source = sourceById.get(citation.sourceId);
    if (!source) {
      issues.push({
        code: "SOURCE_NOT_FOUND",
        severity: "blocker",
        message: `Citation references unknown source '${citation.sourceId}'.`,
        remediation: "Register the source in the evidence registry or correct the sourceId.",
      });
      continue;
    }

    if (confidenceRank[source.confidence] < confidenceRank.high) {
      issues.push({
        code: "LOW_CONFIDENCE_SOURCE",
        severity: riskDomains.some((domain) => domain !== "general") ? "blocker" : "review",
        message: `${source.title} has ${source.confidence} evidence confidence.",
        remediation: "Use a guideline, regulatory source, drug reference, or clinician-reviewed authoritative source for clinical claims.",
      });
    }

    const reviewedAt = parseDate(citation.reviewedAt);
    const publicationAge = source.publicationYear ? now.getFullYear() - source.publicationYear : null;
    const reviewAge = reviewedAt ? monthsBetween(now, reviewedAt) : null;
    const isStale =
      (publicationAge !== null && publicationAge >= 6 && source.sourceType !== "textbook") ||
      (reviewAge !== null && reviewAge > source.reviewCadenceMonths);
    if (isStale) {
      issues.push({
        code: "STALE_SOURCE",
        severity: riskDomains.some((domain) => domain !== "general") ? "blocker" : "review",
        message: `${source.title} is due for evidence freshness review.",
        remediation: "Refresh against the latest guideline/reference and update reviewedAt/version metadata.",
      });
    }

    if (!citation.reviewedBy || !citation.reviewedAt) {
      issues.push({
        code: "MISSING_REVIEWER",
        severity: riskDomains.some((domain) => domain !== "general") ? "blocker" : "review",
        message: "Citation is missing reviewer attribution or review date.",
        remediation: "Add reviewedBy and reviewedAt before allowing clinical publication.",
      });
    }

    if (!citation.quoteOrLocator) {
      issues.push({
        code: "MISSING_LOCATOR",
        severity: "review",
        message: "Citation lacks a locator, quote, page, section, or table reference.",
        remediation: "Add a page, section, table, URL anchor, or short locator so reviewers can verify the claim quickly.",
      });
    }

    if (text(citation.claim).length < 20) {
      issues.push({
        code: "CLAIM_TOO_VAGUE",
        severity: "review",
        message: "Citation claim is too vague to audit.",
        remediation: "Rewrite the claim to state exactly what the source supports.",
      });
    }
  }

  if (!hasSupport(citations, "answer")) {
    issues.push({
      code: "MISSING_ANSWER_SUPPORT",
      severity: "blocker",
      message: "No citation explicitly supports the correct answer.",
      remediation: "Add a citation mapped to supports='answer'.",
    });
  }

  if (!hasSupport(citations, "rationale")) {
    issues.push({
      code: "MISSING_RATIONALE_SUPPORT",
      severity: "blocker",
      message: "No citation explicitly supports the rationale.",
      remediation: "Add a citation mapped to supports='rationale'.",
    });
  }

  for (const domain of riskDomains.filter((domain) => domain !== "general")) {
    const supported = sources.some(
      (source) => source.riskDomains.includes(domain) && confidenceRank[source.confidence] >= confidenceRank.high,
    );
    if (!supported) {
      issues.push({
        code: "HIGH_RISK_DOMAIN_UNSUPPORTED",
        severity: "blocker",
        message: `High-risk domain '${domain}' lacks high-confidence evidence support.",
        remediation: "Attach a high-confidence source specific to this risk domain.",
      });
    }
  }

  const penalty = issues.reduce((sum, issue) => {
    if (issue.severity === "blocker") return sum + 24;
    if (issue.severity === "review") return sum + 9;
    return sum + 3;
  }, 0);
  const evidenceScore = Math.max(0, 100 - penalty);
  const publishable = !issues.some((issue) => issue.severity === "blocker") && evidenceScore >= 80;
  const confidence = highestConfidence(sources.filter((source) => citations.some((citation) => citation.sourceId === source.id)));
  const staleCount = issues.filter((issue) => issue.code === "STALE_SOURCE").length;
  const freshness = citations.length === 0 ? "unknown" : staleCount > 0 ? "stale" : issues.some((issue) => issue.code === "MISSING_REVIEWER") ? "review-due" : "current";

  return {
    evidenceScore,
    publishable,
    confidence,
    freshness,
    supportedClaims: citations.length,
    issues,
  };
}
