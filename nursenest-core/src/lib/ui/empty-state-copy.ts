/**
 * Context-specific copy presets for {@link PremiumEmptyState}.
 * Tone: warm, clear, never blaming the user.
 */

type EmptyStateCopyEntry = {
  headline: string;
  body: string;
  hint?: string;
};

type NotFoundCopyArgs = {
  exam?: string;
  pathwayLine?: string;
  variant?: number;
};

type SearchCopyArgs = {
  query?: string;
  pathwayLine?: string;
};

type ThinInventoryCopyArgs = {
  pathwayLine?: string;
  exam?: string;
};

type NoHistoryCopyArgs = {
  area?: string;
};

const noSearchResults = Object.assign(
  ({ query, pathwayLine }: SearchCopyArgs = {}): EmptyStateCopyEntry => ({
    headline: "No matches for that search",
    body:
      query && pathwayLine
        ? `Nothing matched “${query}” for ${pathwayLine}. Try a shorter keyword, clear filters, or browse the full hub.`
        : query
          ? `Nothing matched “${query}”. Try a shorter keyword, clear filters, or browse the full hub.`
          : "Try a shorter keyword, clear filters, or browse by topic — your hub has more than what fits one query.",
  }),
  {
    headline: "No matches for that search",
    body: "Try a shorter keyword, clear filters, or browse by topic — your hub has more than what fits one query.",
  } satisfies EmptyStateCopyEntry,
);

const noProgressYet = Object.assign(
  (): EmptyStateCopyEntry => ({
    headline: "You haven’t started here yet",
    body: "Your progress will appear here after you begin. Start with a lesson or a practice set to build momentum.",
  }),
  {
    headline: "You haven’t started here yet",
    body: "Your progress will appear here after you begin. Start with a lesson or a practice set to build momentum.",
  } satisfies EmptyStateCopyEntry,
);

const noWeakAreasYet = Object.assign(
  (): EmptyStateCopyEntry => ({
    headline: "We need a bit more signal first",
    body: "Complete more graded questions so we can spot patterns and personalize focus areas for you.",
  }),
  {
    headline: "We need a bit more signal first",
    body: "Complete more graded questions so we can spot patterns and personalize focus areas for you.",
  } satisfies EmptyStateCopyEntry,
);

const entitlementLocked = Object.assign(
  ({ exam }: { exam?: string } = {}): EmptyStateCopyEntry => ({
    headline: "This content is part of your subscription",
    body: exam
      ? `Upgrade to unlock ${exam} study tools, lessons, and guided next steps without losing your current progress.`
      : "Upgrade to unlock full access — your pathway hub and practice tools are ready when you are.",
  }),
  {
    headline: "This content is part of your subscription",
    body: "Upgrade to unlock full access — your pathway hub and practice tools are ready when you are.",
  } satisfies EmptyStateCopyEntry,
);

const noHistoryYet = Object.assign(
  ({ area }: NoHistoryCopyArgs = {}): EmptyStateCopyEntry => ({
    headline: area ? `No ${area} yet` : "No history yet",
    body: area
      ? `Once you start, your ${area} will collect here so you can revisit what you’ve completed and where to go next.`
      : "Once you start, your recent activity will collect here so you can revisit what you’ve completed and where to go next.",
  }),
  {
    headline: "No history yet",
    body: "Once you start, your recent activity will collect here so you can revisit what you’ve completed and where to go next.",
  } satisfies EmptyStateCopyEntry,
);

const thinInventory = Object.assign(
  ({ pathwayLine, exam }: ThinInventoryCopyArgs = {}): EmptyStateCopyEntry => ({
    headline: "This section is still growing",
    body:
      pathwayLine || exam
        ? `${pathwayLine ?? exam} content is being expanded carefully. In the meantime, nearby study tools and pathway-scoped practice are ready now.`
        : "New lessons land here on a steady cadence. In the meantime, pathway-scoped practice and your hub tools stay available.",
    hint: "Try a nearby topic, the question bank, or the pathway hub while this library fills in.",
  }),
  {
    headline: "This section is still growing",
    body: "New lessons land here on a steady cadence. In the meantime, pathway-scoped practice and your hub tools stay available.",
    hint: "Try a nearby topic, the question bank, or the pathway hub while this library fills in.",
  } satisfies EmptyStateCopyEntry,
);

const notFound = Object.assign(
  ({ pathwayLine, exam, variant = 0 }: NotFoundCopyArgs = {}): EmptyStateCopyEntry => {
    const headlines = [
      "This page took a little detour",
      "Looks like this page wandered off",
      "We couldn’t find that page",
    ] as const;
    const bodies = [
      pathwayLine
        ? `${pathwayLine} study paths are still close by, and we can guide you back to something useful.`
        : "Your next study step is still close by, and we can guide you back to something useful.",
      exam
        ? `${exam} prep is still nearby. Use the recovery links below to get back on track.`
        : "No worries — we’ll help you head back to something helpful.",
      pathwayLine
        ? `We couldn’t open this route, but ${pathwayLine} lessons and study tools are still available.`
        : "We couldn’t open this route, but there’s still a clear way back into your study flow.",
    ] as const;

    return {
      headline: headlines[Math.abs(variant) % headlines.length],
      body: bodies[Math.abs(variant) % bodies.length],
      hint: "Choose a nearby study destination below.",
    };
  },
  {
    headline: "This page took a little detour",
    body: "Your next study step is still close by, and we can guide you back to something useful.",
    hint: "Choose a nearby study destination below.",
  } satisfies EmptyStateCopyEntry,
);

