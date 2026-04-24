#!/usr/bin/env npx tsx
/**
 * Writes `data/audit/blog-system-final.json` with DB-backed blog counts and operational flags.
 * Run after imports / scheduler smoke tests.
 *
 *   npx tsx scripts/blog/emit-blog-final-report.ts
 */
import "../../src/lib/db/script-env-bootstrap";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { BlogPostStatus } from "@prisma/client";
import { prisma } from "../../src/lib/db";
import { isDatabaseUrlConfigured } from "../../src/lib/db/safe-database";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
/** Monorepo root (parent of the `nursenest-core` app folder). */
const REPO_ROOT = path.join(__dirname, "..", "..", "..");
const OUT = path.join(REPO_ROOT, "data/audit/blog-system-final.json");

async function main(): Promise<void> {
  const report: Record<string, unknown> = {
    generatedAt: new Date().toISOString(),
    legacyGeneratorRestored: true,
    legacySchedulerScript: "scripts/blog/legacy-scheduler.ts",
    legacyImportScript: "scripts/import-blog.ts",
    databaseConfigured: isDatabaseUrlConfigured(),
  };

  if (!isDatabaseUrlConfigured()) {
    report.postsImportedTotal = null;
    report.note = "DATABASE_URL missing — counts not queried.";
    fs.mkdirSync(path.dirname(OUT), { recursive: true });
    fs.writeFileSync(OUT, JSON.stringify(report, null, 2), "utf8");
    console.log(JSON.stringify({ wrote: OUT, ...report }, null, 2));
    return;
  }

  try {
    const [total, byStatus, withLegacySource] = await Promise.all([
      prisma.blogPost.count(),
      prisma.blogPost.groupBy({ by: ["postStatus"], _count: { _all: true } }),
      prisma.blogPost.count({ where: { legacySource: { not: null } } }),
    ]);

    report.postsImportedTotal = total;
    report.postsByStatus = Object.fromEntries(byStatus.map((r) => [r.postStatus, r._count._all]));
    report.postsWithLegacySource = withLegacySource;
    report.publishedCount = byStatus.find((r) => r.postStatus === BlogPostStatus.PUBLISHED)?._count._all ?? 0;
  } catch (e) {
    report.postsImportedTotal = null;
    const msg = e instanceof Error ? e.message : String(e);
    report.databaseError = msg.split("\n")[0]?.slice(0, 200) ?? msg.slice(0, 200);
    report.note = "DATABASE_URL set but query failed (offline DB or network).";
  }

  report.schedulerStatus = "Use cron POST /api/cron/blog-batch-schedule or scripts/blog/legacy-scheduler.ts";
  report.duplicatesSkipped = "See data/audit/blog-deduplication-report.json from import --dedupe-report";

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(report, null, 2), "utf8");
  console.log(JSON.stringify({ wrote: OUT, postsImportedTotal: report.postsImportedTotal }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
