import assert from "node:assert/strict";
import test from "node:test";
import {
  defaultIntentForResolverKind,
  intentEmitsBreadcrumbSchema,
} from "@/lib/breadcrumbs/breadcrumb-intent";
import { resolveBreadcrumbResolution } from "@/lib/breadcrumbs/breadcrumb-resolver";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";

test("learner intent suppresses schema items", () => {
  const pathway = getExamPathwayById("ca-rn-nclex-rn");
  assert.ok(pathway);
  const resolution = resolveBreadcrumbResolution({
    kind: "learner-pathway-lesson",
    pathway,
    lesson: { slug: "test-lesson", title: "Test", topic: "cardio" },
    lessonTitleDisplay: "Test Lesson",
  });
  assert.equal(resolution.intent, "learner");
  assert.equal(resolution.schemaItems.length, 0);
  assert.ok(resolution.crumbs.length >= 2);
});

test("education intent emits schema", () => {
  assert.equal(intentEmitsBreadcrumbSchema("education"), true);
  assert.equal(intentEmitsBreadcrumbSchema("learner"), false);
  const ecg = resolveBreadcrumbResolution({ kind: "ecg-hub" });
  assert.equal(ecg.intent, "education");
  assert.ok(ecg.schemaItems.length >= 2);
});

test("default intents by kind", () => {
  assert.equal(defaultIntentForResolverKind("pathway-pricing"), "discovery");
  assert.equal(defaultIntentForResolverKind("pathway-lesson-detail"), "education");
  assert.equal(defaultIntentForResolverKind("learner-pathway-lesson"), "learner");
});
