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

describe("classifyOverallStatus", () => {
  it("returns healthy when all checks healthy", () => {
    const checks: SystemCheckResult[] = [
      mk("appLiveness", "healthy"),
      mk("appReadiness", "healthy"),
      mk("database", "healthy"),
      mk("auth", "healthy"),
      mk("openai", "healthy"),
      mk("stripe", "healthy"),
    ];
    assert.equal(classifyOverallStatus(checks), "healthy");
  });

  it("returns failed when appReadiness fails", () => {
    const checks = [mk("appReadiness", "failed"), mk("database", "healthy"), mk("auth", "healthy")];
    assert.equal(classifyOverallStatus(checks), "failed");
  });

  it("returns failed when database fails", () => {
    const checks = [mk("appReadiness", "healthy"), mk("database", "failed"), mk("auth", "healthy")];
    assert.equal(classifyOverallStatus(checks), "failed");
  });

  it("returns failed when auth fails", () => {
    const checks = [mk("appReadiness", "healthy"), mk("database", "healthy"), mk("auth", "failed")];
    assert.equal(classifyOverallStatus(checks), "failed");
  });

  it("returns degraded when non-critical check fails (e.g. openai) but critical ok", () => {
    const checks = [
      mk("appReadiness", "healthy"),
      mk("database", "healthy"),
      mk("auth", "healthy"),
      mk("openai", "failed"),
    ];
    assert.equal(classifyOverallStatus(checks), "degraded");
  });

  it("returns degraded when any check is degraded", () => {
    const checks = [
      mk("appReadiness", "healthy"),
      mk("database", "healthy"),
      mk("auth", "healthy"),
      mk("stripe", "degraded"),
    ];
    assert.equal(classifyOverallStatus(checks), "degraded");
  });
});

describe("checksToStatusMap", () => {
  it("maps ids to statuses", () => {
    const m = checksToStatusMap([mk("auth", "failed"), mk("stripe", "healthy")]);
    assert.equal(m.auth, "failed");
    assert.equal(m.stripe, "healthy");
  });
});
