export const STUDY_TOOL_ROUTES = {
  hub: "/app/study-tools",
  decks: "/app/study-tools/decks",
  createDeck: "/app/study-tools/create",
  sharedDecks: "/app/study-tools/shared",
  publicDecks: "/app/study-tools/public",
  matching: "/app/matching",
  fillInTheBlank: "/app/fill-in-the-blank",
  ordering: "/app/ordering",
  labDrills: "/app/lab-drills",
  medicationDrills: "/app/medication-drills",
} as const;

export type StudyToolRouteKey = keyof typeof STUDY_TOOL_ROUTES;

export function withStudyToolPathwayQuery(base: string, pathwayId: string | null): string {
  if (!pathwayId?.trim()) return base;
  const q = `pathwayId=${encodeURIComponent(pathwayId.trim())}`;
  return base.includes("?") ? `${base}&${q}` : `${base}?${q}`;
}

/** Marketing / sitemap: never emit authenticated `/app/*` URLs here. */
export function getStudyToolsPublicSitemapUrls(): readonly string[] {
  return [];
}
