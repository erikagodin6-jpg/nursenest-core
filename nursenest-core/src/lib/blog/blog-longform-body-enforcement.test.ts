import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { BlogPostIntent, BlogPostTemplate } from "@prisma/client";
import type { BlogControlPanelPlan } from "@/lib/blog/blog-control-panel-schema";
import {
  LONGFORM_FAQ_WORD_SHARE_FLAG_THRESHOLD,
  LONGFORM_MIN_MAIN_BODY_WORDS_EXCLUDING_FAQ,
  collectBreadcrumbPathSanityFlags,
  enforceLongFormBodyQuality,
  extractH2PlainTextsFromBodyHtml,
  findMissingOutlineH2sInBody,
  outlineH2MatchesBodyHeading,
} from "@/lib/blog/blog-longform-body-enforcement";

function outlineH2s(n: number, labels: string[]) {
  return labels.slice(0, n).map((h2) => ({ h2 }));
}

function minimalLongformPlan(overrides: Partial<BlogControlPanelPlan> = {}): BlogControlPanelPlan {
  const labels = [
    "What is this condition for nursing students?",
    "Pathophysiology explained step by step",
    "Why this happens mechanisms and compensation",
    "Signs and symptoms tied to the disease process",
    "Assessment and diagnostic clues",
    "Nursing implications and priorities on the unit",
  ];
  const base: BlogControlPanelPlan = {
    titleOptions: ["Title one for nursing blog", "Title two for nursing blog"],
    h1: "Title one for nursing blog",
    recommendedSlug: "title-one-for-nursing-blog",
    metaTitle: "Meta title here at least three chars",
    metaDescription: "m".repeat(22),
    outline: outlineH2s(6, labels),
    suggestedInternalLessons: [],
    faqs: [
      { q: "Why does this symptom appear?", a: "Because of the underlying mechanism described above." },
      { q: "What should I monitor first?", a: "Focus on airway breathing circulation per your protocol." },
      { q: "What is a common NCLEX trap?", a: "Students confuse similar presentations; compare cues carefully." },
      { q: "When should I escalate care?", a: "Escalate when red flags or instability appear per scope of practice." },
    ],
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
    internalAnchorOpportunities: [],
    primaryKeyword: "pathophysiology nursing sample condition",
    secondaryKeywordPhrases: ["mechanism nursing students", "NCLEX assessment cues", "symptoms explained physiology"],
    sourceCandidates: [
      { title: "Source one for review" },
      { title: "Source two for review" },
      { title: "Source three for review" },
    ],
    schemaOpportunities: [
      { type: "BlogPosting", rationale: "Article." },
      { type: "BreadcrumbList", rationale: "Crumbs." },
      { type: "FAQPage", rationale: "FAQs." },
    ],
    needsReviewFlags: ["apa_source_review_required"],
    recommendedInternalLinks: [
      { targetType: "flashcards_hub", suggestedPath: "/flashcards", anchorText: "Flashcards hub" },
      { targetType: "question_bank", suggestedPath: "/questions", anchorText: "Question bank" },
      { targetType: "practice_exams", suggestedPath: "/practice-exams", anchorText: "Practice exams" },
    ],
    editorialNotes: [],
    ...overrides,
  };
  return base;
}

function words(n: number) {
  return ("word ".repeat(n)).trim();
}

describe("outlineH2MatchesBodyHeading", () => {
  it("matches case and punctuation drift", () => {
    assert.equal(outlineH2MatchesBodyHeading("Pathophysiology: step by step", ["pathophysiology step by step"]), true);
  });
});

describe("findMissingOutlineH2sInBody", () => {
  it("detects a missing planned H2", () => {
    const plan = minimalLongformPlan();
    const html = plan.outline
      .filter((_, i) => i !== 2)
      .map((o) => `<h2>${o.h2}</h2><p>${words(120)}</p>`)
      .join("\n");
    const missing = findMissingOutlineH2sInBody(plan, html);
    assert.ok(missing.length >= 1);
  });
});

