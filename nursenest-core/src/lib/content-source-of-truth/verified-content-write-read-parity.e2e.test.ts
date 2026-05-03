import assert from "node:assert/strict";
import { after, describe, it } from "node:test";
import {
  BlogImageStatus,
  BlogPostStatus,
  BlogPostTemplate,
  BlogWorkflowStatus,
  ContentStatus,
  CountryCode,
} from "@prisma/client";

import { publishBlogPostCanonical } from "@/lib/blog/publish-blog-post-canonical";
import { getPublishedBlogPostBySlug } from "@/lib/blog/safe-blog-queries";
import { stemHash } from "@/lib/content/stem-hash";
import { prisma } from "@/lib/db";
import { DB_PUBLISHED } from "@/lib/entitlements/content-access-scope";
import { computeStructuralPublicCompleteFromDbRow } from "@/lib/lessons/pathway-lesson-catalog-sync";
import { getPathwayLessonForMarketingHubVerify, getPublishedPathwayLessonRecordById } from "@/lib/lessons/pathway-lesson-loader";
import { BLOG_ARTICLE_TARGET_WORDS_FOR_PUBLISH } from "@/lib/blog/blog-word-count";

function marker(prefix: string): string {
  return `SOT_E2E_${prefix}_${Date.now()}`;
}

function longWords(n: number): string {
  return `<p>${Array.from({ length: n }, () => "term").join(" ")}</p>`;
}

function buildPublishableBlogBody(): string {
  return (
    `${longWords(BLOG_ARTICLE_TARGET_WORDS_FOR_PUBLISH + 40)}` +
    "<h2>Pathophysiology</h2><p>Mechanism explanation for clinical depth.</p>" +
    "<h2>Nursing implications</h2><p>Practice and safety considerations.</p>"
  );
}

const hasDb = Boolean(process.env.DATABASE_URL?.trim());

