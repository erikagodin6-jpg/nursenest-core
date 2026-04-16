/**
 * Regression guard: theme-palettes.css source-order and registry coverage.
 *
 * Run: `npx tsx --test src/lib/theme/theme-palettes-order.test.ts`
 *
 * Why this exists:
 * The generic light-theme `:is(…)` catch-all and each individual
 * `[data-theme="X"]` selector share the same specificity [0,1,0].
 * Whichever appears LAST in source order wins. If a complete named
 * light-theme block appears *before* the catch-all, its explicit
 * --theme-page-bg / --theme-heading-text / etc. are silently overridden
 * by the catch-all's generic computed defaults.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { THEME_OPTIONS } from "./theme-registry";

const HERE = dirname(fileURLToPath(import.meta.url));
const PALETTES_PATH = resolve(HERE, "../../app/theme-palettes.css");
const css = readFileSync(PALETTES_PATH, "utf-8");
const lines = css.split("\n");

// ── helpers ───────────────────────────────────────────────────────────────

function firstLine(pattern: RegExp): number {
  return lines.findIndex((l) => pattern.test(l));
}

/**
 * Find the opening line of a `[data-theme="id"] { … }` block whose body
 * contains `--theme-page-bg` (a "complete" identity-token block).
 * Returns -1 if no such block exists for this theme.
 */
function findCompleteBlock(themeId: string): number {
  const selector = new RegExp(
    `^\\[data-theme="${themeId}"\\]\\s*\\{`,
  );
  for (let i = 0; i < lines.length; i++) {
    if (!selector.test(lines[i])) continue;
    for (let j = i + 1; j < lines.length; j++) {
      if (lines[j].trim() === "}") break;
      if (lines[j].includes("--theme-page-bg")) return i;
    }
  }
  return -1;
}

/** Find the closing `}` line for a block starting at `startLine`. */
function findBlockEnd(startLine: number): number {
  let depth = 0;
  for (let i = startLine; i < lines.length; i++) {
    for (const ch of lines[i]) {
      if (ch === "{") depth++;
      if (ch === "}") {
        depth--;
        if (depth === 0) return i;
      }
    }
  }
  return -1;
}

// ── locate structural sections ────────────────────────────────────────────

