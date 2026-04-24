#!/usr/bin/env npx tsx
/**
 * Audit legacy blog export vs current `BlogPost` rows (slug, title-hash, duplicates, patho/pharm gaps).
 *
 *   cd nursenest-core && npm run blog:audit-legacy
 *
 * Inputs (first match wins):
 *   LEGACY_CONTENT_EXPORT_PATH or argv[2] — JSON `{ "version": 1, "blogPosts": [...] }`
 *   LEGACY_SITE_BASE_URL — bounded `/blog/{slug}` crawl when no export file is provided
 *
 * Requires DATABASE_URL (e.g. from `.env.local`).
 */
import { readFileSync } from "node:fs";

import { PrismaClient } from "@prisma/client";

import "../../src/lib/db/script-env-bootstrap";
import { collectLegacyBlogPostsFromSite } from "../../src/lib/legacy/legacy-blog-site-collector";
import { parseLegacyBlogPostExportJsonText } from "../../src/lib/legacy/legacy-blog-post-export-types";
import { auditLegacyBlogPosts } from "../../src/lib/legacy/legacy-blog-post-import-pipeline";

const prisma = new PrismaClient();

async function loadExport() {
  const exportPath = process.env.LEGACY_CONTENT_EXPORT_PATH?.trim() || process.argv[2]?.trim();
  const base = process.env.LEGACY_SITE_BASE_URL?.trim();
  if (exportPath) {
    const text = readFileSync(exportPath, "utf8");
    return parseLegacyBlogPostExportJsonText(text);
  }
  if (base) {
    const crawled = await collectLegacyBlogPostsFromSite(base);
    if (crawled) return crawled;
  }
  console.error(
    "[blog:audit-legacy] Provide LEGACY_CONTENT_EXPORT_PATH or argv[2] JSON path, or LEGACY_SITE_BASE_URL for blog crawl.",
  );
  process.exit(2);
  return null as never;
}

async function main() {
  if (!process.env.DATABASE_URL?.trim()) {
    console.error("[blog:audit-legacy] DATABASE_URL is required.");
    process.exit(1);
  }
  const doc = await loadExport();
  const audit = await auditLegacyBlogPosts(prisma, doc);
  console.log(JSON.stringify({ ok: true, audit }, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