describe("VERIFIED content admin write → same canonical store (marketing + learner + admin readback)", () => {
  it("PathwayLesson: DB row title visible via marketing loader and learner-by-id loader (no catalog-only divergence)", async () => {
    if (!hasDb) return;
    try {
      await prisma.pathwayLesson.count();
    } catch {
      return;
    }

    const template = await prisma.pathwayLesson.findFirst({
      where: { structuralPublicComplete: true, status: ContentStatus.PUBLISHED, locale: "en" },
    });
    if (!template) {
      console.info("[parity] skip pathway lesson — no published structurally-complete EN template");
      return;
    }

    const slug = `sot-parity-lesson-${Date.now()}`;
    const title = marker("lesson");
    const { id: _id, createdAt: _c, updatedAt: _u, ...rest } = template;

    const created = await prisma.pathwayLesson.create({
      data: {
        ...rest,
        slug,
        title,
        seoTitle: title,
        structuralPublicComplete: false,
        published_at: new Date(),
      },
    });

    try {
      const structural = computeStructuralPublicCompleteFromDbRow({
        ...created,
        pathwayId: created.pathwayId,
      });
      if (!structural) {
        console.info("[parity] skip pathway lesson — cloned row failed structural public gate");
        return;
      }
      await prisma.pathwayLesson.update({
        where: { id: created.id },
        data: { structuralPublicComplete: true },
      });

      const marketing = await getPathwayLessonForMarketingHubVerify(created.pathwayId, slug, "en");
      assert.ok(marketing, "marketing hub verify must load DB-backed lesson");
      assert.ok(marketing!.title.includes("SOT_E2E_"), `marketing title got: ${marketing!.title}`);

      const learner = await getPublishedPathwayLessonRecordById(created.id, "en");
      assert.ok(learner, "learner detail loader must return published structurally-complete row");
      assert.equal(learner!.title, title);

      const admin = await prisma.pathwayLesson.findUnique({ where: { id: created.id } });
      assert.equal(admin?.title, title);
    } finally {
      await prisma.pathwayLesson.delete({ where: { id: created.id } }).catch(() => undefined);
    }
  });

  it("ExamQuestion: admin Prisma row stem matches subscriber-style pool read (same exam_questions table)", async () => {
    if (!hasDb) return;
    try {
      await prisma.examQuestion.count();
    } catch {
      return;
    }

    const stem = marker("qstem");
    const rationale = `${"Rationale text for CAT completeness. ".repeat(12)}`;
    const options = ["Option A priority", "Option B observe", "Option C delegate", "Option D delay"];
    const hash = stemHash(stem);

    const created = await prisma.examQuestion.create({
      data: {
        stem,
        rationale,
        options,
        correctAnswer: ["Option A priority"],
        questionType: "multiple_choice",
        countryCode: "US",
        tier: "rn",
        status: DB_PUBLISHED,
        exam: "NCLEX_RN",
        topic: "Fundamentals",
        bodySystem: "Fundamentals",
        careerType: "nursing",
        regionScope: "BOTH",
        stemHash: hash,
        difficulty: 3,
        tags: ["sot_e2e"],
      },
    });

    try {
      const adminRow = await prisma.examQuestion.findUnique({ where: { id: created.id } });
      assert.equal(adminRow?.stem, stem);

      const poolStyle = await prisma.examQuestion.findFirst({
        where: { id: created.id, status: DB_PUBLISHED },
        select: { stem: true, id: true },
      });
      assert.equal(poolStyle?.stem, stem, "learner/API pool queries must read the same canonical row");
    } finally {
      await prisma.examQuestion.delete({ where: { id: created.id } }).catch(() => undefined);
    }
  });

  it("BlogPost: after canonical publish, admin row + getPublishedBlogPostBySlug agree (public/live query path)", async () => {
    if (!hasDb) return;

    const slug = `sot-parity-blog-${Date.now()}`;
    const title = marker("blog");
    const body = buildPublishableBlogBody();
    const excerpt =
      "Blog parity excerpt long enough for card previews and pre-publish validation rules in the suite.";
    const internalLinkPlan = {
      lessons: [
        {
          label: "Lesson link",
          suggestedPath: "/us/rn/nclex-rn/lessons/sample",
          pathStatus: "ok",
          id: "ll-sot-parity",
          reviewStatus: "active",
        },
      ],
      seo: {
        version: 1,
        normalizedBreadcrumbs: [
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: "Article", href: `/blog/${slug}` },
        ],
        suggestedExcerpt: "x".repeat(80),
        emitFaqSchema: false,
        focusKeywords: ["nclex"],
        primaryKeyword: "fluid balance",
        imageAlts: [],
      },
      publishingPackage: { version: 1, internalAnchorOpportunities: [], relatedBlogPosts: [] },
    };

    const created = await prisma.blogPost.create({
      data: {
        slug,
        title,
        excerpt,
        body,
        exam: "NCLEX-RN",
        category: "Clinical",
        tags: ["nclex", "nursing", "sot-parity"],
        postStatus: BlogPostStatus.DRAFT,
        workflowStatus: BlogWorkflowStatus.GENERATED,
        postTemplate: BlogPostTemplate.TOPIC_EXPLAINED,
        seoTitle: `${title} — SEO`,
        seoDescription:
          "Meta description with enough substance for SERP previews and pre-publish validation rules in tests.",
        metaTitleVariant: `${title} — SEO`,
        metaDescriptionVariant:
          "Meta description with enough substance for SERP previews and pre-publish validation rules in tests.",
        requiresReferences: false,
        apaReferences: [],
        sourcesJson: { version: 2, verified: [], excluded: [], generatedAt: new Date().toISOString() },
        internalLinkPlan: internalLinkPlan as object,
        outlineJson: [],
        faqBlock: {
          items: [
            { q: "First common question for learners?", a: "Answer with enough substance for FAQ validation." },
            { q: "Second question about clinical judgment?", a: "Another substantive answer for schema checks." },
          ],
        },
        schemaSummary: JSON.stringify({
          schemaOpportunities: [{ type: "BlogPosting", rationale: "Test row." }],
          emitFaqSchema: false,
        }),
        imageStatus: BlogImageStatus.NONE,
        countryTarget: CountryCode.US,
        targetKeyword: "fluid balance",
        medicalRiskFlags: [],
      },
    });

    const now = new Date();
    try {
      await publishBlogPostCanonical({
        postId: created.id,
        publishAt: now,
        clearScheduledAt: true,
        context: "bulk_chunk_blog_publish",
        acknowledgePrePublishWarnings: true,
        skipRevalidate: true,
      });

      const adminRow = await prisma.blogPost.findUnique({
        where: { id: created.id },
        select: { title: true, slug: true, postStatus: true },
      });
      assert.equal(adminRow?.title, title);
      assert.equal(adminRow?.postStatus, BlogPostStatus.PUBLISHED);

      const published = await getPublishedBlogPostBySlug(slug);
      assert.ok(published);
      assert.equal(published!.id, created.id);
      assert.ok(published!.title.includes("SOT_E2E_"));
    } finally {
      await prisma.blogPost.delete({ where: { id: created.id } }).catch(() => undefined);
    }
  });

  after(async () => {
    /* per-test cleanup handles rows */
  });
});