describe("enforceLongFormBodyQuality", () => {
  it("fails when a planned outline H2 is absent from body HTML", () => {
    const plan = minimalLongformPlan();
    const embed =
      `<a href="/flashcards">Flashcards hub</a><a href="/questions">Question bank</a><a href="/practice-exams">Practice exams</a>`;
    const html =
      plan.outline
        .filter((_, i) => i !== 1)
        .map((o) => `<h2>${o.h2}</h2><p>${words(200)}</p>`)
        .join("\n") +
      `<h2>FAQs</h2><p>${words(120)}</p>` +
      embed;
    const r = enforceLongFormBodyQuality({
      plan,
      bodyHtml: html,
      template: BlogPostTemplate.DISEASE_PROCESS_EXPLAINER,
      intent: BlogPostIntent.EXAM_PREP,
    });
    assert.equal(r.ok, false);
    assert.ok(r.errors.some((e) => e.includes("body_outline_mismatch")));
  });

  it("fails when main body before FAQ is under the depth floor", () => {
    const plan = minimalLongformPlan();
    const shortPara = words(10);
    const html =
      plan.outline.map((o) => `<h2>${o.h2}</h2><p>${shortPara}</p>`).join("\n") +
      `<h2>FAQs</h2><p>${words(200)}</p>` +
      `<a href="/flashcards">Flashcards hub</a><a href="/questions">Question bank</a><a href="/practice-exams">Practice exams</a>`;
    const r = enforceLongFormBodyQuality({
      plan,
      bodyHtml: html,
      template: BlogPostTemplate.DISEASE_PROCESS_EXPLAINER,
      intent: BlogPostIntent.EXAM_PREP,
    });
    assert.equal(r.ok, false);
    assert.ok(r.errors.some((e) => e.includes("body_main_depth_insufficient")));
    assert.ok(r.details.mainBodyWordCountExcludingFaq < LONGFORM_MIN_MAIN_BODY_WORDS_EXCLUDING_FAQ);
  });

  it("flags when recommendedInternalLinks are not embedded in HTML", () => {
    const plan = minimalLongformPlan();
    const mainBulk = words(LONGFORM_MIN_MAIN_BODY_WORDS_EXCLUDING_FAQ + 80);
    const html =
      plan.outline.map((o) => `<h2>${o.h2}</h2><p>${mainBulk}</p>`).join("\n") +
      `<h2>FAQs</h2><p>${words(120)}</p>`;
    const r = enforceLongFormBodyQuality({
      plan,
      bodyHtml: html,
      template: BlogPostTemplate.DISEASE_PROCESS_EXPLAINER,
      intent: BlogPostIntent.EXAM_PREP,
    });
    assert.equal(r.ok, true);
    assert.ok(r.flags.includes("internal_links_not_embedded"));
  });

  it("flags partial embed when five plan targets are listed but fewer than five appear in HTML", () => {
    const five = [
      { targetType: "hub", suggestedPath: "/flashcards", anchorText: "Flashcards hub" },
      { targetType: "hub", suggestedPath: "/questions", anchorText: "Question bank" },
      { targetType: "hub", suggestedPath: "/practice-exams", anchorText: "Practice exams" },
      { targetType: "lesson", suggestedPath: "/us/rn/lessons/a", anchorText: "Lesson A" },
      { targetType: "blog", suggestedPath: "/blog/topics/x", anchorText: "Topic hub" },
    ];
    const plan = minimalLongformPlan({ recommendedInternalLinks: five });
    const mainBulk = words(LONGFORM_MIN_MAIN_BODY_WORDS_EXCLUDING_FAQ + 80);
    const embed = `<a href="/flashcards">Flashcards hub</a><a href="/questions">Question bank</a><a href="/practice-exams">Practice exams</a>`;
    const html =
      plan.outline.map((o) => `<h2>${o.h2}</h2><p>${mainBulk}</p>`).join("\n") +
      `<h2>FAQs</h2><p>${words(120)}</p>` +
      embed;
    const r = enforceLongFormBodyQuality({
      plan,
      bodyHtml: html,
      template: BlogPostTemplate.DISEASE_PROCESS_EXPLAINER,
      intent: BlogPostIntent.EXAM_PREP,
    });
    assert.equal(r.ok, true);
    assert.ok(r.flags.includes("recommended_internal_links_partial_embed"));
    assert.ok(!r.flags.includes("internal_links_not_embedded"));
  });

  it("flags when FAQ section dominates total word count", () => {
    const plan = minimalLongformPlan();
    const perSection = words(160);
    const html =
      plan.outline.map((o) => `<h2>${o.h2}</h2><p>${perSection}</p>`).join("\n") +
      `<h2>FAQs</h2><p>${words(2500)}</p>` +
      `<a href="/flashcards">Flashcards hub</a><a href="/questions">Question bank</a><a href="/practice-exams">Practice exams</a>`;
    const r = enforceLongFormBodyQuality({
      plan,
      bodyHtml: html,
      template: BlogPostTemplate.DISEASE_PROCESS_EXPLAINER,
      intent: BlogPostIntent.EXAM_PREP,
    });
    assert.equal(r.ok, true);
    const share = r.details.faqSectionWordCount / Math.max(1, r.details.totalBodyWordCount);
    assert.ok(share > LONGFORM_FAQ_WORD_SHARE_FLAG_THRESHOLD);
    assert.ok(r.flags.includes("faq_body_word_share_high"));
  });

  it("passes when outline matches, depth and embeds are satisfied", () => {
    const plan = minimalLongformPlan();
    const mainBulk = words(LONGFORM_MIN_MAIN_BODY_WORDS_EXCLUDING_FAQ + 120);
    const html =
      plan.outline.map((o) => `<h2>${o.h2}</h2><p>${mainBulk}</p>`).join("\n") +
      `<h2>FAQs</h2><p>${words(200)}</p>` +
      `<a href="/flashcards">Flashcards hub</a><a href="/questions">Question bank</a><a href="/practice-exams">Practice exams</a>`;
    const r = enforceLongFormBodyQuality({
      plan,
      bodyHtml: html,
      template: BlogPostTemplate.DISEASE_PROCESS_EXPLAINER,
      intent: BlogPostIntent.EXAM_PREP,
    });
    assert.equal(r.ok, true);
    assert.equal(r.errors.length, 0);
    assert.ok(!r.flags.includes("internal_links_not_embedded"));
  });

  it("is a no-op for non-long-form profiles", () => {
    const plan = minimalLongformPlan();
    const r = enforceLongFormBodyQuality({
      plan,
      bodyHtml: "<p>short</p>",
      template: BlogPostTemplate.TOPIC_EXPLAINED,
      intent: BlogPostIntent.EXAM_PREP,
    });
    assert.equal(r.ok, true);
    assert.equal(r.details.bodyH2Count, 0);
  });
});

describe("collectBreadcrumbPathSanityFlags", () => {
  it("returns no flags for typical marketing crumbs", () => {
    const flags = collectBreadcrumbPathSanityFlags([
      { label: "Home", href: "/" },
      { label: "Blog", href: "/blog" },
      { label: "Fundamentals", href: "/blog/topics/fundamentals" },
      { label: "Article", href: "/blog/my-slug" },
    ]);
    assert.deepEqual(flags, []);
  });

  it("flags when article crumb href does not look like /blog/…", () => {
    const flags = collectBreadcrumbPathSanityFlags([
      { label: "Home", href: "/" },
      { label: "Blog", href: "/blog" },
      { label: "X", href: "/blog/x" },
      { label: "Article", href: "/wrong-path/article" },
    ]);
    assert.ok(flags.includes("breadcrumb_path_sanity"));
  });
});

describe("extractH2PlainTextsFromBodyHtml", () => {
  it("does not collapse nested tags inside h2", () => {
    const h2s = extractH2PlainTextsFromBodyHtml("<h2>Hello <strong>world</strong></h2>");
    assert.deepEqual(h2s, ["Hello world"]);
  });
});
