import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { checksToStatusMap, classifyOverallStatus } from "@/lib/admin/system-status-classify";
import type { SystemCheckResult } from "@/lib/admin/system-status-types";

function mk(
  id: SystemCheckResult["id"],
  status: SystemCheckResult["status"],
  overrides: Partial<SystemCheckResult> = {},
): SystemCheckResult {
  return {
    id,
    name: id,
    status,
    summary: "",
    details: {},
    checkedAt: new Date().toISOString(),
    responseTimeMs: 1,
    ...overrides,
  };
}

const sixHealthy = (): SystemCheckResult[] => [
  mk("appLiveness", "healthy"),
  mk("appReadiness", "healthy"),
  mk("database", "healthy"),
  mk("queueHealth", "healthy"),
  mk("contentHealth", "healthy"),
  mk("configSanity", "healthy"),
];

describe("classifyOverallStatus", () => {
  it("returns healthy when all checks healthy", () => {
    assert.equal(classifyOverallStatus(sixHealthy()), "healthy");
  });

  it("returns failed when appReadiness fails", () => {
    const checks = [
      mk("appLiveness", "healthy"),
      mk("appReadiness", "failed"),
      mk("database", "healthy"),
      mk("queueHealth", "healthy"),
      mk("contentHealth", "healthy"),
      mk("configSanity", "healthy"),
    ];
    assert.equal(classifyOverallStatus(checks), "failed");
  });

  it("returns failed when database fails", () => {
    const checks = [
      mk("appLiveness", "healthy"),
      mk("appReadiness", "healthy"),
      mk("database", "failed"),
      mk("queueHealth", "healthy"),
      mk("contentHealth", "healthy"),
      mk("configSanity", "healthy"),
    ];
    assert.equal(classifyOverallStatus(checks), "failed");
  });

  it("returns failed when configSanity fails", () => {
    const checks = [
      mk("appLiveness", "healthy"),
      mk("appReadiness", "healthy"),
      mk("database", "healthy"),
      mk("queueHealth", "healthy"),
      mk("contentHealth", "healthy"),
      mk("configSanity", "failed"),
    ];
    assert.equal(classifyOverallStatus(checks), "failed");
  });

  it("returns degraded when queueHealth degraded but critical checks healthy", () => {
    const checks = [
      mk("appLiveness", "healthy"),
      mk("appReadiness", "healthy"),
      mk("database", "healthy"),
      mk("queueHealth", "degraded"),
      mk("contentHealth", "healthy"),
      mk("configSanity", "healthy"),
    ];
    assert.equal(classifyOverallStatus(checks), "degraded");
  });

  it("returns degraded when any non-critical check fails", () => {
    const checks = [
      mk("appLiveness", "healthy"),
      mk("appReadiness", "healthy"),
      mk("database", "healthy"),
      mk("queueHealth", "failed"),
      mk("contentHealth", "healthy"),
      mk("configSanity", "healthy"),
    ];
    assert.equal(classifyOverallStatus(checks), "degraded");
  });

  it("returns degraded when contentHealth degraded", () => {
    const checks = [...sixHealthy().map((c) => (c.id === "contentHealth" ? mk("contentHealth", "degraded") : c))];
    assert.equal(classifyOverallStatus(checks), "degraded");
  });

  it("returns degraded when database is degraded (critical but not failed)", () => {
    const checks = [...sixHealthy().map((c) => (c.id === "database" ? mk("database", "degraded") : c))];
    assert.equal(classifyOverallStatus(checks), "degraded");
  });
});

describe("checksToStatusMap", () => {
  it("maps ids to statuses", () => {
    const m = checksToStatusMap([mk("configSanity", "failed"), mk("database", "healthy")]);
    assert.equal(m.configSanity, "failed");
    assert.equal(m.database, "healthy");
  });
});
