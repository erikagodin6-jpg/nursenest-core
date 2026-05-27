/**
 * Static guard for the full platform premium convergence pass.
 *
 * Run from `nursenest-core/`:
 *   node --import tsx --test tests/contracts/premium-full-platform-convergence.contract.test.ts
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

const ROOT = process.cwd();
const CSS_PATH = path.resolve(ROOT, "src/app/full-platform-convergence.css");
const GLOBALS_PATH = path.resolve(ROOT, "src/app/globals.css");
const REPORT_PATH = path.resolve(ROOT, "docs/reports/premium-full-platform-convergence.md");
const SCREENSHOT_DIR = path.resolve(ROOT, "docs/screenshots/premium-full-platform-convergence");
const PRACTICE_HUB_PATH = path.resolve(ROOT, "src/app/(app)/app/(learner)/practice-tests/page.tsx");
const FLASHCARDS_HUB_CLIENT_PATH = path.resolve(ROOT, "src/components/flashcards/flashcards-hub-client.tsx");
const PRACTICE_HUB_CLIENT_PATH = path.resolve(ROOT, "src/components/student/practice-tests-hub-client.tsx");
const CAT_ALIAS_PATH = path.resolve(ROOT, "src/app/(app)/app/(learner)/cat/page.tsx");
const CAT_START_ALIAS_PATH = path.resolve(ROOT, "src/app/(app)/app/(learner)/practice-tests/start/page.tsx");
const CAT_LAUNCH_ALIAS_PATH = path.resolve(ROOT, "src/app/(app)/app/(learner)/practice-tests/cat-launch/page.tsx");
const PRACTICE_RUN_LOADER_PATH = path.resolve(ROOT, "src/app/(app)/app/(learner)/practice-tests/[id]/practice-test-runner-loader.tsx");
const PRACTICE_RUN_CLIENT_PATH = path.resolve(ROOT, "src/components/student/practice-test-runner-client.tsx");
const PRACTICE_SHELL_BOOTSTRAP_PATH = path.resolve(ROOT, "src/lib/practice-tests/load-practice-test-shell-bootstrap.ts");
const PREMIUM_SHELL_RESOLVER_PATH = path.resolve(ROOT, "src/lib/practice-tests/resolve-premium-nclex-shell-route.ts");
const FOCUSED_EXAM_HELPER_PATH = path.resolve(ROOT, "src/lib/learner/focused-exam-shell.ts");
const EXAM_SESSION_SHELL_PATH = path.resolve(ROOT, "src/components/exam/exam-session-shell.tsx");

const REQUIRED_THEMES = ["ocean", "blossom", "midnight", "sunset", "aurora"] as const;
const REQUIRED_FRAME_GROUPS = [
  "exam-study-system",
  "learner-cockpit",
  "account-platform",
  "clinical-modules",
  "admin-preview",
] as const;
const REQUIRED_MODULE_FILES = [
  ["practice-tests", "src/components/student/practice-tests-hub-client.tsx"],
  ["practice-tests", "src/components/flashcards/flashcards-pathway-pick-surface.tsx"],
  ["cat", "src/components/student/pathway-cat-session-start-client.tsx"],
  ["lessons", "src/app/(app)/app/(learner)/lessons/page.tsx"],
  ["exam-session", "src/components/exam/exam-session-shell.tsx"],
  ["practice-session", "src/components/study/practice-session-layout.tsx"],
  ["flashcards", "src/components/flashcards/flashcards-hub-client.tsx"],
  ["learner-dashboard", "src/components/student/learner-dashboard-page-shell.tsx"],
  ["billing", "src/components/student/learner-billing-page-content.tsx"],
  ["account-deletion", "src/components/account/account-delete-danger-zone.tsx"],
  ["ecg", "src/components/ecg-module/ecg-module-page.tsx"],
  ["labs", "src/components/labs/labs-hub-page.tsx"],
  ["med-calculations", "src/components/med-calculations/med-calculations-hub-page.tsx"],
  ["clinical-scenarios", "src/components/scenarios/ScenarioStudyShell.tsx"],
  ["admin-dashboard", "src/components/admin/admin-dashboard-overview.tsx"],
  ["admin-clinical-scenarios", "src/app/(admin)/admin/clinical-scenarios/page.tsx"],
] as const;

function read(filePath: string): string {
  return fs.readFileSync(filePath, "utf8");
}

describe("premium full platform convergence", () => {
  const css = read(CSS_PATH);
  const globals = read(GLOBALS_PATH);

  it("imports the additive full-platform convergence layer", () => {
    assert.match(globals, /@import "\.\/full-platform-convergence\.css";/, "globals.css must import the convergence layer");
  });

  it("keeps all five required public themes covered", () => {
    for (const theme of REQUIRED_THEMES) {
      assert.match(css, new RegExp(`html\\[data-theme="${theme}"\\]`), `${theme} must be covered`);
    }
    assert.match(css, /--nn-platform-theme-covered\s*:\s*1/, "theme coverage sentinel missing");
  });

  it("declares shared layout, touch, mobile, sticky, focus, and reduced-motion primitives", () => {
    for (const pattern of [
      /--nn-platform-radius-card/,
      /--nn-platform-gap-section/,
      /--nn-platform-touch-target/,
      /focus-visible/,
      /env\(safe-area-inset-bottom/,
      /overflow-x:\s*clip/,
      /prefers-reduced-motion:\s*reduce/,
      /data-nn-premium-platform-sticky-controls/,
    ]) {
      assert.match(css, pattern, `missing platform primitive: ${pattern}`);
    }
  });

  it("covers every plan family with platform hooks", () => {
    for (const family of ["exam-study", "learner-account", "clinical", "admin-preview"]) {
      assert.match(css, new RegExp(`data-nn-premium-platform-family="${family}"`), `${family} family styling missing`);
    }
  });

  it("adds representative module hooks across study, account, clinical, and admin surfaces", () => {
    for (const [module, relativePath] of REQUIRED_MODULE_FILES) {
      const source = read(path.resolve(ROOT, relativePath));
      assert.match(source, /data-nn-premium-full-platform-convergence/, `${relativePath} missing root convergence hook`);
      assert.match(source, /data-nn-premium-platform-family/, `${relativePath} missing family hook`);
      assert.match(source, new RegExp(`data-nn-premium-platform-module="${module}"|data-nn-premium-platform-module=\\{`), `${relativePath} missing module hook for ${module}`);
    }
  });

  it("archives Figma-first PNG evidence for required frame groups, viewports, and themes", () => {
    for (const group of REQUIRED_FRAME_GROUPS) {
      for (const theme of REQUIRED_THEMES) {
        for (const viewport of ["desktop", "mobile"]) {
          const filePath = path.join(SCREENSHOT_DIR, `${group}-${theme}-${viewport}.png`);
          assert.ok(fs.existsSync(filePath), `${filePath} must exist`);
        }
      }
    }
  });

  it("keeps a module-by-module audit report with unresolved risk tracking", () => {
    const report = read(REPORT_PATH);
    for (const phrase of [
      "Module Audit Matrix",
      "Exam / Study Systems",
      "Learner Cockpit And Account Platform",
      "Clinical Modules",
      "Admin And Preview Cohesion",
      "Unresolved Issues",
      "Truthpack Constraint",
    ]) {
      assert.match(report, new RegExp(phrase), `${phrase} missing from report`);
    }
  });

  it("keeps practice exams on the single shared setup architecture", () => {
    const practiceHub = read(PRACTICE_HUB_PATH);
    const practiceClient = read(PRACTICE_HUB_CLIENT_PATH);
    const flashcardsClient = read(FLASHCARDS_HUB_CLIENT_PATH);

    assert.match(practiceHub, /PracticeTestsHubClient/, "practice hub must render the canonical setup client");
    assert.doesNotMatch(practiceHub, /startMode/, "practice hub must not revive legacy startMode branching");
    assert.doesNotMatch(practiceHub, /\bcat\?:/, "practice hub must not accept legacy cat query aliases");
    assert.doesNotMatch(practiceHub, /FlashcardsPathwayPickSurface/, "practice hub must not route through an extra pathway-pick setup screen");
    assert.doesNotMatch(practiceHub, /<Suspense/, "practice hub must not add a second loading shell around the setup client");
    assert.match(practiceClient, /SharedStudySetupLayout/, "practice must reuse shared setup layout");
    assert.match(practiceClient, /SharedStudySetupSurface/, "practice must reuse shared setup surface");
    assert.match(practiceClient, /nn-flashcards-hub-hero/, "practice hub landing must use the same hero shell as flashcards");
    assert.match(practiceClient, /nn-flashcards-deck-library-surface/, "practice hub category surface must mirror flashcards");
    assert.match(practiceClient, /nn-flashcards-setup-panel/, "practice hub fine-tune panel must mirror flashcards");
    assert.match(practiceClient, /nn-flashcards-sticky-start/, "practice hub mobile CTA must mirror flashcards");
    assert.doesNotMatch(practiceClient, /Configure session/, "practice hub must not keep a separate visible configure-session landing block");
    assert.match(practiceClient, /data-nn-e2e-cat-simple-landing/, "CAT mode must render a simple landing instead of the practice setup chooser");
    assert.match(practiceClient, /data-nn-e2e-cat-start-exam[\s\S]*Start/, "CAT landing must expose one direct Start action");
    assert.match(practiceClient, /catPresentationMode:\s*"exam_simulation"/, "CAT starts must behave like exam simulation");
    assert.match(practiceClient, /catExamFeedbackMode:\s*"test"/, "CAT starts must not show live rationales");
    assert.match(practiceClient, /topicNames:\s*\[\]/, "CAT starts must not depend on selected setup categories");
    assert.doesNotMatch(
      practiceHub,
      /requireExplicitRequestedPathwayId:\s*true/,
      "practice hub must not force an extra pathway-pick landing page when a pathway can be inferred",
    );
    assert.match(practiceClient, /launchingHref/, "practice/CAT starts must keep visible launching feedback after session creation");
    assert.match(practiceClient, /hardFallbackDelayMs:\s*5000/, "practice/CAT starts need a bounded navigation fallback instead of a stalled CTA");
    assert.match(practiceClient, /setLaunchingHref\(resumeHref\)/, "resume launches must keep the same visible transition state as fresh starts");
    assert.equal(
      (practiceClient.match(/data-nn-qa-practice-hub-start-test/g) ?? []).length,
      1,
      "practice setup must expose one canonical Start action",
    );
    assert.match(flashcardsClient, /SharedStudySetupLayout/, "flashcards must remain on shared setup layout");
    assert.match(flashcardsClient, /SharedStudySetupSurface/, "flashcards must remain on shared setup surface");
  });

  it("keeps practice aliases as redirects without duplicate setup screens", () => {
    for (const relPath of [
      "src/app/(app)/app/(learner)/practice/page.tsx",
      "src/app/(app)/app/(learner)/practice-exams/page.tsx",
      "src/app/(app)/app/(learner)/exams/page.tsx",
      "src/app/(app)/app/(learner)/cat/page.tsx",
    ]) {
      const source = read(path.resolve(ROOT, relPath));
      assert.match(source, /redirect\(/, `${relPath} must redirect to canonical practice-tests`);
      assert.match(source, /\/app\/practice-tests/, `${relPath} must target /app/practice-tests`);
      assert.doesNotMatch(source, /PracticeTestsHubClient|PracticeTestsPage/, `${relPath} must not mount duplicate setup UI`);
      assert.doesNotMatch(source, /startMode/, `${relPath} must not inject legacy startMode`);
    }
  });

  it("keeps active CAT route tree on unified setup → bootstrap → exam runner", () => {
    const catAlias = read(CAT_ALIAS_PATH);
    const startAlias = read(CAT_START_ALIAS_PATH);
    const launchAlias = read(CAT_LAUNCH_ALIAS_PATH);
    const practiceClient = read(PRACTICE_HUB_CLIENT_PATH);
    const bootstrap = read(PRACTICE_SHELL_BOOTSTRAP_PATH);
    const resolver = read(PREMIUM_SHELL_RESOLVER_PATH);
    const runnerLoader = read(PRACTICE_RUN_LOADER_PATH);

    assert.match(catAlias, /q\.set\("catLaunch",\s*"1"\)/, "/app/cat must open the canonical practice hub in CAT mode");
    assert.match(startAlias, /redirect\(`\/app\/practice-tests\?\$\{q\.toString\(\)\}`\)/, "/app/practice-tests/start must be a redirect alias only");
    assert.match(launchAlias, /appPathwayCatSessionStartPath/, "/app/practice-tests/cat-launch must redirect into the hub CAT query");
    assert.doesNotMatch(startAlias + launchAlias, /PathwayCatSessionStartClient/, "active aliases must not mount the legacy CAT start client");
    assert.match(practiceClient, /selectionMode:\s*"cat"/, "unified setup must create CAT sessions from the shared setup client");
    assert.match(bootstrap, /resolvePremiumNclexShellRoute/, "session page must resolve the exam shell from persisted session config");
    assert.match(resolver, /cfg\.selectionMode\s*===\s*"cat"[\s\S]*return "cat"/, "CAT sessions must resolve to the unified CAT exam runner");
    assert.match(runnerLoader, /NclexCatRunner/, "runner loader must mount the unified CAT runner");
    assert.match(runnerLoader, /NclexPracticeRunner/, "runner loader must mount the unified practice runner");
    assert.doesNotMatch(runnerLoader, /PracticeTestRunPageSkeleton/, "runner loader must not add a second loading shell after the route fallback");
  });

  it("keeps practice session continuity local state bounded to active sessions", () => {
    const runnerClient = read(PRACTICE_RUN_CLIENT_PATH);

    assert.match(runnerClient, /PRACTICE_RESUME_STORAGE_KEY/, "runner must know the hub resume key");
    assert.match(runnerClient, /clearStoredPracticeResume\(testId\)/, "runner must clear stale local resume pointers after terminal states");
    assert.match(runnerClient, /status === "COMPLETED" \|\| status === "ABANDONED"/, "resume cleanup must be tied to terminal session states");
  });

  it("keeps focused exam sessions isolated from learner dashboard chrome", () => {
    const helper = read(FOCUSED_EXAM_HELPER_PATH);
    const examShell = read(EXAM_SESSION_SHELL_PATH);

    assert.match(helper, /PRACTICE_TEST_SESSION_PREFIX\s*=\s*"\/app\/practice-tests\/"/);
    assert.match(helper, /"start"/);
    assert.match(helper, /"cat-insights"/);
    assert.match(helper, /"results"/);
    assert.doesNotMatch(examShell, /<footer|SiteFooter|LearnerStudyNextBlock|Recommendation/i);
  });
});
