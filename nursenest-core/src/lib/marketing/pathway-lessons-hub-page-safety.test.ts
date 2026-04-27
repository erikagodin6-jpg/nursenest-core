import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const NURSENEST_CORE_ROOT = path.resolve(__dirname, "../../..");

const LESSONS_PAGE = path.join(
  NURSENEST_CORE_ROOT,
  "src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/page.tsx",
);

describe("pathway lessons hub page — production safety invariants", () => {
  it("never imports or renders NursingTierHubPage (lessons route is not a tier overview duplicate)", () => {
    const src = fs.readFileSync(LESSONS_PAGE, "utf8");
    assert.equal(src.includes("NursingTierHubPage"), false);
    assert.equal(src.includes("buildNursingTierHubContent"), false);
    assert.ok(src.includes("PathwayLessonsCurriculumHub"));
    assert.ok(src.includes("data-nn-qa-pathway-lessons-hub"));
    assert.ok(src.includes("data-nn-qa-pathway-lessons-unavailable"));
  });

  it("does not use notFound() for pathway resolution (shows explicit unavailable UI instead)", () => {
    const src = fs.readFileSync(LESSONS_PAGE, "utf8");
    assert.equal(/\bnotFound\s*\(/.test(src), false);
    assert.ok(src.includes("Lessons hub unavailable for this pathway"));
  });
});
