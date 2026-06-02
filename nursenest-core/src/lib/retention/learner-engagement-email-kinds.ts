/**
 * Kinds stored in {@link prisma.emailNotificationLog} for learner engagement / retention.
 * Keep values stable — used for idempotency and cooldown queries.
 */
export const LEARNER_ENGAGEMENT_EMAIL_KINDS = [
  "welcome",
  "welcome_followup_3d",
  "welcome_followup_7d",
  "first_exam",
  "weak_area",
  "weak_area_study_nudge",
  "inactive_nudge",
  "progress_digest",
  "study_plan_nudge",
  "milestone_lessons",
  "new_content_roundup",
  "renewal_reminder_7d",
  "renewal_reminder_3d",
  "renewal_reminder_day_of",
  "feature_discovery_ecg",
  "feature_discovery_labs",
  "feature_discovery_medication_math",
  "feature_discovery_clinical_skills",
  "win_back_new_features",
] as const;

export type LearnerEngagementEmailKind = (typeof LEARNER_ENGAGEMENT_EMAIL_KINDS)[number];
