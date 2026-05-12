/**
 * Phase 3 SEO authority expansion contract tests.
 *
 * Tests: Phase 3 enrichment fields, Article JSON-LD, study order,
 * next steps, CTR-optimized metadata, blog post registry, footer links,
 * and visual authority panel for RT pages.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { listAuthorityClusterPages } from "@/lib/seo/authority-cluster-pages";
import { LF3_ALL_TOPICS, LF3_POSTS, LF3_CNPLE_TOPICS, LF3_REX_PN_TOPICS, LF3_RT_TOPICS } from "@/lib/seo/long-form-seo-blog-posts-chunk3";

// ── Phase 3 enrichment field coverage ─────────────────────────────────────────

test("every authority cluster page has Phase 3 enrichment fields populated", () => {
  const pages = listAuthorityClusterPages();
  for (const page of pages) {
    assert.ok(
      page.whatYoullLearn && page.whatYoullLearn.length >= 3,
      `${page.path} must have at least 3 whatYoullLearn bullets`,
    );
    assert.ok(
      page.whoThisIsFor && page.whoThisIsFor.length >= 50,
      `${page.path} must have a non-trivial whoThisIsFor paragraph`,
    );
    assert.ok(
      page.studyOrder && page.studyOrder.length >= 4,
      `${page.path} must have at least 4 study order steps`,
    );
    assert.ok(
      page.nextSteps && page.nextSteps.length >= 3,
      `${page.path} must have at least 3 next steps`,
    );
  }
});

test("RT cluster pages have highYieldTips populated", () => {
  const pages = listAuthorityClusterPages().filter((p) => p.cluster === "respiratory-therapy");
  for (const page of pages) {
    assert.ok(
      page.highYieldTips && page.highYieldTips.length >= 3,
      `${page.path} (RT cluster) must have at least 3 high-yield tips`,
    );
  }
});

test("every authority cluster page nextSteps links to pages within its cluster", () => {
  const cnpleBase = "/canada/np/cnple";
  const rexBase = "/canada/rpn/rex-pn";
  const rtBase = "/allied-health/respiratory-therapy";

  const pages = listAuthorityClusterPages();
  for (const page of pages) {
    const expectedBase =
      page.cluster === "cnple" ? cnpleBase : page.cluster === "rex-pn" ? rexBase : rtBase;
    const hasClusterLink = page.nextSteps.some((step) => step.href.startsWith(expectedBase));
    assert.ok(
      hasClusterLink,
      `${page.path} nextSteps must include at least one link within ${expectedBase}`,
    );
  }
});

// ── CTR-optimized metadata ─────────────────────────────────────────────────────

test("authority cluster page titles include 2026 for freshness signal", () => {
  const pages = listAuthorityClusterPages();
  for (const page of pages) {
    assert.ok(
      page.title.includes("2026"),
      `${page.path} title must include 2026 for freshness signal — got: ${page.title}`,
    );
    assert.ok(
      page.title.includes("NurseNest"),
      `${page.path} title must include NurseNest brand — got: ${page.title}`,
    );
  }
});

test("authority cluster meta descriptions are within optimal CTR length", () => {
  const pages = listAuthorityClusterPages();
  for (const page of pages) {
    assert.ok(
      page.description.length >= 130,
      `${page.path} meta description too short (${page.description.length} chars) — minimum 130`,
    );
    assert.ok(
      page.description.length <= 225,
      `${page.path} meta description too long (${page.description.length} chars) — maximum 225`,
    );
  }
});

test("authority cluster H1s are unique and descriptive", () => {
  const pages = listAuthorityClusterPages();
  const h1s = pages.map((p) => p.h1);
  assert.equal(new Set(h1s).size, h1s.length, "all H1s must be unique");
  for (const page of pages) {
    assert.ok(page.h1.length >= 30, `${page.path} H1 is too short: ${page.h1}`);
  }
});

// ── Article JSON-LD in renderer ────────────────────────────────────────────────

test("authority cluster renderer emits Article JSON-LD with datePublished", () => {
  const src = fs.readFileSync(
    path.join(process.cwd(), "src/components/seo/authority-cluster-page.tsx"),
    "utf8",
  );
  assert.match(src, /"@type": "Article"/, "renderer must include Article schema type");
  assert.match(src, /datePublished/, "Article schema must include datePublished");
  assert.match(src, /dateModified/, "Article schema must include dateModified");
  assert.match(src, /teaches/, "Article schema must include teaches field from whatYoullLearn");
  assert.match(src, /educationalLevel/, "Article schema must include educationalLevel");
});

test("authority cluster renderer emits all required structured data blocks", () => {
  const src = fs.readFileSync(
    path.join(process.cwd(), "src/components/seo/authority-cluster-page.tsx"),
    "utf8",
  );
  assert.match(src, /<WebPageJsonLd\b/, "renderer must emit WebPage JSON-LD");
  assert.match(src, /<BreadcrumbJsonLd\b/, "renderer must emit BreadcrumbList JSON-LD");
  assert.match(src, /<FaqJsonLd\b/, "renderer must emit FAQPage JSON-LD");
  assert.match(src, /<ArticleJsonLd\b/, "renderer must emit Article JSON-LD");
});

// ── New section rendering in view ──────────────────────────────────────────────

test("authority cluster renderer renders whatYoullLearn, studyOrder, and nextSteps sections", () => {
  const src = fs.readFileSync(
    path.join(process.cwd(), "src/components/seo/authority-cluster-page.tsx"),
    "utf8",
  );
  assert.match(src, /whatYoullLearn/, "renderer must reference whatYoullLearn field");
  assert.match(src, /studyOrder/, "renderer must reference studyOrder field");
  assert.match(src, /nextSteps/, "renderer must reference nextSteps field");
  assert.match(src, /highYieldTips/, "renderer must reference highYieldTips field");
  assert.match(src, /whoThisIsFor/, "renderer must reference whoThisIsFor field");
  assert.match(src, /What you will learn/, "renderer must show 'What you will learn' heading");
  assert.match(src, /Recommended study order/, "renderer must show study order heading");
  assert.match(src, /Continue your preparation/, "renderer must show next steps CTA heading");
});

// ── Blog post chunk 3 registry ─────────────────────────────────────────────────

test("blog chunk 3 contains exactly 15 CNPLE, 15 REx-PN, and 15 RT topics", () => {
  assert.equal(LF3_CNPLE_TOPICS.length, 15, "must have 15 CNPLE topics");
  assert.equal(LF3_REX_PN_TOPICS.length, 15, "must have 15 REx-PN topics");
  assert.equal(LF3_RT_TOPICS.length, 15, "must have 15 RT topics");
  assert.equal(LF3_ALL_TOPICS.length, 45, "must have 45 total topics");
});

test("blog chunk 3 topics have unique IDs and slugs", () => {
  const ids = LF3_ALL_TOPICS.map((t) => t.id);
  const slugs = LF3_ALL_TOPICS.map((t) => t.slug);
  assert.equal(new Set(ids).size, ids.length, "all chunk 3 topic IDs must be unique");
  assert.equal(new Set(slugs).size, slugs.length, "all chunk 3 slugs must be unique");
});

test("blog chunk 3 topics have valid meta title and description lengths", () => {
  for (const topic of LF3_ALL_TOPICS) {
    assert.ok(
      topic.metaTitle.length <= 75,
      `${topic.id} metaTitle too long (${topic.metaTitle.length} chars): ${topic.metaTitle}`,
    );
    assert.ok(
      topic.metaDescription.length >= 120 && topic.metaDescription.length <= 220,
      `${topic.id} metaDescription length out of range (${topic.metaDescription.length} chars)`,
    );
    assert.ok(
      topic.metaTitle.includes("NurseNest"),
      `${topic.id} metaTitle must include NurseNest brand`,
    );
  }
});

test("blog chunk 3 full posts have at least 3 sections each", () => {
  assert.ok(LF3_POSTS.length >= 5, "must have at least 5 full blog posts in chunk 3");
  for (const post of LF3_POSTS) {
    assert.ok(post.sections.length >= 3, `${post.id} must have at least 3 sections`);
    assert.ok(post.faq.length >= 2, `${post.id} must have at least 2 FAQ items`);
    assert.ok(post.references.length >= 1, `${post.id} must have at least 1 reference`);
    assert.ok(post.wordCount >= 800, `${post.id} wordCount must be >= 800 (got ${post.wordCount})`);
  }
});

test("CNPLE blog posts reference CNPLE cluster paths in their content", () => {
  const cnplePosts = LF3_POSTS.filter((p) => p.cluster === "cnple");
  for (const post of cnplePosts) {
    const allContent = post.sections.map((s) => s.body).join(" ") + post.faq.map((f) => f.answer).join(" ");
    assert.ok(
      allContent.includes("CNPLE") || allContent.includes("cnple"),
      `${post.id} content must reference CNPLE`,
    );
  }
});

test("RT blog posts reference NBRC or respiratory therapy exams in content", () => {
  const rtPosts = LF3_POSTS.filter((p) => p.cluster === "respiratory-therapy");
  for (const post of rtPosts) {
    const allContent = post.sections.map((s) => s.body).join(" ");
    const hasExamRef = allContent.includes("NBRC") || allContent.includes("TMC") || allContent.includes("RRT") || allContent.includes("respiratory therapy");
    assert.ok(hasExamRef, `${post.id} content must reference NBRC, TMC, RRT, or respiratory therapy`);
  }
});

// ── Footer authority cluster links ─────────────────────────────────────────────

test("site footer includes authority cluster guide links", () => {
  const src = fs.readFileSync(
    path.join(process.cwd(), "src/components/layout/site-footer.tsx"),
    "utf8",
  );
  assert.match(src, /canada\/np\/cnple\/study-guide/, "footer must link to CNPLE study guide");
  assert.match(src, /canada\/np\/cnple\/loft-exam/, "footer must link to CNPLE LOFT format");
  assert.match(src, /canada\/rpn\/rex-pn\/cat/, "footer must link to REx-PN CAT exam");
  assert.match(src, /canada\/rpn\/rex-pn\/pharmacology/, "footer must link to REx-PN pharmacology");
  assert.match(src, /allied-health\/respiratory-therapy\/ventilation/, "footer must link to RT ventilation");
  assert.match(src, /allied-health\/respiratory-therapy\/oxygen-therapy/, "footer must link to RT oxygen therapy");
  assert.match(src, /Exam authority guides/, "footer must have 'Exam authority guides' section label");
});

// ── CNPLE static sub-pages Phase 3 compliance ─────────────────────────────────

test("CNPLE static sub-pages use robotsForRegionalMarketingHub (no noindex)", () => {
  const staticPages = [
    "src/app/(marketing)/(default)/canada/np/cnple/study-guide/page.tsx",
    "src/app/(marketing)/(default)/canada/np/cnple/case-based-questions/page.tsx",
    "src/app/(marketing)/(default)/canada/np/cnple/provisional-registration/page.tsx",
    "src/app/(marketing)/(default)/canada/np/cnple/loft-exam/page.tsx",
  ];
  for (const pagePath of staticPages) {
    const src = fs.readFileSync(path.join(process.cwd(), pagePath), "utf8");
    assert.ok(!src.includes("index: false"), `${pagePath} must not set noindex`);
    assert.match(src, /ExamClusterHubPage/, `${pagePath} must use ExamClusterHubPage component`);
    assert.match(src, /cnpleHubClusterBreadcrumbs/, `${pagePath} must use cluster breadcrumbs`);
    assert.match(src, /revalidate = 86400/, `${pagePath} must set 24-hour ISR revalidation`);
  }
});

// ── Cluster page datePublished/dateModified ────────────────────────────────────

test("authority cluster pages have datePublished and dateModified fields", () => {
  const pages = listAuthorityClusterPages();
  for (const page of pages) {
    assert.ok(page.datePublished, `${page.path} must have datePublished`);
    assert.ok(page.dateModified, `${page.path} must have dateModified`);
    assert.match(page.datePublished, /^\d{4}-\d{2}-\d{2}$/, `${page.path} datePublished must be YYYY-MM-DD format`);
    assert.match(page.dateModified, /^\d{4}-\d{2}-\d{2}$/, `${page.path} dateModified must be YYYY-MM-DD format`);
  }
});
