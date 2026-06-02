/**
 * Static guard for Analytics Maturity hero visual cleanup.
 *
 * Run from `nursenest-core/`:
 *   node --import tsx --test tests/contracts/analytics-hero-decorative-divider.contract.test.ts
 */
import * as assert from "node:assert/strict";
import * as fs from "node:fs";
import * as path from "node:path";
import { describe, it } from "node:test";

const ROOT = process.cwd();
const CSS_FILES = [
  "src/app/learner-cockpit-premium.css",
  "src/app/premium-atmospheric-ecosystem-convergence.css",
  "src/app/premium-redesign-2026.css",
  "src/app/premium-color-depth-convergence.css",
];

function read(relativePath: string): string {
  return fs.readFileSync(path.resolve(ROOT, relativePath), "utf8");
}

describe("analytics hero decorative divider cleanup", () => {
  it("does not introduce analytics/readiness hero pseudo-element divider rules", () => {
    for (const file of CSS_FILES) {
      const css = read(file);
      assert.doesNotMatch(
        css,
        /\.nn-premium-analytics-report(?=[\s\S]{0,220}::(?:before|after))/,
        `${file} must not attach decorative pseudo-elements to analytics report heroes`,
      );
      assert.doesNotMatch(
        css,
        /\.nn-premium-readiness-page-hero(?=[\s\S]{0,220}::(?:before|after))/,
        `${file} must not attach decorative pseudo-elements to readiness hero surfaces`,
      );
    }
  });

  it("keeps analytics atmospheric styling based on surfaces and depth rather than ornamental divider utilities", () => {
    const css = read("src/app/premium-redesign-2026.css");
    const analyticsBlock = css.match(/\.nn-premium-analytics-report\s*\{[\s\S]*?\n\}/)?.[0] ?? "";
    assert.match(analyticsBlock, /background:/, "analytics report should retain atmospheric surface depth");
    assert.doesNotMatch(analyticsBlock, /border-image|clip-path|mask-image|stroke-dasharray|underline|divider/i);
  });
});
