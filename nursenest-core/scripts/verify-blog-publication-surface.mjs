#!/usr/bin/env node
/**
 * Read-only checks: DB invariants aligned with `blogLiveWhere` / public blog contract.
 *
 * From nursenest-core/:
 *   node scripts/verify-blog-publication-surface.mjs
 *   BASE_URL=https://example.com node scripts/verify-blog-publication-surface.mjs --http=true
 */
import { createRequire } from "node:module";

function parseArgs(argv) {
  return { http: argv.includes("--http=true") || argv.includes("--http") };
}

function stripHtmlWordCount(html) {
  const plain = String(html ?? "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!plain) return 0;
  return plain.split(/\s+/).filter(Boolean).length;
}

async function main() {
  const { http } = parseArgs(process.argv.slice(2));
  const require = createRequire(import.meta.url);
  const { PrismaClient, BlogPostStatus, BlogWorkflowStatus } = require("@prisma/client");
  const prisma = new PrismaClient();
  const now = new Date();

  const wfFail = [BlogWorkflowStatus.FAILED_GENERATION, BlogWorkflowStatus.FAILED_IMAGE];
  const wfPipeline = [
    BlogWorkflowStatus.GENERATED,
    BlogWorkflowStatus.OUTLINE_READY,
    BlogWorkflowStatus.NEEDS_SOURCE_REVIEW,
    BlogWorkflowStatus.NEEDS_MEDICAL_REVIEW,
    BlogWorkflowStatus.NEEDS_SEO_REVIEW,
    BlogWorkflowStatus.NEEDS_METADATA,
    BlogWorkflowStatus.NEEDS_REFERENCES,
  ];

  const liveWhere = {
    OR: [
      {
        AND: [
          { postStatus: BlogPostStatus.PUBLISHED },
          { OR: [{ publishAt: null }, { publishAt: { lte: now } }] },
          { workflowStatus: BlogWorkflowStatus.PUBLISHED },
        ],
      },
      {
        AND: [{ postStatus: BlogPostStatus.APPROVED }, { workflowStatus: { notIn: wfFail } }],
      },
      {
        AND: [
          { postStatus: BlogPostStatus.SCHEDULED },
          { OR: [{ publishAt: { lte: now } }, { scheduledAt: { lte: now } }] },
          { workflowStatus: { notIn: [...wfFail, ...wfPipeline] } },
        ],
      },
    ],
  };

  try {
    const [liveCount, draftLeakCount, duplicateSlugRows, sampleLive] = await Promise.all([
      prisma.blogPost.count({ where: liveWhere }),
      prisma.blogPost.count({ where: { AND: [liveWhere, { postStatus: BlogPostStatus.DRAFT }] } }),
      prisma.$queryRaw`SELECT slug, COUNT(*)::int AS c FROM "BlogPost" GROUP BY slug HAVING COUNT(*) > 1 LIMIT 50`,
      prisma.blogPost.findMany({
        where: liveWhere,
        take: 80,
        orderBy: { publishAt: "desc" },
        select: {
          id: true,
          slug: true,
          title: true,
          body: true,
          seoTitle: true,
          seoDescription: true,
          publishAt: true,
          postStatus: true,
          workflowStatus: true,
        },
      }),
    ]);

    const fieldIssues = [];
    for (const row of sampleLive) {
      const titleOk = Boolean(row.title?.trim());
      const slugOk = Boolean(row.slug?.trim());
      const bodyOk = stripHtmlWordCount(row.body) >= 20;
      const seoTitleOk = Boolean(row.seoTitle?.trim());
      const seoDescOk = Boolean(row.seoDescription?.trim());
      const publishAtOk = row.postStatus === BlogPostStatus.PUBLISHED ? row.publishAt != null : true;
      if (!titleOk || !slugOk || !bodyOk || !seoTitleOk || !seoDescOk || !publishAtOk) {
        fieldIssues.push({
          id: row.id,
          slug: row.slug,
          titleOk,
          slugOk,
          bodyOk,
          seoTitleOk,
          seoDescOk,
          publishAtOk,
          postStatus: row.postStatus,
        });
      }
    }

    console.log(
      "[BLOG_VERIFY_DB]",
      JSON.stringify({
        liveRows: liveCount,
        draftRowsMatchingLiveWhere_shouldBeZero: draftLeakCount,
        duplicateSlugGroups: Array.isArray(duplicateSlugRows) ? duplicateSlugRows.length : 0,
        sampleFieldIssues: fieldIssues.length,
      }),
    );

    let exitCode = 0;
    if (draftLeakCount > 0) {
      console.log("[BLOG_VERIFY_FAIL]", "draft_rows_matched_public_live_where", draftLeakCount);
      exitCode = 1;
    }
    if (Array.isArray(duplicateSlugRows) && duplicateSlugRows.length) {
      console.log("[BLOG_VERIFY_FAIL]", "duplicate_slugs", JSON.stringify(duplicateSlugRows));
      exitCode = 1;
    }
    if (fieldIssues.length) {
      console.log("[BLOG_VERIFY_WARN]", "live_sample_missing_fields", JSON.stringify(fieldIssues.slice(0, 25)));
    }

    if (http) {
      const base = (process.env.BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
      const indexRes = await fetch(`${base}/blog`, { redirect: "follow" });
      console.log("[BLOG_VERIFY_HTTP]", JSON.stringify({ path: "/blog", status: indexRes.status }));

      const samples = await prisma.blogPost.findMany({
        where: liveWhere,
        take: 5,
        orderBy: { publishAt: "desc" },
        select: { slug: true },
      });
      for (const { slug } of samples) {
        const u = `${base}/blog/${encodeURIComponent(slug)}`;
        const r = await fetch(u, { redirect: "follow" });
        console.log("[BLOG_VERIFY_HTTP]", JSON.stringify({ path: `/blog/${slug}`, status: r.status }));
        if (r.status !== 200) exitCode = 1;
      }

      const sm = await fetch(`${base}/sitemap.xml`, { redirect: "follow" });
      console.log("[BLOG_VERIFY_HTTP]", JSON.stringify({ path: "/sitemap.xml", status: sm.status }));
    }

    process.exitCode = exitCode;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
