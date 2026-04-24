/**
 * Contract: patho-pharm-style generated `BlogPost` rows (PUBLISHED + workflow PUBLISHED + legacySource)
 * appear on main and/or scoped public list queries aligned with marketing routes.
 *
 * Skips when `DATABASE_URL` is unset or points at the stub URL used by other blog read tests.
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import { BlogPostStatus, BlogPostTemplate, BlogWorkflowStatus } from "@prisma/client";

import { expectedGeneratedBlogPaths } from "@/lib/blog/blog-scoped-career-hubs";
import { blogLiveWhere, buildBlogPublicListWhere } from "@/lib/blog/blog-visibility";
import { getPublishedBlogPostBySlug, getPublishedBlogPostsPage } from "@/lib/blog/safe-blog-queries";
import { prisma } from "@/lib/db";

const LEGACY = "patho-pharm-longtail-regeneration" as const;

function shouldSkipDbContract(): boolean {
  const u = process.env.DATABASE_URL?.trim() ?? "";
  if (!u) return true;
  if (/127\.0\.0\.1:1\//.test(u)) return true;
  if (process.env.SKIP_DB_CONTRACT_TESTS === "1") return true;
  return false;
}

test("generated-like posts: main /blog, scoped nursing + allied hubs, detail slug, counts split", async (t) => {
  if (shouldSkipDbContract()) {
    t.skip("DATABASE_URL not configured for contract DB (set real URL or unset SKIP_DB_CONTRACT_TESTS)");
    return;
  }

  const ts = Date.now();
  const slug = (suffix: string) => `e2e-pp-vis-${ts}-${suffix}`;
  const slugs = [
    slug("global"),
    slug("rn"),
    slug("pn"),
    slug("np"),
    slug("paramedic"),
  ] as const;

  const past = new Date(Date.now() - 86_400_000);
  const base = {
    title: "Pharmacology and pathophysiology nursing review for exam preparation",
    excerpt: "Educational overview for nursing exam preparation.",
    body: "<p>Educational content for nursing exam preparation.</p>",
    postStatus: BlogPostStatus.PUBLISHED,
    workflowStatus: BlogWorkflowStatus.PUBLISHED,
    publishAt: past,
    scheduledAt: null,
    legacySource: LEGACY,
    postTemplate: BlogPostTemplate.DISEASE_PROCESS_EXPLAINER,
    category: "Pathophysiology",
    tags: ["pharmacology", "pathophysiology"],
    targetKeyword: "pharmacology pathophysiology nursing exam preparation long tail",
    locale: "en",
    seoTitle: "Pharmacology pathophysiology nursing review",
    seoDescription:
      "Pharmacology and pathophysiology review for nursing exam preparation with practical study framing.",
  };

  try {
    await prisma.blogPost.createMany({
      data: [
        { ...base, slug: slugs[0], careerSlug: null, exam: null },
        { ...base, slug: slugs[1], careerSlug: "rn", exam: "NCLEX_RN" },
        { ...base, slug: slugs[2], careerSlug: "pn", exam: "NCLEX_PN" },
        { ...base, slug: slugs[3], careerSlug: "np", exam: "NP" },
        { ...base, slug: slugs[4], careerSlug: "paramedic", exam: "ALLIED_HEALTH" },
      ],
    });

    const now = new Date();

    const mainWhere = buildBlogPublicListWhere(now, {});
    const mainGlobal = await prisma.blogPost.count({
      where: { AND: [mainWhere, { slug: slugs[0] }] },
    });
    assert.equal(mainGlobal, 1, "global careerSlug=null post should match main public list where");

    for (const [s, career] of [
      [slugs[1], "rn"],
      [slugs[2], "pn"],
      [slugs[3], "np"],
    ] as const) {
      const scoped = buildBlogPublicListWhere(now, { locale: "en", careerSlug: career });
      const n = await prisma.blogPost.count({ where: { AND: [scoped, { slug: s }] } });
      assert.equal(n, 1, `scoped list should include ${career} post ${s}`);
      const paths = expectedGeneratedBlogPaths({ slug: s, careerSlug: career });
      assert.ok(paths.scopedListPath?.startsWith("/nursing/"));
      const row = await getPublishedBlogPostBySlug(s, {
        locale: "en",
        sourceLocale: "en",
        careerSlug: career,
        allowSourceLocaleFallback: true,
      });
      assert.ok(row, `detail should resolve for ${career} scoped slug`);
    }

    const alliedScoped = buildBlogPublicListWhere(now, { locale: "en", careerSlug: "paramedic" });
    const alliedCount = await prisma.blogPost.count({
      where: { AND: [alliedScoped, { slug: slugs[4] }] },
    });
    assert.equal(alliedCount, 1, "allied profession post should match scoped list where");
    const alliedPaths = expectedGeneratedBlogPaths({ slug: slugs[4], careerSlug: "paramedic" });
    assert.ok(alliedPaths.expectedDetailPath.startsWith("/allied-health/paramedic/blog/"));
    const alliedRow = await getPublishedBlogPostBySlug(slugs[4], {
      locale: "en",
      sourceLocale: "en",
      careerSlug: "paramedic",
      allowSourceLocaleFallback: true,
    });
    assert.ok(alliedRow);

    for (const s of slugs) {
      const live = await prisma.blogPost.count({ where: { AND: [blogLiveWhere(now), { slug: s }] } });
      assert.equal(live, 1, `each fixture must pass blogLiveWhere: ${s}`);
    }

    const pageScopedRn = await getPublishedBlogPostsPage(1, 50, {
      locale: "en",
      sourceLocale: "en",
      careerSlug: "rn",
      allowSourceLocaleFallback: true,
    });
    assert.ok(
      pageScopedRn.posts.some((p) => p.slug === slugs[1]),
      "getPublishedBlogPostsPage RN hub should include RN career fixture",
    );

    const scopedGen = await prisma.blogPost.count({
      where: {
        AND: [
          blogLiveWhere(now),
          { legacySource: LEGACY },
          { careerSlug: { not: null } },
          { NOT: { careerSlug: "" } },
        ],
      },
    });
    assert.ok(scopedGen >= 4, "scoped generated fixtures should count toward scoped-generated-style totals");
  } finally {
    await prisma.blogPost.deleteMany({ where: { slug: { in: [...slugs] } } });
  }
});
