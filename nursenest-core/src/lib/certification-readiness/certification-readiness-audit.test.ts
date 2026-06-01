import assert from "node:assert/strict";
import test from "node:test";

import {
  buildCertificationReadinessDashboard,
  CERTIFICATION_AUDIT_TARGETS,
} from "@/lib/certification-readiness/certification-readiness-audit";

test("certification readiness dashboard covers all required ecosystem targets", () => {
  const dashboard = buildCertificationReadinessDashboard(process.cwd());
  const targetIds = new Set(dashboard.rows.map((row) => row.target.id));

  for (const target of CERTIFICATION_AUDIT_TARGETS) {
    assert.ok(targetIds.has(target.id), `missing target ${target.id}`);
  }

  assert.ok(targetIds.has("rn-nclex-rn"));
  assert.ok(targetIds.has("rn-canadian-rn"));
  assert.ok(targetIds.has("pn-rex-pn"));
  assert.ok(targetIds.has("pn-nclex-pn"));
  assert.ok(targetIds.has("np-cnple"));
  assert.ok(targetIds.has("np-fnp"));
  assert.ok(targetIds.has("allied-rt"));
  assert.ok(targetIds.has("allied-paramedic"));
  assert.ok(targetIds.has("allied-ot"));
  assert.ok(targetIds.has("allied-pt"));
  assert.ok(targetIds.has("allied-mlt"));
  assert.ok(targetIds.has("allied-psw"));
});

test("certification readiness dashboard blocks sell-now status below launch thresholds", () => {
  const dashboard = buildCertificationReadinessDashboard(process.cwd());

  for (const row of dashboard.rows) {
    if (row.scores.overallReadiness < 95 || row.scores.monetizationReadiness < 95) {
      assert.ok(!row.monetizationGates.includes("can_sell_now"), `${row.target.id} should not be sell-now eligible`);
    }
  }
});

test("certification readiness dashboard exposes executive gap priorities", () => {
  const dashboard = buildCertificationReadinessDashboard(process.cwd());

  assert.ok(dashboard.executiveSummary.top10HighestValueGaps.length > 0);
  assert.ok(dashboard.executiveSummary.estimatedCommercializationPriority.length > 0);
  assert.ok(dashboard.rows.some((row) => row.inventory.lessons > 0), "expected repository-evidenced lesson counts");
  assert.ok(dashboard.rows.some((row) => row.inventory.questionBank > 0), "expected repository-evidenced question counts");
});