const notFoundMinimal = Object.assign(
  ({ variant = 0 }: NotFoundCopyArgs = {}): EmptyStateCopyEntry => {
    const headlines = [
      "We couldn’t find that page",
      "That page isn’t here anymore",
      "This route isn’t available",
    ] as const;
    const bodies = [
      "Let’s get you back to a calmer, more useful study path.",
      "No worries — the rest of NurseNest is still right where it should be.",
      "Use the links below to head back to something helpful.",
    ] as const;

    return {
      headline: headlines[Math.abs(variant) % headlines.length],
      body: bodies[Math.abs(variant) % bodies.length],
      hint: "We’ll keep the recovery paths simple and reliable.",
    };
  },
  {
    headline: "We couldn’t find that page",
    body: "Let’s get you back to a calmer, more useful study path.",
    hint: "We’ll keep the recovery paths simple and reliable.",
  } satisfies EmptyStateCopyEntry,
);

const noAnalyticsYet = Object.assign(
  (): EmptyStateCopyEntry => ({
    headline: "Analytics will appear here",
    body: "After you answer questions or complete a practice session, trends and topic balance show up in this view.",
    hint: "Start with a short question set or one lesson to generate your first signals.",
  }),
  {
    headline: "Analytics will appear here",
    body: "After you answer questions or complete a practice session, trends and topic balance show up in this view.",
    hint: "Start with a short question set or one lesson to generate your first signals.",
  } satisfies EmptyStateCopyEntry,
);

const noRecentPractice = Object.assign(
  (): EmptyStateCopyEntry => ({
    headline: "No recent practice yet",
    body: "Your latest sessions will list here so you can pick up where you left off.",
    hint: "Open the question bank or a saved practice exam to create your first entry.",
  }),
  {
    headline: "No recent practice yet",
    body: "Your latest sessions will list here so you can pick up where you left off.",
    hint: "Open the question bank or a saved practice exam to create your first entry.",
  } satisfies EmptyStateCopyEntry,
);

const noWeakTopicsYet = Object.assign(
  (): EmptyStateCopyEntry => ({
    headline: "No weak topics to highlight yet",
    body: "We look for patterns across graded questions. A little more volume helps us suggest focused review.",
  }),
  {
    headline: "No weak topics to highlight yet",
    body: "We look for patterns across graded questions. A little more volume helps us suggest focused review.",
  } satisfies EmptyStateCopyEntry,
);

const noSavedNotes = Object.assign(
  (): EmptyStateCopyEntry => ({
    headline: "No saved notes yet",
    body: "Notes you add from lessons or questions collect here for quick review before exams.",
    hint: "Open any lesson or question and use the notes panel to capture what you want to remember.",
  }),
  {
    headline: "No saved notes yet",
    body: "Notes you add from lessons or questions collect here for quick review before exams.",
    hint: "Open any lesson or question and use the notes panel to capture what you want to remember.",
  } satisfies EmptyStateCopyEntry,
);

const noStudyActivityYet = Object.assign(
  (): EmptyStateCopyEntry => ({
    headline: "No study activity yet",
    body: "Once you study, this area fills in with momentum, streaks, and the next sensible step for your plan.",
    hint: "Your dashboard stays available whenever you are ready to begin.",
  }),
  {
    headline: "No study activity yet",
    body: "Once you study, this area fills in with momentum, streaks, and the next sensible step for your plan.",
    hint: "Your dashboard stays available whenever you are ready to begin.",
  } satisfies EmptyStateCopyEntry,
);

export const emptyStateCopy = {
  noLessonsThin: thinInventory,
  thinInventory,
  noSearchResults,
  noFilterResults: {
    headline: "Nothing matches these filters yet",
    body: "Ease one filter or search with different words. You can also return to the full lesson list for this pathway.",
  },
  noProgressYet,
  noWeakAreasYet,
  /** Alias with clearer wording for dashboards. */
  noWeakTopicsYet,
  noAnalyticsYet,
  noRecentPractice,
  noSavedNotes,
  noStudyActivityYet,
  noExamHistory: {
    headline: "No exam sessions yet",
    body: "Start a practice exam to build your readiness picture and track how you improve over time.",
  },
  noHistoryYet,
  noRecommendations: {
    headline: "Recommendations will show up here",
    body: "As you study, we’ll surface tailored next steps. Try a lesson or question set to get started.",
  },
  entitlementLocked,
  accountLowData: {
    headline: "There isn’t much here yet",
    body: "That usually means you’re just getting started — your hub fills in as you study.",
  },
  notFound,
  notFoundMinimal,
} as const;
