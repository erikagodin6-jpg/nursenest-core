import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import {
  BlogImageStatus,
  BlogPostIntent,
  BlogPostStatus,
  BlogPostTemplate,
  CountryCode,
  type PrismaClient,
} from "@prisma/client";
import { BLOG_ARTICLE_TARGET_WORDS_FOR_PUBLISH } from "@/lib/blog/blog-word-count";
import {
  validateGeneratedBlogPublishEligibility,
  type PublishGeneratedBlogArticleOptions,
} from "@/lib/blog/publish-generated-blog-article";
import type { BlogPostPrePublishRow } from "@/lib/blog/blog-pre-publish-validation";

let slugUniqueFindFirstImpl: () => Promise<null> = async () => null;
const testPrisma = {
  blogPost: {
    findFirst: async (..._args: unknown[]) => slugUniqueFindFirstImpl(),
  },
} as unknown as PrismaClient;

function longWords(n: number): string {
  return `<p>${Array.from({ length: n }, (_, index) => `term${index}`).join(" ")}</p>`;
}

const SCENARIO_LEAD =
  "<p>NCLEX-style question: a patient presents for evaluation and needs a safe, prioritized teaching plan before discharge.</p>";

const CLINICAL_DEPTH_TAIL =
  "<h2>Pathophysiology</h2><p>Mechanism (National Council of State Boards of Nursing, 2023).</p>" +
  "<h2>Signs and symptoms</h2><p>Presentation (Centers for Disease Control and Prevention, 2024).</p>" +
  "<h2>Diagnostics and labs</h2><p>Work-up (Agency for Healthcare Research and Quality, 2022).</p>" +
  "<h2>Nursing implications</h2><p>Priorities tied to safety (American Nurses Association, 2021).</p>" +
  "<h2>Nursing interventions</h2><p>Bedside actions (Joint Commission, 2020).</p>" +
  "<h2>Client education</h2><p>Teaching (U.S. Department of Health and Human Services, 2020).</p>" +
  "<h2>NCLEX relevance and clinical pearls</h2><p>Traps (National Institute of Nursing Research, 2019).</p>" +
  "<p>Want more practice? NurseNest members can review the related lesson, flashcards, and rationale-based questions.</p>";

