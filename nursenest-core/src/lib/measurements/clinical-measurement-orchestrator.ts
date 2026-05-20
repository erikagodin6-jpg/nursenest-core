/**
 * Canonical clinical measurement orchestration — single entry for interpretation, remediation, AI, telemetry.
 */
import type { AuthoredMeasurement, ClinicalMeasurementSystem } from "@/lib/measurements/measurement-domain";
import { buildInterpretationPanel, type InterpretationPanel } from "@/lib/measurements/measurement-interpretation-engine";
import { expandBedsideCognitionPathway, type BedsideCognitionPathway } from "@/lib/measurements/measurement-reasoning-expansion";
import {
  prioritizeMeasurementInterpretations,
  orderMeasurementsEditorial,
  type MeasurementPriorityItem,
} from "@/lib/measurements/measurement-learner-prioritization";
import { analyzeTrendSeriesV3, type TrendIntelligenceV3Result } from "@/lib/measurements/measurement-trend-intelligence";
import { linkMeasurementToCompetencyGraph } from "@/lib/measurements/measurement-semantic-layer";
import {
  deriveMeasurementRemediationBundle,
  type MeasurementRemediationBundle,
} from "@/lib/measurements/measurement-coaching-bridge";
import { enforceGovernedAiMeasurementCopy, type AiGenerationSurface } from "@/lib/measurements/measurement-ai-boundary";
import {
  buildMeasurementOrchestrationTelemetry,
  trackMeasurementOrchestrationEvent,
} from "@/lib/measurements/measurement-analytics";
import { resolveMeasurementTokens } from "@/lib/measurements/measurement-tokens";
import { legacyToClinicalSystem, clinicalToLegacySystem } from "@/lib/measurements/measurement-domain";
import { getPathwayMeasurementPolicy } from "@/lib/measurements/pathway-measurement-policy";
import type { RnLearnerStateSnapshot } from "@/lib/learner/rn-coaching-intelligence/learner-state-types";
import type { MeasurementSystem } from "@/lib/measurements/measurement-domain";

export type MeasurementSourceSurface =
  | "lessons"
  | "cat"
  | "loft"
  | "practice"
  | "flashcards"
  | "coaching"
  | "ai_tutor"
  | "labs"
  | "dashboard"
  | "cases"
  | "export"
  | "seo";

export type ClinicalMeasurementOrchestrationInput = {
  measurement: AuthoredMeasurement;
  renderedSystem: ClinicalMeasurementSystem;
  pathwayId?: string | null;
  countryCode?: string | null;
  annotation?: string | null;
  trendValuesSi?: number[];
  learnerState?: RnLearnerStateSnapshot | null;
  authenticated?: boolean;
  sourceSurface: MeasurementSourceSurface;
  /** LOFT/case mode — suppress answer-revealing trend phrasing in governed copy. */
  loftSafeCopy?: boolean;
};

export type ClinicalMeasurementOrchestration = {
  panel: InterpretationPanel;
  bedsidePathway: BedsideCognitionPathway;
  trend: TrendIntelligenceV3Result | null;
  competencyLinks: ReturnType<typeof linkMeasurementToCompetencyGraph>;
  remediation: MeasurementRemediationBundle;
  priority: MeasurementPriorityItem;
  governedDisplayText: string;
  telemetry: ReturnType<typeof buildMeasurementOrchestrationTelemetry>;
};

