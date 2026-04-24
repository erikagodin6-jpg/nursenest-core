#!/usr/bin/env npx tsx
/**
 * Verifies long-tail patho/pharm regeneration posts are public, complete, and counted as topical/long-tail.
 *
 *   npm run blog:verify-generated-publication
 */
import "../../src/lib/db/script-env-bootstrap";
import { BlogPostStatus, BlogWorkflowStatus, PrismaClient } from "@prisma/client";

import { blogLiveWhere } from "../../src/lib/blog/blog-visibility";
import { sqlBlogLiveWhere, sqlPathoPharmLongTail, sqlPathoPharmTopical } from "../../src/lib/blog/blog-patho-pharm-detection";
import { validatePostContent } from "./lib/patho-pharm-longtail-content";

const prisma = new PrismaClient();
const LEGACY_SOURCE = "patho-pharm-longtail-regeneration";

type PathoCounts = {
  visible_public_total: number;
  patho_pharm_topical: number;
  patho_pharm_long_tail: number;
};

async function readPathoCounts(now: Date): Promise<PathoCounts> {
  const live = sqlBlogLiveWhere("p", "$1");
  const topical = sqlPathoPharmTopical("p");
  const lt = sqlPathoPharmLongTail("p");
  const rows = await prisma.$queryRawUnsafe<
    Array<{
      visible_public_total: number;
      patho_pharm_topical: number;
      patho_pharm_long_tail: number;
    }>
  >(
    `SELECT
      (SELECT COUNT(*)::int FROM "BlogPost" p WHERE ${live}) AS visible_public_total,
      (SELECT COUNT(*)::int FROM "BlogPost" p WHERE ${live} AND ${topical}) AS patho_pharm_topical,
      (SELECT COUNT(*)::int FROM "BlogPost" p WHERE ${live} AND ${topical} AND ${lt}) AS patho_pharm_long_tail`,
    now,
  );
  return rows[0] ?? { visible_public_total: 0, patho_pharm_topical: 0, patho_pharm_long_tail: 0 };
}

function faqItemCountFromBlock(block: unknown): number {
  if (block == null) return 0;
  let o: unknown = block;
  if (typeof block === "string") {
    try {
      o = JSON.parse(block) as unknown;
    } catch {
      return 0;
    }
  }
  if (typeof o !== "object" || o === null || Array.isArray(o)) return 0;
  const items = (o as { items?: unknown }).items;
  return Array.isArray(items) ? items.length : 0;
}

function schemaGraphTypes(schemaSummary: string | null): string[] {
  if (!schemaSummary?.trim()) return [];
  try {
    const j = JSON.parse(schemaSummary) as { "@graph"?: Array<{ "@type"?: string | string[] }> };
    const g = j["@graph"];
    if (!Array.isArray(g)) return [];
    return g.flatMap((node) => {
      const t = node["@type"];
      if (Array.isArray(t)) return t;
      if (typeof t === "string") return [t];
      return [];
    });
  } catch {
    return ["parse_error"];
  }
}

async function main(): Promise<void> {
  if (!process.env.DATABASE_URL?.trim()) {
    console.error("[verify-generated-blog-publication] DATABASE_URL is not set.");
    process.exit(1);
  }

  const now = new Date();
  const pathoGlobal = await readPathoCounts(now);

  const posts = await prisma.blogPost.findMany({
    where: { legacySource: LEGACY_SOURCE },
    select: {
      id: true,
      slug: true,
      title: true,
      body: true,
      postStatus: true,
      publishAt: true,
      workflowStatus: true,
      category: true,
      postTemplate: true,
      tags: true,
      seoTitle: true,
      seoDescription: true,
      apaReferences: true,
      faqBlock: true,
      schemaSummary: true,
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

  const visibleRows = await prisma.blogPost.findMany({
    where: { legacySource: LEGACY_SOURCE, AND: [blogLiveWhere(now)] },
    select: { id: true },
  });
  const visibleIdSet = new Set(visibleRows.map((r) => r.id));

  const rowIssues: Array<{ slug: string; issues: string[] }> = [];
  let internalBlogLinksLt3 = 0;

  for (const p of posts) {
    const issues: string[] = [];
    if (p.postStatus !== BlogPostStatus.PUBLISHED) issues.push("postStatus_not_PUBLISHED");
    if (p.workflowStatus !== BlogWorkflowStatus.PUBLISHED) issues.push("workflowStatus_not_PUBLISHED");
    if (!p.publishAt) issues.push("publishAt_missing");
    else if (p.publishAt.getTime() > now.getTime()) issues.push("publishAt_in_future");
    if (!visibleIdSet.has(p.id)) issues.push("not_visible_via_blogLiveWhere");
    if (!p.category?.trim()) issues.push("category_missing");
    if (!p.postTemplate) issues.push("postTemplate_missing");
    if (!p.tags?.length) issues.push("tags_missing");
    if (!p.seoTitle?.trim()) issues.push("seoTitle_missing");
    if (!p.seoDescription?.trim()) issues.push("seoDescription_missing");
    if (!p.apaReferences?.length || p.apaReferences.length < 3) issues.push("apaReferences_lt_3");

    const blogLinks = (p.body.match(/href="\/blog\//g) ?? []).length;
    if (blogLinks < 3) internalBlogLinksLt3 += 1;

    const contentErr = validatePostContent(p.body, p.title, 0);
    if (contentErr) issues.push(`content_gate:${contentErr}`);

    const faqItems = faqItemCountFromBlock(p.faqBlock);
    if (faqItems < 3) issues.push("faqBlock_items_lt_3");

    const types = schemaGraphTypes(p.schemaSummary);
    if (!types.includes("BlogPosting")) issues.push("schemaSummary_missing_BlogPosting");
    if (!types.includes("BreadcrumbList")) issues.push("schemaSummary_missing_BreadcrumbList");
    if (!types.includes("FAQPage")) issues.push("schemaSummary_missing_FAQPage");

    if (issues.length) rowIssues.push({ slug: p.slug, issues });
  }

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

  const minVisible = process.env.BLOG_VERIFY_MIN_VISIBLE_PUBLIC?.trim();
  const visibleFloorOk =
    !minVisible ||
    pathoGlobal.visible_public_total >= (parseInt(minVisible, 10) || 0);

  const ok =
    rowIssues.length === 0 &&
    visibleIdSet.size === posts.length &&
    pathoCountsOk &&
    visibleFloorOk;

  console.log(
    JSON.stringify(
      {
        ok,
        legacySource: LEGACY_SOURCE,
        postCount: posts.length,
        visibleThroughBlogLiveWhereCount: visibleIdSet.size,
        pathoPharmTopicalCountForLegacy: pathoPharmTopicalForLegacy,
        pathoPharmLongTailCountForLegacy: pathoPharmLongTailForLegacy,
        pathoGlobalCounts: pathoGlobal,
        internalBlogLinksLt3Count: internalBlogLinksLt3,
        rowIssues,
        note:
          "Set BLOG_VERIFY_MIN_VISIBLE_PUBLIC to assert visible_public_total floor after a known baseline. schemaSummary must parse as JSON-LD @graph with BlogPosting, BreadcrumbList, FAQPage.",
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
