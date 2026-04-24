#!/usr/bin/env npx tsx
/**
 * Verifies long-tail patho/pharm regeneration posts are public, complete, and counted as topical/long-tail.
 *
 *   npm run blog:verify-generated-publication
 */
import "../../src/lib/db/script-env-bootstrap";
import { BlogPostStatus, PrismaClient } from "@prisma/client";

import { blogLiveWhere } from "../../src/lib/blog/blog-visibility";
import { sqlBlogLiveWhere, sqlPathoPharmLongTail, sqlPathoPharmTopical } from "../../src/lib/blog/blog-patho-pharm-detection";

const prisma = new PrismaClient();
const LEGACY_SOURCE = "patho-pharm-longtail-regeneration";

async function main(): Promise<void> {
  if (!process.env.DATABASE_URL?.trim()) {
    console.error("[verify-generated-blog-publication] DATABASE_URL is not set.");
    process.exit(1);
  }

  const now = new Date();
  const posts = await prisma.blogPost.findMany({
    where: { legacySource: LEGACY_SOURCE },
    select: {
      id: true,
      slug: true,
      title: true,
      postStatus: true,
      publishAt: true,
      category: true,
      postTemplate: true,
      tags: true,
      seoTitle: true,
      seoDescription: true,
    },
  });

  if (posts.length === 0) {
    console.log(
      JSON.stringify(
        {
          ok: false,
          reason: "no_posts_with_legacy_source",
          legacySource: LEGACY_SOURCE,
          hint: "Run APPLY_BLOG_GENERATION=1 npm run blog:generate-patho-pharm-longtail first.",
        },
        null,
        2,
      ),
    );
    process.exit(1);
  }

  const rowIssues: Array<{ slug: string; issues: string[] }> = [];
  for (const p of posts) {
    const issues: string[] = [];
    if (p.postStatus !== BlogPostStatus.PUBLISHED) issues.push("postStatus_not_PUBLISHED");
    if (!p.publishAt) issues.push("publishAt_missing");
    if (!p.category?.trim()) issues.push("category_missing");
    if (!p.postTemplate) issues.push("postTemplate_missing");
    if (!p.tags?.length) issues.push("tags_missing");
    if (!p.seoTitle?.trim()) issues.push("seoTitle_missing");
    if (!p.seoDescription?.trim()) issues.push("seoDescription_missing");
    if (issues.length) rowIssues.push({ slug: p.slug, issues });
  }

  const visibleCount = await prisma.blogPost.count({
    where: { legacySource: LEGACY_SOURCE, AND: [blogLiveWhere(now)] },
  });

  const liveSql = sqlBlogLiveWhere("p", "$1");
  const topicalSql = sqlPathoPharmTopical("p");
  const longTailSql = sqlPathoPharmLongTail("p");

  const topicalRows = await prisma.$queryRawUnsafe<Array<{ c: number }>>(
    `SELECT COUNT(*)::int as c FROM "BlogPost" p WHERE p."legacySource" = $2 AND ${liveSql} AND ${topicalSql}`,
    now,
    LEGACY_SOURCE,
  );
  const longTailRows = await prisma.$queryRawUnsafe<Array<{ c: number }>>(
    `SELECT COUNT(*)::int as c FROM "BlogPost" p WHERE p."legacySource" = $2 AND ${liveSql} AND ${topicalSql} AND ${longTailSql}`,
    now,
    LEGACY_SOURCE,
  );

  const pathoPharmTopicalForLegacy = topicalRows[0]?.c ?? 0;
  const pathoPharmLongTailForLegacy = longTailRows[0]?.c ?? 0;
  const pathoCountsOk = pathoPharmTopicalForLegacy > 0 || pathoPharmLongTailForLegacy > 0;

  const ok =
    rowIssues.length === 0 && visibleCount === posts.length && pathoCountsOk;

  console.log(
    JSON.stringify(
      {
        ok,
        legacySource: LEGACY_SOURCE,
        postCount: posts.length,
        visibleThroughBlogLiveWhereCount: visibleCount,
        pathoPharmTopicalCountForLegacy: pathoPharmTopicalForLegacy,
        pathoPharmLongTailCountForLegacy: pathoPharmLongTailForLegacy,
        rowIssues,
        note: "patho_pharm SQL matches blog-public-patho-pharm-counts.mts heuristics; at least one topical or long-tail row is required.",
      },
      null,
      2,
    ),
  );

  if (!ok) process.exit(1);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
