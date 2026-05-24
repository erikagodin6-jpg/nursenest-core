import type { EducationalCognitionContext } from "@/lib/educational-cognition/educational-cognition-types";
import type { EduGraphStep } from "@/lib/educational-graph/graph-step-contract";
import type { CognitionReliabilityTier } from "@/lib/educational-cognition/cognition-snapshot-types";
import {
  buildCognitionVersionMetadata,
  type CognitionVersionMetadata,
} from "@/lib/educational-cognition/cognition-version-governance";
import type { RnCompetencyMasteryState } from "@/lib/learner/rn-coaching-intelligence/learner-state-types";

export type CognitionConfidenceTier = "low" | "medium" | "high";

export type CognitionExplainability = {
  derivedFrom: Array<"learner_state" | "educational_graph" | "remediation" | "readiness" | "measurement">;
  competencySignals: string[];
  remediationSignals: string[];
  graphSignals: string[];
  confidenceTier: CognitionConfidenceTier;
  ontologyRevision: string;
  recommendationReason: string;
  version: CognitionVersionMetadata;
};

function confidenceFromReliability(tier: CognitionReliabilityTier): CognitionConfidenceTier {
  if (tier === "validated" || tier === "persisted") return "high";
  if (tier === "inferred") return "medium";
  return "low";
}

export function buildCognitionExplainability(args: {
  ctx: EducationalCognitionContext;
  graphSteps?: EduGraphStep[];
  reliabilityTier?: CognitionReliabilityTier;
  primaryReason?: string;
}): CognitionExplainability {
  const { ctx } = args;
  const reliability = args.reliabilityTier ?? "inferred";
  const weakCompetencies = ctx.learnerState.competencyStates
    .filter((c: RnCompetencyMasteryState) => c.persistentWeak || c.masteryScore < 55)
    .map((c: RnCompetencyMasteryState) => c.competencyId.replace(/_/g, " "))
    .slice(0, 5);

  const remediationSignals: string[] = [];
  if (ctx.remediation.fatigueCapActive) remediationSignals.push("remediation_fatigue_cap");
  if (ctx.remediation.maxRecommendations <= 3) remediationSignals.push("bounded_remediation_queue");
  if (weakCompetencies.length) remediationSignals.push(`weak_competencies:${weakCompetencies.length}`);

  const graphSignals = (args.graphSteps ?? []).slice(0, 4).map((s) => `${s.stepKind}:${s.stepId}`);

  const derivedFrom: CognitionExplainability["derivedFrom"] = ["learner_state", "educational_graph"];
  if (remediationSignals.length) derivedFrom.push("remediation");
  if (ctx.readinessResult?.score != null) derivedFrom.push("readiness");
  if (ctx.measurement.priorityCount > 0) derivedFrom.push("measurement");

  const reason =
    args.primaryReason ??
    (graphSignals.length
      ? "Graph-orchestrated next step from weak competency and measurement signals."
      : "Adaptive plan from governed learner cognition state.");

  return {
    derivedFrom,
    competencySignals: weakCompetencies,
    remediationSignals,
    graphSignals,
    confidenceTier: confidenceFromReliability(reliability),
    ontologyRevision: buildCognitionVersionMetadata().ontologyRevision,
    recommendationReason: reason,
    version: buildCognitionVersionMetadata({
      envelopeVersion: ctx.learnerState.version,
    }),
  };
}

/** Telemetry-safe projection — no raw psychometric internals. */
/** Public-safe explainability — string derivedFrom for anonymous fallback compatibility. */
export function serializeExplainabilityForPublic(
  explain:
    | CognitionExplainability
    | {
        derivedFrom: string[];
        competencySignals: string[];
        remediationSignals: string[];
        graphSignals: string[];
        confidenceTier: CognitionConfidenceTier;
        ontologyRevision: string;
        recommendationReason: string;
      },
): {
  derivedFrom: string[];
  competencySignals: string[];
  remediationSignals: string[];
  graphSignals: string[];
  confidenceTier: CognitionConfidenceTier;
  ontologyRevision: string;
  recommendationReason: string;
} {
  const derived =
    Array.isArray(explain.derivedFrom) && typeof explain.derivedFrom[0] === "string"
      ? (explain.derivedFrom as string[])
      : (explain as CognitionExplainability).derivedFrom;
  return {
    derivedFrom: derived.map(String),
    competencySignals: explain.competencySignals.slice(0, 8),
    remediationSignals: explain.remediationSignals.slice(0, 8),
    graphSignals: explain.graphSignals.slice(0, 8),
    confidenceTier: explain.confidenceTier,
    ontologyRevision: explain.ontologyRevision,
    recommendationReason: explain.recommendationReason,
  };
}

/** Audit-safe serialization — counts and tiers only. */
export function serializeExplainabilityForAudit(
  explain: CognitionExplainability,
): Record<string, string | number | boolean> {
  return explainabilityTelemetryProps(explain);
}

export function explainabilityTelemetryProps(
  explain: CognitionExplainability,
): Record<string, string | number | boolean> {
  return {
    confidence_tier: explain.confidenceTier,
    derived_from: explain.derivedFrom.join(","),
    competency_signal_count: explain.competencySignals.length,
    remediation_signal_count: explain.remediationSignals.length,
    graph_signal_count: explain.graphSignals.length,
    ontology_revision: explain.ontologyRevision,
    envelope_version: explain.version.envelopeVersion,
    graph_version: explain.version.graphVersion,
  };
}
