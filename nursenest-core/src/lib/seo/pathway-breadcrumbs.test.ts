import assert from "node:assert/strict";
import test from "node:test";
import { buildExamPathwayPath, getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import {
  EXAM_LESSONS_INDEX,
  blogPostBreadcrumbs,
  examLessonsIndexBreadcrumbs,
  pathwayLessonDetailBreadcrumbs,
  pathwayLessonsHubBreadcrumbs,
  pathwayOverviewBreadcrumbs,
  pathwayPricingBreadcrumbs,
  pathwayQuestionsHubBreadcrumbs,
  pathwayTopicClusterBreadcrumbs,
} from "@/lib/seo/pathway-breadcrumbs";
import { toAbsoluteSiteUrl } from "@/lib/seo/breadcrumb-utils";
import { getProgrammaticSeoPage } from "@/lib/seo/programmatic-registry";

const caRn = getExamPathwayById("ca-rn-nclex-rn");
assert.ok(caRn, "fixture pathway ca-rn-nclex-rn");
const usPn = getExamPathwayById("us-lpn-nclex-pn");
assert.ok(usPn, "fixture pathway us-lpn-nclex-pn");
const nclexRnPage = getProgrammaticSeoPage("nclex-rn-practice-questions");
assert.ok(nclexRnPage);
const rexPnPage = getProgrammaticSeoPage("rex-pn-practice-questions");
assert.ok(rexPnPage);

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
    if (s.item.includes("/lessons")) {
      assert.equal(s.name, EXAM_LESSONS_INDEX.label);
    }
  }
});

test("lesson detail: programmatic parent label and URL match registry h1; schema aligns with crumbs", () => {
  const lessonSlug = "fluid-balance-acute-care";
  const lessonTitle = "Fluid lesson";
  const { crumbs, schemaItems } = pathwayLessonDetailBreadcrumbs(caRn!, lessonSlug, lessonTitle);
  const lessonPath = `/canada/rn/nclex-rn/lessons/${lessonSlug}`;

  const parentCrumb = crumbs[1];
  assert.equal(parentCrumb?.name, nclexRnPage!.h1);
  assert.equal(parentCrumb?.href, "/nclex-rn-practice-questions");

  const hubCrumb = crumbs[2];
  assert.equal(hubCrumb?.name, caRn!.shortName);
  assert.equal(hubCrumb?.href, "/canada/rn/nclex-rn");

  assert.equal(schemaItems[1]?.name, nclexRnPage!.h1);
  assert.equal(schemaItems[1]?.item, toAbsoluteSiteUrl("/nclex-rn-practice-questions"));

  const lastSchema = schemaItems[schemaItems.length - 1];
  assert.equal(lastSchema?.name, lessonTitle);
  assert.equal(lastSchema?.item, toAbsoluteSiteUrl(lessonPath));
});

test("US PN lesson chain uses rex-pn programmatic parent (same as breadcrumb text)", () => {
  const { crumbs, schemaItems } = pathwayLessonDetailBreadcrumbs(usPn!, "topic-a", "Lesson A");
  assert.equal(crumbs[1]?.name, rexPnPage!.h1);
  assert.equal(crumbs[1]?.href, "/rex-pn-practice-questions");
  assert.equal(schemaItems[1]?.item, toAbsoluteSiteUrl("/rex-pn-practice-questions"));
});

test("lessons hub, topic cluster, questions hub, pricing use same second crumb as overview", () => {
  const overview = pathwayOverviewBreadcrumbs(caRn!);
  const lessons = pathwayLessonsHubBreadcrumbs(caRn!);
  const topic = pathwayTopicClusterBreadcrumbs(caRn!, "cardio", "Cardiovascular");
  const questions = pathwayQuestionsHubBreadcrumbs(caRn!);
  const pricing = pathwayPricingBreadcrumbs(caRn!);

  for (const b of [lessons, topic, questions, pricing]) {
    assert.equal(b.crumbs[1]?.name, overview.crumbs[1]?.name);
    assert.equal(b.crumbs[1]?.href, overview.crumbs[1]?.href);
    assert.equal(b.schemaItems[1]?.name, overview.schemaItems[1]?.name);
    assert.equal(b.schemaItems[1]?.item, overview.schemaItems[1]?.item);
  }
});

test("unmapped pathway falls back to exam-lessons index in breadcrumbs", () => {
  const synthetic = { ...caRn!, id: "__unmapped_test_pathway__" };
  const { crumbs, schemaItems } = pathwayOverviewBreadcrumbs(synthetic);
  assert.equal(crumbs[1]?.name, EXAM_LESSONS_INDEX.label);
  assert.equal(crumbs[1]?.href, EXAM_LESSONS_INDEX.path);
  assert.equal(schemaItems[1]?.name, EXAM_LESSONS_INDEX.label);
  assert.equal(schemaItems[1]?.item, toAbsoluteSiteUrl(EXAM_LESSONS_INDEX.path));
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

test("NP alias overview: hubBasePath keeps self-canonical keyword URL in breadcrumb JSON-LD", () => {
  const usFnp = getExamPathwayById("us-np-fnp");
  assert.ok(usFnp);
  const aliasBase = "/us/np/aanp-practice-test";
  const { crumbs, schemaItems } = pathwayOverviewBreadcrumbs(usFnp!, { hubBasePath: aliasBase });
  assert.equal(crumbs[2]?.href, undefined);
  assert.equal(schemaItems[2]?.item, toAbsoluteSiteUrl(aliasBase));
});

test("NP subpages: omit hubBasePath so breadcrumbs match core pathway URLs (canonical alignment)", () => {
  const usFnp = getExamPathwayById("us-np-fnp");
  assert.ok(usFnp);
  const coreHub = buildExamPathwayPath(usFnp!);
  const lessons = pathwayLessonsHubBreadcrumbs(usFnp!);
  assert.equal(lessons.crumbs[2]?.href, coreHub);
  assert.equal(lessons.schemaItems[3]?.item, toAbsoluteSiteUrl(`${coreHub}/lessons`));
});

test("NP questions hub: omit hubBasePath so question bank schema matches core canonical URL", () => {
  const usFnp = getExamPathwayById("us-np-fnp");
  assert.ok(usFnp);
  const coreHub = buildExamPathwayPath(usFnp!);
  const q = pathwayQuestionsHubBreadcrumbs(usFnp!);
  assert.equal(q.crumbs[2]?.href, coreHub);
  assert.equal(q.schemaItems[3]?.item, toAbsoluteSiteUrl(`${coreHub}/questions`));
});
