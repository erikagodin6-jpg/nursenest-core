import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CLEARANCE_DEFINITIONS } from "@/lib/physiology-monitor/competency-clearance";
import { SIMULATION_CATALOG } from "@/lib/physiology-monitor/simulation-catalog";
import { buildSimulationContentAuditReport, PHASE7_SIMULATION_TARGETS } from "@/lib/physiology-monitor/simulation-phase7-audit";

describe("simulation phase 7 content audit", () => {
  it("uses actual catalog counts and exposes per-profession launch gaps", () => {
    const report = buildSimulationContentAuditReport(SIMULATION_CATALOG, "2026-05-30T00:00:00.000Z");

    assert.equal(report.totalSimulations, SIMULATION_CATALOG.length);
    assert.equal(report.targetTotal, Object.values(PHASE7_SIMULATION_TARGETS).reduce((sum, target) => sum + target, 0));
    assert.equal(report.byProfession.RN.actual, SIMULATION_CATALOG.filter((sim) => sim.profession.includes("RN")).length);
    assert.equal(report.byProfession.RPN.actual, SIMULATION_CATALOG.filter((sim) => sim.profession.includes("RPN")).length);
    assert.ok(report.totalGap > 0, "current authored catalog should honestly report the remaining Phase 7 scale gap");
  });

  it("inventories every simulation with NCJMM, NGN, clearance, and remediation mapping fields", () => {
    const report = buildSimulationContentAuditReport(SIMULATION_CATALOG, "2026-05-30T00:00:00.000Z");

    assert.equal(report.rows.length, SIMULATION_CATALOG.length);
    for (const row of report.rows) {
      assert.ok(row.id);
      assert.ok(row.professions.length > 0);
      assert.ok(row.ncjmmDomains.length > 0);
      assert.ok(row.ngnFormats.length > 0);
      assert.ok(row.remediationMappings.length > 0);
      assert.equal(typeof row.completeness.patientHistory, "boolean");
      assert.equal(typeof row.completeness.sbarHandoff, "boolean");
    }
  });

  it("tracks every formal clearance in the mapping audit", () => {
    const report = buildSimulationContentAuditReport(SIMULATION_CATALOG, "2026-05-30T00:00:00.000Z");

    for (const clearance of CLEARANCE_DEFINITIONS) {
      assert.ok(report.clearanceCoverage[clearance.id], `missing clearance audit for ${clearance.id}`);
    }
  });
});

