import assert from "node:assert/strict";
import test from "node:test";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import {
  APP_LEARNER_LESSONS_INDEX_PATH,
  alliedHealthLessonDetailPath,
  alliedHealthLessonsIndexPath,
  alliedHealthSegmentPath,
  appLearnerLessonDetailPath,
  isMarketingPathwayLessonDetailPath,
  isMarketingPathwayLessonsIndexPath,
  marketingExamHubBasePath,
  marketingLessonDetailHref,
  marketingLessonsTopicClusterPath,
  marketingPathwayLessonDetailPath,
  marketingPathwayLessonsIndexPath,
  marketingPathwayLessonTopicClusterPath,
  normalizeMarketingExamHubRouteParams,
  preNursingLessonDetailPath,
  PRE_NURSING_LESSONS_INDEX_PATH,
  PUBLIC_MARKETING_EXAM_LESSONS_HUB_PATH,
} from "@/lib/lessons/lesson-routes";

const caRn = getExamPathwayById("ca-rn-nclex-rn");
assert.ok(caRn, "fixture pathway");

test("marketing pathway index and detail align with buildExamPathwayPath", () => {
  assert.equal(marketingPathwayLessonsIndexPath(caRn!), buildExamPathwayPath(caRn!, "lessons"));
  assert.equal(
    marketingPathwayLessonDetailPath(caRn!, "fluid-balance"),
    `${buildExamPathwayPath(caRn!, "lessons")}/fluid-balance`,
  );
  assert.equal(marketingExamHubBasePath(caRn!), buildExamPathwayPath(caRn!));
});

test("marketingLessonDetailHref encodes slug and strips trailing slash on base", () => {
  assert.equal(
    marketingLessonDetailHref("/canada/rn/nclex-rn/lessons/", "a b"),
    "/canada/rn/nclex-rn/lessons/a%20b",
  );
  assert.equal(marketingLessonDetailHref("/x/lessons", null), null);
});

test("topic cluster paths append encoded topic slug", () => {
  assert.equal(
    marketingPathwayLessonTopicClusterPath(caRn!, "cardio care"),
    `${buildExamPathwayPath(caRn!, "lessons")}/topics/cardio%20care`,
  );
  assert.equal(
    marketingLessonsTopicClusterPath("/us/rn/nclex-rn/lessons", "t1"),
    "/us/rn/nclex-rn/lessons/topics/t1",
  );
  assert.equal(marketingLessonsTopicClusterPath("/us/rn/nclex-rn/lessons", ""), "/us/rn/nclex-rn/lessons");
});

test("allied health segment and lesson paths encode segments", () => {
  assert.equal(alliedHealthSegmentPath("paramedic-exam-prep"), "/allied-health/paramedic-exam-prep");
  assert.equal(alliedHealthLessonsIndexPath("paramedic"), "/allied-health/paramedic/lessons");
  assert.equal(alliedHealthLessonDetailPath("paramedic", "airway-101"), "/allied-health/paramedic/lessons/airway-101");
});

test("app and pre-nursing lesson detail paths", () => {
  assert.equal(appLearnerLessonDetailPath("clm_abc"), `${APP_LEARNER_LESSONS_INDEX_PATH}/clm_abc`);
  assert.equal(preNursingLessonDetailPath("math-review"), `${PRE_NURSING_LESSONS_INDEX_PATH}/math-review`);
});

test("normalizeMarketingExamHubRouteParams lowercases trimmed segments", () => {
  assert.deepEqual(
    normalizeMarketingExamHubRouteParams({ locale: " US ", slug: " Rn ", examCode: "NCLEX-RN " }),
    { countrySlug: "us", roleTrack: "rn", examCode: "nclex-rn" },
  );
});

test("isMarketingPathway* helpers match nursing exam lesson URLs only", () => {
  assert.equal(isMarketingPathwayLessonsIndexPath("/canada/rn/nclex-rn/lessons"), true);
  assert.equal(isMarketingPathwayLessonDetailPath("/canada/rn/nclex-rn/lessons/slug-here"), true);
  assert.equal(isMarketingPathwayLessonsIndexPath("/allied-health/paramedic/lessons"), false);
  assert.equal(isMarketingPathwayLessonDetailPath("/pre-nursing/lessons/x"), false);
});

test("public marketing exam lessons hub path is stable", () => {
  assert.equal(PUBLIC_MARKETING_EXAM_LESSONS_HUB_PATH, "/lessons");
});
