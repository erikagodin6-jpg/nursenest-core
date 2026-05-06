/**
 * Push notification channel taxonomy (study-focused; no marketing blast channels).
 * Server delivery remains future work — types + documentation only.
 */

export const PUSH_CHANNELS = {
  /** Spaced review / due cards / study reminders tied to learner activity. */
  study: "study",
  /** Subscription lifecycle (renewal, payment issue) — transactional tone. */
  subscription: "subscription",
  /** Streak maintenance nudge (single daily cap enforced server-side when implemented). */
  streak: "streak",
  /** Resume in-progress lesson or practice session. */
  continueLearning: "continue_learning",
} as const;

export type PushChannelId = (typeof PUSH_CHANNELS)[keyof typeof PUSH_CHANNELS];

export type PushMessageBase = {
  channel: PushChannelId;
  title: string;
  body: string;
  /** Deep link path without scheme, e.g. `/lesson/slug` */
  dataPath?: string;
};
