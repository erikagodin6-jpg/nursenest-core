/**
 * Recover missed blog publishes in controlled batches (default 5 per run).
 *
 * Targets:
 * - Overdue SCHEDULED / DRAFT / APPROVED rows (publishAt or scheduledAt <= now, still not PUBLISHED)
 * - FAILED rows with substantial HTML body (>= 200 chars), conservative pipeline recovery
 *
 * For each recovered row: `publishAt` is set to **now**; `scheduledAt` is left unchanged.
 * No inserts — only `updateMany` on existing ids — so slug uniqueness prevents duplicates.
 *
 * Run:
 *   npx tsx scripts/recover-missed-blog-posts.ts --dry-run
 *   npx tsx scripts/recover-missed-blog-posts.ts --batches=3 --delay-ms=5000
 *
 * After each batch in production, trigger cache refresh (same paths as cron blog publish), e.g.:
 *   curl -sS -X POST -H "Authorization: Bearer $CRON_SECRET" "$APP_URL/api/cron/blog-publish"
 *
 * Or use admin ops (requires session cookie / admin auth from browser):
 *   POST /api/admin/ops/run  { "action": "recover_missed_blog_posts_batch", "batchSize": 5 }
 */

import "../src/lib/db/env-bootstrap";
import { setTimeout as delay } from "node:timers/promises";
import { prisma } from "../src/lib/db";
import { countMissedBlogPostBacklog, recoverMissedBlogPostsBatch } from "../src/lib/blog/blog-recover-missed-posts";

function parseArgs(argv: string[]) {
  let dryRun = false;
  let batches = 1;
  let batchSize = 5;
  let delayMs = 0;
  for (const a of argv) {
    if (a === "--dry-run") dryRun = true;
    if (a.startsWith("--batches=")) batches = Math.max(1, Math.min(500, Number(a.split("=")[1]) || 1));
    if (a.startsWith("--batch-size=")) batchSize = Math.max(1, Math.min(50, Number(a.split("=")[1]) || 5));
    if (a.startsWith("--delay-ms=")) delayMs = Math.max(0, Math.min(600_000, Number(a.split("=")[1]) || 0));
  }
  return { dryRun, batches, batchSize, delayMs };
}

async function main() {
  const { dryRun, batches, batchSize, delayMs } = parseArgs(process.argv.slice(2));
  const backlogStart = await countMissedBlogPostBacklog();
  if (dryRun) {
    // eslint-disable-next-line no-console
    console.log(JSON.stringify({ ok: true, dryRun: true, backlog: backlogStart }, null, 2));
    return;
  }

  let totalRecovered = 0;
  const allSlugs: string[] = [];
  let backlog = backlogStart;

  for (let i = 0; i < batches; i++) {
    if (backlog <= 0) break;
    const { recovered, slugs, backlogAfter } = await recoverMissedBlogPostsBatch(new Date(), batchSize);
    totalRecovered += recovered;
    allSlugs.push(...slugs);
    backlog = backlogAfter;
    // eslint-disable-next-line no-console
    console.log(
      JSON.stringify({ batch: i + 1, recovered, slugs, backlogAfter }, null, 2),
    );
    if (backlog <= 0) break;
    if (i + 1 < batches && delayMs > 0) await delay(delayMs);
  }

  // eslint-disable-next-line no-console
  console.log(
    JSON.stringify(
      {
        ok: true,
        totalRecovered,
        backlogStart,
        backlogEnd: backlog,
        slugs: allSlugs,
        hint: "Revalidate Next surfaces via POST /api/cron/blog-publish (Bearer CRON_SECRET) or deploy admin ops recover_missed_blog_posts_batch from the app.",
      },
      null,
      2,
    ),
  );
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
