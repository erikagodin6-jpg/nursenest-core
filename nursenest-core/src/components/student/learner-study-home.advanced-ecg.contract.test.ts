import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

test("learner dashboard loads and renders a dedicated Advanced ECG specialty module card", () => {
  const root = process.cwd();
  const page = readFileSync(path.join(root, "src/app/(student)/app/(learner)/page.tsx"), "utf8");
  const home = readFileSync(path.join(root, "src/components/student/learner-study-home.tsx"), "utf8");

  assert.match(page, /loadAdvancedEcgDashboardCardModel/);
  assert.match(page, /advancedEcgCard=\{advancedEcgCard\}/);
  assert.match(home, /study-specialty-modules/);
  assert.match(home, /Specialty Modules/);
  assert.match(home, /advancedEcgCard/);
  assert.match(home, /data-nn-qa-dashboard-specialty-advanced-ecg/);
});