export function orchestrateClinicalMeasurement(
  input: ClinicalMeasurementOrchestrationInput,
): ClinicalMeasurementOrchestration {
  const policy = getPathwayMeasurementPolicy(input.pathwayId, input.countryCode);
  const trend =
    input.trendValuesSi && input.trendValuesSi.length >= 2
      ? analyzeTrendSeriesV3({
          category: input.measurement.category,
          valuesSi: input.trendValuesSi,
          kind: input.measurement.kind,
        })
      : null;

  const panel = buildInterpretationPanel({
    measurement: input.measurement,
    renderedSystem: input.renderedSystem,
    pathwayId: input.pathwayId,
    countryCode: input.countryCode,
    annotation: input.annotation,
    trendValuesSi: input.trendValuesSi,
  });

  const bedsidePathway = expandBedsideCognitionPathway({
    measurement: input.measurement,
    renderedSystem: input.renderedSystem,
    pathwayId: input.pathwayId,
    countryCode: input.countryCode,
    trendValuesSi: input.trendValuesSi,
  });

  const competencyLinks = linkMeasurementToCompetencyGraph({
    category: input.measurement.category,
    kind: input.measurement.kind,
    severity: panel.semantics.severity,
  });

  const priorityItems = prioritizeMeasurementInterpretations({
    items: [
      {
        category: input.measurement.category,
        kind: input.measurement.kind,
        valueSi: input.measurement.valueSi,
        trendValuesSi: input.trendValuesSi,
      },
    ],
    learnerState: input.learnerState,
    pathwayId: input.pathwayId,
    countryCode: input.countryCode,
    authenticated: input.authenticated ?? false,
  });
  const priority =
    priorityItems[0] ??
    orderMeasurementsEditorial([
      {
        category: input.measurement.category,
        kind: input.measurement.kind,
        valueSi: input.measurement.valueSi,
        priorityScore: 50,
        learnerStateReason: "Editorial",
        weaknessPattern: null,
        measurementTags: [],
      },
    ])[0]!;

  const remediation = deriveMeasurementRemediationBundle({
    category: input.measurement.category,
    kind: input.measurement.kind,
    valueSi: input.measurement.valueSi,
    trendValuesSi: input.trendValuesSi,
    pathwayId: input.pathwayId,
    countryCode: input.countryCode,
    learnerState: input.learnerState,
    fatigueScore: input.learnerState?.remediationFatigueScore,
    recentExposureKeys: undefined,
  });

  const legacySystem: MeasurementSystem = clinicalToLegacySystem(input.renderedSystem);
  let governedDisplayText = panel.display;
  if (input.loftSafeCopy && trend) {
    governedDisplayText = `${panel.display} (serial trend — interpret before selecting an action)`;
  }

  const telemetry = buildMeasurementOrchestrationTelemetry({
    event: "interpretation_viewed",
    surface: input.sourceSurface,
    pathwayId: input.pathwayId,
    competencyId: competencyLinks.competencyTopicKeys[0] ?? null,
    interpretationId: competencyLinks.interpretationGuideIds[0] ?? null,
    trendSeverity: panel.semantics.severity,
    learnerStateReason: priority.learnerStateReason,
    monitoringPriority: trend?.monitoringUrgencyScore,
    remediationPriority: remediation.effectivePriority,
    instructionalSystem: policy.instructionalSystem,
    renderedSystem: input.renderedSystem,
  });

  return {
    panel,
    bedsidePathway,
    trend,
    competencyLinks,
    remediation,
    priority,
    governedDisplayText,
    telemetry,
  };
}

/** Governed plain-text resolution for stems, rationales, case copy. */
export function resolveGovernedMeasurementText(args: {
  text: string;
  measurementSystem: MeasurementSystem;
  pathwayId?: string | null;
  countryCode?: string | null;
  loftSafe?: boolean;
}): string {
  const policy = getPathwayMeasurementPolicy(args.pathwayId, args.countryCode);
  const rendered = legacyToClinicalSystem(args.measurementSystem);
  let out = resolveMeasurementTokens(args.text, args.measurementSystem, {
    pathwayId: args.pathwayId,
    countryCode: args.countryCode,
  });
  if (args.loftSafe) {
    out = out.replace(/\bcritical\b/gi, "urgent");
  }
  void policy;
  void rendered;
  return out;
}

export function orchestrateAndTrack(
  input: ClinicalMeasurementOrchestrationInput,
): ClinicalMeasurementOrchestration {
  const result = orchestrateClinicalMeasurement(input);
  void trackMeasurementOrchestrationEvent(result.telemetry);
  return result;
}

export function governAiNarrativeForMeasurement(args: {
  text: string;
  surface: AiGenerationSurface;
  pathwayId?: string | null;
  orchestration?: ClinicalMeasurementOrchestration;
}): string {
  const governed = enforceGovernedAiMeasurementCopy({
    text: args.text,
    surface: args.surface,
    pathwayId: args.pathwayId,
    applyFallback: true,
  });
  if (args.orchestration && !governed.blocked) {
    void trackMeasurementOrchestrationEvent({
      ...args.orchestration.telemetry,
      event: "bedside_escalation_reviewed",
    });
  }
  return governed.text;
}
