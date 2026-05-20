#!/usr/bin/env npx tsx
/**
 * Batch 1: map top-20 RN audit candidates → check catalog + DB (legacy slug + us-rn slug).
 * Only emits import rows when no PathwayLesson exists for the same pathway+logical lesson.
 *
 * If lessons were previously imported under legacy IDs (e.g. thyroid-storm-rn), we SKIP
 * creating us-rn-* duplicates (importer title-collision rules block that anyway).
 */
import "../src/lib/db/env-bootstrap";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";
import { contentMap } from "../../client/src/data/lessons/index";
import type { LessonContent } from "../../client/src/data/lessons/types";
import { convertLegacyLesson } from "./convert-legacy-lesson-to-enrichment";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(__dirname, "..");
const PATHWAY_ID = "us-rn-nclex-rn";
const LOCALE = "en";

type PreviewRow = {
  slug: string;
  originalId: string;
  pathwayId: string;
  country: string;
  action: "create" | "merge" | "skip";
  confidence: "high" | "medium" | "low";
  reason: string;
  catalogHit: boolean;
  dbLegacySlugExists: boolean | null;
  dbUsRnSlugExists: boolean | null;
  title: string;
};

function toUsRnSlug(normalizedKey: string, legacyId: string): string {
  let base = normalizedKey.replace(/-rn$/, "").replace(/-rpn$/, "").replace(/-rn-rn$/, "-rn");
  base = base.replace(/^-+|-+$/g, "");
  if (!base) base = legacyId.replace(/-rn$/, "").replace(/-rpn$/, "");
  return `us-rn-${base}`;
}

function loadCatalogSlugs(): Set<string> {
  const p = path.join(APP_ROOT, "data/materialized/rn-pn-replit-batch-2026/catalog-lessons.json");
  const out = new Set<string>();
  if (!fs.existsSync(p)) return out;
  const cat = JSON.parse(fs.readFileSync(p, "utf8")) as Record<string, { slug?: string }[]>;
  for (const k of Object.keys(cat)) {
    const arr = cat[k];
    if (!Array.isArray(arr)) continue;
    for (const row of arr) {
      if (row?.slug) out.add(row.slug);
    }
  }
  return out;
}

