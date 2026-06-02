/**
 * Guard the shared learning-module layout contract.
 *
 * Run from `nursenest-core/`:
 *   node --import tsx --test tests/contracts/global-learning-module-layout.contract.test.ts
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

const ROOT = process.cwd();

function read(relativePath: string): string {
  return fs.readFileSync(path.resolve(ROOT, relativePath), "utf8");
}

const SHARED_SHELL = "src/components/learner-modules/learning-module-shell.tsx";
const SHARED_CSS = "src/app/learning-module-shell.css";
const LEARNER_LAYOUT = "src/app/(app)/app/(learner)/layout.tsx";
const ECG_LAYOUT = "src/app/(app)/modules/ecg/layout.tsx";
const SHELL_MODE = "src/lib/learner/learner-shell-mode.ts";

const WORKSTATION_SHELLS = [
  {
    label: "Labs",
    path: "src/components/labs/labs-workstation-shell.tsx",
    moduleKey: "labs",
    legacyHook: "data-nn-labs-workstation",
  },
  {
    label: "Med Calculations",
    path: "src/components/med-calculations/med-calc-workstation-shell.tsx",
    moduleKey: "med-calculations",
    legacyHook: "data-nn-med-calc-workstation",
  },
  {
    label: "Clinical Skills",
    path: "src/components/clinical-skills/clinical-skills-workstation-shell.tsx",
    moduleKey: "clinical-skills",
    legacyHook: "data-nn-clinical-skills-workstation",
  },
  {
    label: "ECG",
    path: "src/components/ecg-module/ecg-workstation-shell.tsx",
    moduleKey: "ecg",
    legacyHook: "data-nn-ecg-workstation",
  },
];

describe("global learning-module layout contract", () => {
  it("centralizes workstation layout in one shared shell and stylesheet", () => {
    const shell = read(SHARED_SHELL);
    const css = read(SHARED_CSS);

    assert.match(shell, /export function LearningModuleShell/, "shared shell component must exist");
    assert.match(shell, /data-nn-learning-module-shell/, "shared shell needs a stable QA hook");
    assert.match(shell, /data-nn-learning-module-sidebar/, "shared shell must expose the sidebar region");
    assert.match(shell, /data-nn-learning-module-main/, "shared shell must expose the main content region");
    assert.match(shell, /legacyRootDataAttribute/, "shared shell must preserve existing module QA hooks");

    assert.match(css, /--nn-learning-module-sidebar-width:\s*clamp\(15rem,\s*18vw,\s*17rem\)/, "sidebar width must remain capped at 240-272px");
    assert.match(css, /--nn-learning-module-gap:\s*clamp\(1\.5rem,\s*3vw,\s*2\.5rem\)/, "sidebar/content gap must remain 24-40px");
    assert.match(css, /grid-template-columns:\s*var\(--nn-learning-module-sidebar-width\)\s*minmax\(0,\s*1fr\)/, "desktop layout must use the shared sidebar/content grid");
    assert.match(css, /\[data-nn-learning-module-card\]/, "shared card interaction contract must exist");
  });

  for (const workstation of WORKSTATION_SHELLS) {
    it(`${workstation.label} uses the shared workstation shell`, () => {
      const source = read(workstation.path);

      assert.match(source, /LearningModuleShell/, `${workstation.label} must inherit the shared shell`);
      assert.match(source, new RegExp(`moduleKey="${workstation.moduleKey}"`), `${workstation.label} needs a stable module key`);
      assert.match(source, new RegExp(`legacyRootDataAttribute="${workstation.legacyHook}"`), `${workstation.label} must preserve its legacy root hook`);
      assert.doesNotMatch(source, /grid-template-columns:\s*\[/, `${workstation.label} must not own shell grid classes`);
    });
  }

  it("loads shared learning-module CSS in learner and ECG module layouts", () => {
    assert.match(read(LEARNER_LAYOUT), /@\/app\/learning-module-shell\.css/, "learner app layout must load shared module CSS");
    assert.match(read(ECG_LAYOUT), /@\/app\/learning-module-shell\.css/, "ECG module layout must load shared module CSS");
  });

  it("keeps full NurseNest chrome everywhere except active exam sessions", () => {
    const shellMode = read(SHELL_MODE);

    assert.match(shellMode, /suppressFullChrome:\s*mode === "exam-focused"/, "only exam-focused routes may suppress full chrome");
    assert.doesNotMatch(shellMode, /suppressFullChrome:[^\n]*flashcards-study/, "flashcard study must keep the global NurseNest chrome");
    assert.match(shellMode, /flashcards-study[\s\S]*keep global chrome/, "flashcard study mode should document its global chrome behavior");
  });

  it("opts key module cards into the full-card click and focus contract", () => {
    const labsHub = read("src/components/labs/labs-hub-page.tsx");
    const labsCategory = read("src/components/labs/labs-category-page.tsx");
    const medHub = read("src/components/med-calculations/med-calculations-hub-page.tsx");
    const clinicalHub = read("src/components/clinical-skills/clinical-skills-hub-client.tsx");

    for (const [label, source] of [
      ["Labs Hub", labsHub],
      ["Labs Category", labsCategory],
      ["Med Calculations Hub", medHub],
      ["Clinical Skills Hub", clinicalHub],
    ] as const) {
      assert.match(source, /data-nn-learning-module-card/, `${label} cards must use the shared card behavior hook`);
    }
  });

  it("keeps practice-test discovery cards on dynamic counts instead of vague included labels", () => {
    const practiceHub = read("src/components/student/practice-tests-hub-client.tsx");

    assert.match(practiceHub, /count\.toLocaleString\(\).*Questions/, "practice-test category cards must render the discovered question count");
    assert.doesNotMatch(practiceHub, /:\s*"Included"/, "practice-test cards must not fall back to vague Included labels");
  });

  it("rethrows Next navigation control flow from authenticated module layouts", () => {
    for (const layout of [
      "src/app/(app)/app/(learner)/labs/layout.tsx",
      "src/app/(app)/app/(learner)/med-calculations/layout.tsx",
      "src/app/(app)/app/(learner)/clinical-skills/layout.tsx",
    ]) {
      const source = read(layout);
      assert.match(source, /rethrowNextNavigationControlFlow/, `${layout} must not swallow auth redirects`);
    }
  });
});
