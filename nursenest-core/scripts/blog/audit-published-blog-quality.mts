#!/usr/bin/env npx tsx
/**
 * Audit **published** BlogPost rows with governance scoring (read-only).
 * Writes reports/blog-audit-published-{timestamp}.md + .json
 *
 * Usage:
 *   npm run blog:audit-published-quality -- --limit=300
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
  let limit = 300;
  for (const a of argv.slice(2)) {
    const m = /^--limit=(\d+)$/.exec(a);
    if (m) limit = Math.max(1, Math.min(8000, Number.parseInt(m[1]!, 10)));
  }
  return limit;
}

async function main(): Promise<void> {
  const limit = parseLimit(process.argv);
  const env = await loadBlogAuditEnv({
    appRoot,
    repoRoot,
    whenMissingDatabaseUrlLog: "[blog:audit-published-quality] DATABASE_URL is required.",
  });
  if (!env.databaseUrlSet) process.exit(1);

  const prisma = new PrismaClient();
  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  const reportsDir = path.join(repoRoot, "reports");
  await fs.mkdir(reportsDir, { recursive: true });
  const mdPath = path.join(reportsDir, `blog-audit-published-${ts}.md`);
  const jsonPath = path.join(reportsDir, `blog-audit-published-${ts}.json`);

  try {
    const posts = await prisma.blogPost.findMany({
      where: { postStatus: BlogPostStatus.PUBLISHED },
      orderBy: { publishAt: "desc" },
      take: limit,
      select: {
        id: true,
        slug: true,
        title: true,
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
        publishAt: true,
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
      publishAt: string | null;
      composite: number;
      recommendation: string;
      remediationHints: string[];
    }> = [];

    let sum = 0;
    const recHistogram = new Map<string, number>();

    for (const p of posts) {
      const g = scoreRow(p);
      sum += g.compositeScore;
      recHistogram.set(g.publishRecommendation, (recHistogram.get(g.publishRecommendation) ?? 0) + 1);
      rows.push({
        id: p.id,
        slug: p.slug,
        title: p.title,
        publishAt: p.publishAt?.toISOString() ?? null,
        composite: g.compositeScore,
        recommendation: g.publishRecommendation,
        remediationHints: g.remediationHints,
      });
    }

    const avg = posts.length ? sum / posts.length : 0;
    const weak = [...rows].filter((r) => r.composite < 55 || r.recommendation !== "publish").sort((a, b) => a.composite - b.composite);

    const md = [
      "# Blog governance audit — published",
      "",
      `- **When:** ${new Date().toISOString()}`,
      `- **Rows scanned:** ${posts.length} (limit ${limit})`,
      `- **Mean composite score:** ${avg.toFixed(1)}`,
      "",
      "## Recommendation histogram",
      "",
      [...recHistogram.entries()].map(([k, v]) => `- **${k}:** ${v}`).join("\n"),
      "",
      "## Weak / review candidates (lowest scores first, cap 100)",
      "",
      "| Composite | Rec | Slug | Title |",
      "| ---: | --- | --- | --- |",
      ...weak.slice(0, 100).map(
        (r) =>
          `| ${r.composite} | ${r.recommendation} | \`${r.slug.replace(/`/g, "'")}\` | ${r.title.replace(/\|/g, "\\|").slice(0, 60)} |`,
      ),
      "",
      "_Read-only: no URLs, slugs, or SEO fields were modified._",
      "",
    ].join("\n");

    await fs.writeFile(mdPath, md, "utf8");
    await fs.writeFile(jsonPath, JSON.stringify({ avgComposite: avg, recommendationHistogram: Object.fromEntries(recHistogram), rows }, null, 2), "utf8");
    console.info(`[blog:audit-published-quality] Wrote ${mdPath}`);
    console.info(`[blog:audit-published-quality] Wrote ${jsonPath}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
