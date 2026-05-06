import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  AnonymizationStrategyId,
  BenchmarkingDomain,
  FederationAnalyticsSurface,
  ResearchParticipationClass,
  StrategicReportKind,
  WorkforceReadinessSignalFamily,
} from "@/lib/platform/phase13";

describe("phase13 strategic intelligence contracts", () => {
  it("defines benchmarking domains with aggregation-safe prefixes", () => {
    assert.ok(BenchmarkingDomain.pathwayReadiness.startsWith("bench."));
  });

  it("scopes workforce signals without diagnostic naming", () => {
    assert.ok(WorkforceReadinessSignalFamily.cohortRisk.includes("cohort"));
  });

  it("enumerates federation surfaces for institutional isolation", () => {
    assert.ok(
      Object.values(FederationAnalyticsSurface).every((s) => s.startsWith("fed.")),
    );
  });

  it("defines anonymization and research opt-in strategy ids", () => {
    assert.equal(ResearchParticipationClass.optInAggregatesOnly, "research.opt_in_aggregates_only");
    assert.ok(AnonymizationStrategyId.kAnonymityCohort.startsWith("anon."));
  });

  it("defines strategic report kinds", () => {
    assert.ok(StrategicReportKind.pathwayHealth.startsWith("strategic."));
  });
});
