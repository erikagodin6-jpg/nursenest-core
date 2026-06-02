import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();
const css = readFileSync(join(root, "src/app/learner-flashcard-layout-refinement-pass.css"), "utf8");
const stack = readFileSync(join(root, "src/components/flashcards/flashcard-study-question-stack.tsx"), "utf8");
const session = readFileSync(join(root, "src/components/study/active-study-session.tsx"), "utf8");

test("flashcard premium refinement uses content-led page flow instead of fixed study panes", () => {
  assert.match(session, /data-nn-flashcard-premium-visual-refinement/);
  assert.match(css, /min-height: 100dvh !important/);
  assert.match(css, /height: auto !important/);
  assert.match(css, /overflow: visible !important/);
  assert.doesNotMatch(stack, /nn-premium-flashcard-prompt-panel[^\n"]*overflow-hidden/);
});

test("flashcard rationale uses a static scrollable reading window", () => {
  assert.match(stack, /data-nn-educational-content-container/);
  assert.match(stack, /data-nn-clinical-pearl/);
  assert.match(css, /Static rationale reading window/);
  assert.match(css, /\.nn-flashcard-rationale-panel[\s\S]*?position: sticky !important/);
  assert.match(css, /\.nn-flashcard-rationale-panel[\s\S]*?max-height: clamp\(28rem, calc\(100dvh - 12rem\), 46rem\) !important/);
  assert.match(css, /\.nn-flashcard-rationale-panel[\s\S]*?overflow: hidden !important/);
  assert.match(css, /\.nn-flashcard-rationale-panel__body[\s\S]*?overflow-y: auto !important/);
  assert.match(css, /scrollbar-gutter: stable !important/);
  assert.match(css, /-webkit-line-clamp: unset !important/);
});

test("flashcard workspace treats question and rationale as balanced learning panels", () => {
  assert.match(stack, /data-nn-flashcard-question-workspace/);
  assert.match(stack, /data-nn-flashcard-rationale-workspace/);
  assert.match(stack, /aria-label="Assessment question workspace"/);
  assert.match(stack, /aria-label=\{labels\?\.answerHeading \?\? "Learning rationale workspace"\}/);
  assert.match(css, /Dual-panel clinical reasoning split \(≈60 \/ 40\)/);
  assert.match(css, /grid-template-columns: minmax\(0, 1\.45fr\) minmax\(28rem, 1fr\)/);
  assert.match(css, /minmax\(0, 1\.45fr\) minmax\(26rem, 1fr\)/);
  assert.doesNotMatch(css, /Question-dominant column split/);
});

test("rationale panel is treated as a primary reading surface", () => {
  assert.match(css, /\.nn-flashcard-rationale-panel[\s\S]*?max-width: none !important/);
  assert.match(css, /\.nn-flashcard-rationale-panel__body[\s\S]*?max-width: 78ch !important/);
  assert.match(css, /\.nn-flashcard-rationale-key-concept[\s\S]*?max-width: 78ch !important/);
  assert.match(css, /\.nn-flashcard-rationale-section[\s\S]*?max-width: 78ch !important/);
});

test("flashcard visual refinement remains token-driven", () => {
  const refinementBlock = css.slice(css.indexOf("Premium visual hardening"));
  assert.doesNotMatch(refinementBlock, /#[0-9a-fA-F]{3,8}\b/);
  assert.match(refinementBlock, /var\(--semantic-/);
  assert.match(refinementBlock, /linear-gradient/);
  assert.match(refinementBlock, /color-mix/);
});
