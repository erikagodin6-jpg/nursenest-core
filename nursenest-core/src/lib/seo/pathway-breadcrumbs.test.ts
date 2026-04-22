import assert from "node:assert/strict";
import test from "node:test";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import {
  blogPostBreadcrumbs,
  examLessonsIndexBreadcrumbs,
  pathwayLessonDetailBreadcrumbs,
  pathwayLessonsHubBreadcrumbs,
  pathwayCatPracticeBreadcrumbs,
  pathwayOverviewBreadcrumbs,
  pathwayPricingBreadcrumbs,
  pathwayQuestionsHubBreadcrumbs,
  pathwayTopicClusterBreadcrumbs,
} from "@/lib/seo/pathway-breadcrumbs";
import { countryExamGuideHref, toAbsoluteSiteUrl } from "@/lib/seo/breadcrumb-utils";

const caRn = getExamPathwayById("ca-rn-nclex-rn");
assert.ok(caRn, "fixture pathway ca-rn-nclex-rn");
const usPn = getExamPathwayById("us-lpn-nclex-pn");
assert.ok(usPn, "fixture pathway us-lpn-nclex-pn");
const caRpn = getExamPathwayById("ca-rpn-rex-pn");
assert.ok(caRpn, "fixture pathway ca-rpn-rex-pn");

test("overview: Home → Country → Role → Pathway hub; Canada links to exams/canada", () => {
  const { crumbs, schemaItems } = pathwayOverviewBreadcrumbs(caRn!);
  assert.equal(crumbs.length, 4);
  assert.equal(crumbs[1]?.name, "Canada");
  assert.equal(crumbs[1]?.href, countryExamGuideHref("canada"));
  assert.equal(crumbs[2]?.name, "RN");
  assert.equal(crumbs[2]?.href, "/canada/rn");
  assert.equal(crumbs[3]?.href, undefined);
  assert.equal(schemaItems[1]?.item, toAbsoluteSiteUrl("/exams/canada"));
  assert.equal(schemaItems[3]?.item, toAbsoluteSiteUrl(buildExamPathwayPath(caRn!)));
});

test("lesson detail: schema last item is lesson URL", () => {
  const lessonSlug = "fluid-balance-acute-care";
  const lessonTitle = "Fluid lesson";
  const { crumbs, schemaItems } = pathwayLessonDetailBreadcrumbs(caRn!, lessonSlug, lessonTitle);
  const lessonPath = `/canada/rn/nclex-rn/lessons/${lessonSlug}`;
  assert.equal(crumbs[5]?.name, lessonTitle);
  assert.equal(schemaItems[schemaItems.length - 1]?.item, toAbsoluteSiteUrl(lessonPath));
});

test("US PN lesson: United States country crumb links to practice-exams", () => {
  const { crumbs } = pathwayLessonDetailBreadcrumbs(usPn!, "topic-a", "Lesson A");
  assert.equal(crumbs[1]?.name, "United States");
  assert.equal(crumbs[1]?.href, "/practice-exams");
});

test("Canada REx-PN and US NCLEX-PN: role crumb href uses marketing /pn segment (not internal rpn/lpn)", () => {
  const { crumbs: caCrumbs, schemaItems: caSchema } = pathwayOverviewBreadcrumbs(caRpn!);
  assert.equal(caCrumbs[2]?.name, "RPN");
  assert.equal(caCrumbs[2]?.href, "/canada/pn");
  assert.equal(caSchema[2]?.item, toAbsoluteSiteUrl("/canada/pn"));

  const { crumbs: usCrumbs, schemaItems: usSchema } = pathwayOverviewBreadcrumbs(usPn!);
  assert.equal(usCrumbs[2]?.name, "LPN / LVN");
  assert.equal(usCrumbs[2]?.href, "/us/pn");
  assert.equal(usSchema[2]?.item, toAbsoluteSiteUrl("/us/pn"));
});

test("REx-PN overview trail does not surface the global exam-lessons index label as the hub", () => {
  const { crumbs } = pathwayOverviewBreadcrumbs(caRpn!);
  assert.equal(crumbs.some((c) => c.name === "Lessons by exam pathway"), false);
  assert.equal(crumbs[3]?.name.includes("REx"), true);
});

test("lessons hub, topic cluster, questions hub, cat, pricing share the same country + role crumbs", () => {
  const overview = pathwayOverviewBreadcrumbs(caRn!);
  const lessons = pathwayLessonsHubBreadcrumbs(caRn!);
  const topic = pathwayTopicClusterBreadcrumbs(caRn!, "cardio", "Cardiovascular");
  const questions = pathwayQuestionsHubBreadcrumbs(caRn!);
  const cat = pathwayCatPracticeBreadcrumbs(caRn!);
  const pricing = pathwayPricingBreadcrumbs(caRn!);

  for (const b of [lessons, topic, questions, cat, pricing]) {
    assert.equal(b.crumbs[1]?.name, overview.crumbs[1]?.name);
    assert.equal(b.crumbs[1]?.href, overview.crumbs[1]?.href);
    assert.equal(b.crumbs[2]?.name, overview.crumbs[2]?.name);
    assert.equal(b.crumbs[2]?.href, overview.crumbs[2]?.href);
    assert.equal(b.schemaItems[1]?.item, overview.schemaItems[1]?.item);
    assert.equal(b.schemaItems[2]?.item, overview.schemaItems[2]?.item);
  }
});

test("unmapped pathway id still resolves country + role from definition", () => {
  const synthetic = { ...caRn!, id: "__unmapped_test_pathway__" };
  const { crumbs, schemaItems } = pathwayOverviewBreadcrumbs(synthetic);
  assert.equal(crumbs[1]?.name, "Canada");
  assert.equal(crumbs[2]?.href, "/canada/rn");
  assert.equal(schemaItems[1]?.item, toAbsoluteSiteUrl("/exams/canada"));
});

test("exam-lessons index: single crumb title matches constant", () => {
  const { crumbs, schemaItems } = examLessonsIndexBreadcrumbs();
  assert.equal(crumbs[1]?.name, "Lessons by exam pathway");
  assert.equal(schemaItems[1]?.item, toAbsoluteSiteUrl("/lessons"));
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
  assert.equal(crumbs[3]?.href, undefined);
  assert.equal(schemaItems[3]?.item, toAbsoluteSiteUrl(aliasBase));
});

test("NP subpages: omit hubBasePath so breadcrumbs match core pathway URLs", () => {
  const usFnp = getExamPathwayById("us-np-fnp");
  assert.ok(usFnp);
  const coreHub = buildExamPathwayPath(usFnp!);
  const lessons = pathwayLessonsHubBreadcrumbs(usFnp!);
  assert.equal(lessons.crumbs[3]?.href, coreHub);
  assert.equal(lessons.schemaItems[4]?.item, toAbsoluteSiteUrl(`${coreHub}/lessons`));
});

test("NP questions hub: question bank schema matches core canonical URL", () => {
  const usFnp = getExamPathwayById("us-np-fnp");
  assert.ok(usFnp);
  const coreHub = buildExamPathwayPath(usFnp!);
  const q = pathwayQuestionsHubBreadcrumbs(usFnp!);
  assert.equal(q.crumbs[3]?.href, coreHub);
  assert.equal(q.schemaItems[4]?.item, toAbsoluteSiteUrl(`${coreHub}/questions`));
});
