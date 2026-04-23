import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { BlogPostIntent, BlogPostTemplate } from "@prisma/client";
import type { BlogControlPanelPlan } from "@/lib/blog/blog-control-panel-schema";
import { isLongFormPathophysiologyProfile, validateLongFormNursingPlanContract } from "@/lib/blog/blog-longform-nursing-contract";

function basePlan(overrides: Partial<BlogControlPanelPlan> = {}): BlogControlPanelPlan {
  const outline = Array.from({ length: 6 }, (_, i) => ({
    h2:
      i === 0
        ? "What is this condition for nursing students?"
        : i === 1
          ? "Pathophysiology explained step by step"
          : i === 2
            ? "Why this happens: mechanisms and compensation"
            : i === 3
              ? "Signs and symptoms tied to the disease process"
              : i === 4
                ? "Assessment and diagnostic clues"
                : "Nursing implications and priorities on the unit",
  }));
  const faqs = [
    { q: "Why does this symptom appear?", a: "Because of the underlying mechanism described above." },
    { q: "What should I monitor first?", a: "Focus on airway breathing circulation per your protocol." },
    { q: "What is a common NCLEX trap?", a: "Students confuse similar presentations; compare cues carefully." },
    { q: "When should I escalate care?", a: "Escalate when red flags or instability appear per scope of practice." },
  ];
  const suggestedInternalLessons = [
    { label: "Lessons hub", suggestedPath: "/us/rn/lessons", linkKind: "lessons_hub" as const },
    { label: "QB hub", suggestedPath: "/questions", linkKind: "question_bank" as const },
  ];
  const internalAnchorOpportunities = [
    {
      phrase: "practice",
      suggestedAnchorText: "Practice exams",
      targetSuggestedPath: "/practice-exams",
    },
    {
      phrase: "flashcards",
      suggestedAnchorText: "Flashcards",
      targetSuggestedPath: "/flashcards",
    },
    {
      phrase: "study",
      suggestedAnchorText: "Study hub",
      targetSuggestedPath: "/us/rn/lessons",
    },
  ];
  const base: BlogControlPanelPlan = {
    titleOptions: ["Title one for nursing blog", "Title two for nursing blog"],
    h1: "Title one for nursing blog",
    recommendedSlug: "title-one-for-nursing-blog",
    metaTitle: "Meta title here at least three chars",
    metaDescription: "m".repeat(22),
    outline,
    suggestedInternalLessons,
    faqs,
    breadcrumbs: [
      { label: "Home", href: "/" },
      { label: "Blog", href: "/blog" },
      { label: "Pathophysiology", href: "/blog" },
      { label: "Title one for nursing blog", href: "/blog/title-one-for-nursing-blog" },
    ],
    imagePlacements: [],
    apaSourceStubs: [],
    keyTakeaways: ["a".repeat(6), "b".repeat(6)],
    suggestedExcerpt: "x".repeat(140),
    internalAnchorOpportunities,
    recommendedInternalLinks: [],
    primaryKeyword: "pathophysiology nursing sample condition",
    secondaryKeywordPhrases: ["mechanism nursing students", "NCLEX assessment cues", "symptoms explained physiology"],
    sourceCandidates: [
      { title: "Example guideline title for editorial lookup", sourceType: "guideline", notes: "Verify URL in CMS" },
      { title: "Example review article title", sourceType: "peer_reviewed" },
      { title: "Government health portal topic page", sourceType: "government", notes: "Add verified URL in CMS — do not ship invented links." },
    ],
    schemaOpportunities: [
      { type: "BlogPosting", rationale: "Primary article entity for public page JSON-LD." },
      { type: "BreadcrumbList", rationale: "Matches marketing breadcrumb trail." },
      { type: "FAQPage", rationale: "FAQ section is substantive for this topic." },
    ],
    needsReviewFlags: ["apa_source_review_required"],
    editorialNotes: [],
    ...overrides,
  };
  return base;
}

describe("isLongFormPathophysiologyProfile", () => {
  it("matches disease process template", () => {
    assert.equal(
      isLongFormPathophysiologyProfile({
        template: BlogPostTemplate.DISEASE_PROCESS_EXPLAINER,
        intent: BlogPostIntent.EXAM_PREP,
      }),
      true,
    );
  });
  it("matches concept explainer intent on clinical explainer templates", () => {
    assert.equal(
      isLongFormPathophysiologyProfile({
        template: BlogPostTemplate.TOPIC_EXPLAINED,
        intent: BlogPostIntent.CONCEPT_EXPLAINER,
      }),
      true,
    );
  });
  it("does not match concept explainer on non-clinical templates", () => {
    assert.equal(
      isLongFormPathophysiologyProfile({
        template: BlogPostTemplate.FAQ_STYLE,
        intent: BlogPostIntent.CONCEPT_EXPLAINER,
      }),
      false,
    );
  });
  it("is false for generic topic template + exam prep", () => {
    assert.equal(
      isLongFormPathophysiologyProfile({
        template: BlogPostTemplate.TOPIC_EXPLAINED,
        intent: BlogPostIntent.EXAM_PREP,
      }),
      false,
    );
  });
});

