#!/usr/bin/env npx tsx
/**
 * Lists live `BlogPost` slugs that overlap the hybrid supplement union (bundled static + long-tail).
 * DB wins at merge time; this script is for inventory / release checks.
 *
 * Usage (from `nursenest-core/`):
 *   npx tsx scripts/blog/diagnose-blog-slug-collisions.mts
 *   npx tsx scripts/blog/diagnose-blog-slug-collisions.mts --write-report
 *
 * Writes `docs/reports/blog-slug-collision-diagnostic.txt` when `--write-report` is set.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import "../../src/lib/db/script-env-bootstrap";
import {
  allSupplementSlugsForOverlapQuery,
  resolveSupplementPublishedSlug,
} from "@/lib/blog/blog-static-supplement";
import { blogLiveWhere } from "@/lib/blog/blog-visibility";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";

const __dirname = dirname(fileURLToPath(import.meta.url));
const appRoot = join(__dirname, "..", "..");
const REPORT_REL = join("docs", "reports", "blog-slug-collision-diagnostic.txt");

const CHUNK = 400;

async function main(): Promise<void> {
  const writeReport = process.argv.includes("--write-report");
  const supplement = allSupplementSlugsForOverlapQuery();
  const lines: string[] = [];
  const stamp = new Date().toISOString();
  lines.push(`blog slug collision diagnostic (live DB ∩ supplement union)`);
  lines.push(`generated: ${stamp}`);
  lines.push(`supplement slug count: ${supplement.length}`);
  lines.push("");

  if (!isDatabaseUrlConfigured()) {
    lines.push("DATABASE_URL not configured — skipping DB overlap query.");
    console.log(lines.join("\n"));
    if (writeReport) {
      mkdirSync(join(appRoot, "docs", "reports"), { recursive: true });
      writeFileSync(join(appRoot, REPORT_REL), lines.join("\n"), "utf8");
      console.log(`Wrote ${REPORT_REL}`);
    }
    process.exit(0);
    return;
  }

  const now = new Date();
  const hits: { slug: string; postStatus: string }[] = [];
  for (let i = 0; i < supplement.length; i += CHUNK) {
    const chunk = supplement.slice(i, i + CHUNK);
    const page = await prisma.blogPost.findMany({
      where: { AND: [{ slug: { in: chunk } }, blogLiveWhere(now)] },
      select: { slug: true, postStatus: true },
      take: CHUNK,
    });
    hits.push(...page);
  }

  lines.push(`live DB rows overlapping supplement slugs: ${hits.length}`);
  if (hits.length) {
    lines.push("");
    for (const h of hits.slice(0, 500)) {
      const origin = resolveSupplementPublishedSlug(h.slug);
      lines.push(`- ${h.slug} (${h.postStatus}) supplement=${origin ?? "n/a"}`);
    }
    if (hits.length > 500) lines.push(`… ${hits.length - 500} more omitted`);
  }

  const out = lines.join("\n");
  console.log(out);
  if (writeReport) {
    mkdirSync(join(appRoot, "docs", "reports"), { recursive: true });
    writeFileSync(join(appRoot, REPORT_REL), out, "utf8");
    console.log(`Wrote ${REPORT_REL}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
