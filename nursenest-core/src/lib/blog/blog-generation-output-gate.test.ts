import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { BlogPostIntent, BlogPostTemplate } from "@prisma/client";
import { evaluateBlogGenerationOutputGate } from "@/lib/blog/blog-generation-output-gate";

function words(n: number): string {
  return `<p>${Array.from({ length: n }, (_, i) => `w${i}`).join(" ")}</p>`;
}

describe("evaluateBlogGenerationOutputGate", () => {
  it("rejects publish_or_schedule under 300 words", () => {
    const r = evaluateBlogGenerationOutputGate({
      title: "T",
      slug: "s",
      seoTitle: "T",
      seoDescription: "Meta description long enough for gate sixteen chars.",
      bodyHtml: words(50),
      template: BlogPostTemplate.TOPIC_EXPLAINED,
      intent: BlogPostIntent.EXAM_PREP,
      mode: "publish_or_schedule",
    });
    assert.equal(r.ok, false);
    if (!r.ok) assert.ok(r.reasons.some((x) => x.includes("metadata_or_thin_body")));
  });

  it("accepts standard depth at 800+ words", () => {
    const r = evaluateBlogGenerationOutputGate({
      title: "Study topic for exam",
      slug: "study-topic-for-exam",
      seoTitle: "Study topic for exam",
      seoDescription: "Meta description long enough for gate sixteen chars.",
      bodyHtml: words(820),
      contentDepth: "standard",
      mode: "publish_or_schedule",
    });
    assert.equal(r.ok, true);
  });

  it("rejects pillar depth below 1200 words", () => {
    const r = evaluateBlogGenerationOutputGate({
      title: "Pharm deep dive",
      slug: "pharm-deep-dive",
      seoTitle: "Pharm deep dive",
      seoDescription: "Meta description long enough for gate sixteen chars.",
      bodyHtml: words(900),
      template: BlogPostTemplate.MEDICATION_REVIEW,
      intent: BlogPostIntent.CONCEPT_EXPLAINER,
      mode: "publish_or_schedule",
    });
    assert.equal(r.ok, false);
  });
});
