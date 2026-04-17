import assert from "node:assert/strict";
import test from "node:test";
import { buildAutoLinkRules, applyAutoLinksToHtml } from "@/lib/blog/blog-auto-link-html";
import { marketingStudyHubsForBlogExam } from "@/lib/blog/blog-study-cta";

test("study plan auto-link stays on marketing-safe lessons hub", () => {
  const hubs = marketingStudyHubsForBlogExam("NCLEX-RN", "US");
  const rules = buildAutoLinkRules({ exam: "NCLEX-RN", countryTarget: "US" as never });
  const studyPlanRule = rules.find((rule) => rule.pattern.source.includes("study plan"));

  assert.ok(studyPlanRule, "expected a study plan auto-link rule");
  assert.equal(studyPlanRule.href, hubs.lessonsHub);
  assert.notEqual(studyPlanRule.href, "/app/study-plan");
});

test("applyAutoLinksToHtml does not inject app-only study plan links", () => {
  const html = "<p>This study plan helps you prepare for the NCLEX without guessing.</p>";
  const linked = applyAutoLinksToHtml(html, {
    exam: "NCLEX-RN",
    countryTarget: "US" as never,
    maxTotalAutoLinks: 3,
  });

  assert.match(linked, /href="\/us\/rn\/nclex-rn\/lessons"/);
  assert.doesNotMatch(linked, /href="\/app\/study-plan"/);
});
