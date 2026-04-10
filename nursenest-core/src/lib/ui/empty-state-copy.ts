/**
 * Context-specific copy presets for {@link PremiumEmptyState}.
 * Tone: warm, clear, never blaming the user.
 */

export const emptyStateCopy = {
  noLessonsThin: {
    headline: "This section is still growing",
    body: "New lessons land here on a steady cadence. In the meantime, pathway-scoped practice and your hub tools stay available.",
  },
  noSearchResults: {
    headline: "No matches for that search",
    body: "Try a shorter keyword, clear filters, or browse by topic — your hub has more than what fits one query.",
  },
  noFilterResults: {
    headline: "Nothing matches these filters yet",
    body: "Ease one filter or search with different words. You can also return to the full lesson list for this pathway.",
  },
  noProgressYet: {
    headline: "You haven’t started here yet",
    body: "Your progress will appear here after you begin. Start with a lesson or a practice set to build momentum.",
  },
  noWeakAreasYet: {
    headline: "We need a bit more signal first",
    body: "Complete more graded questions so we can spot patterns and personalize focus areas for you.",
  },
  noExamHistory: {
    headline: "No exam sessions yet",
    body: "Start a practice exam to build your readiness picture and track how you improve over time.",
  },
  noRecommendations: {
    headline: "Recommendations will show up here",
    body: "As you study, we’ll surface tailored next steps. Try a lesson or question set to get started.",
  },
  entitlementLocked: {
    headline: "This content is part of your subscription",
    body: "Upgrade to unlock full access — your pathway hub and practice tools are ready when you are.",
  },
  accountLowData: {
    headline: "There isn’t much here yet",
    body: "That usually means you’re just getting started — your hub fills in as you study.",
  },
} as const;
