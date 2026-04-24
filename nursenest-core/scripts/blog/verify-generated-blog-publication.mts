#!/usr/bin/env npx tsx
/**
 * Verifies posts created by `generate-patho-pharm-longtail-posts.mts`:
 * published, live under blogLiveWhere(now), SEO, references, FAQ, schema metadata,
 * and public discoverability (main `/blog`, scoped hubs, or sitemap contract).
 *
 *   DOTENV_CONFIG_PATH=.env.local npm run blog:verify-generated-publication
 *
 * Exit 1 if any generated post fails checks or none exist (set VERIFY_ALLOW_EMPTY=1 to allow zero rows).
 *
 * Optional HTTP smoke (production or preview origin):
 *   VERIFY_HTTP=1 NURSENEST_ORIGIN=https://example.com npm run blog:verify-generated-publication
 * (falls back to NEXT_PUBLIC_SITE_URL if NURSENEST_ORIGIN unset)
 *
 * When `BLOG_MAIN_INDEX_EXCLUDE_SCOPED_POSTS=1`, career-tagged posts need not match the unscoped main
 * index query; discoverability is satisfied by a **scoped hub** list hit and/or `blogLiveWhere` (sitemap).
 */
import "../../src/lib/db/script-env-bootstrap";

import { BlogPostStatus, BlogWorkflowStatus } from "@prisma/client";

import {
  rowMatchesLongTailHeuristics,
  rowMatchesPathoPharmTopicalCriteria,
} from "../../src/lib/blog/blog-patho-pharm-detection";
import { expectedGeneratedBlogPaths } from "../../src/lib/blog/blog-scoped-career-hubs";
import { blogLiveWhere, blogPostIsLive, buildBlogPublicListWhere } from "../../src/lib/blog/blog-visibility";
import { getPublishedBlogPostBySlug } from "../../src/lib/blog/safe-blog-queries";
import { prisma } from "../lib/prisma-script-client";
import { PATHO_PHARM_LONGTAIL_LEGACY_SOURCE } from "./lib/patho-pharm-longtail-post-builder";

type FailRow = { slug: string; reasons: string[] };

type VisibilityReport = {
  slug: string;
  careerSlug: string | null;
  exam: string | null;
  expectedPublicBlogPath: string;
  expectedDetailPath: string;
  appearsInMainBlogQuery: boolean;
  appearsInScopedBlogQuery: boolean;
  passesBlogLiveWhere: boolean;
  detailResolvable: boolean;
  visibilitySurface: "main_blog" | "scoped_blog" | "sitemap_blog";
  /** True when `BLOG_MAIN_INDEX_EXCLUDE_SCOPED_POSTS=1`, the row is career-tagged, and the scoped hub query lists it. */
  scopedVisibilityBecauseMainExcludes: boolean;
};

async function mapWithConcurrency<T, R>(items: T[], concurrency: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let next = 0;
  const worker = async () => {
    while (true) {
      const idx = next++;
      if (idx >= items.length) break;
      out[idx] = await fn(items[idx]!);
    }
  };
  const n = Math.max(1, Math.min(concurrency, items.length || 1));
  await Promise.all(Array.from({ length: n }, () => worker()));
  return out;
}

/** When VERIFY_HTTP=1, GET /blog, each expected list path (first page), and each expected detail URL. */
async function verifyHttpForReports(origin: string, reports: VisibilityReport[]): Promise<FailRow[]> {
  const base = origin.replace(/\/$/, "");
  const fails: FailRow[] = [];
  const listPaths = new Set<string>();
  for (const r of reports) {
    listPaths.add(r.expectedPublicBlogPath);
  }
  listPaths.add("/blog");
  try {
    const r = await fetch(`${base}/blog`, { redirect: "follow" });
    if (!r.ok) fails.push({ slug: "__blog_index__", reasons: [`http_blog_index_status_${r.status}`] });
  } catch (e) {
    fails.push({ slug: "__blog_index__", reasons: [`http_blog_index_error:${String(e)}`] });
  }
  for (const p of listPaths) {
    if (p === "/blog") continue;
    try {
      const r = await fetch(`${base}${p}`, { redirect: "follow" });
      if (!r.ok) fails.push({ slug: `__list__${p}`, reasons: [`http_list_${p}_status_${r.status}`] });
    } catch (e) {
      fails.push({ slug: `__list__${p}`, reasons: [`http_list_${p}_error:${String(e)}`] });
    }
  }
  const results = await mapWithConcurrency(reports, 8, async (rep) => {
    try {
      const r = await fetch(`${base}${rep.expectedDetailPath}`, { redirect: "follow" });
      if (!r.ok) return { slug: rep.slug, reasons: [`http_detail_status_${r.status}`] as string[] };
    } catch (e) {
      return { slug: rep.slug, reasons: [`http_detail_error:${String(e)}`] };
    }
    return null;
  });
  for (const x of results) {
    if (x) fails.push(x);
  }
  return fails;
}

