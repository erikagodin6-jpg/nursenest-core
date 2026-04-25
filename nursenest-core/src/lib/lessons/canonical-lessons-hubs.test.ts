import assert from "node:assert/strict";
import { test } from "node:test";
import { ALLIED_PROFESSIONS } from "@/lib/allied/allied-professions-registry";
import { mapLegacyMarketingHref } from "@/lib/legacy-marketing-routes";
import {
  ALLIED_PROFESSION_QUERY_PARAM,
  isAlliedMarketingCorePathwayId,
} from "@/lib/lessons/canonical-lessons-hubs";
import { alliedHealthLessonDetailPath, alliedHealthLessonsIndexPath } from "@/lib/lessons/lesson-routes";

const sampleProfession = ALLIED_PROFESSIONS[0]!;

test("identifies allied core pathway ids", () => {
  assert.equal(isAlliedMarketingCorePathwayId("us-allied-core"), true);
  assert.equal(isAlliedMarketingCorePathwayId("ca-allied-core"), true);
  assert.equal(isAlliedMarketingCorePathwayId("us-rn-nclex-rn"), false);
  assert.equal(isAlliedMarketingCorePathwayId("ca-rpn-rex-pn"), false);
});

test("alliedHealthLessonsIndexPath returns canonical pathway lessons hub", () => {
  const href = alliedHealthLessonsIndexPath(sampleProfession.professionKey);

  assert.match(href, /^\/(us|canada)\/allied\/allied-health\/lessons\?/);
  assert.ok(href.includes(`${ALLIED_PROFESSION_QUERY_PARAM}=`));
  assert.equal(href.startsWith("/allied-health/"), false);
});

test("alliedHealthLessonDetailPath returns canonical pathway lesson detail path", () => {
  const href = alliedHealthLessonDetailPath(sampleProfession.professionKey, "sample-lesson-slug");

  assert.match(href, /^\/(us|canada)\/allied\/allied-health\/lessons\/sample-lesson-slug$/);
  assert.equal(href.startsWith("/allied-health/"), false);
});

test("mapLegacyMarketingHref maps legacy allied lesson hub URLs to canonical pathway hub", () => {
  assert.equal(
    mapLegacyMarketingHref("/allied-health/paramedic/lessons"),
    alliedHealthLessonsIndexPath("paramedic"),
  );
});