const catchAllStart = firstLine(/^:is\(/);
const catchAllEnd = catchAllStart >= 0 ? findBlockEnd(catchAllStart) : -1;
/** Must stay after complete named blocks — final neutral shell overrides identity tints. */
const lightThemeNeutralShellComment = firstLine(
  /Light-theme neutral shell normalization/,
);

/**
 * Light themes with complete identity-token blocks that MUST appear after
 * the :is() catch-all. Dark themes are excluded — they aren't listed in
 * the catch-all, so they have no specificity collision.
 *
 * `lavender` is not marked `named: true` in the registry but retains a
 * complete block for legacy reasons and must also be ordered correctly.
 */
const EXPECTED_COMPLETE_LIGHT_THEMES = [
  "lavender",
  "lavender-dream",
  "blueberry-sherbet",
  "strawberry-cream",
  "ocean-mist",
  "mint-breeze",
  "rose-quartz",
  "golden-hour",
  "sage-garden",
  "coral-sunset",
  "arctic-frost",
  "plum-velvet",
  "honey-cream",
  "dusty-rose",
  "petal-pop",
  "cotton-candy",
  "pink-skies",
  "berry-bonbon",
  "pastel-party",
  "rainbow-sherbet",
  "sunny-lilac",
  "sky-kiss",
  "bluebird",
  "violet-night",
  "plum-mist",
  "graphite-blue",
  "north-sea",
];

// ── 1. CSS source-order tests ─────────────────────────────────────────────

describe("theme-palettes.css source order", () => {
  it("contains the :is() catch-all block", () => {
    assert.ok(
      catchAllStart >= 0,
      ":is() catch-all block not found in theme-palettes.css",
    );
    assert.ok(
      catchAllEnd > catchAllStart,
      "Could not find closing brace for :is() catch-all block",
    );
  });

  for (const id of EXPECTED_COMPLETE_LIGHT_THEMES) {
    it(`"${id}" complete block appears AFTER the :is() catch-all`, () => {
      const blockLine = findCompleteBlock(id);
      assert.ok(
        blockLine >= 0,
        `No complete identity-token block found for "${id}" (must define --theme-page-bg)`,
      );
      assert.ok(
        blockLine > catchAllEnd,
        `"${id}" complete block (line ${blockLine + 1}) is BEFORE the :is() catch-all ` +
          `end (line ${catchAllEnd + 1}). Move it after the catch-all so its explicit ` +
          `values win by source order.`,
      );
    });
  }

  it("light-theme neutral shell normalization is after all complete named blocks", () => {
    assert.ok(
      lightThemeNeutralShellComment >= 0,
      "Light-theme neutral shell normalization comment not found",
    );
    const lastCompleteEnd = Math.max(
      ...EXPECTED_COMPLETE_LIGHT_THEMES.map((id) => {
        const start = findCompleteBlock(id);
        return start >= 0 ? findBlockEnd(start) : -1;
      }),
    );
    assert.ok(
      lightThemeNeutralShellComment > lastCompleteEnd,
      `Neutral shell block (line ${lightThemeNeutralShellComment + 1}) must appear after the ` +
        `last complete named block (ends line ${lastCompleteEnd + 1}).`,
    );
  });
});

// ── 2. Registry ↔ CSS coverage tests ─────────────────────────────────────

describe("theme registry ↔ CSS coverage", () => {
  const cssThemeIds = new Set<string>();
  const selectorRe = /\[data-theme="([^"]+)"\]/g;
  let m: RegExpExecArray | null;
  while ((m = selectorRe.exec(css)) !== null) cssThemeIds.add(m[1]);

  it("every registry theme ID has at least one [data-theme] selector in CSS", () => {
    const missing = THEME_OPTIONS.map((t) => t.id).filter(
      (id) => !cssThemeIds.has(id),
    );
    assert.deepStrictEqual(
      missing,
      [],
      `Theme IDs in registry but absent from theme-palettes.css: ${missing.join(", ")}`,
    );
  });

  it("named light themes (named: true, group: light) have complete identity-token blocks", () => {
    const namedLight = THEME_OPTIONS.filter(
      (t) => t.named && t.group === "light",
    );
    const incomplete = namedLight
      .filter((t) => findCompleteBlock(t.id) < 0)
      .map((t) => t.id);
    assert.deepStrictEqual(
      incomplete,
      [],
      `Named light themes missing a complete block (with --theme-page-bg): ${incomplete.join(", ")}. ` +
        `Add a full identity-token block in theme-palettes.css AFTER the :is() catch-all.`,
    );
  });

  it("named dark themes (named: true, group: dark) have complete identity-token blocks", () => {
    const namedDark = THEME_OPTIONS.filter(
      (t) => t.named && t.group === "dark",
    );
    const incomplete = namedDark
      .filter((t) => findCompleteBlock(t.id) < 0)
      .map((t) => t.id);
    assert.deepStrictEqual(
      incomplete,
      [],
      `Named dark themes missing a complete block (with --theme-page-bg): ${incomplete.join(", ")}.`,
    );
  });

  it("EXPECTED_COMPLETE_LIGHT_THEMES list covers all named light themes from registry", () => {
    const registryNamedLight = THEME_OPTIONS
      .filter((t) => t.named && t.group === "light")
      .map((t) => t.id);
    const missingFromExpected = registryNamedLight.filter(
      (id) => !EXPECTED_COMPLETE_LIGHT_THEMES.includes(id),
    );
    assert.deepStrictEqual(
      missingFromExpected,
      [],
      `New named light theme(s) in registry but missing from EXPECTED_COMPLETE_LIGHT_THEMES ` +
        `in this test: ${missingFromExpected.join(", ")}. Add them to the list and ensure ` +
        `their CSS block appears after the :is() catch-all.`,
    );
  });

  /**
   * Themes NOT marked `named: true` are "partial" — they only define the
   * 8–10 core palette tokens (--theme-primary, --theme-border, etc.) and
   * rely on the :is() catch-all for UI chrome tokens. This is intentional;
   * do not fail on them for missing complete blocks.
   */
  it("partial (non-named) themes are present in CSS but not required to have complete blocks", () => {
    const partial = THEME_OPTIONS.filter((t) => !t.named);
    const missingFromCss = partial
      .filter((t) => !cssThemeIds.has(t.id))
      .map((t) => t.id);
    assert.deepStrictEqual(
      missingFromCss,
      [],
      `Partial themes in registry but absent from CSS: ${missingFromCss.join(", ")}`,
    );
  });
});

// ── 3. :is() catch-all membership ↔ ordering expectations ─────────────────

describe(":is() catch-all membership synchronization", () => {
  /**
   * Parse the theme IDs actually listed inside the :is(...) selector text
   * (everything before the opening `{` of the catch-all block).
   */
  const selectorText = lines.slice(catchAllStart, catchAllEnd + 1).join("\n").split("{")[0];
  const catchAllMembers = new Set<string>();
  const memberRe = /\[data-theme="([^"]+)"\]/g;
  let match: RegExpExecArray | null;
  while ((match = memberRe.exec(selectorText)) !== null) {
    catchAllMembers.add(match[1]);
  }

  it("parsed at least one member from the :is() catch-all selector", () => {
    assert.ok(
      catchAllMembers.size > 0,
      "Failed to parse any [data-theme] selectors from the :is() catch-all. " +
        "The selector format may have changed — update the parser.",
    );
  });

  it("every complete named light theme is listed in the :is() catch-all", () => {
    const missingFromCatchAll = EXPECTED_COMPLETE_LIGHT_THEMES.filter(
      (id) => !catchAllMembers.has(id),
    );
    assert.deepStrictEqual(
      missingFromCatchAll,
      [],
      `Complete named light theme(s) missing from the :is() catch-all selector: ` +
        `${missingFromCatchAll.join(", ")}. They must appear in the catch-all to ` +
        `receive generic UI chrome defaults, then override them via their complete ` +
        `block appearing later in source order.`,
    );
  });

  it("no catch-all member with a complete block is missing from ordering expectations", () => {
    const untracked: string[] = [];
    for (const id of catchAllMembers) {
      if (
        findCompleteBlock(id) >= 0 &&
        !EXPECTED_COMPLETE_LIGHT_THEMES.includes(id)
      ) {
        untracked.push(id);
      }
    }
    assert.deepStrictEqual(
      untracked,
      [],
      `Theme(s) in the :is() catch-all have complete blocks but are NOT tracked ` +
        `in EXPECTED_COMPLETE_LIGHT_THEMES: ${untracked.join(", ")}. Add them so ` +
        `their source-order position is verified against the catch-all.`,
    );
  });
});
