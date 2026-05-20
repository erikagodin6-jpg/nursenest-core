/**
 * Translator shape for marketing / learner bundles (no server-only imports).
 */
export type LearnerMarketingT = (
  key: string,
  params?: Record<string, string | number | undefined>,
) => string;
