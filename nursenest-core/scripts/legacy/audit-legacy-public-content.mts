#!/usr/bin/env npx tsx
/**
 * Report-only: compare legacy export (or bounded site crawl) against the current database.
 *
 *   cd nursenest-core && npm run legacy:audit-public-content
 *
 * Env:
 *   LEGACY_PUBLIC_CONTENT_EXPORT_PATH — JSON file (see `src/lib/legacy/legacy-public-content-types.ts`)
 *   LEGACY_SITE_BASE_URL — optional; when set and no export path, attempts bounded sitemap crawl
 */
import { readFileSync } from "node:fs";

import { PrismaClient } from "@prisma/client";

import "../../src/lib/db/script-env-bootstrap";
import { collectLegacyLessonsFromSite } from "../../src/lib/legacy/legacy-site-export-collector";
import { parseLegacyPublicContentExportJson } from "../../src/lib/legacy/legacy-public-content-types";
import { runLegacyPublicContentAudit } from "../../src/lib/legacy/legacy-public-content-pipeline";

const prisma = new PrismaClient();

async function loadPayload() {
  const exportPath = process.env.LEGACY_PUBLIC_CONTENT_EXPORT_PATH?.trim();
  const base = process.env.LEGACY_SITE_BASE_URL?.trim();
  if (exportPath) {
    const text = readFileSync(exportPath, "utf8");
    return parseLegacyPublicContentExportJson(text);
  }
  if (base) {
    const crawled = await collectLegacyLessonsFromSite(base);
    if (crawled) return crawled;
    console.error(
      "[legacy:audit-public-content] LEGACY_SITE_BASE_URL set but no lesson URLs collected. Provide LEGACY_PUBLIC_CONTENT_EXPORT_PATH JSON.",
    );
    process.exit(2);
  }
  console.error(
    "[legacy:audit-public-content] Set LEGACY_PUBLIC_CONTENT_EXPORT_PATH (JSON) and/or LEGACY_SITE_BASE_URL.",
  );
  process.exit(2);
}

async function main() {
  if (!process.env.DATABASE_URL?.trim()) {
    console.error("[legacy:audit-public-content] DATABASE_URL is required.");
    process.exit(1);
  }
  const payload = await loadPayload();
  const audit = await runLegacyPublicContentAudit(prisma, payload);
  console.log(JSON.stringify({ ok: true, audit }, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
