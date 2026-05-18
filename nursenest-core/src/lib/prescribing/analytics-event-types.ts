import type { PrescribingActivityType } from "./adaptive-sequencing-types";

export type PrescribingAnalyticsEventType =
  | "activity_started"
  | "activity_completed"
  | "safety_miss_recorded"
  | "stewardship_penalty_recorded"
  | "remediation_assigned"
  | "competency_tier_changed";

export interface PrescribingAnalyticsEvent {
  id: string;
  learnerId: string;
  eventType: PrescribingAnalyticsEventType;
  activityType?: PrescribingActivityType;
  domain?: string;
  score?: number;
  stewardshipScore?: number;
  safetyMisses?: number;
  metadata?: Record<string, string | number | boolean>;
  occurredAtIso: string;
}

export interface PrescribingAnalyticsSummary {
  learnerId: string;
  totalEvents: number;
  completedActivities: number;
  averageScore: number;
  averageStewardshipScore: number;
  totalSafetyMisses: number;
  weakestDomains: string[];
}
