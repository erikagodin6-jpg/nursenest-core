#!/usr/bin/env npx tsx
/**
 * Legacy-compatible blog generation CLI (relaxed topic gate + one editorial-plan schema retry).
 *
 * Usage:
 *   npm run generate:blogs:legacy-compatible -- --dry-run --topic="care coordination in hospitals"
 *   npm run generate:blogs:legacy-compatible -- --apply --topic="..." --exam=NCLEX-RN --country=CA
 *
 * Env:
 *   BLOG_LEGACY_TOPICS — comma-separated topics (used when no --topic= passed)
 *
 * Requires DATABASE_URL and funded AI provider credentials (same as admin blog generation).
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { BlogFunnelStage, BlogPostIntent, BlogPostTemplate } from "@prisma/client";
import { runBlogArticleGenerationPipeline } from "../../src/lib/blog/blog-article-generation-pipeline";
import { loadBlogAuditEnv } from "../../src/lib/db/blog-audit-env-load";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(__dirname, "..", "..");
const repoRoot = path.resolve(appRoot, "..");
const reportPath = path.join(repoRoot, "reports", "blog-legacy-compatible-run.md");

type CliArgs = {
  apply: boolean;
  topics: string[];
  exam: string;
  country: "US" | "CA" | "unspecified";
};

function parseArgs(argv: string[]): CliArgs {
  let apply = false;
  const topics: string[] = [];
  let exam = "NCLEX-RN";
  let country: "US" | "CA" | "unspecified" = "unspecified";

  for (const a of argv.slice(2)) {
    if (a === "--apply") apply = true;
    if (a === "--dry-run") apply = false;
    if (a.startsWith("--topic=")) {
      const t = a.slice("--topic=".length).trim();
      if (t) topics.push(t);
    }
    if (a.startsWith("--exam=")) exam = a.slice("--exam=".length).trim() || exam;
    if (a.startsWith("--country=")) {
      const c = a.slice("--country=".length).trim().toUpperCase();
      if (c === "US") country = "US";
      else if (c === "CA") country = "CA";
    }
  }

  if (topics.length === 0) {
    const envTopics = process.env.BLOG_LEGACY_TOPICS?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];
    if (envTopics.length > 0) topics.push(...envTopics);
    else topics.push("care coordination in hospitals");
  }

  return { apply, topics, exam, country };
}

function mdReport(
  args: CliArgs,
  rows: Array<{ topic: string; ok: boolean; error?: string; slug?: string; postId?: string }>,
): string {
  const lines = [
    "# Blog legacy-compatible generation run",
    "",
    `- **When:** ${new Date().toISOString()}`,
    `- **Mode:** ${args.apply ? "apply (persist drafts)" : "dry-run (no DB writes)"}`,
    `- **Exam:** ${args.exam}`,
    `- **Country:** ${args.country}`,
    "",
    "| Topic | OK | Slug / id | Error |",
    "| --- | --- | --- | --- |",
  ];
  for (const r of rows) {
    lines.push(
      `| ${r.topic.replace(/\|/g, "\\|").slice(0, 80)} | ${r.ok ? "yes" : "no"} | ${(r.slug ?? r.postId ?? "").replace(/\|/g, "\\|")} | ${(r.error ?? "").replace(/\|/g, "\\|").slice(0, 200)} |`,
    );
  }
  return `${lines.join("\n")}\n`;
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv);
  const env = await loadBlogAuditEnv({
    appRoot,
    repoRoot,
    whenMissingDatabaseUrlLog: "[generate:blogs:legacy-compatible] DATABASE_URL is required.",
  });
  if (!env.databaseUrlSet) process.exit(1);

  const rows: Array<{ topic: string; ok: boolean; error?: string; slug?: string; postId?: string }> = [];

  for (const topic of args.topics) {
    try {
      const res = await runBlogArticleGenerationPipeline(
        {
          topic,
          exam: args.exam,
          country: args.country,
          template: BlogPostTemplate.TOPIC_EXPLAINED,
          intent: BlogPostIntent.EXAM_PREP,
          funnelStage: BlogFunnelStage.CONSIDERATION,
          tone: "professional",
          includeImage: false,
          includeAiImage: false,
          targetKeyword: topic,
          allowInsufficientCitations: true,
        },
        {
          persist: args.apply,
          legacyCompatible: true,
          idempotencyKey: `legacy-cli:${Date.now()}:${topic.slice(0, 40)}`,
        },
      );

      if (!res.ok) {
        rows.push({ topic, ok: false, error: res.error });
        continue;
      }
      const slug = res.persist && !res.persist.skipped ? res.persist.post.slug : undefined;
      const postId = res.persist && !res.persist.skipped ? res.persist.post.id : undefined;
      rows.push({ topic, ok: true, slug, postId });
    } catch (e) {
      rows.push({ topic, ok: false, error: e instanceof Error ? e.message : String(e) });
    }
  }

  await fs.mkdir(path.dirname(reportPath), { recursive: true });
  await fs.writeFile(reportPath, mdReport(args, rows), "utf8");
  console.info(`[generate:blogs:legacy-compatible] Wrote ${reportPath}`);
  for (const r of rows) {
    console.info(r.ok ? `[ok] ${r.topic} → ${r.slug ?? r.postId ?? "dry-run"}` : `[fail] ${r.topic}: ${r.error}`);
  }
  if (rows.some((r) => !r.ok)) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
