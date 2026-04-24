#!/usr/bin/env npx tsx
/**
 * Audit legacy export vs current DB: pathway lessons + `exam_questions` + practice-test diagnostics.
 *
 *   cd nursenest-core && npm run legacy:audit-lessons-practice
 *
 * Inputs (first match wins):
 *   LEGACY_CONTENT_EXPORT_PATH or argv[2] — JSON export (version 2)
 *   LEGACY_SITE_BASE_URL — bounded lesson crawl (questions array will be empty unless export file used)
 *
 * Requires DATABASE_URL for DB-backed counts.
 */
import { readFileSync } from "node:fs";

import { PrismaClient } from "@prisma/client";

import "../../src/lib/db/script-env-bootstrap";
import { collectLegacyLessonsFromSite } from "../../src/lib/legacy/legacy-site-export-collector";
import { parseLegacyContentExportV2Json } from "../../src/lib/legacy/legacy-lessons-practice-types";
import { runLegacyLessonsPracticeAudit } from "../../src/lib/legacy/legacy-lessons-practice-pipeline";

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
    "[legacy:audit-lessons-practice] Provide LEGACY_CONTENT_EXPORT_PATH or argv[2] JSON path, or LEGACY_SITE_BASE_URL for lesson crawl.",
  );
  process.exit(2);
  return null as never;
}

async function main() {
  if (!process.env.DATABASE_URL?.trim()) {
    console.error("[legacy:audit-lessons-practice] DATABASE_URL is required.");
    process.exit(1);
  }
  const v2 = await loadV2();
  const audit = await runLegacyLessonsPracticeAudit(prisma, v2);
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
