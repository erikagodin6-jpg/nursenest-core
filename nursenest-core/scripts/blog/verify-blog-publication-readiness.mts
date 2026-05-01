#!/usr/bin/env npx tsx
/**
 * Verifies canonical BlogPost publication rules vs merged blog sitemap slugs (read-only + report).
 *
 * Requires DATABASE_URL. Writes `reports/blog-publication-readiness.md`.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { BlogPostStatus, BlogWorkflowStatus, PrismaClient } from "@prisma/client";
import { loadBlogAuditEnv } from "../../src/lib/db/blog-audit-env-load";
import { blogLiveWhere, blogPostIsLive } from "../../src/lib/blog/blog-visibility";
import { getMergedBlogSitemapSlugRows } from "../../src/lib/blog/safe-blog-queries";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(__dirname, "..", "..");
const repoRoot = path.resolve(appRoot, "..");
const reportPath = path.join(repoRoot, "reports", "blog-publication-readiness.md");

async function main(): Promise<void> {
  const env = await loadBlogAuditEnv({ appRoot, repoRoot });
  if (!env.databaseUrlSet) {
    console.error("[blog:verify-publication-readiness] DATABASE_URL is required.");
    process.exit(1);
  }

  const prisma = new PrismaClient();
  const now = new Date();

  try {
    const liveWhere = blogLiveWhere(now);
    const liveRows = await prisma.blogPost.findMany({
      where: liveWhere,
      select: { slug: true, postStatus: true, workflowStatus: true, publishAt: true, scheduledAt: true },
      orderBy: { slug: "asc" },
      take: 8000,
    });

    const draftRows = await prisma.blogPost.findMany({
      where: {
        OR: [{ postStatus: BlogPostStatus.DRAFT }, { postStatus: BlogPostStatus.NEEDS_REVIEW }],
      },
      select: { slug: true, postStatus: true, legacySource: true },
      take: 8000,
    });

    const publishedButHidden = await prisma.blogPost.findMany({
      where: {
        postStatus: BlogPostStatus.PUBLISHED,
        OR: [{ workflowStatus: { not: BlogWorkflowStatus.PUBLISHED } }, { publishAt: { gt: now } }],
      },
      select: { slug: true, workflowStatus: true, publishAt: true },
      take: 500,
    });

    const sitemapRows = await getMergedBlogSitemapSlugRows();
    const sitemapSlugs = new Set(
      sitemapRows.map((r) => r.slug.trim()).filter(Boolean).map((s) => decodeURIComponent(s)),
    );

    const liveSlugs = new Set<string>();
    const notLiveInSitemap: string[] = [];
    for (const row of liveRows) {
      const slug = row.slug.trim();
      liveSlugs.add(slug);
      const live = blogPostIsLive(
        {
          postStatus: row.postStatus,
          publishAt: row.publishAt,
          scheduledAt: row.scheduledAt,
          workflowStatus: row.workflowStatus,
        },
        now,
      );
      if (live && !sitemapSlugs.has(slug)) notLiveInSitemap.push(slug);
    }

    const draftsInSitemap: string[] = [];
    for (const d of draftRows) {
      const s = d.slug.trim();
      if (sitemapSlugs.has(s)) draftsInSitemap.push(s);
    }

    const lines: string[] = [
      "# Blog publication readiness",
      "",
      `- Generated: ${now.toISOString()}`,
      "",
      "## Summary",
      "",
      `- Live BlogPost rows (blogLiveWhere): **${liveRows.length}**`,
      `- Merged sitemap slug rows: **${sitemapRows.length}**`,
      `- Live slugs missing from merged sitemap list: **${notLiveInSitemap.length}**`,
      `- Draft/needs-review slugs present in merged sitemap list: **${draftsInSitemap.length}**`,
      `- PUBLISHED rows not public by visibility (sample cap 500): **${publishedButHidden.length}**`,
      "",
      "## Rules checked",
      "",
      "- `blogPostIsLive` matches `blogLiveWhere` for canonical marketing posts.",
      "- Merged sitemap uses `getMergedBlogSitemapSlugRows` (same visibility rules when DB-backed).",
      "- Draft and NEEDS_REVIEW posts must not appear as `/blog/{slug}` entries in the merged sitemap slice.",
      "",
      "## Admin visibility (manual)",
      "",
      "- Draft imports use `BlogPost` rows; admin library reads `prisma.blogPost` — see `reports/blog-admin-public-ssot.md`.",
      "",
    ];

    if (notLiveInSitemap.length) {
      lines.push("## Live slugs not in merged sitemap (investigate)", "");
      for (const s of notLiveInSitemap.slice(0, 80)) lines.push(`- \`${s}\``);
      lines.push("");
    }
    if (draftsInSitemap.length) {
      lines.push("## Draft / needs-review slugs found in merged sitemap (should be empty)", "");
      for (const s of draftsInSitemap.slice(0, 80)) lines.push(`- \`${s}\``);
      lines.push("");
    }

    await fs.mkdir(path.dirname(reportPath), { recursive: true });
    await fs.writeFile(reportPath, lines.join("\n"), "utf8");
    console.log(JSON.stringify({ ok: true, reportPath, notLiveInSitemap: notLiveInSitemap.length, draftsInSitemap: draftsInSitemap.length }, null, 2));
  } finally {
    await prisma.$disconnect().catch(() => undefined);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
