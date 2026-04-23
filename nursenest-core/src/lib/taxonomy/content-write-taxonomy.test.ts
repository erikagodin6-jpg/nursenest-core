import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { REVIEW_REQUIRED } from "@/lib/taxonomy/taxonomy";
import {
  classifyBlogCorpus,
  classifyExamQuestionCorpus,
  contentItemLessonTaxonomyFromCorpus,
  collectClassificationViolations,
  examQuestionTaxonomyFromCorpus,
  isPublishBlockedByTaxonomy,
  slugifyTaxonomyLeafForCategoryRow,
} from "@/lib/taxonomy/content-write-taxonomy";

describe("content-write-taxonomy", () => {
  it("classifies exam corpus with clear cardiovascular cues", () => {
    const r = examQuestionTaxonomyFromCorpus({
      stem: "A client post-MI has crackles bilaterally. Which finding reflects left-sided heart failure?",
      rationale: "Pulmonary edema and crackles indicate fluid overload from poor cardiac output.",
      topic: "Cardiac",
      subtopic: "HF",
      tags: ["nclex", "cardiac"],
    });
    assert.equal(r.violations.length, 0);
    assert.equal(r.publishable, true);
    assert.equal(r.bodySystem, "cardiovascular");
  });

  it("marks ambiguous exam corpus as publish-blocked but structurally valid", () => {
    const r = examQuestionTaxonomyFromCorpus({
      stem: "Choose the best answer.",
      rationale: "Think carefully.",
      topic: "General",
      subtopic: null,
      tags: [],
    });
    assert.equal(r.violations.length, 0);
    assert.equal(r.publishable, false);
    assert.ok(isPublishBlockedByTaxonomy(r.classification));
    assert.equal(r.bodySystem, REVIEW_REQUIRED);
  });

  it("classifyBlogCorpus blocks publish for empty body", () => {
    const c = classifyBlogCorpus({ title: "x", body: "   ", category: null, tags: [] });
    assert.ok(isPublishBlockedByTaxonomy(c));
    assert.equal(collectClassificationViolations(c).length, 0);
  });

  it("slugifies taxonomy leaves for category rows", () => {
    assert.equal(slugifyTaxonomyLeafForCategoryRow("renal_genitourinary"), "renal-genitourinary");
    assert.equal(slugifyTaxonomyLeafForCategoryRow(REVIEW_REQUIRED), "review-required");
  });

  it("contentItem lesson taxonomy resolves cardiovascular teaching corpus", () => {
    const r = contentItemLessonTaxonomyFromCorpus({
      title: "Heart failure exacerbation: assessment priorities",
      summary: "Spot volume overload, perfusion risk, and oxygenation needs quickly.",
      body: "Crackles, elevated JVP, and third heart sound suggest fluid overload; prioritize diuresis per order set.",
      tags: ["med-surg", "cardiac"],
      topicHint: "cardiovascular",
      categoryHint: "Fundamentals",
    });
    assert.equal(r.violations.length, 0);
    assert.equal(r.publishable, true);
    assert.equal(r.bodySystem, "cardiovascular");
  });

  it("classifyExamQuestionCorpus matches examQuestionTaxonomyFromCorpus bodySystem", () => {
    const stem = "Administer insulin for hyperglycemia with ketones; monitor glucose hourly.";
    const a = classifyExamQuestionCorpus({
      stem,
      rationale: "Endocrine emergency management.",
      topic: "Med-surg",
      subtopic: "DM",
      tags: ["insulin"],
    });
    const b = examQuestionTaxonomyFromCorpus({
      stem,
      rationale: "Endocrine emergency management.",
      topic: "Med-surg",
      subtopic: "DM",
      tags: ["insulin"],
    });
    assert.equal(a.category, b.bodySystem);
  });
});