function baseRow(overrides: Partial<BlogPostPrePublishRow> = {}): BlogPostPrePublishRow {
  const slug = "generated-publish-contract";
  return {
    id: "generated_publish_contract",
    slug,
    title: "How to study for NCLEX with structured question review",
    excerpt: "A concrete study-strategy article preview with enough substance for public blog cards and validation.",
    body: `${SCENARIO_LEAD}${longWords(BLOG_ARTICLE_TARGET_WORDS_FOR_PUBLISH + 60)}${CLINICAL_DEPTH_TAIL}`,
    exam: "NCLEX-RN",
    category: "Exam strategy",
    tags: ["nclex", "study strategy"],
    seoTitle: "NCLEX study strategy with structured practice",
    seoDescription:
      "A detailed NCLEX study-strategy article covering question review, internal links, and source-backed learning habits.",
    metaTitleVariant: "NCLEX study strategy with structured practice",
    metaDescriptionVariant:
      "A detailed NCLEX study-strategy article covering question review, internal links, and source-backed learning habits.",
    requiresReferences: true,
    apaReferences: [
      "National Council of State Boards of Nursing. (2023). NCLEX test plans. https://www.ncsbn.org/exams/testplans.page",
      "American Nurses Association. (2021). Nursing scope and standards of practice. https://www.nursingworld.org/",
      "Centers for Disease Control and Prevention. (2024). Infection prevention basics. https://www.cdc.gov/infectioncontrol/",
      "Agency for Healthcare Research and Quality. (2023). Patient safety primer. https://psnet.ahrq.gov/",
    ],
    sourcesJson: {
      version: 2,
      verified: [
        {
          title: "NCLEX test plans",
          year: "2023",
          source: "National Council of State Boards of Nursing",
          url: "https://www.ncsbn.org/exams/testplans.page",
          provenance: "admin_supplied",
          authority: "guideline_body",
        },
        {
          title: "Nursing scope and standards of practice",
          year: "2021",
          source: "American Nurses Association",
          url: "https://www.nursingworld.org/",
          provenance: "admin_supplied",
          authority: "association",
        },
        {
          title: "Infection prevention basics",
          year: "2024",
          source: "Centers for Disease Control and Prevention",
          url: "https://www.cdc.gov/infectioncontrol/",
          provenance: "admin_supplied",
          authority: "regulator",
        },
        {
          title: "Patient safety primer",
          year: "2023",
          source: "Agency for Healthcare Research and Quality",
          url: "https://psnet.ahrq.gov/",
          provenance: "admin_supplied",
          authority: "regulator",
        },
      ],
      excluded: [],
      generatedAt: new Date().toISOString(),
    },
    internalLinkPlan: {
      lessons: [
        {
          label: "Canada RN lessons hub",
          suggestedPath: "/canada/rn/nclex-rn/lessons",
          pathStatus: "skipped_non_lesson",
          id: "ll-hub",
          reviewStatus: "active",
          linkKind: "lessons_hub",
        },
        {
          label: "Practice questions",
          suggestedPath: "/canada/rn/nclex-rn/questions",
          pathStatus: "skipped_non_lesson",
          id: "ll-questions",
          reviewStatus: "active",
          linkKind: "question_bank",
        },
        {
          label: "Flashcards hub",
          suggestedPath: "/flashcards",
          pathStatus: "skipped_non_lesson",
          id: "ll-flash",
          reviewStatus: "active",
          linkKind: "flashcards_hub",
        },
      ],
      seo: {
        version: 1,
        normalizedBreadcrumbs: [
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: "Exam Strategy", href: "/blog/tag/exam-strategy" },
          { label: "NCLEX study review", href: `/blog/${slug}` },
        ],
        suggestedExcerpt: "x".repeat(90),
        emitFaqSchema: false,
        focusKeywords: ["nclex", "study strategy"],
        primaryKeyword: "nclex study strategy",
        imageAlts: [],
      },
      publishingPackage: { version: 1, internalAnchorOpportunities: [], relatedBlogPosts: [] },
      imagePlacements: [],
      imageAttachments: [],
    },
    outlineJson: [],
    faqBlock: {
      items: [
        { q: "How should I review questions?", a: "Use rationales and spaced review, not only score-chasing." },
        { q: "What internal links are safe?", a: "Use public hubs, questions, flashcards, or sign-up CTAs." },
      ],
    },
    schemaSummary: JSON.stringify({ emitFaqSchema: false }),
    coverImage: null,
    coverImageAlt: null,
    coverImageCaption: null,
    coverImagePrompt: null,
    imageStatus: BlogImageStatus.NONE,
    countryTarget: CountryCode.CA,
    postStatus: BlogPostStatus.DRAFT,
    postTemplate: BlogPostTemplate.TOPIC_EXPLAINED,
    intent: BlogPostIntent.STUDY_STRATEGY,
    targetKeyword: "nclex study strategy",
    medicalRiskFlags: [],
    ...overrides,
  };
}

afterEach(() => {
  slugUniqueFindFirstImpl = async () => null;
});

function options(overrides: Partial<PublishGeneratedBlogArticleOptions> = {}): PublishGeneratedBlogArticleOptions {
  return {
    minWords: 1500,
    requireApaReferences: true,
    minReferences: 4,
    requireInternalLinks: true,
    validateInternalLinks: true,
    paywallSafeLinks: true,
    requireClinicalSectionDepth: true,
    publishOnlyIfValid: true,
    prisma: testPrisma,
    ...overrides,
  };
}

