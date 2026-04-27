import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { marketingPathwayLessonsIndexPath } from "@/lib/lessons/lesson-routes";
import { resolveMarketingTierHubStudyActionHref } from "@/lib/navigation/marketing-tier-hub-study-hrefs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/** `nursenest-core/` root (this file lives in `src/lib/navigation/`). */
const NURSENEST_CORE_ROOT = path.resolve(__dirname, "../../..");

const MARKETING_LESSONS_INDEX_PAGE = path.join(
  NURSENEST_CORE_ROOT,
  "src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/page.tsx",
);

describe("nursing lessons hub — route module exists on disk", () => {
  it("serves marketing pathway lessons index from the expected App Router file", () => {
    assert.ok(
      fs.existsSync(MARKETING_LESSONS_INDEX_PAGE),
      `missing ${path.relative(NURSENEST_CORE_ROOT, MARKETING_LESSONS_INDEX_PAGE)}`,
    );
    const src = fs.readFileSync(MARKETING_LESSONS_INDEX_PAGE, "utf8");
    assert.match(
      src,
      /PathwayLessonsCurriculumHub|pathway-lessons-curriculum-hub/,
      "lessons index page should load the curriculum hub (not a duplicate tier overview stub)",
    );
    assert.equal(src.includes("NursingTierHubPage"), false);
    assert.equal(src.includes("buildNursingTierHubContent"), false);
    assert.ok(src.includes("data-nn-qa-pathway-lessons-hub"));
  });

  it("RN / PN / NP resolved lessons hrefs map to the shared dynamic lessons route file", () => {
    for (const id of ["us-rn-nclex-rn", "us-lpn-nclex-pn", "us-np-fnp"] as const) {
      const pathway = getExamPathwayById(id);
      assert.ok(pathway);
      const href = marketingPathwayLessonsIndexPath(pathway);
      assert.ok(href.startsWith("/"));
      const resolved = resolveMarketingTierHubStudyActionHref(pathway, "lessons", "#");
      assert.equal(resolved, href);
    }
  });
});
