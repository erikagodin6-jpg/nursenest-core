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
  "Some advanced services are temporarily unavailable. Your learning activities remain fully accessible.";

export function isTier2OptionalService(service: string): service is Tier2OptionalService {
  return TIER_2_OPTIONAL_SERVICES.includes(service as Tier2OptionalService);
}

