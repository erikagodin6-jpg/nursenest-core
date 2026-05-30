/**
 * Guard the shared Practice Tests launcher flow across tiers/pathways.
 *
 * Run from `nursenest-core/`:
 *   node --import tsx --test tests/contracts/practice-tests-launcher-restoration.contract.test.ts
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

const ROOT = process.cwd();
const PRACTICE_PAGE_PATH = path.resolve(ROOT, "src/app/(app)/app/(learner)/practice-tests/page.tsx");
const PRACTICE_CLIENT_PATH = path.resolve(ROOT, "src/components/student/practice-tests-hub-client.tsx");
const PRACTICE_START_ALIAS_PATH = path.resolve(ROOT, "src/app/(app)/app/(learner)/practice-tests/start/page.tsx");
const CAT_ALIAS_PATH = path.resolve(ROOT, "src/app/(app)/app/(learner)/cat/page.tsx");
const CAT_LAUNCH_ALIAS_PATH = path.resolve(ROOT, "src/app/(app)/app/(learner)/practice-tests/cat-launch/page.tsx");
const HUB_LINKS_PATH = path.resolve(ROOT, "src/lib/marketing/pathway-hub-app-questions-href.ts");
const PATHWAY_CAT_FLOW_PATH = path.resolve(ROOT, "src/lib/exam-pathways/pathway-cat-flow.ts");

function read(filePath: string): string {
  return fs.readFileSync(filePath, "utf8");
}

describe("practice tests launcher restoration", () => {
  const practicePage = read(PRACTICE_PAGE_PATH);
  const practiceClient = read(PRACTICE_CLIENT_PATH);
  const startAlias = read(PRACTICE_START_ALIAS_PATH);
  const catAlias = read(CAT_ALIAS_PATH);
  const catLaunchAlias = read(CAT_LAUNCH_ALIAS_PATH);
  const hubLinks = read(HUB_LINKS_PATH);
  const pathwayCatFlow = read(PATHWAY_CAT_FLOW_PATH);

  it("keeps tier hub practice CTAs pointed at the shared launcher route", () => {
    assert.match(hubLinks, /pathwayHubAppPracticeTestsHref/, "pathway practice-tests href helper must exist");
    assert.match(hubLinks, /return `\/app\/practice-tests\?\$\{q\.toString\(\)\}`/, "practice helper must route to /app/practice-tests setup page");
    assert.doesNotMatch(hubLinks, /\/app\/practice-tests\/start/, "tier practice CTAs must not use the start alias");
    assert.doesNotMatch(hubLinks, /\/app\/practice-tests\/cat-launch/, "tier practice CTAs must not use the cat-launch alias");
    assert.doesNotMatch(hubLinks, /catLaunch/, "tier practice CTAs must not force CAT mode");
  });

  it("keeps pathway-scoped practice test entries on setup instead of forced CAT launch", () => {
    const sessionStartFunction = pathwayCatFlow.slice(
      pathwayCatFlow.indexOf("export function appPathwayCatSessionStartPath"),
      pathwayCatFlow.indexOf("/** Deep-link shim only"),
    );
    assert.match(sessionStartFunction, /\/app\/practice-tests\?\$\{q\.toString\(\)\}/);
    assert.doesNotMatch(sessionStartFunction, /catLaunch|PRACTICE_TESTS_HUB_CAT_LAUNCH_PARAM/);
    assert.match(pathwayCatFlow, /resolvedPathwayId \? appPathwayCatSessionStartPath\(resolvedPathwayId\) : "\/app\/practice-tests"/);
    assert.doesNotMatch(pathwayCatFlow, /\/app\/practice-tests\?catLaunch=1/);
  });

  it("renders the shared setup launcher before a practice or CAT session starts", () => {
    assert.match(practicePage, /PracticeTestsHubClient/, "practice-tests page must render the shared setup client");
    assert.match(practiceClient, /data-nn-e2e-practice-exams-builder/, "practice launcher must expose category selection");
    assert.match(practiceClient, /data-nn-e2e-practice-setup-panel/, "practice launcher must expose setup controls");
    assert.match(practiceClient, /Exam Mode/, "practice launcher must expose practice/CAT mode selection");
    assert.match(practiceClient, /Study Focus/, "practice launcher must expose weak/missed/unseen filters");
    assert.match(practiceClient, /Question Count/, "practice launcher must expose question count controls");
    assert.match(practiceClient, /data-nn-qa-practice-hub-start-test/, "practice launcher must expose the single Start Exam CTA");
    assert.doesNotMatch(practiceClient, /data-nn-e2e-practice-single-landing/, "practice must not use a simplified bypass landing");
  });

  it("keeps compatibility aliases landing on the launcher without forcing CAT mode", () => {
    for (const [label, source] of [
      ["/app/practice-tests/start", startAlias],
      ["/app/cat", catAlias],
      ["/app/practice-tests/cat-launch", catLaunchAlias],
    ] as const) {
      assert.match(source, /redirect\(/, `${label} must remain a redirect alias`);
      assert.match(source, /\/app\/practice-tests/, `${label} must target the shared launcher`);
      assert.doesNotMatch(source, /q\.set\("catLaunch",\s*"1"\)/, `${label} must not force CAT mode`);
      assert.doesNotMatch(source, /catLaunch=1/, `${label} must not bypass the launcher setup`);
      assert.doesNotMatch(source, /PracticeTestsHubClient|PracticeTestsPage/, `${label} must not mount duplicate setup UI`);
    }
  });
});