describe("validateLongFormNursingPlanContract", () => {
  it("passes a rich plan under long-form profile", () => {
    const r = validateLongFormNursingPlanContract(basePlan(), {
      template: BlogPostTemplate.DISEASE_PROCESS_EXPLAINER,
      intent: BlogPostIntent.EXAM_PREP,
    });
    assert.equal(r.ok, true);
  });

  it("fails when outline is too shallow", () => {
    const plan = basePlan({
      outline: basePlan().outline.slice(0, 4),
    });
    const r = validateLongFormNursingPlanContract(plan, {
      template: BlogPostTemplate.DISEASE_PROCESS_EXPLAINER,
      intent: BlogPostIntent.EXAM_PREP,
    });
    assert.equal(r.ok, false);
    if (!r.ok) assert.ok(r.issues.some((i) => i.includes("outline_sections")));
  });

  it("fails when FAQs are too few", () => {
    const plan = basePlan({ faqs: basePlan().faqs.slice(0, 2) });
    const r = validateLongFormNursingPlanContract(plan, {
      template: BlogPostTemplate.DISEASE_PROCESS_EXPLAINER,
      intent: BlogPostIntent.EXAM_PREP,
    });
    assert.equal(r.ok, false);
    if (!r.ok) assert.ok(r.issues.some((i) => i.includes("faq_items")));
  });

  it("counts recommendedInternalLinks toward internal linking minimum", () => {
    const plan = basePlan({
      suggestedInternalLessons: [],
      internalAnchorOpportunities: [],
      recommendedInternalLinks: [
        {
          targetType: "flashcards_hub",
          suggestedPath: "/flashcards",
          anchorText: "Flashcards",
          reason: "Spaced repetition",
        },
        {
          targetType: "question_bank",
          suggestedPath: "/questions",
          anchorText: "Questions",
        },
        {
          targetType: "practice_exams",
          suggestedPath: "/practice-exams",
          anchorText: "Practice exams",
        },
        {
          targetType: "lesson",
          suggestedPath: "/us/rn/lessons/sample",
          anchorText: "Lesson",
        },
        {
          targetType: "blog",
          suggestedPath: "/blog",
          anchorText: "Blog",
          needsReview: true,
        },
      ],
    });
    const r = validateLongFormNursingPlanContract(plan, {
      template: BlogPostTemplate.DISEASE_PROCESS_EXPLAINER,
      intent: BlogPostIntent.EXAM_PREP,
    });
    assert.equal(r.ok, true);
  });

  it("is a no-op for non-long-form profiles", () => {
    const bad = basePlan({ outline: basePlan().outline.slice(0, 2), faqs: [] });
    const r = validateLongFormNursingPlanContract(bad, {
      template: BlogPostTemplate.TOPIC_EXPLAINED,
      intent: BlogPostIntent.EXAM_PREP,
    });
    assert.equal(r.ok, true);
  });

  it("fails when breadcrumbs are too shallow", () => {
    const plan = basePlan({
      breadcrumbs: [
        { label: "Home", href: "/" },
        { label: "Blog", href: "/blog" },
        { label: "Article", href: "/blog/slug" },
      ],
    });
    const r = validateLongFormNursingPlanContract(plan, {
      template: BlogPostTemplate.DISEASE_PROCESS_EXPLAINER,
      intent: BlogPostIntent.EXAM_PREP,
    });
    assert.equal(r.ok, false);
    if (!r.ok) assert.ok(r.issues.some((i) => i.includes("breadcrumbs(")));
  });

  it("fails when primaryKeyword is missing", () => {
    const plan = basePlan({ primaryKeyword: undefined });
    const r = validateLongFormNursingPlanContract(plan, {
      template: BlogPostTemplate.DISEASE_PROCESS_EXPLAINER,
      intent: BlogPostIntent.EXAM_PREP,
    });
    assert.equal(r.ok, false);
    if (!r.ok) assert.ok(r.issues.some((i) => i.includes("primaryKeyword")));
  });

  it("fails when fewer than three sourceCandidates", () => {
    const plan = basePlan({
      sourceCandidates: basePlan().sourceCandidates.slice(0, 2),
    });
    const r = validateLongFormNursingPlanContract(plan, {
      template: BlogPostTemplate.DISEASE_PROCESS_EXPLAINER,
      intent: BlogPostIntent.EXAM_PREP,
    });
    assert.equal(r.ok, false);
    if (!r.ok) assert.ok(r.issues.some((i) => i.includes("sourceCandidates")));
  });

  it("fails when schemaOpportunities omits BlogPosting", () => {
    const plan = basePlan({
      schemaOpportunities: [
        { type: "BreadcrumbList", rationale: "Crumbs" },
        { type: "FAQPage", rationale: "FAQs" },
      ],
    });
    const r = validateLongFormNursingPlanContract(plan, {
      template: BlogPostTemplate.DISEASE_PROCESS_EXPLAINER,
      intent: BlogPostIntent.EXAM_PREP,
    });
    assert.equal(r.ok, false);
    if (!r.ok) assert.ok(r.issues.some((i) => i.includes("BlogPosting")));
  });
});
