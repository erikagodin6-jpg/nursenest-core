export type InstitutionAnalyticsInput = Readonly<{
  enrollment: number;
  completionPct: number;
  readinessScore: number;
  weakAreaCount: number;
  simulationSuccessPct: number;
  clinicalSkillsPerformance: number;
  retentionPct: number;
  engagementPct: number;
}>;

export type InstitutionAnalyticsDashboard = InstitutionAnalyticsInput & Readonly<{
  health: "strong" | "watch" | "at_risk";
  priorityActions: readonly string[];
}>;

export function buildInstitutionAnalyticsDashboard(input: InstitutionAnalyticsInput): InstitutionAnalyticsDashboard {
  const priorityActions = [
    input.completionPct < 70 ? "Increase assignment completion." : null,
    input.readinessScore < 75 ? "Target readiness remediation." : null,
    input.simulationSuccessPct < 70 ? "Assign simulation remediation." : null,
    input.clinicalSkillsPerformance < 75 ? "Review clinical skills performance." : null,
    input.engagementPct < 65 ? "Follow up with low-engagement learners." : null,
  ].filter((item): item is string => Boolean(item));

  return {
    ...input,
    health: priorityActions.length >= 3 ? "at_risk" : priorityActions.length > 0 ? "watch" : "strong",
    priorityActions,
  };
}
