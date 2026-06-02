export type {
  TutoringAuditHook,
  TutoringRecommendationAuditPayload,
} from "@/lib/ai-tutor/audit-hooks";
export { noopTutoringAuditHook } from "@/lib/ai-tutor/audit-hooks";
export {
  defaultWeakTopicFallback,
  runDeterministicTutoringFallbackChain,
  type DeterministicTutoringFallback,
} from "@/lib/ai-tutor/deterministic-fallback";
export {
  guardTutoringEntitlementSnapshot,
  isValidTutoringEntitlementSnapshot,
  requireTutoringEntitlementSnapshot,
  type TutoringGuardFailure,
  type TutoringGuardResult,
} from "@/lib/ai-tutor/entitlement-guard";
export type {
  AdaptiveRemediationSurface,
  ExplanationSignalRef,
  ExplanationTrace,
} from "@/lib/ai-tutor/explainable-remediation";
export {
  composeTutoringPromptEnvelope,
  escapePlainTextForPromptFragment,
} from "@/lib/ai-tutor/prompt-composition";
export { TUTORING_SAFETY_DISCLAIMERS } from "@/lib/ai-tutor/safety-copy";
export { createTutoringProvider, type TutoringProviderFactoryKind } from "@/lib/ai-tutor/tutoring-provider-factory";
export { StubTutoringProvider } from "@/lib/ai-tutor/tutoring-provider";
export {
  assertTutoringUsesGraphStepsOnly,
  buildGovernedTutoringPromptContext,
  buildTutoringGraphContinuitySnapshot,
  resolveTutoringGraphSteps,
  tutoringLineageTelemetryProps,
} from "@/lib/ai-tutor/ai-tutor-substrate-governance";
export { captureTutoringContinuityReplay, recoverTutoringContinuation } from "@/lib/ai-tutor/tutoring-continuity-replay";
export type {
  TutoringEntitlementSnapshot,
  TutoringExplainOptions,
  TutoringGenerateOptions,
  TutoringPromptContext,
  TutoringProvider,
  TutoringRecommendation,
  TutoringRecommendationSource,
} from "@/lib/ai-tutor/types";
