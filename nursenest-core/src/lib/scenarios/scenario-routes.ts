export const SCENARIO_LEARNER_ROUTES = {
  osce: "/app/osce",
  clinicalScenarios: "/app/clinical-scenarios",
} as const;

export function withScenarioPathwayQuery(base: string, pathwayId: string | null): string {
  if (!pathwayId?.trim()) return base;
  const q = `pathwayId=${encodeURIComponent(pathwayId.trim())}`;
  return base.includes("?") ? `${base}&${q}` : `${base}?${q}`;
}
