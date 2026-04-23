import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { BlogPostTemplate } from "@prisma/client";
import { collectBlogGeneratedDraftQualityIssues } from "@/lib/blog/blog-generated-draft-quality";
import type { BlogPostDraftQualityRow } from "@/lib/blog/blog-generated-draft-quality";

const LONG_BODY =
  "<p>" +
  "word ".repeat(400) +
  "</p><h2>Pathophysiology</h2><p>Mechanism depth paragraph.</p><h2>Nursing implications</h2><p>Practice impact.</p>";

function row(partial: Partial<BlogPostDraftQualityRow>): BlogPostDraftQualityRow {
  return {
    body: LONG_BODY,
    targetKeyword: "fluid balance",
    postTemplate: BlogPostTemplate.TOPIC_EXPLAINED,
    internalLinkPlan: {
      lessons: [
        {
          label: "Sample lesson",
          suggestedPath: "/us/rn/nclex-rn/lessons/sample-lesson",
          pathStatus: "ok",
          id: "ll-1",
          reviewStatus: "active",
        },
      ],
      publishingPackage: {
        version: 1,
        updatedAt: new Date().toISOString(),
        internalAnchorOpportunities: [
          {
            phrase: "fluid overload",
            suggestedAnchorText: "fluid overload care",
            targetSuggestedPath: "/us/rn/nclex-rn/lessons/fluids",
          },
        ],
        relatedBlogPosts: [],
      },
    },
    faqBlock: { items: [{ q: "Question one?", a: "Answer one with enough length for validation." }] },
    schemaSummary: JSON.stringify({
      schemaOpportunities: [{ type: "BlogPosting", rationale: "Canonical article." }],
      emitFaqSchema: false,
    }),
    sourcesJson: { version: 2, verified: [], excluded: [], generatedAt: new Date().toISOString() },
    apaReferences: [],
    medicalRiskFlags: ["apa_source_review_required"],
    requiresReferences: false,
    ...partial,
  };
}

