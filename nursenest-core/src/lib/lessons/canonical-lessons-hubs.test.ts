import assert from "node:assert/strict";
import { test } from "node:test";
import { ALLIED_PROFESSIONS } from "@/lib/allied/allied-professions-registry";
import { mapLegacyMarketingHref } from "@/lib/legacy-marketing-routes";
import {
  ALLIED_PROFESSION_QUERY_PARAM,
  isAlliedMarketingCorePathwayId,
} from "@/lib/lessons/canonical-lessons-hubs";
import { alliedHealthLessonDetailPath, alliedHealthLessonsIndexPath } from "@/lib/lessons/lesson-routes";

test("allied core pathway id guard", () => {
  assert.equal(isAlliedMarketingCorePathwayId("us-allied-core"), true);
  assert.equal(isAlliedMarketingCorePathwayId("ca-allied-core"), true);
  assert.equal(isAlliedMarketingCorePathwayId("us-rn-nclex-rn"), false);
});

test("alliedHealthLessonsIndexPath is the single pathway lessons hub (not /allied-health/.../lessons)", () => {
  const prof = ALLIED_PROFESSIONS[0]!;
  const href = alliedHealthLessonsIndexPath(prof.professionKey);
  assert.match(href, /^\/(us|canada)\/allied\/allied-health\/lessons\?/);
  assert.ok(href.includes(`${ALLIED_PROFESSION_QUERY_PARAM}=`));
  assert.equal(href.startsWith("/allied-health/"), false, "legacy allied-health marketing root must not be the hub");
});

test("alliedHealthLessonDetailPath is pathway lesson detail (no allied-health prefix)", () => {
  const prof = ALLIED_PROFESSIONS[0]!;
  const href = alliedHealthLessonDetailPath(prof.professionKey, "sample-lesson-slug");
  assert.match(href, /^\/(us|canada)\/allied\/allied-health\/lessons\/sample-lesson-slug$/);
  assert.equal(href.startsWith("/allied-health/"), false);
});

test("mapLegacyMarketingHref maps legacy allied lesson hub URLs to canonical pathway", () => {
  assert.equal(mapLegacyMarketingHref("/allied-health/paramedic/lessons"), alliedHealthLessonsIndexPath("paramedic"));
});
