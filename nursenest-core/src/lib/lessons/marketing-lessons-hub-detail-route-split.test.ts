import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const here = dirname(fileURLToPath(import.meta.url));
const srcRoot = join(here, "..", "..");

const marketingHubLessonsPage = join(
  srcRoot,
  "app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/page.tsx",
);
const marketingLessonDetailPage = join(
  srcRoot,
  "app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/[lessonSlug]/page.tsx",
);
const marketingLessonDetailBody = join(
  srcRoot,
  "app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/[lessonSlug]/pathway-lesson-detail-page-body.tsx",
);

describe("marketing lessons hub vs lesson detail routing", () => {
  it("hub index uses browseable curriculum hub, not lesson detail body", () => {
    const src = readFileSync(marketingHubLessonsPage, "utf8");
    assert.match(src, /PathwayLessonsCurriculumHub/);
    assert.match(src, /LessonsPageShell/);
    assert.ok(!src.includes("PathwayLessonDetailPageBody"));
    assert.ok(!src.includes("pathway-lesson-detail-page-body"));
  });

  it("lesson detail route uses redesigned detail body, not curriculum hub", () => {
    const pageSrc = readFileSync(marketingLessonDetailPage, "utf8");
    const bodySrc = readFileSync(marketingLessonDetailBody, "utf8");
    assert.match(pageSrc, /PathwayLessonDetailPageBody/);
    assert.ok(!pageSrc.includes("PathwayLessonsCurriculumHub"));
    assert.ok(!bodySrc.includes("PathwayLessonsCurriculumHub"));
    assert.ok(!bodySrc.includes("pathway-lessons-curriculum-hub"));
  });

  it("lesson detail body does not wire curriculum hub empty-state marker", () => {
    const bodySrc = readFileSync(marketingLessonDetailBody, "utf8");
    assert.ok(!bodySrc.includes("pathway-lessons-curriculum-hub"));
    assert.ok(!bodySrc.includes("PathwayLessonsCurriculumHub"));
  });
});
