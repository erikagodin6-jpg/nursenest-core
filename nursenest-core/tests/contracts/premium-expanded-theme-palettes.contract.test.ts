/**
 * Static guard for the premium expanded theme palette pass.
 *
 * Dense learner surfaces need more than one brand hue and five chart slots.
 * This test keeps Ocean, Blossom, Midnight, Sunset, and Aurora wired to the
 * expanded semantic palette used by dashboards, reports, lessons, cards, and modules.
 *
 * Run from `nursenest-core/`:
 *   node --import tsx --test tests/contracts/premium-expanded-theme-palettes.contract.test.ts
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

const SEMANTIC_CSS_PATH = path.resolve(process.cwd(), "src/app/semantic-status-tokens.css");
const PREMIUM_CSS_PATH = path.resolve(process.cwd(), "src/app/premium-redesign-2026.css");

const REQUIRED_PUBLIC_THEMES = ["ocean", "blossom", "midnight", "sunset", "aurora"] as const;

function readCss(filePath: string): string {
  return fs.readFileSync(filePath, "utf8");
}

function extractThemeBlock(css: string, theme: string): string {
  const selector = `html[data-theme="${theme}"]`;
  const start = css.indexOf(`${selector} {`, css.indexOf("Premium expanded ecosystem palettes"));
  assert.notEqual(start, -1, `${theme} must have a premium expanded palette block`);

  const bodyStart = css.indexOf("{", start);
  assert.notEqual(bodyStart, -1, `${theme} palette block must open`);

  let depth = 0;
  for (let i = bodyStart; i < css.length; i += 1) {
    const char = css[i];
    if (char === "{") depth += 1;
    if (char === "}") {
      depth -= 1;
      if (depth === 0) return css.slice(bodyStart + 1, i);
    }
  }

  throw new Error(`${theme} palette block did not close`);
}

describe("premium expanded theme palettes", () => {
  const semanticCss = readCss(SEMANTIC_CSS_PATH);
  const premiumCss = readCss(PREMIUM_CSS_PATH);

  it("defines nine chart slots and supporting panel/accent aliases for all five public themes", () => {
    for (const theme of REQUIRED_PUBLIC_THEMES) {
      const block = extractThemeBlock(semanticCss, theme);

      for (let i = 1; i <= 9; i += 1) {
        assert.match(block, new RegExp(`--semantic-chart-${i}\\s*:`), `${theme} must define chart ${i}`);
      }

      for (const alias of [
        "turquoise",
        "seafoam",
        "mint",
        "periwinkle",
        "peach",
        "gold",
        "plum",
        "indigo",
        "lavender",
      ]) {
        assert.match(block, new RegExp(`--semantic-accent-${alias}\\s*:`), `${theme} must define ${alias}`);
      }

      for (const panel of ["aqua", "mint", "lavender", "peach", "gold"]) {
        assert.match(block, new RegExp(`--semantic-panel-${panel}\\s*:`), `${theme} must define ${panel} panel`);
      }
    }
  });

  it("exposes educational module aliases so dense study surfaces avoid brand-only accents", () => {
    for (const moduleToken of [
      "clinical-pearls",
      "pharmacology",
      "labs",
      "ecg",
      "ngn",
      "safety",
      "communication",
      "delegation",
      "weak-areas",
      "flashcards",
      "cat",
      "practice",
    ]) {
      assert.match(
        semanticCss,
        new RegExp(`--nn-module-${moduleToken}\\s*:`),
        `missing module alias ${moduleToken}`,
      );
    }
  });

  it("shared premium surfaces consume expanded chart slots rather than stopping at five hues", () => {
    for (const chartSlot of ["--semantic-chart-6", "--semantic-chart-7", "--semantic-chart-8", "--semantic-chart-9"]) {
      assert.match(semanticCss, new RegExp(chartSlot), `semantic CSS should consume ${chartSlot}`);
      assert.match(premiumCss, new RegExp(chartSlot), `premium CSS should consume ${chartSlot}`);
    }

    assert.match(premiumCss, /premium-card-glow/, "pathway cards should get palette-varied glow accents");
    assert.match(semanticCss, /nn-metric-tile:nth-of-type\(9n \+ 9\)/, "metric tiles should rotate across nine hues");
  });
});
