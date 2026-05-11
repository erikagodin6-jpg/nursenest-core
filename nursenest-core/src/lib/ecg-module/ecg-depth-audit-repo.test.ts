import assert from "node:assert/strict";
import test from "node:test";
import { buildRepoEcgDepthAuditSnapshot } from "@/lib/ecg-module/ecg-depth-audit-repo";

test("repo ECG audit snapshot joins core lessons, advanced lessons, and question packs", () => {
  const snapshot = buildRepoEcgDepthAuditSnapshot();

  assert.equal(snapshot.audit.coveredKeys.includes("sinus_arrhythmia"), true);
  assert.equal(snapshot.audit.coveredKeys.includes("junctional_rhythm"), true);
  assert.equal(snapshot.audit.coveredKeys.includes("digoxin_toxicity_pattern"), true);
  assert.equal(snapshot.audit.coveredKeys.includes("drug_induced_qt_prolongation"), true);
  assert.equal(snapshot.advancedCoverage.topics.length >= 17, true);
  assert.equal(snapshot.advancedCoverage.entitlementSummary.advancedEcgBlocked.includes("RPN"), true);
  assert.equal(snapshot.affectedRoutes.includes("/modules/ecg/basic/lessons"), true);
  assert.equal(snapshot.affectedRoutes.includes("/modules/ecg-advanced"), true);
  assert.equal(snapshot.adminPreviewRoutes.includes("/admin/modules/ecg"), true);
});
