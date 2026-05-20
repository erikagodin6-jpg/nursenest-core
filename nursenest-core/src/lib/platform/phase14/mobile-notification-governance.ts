/**
 * Phase 14 — **Push notification governance** (types only; no FCM/APNs wiring).
 *
 * Classifies notification intents for consent, frequency caps, and study-distraction policy.
 */

export const PushNotificationClass = {
  transactionalAccount: "push.class.transactional_account",
  studyReminder: "push.class.study_reminder",
  streakOrEngagementNudge: "push.class.engagement_nudge",
  productAnnouncement: "push.class.product_announcement",
  marketingPromo: "push.class.marketing_promo",
  securityAlert: "push.class.security_alert",
} as const;

export type PushNotificationClass = (typeof PushNotificationClass)[keyof typeof PushNotificationClass];

/** Per-class consent and quiet-hours expectations. */
export type PushNotificationGovernanceMatrix = {
  readonly class: PushNotificationClass;
  readonly requiresExplicitOptIn: boolean;
  readonly respectsLearnerQuietHours: boolean;
  readonly mayIncludePaidUpsell: boolean;
};

/** Rate-limit dimensions for batching sends (planning type). */
export type PushNotificationRateLimitAxis =
  | "per_user_per_day"
  | "per_device_per_hour"
  | "per_campaign_global";

/** Payload boundary: no secrets, no full exam content in push bodies. */
export type PushNotificationPayloadBoundary = {
  readonly maxPlaintextChars: number;
  readonly deepLinkMustTarget: "marketing_or_learner_web_routes_only";
  readonly excludes: readonly ["admin_urls", "signed_cookie_values", "stripe_ids"];
};
