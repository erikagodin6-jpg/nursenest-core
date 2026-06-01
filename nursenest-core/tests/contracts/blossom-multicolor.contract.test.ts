/**
 * Blossom must expose nine distinct chart hues for lesson + marketing multi-color parity.
 *
 * Run: `npx tsx --test tests/contracts/blossom-multicolor.contract.test.ts`
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const SEMANTIC_CSS = readFileSync(resolve(ROOT, "src/app/semantic-status-tokens.css"), "utf8");
const MULTI_CSS = readFileSync(resolve(ROOT, "src/app/styles/marketing/blossom-multicolor.css"), "utf8");
const THEME_CSS = readFileSync(resolve(ROOT, "src/app/theme-palettes.css"), "utf8");

function blossomSemanticBlock(): string {
  const re = /html\[data-theme="blossom"\]\s*\{([\s\S]*?)\n\}/m;
  const m = SEMANTIC_CSS.match(re);
  assert.ok(m?.[1], "blossom block in semantic-status-tokens.css");
  return m[1];
}

function chartHex(block: string, n: number): string | null {
  const re = new RegExp(`--semantic-chart-${n}:\\s*(#[0-9a-fA-F]{3,8})`);
  const m = block.match(re);
  return m?.[1]?.toLowerCase() ?? null;
}

describe("blossom multicolor clinical spectrum", () => {
  it("defines nine pairwise-distinct chart hues", () => {
    const block = blossomSemanticBlock();
    const hues: string[] = [];
    for (let i = 1; i <= 9; i++) {
      const hex = chartHex(block, i);
      assert.ok(hex, `missing --semantic-chart-${i} on blossom`);
      assert.ok(!hues.includes(hex), `chart-${i} duplicates another chart slot: ${hex}`);
      hues.push(hex);
    }
    assert.equal(hues[0], "#e94f82", "chart-1 should use restrained Cherry Blossom pink");
    assert.equal(hues[1], "#ffb978", "chart-2 should use warm peach");
    assert.equal(hues[2], "#f8c84f", "chart-3 should use sunshine yellow");
    assert.equal(hues[3], "#65c4e9", "chart-4 should use sky blue");
    assert.notEqual(hues[4], hues[0], "chart-5 rose must differ from chart-1 pink");
  });

  it("lesson section bands use distinct base hues in theme-palettes", () => {
    const re = /html\[data-theme="blossom"\]\s*\{([\s\S]*?)\n\}/m;
    const m = THEME_CSS.match(re);
    assert.ok(m?.[1], "blossom block in theme-palettes.css");
    const block = m[1];
    assert.match(block, /--lesson-summary:[^;]*var\(--blossom-surface\)/i);
    assert.match(block, /--lesson-key-concepts:[^;]*var\(--blossom-primary\)/i);
    assert.match(block, /--lesson-diagnostics:[^;]*var\(--blossom-accent-blue\)/i);
    assert.match(block, /--lesson-interventions:[^;]*var\(--blossom-accent-peach\)/i);
    assert.match(block, /--lesson-clinical-pearls:[^;]*var\(--blossom-accent-peach\)/i);
  });

  it("marketing CSS maps premium meters to multiple chart tokens", () => {
    assert.match(
      MULTI_CSS,
      /--nn-premium-meter-brand:\s*linear-gradient\(\s*90deg,\s*var\(--semantic-chart-1\),\s*var\(--semantic-chart-2\)/,
    );
    assert.match(
      MULTI_CSS,
      /--nn-premium-meter-info:\s*linear-gradient\(\s*90deg,\s*var\(--semantic-chart-3\),\s*var\(--semantic-chart-7\)/,
    );
    assert.match(MULTI_CSS, /\.nn-premium-home-section--pathways.*chart-1/s);
    assert.match(MULTI_CSS, /nav\s+a:nth-child\(5n \+ 3\)/);
  });
});
