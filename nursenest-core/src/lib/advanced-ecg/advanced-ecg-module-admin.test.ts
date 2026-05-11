import assert from "node:assert/strict";
import test from "node:test";

import { buildAdvancedEcgCoverageAdminSnapshot } from "@/lib/advanced-ecg/advanced-ecg-module-admin";

test("advanced ECG admin snapshot exposes ECG depth audit coverage details", () => {
  const snapshot = buildAdvancedEcgCoverageAdminSnapshot();

  assert.equal(snapshot.coveredKeys.includes("sinus_arrhythmia"), true);
  assert.equal(snapshot.coveredKeys.includes("drug_induced_qt_prolongation"), true);
  assert.equal(snapshot.matrix.some((row) => row.key === "artifact_vs_true_rhythm" && row.totalQuestions >= 40), true);
  assert.equal(snapshot.affectedRoutes.includes("/modules/ecg-advanced"), true);
  assert.equal(snapshot.adminPreviewRoutes.includes("/admin/modules/ecg"), true);
  assert.equal(snapshot.advancedTopicsMissingMinimums.length, 0);
});
