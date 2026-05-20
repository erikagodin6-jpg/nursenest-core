#!/usr/bin/env npx tsx
/**
 * Safe visibility recovery: set `workflowStatus` → PUBLISHED (and `publishAt` when null) for complete
 * `BlogPost` rows only. Never touches `body` or other content fields.
 *
 * From repo root: `node scripts/recover-blog-visibility.mjs`
 * Apply: `node scripts/recover-blog-visibility.mjs --apply --limit 50`
 */
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadEnv } from "dotenv";
import { BlogPostStatus, BlogWorkflowStatus, type Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import {
  classifyRecoverBlogVisibilityRow,
  RECOVER_BLOG_VISIBILITY_SOURCE_WORKFLOWS,
  type RecoverBlogVisibilitySkipReason,
} from "@/lib/blog/recover-blog-visibility";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = join(__dirname, "..");

type Cli = { apply: boolean; limit: number };

function parseCli(argv: string[]): Cli {
  const out: Cli = { apply: false, limit: 5_000 };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === "--apply") out.apply = true;
    else if (a === "--limit") out.limit = Math.max(1, Math.min(20_000, Number(argv[++i] ?? "5000")));
  }
  return out;
}

async function main() {
  loadEnv({ path: join(PKG_ROOT, ".env") });
  const cli = parseCli(process.argv.slice(2));

  if (!isDatabaseUrlConfigured()) {
    console.error("[recover-blog-visibility] DATABASE_URL not configured — exiting.");
    process.exit(1);
  }

  const now = new Date();

  const slugCounts = await prisma.blogPost.groupBy({
    by: ["slug"],
    _count: { slug: true },
    where: { slug: { not: "" } },
  });
  const dupSlugs = new Set(
    slugCounts.filter((r) => (r._count?.slug ?? 0) > 1).map((r) => r.slug),
  );

  const where: Prisma.BlogPostWhereInput = {
    postStatus: { in: [BlogPostStatus.PUBLISHED, BlogPostStatus.APPROVED] },
    workflowStatus: { in: [...RECOVER_BLOG_VISIBILITY_SOURCE_WORKFLOWS] },
    slug: { not: "" },
    body: { not: "" },
  };

  const rows = await prisma.blogPost.findMany({
    where,
    select: {
      id: true,
      slug: true,
      title: true,
      body: true,
      postStatus: true,
      workflowStatus: true,
      publishAt: true,
      scheduledAt: true,
    },
    orderBy: { updatedAt: "desc" },
    take: cli.limit,
  });

  const recoverable: typeof rows = [];
  const skipped: { slug: string; reason: RecoverBlogVisibilitySkipReason }[] = [];

  for (const row of rows) {
    const dup = dupSlugs.has(row.slug);
    const gate = classifyRecoverBlogVisibilityRow({
      postStatus: row.postStatus,
      workflowStatus: row.workflowStatus,
      slug: row.slug,
      body: row.body,
      duplicateSlug: dup,
    });
    if (!gate.ok) {
      skipped.push({ slug: row.slug, reason: gate.reason });
      continue;
    }
    recoverable.push(row);
  }

  console.log("\n=== recover-blog-visibility ===\n");
  console.log(`Total candidates (DB pre-filter): ${rows.length}`);
  console.log(`Recoverable: ${recoverable.length}`);
  console.log(`Skipped: ${skipped.length}`);

  const byReason = new Map<RecoverBlogVisibilitySkipReason, number>();
  for (const s of skipped) {
    byReason.set(s.reason, (byReason.get(s.reason) ?? 0) + 1);
  }
  if (skipped.length > 0) {
    console.log("\nSkipped by reason:");
    for (const [reason, n] of [...byReason.entries()].sort((a, b) => b[1] - a[1])) {
      console.log(`  ${reason}: ${n}`);
    }
    const sample = skipped.slice(0, 25);
    if (sample.length > 0) {
      console.log("\nSample skipped (up to 25):");
      for (const s of sample) {
        console.log(`  - ${s.slug} (${s.reason})`);
      }
    }
  }

  if (!cli.apply) {
    console.log(
      "\nDry-run only — no DB writes. Re-run with --apply to update workflowStatus → PUBLISHED and publishAt when null.",
    );
    if (recoverable.length > 0) {
      console.log("\nWould recover (sample up to 15):");
      for (const r of recoverable.slice(0, 15)) {
        console.log(`  - ${r.slug} (${r.postStatus}, workflow=${r.workflowStatus}, publishAt=${r.publishAt?.toISOString() ?? "null"})`);
      }
    }
    process.exit(0);
  }

  let applied = 0;
  for (const row of recoverable) {
    const dup = dupSlugs.has(row.slug);
    const gate = classifyRecoverBlogVisibilityRow({
      postStatus: row.postStatus,
      workflowStatus: row.workflowStatus,
      slug: row.slug,
      body: row.body,
      duplicateSlug: dup,
    });
    if (!gate.ok) continue;

    const publishAtNext = row.publishAt ?? now;

    await prisma.blogPost.update({
      where: { id: row.id },
      data: {
        workflowStatus: BlogWorkflowStatus.PUBLISHED,
        publishAt: publishAtNext,
      },
    });

    const oldStatus = `${row.postStatus}:${row.workflowStatus ?? ""}`;
    const newStatus = `${row.postStatus}:${BlogWorkflowStatus.PUBLISHED}`;
    safeServerLog("blog", "[BLOG_RECOVERY_APPLY]", {
      slug: row.slug,
      oldStatus,
      newStatus,
    });

    applied += 1;
  }

  console.log(`\nApply complete: ${applied} rows updated (workflow + publishAt only).`);
  console.log("Verify: /blog index, /blog/[slug], and merged blog sitemap rows in staging/production.");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
