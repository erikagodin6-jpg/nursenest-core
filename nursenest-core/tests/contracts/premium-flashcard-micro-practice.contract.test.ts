import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();

function src(path: string): string {
  return readFileSync(join(root, path), "utf8");
}

test("premium flashcard study view does not render a sidebar rail", () => {
  const activeStudy = src("src/components/study/active-study-session.tsx");
  assert.match(activeStudy, /data-nn-flashcard-horizontal-status/);
  assert.match(activeStudy, /data-nn-flashcard-support-strip/);
  assert.doesNotMatch(activeStudy, /\brail=\{/);
});

test("flashcard confidence controls expose micro-practice labels", () => {
  const activeStudy = src("src/components/study/active-study-session.tsx");
  assert.match(activeStudy, /Need repetition/);
  assert.match(activeStudy, /Unsure/);
  assert.match(activeStudy, /Got it/);
});

test("premium flashcard CSS is theme-aware and covers canonical themes", () => {
  const css = src("src/app/learner-flashcard-premium.css");
  for (const token of [
    "--semantic-background",
    "--semantic-surface",
    "--semantic-card",
    "--semantic-primary",
    "--semantic-foreground",
    "--semantic-muted",
  ]) {
    assert.match(css, new RegExp(token), `${token} must be part of the flashcard token layer`);
  }
  for (const theme of ["ocean", "blossom", "midnight", "aurora", "sunset"]) {
    assert.match(css, new RegExp(`data-theme="${theme}"`), `${theme} must remain explicitly covered`);
  }
});

test("rationale panel includes clinical teaching modules without hardcoded content facts", () => {
  const revealPanels = src("src/components/flashcards/flashcard-study-reveal-panels.tsx");
  assert.match(revealPanels, /Correct answer/);
  assert.match(revealPanels, /Clinical reasoning/);
  assert.match(revealPanels, /Why the others are incorrect/);
  assert.match(revealPanels, /NCLEX trap/);
  assert.match(revealPanels, /Clinical pearl/);
  assert.match(revealPanels, /Priority nursing action/);
  assert.match(revealPanels, /Related concepts/);
  assert.doesNotMatch(revealPanels, /hardcoded medical fact/i);
});
