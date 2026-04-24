#!/usr/bin/env npx tsx
/**
 * Legacy → current DB: pathway lessons (metadata/body rules) + `exam_questions` + optional flashcards from export.
 *
 * **Dry-run by default.** Writes require:
 *   APPLY_LEGACY_CONTENT_IMPORT=1
 *   DATABASE_URL
 *
 * Optional (same semantics as public-content lesson import):
 *   LEGACY_IMPORT_OVERWRITE_BODY=1
 *   LEGACY_IMPORT_OVERWRITE_RATIONALE=1 — allow replacing existing exam question rationales
 *   LEGACY_IMPORT_ALLOW_PATHWAY_CORRECTION=1
 *   LEGACY_IMPORT_CREATE_MISSING_LESSONS=1
 *
 * After import (operator checklist):
 *   npm run test:pathway-lessons
 *   npm run test:question-bank
 *   npm run test:legacy-public-content && npm run test:legacy-lessons-practice
 *   npx tsx --test src/lib/seo/public-flashcard-landing.contract.test.ts
 *   MARKETING_STUDY_SMOKE_BASE_URL=https://www.nursenest.ca MARKETING_STUDY_REQUIRE_PP_BLOG_LINKS=0 npx playwright test tests/e2e/public/marketing-study-surfaces-production-gate.spec.ts --project=chromium
 *
 *   cd nursenest-core && npm run legacy:import-lessons-practice
 */
import { readFileSync } from "node:fs";

import { PrismaClient } from "@prisma/client";

import "../../src/lib/db/env-bootstrap";
import { collectLegacyLessonsFromSite } from "../../src/lib/legacy/legacy-site-export-collector";
import { parseLegacyContentExportV2Json } from "../../src/lib/legacy/legacy-lessons-practice-types";
import { runLegacyLessonsPracticeImport } from "../../src/lib/legacy/legacy-lessons-practice-pipeline";

const prisma = new PrismaClient();

async function loadV2() {
  const exportPath = process.env.LEGACY_CONTENT_EXPORT_PATH?.trim() || process.argv[2]?.trim();
  const base = process.env.LEGACY_SITE_BASE_URL?.trim();
  if (exportPath) {
    const text = readFileSync(exportPath, "utf8");
    return parseLegacyContentExportV2Json(text);
  }
  if (base) {
    const crawled = await collectLegacyLessonsFromSite(base);
    if (crawled) {
      return {
        version: 2 as const,
        lessons: crawled.lessons ?? [],
        flashcards: crawled.flashcards ?? {},
        questions: [],
        practiceTests: [],
      };
    }
  }
  console.error(
    "[legacy:import-lessons-practice] Provide LEGACY_CONTENT_EXPORT_PATH or argv[2] JSON path, or LEGACY_SITE_BASE_URL.",
  );
  process.exit(2);
  return null as never;
}

async function main() {
  if (!process.env.DATABASE_URL?.trim()) {
    console.error("[legacy:import-lessons-practice] DATABASE_URL is required.");
    process.exit(1);
  }
  const apply = process.env.APPLY_LEGACY_CONTENT_IMPORT?.trim() === "1";
  if (apply) {
    console.error("[legacy:import-lessons-practice] APPLY mode — writing to DATABASE_URL");
  } else {
    console.log("[legacy:import-lessons-practice] dry-run (set APPLY_LEGACY_CONTENT_IMPORT=1 to write)");
  }

  const v2 = await loadV2();
  const result = await runLegacyLessonsPracticeImport(prisma, v2, {
    apply,
    overwriteBody: process.env.LEGACY_IMPORT_OVERWRITE_BODY?.trim() === "1",
    overwriteRationale: process.env.LEGACY_IMPORT_OVERWRITE_RATIONALE?.trim() === "1",
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
  .finally(async () => {
    await prisma.$disconnect();
  });
