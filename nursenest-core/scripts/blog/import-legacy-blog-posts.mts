#!/usr/bin/env npx tsx
/**
 * Merge legacy blog JSON into `BlogPost` (match by slug, then title hash; no deletes; dry-run default).
 *
 *   cd nursenest-core && npm run blog:import-legacy
 *
 * Inputs: same as `blog:audit-legacy` (LEGACY_CONTENT_EXPORT_PATH | argv[2] | LEGACY_SITE_BASE_URL crawl).
 *
 * Safety:
 *   Dry-run by default (no writes). Set APPLY_LEGACY_CONTENT_IMPORT=1 to persist.
 *   Writes require DATABASE_URL; import refuses APPLY mode without it.
 *   Body is not replaced on rich/lengthy existing HTML unless LEGACY_IMPORT_OVERWRITE_BODY=1.
 */
import { readFileSync } from "node:fs";

import { PrismaClient } from "@prisma/client";

import "../../src/lib/db/script-env-bootstrap";
import { collectLegacyBlogPostsFromSite } from "../../src/lib/legacy/legacy-blog-site-collector";
import { parseLegacyBlogPostExportJsonText } from "../../src/lib/legacy/legacy-blog-post-export-types";
import { importLegacyBlogPosts } from "../../src/lib/legacy/legacy-blog-post-import-pipeline";

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
    "[blog:import-legacy] Provide LEGACY_CONTENT_EXPORT_PATH or argv[2] JSON path, or LEGACY_SITE_BASE_URL for blog crawl.",
  );
  process.exit(2);
  return null as never;
}

async function main() {
  const apply = process.env.APPLY_LEGACY_CONTENT_IMPORT === "1";
  const overwriteBody = process.env.LEGACY_IMPORT_OVERWRITE_BODY === "1";

  if (apply && !process.env.DATABASE_URL?.trim()) {
    console.error("[blog:import-legacy] APPLY_LEGACY_CONTENT_IMPORT=1 requires DATABASE_URL.");
    process.exit(1);
  }
  if (!process.env.DATABASE_URL?.trim()) {
    console.error("[blog:import-legacy] DATABASE_URL is required (even for dry-run: index load).");
    process.exit(1);
  }

  const doc = await loadExport();
  const summary = await importLegacyBlogPosts(prisma, doc, {
    apply,
    legacyImportOverwriteBody: overwriteBody,
  });

  console.log(
    JSON.stringify(
      {
        ok: true,
        apply,
        dryRun: !apply,
        legacyImportOverwriteBody: overwriteBody,
        summary,
      },
      null,
      2,
    ),
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
