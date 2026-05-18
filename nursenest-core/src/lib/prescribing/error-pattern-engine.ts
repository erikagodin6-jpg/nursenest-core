import type {
  PrescribingAnalyticsEvent
} from "./analytics-event-types";

export interface PrescribingErrorPattern {
  domain: string;
  frequency: number;
  severity: "low" | "moderate" | "high";
  remediationRecommendation: string;
}

export function detectPrescribingErrorPatterns(
  events: PrescribingAnalyticsEvent[]
): PrescribingErrorPattern[] {
  const domainMap = new Map<string, number>();

  for (const event of events) {
    if (
      event.eventType === "safety_miss_recorded" ||
      event.eventType === "stewardship_penalty_recorded"
    ) {
      const current = domainMap.get(event.domain ?? "unknown") ?? 0;

      domainMap.set(
        event.domain ?? "unknown",
        current + 1
      );
    }
  }

  return Array.from(domainMap.entries()).map(
    ([domain, frequency]) => ({
      domain,
      frequency,
      severity:
        frequency >= 10
          ? "high"
          : frequency >= 5
          ? "moderate"
          : "low",
      remediationRecommendation:
        frequency >= 10
          ? "Immediate focused remediation and competency reassessment recommended."
          : "Targeted prescribing review recommended."
    })
  );
}
