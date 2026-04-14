#!/usr/bin/env npx tsx
/**
 * Legacy-style blog generator CLI: batched calls to `generateBlogPost` (current AI pipeline)
 * with a **fixed section intent** (intro → clinical sections → board-style question → rationale → summary)
 * expressed via template + metadata. Does not remove or replace other generators.
 *
 * Usage (from `nursenest-core/`):
 *   npx tsx scripts/blog/legacy-generator.ts --file topics.txt --exam rn --batch 20
 *   npx tsx scripts/blog/legacy-generator.ts --file topics.txt --dry-run
 *
 * Requires OpenAI (and DB) per `generateBlogAiDraft` policy.
 */
import "../../src/lib/db/env-bootstrap";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { BlogPostTemplate, BlogPostIntent, BlogFunnelStage } from "@prisma/client";
import { generateBlogPost } from "../../src/lib/blog/generate-blog-ai-draft";
import { isDatabaseUrlConfigured } from "../../src/lib/db/safe-database";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Documented legacy article spine (mirrors NurseNest SEO / NCLEX blog shape).
 * Passed into the AI topic line so generated HTML follows the same structure as manifest imports.
 */
export const LEGACY_BLOG_SECTION_SPINE =
  "Intro → clinical explanation → nursing interventions → NCLEX tips → practice question with rationale → summary (with internal links to lessons and tools where relevant).";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseTopicsFile(filePath: string): string[] {
  const raw = fs.readFileSync(filePath, "utf8");
  return raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length >= 3);
}

function parseArgs(): {
  file: string | null;
  exam: string;
  batch: number;
  delayMs: number;
  dryRun: boolean;
  publishAt: Date | undefined;
  template: BlogPostTemplate;
  intent: BlogPostIntent | undefined;
} {
  const dryRun = process.argv.includes("--dry-run");
  let file: string | null = null;
  const fArg = process.argv.find((a) => a.startsWith("--file="));
  if (fArg) file = path.resolve(fArg.split("=", 2)[1]!.trim());

  let exam = "RN";
  const eArg = process.argv.find((a) => a.startsWith("--exam="));
  if (eArg) exam = eArg.split("=", 2)[1]!.trim();

  let batch = 20;
  const bArg = process.argv.find((a) => a.startsWith("--batch="));
  if (bArg) {
    const n = Number(bArg.split("=", 2)[1]);
    if (Number.isFinite(n) && n >= 1 && n <= 25) batch = Math.floor(n);
  }

  let delayMs = 0;
  const dArg = process.argv.find((a) => a.startsWith("--delay-ms="));
  if (dArg) {
    const n = Number(dArg.split("=", 2)[1]);
    if (Number.isFinite(n) && n >= 0) delayMs = Math.floor(n);
  }

  let publishAt: Date | undefined;
  const pArg = process.argv.find((a) => a.startsWith("--publish-at="));
  if (pArg) {
    const d = new Date(pArg.split("=", 2)[1]!.trim());
    if (Number.isFinite(d.getTime())) publishAt = d;
  }

  return {
    file,
    exam,
    batch,
    delayMs,
    dryRun,
    publishAt,
    template: BlogPostTemplate.TOPIC_EXPLAINED,
    intent: BlogPostIntent.EXAM_PREP,
  };
}

async function main(): Promise<void> {
  const opts = parseArgs();
  if (!opts.file || !fs.existsSync(opts.file)) {
    console.error("Provide an existing topics file: --file=path/to/topics.txt (one topic per line)");
    process.exit(1);
  }
  if (!isDatabaseUrlConfigured()) {
    console.error("DATABASE_URL not configured; cannot generate drafts.");
    process.exit(1);
  }

  const allTopics = parseTopicsFile(opts.file);
  const results: Array<{ topic: string; ok: boolean; detail?: string }> = [];

  for (let i = 0; i < allTopics.length; i += opts.batch) {
    const slice = allTopics.slice(i, i + opts.batch);
    console.log(
      JSON.stringify({ event: "legacy_generator_batch", batchIndex: i / opts.batch, topicsInBatch: slice.length }, null, 2),
    );

    for (const topic of slice) {
      const enrichedTopic = `${topic}\n\n[Structure: ${LEGACY_BLOG_SECTION_SPINE}]`;

      if (opts.dryRun) {
        results.push({ topic, ok: true, detail: "dry-run" });
        continue;
      }

      try {
        const out = await generateBlogPost({
          topic: enrichedTopic,
          exam: opts.exam,
          template: opts.template,
          intent: opts.intent,
          funnelStage: BlogFunnelStage.AWARENESS,
          publishAt: opts.publishAt,
          country: "US",
        });
        if (!out.ok) {
          results.push({ topic, ok: false, detail: out.error });
        } else if (out.skipped) {
          results.push({ topic, ok: true, detail: `skipped:${out.reason}` });
        } else {
          results.push({ topic, ok: true, detail: out.post.slug });
        }
      } catch (e) {
        results.push({ topic, ok: false, detail: e instanceof Error ? e.message : String(e) });
      }

      if (opts.delayMs > 0) await sleep(opts.delayMs);
    }
  }

  const ok = results.filter((r) => r.ok).length;
  console.log(JSON.stringify({ event: "legacy_generator_done", total: results.length, ok, results }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
