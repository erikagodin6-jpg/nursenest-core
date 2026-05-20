import { ALLIED_PROFESSION_QUERY_PARAM } from "@/lib/lessons/canonical-lessons-hubs";

export const SCENARIO_LEARNER_ROUTES = {
  osce: "/app/osce",
  clinicalScenarios: "/app/clinical-scenarios",
} as const;

export function withScenarioPathwayQuery(base: string, pathwayId: string | null): string {
  if (!pathwayId?.trim()) return base;
  const q = `pathwayId=${encodeURIComponent(pathwayId.trim())}`;
  return base.includes("?") ? `${base}&${q}` : `${base}?${q}`;
}

/** Preserves pathway + optional allied occupation on learner scenario URLs (same route, query-only). */
export function withScenarioPathwayAndProfessionQuery(
  base: string,
  pathwayId: string | null,
  alliedProfessionKey?: string | null,
): string {
  let href = withScenarioPathwayQuery(base, pathwayId);
  const k = alliedProfessionKey?.trim().toLowerCase();
  if (!k) return href;
  const sep = href.includes("?") ? "&" : "?";
  return `${href}${sep}${ALLIED_PROFESSION_QUERY_PARAM}=${encodeURIComponent(k)}`;
}
