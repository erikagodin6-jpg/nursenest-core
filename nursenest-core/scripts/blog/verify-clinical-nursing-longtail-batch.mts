#!/usr/bin/env npx tsx
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

import { blogLiveWhere } from "@/lib/blog/blog-visibility";
import {
  getPublishedBlogPostBySlug,
  getPublishedBlogPostsByCategoryPage,
  getPublishedBlogPostsPage,
  getSitemapPublishedBlogSlugsStrict,
} from "@/lib/blog/safe-blog-queries";
import { prisma } from "@/lib/db";

const SLUGS = [
  "siadh-vs-diabetes-insipidus-nursing-comparison",
  "dka-vs-hhs-nursing-priorities",
  "acute-kidney-injury-prerenal-intrinsic-postrenal",
  "left-sided-vs-right-sided-heart-failure",
  "sepsis-pathophysiology-early-nursing-recognition",
  "digoxin-toxicity-nursing-priorities",
  "warfarin-vs-heparin-nursing-comparison",
  "beta-blockers-mechanism-side-effects-nursing-teaching",
  "hyponatremia-symptoms-causes-nursing-priorities",
  "hypernatremia-causes-symptoms-nursing-care",
  "hypocalcemia-vs-hypercalcemia-nclex-guide",
  "metabolic-acidosis-vs-metabolic-alkalosis",
  "respiratory-acidosis-vs-respiratory-alkalosis",
  "copd-symptoms-treatment-nursing-care",
  "asthma-pathophysiology-emergency-nursing-interventions",
  "pulmonary-embolism-signs-symptoms-nursing-priorities",
  "deep-vein-thrombosis-nursing-guide",
  "stroke-ischemic-vs-hemorrhagic-nursing-care",
  "increased-intracranial-pressure-nursing-priorities",
  "seizure-disorders-treatment-nursing-care",
];

const REPORT_PATH = "docs/reports/clinical-nursing-longtail-public-verification-2026-05-10.json";

async function main(): Promise<void> {
  const now = new Date();
  const rows = await prisma.blogPost.findMany({
    where: { slug: { in: SLUGS } },
    select: {
      id: true,
      slug: true,
      title: true,
      category: true,
      tags: true,
      postStatus: true,
      workflowStatus: true,
    },
  });
  const publicIndex = await getPublishedBlogPostsPage(1, 50);
  const publicIndexSet = new Set(publicIndex.posts.map((p) => p.slug));
  const sitemapSet = new Set((await getSitemapPublishedBlogSlugsStrict()).map((r) => r.slug));

  const posts = [];
  for (const row of rows.sort((a, b) => SLUGS.indexOf(a.slug) - SLUGS.indexOf(b.slug))) {
    const detail = await getPublishedBlogPostBySlug(row.slug);
    const categoryPage = await getPublishedBlogPostsByCategoryPage(row.category ?? "", 1, 50);
    const categorySet = new Set(categoryPage.posts.map((p) => p.slug));
    const liveCount = await prisma.blogPost.count({
      where: { AND: [{ slug: row.slug }, blogLiveWhere(now)] },
    });
    posts.push({
      title: row.title,
      slug: row.slug,
      category: row.category,
      tags: row.tags,
      tagCount: row.tags.length,
      status: String(row.postStatus),
      workflowStatus: String(row.workflowStatus),
      liveCount,
      publicUrl: `/blog/${row.slug}`,
      adminPreviewUrl: `/admin/blog?id=${row.id}&preview=1`,
      inPublicIndexFirstPage: publicIndexSet.has(row.slug),
      inCategoryHubFirstPage: categorySet.has(row.slug),
      individualRouteResolver: Boolean(detail),
      sitemapEligible: sitemapSet.has(row.slug),
    });
  }

  const failed = posts.filter(
    (p) =>
      p.liveCount !== 1 ||
      !p.inPublicIndexFirstPage ||
      !p.inCategoryHubFirstPage ||
      !p.individualRouteResolver ||
      !p.sitemapEligible ||
      p.tagCount === 0,
  );
  const report = {
    generatedAt: new Date().toISOString(),
    ok: failed.length === 0 && posts.length === SLUGS.length,
    expectedCount: SLUGS.length,
    foundCount: rows.length,
    publicIndexPageSize: publicIndex.posts.length,
    failed,
    posts,
  };
  mkdirSync(dirname(REPORT_PATH), { recursive: true });
  writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2) + "\n");
  console.log(JSON.stringify({ ok: report.ok, path: REPORT_PATH, failed: failed.length, found: rows.length }, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect().catch(() => undefined);
  });
