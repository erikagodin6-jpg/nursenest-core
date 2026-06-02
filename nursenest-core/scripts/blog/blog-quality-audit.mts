#!/usr/bin/env npx tsx
/**
 * Read-only by default. Scans live BlogPost rows for generated filler, repeated
 * sections, generic FAQs, and irrelevant references. With --apply, moves flagged
 * rows to NEEDS_REVIEW without deleting content.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { BlogPostStatus, BlogWorkflowStatus, PrismaClient, type Prisma } from "@prisma/client";
import { loadBlogAuditEnv } from "../../src/lib/db/blog-audit-env-load";
import { appendBlogAdminPublishLog } from "../../src/lib/blog/blog-admin-publish-log";
import { validateBlogPublishQuality } from "../../src/lib/blog/blog-publish-quality-validator";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(__dirname, "..", "..");
const repoRoot = path.resolve(appRoot, "..");
const reportsDir = path.join(repoRoot, "reports");
const jsonReportPath = path.join(reportsDir, "blog-quality-audit.json");
const mdReportPath = path.join(reportsDir, "blog-quality-audit.md");

type Args = {
  apply: boolean;
  limit: number;
};

type AuditRow = {
  id: string;
  slug: string;
  title: string;
  postStatus: string;
  workflowStatus: string;
  publishAt: string | null;
  issueCount: number;
  blockingIssueCount: number;
  issues: { id: string; severity: string; message: string }[];
  action: "none" | "would_quarantine" | "quarantined";
};

function parseArgs(argv: string[]): Args {
  let apply = false;
  let limit = 5000;
  for (const arg of argv.slice(2)) {
    if (arg === "--apply") apply = true;
    const m = arg.match(/^--limit=(\d+)$/);
    if (m) limit = Math.max(1, Math.min(20000, Number.parseInt(m[1]!, 10)));
  }
  return { apply, limit };
}

function markdownReport(rows: AuditRow[], args: Args): string {
  const flagged = rows.filter((r) => r.blockingIssueCount > 0);
  const lines = [
    "# Blog Quality Audit",
    "",
    `Generated at: ${new Date().toISOString()}`,
    `Mode: ${args.apply ? "apply" : "dry-run"}`,
    `Scanned published rows: ${rows.length}`,
    `Flagged rows: ${flagged.length}`,
    "",
    "| Slug | Title | Blocking issues | Action | First issue |",
    "| --- | --- | ---: | --- | --- |",
  ];
  for (const row of flagged.slice(0, 250)) {
    const first = row.issues.find((i) => i.severity === "block") ?? row.issues[0];
    lines.push(
      `| \`${row.slug}\` | ${row.title.replace(/\|/g, "\\|").slice(0, 90)} | ${row.blockingIssueCount} | ${row.action} | ${(first?.message ?? "").replace(/\|/g, "\\|").slice(0, 140)} |`,
    );
  }
  if (flagged.length > 250) lines.push(`| ... | ${flagged.length - 250} additional flagged rows omitted from markdown table |  |  |  |`);
  lines.push("", "No posts are deleted by this script. `--apply` moves flagged rows to `NEEDS_REVIEW`.");
  return `${lines.join("\n")}\n`;
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv);
  const env = await loadBlogAuditEnv({
    appRoot,
    repoRoot,
    whenMissingDatabaseUrlLog: "[blog:quality:audit] DATABASE_URL is required to scan BlogPost rows.",
  });
  if (!env.databaseUrlSet) process.exit(1);

  const prisma = new PrismaClient();
  try {
    const posts = await prisma.blogPost.findMany({
      where: { postStatus: BlogPostStatus.PUBLISHED },
      orderBy: { publishAt: "desc" },
      take: args.limit,
      select: {
        id: true,
        slug: true,
        title: true,
        body: true,
        category: true,
        tags: true,
        targetKeyword: true,
        faqBlock: true,
        apaReferences: true,
        sourcesJson: true,
        adminPublishLog: true,
        postStatus: true,
        workflowStatus: true,
        publishAt: true,
      },
    });

    const rows: AuditRow[] = [];
    for (const post of posts) {
      const quality = validateBlogPublishQuality({
        title: post.title,
        body: post.body,
        targetKeyword: post.targetKeyword,
        category: post.category,
        tags: post.tags,
        faqBlock: post.faqBlock,
        apaReferences: post.apaReferences,
        sourcesJson: post.sourcesJson,
      });
      const shouldQuarantine = quality.blocking.length > 0;
      let action: AuditRow["action"] = shouldQuarantine ? "would_quarantine" : "none";

      if (shouldQuarantine && args.apply) {
        const nextLog = appendBlogAdminPublishLog(post.adminPublishLog, {
          level: "warn",
          event: "blog_quality_quarantine",
          message: "Blog quality audit moved this post out of published state for editorial review.",
          detail: {
            issueIds: quality.blocking.map((i) => i.id).slice(0, 20),
            report: "reports/blog-quality-audit.json",
          },
        });
        await prisma.blogPost.update({
          where: { id: post.id },
          data: {
            postStatus: BlogPostStatus.NEEDS_REVIEW,
            workflowStatus: BlogWorkflowStatus.NEEDS_SEO_REVIEW,
            adminPublishLog: nextLog as Prisma.InputJsonValue,
          },
        });
        action = "quarantined";
      }

      rows.push({
        id: post.id,
        slug: post.slug,
        title: post.title,
        postStatus: post.postStatus,
        workflowStatus: post.workflowStatus,
        publishAt: post.publishAt?.toISOString() ?? null,
        issueCount: quality.issues.length,
        blockingIssueCount: quality.blocking.length,
        issues: quality.issues.map((i) => ({ id: i.id, severity: i.severity, message: i.message })),
        action,
      });
    }

    await fs.mkdir(reportsDir, { recursive: true });
    await fs.writeFile(
      jsonReportPath,
      `${JSON.stringify({ generatedAt: new Date().toISOString(), mode: args.apply ? "apply" : "dry-run", rows }, null, 2)}\n`,
    );
    await fs.writeFile(mdReportPath, markdownReport(rows, args));

    const flagged = rows.filter((r) => r.blockingIssueCount > 0).length;
    console.log(
      `[blog:quality:audit] scanned=${rows.length} flagged=${flagged} mode=${args.apply ? "apply" : "dry-run"}`,
    );
    console.log(`[blog:quality:audit] wrote ${path.relative(repoRoot, mdReportPath)}`);
    console.log(`[blog:quality:audit] wrote ${path.relative(repoRoot, jsonReportPath)}`);
  } finally {
    await prisma.$disconnect().catch(() => undefined);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
