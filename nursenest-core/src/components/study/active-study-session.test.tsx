/**
 * Regression guards for active-study-session.tsx
 *
 * Rendering smoke tests are excluded here because the component's dependency
 * tree contains CSS module imports (BrandedPageLoader → branded-inline-loader)
 * that the Node.js test runner cannot resolve. Those surfaces are covered by
 * the Playwright E2E suite instead.
 *
 * What this file guards:
 *  - No React hook call appears after any conditional return (rules-of-hooks)
 *  - The three known early-return guards are present in the expected order
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC = readFileSync(
  path.resolve(__dirname, "active-study-session.tsx"),
  "utf8",
);
const LINES = SRC.split("\n");

describe("active-study-session — hooks-order structural guard", () => {
  it("contains all three conditional-return guards in order", () => {
    const guards = [/if \(loading\)/, /if \(!current\)/, /if \(completed\)/];
    let lastIdx = -1;
    for (const pat of guards) {
      const idx = LINES.findIndex((l, i) => i > lastIdx && pat.test(l));
      assert.ok(idx > lastIdx, `Guard not found or out of order: ${pat}`);
      lastIdx = idx;
    }
  });

  it("no hook call appears after the last conditional return", () => {
    // Find the line index of the LAST of the three guards.
    const guardPatterns = [/if \(loading\)/, /if \(!current\)/, /if \(completed\)/];
    let lastGuardLine = -1;
    for (let i = 0; i < LINES.length; i++) {
      for (const pat of guardPatterns) {
        if (pat.test(LINES[i])) lastGuardLine = i;
      }
    }
    assert.ok(lastGuardLine > 0, "Could not locate any conditional return guard");

    const hookPattern =
      /\b(useState|useEffect|useMemo|useCallback|useReducer|useRef|useContext|useId)\s*\(/;

    const violations: string[] = [];
    for (let i = lastGuardLine + 1; i < LINES.length; i++) {
      if (hookPattern.test(LINES[i])) {
        violations.push(`  line ${i + 1}: ${LINES[i].trim()}`);
      }
    }

    assert.deepEqual(
      violations,
      [],
      `Hook(s) found after the last conditional return — Rules of Hooks violation:\n${violations.join("\n")}`,
    );
  });

  it("keyboard shortcut useEffect declares the completed/current/loading guard inside its body", () => {
    // The keyboard effect must have the early-exit guard so it is safe when
    // the session reaches the loading / empty / completed states.
    assert.match(
      SRC,
      /if \(loading \|\| !current \|\| completed\) return/,
      "keyboard useEffect must guard against non-interactive states",
    );
  });

  it("onStudyProgress is included in its useEffect dependency array", () => {
    // Regression for the missing-dep bug (H-2).
    // The effect calls onStudyProgress, so it must appear in deps.
    assert.match(
      SRC,
      /onStudyProgress\?\.\(\{[^}]+\}\)[\s\S]{0,60}\}, \[index, onStudyProgress, revealed\]\)/,
      "onStudyProgress must be in the dependency array of the progress-reporting useEffect",
    );
  });
});
