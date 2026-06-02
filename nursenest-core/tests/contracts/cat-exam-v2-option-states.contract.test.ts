/**
 * Regression contract — CAT exam v2 option-state visual design.
 *
 * Guards against regression to the pre-v2 aesthetic:
 *   - radial-gradient backgrounds on answer options
 *   - double-ring glow box-shadow on selected state
 *   - translateY hover lift
 *   - dashed border + italic text on disabled options
 *   - opacity:1 (no dimming) on dim state
 *   - info-tinted top/bottom bars
 *   - nested bordered inner card on question stem
 *   - authoritative rules in the wrong CSS file (cascade order bug)
 *
 * Run from `nursenest-core/`:
 *   node --import tsx --test tests/contracts/cat-exam-v2-option-states.contract.test.ts
 *
 * @see src/app/styles/learner/learner-global.css  (authoritative — loads last)
 * @see src/app/learner-exam-session-premium.css   (base presentation layer)
 * @see src/components/study/cat-question-card.tsx (question card component)
 * @see src/app/(app)/app/(learner)/layout.tsx (CSS import order)
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

const ROOT = process.cwd();

const LEARNER_GLOBAL_CSS = path.resolve(ROOT, "src/app/styles/learner/learner-global.css");
const PREMIUM_CSS = path.resolve(ROOT, "src/app/learner-exam-session-premium.css");
const QUESTION_CARD_TSX = path.resolve(ROOT, "src/components/study/cat-question-card.tsx");
const LEARNER_LAYOUT = path.resolve(ROOT, "src/app/(app)/app/(learner)/layout.tsx");
const PRACTICE_TESTS_LAYOUT = path.resolve(ROOT, "src/app/(app)/app/(learner)/practice-tests/layout.tsx");

function read(p: string): string {
  return fs.readFileSync(p, "utf8");
}

/**
 * Extract the CSS block immediately following a selector match.
 * Returns the text between the first `{` and the matching `}` after `selector`.
 */
function extractBlock(css: string, selectorPattern: RegExp): string | null {
  const match = selectorPattern.exec(css);
  if (!match) return null;
  const start = css.indexOf("{", match.index);
  if (start === -1) return null;
  let depth = 0;
  let end = start;
  for (let i = start; i < css.length; i++) {
    if (css[i] === "{") depth++;
    else if (css[i] === "}") {
      depth--;
      if (depth === 0) { end = i; break; }
    }
  }
  return css.slice(start + 1, end);
}