function assertSchema(schemaSummary: string | null): string[] {
  const reasons: string[] = [];
  if (!schemaSummary?.trim()) {
    reasons.push("missing_schemaSummary");
    return reasons;
  }
  const hasArticle = schemaSummary.includes('"@type":"Article"') || schemaSummary.includes('"@type": "Article"');
  const hasBlogPosting =
    schemaSummary.includes('"@type":"BlogPosting"') || schemaSummary.includes('"@type": "BlogPosting"');
  if (!hasArticle && !hasBlogPosting) reasons.push("schema_missing_Article_or_BlogPosting");
  if (!schemaSummary.includes("BreadcrumbList")) reasons.push("schema_missing_BreadcrumbList");
  if (!schemaSummary.includes("FAQPage")) reasons.push("schema_missing_FAQPage");
  return reasons;
}

function assertFaq(body: string, faqBlock: unknown): string[] {
  const reasons: string[] = [];
  if (!/frequently asked questions/i.test(body)) reasons.push("body_missing_faq_heading");
  if ((body.match(/<h3\b/gi) ?? []).length < 3) reasons.push("body_faq_h3_below_3");
  if (faqBlock == null || typeof faqBlock !== "object" || faqBlock === null) {
    reasons.push("faqBlock_missing");
  } else {
    const items = (faqBlock as { items?: unknown }).items;
    if (!Array.isArray(items) || items.length < 3) reasons.push("faqBlock_items_below_3");
  }
  return reasons;
}

