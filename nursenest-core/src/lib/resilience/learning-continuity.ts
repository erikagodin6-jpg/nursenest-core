export const TIER_1_LEARNING_ACTIVITIES = [
  "flashcards",
  "practice_questions",
  "cat_exams",
  "lessons",
  "clinical_skills",
  "pharmacology",
  "ecg",
] as const;

export type Tier1LearningActivity = (typeof TIER_1_LEARNING_ACTIVITIES)[number];

export const TIER_2_OPTIONAL_SERVICES = [
  "adaptive_learning",
  "recommendations",
  "analytics",
  "friends",
  "referrals",
  "leaderboards",
  "readiness",
  "gamification",
  "notifications",
  "cache_invalidation",
] as const;

export type Tier2OptionalService = (typeof TIER_2_OPTIONAL_SERVICES)[number];

export const EMERGENCY_STUDY_MODE_MESSAGE =
  "Advanced services are temporarily unavailable. Your study session remains fully accessible.";

export const BACKUP_DELIVERY_MODE_MESSAGE = "Loading study session...";

export const LEARNING_DELIVERY_THRESHOLDS_MS = {
  primaryTarget: 2_000,
  backupDelivery: 5_000,
  warning: 10_000,
  critical: 30_000,
  syntheticInterval: 5 * 60 * 1000,
} as const;

export type LearningDeliveryLevel = "primary" | "backup" | "emergency";

export function classifyLearningStartupDuration(durationMs: number): LearningDeliveryLevel {
  if (durationMs >= LEARNING_DELIVERY_THRESHOLDS_MS.critical) return "emergency";
  if (durationMs >= LEARNING_DELIVERY_THRESHOLDS_MS.backupDelivery) return "backup";
  return "primary";
}

export function isTier2OptionalService(service: string): service is Tier2OptionalService {
  return TIER_2_OPTIONAL_SERVICES.includes(service as Tier2OptionalService);
}