async function main() {
  const candidatesPath = path.join(APP_ROOT, "data/audit/high-value-import-candidates.json");
  const raw = JSON.parse(fs.readFileSync(candidatesPath, "utf8")) as {
    top20: Array<{ legacyLessonId: string; title: string; normalizedKey: string }>;
  };
  const top = raw.top20 ?? [];
  const catalogSlugs = loadCatalogSlugs();
  const prisma = new PrismaClient();

  const preview: PreviewRow[] = [];
  const importRows: Record<string, unknown>[] = [];
  const quarantine: Array<{ originalId: string; reason: string }> = [];

  for (const c of top) {
    const originalId = c.legacyLessonId;
    const usSlug = toUsRnSlug(c.normalizedKey, originalId);
    const lesson = contentMap[originalId] as LessonContent | undefined;
    const title = lesson?.title?.trim() || c.title;

    let dbLegacy: { slug: string } | null = null;
    let dbUs: { slug: string } | null = null;
    try {
      dbLegacy = await prisma.pathwayLesson.findUnique({
        where: {
          pathwayId_slug_locale: { pathwayId: PATHWAY_ID, slug: originalId, locale: LOCALE },
        },
        select: { slug: true },
      });
      dbUs = await prisma.pathwayLesson.findUnique({
        where: {
          pathwayId_slug_locale: { pathwayId: PATHWAY_ID, slug: usSlug, locale: LOCALE },
        },
        select: { slug: true },
      });
    } catch {
      dbLegacy = null;
      dbUs = null;
    }

    const catalogHit = catalogSlugs.has(usSlug) || catalogSlugs.has(originalId);
    const dbLegacySlugExists = !!dbLegacy;
    const dbUsRnSlugExists = !!dbUs;

    let action: PreviewRow["action"] = "create";
    let confidence: PreviewRow["confidence"] = "high";
    let reason =
      "No DB row at legacy slug or us-rn slug; not in catalog snapshot — eligible for controlled create.";

    if (dbLegacySlugExists || dbUsRnSlugExists) {
      action = "skip";
      confidence = "high";
      if (dbLegacySlugExists && !dbUsRnSlugExists) {
        reason =
          "PathwayLesson already exists under legacy slug; importer would duplicate title if us-rn slug added — skip (prefer no duplicate).";
      } else if (dbUsRnSlugExists) {
        reason = "PathwayLesson already exists under us-rn slug — skip.";
      } else {
        reason = "Existing DB row — skip.";
      }
    } else if (catalogHit) {
      action = "skip";
      reason = "Slug appears in materialized catalog JSON — treat as already materialized upstream.";
    }

    preview.push({
      slug: usSlug,
      originalId,
      pathwayId: PATHWAY_ID,
      country: "US",
      action,
      confidence,
      reason,
      catalogHit,
      dbLegacySlugExists,
      dbUsRnSlugExists,
      title,
    });

    if (action !== "create") continue;

    if (!lesson || !lesson.title) {
      quarantine.push({ originalId, reason: "missing_lesson_in_contentMap" });
      continue;
    }

    try {
      const enrichment = convertLegacyLesson({
        pathwayId: PATHWAY_ID,
        slug: usSlug,
        lesson,
      });
      const sections = enrichment.sections as object[];
      if (!Array.isArray(sections) || sections.length === 0) {
        quarantine.push({ originalId, reason: "empty_sections_after_convert" });
        continue;
      }

      const topic = title.split(":")[0]?.trim() || title;
      const topicSlug = usSlug.replace(/^us-rn-/, "");

      importRows.push({
        pathwayId: PATHWAY_ID,
        country: "US",
        track: "RN",
        slug: usSlug,
        title,
        topic,
        topicSlug,
        bodySystem: "General",
        previewSectionCount: Math.min(5, Math.max(2, sections.length >= 3 ? 3 : 2)),
        seoTitle: `${title} | NCLEX-RN US | NurseNest`,
        seoDescription: `${title} — imported legacy RN lesson (batch 1).`,
        sections,
        ...(enrichment.preTest ? { preTest: enrichment.preTest } : {}),
        ...(enrichment.postTest ? { postTest: enrichment.postTest } : {}),
      });
    } catch (e) {
      quarantine.push({
        originalId,
        reason: `convert_error:${e instanceof Error ? e.message : String(e)}`,
      });
    }
  }

  await prisma.$disconnect();

  const auditDir = path.join(APP_ROOT, "data/audit");
  fs.mkdirSync(auditDir, { recursive: true });
  fs.writeFileSync(
    path.join(auditDir, "rn-import-mapping-preview.json"),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        pathwayId: PATHWAY_ID,
        note:
          "merge = reserved for future enrichment-only flows; this importer creates or skips (no overwrite).",
        summary: {
          total: preview.length,
          create: preview.filter((p) => p.action === "create").length,
          skip: preview.filter((p) => p.action === "skip").length,
          merge: preview.filter((p) => p.action === "merge").length,
          importRowsBuilt: importRows.length,
          quarantined: quarantine.length,
        },
        rows: preview,
        quarantine,
      },
      null,
      2,
    ),
  );

  const stagingRoot = path.join(APP_ROOT, "data/import-staging/rn-batch-1");
  const lessonsDir = path.join(stagingRoot, "lessons");
  fs.mkdirSync(lessonsDir, { recursive: true });
  fs.writeFileSync(path.join(lessonsDir, "rn-high-yield-batch-1.json"), JSON.stringify(importRows, null, 2));

  console.log(
    JSON.stringify(
      {
        mappingPreview: path.join("data/audit", "rn-import-mapping-preview.json"),
        stagingFile: path.join("data/import-staging/rn-batch-1/lessons", "rn-high-yield-batch-1.json"),
        summary: {
          previewRows: preview.length,
          createActions: preview.filter((p) => p.action === "create").length,
          skipActions: preview.filter((p) => p.action === "skip").length,
          importJsonRows: importRows.length,
          quarantine: quarantine.length,
        },
      },
      null,
      2,
    ),
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
