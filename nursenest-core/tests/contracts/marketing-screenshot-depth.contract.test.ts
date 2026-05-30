import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { MARKETING_SCREENSHOT_DEPTH_POLICY } from "../../scripts/lib/marketing-screenshot-depth";

const ROOT = process.cwd();

function read(relativePath: string): string {
  return fs.readFileSync(path.join(ROOT, relativePath), "utf8");
}

function targetCount(source: string): number {
  return (source.match(/preparationRequired:\s*true,/g) ?? []).length;
}

describe("marketing screenshot depth and conversion prioritization", () => {
  it("codifies the golden rule: learning activity beats hub capture", () => {
    assert.equal(MARKETING_SCREENSHOT_DEPTH_POLICY.goldenRule, "learning_activity_over_hub");
    assert.equal(MARKETING_SCREENSHOT_DEPTH_POLICY.highestPriority, "real_learning_experience");
    for (const rejected of ["hub", "category-page", "menu", "navigation", "landing-page", "empty-dashboard"]) {
      assert.ok(MARKETING_SCREENSHOT_DEPTH_POLICY.rejects.includes(rejected as never), `missing rejected surface ${rejected}`);
    }
  });

  it("requires every homepage screenshot target to open and advance a learning state before capture", () => {
    const source = read("scripts/generate-homepage-screenshots.ts");
    const count = targetCount(source);

    assert.ok(count >= 12, "homepage generator should cover the required product screenshots");
    assert.equal((source.match(/prepare:\s*capture/g) ?? []).length, count);
    assert.equal((source.match(/preparationRequired:\s*true,/g) ?? []).length, count);
    assert.equal((source.match(/reviewGate:\s*REVIEW_GATE/g) ?? []).length, count);
    assert.doesNotMatch(source, /captureSurface:\s*"hub"/);
    assert.doesNotMatch(source, /captureSurface:\s*"category-page"/);
    assert.match(source, /verifyEducationalState/);
    assert.match(source, /captureAnsweredQuestion/);
    assert.match(source, /captureBowtieQuestion/);
    assert.match(source, /captureMatrixQuestion/);
    assert.match(source, /captureEcgDetectiveMode/);
    assert.match(source, /captureLabInterpretation/);
    assert.match(source, /captureMedicationMathActivity/);
  });

  it("requires every marketing screenshot target to be a product demonstration, not a navigation surface", () => {
    const source = read("scripts/marketing-screenshot-generator.ts");
    const count = targetCount(source);

    assert.ok(count >= 12, "marketing generator should cover deep product demos");
    assert.equal((source.match(/prepare:\s*capture/g) ?? []).length, count);
    assert.equal((source.match(/captureSurface:\s*"learning-activity"/g) ?? []).length >= 10, true);
    assert.equal((source.match(/preparationRequired:\s*true,/g) ?? []).length, count);
    assert.doesNotMatch(source, /captureSurface:\s*"hub"/);
    assert.doesNotMatch(source, /captureSurface:\s*"menu"/);
    assert.match(source, /assertMarketingScreenshotDepth/);
    assert.match(source, /verifyEducationalState/);
    assert.match(source, /readiness report with real trends/);
  });
});
