#!/usr/bin/env npx tsx
/**
 * Staging/local harness: same persistence path as admin UI — `BlogArticleGenerationJob` + `tickBlogArticleGenerationJob`
 * (see POST `/api/admin/blog/control-panel/generate` + POST `.../article-jobs/[id]/tick`).
 *
 * Prerequisites (process env, same as admin AI gate + Prisma):
 * - `DATABASE_URL` (and usually `DIRECT_URL` for migrations/pool)
 * - `AI_ADMIN_GENERATION_ENABLED=true` (or `1` / `yes` / `on`)
 * - `BLOG_AI_PROVIDER=openai` with `AI_INTEGRATIONS_OPENAI_API_KEY` or `OPENAI_API_KEY`, **or**
 *   `OPENROUTER_API_KEY` when routing selects OpenRouter (`BLOG_AI_PROVIDER` / `AI_PROVIDER` per `blog-ai-routing.ts`)
 *
 * Optional: `NN_ENV_VALIDATION_MODE=warn` for local runs when validating ancillary env (prefer fixing real vars).
 *
 * @example Dry-run (env + duplicate intent check only)
 *   NODE_ENV=test npx tsx scripts/blog/admin-control-panel-generator-harness.mts --dry-run
 *
 * @example Generate + tick (long-running; requires funded AI)
 *   NODE_ENV=development npx tsx scripts/blog/admin-control-panel-generator-harness.mts
 */
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadEnv } from "dotenv";
import { BlogPostIntent, BlogPostTemplate, BlogFunnelStage } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { loadBlogAuditEnv } from "@/lib/db/blog-audit-env-load";
import {
  createBlogArticleGenerationJob,
  tickBlogArticleGenerationJob,
} from "@/lib/blog/blog-article-generation-job";
import {
  findDuplicateAdminBlogIntent,
  prepareAdminBlogGenerationInput,
} from "@/lib/blog/admin-blog-generation-service";
import { blogPostIsLive } from "@/lib/blog/blog-visibility";
import { getAdminAiGenerationGate } from "@/lib/ai/admin-ai-policy";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = join(__dirname, "..", "..");

type Cli = { dryRun: boolean };

function parseCli(argv: string[]): Cli {
  return { dryRun: argv.includes("--dry-run") };
}

const DEFAULT_TOPIC = "Why potassium changes are dangerous in acute kidney injury nursing exams";
const DEFAULT_EXAM = "NCLEX-RN";
const DEFAULT_SLUG = "why-potassium-changes-are-dangerous-in-acute-kidney-injury-nursing-exams";

async function main(): Promise<void> {
  const cli = parseCli(process.argv.slice(2));
  loadEnv({ path: join(PKG_ROOT, ".env.local"), override: false, quiet: true });
  loadEnv({ path: join(PKG_ROOT, ".env"), override: false, quiet: true });
  await loadBlogAuditEnv({ appRoot: PKG_ROOT, repoRoot: join(PKG_ROOT, "..") });

  if (!isDatabaseUrlConfigured()) {
    console.error("[admin-control-panel-harness] DATABASE_URL is not set. Load .env or export DATABASE_URL.");
    process.exit(2);
  }

  const prepared = await prepareAdminBlogGenerationInput({
    rawTitle: DEFAULT_TOPIC,
    exam: DEFAULT_EXAM,
    targetKeyword: undefined,
    fixedSlug: DEFAULT_SLUG,
    publishMode: "publish_now",
  });

  const dup = await findDuplicateAdminBlogIntent({ exam: DEFAULT_EXAM, normalizedTopic: prepared.normalizedTopic });
  if (dup) {
    console.log("[admin-control-panel-harness] Duplicate topic intent; existing slug:", dup.slug);
    const row = await prisma.blogPost.findUnique({
      where: { slug: dup.slug },
      select: {
        id: true,
        slug: true,
        title: true,
        postStatus: true,
        workflowStatus: true,
        publishAt: true,
        scheduledAt: true,
      },
    });
    if (row) {
      const live = blogPostIsLive(row, new Date());
      console.log("[admin-control-panel-harness] Existing row live?", live, row);
    }
    process.exit(0);
  }

  if (cli.dryRun) {
    console.log("[admin-control-panel-harness] --dry-run: no job created. Prepared slug:", prepared.uniqueSlug);
    process.exit(0);
  }

  let gatePrint: { runnable: boolean; summaryLine: string; mode: string };
  try {
    const gate = getAdminAiGenerationGate({ pipeline: "blog" });
    gatePrint = { runnable: gate.runnable, summaryLine: gate.summaryLine, mode: gate.mode };
    console.log("[admin-control-panel-harness] AI gate:", gatePrint);
  } catch (e) {
    console.error(
      "[admin-control-panel-harness] AI gate / env validation failed:",
      e instanceof Error ? e.message : e,
    );
    process.exit(2);
  }

  if (!gatePrint.runnable) {
    console.error("[admin-control-panel-harness] AI generation is not runnable; aborting.");
    process.exit(2);
  }

  const input = {
    topic: prepared.topic,
    exam: DEFAULT_EXAM,
    country: "US" as const,
    keywords: undefined,
    targetKeyword: prepared.targetKeyword,
    keywordCluster: undefined,
    template: BlogPostTemplate.DISEASE_PROCESS_EXPLAINER,
    intent: BlogPostIntent.EXAM_PREP,
    funnelStage: BlogFunnelStage.CONSIDERATION,
    tone: "professional" as const,
    includeImage: true,
    includeAiImage: false,
    fixedSlug: prepared.uniqueSlug,
    allowInsufficientCitations: false,
    publishImmediately: true,
  };

  const job = await createBlogArticleGenerationJob({ createdById: null, input });
  console.log("[admin-control-panel-harness] job queued:", job.id);

  const tick = await tickBlogArticleGenerationJob(job.id);
  console.log("[admin-control-panel-harness] tick result:", tick);

  const updated = await prisma.blogArticleGenerationJob.findUnique({ where: { id: job.id } });
  if (!updated?.blogPostId) {
    console.error("[admin-control-panel-harness] No blogPostId on job; lastError:", updated?.lastError);
    process.exit(1);
  }

  const post = await prisma.blogPost.findUnique({
    where: { id: updated.blogPostId },
    select: {
      id: true,
      slug: true,
      title: true,
      postStatus: true,
      workflowStatus: true,
      publishAt: true,
      scheduledAt: true,
    },
  });
  if (!post) {
    console.error("[admin-control-panel-harness] Post row missing");
    process.exit(1);
  }
  const live = blogPostIsLive(post, new Date());
  console.log("[admin-control-panel-harness] post:", post, "blogPostIsLive:", live);
  if (!live) {
    console.error("[admin-control-panel-harness] Post is not live per blogPostIsLive (see blog-visibility.ts).");
    process.exit(1);
  }
  console.log("[admin-control-panel-harness] OK public URL path: /blog/" + post.slug);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
