/**
 * advanced-question-renderers — SSR smoke tests + React identity regression guard
 *
 * Run via:
 *   node --import tsx --test src/components/advanced-question-renderers.test.tsx
 *
 * CONTEXT
 * -------
 * All renderers in client/src/components/advanced-question-renderers.tsx use
 * useState + useI18n (context hook).  These tests verify that every renderer
 * can be SSR-rendered via renderToStaticMarkup without hook/dispatcher errors,
 * now that react/react-dom are unified (symlinked) across client/ and
 * nursenest-core/.
 *
 * HOW THE DUAL-REACT SPLIT WAS FIXED (Phase 2)
 * -----------------------------------------------
 * Before: nursenest-core/node_modules/react was a separate install from
 *   root/node_modules/react, even though both were 19.2.5.  Node's module
 *   cache keys on real file paths — two installs = two objects = two
 *   dispatchers = hooks crash.
 * After: nursenest-core/node_modules/{react,react-dom} are symlinks to
 *   root/node_modules/{react,react-dom}.  require('react') === require('react')
 *   from any location in the repo.
 *
 * useI18n SHIM (Phase 3)
 * ----------------------
 * client/src components import useI18n from "@/lib/i18n".  In the nursenest-core
 * test context, @/ → nursenest-core/src/, which resolves to the shim at
 * nursenest-core/src/lib/i18n.ts.  The shim returns a no-op `t: key => key`
 * and avoids the need for a React context Provider in test trees.
 * This shim is INTENTIONAL — not a dual-React workaround.
 */
import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

// All renderers via the client dispatcher
import {
  ImageBasedRenderer,
  MatrixRenderer,
  TrendRenderer,
  DragDropRenderer,
  CaseStudyRenderer,
} from "@legacy-client/components/advanced-question-renderers";

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const xrayQuestion = {
  id: "xray-ssr-001",
  imageType: "xray" as const,
  stem: "What does this chest radiograph most likely represent?",
  imageDescription: "PA chest radiograph showing bilateral lower lobe opacities with air bronchograms",
  clinicalFindings: ["Bilateral lower lobe infiltrates", "Air bronchograms", "No pleural effusion"],
  options: ["Community-acquired pneumonia", "Pulmonary edema", "Normal", "Pulmonary embolism"],
  correctAnswer: 0,
  rationale: "Bilateral infiltrates with air bronchograms are classic for pneumonia.",
  bodySystem: "Pulmonary",
  tier: "rn",
  difficulty: 2 as const,
};

const matrixQuestion = {
  id: "matrix-ssr-001",
  stem: "Match each assessment finding to its clinical significance.",
  rows: [
    { id: "r1", label: "SpO2 88%" },
    { id: "r2", label: "HR 120 bpm" },
  ],
  columns: [
    { id: "c1", label: "Hypoxemia" },
    { id: "c2", label: "Tachycardia" },
  ],
  correctCells: { r1: ["c1"], r2: ["c2"] },
  selectionMode: "single" as const,
  rationale: "SpO2 < 90% indicates hypoxemia; HR > 100 is tachycardia.",
  bodySystem: "Respiratory",
  tier: "rn",
  difficulty: 1 as const,
};

const trendQuestion = {
  id: "trend-ssr-001",
  stem: "Review the trending vital signs and select the most appropriate interpretation.",
  interpretationQuestion: "What does this trend indicate?",
  timepoints: [
    { timeLabel: "0800", vitals: { HR: "72", BP: "118/76", SpO2: "98%" } },
    { timeLabel: "1000", vitals: { HR: "88", BP: "110/70", SpO2: "95%" } },
    { timeLabel: "1200", vitals: { HR: "104", BP: "98/60", SpO2: "91%" } },
  ],
  options: ["Improving hemodynamics", "Deteriorating perfusion", "Stable baseline", "Hypertensive crisis"],
  correctAnswer: 1,
  rationale: "Decreasing BP, increasing HR, and falling SpO2 indicate deteriorating perfusion.",
  bodySystem: "Cardiovascular",
  tier: "rn",
  difficulty: 2 as const,
};

const dragDropQuestion = {
  id: "dragdrop-ssr-001",
  stem: "Place the nursing assessment steps in the correct priority order.",
  mode: "order" as const,
  items: [
    { id: "a", label: "Assess airway patency" },
    { id: "b", label: "Obtain vital signs" },
    { id: "c", label: "Review medication list" },
  ],
  correctOrder: ["a", "b", "c"],
  rationale: "Airway first (ABC), then vitals, then medications.",
  bodySystem: "Fundamentals",
  tier: "rn",
  difficulty: 1 as const,
};

// ─── Phase 6: React identity regression guard ─────────────────────────────────

test("GUARD: single React runtime — react identity matches react-dom's internal copy", () => {
  // require.resolve follows symlinks to real paths — both must resolve to the SAME file
  const reactFromRoot = require.resolve("react", {
    paths: ["/root/nursenest-core/node_modules"],
  });
  const reactFromNNCore = require.resolve("react", {
    paths: ["/root/nursenest-core/nursenest-core/node_modules"],
  });

  assert.equal(
    reactFromRoot,
    reactFromNNCore,
    `React must resolve to the same physical file from both locations.\nroot:   ${reactFromRoot}\nnn-core: ${reactFromNNCore}`,
  );

  // Object identity: both require() calls must return the same cached module
  const reactA = require("/root/nursenest-core/node_modules/react");
  const reactB = require("/root/nursenest-core/nursenest-core/node_modules/react");
  assert.equal(
    reactA,
    reactB,
    "require('react') from root and nursenest-core must return the same object",
  );

  assert.equal(typeof React.useState, "function", "React.useState is callable");
  assert.equal(typeof React.version, "string", "React.version is defined");
});

