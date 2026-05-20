#!/usr/bin/env npx tsx
/**
 * Post-import validation for batch-1 candidate legacy slugs (us-rn-nclex-rn).
 * Verifies rows exist and JSON sections are non-empty (read-only).
 */
import "../src/lib/db/env-bootstrap";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";
import {
  NN_LESSON_DB_PAYLOAD_V2,
  unwrapPathwayLessonDbSections,
} from "../src/lib/lessons/pathway-lesson-catalog-sync";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(__dirname, "..");
const PATHWAY_ID = "us-rn-nclex-rn";
const LOCALE = "en";

async function main() {
  const mapPath = path.join(APP_ROOT, "data/audit/rn-import-mapping-preview.json");
  const map = JSON.parse(fs.readFileSync(mapPath, "utf8")) as {
    rows: Array<{ originalId: string; slug: string; title: string }>;
  };
  const prisma = new PrismaClient();
  const results: Array<{
    legacySlug: string;
    usRnSlug: string;
    title: string;
    found: boolean;
    sectionCount: number;
    hasPrePost: boolean;
    ok: boolean;
    detail?: string;
  }> = [];

  for (const row of map.rows) {
    const legacySlug = row.originalId;
    const usRnSlug = row.slug;
    const title = row.title;

    const legacyRow = await prisma.pathwayLesson.findUnique({
      where: {
        pathwayId_slug_locale: { pathwayId: PATHWAY_ID, slug: legacySlug, locale: LOCALE },
      },
      select: { sections: true, title: true },
    });

    let found = !!legacyRow;
    let sectionCount = 0;
    let hasPrePost = false;
    let detail: string | undefined;

    if (legacyRow) {
      const u = unwrapPathwayLessonDbSections(legacyRow.sections);
      const list = Array.isArray(u.sectionList) ? u.sectionList : [];
      sectionCount = list.length;
      const raw = legacyRow.sections;
      hasPrePost =
        raw !== null &&
        typeof raw === "object" &&
        !Array.isArray(raw) &&
        (NN_LESSON_DB_PAYLOAD_V2 in (raw as object) ||
          ("preTest" in (raw as object) && !!(raw as { preTest?: unknown }).preTest) ||
          ("postTest" in (raw as object) && !!(raw as { postTest?: unknown }).postTest));
      if (sectionCount === 0) detail = "zero_sections_after_unwrap";
    } else {
      const usRow = await prisma.pathwayLesson.findUnique({
        where: {
          pathwayId_slug_locale: { pathwayId: PATHWAY_ID, slug: usRnSlug, locale: LOCALE },
        },
        select: { sections: true },
      });
      if (usRow) {
        found = true;
        const u = unwrapPathwayLessonDbSections(usRow.sections);
        sectionCount = Array.isArray(u.sectionList) ? u.sectionList.length : 0;
      } else {
        detail = "no_row_at_legacy_or_us_slug";
      }
    }

    results.push({
      legacySlug,
      usRnSlug,
      title,
      found,
      sectionCount,
      hasPrePost,
      ok: found && sectionCount > 0,
      detail,
    });
  }

  await prisma.$disconnect();

  const reportDir = path.join(APP_ROOT, "reports");
  fs.mkdirSync(reportDir, { recursive: true });
  const out = {
    generatedAt: new Date().toISOString(),
    pathwayId: PATHWAY_ID,
    summary: {
      checked: results.length,
      ok: results.filter((r) => r.ok).length,
      missingOrEmpty: results.filter((r) => !r.ok).length,
    },
    items: results,
  };
  fs.writeFileSync(path.join(reportDir, "rn-import-validation.json"), JSON.stringify(out, null, 2));
  console.log(JSON.stringify(out.summary, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
