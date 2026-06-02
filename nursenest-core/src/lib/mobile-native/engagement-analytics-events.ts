/**
 * Phase 9 — **engagement analytics** typed events (contracts only).
 *
 * - Prefer **server-side aggregation** for DAU/WAU/streaks to avoid exposing PII via new public endpoints.
 * - Clients may emit anonymized metrics through existing product analytics pipelines; do not add public
 *   REST routes that return per-user timelines without authz review.
 */

export type MobileNativeEngagementEventName =
  | "engagement.session_start"
  | "engagement.session_end"
  | "engagement.streak_increment"
  | "engagement.dal_checkpoint"
  | "engagement.return_day_n";

export type MobileNativeEngagementBaseProps = {
  readonly pathwayId?: string;
  readonly surface: "dashboard" | "lessons" | "flashcards" | "practice" | "cat" | "account" | "other";
  /** Monotonic client clock skew allowed; server normalizes. */
  readonly clientTimestampMs: number;
};

export type MobileNativeEngagementSessionStart = MobileNativeEngagementBaseProps & {
  readonly name: "engagement.session_start";
};

export type MobileNativeEngagementSessionEnd = MobileNativeEngagementBaseProps & {
  readonly name: "engagement.session_end";
  readonly durationMs: number;
};

export type MobileNativeEngagementStreakIncrement = MobileNativeEngagementBaseProps & {
  readonly name: "engagement.streak_increment";
  readonly streakLengthDays: number;
};

export type MobileNativeEngagementDalCheckpoint = MobileNativeEngagementBaseProps & {
  readonly name: "engagement.dal_checkpoint";
  /** Day index in product-defined window (no calendar PII requirement). */
  readonly dayIndex: number;
};

export type MobileNativeEngagementReturnDayN = MobileNativeEngagementBaseProps & {
  readonly name: "engagement.return_day_n";
  readonly n: number;
};

export type MobileNativeEngagementEvent =
  | MobileNativeEngagementSessionStart
  | MobileNativeEngagementSessionEnd
  | MobileNativeEngagementStreakIncrement
  | MobileNativeEngagementDalCheckpoint
  | MobileNativeEngagementReturnDayN;

/**
 * Server-side aggregation **placeholder** port — implement in worker/cron behind staff auth or internal jobs.
 * No HTTP handler is defined here by design.
 */
export interface MobileNativeEngagementAggregationPort {
  readonly rollupDailyActiveLearners: (args: { readonly dayUtc: string }) => Promise<void>;
  readonly rollupStreaks: (args: { readonly dayUtc: string }) => Promise<void>;
}
