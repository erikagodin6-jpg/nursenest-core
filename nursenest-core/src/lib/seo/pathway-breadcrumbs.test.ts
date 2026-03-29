import assert from "node:assert/strict";
import test from "node:test";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import {
  EXAM_LESSONS_INDEX,
  blogPostBreadcrumbs,
  examLessonsIndexBreadcrumbs,
  pathwayLessonDetailBreadcrumbs,
  pathwayOverviewBreadcrumbs,
} from "@/lib/seo/pathway-breadcrumbs";
import { toAbsoluteSiteUrl } from "@/lib/seo/breadcrumb-utils";

const caRn = getExamPathwayById("ca-rn-nclex-rn");
assert.ok(caRn, "fixture pathway ca-rn-nclex-rn");

test("no country crumb points to exam-lessons index", () => {
  const { crumbs, schemaItems } = pathwayOverviewBreadcrumbs(caRn!);
  for (const c of crumbs) {
    if (c.href === EXAM_LESSONS_INDEX.path) {
      assert.equal(c.name, EXAM_LESSONS_INDEX.label);
    }
    assert.notEqual(c.name, "Canada");
    assert.notEqual(c.name, "United States");
  }
  for (const s of schemaItems) {
    assert.notEqual(s.name, "Canada");
    if (s.item.includes("/exam-lessons")) {
      assert.equal(s.name, EXAM_LESSONS_INDEX.label);
    }
  }
});

test("lesson detail: labels align with destinations; final schema URL is lesson path", () => {
  const lessonSlug = "fluid-balance-acute-care";
  const lessonTitle = "Fluid lesson";
  const { crumbs, schemaItems } = pathwayLessonDetailBreadcrumbs(caRn!, lessonSlug, lessonTitle);
  const lessonPath = `/canada/rn/nclex-rn/lessons/${lessonSlug}`;

  const examLessonsCrumb = crumbs[1];
  assert.equal(examLessonsCrumb?.name, EXAM_LESSONS_INDEX.label);
  assert.equal(examLessonsCrumb?.href, EXAM_LESSONS_INDEX.path);

  const hubCrumb = crumbs[2];
  assert.equal(hubCrumb?.name, caRn!.shortName);
  assert.equal(hubCrumb?.href, "/canada/rn/nclex-rn");

  const lastSchema = schemaItems[schemaItems.length - 1];
  assert.equal(lastSchema?.name, lessonTitle);
  assert.equal(lastSchema?.item, toAbsoluteSiteUrl(lessonPath));
});

test("exam-lessons index: single crumb title matches constant", () => {
  const { crumbs, schemaItems } = examLessonsIndexBreadcrumbs();
  assert.equal(crumbs[1]?.name, EXAM_LESSONS_INDEX.label);
  assert.equal(schemaItems[1]?.item, toAbsoluteSiteUrl(EXAM_LESSONS_INDEX.path));
});

test("blog post: final schema item matches post path", () => {
  const { schemaItems } = blogPostBreadcrumbs("Hello", "hello-world");
  assert.equal(schemaItems[schemaItems.length - 1]?.item, toAbsoluteSiteUrl("/blog/hello-world"));
});
