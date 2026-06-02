import { practiceSessionUrl } from "@/lib/practice-question-session/parse-session-search-params";

export type WeakAreaLaunchUrlInput = {
  pathwayId: string;
  practiceHubIds?: string | string[] | null;
  count?: number | null;
};

function normalizePracticeHubIds(input: string | string[] | null | undefined): string | null {
  if (Array.isArray(input)) {
    const ids = input.map((id) => id.trim()).filter(Boolean);
    return ids.length > 0 ? ids.join(",") : null;
  }
  const raw = input?.trim();
  return raw && raw.length > 0 ? raw : null;
}

/**
 * Canonical URL for Weak Areas launches.
 *
 * This keeps marketing hubs, learner dashboards, and remediation links aligned with
 * the actual practice-session engine instead of the generic question-bank launcher.
 */
export function weakAreaLaunchUrl(input: WeakAreaLaunchUrlInput): string {
  const count = input.count === 10 || input.count === 20 || input.count === 30 || input.count === 50
    ? input.count
    : 20;

  return practiceSessionUrl({
    pathwayId: input.pathwayId,
    source: "weak_areas",
    categorySlug: null,
    count,
    mode: "weak_area",
    shuffle: true,
    practiceHubIds: normalizePracticeHubIds(input.practiceHubIds),
    studyFilter: "weak",
  });
}
