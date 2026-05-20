import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { orchestrateClinicalMeasurement } from "@/lib/measurements/clinical-measurement-orchestrator";
import { orchestrateMeasurementEducationalGraph } from "@/lib/measurements/measurement-graph-integration";
import {
  prioritizeMeasurementInterpretations,
  orderMeasurementsEditorial,
} from "@/lib/measurements/measurement-learner-prioritization";
import { analyzeTrendSeriesV3 } from "@/lib/measurements/measurement-trend-intelligence";
import {
  deriveMeasurementRemediationBundle,
  shouldEmitMeasurementRemediation,
} from "@/lib/measurements/measurement-coaching-bridge";
import { enforceGovernedAiMeasurementCopy } from "@/lib/measurements/measurement-ai-boundary";
import {
  governLoftCaseCopy,
  governEcgDrillCopy,
  loftSafeVitalTrendDisplay,
} from "@/lib/measurements/measurement-surface-convergence";
import { auditMeasurementGovernance } from "@/lib/measurements/measurement-governance-registry";
import { buildMeasurementOrchestrationTelemetry } from "@/lib/measurements/measurement-analytics";

describe("clinical measurement orchestrator", () => {
  it("orchestrates hyperkalemia with trend, competency, and telemetry", () => {
    const result = orchestrateClinicalMeasurement({
      measurement: {
        category: "electrolytes",
        kind: "potassium",
        valueSi: 6.2,
        authoredSystem: "si",
      },
      renderedSystem: "si",
      pathwayId: "us-rn-nclex-rn",
      countryCode: "US",
      trendValuesSi: [5.0, 5.6, 6.2],
      sourceSurface: "labs",
      authenticated: true,
    });
    assert.equal(result.panel.abnormality, "critical");
    assert.ok(result.trend);
    assert.ok(result.competencyLinks.competencyTopicKeys.length > 0);
    assert.ok(result.remediation.topicSlug.length > 0);
    assert.equal(result.telemetry.event, "interpretation_viewed");
    assert.ok(result.governedDisplayText.length > 0);
  });

  it("governs AI narrative at orchestration boundary", () => {
    const governed = enforceGovernedAiMeasurementCopy({
      text: "Convert insulin 10 units to exactly 0.1 mmol/L.",
      surface: "coaching",
      pathwayId: "us-rn-nclex-rn",
      applyFallback: true,
    });
    assert.ok(governed.blocked || governed.fallbackApplied);
  });
});

describe("trend intelligence V3", () => {
  it("detects worsening potassium with monitoring urgency", () => {
    const t = analyzeTrendSeriesV3({
      category: "electrolytes",
      valuesSi: [4.8, 5.4, 6.1],
      kind: "potassium",
    });
    assert.ok(t);
    assert.ok(t!.trajectoryConfidence >= 0.5);
    assert.ok(
      t!.trajectory === "worsening" ||
        t!.trajectory === "acute_change" ||
        t!.deteriorationAcceleration > 0,
    );
    assert.ok(t!.monitoringUrgencyScore >= 50);
  });

  it("flags oscillation on rebound electrolyte pattern", () => {
    const t = analyzeTrendSeriesV3({
      category: "electrolytes",
      valuesSi: [6.0, 4.8, 5.9, 4.7],
      kind: "potassium",
    });
    assert.ok(t);
    assert.ok(t!.oscillationDetected || t!.reboundInstability);
  });
});

describe("learner-state prioritization", () => {
  it("boosts authenticated ordering for measurement weaknesses", () => {
    const ordered = prioritizeMeasurementInterpretations({
      items: [
        { category: "glucose", kind: "glucose", valueSi: 12 },
        { category: "electrolytes", kind: "potassium", valueSi: 6.0 },
      ],
      learnerState: {
        version: 1,
        updatedAt: new Date().toISOString(),
        pathwayId: "us-rn-nclex-rn",
        readinessTrajectory: [],
        pacingProfile: "balanced",
        hesitationProfile: "high",
        reasoningPatterns: ["lab_trend_reasoning_gap"],
        measurementWeaknesses: ["potassium_trend"],
        competencyStates: [],
        remediationFatigueScore: 0.2,
        confidenceInstability: 0,
        readinessMomentum: 0,
      },
      authenticated: true,
      pathwayId: "us-rn-nclex-rn",
    });
    assert.equal(ordered[0]?.kind, "potassium");
  });

  it("keeps editorial ordering for public surfaces", () => {
    const ordered = orderMeasurementsEditorial([
      {
        category: "glucose",
        kind: "glucose",
        valueSi: 14,
        priorityScore: 40,
        learnerStateReason: "Editorial",
        weaknessPattern: null,
        measurementTags: [],
      },
      {
        category: "electrolytes",
        kind: "sodium",
        valueSi: 150,
        priorityScore: 60,
        learnerStateReason: "Editorial",
        weaknessPattern: null,
        measurementTags: [],
      },
    ]);
    assert.equal(ordered.length, 2);
    assert.ok(ordered[0]!.priorityScore >= ordered[1]!.priorityScore);
  });
});

