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
          : "Try a shorter keyword, clear filters, or browse by topic. Your hub includes more than one query can show.",
  }),
  {
    headline: "No matches for that search",
    body: "Try a shorter keyword, clear filters, or browse by topic. Your hub includes more than one query can show.",
  } satisfies EmptyStateCopyEntry,
);

const noProgressYet = Object.assign(
  (): EmptyStateCopyEntry => ({
    headline: "You haven’t started here yet",
    body: "Your progress will appear here after your first lesson or practice set.",
  }),
  {
    headline: "You haven’t started here yet",
    body: "Your progress will appear here after your first lesson or practice set.",
  } satisfies EmptyStateCopyEntry,
);

const noWeakAreasYet = Object.assign(
  (): EmptyStateCopyEntry => ({
    headline: "More data needed",
    body: "Complete more graded questions. Then we can identify weak topics and suggest targeted review.",
  }),
  {
    headline: "More data needed",
    body: "Complete more graded questions. Then we can identify weak topics and suggest targeted review.",
  } satisfies EmptyStateCopyEntry,
);

const entitlementLocked = Object.assign(
  ({ exam }: { exam?: string } = {}): EmptyStateCopyEntry => ({
    headline: "This content is part of your subscription",
    body: exam
      ? `Upgrade to unlock ${exam} lessons, practice tools, and next-step guidance without losing your current progress.`
      : "Upgrade to unlock full access to your pathway hub and practice tools.",
  }),
  {
    headline: "This content is part of your subscription",
    body: "Upgrade to unlock full access to your pathway hub and practice tools.",
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
        ? `${pathwayLine ?? exam} content is still being expanded. Use nearby study tools or pathway-scoped practice while this section is completed.`
        : "This lesson library is still being expanded. Use pathway-scoped practice and your hub tools while new lessons are added.",
    hint: "Try a nearby topic, the question bank, or the pathway hub while this section is completed.",
  }),
  {
    headline: "This section is still growing",
    body: "This lesson library is still being expanded. Use pathway-scoped practice and your hub tools while new lessons are added.",
    hint: "Try a nearby topic, the question bank, or the pathway hub while this section is completed.",
  } satisfies EmptyStateCopyEntry,
);

const notFound = Object.assign(
  ({ pathwayLine, exam, variant = 0 }: NotFoundCopyArgs = {}): EmptyStateCopyEntry => {
    const headlines = [
      "Page not found",
      "This route is unavailable",
      "We couldn’t find that page",
    ] as const;
    const bodies = [
      pathwayLine
        ? `${pathwayLine} lessons and study tools are still available. Use the links below to continue.`
        : "Use the links below to return to a valid study page.",
      exam
        ? `${exam} prep is still available. Use the links below to return to the correct route.`
        : "Use the links below to return to a valid page.",
      pathwayLine
        ? `We couldn’t open this route, but ${pathwayLine} lessons and study tools are still available.`
        : "We couldn’t open this route. Use the links below to continue.",
    ] as const;

    return {
      headline: headlines[Math.abs(variant) % headlines.length],
      body: bodies[Math.abs(variant) % bodies.length],
      hint: "Choose a nearby study destination below.",
    };
  },
  {
    headline: "Page not found",
    body: "Use the links below to return to a valid study page.",
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
      "Use the links below to return to a valid page.",
      "Use the recovery links below to continue.",
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
    body: "Use the links below to return to a valid page.",
    hint: "Use one of the recovery links below.",
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
    body: "Once you study, this area shows recent activity and the next recommended step.",
    hint: "Start with a lesson or question set to populate this view.",
  }),
  {
    headline: "No study activity yet",
    body: "Once you study, this area shows recent activity and the next recommended step.",
    hint: "Start with a lesson or question set to populate this view.",
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
    body: "Start a practice exam to generate readiness data and session history.",
  },
  noHistoryYet,
  noRecommendations: {
    headline: "Recommendations will show up here",
    body: "As you study, this area will show the next recommended step. Start with a lesson or question set.",
  },
  entitlementLocked,
  accountLowData: {
    headline: "There isn’t much here yet",
    body: "This area fills in after your first lessons or practice sessions.",
  },
  notFound,
  notFoundMinimal,
} as const;
