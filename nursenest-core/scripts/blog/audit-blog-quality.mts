#!/usr/bin/env npx tsx
/**
 * Audit non-published BlogPost rows with governance scoring (read-only).
 * Writes reports/blog-audit-drafts-{timestamp}.md + .json
 *
 * Usage:
 *   npm run blog:audit-quality -- --limit=200
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { BlogPostStatus, PrismaClient } from "@prisma/client";
import { loadBlogAuditEnv } from "../../src/lib/db/blog-audit-env-load";
import { scoreBlogArticleForGovernance } from "../../src/lib/blog/blog-quality-score";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(__dirname, "..", "..");
const repoRoot = path.resolve(appRoot, "..");

function parseLimit(argv: string[]): number {
  let limit = 200;
  for (const a of argv.slice(2)) {
    const m = /^--limit=(\d+)$/.exec(a);
    if (m) limit = Math.max(1, Math.min(5000, Number.parseInt(m[1]!, 10)));
  }
  return limit;
}

async function main(): Promise<void> {
  const limit = parseLimit(process.argv);
  const env = await loadBlogAuditEnv({
    appRoot,
    repoRoot,
    whenMissingDatabaseUrlLog: "[blog:audit-quality] DATABASE_URL is required.",
  });
  if (!env.databaseUrlSet) process.exit(1);

  const prisma = new PrismaClient();
  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  const reportsDir = path.join(repoRoot, "reports");
  await fs.mkdir(reportsDir, { recursive: true });
  const mdPath = path.join(reportsDir, `blog-audit-drafts-${ts}.md`);
  const jsonPath = path.join(reportsDir, `blog-audit-drafts-${ts}.json`);

  try {
    const posts = await prisma.blogPost.findMany({
      where: {
        postStatus: { in: [BlogPostStatus.DRAFT, BlogPostStatus.NEEDS_REVIEW, BlogPostStatus.APPROVED] },
      },
      orderBy: { updatedAt: "desc" },
      take: limit,
      select: {
        id: true,
        slug: true,
        title: true,
        postStatus: true,
        body: true,
        seoTitle: true,
        seoDescription: true,
        targetKeyword: true,
        category: true,
        tags: true,
        faqBlock: true,
        apaReferences: true,
        sourcesJson: true,
        internalLinkPlan: true,
      },
    });

    type Row = (typeof posts)[number];
    const scoreRow = (p: Row) => {
      const plan = p.internalLinkPlan as { lessons?: unknown[] } | null;
      const planned = Array.isArray(plan?.lessons) ? plan.lessons.filter(Boolean).length : 0;
      return scoreBlogArticleForGovernance({
        title: p.title,
        bodyHtml: p.body,
        slug: p.slug,
        seoTitle: p.seoTitle,
        seoDescription: p.seoDescription,
        targetKeyword: p.targetKeyword,
        category: p.category,
        tags: p.tags,
        faqBlock: p.faqBlock,
        apaReferences: p.apaReferences,
        sourcesJson: p.sourcesJson,
        plannedInternalLinkRows: planned,
      });
    };

    const rows: Array<{
      id: string;
      slug: string;
      title: string;
      postStatus: string;
      composite: number;
      recommendation: string;
      failReasons: string[];
    }> = [];

    let sum = 0;
    const failHistogram = new Map<string, number>();

    for (const p of posts) {
      const g = scoreRow(p);
      sum += g.compositeScore;
      for (const f of g.failReasons) {
        const key = f.split(":").slice(0, 2).join(":");
        failHistogram.set(key, (failHistogram.get(key) ?? 0) + 1);
      }
      rows.push({
        id: p.id,
        slug: p.slug,
        title: p.title,
        postStatus: p.postStatus,
        composite: g.compositeScore,
        recommendation: g.publishRecommendation,
        failReasons: g.failReasons,
      });
    }

    const avg = posts.length ? sum / posts.length : 0;
    const weak = [...rows].filter((r) => r.composite < 55 || r.recommendation === "block").sort((a, b) => a.composite - b.composite);

    const md = [
      "# Blog governance audit — drafts / review",
      "",
      `- **When:** ${new Date().toISOString()}`,
      `- **Rows scanned:** ${posts.length} (limit ${limit})`,
      `- **Mean composite score:** ${avg.toFixed(1)}`,
      "",
      "## Fail reason histogram (prefix)",
      "",
      [...failHistogram.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([k, v]) => `- \`${k}\`: ${v}`)
        .join("\n") || "- (none)",
      "",
      "## Weakest rows (composite < 55 or block)",
      "",
      "| Composite | Status | Slug | Title |",
      "| ---: | --- | --- | --- |",
      ...weak.slice(0, 80).map(
        (r) =>
          `| ${r.composite} | ${r.postStatus} | \`${r.slug.replace(/`/g, "'")}\` | ${r.title.replace(/\|/g, "\\|").slice(0, 70)} |`,
      ),
      "",
      "_Read-only: no posts were modified._",
      "",
    ].join("\n");

    await fs.writeFile(mdPath, md, "utf8");
    await fs.writeFile(jsonPath, JSON.stringify({ avgComposite: avg, rows }, null, 2), "utf8");
    console.info(`[blog:audit-quality] Wrote ${mdPath}`);
    console.info(`[blog:audit-quality] Wrote ${jsonPath}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
