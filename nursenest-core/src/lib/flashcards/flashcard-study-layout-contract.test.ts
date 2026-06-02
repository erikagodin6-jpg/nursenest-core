import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const css = readFileSync("src/app/learner-flashcard-premium.css", "utf8");
const contractStart = css.indexOf("Flashcards 2.1 header and study-panel contract");
const contractCss = contractStart >= 0 ? css.slice(contractStart) : "";

test("flashcard header contract defines a single 48px aligned row", () => {
  assert.ok(contractStart >= 0, "Flashcards 2.1 contract block must exist");
  assert.match(contractCss, /height:\s*3rem\s*!important/);
  assert.match(contractCss, /align-items:\s*center\s*!important/);
  assert.match(contractCss, /white-space:\s*nowrap\s*!important/);
  assert.match(contractCss, /nn-flashcard-topbar-progress-track/);
});

test("flashcard footer contract prevents bottom learning panel horizontal clipping", () => {
  assert.match(contractCss, /nn-flashcard-session-main-footer/);
  assert.match(contractCss, /width:\s*100%\s*!important/);
  assert.match(contractCss, /max-width:\s*100%\s*!important/);
  assert.doesNotMatch(contractCss, /margin-left:\s*-/);
  assert.doesNotMatch(contractCss, /margin-right:\s*-/);
});

test("flashcard typography contract uses semantic variables instead of raw pixel font-size declarations", () => {
  assert.match(contractCss, /--nn-fc-label-xs/);
  assert.match(contractCss, /--nn-fc-body-sm/);
  assert.match(contractCss, /--nn-fc-heading-md/);
  assert.doesNotMatch(contractCss, /font-size:\s*\d+px/);
});

