/**
 * Adaptive learning foundation (Phase 5) — deterministic recommendation + contracts.
 * Import from `@/lib/adaptive-learning` in server components or API routes only;
 * keep marketing routes free of learner analytics DTOs.
 */
export type * from "@/lib/adaptive-learning/adaptive-learning-types";
export * from "@/lib/adaptive-learning/adaptive-recommendation-engine";
export * from "@/lib/adaptive-learning/post-miss-orchestration";
export * from "@/lib/adaptive-learning/learner-analytics-summary";
export type * from "@/lib/adaptive-learning/clinical-scenario-contracts";
export type {
  AdaptiveAiAssistMode,
  AdaptiveAiOptionalPlannerInput,
} from "@/lib/adaptive-learning/ai-recommendation-guardrails";
