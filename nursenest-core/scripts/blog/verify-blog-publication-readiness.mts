#!/usr/bin/env npx tsx
/**
 * Verifies canonical BlogPost publication rules for hidden-content recovery imports.
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
const reportsDir = path.join(repoRoot, "reports");
const reportPath = path.join(reportsDir, "blog-publication-readiness.md");
const importResultPath = path.join(reportsDir, "blog-hidden-content-import-result.json");
const ssotReportPath = path.join(reportsDir, "blog-admin-public-ssot.md");

const ALLIED_HEALTH_SCOPES = new Set(["paramedic", "respiratory", "mlt", "imaging", "sonography"]);

type ImportResultFile = {
  args?: { apply?: boolean };
  results?: Array<{
    slug?: string;
    sourceType?: string;
    outcome?: string;
  }>;
};

type ImportedRow = {
  id: string;
  slug: string;
  title: string;
  postStatus: BlogPostStatus;
  workflowStatus: BlogWorkflowStatus;
  publishAt: Date | null;
  scheduledAt: Date | null;
  legacySource: string | null;
  careerSlug: string | null;
  locale: string;
  exam: string | null;
  updatedAt: Date;
};

function canonicalRouteFor(row: Pick<ImportedRow, "slug" | "careerSlug">): string {
  const careerSlug = row.careerSlug?.trim().toLowerCase() ?? "";
  if (!careerSlug) return `/blog/${row.slug}`;
  if (ALLIED_HEALTH_SCOPES.has(careerSlug)) return `/allied-health/${careerSlug}/blog/${row.slug}`;
  return `/nursing/${careerSlug}/blog/${row.slug}`;
}

async function readOptionalJson<T>(targetPath: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(targetPath, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

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
    const [liveRows, draftRows, publishedButHidden, importResult] = await Promise.all([
      prisma.blogPost.findMany({
        where: liveWhere,
        select: { slug: true, postStatus: true, workflowStatus: true, publishAt: true, scheduledAt: true },
        orderBy: { slug: "asc" },
        take: 8000,
      }),
      prisma.blogPost.findMany({
        where: {
          OR: [{ postStatus: BlogPostStatus.DRAFT }, { postStatus: BlogPostStatus.NEEDS_REVIEW }],
        },
        select: { slug: true, postStatus: true, legacySource: true },
        take: 8000,
      }),
      prisma.blogPost.findMany({
        where: {
          postStatus: BlogPostStatus.PUBLISHED,
          OR: [{ workflowStatus: { not: BlogWorkflowStatus.PUBLISHED } }, { publishAt: { gt: now } }],
        },
        select: { slug: true, workflowStatus: true, publishAt: true },
        take: 500,
      }),
      readOptionalJson<ImportResultFile>(importResultPath),
    ]);

    const importedSlugs = [
      ...new Set(
        (importResult?.results ?? [])
          .filter((row) => (row.outcome ?? "") !== "skip")
          .filter((row) => !(row.outcome ?? "").startsWith("dry_run:"))
          .map((row) => String(row.slug ?? "").trim())
          .filter(Boolean),
      ),
    ];

    const importedRows: ImportedRow[] = importedSlugs.length
      ? await prisma.blogPost.findMany({
          where: { slug: { in: importedSlugs } },
          select: {
            id: true,
            slug: true,
            title: true,
            postStatus: true,
            workflowStatus: true,
            publishAt: true,
            scheduledAt: true,
            legacySource: true,
            careerSlug: true,
            locale: true,
            exam: true,
            updatedAt: true,
          },
          orderBy: { slug: "asc" },
          take: Math.max(importedSlugs.length, 1),
        })
      : [];

    const sitemapRows = await getMergedBlogSitemapSlugRows();
    const sitemapSlugs = new Set(
      sitemapRows.map((row) => row.slug.trim()).filter(Boolean).map((slug) => decodeURIComponent(slug)),
    );

    const notLiveInSitemap: string[] = [];
    for (const row of liveRows) {
      const slug = row.slug.trim();
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

    const draftsInSitemap = draftRows
      .map((row) => row.slug.trim())
      .filter(Boolean)
      .filter((slug) => sitemapSlugs.has(slug));

    const importedSlugSet = new Set(importedSlugs);
    const importedMissingRows = importedSlugs.filter((slug) => !importedRows.some((row) => row.slug === slug));
    const importedDraftRows = importedRows.filter(
      (row) => row.postStatus === BlogPostStatus.DRAFT || row.postStatus === BlogPostStatus.NEEDS_REVIEW,
    );
    const importedDraftsInAdmin = importedDraftRows.length;
    const importedLocaleMismatches = importedRows.filter((row) => row.locale !== "en");
    const importedLiveMissingSitemap = importedRows.filter((row) => {
      const live = blogPostIsLive(
        {
          postStatus: row.postStatus,
          publishAt: row.publishAt,
          scheduledAt: row.scheduledAt,
          workflowStatus: row.workflowStatus,
        },
        now,
      );
      return live && !sitemapSlugs.has(row.slug);
    });
    const importedDraftsInSitemap = importedDraftRows.filter((row) => sitemapSlugs.has(row.slug));
    const importedUnreachableSilo = importedRows.filter((row) => {
      if (!row.id.trim() || !row.slug.trim() || !row.title.trim()) return true;
      return !importedSlugSet.has(row.slug);
    });

    const lines: string[] = [
      "# Blog publication readiness",
      "",
      `- Generated: ${now.toISOString()}`,
      `- Hidden import result file: ${importResult ? "present" : "missing"}`,
      `- Admin/public SSOT report: ${ssotReportPath}`,
      "",
      "## Global canonical checks",
      "",
      `- Live BlogPost rows (blogLiveWhere): **${liveRows.length}**`,
      `- Merged sitemap slug rows: **${sitemapRows.length}**`,
      `- Live slugs missing from merged sitemap list: **${notLiveInSitemap.length}**`,
      `- Draft/needs-review slugs present in merged sitemap list: **${draftsInSitemap.length}**`,
      `- PUBLISHED rows not public by visibility (sample cap 500): **${publishedButHidden.length}**`,
      "",
      "## Hidden-content import checks",
      "",
      `- Imported/apply slugs from last result file: **${importedSlugs.length}**`,
      `- Imported BlogPost rows found in DB: **${importedRows.length}**`,
      `- Imported slugs missing BlogPost rows: **${importedMissingRows.length}**`,
      `- Imported draft/needs-review rows visible to admin list source (` + "`prisma.blogPost`" + `): **${importedDraftsInAdmin}**`,
      `- Imported rows with locale != en: **${importedLocaleMismatches.length}**`,
      `- Imported live rows missing merged sitemap entry: **${importedLiveMissingSitemap.length}**`,
      `- Imported draft rows leaking into sitemap: **${importedDraftsInSitemap.length}**`,
      `- Imported rows hidden in unreachable silo: **${importedUnreachableSilo.length}**`,
      "",
      "## Rules checked",
      "",
      "- `BlogPostStatus.PUBLISHED` + `workflowStatus=PUBLISHED` + `publishAt <= now` must resolve as live and appear in the merged blog sitemap source.",
      "- Draft / needs-review rows must not appear in the merged blog sitemap source.",
      "- Imported draft rows stay in `BlogPost`, so the admin library and editor continue to read the same rows as the public canonical blog system.",
      "- Imported rows must remain canonical `BlogPost` rows, not `ContentItem` or localized-only silos.",
      "",
    ];

    if (importedRows.length) {
      lines.push("## Imported row surfaces", "");
      lines.push("| slug | status | workflow | route when live | admin route | in sitemap now |", "| --- | --- | --- | --- | --- | --- |");
      for (const row of importedRows.slice(0, 120)) {
        const live = blogPostIsLive(
          {
            postStatus: row.postStatus,
            publishAt: row.publishAt,
            scheduledAt: row.scheduledAt,
            workflowStatus: row.workflowStatus,
          },
          now,
        );
        lines.push(
          `| ${row.slug} | ${row.postStatus} | ${row.workflowStatus} | ${canonicalRouteFor(row)} | /admin/blog?id=${row.id} | ${live && sitemapSlugs.has(row.slug) ? "yes" : "no"} |`,
        );
      }
      lines.push("");
    }

    if (importedMissingRows.length) {
      lines.push("## Imported slugs missing BlogPost rows", "");
      for (const slug of importedMissingRows.slice(0, 80)) lines.push(`- \`${slug}\``);
      lines.push("");
    }

    if (importedLiveMissingSitemap.length) {
      lines.push("## Imported live rows missing sitemap entries", "");
      for (const row of importedLiveMissingSitemap.slice(0, 80)) {
        lines.push(`- \`${row.slug}\` (${row.postStatus} / ${row.workflowStatus})`);
      }
      lines.push("");
    }

    if (importedDraftsInSitemap.length) {
      lines.push("## Imported draft rows leaking into sitemap", "");
      for (const row of importedDraftsInSitemap.slice(0, 80)) {
        lines.push(`- \`${row.slug}\` (${row.postStatus})`);
      }
      lines.push("");
    }

    if (importedLocaleMismatches.length) {
      lines.push("## Imported locale mismatches", "");
      for (const row of importedLocaleMismatches.slice(0, 80)) {
        lines.push(`- \`${row.slug}\` locale=\`${row.locale}\``);
      }
      lines.push("");
    }

    if (importedUnreachableSilo.length) {
      lines.push("## Imported unreachable-silo candidates", "");
      for (const row of importedUnreachableSilo.slice(0, 80)) {
        lines.push(`- \`${row.slug}\` id=\`${row.id}\``);
      }
      lines.push("");
    }

    await fs.mkdir(reportsDir, { recursive: true });
    await fs.writeFile(reportPath, lines.join("\n"), "utf8");
    console.log(
      JSON.stringify(
        {
          ok: true,
          reportPath,
          importedRows: importedRows.length,
          importedDraftsInAdmin,
          importedLiveMissingSitemap: importedLiveMissingSitemap.length,
          importedDraftsInSitemap: importedDraftsInSitemap.length,
          importedUnreachableSilo: importedUnreachableSilo.length,
        },
        null,
        2,
      ),
    );
  } finally {
    await prisma.$disconnect().catch(() => undefined);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
