import {
  calculateGuidelineFreshness,
  clinicalGuidelineRegistry,
  type ClinicalGuidelineDefinition,
} from "./clinical-guideline-registry";

export type EvidenceLifecycleSeverity = "info" | "review" | "high" | "critical";

export type EvidenceLifecycleQueueItem = {
  guidelineId: string;
  title: string;
  severity: EvidenceLifecycleSeverity;
  reason: string;
  recommendedAction: string;
  dueWithinDays: number;
};

export type EvidenceLifecycleGovernanceResult = {
  readinessPercent: number;
  currentGuidelines: number;
  agingGuidelines: number;
  staleGuidelines: number;
  queue: EvidenceLifecycleQueueItem[];
};

function severityFor(
  guideline: ClinicalGuidelineDefinition,
  freshness: "current" | "aging" | "stale",
): EvidenceLifecycleSeverity {
  if (freshness === "stale") {
    if (
      guideline.riskDomains.includes("critical-care") ||
      guideline.riskDomains.includes("cardiac-acls") ||
      guideline.riskDomains.includes("medication-safety")
    ) {
      return "critical";
    }

    return "high";
  }

  if (freshness === "aging") return "review";
  return "info";
}

function dueDaysFor(freshness: "current" | "aging" | "stale"): number {
  if (freshness === "stale") return 7;
  if (freshness === "aging") return 30;
  return 180;
}

export function evaluateEvidenceLifecycleGovernance(
  now = new Date(),
): EvidenceLifecycleGovernanceResult {
  const queue: EvidenceLifecycleQueueItem[] = [];
  let currentGuidelines = 0;
  let agingGuidelines = 0;
  let staleGuidelines = 0;

  for (const guideline of clinicalGuidelineRegistry) {
    const freshness = calculateGuidelineFreshness(guideline, now);

    if (freshness.freshness === "current") currentGuidelines += 1;
    if (freshness.freshness === "aging") agingGuidelines += 1;
    if (freshness.freshness === "stale") staleGuidelines += 1;

    if (freshness.freshness !== "current") {
      const severity = severityFor(guideline, freshness.freshness);

      queue.push({
        guidelineId: guideline.id,
        title: guideline.title,
        severity,
        reason:
          freshness.freshness === "stale"
            ? "Guideline exceeds freshness threshold and requires urgent review."
            : "Guideline is approaching freshness expiry and should be reviewed.",
        recommendedAction:
          freshness.freshness === "stale"
            ? "Revalidate all linked content against the latest published guidance."
            : "Schedule evidence refresh review and confirm no major updates exist.",
        dueWithinDays: dueDaysFor(freshness.freshness),
      });
    }
  }

  queue.sort((a, b) => {
    const severityRank: Record<EvidenceLifecycleSeverity, number> = {
      critical: 4,
      high: 3,
      review: 2,
      info: 1,
    };

    return severityRank[b.severity] - severityRank[a.severity];
  });

  const readinessPercent = Math.max(
    0,
    Math.round(
      (currentGuidelines / Math.max(clinicalGuidelineRegistry.length, 1)) * 100 -
        staleGuidelines * 8 -
        agingGuidelines * 2,
    ),
  );

  return {
    readinessPercent,
    currentGuidelines,
    agingGuidelines,
    staleGuidelines,
    queue,
  };
}
