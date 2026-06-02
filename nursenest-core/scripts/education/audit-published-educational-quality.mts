#!/usr/bin/env npx tsx
/**
 * Read-only audit: **published** blog posts + pathway lessons for placeholder/stub signals,
 * thin word counts, and basic internal-link density on blogs.
 *
 * Usage:
 *   npm run content:audit-published-educational -- --limit=400
 *
 * Requires DATABASE_URL (see loadBlogAuditEnv).
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { BlogPostStatus, ContentStatus, PrismaClient } from "@prisma/client";
import { countWordsFromHtml } from "../../src/lib/blog/blog-word-count";
import { collectEducationalPlaceholderIds } from "../../src/lib/education/educational-content-placeholder-guard";
import { pathwayLessonWordCount } from "../../src/lib/content-quality/classify-lesson";
import type { PathwayLessonSection } from "../../src/lib/lessons/pathway-lesson-types";
import { loadBlogAuditEnv } from "../../src/lib/db/blog-audit-env-load";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(__dirname, "..", "..");
const repoRoot = path.resolve(appRoot, "..");

function parseLimit(argv: string[]): number {
  let limit = 400;
  for (const a of argv.slice(2)) {
    const m = /^--limit=(\d+)$/.exec(a);
    if (m) limit = Math.max(1, Math.min(8000, Number.parseInt(m[1]!, 10)));
  }
  return limit;
}

function internalHrefCount(html: string): number {
  const re = /<a[^>]+href=["'](\/[^"'#?]+)/gi;
  let n = 0;
  for (const _ of html.matchAll(re)) n += 1;
  return n;
}

async function main(): Promise<void> {
  const limit = parseLimit(process.argv);
  const env = await loadBlogAuditEnv({
    appRoot,
    repoRoot,
    whenMissingDatabaseUrlLog: "[content:audit-published-educational] DATABASE_URL is required.",
  });
  if (!env.databaseUrlSet) process.exit(1);

  const prisma = new PrismaClient();
  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  const reportsDir = path.join(repoRoot, "reports");
  await fs.mkdir(reportsDir, { recursive: true });
  const outPath = path.join(reportsDir, `educational-audit-snapshot-${ts}.md`);

  try {
    const posts = await prisma.blogPost.findMany({
      where: { postStatus: BlogPostStatus.PUBLISHED },
      orderBy: { publishAt: "desc" },
      take: limit,
      select: {
        slug: true,
        title: true,
        body: true,
        excerpt: true,
        seoTitle: true,
        seoDescription: true,
        schemaSummary: true,
      },
    });

    const lessons = await prisma.pathwayLesson.findMany({
      where: { status: ContentStatus.PUBLISHED },
      orderBy: { updatedAt: "desc" },
      take: limit,
      select: {
        pathwayId: true,
        slug: true,
        title: true,
        seoTitle: true,
        seoDescription: true,
        sections: true,
        structuralPublicComplete: true,
      },
    });

    const blogRows: string[] = [];
    for (const p of posts) {
      const bundle = [p.title, p.excerpt, p.body, p.seoTitle ?? "", p.seoDescription ?? "", p.schemaSummary ?? ""].join("\n");
      const ids = collectEducationalPlaceholderIds(bundle);
      const wc = countWordsFromHtml(p.body);
      const links = internalHrefCount(p.body);
      if (ids.length > 0 || wc < 600 || links < 2) {
        blogRows.push(
          `| \`${p.slug.replace(/`/g, "'")}\` | ${wc} | ${links} | ${ids.join(", ") || "—"} | ${p.title.replace(/\|/g, "\\|").slice(0, 52)} |`,
        );
      }
    }

    const lessonRows: string[] = [];
    for (const L of lessons) {
      const sectionsJson = JSON.stringify(L.sections ?? []);
      const bundle = [L.title, L.seoTitle, L.seoDescription, sectionsJson].join("\n");
      const ids = collectEducationalPlaceholderIds(bundle);
      const wc = pathwayLessonWordCount({
        sections: Array.isArray(L.sections) ? (L.sections as PathwayLessonSection[]) : [],
      });
      if (ids.length > 0 || !L.structuralPublicComplete || wc < 400) {
        lessonRows.push(
          `| \`${L.pathwayId}\` | \`${L.slug.replace(/`/g, "'")}\` | ${wc} | ${L.structuralPublicComplete ? "yes" : "no"} | ${ids.join(", ") || "—"} | ${L.title.replace(/\|/g, "\\|").slice(0, 44)} |`,
        );
      }
    }

    const md = [
      "# Published educational content — quality snapshot",
      "",
      `- **When:** ${new Date().toISOString()}`,
      `- **Limit per surface:** ${limit}`,
      `- **Published blogs scanned:** ${posts.length}`,
      `- **Published pathway lessons scanned:** ${lessons.length}`,
      "",
      "## Blog — review candidates (thin words, few internal links, or placeholders)",
      "",
      "Heuristics: `<600` words **or** `<2` internal `href=\"/...\"` anchors **or** any stub pattern from `educational-content-placeholder-guard`.",
      "",
      "| Slug | Words | Internal `/` links | Placeholder ids | Title |",
      "| --- | ---: | ---: | --- | --- |",
      ...blogRows.slice(0, 200),
      blogRows.length > 200 ? `\n_…${blogRows.length - 200} more rows omitted._` : "",
      "",
      "## Pathway lessons — review candidates (structure flag, thin words, placeholders)",
      "",
      "| Pathway | Slug | Words | structuralPublicComplete | Placeholder ids | Title |",
      "| --- | --- | ---: | --- | --- | --- |",
      ...lessonRows.slice(0, 200),
      lessonRows.length > 200 ? `\n_…${lessonRows.length - 200} more rows omitted._` : "",
      "",
      "_Read-only: no database mutations. Slugs and URLs unchanged._",
      "",
      "See also `reports/blog-quality-audit.md`, `reports/lesson-quality-audit.md`, and `reports/content-remediation-priority.md`.",
      "",
    ].join("\n");

    await fs.writeFile(outPath, md, "utf8");
    console.info(`[content:audit-published-educational] Wrote ${outPath}`);
    console.info(
      `[content:audit-published-educational] Flagged blogs: ${blogRows.length} / ${posts.length}; lessons: ${lessonRows.length} / ${lessons.length}`,
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
