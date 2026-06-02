/**
 * Central React Query roots — include `pathwayId` where learner data is pathway-scoped
 * so switching pathways invalidates the right subtree.
 */
export const queryRoots = {
  session: ["session"] as const,
  personalProfile: (pathwayId: string | null) => ["learner", "personal-profile", pathwayId] as const,
  commandCenter: (pathwayId: string | null) => ["learner", "command-center", pathwayId] as const,
  readiness: (pathwayId: string | null) => ["learner", "readiness", pathwayId] as const,
  flashcardsDueSummary: (pathwayId: string | null) => ["flashcards", "due-summary", pathwayId] as const,
  /** Streak / engagement — server-backed when wired; keys reserved without faking metrics. */
  engagementStreak: (pathwayId: string | null) => ["learner", "engagement", "streak", pathwayId] as const,
  homeDailyProgress: (pathwayId: string | null) => ["learner", "home", "daily-progress", pathwayId] as const,
  engagementNudges: (pathwayId: string | null) => ["learner", "engagement-nudges", pathwayId] as const,
} as const;

export function learnerInvalidatePredicate(oldPathway: string | null, newPathway: string | null) {
  return (queryKey: readonly unknown[]) => {
    if (!Array.isArray(queryKey) || queryKey.length < 2) return false;
    if (queryKey[0] !== "learner" && queryKey[0] !== "flashcards") return false;
    const scoped = queryKey[queryKey.length - 1];
    return scoped === oldPathway || scoped === newPathway || oldPathway === null || newPathway === null;
  };
}
