/**
 * Phase 9 — **push / local notification** contracts (no FCM/APNs wiring).
 *
 * Implementations: FCM (Android), APNs (iOS), Web Push, or OS-local notifications only.
 */

export enum MobileNativeNotificationChannel {
  StudyStreak = "study_streak",
  Remediation = "remediation",
  Cohort = "cohort",
  Onboarding = "onboarding",
  SubscriptionRenewal = "subscription_renewal",
  AssignmentDeadline = "assignment_deadline",
  ProductAnnouncement = "product_announcement",
}

/** Per-channel opt-in stored locally + mirrored server-side when account exists. */
export type MobileNativeNotificationOptInFlags = Partial<Record<MobileNativeNotificationChannel, boolean>>;

export type MobileNativePushEventBase = {
  readonly channel: MobileNativeNotificationChannel;
  readonly title: string;
  readonly body: string;
  /** Deep link or app route path — resolved by host. */
  readonly actionPath?: string;
};

export type MobileNativeStudyStreakPushPayload = MobileNativePushEventBase & {
  readonly channel: MobileNativeNotificationChannel.StudyStreak;
  readonly streakDays: number;
};

export type MobileNativeRemediationPushPayload = MobileNativePushEventBase & {
  readonly channel: MobileNativeNotificationChannel.Remediation;
  readonly topicId: string;
  readonly weakAreaLabel: string;
};

export type MobileNativeCohortPushPayload = MobileNativePushEventBase & {
  readonly channel: MobileNativeNotificationChannel.Cohort;
  readonly cohortId: string;
};

export type MobileNativeOnboardingPushPayload = MobileNativePushEventBase & {
  readonly channel: MobileNativeNotificationChannel.Onboarding;
  readonly stepId: string;
};

export type MobileNativeSubscriptionRenewalPushPayload = MobileNativePushEventBase & {
  readonly channel: MobileNativeNotificationChannel.SubscriptionRenewal;
  readonly renewsAtIso: string;
};

export type MobileNativeAssignmentDeadlinePushPayload = MobileNativePushEventBase & {
  readonly channel: MobileNativeNotificationChannel.AssignmentDeadline;
  readonly assignmentId: string;
  readonly dueAtIso: string;
};

export type MobileNativePushEventPayload =
  | MobileNativeStudyStreakPushPayload
  | MobileNativeRemediationPushPayload
  | MobileNativeCohortPushPayload
  | MobileNativeOnboardingPushPayload
  | MobileNativeSubscriptionRenewalPushPayload
  | MobileNativeAssignmentDeadlinePushPayload;

/** Analytics may record channel + template id — never raw notification body in third-party PII fields. */
export type MobileNativePushAnalyticsHook = (evt: {
  readonly phase: "scheduled" | "delivered" | "opened" | "suppressed_opt_out";
  readonly channel: MobileNativeNotificationChannel;
  readonly templateId: string;
}) => void;

/** Provider abstraction — native project supplies implementation. */
export interface MobileNativePushNotificationProvider {
  readonly requestPermission: () => Promise<"granted" | "denied" | "provisional">;
  readonly getOptIns: () => Promise<MobileNativeNotificationOptInFlags>;
  readonly setOptIns: (flags: MobileNativeNotificationOptInFlags) => Promise<void>;
  readonly showLocalTestNotification?: (payload: MobileNativePushEventPayload) => Promise<void>;
}