async function main(): Promise<void> {
  if (!process.env.DATABASE_URL?.trim()) {
    console.error("[verify-generated-blog-publication] DATABASE_URL is not set.");
    process.exit(1);
  }

  const now = new Date();
  const allowEmpty = process.env.VERIFY_ALLOW_EMPTY?.trim() === "1";
  const mainExcludesScoped = process.env.BLOG_MAIN_INDEX_EXCLUDE_SCOPED_POSTS === "1";

  const rows = await prisma.blogPost.findMany({
    where: { legacySource: PATHO_PHARM_LONGTAIL_LEGACY_SOURCE },
    select: {
      slug: true,
      title: true,
      body: true,
      excerpt: true,
      category: true,
      postTemplate: true,
      postStatus: true,
      publishAt: true,
      scheduledAt: true,
      workflowStatus: true,
      careerSlug: true,
      exam: true,
      seoTitle: true,
      seoDescription: true,
      apaReferences: true,
      schemaSummary: true,
      faqBlock: true,
      targetKeyword: true,
      tags: true,
    },
  });

  if (rows.length === 0 && !allowEmpty) {
    console.error("[verify-generated-blog-publication] No posts with legacySource patho-pharm-longtail-regeneration.");
    process.exit(1);
  }

  const failures: FailRow[] = [];
  const visibilityReports: VisibilityReport[] = [];

  for (const row of rows) {
    const reasons: string[] = [];

    if (row.postStatus !== BlogPostStatus.PUBLISHED) {
      reasons.push(`postStatus_not_PUBLISHED:${row.postStatus}`);
    }
    if (row.workflowStatus !== BlogWorkflowStatus.PUBLISHED) {
      reasons.push(`workflowStatus_not_PUBLISHED:${row.workflowStatus}`);
    }
    if (!row.publishAt || row.publishAt.getTime() > now.getTime()) {
      reasons.push("publishAt_missing_or_future");
    }
    if (!blogPostIsLive(row, now)) {
      reasons.push("not_visible_under_blogPostIsLive");
    }
    const prismaLiveCount = await prisma.blogPost.count({
      where: { AND: [blogLiveWhere(now), { slug: row.slug }] },
    });
    const passesBlogLiveWhere = prismaLiveCount === 1;
    if (!passesBlogLiveWhere) {
      reasons.push(`prisma_blogLiveWhere_slug_count_expected_1_got_${prismaLiveCount}`);
    }

    const paths = expectedGeneratedBlogPaths({ slug: row.slug, careerSlug: row.careerSlug });
    const mainWhere = buildBlogPublicListWhere(now, {});
    const scopedWhere =
      row.careerSlug && paths.scopedListPath
        ? buildBlogPublicListWhere(now, { locale: "en", careerSlug: row.careerSlug.trim().toLowerCase() })
        : null;

    const appearsInMainBlogQuery =
      (await prisma.blogPost.count({
        where: { AND: [mainWhere, { slug: row.slug }] },
      })) > 0;

    const appearsInScopedBlogQuery = scopedWhere
      ? (await prisma.blogPost.count({
          where: { AND: [scopedWhere, { slug: row.slug }] },
        })) > 0
      : false;

    const scopeForDetail =
      row.careerSlug && paths.scopedListPath
        ? {
            locale: "en",
            sourceLocale: "en" as const,
            careerSlug: row.careerSlug.trim().toLowerCase(),
            allowSourceLocaleFallback: true as const,
          }
        : undefined;
    const detailRow = scopeForDetail
      ? await getPublishedBlogPostBySlug(row.slug, scopeForDetail)
      : null;
    const detailGlobal = await getPublishedBlogPostBySlug(row.slug, undefined);
    const detailResolvable = paths.scopedListPath ? Boolean(detailRow) : Boolean(detailGlobal);

    const scopedVisibilityBecauseMainExcludes = Boolean(
      mainExcludesScoped && row.careerSlug?.trim() && !appearsInMainBlogQuery && appearsInScopedBlogQuery,
    );

    let visibilitySurface: VisibilityReport["visibilitySurface"];
    if (appearsInMainBlogQuery) {
      visibilitySurface = "main_blog";
    } else if (appearsInScopedBlogQuery) {
      visibilitySurface = "scoped_blog";
    } else if (passesBlogLiveWhere) {
      visibilitySurface = "sitemap_blog";
    } else {
      visibilitySurface = "sitemap_blog";
    }

    const discoverable =
      mainExcludesScoped && row.careerSlug?.trim()
        ? appearsInScopedBlogQuery || passesBlogLiveWhere
        : appearsInMainBlogQuery || appearsInScopedBlogQuery || passesBlogLiveWhere;

    if (!discoverable) {
      reasons.push("not_discoverable_on_any_public_surface");
    }

    visibilityReports.push({
      slug: row.slug,
      careerSlug: row.careerSlug,
      exam: row.exam,
      expectedPublicBlogPath: paths.expectedPublicBlogPath,
      expectedDetailPath: paths.expectedDetailPath,
      appearsInMainBlogQuery,
      appearsInScopedBlogQuery,
      passesBlogLiveWhere,
      detailResolvable,
      visibilitySurface,
      scopedVisibilityBecauseMainExcludes,
    });

    if (!detailResolvable) {
      reasons.push("detail_not_resolvable_at_expected_scope_or_global");
    }

    if (!row.category?.trim()) reasons.push("missing_category");
    if (!row.postTemplate) reasons.push("missing_postTemplate");
    const st = row.seoTitle?.trim() ?? "";
    const sd = row.seoDescription?.trim() ?? "";
    if (st.length < 8) reasons.push("seoTitle_too_short");
    if (st.length > 60) reasons.push("seoTitle_over_60_chars");
    if (sd.length < 40) reasons.push("seoDescription_too_short");
    if (sd.length > 155) reasons.push("seoDescription_over_155_chars");
    if (!row.apaReferences || row.apaReferences.length < 3) reasons.push("apaReferences_below_3");
    else if (!row.apaReferences.every((line) => /https?:\/\//i.test(line))) {
      reasons.push("apa_reference_missing_url");
    }
    reasons.push(...assertFaq(row.body, row.faqBlock));
    reasons.push(...assertSchema(row.schemaSummary));

    if (
      !rowMatchesPathoPharmTopicalCriteria({
        postTemplate: row.postTemplate,
        category: row.category,
        title: row.title,
        tags: row.tags,
      })
    ) {
      reasons.push("fails_patho_pharm_topical_criteria");
    }
    if (
      !rowMatchesLongTailHeuristics({
        slug: row.slug,
        title: row.title,
        targetKeyword: row.targetKeyword,
      })
    ) {
      reasons.push("fails_patho_pharm_long_tail_heuristics");
    }

    if (reasons.length) failures.push({ slug: row.slug, reasons: Array.from(new Set(reasons)) });
  }

  if (rows.length > 0 && failures.length === 0) {
    const slugs = rows.map((r) => r.slug);
    const liveBatchCount = await prisma.blogPost.count({
      where: {
        AND: [blogLiveWhere(now), { legacySource: PATHO_PHARM_LONGTAIL_LEGACY_SOURCE }, { slug: { in: slugs } }],
      },
    });
    if (liveBatchCount !== rows.length) {
      failures.push({
        slug: "__batch_listing__",
        reasons: [
          `blogLiveWhere_batch_count_mismatch:expected_${rows.length}_got_${liveBatchCount}`,
        ],
      });
    }
  }

  if (process.env.VERIFY_HTTP?.trim() === "1" && rows.length > 0) {
    const origin =
      process.env.NURSENEST_ORIGIN?.trim() ||
      process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
      process.env.VERCEL_URL?.trim();
    if (!origin) {
      console.error(
        "[verify-generated-blog-publication] VERIFY_HTTP=1 requires NURSENEST_ORIGIN, NEXT_PUBLIC_SITE_URL, or VERCEL_URL.",
      );
      process.exit(1);
    }
    const absoluteOrigin = /^https?:\/\//i.test(origin) ? origin : `https://${origin}`;
    const httpFails = await verifyHttpForReports(absoluteOrigin, visibilityReports);
    for (const f of httpFails) failures.push(f);
  }

  const summary = {
    checked: rows.length,
    failures: failures.length,
    failedSlugs: failures.map((f) => f.slug),
    details: failures,
    verifyHttp: process.env.VERIFY_HTTP?.trim() === "1",
    mainBlogExcludesScopedPosts: mainExcludesScoped,
    visibilityReports,
  };
  console.log(JSON.stringify({ verifyGeneratedBlogPublication: summary }));

  if (failures.length) {
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
