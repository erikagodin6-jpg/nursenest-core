/**
 * Educational cognition orchestration — public API.
 */
export {
  resolveEducationalCognitionContext,
  resolveEducationalCognitionFromSession,
} from "@/lib/educational-cognition/resolve-educational-cognition-context";
export {
  resolveLearnerCognitionSubstrate,
  type LearnerCognitionSubstrate,
  type ResolveLearnerCognitionSubstrateInput,
} from "@/lib/educational-cognition/cognition-substrate";
export { buildCognitionIntegratedStudyPlan } from "@/lib/educational-cognition/study-plan-cognition";
export {
  buildAiTutorContextFromCognition,
  tutoringPromptContextFromAiEnvelope,
} from "@/lib/educational-cognition/ai-tutor-cognition-envelope";
export {
  emitCognitionTelemetryV5,
  buildCognitionTelemetryV5Payload,
  recordCognitionContextResolved,
  recordCognitionContextResolvedWithEntitlement,
} from "@/lib/educational-cognition/cognition-telemetry-v5";
export {
  COGNITION_SNAPSHOT_VERSION,
  type CognitionReliabilityTier,
  type DurableLearnerCognitionEnvelope,
} from "@/lib/educational-cognition/cognition-snapshot-types";
export {
  migrateCognitionEnvelopeFromStorage,
  buildFreshCognitionEnvelope,
} from "@/lib/educational-cognition/cognition-snapshot-migrations";
export {
  cognitionReliabilityWeights,
  maxGraphStepsForReliability,
  inferReliabilityFromPersistSource,
} from "@/lib/educational-cognition/cognition-reliability";
export { governCognitionHydration } from "@/lib/educational-cognition/cognition-hydration-governance";
export {
  loadDurableLearnerCognition,
  loadDurableLearnerCognitionEnvelope,
  loadDurableLearnerCognitionEnvelopeSync,
  saveDurableLearnerCognition,
  hydratePriorLearnerState,
  warmDurableLearnerCognitionCache,
  persistLearnerCognitionToDatabase,
  isLearnerCognitionStale,
} from "@/lib/educational-cognition/learner-cognition-persistence";
export {
  readLearnerCognitionEnvelopeFromDatabase,
  writeLearnerCognitionEnvelopeToDatabase,
} from "@/lib/educational-cognition/learner-cognition-persistence-prisma";
export {
  graphNextStepsFromSteps,
  validateGraphContinuityReplay,
} from "@/lib/educational-cognition/graph-next-step-continuity";
export {
  buildCognitionVersionMetadata,
  cognitionVersionTelemetryProps,
  COGNITION_SCHEMA_VERSION,
  HYDRATION_VERSION,
} from "@/lib/educational-cognition/cognition-version-governance";
export { assessCognitionEnvelopeIntegrity } from "@/lib/educational-cognition/cognition-envelope-integrity";
export { repairDurableLearnerCognitionEnvelope } from "@/lib/educational-cognition/repair-durable-learner-cognition-envelope";
export {
  prepareDurableCognitionEnvelope,
  versionMetadataForEnvelope,
} from "@/lib/educational-cognition/prepare-durable-cognition-envelope";
export {
  probeLearnerCognitionPersistence,
  assertCognitionPersistenceReadiness,
} from "@/lib/educational-cognition/cognition-persistence-observability";
export { resolveMeasurementCognitionInput } from "@/lib/educational-cognition/resolve-measurement-cognition-input";
export { aggregateEducatorCognitionFromProcessStore } from "@/lib/educational-cognition/educator-cognition-aggregation";
export {
  bootstrapCognitionPersistenceRuntime,
  assertPersistenceRuntimeReady,
} from "@/lib/educational-cognition/persistence-runtime-governance";
export {
  applyOntologyLifecycleToEnvelope,
} from "@/lib/educational-cognition/ontology-lifecycle-governance";
export { replayCognitionEnvelope as replayCognitionEnvelopeHydration } from "@/lib/educational-cognition/cognition-replay-runtime";
export {
  buildCognitionExplainability,
  serializeExplainabilityForPublic,
} from "@/lib/educational-cognition/cognition-explainability";
export { governMeasurementCognitionInput } from "@/lib/educational-cognition/measurement-source-governance";
export {
  governTelemetryIsolation,
  filterCognitionTelemetryProps,
  partitionTelemetrySurface,
} from "@/lib/educational-cognition/telemetry-isolation-governance";
export { classifyTelemetryRoute } from "@/lib/educational-cognition/telemetry-route-classification";
export { projectAdaptiveWireBundleFromCognition } from "@/lib/educational-cognition/adaptive-wire-cognition-projection";
export {
  deriveTimingRiskBand,
  deriveTimingCognitionSignals,
  studyPlanDensityFromTiming,
} from "@/lib/learner/rn-coaching-intelligence/timing-cognition";
export type {
  EducationalCognitionContext,
  ResolveEducationalCognitionOptions,
  CognitionCapability,
  DashboardCompositionContract,
  RemediationOrchestrationContract,
  EducationalOntologySlice,
} from "@/lib/educational-cognition/educational-cognition-types";
export {
  captureCognitionOrchestratedEvent,
  COGNITION_TELEMETRY_EVENTS,
} from "@/lib/educational-cognition/cognition-telemetry-governance";
export {
  buildLearnerDashboardCognitionSurface,
  resolveDashboardEducationalCognition,
  resolvePrimaryDashboardPathwayId,
} from "@/lib/educational-cognition/learner-dashboard-cognition-surface";
export type { LearnerDashboardCognitionSurface } from "@/lib/educational-cognition/learner-dashboard-cognition-surface";
export {
  governClientTelemetryCapture,
  captureClientOrchestratedAnalytics,
} from "@/lib/educational-cognition/client-telemetry-governance";
export { governAiGeneratedEducationalCopy } from "@/lib/educational-cognition/ai-orchestration-middleware";
export {
  getCognitionGovernanceViolationCount,
  resetCognitionGovernanceCounters,
} from "@/lib/educational-cognition/governance-observability";
export {
  resolveReportCardCognitionOrchestration,
  presentReportCardCognition,
  type ReportCardCognitionOrchestration,
} from "@/lib/educational-cognition/report-card-cognition";
export {
  buildGovernedAdaptiveRecommendations,
  type GovernedAdaptiveRecommendations,
} from "@/lib/educational-cognition/adaptive-recommendation-cognition";
export { buildMeasurementCognitionSlice } from "@/lib/educational-cognition/measurement-cognition-bridge";
export {
  resolveUnifiedEducationalSubstrate,
  primaryGraphNextBestAction,
  EDUCATIONAL_ONTOLOGY_NAMESPACE,
  type UnifiedEducationalSubstrate,
  type ResolveUnifiedSubstrateInput,
} from "@/lib/educational-graph/unified-educational-substrate";
export {
  composeDashboardOrchestrationFromSubstrate,
  resolveDashboardSubstrateOrchestration,
  type DashboardSubstrateOrchestration,
} from "@/lib/educational-cognition/dashboard-substrate-orchestration";
