#!/usr/bin/env npx tsx
/**
 * Legacy → current DB repair for pathway lessons + flashcard tag/deck links.
 *
 * **Dry-run by default.** Writes require:
 *   APPLY_LEGACY_PUBLIC_CONTENT_IMPORT=1
 *   DATABASE_URL
 *
 * Optional:
 *   LEGACY_IMPORT_OVERWRITE_BODY=1 — allow replacing `sections` JSON from export
 *   LEGACY_IMPORT_ALLOW_PATHWAY_CORRECTION=1 — allow `pathwayId` corrections when legacy disagrees
 *   LEGACY_IMPORT_CREATE_MISSING_LESSONS=1 — create missing rows (requires `sections` in export row)
 *
 *   cd nursenest-core && npm run legacy:import-public-content
 */
import { readFileSync } from "node:fs";

import { PrismaClient } from "@prisma/client";

import "../../src/lib/db/env-bootstrap";
import { collectLegacyLessonsFromSite } from "../../src/lib/legacy/legacy-site-export-collector";
import { parseLegacyPublicContentExportJson } from "../../src/lib/legacy/legacy-public-content-types";
import { runLegacyPublicContentImport } from "../../src/lib/legacy/legacy-public-content-pipeline";

const prisma = new PrismaClient();

async function loadPayload() {
  const exportPath =
    process.env.LEGACY_PUBLIC_CONTENT_EXPORT_PATH?.trim() || process.argv[2]?.trim();
  const base = process.env.LEGACY_SITE_BASE_URL?.trim();
  if (exportPath) {
    const text = readFileSync(exportPath, "utf8");
    return parseLegacyPublicContentExportJson(text);
  }
  if (base) {
    const crawled = await collectLegacyLessonsFromSite(base);
    if (crawled) return crawled;
  }
  console.error(
    "[legacy:import-public-content] Provide LEGACY_PUBLIC_CONTENT_EXPORT_PATH or argv[2] JSON path, or a crawlable LEGACY_SITE_BASE_URL.",
  );
  process.exit(2);
}

async function main() {
  if (!process.env.DATABASE_URL?.trim()) {
    console.error("[legacy:import-public-content] DATABASE_URL is required.");
    process.exit(1);
  }
  const apply = process.env.APPLY_LEGACY_PUBLIC_CONTENT_IMPORT?.trim() === "1";
  if (apply) {
    console.error("[legacy:import-public-content] APPLY mode — writing to DATABASE_URL");
  } else {
    console.log("[legacy:import-public-content] dry-run (set APPLY_LEGACY_PUBLIC_CONTENT_IMPORT=1 to write)");
  }

  const payload = await loadPayload();
  const result = await runLegacyPublicContentImport(prisma, payload, {
    apply,
    overwriteBody: process.env.LEGACY_IMPORT_OVERWRITE_BODY?.trim() === "1",
    allowPathwayCorrection: process.env.LEGACY_IMPORT_ALLOW_PATHWAY_CORRECTION?.trim() === "1",
    allowCreateMissingLessons: process.env.LEGACY_IMPORT_CREATE_MISSING_LESSONS?.trim() === "1",
  });

  console.log(
    JSON.stringify(
      {
        ok: result.errors.length === 0,
        dryRun: result.dryRun,
        changeCount: result.changes.length,
        errors: result.errors,
        audit: result.audit,
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
  .finally(() => prisma.$disconnect());