describe("validateGeneratedBlogPublishEligibility", () => {
  it("accepts a valid generated article", async () => {
    const res = await validateGeneratedBlogPublishEligibility(baseRow(), "generated_publish_contract", options());
    assert.equal(res.ok, true);
    assert.equal(res.reasons.length, 0);
  });

  it("blocks when references are below the required count", async () => {
    const row = baseRow({
      apaReferences: baseRow().apaReferences.slice(0, 2),
      sourcesJson: {
        version: 2,
        verified: (baseRow().sourcesJson as { verified: unknown[] }).verified.slice(0, 2),
        excluded: [],
        generatedAt: new Date().toISOString(),
      },
    });
    const res = await validateGeneratedBlogPublishEligibility(row, row.id, options());
    assert.equal(res.ok, false);
    assert.ok(res.reasons.some((reason) => reason.includes("APA 7 references are required")));
  });

  it("blocks when internal links are missing", async () => {
    const row = baseRow({
      internalLinkPlan: {
        lessons: [],
        seo: {
          version: 1,
          normalizedBreadcrumbs: [
            { label: "Home", href: "/" },
            { label: "Blog", href: "/blog" },
            { label: "Exam Strategy", href: "/blog/tag/exam-strategy" },
            { label: "NCLEX study review", href: "/blog/generated-publish-contract" },
          ],
          suggestedExcerpt: "x".repeat(90),
          emitFaqSchema: false,
          focusKeywords: ["nclex"],
          primaryKeyword: "nclex",
          imageAlts: [],
        },
      },
    });
    const res = await validateGeneratedBlogPublishEligibility(row, row.id, options());
    assert.equal(res.ok, false);
    assert.ok(res.reasons.some((reason) => reason.includes("internal link")));
  });

  it("blocks when APA references look like placeholders", async () => {
    const row = baseRow({
      apaReferences: ["Lorem ipsum dolor sit amet placeholder (2020). Journal of Nowhere."],
      sourcesJson: [],
    });
    const res = await validateGeneratedBlogPublishEligibility(row, row.id, options());
    assert.equal(res.ok, false);
    assert.ok(res.reasons.some((reason) => reason.includes("placeholder") || reason.includes("fake")));
  });

  it("blocks when paywall-unsafe copy appears in the body", async () => {
    const row = baseRow({
      body: `${baseRow().body}<p>This page includes a completely free lesson inside NurseNest.</p>`,
    });
    const res = await validateGeneratedBlogPublishEligibility(row, row.id, options());
    assert.equal(res.ok, false);
    assert.ok(res.reasons.some((reason) => reason.toLowerCase().includes("paywall") || reason.includes("free")));
  });

  it("blocks when member CTA phrasing is missing", async () => {
    const row = baseRow({
      body: baseRow().body.replace(
        /<p>Want more practice\? NurseNest members can review the related lesson, flashcards, and rationale-based questions\.<\/p>\s*$/i,
        "",
      ),
    });
    const res = await validateGeneratedBlogPublishEligibility(row, row.id, options());
    assert.equal(res.ok, false);
    assert.ok(res.reasons.some((reason) => reason.includes("CTA") || reason.includes("practice")));
  });

  it("blocks when APA in-text citations are insufficient", async () => {
    const noIntextTail =
      "<h2>Pathophysiology</h2><p>Mechanism text without parenthetical years.</p>" +
      "<h2>Signs and symptoms</h2><p>Presentation text.</p>" +
      "<h2>Diagnostics and labs</h2><p>Work-up text.</p>" +
      "<h2>Nursing implications</h2><p>Priorities text without citations.</p>" +
      "<h2>Nursing interventions</h2><p>Priorities text.</p>" +
      "<h2>Client education</h2><p>Teaching text.</p>" +
      "<h2>NCLEX relevance and clinical pearls</h2><p>Trap text.</p>" +
      "<p>Want more practice? NurseNest members can review the related lesson, flashcards, and rationale-based questions.</p>";
    const row = baseRow({
      body: SCENARIO_LEAD + longWords(BLOG_ARTICLE_TARGET_WORDS_FOR_PUBLISH + 80) + noIntextTail,
    });
    const res = await validateGeneratedBlogPublishEligibility(row, row.id, options());
    assert.equal(res.ok, false);
    assert.ok(res.reasons.some((reason) => reason.includes("in-text") || reason.includes("citations")));
  });

  it("blocks when internal links omit flashcards or questions coverage", async () => {
    const row = baseRow({
      internalLinkPlan: {
        lessons: [
          {
            label: "Lessons hub only",
            suggestedPath: "/canada/rn/nclex-rn/lessons",
            pathStatus: "skipped_non_lesson",
            id: "x",
            reviewStatus: "active",
            linkKind: "lessons_hub",
          },
          {
            label: "Also lessons",
            suggestedPath: "/canada/rn/nclex-rn/lessons/review",
            pathStatus: "skipped_non_lesson",
            id: "y",
            reviewStatus: "active",
            linkKind: "lesson",
          },
          {
            label: "Third lessons",
            suggestedPath: "/canada/rn/nclex-rn/lessons/extra",
            pathStatus: "skipped_non_lesson",
            id: "z",
            reviewStatus: "active",
            linkKind: "lesson",
          },
        ],
        seo: (baseRow().internalLinkPlan as { seo: object }).seo,
      },
    });
    const res = await validateGeneratedBlogPublishEligibility(row, row.id, options());
    assert.equal(res.ok, false);
    assert.ok(res.reasons.some((reason) => reason.includes("flashcards") || reason.includes("questions")));
  });

  it("blocks when structured sources include a year before the rolling recency window", async () => {
    const verified = (baseRow().sourcesJson as { verified: object[] }).verified.map((v) => ({ ...v }));
    verified[0] = { ...verified[0], year: "2010", foundational: false };
    const row = baseRow({
      sourcesJson: {
        version: 2,
        verified,
        excluded: [],
        generatedAt: new Date().toISOString(),
      },
    });
    const res = await validateGeneratedBlogPublishEligibility(row, row.id, options());
    assert.equal(res.ok, false);
    assert.ok(res.reasons.some((reason) => reason.includes("2010") || reason.includes("window")));
  });

  it("blocks when clinical scenario framing is missing", async () => {
    const row = baseRow({
      body: `${longWords(BLOG_ARTICLE_TARGET_WORDS_FOR_PUBLISH + 60)}${CLINICAL_DEPTH_TAIL}`,
    });
    const res = await validateGeneratedBlogPublishEligibility(row, row.id, options());
    assert.equal(res.ok, false);
    assert.ok(res.reasons.some((reason) => reason.includes("scenario") || reason.includes("exam-style")));
  });

  it("blocks generic surface-level sectioning", async () => {
    const thin =
      `${SCENARIO_LEAD}${longWords(BLOG_ARTICLE_TARGET_WORDS_FOR_PUBLISH + 40)}` +
      "<h2>Study tips</h2><p>Generic advice.</p>" +
      "<h2>Overview</h2><p>More generic advice.</p>" +
      "<h2>Keywords</h2><p>Filler.</p>" +
      "<h2>Summary</h2><p>Filler.</p>" +
      "<h2>More tips</h2><p>Filler.</p>" +
      "<p>Want more practice? NurseNest members can review the related lesson, flashcards, and rationale-based questions.</p>";
    const row = baseRow({ body: thin });
    const res = await validateGeneratedBlogPublishEligibility(row, row.id, options());
    assert.equal(res.ok, false);
    assert.ok(res.reasons.some((reason) => reason.includes("surface") || reason.includes("H2")));
  });

  it("blocks when lesson links are broken", async () => {
    const row = baseRow({
      internalLinkPlan: {
        lessons: [
          {
            label: "Lessons hub",
            suggestedPath: "/canada/rn/nclex-rn/lessons",
            pathStatus: "skipped_non_lesson",
            id: "ll-hub2",
            reviewStatus: "active",
            linkKind: "lessons_hub",
          },
          {
            label: "Practice questions",
            suggestedPath: "/canada/rn/nclex-rn/questions",
            pathStatus: "skipped_non_lesson",
            id: "ll-q2",
            reviewStatus: "active",
            linkKind: "question_bank",
          },
          {
            label: "Flashcards hub",
            suggestedPath: "/flashcards",
            pathStatus: "skipped_non_lesson",
            id: "ll-f2",
            reviewStatus: "active",
            linkKind: "flashcards_hub",
          },
          {
            label: "Broken lesson link",
            suggestedPath: "/canada/rn/nclex-rn/lessons/missing",
            pathStatus: "not_found",
            id: "ll-broken",
            reviewStatus: "active",
            linkKind: "lesson",
          },
        ],
        seo: {
          version: 1,
          normalizedBreadcrumbs: [
            { label: "Home", href: "/" },
            { label: "Blog", href: "/blog" },
            { label: "Exam Strategy", href: "/blog/tag/exam-strategy" },
            { label: "NCLEX study review", href: "/blog/generated-publish-contract" },
          ],
          suggestedExcerpt: "x".repeat(90),
          emitFaqSchema: false,
          focusKeywords: ["nclex"],
          primaryKeyword: "nclex",
          imageAlts: [],
        },
      },
    });
    const res = await validateGeneratedBlogPublishEligibility(row, row.id, options());
    assert.equal(res.ok, false);
    assert.ok(res.reasons.some((reason) => reason.includes("Broken internal links")));
  });
});