test("GUARD: react-dom/server uses the unified React dispatcher (no hook crash sentinel)", () => {
  // If react-dom uses a different React than our test's React, renderToStaticMarkup
  // will throw "Invalid hook call" when any hook fires.
  // A minimal component with useState is the canary.
  function Canary() {
    const [v] = React.useState("ok");
    return React.createElement("span", { "data-testid": "canary" }, v);
  }
  const html = renderToStaticMarkup(React.createElement(Canary));
  assert.match(html, /data-testid="canary"/, "canary hook rendered without crash");
  assert.match(html, />ok</, "useState initial value rendered");
});

// ─── Phase 4: NonECGImageRenderer — xray ─────────────────────────────────────

test("NonECGImageRenderer (xray) SSR-renders without hook errors", () => {
  const html = renderToStaticMarkup(
    React.createElement(ImageBasedRenderer, { question: xrayQuestion }),
  );

  assert.match(
    html,
    new RegExp(`data-testid="question-image-${xrayQuestion.id}"`),
    "question root testid present",
  );
  assert.match(html, /PA chest radiograph/, "image description rendered");
  assert.match(html, /Community-acquired pneumonia/, "answer options rendered");
  // Must NOT trigger ECG layout
  assert.doesNotMatch(html, /data-testid="section-ecg-strip"/, "ECG layout not rendered for xray");
});

test("NonECGImageRenderer (xray) locked ECG flag is ignored for non-ECG types", () => {
  // ecgLocked only gates the ECG branch — xray questions pass through unchanged
  const html = renderToStaticMarkup(
    React.createElement(ImageBasedRenderer, { question: xrayQuestion, ecgLocked: true }),
  );
  assert.match(html, /question-image-xray-ssr-001/, "xray renders despite ecgLocked=true");
  assert.doesNotMatch(html, /section-ecg-paywall/, "paywall not shown for non-ECG");
});

// ─── Phase 4: MatrixRenderer ──────────────────────────────────────────────────

test("MatrixRenderer SSR-renders without hook errors", () => {
  const html = renderToStaticMarkup(
    React.createElement(MatrixRenderer, { question: matrixQuestion }),
  );

  assert.match(
    html,
    new RegExp(`data-testid="question-matrix-${matrixQuestion.id}"`),
    "matrix root testid present",
  );
  assert.match(html, /SpO2 88%/, "row label rendered");
  assert.match(html, /Hypoxemia/, "column label rendered");
  assert.match(
    html,
    new RegExp(`data-testid="cell-${matrixQuestion.id}-r1-c1"`),
    "cell testid rendered",
  );
});

test("MatrixRenderer readOnly suppresses submit button", () => {
  const html = renderToStaticMarkup(
    React.createElement(MatrixRenderer, { question: matrixQuestion, readOnly: true }),
  );
  assert.doesNotMatch(
    html,
    new RegExp(`data-testid="button-submit-matrix-${matrixQuestion.id}"`),
    "submit button hidden in readOnly mode",
  );
});

// ─── Phase 4: TrendRenderer ───────────────────────────────────────────────────

test("TrendRenderer SSR-renders timepoints and options without hook errors", () => {
  const html = renderToStaticMarkup(
    React.createElement(TrendRenderer, { question: trendQuestion }),
  );

  assert.match(
    html,
    new RegExp(`data-testid="question-trend-${trendQuestion.id}"`),
    "trend root testid present",
  );
  assert.match(html, /0800/, "first timepoint label rendered");
  assert.match(html, /1200/, "last timepoint label rendered");
  assert.match(html, /Deteriorating perfusion/, "correct answer option rendered");
  assert.match(html, /HR: 72/, "vital sign value rendered");
});

// ─── Phase 4: DragDropRenderer ────────────────────────────────────────────────

test("DragDropRenderer SSR-renders available items without hook errors", () => {
  const html = renderToStaticMarkup(
    React.createElement(DragDropRenderer, { question: dragDropQuestion }),
  );

  assert.match(
    html,
    new RegExp(`data-testid="question-dragdrop-${dragDropQuestion.id}"`),
    "dragdrop root testid present",
  );
  assert.match(html, /Assess airway patency/, "item label rendered");
  assert.match(
    html,
    new RegExp(`data-testid="button-dragdrop-add-${dragDropQuestion.id}-a"`),
    "add-item button rendered",
  );
});

// ─── Phase 5: alias resolution consistency ────────────────────────────────────

test("ALIAS: @nursenest-core/* resolves to nursenest-core/src in test context", () => {
  // ECGQuestionLayout lives in nursenest-core/src/components/ and is importable
  // via both @/ and @nursenest-core/ — verify both resolve to the same file.
  const viaAt = require.resolve("@/components/ecg-question-layout");
  const viaNNCore = require.resolve("@nursenest-core/components/ecg-question-layout");
  assert.equal(
    viaAt,
    viaNNCore,
    `@/ and @nursenest-core/ must resolve to the same file:\n@/: ${viaAt}\n@nursenest-core/: ${viaNNCore}`,
  );
});

test("ALIAS: @legacy-client/* resolves to client/src in test context", () => {
  const resolved = require.resolve("@legacy-client/components/advanced-question-renderers");
  assert.ok(
    resolved.includes("/client/src/"),
    `@legacy-client/ must resolve into client/src, got: ${resolved}`,
  );
});