describe("remediation coaching bridge", () => {
  it("dedupes remediation when fatigue is high", () => {
    const bundle = deriveMeasurementRemediationBundle({
      category: "electrolytes",
      kind: "potassium",
      valueSi: 6.1,
      pathwayId: "us-rn-nclex-rn",
      fatigueScore: 0.85,
      learnerState: null,
    });
    assert.ok(bundle.fatigueSuppressed || bundle.effectivePriority < 70);
    assert.ok(!shouldEmitMeasurementRemediation({ bundle, minPriority: 80 }));
  });
});

describe("educational graph integration", () => {
  it("links measurement nodes without orphan hrefs", () => {
    const graph = orchestrateMeasurementEducationalGraph({
      topicSlug: "electrolytes",
      pathwayId: "us-rn-nclex-rn",
      sourceSurface: "labs",
      measurement: {
        category: "electrolytes",
        kind: "potassium",
        valueSi: 6.0,
        authoredSystem: "si",
      },
    });
    assert.ok((graph.measurementNode?.interpretationGuideIds.length ?? 0) > 0);
    assert.ok(graph.measurementNode!.reasoningChain.length > 0);
    const hrefs = graph.traversal.steps.map((s) => s.href).filter(Boolean) as string[];
    if (hrefs.length > 1) {
      assert.equal(new Set(hrefs).size, hrefs.length);
    }
  });
});

describe("AI boundary enforcement", () => {
  it("blocks unsafe conversion claims on tutor surface", () => {
    const r = enforceGovernedAiMeasurementCopy({
      text: "Convert insulin 10 units to exactly 0.1 mmol/L for the exam.",
      surface: "ai_tutor",
      applyFallback: true,
    });
    assert.ok(r.blocked);
    assert.ok(r.fallbackApplied);
  });
});

describe("orchestration telemetry", () => {
  it("builds canonical orchestration payloads", () => {
    const payload = buildMeasurementOrchestrationTelemetry({
      event: "remediation_triggered",
      surface: "dashboard",
      pathwayId: "ca-rpn-rex-pn",
      competencyId: "electrolyte_fluid_balance",
      trendSeverity: "critical",
      monitoringPriority: 88,
    });
    assert.equal(payload.event, "remediation_triggered");
    assert.equal(payload.competencyId, "electrolyte_fluid_balance");
  });
});

describe("governance registry fourth pass", () => {
  it("includes orchestrator and AI coverage metrics", () => {
    const audit = auditMeasurementGovernance();
    assert.ok(audit.orchestrated >= 1);
    assert.ok(audit.aiGoverned >= 3);
    assert.ok(audit.governed >= 8);
  });
});

describe("surface convergence adapters", () => {
  it("governs LOFT case copy with loft-safe token path", () => {
    const out = governLoftCaseCopy("Potassium [[potassium:6.2:mmol/L]] is urgent", "SI");
    assert.match(out, /6\.2 mmol\/L|potassium/i);
    assert.ok(!/convert insulin/i.test(out));
  });

  it("governs ECG drill rationale", () => {
    const out = governEcgDrillCopy("Review ST elevation before calling STEMI.", "SI");
    assert.ok(out.length > 10);
  });

  it("uses loft-safe vital trend display in simulation", () => {
    const label = loftSafeVitalTrendDisplay("worsening", true);
    assert.ok(label);
    assert.ok(!/worsening/i.test(label ?? ""));
  });
});