describe("collectBlogGeneratedDraftQualityIssues", () => {
  it("flags missing nursing implications H2", () => {
    const issues = collectBlogGeneratedDraftQualityIssues(
      row({
        body: "<h2>Pathophysiology</h2><p>x</p>",
      }),
    );
    assert.ok(issues.some((i) => i.id === "content_nursing_implications"));
  });

  it("flags missing clinical mechanism / pathophysiology H2", () => {
    const issues = collectBlogGeneratedDraftQualityIssues(
      row({
        body: "<h2>Nursing implications</h2><p>x</p>",
      }),
    );
    assert.ok(issues.some((i) => i.id === "content_clinical_mechanism"));
  });

  it("flags missing primary keyword when target and SEO bundle lack it", () => {
    const issues = collectBlogGeneratedDraftQualityIssues(
      row({
        targetKeyword: null,
        internalLinkPlan: { lessons: [], publishingPackage: { version: 1, internalAnchorOpportunities: [], relatedBlogPosts: [] } },
      }),
    );
    assert.ok(issues.some((i) => i.id === "primary_keyword"));
  });

  it("accepts primary keyword from SEO bundle when targetKeyword is empty", () => {
    const issues = collectBlogGeneratedDraftQualityIssues(
      row({
        targetKeyword: null,
        internalLinkPlan: {
          lessons: [
            {
              label: "L",
              suggestedPath: "/us/rn/nclex-rn/lessons/l",
              pathStatus: "ok",
              id: "a",
              reviewStatus: "active",
            },
          ],
          seo: {
            version: 1,
            normalizedBreadcrumbs: [
              { label: "Home", href: "/" },
              { label: "Blog", href: "/blog" },
              { label: "Article", href: "/blog/slug" },
            ],
            suggestedExcerpt: "x".repeat(80),
            emitFaqSchema: false,
            focusKeywords: ["electrolytes"],
            primaryKeyword: "electrolytes",
            imageAlts: [],
          },
          publishingPackage: { version: 1, internalAnchorOpportunities: [], relatedBlogPosts: [] },
        },
      }),
    );
    assert.equal(issues.some((i) => i.id === "primary_keyword"), false);
  });

  it("accepts primary keyword from generationContractV1 when target and SEO bundle omit it", () => {
    const issues = collectBlogGeneratedDraftQualityIssues(
      row({
        targetKeyword: null,
        internalLinkPlan: {
          lessons: [
            {
              label: "L",
              suggestedPath: "/us/rn/nclex-rn/lessons/l",
              pathStatus: "ok",
              id: "a",
              reviewStatus: "active",
            },
          ],
          generationContractV1: {
            version: 1,
            primaryKeyword: "contract-keyword",
            recommendedInternalLinks: [],
            sourceCandidates: [],
            needsReviewFlags: [],
            schemaNotes: {
              article: { type: "BlogPosting" },
              breadcrumb: { levels: 3 },
              faq: { enabled: true },
            },
          },
          publishingPackage: { version: 1, internalAnchorOpportunities: [], relatedBlogPosts: [] },
        },
      }),
    );
    assert.equal(issues.some((i) => i.id === "primary_keyword"), false);
  });

  it("accepts internal link recommendations from generationContractV1.recommendedInternalLinks alone", () => {
    const issues = collectBlogGeneratedDraftQualityIssues(
      row({
        targetKeyword: "renal",
        internalLinkPlan: {
          lessons: [],
          generationContractV1: {
            version: 1,
            primaryKeyword: "renal",
            recommendedInternalLinks: [
              {
                targetType: "lesson",
                suggestedPath: "/us/rn/nclex-rn/lessons/renal",
                anchorText: "renal nursing review",
              },
            ],
            sourceCandidates: [],
            needsReviewFlags: [],
            schemaNotes: {
              article: { type: "BlogPosting" },
              breadcrumb: { levels: 3 },
              faq: { enabled: true },
            },
          },
          publishingPackage: { version: 1, internalAnchorOpportunities: [], relatedBlogPosts: [] },
        },
      }),
    );
    assert.equal(issues.some((i) => i.id === "internal_link_recommendations"), false);
  });

  it("warns when generationContractV1 v1 exists but schemaNotes are incomplete", () => {
    const issues = collectBlogGeneratedDraftQualityIssues(
      row({
        internalLinkPlan: {
          lessons: [
            {
              label: "L",
              suggestedPath: "/us/rn/nclex-rn/lessons/l",
              pathStatus: "ok",
              id: "a",
              reviewStatus: "active",
            },
          ],
          generationContractV1: {
            version: 1,
            primaryKeyword: "fluid balance",
            recommendedInternalLinks: [],
            sourceCandidates: [],
            needsReviewFlags: [],
            schemaNotes: { article: {}, breadcrumb: { x: 1 }, faq: { y: 1 } },
          },
          publishingPackage: { version: 1, internalAnchorOpportunities: [], relatedBlogPosts: [] },
        },
      }),
    );
    assert.ok(issues.some((i) => i.id === "schema_contract_notes"));
  });

  it("flags empty internal link recommendations (lessons, anchors, related)", () => {
    const issues = collectBlogGeneratedDraftQualityIssues(
      row({
        internalLinkPlan: {
          lessons: [],
          publishingPackage: { version: 1, internalAnchorOpportunities: [], relatedBlogPosts: [] },
        },
      }),
    );
    assert.ok(issues.some((i) => i.id === "internal_link_recommendations"));
  });

  it("warns when schemaSummary omits schemaOpportunities", () => {
    const issues = collectBlogGeneratedDraftQualityIssues(
      row({
        schemaSummary: JSON.stringify({ emitFaqSchema: false }),
      }),
    );
    assert.ok(issues.some((i) => i.id === "schema_summary_opportunities"));
  });

  it("blocks DISEASE_PROCESS_EXPLAINER posts with fewer than four FAQ items", () => {
    const issues = collectBlogGeneratedDraftQualityIssues(
      row({
        postTemplate: BlogPostTemplate.DISEASE_PROCESS_EXPLAINER,
        faqBlock: {
          items: [
            { q: "Question one?", a: "Answer one with enough length for validation." },
            { q: "Question two?", a: "Answer two with enough length for validation." },
            { q: "Question three?", a: "Answer three with enough length for validation." },
          ],
        },
      }),
    );
    assert.ok(issues.some((i) => i.id === "faq_content_when_required"));
  });

  it("blocks FAQ_STYLE posts with fewer than two FAQ items", () => {
    const issues = collectBlogGeneratedDraftQualityIssues(
      row({
        postTemplate: BlogPostTemplate.FAQ_STYLE,
        faqBlock: { items: [{ q: "Only one?", a: "Answer with enough text here for the stub." }] },
      }),
    );
    assert.ok(issues.some((i) => i.id === "faq_content_when_required"));
  });

  it("blocks when FAQ schema is enabled but faqBlock has fewer than two items", () => {
    const issues = collectBlogGeneratedDraftQualityIssues(
      row({
        schemaSummary: JSON.stringify({ emitFaqSchema: true }),
        faqBlock: { items: [{ q: "One?", a: "Answer with enough text here for the stub." }] },
      }),
    );
    assert.ok(issues.some((i) => i.id === "faq_content_when_required"));
  });

  it("blocks when AI source candidates exist but apa_source_review_required flag is missing", () => {
    const issues = collectBlogGeneratedDraftQualityIssues(
      row({
        sourcesJson: {
          version: 2,
          verified: [],
          excluded: [
            {
              stub: { title: "Example stub title here", year: "2024" },
              provenance: "ai_suggested",
              reasons: ["not_verified"],
            },
          ],
          generatedAt: new Date().toISOString(),
        },
        medicalRiskFlags: [],
      }),
    );
    assert.ok(issues.some((i) => i.id === "apa_verification_gating"));
  });

  it("does not emit apa_verification_gating when review flag is present with AI stubs in envelope", () => {
    const issues = collectBlogGeneratedDraftQualityIssues(
      row({
        sourcesJson: {
          version: 2,
          verified: [],
          excluded: [
            {
              stub: { title: "Example stub title here", year: "2024" },
              provenance: "ai_suggested",
              reasons: ["not_verified"],
            },
          ],
          generatedAt: new Date().toISOString(),
        },
        medicalRiskFlags: ["apa_source_review_required"],
      }),
    );
    assert.equal(issues.some((i) => i.id === "apa_verification_gating"), false);
  });
});
