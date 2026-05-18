export type EvidenceAuthority =
  | "aha"
  | "aacn"
  | "ada"
  | "cdc"
  | "idsa"
  | "nclex"
  | "who"
  | "uptodate"
  | "other";

export type EvidenceSource = {
  authority: EvidenceAuthority;
  title: string;
  publicationYear?: number | null;
  version?: string | null;
  url?: string | null;
  cited?: boolean | null;
};

export type EvidenceGovernanceInput = {
  sources?: EvidenceSource[] | null;
  clinicalDomain?: string | null;
  currentYear?: number | null;
};

export type EvidenceGovernanceIssueCode =
  | "NO_SOURCES"
  | "OUTDATED_GUIDELINE"
  | "LOW_AUTHORITY_SOURCE"
  | "MISSING_VERSION"
  | "MISSING_CITATION_URL";

export type EvidenceGovernanceIssue = {
  code: EvidenceGovernanceIssueCode;
  severity: "review" | "high";
  message: string;
};

export type EvidenceGovernanceResult = {
  evidenceScore: number;
  freshnessScore: number;
  authorityScore: number;
  confidenceBand: "low" | "moderate" | "high";
  issues: EvidenceGovernanceIssue[];
  recommendedReview: boolean;
};

const HIGH_AUTHORITY: EvidenceAuthority[] = [
  "aha",
  "aacn",
  "ada",
  "cdc",
  "idsa",
  "nclex",
  "who",
  "uptodate",
];

export function evaluateEvidenceGovernance(
  input: EvidenceGovernanceInput,
): EvidenceGovernanceResult {
  const currentYear = input.currentYear ?? new Date().getFullYear();
  const sources = input.sources ?? [];
  const issues: EvidenceGovernanceIssue[] = [];

  let evidenceScore = 100;
  let freshnessScore = 100;
  let authorityScore = 100;

  if (sources.length === 0) {
    issues.push({
      code: "NO_SOURCES",
      severity: "high",
      message: "Clinical content has no attached evidence sources.",
    });

    return {
      evidenceScore: 0,
      freshnessScore: 0,
      authorityScore: 0,
      confidenceBand: "low",
      issues,
      recommendedReview: true,
    };
  }

  for (const source of sources) {
    if (!HIGH_AUTHORITY.includes(source.authority)) {
      authorityScore -= 18;
      issues.push({
        code: "LOW_AUTHORITY_SOURCE",
        severity: "review",
        message: `Source authority '${source.authority}' may require secondary validation.`,
      });
    }

    if (!source.version) {
      evidenceScore -= 8;
      issues.push({
        code: "MISSING_VERSION",
        severity: "review",
        message: `Source '${source.title}' is missing version metadata.`,
      });
    }

    if (!source.url) {
      evidenceScore -= 5;
      issues.push({
        code: "MISSING_CITATION_URL",
        severity: "review",
        message: `Source '${source.title}' is missing a citation URL.`,
      });
    }

    if (typeof source.publicationYear === "number") {
      const age = currentYear - source.publicationYear;

      if (age >= 8) {
        freshnessScore -= 30;
        issues.push({
          code: "OUTDATED_GUIDELINE",
          severity: "high",
          message: `Source '${source.title}' may be outdated (${source.publicationYear}).`,
        });
      } else if (age >= 5) {
        freshnessScore -= 15;
      }
    }
  }

  evidenceScore = Math.max(0, Math.min(100, Math.round(evidenceScore)));
  freshnessScore = Math.max(0, Math.min(100, Math.round(freshnessScore)));
  authorityScore = Math.max(0, Math.min(100, Math.round(authorityScore)));

  const overall = Math.round(
    evidenceScore * 0.4 + freshnessScore * 0.35 + authorityScore * 0.25,
  );

  return {
    evidenceScore: overall,
    freshnessScore,
    authorityScore,
    confidenceBand: overall >= 85 ? "high" : overall >= 65 ? "moderate" : "low",
    issues,
    recommendedReview:
      issues.some((issue) => issue.severity === "high") || overall < 70,
  };
}
