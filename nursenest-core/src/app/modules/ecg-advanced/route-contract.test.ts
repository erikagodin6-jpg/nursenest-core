import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

test("/modules/ecg-advanced uses the dedicated Advanced ECG access loader", () => {
  const page = fs.readFileSync(path.join(process.cwd(), "src/app/modules/ecg-advanced/page.tsx"), "utf8");
  const helper = fs.readFileSync(path.join(process.cwd(), "src/app/modules/ecg-advanced/_page-shell.tsx"), "utf8");
  assert.match(page, /renderAdvancedEcgPage/);
  assert.match(helper, /loadAdvancedEcgAccess/);
  assert.match(helper, /AdvancedEcgLearnerPage/);
  assert.doesNotMatch(page, /requireEcgModuleAccess/);
});

test("/modules/ecg-advanced specialty learner tree includes the approved section routes", () => {
  for (const route of [
    "src/app/modules/ecg-advanced/foundations/page.tsx",
    "src/app/modules/ecg-advanced/rhythm-interpretation/page.tsx",
    "src/app/modules/ecg-advanced/12-lead/page.tsx",
    "src/app/modules/ecg-advanced/telemetry/page.tsx",
    "src/app/modules/ecg-advanced/acls/page.tsx",
    "src/app/modules/ecg-advanced/cases/page.tsx",
    "src/app/modules/ecg-advanced/exams/page.tsx",
    "src/app/modules/ecg-advanced/pacemakers/page.tsx",
    "src/app/modules/ecg-advanced/pacemakers/foundations/page.tsx",
    "src/app/modules/ecg-advanced/pacemakers/malfunctions/page.tsx",
    "src/app/modules/ecg-advanced/pacemakers/critical-care/page.tsx",
    "src/app/modules/ecg-advanced/pacemakers/cases/page.tsx",
  ]) {
    assert.equal(fs.existsSync(path.join(process.cwd(), route)), true, `${route} should exist`);
  }
});

test("pacemaker learner routes stay inside the dedicated Advanced ECG access shell", () => {
  for (const route of [
    "src/app/modules/ecg-advanced/pacemakers/page.tsx",
    "src/app/modules/ecg-advanced/pacemakers/foundations/page.tsx",
    "src/app/modules/ecg-advanced/pacemakers/malfunctions/page.tsx",
    "src/app/modules/ecg-advanced/pacemakers/critical-care/page.tsx",
    "src/app/modules/ecg-advanced/pacemakers/cases/page.tsx",
  ]) {
    const src = fs.readFileSync(path.join(process.cwd(), route), "utf8");
    assert.match(src, /renderAdvancedEcgPage/);
    assert.match(src, /currentSectionSlug: "pacemakers"/);
  }
});

test("advanced ECG learner routes remain noindex", () => {
  const layout = fs.readFileSync(path.join(process.cwd(), "src/app/modules/ecg-advanced/layout.tsx"), "utf8");
  assert.match(layout, /index: false/);
  assert.match(layout, /googleBot:\s*\{\s*index: false/);
});

test("advanced ECG learner surface includes launch-ready ownership and purchase-state messaging", () => {
  const learnerPage = fs.readFileSync(
    path.join(process.cwd(), "src/components/advanced-ecg/advanced-ecg-learner-page.tsx"),
    "utf8",
  );
  assert.match(learnerPage, /Advanced ECG purchase complete/);
  assert.match(learnerPage, /Open launch page/);
  assert.match(learnerPage, /ADVANCED_ECG_PRICE_LABEL/);
  assert.match(learnerPage, /lifetime access/);
});

test("legacy /modules/ecg/advanced routes redirect into the specialty Advanced ECG tree", () => {
  for (const route of [
    "src/app/modules/ecg/advanced/page.tsx",
    "src/app/modules/ecg/advanced/lessons/page.tsx",
    "src/app/modules/ecg/advanced/video-drills/page.tsx",
    "src/app/modules/ecg/advanced/scenarios/page.tsx",
    "src/app/modules/ecg/advanced/worksheets/page.tsx",
  ]) {
    const src = fs.readFileSync(path.join(process.cwd(), route), "utf8");
    assert.match(src, /redirect\("\/modules\/ecg-advanced/);
  }
});
