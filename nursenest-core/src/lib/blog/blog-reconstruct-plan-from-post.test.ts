import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { reconstructBlogControlPanelPlanFromPost } from "@/lib/blog/blog-reconstruct-plan-from-post";

describe("reconstructBlogControlPanelPlanFromPost", () => {
  it("returns null when outline has fewer than three sections (legacy guard)", () => {
    const row = {
      title: "Hello world",
      titleAlternates: [],
      slug: "hello-world",
      seoTitle: null,
      seoDescription: null,
      excerpt: "Short excerpt text for the card view here.",
      outlineJson: [{ h2: "One" }, { h2: "Two" }],
      faqBlock: { items: [] },
      internalLinkPlan: {},
      keyTakeaways: [],
      featuredSnippet: null,
      keywordPlan: ["kw"],
    };
    assert.equal(reconstructBlogControlPanelPlanFromPost(row), null);
  });

  it("reconstructs a plan when outline and meta are present", () => {
    const row = {
      title: "Clinical pearls for fluid overload",
      titleAlternates: ["Alt title A", "Alt title B"],
      slug: "clinical-pearls-fluid-overload",
      seoTitle: "Fluid overload NCLEX review",
      seoDescription: "x".repeat(25),
      excerpt: "y".repeat(90),
      outlineJson: [
        { h2: "Assessment", bullets: ["Check lungs"] },
        { h2: "Interventions" },
        { h2: "Exam tips" },
      ],
      faqBlock: { items: [{ q: "What is fluid overload?", a: "x".repeat(20) }] },
      internalLinkPlan: {
        lessons: [{ label: "Lessons hub", suggestedPath: "/us/rn/nclex-rn/lessons" }],
        publishingPackage: {
          version: 1,
          internalAnchorOpportunities: [
            {
              phrase: "fluid balance",
              suggestedAnchorText: "fluid balance nursing",
              targetSuggestedPath: "/blog/related-slug",
              rationale: "Supportive read",
            },
          ],
        },
      },
      keyTakeaways: ["Takeaway one with enough chars"],
      featuredSnippet: null,
      keywordPlan: ["fluid overload", "NCLEX"],
    };
    const plan = reconstructBlogControlPanelPlanFromPost(row);
    assert.ok(plan);
    assert.equal(plan!.h1, row.title);
    assert.ok(plan!.outline.length >= 3);
    assert.equal(plan!.suggestedInternalLessons.length, 1);
    assert.equal(plan!.internalAnchorOpportunities.length, 1);
    assert.equal(plan!.internalAnchorOpportunities[0]?.phrase, "fluid balance");
  });
});