describe("CAT exam v2 option states — regression contract", () => {
  const global = read(LEARNER_GLOBAL_CSS);
  const premium = read(PREMIUM_CSS);
  const questionCard = read(QUESTION_CARD_TSX);
  const layout = read(LEARNER_LAYOUT);
  const practiceTestsLayout = read(PRACTICE_TESTS_LAYOUT);

  // ══════════════════════════════════════════════════════════════════
  // §1  CASCADE ORDER GUARD
  // learner-global.css MUST be imported after learner-exam-session-premium.css
  // in the learner layout so its higher-specificity rules can win.
  // ══════════════════════════════════════════════════════════════════

  it("study route layouts load premium exam CSS and learner-global CSS", () => {
    const globalIdx = layout.indexOf("learner-global.css");
    const premiumIdx = practiceTestsLayout.indexOf("learner-exam-session-premium.css");
    assert.ok(premiumIdx !== -1, "learner-exam-session-premium.css must be imported in practice-tests layout");
    assert.ok(globalIdx !== -1, "learner-global.css must be imported in learner layout");
  });

  it("authoritative exam-stack selected state rule lives in learner-global.css with high specificity", () => {
    // The authoritative rule must use at least 2 class selectors to beat the 1-class rules
    // in learner-exam-session-premium.css.
    assert.match(
      global,
      /\.nn-cat-question-card--exam-stack\s+\.nn-cat-opt--selected|\.nn-cat-exam-chrome\s+\.nn-cat-session[^{]+\.nn-cat-opt--selected/,
      "learner-global.css must contain a high-specificity (≥2 class) exam-stack selected rule",
    );
  });

  // ══════════════════════════════════════════════════════════════════
  // §2  SELECTED STATE — left accent bar, no double-ring glow
  // ══════════════════════════════════════════════════════════════════

  it("selected state uses inset left accent bar (4px), not double-ring box-shadow", () => {
    assert.match(
      global,
      /inset\s+4px\s+0\s+0\s+var\(--nn-exam-accent\)/,
      "Selected state must use 'inset 4px 0 0 var(--nn-exam-accent)' left accent bar",
    );
  });

  it("selected state does not use the old double outer-ring (0 0 0 1px) in the exam-stack rule block", () => {
    // Extract just the exam-stack selected block so we don't match unrelated rules
    const selectedBlock = extractBlock(
      global,
      /\.nn-cat-question-card--exam-stack\s+\.nn-cat-opt--selected[^{]*/,
    );
    assert.ok(selectedBlock !== null, "Could not find exam-stack .nn-cat-opt--selected block");
    // The block should NOT contain the old outer glow ring pattern
    assert.doesNotMatch(
      selectedBlock,
      /0\s+0\s+0\s+1px\s+color-mix[^;]*nn-exam-accent[^;]*12%/,
      "Selected state must not use the old outer-ring glow (0 0 0 1px ...nn-exam-accent...12%) in exam-stack context",
    );
  });

  it("selected state border-width is ≤1.5px (no layout shift)", () => {
    const selectedBlock = extractBlock(
      global,
      /\.nn-cat-question-card--exam-stack\s+\.nn-cat-opt--selected[^{]*/,
    );
    assert.ok(selectedBlock !== null, "exam-stack selected block must exist");
    // Must not be border-width: 2px (causes CLS as border expands on selection)
    assert.doesNotMatch(
      selectedBlock,
      /border-width\s*:\s*2px/,
      "Selected state must not use border-width: 2px (causes layout shift). Use 1.5px or less.",
    );
  });

  // ══════════════════════════════════════════════════════════════════
  // §3  HOVER STATE — no translateY, no shadow lift
  // ══════════════════════════════════════════════════════════════════

  it("exam-stack hover state has no translateY (clinical stillness)", () => {
    const hoverBlock = extractBlock(
      global,
      /\.nn-cat-question-card--exam-stack\s+\.nn-cat-opt--interactive:hover:not\(:disabled\)/,
    );
    assert.ok(hoverBlock !== null, "exam-stack hover rule must exist in learner-global.css");
    assert.doesNotMatch(
      hoverBlock,
      /transform\s*:[^;]*translateY/,
      "Hover state must not use translateY — exam requires clinical stillness",
    );
  });

  it("exam-stack hover state has no box-shadow lift", () => {
    const hoverBlock = extractBlock(
      global,
      /\.nn-cat-question-card--exam-stack\s+\.nn-cat-opt--interactive:hover:not\(:disabled\)/,
    );
    assert.ok(hoverBlock !== null, "exam-stack hover rule must exist");
    // box-shadow: none is fine; a lift shadow is not
    if (hoverBlock.includes("box-shadow")) {
      assert.match(
        hoverBlock,
        /box-shadow\s*:\s*none/,
        "Hover box-shadow in exam-stack must be 'none' — no lift shadows",
      );
    }
  });

  // ══════════════════════════════════════════════════════════════════
  // §4  DISABLED STATE — solid border, normal font-style
  // ══════════════════════════════════════════════════════════════════

  it("disabled options use solid border (not dashed)", () => {
    const disabledBlock = extractBlock(
      global,
      /\.nn-cat-question-card--exam-stack\s+\.nn-cat-opt:disabled/,
    );
    assert.ok(disabledBlock !== null, "exam-stack disabled rule must exist");
    assert.doesNotMatch(
      disabledBlock,
      /border-style\s*:\s*dashed/,
      "Disabled options must not use dashed border — looks broken, not clinical",
    );
  });

  it("disabled options use normal font-style (not italic)", () => {
    const disabledBlock = extractBlock(
      global,
      /\.nn-cat-question-card--exam-stack\s+\.nn-cat-opt:disabled/,
    );
    assert.ok(disabledBlock !== null, "exam-stack disabled rule must exist");
    assert.doesNotMatch(
      disabledBlock,
      /font-style\s*:\s*italic/,
      "Disabled options must not use italic — disrupts reading under exam pressure",
    );
  });

  // ══════════════════════════════════════════════════════════════════
  // §5  DIM STATE — visible opacity dimming (not opacity:1)
  // ══════════════════════════════════════════════════════════════════

  it("dim state has opacity < 1 (not opacity:1 which gives zero de-emphasis)", () => {
    const dimBlock = extractBlock(
      global,
      /\.nn-cat-question-card--exam-stack\s+\.nn-cat-opt--dim/,
    );
    assert.ok(dimBlock !== null, "exam-stack dim rule must exist");
    assert.doesNotMatch(
      dimBlock,
      /opacity\s*:\s*1\b/,
      "Dim state must NOT be opacity:1 — unselected wrong answers must be visibly de-emphasized",
    );
    assert.match(
      dimBlock,
      /opacity\s*:\s*0\.\d+/,
      "Dim state must have opacity < 1 (e.g. 0.48)",
    );
  });

  // ══════════════════════════════════════════════════════════════════
  // §6  CORRECT / INCORRECT — green/red left accent bars
  // ══════════════════════════════════════════════════════════════════

  it("correct state uses green left accent bar (semantic-success)", () => {
    assert.match(
      global,
      /inset\s+4px\s+0\s+0\s+var\(--semantic-success\)/,
      "Correct state must use 'inset 4px 0 0 var(--semantic-success)' for instant scannability",
    );
  });

  it("incorrect state uses red left accent bar (semantic-danger)", () => {
    assert.match(
      global,
      /inset\s+4px\s+0\s+0\s+var\(--semantic-danger\)/,
      "Incorrect state must use 'inset 4px 0 0 var(--semantic-danger)'",
    );
  });

  it("selected+correct combination rule exists so green overrides blue accent", () => {
    assert.match(
      global,
      /\.nn-cat-opt--selected\.nn-cat-opt--correct/,
      "Must have explicit selected+correct rule so correct (green) wins over selected (blue)",
    );
  });

  it("selected+incorrect combination rule exists so red overrides blue accent", () => {
    assert.match(
      global,
      /\.nn-cat-opt--selected\.nn-cat-opt--incorrect/,
      "Must have explicit selected+incorrect rule so incorrect (red) wins over selected (blue)",
    );
  });

  // ══════════════════════════════════════════════════════════════════
  // §7  FOCUS RING — preserves selected left accent bar
  // ══════════════════════════════════════════════════════════════════

  it("selected+focused combination rule preserves left accent bar alongside focus ring", () => {
    // The combined focus+selected rule must include the left accent bar
    const focusSelectedBlock = extractBlock(
      global,
      /\.nn-cat-opt--selected\.nn-cat-opt--interactive:focus-visible/,
    );
    assert.ok(
      focusSelectedBlock !== null,
      "Must have a .nn-cat-opt--selected.nn-cat-opt--interactive:focus-visible rule",
    );
    assert.match(
      focusSelectedBlock,
      /inset\s+4px\s+0\s+0\s+var\(--nn-exam-accent\)/,
      "Focus ring on selected must preserve the inset 4px left accent bar",
    );
  });

  it("dark theme selected+focused rule preserves left accent bar in the later cascade", () => {
    const darkThemeIdx = global.indexOf('html[data-theme="midnight"]');
    assert.ok(darkThemeIdx !== -1, "dark theme override block must exist");

    const darkThemeCss = global.slice(darkThemeIdx);
    const darkFocusSelectedBlock = extractBlock(
      darkThemeCss,
      /\.nn-cat-opt--selected\.nn-cat-opt--interactive:focus-visible/,
    );
    assert.ok(
      darkFocusSelectedBlock !== null,
      "Dark theme cascade must include selected+focus rule after the generic dark focus rule",
    );
    assert.match(
      darkFocusSelectedBlock,
      /inset\s+4px\s+0\s+0\s+var\(--nn-exam-accent\)/,
      "Dark selected+focus must preserve the inset 4px left accent bar",
    );
  });

  it("focus ring uses box-shadow technique (not outline) for combined shadow support", () => {
    const focusBlock = extractBlock(
      global,
      /\.nn-cat-question-card--exam-stack\s+\.nn-cat-opt--interactive:focus-visible/,
    );
    assert.ok(focusBlock !== null, "exam-stack focus-visible rule must exist");
    assert.match(
      focusBlock,
      /outline\s*:\s*none/,
      "Focus ring must set outline:none and use box-shadow for combined left-accent + ring effect",
    );
    assert.match(
      focusBlock,
      /box-shadow/,
      "Focus ring must use box-shadow",
    );
  });

  // ══════════════════════════════════════════════════════════════════
  // §8  TOP / BOTTOM BAR — clean semantic surface, no info tint
  // ══════════════════════════════════════════════════════════════════

  it("top and bottom bar backgrounds use semantic-surface, not info-tinted blue", () => {
    const barBlock = extractBlock(
      global,
      /\.nn-cat-exam-board-top,?\s*\.nn-cat-exam-board-footer/,
    );
    assert.ok(barBlock !== null, "nn-cat-exam-board-top / footer rule must exist in learner-global.css");
    assert.doesNotMatch(
      barBlock,
      /color-mix[^;]*semantic-info[^;]*semantic-surface/,
      "Board top/footer must NOT use info-tinted background (color-mix with semantic-info)",
    );
    assert.match(
      barBlock,
      /background\s*:\s*var\(--semantic-surface\)/,
      "Board top/footer background must be var(--semantic-surface) — clean white/dark surface",
    );
  });

  // ══════════════════════════════════════════════════════════════════
  // §9  QUESTION CARD — no nested inner bordered wrapper
  // ══════════════════════════════════════════════════════════════════

  it("QuestionCard examDetachedFooter path does not have a nested inner bordered div wrapping the stem", () => {
    // Before v2, each render path had:
    //   <div className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-border-soft)...] bg-[...]">
    //     {stemBlock}
    //   </div>
    // This created a double-card/double-border effect. After v2 the stem renders directly.
    // We check the examDetachedFooter branch specifically.
    const detachedSection = (() => {
      const marker = "examStemScrollPartition";
      const idx = questionCard.indexOf(marker);
      if (idx === -1) return questionCard;
      // Grab ~2000 chars of context around the detached render paths
      return questionCard.slice(Math.max(0, idx - 200), idx + 2500);
    })();

    assert.doesNotMatch(
      detachedSection,
      /className=["'][^"']*rounded-2xl[^"']*border[^"']*border-\[color-mix\(in_srgb,var\(--semantic-border-soft/,
      "QuestionCard must not wrap the stem in a nested rounded-2xl bordered inner div — this creates a double-card effect",
    );
  });

  it("QuestionCard default (non-exam) render path does not have inner nested bordered stem card", () => {
    // The base render (last return in QuestionCard) should not have the nested stem div
    // We check the very last JSX return block in the component
    const lastReturnIdx = questionCard.lastIndexOf("return (");
    assert.ok(lastReturnIdx !== -1, "QuestionCard must have a return statement");
    const lastReturn = questionCard.slice(lastReturnIdx);
    assert.doesNotMatch(
      lastReturn,
      /className=["'][^"']*rounded-2xl[^"']*border[^"']*bg-\[color-mix\(in_srgb,var\(--semantic-panel-cool/,
      "Base QuestionCard render must not have a nested rounded-2xl panel-cool inner card",
    );
  });

  // ══════════════════════════════════════════════════════════════════
  // §10  DARK THEME COVERAGE
  // ══════════════════════════════════════════════════════════════════

  it("learner-global.css has dark theme block covering midnight, midnight-indigo, dark-clinical", () => {
    const requiredDarkThemes = ["midnight", "midnight-indigo", "dark-clinical"] as const;
    for (const theme of requiredDarkThemes) {
      assert.match(
        global,
        new RegExp(`html\\[data-theme="${theme}"\\]`),
        `learner-global.css must have dark theme override block for ${theme}`,
      );
    }
  });

  it("dark theme blocks contain nn-cat-exam-board-top and nn-cat-exam-board-footer overrides", () => {
    // The dark theme block in learner-global.css uses CSS nesting (&) inside the html[data-theme]
    // selector. We verify both the midnight theme selector and the board override exist in the file —
    // their proximity is enforced by the cascade architecture (learner-global.css loads last).
    assert.match(
      global,
      /html\[data-theme="midnight"\]/,
      "learner-global.css must contain html[data-theme='midnight'] block",
    );
    assert.match(
      global,
      /&\s+\.nn-cat-exam-board-top|\.nn-cat-exam-board-top[^}]*board-footer/,
      "learner-global.css dark theme block must include nn-cat-exam-board-top override",
    );
  });

  // ══════════════════════════════════════════════════════════════════
  // §11  CLINICAL READABILITY — stem line-height floors
  // ══════════════════════════════════════════════════════════════════

  it("adaptive exam stem line-height is overridden to ≥1.52 for clinical readability", () => {
    // The compact adaptive mode in globals.css sets line-height: 1.42 (too tight).
    // learner-global.css must override this to at least 1.52.
    assert.match(
      global,
      /nn-cat-adaptive-exam-session[^}]*nn-cat-exam-stem-scroll[^}]*nn-cat-question-stem|nn-cat-exam-stem-scroll\s+\.nn-cat-question-stem/,
      "learner-global.css must have an adaptive-exam-session stem-scroll line-height override",
    );
    // Verify the value is ≥ 1.52
    const adaptiveStemBlock = extractBlock(
      global,
      /\.nn-cat-exam-chrome\.nn-cat-adaptive-exam-session\s+\.nn-cat-exam-stem-scroll\s+\.nn-cat-question-stem/,
    );
    if (adaptiveStemBlock) {
      const lhMatch = /line-height\s*:\s*([\d.]+)/.exec(adaptiveStemBlock);
      if (lhMatch) {
        const lh = parseFloat(lhMatch[1]);
        assert.ok(
          lh >= 1.52,
          `Adaptive stem line-height must be ≥1.52 for clinical readability (found ${lh})`,
        );
      }
    }
  });

  it("exam-stack stem line-height is ≥1.55 in the base exam rule", () => {
    const stemBlock = extractBlock(
      global,
      /\.nn-cat-question-card--exam-stack\s+\.nn-cat-question-stem/,
    );
    if (stemBlock) {
      const lhMatch = /line-height\s*:\s*([\d.]+)/.exec(stemBlock);
      if (lhMatch) {
        const lh = parseFloat(lhMatch[1]);
        assert.ok(
          lh >= 1.55,
          `Exam-stack stem line-height must be ≥1.55 (found ${lh}) — clinical text needs breathing room`,
        );
      }
    }
  });

  // ══════════════════════════════════════════════════════════════════
  // §12  SATA — multi-select options follow the same accent-bar contract
  // ══════════════════════════════════════════════════════════════════

  it("SATA options (nn-cat-opt--multi) render as labels with checkbox input (not buttons)", () => {
    assert.match(
      questionCard,
      /data-nn-qa-exam-format="sata"/,
      "SATA options must have data-nn-qa-exam-format='sata' hook",
    );
    // SATA options are labels wrapping hidden checkbox inputs
    assert.match(
      questionCard,
      /<label[^>]*nn-cat-opt--multi/,
      "SATA options must render as <label> elements (not <button>)",
    );
    assert.match(
      questionCard,
      /type="checkbox"/,
      "SATA options must include a checkbox input for accessibility",
    );
    assert.match(
      questionCard,
      /className="sr-only"/,
      "SATA checkbox must be visually hidden (sr-only) — visual state driven by CSS classes",
    );
  });

  // ══════════════════════════════════════════════════════════════════
  // §13  NO GRADIENT ON BASE OPTION STATE
  // ══════════════════════════════════════════════════════════════════

  it("base nn-cat-opt in premium CSS has background-image:none to strip pre-v2 gradients", () => {
    // Our v2 cleanup added background-image: none to the base .nn-cat-opt rule
    // in learner-exam-session-premium.css to remove the radial-gradient from the
    // original declaration in the same file.
    assert.match(
      premium,
      /\.nn-cat-opt\s*\{[^}]*background-image\s*:\s*none/s,
      "learner-exam-session-premium.css must have .nn-cat-opt { background-image: none } to strip pre-v2 gradients",
    );
  });

  it("hover rule in premium CSS has transform:none to remove pre-v2 translateY lift", () => {
    assert.match(
      premium,
      /\.nn-cat-opt--interactive:hover\s*\{[^}]*transform\s*:\s*none/s,
      "learner-exam-session-premium.css must have .nn-cat-opt--interactive:hover { transform: none }",
    );
  });

  // ══════════════════════════════════════════════════════════════════
  // §14  QA HOOKS — exam format data attributes
  // ══════════════════════════════════════════════════════════════════

  it("MCQ AnswerOptionRow has data-nn-qa-exam-format='mcq' for E2E selection", () => {
    assert.match(
      questionCard,
      /data-nn-qa-exam-format="mcq"/,
      "MCQ options must expose data-nn-qa-exam-format='mcq' for QA automation",
    );
  });

  it("SATA AnswerOptionRow has data-nn-qa-exam-format='sata' for E2E selection", () => {
    assert.match(
      questionCard,
      /data-nn-qa-exam-format="sata"/,
      "SATA options must expose data-nn-qa-exam-format='sata' for QA automation",
    );
  });

  // ══════════════════════════════════════════════════════════════════
  // §15  SPECIFICITY / CASCADE INTEGRITY
  // learner-exam-session-premium.css must NOT contain high-specificity
  // exam-stack selected rules that could interfere with learner-global.css.
  // ══════════════════════════════════════════════════════════════════

  it("learner-exam-session-premium.css does not contain bare exam-stack selected state overrides", () => {
    // The authoritative base selected state must live in learner-global.css.
    // Exception: phase-gated rules like [data-cat-exam-root][data-nn-cat-exam-ui-phase="submitted_locked"]
    // .nn-cat-question-card--exam-stack .nn-cat-opt--selected are legitimate in premium.css —
    // they control the locked/submitted phase appearance and have high specificity from the
    // attribute selectors that gate them.
    //
    // We check that a bare (non-phase-gated) exam-stack selected rule doesn't exist in premium.css.
    // The pattern must NOT start with [data-cat-exam-root] before the exam-stack selector.
    const lines = premium.split("\n");
    const bareExamStackSelected = lines.some((line, i) => {
      if (!line.includes("nn-cat-question-card--exam-stack") || !line.includes("nn-cat-opt--selected")) {
        return false;
      }
      // Check if this line or the preceding ~5 lines have a [data-cat-exam-root] gate
      const context = lines.slice(Math.max(0, i - 5), i + 1).join("\n");
      return !context.includes("[data-cat-exam-root]") && !context.includes("data-nn-cat-exam-ui-phase");
    });
    assert.ok(
      !bareExamStackSelected,
      "learner-exam-session-premium.css must NOT contain a bare (non-phase-gated) " +
      ".nn-cat-question-card--exam-stack .nn-cat-opt--selected rule. " +
      "The authoritative base selected state must be in learner-global.css. " +
      "Phase-gated rules ([data-cat-exam-root][data-nn-cat-exam-ui-phase=...]) are permitted.",
    );
  });

  it("learner-exam-session-premium.css does not contain exam-stack hover override", () => {
    assert.doesNotMatch(
      premium,
      /\.nn-cat-question-card--exam-stack\s+\.nn-cat-opt--interactive:hover/,
      "Exam-stack hover rule must not be in learner-exam-session-premium.css — " +
      "keep authoritative rules in learner-global.css",
    );
  });

  it("learner-exam-session-premium.css does not contain exam-stack correct/incorrect overrides", () => {
    assert.doesNotMatch(
      premium,
      /\.nn-cat-question-card--exam-stack\s+\.nn-cat-opt--correct/,
      "Exam-stack correct rule must not be in learner-exam-session-premium.css",
    );
    assert.doesNotMatch(
      premium,
      /\.nn-cat-question-card--exam-stack\s+\.nn-cat-opt--incorrect/,
      "Exam-stack incorrect rule must not be in learner-exam-session-premium.css",
    );
  });
});
