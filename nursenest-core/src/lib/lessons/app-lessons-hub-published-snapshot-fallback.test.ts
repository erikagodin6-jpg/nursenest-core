import test from "node:test";
import assert from "node:assert/strict";
import {
  appLessonsHubListOptsForSnapshot,
  lessonsListBlockFromPathwayHubSnapshot,
} from "@/lib/lessons/app-lessons-hub-published-snapshot-fallback";
import type { PathwayLessonsPageResult } from "@/lib/lessons/pathway-lesson-loader";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";
import type { StudyPublishedSnapshotEnvelope } from "@/lib/study-content-failover/study-published-snapshot-types";

test("appLessonsHubListOptsForSnapshot matches q + topic slug pairing", () => {
  assert.deepEqual(appLessonsHubListOptsForSnapshot({ qEffective: "airway", topicSlugFilter: "gas-exchange" }), {
    q: "airway",
    topicSlugsIn: ["gas-exchange"],
  });
  assert.deepEqual(appLessonsHubListOptsForSnapshot({ qEffective: "x", topicSlugFilter: null }), { q: "x" });
  assert.deepEqual(appLessonsHubListOptsForSnapshot({ qEffective: null, topicSlugFilter: "renal" }), {
    topicSlugsIn: ["renal"],
  });
  assert.equal(appLessonsHubListOptsForSnapshot({ qEffective: null, topicSlugFilter: null }), undefined);
});

test("lessonsListBlockFromPathwayHubSnapshot maps rows for app hub", () => {
  const item = {
    id: "pl_1",
    slug: "lesson-a",
    title: "Lesson A",
    topic: "T",
    topicSlug: "t",
    bodySystem: "B",
    system: "B",
    previewSectionCount: 1,
    seoTitle: "",
    seoDescription: "Long desc here",
    sections: [],
    structuralQuality: { publicComplete: true },
    exams: [],
    countries: [],
  } as PathwayLessonRecord;

  const payload: PathwayLessonsPageResult = {
    items: [item],
    total: 5,
    page: 1,
    pageSize: 20,
    pageCount: 1,
  };

  const envelope: StudyPublishedSnapshotEnvelope<PathwayLessonsPageResult> = {
    schema: "nursenest.study_snapshot.v1",
    surface: "pathway_lessons_hub",
    version: "v-test",
    capturedAt: "2026-01-01T00:00:00.000Z",
    payload,
  };

  const block = lessonsListBlockFromPathwayHubSnapshot("pathway-x", envelope);
  assert.ok(block);
  assert.equal(block?.source, "pathway_lessons");
  assert.equal(block?.total, 5);
  assert.equal(block?.rows.length, 1);
  assert.equal(block?.rows[0]?.pathwayMeta.slug, "lesson-a");
});
