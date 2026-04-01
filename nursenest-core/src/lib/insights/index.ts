/**
 * NurseNest learner insight engine — re-exports for dashboards, planner, and APIs.
 * Interpretation lives in `learner-insight-engine.ts`; readiness math stays in `readiness-score.ts`.
 */

export type {
  CatInsightSummary,
  DailyAdaptivePlan,
  ExplainableAction,
  FlashcardInsight,
  KnowledgeGap,
  LearnerInsightSnapshot,
  PerformanceAnalysis,
  RecommendationBundle,
  WeakAreaInsight,
  WeaknessTier,
} from "@/lib/insights/types";
export { buildLearnerInsightSnapshot, type InsightBuildOverrides } from "@/lib/insights/learner-insight-engine";
export { buildPerformanceAnalysis, mockPerformanceTrend } from "@/lib/insights/performance-metrics";
export { buildWeakAreaInsights } from "@/lib/insights/weak-area-engine";
export { detectKnowledgeGaps } from "@/lib/insights/knowledge-gaps";
